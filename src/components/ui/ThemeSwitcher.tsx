import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { ThemeType } from '@/types';
import { Sun, Moon, Zap, Leaf, Square } from 'lucide-react';

const THEMES: { value: ThemeType; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'light', label: 'Classic Cream', icon: <Sun size={16} />, desc: 'Warm ivory & gold' },
  { value: 'dark', label: 'Obsidian', icon: <Moon size={16} />, desc: 'Jet black & metallic' },
  { value: 'midnight', label: 'Midnight', icon: <Zap size={16} />, desc: 'Slate & indigo' },
  { value: 'emerald', label: 'Royal Emerald', icon: <Leaf size={16} />, desc: 'Forest & amber' },
  { value: 'titanium', label: 'Titanium', icon: <Square size={16} />, desc: 'Cool blue & steel' },
];

export const ThemeSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { state, setTheme } = useKronos();
  const current = state.ui.theme || 'light';

  if (compact) {
    return (
      <div className="flex gap-1">
        {THEMES.map((theme) => (
          <button
            key={theme.value}
            onClick={() => setTheme(theme.value)}
            className={`icon-toggle !w-9 !h-9 !p-0 text-sm transition-all ${current === theme.value ? 'ring-2 ring-[var(--gold)] scale-110' : ''}`}
            title={theme.label}
            aria-label={theme.label}
          >
            {theme.icon}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      {THEMES.map((theme) => {
        const isActive = current === theme.value;
        return (
          <button
            key={theme.value}
            onClick={() => setTheme(theme.value)}
            className={`group flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition-all text-left hover:border-[var(--gold)] ${isActive ? 'border-[var(--gold)] bg-[var(--gold-soft)] shadow-sm' : 'border-[var(--border-line)] bg-[var(--bg-surface)]'}`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActive ? 'bg-[var(--gold)] text-white' : 'bg-[var(--gold-soft)] text-[var(--gold)]'} transition-all group-hover:scale-105`}>
              {theme.icon}
            </div>
            <div className="text-center">
              <div className="text-xs font-semibold leading-none tracking-tight">{theme.label}</div>
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{theme.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
