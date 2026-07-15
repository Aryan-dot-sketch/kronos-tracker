import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number;
  label?: string;
  size?: number;
  showGlow?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ 
  progress, 
  label, 
  size = 76,
  showGlow = true
}) => {
  const displayLabel = label ?? `${Math.round(progress)}%`;
  const clamped = Math.min(100, Math.max(0, progress));
  const radius = (size - 12) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div 
      className="premium-progress-ring" 
      style={{ 
        width: size, 
        height: size, 
        position: 'relative',
        filter: showGlow ? 'drop-shadow(0 0 6px var(--gold-soft))' : 'none'
      }}
    >
      <svg 
        width={size} 
        height={size} 
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-line)"
          strokeWidth="7"
          strokeOpacity="0.5"
        />
        
        {/* Premium progress track */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration: 1.1, 
            ease: [0.22, 1, 0.36, 1],
            delay: 0.1 
          }}
          style={{ 
            filter: showGlow ? 'drop-shadow(0 2px 8px var(--gold))' : 'none' 
          }}
        />
      </svg>

      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          fontSize: size > 64 ? 19 : 15,
          fontWeight: 800,
          color: 'var(--text-primary)',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          letterSpacing: '-0.5px',
          lineHeight: 1
        }}
      >
        {displayLabel}
      </div>
    </div>
  );
};
