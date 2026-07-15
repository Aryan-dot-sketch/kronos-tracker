import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { ViewType } from '@/types';
import { LayoutDashboard, CheckSquare, Target, Calendar, BarChart3, BookOpen, Sparkles, Settings } from 'lucide-react';
import clsx from 'clsx';
import { Logo } from '@/components/ui/Logo';
import { motion } from 'framer-motion';

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
    <aside className="sidebar premium-sidebar" aria-label="Primary navigation">
      <div className="brand-block">
        <Logo size={42} showWordmark={true} />
      </div>

      <nav className="nav-list" aria-label="Main Navigation">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <motion.button
              key={item.id}
              className={clsx('nav-item', isActive && 'active')}
              onClick={() => setActiveView(item.id)}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="nav-icon">
                <Icon size={18} />
              </span>
              <span className="nav-label">{item.label}</span>
              
              {/* Premium active indicator */}
              {isActive && (
                <motion.div 
                  className="nav-active-indicator"
                  layoutId="active-nav"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="engine-status premium-engine">
          <div className="pulse-dot" />
          <div>
            <strong>IST Time Engine</strong>
            <small>Strict Midnight Reset</small>
          </div>
        </div>
      </div>
    </aside>
  );
};
