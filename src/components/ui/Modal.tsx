import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

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
        <div className="modal premium-modal" onClick={onClose}>
          <motion.div
            className="modal-card"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { type: "spring", stiffness: 340, damping: 28, mass: 0.7 }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.96, 
              y: 20,
              transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
            }}
          >
            {(title || eyebrow) && (
              <div className="modal-header">
                <div>
                  {eyebrow && <div className="eyebrow" style={{ marginBottom: 4, color: 'var(--gold)' }}>{eyebrow}</div>}
                  {title && <h2 style={{ margin: 0, fontSize: '22px' }}>{title}</h2>}
                </div>
                <Button 
                  variant="icon" 
                  onClick={onClose} 
                  aria-label="Close modal"
                  className="modal-close-btn"
                >
                  <X size={18} />
                </Button>
              </div>
            )}
            <div className="modal-body">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};