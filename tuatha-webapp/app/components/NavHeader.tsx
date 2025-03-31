'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavHeader.module.css';

const NavHeader: React.FC = () => {
  const pathname = usePathname();
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
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <header className={styles.header}>
      {/* Barre d'état mobile stylisée */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <div className={styles.time}>{currentTime}</div>
        </div>
        <div className={styles.statusNotch}></div>
        <div className={styles.statusRight}>
          <div className={styles.cellular}>
            <svg width="18" height="12" viewBox="0 0 18 12" fill="white">
              <path d="M1 8.5H3V11.5H1V8.5ZM5 6H7V11.5H5V6ZM9 3.5H11V11.5H9V3.5ZM13 1H15V11.5H13V1Z" />
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
          <div className={`${styles.navItem} ${pathname === '/mespros' ? styles.active : ''}`}>
            Mes Pros
          </div>
        </Link>
        <Link href="/mesrdv">
          <div className={`${styles.navItem} ${pathname === '/mesrdv' ? styles.active : ''}`}>
            Mes RDV
          </div>
        </Link>
        <Link href="/majournee">
          <div className={`${styles.navItem} ${pathname === '/majournee' ? styles.active : ''}`}>
            Ma Journée
          </div>
        </Link>
      </nav>
    </header>
  );
};

export default NavHeader;
