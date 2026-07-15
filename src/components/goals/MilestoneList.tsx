import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import clsx from 'clsx';

export const MilestoneList: React.FC = () => {
  const {
    state,
    openModal,
    toggleMilestone,
    deleteMilestone,
    toggleWeeklyTarget,
    deleteWeeklyTarget
  } = useKronos();

  const milestones = state.goal.milestones || [];
  const weeklyTargets = state.goal.weeklyTargets || [];

  return (
    <>
      {/* Monthly Milestones Section */}
      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Monthly Milestones</h3>
            <p className="panel-subtitle">Major phase checkpoints leading up to exam day.</p>
          </div>
          <Button variant="ghost" onClick={() => openModal('milestone')}>
            + Add Milestone
          </Button>
        </div>

        <div className="task-list">
          {milestones.length === 0 ? (
            <div className="empty-state">
              <strong>No milestones created</strong>
              Add monthly checkpoints to structure your preparation roadmap.
            </div>
          ) : (
            milestones.map(m => (
              <div key={m.id} className={clsx('task-row', m.completed && 'completed')}>
                <button
                  className="check-button"
                  onClick={() => toggleMilestone(m.id)}
                  aria-label="Toggle milestone"
                >
                  ✓
                </button>
                <div>
                  <div className="task-title">{m.title}</div>
                  <div className="task-meta">
                    <Badge tone="gold">{m.category}</Badge>
                    <span>Target Date: {m.targetDate}</span>
                  </div>
                </div>
                <Button variant="tiny" onClick={() => deleteMilestone(m.id)}>
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Weekly Targets Section */}
      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Weekly Target Blocks</h3>
            <p className="panel-subtitle">7-day performance targets and question quotas.</p>
          </div>
        </div>

        <div className="task-list">
          {weeklyTargets.length === 0 ? (
            <div className="empty-state">
              <strong>No weekly targets set</strong>
              Set 7-day quota blocks to keep daily execution disciplined.
            </div>
          ) : (
            weeklyTargets.map(w => (
              <div key={w.id} className={clsx('task-row', w.completed && 'completed')}>
                <button
                  className="check-button"
                  onClick={() => toggleWeeklyTarget(w.id)}
                  aria-label="Toggle weekly target"
                >
                  ✓
                </button>
                <div>
                  <div className="task-title">{w.title}</div>
                  <div className="task-meta">
                    <span>Target Hours: {w.targetHours}h</span>
                  </div>
                </div>
                <Button variant="tiny" onClick={() => deleteWeeklyTarget(w.id)}>
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};
