'use client';

import React, { useState } from 'react';
import { FaMoon, FaBed, FaChevronDown, FaChevronUp, FaClock, FaRegMoon, FaRegStar } from 'react-icons/fa';
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
  const [expanded, setExpanded] = useState(false);

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

  // Décompresser les phases de sommeil pour le graphique
  const getPhaseColorClass = (type: string) => {
    switch (type) {
      case 'deep': return styles.deepSleep;
      case 'light': return styles.lightSleep;
      case 'rem': return styles.remSleep;
      case 'awake': return styles.awakeSleep;
      default: return '';
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Rendu du cercle de score de sommeil
  const renderSleepScoreCircle = () => {
    const circumference = 2 * Math.PI * 45; // rayon de 45
    const dashOffset = (circumference * (1 - sleepScore / 100)).toString();
    const scoreColor = sleepQuality.color;

    return (
      <div className={styles.sleepScoreContainer}>
        <svg width="100%" height="100%" viewBox="0 0 120 120" className={styles.sleepScoreSvg}>
          {/* Cercle de fond */}
          <circle 
            cx="60" 
            cy="60" 
            r="45" 
            fill="rgba(0, 17, 13, 0.5)" 
            stroke="rgba(255, 255, 255, 0.05)" 
            strokeWidth="2"
          />
          
          {/* Cercle de progression */}
          <circle 
            cx="60" 
            cy="60" 
            r="45" 
            fill="none" 
            stroke={scoreColor} 
            strokeWidth="6" 
            strokeDasharray={circumference} 
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            className={styles.scoreProgress}
          />
          
          {/* Score et label */}
          <text 
            x="60" 
            y="55" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className={styles.scoreValue}
          >
            {sleepScore}
          </text>
          <text 
            x="60" 
            y="75" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className={styles.scoreLabel}
          >
            Score
          </text>
        </svg>
        
        <div className={styles.qualityLabel} style={{ color: scoreColor }}>
          {sleepQuality.text}
        </div>
      </div>
    );
  };

  // Rendu des statistiques de sommeil
  const renderSleepStats = () => {
    return (
      <div className={styles.sleepStats}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <FaBed />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Couché</span>
            <span className={styles.statValue}>{bedTime}</span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <FaClock />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Durée</span>
            <span className={styles.statValue}>
              {Math.floor(totalSleepHours)}h{Math.round((totalSleepHours % 1) * 60)}
            </span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <FaRegMoon />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Réveil</span>
            <span className={styles.statValue}>{wakeTime}</span>
          </div>
        </div>
      </div>
    );
  };

  // Rendu de la répartition des phases de sommeil
  const renderSleepPhases = () => {
    return (
      <div className={styles.sleepPhasesContainer}>
        <div className={styles.phaseTitle}>Répartition du sommeil</div>
        
        <div className={styles.phasesList}>
          <div className={styles.phaseItem}>
            <div className={`${styles.phaseColor} ${styles.deepPhase}`}></div>
            <div className={styles.phaseName}>Sommeil profond</div>
            <div className={styles.phaseValue}>{deepSleepPercent}%</div>
            <div className={styles.phaseBar}>
              <div 
                className={`${styles.phaseProgress} ${styles.deepProgress}`}
                style={{ width: `${deepSleepPercent}%` }}
              ></div>
            </div>
          </div>
          
          <div className={styles.phaseItem}>
            <div className={`${styles.phaseColor} ${styles.lightPhase}`}></div>
            <div className={styles.phaseName}>Sommeil léger</div>
            <div className={styles.phaseValue}>{lightSleepPercent}%</div>
            <div className={styles.phaseBar}>
              <div 
                className={`${styles.phaseProgress} ${styles.lightProgress}`}
                style={{ width: `${lightSleepPercent}%` }}
              ></div>
            </div>
          </div>
          
          <div className={styles.phaseItem}>
            <div className={`${styles.phaseColor} ${styles.remPhase}`}></div>
            <div className={styles.phaseName}>Sommeil paradoxal</div>
            <div className={styles.phaseValue}>{remSleepPercent}%</div>
            <div className={styles.phaseBar}>
              <div 
                className={`${styles.phaseProgress} ${styles.remProgress}`}
                style={{ width: `${remSleepPercent}%` }}
              ></div>
            </div>
          </div>
          
          <div className={styles.phaseItem}>
            <div className={`${styles.phaseColor} ${styles.awakePhase}`}></div>
            <div className={styles.phaseName}>Éveillé</div>
            <div className={styles.phaseValue}>{awakeSleepPercent}%</div>
            <div className={styles.phaseBar}>
              <div 
                className={`${styles.phaseProgress} ${styles.awakeProgress}`}
                style={{ width: `${awakeSleepPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rendu du cycle de sommeil
  const renderSleepCycle = () => {
    return (
      <div className={styles.cycleContainer}>
        <div className={styles.cycleTitle}>Cycles de sommeil</div>
        
        <div className={styles.cycleChart}>
          <div className={styles.timeLabels}>
            <span>23h</span>
            <span>1h</span>
            <span>3h</span>
            <span>5h</span>
            <span>7h</span>
          </div>
          
          <div className={styles.cycleGraph}>
            {sleepPhases.map((phase, index) => (
              <div 
                key={index}
                className={`${styles.phaseBlock} ${getPhaseColorClass(phase.type)}`}
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
          
          <div className={styles.stageLegend}>
            <div className={styles.stageLabel} style={{ bottom: '90%' }}>Éveillé</div>
            <div className={styles.stageLabel} style={{ bottom: '70%' }}>Léger</div>
            <div className={styles.stageLabel} style={{ bottom: '40%' }}>Paradoxal</div>
            <div className={styles.stageLabel} style={{ bottom: '5%' }}>Profond</div>
          </div>
        </div>
      </div>
    );
  };

  // Rendu des suggestions pour améliorer le sommeil
  const renderSleepTips = () => {
    // Suggestions basées sur le score
    const tips = [
      "Maintenez des heures de sommeil régulières, même le week-end",
      "Évitez la caféine 6 heures avant le coucher",
      "Évitez les écrans 1 heure avant de dormir",
      "Assurez-vous que votre chambre est fraîche, sombre et calme"
    ];
    
    // Filtrer les suggestions selon le score
    if (sleepScore < 70) {
      tips.push("Essayez une routine relaxante avant le coucher");
      tips.push("Limitez l'alcool et les repas copieux le soir");
    }
    
    return (
      <div className={styles.tipsContainer}>
        <h4 className={styles.tipsTitle}>
          <FaRegStar className={styles.tipsIcon} />
          Recommandations
        </h4>
        <ul className={styles.tipsList}>
          {tips.map((tip, index) => (
            <li key={index} className={styles.tipItem}>{tip}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={styles.sleepTracker}>
      <div className={styles.header} onClick={toggleExpand}>
        <div className={styles.headerTitle}>
          <IoMdMoon className={styles.sleepIcon} />
          <h3>Suivi du Sommeil</h3>
        </div>
        
        <div className={styles.sleepSummary}>
          <span className={styles.sleepHours}>
            {Math.floor(totalSleepHours)}h{Math.round((totalSleepHours % 1) * 60)}
          </span>
          <span className={styles.goalPercent}>{sleepGoalPercent}%</span>
        </div>
        
        <button 
          className={styles.expandButton} 
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand();
          }}
        >
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      
      {expanded && (
        <div className={styles.contentExpanded}>
          <div className={styles.upperContent}>
            {renderSleepStats()}
            {renderSleepScoreCircle()}
          </div>
          
          {renderSleepPhases()}
          {renderSleepCycle()}
          {renderSleepTips()}
        </div>
      )}
    </div>
  );
};

export default SleepTracker;
