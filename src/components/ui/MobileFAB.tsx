import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const MobileFAB: React.FC = () => {
  const { openModal } = useKronos();

  return (
    <motion.button
      className="mobile-fab premium-fab"
      onClick={() => openModal('task')}
      aria-label="Add new mission task"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 380, damping: 18 }}
    >
      <Plus size={26} strokeWidth={3} />
      <span className="fab-label">Add</span>
    </motion.button>
  );
};
