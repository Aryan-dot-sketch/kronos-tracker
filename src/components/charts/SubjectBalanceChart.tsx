import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { calculateSubjectBalance } from '@/lib/streaks/streak-engine';
import { formatMinutes } from '@/lib/time/ist';

export const SubjectBalanceChart: React.FC = () => {
  const { state } = useKronos();
  const data = calculateSubjectBalance(state, 7);

  const subjects = Object.keys(data);

  return (
    <>
      <div className="subject-bars">
        {subjects.length === 0 ? (
          <div className="empty-state">No subjects configured yet.</div>
        ) : (
          subjects.map((subject) => {
            const item = data[subject];
            return (
              <div key={subject} className="subject-row">
                <div className="subject-top">
                  <span>{subject}</span>
                  <strong>{item.pct}% • {formatMinutes(item.minutes)}</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
