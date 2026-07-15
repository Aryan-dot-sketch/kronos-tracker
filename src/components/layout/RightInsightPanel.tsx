import React, { useState, useEffect } from 'react';
import { useKronos } from '@/context/KronosContext';
import { istDateText, istParts, nextISTResetMs, formatDuration, formatMinutes, deadlineLeft, todayId } from '@/lib/time/ist';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const RightInsightPanel: React.FC = () => {
  const {
    state,
    todayStats,
    currentStreaks,
    focusTimer,
    startTimer,
    startPomodoro,
    finishTimer,
    addQuickTime,
    setTimerSubject
  } = useKronos();

  const subjects = state.goal.subjects && state.goal.subjects.length > 0
    ? state.goal.subjects
    : ['Physics', 'Chemistry', 'Mathematics'];

  const [resetMs, setResetMs] = useState(() => nextISTResetMs() - Date.now());
  const [clockText, setClockText] = useState(() => istParts().timeText.replace(' IST', ''));
  const [left, setLeft] = useState(() => deadlineLeft(state.goal.deadlineISO));

  useEffect(() => {
    const interval = setInterval(() => {
      setResetMs(nextISTResetMs() - Date.now());
      setClockText(istParts().timeText.replace(' IST', ''));
      setLeft(deadlineLeft(state.goal.deadlineISO));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.goal.deadlineISO]);

  const elapsed = focusTimer.elapsed + (focusTimer.running ? Date.now() - focusTimer.startedAt : 0);
  const timerDisplayStr = focusTimer.mode === 'pomodoro'
    ? formatDuration(focusTimer.pomodoroMs - elapsed)
    : formatDuration(elapsed);

  const missedYesterday = state.history[todayId()] && !state.history[todayId()].success;

  return (
    <aside className="insight-panel" aria-label="Kronos time and insights">
      <div className="side-stack">
        <section className="kronos-clock">
          <p className="eyebrow" style={{ color: 'rgba(255,248,234,0.75)' }}>Live IST Clock</p>
          <div className="clock-time">{clockText}</div>
          <div className="clock-date">{istDateText()} • IST</div>
        </section>

        <section className="side-card">
          <h3>Today Closes In</h3>
          <div className="side-number">{formatDuration(resetMs, true)}</div>
          <p className="panel-subtitle" style={{ marginTop: '6px' }}>
            Strict Midnight Reset. Kronos Day: <strong>{todayId()}</strong>
          </p>
        </section>

        <section className="side-card">
          <h3>Stopwatch & Pomodoro Timer</h3>
          <label style={{ marginBottom: '8px' }}>
            Subject / Module Focus
            <select value={focusTimer.subject} onChange={e => setTimerSubject(e.target.value)}>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="Revision">Revision</option>
              <option value="Mock Test">Mock Test</option>
              <option value="General">General</option>
            </select>
          </label>

          <div className="timer-display">
            <strong>{timerDisplayStr}</strong>
            <Badge tone="green">{formatMinutes(todayStats.studyMinutes)} logged today</Badge>
          </div>

          <div className="timer-buttons">
            <Button variant="ghost" onClick={() => startTimer()}>
              {focusTimer.running && focusTimer.mode === 'stopwatch' ? 'Pause' : 'Start'}
            </Button>
            <Button variant="ghost" onClick={() => startPomodoro()}>
              Pomodoro 25
            </Button>
            <Button variant="ghost" onClick={() => finishTimer()}>
              Finish Session
            </Button>
            <Button variant="ghost" onClick={() => addQuickTime(25)}>
              +25m Quick
            </Button>
          </div>
        </section>

        <section className="side-card">
          <h3>Target Deadline Countdown</h3>
          <div className="countdown-stack">
            <div className="count-box"><strong>{left.days}</strong><span>Days</span></div>
            <div className="count-box"><strong>{left.hours}</strong><span>Hours</span></div>
            <div className="count-box"><strong>{left.minutes}</strong><span>Mins</span></div>
          </div>
          <div style={{ marginTop: '8px', textAlign: 'center', fontSize: '12px', color: 'var(--muted)', fontWeight: 700 }}>
            {left.seconds} seconds remaining
          </div>
        </section>

        <section className="side-card">
          <h3>Streaks & Performance</h3>
          <div className="countdown-stack">
            <div className="count-box"><strong>{currentStreaks.current}d</strong><span>Current</span></div>
            <div className="count-box"><strong>{currentStreaks.longest}d</strong><span>Longest</span></div>
            <div className="count-box"><strong>{todayStats.completionScore}%</strong><span>Score</span></div>
          </div>
        </section>

        <section className="side-card">
          <h3>Daily Coaching Insight</h3>
          <p className="panel-subtitle">
            {missedYesterday
              ? 'Yesterday was below threshold. Today is your comeback day.'
              : todayStats.criticalDone
              ? 'All critical tasks protected! Push toward an elite day.'
              : 'Critical priority task pending. Finish it first to protect streak.'}
          </p>
        </section>
      </div>
    </aside>
  );
};
