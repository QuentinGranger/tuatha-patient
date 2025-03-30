'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './TrainingProgram.module.css';
import { 
  FaEdit, 
  FaCheck, 
  FaWeight, 
  FaVideo, 
  FaStop, 
  FaDownload, 
  FaTag,
  FaPlus,
  FaMinus,
  FaPlay,
  FaCalculator,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaDumbbell,
  FaStopwatch,
  FaRunning
} from 'react-icons/fa';

// Types
interface ExerciseSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  rpe?: number; // Rating of Perceived Exertion (1-10)
  videoUrl?: string;
  notes?: string;
  timestamp?: string;
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  targetMuscleGroups: string[];
  sets: ExerciseSet[];
  restBetweenSets: number; // seconds
  instruction?: string;
  media?: {
    thumbnailUrl: string;
    videoUrls: string[];
    imageUrls: string[];
  };
  history?: {
    date: string;
    tonnage: number;
    maxWeight: number;
    totalReps: number;
    feelingScore: number; // 1-5
  }[];
  tags?: string[];
  oneRepMax?: number;
}

interface TrainingUnit {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
  status: 'planned' | 'in-progress' | 'completed' | 'missed';
  totalTonnage: number;
  duration?: number; // minutes
  athleteFeedback?: {
    fatigue: number; // 1-10
    muscularSoreness: number; // 1-10
    overallFeeling: number; // 1-10
    notes: string;
  };
  coachNotes?: string;
}

interface TrainingWeek {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  trainingUnits: TrainingUnit[];
  goal?: string;
}

interface TrainingProgramProps {
  athleteId: string;
  athleteName: string;
  coachId?: string;
}

// Données d'exemple pour le composant
const exampleTrainingData: TrainingWeek[] = [
  {
    id: 'week1',
    weekNumber: 1,
    startDate: '2025-03-24',
    endDate: '2025-03-30',
    goal: "Adaptation anatomique et développement de l'endurance musculaire",
    trainingUnits: [
      {
        id: 'tu1',
        name: 'Séance Bas du Corps',
        date: '2025-03-25',
        status: 'completed',
        totalTonnage: 6820,
        duration: 65,
        exercises: [
          {
            id: 'ex1',
            name: 'Squat',
            category: 'Compound',
            targetMuscleGroups: ['Quadriceps', 'Glutes', 'Lower Back'],
            restBetweenSets: 120,
            sets: [
              {
                id: 's1',
                weight: 70,
                reps: 12,
                completed: true,
                rpe: 7,
                timestamp: '2025-03-25T10:15:00',
                notes: 'Échauffement'
              },
              {
                id: 's2',
                weight: 85,
                reps: 10,
                completed: true,
                rpe: 8,
                timestamp: '2025-03-25T10:18:00'
              },
              {
                id: 's3',
                weight: 90,
                reps: 8,
                completed: true,
                rpe: 9,
                timestamp: '2025-03-25T10:22:00'
              },
              {
                id: 's4',
                weight: 95,
                reps: 6,
                completed: true,
                rpe: 9,
                timestamp: '2025-03-25T10:26:00',
                notes: 'Technique à améliorer sur les dernières répétitions'
              }
            ],
            instruction: "Maintenir le dos droit, descendre jusqu'à ce que les cuisses soient parallèles au sol.",
            media: {
              thumbnailUrl: 'https://example.com/squat-thumb.jpg',
              videoUrls: ['https://example.com/squat-video1.mp4', 'https://example.com/squat-video2.mp4'],
              imageUrls: ['https://example.com/squat-image1.jpg']
            },
            history: [
              {
                date: '2025-03-18',
                tonnage: 2600,
                maxWeight: 90,
                totalReps: 30,
                feelingScore: 4
              },
              {
                date: '2025-03-11',
                tonnage: 2400,
                maxWeight: 85,
                totalReps: 30,
                feelingScore: 3
              }
            ],
            tags: ['Priorité', 'Technique', 'Force'],
            oneRepMax: 100
          },
          {
            id: 'ex2',
            name: 'Leg Press',
            category: 'Compound',
            targetMuscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
            restBetweenSets: 90,
            sets: [
              {
                id: 's1',
                weight: 120,
                reps: 12,
                completed: true,
                rpe: 6,
                timestamp: '2025-03-25T10:35:00'
              },
              {
                id: 's2',
                weight: 140,
                reps: 10,
                completed: true,
                rpe: 7,
                timestamp: '2025-03-25T10:38:00'
              },
              {
                id: 's3',
                weight: 160,
                reps: 10,
                completed: true,
                rpe: 8,
                timestamp: '2025-03-25T10:41:00'
              },
              {
                id: 's4',
                weight: 180,
                reps: 8,
                completed: true,
                rpe: 9,
                timestamp: '2025-03-25T10:45:00'
              }
            ]
          },
          {
            id: 'ex3',
            name: 'Leg Curl',
            category: 'Isolation',
            targetMuscleGroups: ['Hamstrings'],
            restBetweenSets: 60,
            sets: [
              {
                id: 's1',
                weight: 40,
                reps: 12,
                completed: true,
                timestamp: '2025-03-25T10:55:00'
              },
              {
                id: 's2',
                weight: 45,
                reps: 12,
                completed: true,
                timestamp: '2025-03-25T10:57:00'
              },
              {
                id: 's3',
                weight: 50,
                reps: 10,
                completed: true,
                timestamp: '2025-03-25T11:00:00'
              }
            ]
          }
        ],
        athleteFeedback: {
          fatigue: 7,
          muscularSoreness: 6,
          overallFeeling: 8,
          notes: "Bonne séance dans l'ensemble, légère fatigue au niveau des quadriceps."
        },
        coachNotes: "Progression sur le squat par rapport à la semaine dernière. Continuer à travailler sur la technique."
      },
      {
        id: 'tu2',
        name: 'Séance Haut du Corps',
        date: '2025-03-27',
        status: 'completed',
        totalTonnage: 5240,
        duration: 70,
        exercises: [
          {
            id: 'ex1',
            name: 'Développé couché',
            category: 'Compound',
            targetMuscleGroups: ['Chest', 'Triceps', 'Shoulders'],
            restBetweenSets: 120,
            sets: [
              {
                id: 's1',
                weight: 60,
                reps: 12,
                completed: true,
                timestamp: '2025-03-27T15:10:00'
              },
              {
                id: 's2',
                weight: 75,
                reps: 10,
                completed: true,
                timestamp: '2025-03-27T15:13:00'
              },
              {
                id: 's3',
                weight: 80,
                reps: 8,
                completed: true,
                timestamp: '2025-03-27T15:17:00'
              },
              {
                id: 's4',
                weight: 85,
                reps: 6,
                completed: true,
                timestamp: '2025-03-27T15:21:00'
              }
            ]
          },
          {
            id: 'ex2',
            name: 'Rowing haltère',
            category: 'Compound',
            targetMuscleGroups: ['Back', 'Biceps'],
            restBetweenSets: 90,
            sets: [
              {
                id: 's1',
                weight: 22,
                reps: 12,
                completed: true,
                timestamp: '2025-03-27T15:30:00'
              },
              {
                id: 's2',
                weight: 24,
                reps: 12,
                completed: true,
                timestamp: '2025-03-27T15:33:00'
              },
              {
                id: 's3',
                weight: 26,
                reps: 10,
                completed: true,
                timestamp: '2025-03-27T15:36:00'
              }
            ]
          }
        ]
      },
      {
        id: 'tu3',
        name: 'Séance Bas du Corps',
        date: '2025-03-30',
        status: 'in-progress',
        totalTonnage: 0,
        exercises: [
          {
            id: 'ex1',
            name: 'Squat',
            category: 'Compound',
            targetMuscleGroups: ['Quadriceps', 'Glutes', 'Lower Back'],
            restBetweenSets: 120,
            sets: [
              {
                id: 's1',
                weight: 75,
                reps: 12,
                completed: false
              },
              {
                id: 's2',
                weight: 90,
                reps: 10,
                completed: false
              },
              {
                id: 's3',
                weight: 95,
                reps: 8,
                completed: false
              },
              {
                id: 's4',
                weight: 100,
                reps: 6,
                completed: false
              }
            ]
          },
          {
            id: 'ex2',
            name: 'Hip Thrust',
            category: 'Compound',
            targetMuscleGroups: ['Glutes', 'Hamstrings'],
            restBetweenSets: 90,
            sets: [
              {
                id: 's1',
                weight: 80,
                reps: 12,
                completed: false
              },
              {
                id: 's2',
                weight: 90,
                reps: 12,
                completed: false
              },
              {
                id: 's3',
                weight: 100,
                reps: 10,
                completed: false
              },
              {
                id: 's4',
                weight: 110,
                reps: 8,
                completed: false
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'week2',
    weekNumber: 2,
    startDate: '2025-03-31',
    endDate: '2025-04-06',
    goal: "Développement de la force maximale et hypertrophie",
    trainingUnits: [
      {
        id: 'tu1',
        name: 'Séance Bas du Corps',
        date: '2025-04-01',
        status: 'planned',
        totalTonnage: 0,
        exercises: [
          {
            id: 'ex1',
            name: 'Squat',
            category: 'Compound',
            targetMuscleGroups: ['Quadriceps', 'Glutes', 'Lower Back'],
            restBetweenSets: 150,
            sets: [
              {
                id: 's1',
                weight: 80,
                reps: 10,
                completed: false
              },
              {
                id: 's2',
                weight: 95,
                reps: 8,
                completed: false
              },
              {
                id: 's3',
                weight: 100,
                reps: 6,
                completed: false
              },
              {
                id: 's4',
                weight: 105,
                reps: 4,
                completed: false
              }
            ]
          }
        ]
      }
    ]
  }
];

// Composant principal
const TrainingProgram: React.FC<TrainingProgramProps> = ({ athleteId, athleteName, coachId }) => {
  // États
  const [trainingData, setTrainingData] = useState<TrainingWeek[]>(exampleTrainingData);
  const [activeWeekId, setActiveWeekId] = useState<string>(exampleTrainingData[0].id);
  const [activeTrainingUnitId, setActiveTrainingUnitId] = useState<string | null>(
    exampleTrainingData[0].trainingUnits.length > 0 ? exampleTrainingData[0].trainingUnits[0].id : null
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [videoRecording, setVideoRecording] = useState<boolean>(false);
  const [selectedExerciseForVideo, setSelectedExerciseForVideo] = useState<string | null>(null);
  const [selectedSetForVideo, setSelectedSetForVideo] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  
  // États pour le calculateur
  const [oneRepMax, setOneRepMax] = useState<number>(100);
  const [targetReps, setTargetReps] = useState<number>(10);
  const [calculatedWeight, setCalculatedWeight] = useState<number>(0);
  const [selectedExerciseForCalculator, setSelectedExerciseForCalculator] = useState<string>("");
  const [selectedSetForCalculator, setSelectedSetForCalculator] = useState<string>("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  // Helpers
  const getActiveWeek = () => {
    return trainingData.find(week => week.id === activeWeekId) || trainingData[0];
  };
  
  const getActiveTrainingUnit = () => {
    const week = getActiveWeek();
    if (!week) return null;
    return week.trainingUnits.find(unit => unit.id === activeTrainingUnitId) || null;
  };
  
  const calculateTonnage = (exercise: Exercise) => {
    return exercise.sets.reduce((total, set) => {
      if (set.completed) {
        return total + (set.weight * set.reps);
      }
      return total;
    }, 0);
  };
  
  const calculateTotalTonnage = (trainingUnit: TrainingUnit) => {
    return trainingUnit.exercises.reduce((total, exercise) => {
      return total + calculateTonnage(exercise);
    }, 0);
  };
  
  // Fonctions pour gérer les jours pliables/dépliables
  const toggleDayExpansion = (unitId: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(unitId)) {
        newSet.delete(unitId);
      } else {
        newSet.add(unitId);
      }
      return newSet;
    });
  };
  
  const isDayExpanded = (unitId: string): boolean => {
    return expandedDays.has(unitId);
  };
  
  const handleDayClick = (unitId: string) => {
    setActiveTrainingUnitId(unitId);
    
    // Déplier automatiquement le jour sélectionné
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      newSet.add(unitId);
      return newSet;
    });
  };
  
  // Calculateur de charge basé sur 1RM
  const calculateWeightFromOneRepMax = (oneRepMax: number, targetReps: number): number => {
    // Formule d'Epley: weight = oneRepMax * (1 - targetReps/30)
    // Cette formule est adaptée pour calculer le poids recommandé pour un nombre de répétitions donné
    // quand on connaît le poids maximal pour une répétition (1RM)
    if (targetReps <= 0) return 0;
    if (targetReps === 1) return oneRepMax;
    
    const calculatedWeight = oneRepMax * (1 - (targetReps / 30));
    // Arrondir à 0.5 kg près pour plus de praticité
    return Math.round(calculatedWeight * 2) / 2;
  };
  
  // Mettre à jour le poids calculé quand les valeurs changent
  useEffect(() => {
    setCalculatedWeight(calculateWeightFromOneRepMax(oneRepMax, targetReps));
  }, [oneRepMax, targetReps]);
  
  // Mettre à jour le 1RM quand un exercice est sélectionné
  useEffect(() => {
    if (selectedExerciseForCalculator) {
      const exercise = getActiveTrainingUnit()?.exercises.find(
        ex => ex.id === selectedExerciseForCalculator
      );
      if (exercise && exercise.oneRepMax) {
        setOneRepMax(exercise.oneRepMax);
      }
      // Réinitialiser la série sélectionnée
      setSelectedSetForCalculator("");
    }
  }, [selectedExerciseForCalculator]);
  
  const startVideoRecording = async (exerciseId: string, setId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        
        // Mise à jour de l'état avec l'URL de la vidéo
        updateSetWithVideo(exerciseId, setId, videoUrl);
        
        // Arrêt du stream vidéo
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
      
      mediaRecorderRef.current.start();
      setVideoRecording(true);
      setSelectedExerciseForVideo(exerciseId);
      setSelectedSetForVideo(setId);
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra:', error);
      alert('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
    }
  };
  
  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setVideoRecording(false);
    setSelectedExerciseForVideo(null);
    setSelectedSetForVideo(null);
  };
  
  const updateSetWithVideo = (exerciseId: string, setId: string, videoUrl: string) => {
    setTrainingData(prevData => {
      const newData = [...prevData];
      const weekIndex = newData.findIndex(week => week.id === activeWeekId);
      
      if (weekIndex === -1) return prevData;
      
      const unitIndex = newData[weekIndex].trainingUnits.findIndex(unit => unit.id === activeTrainingUnitId);
      
      if (unitIndex === -1) return prevData;
      
      const exerciseIndex = newData[weekIndex].trainingUnits[unitIndex].exercises.findIndex(ex => ex.id === exerciseId);
      
      if (exerciseIndex === -1) return prevData;
      
      const setIndex = newData[weekIndex].trainingUnits[unitIndex].exercises[exerciseIndex].sets.findIndex(set => set.id === setId);
      
      if (setIndex === -1) return prevData;
      
      newData[weekIndex].trainingUnits[unitIndex].exercises[exerciseIndex].sets[setIndex].videoUrl = videoUrl;
      
      return newData;
    });
  };
  
  const toggleSetCompletion = (exerciseId: string, setId: string) => {
    setTrainingData(prevData => {
      const newData = [...prevData];
      const weekIndex = newData.findIndex(week => week.id === activeWeekId);
      
      if (weekIndex === -1) return prevData;
      
      const unitIndex = newData[weekIndex].trainingUnits.findIndex(unit => unit.id === activeTrainingUnitId);
      
      if (unitIndex === -1) return prevData;
      
      const exerciseIndex = newData[weekIndex].trainingUnits[unitIndex].exercises.findIndex(ex => ex.id === exerciseId);
      
      if (exerciseIndex === -1) return prevData;
      
      const setIndex = newData[weekIndex].trainingUnits[unitIndex].exercises[exerciseIndex].sets.findIndex(set => set.id === setId);
      
      if (setIndex === -1) return prevData;
      
      // Inversion de l'état complété
      const newCompleted = !newData[weekIndex].trainingUnits[unitIndex].exercises[exerciseIndex].sets[setIndex].completed;
      
      newData[weekIndex].trainingUnits[unitIndex].exercises[exerciseIndex].sets[setIndex].completed = newCompleted;
      
      // Mise à jour de la date d'achèvement
      if (newCompleted) {
        newData[weekIndex].trainingUnits[unitIndex].exercises[exerciseIndex].sets[setIndex].timestamp = new Date().toISOString();
      } else {
        newData[weekIndex].trainingUnits[unitIndex].exercises[exerciseIndex].sets[setIndex].timestamp = undefined;
      }
      
      // Recalcul du tonnage total
      newData[weekIndex].trainingUnits[unitIndex].totalTonnage = calculateTotalTonnage(newData[weekIndex].trainingUnits[unitIndex]);
      
      // Mise à jour du statut de la séance
      updateTrainingUnitStatus(newData, weekIndex, unitIndex);
      
      return newData;
    });
  };
  
  const updateSetValue = (exerciseId: string, setId: string, field: 'weight' | 'reps' | 'rpe' | 'notes', value: number | string) => {
    setTrainingData(prevData => {
      const newData = [...prevData];
      const weekIndex = newData.findIndex(week => week.id === activeWeekId);
      
      if (weekIndex === -1) return prevData;
      
      const unitIndex = newData[weekIndex].trainingUnits.findIndex(unit => unit.id === activeTrainingUnitId);
      
      if (unitIndex === -1) return prevData;
      
      const exerciseIndex = newData[weekIndex].trainingUnits[unitIndex].exercises.findIndex(ex => ex.id === exerciseId);
      
      if (exerciseIndex === -1) return prevData;
      
      const setIndex = newData[weekIndex].trainingUnits[unitIndex].exercises[exerciseIndex].sets.findIndex(set => set.id === setId);
      
      if (setIndex === -1) return prevData;
      
      // @ts-ignore - Pour gérer à la fois les champs numériques et textuels
      newData[weekIndex].trainingUnits[unitIndex].exercises[exerciseIndex].sets[setIndex][field] = value;
      
      // Recalcul du tonnage total si le poids ou les répétitions ont changé
      if (field === 'weight' || field === 'reps') {
        newData[weekIndex].trainingUnits[unitIndex].totalTonnage = calculateTotalTonnage(newData[weekIndex].trainingUnits[unitIndex]);
      }
      
      return newData;
    });
  };
  
  const updateTrainingUnitStatus = (data: TrainingWeek[], weekIndex: number, unitIndex: number) => {
    const unit = data[weekIndex].trainingUnits[unitIndex];
    
    // Vérifier si tous les exercices sont complétés
    const allSetsCompleted = unit.exercises.every(exercise => 
      exercise.sets.every(set => set.completed)
    );
    
    // Vérifier si certains exercices sont complétés
    const someSetsCompleted = unit.exercises.some(exercise => 
      exercise.sets.some(set => set.completed)
    );
    
    if (allSetsCompleted) {
      data[weekIndex].trainingUnits[unitIndex].status = 'completed';
    } else if (someSetsCompleted) {
      data[weekIndex].trainingUnits[unitIndex].status = 'in-progress';
    }
  };
  
  const renderSets = (exercise: Exercise) => {
    return (
      <div className={styles.exerciseSets}>
        <div className={styles.setsHeader}>
          <div className={styles.setNumber}>#</div>
          <div className={styles.setWeight}>Charge (kg)</div>
          <div className={styles.setReps}>Reps</div>
          <div className={styles.setRpe}>RPE</div>
          <div className={styles.setActions}>Actions</div>
        </div>
        
        {exercise.sets.map((set, index) => (
          <div 
            key={set.id} 
            className={`${styles.setRow} ${set.completed ? styles.completedSet : ''}`}
          >
            <div className={styles.setNumber}>{index + 1}</div>
            
            <div className={styles.setWeight}>
              {editMode ? (
                <input 
                  type="number" 
                  value={set.weight} 
                  onChange={(e) => updateSetValue(exercise.id, set.id, 'weight', Number(e.target.value))}
                  className={styles.setInput}
                />
              ) : (
                set.weight
              )}
            </div>
            
            <div className={styles.setReps}>
              {editMode ? (
                <input 
                  type="number" 
                  value={set.reps} 
                  onChange={(e) => updateSetValue(exercise.id, set.id, 'reps', Number(e.target.value))}
                  className={styles.setInput}
                />
              ) : (
                set.reps
              )}
            </div>
            
            <div className={styles.setRpe}>
              {editMode ? (
                <input 
                  type="number" 
                  value={set.rpe || ''} 
                  onChange={(e) => updateSetValue(exercise.id, set.id, 'rpe', Number(e.target.value))}
                  className={styles.setInput}
                  placeholder="-"
                  min="1"
                  max="10"
                />
              ) : (
                set.rpe || '-'
              )}
            </div>
            
            <div className={styles.setActions}>
              <button 
                className={`${styles.setActionButton} ${styles.completeButton} ${set.completed ? styles.active : ''}`}
                onClick={() => toggleSetCompletion(exercise.id, set.id)}
                title={set.completed ? "Marquer comme non terminé" : "Marquer comme terminé"}
              >
                <FaCheck />
              </button>
              
              <button 
                className={`${styles.setActionButton} ${styles.videoButton} ${selectedExerciseForVideo === exercise.id && selectedSetForVideo === set.id ? styles.recording : ''}`}
                onClick={() => {
                  if (videoRecording && selectedExerciseForVideo === exercise.id && selectedSetForVideo === set.id) {
                    stopVideoRecording();
                  } else {
                    startVideoRecording(exercise.id, set.id);
                  }
                }}
                title={videoRecording && selectedExerciseForVideo === exercise.id && selectedSetForVideo === set.id ? "Arrêter l'enregistrement" : "Enregistrer une vidéo"}
              >
                <FaVideo />
              </button>
              
              {set.videoUrl && (
                <button 
                  className={`${styles.setActionButton} ${styles.playButton}`}
                  onClick={() => {/* Fonction pour ouvrir la vidéo */}}
                  title="Voir la vidéo"
                >
                  <FaPlay />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className={styles.trainingProgram}>
      <h1>Programme d'entraînement</h1>
      
      <div className={styles.programHeader}>
        <div className={styles.weekSelector}>
          {trainingData.map((week) => (
            <button 
              key={week.id}
              className={`${styles.weekButton} ${activeWeekId === week.id ? styles.activeWeek : ''}`}
              onClick={() => setActiveWeekId(week.id)}
            >
              Semaine {week.weekNumber}
            </button>
          ))}
        </div>
        
        <div className={styles.weekGoal}>
          <span className={styles.goalLabel}>Objectif:</span>
          <span className={styles.goalText}>{getActiveWeek().goal}</span>
        </div>
        
        <div className={styles.programActions}>
          <button 
            className={`${styles.actionButton} ${editMode ? styles.active : ''}`}
            onClick={() => setEditMode(!editMode)}
            title={editMode ? "Désactiver le mode édition" : "Activer le mode édition"}
          >
            <FaEdit />
            {editMode ? "Terminer l'édition" : "Éditer"}
          </button>
          
          <button 
            className={styles.actionButton}
            onClick={() => setShowCalculator(!showCalculator)}
            title="Calculateur de charge"
          >
            <FaCalculator />
            Calculateur
          </button>
        </div>
      </div>
      
      <div className={styles.weekDays}>
        {getActiveWeek().trainingUnits.map((unit) => (
          <div 
            key={unit.id}
            className={`${styles.dayCard} ${activeTrainingUnitId === unit.id ? styles.activeDay : ''} ${styles[unit.status]} ${isDayExpanded(unit.id) ? styles.expandedDay : ''}`}
            onClick={() => handleDayClick(unit.id)}
          >
            <div className={styles.dayHeader}>
              <div className={styles.dayDate}>
                <FaCalendarAlt />
                {new Date(unit.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>
              <div className={styles.sessionStatus}>
                {unit.status === 'completed' && <span className={styles.statusCompleted}><FaCheck /> Terminé</span>}
                {unit.status === 'in-progress' && <span className={styles.statusInProgress}><FaClock /> En cours</span>}
                {unit.status === 'planned' && <span className={styles.statusPlanned}><FaCalendarAlt /> Planifié</span>}
                {unit.status === 'missed' && <span className={styles.statusMissed}><FaExclamationTriangle /> Manqué</span>}
              </div>
            </div>
            <h3 className={styles.sessionName}>{unit.name}</h3>
            <div className={styles.sessionStats}>
              <div className={styles.statItem}>
                <FaDumbbell className={styles.statIcon} />
                <div className={styles.statValue}>{unit.totalTonnage.toLocaleString()} kg</div>
                <div className={styles.statLabel}>Tonnage</div>
              </div>
              
              {unit.duration && (
                <div className={styles.statItem}>
                  <FaStopwatch className={styles.statIcon} />
                  <div className={styles.statValue}>{unit.duration} min</div>
                  <div className={styles.statLabel}>Durée</div>
                </div>
              )}
              
              <div className={styles.statItem}>
                <FaRunning className={styles.statIcon} />
                <div className={styles.statValue}>{unit.exercises.length}</div>
                <div className={styles.statLabel}>Exercices</div>
              </div>
            </div>
            <button 
              className={styles.expandButton}
              onClick={(e) => {
                e.stopPropagation(); // Empêcher la propagation du clic à la carte parente
                toggleDayExpansion(unit.id);
              }}
              title={isDayExpanded(unit.id) ? "Réduire" : "Développer"}
            >
              {isDayExpanded(unit.id) ? <FaMinus /> : <FaPlus />}
            </button>
            {isDayExpanded(unit.id) && (
              <div className={styles.sessionDetail}>
                <div className={styles.sessionDetailHeader}>
                  <h2>{unit.name}</h2>
                  {unit.status === 'completed' && (
                    <div className={styles.tonnageHighlight}>
                      <FaWeight />
                      <span>Tonnage total: </span>
                      <strong>{unit.totalTonnage.toLocaleString()} kg</strong>
                    </div>
                  )}
                </div>
                
                <div className={styles.exercises}>
                  {unit.exercises.map((exercise) => (
                    <div key={exercise.id} className={styles.exercise}>
                      <div className={styles.exerciseHeader}>
                        <h3>{exercise.name}</h3>
                        <div className={styles.exerciseTags}>
                          {exercise.category && (
                            <span className={styles.exerciseCategory}>{exercise.category}</span>
                          )}
                          {exercise.targetMuscleGroups && exercise.targetMuscleGroups.map((muscle, index) => (
                            <span key={index} className={styles.targetMuscle}>{muscle}</span>
                          ))}
                          {exercise.tags && exercise.tags.map((tag, index) => (
                            <span key={index} className={styles.exerciseTag}>
                              <FaTag />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className={styles.exerciseSets}>
                        <div className={styles.setsHeader}>
                          <div>Série</div>
                          <div>Charge (kg)</div>
                          <div>Reps</div>
                          <div>RPE</div>
                          <div className={styles.setActions}>Actions</div>
                        </div>
                        {exercise.sets.map((set) => (
                          <div 
                            key={set.id} 
                            className={`${styles.setRow} ${set.completed ? styles.completedSet : ''}`}
                          >
                            <div className={styles.setNumber}>{set.id.replace(`${exercise.id}-set`, '')}</div>
                            
                            {editMode ? (
                              <div className={styles.setWeight}>
                                <input 
                                  type="number"
                                  className={styles.setInput}
                                  value={set.weight}
                                  onChange={(e) => updateSetValue(exercise.id, set.id, 'weight', parseFloat(e.target.value))}
                                />
                              </div>
                            ) : (
                              <div className={styles.setWeight}>{set.weight}</div>
                            )}
                            
                            {editMode ? (
                              <div className={styles.setReps}>
                                <input 
                                  type="number"
                                  className={styles.setInput}
                                  value={set.reps}
                                  onChange={(e) => updateSetValue(exercise.id, set.id, 'reps', parseInt(e.target.value))}
                                />
                              </div>
                            ) : (
                              <div className={styles.setReps}>{set.reps}</div>
                            )}
                            
                            {editMode ? (
                              <div className={styles.setRpe}>
                                <input 
                                  type="number"
                                  className={styles.setInput}
                                  value={set.rpe}
                                  min="0"
                                  max="10"
                                  step="0.5"
                                  onChange={(e) => updateSetValue(exercise.id, set.id, 'rpe', parseFloat(e.target.value))}
                                />
                              </div>
                            ) : (
                              <div className={styles.setRpe}>{set.rpe}</div>
                            )}
                            
                            <div className={styles.setActions}>
                              <button 
                                className={`${styles.setActionButton} ${styles.completeButton} ${set.completed ? styles.active : ''}`}
                                onClick={() => toggleSetCompletion(exercise.id, set.id)}
                                title={set.completed ? "Annuler" : "Marquer comme terminé"}
                              >
                                <FaCheck />
                              </button>
                              
                              <button 
                                className={`${styles.setActionButton} ${styles.videoButton} ${selectedExerciseForVideo === exercise.id && selectedSetForVideo === set.id ? styles.recording : ''}`}
                                onClick={() => handleVideoButtonClick(exercise.id, set.id)}
                                title="Enregistrer une vidéo"
                              >
                                {selectedExerciseForVideo === exercise.id && selectedSetForVideo === set.id ? <FaStop /> : <FaVideo />}
                              </button>
                              
                              {set.videoUrl && (
                                <button 
                                  className={`${styles.setActionButton} ${styles.playButton}`}
                                  onClick={() => playVideo(set.videoUrl || '')}
                                  title="Regarder la vidéo"
                                >
                                  <FaPlay />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Vidéo prévisualisée */}
      {videoRecording && (
        <div className={styles.videoRecording}>
          <video ref={videoRef} autoPlay muted playsInline className={styles.videoPreview}></video>
          <button 
            className={styles.stopRecordingButton}
            onClick={stopVideoRecording}
          >
            Arrêter l'enregistrement
          </button>
        </div>
      )}
      
      {/* Calculateur de charges */}
      {showCalculator && (
        <div className={styles.calculator}>
          <div className={styles.calculatorHeader}>
            <h3>Calculateur</h3>
            <button 
              className={styles.calculatorClose}
              onClick={() => setShowCalculator(false)}
            >
              ×
            </button>
          </div>
          
          <div className={styles.calculatorForm}>
            <div className={styles.calculatorField}>
              <label>Répétitions maximales (1RM)</label>
              <input 
                type="number" 
                value={oneRepMax} 
                onChange={(e) => setOneRepMax(Number(e.target.value))}
                className={styles.calculatorInput} 
                placeholder="ex: 100" 
              />
            </div>
            
            <div className={styles.calculatorField}>
              <label>Nombre de répétitions cibles</label>
              <input 
                type="number" 
                value={targetReps} 
                onChange={(e) => setTargetReps(Number(e.target.value))}
                className={styles.calculatorInput} 
                placeholder="ex: 10" 
              />
            </div>
            
            <div className={styles.calculatorField}>
              <label>Exercice</label>
              <select 
                value={selectedExerciseForCalculator} 
                onChange={(e) => setSelectedExerciseForCalculator(e.target.value)}
                className={styles.calculatorSelect}
              >
                <option value="">Sélectionner un exercice</option>
                {getActiveTrainingUnit()?.exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.calculatorField}>
              <label>Série</label>
              <select 
                value={selectedSetForCalculator} 
                onChange={(e) => setSelectedSetForCalculator(e.target.value)}
                className={styles.calculatorSelect}
                disabled={!selectedExerciseForCalculator}
              >
                <option value="">Sélectionner une série</option>
                {getActiveTrainingUnit()?.exercises.find(ex => ex.id === selectedExerciseForCalculator)?.sets.map((set, index) => (
                  <option key={set.id} value={set.id}>Série {index + 1} - {set.reps}x{set.weight} kg</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className={styles.calculatorResult}>
            <h4>Charge recommandée</h4>
            <div className={styles.calculatorResultValue}>{calculatedWeight} kg</div>
            <button 
              className={styles.applyButton}
              onClick={() => {
                if (selectedExerciseForCalculator && selectedSetForCalculator) {
                  const exercise = getActiveTrainingUnit()?.exercises.find(
                    ex => ex.id === selectedExerciseForCalculator
                  );
                  if (exercise) {
                    updateSetValue(exercise.id, selectedSetForCalculator, 'weight', calculatedWeight);
                  }
                }
              }}
            >
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingProgram;
