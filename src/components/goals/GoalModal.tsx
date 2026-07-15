import React, { useState, useEffect } from 'react';
import { useKronos } from '@/context/KronosContext';
import { deadlineParts, buildDeadlineISO } from '@/lib/time/ist';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const GoalModal: React.FC = () => {
  const { state, activeModal, closeModal, saveGoal, addSubject, deleteSubject } = useKronos();

  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [type, setType] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [dailyHours, setDailyHours] = useState(7.5);
  const [progress, setProgress] = useState(40);
  const [phase, setPhase] = useState('');
  const [weakArea, setWeakArea] = useState('');
  const [prepStrategy, setPrepStrategy] = useState('');
  const [newSubjectInput, setNewSubjectInput] = useState('');

  useEffect(() => {
    if (activeModal === 'goal') {
      const parts = deadlineParts(state.goal.deadlineISO);
      setName(state.goal.name);
      setTarget(state.goal.target);
      setType(state.goal.type || 'Competitive Exam / Core Target');
      setDeadlineDate(parts.date);
      setDeadlineTime(parts.time);
      setDailyHours(state.goal.dailyHours || 8);
      setProgress(state.goal.progress || 0);
      setPhase(state.goal.phase || '');
      setWeakArea(state.goal.weakArea || '');
      setPrepStrategy(state.goal.prepStrategy || '');
    }
  }, [activeModal, state.goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveGoal({
      name,
      target,
      type,
      deadlineISO: buildDeadlineISO(deadlineDate, deadlineTime),
      dailyHours: Number(dailyHours),
      progress: Number(progress),
      phase,
      weakArea,
      prepStrategy
    });
  };

  const handleAddSubject = () => {
    if (newSubjectInput.trim()) {
      addSubject(newSubjectInput.trim());
      setNewSubjectInput('');
    }
  };

  return (
    <Modal
      isOpen={activeModal === 'goal'}
      onClose={closeModal}
      eyebrow="Main Mission Architecture"
      title="Edit Main Goal"
    >
      <form onSubmit={handleSubmit} className="goal-form">
        <label>
          Goal title / Name
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>

        <div className="form-grid two">
          <label>
            Target score / Percentile
            <input value={target} onChange={e => setTarget(e.target.value)} required />
          </label>
          <label>
            Goal Category / Domain Type
            <input value={type} onChange={e => setType(e.target.value)} placeholder="e.g. UPSC, NEET, Coding, Boards, Fitness" required />
          </label>
        </div>

        {/* Dynamic Subject / Module Manager */}
        <div style={{ display: 'grid', gap: '8px', border: '1px solid var(--border-gold)', padding: '14px', borderRadius: '16px', background: 'var(--gold-soft)' }}>
          <label style={{ margin: 0 }}>
            Active Goal Subjects / Modules
          </label>
          <p className="panel-subtitle" style={{ fontSize: '12px', margin: 0 }}>
            Customize your domain modules (e.g., Physics, Polity, Algorithms, Anatomy, IELTS Reading, etc.).
          </p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '4px 0' }}>
            {(state.goal.subjects || []).map(subj => (
              <Badge key={subj} tone="gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {subj}
                <button
                  type="button"
                  onClick={() => deleteSubject(subj)}
                  style={{ background: 'none', border: 0, color: 'var(--red)', cursor: 'pointer', fontWeight: 'bold', padding: '0 2px' }}
                  title="Remove subject"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={newSubjectInput}
              onChange={e => setNewSubjectInput(e.target.value)}
              placeholder="e.g. System Design / Organic Chemistry / Ancient History"
              style={{ flex: 1 }}
            />
            <Button variant="ghost" type="button" onClick={handleAddSubject}>
              + Add Subject
            </Button>
          </div>
        </div>

        <div className="form-grid two">
          <label>
            Deadline date
            <input type="date" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} required />
          </label>
          <label>
            Deadline time IST
            <input type="time" value={deadlineTime} onChange={e => setDeadlineTime(e.target.value)} required />
          </label>
        </div>

        <div className="form-grid two">
          <label>
            Daily target study hours
            <input type="number" min="1" max="18" step="0.5" value={dailyHours} onChange={e => setDailyHours(Number(e.target.value))} required />
          </label>
          <label>
            Current overall progress %
            <input type="number" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} required />
          </label>
        </div>

        <div className="form-grid two">
          <label>
            Current preparation phase
            <input value={phase} onChange={e => setPhase(e.target.value)} />
          </label>
          <label>
            Primary weak area
            <input value={weakArea} onChange={e => setWeakArea(e.target.value)} />
          </label>
        </div>

        <label>
          Strategy Notes
          <textarea value={prepStrategy} onChange={e => setPrepStrategy(e.target.value)} placeholder="Strategy notes..." />
        </label>

        <div className="modal-actions">
          <Button variant="ghost" type="button" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" type="submit">Save Architecture Updates</Button>
        </div>
      </form>
    </Modal>
  );
};
