import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.buttonsContainer}>
        <h1 className={styles.title}>Tuatha</h1>
        <p className={styles.subtitle}>Votre application de santé</p>
        
        <Link href="/mespros">
          <button className={styles.mobileButton}>
            Mes Pros
          </button>
        </Link>
        
        <Link href="/mesrdv">
          <button className={styles.mobileButton}>
            Mes RDV
          </button>
        </Link>
        
        <Link href="/majournee">
          <button className={styles.mobileButton}>
            Ma Journée
          </button>
        </Link>
      </div>
    </div>
  );
}
