import React, { useState, useEffect } from 'react';
import { useKronos } from '@/context/KronosContext';
import { istDateText, istParts, todayId } from '@/lib/time/ist';
import { ViewType } from '@/types';
import { Plus, Edit3, User, Palette } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';

const VIEW_TITLES: Record<ViewType, [string, string]> = {
  dashboard: ['Premium Daily Execution', 'Dashboard'],
  today: ['Today’s IST Mission', 'Today'],
  goal: ['Main Target Architecture', 'Main Goal'],
  calendar: ['Consistency Over Time', 'Calendar'],
  analytics: ['Performance Intelligence', 'Analytics'],
  jee: ['Syllabus & Module Mastery', 'Syllabus Tracker'],
  review: ['Night Reflection System', 'Daily Review'],
  settings: ['Kronos Control Room', 'Settings']
};

export const Topbar: React.FC = () => {
  const { activeView, state, toggleTheme, openModal } = useKronos();
  const [clockText, setClockText] = useState(() => istParts().timeText);

  useEffect(() => {
    const interval = setInterval(() => {
      setClockText(istParts().timeText);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [eyebrow, title] = VIEW_TITLES[activeView] || VIEW_TITLES.dashboard;

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>

      <div className="top-actions">
        <Button variant="chip" onClick={() => openModal('auth')}>
          <User size={15} style={{ verticalAlign: '-2px', marginRight: '6px' }} />
          {state.settings.name || 'Account'}
        </Button>

        <Button variant="ghost" onClick={() => openModal('goal')}>
          <Edit3 size={15} style={{ verticalAlign: '-2px', marginRight: '6px' }} />
          Edit Goal
        </Button>

        <Button variant="primary" onClick={() => openModal('task')}>
          <Plus size={15} style={{ verticalAlign: '-2px', marginRight: '6px' }} />
          Add Task
        </Button>

        {/* Premium Theme Switcher */}
        <div className="flex items-center gap-2 pl-1 border-l border-[var(--border-line)]">
          <Palette size={15} className="text-[var(--text-muted)]" />
          <ThemeSwitcher compact={true} />
        </div>

        <div className="ist-pill" aria-live="polite">
          <span>{istDateText()} • Day {todayId()}</span>
          <strong>{clockText}</strong>
        </div>
      </div>
    </header>
  );
};
