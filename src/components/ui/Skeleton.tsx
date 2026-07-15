import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', width, height }) => {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`animate-pulse rounded-lg bg-[var(--border-line)] ${className}`} 
      style={style}
      aria-hidden="true"
    />
  );
};

export const TaskSkeleton = () => (
  <div className="task-row">
    <div className="w-7 h-7 rounded-lg bg-[var(--border-line)]" />
    <div className="flex-1 space-y-1.5">
      <Skeleton height={14} width="70%" />
      <Skeleton height={10} width="40%" />
    </div>
  </div>
);
