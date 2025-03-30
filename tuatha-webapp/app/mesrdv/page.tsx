'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function MesRDV() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Mettre à jour l'heure actuelle
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.container}>
      {/* Barre d'état */}
      <div className={styles.statusBar}>
        <div className={styles.time}>{currentTime}</div>
        <div className={styles.icons}>
          <div className={styles.signal}>
            <svg width="14" height="12" viewBox="0 0 14 12" fill="white">
              <path d="M1 8.5H3V11.5H1V8.5ZM4 6H6V11.5H4V6ZM7 3.5H9V11.5H7V3.5ZM10 1H12V11.5H10V1Z" />
            </svg>
          </div>
          <div className={styles.wifi}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
              <path d="M7.99992 9.5C8.82826 9.5 9.49992 10.1716 9.49992 11C9.49992 11.8284 8.82826 12.5 7.99992 12.5C7.17157 12.5 6.49992 11.8284 6.49992 11C6.49992 10.1716 7.17157 9.5 7.99992 9.5ZM3.5999 6.55C5.42847 4.9383 8.57136 4.9383 10.3999 6.55C10.7999 6.9 11.3999 6.9 11.7999 6.5C12.1999 6.1 12.1999 5.5 11.7999 5.1C9.18847 2.83333 4.81133 2.83333 2.1999 5.1C1.7999 5.5 1.7999 6.1 2.1999 6.5C2.5999 6.9 3.1999 6.9 3.5999 6.55ZM0.899902 3.85C4.29043 0.783333 11.7094 0.783333 15.0999 3.85C15.4999 4.25 15.4999 4.85 15.0999 5.25C14.6999 5.65 14.0999 5.65 13.6999 5.25C11.0094 2.85 5.0094 2.85 2.29992 5.25C1.89992 5.65 1.29992 5.65 0.899902 5.25C0.499902 4.85 0.499902 4.25 0.899902 3.85Z" />
            </svg>
          </div>
          <div className={styles.battery}>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="white">
              <path d="M3 3C3 1.89543 3.89543 1 5 1H18C19.1046 1 20 1.89543 20 3V9C20 10.1046 19.1046 11 18 11H5C3.89543 11 3 10.1046 3 9V3Z" fill="none" stroke="white" />
              <path d="M21 4V8C21.8047 7.66122 22.328 6.87313 22.328 6C22.328 5.12687 21.8047 4.33878 21 4Z" />
              <rect x="4" y="2" width="15" height="8" rx="1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <Link href="/mespros">
          <div className={styles.navItem}>Mes Pros</div>
        </Link>
        <Link href="/mesrdv">
          <div className={`${styles.navItem} ${styles.active}`}>Mes RDV</div>
        </Link>
        <Link href="/majournee">
          <div className={styles.navItem}>Ma Journée</div>
        </Link>
      </nav>

      {/* En-tête et titre */}
      <div className={styles.header}>
        <div className={styles.greetingContainer}>
          <div className={styles.greeting}>
            <h2>Mes Rendez-vous</h2>
            <p>Consultez et gérez vos rendez-vous</p>
          </div>
          <div className={styles.headerIcons}>
            <button className={styles.iconButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M21 6.5C21 8.43 19.43 10 17.5 10S14 8.43 14 6.5 15.57 3 17.5 3 21 4.57 21 6.5zm-2 0C19 5.67 18.33 5 17.5 5S16 5.67 16 6.5 16.67 8 17.5 8 19 7.33 19 6.5z"/>
                <path d="M11.6 14.93c1.13.07 2.29.21 3.4.53V11.5c0-.85.5-1.59 1.22-1.92-.74-.22-1.64-.56-2.72-.56-1.41 0-2.56.82-3.11 2-.33.07-.6.15-.92.22-.17.04-.36.08-.52.11-.3.07-.61.14-.86.27-.01 0-.02 0-.03.01-.31.15-.6.36-.84.64-.62.71-.97 1.63-.97 2.58v4.15c0 .83.67 1.5 1.5 1.5h6.75c-.71-.89-1.21-1.83-1.5-2.73-.58-.21-1.15-.34-1.76-.44v-1.4c.13-.01.26-.02.36-.02z"/>
                <path d="M10.08 14.2C9.44 14.2 8.9 14.75 8.9 15.39v4.3c0 .64.54 1.19 1.18 1.19H17c.64 0 1.18-.55 1.18-1.19v-4.3c0-.64-.54-1.19-1.18-1.19h-6.92z"/>
                <path d="m12.18 6.36-4.5 8.1c-.26.46-.12 1.06.33 1.32.15.09.32.13.5.13.34 0 .66-.17.82-.47l4.5-8.1c.26-.46.12-1.06-.33-1.32-.45-.25-1.05-.11-1.32.34z"/>
                <path d="M7.62 15.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-1.5-.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/>
                <path d="M7.62 10.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-1.5-.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/>
                <path d="M7.62 5.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-1.5-.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/>
              </svg>
            </button>
            <button className={styles.iconButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19.5 3h-15C3.12 3 2 4.12 2 5.5v11c0 1.39 1.11 2.5 2.5 2.5h4c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H7v-2h10v2h-4c-.28 0-2.5.22-2.5.5s2.22.5 2.5.5h6.5c1.38 0 2.5-1.12 2.5-2.5v-11C22 4.12 20.88 3 19.5 3zM20 17c0 .28-.22.5-.5.5H19v-2H5v2h-.5c-.28 0-.5-.22-.5-.5v-3h16v3zm0-4H4V5.5c0-.28.22-.5.5-.5h15c.27 0 .5.22.5.5V13z"/>
                <path d="M8.47 9.92c.33.13.73-.05.86-.39.12-.34-.05-.73-.39-.86-1.07-.42-2.3-.42-3.38 0-.32.13-.5.52-.36.85.1.25.35.41.6.41.08 0 .16-.02.23-.05.76-.3 1.7-.3 2.44 0zM18.44 8.67c-1.07-.42-2.3-.42-3.38 0-.34.13-.51.51-.39.85.14.34.52.51.86.39.76-.3 1.7-.3 2.44 0 .08.03.16.05.24.05.25 0 .49-.16.59-.4.14-.33-.04-.72-.36-.89z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu vide */}
      <div className={styles.emptyContent}>
        <div className={styles.emptyIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white" opacity="0.6">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7zm0 4h7v2H7z"/>
          </svg>
        </div>
        <h3 className={styles.emptyText}>Aucun rendez-vous programmé</h3>
        <p className={styles.emptySubtext}>Vos prochains rendez-vous avec vos professionnels apparaîtront ici</p>
      </div>
    </main>
  );
}
