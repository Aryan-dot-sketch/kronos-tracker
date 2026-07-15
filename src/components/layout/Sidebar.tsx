import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { ViewType } from '@/types';
import { LayoutDashboard, CheckSquare, Target, Calendar, BarChart3, BookOpen, Sparkles, Settings } from 'lucide-react';
import clsx from 'clsx';
import { Logo } from '@/components/ui/Logo';

const NAV_ITEMS: { id: ViewType; label: string; icon: React.ComponentType<{ size?: number | string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'today', label: 'Today', icon: CheckSquare },
  { id: 'goal', label: 'Main Goal', icon: Target },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'jee', label: 'Syllabus Tracker', icon: BookOpen },
  { id: 'review', label: 'Review', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useKronos();

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand-block">
        <Logo size={42} showWordmark={true} />
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
