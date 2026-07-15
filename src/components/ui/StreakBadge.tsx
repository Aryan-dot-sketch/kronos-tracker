import React from 'react';
import { motion } from 'framer-motion';

interface StreakBadgeProps {
  current: number;
  longest: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ current, longest }) => {
  const isHot = current >= 7;

  return (
    <motion.div 
      className="pill gold"
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 6,
        padding: '6px 14px',
        fontSize: '13px',
        fontWeight: 700,
        boxShadow: isHot ? '0 0 0 3px var(--gold-soft)' : undefined
      }}
      animate={isHot ? { scale: [1, 1.04, 1] } : {}}
      transition={{ duration: 1.8, repeat: Infinity }}
    >
      🔥 {current}d 
      <span style={{ opacity: 0.6, fontSize: '11px' }}>· best {longest}d</span>
    </motion.div>
  );
};