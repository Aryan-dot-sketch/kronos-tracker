import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number;
  label?: string;
  size?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ 
  progress, 
  label, 
  size = 72 
}) => {
  const displayLabel = label ?? `${Math.round(progress)}%`;
  const clamped = Math.min(100, Math.max(0, progress));
  const radius = (size - 10) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-line)"
          strokeWidth="6"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontSize: size > 60 ? 18 : 14,
        fontWeight: 700,
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-serif, "Cormorant Garamond")'
      }}>
        {displayLabel}
      </div>
    </div>
  );
};