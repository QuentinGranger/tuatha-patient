'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './WeekStrip.module.css';

interface WeekStripProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  events?: {
    date: string; // format: YYYY-MM-DD
    count: number;
  }[];
  startOnMonday?: boolean;
}

const DAYS_SHORT_FR = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];

const WeekStrip: React.FC<WeekStripProps> = ({
  currentDate,
  onDateSelect,
  events = [],
  startOnMonday = true
}) => {
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [touchStartX, setTouchStartX] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  
  // Générer la semaine courante
  useEffect(() => {
    const generateWeekDays = (date: Date) => {
      const result = [];
      const startDay = new Date(date);
      
      // Ajuster au lundi si startOnMonday est true
      if (startOnMonday) {
        const day = startDay.getDay();
        // Si c'est dimanche (0), reculer de 6 jours, sinon reculer de (day - 1) jours
        const diff = day === 0 ? -6 : -(day - 1);
        startDay.setDate(startDay.getDate() + diff);
      } else {
        // Commencer par dimanche (début de semaine standard)
        const day = startDay.getDay();
        startDay.setDate(startDay.getDate() - day);
      }
      
      // Créer un tableau avec les 7 jours de la semaine
      for (let i = 0; i < 7; i++) {
        const newDate = new Date(startDay);
        newDate.setDate(startDay.getDate() + i);
        result.push(newDate);
      }
      
      return result;
    };
    
    setWeekDays(generateWeekDays(currentDate));
  }, [currentDate, startOnMonday]);
  
  // Vérifier si une date a des événements
  const hasEvents = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const event = events.find(e => e.date === dateString);
    return event ? event.count : 0;
  };
  
  // Gestion du swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // Swipe horizontal d'au moins 50px
    if (Math.abs(diff) > 50) {
      // Créer une nouvelle date basée sur la date actuelle
      const newDate = new Date(currentDate);
      
      if (diff > 0) {
        // Swipe gauche -> semaine suivante
        newDate.setDate(newDate.getDate() + 7);
      } else {
        // Swipe droite -> semaine précédente  
        newDate.setDate(newDate.getDate() - 7);
      }
      
      onDateSelect(newDate);
    }
  };
  
  // Déterminer si une date est aujourd'hui
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  // Déterminer si une date est la date sélectionnée
  const isSelected = (date: Date) => {
    return date.getDate() === currentDate.getDate() &&
           date.getMonth() === currentDate.getMonth() &&
           date.getFullYear() === currentDate.getFullYear();
  };
  
  return (
    <div 
      className={styles.weekStrip}
      ref={stripRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {weekDays.map((day, index) => {
        const dayEvents = hasEvents(day);
        const dayName = DAYS_SHORT_FR[day.getDay()];
        const dayNum = day.getDate();
        
        return (
          <div
            key={index}
            className={`${styles.dayItem} ${isSelected(day) ? styles.selected : ''} ${isToday(day) ? styles.today : ''}`}
            onClick={() => onDateSelect(day)}
          >
            <span className={styles.dayName}>{dayName}</span>
            <span className={styles.dayNumber}>{dayNum}</span>
            {dayEvents > 0 && (
              <span className={styles.eventBadge} data-count={dayEvents > 9 ? '9+' : dayEvents}>
                {dayEvents > 9 ? '9+' : dayEvents}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeekStrip;
