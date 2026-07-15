import React from 'react';

interface ProgressRingProps {
  progress: number;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ progress, label }) => {
  const displayLabel = label ?? `${progress}%`;
  return (
    <div
      className="progress-ring"
      style={{ '--progress': `${Math.min(100, Math.max(0, progress))}%` } as React.CSSProperties}
      data-label={displayLabel}
    />
  );
};
