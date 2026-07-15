import React, { useState, useEffect } from 'react';
import { useKronos } from '@/context/KronosContext';
import { istDateText, istParts, todayId } from '@/lib/time/ist';
import { ViewType } from '@/types';
import { Plus, Edit3, User, Palette, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { motion } from 'framer-motion';

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
  const { activeView, state, openModal } = useKronos();
  const [clockText, setClockText] = useState(() => istParts().timeText);

  useEffect(() => {
    const interval = setInterval(() => {
      setClockText(istParts().timeText);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [eyebrow, title] = VIEW_TITLES[activeView] || VIEW_TITLES.dashboard;

  return (
    <header className="topbar premium-topbar">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>

      <div className="top-actions premium-actions">
        {/* Account — Premium pill */}
        <Button 
          variant="chip" 
          onClick={() => openModal('auth')}
          leftIcon={<User size={15} />}
        >
          {state.settings.name || 'Account'}
        </Button>

        <Button 
          variant="ghost" 
          onClick={() => openModal('goal')}
          leftIcon={<Edit3 size={15} />}
        >
          Edit Goal
        </Button>

        {/* Primary CTA — Add Task */}
        <Button 
          variant="primary" 
          onClick={() => openModal('task')}
          leftIcon={<Plus size={17} />}
          size="md"
        >
          Add Task
        </Button>

        {/* Premium Theme Switcher */}
        <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-line)]">
          <Palette size={15} className="text-[var(--text-muted)]" />
          <ThemeSwitcher compact={true} />
        </div>

        {/* Install / Insights */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            if (window.innerWidth < 768) {
              window.dispatchEvent(new CustomEvent('toggle-kronos-insights'));
            } else {
              const installBtn = document.querySelector('.pwa-install-banner button');
              if (installBtn) (installBtn as HTMLElement).click();
            }
          }}
          title="Install or view insights"
        >
          <Download size={15} />
          <span className="hidden sm:inline">Install</span>
        </Button>

        {/* IST Clock Pill — Premium */}
        <motion.div 
          className="ist-pill premium-clock-pill"
          whileHover={{ scale: 1.01 }}
        >
          <span>{istDateText()} • Day {todayId()}</span>
          <strong>{clockText}</strong>
        </motion.div>
      </div>
    </header>
  );
};
