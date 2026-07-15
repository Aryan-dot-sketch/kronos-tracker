import React, { useState, useEffect } from 'react';
import { useKronos } from '@/context/KronosContext';
import { deadlineLeft, deadlineText, todayId } from '@/lib/time/ist';
import { Badge } from '../ui/Badge';

export const MainMissionHero: React.FC = () => {
  const { state, todayStats } = useKronos();
  const [left, setLeft] = useState(() => deadlineLeft(state.goal.deadlineISO));

  useEffect(() => {
    const interval = setInterval(() => {
      setLeft(deadlineLeft(state.goal.deadlineISO));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.goal.deadlineISO]);

  const unresolvedBacklogCount = state.backlog.filter(b => b.status === 'unresolved').length;
  
  const risk: [string, 'green' | 'gold' | 'red'] =
    todayStats.completionScore >= 85 && todayStats.timeScore >= 80
      ? ['On Track', 'green']
      : todayStats.completionScore >= 65
      ? ['Medium Risk', 'gold']
      : ['High Risk', 'red'];

  return (
    <section className="hero-card">
      <div className="hero-topline">
        <Badge tone="gold">Primary Mission Control</Badge>
        <Badge tone={risk[1]}>{risk[0]}</Badge>
      </div>

      <h2>{state.goal.name}</h2>

      <p>
        Target: <strong>{state.goal.target}</strong>. Phase: {state.goal.phase}. Primary Weak Area: <strong>{state.goal.weakArea}</strong>.
      </p>

      <div className="hero-meta">
        <Badge tone="green">{left.days} days left</Badge>
        <Badge tone="gold">{deadlineText(state.goal.deadlineISO)}</Badge>
        <Badge tone="blue">{state.goal.progress}% prep progress</Badge>
        <Badge tone="default">Kronos Day: {todayId()}</Badge>
        {unresolvedBacklogCount > 0 && (
          <Badge tone="red">{unresolvedBacklogCount} recovery task{unresolvedBacklogCount > 1 ? 's' : ''} pending</Badge>
        )}
      </div>
    </section>
  );
};
