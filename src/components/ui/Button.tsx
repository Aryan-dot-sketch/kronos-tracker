import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'icon' | 'tiny' | 'chip';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...props }) => {
  const baseClass = {
    primary: 'primary-button',
    ghost: 'ghost-button',
    icon: 'icon-button',
    tiny: 'tiny-button',
    chip: 'chip-button'
  }[variant];

  return (
    <button className={clsx(baseClass, className)} {...props}>
      {children}
    </button>
  );
};
