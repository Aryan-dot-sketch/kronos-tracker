import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  tone?: 'gold' | 'green' | 'red' | 'blue' | 'default';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ tone = 'default', children, className }) => {
  return (
    <span className={clsx('pill', tone !== 'default' && tone, className)}>
      {children}
    </span>
  );
};
