import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'icon' | 'tiny' | 'chip';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  onClick,
  type = 'button',
  title,
  ...rest
}) => {
  const baseClass = {
    primary: 'premium-button primary',
    secondary: 'premium-button secondary',
    ghost: 'premium-button ghost',
    outline: 'premium-button outline',
    danger: 'premium-button danger',
    icon: 'premium-button icon',
    tiny: 'premium-button tiny',
    chip: 'premium-button chip',
  }[variant];

  const sizeClass = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  }[size];

  const isDisabled = disabled || loading;

  // Only pass safe motion props
  const motionProps: any = {
    onClick,
    title,
    ...rest,
  };

  return (
    <motion.button
      className={clsx(
        baseClass,
        sizeClass,
        loading && 'loading',
        isDisabled && 'disabled',
        className
      )}
      whileHover={!isDisabled ? { 
        scale: variant === 'primary' ? 1.015 : 1.01,
        y: variant === 'primary' ? -1 : 0 
      } : {}}
      whileTap={!isDisabled ? { 
        scale: variant === 'primary' ? 0.985 : 0.97,
        y: 0 
      } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 420, 
        damping: 28, 
        mass: 0.6 
      }}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      type={type}
      {...motionProps}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {!loading && leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
      <span className="btn-label">{children}</span>
      {!loading && rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
    </motion.button>
  );
};
