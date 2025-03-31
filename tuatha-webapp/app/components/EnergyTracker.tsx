'use client';

import React, { useState, useEffect } from 'react';
import { FaFire, FaChevronDown, FaChevronUp, FaRunning, FaWalking, FaBed, FaBrain, FaUtensils } from 'react-icons/fa';
import styles from './EnergyTracker.module.css';

interface Activity {
  id: number;
  name: string;
  type: 'rest' | 'daily' | 'exercise' | 'work' | 'meal';
  duration: number; // En minutes
  caloriesBurned: number;
  icon: React.ReactNode;
  time: string;
  intensity?: 'low' | 'medium' | 'high';
  details?: string;
  met?: number; // Metabolic Equivalent of Task - mesure l'intensité d'une activité
  heartRateAvg?: number; // Fréquence cardiaque moyenne pendant l'activité
}

interface EnergyTrackerProps {
  bmr?: number; // Métabolisme de base
  weight?: number; // en kg
}

const EnergyTracker: React.FC<EnergyTrackerProps> = ({
  bmr = 1600, // Métabolisme de base par défaut
  weight = 70 // Poids par défaut
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [caloriesByCategory, setCaloriesByCategory] = useState({
    rest: 0,
    daily: 0,
    exercise: 0,
    work: 0,
    meal: 0
  });

  // Génère des données d'activité simulées
  useEffect(() => {
    const generateActivities = () => {
      const now = new Date();
      const activities: Activity[] = [
        {
          id: 1,
          name: 'Sommeil',
          type: 'rest',
          duration: 480, // 8 heures
          caloriesBurned: Math.round((bmr / 24) * 8), // Calories brûlées pendant le sommeil
          icon: <FaBed />,
          time: '00:00 - 08:00',
          intensity: 'low',
          details: 'Sommeil profond: 3h20, Sommeil léger: 4h40',
          met: 0.95,
          heartRateAvg: 58
        },
        {
          id: 2,
          name: 'Petit déjeuner',
          type: 'meal',
          duration: 20,
          caloriesBurned: Math.round((bmr / 24) * 0.33 * 1.1), // Thermogenèse alimentaire
          icon: <FaUtensils />,
          time: '08:15 - 08:35',
          intensity: 'low',
          details: 'Avoine, fruits, yaourt protéiné',
          met: 1.5,
          heartRateAvg: 65
        },
        {
          id: 3,
          name: 'Travail (bureau)',
          type: 'work',
          duration: 240, // 4 heures
          caloriesBurned: Math.round((bmr / 24) * 4 * 1.2), // Travail sédentaire
          icon: <FaBrain />,
          time: '09:00 - 13:00',
          intensity: 'low',
          details: 'Travail sédentaire avec 2 réunions',
          met: 1.3,
          heartRateAvg: 72
        },
        {
          id: 4,
          name: 'Déjeuner',
          type: 'meal',
          duration: 45,
          caloriesBurned: Math.round((bmr / 24) * 0.75 * 1.1), // Thermogenèse alimentaire
          icon: <FaUtensils />,
          time: '13:00 - 13:45',
          intensity: 'low',
          details: 'Poulet, légumes, riz complet',
          met: 1.5,
          heartRateAvg: 68
        },
        {
          id: 5,
          name: 'Travail (bureau)',
          type: 'work',
          duration: 240, // 4 heures
          caloriesBurned: Math.round((bmr / 24) * 4 * 1.2), // Travail sédentaire
          icon: <FaBrain />,
          time: '14:00 - 18:00',
          intensity: 'low',
          details: 'Travail sur ordinateur avec pauses actives',
          met: 1.3,
          heartRateAvg: 75
        },
        {
          id: 6,
          name: 'Marche',
          type: 'daily',
          duration: 30,
          caloriesBurned: Math.round(weight * 0.063 * 30), // Formule approximative pour la marche
          icon: <FaWalking />,
          time: '18:10 - 18:40',
          intensity: 'medium',
          details: 'Marche active en extérieur, 2.5km',
          met: 3.5,
          heartRateAvg: 95
        },
        {
          id: 7,
          name: 'Course à pied',
          type: 'exercise',
          duration: 45,
          caloriesBurned: Math.round(weight * 0.12 * 45), // Formule approximative pour la course
          icon: <FaRunning />,
          time: '19:00 - 19:45',
          intensity: 'high',
          details: 'Jogging avec intervalles, 5.5km',
          met: 8.5,
          heartRateAvg: 145
        },
        {
          id: 8,
          name: 'Dîner',
          type: 'meal',
          duration: 60,
          caloriesBurned: Math.round((bmr / 24) * 1 * 1.1), // Thermogenèse alimentaire
          icon: <FaUtensils />,
          time: '20:00 - 21:00',
          intensity: 'low',
          details: 'Saumon, légumes verts, patate douce',
          met: 1.5,
          heartRateAvg: 70
        },
        {
          id: 9,
          name: 'Repos/loisirs',
          type: 'rest',
          duration: 120, // 2 heures
          caloriesBurned: Math.round((bmr / 24) * 2 * 1.1), // Activité légère
          icon: <FaBed />,
          time: '21:00 - 23:00',
          intensity: 'low',
          details: 'Lecture et télévision',
          met: 1.2,
          heartRateAvg: 62
        }
      ];
      
      return activities;
    };
    
    const generatedActivities = generateActivities();
    setActivities(generatedActivities);
    
    // Calculer les calories totales brûlées
    const total = generatedActivities.reduce((sum, activity) => sum + activity.caloriesBurned, 0);
    setTotalCaloriesBurned(total);
    
    // Calculer les calories par catégorie
    const byCategory = {
      rest: 0,
      daily: 0,
      exercise: 0,
      work: 0,
      meal: 0
    };
    
    generatedActivities.forEach(activity => {
      byCategory[activity.type] += activity.caloriesBurned;
    });
    
    setCaloriesByCategory(byCategory);
  }, [bmr, weight]);

  const toggleExpand = () => {
    console.log("Toggling energy expanded state:", !expanded);
    setExpanded(!expanded);
  };

  // Calcul du pourcentage par catégorie
  const getCategoryPercentage = (type: 'rest' | 'daily' | 'exercise' | 'work' | 'meal') => {
    return Math.round((caloriesByCategory[type] / totalCaloriesBurned) * 100);
  };

  // Rendu des statistiques quotidiennes d'énergie
  const renderEnergyStats = () => {
    return (
      <div className={styles.energyStats}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FaFire /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total brûlé</span>
            <span className={styles.statValue}>{totalCaloriesBurned} kcal</span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FaBed /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Métabolisme de base</span>
            <span className={styles.statValue}>{bmr} kcal</span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FaRunning /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Exercice</span>
            <span className={styles.statValue}>{caloriesByCategory.exercise} kcal</span>
          </div>
        </div>
      </div>
    );
  };

  // Rendu du graphique circulaire
  const renderEnergyChart = () => {
    // Couleurs pour chaque catégorie
    const colors = {
      rest: '#3498db',
      daily: '#2ecc71',
      exercise: '#e74c3c',
      work: '#f39c12',
      meal: '#9b59b6'
    };
    
    // Calculer les angles pour le graphique circulaire
    let currentAngle = 0;
    const segments = Object.entries(caloriesByCategory).map(([type, calories]) => {
      const percentage = (calories / totalCaloriesBurned) * 100;
      const angle = 3.6 * percentage; // 3.6 degrés par pourcentage (360 / 100)
      
      const segment = {
        type,
        percentage,
        color: colors[type as keyof typeof colors],
        startAngle: currentAngle,
        endAngle: currentAngle + angle
      };
      
      currentAngle += angle;
      return segment;
    });
    
    return (
      <div className={styles.energyChartContainer}>
        <div className={styles.pieChart}>
          {segments.map((segment, index) => (
            <div
              key={index}
              className={styles.pieSegment}
              style={{
                backgroundColor: segment.color,
                transform: `rotate(${segment.startAngle}deg)`,
                clipPath: `polygon(50% 50%, 50% 0%, ${segment.endAngle - segment.startAngle > 180 ? '0% 0%, 0% 100%, 100% 100%, 100% 0%,' : ''} ${50 + 50 * Math.cos((segment.endAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((segment.endAngle * Math.PI) / 180)}%)`
              }}
            ></div>
          ))}
          <div className={styles.pieCenter}>
            <span className={styles.pieTotal}>{totalCaloriesBurned}</span>
            <span className={styles.pieUnit}>kcal</span>
          </div>
        </div>
        
        <div className={styles.chartLegend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: colors.rest }}></div>
            <span className={styles.legendLabel}>Repos ({getCategoryPercentage('rest')}%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: colors.daily }}></div>
            <span className={styles.legendLabel}>Activités quotidiennes ({getCategoryPercentage('daily')}%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: colors.exercise }}></div>
            <span className={styles.legendLabel}>Exercice ({getCategoryPercentage('exercise')}%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: colors.work }}></div>
            <span className={styles.legendLabel}>Travail ({getCategoryPercentage('work')}%)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: colors.meal }}></div>
            <span className={styles.legendLabel}>Digestion ({getCategoryPercentage('meal')}%)</span>
          </div>
        </div>
      </div>
    );
  };

  // Rendu de la liste des activités
  const renderActivitiesList = () => {
    return (
      <div className={styles.activitiesContainer}>
        <h4 className={styles.activitiesTitle}>Détail des activités</h4>
        <div className={styles.activitiesList}>
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className={`${styles.activityItem} ${styles[`${activity.type}Activity`]} ${styles[`${activity.intensity}Intensity`]}`}
            >
              <div className={styles.activityTime}>
                <span className={styles.timeText}>{activity.time}</span>
                <span className={styles.durationBadge}>{activity.duration} min</span>
              </div>
              
              <div className={styles.activityContent}>
                <div className={styles.activityLeftPart}>
                  <div className={styles.activityIcon}>{activity.icon}</div>
                  <div className={styles.activityInfo}>
                    <span className={styles.activityName}>{activity.name}</span>
                    <span className={styles.activityDetails}>{activity.details}</span>
                    <div className={styles.activityMetrics}>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>MET</span>
                        <span className={styles.metricValue}>{activity.met}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span className={styles.metricLabel}>FC</span>
                        <span className={styles.metricValue}>{activity.heartRateAvg} bpm</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.activityCalories}>
                  <div className={styles.caloriesBurnedBar} 
                       style={{ 
                         width: `${Math.min(100, (activity.caloriesBurned / (totalCaloriesBurned * 0.15)) * 100)}%`
                       }}>
                  </div>
                  <span className={styles.caloriesValue}>{activity.caloriesBurned}</span>
                  <span className={styles.caloriesUnit}>kcal</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.energyTracker}>
      <div className={styles.header} onClick={toggleExpand}>
        <div className={styles.headerTitle}>
          <FaFire className={styles.fireIcon} />
          <h3>Énergie Dépensée</h3>
        </div>
        
        <div className={styles.currentEnergy}>
          <span className={styles.energyValue}>{totalCaloriesBurned}</span>
          <span className={styles.energyUnit}>kcal</span>
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
          {renderEnergyStats()}
          {renderEnergyChart()}
          {renderActivitiesList()}
        </div>
      )}
    </div>
  );
};

export default EnergyTracker;
