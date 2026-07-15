import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal" onClick={onClose}>
          <motion.div
            className="modal-card"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            {title && (
              <div className="modal-header">
                <h2>{title}</h2>
                <button onClick={onClose} className="icon-button">✕</button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};