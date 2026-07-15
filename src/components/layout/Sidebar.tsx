import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { ViewType } from '@/types';
import { LayoutDashboard, CheckSquare, Target, Calendar, BarChart3, BookOpen, Sparkles, Settings } from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS: { id: ViewType; label: string; icon: React.FC<{ size?: number }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'today', label: 'Today', icon: CheckSquare },
  { id: 'goal', label: 'Main Goal', icon: Target },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'jee', label: 'JEE Tracker', icon: BookOpen },
  { id: 'review', label: 'Review', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useKronos();

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand-block">
        <div className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 64 64" role="img">
            <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
            <path d="M32 14v18l11 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="32" cy="32" r="3" fill="currentColor" />
            <path d="M20 48c4 2.5 8 3.5 12 3.5s8-1 12-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="brand-text">
          <p className="brand-kicker">Command Center</p>
          <h2>Kronos</h2>
        </div>
      </div>

      <nav className="nav-list" aria-label="Main Navigation">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              className={clsx('nav-item', isActive && 'active')}
              onClick={() => setActiveView(item.id)}
            >
              <span className="nav-icon">
                <Icon size={18} />
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="engine-status">
          <span className="pulse-dot" />
          <div>
            <strong>IST Time Engine</strong>
            <small>Strict Midnight Reset</small>
          </div>
        </div>
      </div>
    </aside>
  );
};
