import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { todayId, addDays } from '@/lib/time/ist';

interface HeatmapGridProps {
  days: number;
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({ days }) => {
  const { state, openModal } = useKronos();

  return (
    <div className="heatmap">
      {Array.from({ length: days }, (_, index) => {
        const dateId = addDays(todayId(), index - days + 1);
        const score = state.history[dateId]?.completionScore || 0;
        const level = score >= 90 ? 4 : score >= 75 ? 3 : score >= 55 ? 2 : score > 0 ? 1 : 0;

        return (
          <button
            key={dateId}
            className="heat-cell"
            data-level={level}
            onClick={() => openModal('dayDetail', dateId)}
            title={`${dateId}: ${score}% completion`}
          />
        );
      })}
    </div>
  );
};
