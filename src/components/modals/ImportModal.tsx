import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const ImportModal: React.FC = () => {
  const { activeModal, closeModal, importJSONState } = useKronos();
  const [jsonContent, setJsonContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (importJSONState(jsonContent)) {
      setJsonContent('');
    }
  };

  return (
    <Modal
      isOpen={activeModal === 'import'}
      onClose={closeModal}
      eyebrow="Data Control"
      title="Import Backup JSON"
    >
      <form onSubmit={handleSubmit} className="goal-form">
        <label>
          Paste JSON content or select backup file
          <textarea
            value={jsonContent}
            onChange={e => setJsonContent(e.target.value)}
            placeholder="Paste raw JSON export state here..."
            style={{ minHeight: '140px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
            required
          />
        </label>

        <div className="modal-actions">
          <Button variant="ghost" type="button" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" type="submit">Import & Replace State</Button>
        </div>
      </form>
    </Modal>
  );
};
