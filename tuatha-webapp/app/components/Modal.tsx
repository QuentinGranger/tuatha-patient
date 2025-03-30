'use client';

import { IoClose } from 'react-icons/io5';
import styles from './Modal.module.css';

// Composant pour le dialogue modal
export function Modal({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fermer"
          >
            <IoClose />
          </button>
        </div>
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
