'use client';

import { BsExclamationCircle, BsX } from 'react-icons/bs';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'warning' | 'error' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={`${styles.dialogContainer} ${styles[type]}`}>
        <div className={styles.dialogHeader}>
          <h3>{title}</h3>
          <button 
            className={styles.closeButton}
            onClick={onCancel}
            aria-label="Fermer"
          >
            <BsX size={20} />
          </button>
        </div>
        
        <div className={styles.dialogContent}>
          <div className={styles.iconContainer}>
            <BsExclamationCircle size={32} />
          </div>
          <p>{message}</p>
        </div>
        
        <div className={styles.dialogActions}>
          <button 
            className={styles.cancelButton}
            onClick={onCancel}
          >
            {cancelButtonText}
          </button>
          <button 
            className={`${styles.confirmButton} ${styles[type]}`}
            onClick={onConfirm}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
