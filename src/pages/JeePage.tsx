import React from 'react';
import { SubjectDashboardCards } from '@/components/jee/SubjectDashboardCards';
import { ChapterTrackerTable } from '@/components/jee/ChapterTrackerTable';
import { MockTestForm } from '@/components/jee/MockTestForm';
import { MistakeNotebook } from '@/components/jee/MistakeNotebook';
import { RevisionPlanner } from '@/components/jee/RevisionPlanner';

export const JeePage: React.FC = () => {
  return (
    <>
      <SubjectDashboardCards />
      <div className="content-grid">
        <ChapterTrackerTable />
        <RevisionPlanner />
        <MockTestForm />
        <MistakeNotebook />
      </div>
    </>
  );
};
