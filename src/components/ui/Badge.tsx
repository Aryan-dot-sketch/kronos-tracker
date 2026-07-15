import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  tone?: 'gold' | 'green' | 'red' | 'blue' | 'amber' | 'default';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ tone = 'default', children, className, style }) => {
  return (
    <span className={clsx('pill', tone !== 'default' && tone, className)} style={style}>
      {children}
    </span>
  );
};
