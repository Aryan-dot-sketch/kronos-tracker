import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { istDateText, istParts, nextISTResetMs, formatDuration, formatMinutes, deadlineLeft, todayId } from '@/lib/time/ist';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { X, ChevronLeft } from 'lucide-react';

interface RightInsightPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

export const RightInsightPanel: React.FC<RightInsightPanelProps> = ({ 
  isOpen = true, 
  onClose, 
  isMobileDrawer = false 
}) => {
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

  React.useEffect(() => {
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

  const content = (
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
        <h3>Focus Timer</h3>
        <label style={{ marginBottom: '8px' }}>
          Subject
          <select value={focusTimer.subject} onChange={e => setTimerSubject(e.target.value)}>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            <option value="Revision">Revision</option>
            <option value="Mock Test">Mock Test</option>
            <option value="General">General</option>
          </select>
        </label>

        <div className="timer-display">
          <strong>{timerDisplayStr}</strong>
          <Badge tone="green">{formatMinutes(todayStats.studyMinutes)} logged</Badge>
        </div>

        <div className="timer-buttons">
          <Button variant="ghost" onClick={() => startTimer()}>
            {focusTimer.running && focusTimer.mode === 'stopwatch' ? 'Pause' : 'Start'}
          </Button>
          <Button variant="ghost" onClick={() => startPomodoro()}>25m</Button>
          <Button variant="ghost" onClick={() => finishTimer()}>Finish</Button>
          <Button variant="ghost" onClick={() => addQuickTime(25)}>+25m</Button>
        </div>
      </section>

      <section className="side-card">
        <h3>Deadline</h3>
        <div className="countdown-stack">
          <div className="count-box"><strong>{left.days}</strong><span>Days</span></div>
          <div className="count-box"><strong>{left.hours}</strong><span>Hours</span></div>
          <div className="count-box"><strong>{left.minutes}</strong><span>Mins</span></div>
        </div>
      </section>

      <section className="side-card">
        <h3>Streaks</h3>
        <div className="countdown-stack">
          <div className="count-box"><strong>{currentStreaks.current}d</strong><span>Current</span></div>
          <div className="count-box"><strong>{currentStreaks.longest}d</strong><span>Longest</span></div>
          <div className="count-box"><strong>{todayStats.completionScore}%</strong><span>Score</span></div>
        </div>
      </section>

      <section className="side-card">
        <h3>Insight</h3>
        <p className="panel-subtitle">
          {missedYesterday
            ? 'Yesterday was below threshold. Today is your comeback day.'
            : todayStats.criticalDone
            ? 'All critical tasks protected! Elite day incoming.'
            : 'Critical task pending. Finish it first.'}
        </p>
      </section>
    </div>
  );

  if (isMobileDrawer) {
    return (
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <span>Live Insights</span>
          <button onClick={onClose} className="icon-button"><X size={18} /></button>
        </div>
        <div className="mobile-drawer-content">
          {content}
        </div>
      </div>
    );
  }

  return (
    <aside className="insight-panel" aria-label="Kronos time and insights">
      {content}
    </aside>
  );
};