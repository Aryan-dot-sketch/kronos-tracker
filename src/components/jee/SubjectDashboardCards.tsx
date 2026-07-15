import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { calculateSubjectStreak, calculateSubjectBalance } from '@/lib/streaks/streak-engine';
import { formatMinutes } from '@/lib/time/ist';

export const SubjectDashboardCards: React.FC = () => {
  const { state } = useKronos();
  const subjects = ['Physics', 'Chemistry', 'Mathematics'];
  const balanceData = calculateSubjectBalance(state, 7);

  return (
    <div className="stat-grid" style={{ marginBottom: '16px' }}>
      {subjects.map(subject => {
        const chapters = state.chapters.filter(ch => ch.subject === subject);
        const progress = Math.round(
          chapters.reduce((sum, ch) => sum + (ch.theory + ch.practice + ch.pyq) / 3, 0) / Math.max(1, chapters.length)
        );
        const weak = chapters.filter(ch => ch.strength === 'Weak').length;
        const minutes = balanceData[subject as keyof typeof balanceData]?.minutes || 0;
        const streakCount = calculateSubjectStreak(state, subject);

        return (
          <article key={subject} className="mini-stat">
            <span>{subject}</span>
            <strong>
              {progress}%
              <small style={{ display: 'block', fontSize: '11.5px', color: 'var(--muted)', fontFamily: 'var(--font-sans)', letterSpacing: 0, marginTop: '4px' }}>
                {formatMinutes(minutes)} • {streakCount}d streak • {weak} weak
              </small>
            </strong>
          </article>
        );
      })}
    </div>
  );
};
