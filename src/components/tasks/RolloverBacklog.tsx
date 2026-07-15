import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { formatMinutes } from '@/lib/time/ist';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import clsx from 'clsx';

export const RolloverBacklog: React.FC = () => {
  const { state, moveBacklog, skipBacklog } = useKronos();

  const unresolved = state.backlog.filter(b => b.status === 'unresolved');
  if (!unresolved.length) return null;

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h3>Missed Task Recovery Backlog</h3>
          <p className="panel-subtitle">Tasks missed after IST day close. Rollover without guilt.</p>
        </div>
        <Badge tone="red">{unresolved.length} unresolved</Badge>
      </div>

      <div className="task-list">
        {unresolved.map(item => (
          <div key={item.id} className="task-row">
            <span className="nav-icon">↺</span>
            <div>
              <div className="task-title">{item.title}</div>
              <div className="task-meta">
                <span className={clsx('priority-pill', `priority-${item.priority}`)}>
                  {item.priority}
                </span>
                <span>Missed: {item.sourceDate}</span>
                <span>{item.subject}</span>
                <span>{formatMinutes(item.estimate)}</span>
              </div>
            </div>
            <div className="task-actions">
              <Button variant="tiny" onClick={() => moveBacklog(item.id, false)}>Move</Button>
              <Button variant="tiny" onClick={() => moveBacklog(item.id, true)}>Split</Button>
              <Button variant="tiny" onClick={() => skipBacklog(item.id)}>Skip</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
