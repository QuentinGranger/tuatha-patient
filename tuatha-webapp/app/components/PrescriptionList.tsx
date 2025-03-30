import React, { useState } from 'react';
import { FaPills, FaFilePdf, FaDownload, FaShareAlt, FaCalendarAlt, FaRedoAlt } from 'react-icons/fa';
import styles from './PrescriptionList.module.css';

export interface Prescription {
  id: string;
  title: string;
  date: string;
  doctor: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  expiryDate: string;
  refillsLeft: number;
  isPermanent: boolean;
}

interface PrescriptionListProps {
  prescriptions: Prescription[];
  onPrescriptionClick?: (prescription: Prescription) => void;
  onRequestRefill?: (prescription: Prescription) => void;
  onDownload?: (prescription: Prescription) => void;
  onShare?: (prescription: Prescription) => void;
}

const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  onPrescriptionClick,
  onRequestRefill,
  onDownload,
  onShare
}) => {
  const [expandedPrescription, setExpandedPrescription] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedPrescription === id) {
      setExpandedPrescription(null);
    } else {
      setExpandedPrescription(id);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Mes ordonnances
      </h2>
      <p className={styles.subtitle}>
        Consultez vos ordonnances actuelles et demandez des renouvellements
      </p>

      <div className={styles.prescriptionsList}>
        {prescriptions.length === 0 ? (
          <div className={styles.emptyState}>
            Vous n'avez aucune ordonnance active pour le moment.
          </div>
        ) : (
          prescriptions.map((prescription) => (
            <div 
              key={prescription.id} 
              className={styles.prescriptionCard}
            >
              <div 
                className={styles.prescriptionHeader}
                onClick={() => {
                  toggleExpand(prescription.id);
                  if (onPrescriptionClick) onPrescriptionClick(prescription);
                }}
              >
                <div className={styles.headerRow}>
                  <div className={styles.iconWrapper}>
                    <div className={styles.icon}>
                      <FaPills />
                    </div>
                    <div className={styles.prescriptionInfo}>
                      <h3 className={styles.prescriptionName}>{prescription.title}</h3>
                      <p className={styles.prescriptionDate}>
                        <FaCalendarAlt size={12} /> {new Date(prescription.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`${styles.statusBadge} ${
                    prescription.isPermanent 
                      ? styles.statusActive
                      : new Date(prescription.expiryDate) < new Date() 
                        ? styles.statusExpired 
                        : styles.statusExpiring
                  }`}>
                    {prescription.isPermanent ? 'Permanente' : 
                      new Date(prescription.expiryDate) < new Date() ? 'Expirée' : 
                      `Expire le ${new Date(prescription.expiryDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}`
                    }
                  </div>
                </div>
                
                <p className={styles.doctorInfo}>
                  {`Dr. ${prescription.doctor}`}
                </p>
              </div>
              
              {expandedPrescription === prescription.id && (
                <div className={styles.expandedContent}>
                  <div className={styles.medicationList}>
                    <h4 className={styles.medicationTitle}>Médicaments prescrits</h4>
                    
                    {prescription.medications.map((med, index) => (
                      <div 
                        key={index}
                        className={styles.medicationItem}
                      >
                        <div className={styles.medicationHeader}>
                          <h5 className={styles.medicationName}>{med.name}</h5>
                          <span className={styles.medicationDuration}>{med.duration}</span>
                        </div>
                        <p className={styles.medicationDetails}>{med.dosage} - {med.frequency}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.actionButtons}>
                    {!prescription.isPermanent && prescription.refillsLeft > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRequestRefill) onRequestRefill(prescription);
                        }}
                        className={styles.refillButton}
                      >
                        <FaRedoAlt size={14} /> Renouveler ({prescription.refillsLeft})
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDownload) onDownload(prescription);
                      }}
                      className={styles.actionButton}
                    >
                      <FaDownload size={14} /> Télécharger
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onShare) onShare(prescription);
                      }}
                      className={styles.actionButton}
                    >
                      <FaShareAlt size={14} /> Partager
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PrescriptionList;
