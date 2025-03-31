'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './DailyTimeline.module.css';

// Type pour les événements
export interface TimelineEvent {
  id: string;
  title: string;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  duration: number; // En minutes
  professional?: {
    id: number;
    name: string;
    title: string;
    image?: string;
  };
  location?: string;
  type?: string;
  status?: 'upcoming' | 'past' | 'canceled' | 'ongoing';
  color?: string; // Couleur optionnelle pour l'événement
}

interface DailyTimelineProps {
  date: Date;
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

const DailyTimeline: React.FC<DailyTimelineProps> = ({ date, events, onEventClick }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const timelineRef = useRef<HTMLDivElement>(null);
  const isToday = isSameDay(date, new Date());
  
  // Vérifier si deux dates sont le même jour
  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  
  // Mettre à jour l'heure actuelle chaque minute
  useEffect(() => {
    if (isToday) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000); // 60000ms = 1 minute
      
      return () => clearInterval(timer);
    }
  }, [isToday]);
  
  // Scroll vers l'heure actuelle si c'est aujourd'hui
  useEffect(() => {
    if (isToday && timelineRef.current) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Calculer la position de scroll (en pourcentage de la journée depuis 6h)
      const startHour = 6;
      const totalHours = 16; // De 6h à 22h = 16 heures
      const currentHoursSince6 = hours - startHour + minutes / 60;
      const scrollPercentage = (currentHoursSince6 / totalHours) * 100;
      
      // Appliquer le scroll avec un délai pour permettre le rendu complet
      setTimeout(() => {
        if (timelineRef.current) {
          const scrollHeight = timelineRef.current.scrollHeight;
          timelineRef.current.scrollTop = (scrollPercentage / 100) * scrollHeight - 200; // -200px pour centrer
        }
      }, 500);
    }
  }, [isToday]);
  
  // Générer les créneaux horaires de 6h à 22h
  const generateTimeSlots = () => {
    const slots = [];
    
    // Première étape : attribuer chaque événement uniquement au créneau où il commence
    // pour éviter les rendus en double
    const eventsByHour = new Map<number, TimelineEvent[]>();
    
    // Initialiser toutes les heures avec un tableau vide
    for (let hour = 6; hour <= 22; hour++) {
      eventsByHour.set(hour, []);
    }
    
    // Attribuer chaque événement uniquement à son heure de début
    events.forEach(event => {
      const startHour = parseInt(event.startTime.split(':')[0]);
      
      // Ignorer les événements qui commencent en dehors de notre plage (6h-22h)
      if (startHour >= 6 && startHour <= 22) {
        const hourEvents = eventsByHour.get(startHour) || [];
        hourEvents.push(event);
        eventsByHour.set(startHour, hourEvents);
      }
    });
    
    // Maintenant, générer les créneaux avec les événements correctement attribués
    for (let hour = 6; hour <= 22; hour++) {
      // Déterminer si le créneau est zébré (alternance toutes les 2 heures)
      const isStriped = Math.floor(hour / 2) % 2 === 0;
      const hourEvents = eventsByHour.get(hour) || [];
      
      // Ajouter le créneau à la liste
      slots.push(
        <div 
          key={hour} 
          className={`${styles.timeSlot} ${isStriped ? styles.striped : ''}`}
        >
          <div className={styles.timeLabel}>
            {`${hour}:00`}
          </div>
          <div className={styles.slotContent}>
            {hourEvents.map((event, index) => {
              // Calculer le décalage horizontal pour éviter le chevauchement
              // quand plusieurs événements commencent à la même heure
              const offsetMultiplier = hourEvents.length > 1 ? index / (hourEvents.length) : 0;
              const horizontalOffset = offsetMultiplier * 5; // 5% de décalage
              
              return (
                <div 
                  key={event.id} 
                  className={`${styles.eventCard} ${styles[event.status || 'upcoming']}`}
                  style={{
                    // Calculer la position verticale et la hauteur basées sur l'heure de début et la durée
                    top: calculateEventTop(event, hour),
                    height: calculateEventHeight(event),
                    backgroundColor: event.color ? `${event.color}20` : undefined,
                    borderLeft: event.color ? `3px solid ${event.color}` : undefined,
                    // Ajouter un léger décalage horizontal pour éviter la superposition parfaite
                    left: `calc(10px + ${horizontalOffset}%)`,
                    right: `calc(10px + ${horizontalOffset}%)`
                  }}
                  onClick={() => onEventClick && onEventClick(event)}
                >
                  <div className={styles.eventTime}>
                    {event.startTime} - {event.endTime}
                  </div>
                  <div className={styles.eventContent}>
                    <div className={styles.eventTitle}>{event.title}</div>
                    {event.professional && (
                      <div className={styles.eventProfessional}>
                        {event.professional.image && (
                          <div className={styles.professionalImage}>
                            <img 
                              src={event.professional.image} 
                              alt={event.professional.name} 
                            />
                          </div>
                        )}
                        <div className={styles.professionalInfo}>
                          <span className={styles.professionalName}>{event.professional.name}</span>
                          <span className={styles.professionalTitle}>{event.professional.title}</span>
                        </div>
                      </div>
                    )}
                    {event.location && (
                      <div className={styles.eventLocation}>{event.location}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return slots;
  };
  
  // Calculer la position verticale de l'événement dans le créneau horaire
  const calculateEventTop = (event: TimelineEvent, slotHour: number) => {
    const [hours, minutes] = event.startTime.split(':').map(Number);
    
    // Si l'événement commence avant ce créneau, positionner en haut
    if (hours < slotHour) {
      return '0%';
    }
    
    // Sinon, calculer le pourcentage de l'heure
    const minutePercentage = (minutes / 60) * 100;
    return `${minutePercentage}%`;
  };
  
  // Calculer la hauteur de l'événement basée sur sa durée
  const calculateEventHeight = (event: TimelineEvent) => {
    // Un événement de 60 minutes = 100% de hauteur d'un créneau horaire
    const heightPercentage = Math.min(event.duration / 60 * 100, 100);
    return `${heightPercentage}%`;
  };
  
  // Calculer la position de la ligne de temps actuelle
  const calculateCurrentTimeLine = () => {
    if (!isToday) return null;
    
    const now = currentTime;
    const hours = now.getHours();
    
    // Si l'heure actuelle est en dehors de notre plage (6h-22h), ne pas afficher la ligne
    if (hours < 6 || hours > 22) return null;
    
    const minutes = now.getMinutes();
    const startHour = 6;
    
    // Calculer le pourcentage de la journée écoulée depuis 6h
    const totalMinutes = (22 - 6 + 1) * 60; // Minutes totales entre 6h et 22h
    const currentMinutes = (hours - startHour) * 60 + minutes;
    const percentage = (currentMinutes / totalMinutes) * 100;
    
    return (
      <div 
        className={styles.currentTimeLine} 
        style={{ top: `${percentage}%` }}
      >
        <div className={styles.timeIndicator}>
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  };
  
  return (
    <div className={styles.dailyTimeline} ref={timelineRef}>
      <div className={styles.timelineContainer}>
        {generateTimeSlots()}
        {calculateCurrentTimeLine()}
      </div>
    </div>
  );
};

export default DailyTimeline;
