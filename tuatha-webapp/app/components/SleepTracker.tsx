'use client';

import React from 'react';
import { FaMoon, FaBed, FaClock, FaRegMoon, FaRegStar } from 'react-icons/fa';
import { IoMdMoon } from 'react-icons/io';
import styles from './SleepTracker.module.css';

interface SleepPhase {
  type: 'deep' | 'light' | 'rem' | 'awake';
  startTime: string;
  duration: number; // en minutes
}

interface SleepTrackerProps {
  targetSleep?: number; // Objectif de sommeil en heures
  sleepScore?: number; // Score qualité sommeil sur 100
}

const SleepTracker: React.FC<SleepTrackerProps> = ({
  targetSleep = 8,
  sleepScore = 78
}) => {
  // Données de sommeil simulées
  const bedTime = "22:45";
  const wakeTime = "06:30";
  const totalSleepHours = 7.75;
  const totalSleepMinutes = totalSleepHours * 60;
  const deepSleepPercent = 22;
  const lightSleepPercent = 55;
  const remSleepPercent = 18;
  const awakeSleepPercent = 5;

  // Phases de sommeil simulées (pour le graphique)
  const sleepPhases: SleepPhase[] = [
    { type: 'light', startTime: '22:55', duration: 32 },
    { type: 'deep', startTime: '23:27', duration: 45 },
    { type: 'light', startTime: '00:12', duration: 35 },
    { type: 'rem', startTime: '00:47', duration: 28 },
    { type: 'light', startTime: '01:15', duration: 65 },
    { type: 'deep', startTime: '02:20', duration: 58 },
    { type: 'light', startTime: '03:18', duration: 42 },
    { type: 'rem', startTime: '04:00', duration: 22 },
    { type: 'light', startTime: '04:22', duration: 36 },
    { type: 'deep', startTime: '04:58', duration: 32 },
    { type: 'awake', startTime: '05:30', duration: 4 },
    { type: 'light', startTime: '05:34', duration: 40 },
    { type: 'rem', startTime: '06:14', duration: 16 }
  ];

  // Calculer le pourcentage de l'objectif atteint
  const targetSleepMinutes = targetSleep * 60;
  const sleepGoalPercent = Math.min(100, Math.round((totalSleepMinutes / targetSleepMinutes) * 100));

  // Déterminer la qualité du sommeil basée sur le score
  const getSleepQuality = (score: number) => {
    if (score >= 85) return { text: 'Excellent', color: '#3498db' };
    if (score >= 70) return { text: 'Bon', color: '#2ecc71' };
    if (score >= 50) return { text: 'Moyen', color: '#f39c12' };
    if (score >= 30) return { text: 'Médiocre', color: '#e67e22' };
    return { text: 'Mauvais', color: '#e74c3c' };
  };

  const sleepQuality = getSleepQuality(sleepScore);

  return (
    <div className={styles.sleepWidget}>
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitle}>
          <IoMdMoon className={styles.sleepIcon} />
          <h3>Qualité du Sommeil</h3>
        </div>
      </div>
      
      <div className={styles.widgetContent}>
        <div className={styles.scoreCircleContainer}>
          {/* Cercle du score de sommeil */}
          <div className={styles.scoreCircle}>
            <svg viewBox="0 0 120 120" className={styles.scoreSvg}>
              {/* Cercle de fond */}
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                fill="rgba(0, 17, 13, 0.5)" 
                stroke="rgba(255, 255, 255, 0.05)" 
                strokeWidth="2"
              />
              
              {/* Cercle de progression */}
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                fill="none" 
                stroke={sleepQuality.color} 
                strokeWidth="6" 
                strokeDasharray={2 * Math.PI * 54} 
                strokeDashoffset={(2 * Math.PI * 54) * (1 - sleepScore / 100)} 
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                className={styles.scoreProgress}
              />
              
              {/* Valeur du score */}
              <text 
                x="60" 
                y="52" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className={styles.scoreValue}
              >
                {sleepScore}
              </text>
              
              {/* Label du score */}
              <text 
                x="60" 
                y="70" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className={styles.scoreLabel}
              >
                Score
              </text>
            </svg>
            
            {/* Label de qualité */}
            <div className={styles.qualityLabel} style={{ color: sleepQuality.color }}>
              {sleepQuality.text}
            </div>
          </div>
          
          {/* Statistiques de base - horizontalement */}
          <div className={styles.horizontalStatsContainer}>
            <div className={styles.horizontalStatItem}>
              <div className={styles.statIcon}><FaBed /></div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Couché</span>
                <span className={styles.statValue}>{bedTime}</span>
              </div>
            </div>
            
            <div className={styles.horizontalStatItem}>
              <div className={styles.statIcon}><FaClock /></div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Durée</span>
                <span className={styles.statValue}>
                  {Math.floor(totalSleepHours)}h{Math.round((totalSleepHours % 1) * 60)}
                </span>
              </div>
            </div>
            
            <div className={styles.horizontalStatItem}>
              <div className={styles.statIcon}><FaRegMoon /></div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Réveil</span>
                <span className={styles.statValue}>{wakeTime}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Graphique des phases de sommeil */}
        <div className={styles.sleepPhasesGraph}>
          <div className={styles.phaseHeader}>
            <h4>Cycles de sommeil</h4>
            <div className={styles.phasePercentContainer}>
              <div className={styles.phasePercent}>
                <span className={styles.phasePercentValue}>{deepSleepPercent}%</span>
                <span className={styles.phasePercentLabel}>Profond</span>
              </div>
              <div className={styles.phasePercent}>
                <span className={styles.phasePercentValue}>{lightSleepPercent}%</span>
                <span className={styles.phasePercentLabel}>Léger</span>
              </div>
              <div className={styles.phasePercent}>
                <span className={styles.phasePercentValue}>{remSleepPercent}%</span>
                <span className={styles.phasePercentLabel}>Paradoxal</span>
              </div>
            </div>
          </div>
          
          <div className={styles.phasesVisual}>
            {sleepPhases.map((phase, index) => (
              <div 
                key={index}
                className={`${styles.phaseBlock} ${styles[phase.type + 'Phase']}`}
                style={{ 
                  width: `${(phase.duration / totalSleepMinutes) * 100}%`,
                  height: phase.type === 'deep' ? '100%' : 
                          phase.type === 'light' ? '70%' : 
                          phase.type === 'rem' ? '85%' : '40%' 
                }}
                title={`${phase.type}: ${phase.startTime} (${phase.duration} min)`}
              />
            ))}
          </div>
          
          <div className={styles.timeLabels}>
            <span>23h</span>
            <span>1h</span>
            <span>3h</span>
            <span>5h</span>
            <span>7h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepTracker;
