'use client';

import { BsArrowUp, BsArrowDown, BsFunnel } from 'react-icons/bs';
import styles from './AppointmentManager.module.css';

// Filtre et tri pour les rendez-vous
export function AppointmentFilters({
  filter,
  setFilter,
  sortBy,
  setSortBy
}: {
  filter: string;
  setFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}) {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filters}>
        <span className={styles.filterLabel}>Statut :</span>
        <button
          className={`${styles.filterOption} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          Tous
        </button>
        <button
          className={`${styles.filterOption} ${filter === 'upcoming' ? styles.active : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          À venir
        </button>
        <button
          className={`${styles.filterOption} ${filter === 'past' ? styles.active : ''}`}
          onClick={() => setFilter('past')}
        >
          Passés
        </button>
        <button
          className={`${styles.filterOption} ${filter === 'canceled' ? styles.active : ''}`}
          onClick={() => setFilter('canceled')}
        >
          Annulés
        </button>
      </div>
      
      <div className={styles.filters}>
        <span className={styles.filterLabel}>Tri :</span>
        <button
          className={`${styles.filterOption} ${sortBy === 'date-asc' ? styles.active : ''}`}
          onClick={() => setSortBy('date-asc')}
        >
          <BsArrowUp size={12} />
          Date
        </button>
        <button
          className={`${styles.filterOption} ${sortBy === 'date-desc' ? styles.active : ''}`}
          onClick={() => setSortBy('date-desc')}
        >
          <BsArrowDown size={12} />
          Date
        </button>
        <button
          className={`${styles.filterOption} ${sortBy === 'duration-asc' ? styles.active : ''}`}
          onClick={() => setSortBy('duration-asc')}
        >
          <BsArrowUp size={12} />
          Durée
        </button>
        <button
          className={`${styles.filterOption} ${sortBy === 'duration-desc' ? styles.active : ''}`}
          onClick={() => setSortBy('duration-desc')}
        >
          <BsArrowDown size={12} />
          Durée
        </button>
      </div>
    </div>
  );
}

export default AppointmentFilters;
