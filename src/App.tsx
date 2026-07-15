import React, { useEffect, useState } from 'react';
import { useKronos } from '@/context/KronosContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { RightInsightPanel } from '@/components/layout/RightInsightPanel';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { MobileFAB } from '@/components/ui/MobileFAB';
import { InstallPWA } from '@/components/ui/InstallPWA';
import { Toast } from '@/components/ui/Toast';

// Modals
import { TaskModal } from '@/components/tasks/TaskModal';
import { GoalModal } from '@/components/goals/GoalModal';
import { MilestoneModal } from '@/components/goals/MilestoneModal';
import { ChapterModal } from '@/components/jee/ChapterModal';
import { DayDetailModal } from '@/components/calendar/DayDetailModal';
import { ImportModal } from '@/components/modals/ImportModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { DeleteWarningModal } from '@/components/modals/DeleteWarningModal';

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
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile drawer toggle via custom event (from Topbar)
  useEffect(() => {
    const handler = () => setShowMobileDrawer(prev => !prev);
    window.addEventListener('toggle-kronos-insights', handler);
    return () => window.removeEventListener('toggle-kronos-insights', handler);
  }, []);

  // Theme application
  useEffect(() => {
    document.documentElement.dataset.theme = state.ui.theme || 'light';
  }, [state.ui.theme]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowMobileDrawer(false);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardPage />;
      case 'today': return <TodayPage />;
      case 'goal': return <GoalPage />;
      case 'calendar': return <CalendarPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'jee': return <JeePage />;
      case 'review': return <ReviewPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="app-shell">
      {/* Desktop Sidebar */}
      <Sidebar />

      <main className="workspace">
        <Topbar />
        
        <section className="view-stage" aria-live="polite">
          {renderActiveView()}
        </section>
      </main>

      {/* Desktop Right Panel */}
      <RightInsightPanel />

      {/* Mobile Drawer for Insights */}
      <RightInsightPanel 
        isOpen={showMobileDrawer} 
        onClose={() => setShowMobileDrawer(false)} 
        isMobileDrawer={true} 
      />

      {/* Mobile Bottom Navigation */}
      <div className="mobile-only">
        <MobileBottomNav />
      </div>

      {/* Mobile FAB */}
      <div className="mobile-only">
        <MobileFAB />
      </div>

      {/* PWA Install Banner (desktop + mobile) */}
      <InstallPWA />

      {/* Modals */}
      <TaskModal />
      <GoalModal />
      <MilestoneModal />
      <ChapterModal />
      <DayDetailModal />
      <ImportModal />
      <AuthModal />
      <DeleteWarningModal />

      <Toast />
    </div>
  );
};