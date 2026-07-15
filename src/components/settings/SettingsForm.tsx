import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { exportJSON, exportTasksCSV, exportMocksCSV } from '@/lib/storage/export-import';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const SettingsForm: React.FC = () => {
  const { state, saveSettings, openModal, clearStateData } = useKronos();

  const [name, setName] = useState(state.settings.name);
  const [theme, setTheme] = useState<'light' | 'dark'>(state.ui.theme);
  const [successThreshold, setSuccessThreshold] = useState(state.settings.successThreshold);
  const [studyDayCutoff, setStudyDayCutoff] = useState(state.settings.studyDayCutoff);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings({ name, successThreshold: Number(successThreshold), studyDayCutoff }, theme);
  };

  return (
    <div className="content-grid">
      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Kronos Settings & Engine Preferences</h3>
            <p className="panel-subtitle">All tracking, streaks, reset clocks, and performance evaluations enforce Indian Standard Time.</p>
          </div>
          <Badge tone="green">{state.settings.mode}</Badge>
        </div>

        <form onSubmit={handleSubmit} className="settings-grid">
          <div className="form-grid two">
            <label>User / Aspirant Name
              <input value={name} onChange={e => setName(e.target.value)} />
            </label>
            <label>App Visual Theme
              <select value={theme} onChange={e => setTheme(e.target.value as any)}>
                <option value="light">Light Cream</option>
                <option value="dark">Dark Obsidian</option>
              </select>
            </label>
          </div>
          <div className="form-grid two">
            <label>Daily Success Score Threshold %
              <input type="number" min="40" max="100" value={successThreshold} onChange={e => setSuccessThreshold(Number(e.target.value))} />
            </label>
            <label>Study Day Cutoff Mode
              <select value={studyDayCutoff} onChange={e => setStudyDayCutoff(e.target.value)}>
                <option value="00:00">00:00 Midnight IST</option>
                <option value="02:30 future student mode">02:30 AM Future Student Mode</option>
              </select>
            </label>
          </div>
          <Button variant="primary" type="submit">Save Engine Settings</Button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Data Controls & Backup</h3>
            <p className="panel-subtitle">Manage browser storage, export backups, or clear data.</p>
          </div>
        </div>

        <div className="bars">
          <Button variant="ghost" onClick={() => exportJSON(state)}>Export Full State JSON</Button>
          <Button variant="ghost" onClick={() => exportTasksCSV(state)}>Export Tasks CSV</Button>
          <Button variant="ghost" onClick={() => exportMocksCSV(state)}>Export Mock Tests CSV</Button>
          <Button variant="ghost" onClick={() => openModal('import')}>Import Backup JSON</Button>
          <Button variant="ghost" style={{ color: 'var(--red)', borderColor: 'rgba(168,67,67,0.3)' }} onClick={clearStateData}>
            Clear All Data (Start Fresh)
          </Button>
        </div>
      </section>
    </div>
  );
};
