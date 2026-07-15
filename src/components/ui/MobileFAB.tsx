import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { Plus } from 'lucide-react';

export const MobileFAB: React.FC = () => {
  const { openModal } = useKronos();

  return (
    <button 
      className="mobile-fab" 
      onClick={() => openModal('task')}
      aria-label="Add new task"
    >
      <Plus size={22} />
    </button>
  );
};