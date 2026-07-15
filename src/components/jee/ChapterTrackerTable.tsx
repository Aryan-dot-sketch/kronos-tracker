import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const CHAPTER_STATUSES = [
  'Not started', 'Theory ongoing', 'Theory done', 'Practice ongoing',
  'PYQ done', 'Revision needed', 'Strong', 'Mastered'
];

export const ChapterTrackerTable: React.FC = () => {
  const { state, openModal, updateChapterStatus, advanceChapterRevision } = useKronos();

  const strengthTone = (strength: string) => {
    if (strength === 'Weak') return 'red';
    if (strength === 'Strong' || strength === 'Mastered') return 'green';
    return 'gold';
  };

  return (
    <section className="panel wide">
      <div className="panel-header">
        <div>
          <h3>JEE Chapter Master Syllabus</h3>
          <p className="panel-subtitle">Track theory, practice, PYQs, revision stage, and chapter strength.</p>
        </div>
        <Button variant="ghost" onClick={() => openModal('chapter')}>
          + Add Chapter
        </Button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Chapter</th>
              <th>Status</th>
              <th>Theory</th>
              <th>Practice</th>
              <th>PYQ</th>
              <th>Revision</th>
              <th>Strength</th>
            </tr>
          </thead>
          <tbody>
            {state.chapters.map((ch, index) => (
              <tr key={`${ch.subject}-${ch.chapter}`}>
                <td><strong>{ch.subject}</strong></td>
                <td>{ch.chapter}</td>
                <td>
                  <select
                    value={ch.status}
                    onChange={e => updateChapterStatus(index, e.target.value)}
                  >
                    {CHAPTER_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${ch.theory}%` }} /></div>
                  <small>{ch.theory}%</small>
                </td>
                <td>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${ch.practice}%` }} /></div>
                  <small>{ch.practice}%</small>
                </td>
                <td>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${ch.pyq}%` }} /></div>
                  <small>{ch.pyq}%</small>
                </td>
                <td>
                  <Button variant="tiny" onClick={() => advanceChapterRevision(index)}>
                    {ch.revision}
                  </Button>
                </td>
                <td>
                  <Badge tone={strengthTone(ch.strength) as any}>{ch.strength}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
