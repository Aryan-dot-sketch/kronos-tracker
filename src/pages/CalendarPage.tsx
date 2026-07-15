import React from 'react';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';

export const CalendarPage: React.FC = () => {
  return (
    <div className="content-grid">
      <div className="wide">
        <CalendarGrid />
      </div>
    </div>
  );
};
