'use client';

import React, { useState } from 'react';
import { FaShareAlt, FaDownload, FaHistory, FaAngleRight, FaFilePdf, FaFileExport, FaLock } from 'react-icons/fa';
import jsPDF from 'jspdf';

interface RehabHistoryProps {
  patientName: string;
  patientId: string;
}

interface RehabHistoryItem {
  id: string;
  injury: string;
  bodyPart: string;
  startDate: string;
  endDate: string;
  durationWeeks: number;
  practitioner: string;
  practitionerId: number;
  success: number; // 0-100%
  summary: string;
  keyMetrics: {
    name: string;
    initialValue: number;
    finalValue: number;
    unit: string;
  }[];
  sessions: {
    date: string;
    notes: string;
    exercises: string[];
    pain: number; // 0-10
  }[];
  attachments?: {
    id: string;
    name: string;
    type: string; // pdf, image, etc.
    url: string;
    date: string;
  }[];
}

// Données d'exemple pour l'historique de rééducation
const exampleRehabHistory: RehabHistoryItem[] = [
  {
    id: "rh1",
    injury: "Entorse du ligament croisé antérieur",
    bodyPart: "Genou droit",
    startDate: "2024-02-15",
    endDate: "2024-07-30",
    durationWeeks: 24,
    practitioner: "Tony Stark",
    practitionerId: 4,
    success: 95,
    summary: "Rééducation complète suite à une reconstruction chirurgicale du ligament croisé antérieur. Le patient a suivi un protocole progressif de renforcement et de proprioception. Excellente adhérence au programme d'exercices à domicile, ce qui a contribué significativement au succès de la rééducation. Retour aux activités sportives avec intégration progressive validée par des tests fonctionnels.",
    keyMetrics: [
      {
        name: "Flexion du genou",
        initialValue: 90,
        finalValue: 135,
        unit: "°"
      },
      {
        name: "Force quadriceps (% côté sain)",
        initialValue: 40,
        finalValue: 95,
        unit: "%"
      },
      {
        name: "Test de saut unipodal",
        initialValue: 0,
        finalValue: 92,
        unit: "%"
      },
      {
        name: "Douleur (0-10)",
        initialValue: 6,
        finalValue: 0,
        unit: ""
      }
    ],
    sessions: [
      {
        date: "2024-02-15",
        notes: "Première séance post-opératoire. Mobilisation passive limitée. Contractions isométriques du quadriceps. Gestion de l'œdème.",
        exercises: ["Contractions isométriques", "Mobilisation passive", "Cryothérapie"],
        pain: 6
      },
      {
        date: "2024-03-01",
        notes: "Augmentation progressive de l'amplitude articulaire. Travail de l'extension terminale. Début de mise en charge partielle.",
        exercises: ["Flexion active assistée", "Extension terminale", "Marche avec béquilles"],
        pain: 4
      },
      {
        date: "2024-04-10",
        notes: "Renforcement actif du quadriceps et des ischio-jambiers. Travail proprioceptif en décharge.",
        exercises: ["Leg press", "Vélo stationnaire", "Proprioception assise"],
        pain: 3
      },
      {
        date: "2024-05-15",
        notes: "Renforcement en chaîne fermée. Travail proprioceptif en charge. Augmentation progressive des résistances.",
        exercises: ["Squats", "Fentes", "Équilibre unipodal"],
        pain: 2
      },
      {
        date: "2024-06-20",
        notes: "Introduction de mouvements multidirectionnels. Exercices pliométriques légers. Travail cardio intensifié.",
        exercises: ["Pas chassés", "Sauts contrôlés", "Course légère"],
        pain: 1
      },
      {
        date: "2024-07-30",
        notes: "Évaluation finale. Tests fonctionnels validés. Programme de maintien et prévention établi. Retour au sport autorisé avec progression.",
        exercises: ["Tests fonctionnels", "Sprints", "Changements de direction"],
        pain: 0
      }
    ],
    attachments: [
      {
        id: "att1",
        name: "IRM initiale - Rupture LCA",
        type: "pdf",
        url: "/documents/irm_lca.pdf",
        date: "2024-01-20"
      },
      {
        id: "att2",
        name: "Compte-rendu opératoire",
        type: "pdf",
        url: "/documents/cr_op_lca.pdf",
        date: "2024-02-10"
      },
      {
        id: "att3",
        name: "Programme d'exercices domicile",
        type: "pdf",
        url: "/documents/exo_domicile_lca.pdf",
        date: "2024-03-15"
      },
      {
        id: "att4",
        name: "Tests fonctionnels finaux",
        type: "pdf",
        url: "/documents/tests_finaux_lca.pdf",
        date: "2024-07-30"
      }
    ]
  },
  {
    id: "rh2",
    injury: "Tendinopathie achilléenne",
    bodyPart: "Cheville gauche",
    startDate: "2023-09-10",
    endDate: "2023-12-05",
    durationWeeks: 12,
    practitioner: "Tony Stark",
    practitionerId: 4,
    success: 85,
    summary: "Prise en charge d'une tendinopathie d'Achille chronique chez un coureur de fond. Approche combinant repos relatif, exercices excentriques progressifs, et modification technique de la course. Bonne évolution avec diminution significative de la douleur et reprise progressive de la course.",
    keyMetrics: [
      {
        name: "Douleur à la palpation (0-10)",
        initialValue: 8,
        finalValue: 1,
        unit: ""
      },
      {
        name: "Douleur à l'effort (0-10)",
        initialValue: 7,
        finalValue: 2,
        unit: ""
      },
      {
        name: "Force flexion plantaire",
        initialValue: 65,
        finalValue: 90,
        unit: "%"
      },
      {
        name: "Distance de course sans douleur",
        initialValue: 0.5,
        finalValue: 8,
        unit: "km"
      }
    ],
    sessions: [
      {
        date: "2023-09-10",
        notes: "Évaluation initiale. Tendon épaissi et douloureux à la palpation. Douleur à la contraction contre résistance et à l'étirement.",
        exercises: ["Étirements doux", "Massage transverse", "Cryothérapie"],
        pain: 8
      },
      {
        date: "2023-09-25",
        notes: "Introduction des exercices excentriques de faible intensité. Conseil sur le repos et l'adaptation des activités.",
        exercises: ["Excentriques Alfredson niveau 1", "Proprioception", "Mobilisation sous-talienne"],
        pain: 6
      },
      {
        date: "2023-10-15",
        notes: "Progression des exercices excentriques. Analyse de la technique de course et recommandations.",
        exercises: ["Excentriques Alfredson niveau 2", "Gainage", "Étirements globaux"],
        pain: 4
      },
      {
        date: "2023-11-05",
        notes: "Intégration d'exercices fonctionnels. Reprise progressive de la course avec adaptation technique.",
        exercises: ["Excentriques avec charge", "Plyométrie légère", "Course technique"],
        pain: 3
      },
      {
        date: "2023-12-05",
        notes: "Évaluation finale. Programme de prévention des récidives. Conseils sur la progression du volume de course.",
        exercises: ["Tests fonctionnels", "Plan de course progressif", "Exercices de maintien"],
        pain: 1
      }
    ],
    attachments: [
      {
        id: "att5",
        name: "Échographie tendineuse initiale",
        type: "pdf",
        url: "/documents/echo_achille.pdf",
        date: "2023-09-05"
      },
      {
        id: "att6",
        name: "Programme d'exercices excentriques",
        type: "pdf",
        url: "/documents/exo_excentriques_achille.pdf",
        date: "2023-09-25"
      },
      {
        id: "att7",
        name: "Analyse vidéo technique de course",
        type: "pdf",
        url: "/documents/analyse_course.pdf",
        date: "2023-10-15"
      }
    ]
  }
];

const RehabHistory: React.FC<RehabHistoryProps> = ({ patientName, patientId }) => {
  const [expandedRehabId, setExpandedRehabId] = useState<string | null>(null);
  const [activeAttachment, setActiveAttachment] = useState<string | null>(null);
  
  // Utiliser les données d'exemple pour ce composant
  const rehabHistory = exampleRehabHistory;

  const handleToggleExpand = (id: string) => {
    if (expandedRehabId === id) {
      setExpandedRehabId(null);
    } else {
      setExpandedRehabId(id);
    }
  };

  const generateSummaryPDF = (rehab: RehabHistoryItem) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // En-tête
    doc.setFillColor(0, 38, 65);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 107, 0);
    doc.setFontSize(22);
    doc.text('Résumé de Rééducation', pageWidth / 2, 15, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    
    // Informations patient
    doc.setFontSize(16);
    doc.text('Patient:', 20, 40);
    doc.setFontSize(14);
    doc.text(`Nom: ${patientName}`, 30, 50);
    doc.text(`ID: ${patientId}`, 30, 60);
    
    // Informations de blessure
    doc.setFontSize(16);
    doc.text('Détails de la blessure:', 20, 80);
    doc.setFontSize(14);
    doc.text(`Blessure: ${rehab.injury}`, 30, 90);
    doc.text(`Partie du corps: ${rehab.bodyPart}`, 30, 100);
    doc.text(`Début: ${new Date(rehab.startDate).toLocaleDateString('fr-FR')}`, 30, 110);
    doc.text(`Fin: ${new Date(rehab.endDate).toLocaleDateString('fr-FR')}`, 30, 120);
    doc.text(`Durée: ${rehab.durationWeeks} semaines`, 30, 130);
    doc.text(`Praticien: ${rehab.practitioner}`, 30, 140);
    
    // Résultat et résumé
    doc.setFontSize(16);
    doc.text('Résultat:', 20, 160);
    doc.setFontSize(14);
    doc.text(`Taux de succès: ${rehab.success}%`, 30, 170);
    
    // Résumé
    doc.setFontSize(16);
    doc.text('Résumé:', 20, 190);
    doc.setFontSize(12);
    
    // Gestion des résumés trop longs avec wrap de texte
    const splitText = doc.splitTextToSize(rehab.summary, pageWidth - 40);
    doc.text(splitText, 20, 200);
    
    let yPos = 200 + splitText.length * 7;
    
    // Métriques clés
    if (yPos > 250) {
      doc.addPage();
      yPos = 30;
    }
    
    doc.setFontSize(16);
    doc.text('Métriques clés:', 20, yPos);
    yPos += 10;
    
    rehab.keyMetrics.forEach((metric, index) => {
      doc.setFontSize(12);
      doc.text(`${metric.name}: ${metric.initialValue} ${metric.unit} → ${metric.finalValue} ${metric.unit}`, 30, yPos + (index * 10));
    });
    
    yPos += rehab.keyMetrics.length * 10 + 20;
    
    // Sessions
    if (yPos > 250) {
      doc.addPage();
      yPos = 30;
    }
    
    doc.setFontSize(16);
    doc.text('Sessions (résumé):', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Nombre total de sessions: ${rehab.sessions.length}`, 30, yPos);
    yPos += 10;
    
    doc.text(`Première session: ${new Date(rehab.sessions[0].date).toLocaleDateString('fr-FR')}`, 30, yPos);
    yPos += 10;
    
    const lastSession = rehab.sessions[rehab.sessions.length - 1];
    doc.text(`Dernière session: ${new Date(lastSession.date).toLocaleDateString('fr-FR')}`, 30, yPos);
    yPos += 10;
    
    doc.text(`Niveau de douleur initial: ${rehab.sessions[0].pain}/10`, 30, yPos);
    yPos += 10;
    
    doc.text(`Niveau de douleur final: ${lastSession.pain}/10`, 30, yPos);
    
    // Pied de page
    const today = new Date().toLocaleDateString('fr-FR');
    doc.setFontSize(10);
    doc.text(`Document généré le ${today} via Tuatha Santé`, pageWidth / 2, 280, { align: 'center' });
    
    // Téléchargement du PDF
    doc.save(`resume_reeducation_${patientName.replace(' ', '_')}_${rehab.bodyPart.replace(' ', '_')}.pdf`);
  };

  const shareSummary = (rehab: RehabHistoryItem) => {
    // Création de l'URL de partage
    const shareData = {
      title: `Rééducation: ${rehab.injury} - ${patientName}`,
      text: `Résumé de la rééducation de ${patientName} pour ${rehab.injury} (${rehab.bodyPart}), effectuée par ${rehab.practitioner} du ${new Date(rehab.startDate).toLocaleDateString('fr-FR')} au ${new Date(rehab.endDate).toLocaleDateString('fr-FR')}.`,
      url: window.location.href
    };
    
    // Utilisation de l'API Web Share si disponible
    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => console.log('Partagé avec succès'))
        .catch((error) => console.log('Erreur lors du partage:', error));
    } else {
      // Fallback si l'API Web Share n'est pas disponible
      const emailSubject = encodeURIComponent(`Rééducation: ${rehab.injury} - ${patientName}`);
      const emailBody = encodeURIComponent(
        `Résumé de la rééducation de ${patientName} pour ${rehab.injury} (${rehab.bodyPart}), effectuée par ${rehab.practitioner} du ${new Date(rehab.startDate).toLocaleDateString('fr-FR')} au ${new Date(rehab.endDate).toLocaleDateString('fr-FR')}.
        
        ${rehab.summary}
        
        Taux de succès: ${rehab.success}%
        
        Métriques clés:
        ${rehab.keyMetrics.map(m => `${m.name}: ${m.initialValue} ${m.unit} → ${m.finalValue} ${m.unit}`).join('\n')}
        `
      );
      
      window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
    }
  };

  return (
    <div style={{
      width: '100%',
      background: 'rgba(0, 38, 65, 0.35)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#FF6B00', margin: '0 0 5px 0', display: 'flex', alignItems: 'center' }}>
          <FaHistory style={{ marginRight: '10px' }} /> Historique des Rééducations
        </h2>
        <p style={{ margin: '0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          Consultez l'historique des prises en charge de {patientName}
        </p>
      </div>
      
      {rehabHistory.length === 0 ? (
        <div style={{ 
          padding: '30px', 
          textAlign: 'center', 
          background: 'rgba(0, 17, 13, 0.3)',
          borderRadius: '10px'
        }}>
          <p>Aucun historique de rééducation disponible pour ce patient.</p>
        </div>
      ) : (
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {rehabHistory.map((rehab) => (
            <div 
              key={rehab.id} 
              style={{ 
                marginBottom: '15px',
                background: 'rgba(0, 17, 13, 0.3)',
                borderRadius: '15px',
                overflow: 'hidden'
              }}
            >
              {/* En-tête de la rééducation */}
              <div 
                onClick={() => handleToggleExpand(rehab.id)}
                style={{ 
                  padding: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: expandedRehabId === rehab.id ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#FF6B00' }}>
                    {rehab.injury} ({rehab.bodyPart})
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {new Date(rehab.startDate).toLocaleDateString('fr-FR')} - {new Date(rehab.endDate).toLocaleDateString('fr-FR')} • {rehab.durationWeeks} semaines
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    marginRight: '15px',
                    background: rehab.success >= 80 ? 'rgba(76, 175, 80, 0.2)' : rehab.success >= 50 ? 'rgba(255, 152, 0, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                    color: rehab.success >= 80 ? '#4CAF50' : rehab.success >= 50 ? '#FF9800' : '#F44336',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {rehab.success}% de succès
                  </div>
                  <FaAngleRight style={{ 
                    transform: expandedRehabId === rehab.id ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }} />
                </div>
              </div>
              
              {/* Contenu détaillé quand expanded */}
              {expandedRehabId === rehab.id && (
                <div style={{ padding: '15px' }}>
                  {/* Résumé */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', margin: '0 0 10px 0' }}>Résumé</h4>
                    <p style={{ margin: '0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {rehab.summary}
                    </p>
                  </div>
                  
                  {/* Métriques clés */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', margin: '0 0 10px 0' }}>Métriques clés</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {rehab.keyMetrics.map((metric, index) => (
                        <div key={index} style={{ 
                          flex: '1',
                          minWidth: '150px',
                          background: 'rgba(0, 38, 65, 0.3)',
                          borderRadius: '8px',
                          padding: '10px'
                        }}>
                          <div style={{ fontSize: '0.85rem', marginBottom: '5px', color: 'rgba(255, 255, 255, 0.7)' }}>
                            {metric.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                              {metric.initialValue} {metric.unit}
                            </span>
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>➔</span>
                            <span style={{ 
                              fontSize: '0.9rem', 
                              fontWeight: 'bold', 
                              color: metric.finalValue > metric.initialValue ? '#4CAF50' : metric.finalValue < metric.initialValue ? '#F44336' : 'white'
                            }}>
                              {metric.finalValue} {metric.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sessions */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', margin: '0 0 10px 0' }}>
                      Sessions ({rehab.sessions.length})
                    </h4>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {rehab.sessions.slice(0, 5).map((session, index) => (
                        <div key={index} style={{ 
                          padding: '10px',
                          background: 'rgba(0, 38, 65, 0.2)',
                          borderRadius: '8px',
                          marginBottom: '8px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                              {new Date(session.date).toLocaleDateString('fr-FR')}
                            </span>
                            <span style={{ 
                              fontSize: '0.8rem',
                              padding: '2px 6px',
                              borderRadius: '8px',
                              background: session.pain <= 3 ? 'rgba(76, 175, 80, 0.2)' : session.pain <= 6 ? 'rgba(255, 152, 0, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                              color: session.pain <= 3 ? '#4CAF50' : session.pain <= 6 ? '#FF9800' : '#F44336',
                            }}>
                              Douleur: {session.pain}/10
                            </span>
                          </div>
                          <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            {session.notes}
                          </p>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                            <span style={{ fontWeight: 'bold' }}>Exercices:</span> {session.exercises.join(', ')}
                          </div>
                        </div>
                      ))}
                      {rehab.sessions.length > 5 && (
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '8px', 
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.85rem' 
                        }}>
                          + {rehab.sessions.length - 5} autres sessions
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Pièces jointes */}
                  {rehab.attachments && rehab.attachments.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', margin: '0 0 10px 0' }}>
                        Documents associés
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {rehab.attachments.map((attachment) => (
                          <div key={attachment.id} style={{ 
                            padding: '10px',
                            background: 'rgba(0, 38, 65, 0.3)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            width: 'calc(50% - 10px)'
                          }}>
                            <div style={{ 
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '8px',
                              background: 'rgba(255, 107, 0, 0.15)',
                              color: '#FF6B00',
                              fontSize: '18px'
                            }}>
                              <FaFilePdf />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{attachment.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>{new Date(attachment.date).toLocaleDateString('fr-FR')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '20px'
                  }}>
                    <button 
                      onClick={() => shareSummary(rehab)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      <FaShareAlt /> Partager
                    </button>
                    <button 
                      onClick={() => generateSummaryPDF(rehab)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'linear-gradient(145deg, #FF6B00, #FF9248)',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      <FaDownload /> Télécharger résumé
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RehabHistory;
