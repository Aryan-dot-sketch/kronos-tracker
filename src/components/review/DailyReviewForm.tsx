import React, { useState, useEffect } from 'react';
import { useKronos } from '@/context/KronosContext';
import { todayId, TZ } from '@/lib/time/ist';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const DailyReviewForm: React.FC = () => {
  const { state, todayStats, saveDailyReview } = useKronos();
  const today = todayId();
  const existingReview = state.reviews[today] || {};

  const [wentWell, setWentWell] = useState('');
  const [wentWrong, setWentWrong] = useState('');
  const [distraction, setDistraction] = useState('');
  const [learned, setLearned] = useState('');
  const [tomorrowPriority, setTomorrowPriority] = useState('');
  const [sleepTarget, setSleepTarget] = useState('23:30');
  const [energy, setEnergy] = useState('Medium');
  const [mood, setMood] = useState('Focused');

  useEffect(() => {
    setWentWell(existingReview.wentWell || '');
    setWentWrong(existingReview.wentWrong || '');
    setDistraction(existingReview.distraction || '');
    setLearned(existingReview.learned || '');
    setTomorrowPriority(existingReview.tomorrowPriority || '');
    setSleepTarget(existingReview.sleepTarget || '23:30');
    setEnergy(existingReview.energy || 'Medium');
    setMood(existingReview.mood || 'Focused');
  }, [existingReview.savedAt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyReview({
      wentWell,
      wentWrong,
      distraction,
      learned,
      tomorrowPriority,
      sleepTarget,
      energy,
      mood
    });
  };

  return (
    <div className="content-grid">
      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Night Reflection & Closing Review</h3>
            <p className="panel-subtitle">Save daily reflection before the IST midnight cutoff.</p>
          </div>
          <Badge tone="gold">IST Date: {today}</Badge>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <label>What went well today?
            <textarea value={wentWell} onChange={e => setWentWell(e.target.value)} placeholder="Completed Physics PYQs with high focus..." />
          </label>
          <label>What went wrong or got missed?
            <textarea value={wentWrong} onChange={e => setWentWrong(e.target.value)} placeholder="Maths practice got delayed due to afternoon fatigue..." />
          </label>
          <label>What distracted me?
            <textarea value={distraction} onChange={e => setDistraction(e.target.value)} placeholder="Social media notifications, overthinking..." />
          </label>
          <label>What main lesson did I learn today?
            <textarea value={learned} onChange={e => setLearned(e.target.value)} placeholder="Clear phone from study area before starting problem solving block." />
          </label>
          <div className="form-grid two">
            <label>Tomorrow’s top priority mission
              <input value={tomorrowPriority} onChange={e => setTomorrowPriority(e.target.value)} placeholder="Physics Electrostatics PYQs first thing in the morning" />
            </label>
            <label>Target Sleep Time IST
              <input type="time" value={sleepTarget} onChange={e => setSleepTarget(e.target.value)} />
            </label>
          </div>
          <div className="form-grid two">
            <label>Energy Level
              <select value={energy} onChange={e => setEnergy(e.target.value)}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Elite</option>
              </select>
            </label>
            <label>Mood State
              <select value={mood} onChange={e => setMood(e.target.value)}>
                <option>Tired</option>
                <option>Calm</option>
                <option>Focused</option>
                <option>Intense</option>
              </select>
            </label>
          </div>
          <Button variant="primary" type="submit">Save Night Review with IST Stamp</Button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Today Execution Summary</h3>
            <p className="panel-subtitle">Auto-evaluated from today's checklist and study logs.</p>
          </div>
        </div>

        <div className="bars">
          <div className="bar-row"><span>Completion</span><div className="bar-track"><div className="bar-fill" style={{ width: `${todayStats.completionScore}%` }} /></div><strong>{todayStats.completionScore}%</strong></div>
          <div className="bar-row"><span>Time</span><div className="bar-track"><div className="bar-fill" style={{ width: `${todayStats.timeScore}%` }} /></div><strong>{todayStats.timeScore}%</strong></div>
          <div className="bar-row"><span>Focus</span><div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, todayStats.focusScore)}%` }} /></div><strong>{Math.min(100, todayStats.focusScore)}</strong></div>
        </div>

        <div style={{ height: '16px' }} />
        {existingReview.savedAt ? (
          <Badge tone="green">
            Saved at {new Intl.DateTimeFormat('en-IN', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(existingReview.savedAt))} IST
          </Badge>
        ) : (
          <Badge tone="red">Review Pending for Today</Badge>
        )}
      </section>
    </div>
  );
};
