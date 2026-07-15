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
    if (existingReview.savedAt) {
      setWentWell(existingReview.wentWell || '');
      setWentWrong(existingReview.wentWrong || '');
      setDistraction(existingReview.distraction || '');
      setLearned(existingReview.learned || '');
      setTomorrowPriority(existingReview.tomorrowPriority || '');
      setSleepTarget(existingReview.sleepTarget || '23:30');
      setEnergy(existingReview.energy || 'Medium');
      setMood(existingReview.mood || 'Focused');
    }
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
    <div className="review-layout">
      {/* Main Review Form */}
      <section className="panel premium-review-panel">
        <div className="panel-header">
          <div>
            <h3>Night Reflection &amp; Closing Review</h3>
            <p className="panel-subtitle">Save your daily reflection before IST midnight cutoff.</p>
          </div>
          <Badge tone="gold">IST • {today}</Badge>
        </div>

        <form onSubmit={handleSubmit} className="review-form premium-review-form">
          <div className="review-field">
            <label>What went well today?</label>
            <textarea 
              value={wentWell} 
              onChange={e => setWentWell(e.target.value)} 
              placeholder="Completed Physics PYQs with high focus..." 
              rows={3}
            />
          </div>

          <div className="review-field">
            <label>What went wrong or got missed?</label>
            <textarea 
              value={wentWrong} 
              onChange={e => setWentWrong(e.target.value)} 
              placeholder="Maths practice got delayed due to afternoon fatigue..." 
              rows={3}
            />
          </div>

          <div className="review-field">
            <label>What distracted me?</label>
            <textarea 
              value={distraction} 
              onChange={e => setDistraction(e.target.value)} 
              placeholder="Social media notifications, overthinking..." 
              rows={2}
            />
          </div>

          <div className="review-field">
            <label>What main lesson did I learn today?</label>
            <textarea 
              value={learned} 
              onChange={e => setLearned(e.target.value)} 
              placeholder="Clear phone from study area before starting problem solving." 
              rows={2}
            />
          </div>

          <div className="form-grid two">
            <div className="review-field">
              <label>Tomorrow’s top priority mission</label>
              <input 
                value={tomorrowPriority} 
                onChange={e => setTomorrowPriority(e.target.value)} 
                placeholder="Physics Electrostatics PYQs" 
              />
            </div>
            <div className="review-field">
              <label>Target Sleep Time IST</label>
              <input 
                type="time" 
                value={sleepTarget} 
                onChange={e => setSleepTarget(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-grid two">
            <div className="review-field">
              <label>Energy Level</label>
              <select value={energy} onChange={e => setEnergy(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Elite">Elite</option>
              </select>
            </div>
            <div className="review-field">
              <label>Mood State</label>
              <select value={mood} onChange={e => setMood(e.target.value)}>
                <option value="Tired">Tired</option>
                <option value="Calm">Calm</option>
                <option value="Focused">Focused</option>
                <option value="Intense">Intense</option>
              </select>
            </div>
          </div>

          <div className="review-actions">
            <Button variant="primary" type="submit" size="lg">
              Save Night Review with IST Stamp
            </Button>
          </div>
        </form>
      </section>

      {/* Execution Summary Sidebar */}
      <section className="panel premium-review-summary">
        <div className="panel-header">
          <div>
            <h3>Today Execution Summary</h3>
            <p className="panel-subtitle">Auto-evaluated from today's tasks and study logs.</p>
          </div>
        </div>

        <div className="review-bars">
          <div className="bar-row">
            <span>Completion</span>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${todayStats.completionScore}%` }} /></div>
            <strong>{todayStats.completionScore}%</strong>
          </div>
          <div className="bar-row">
            <span>Time</span>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${todayStats.timeScore}%` }} /></div>
            <strong>{todayStats.timeScore}%</strong>
          </div>
          <div className="bar-row">
            <span>Focus</span>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, todayStats.focusScore)}%` }} /></div>
            <strong>{Math.min(100, todayStats.focusScore)}</strong>
          </div>
        </div>

        <div className="review-status">
          {existingReview.savedAt ? (
            <Badge tone="green">
              Saved {new Intl.DateTimeFormat('en-IN', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(existingReview.savedAt))} IST
            </Badge>
          ) : (
            <Badge tone="red">Review Pending for Today</Badge>
          )}
        </div>
      </section>
    </div>
  );
};
