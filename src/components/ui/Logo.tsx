import React from 'react';

interface LogoProps {
  size?: number | string;
  variant?: 'light' | 'dark' | 'auto';
  showWordmark?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 42, 
  variant = 'auto', 
  showWordmark = true,
  className = '' 
}) => {
  const logoSrc = variant === 'dark' ? '/logo-dark.png' : '/logo.png';
  
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ minWidth: showWordmark ? 160 : 'auto' }}>
      <img 
        src={logoSrc} 
        alt="Kronos Tracker" 
        style={{ 
          height: typeof size === 'number' ? `${size}px` : size, 
          width: 'auto',
          display: 'block'
        }} 
        className="select-none"
      />
      {showWordmark && (
        <div>
          <div className="font-serif text-2xl font-bold tracking-[-0.03em] leading-none" style={{ color: 'var(--gold)' }}>
            KRONOS
          </div>
          <div className="text-[10px] font-semibold tracking-[2px] text-[var(--text-muted)] -mt-0.5">
            TRACKER
          </div>
        </div>
      )}
    </div>
  );
};