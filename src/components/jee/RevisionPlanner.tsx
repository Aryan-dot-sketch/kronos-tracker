import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const RevisionPlanner: React.FC = () => {
  const { state, advanceChapterRevision } = useKronos();

  const due = state.chapters.slice().sort((a, b) =>
    String(a.nextRevision || '').localeCompare(String(b.nextRevision || ''))
  );

  return (
    <section className="panel wide">
      <div className="panel-header">
        <div>
          <h3>Revision Pipeline Planner</h3>
          <p className="panel-subtitle">Chapters queued for spaced repetition ordered by IST due dates.</p>
        </div>
      </div>

      <div className="task-list">
        {due.map((chapter) => {
          const originalIndex = state.chapters.indexOf(chapter);
          return (
            <div key={`${chapter.subject}-${chapter.chapter}`} className="task-row">
              <span className="nav-icon">R</span>
              <div>
                <div className="task-title">{chapter.subject} — {chapter.chapter}</div>
                <div className="task-meta">
                  <Badge tone="gold">Stage: {chapter.revision}</Badge>
                  <span>Last: {chapter.lastRevised || 'None'}</span>
                  <span>Next Due: {chapter.nextRevision || 'Today'}</span>
                  <span>Status: {chapter.status}</span>
                </div>
              </div>
              <div className="task-actions">
                <Button variant="tiny" onClick={() => advanceChapterRevision(originalIndex)}>
                  Log Revision Done
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
