import React, { useState, useEffect } from 'react';
import { useKronos } from '@/context/KronosContext';
import { todayId } from '@/lib/time/ist';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TaskPriority, TaskDifficulty } from '@/types';

export const TaskModal: React.FC = () => {
  const { state, activeModal, editingTaskId, closeModal, saveTask } = useKronos();

  const subjects = state.goal.subjects && state.goal.subjects.length > 0
    ? state.goal.subjects
    : ['Physics', 'Chemistry', 'Mathematics'];

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(subjects[0] || 'General');
  const [category, setCategory] = useState('Practice');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('Medium');
  const [estimate, setEstimate] = useState<number>(60);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingTaskId) {
      const today = todayId();
      const task = (state.tasksByDate[today] || []).find(t => t.id === editingTaskId);
      if (task) {
        setTitle(task.title);
        setSubject(task.subject);
        setCategory(task.category);
        setPriority(task.priority);
        setDifficulty(task.difficulty);
        setEstimate(task.estimate);
        setNotes(task.notes || '');
      }
    } else {
      setTitle('');
      setSubject(subjects[0] || 'General');
      setCategory('Practice');
      setPriority('high');
      setDifficulty('Medium');
      setEstimate(60);
      setNotes('');
    }
  }, [editingTaskId, activeModal, state.tasksByDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTask(
      { title, subject, category, priority, difficulty, estimate: Number(estimate), notes },
      editingTaskId
    );
  };

  return (
    <Modal
      isOpen={activeModal === 'task'}
      onClose={closeModal}
      eyebrow="Daily Mission"
      title={editingTaskId ? 'Edit Mission Task' : 'Add Mission Task'}
    >
      <form onSubmit={handleSubmit} className="modal-card" style={{ border: 0, padding: 0, boxShadow: 'none' }}>
        <label>
          Task title
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Complete 40 practice problems"
            required
          />
        </label>

        <div className="form-grid two">
          <label>
            Subject / Module
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="Mock Test">Mock Test</option>
              <option value="Revision">Revision</option>
              <option value="Health">Health</option>
              <option value="Personal">Personal</option>
              <option value="General">General</option>
            </select>
          </label>

          <label>
            Category
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option>Study</option>
              <option>Practice</option>
              <option>Revision</option>
              <option>Mock</option>
              <option>Habit</option>
              <option>Health</option>
              <option>Personal</option>
              <option>Custom</option>
              <option>Review</option>
            </select>
          </label>
        </div>

        <div className="form-grid three">
          <label>
            Priority
            <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
              <option value="critical">Critical (5x Weight)</option>
              <option value="high">High (3x Weight)</option>
              <option value="medium">Medium (2x Weight)</option>
              <option value="low">Low (1x Weight)</option>
            </select>
          </label>

          <label>
            Difficulty
            <select value={difficulty} onChange={e => setDifficulty(e.target.value as TaskDifficulty)}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
              <option>Extreme</option>
            </select>
          </label>

          <label>
            Est. Minutes
            <input
              type="number"
              min="5"
              step="5"
              value={estimate}
              onChange={e => setEstimate(Number(e.target.value))}
              required
            />
          </label>
        </div>

        <label>
          Focus Notes / Reminders
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Specific reminders or strategy notes..."
          />
        </label>

        <div className="modal-actions">
          <Button variant="ghost" type="button" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" type="submit">Save Mission Task</Button>
        </div>
      </form>
    </Modal>
  );
};
