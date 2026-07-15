import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { dateLabel, formatMinutes } from '@/lib/time/ist';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TaskCard } from '../tasks/TaskCard';

export const DayDetailModal: React.FC = () => {
  const { state, activeModal, selectedDayDetail, closeModal } = useKronos();

  if (!selectedDayDetail) return null;

  const dateId = selectedDayDetail;
  const history = state.history[dateId];
  const tasks = state.tasksByDate[dateId] || [];
  const sessions = state.sessions.filter(s => s.dateId === dateId);
  const review = state.reviews[dateId];

  const fullLabel = `${dateLabel(dateId, { weekday: 'long', year: 'numeric', month: 'long' })} (${dateId})`;

  return (
    <Modal
      isOpen={activeModal === 'dayDetail'}
      onClose={closeModal}
      eyebrow="IST Date Inspection"
      title={fullLabel}
    >
      <div style={{ display: 'grid', gap: '16px' }}>
        <div className="stat-grid">
          <article className="mini-stat">
            <span>Completion</span>
            <strong>{history?.completionScore || 0}%</strong>
          </article>
          <article className="mini-stat">
            <span>Study Time</span>
            <strong>{formatMinutes(history?.studyMinutes || 0)}</strong>
          </article>
          <article className="mini-stat">
            <span>Tasks Done</span>
            <strong>{history?.completedTasks || 0}/{history?.totalTasks || tasks.length}</strong>
          </article>
          <article className="mini-stat">
            <span>Day Status</span>
            <strong style={{ fontSize: '18px' }}>
              {history?.success ? 'Successful' : history ? 'Missed / Weak' : 'No Data'}
            </strong>
          </article>
        </div>

        <h3 style={{ fontSize: '16px', margin: '8px 0 4px' }}>Tasks Recorded on {dateId}</h3>
        {tasks.length === 0 ? (
          <div className="empty-state">No tasks recorded on this day.</div>
        ) : (
          <div className="task-list">
            {tasks.map(t => (
              <TaskCard key={t.id} task={t} compact />
            ))}
          </div>
        )}

        {sessions.length > 0 && (
          <>
            <h3 style={{ fontSize: '16px', margin: '14px 0 4px' }}>Logged Stopwatch Sessions</h3>
            <div className="task-list">
              {sessions.map(s => (
                <div key={s.id} className="task-row">
                  <span className="nav-icon">⏱</span>
                  <div>
                    <div className="task-title">{s.subject} — {formatMinutes(s.minutes)}</div>
                    <div className="task-meta"><span>{s.label}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {review && (
          <>
            <h3 style={{ fontSize: '16px', margin: '14px 0 4px' }}>Night Reflection Entry</h3>
            <div className="panel" style={{ padding: '14px', display: 'grid', gap: '8px' }}>
              <p><strong>What went well:</strong> {review.wentWell || 'None'}</p>
              <p><strong>Distractions:</strong> {review.distraction || 'None'}</p>
              <p><strong>Main Lesson:</strong> {review.learned || 'None'}</p>
            </div>
          </>
        )}

        <div className="modal-actions">
          <Button variant="ghost" type="button" onClick={closeModal}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
