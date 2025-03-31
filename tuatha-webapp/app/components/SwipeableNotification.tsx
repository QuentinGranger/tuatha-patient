'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiUser, FiCheck, FiX } from 'react-icons/fi';
import styles from './SwipeableNotification.module.css';

interface SwipeableNotificationProps {
  title: string;
  text: string;
  time: string;
  onAccept: () => void;
  onReject: () => void;
  status?: 'pending' | 'accepted' | 'rejected';
}

const SwipeableNotification: React.FC<SwipeableNotificationProps> = ({
  title,
  text,
  time,
  onAccept,
  onReject,
  status = 'pending'
}) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Seuils de décision pour accepter/refuser
  const swipeThreshold = 100;

  // Réinitialiser la position lorsque le composant est monté/démonté
  useEffect(() => {
    return () => {
      setCurrentX(0);
      setIsDragging(false);
    };
  }, []);

  // Gestionnaires d'événements pour le swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (status !== 'pending') return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || status !== 'pending') return;
    const newX = e.touches[0].clientX - startX;
    setCurrentX(newX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || status !== 'pending') return;
    
    setIsDragging(false);
    
    // Si le swipe est suffisamment long vers la droite => accepter
    if (currentX > swipeThreshold) {
      onAccept();
    }
    // Si le swipe est suffisamment long vers la gauche => refuser
    else if (currentX < -swipeThreshold) {
      onReject();
    }
    // Sinon, retour à la position initiale
    else {
      setCurrentX(0);
    }
  };

  // Même logique pour la souris (desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (status !== 'pending') return;
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || status !== 'pending') return;
    const newX = e.clientX - startX;
    setCurrentX(newX);
  };

  const handleMouseUp = () => {
    handleTouchEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleTouchEnd();
    }
  };

  // Calculer l'opacité des indicateurs en fonction de la position
  const acceptOpacity = Math.min(currentX / swipeThreshold, 1);
  const rejectOpacity = Math.min(-currentX / swipeThreshold, 1);
  
  // Déterminer la classe CSS en fonction du statut
  let statusClass = '';
  if (status === 'accepted') {
    statusClass = styles.notificationAccepted;
  } else if (status === 'rejected') {
    statusClass = styles.notificationRejected;
  }

  return (
    <div className={styles.swipeableNotificationContainer}>
      {/* Indicateur d'action à gauche (refuser) */}
      {status === 'pending' && (
        <div 
          className={`${styles.actionIndicator} ${styles.rejectIndicator}`}
          style={{ opacity: rejectOpacity }}
        >
          <FiX size={24} />
        </div>
      )}
      
      {/* Indicateur d'action à droite (accepter) */}
      {status === 'pending' && (
        <div 
          className={`${styles.actionIndicator} ${styles.acceptIndicator}`}
          style={{ opacity: acceptOpacity }}
        >
          <FiCheck size={24} />
        </div>
      )}
      
      {/* La notification elle-même */}
      <div 
        ref={notificationRef}
        className={`${styles.notificationItem} ${statusClass}`}
        style={{ 
          transform: status === 'pending' ? `translateX(${currentX}px)` : 'translateX(0)',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out, background-color 0.3s ease, border-color 0.3s ease'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.notificationIcon}>
          <FiUser size={14} />
        </div>
        <div className={styles.notificationContent}>
          <p className={styles.notificationTitle}>{title}</p>
          <p className={styles.notificationText}>{text}</p>
          <p className={styles.notificationTime}>
            {status === 'pending' ? time : (status === 'accepted' ? 'Accepté' : 'Refusé')}
          </p>
        </div>
        
        {/* Icônes de statut */}
        {status === 'accepted' && (
          <div className={styles.statusIcon}>
            <FiCheck size={18} />
          </div>
        )}
        {status === 'rejected' && (
          <div className={styles.statusIcon}>
            <FiX size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeableNotification;
