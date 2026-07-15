import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { todayId } from '@/lib/time/ist';
import { MainMissionHero } from '@/components/dashboard/MainMissionHero';
import { ExecutionMetrics } from '@/components/dashboard/ExecutionMetrics';
import { TaskCard } from '@/components/tasks/TaskCard';
import { CompletionChart } from '@/components/charts/CompletionChart';
import { SubjectBalanceChart } from '@/components/charts/SubjectBalanceChart';
import { HeatmapGrid } from '@/components/charts/HeatmapGrid';
import { ProgressRing } from '@/components/ui/ProgressRing';

export const DashboardPage: React.FC = () => {
  const { state, todayStats } = useKronos();
  const tasksToday = state.tasksByDate[todayId()] || [];

  return (
    <>
      <div className="hero-grid">
        <MainMissionHero />
        <ExecutionMetrics />
      </div>

      <div className="content-grid">
        <section className="panel wide">
          <div className="panel-header">
            <div>
              <h3>Today’s Execution Mission</h3>
              <p className="panel-subtitle">Every completion is stamped in IST and powers streak, graphs, and focus scores.</p>
            </div>
            <ProgressRing progress={todayStats.completionScore} />
          </div>

          <div className="task-list">
            {tasksToday.slice(0, 6).length === 0 ? (
              <div className="empty-state">No mission tasks added for today yet.</div>
            ) : (
              tasksToday.slice(0, 6).map(t => <TaskCard key={t.id} task={t} compact />)
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Weekly Performance</h3>
              <p className="panel-subtitle">7-day weighted completion trend.</p>
            </div>
          </div>
          <CompletionChart days={7} />
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Subject Balance</h3>
              <p className="panel-subtitle">Last 7 days PCM time breakdown.</p>
            </div>
          </div>
          <SubjectBalanceChart />
        </section>

        <section className="panel wide">
          <div className="panel-header">
            <div>
              <h3>Kronos Consistency Heatmap</h3>
              <p className="panel-subtitle">Gold marks elite execution days. Click any tile to inspect day performance.</p>
            </div>
          </div>
          <HeatmapGrid days={70} />
        </section>
      </div>
    </>
  );
};
