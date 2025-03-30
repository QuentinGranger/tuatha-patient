'use client';

import React, { useState } from 'react';
import { FaDownload, FaShareAlt, FaCalendarAlt, FaRunning, FaStopwatch } from 'react-icons/fa';
import styles from './RehabTable.module.css';
import jsPDF from 'jspdf';

interface RehabTableProps {
  patientName: string;
  patientId: string;
}

interface ExerciseProgram {
  id: string;
  name: string;
  targetArea: string;
  frequency: string;
  sets: number;
  reps: number;
  duration: string;
  intensity: string;
  notes: string;
  progressLevel: number; // 0-100%
  lastUpdated: string;
}

// Données d'exemple pour le programme de rééducation
const exampleExercisePrograms: ExerciseProgram[] = [
  {
    id: "ex1",
    name: "Squats isométriques",
    targetArea: "Quadriceps",
    frequency: "3x / semaine",
    sets: 3,
    reps: 15,
    duration: "30 secondes de maintien",
    intensity: "Modérée",
    notes: "Position maintenue à 90° de flexion du genou. Progression par augmentation du temps de maintien.",
    progressLevel: 75,
    lastUpdated: "2025-03-25"
  },
  {
    id: "ex2",
    name: "Extension du genou",
    targetArea: "Quadriceps",
    frequency: "4x / semaine",
    sets: 3,
    reps: 12,
    duration: "Contraction 3s, relâchement 2s",
    intensity: "Progressive",
    notes: "Commencer sans poids puis ajouter 1kg par semaine selon tolérance. Attention à ne pas créer de douleur.",
    progressLevel: 60,
    lastUpdated: "2025-03-27"
  },
  {
    id: "ex3",
    name: "Exercices proprioceptifs",
    targetArea: "Genou",
    frequency: "Quotidien",
    sets: 2,
    reps: 10,
    duration: "30 secondes par position",
    intensity: "Légère à modérée",
    notes: "Équilibre unipodal sur surface stable puis instable. Progression avec yeux fermés.",
    progressLevel: 85,
    lastUpdated: "2025-03-29"
  },
  {
    id: "ex4",
    name: "Vélo stationnaire",
    targetArea: "Système cardio-vasculaire",
    frequency: "3x / semaine",
    sets: 1,
    reps: 1,
    duration: "20 minutes",
    intensity: "Modérée",
    notes: "Maintenir une cadence de 70-80 RPM avec résistance légère. Augmenter progressivement la durée jusqu'à 30 minutes.",
    progressLevel: 90,
    lastUpdated: "2025-03-28"
  },
  {
    id: "ex5",
    name: "Step-up latéral",
    targetArea: "Hanches et stabilisateurs",
    frequency: "3x / semaine",
    sets: 3,
    reps: 10,
    duration: "Rythme contrôlé",
    intensity: "Modérée",
    notes: "Utiliser une marche de 15cm, monter latéralement puis redescendre en contrôlant le mouvement. Focaliser sur l'activation du moyen fessier.",
    progressLevel: 65,
    lastUpdated: "2025-03-26"
  }
];

const RehabTable: React.FC<RehabTableProps> = ({ patientName, patientId }) => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [exercisePrograms, setExercisePrograms] = useState<ExerciseProgram[]>(exampleExercisePrograms);
  
  // Informations du programme
  const programInfo = {
    programStartDate: "2025-02-15",
    programEndDate: "2025-05-30",
    currentPhase: "2 - Renforcement",
    nextAppointment: "2025-04-05"
  };
  
  const handleProgressUpdate = (id: string, newProgress: number) => {
    setExercisePrograms(prevPrograms => 
      prevPrograms.map(program => 
        program.id === id 
          ? { ...program, progressLevel: newProgress, lastUpdated: new Date().toISOString().split('T')[0] } 
          : program
      )
    );
  };
  
  const calculateOverallProgress = (): number => {
    if (exercisePrograms.length === 0) return 0;
    
    const totalProgress = exercisePrograms.reduce((sum, program) => sum + program.progressLevel, 0);
    return Math.round(totalProgress / exercisePrograms.length);
  };
  
  const downloadRehabProgramPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // En-tête
    doc.setFillColor(0, 38, 65);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 107, 0);
    doc.setFontSize(22);
    doc.text('Programme de Rééducation', pageWidth / 2, 15, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    
    // Informations patient
    doc.setFontSize(16);
    doc.text('Patient:', 20, 40);
    doc.setFontSize(14);
    doc.text(`Nom: ${patientName}`, 30, 50);
    
    // Informations du programme
    doc.setFontSize(16);
    doc.text('Programme:', 20, 70);
    doc.setFontSize(14);
    doc.text(`Phase actuelle: ${programInfo.currentPhase}`, 30, 80);
    doc.text(`Date de début: ${new Date(programInfo.programStartDate).toLocaleDateString('fr-FR')}`, 30, 90);
    doc.text(`Date de fin prévue: ${new Date(programInfo.programEndDate).toLocaleDateString('fr-FR')}`, 30, 100);
    doc.text(`Prochain rendez-vous: ${new Date(programInfo.nextAppointment).toLocaleDateString('fr-FR')}`, 30, 110);
    doc.text(`Progression globale: ${calculateOverallProgress()}%`, 30, 120);
    
    // Tableau des exercices
    doc.setFontSize(16);
    doc.text('Exercices prescrits:', 20, 140);
    
    let yPos = 150;
    
    // En-tête du tableau
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, pageWidth - 40, 10, 'F');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Exercice', 25, yPos + 7);
    doc.text('Zone', 80, yPos + 7);
    doc.text('Fréquence', 115, yPos + 7);
    doc.text('Séries x Répétitions', 150, yPos + 7);
    
    yPos += 15;
    
    // Contenu du tableau
    exercisePrograms.forEach((program, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setFontSize(10);
      doc.text(program.name, 25, yPos);
      doc.text(program.targetArea, 80, yPos);
      doc.text(program.frequency, 115, yPos);
      doc.text(`${program.sets} x ${program.reps}`, 150, yPos);
      
      // Notes
      yPos += 12;
      doc.setFontSize(9);
      doc.text(`Notes: ${program.notes}`, 25, yPos);
      
      // Séparateur
      yPos += 8;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, pageWidth - 20, yPos);
      
      yPos += 12;
    });
    
    // Pied de page
    const today = new Date().toLocaleDateString('fr-FR');
    doc.setFontSize(10);
    doc.text(`Document généré le ${today} via Tuatha Santé`, pageWidth / 2, 280, { align: 'center' });
    
    // Téléchargement du PDF
    doc.save(`programme_reeducation_${patientName.replace(' ', '_')}.pdf`);
  };
  
  const shareRehabProgram = () => {
    // Création de l'URL de partage
    const shareData = {
      title: `Programme de rééducation de ${patientName}`,
      text: `Voici le programme de rééducation actuel de ${patientName} (Phase: ${programInfo.currentPhase}). Progression globale: ${calculateOverallProgress()}%.`,
      url: window.location.href
    };
    
    // Utilisation de l'API Web Share si disponible
    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => console.log('Partagé avec succès'))
        .catch((error) => console.log('Erreur lors du partage:', error));
    } else {
      // Fallback si l'API Web Share n'est pas disponible
      const emailSubject = encodeURIComponent(`Programme de rééducation - ${patientName}`);
      const emailBody = encodeURIComponent(
        `Programme de rééducation actuel de ${patientName}
        
        Phase: ${programInfo.currentPhase}
        Date de début: ${new Date(programInfo.programStartDate).toLocaleDateString('fr-FR')}
        Date de fin prévue: ${new Date(programInfo.programEndDate).toLocaleDateString('fr-FR')}
        Prochain rendez-vous: ${new Date(programInfo.nextAppointment).toLocaleDateString('fr-FR')}
        Progression globale: ${calculateOverallProgress()}%
        
        Exercices prescrits:
        ${exercisePrograms.map(p => `- ${p.name} (${p.targetArea}): ${p.sets}x${p.reps}, ${p.frequency}`).join('\n')}
        `
      );
      
      window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
    }
  };

  return (
    <div id="rehab-table" className={styles.rehabTableContainer}>
      <div className={styles.rehabTableHeader}>
        <h2 className={styles.rehabTableTitle}>
          Programme de Rééducation Actuel
        </h2>
        <p className={styles.rehabTableSubtitle}>
          Phase {programInfo.currentPhase} • Progression globale: {calculateOverallProgress()}%
        </p>
      </div>
      
      <div className={styles.rehabInfoCards}>
        <div className={styles.rehabInfoCard}>
          <div className={styles.rehabInfoCardIcon}>
            <FaCalendarAlt />
          </div>
          <div className={styles.rehabInfoCardContent}>
            <div className={styles.rehabInfoCardLabel}>Début du programme</div>
            <div className={styles.rehabInfoCardValue}>{new Date(programInfo.programStartDate).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>
        
        <div className={styles.rehabInfoCard}>
          <div className={styles.rehabInfoCardIcon}>
            <FaStopwatch />
          </div>
          <div className={styles.rehabInfoCardContent}>
            <div className={styles.rehabInfoCardLabel}>Fin prévue</div>
            <div className={styles.rehabInfoCardValue}>{new Date(programInfo.programEndDate).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>
        
        <div className={styles.rehabInfoCard}>
          <div className={styles.rehabInfoCardIcon}>
            <FaCalendarAlt />
          </div>
          <div className={styles.rehabInfoCardContent}>
            <div className={styles.rehabInfoCardLabel}>Prochain RDV</div>
            <div className={styles.rehabInfoCardValue}>{new Date(programInfo.nextAppointment).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>
      </div>
      
      <div className={styles.rehabTableWrapper}>
        <table className={styles.rehabTable}>
          <thead>
            <tr>
              <th>Exercice</th>
              <th>Zone</th>
              <th>Fréquence</th>
              <th>Séries × Reps</th>
              <th>Progression</th>
            </tr>
          </thead>
          <tbody>
            {exercisePrograms.map((program) => (
              <tr 
                key={program.id} 
                onClick={() => setSelectedProgram(program.id === selectedProgram ? null : program.id)}
                className={program.id === selectedProgram ? styles.selectedRow : ''}
              >
                <td className={styles.exerciseName}>{program.name}</td>
                <td>{program.targetArea}</td>
                <td>{program.frequency}</td>
                <td>{program.sets} × {program.reps}</td>
                <td>
                  <div className={styles.progressBarContainer}>
                    <div 
                      className={styles.progressBar} 
                      style={{ 
                        width: `${program.progressLevel}%`,
                        backgroundColor: program.progressLevel < 30 ? '#F44336' : 
                          program.progressLevel < 70 ? '#FF9800' : '#4CAF50'
                      }}
                    ></div>
                    <span className={styles.progressText}>{program.progressLevel}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedProgram && (
        <div className={styles.exerciseDetailPanel}>
          {(() => {
            const program = exercisePrograms.find(p => p.id === selectedProgram);
            if (!program) return null;
            
            return (
              <>
                <div className={styles.exerciseDetailHeader}>
                  <h3 className={styles.exerciseDetailTitle}>{program.name}</h3>
                  <div className={styles.exerciseDetailTargetArea}>{program.targetArea}</div>
                </div>
                
                <div className={styles.exerciseDetailContent}>
                  <div className={styles.exerciseDetailItem}>
                    <span className={styles.exerciseDetailLabel}>Fréquence:</span>
                    <span className={styles.exerciseDetailValue}>{program.frequency}</span>
                  </div>
                  <div className={styles.exerciseDetailItem}>
                    <span className={styles.exerciseDetailLabel}>Séries × Répétitions:</span>
                    <span className={styles.exerciseDetailValue}>{program.sets} × {program.reps}</span>
                  </div>
                  <div className={styles.exerciseDetailItem}>
                    <span className={styles.exerciseDetailLabel}>Durée:</span>
                    <span className={styles.exerciseDetailValue}>{program.duration}</span>
                  </div>
                  <div className={styles.exerciseDetailItem}>
                    <span className={styles.exerciseDetailLabel}>Intensité:</span>
                    <span className={styles.exerciseDetailValue}>{program.intensity}</span>
                  </div>
                  <div className={styles.exerciseDetailNotes}>
                    <span className={styles.exerciseDetailLabel}>Notes:</span>
                    <p className={styles.exerciseDetailNotesText}>{program.notes}</p>
                  </div>
                  
                  <div className={styles.exerciseDetailProgress}>
                    <span className={styles.exerciseDetailLabel}>Votre progression:</span>
                    <div className={styles.progressSliderContainer}>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={program.progressLevel} 
                        onChange={(e) => handleProgressUpdate(program.id, parseInt(e.target.value))}
                        className={styles.progressSlider}
                      />
                      <span className={styles.progressValue}>{program.progressLevel}%</span>
                    </div>
                  </div>
                  
                  <div className={styles.exerciseDetailLastUpdated}>
                    Dernière mise à jour: {new Date(program.lastUpdated).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
      
      <div className={styles.rehabTableActions}>
        <button 
          onClick={downloadRehabProgramPDF}
          className={`${styles.rehabTableButton} ${styles.primaryButton}`}
        >
          <FaDownload /> Télécharger PDF
        </button>
        <button 
          onClick={shareRehabProgram}
          className={`${styles.rehabTableButton} ${styles.secondaryButton}`}
        >
          <FaShareAlt /> Partager
        </button>
      </div>
    </div>
  );
};

export default RehabTable;
