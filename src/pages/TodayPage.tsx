import React, { useState, useEffect } from 'react';
import { useKronos } from '@/context/KronosContext';
import { todayId, formatMinutes, nextISTResetMs, formatDuration, titleCase } from '@/lib/time/ist';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { RolloverBacklog } from '@/components/tasks/RolloverBacklog';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Button } from '@/components/ui/Button';

const PRIORITIES = ['critical', 'high', 'medium', 'low'];

export const TodayPage: React.FC = () => {
  const { state, todayStats, searchQuery, openModal, setActiveView } = useKronos();
  const [resetMs, setResetMs] = useState(() => nextISTResetMs() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setResetMs(nextISTResetMs() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayTasks = state.tasksByDate[todayId()] || [];
  const statusFilter = state.ui.taskStatusFilter || 'all';
  const priorityFilter = state.ui.taskPriorityFilter || 'all';
  const query = searchQuery.trim().toLowerCase();

  const filtered = todayTasks.filter(t => {
    const statusMatch =
      statusFilter === 'all' ||
      (statusFilter === 'pending' ? t.status !== 'completed' && t.status !== 'skipped' && t.status !== 'missed' : t.status === statusFilter);
    const priorityMatch = priorityFilter === 'all' || t.priority === priorityFilter;
    const queryMatch =
      !query ||
      t.title.toLowerCase().includes(query) ||
      t.subject.toLowerCase().includes(query) ||
      (t.notes || '').toLowerCase().includes(query);
    return statusMatch && priorityMatch && queryMatch;
  });

  const groups = PRIORITIES.map(priority => {
    const list = filtered.filter(t => t.priority === priority);
    if (!list.length) return null;
    return (
      <section key={priority} className="panel">
        <div className="panel-header">
          <div>
            <h3>{titleCase(priority)} Priority</h3>
            <p className="panel-subtitle">{list.length} mission task{list.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="task-list">
          {list.map(t => <TaskCard key={t.id} task={t} />)}
        </div>
      </section>
    );
  });

  return (
    <>
      <div className="stat-grid" style={{ marginBottom: '16px' }}>
        <article className="mini-stat"><span>Completion</span><strong>{todayStats.completionScore}%</strong></article>
        <article className="mini-stat"><span>Tasks Done</span><strong>{todayStats.completedTasks}/{todayStats.totalTasks}</strong></article>
        <article className="mini-stat"><span>Study Time</span><strong>{formatMinutes(todayStats.studyMinutes)}</strong></article>
        <article className="mini-stat"><span>Day Reset In</span><strong>{formatDuration(resetMs, true)}</strong></article>
      </div>

      <div className="content-grid">
        <div style={{ display: 'grid', gap: '16px' }}>
          <section className="panel">
            <div className="panel-header">
              <div>
                <h3>Mission Filters & Search</h3>
                <p className="panel-subtitle">Filter daily tasks by title, status, or priority level.</p>
              </div>
            </div>
            <TaskFilters />
          </section>

          <RolloverBacklog />

          {groups.some(Boolean) ? groups : (
            <div className="empty-state">
              <strong>No tasks match current criteria</strong>
              Try clearing filters or add a new task.
            </div>
          )}
        </div>

        <aside className="panel">
          <div className="panel-header">
            <div>
              <h3>Daily Mission Control</h3>
              <p className="panel-subtitle">Protect critical work before IST midnight reset.</p>
            </div>
          </div>

          <div className="bars">
            <div className="bar-row"><span>Completion</span><div className="bar-track"><div className="bar-fill" style={{ width: `${todayStats.completionScore}%` }} /></div><strong>{todayStats.completionScore}%</strong></div>
            <div className="bar-row"><span>Time</span><div className="bar-track"><div className="bar-fill" style={{ width: `${todayStats.timeScore}%` }} /></div><strong>{todayStats.timeScore}%</strong></div>
            <div className="bar-row"><span>Focus</span><div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, todayStats.focusScore)}%` }} /></div><strong>{Math.min(100, todayStats.focusScore)}</strong></div>
          </div>

          <div style={{ height: '16px' }} />
          <Button variant="primary" style={{ width: '100%' }} onClick={() => openModal('task')}>
            + Add Mission Task
          </Button>
          <div style={{ height: '10px' }} />
          <Button variant="ghost" style={{ width: '100%' }} onClick={() => setActiveView('review')}>
            Open Night Reflection
          </Button>
        </aside>
      </div>
    </>
  );
};
