import React from 'react';
import clsx from 'clsx';
import { useKronos } from '@/context/KronosContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useKronos();

  return (
    <div className={clsx('toast', toastMessage && 'show')} role="status" aria-live="polite">
      {toastMessage}
    </div>
  );
};
