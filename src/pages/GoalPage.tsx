import React, { useState, useEffect } from 'react';
import { useKronos } from '@/context/KronosContext';
import { deadlineParts, buildDeadlineISO, deadlineLeft } from '@/lib/time/ist';
import { MilestoneList } from '@/components/goals/MilestoneList';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';

export const GoalPage: React.FC = () => {
  const { state, todayStats, saveGoal } = useKronos();
  const parts = deadlineParts(state.goal.deadlineISO);

  const [name, setName] = useState(state.goal.name);
  const [target, setTarget] = useState(state.goal.target);
  const [type, setType] = useState(state.goal.type || 'Competitive Exam');
  const [deadlineDate, setDeadlineDate] = useState(parts.date);
  const [deadlineTime, setDeadlineTime] = useState(parts.time);
  const [dailyHours, setDailyHours] = useState(state.goal.dailyHours || 7.5);
  const [phase, setPhase] = useState(state.goal.phase || '');
  const [weakArea, setWeakArea] = useState(state.goal.weakArea || '');
  const [prepStrategy, setPrepStrategy] = useState(state.goal.prepStrategy || '');

  const [left, setLeft] = useState(() => deadlineLeft(state.goal.deadlineISO));

  useEffect(() => {
    const interval = setInterval(() => {
      setLeft(deadlineLeft(state.goal.deadlineISO));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.goal.deadlineISO]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveGoal({
      name,
      target,
      type,
      deadlineISO: buildDeadlineISO(deadlineDate, deadlineTime),
      dailyHours: Number(dailyHours),
      phase,
      weakArea,
      prepStrategy
    });
  };

  return (
    <div className="content-grid">
      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Main Target Architecture</h3>
            <p className="panel-subtitle">Exam countdown and risk levels calculated strictly using IST.</p>
          </div>
          <Badge tone="gold">{left.days} days {left.hours}h left</Badge>
        </div>

        <form onSubmit={handleSubmit} className="goal-form">
          <label>Goal title / Name
            <input value={name} onChange={e => setName(e.target.value)} required />
          </label>
          <div className="form-grid two">
            <label>Target score / Percentile
              <input value={target} onChange={e => setTarget(e.target.value)} required />
            </label>
            <label>Goal Type
              <input value={type} onChange={e => setType(e.target.value)} required />
            </label>
          </div>
          <div className="form-grid three">
            <label>Deadline date
              <input type="date" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} required />
            </label>
            <label>Deadline time IST
              <input type="time" value={deadlineTime} onChange={e => setDeadlineTime(e.target.value)} required />
            </label>
            <label>Daily target hours
              <input type="number" min="1" max="18" step="0.5" value={dailyHours} onChange={e => setDailyHours(Number(e.target.value))} required />
            </label>
          </div>
          <div className="form-grid two">
            <label>Current phase
              <input value={phase} onChange={e => setPhase(e.target.value)} />
            </label>
            <label>Weak area
              <input value={weakArea} onChange={e => setWeakArea(e.target.value)} />
            </label>
          </div>
          <label>Strategy & Execution Notes
            <textarea value={prepStrategy} onChange={e => setPrepStrategy(e.target.value)} placeholder="Strategy notes..." />
          </label>
          <Button variant="primary" type="submit">Save Architecture Updates</Button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Mission Health</h3>
            <p className="panel-subtitle">Current execution vs long-term target.</p>
          </div>
        </div>
        <ProgressRing progress={todayStats.completionScore} />
        <div style={{ height: '16px' }} />
        <div className="bars">
          <div className="bar-row"><span>Prep</span><div className="bar-track"><div className="bar-fill" style={{ width: `${state.goal.progress}%` }} /></div><strong>{state.goal.progress}%</strong></div>
          <div className="bar-row"><span>Daily</span><div className="bar-track"><div className="bar-fill" style={{ width: `${todayStats.completionScore}%` }} /></div><strong>{todayStats.completionScore}%</strong></div>
          <div className="bar-row"><span>Time</span><div className="bar-track"><div className="bar-fill" style={{ width: `${todayStats.timeScore}%` }} /></div><strong>{todayStats.timeScore}%</strong></div>
        </div>
      </section>

      <MilestoneList />
    </div>
  );
};
