import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { CompletionChart } from '@/components/charts/CompletionChart';
import { SubjectBalanceChart } from '@/components/charts/SubjectBalanceChart';
import { HeatmapGrid } from '@/components/charts/HeatmapGrid';
import { AnalyticsSummary } from '@/components/analytics/AnalyticsSummary';
import { AIPoweredPlanner } from '@/components/analytics/AIPoweredPlanner';
import { formatMinutes, addDays, todayId, dateLabel } from '@/lib/time/ist';

export const AnalyticsPage: React.FC = () => {
  const { state, currentStreaks } = useKronos();

  const entries = Object.values(state.history).sort((a, b) => a.dateId.localeCompare(b.dateId));
  const recent7 = entries.slice(-7);
  const recent30 = entries.slice(-30);

  const avg7 = Math.round(recent7.reduce((sum, item) => sum + (Number(item.completionScore) || 0), 0) / Math.max(1, recent7.length));
  const successRate = Math.round((recent30.filter(item => item.success).length / Math.max(1, recent30.length)) * 100);

  return (
    <>
      <div className="stat-grid" style={{ marginBottom: '16px' }}>
        <article className="mini-stat"><span>Current Streak</span><strong>{currentStreaks.current} days</strong></article>
        <article className="mini-stat"><span>Longest Streak</span><strong>{currentStreaks.longest} days</strong></article>
        <article className="mini-stat"><span>7-Day Average</span><strong>{avg7}%</strong></article>
        <article className="mini-stat"><span>30-Day Success</span><strong>{successRate}%</strong></article>
      </div>

      <div className="content-grid">
        <AIPoweredPlanner />

        <section className="panel wide">
          <div className="panel-header">
            <div>
              <h3>14-Day Completion Trend</h3>
              <p className="panel-subtitle">Weighted completion percentage trajectory.</p>
            </div>
          </div>
          <CompletionChart days={14} />
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Study Hours</h3>
              <p className="panel-subtitle">Last 7 days actual focused time.</p>
            </div>
          </div>
          <div className="bars">
            {Array.from({ length: 7 }, (_, index) => {
              const dateId = addDays(todayId(), index - 6);
              const minutes = state.history[dateId]?.studyMinutes || 0;
              const pct = Math.min(100, Math.round((minutes / ((Number(state.goal.dailyHours) || 7.5) * 60)) * 100));
              return (
                <div key={dateId} className="bar-row">
                  <span>{dateLabel(dateId, { weekday: 'short' }).slice(0, 3)}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
                  <strong>{formatMinutes(minutes)}</strong>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Subject Balance</h3>
              <p className="panel-subtitle">Balanced module distribution protects rank performance.</p>
            </div>
          </div>
          <SubjectBalanceChart />
        </section>

        <AnalyticsSummary />

        <section className="panel wide">
          <div className="panel-header">
            <div>
              <h3>Long-Range Performance Heatmap</h3>
              <p className="panel-subtitle">100-day historical execution consistency grid.</p>
            </div>
          </div>
          <HeatmapGrid days={98} />
        </section>
      </div>
    </>
  );
};
