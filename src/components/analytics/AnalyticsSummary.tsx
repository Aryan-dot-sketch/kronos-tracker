import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { DailyHistory } from '@/types';
import { formatMinutes, todayId } from '@/lib/time/ist';
import { calculateSubjectBalance } from '@/lib/streaks/streak-engine';

export const AnalyticsSummary: React.FC = () => {
  const { state, todayStats } = useKronos();

  const entries = Object.values(state.history).sort((a, b) => a.dateId.localeCompare(b.dateId));
  const recent7 = entries.slice(-7);
  const recent30 = entries.slice(-30);

  const best = recent30.reduce<DailyHistory | null>(
    (winner, item) => (!winner || item.completionScore > winner.completionScore ? item : winner),
    null
  );
  const worst = recent30.reduce<DailyHistory | null>(
    (loser, item) => (!loser || item.completionScore < loser.completionScore ? item : loser),
    null
  );

  const avgStudy = Math.round(
    recent7.reduce((sum, item) => sum + (Number(item.studyMinutes) || 0), 0) / Math.max(1, recent7.length)
  );

  const balanceData = calculateSubjectBalance(state, 7);
  const weakestSubject = Object.entries(balanceData).sort((a, b) => a[1].pct - b[1].pct)[0];
  const reviewMissing = !state.reviews[todayId()];
  const recoveryCount = state.backlog.filter(b => b.status === 'unresolved').length;

  return (
    <>
      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Performance Intelligence Summary</h3>
            <p className="panel-subtitle">Best & weak days, critical task rate, and daily averages.</p>
          </div>
        </div>

        <div className="stat-grid">
          <article className="mini-stat"><span>Best Day</span><strong>{best?.completionScore || 0}%</strong></article>
          <article className="mini-stat"><span>Weakest Day</span><strong>{worst?.completionScore || 0}%</strong></article>
          <article className="mini-stat"><span>Avg Daily Study</span><strong>{formatMinutes(avgStudy)}</strong></article>
          <article className="mini-stat"><span>Critical Rate</span><strong>{todayStats.criticalRate}%</strong></article>
        </div>

        <p className="panel-subtitle" style={{ marginTop: '14px' }}>
          Best Day ID: {best ? best.dateId : 'N/A'} • Weakest Day ID: {worst ? worst.dateId : 'N/A'}. Time metrics evaluate higher of estimated completed task times or stopwatch logs.
        </p>
      </section>

      <section className="panel wide">
        <div className="panel-header">
          <div>
            <h3>Smart AI Coaching Insights</h3>
            <p className="panel-subtitle">System generated insights based on live tracking patterns.</p>
          </div>
        </div>

        <div className="task-list">
          <div className="task-row">
            <span className="nav-icon">✦</span>
            <div>
              <div className="task-title">{weakestSubject[0]} needs additional focused study time this week.</div>
              <div className="task-meta">Only {weakestSubject[1].pct}% of PCM study time went here over the last 7 days.</div>
            </div>
          </div>

          <div className="task-row">
            <span className="nav-icon">◈</span>
            <div>
              <div className="task-title">Today’s Focus Score is {todayStats.focusScore}/100.</div>
              <div className="task-meta">Critical task compliance rate: {todayStats.criticalRate}%.</div>
            </div>
          </div>

          <div className="task-row">
            <span className="nav-icon">✓</span>
            <div>
              <div className="task-title">{reviewMissing ? 'Night reflection is pending for today.' : 'Night review is saved in IST.'}</div>
              <div className="task-meta">Day closes strictly at 11:59:59 PM IST.</div>
            </div>
          </div>

          <div className="task-row">
            <span className="nav-icon">↺</span>
            <div>
              <div className="task-title">
                {recoveryCount ? `${recoveryCount} missed task${recoveryCount > 1 ? 's' : ''} in recovery backlog.` : 'No unresolved recovery items.'}
              </div>
              <div className="task-meta">Use rollover controls on the Today page to clear backlog.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
