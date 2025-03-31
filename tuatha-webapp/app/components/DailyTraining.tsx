'use client';

import React from 'react';
import { FaDumbbell, FaRunning, FaFire, FaClock, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import styles from './DailyTraining.module.css';

interface TrainingExercise {
  name: string;
  duration: number; // en minutes
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
  completed: boolean;
}

interface DailyTrainingProps {
  date?: Date;
}

const DailyTraining: React.FC<DailyTrainingProps> = ({
  date = new Date()
}) => {
  // Données simulées pour l'entrainement du jour
  const exercises: TrainingExercise[] = [
    {
      name: "Échauffement",
      duration: 10,
      intensity: "low",
      caloriesBurned: 45,
      completed: true
    },
    {
      name: "Cardio intensif",
      duration: 20,
      intensity: "high",
      caloriesBurned: 210,
      completed: true
    },
    {
      name: "Renforcement musculaire",
      duration: 15,
      intensity: "medium",
      caloriesBurned: 120,
      completed: false
    },
    {
      name: "Étirements",
      duration: 10,
      intensity: "low",
      caloriesBurned: 35,
      completed: false
    }
  ];

  // Calculs pour les statistiques
  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  const totalCalories = exercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);
  const completedExercises = exercises.filter(ex => ex.completed);
  const completionPercentage = Math.round((completedExercises.length / exercises.length) * 100);

  // Formatage de la date
  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  // Fonction pour déterminer la couleur selon l'intensité
  const getIntensityColor = (intensity: 'low' | 'medium' | 'high') => {
    switch (intensity) {
      case 'low': return '#3498db';
      case 'medium': return '#f39c12';
      case 'high': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div className={styles.trainingWidget}>
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitle}>
          <FaDumbbell className={styles.trainingIcon} />
          <h3>Entrainement du Jour</h3>
        </div>
      </div>
      
      <div className={styles.widgetContent}>
        {/* Statistiques d'entrainement */}
        <div className={styles.trainingStats}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}><FaClock /></div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Durée totale</span>
              <span className={styles.statValue}>{totalDuration} min</span>
            </div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statIcon}><FaFire /></div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Calories</span>
              <span className={styles.statValue}>{totalCalories} kcal</span>
            </div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statIcon}><FaRunning /></div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Progression</span>
              <span className={styles.statValue}>{completionPercentage}%</span>
            </div>
          </div>
        </div>
        
        {/* Liste des exercices */}
        <div className={styles.exercisesList}>
          {exercises.map((exercise, index) => (
            <div key={index} className={`${styles.exerciseItem} ${exercise.completed ? styles.completed : ''}`}>
              <div className={styles.exerciseHeader}>
                <div className={styles.exerciseName}>{exercise.name}</div>
                <div className={styles.exerciseDuration}>{exercise.duration} min</div>
              </div>
              
              <div className={styles.exerciseProgress}>
                <div 
                  className={styles.exerciseProgressBar}
                  style={{
                    width: exercise.completed ? '100%' : '0%',
                    backgroundColor: getIntensityColor(exercise.intensity)
                  }}
                />
              </div>
              
              <div className={styles.exerciseDetails}>
                <div className={styles.exerciseIntensity}>
                  <span 
                    className={styles.intensityDot}
                    style={{ backgroundColor: getIntensityColor(exercise.intensity) }}
                  />
                  {exercise.intensity === 'low' ? 'Faible' : 
                   exercise.intensity === 'medium' ? 'Moyenne' : 'Élevée'}
                </div>
                <div className={styles.exerciseCalories}>{exercise.caloriesBurned} kcal</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton pour accéder à la page du praticien */}
        <div className={styles.actionButtonContainer}>
          <Link href="/praticien/3" className={styles.actionButton}>
            <span>Contacter mon coach</span>
            <FaArrowRight className={styles.buttonIcon} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DailyTraining;
