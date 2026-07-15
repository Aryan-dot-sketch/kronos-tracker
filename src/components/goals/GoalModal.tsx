import React, { useState, useEffect } from 'react';
import { useKronos } from '@/context/KronosContext';
import { deadlineParts, buildDeadlineISO } from '@/lib/time/ist';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const GoalModal: React.FC = () => {
  const { state, activeModal, closeModal, saveGoal } = useKronos();

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

  useEffect(() => {
    if (activeModal === 'goal') {
      const parts = deadlineParts(state.goal.deadlineISO);
      setName(state.goal.name);
      setTarget(state.goal.target);
      setType(state.goal.type || 'Competitive Exam');
      setDeadlineDate(parts.date);
      setDeadlineTime(parts.time);
      setDailyHours(state.goal.dailyHours || 7.5);
      setProgress(state.goal.progress || 40);
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

  return (
    <Modal
      isOpen={activeModal === 'goal'}
      onClose={closeModal}
      eyebrow="Main Mission Architecture"
      title="Edit Main Goal"
    >
      <form onSubmit={handleSubmit} className="modal-card" style={{ border: 0, padding: 0, boxShadow: 'none' }}>
        <label>
          Goal title / Name
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>

        <div className="form-grid two">
          <label>
            Target score / Percentile
            <input value={target} onChange={e => setTarget(e.target.value)} required />
          </label>          <label>
            Goal Category / Type
            <input value={type} onChange={e => setType(e.target.value)} required />
          </label>
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
            Current preparation progress %
            <input type="number" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} required />
          </label>
        </div>

        <div className="form-grid two">
          <label>
            Current phase
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
