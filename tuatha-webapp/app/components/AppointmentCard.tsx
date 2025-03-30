'use client';

import { IoCalendarOutline, IoTimeOutline, IoLocationOutline, IoPencil, IoTrash } from 'react-icons/io5';
import styles from './AppointmentManager.module.css';

// Définir les interfaces localement plutôt que d'importer de AppointmentManager
export interface Professional {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface Appointment {
  id: string;
  professionalId: number;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM
  duration: number; // En minutes
  location: string;
  type: string;
  notes?: string;
  status: 'upcoming' | 'past' | 'canceled';
  createdAt: string;
  updatedAt: string;
}

// Component pour afficher un rendez-vous
export function AppointmentCard({ 
  appointment, 
  onEdit, 
  onDelete, 
  professionals 
}: { 
  appointment: Appointment, 
  onEdit: (id: string) => void, 
  onDelete: (id: string) => void,
  professionals: Professional[]
}) {
  const professional = professionals.find(p => p.id === appointment.professionalId) || {
    id: 0,
    name: "Professionnel inconnu",
    title: "Profession inconnue",
    subtitle: "",
    image: "/images/default-pro.jpg"
  };
  
  // Formater la date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };
  
  // Statut en français
  const statusMap: {[key: string]: string} = {
    'upcoming': 'À venir',
    'past': 'Passé',
    'canceled': 'Annulé'
  };
  
  // Calculer la couleur du statut
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming':
        return '#4CAF50';
      case 'past':
        return '#9E9E9E';
      case 'canceled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };
  
  return (
    <div className={styles.appointmentCard}>
      <div className={styles.appointmentCardContent}>
        <div className={styles.cardHeader}>
          <h3 style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600', color: 'white' }}>
            {professional.name}
          </h3>
          <p style={{ margin: '0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            {professional.title}
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            marginTop: '5px' 
          }}>
            <span style={{ 
              backgroundColor: getStatusColor(appointment.status), 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              display: 'inline-block' 
            }}></span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              {statusMap[appointment.status] || 'Statut inconnu'}
            </span>
          </div>
        </div>
        
        <div className={styles.cardInfo}>
          <p style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            margin: '8px 0',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            <IoCalendarOutline style={{ flexShrink: 0 }} />
            {formatDate(appointment.date)}
          </p>
          
          <p style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            margin: '8px 0',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            <IoTimeOutline style={{ flexShrink: 0 }} />
            {appointment.time} ({appointment.duration} min)
          </p>
          
          <p style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            margin: '8px 0',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            <IoLocationOutline style={{ flexShrink: 0 }} />
            {appointment.location}
          </p>
          
          {appointment.notes && (
            <div className={styles.appointmentNotes}>
              <p style={{ 
                margin: '10px 0 0 0',
                fontSize: '0.8rem',
                fontStyle: 'italic',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                Notes: {appointment.notes}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.appointmentActions}>
        <button 
          className={styles.editButton}
          onClick={() => onEdit(appointment.id)}
          aria-label="Modifier ce rendez-vous"
        >
          <IoPencil size={16} />
          <span>Modifier</span>
        </button>
        <button 
          className={styles.deleteButton}
          onClick={() => onDelete(appointment.id)}
          aria-label="Supprimer ce rendez-vous"
        >
          <IoTrash size={16} />
          <span>Annuler</span>
        </button>
      </div>
    </div>
  );
}

export default AppointmentCard;
