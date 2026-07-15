import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const ChapterModal: React.FC = () => {
  const { activeModal, closeModal, addChapter } = useKronos();

  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('');
  const [theory, setTheory] = useState(50);
  const [practice, setPractice] = useState(20);
  const [pyq, setPyq] = useState(10);
  const [revision, setRevision] = useState('R1');
  const [strength, setStrength] = useState('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addChapter({ subject, chapter, theory, practice, pyq, revision, strength });
    setChapter('');
  };

  return (
    <Modal
      isOpen={activeModal === 'chapter'}
      onClose={closeModal}
      eyebrow="Syllabus Expansion"
      title="Add Chapter to Tracker"
    >
      <form onSubmit={handleSubmit} className="modal-card" style={{ border: 0, padding: 0, boxShadow: 'none' }}>
        <div className="form-grid two">
          <label>
            Subject
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Mathematics</option>
            </select>
          </label>
          <label>
            Chapter Name
            <input value={chapter} onChange={e => setChapter(e.target.value)} placeholder="Rotational Motion" required />
          </label>
        </div>

        <div className="form-grid three">
          <label>
            Theory %
            <input type="number" min="0" max="100" value={theory} onChange={e => setTheory(Number(e.target.value))} required />
          </label>
          <label>
            Practice %
            <input type="number" min="0" max="100" value={practice} onChange={e => setPractice(Number(e.target.value))} required />
          </label>
          <label>
            PYQ %
            <input type="number" min="0" max="100" value={pyq} onChange={e => setPyq(Number(e.target.value))} required />
          </label>
        </div>

        <div className="form-grid two">
          <label>
            Revision Stage
            <select value={revision} onChange={e => setRevision(e.target.value)}>
              <option>R0</option>
              <option>R1</option>
              <option>R2</option>
              <option>R3</option>
              <option>Final</option>
              <option>Formula</option>
              <option>PYQ done</option>
            </select>
          </label>
          <label>
            Strength Level
            <select value={strength} onChange={e => setStrength(e.target.value)}>
              <option>Weak</option>
              <option>Medium</option>
              <option>Strong</option>
              <option>Mastered</option>
            </select>
          </label>
        </div>

        <div className="modal-actions">
          <Button variant="ghost" type="button" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" type="submit">Add Chapter</Button>
        </div>
      </form>
    </Modal>
  );
};
