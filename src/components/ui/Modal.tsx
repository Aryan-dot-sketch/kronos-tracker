import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, eyebrow }) => {
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
            {(title || eyebrow) && (
              <div className="modal-header">
                <div>
                  {eyebrow && <div className="eyebrow" style={{ marginBottom: 4 }}>{eyebrow}</div>}
                  {title && <h2 style={{ margin: 0 }}>{title}</h2>}
                </div>
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