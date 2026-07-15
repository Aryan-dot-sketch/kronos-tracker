import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { signUpWithUsername, signInWithUsername } from '@/lib/supabase/auth';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { UserCheck, LogIn, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { activeModal, closeModal, showToast, state, saveSettings } = useKronos();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        // Fallback for offline mode without Supabase environment variables:
        if (mode === 'signup') {
          saveSettings({ name: name || 'Aspirant' }, state.ui.theme);
          showToast(`Welcome ${name}! Profile updated locally.`);
        } else {
          showToast(`Signed in as ${username || 'Aspirant'}`);
        }
        closeModal();
        return;
      }

      if (mode === 'signup') {
        const result = await signUpWithUsername({ name, username, password });
        saveSettings({ name: result.name }, state.ui.theme);
        showToast(`Account created successfully! Welcome, ${result.name}.`);
      } else {
        const result = await signInWithUsername({ username, password });
        showToast(`Signed in successfully as @${username}!`);
      }

      setName('');
      setUsername('');
      setPassword('');
      closeModal();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={activeModal === 'auth'}
      onClose={closeModal}
      eyebrow="Account Access"
      title={mode === 'signin' ? 'Sign In to Kronos' : 'Create Aspirant Account'}
    >
      <div className="goal-form">
        {/* Auth Mode Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <Button
            variant={mode === 'signin' ? 'primary' : 'ghost'}
            style={{ flex: 1 }}
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
          >
            <LogIn size={16} style={{ marginRight: '6px' }} />
            Sign In
          </Button>
          <Button
            variant={mode === 'signup' ? 'primary' : 'ghost'}
            style={{ flex: 1 }}
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
          >
            <UserCheck size={16} style={{ marginRight: '6px' }} />
            Create Account
          </Button>
        </div>

        {!isSupabaseConfigured && (
          <div className="empty-state" style={{ padding: '10px 14px', fontSize: '12.5px', marginBottom: '10px' }}>
            <strong>Note:</strong> Supabase URL and Key are not set in environment. Adding keys to Vercel will enable cloud cross-device sync.
          </div>
        )}

        {errorMessage && (
          <div style={{ padding: '10px 14px', border: '1px solid rgba(168,67,67,0.3)', borderRadius: '12px', background: 'var(--red-soft)', color: 'var(--red)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          {mode === 'signup' && (
            <label>
              Full Name
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Aryan Kumar"
                required
              />
            </label>
          )}

          <label>
            Username
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. aryan_coder"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />
          </label>

          <div className="modal-actions" style={{ marginTop: '10px' }}>
            <Button variant="ghost" type="button" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
