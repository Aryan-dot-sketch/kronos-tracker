import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { exportJSON, exportTasksCSV, exportMocksCSV } from '@/lib/storage/export-import';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Palette, Download, Trash2 } from 'lucide-react';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';

export const SettingsForm: React.FC = () => {
  const { state, saveSettings, saveGoal, openModal } = useKronos();

  const [name, setName] = useState(state.settings.name);
  const [theme, setTheme] = useState(state.ui.theme || 'light');
  const [successThreshold, setSuccessThreshold] = useState(state.settings.successThreshold || 70);
  const [studyDayCutoff, setStudyDayCutoff] = useState(state.settings.studyDayCutoff || '00:00');
  const [dailyHours, setDailyHours] = useState(state.goal.dailyHours || 8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings({ name, successThreshold: Number(successThreshold), studyDayCutoff }, theme as any);
    saveGoal({ dailyHours: Number(dailyHours) });
  };

  return (
    <div className="content-grid">
      <section className="panel wide">
        <div className="panel-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={20} color="var(--gold)" />
              <h3 style={{ margin: 0 }}>Kronos Settings & Visual Themes</h3>
            </div>
            <p className="panel-subtitle" style={{ marginTop: '4px' }}>
              Customize app themes, daily performance scoring thresholds, and timezone rules.
            </p>
          </div>
          <Badge tone="green">{state.settings.mode}</Badge>
        </div>

        <form onSubmit={handleSubmit} className="settings-grid">
          <div className="form-grid two">
            <label>
              User / Aspirant Display Name
              <input value={name} onChange={e => setName(e.target.value)} required />
            </label>

            <label>
              App Visual Theme Preset
              <div className="mt-1">
                <ThemeSwitcher compact={false} />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Click any theme for instant preview across the entire app</p>
            </label>
          </div>

          <div className="form-grid three">
            <label>
              Daily Success Threshold %
              <input type="number" min="40" max="100" value={successThreshold} onChange={e => setSuccessThreshold(Number(e.target.value))} required />
            </label>

            <label>
              Daily Target Study Hours
              <input type="number" min="1" max="18" step="0.5" value={dailyHours} onChange={e => setDailyHours(Number(e.target.value))} required />
            </label>

            <label>
              Study Day Cutoff Boundary
              <select value={studyDayCutoff} onChange={e => setStudyDayCutoff(e.target.value)}>
                <option value="00:00">00:00 Strict Midnight IST</option>
                <option value="02:30 future student mode">02:30 AM Late-Night Student Cutoff</option>
              </select>
            </label>
          </div>

          <Button variant="primary" type="submit" style={{ marginTop: '6px' }}>
            Save Engine Preferences
          </Button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={18} color="var(--gold)" />
              <h3 style={{ margin: 0 }}>Data Export & Controls</h3>
            </div>
            <p className="panel-subtitle" style={{ marginTop: '3px' }}>
              Download offline backups or restore prior sessions.
            </p>
          </div>
        </div>

        <div className="bars" style={{ display: 'grid', gap: '8px' }}>
          <Button variant="ghost" onClick={() => exportJSON(state)}>
            Export Full JSON State
          </Button>
          <Button variant="ghost" onClick={() => exportTasksCSV(state)}>
            Export Mission Tasks CSV
          </Button>
          <Button variant="ghost" onClick={() => exportMocksCSV(state)}>
            Export Mock Test CSV
          </Button>
          <Button variant="ghost" onClick={() => openModal('import')}>
            Restore / Import JSON State
          </Button>
          <Button
            variant="ghost"
            style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red-soft)', marginTop: '8px' }}
            onClick={() => openModal('deleteWarning')}
          >
            <Trash2 size={15} style={{ marginRight: '6px' }} />
            Clear All Data (Requires Safeguard Confirmation)
          </Button>

          <div className="desktop-install-hint">
            <strong>Pro tip:</strong> Install Kronos as a desktop app for the best experience.<br />
            Look for the <strong>Install</strong> button in the topbar or use your browser menu.
          </div>
        </div>
      </section>
    </div>
  );
};
