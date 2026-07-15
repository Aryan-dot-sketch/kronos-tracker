import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { ViewType } from '@/types';
import { 
  LayoutDashboard, CheckSquare, Target, Calendar, 
  BarChart3, BookOpen, Sparkles, Settings 
} from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS: { id: ViewType; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'today', label: 'Today', icon: CheckSquare },
  { id: 'goal', label: 'Goal', icon: Target },
  { id: 'calendar', label: 'Cal', icon: Calendar },
  { id: 'analytics', label: 'Stats', icon: BarChart3 },
  { id: 'jee', label: 'Syllabus', icon: BookOpen },
  { id: 'review', label: 'Review', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView } = useKronos();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={clsx('mobile-nav-item', isActive && 'active')}
            aria-label={item.label}
          >
            <Icon size={18} />
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};