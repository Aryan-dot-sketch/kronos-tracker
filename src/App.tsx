import React, { useEffect } from 'react';
import { useKronos } from '@/context/KronosContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { RightInsightPanel } from '@/components/layout/RightInsightPanel';
import { Toast } from '@/components/ui/Toast';

// Modals
import { TaskModal } from '@/components/tasks/TaskModal';
import { GoalModal } from '@/components/goals/GoalModal';
import { MilestoneModal } from '@/components/goals/MilestoneModal';
import { ChapterModal } from '@/components/jee/ChapterModal';
import { DayDetailModal } from '@/components/calendar/DayDetailModal';
import { ImportModal } from '@/components/modals/ImportModal';
import { AuthModal } from '@/components/auth/AuthModal';

// Pages
import { DashboardPage } from '@/pages/DashboardPage';
import { TodayPage } from '@/pages/TodayPage';
import { GoalPage } from '@/pages/GoalPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { JeePage } from '@/pages/JeePage';
import { ReviewPage } from '@/pages/ReviewPage';
import { SettingsPage } from '@/pages/SettingsPage';

export const AppContent: React.FC = () => {
  const { activeView, state } = useKronos();

  useEffect(() => {
    document.documentElement.dataset.theme = state.ui.theme || 'light';
  }, [state.ui.theme]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'today':
        return <TodayPage />;
      case 'goal':
        return <GoalPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'jee':
        return <JeePage />;
      case 'review':
        return <ReviewPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="workspace">
        <Topbar />
        <section className="view-stage" aria-live="polite">
          {renderActiveView()}
        </section>
      </main>

      <RightInsightPanel />

      {/* Modals Container */}
      <TaskModal />
      <GoalModal />
      <MilestoneModal />
      <ChapterModal />
      <DayDetailModal />
      <ImportModal />
      <AuthModal />

      <Toast />
    </div>
  );
};
