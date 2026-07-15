import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const ChapterModal: React.FC = () => {
  const { state, activeModal, closeModal, addChapter } = useKronos();

  const subjects = state.goal.subjects && state.goal.subjects.length > 0
    ? state.goal.subjects
    : ['Physics', 'Chemistry', 'Mathematics'];

  const [subject, setSubject] = useState(subjects[0] || 'General');
  const [chapter, setChapter] = useState('');
  const [theory, setTheory] = useState(0);
  const [practice, setPractice] = useState(0);
  const [pyq, setPyq] = useState(0);
  const [revision, setRevision] = useState('R0');
  const [strength, setStrength] = useState('Weak');

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
      title="Add Chapter / Module to Tracker"
    >
      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-grid two">
          <label>
            Subject / Domain Module
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Chapter / Topic Name
            <input value={chapter} onChange={e => setChapter(e.target.value)} placeholder="e.g. Rotational Motion / Indian Polity / System Design" required />
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
            PYQ / Problem Set %
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
          <Button variant="primary" type="submit">Add Module / Chapter</Button>
        </div>
      </form>
    </Modal>
  );
};
