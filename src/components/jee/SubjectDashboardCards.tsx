import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { calculateSubjectStreak, calculateSubjectBalance } from '@/lib/streaks/streak-engine';
import { formatMinutes } from '@/lib/time/ist';

export const SubjectDashboardCards: React.FC = () => {
  const { state } = useKronos();
  const subjects = state.goal.subjects && state.goal.subjects.length > 0
    ? state.goal.subjects
    : ['Physics', 'Chemistry', 'Mathematics'];

  const balanceData = calculateSubjectBalance(state, 7);

  return (
    <div className="stat-grid" style={{ marginBottom: '16px' }}>
      {subjects.map(subject => {
        const chapters = state.chapters.filter(ch => ch.subject === subject);
        const progress = chapters.length > 0
          ? Math.round(chapters.reduce((sum, ch) => sum + (ch.theory + ch.practice + ch.pyq) / 3, 0) / chapters.length)
          : 0;
        const weak = chapters.filter(ch => ch.strength === 'Weak').length;
        const minutes = balanceData[subject]?.minutes || 0;
        const streakCount = calculateSubjectStreak(state, subject);

        return (
          <article key={subject} className="mini-stat">
            <span>{subject}</span>
            <strong>
              {progress}%
              <small style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', letterSpacing: 0, marginTop: '4px' }}>
                {formatMinutes(minutes)} • {streakCount}d streak • {weak} weak
              </small>
            </strong>
          </article>
        );
      })}
    </div>
  );
};
