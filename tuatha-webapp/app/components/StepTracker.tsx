'use client';

import React, { useState, useEffect } from 'react';
import { FaShoePrints, FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaRunning, FaWalking, FaFire, FaTrophy } from 'react-icons/fa';
import styles from './StepTracker.module.css';

interface StepEntry {
  hour: number;
  steps: number;
  active: boolean; // Si l'utilisateur était actif pendant cette heure
}

interface StepTrackerProps {
  dailyGoal?: number;
  weight?: number; // en kg
  height?: number; // en cm
}

const StepTracker: React.FC<StepTrackerProps> = ({
  dailyGoal = 10000,
  weight = 70,
  height = 170
}) => {
  const [expanded, setExpanded] = useState(false);
  const [stepData, setStepData] = useState<StepEntry[]>([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [activeHours, setActiveHours] = useState(0);
  const [stepStreak, setStepStreak] = useState(5); // Jours consécutifs d'atteinte d'objectif

  // Génère des données de pas simulées
  useEffect(() => {
    const generateStepData = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const data: StepEntry[] = [];
      
      // Générer un pattern de pas réaliste pour chaque heure de la journée
      for (let hour = 0; hour < 24; hour++) {
        let baseSteps = 0;
        let isActive = false;
        
        if (hour < 7) {
          // Nuit, très peu de pas
          baseSteps = Math.round(Math.random() * 50);
          isActive = false;
        } else if (hour === 7 || hour === 8) {
          // Matin, préparation et trajet
          baseSteps = 500 + Math.round(Math.random() * 300);
          isActive = true;
        } else if (hour >= 9 && hour < 12) {
          // Travail du matin
          baseSteps = 200 + Math.round(Math.random() * 200);
          isActive = Math.random() > 0.5;
        } else if (hour >= 12 && hour < 14) {
          // Déjeuner et pause
          baseSteps = 600 + Math.round(Math.random() * 400);
          isActive = true;
        } else if (hour >= 14 && hour < 17) {
          // Travail de l'après-midi
          baseSteps = 300 + Math.round(Math.random() * 200);
          isActive = Math.random() > 0.4;
        } else if (hour === 18 || hour === 19) {
          // Sport ou promenade en soirée
          baseSteps = 1500 + Math.round(Math.random() * 1000);
          isActive = true;
        } else if (hour >= 20 && hour < 23) {
          // Soirée, activité modérée
          baseSteps = 400 + Math.round(Math.random() * 200);
          isActive = hour < 22;
        } else {
          // Fin de soirée
          baseSteps = 100 + Math.round(Math.random() * 100);
          isActive = false;
        }
        
        // Réduire les pas pour les heures futures
        if (hour > currentHour) {
          baseSteps = 0;
          isActive = false;
        }
        
        data.push({
          hour,
          steps: baseSteps,
          active: isActive
        });
      }
      
      return data;
    };
    
    const data = generateStepData();
    setStepData(data);
    
    // Calculer le total des pas
    const total = data.reduce((sum, entry) => sum + entry.steps, 0);
    setTotalSteps(total);
    
    // Calculer le nombre d'heures actives
    const active = data.filter(entry => entry.active).length;
    setActiveHours(active);
    
    // Calculer la distance approximative (pas moyen = 0.762m)
    const strideLength = height * 0.414 / 100; // En mètres
    const dist = (total * strideLength / 1000).toFixed(2);
    setDistance(parseFloat(dist));
    
    // Calculer les calories approximatives (0.04 kcal par pas par kg de poids)
    const cal = Math.round(total * 0.04 * (weight / 70));
    setCalories(cal);
  }, [height, weight]);

  const toggleExpand = () => {
    console.log("Toggling steps expanded state:", !expanded);
    setExpanded(!expanded);
  };

  // Calculer le pourcentage d'accomplissement de l'objectif
  const goalPercentage = Math.min(100, Math.round((totalSteps / dailyGoal) * 100));

  // Rendu des statistiques
  const renderStepStats = () => {
    return (
      <div className={styles.stepStats}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FaMapMarkerAlt /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Distance</span>
            <span className={styles.statValue}>{distance} km</span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FaFire /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Calories</span>
            <span className={styles.statValue}>{calories} kcal</span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FaWalking /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Heures actives</span>
            <span className={styles.statValue}>{activeHours} h</span>
          </div>
        </div>
      </div>
    );
  };

  // Rendu de la barre de progression de l'objectif
  const renderGoalProgress = () => {
    // Déterminer la couleur de la barre de progression
    let progressColor = styles.progressNormal;
    if (goalPercentage < 30) {
      progressColor = styles.progressLow;
    } else if (goalPercentage >= 100) {
      progressColor = styles.progressComplete;
    } else if (goalPercentage >= 70) {
      progressColor = styles.progressGood;
    }
    
    return (
      <div className={styles.goalContainer}>
        <div className={styles.goalHeader}>
          <div className={styles.goalInfo}>
            <h4 className={styles.goalTitle}>Objectif quotidien</h4>
            <div className={styles.goalValues}>
              <span className={styles.currentValue}>{totalSteps}</span>
              <span className={styles.goalSeparator}>/</span>
              <span className={styles.goalValue}>{dailyGoal}</span>
              <span className={styles.goalUnit}>pas</span>
            </div>
          </div>
          
          {goalPercentage >= 100 && (
            <div className={styles.goalAchieved}>
              <FaTrophy />
              <span className={styles.streakCount}>{stepStreak} jours</span>
            </div>
          )}
        </div>
        
        <div className={styles.progressBarContainer}>
          <div 
            className={`${styles.progressBar} ${progressColor}`}
            style={{ width: `${goalPercentage}%` }}
          >
            {goalPercentage >= 25 && (
              <span className={styles.progressText}>{goalPercentage}%</span>
            )}
          </div>
          {goalPercentage < 25 && (
            <span className={styles.progressTextOutside}>{goalPercentage}%</span>
          )}
        </div>
      </div>
    );
  };

  // Rendu du graphique des pas
  const renderStepsChart = () => {
    const maxSteps = Math.max(...stepData.map(entry => entry.steps), 1000);
    
    return (
      <div className={styles.chartContainer}>
        <div className={styles.chartTitle}>Répartition horaire des pas</div>
        <div className={styles.chart}>
          {stepData.map((entry, index) => {
            const height = Math.max(4, (entry.steps / maxSteps) * 150);
            return (
              <div key={index} className={styles.barContainer}>
                <div className={styles.barValue}>
                  {entry.steps > 0 && entry.steps}
                </div>
                <div 
                  className={`${styles.bar} ${entry.active ? styles.activeBar : styles.inactiveBar}`}
                  style={{ height: `${height}px` }}
                ></div>
                <div className={styles.barLabel}>
                  {entry.hour}h
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Rendu des badges et récompenses
  const renderAchievements = () => {
    const achievements = [
      { name: 'Lève-tôt', icon: <FaRunning />, description: 'Plus de 1000 pas avant 8h', achieved: true },
      { name: 'Marcheur actif', icon: <FaWalking />, description: `${goalPercentage}% de l'objectif atteint`, achieved: goalPercentage >= 50 },
      { name: 'Streak', icon: <FaTrophy />, description: `${stepStreak} jours d'affilée`, achieved: stepStreak >= 3 },
      { name: 'Marathon', icon: <FaMapMarkerAlt />, description: `${distance} km parcourus`, achieved: distance >= 5 },
    ];
    
    return (
      <div className={styles.achievementsContainer}>
        <h4 className={styles.achievementsTitle}>Badges et récompenses</h4>
        <div className={styles.achievementsList}>
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className={`${styles.achievementItem} ${achievement.achieved ? styles.achievementAchieved : styles.achievementLocked}`}
            >
              <div className={styles.achievementIcon}>
                {achievement.icon}
              </div>
              <div className={styles.achievementInfo}>
                <span className={styles.achievementName}>{achievement.name}</span>
                <span className={styles.achievementDescription}>{achievement.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.stepTracker}>
      <div className={styles.header} onClick={toggleExpand}>
        <div className={styles.headerTitle}>
          <FaShoePrints className={styles.stepsIcon} />
          <h3>Suivi des Pas</h3>
        </div>
        
        <div className={styles.currentSteps}>
          <span className={styles.stepsValue}>{totalSteps}</span>
          <span className={styles.stepsUnit}>pas</span>
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
          {renderStepStats()}
          {renderGoalProgress()}
          {renderStepsChart()}
          {renderAchievements()}
        </div>
      )}
    </div>
  );
};

export default StepTracker;
