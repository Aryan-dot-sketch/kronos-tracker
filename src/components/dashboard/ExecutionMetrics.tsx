import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { formatMinutes } from '@/lib/time/ist';
import { Badge } from '../ui/Badge';

export const ExecutionMetrics: React.FC = () => {
  const { todayStats, currentStreaks } = useKronos();

  return (
    <>
      <article className="metric-card">
        <span className="metric-label">Today’s Execution</span>
        <strong>{todayStats.completionScore}%</strong>
        <small>
          <Badge tone="green">{todayStats.completedTasks}/{todayStats.totalTasks} tasks complete</Badge>
        </small>
      </article>

      <article className="metric-card">
        <span className="metric-label">Current Streak</span>
        <strong>{currentStreaks.current}d</strong>
        <small>
          <Badge tone="gold">Longest: {currentStreaks.longest} days</Badge>
        </small>
      </article>

      <article className="metric-card">
        <span className="metric-label">Study Time</span>
        <strong>{formatMinutes(todayStats.studyMinutes)}</strong>
        <small>
          <Badge tone="blue">Target: {formatMinutes(todayStats.plannedMinutes)}</Badge>
        </small>
      </article>

      <article className="metric-card">
        <span className="metric-label">Focus Score</span>
        <strong>{todayStats.focusScore}</strong>
        <small>
          <Badge tone={todayStats.criticalDone ? 'green' : 'red'}>
            {todayStats.criticalDone ? 'Critical tasks protected' : 'Critical pending'}
          </Badge>
        </small>
      </article>
    </>
  );
};
