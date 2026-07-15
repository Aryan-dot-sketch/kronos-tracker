import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { calculateSubjectBalance } from '@/lib/streaks/streak-engine';
import { formatMinutes } from '@/lib/time/ist';

export const SubjectBalanceChart: React.FC = () => {
  const { state } = useKronos();
  const data = calculateSubjectBalance(state, 7);

  const physics = data.Physics.pct;
  const chemistry = data.Chemistry.pct;

  return (
    <>
      <div
        className="donut"
        style={{
          '--physics': `${physics}%`,
          '--chemistry': `${chemistry}%`
        } as React.CSSProperties}
      />
      <div className="subject-bars">
        {Object.entries(data).map(([subject, item]) => (
          <div key={subject} className="subject-row">
            <div className="subject-top">
              <span>{subject}</span>
              <strong>{item.pct}% • {formatMinutes(item.minutes)}</strong>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
