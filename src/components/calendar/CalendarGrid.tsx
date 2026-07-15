import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { istParts, addDays, todayId } from '@/lib/time/ist';
import { Button } from '../ui/Button';
import clsx from 'clsx';

export const CalendarGrid: React.FC = () => {
  const { state, openModal } = useKronos();

  const p = istParts();
  const monthOffset = state.ui.calendarMonthOffset || 0;
  const viewDate = new Date(Date.UTC(p.year, p.month - 1 + monthOffset, 1, 12));
  const year = viewDate.getUTCFullYear();
  const month = viewDate.getUTCMonth() + 1;
  
  const firstId = `${year}-${String(month).padStart(2, '0')}-01`;
  const startDay = new Date(Date.UTC(year, month - 1, 1, 12)).getUTCDay();
  const startId = addDays(firstId, -startDay);

  const monthLabel = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(viewDate);

  const handlePrev = () => {
    state.ui.calendarMonthOffset = monthOffset - 1;
  };
  const handleNext = () => {
    state.ui.calendarMonthOffset = monthOffset + 1;
  };
  const handleToday = () => {
    state.ui.calendarMonthOffset = 0;
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const cells = Array.from({ length: 42 }, (_, i) => {
    const dateId = addDays(startId, i);
    const [, cellMonth, cellDay] = dateId.split('-').map(Number);
    const h = state.history[dateId];
    const score = h?.completionScore || 0;
    const marker = score >= 90 ? 'Elite' : h?.success ? 'Success' : h ? 'Missed' : 'No Data';
    const isCurrentMonth = cellMonth === month;
    const isToday = dateId === todayId();

    return (
      <button
        key={dateId}
        className={clsx('calendar-day', !isCurrentMonth && 'muted-day', isToday && 'today')}
        onClick={() => openModal('dayDetail', dateId)}
      >
        <strong>{cellDay}</strong>
        <div className="calendar-score">{marker}{h ? ` • ${score}%` : ''}</div>
        <div className="bar-track" style={{ marginTop: '6px' }}>
          <div className="bar-fill" style={{ width: `${score}%` }} />
        </div>
      </button>
    );
  });

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h3>{monthLabel}</h3>
          <p className="panel-subtitle">
            Scores, streaks, and day status evaluated strictly in IST. Click any date tile for deep inspection.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" onClick={handlePrev}>← Prev</Button>
          <Button variant="ghost" onClick={handleToday}>Today</Button>
          <Button variant="ghost" onClick={handleNext}>Next →</Button>
        </div>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-head">{day}</div>
        ))}
        {cells}
      </div>
    </section>
  );
};
