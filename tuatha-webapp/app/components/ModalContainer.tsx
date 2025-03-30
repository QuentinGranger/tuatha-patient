'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ModalContainer.module.css';

interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalContainer({ isOpen, onClose, children }: ModalContainerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      // Bloquer le scroll quand la modale est ouverte
      document.body.style.overflow = 'hidden';
      // Ajouter écouteur clavier pour fermer avec Escape
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      // Restaurer le scroll quand la modale est fermée
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Ne rien rendre si la modale est fermée ou si on est côté serveur
  if (!isOpen || !isMounted) return null;
  
  // Utiliser createPortal pour rendre la modale au niveau du body
  return createPortal(
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
