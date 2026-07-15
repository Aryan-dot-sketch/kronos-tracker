import React, { useState, useEffect } from 'react';
import { useKronos } from '@/context/KronosContext';
import { exportJSON, exportTasksCSV, exportMocksCSV } from '@/lib/storage/export-import';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Palette, Download, Trash2, User, Clock, Bell, Eye, Keyboard, 
  BookOpen, Shield, RotateCcw, Check 
} from 'lucide-react';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';

type SettingsTab = 
  | 'profile' 
  | 'appearance' 
  | 'discipline' 
  | 'notifications' 
  | 'display' 
  | 'shortcuts' 
  | 'domain' 
  | 'data';

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
  { id: 'discipline', label: 'Discipline', icon: <Clock size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  { id: 'display', label: 'Display', icon: <Eye size={16} /> },
  { id: 'shortcuts', label: 'Shortcuts', icon: <Keyboard size={16} /> },
  { id: 'domain', label: 'Domain', icon: <BookOpen size={16} /> },
  { id: 'data', label: 'Data & Privacy', icon: <Shield size={16} /> },
];

export const SettingsForm: React.FC = () => {
  const { 
    state, 
    saveSettings, 
    saveGoal, 
    addSubject, 
    deleteSubject, 
    clearStateData,
    showToast,
    openModal
  } = useKronos();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [hasChanges, setHasChanges] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: state.settings.name,
    theme: state.ui.theme || 'light',
    
    // Appearance
    fontScale: state.settings.fontScale || 'normal',
    density: state.settings.density || 'comfortable',
    showSeconds: state.settings.showSeconds ?? true,
    compactMode: state.settings.compactMode ?? false,
    chartStyle: state.settings.chartStyle || 'line',
    
    // Discipline
    successThreshold: state.settings.successThreshold || 70,
    dailyHours: state.goal.dailyHours || 8,
    studyDayCutoff: state.settings.studyDayCutoff || '00:00',
    
    // Notifications
    notificationsEnabled: state.settings.notificationsEnabled ?? true,
    dailyReminderTime: state.settings.dailyReminderTime || '21:00',
    streakReminder: state.settings.streakReminder ?? true,
    
    // Shortcuts
    keyboardShortcutsEnabled: state.settings.keyboardShortcutsEnabled ?? true,
    
    // Domain
    defaultDomain: state.settings.defaultDomain || 'General',
    
    // Privacy
    analyticsOptIn: state.settings.analyticsOptIn ?? true,
  });

  const [newSubject, setNewSubject] = useState('');

  // Auto-apply changes (real-time feel)
  const applyChanges = (updates: Partial<typeof formData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    setHasChanges(true);

    // Apply immediately for visual settings
    saveSettings({
      name: newData.name,
      successThreshold: Number(newData.successThreshold),
      studyDayCutoff: newData.studyDayCutoff,
      fontScale: newData.fontScale as any,
      density: newData.density as any,
      showSeconds: newData.showSeconds,
      compactMode: newData.compactMode,
      chartStyle: newData.chartStyle as any,
      notificationsEnabled: newData.notificationsEnabled,
      dailyReminderTime: newData.dailyReminderTime,
      streakReminder: newData.streakReminder,
      keyboardShortcutsEnabled: newData.keyboardShortcutsEnabled,
      defaultDomain: newData.defaultDomain,
      analyticsOptIn: newData.analyticsOptIn,
    }, newData.theme as any);

    saveGoal({ dailyHours: Number(newData.dailyHours) });
  };

  const handleInputChange = (key: keyof typeof formData, value: any) => {
    applyChanges({ [key]: value });
  };

  const handleSave = () => {
    // Final save (in case)
    applyChanges({});
    showToast('All settings saved successfully');
    setHasChanges(false);
  };

  const resetToDefaults = () => {
    const defaults = {
      name: 'Aspirant',
      theme: 'light' as const,
      fontScale: 'normal' as const,
      density: 'comfortable' as const,
      showSeconds: true,
      compactMode: false,
      chartStyle: 'line' as const,
      successThreshold: 70,
      dailyHours: 8,
      studyDayCutoff: '00:00',
      notificationsEnabled: true,
      dailyReminderTime: '21:00',
      streakReminder: true,
      keyboardShortcutsEnabled: true,
      defaultDomain: 'General',
      analyticsOptIn: true,
    };

    setFormData(defaults);
    saveSettings({
      ...defaults,
      name: defaults.name,
      successThreshold: defaults.successThreshold,
      studyDayCutoff: defaults.studyDayCutoff,
      fontScale: defaults.fontScale,
      density: defaults.density,
      showSeconds: defaults.showSeconds,
      compactMode: defaults.compactMode,
      chartStyle: defaults.chartStyle,
      notificationsEnabled: defaults.notificationsEnabled,
      dailyReminderTime: defaults.dailyReminderTime,
      streakReminder: defaults.streakReminder,
      keyboardShortcutsEnabled: defaults.keyboardShortcutsEnabled,
      defaultDomain: defaults.defaultDomain,
      analyticsOptIn: defaults.analyticsOptIn,
    } as any, 'light');

    saveGoal({ dailyHours: 8 });
    showToast('Settings reset to premium defaults');
    setHasChanges(false);
  };

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      addSubject(newSubject.trim());
      setNewSubject('');
    }
  };

  const subjects = state.goal.subjects || [];

  return (
    <div className="content-grid" style={{ gridTemplateColumns: '240px 1fr' }}>
      {/* Sidebar Tabs */}
      <div className="panel" style={{ padding: '12px', height: 'fit-content' }}>
        <div className="panel-header" style={{ marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '15px' }}>Settings</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-[var(--gold-soft)] text-[var(--gold)] font-semibold' 
                  : 'hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-line)' }}>
          <Button 
            variant="ghost" 
            onClick={resetToDefaults}
            className="w-full flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw size={15} /> Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Profile &amp; Identity</h3>
                <p className="panel-subtitle">How you appear across the app</p>
              </div>
            </div>
            
            <div className="form-grid two">
              <label>
                Display Name
                <input 
                  value={formData.name} 
                  onChange={e => handleInputChange('name', e.target.value)} 
                />
              </label>
              <label>
                Primary Goal Type
                <input 
                  value={state.goal.type} 
                  disabled 
                  style={{ opacity: 0.7 }} 
                />
              </label>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label>Current Subjects / Modules</label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {subjects.map(s => (
                  <div key={s} className="pill flex items-center gap-1.5">
                    {s}
                    <button 
                      onClick={() => deleteSubject(s)}
                      className="ml-1 text-[var(--accent-red)] hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  placeholder="Add new subject (e.g. Biology)" 
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddSubject()}
                />
                <Button variant="ghost" onClick={handleAddSubject}>Add</Button>
              </div>
            </div>
          </div>
        )}

        {/* Appearance */}
        {activeTab === 'appearance' && (
          <div className="panel">
            <div className="panel-header">
              <h3>Appearance &amp; Themes</h3>
            </div>
            
            <div>
              <label className="block mb-2">Theme</label>
              <ThemeSwitcher compact={false} />
            </div>

            <div className="form-grid two" style={{ marginTop: '20px' }}>
              <label>
                Font Scale
                <select value={formData.fontScale} onChange={e => handleInputChange('fontScale', e.target.value)}>
                  <option value="small">Small (Compact)</option>
                  <option value="normal">Normal (Recommended)</option>
                  <option value="large">Large (Accessible)</option>
                </select>
              </label>
              <label>
                Density
                <select value={formData.density} onChange={e => handleInputChange('density', e.target.value)}>
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="spacious">Spacious</option>
                </select>
              </label>
            </div>

            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.showSeconds} 
                  onChange={e => handleInputChange('showSeconds', e.target.checked)} 
                />
                Show seconds in clock
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={formData.compactMode} 
                  onChange={e => handleInputChange('compactMode', e.target.checked)} 
                />
                Compact mode
              </label>
            </div>
          </div>
        )}

        {/* Discipline */}
        {activeTab === 'discipline' && (
          <div className="panel">
            <div className="panel-header">
              <h3>Time &amp; Discipline Engine</h3>
            </div>

            <div className="form-grid three">
              <label>
                Success Threshold (%)
                <input 
                  type="number" min="40" max="100" 
                  value={formData.successThreshold} 
                  onChange={e => handleInputChange('successThreshold', e.target.value)} 
                />
              </label>
              <label>
                Daily Target Hours
                <input 
                  type="number" min="1" max="18" step="0.5"
                  value={formData.dailyHours} 
                  onChange={e => handleInputChange('dailyHours', e.target.value)} 
                />
              </label>
              <label>
                Study Day Cutoff
                <select value={formData.studyDayCutoff} onChange={e => handleInputChange('studyDayCutoff', e.target.value)}>
                  <option value="00:00">00:00 (Strict IST Midnight)</option>
                  <option value="02:30">02:30 AM (Late Student Mode)</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="panel">
            <div className="panel-header">
              <h3>Notifications &amp; Reminders</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span>Enable Browser Notifications</span>
                <input 
                  type="checkbox" 
                  checked={formData.notificationsEnabled} 
                  onChange={e => handleInputChange('notificationsEnabled', e.target.checked)} 
                />
              </label>
              
              <label>
                Daily Reminder Time
                <input 
                  type="time" 
                  value={formData.dailyReminderTime} 
                  onChange={e => handleInputChange('dailyReminderTime', e.target.value)} 
                  disabled={!formData.notificationsEnabled}
                />
              </label>

              <label className="flex items-center justify-between">
                <span>Streak Protection Reminders</span>
                <input 
                  type="checkbox" 
                  checked={formData.streakReminder} 
                  onChange={e => handleInputChange('streakReminder', e.target.checked)} 
                />
              </label>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-3">
              Notifications will be supported in a future update.
            </p>
          </div>
        )}

        {/* Display */}
        {activeTab === 'display' && (
          <div className="panel">
            <div className="panel-header">
              <h3>Display Preferences</h3>
            </div>
            <div className="form-grid two">
              <label>
                Chart Style
                <select value={formData.chartStyle} onChange={e => handleInputChange('chartStyle', e.target.value)}>
                  <option value="line">Line</option>
                  <option value="bar">Bar</option>
                  <option value="area">Area</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {/* Shortcuts */}
        {activeTab === 'shortcuts' && (
          <div className="panel">
            <div className="panel-header">
              <h3>Keyboard Shortcuts</h3>
            </div>
            <label className="flex items-center gap-3 mb-4">
              <input 
                type="checkbox" 
                checked={formData.keyboardShortcutsEnabled} 
                onChange={e => handleInputChange('keyboardShortcutsEnabled', e.target.checked)} 
              />
              Enable keyboard shortcuts
            </label>

            <div className="text-sm space-y-2 text-[var(--text-secondary)]">
              <div><strong>Ctrl/Cmd + K</strong> — Add new task</div>
              <div><strong>Ctrl/Cmd + /</strong> — Focus search</div>
              <div><strong>Ctrl/Cmd + D</strong> — Go to Dashboard</div>
              <div><strong>Ctrl/Cmd + T</strong> — Go to Today</div>
              <div><strong>Esc</strong> — Close modals</div>
            </div>
          </div>
        )}

        {/* Domain */}
        {activeTab === 'domain' && (
          <div className="panel">
            <div className="panel-header">
              <h3>Domain &amp; Presets</h3>
            </div>
            <label>
              Default Domain / Subject
              <select 
                value={formData.defaultDomain} 
                onChange={e => handleInputChange('defaultDomain', e.target.value)}
              >
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="General">General</option>
              </select>
            </label>
          </div>
        )}

        {/* Data & Privacy */}
        {activeTab === 'data' && (
          <div className="panel">
            <div className="panel-header">
              <h3>Data &amp; Privacy</h3>
            </div>

            <div className="space-y-5">
              <div>
                <Button variant="ghost" onClick={() => exportJSON(state)}>Export Full JSON Backup</Button>
                <div className="text-xs mt-1 text-[var(--text-muted)]">Complete portable backup of all your data.</div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => exportTasksCSV(state)}>Export Tasks (CSV)</Button>
                <Button variant="ghost" onClick={() => exportMocksCSV(state)}>Export Mocks (CSV)</Button>
              </div>

              <Button variant="ghost" onClick={() => openModal('import')}>
                Import / Restore Backup
              </Button>

              <div>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.analyticsOptIn} 
                    onChange={e => handleInputChange('analyticsOptIn', e.target.checked)} 
                  />
                  Contribute anonymous usage data (helps improve Kronos)
                </label>
              </div>

              <div style={{ marginTop: '20px' }}>
                <Button 
                  variant="ghost" 
                  onClick={() => openModal('deleteWarning')}
                  style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red-soft)' }}
                >
                  <Trash2 size={15} style={{ marginRight: '8px' }} />
                  Delete All Data (Permanent)
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Save bar */}
        <div className="flex justify-end items-center gap-3 mt-6">
          {hasChanges && (
            <div className="text-xs flex items-center gap-1 text-[var(--gold)]">
              <Check size={14} /> Changes applied
            </div>
          )}
          <Button variant="primary" onClick={handleSave}>
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
