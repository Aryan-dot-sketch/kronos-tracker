import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const DeleteWarningModal: React.FC = () => {
  const { activeModal, closeModal, clearStateData, showToast } = useKronos();
  const [confirmInput, setConfirmInput] = useState('');

  const CONFIRM_PHRASE = 'DELETE MY DATA';
  const isMatch = confirmInput.trim().toUpperCase() === CONFIRM_PHRASE;

  const handleConfirmDelete = () => {
    if (!isMatch) return;
    clearStateData();
    setConfirmInput('');
    closeModal();
    showToast('All tracking data permanently cleared');
  };

  return (
    <Modal
      isOpen={activeModal === 'deleteWarning'}
      onClose={closeModal}
      eyebrow="Irreversible Action Warning"
      title="Permanently Delete All Data"
    >
      <div style={{ border: '1px solid rgba(220,38,38,0.4)', background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '14px', background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}>
          <ShieldAlert size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ display: 'block', fontSize: '15px', marginBottom: '4px' }}>
              ⚠️ WARNING: PERMANENT DATA DELETION
            </strong>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
              You are about to erase all local goals, daily checklists, study stopwatch logs, streak records, mistake entries, and reviews. This action <strong>CANNOT BE UNDONE</strong> or restored.
            </p>
          </div>
        </div>

        <label style={{ display: 'grid', gap: '8px', marginTop: '10px' }}>
          To confirm deletion, type <strong style={{ color: 'var(--accent-red)' }}>DELETE MY DATA</strong> below:
          <input
            value={confirmInput}
            onChange={e => setConfirmInput(e.target.value)}
            placeholder="DELETE MY DATA"
            style={{ borderColor: isMatch ? 'var(--accent-red)' : 'var(--border-line)', fontWeight: 'bold' }}
            autoFocus
          />
        </label>

        <div className="modal-actions" style={{ marginTop: '12px' }}>
          <Button variant="ghost" type="button" onClick={() => { setConfirmInput(''); closeModal(); }}>
            Cancel & Keep Data
          </Button>
          <Button
            variant="primary"
            type="button"
            disabled={!isMatch}
            style={{
              background: isMatch ? 'var(--accent-red)' : 'rgba(120,113,108,0.3)',
              borderColor: isMatch ? 'var(--accent-red)' : 'transparent',
              color: '#ffffff',
              cursor: isMatch ? 'pointer' : 'not-allowed'
            }}
            onClick={handleConfirmDelete}
          >
            Permanently Delete My Data
          </Button>
        </div>
      </div>
    </Modal>
  );
};
