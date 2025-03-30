'use client';

import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import styles from './SimpleCalendar.module.css';
import { IoCalendarOutline, IoTimeOutline, IoLocationOutline, IoTrashOutline, IoRefreshOutline } from 'react-icons/io5';

// Types
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
  title: string;
  start: Date;
  end: Date;
  location: string;
  type: string;
  notes?: string;
  status: 'upcoming' | 'past' | 'canceled';
  createdAt: string;
  updatedAt: string;
}

interface SimpleCalendarProps {
  appointments?: Appointment[];
  professional?: Professional | null;
  onSelectDate?: (date: Date) => void;
  onSelectAppointment?: (appointment: Appointment) => void;
  onRescheduleAppointment?: (appointment: Appointment) => void;
  onCancelAppointment?: (appointment: Appointment) => void;
}

const SimpleCalendar: React.FC<SimpleCalendarProps> = ({
  appointments = [],
  professional = null,
  onSelectDate = () => {},
  onSelectAppointment = () => {},
  onRescheduleAppointment = () => {},
  onCancelAppointment = () => {}
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1, 1)); // Février 2025
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 1, 18)); // 18 Février 2025
  
  // Fonction pour aller au mois précédent
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Fonction pour aller au mois suivant
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Fonction pour afficher l'en-tête du calendrier (jours de la semaine)
  const renderHeader = () => {
    const weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
    
    return (
      <div className={styles.header}>
        {weekDays.map((day, index) => (
          <div key={index} className={styles.dayHeader}>{day}</div>
        ))}
      </div>
    );
  };
  
  // Fonction pour rendre les jours du mois
  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    // Pour chaque jour dans la plage du calendrier
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const appointmentsForDay = appointments.filter(a => 
          isSameDay(a.start, cloneDay)
        );
        
        days.push(
          <div 
            key={day.toString()}
            className={`${styles.day} ${
              !isSameMonth(day, monthStart) ? styles.disabled : ''
            } ${
              isSameDay(day, selectedDate) ? styles.selected : ''
            }`}
            onClick={() => {
              setSelectedDate(cloneDay);
              onSelectDate(cloneDay);
            }}
          >
            <span className={styles.dayNumber}>{format(day, 'd')}</span>
            {appointmentsForDay.length > 0 && (
              <div className={styles.appointmentIndicator}>
                {appointmentsForDay.map(appointment => (
                  <div 
                    key={appointment.id} 
                    className={`${styles.indicator} ${styles[appointment.status]}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAppointment(appointment);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className={styles.week}>
          {days}
        </div>
      );
      days = [];
    }
    
    return <div className={styles.body}>{rows}</div>;
  };
  
  return (
    <div className={styles.calendar}>
      <div className={styles.calendarContainer}>
        {renderHeader()}
        {renderDays()}
      </div>
    </div>
  );
};

export default SimpleCalendar;