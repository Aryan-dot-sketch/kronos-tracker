import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { todayId, addDays } from '@/lib/time/ist';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const MilestoneModal: React.FC = () => {
  const { activeModal, closeModal, addMilestone, addWeeklyTarget } = useKronos();

  const [kind, setKind] = useState<'milestone' | 'weekly'>('milestone');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Physics');
  const [targetDate, setTargetDate] = useState(() => addDays(todayId(), 30));
  const [targetHours, setTargetHours] = useState(15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kind === 'milestone') {
      addMilestone(title, targetDate, category);
    } else {
      addWeeklyTarget(title, Number(targetHours));
    }
    setTitle('');
  };

  return (
    <Modal
      isOpen={activeModal === 'milestone'}
      onClose={closeModal}
      eyebrow="Goal Breakdown"
      title="Add Target Item"
    >
      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-grid two">
          <label>
            Item Type
            <select value={kind} onChange={e => setKind(e.target.value as any)}>
              <option value="milestone">Monthly Milestone</option>
              <option value="weekly">Weekly Target</option>
            </select>
          </label>
          <label>
            Category / Subject
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Physics / PYQ" required />
          </label>
        </div>

        <label>
          Target Description
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Complete 150 PYQs in Electrostatics & Integration"
            required
          />
        </label>

        {kind === 'milestone' ? (
          <label>
            Target Deadline
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} required />
          </label>
        ) : (
          <label>
            Target Hours / Units
            <input type="number" min="1" max="100" value={targetHours} onChange={e => setTargetHours(Number(e.target.value))} required />
          </label>
        )}

        <div className="modal-actions">
          <Button variant="ghost" type="button" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" type="submit">Add Target Item</Button>
        </div>
      </form>
    </Modal>
  );
};
