import React, { useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const MISTAKE_TYPES = [
  'Concept error', 'Calculation error', 'Silly mistake', 'Formula forgotten',
  'Time pressure', 'Misread question', 'Guesswork error'
];

export const MistakeNotebook: React.FC = () => {
  const { state, addMistake, deleteMistake } = useKronos();

  const subjects = state.goal.subjects && state.goal.subjects.length > 0
    ? state.goal.subjects
    : ['Physics', 'Chemistry', 'Mathematics'];

  const [subject, setSubject] = useState(subjects[0] || 'General');
  const [chapter, setChapter] = useState('');
  const [type, setType] = useState('Concept error');
  const [note, setNote] = useState('');

  const counts = state.mistakes.reduce((acc, m) => {
    acc[m.type] = (acc[m.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMistake({ subject, chapter, type, note });
    setChapter('');
    setNote('');
  };

  return (
    <section className="panel wide">
      <div className="panel-header">
        <div>
          <h3>Mistake & Error Notebook</h3>
          <p className="panel-subtitle">Document repeated errors to build conceptual resilience.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mock-form">
        <div className="form-grid three">
          <label>Subject / Module
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="General">General</option>
            </select>
          </label>
          <label>Chapter / Topic Name
            <input value={chapter} onChange={e => setChapter(e.target.value)} placeholder="Topic name" required />
          </label>
          <label>Error Type
            <select value={type} onChange={e => setType(e.target.value)}>
              {MISTAKE_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
        <label>Mistake Detail & Corrective Action
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Describe what went wrong and how to avoid it next time..." />
        </label>
        <Button variant="primary" type="submit">Log Mistake in Notebook</Button>
      </form>

      <div style={{ height: '16px' }} />

      <div className="stat-grid">
        {MISTAKE_TYPES.slice(0, 4).map(t => (
          <article key={t} className="mini-stat">
            <span>{t}</span>
            <strong>{counts[t] || 0}</strong>
          </article>
        ))}
      </div>

      <div className="task-list" style={{ marginTop: '14px' }}>
        {state.mistakes.slice(-6).reverse().map(mistake => (
          <div key={mistake.id} className="task-row">
            <span className="nav-icon">!</span>
            <div>
              <div className="task-title">{mistake.subject} • {mistake.chapter}</div>
              <div className="task-meta">
                <Badge tone="red">{mistake.type}</Badge>
                <span>{mistake.dateId}</span>
                <span>{mistake.note}</span>
              </div>
            </div>
            <Button variant="tiny" onClick={() => deleteMistake(mistake.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </section>
  );
};
