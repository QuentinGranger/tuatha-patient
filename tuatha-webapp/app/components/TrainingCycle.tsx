'use client';

import React, { useState } from 'react';
import { FaRunning, FaCalendarAlt, FaChartLine, FaAngleRight, FaAngleDown, FaTrophy, FaWeightHanging, FaHeartbeat, FaBullseye, FaCircle } from 'react-icons/fa';
import styles from '@/app/components/TrainingCycle.module.css';

interface TrainingCycleProps {
  athleteName: string;
  athleteId: string;
}

interface Phase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: string;
  completed: boolean;
  current: boolean;
  description: string;
  focus: string[];
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number; // 0-100
  priority: 'low' | 'medium' | 'high';
  category: 'performance' | 'strength' | 'endurance' | 'technique' | 'recovery';
  metrics?: {
    name: string;
    current: number;
    target: number;
    unit: string;
  }[];
}

interface SportActivity {
  id: string;
  name: string;
  icon: keyof typeof activityIcons;
}

const activityIcons = {
  running: FaRunning,
  weights: FaWeightHanging,
  cardio: FaHeartbeat
};

// Données d'exemple pour le cycle d'entraînement
const exampleCycleData = {
  cycleName: "Préparation Compétition Régionale",
  startDate: "2025-01-15",
  endDate: "2025-06-30",
  cycleType: "Périodisation classique",
  currentPhaseId: "p3",
  phases: [
    {
      id: "p1",
      name: "Phase préparatoire générale",
      startDate: "2025-01-15",
      endDate: "2025-02-28",
      duration: "6 semaines",
      completed: true,
      current: false,
      description: "Développement des capacités générales et de la base aérobie. Mise en place des habitudes d'entraînement et augmentation progressive du volume.",
      focus: ["Endurance de base", "Force générale", "Technique fondamentale"]
    },
    {
      id: "p2",
      name: "Phase préparatoire spécifique",
      startDate: "2025-03-01",
      endDate: "2025-03-31",
      duration: "4 semaines",
      completed: true,
      current: false,
      description: "Augmentation de l'intensité d'entraînement et focus sur les aspects spécifiques de la discipline. Développement de la force spécifique.",
      focus: ["Force spécifique", "Endurance spécifique", "Vitesse"]
    },
    {
      id: "p3",
      name: "Phase de pré-compétition",
      startDate: "2025-04-01",
      endDate: "2025-05-15",
      duration: "6 semaines",
      completed: false,
      current: true,
      description: "Affûtage des performances spécifiques à la compétition. Simulation des conditions de compétition et travail sur les aspects tactiques.",
      focus: ["Puissance", "Vitesse", "Tactique de compétition"]
    },
    {
      id: "p4",
      name: "Phase de compétition",
      startDate: "2025-05-15",
      endDate: "2025-06-15",
      duration: "4 semaines",
      completed: false,
      current: false,
      description: "Maintien des adaptations physiologiques et affûtage final. Gestion optimale de la récupération entre les compétitions.",
      focus: ["Performances maximales", "Récupération", "Affûtage"]
    },
    {
      id: "p5",
      name: "Phase de transition",
      startDate: "2025-06-15",
      endDate: "2025-06-30",
      duration: "2 semaines",
      completed: false,
      current: false,
      description: "Récupération active et réduction du volume d'entraînement. Préparation mentale pour le prochain cycle.",
      focus: ["Récupération active", "Travail compensatoire", "Bilan"]
    }
  ],
  sportActivities: [
    {
      id: "s1",
      name: "Course à pied",
      icon: "running"
    },
    {
      id: "s2",
      name: "Musculation",
      icon: "weights"
    },
    {
      id: "s3",
      name: "Cardio-training",
      icon: "cardio"
    }
  ],
  goals: [
    {
      id: "g1",
      title: "Améliorer le temps sur 10km",
      description: "Réduire le temps de course sur 10km pour atteindre le standard de qualification régional.",
      targetDate: "2025-05-20",
      progress: 75,
      priority: "high",
      category: "performance",
      metrics: [
        {
          name: "Temps 10km",
          current: 42.5,
          target: 39.0,
          unit: "min"
        }
      ]
    },
    {
      id: "g2",
      title: "Augmenter la force maximale",
      description: "Développer la force maximale des membres inférieurs pour améliorer la puissance en course.",
      targetDate: "2025-04-30",
      progress: 60,
      priority: "medium",
      category: "strength",
      metrics: [
        {
          name: "Squat",
          current: 90,
          target: 110,
          unit: "kg"
        },
        {
          name: "Leg press",
          current: 180,
          target: 220,
          unit: "kg"
        }
      ]
    },
    {
      id: "g3",
      title: "Améliorer l'endurance aérobie",
      description: "Augmenter le seuil ventilatoire pour permettre un rythme de course plus élevé sur la durée.",
      targetDate: "2025-05-10",
      progress: 85,
      priority: "high",
      category: "endurance",
      metrics: [
        {
          name: "VMA",
          current: 17.2,
          target: 18.5,
          unit: "km/h"
        },
        {
          name: "FC de récupération",
          current: 72,
          target: 65,
          unit: "bpm"
        }
      ]
    },
    {
      id: "g4",
      title: "Optimiser la technique de course",
      description: "Améliorer l'économie de course et l'efficacité technique pour réduire le coût énergétique.",
      targetDate: "2025-04-15",
      progress: 50,
      priority: "medium",
      category: "technique",
      metrics: [
        {
          name: "Cadence",
          current: 168,
          target: 180,
          unit: "pas/min"
        }
      ]
    }
  ]
};

const TrainingCycle: React.FC<TrainingCycleProps> = ({ athleteName, athleteId }) => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("p3"); // Phase courante par défaut
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'phases' | 'goals'>('phases');
  
  // Utiliser les données d'exemple pour ce composant
  const cycleData = exampleCycleData;
  
  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };
  
  const toggleGoal = (goalId: string) => {
    setExpandedGoal(expandedGoal === goalId ? null : goalId);
  };
  
  const toggleTab = (tab: 'phases' | 'goals') => {
    setActiveTab(tab);
  };
  
  const getCurrentPhase = () => {
    return cycleData.phases.find(phase => phase.id === cycleData.currentPhaseId);
  };
  
  const calculateCycleProgress = (): number => {
    if (!cycleData.startDate || !cycleData.endDate) return 0;
    
    const start = new Date(cycleData.startDate).getTime();
    const end = new Date(cycleData.endDate).getTime();
    const now = new Date().getTime();
    
    if (now <= start) return 0;
    if (now >= end) return 100;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <FaChartLine />;
      case 'strength': return <FaWeightHanging />;
      case 'endurance': return <FaHeartbeat />;
      case 'technique': return <FaRunning />;
      case 'recovery': return <FaHeartbeat />;
      default: return <FaBullseye />;
    }
  };
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.trainingCycleContainer}>
      <div className={styles.trainingCycleHeader}>
        <h2 className={styles.trainingCycleTitle}>Cycle d'Entraînement</h2>
        <p className={styles.trainingCycleSubtitle}>
          <span className={styles.cycleName}>{cycleData.cycleName}</span> • 
          Progression: {calculateCycleProgress()}%
        </p>
      </div>
      
      <div className={styles.cycleInfoCards}>
        <div className={styles.cycleInfoCard}>
          <div className={styles.cycleInfoCardIcon}>
            <FaCalendarAlt />
          </div>
          <div className={styles.cycleInfoCardContent}>
            <div className={styles.cycleInfoCardLabel}>Date de début</div>
            <div className={styles.cycleInfoCardValue}>{formatDate(cycleData.startDate)}</div>
          </div>
        </div>
        
        <div className={styles.cycleInfoCard}>
          <div className={styles.cycleInfoCardIcon}>
            <FaCalendarAlt />
          </div>
          <div className={styles.cycleInfoCardContent}>
            <div className={styles.cycleInfoCardLabel}>Date de fin</div>
            <div className={styles.cycleInfoCardValue}>{formatDate(cycleData.endDate)}</div>
          </div>
        </div>
        
        <div className={styles.cycleInfoCard}>
          <div className={styles.cycleInfoCardIcon}>
            <FaRunning />
          </div>
          <div className={styles.cycleInfoCardContent}>
            <div className={styles.cycleInfoCardLabel}>Phase actuelle</div>
            <div className={styles.cycleInfoCardValue}>{getCurrentPhase()?.name || "Aucune"}</div>
          </div>
        </div>
      </div>
      
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <div 
            className={`${styles.tab} ${activeTab === 'phases' ? styles.activeTab : ''}`}
            onClick={() => toggleTab('phases')}
          >
            <FaChartLine className={styles.tabIcon} />
            <span>Phases du Cycle</span>
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'goals' ? styles.activeTab : ''}`}
            onClick={() => toggleTab('goals')}
          >
            <FaTrophy className={styles.tabIcon} />
            <span>Objectifs</span>
          </div>
        </div>
        
        {activeTab === 'phases' && (
          <div className={styles.phasesList}>
            {cycleData.phases.map((phase) => (
              <div 
                key={phase.id} 
                className={`${styles.phaseItem} ${phase.current ? styles.currentPhase : ''} ${phase.completed ? styles.completedPhase : ''}`}
              >
                <div 
                  className={styles.phaseHeader}
                  onClick={() => togglePhase(phase.id)}
                >
                  <div className={styles.phaseHeaderLeft}>
                    <div className={styles.phaseStatus}></div>
                    <h4 className={styles.phaseName}>{phase.name}</h4>
                  </div>
                  <div className={styles.phaseHeaderRight}>
                    <span className={styles.phaseDates}>
                      {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                    </span>
                    {expandedPhase === phase.id ? <FaAngleDown /> : <FaAngleRight />}
                  </div>
                </div>
                
                {expandedPhase === phase.id && (
                  <div className={styles.phaseDetails}>
                    <p className={styles.phaseDescription}>{phase.description}</p>
                    <div className={styles.phaseFocus}>
                      <h5>Axes de travail :</h5>
                      <ul>
                        {phase.focus.map((focus, index) => (
                          <li key={index}>{focus}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'goals' && (
          <div className={styles.goalsList}>
            {cycleData.goals.map((goal) => (
              <div 
                key={goal.id} 
                className={`${styles.goalItem} ${styles[goal.priority]} ${styles[goal.category]}`}
              >
                <div 
                  className={styles.goalHeader}
                  onClick={() => toggleGoal(goal.id)}
                >
                  <div className={styles.goalHeaderLeft}>
                    <div className={styles.goalCategoryIcon}>
                      {getCategoryIcon(goal.category)}
                    </div>
                    <h4 className={styles.goalTitle}>{goal.title}</h4>
                  </div>
                  <div className={styles.goalHeaderRight}>
                    <div className={styles.goalProgressWrapper}>
                      <div 
                        className={styles.goalProgress} 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span className={styles.goalProgressText}>{goal.progress}%</span>
                    {expandedGoal === goal.id ? <FaAngleDown /> : <FaAngleRight />}
                  </div>
                </div>
                
                {expandedGoal === goal.id && (
                  <div className={styles.goalDetails}>
                    <p className={styles.goalDescription}>{goal.description}</p>
                    {goal.metrics && goal.metrics.length > 0 && (
                      <div className={styles.goalMetrics}>
                        <h5>Métriques :</h5>
                        <div className={styles.metricsTable}>
                          <div className={styles.metricsHeader}>
                            <div className={styles.metricName}>Métrique</div>
                            <div className={styles.metricCurrent}>Actuel</div>
                            <div className={styles.metricTarget}>Objectif</div>
                            <div className={styles.metricUnit}>Unité</div>
                          </div>
                          {goal.metrics.map((metric, index) => (
                            <div key={index} className={styles.metricRow}>
                              <div className={styles.metricName}>{metric.name}</div>
                              <div className={styles.metricCurrent}>{metric.current}</div>
                              <div className={styles.metricTarget}>{metric.target}</div>
                              <div className={styles.metricUnit}>{metric.unit}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className={styles.goalFooter}>
                      <div className={styles.goalTargetDate}>
                        <FaCalendarAlt /> Objectif à atteindre pour le {formatDate(goal.targetDate)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingCycle;
