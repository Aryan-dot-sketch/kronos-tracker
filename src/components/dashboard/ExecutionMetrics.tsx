import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { formatMinutes } from '@/lib/time/ist';
import { Badge } from '../ui/Badge';

export const ExecutionMetrics: React.FC = () => {
  const { todayStats, currentStreaks } = useKronos();

  return (
    <div className="metric-grid">
      <article className="metric-card">
        <span className="metric-label">Today’s Execution</span>
        <strong className="metric-value">{todayStats.completionScore}%</strong>
        <small>
          <Badge tone="green">{todayStats.completedTasks}/{todayStats.totalTasks} tasks complete</Badge>
        </small>
      </article>

      <article className="metric-card">
        <span className="metric-label">Current Streak</span>
        <strong className="metric-value">{currentStreaks.current}d</strong>
        <small>
          <Badge tone="gold">Longest: {currentStreaks.longest} days</Badge>
        </small>
      </article>

      <article className="metric-card">
        <span className="metric-label">Study Time</span>
        <strong className="metric-value">{formatMinutes(todayStats.studyMinutes)}</strong>
        <small>
          <Badge tone="blue">Target: {formatMinutes(todayStats.plannedMinutes)}</Badge>
        </small>
      </article>

      <article className="metric-card">
        <span className="metric-label">Focus Score</span>
        <strong className="metric-value">{todayStats.focusScore}</strong>
        <small>
          <Badge tone={todayStats.criticalDone ? 'green' : 'red'}>
            {todayStats.criticalDone ? 'Critical tasks protected' : 'Critical pending'}
          </Badge>
        </small>
      </article>
    </div>
  );
};
