'use client';

import { useState, useEffect } from 'react';
import { BsChevronLeft, BsChevronRight, BsX, BsDot } from 'react-icons/bs';
import styles from './Calendar.module.css';
import ConfirmDialog from './ConfirmDialog';

// Types
interface Appointment {
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

interface Professional {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
}

interface CalendarProps {
  appointments: Appointment[];
  professionals: Professional[];
  onSelectAppointment?: (appointment: Appointment) => void;
  onAddAppointment?: (date: string) => void;
  onCancelAppointment?: (appointmentId: string) => void;
  onRescheduleAppointment?: (appointmentId: string) => void;
}

export default function Calendar({ 
  appointments = [], 
  professionals = [],
  onSelectAppointment,
  onAddAppointment,
  onCancelAppointment,
  onRescheduleAppointment
}: CalendarProps) {
  // États
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([]);
  const [calendarDays, setCalendarDays] = useState<Array<Date | null>>([]);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  
  // États pour les modales
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<string | null>(null);
  
  // Génération des jours du calendrier pour le mois courant
  useEffect(() => {
    const daysArray = generateCalendarDays(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    setCalendarDays(daysArray);
  }, [currentDate]);
  
  // Génère les jours pour le mois courant, y compris les jours du mois précédent/suivant pour compléter les semaines
  const generateCalendarDays = (year: number, month: number) => {
    // Premier jour du mois
    const firstDayOfMonth = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Obtenir le jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
    let dayOfWeek = firstDayOfMonth.getDay();
    // Ajuster pour que la semaine commence le lundi (0 = lundi, 6 = dimanche)
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const daysArray: Array<Date | null> = [];
    
    // Ajouter les jours du mois précédent pour compléter la première semaine
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      const prevMonthDay = new Date(year, month, -i);
      daysArray.push(prevMonthDay);
    }
    
    // Ajouter tous les jours du mois courant
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      daysArray.push(new Date(year, month, i));
    }
    
    // Calculer combien de jours il faut ajouter pour compléter la dernière semaine
    const remainingDays = 7 - (daysArray.length % 7 || 7);
    
    // Ajouter les jours du mois suivant pour compléter
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        daysArray.push(new Date(year, month + 1, i));
      }
    }
    
    return daysArray;
  };
  
  // Navigation vers le mois précédent
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigation vers le mois suivant
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Navigation vers le mois courant
  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Formater la date en YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Vérifier si une date a des rendez-vous
  const hasAppointment = (date: Date): boolean => {
    const formattedDate = formatDate(date);
    return appointments.some(app => app.date === formattedDate);
  };
  
  // Obtenir le nombre de rendez-vous pour une date
  const getAppointmentCount = (date: Date): number => {
    const formattedDate = formatDate(date);
    return appointments.filter(app => app.date === formattedDate).length;
  };
  
  // Filtrer par statut (à venir, passé, annulé)
  const getAppointmentsByStatus = (date: Date, status: 'upcoming' | 'past' | 'canceled'): Appointment[] => {
    const formattedDate = formatDate(date);
    return appointments.filter(app => app.date === formattedDate && app.status === status);
  };
  
  // Gérer le clic sur une date
  const handleDateClick = (date: Date) => {
    const formattedDate = formatDate(date);
    
    // Si cette date est déjà sélectionnée, la désélectionner
    if (selectedDate === formattedDate) {
      setSelectedDate(null);
      setSelectedAppointments([]);
      setShowAppointmentDetails(false);
      return;
    }
    
    setSelectedDate(formattedDate);
    
    // Filtrer les rendez-vous pour cette date
    const appointmentsForDate = appointments.filter(app => app.date === formattedDate);
    
    if (appointmentsForDate.length > 0) {
      setSelectedAppointments(appointmentsForDate);
      setShowAppointmentDetails(true);
    } else {
      setSelectedAppointments([]);
      if (onAddAppointment) {
        onAddAppointment(formattedDate);
      }
    }
  };
  
  // Gérer la fermeture des détails de rendez-vous
  const handleCloseDetails = () => {
    setShowAppointmentDetails(false);
    setSelectedDate(null);
  };
  
  // Gérer la sélection d'un rendez-vous
  const handleSelectAppointment = (appointment: Appointment) => {
    if (onSelectAppointment) {
      onSelectAppointment(appointment);
    }
  };
  
  // Vérifier si le rendez-vous est dans moins de 24h
  const isWithin24Hours = (appointmentDate: string, appointmentTime: string): boolean => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    
    // Calculer la différence en heures
    const diffMs = appointmentDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours < 24;
  };
  
  // Gérer l'annulation d'un rendez-vous
  const handleCancelAppointment = (e: React.MouseEvent, appointmentId: string) => {
    e.stopPropagation(); // Empêcher la propagation de l'événement au parent
    
    // Trouver le rendez-vous à annuler
    const appointment = appointments.find(app => app.id === appointmentId);
    
    if (appointment) {
      // Vérifier si le rendez-vous est dans moins de 24h
      if (isWithin24Hours(appointment.date, appointment.time)) {
        setShowTimeWarning(true);
      } else {
        // Ouvrir la modale de confirmation d'annulation
        setAppointmentToCancel(appointmentId);
        setShowCancelConfirm(true);
      }
    }
  };
  
  // Confirmer l'annulation du rendez-vous
  const confirmCancelAppointment = () => {
    if (appointmentToCancel && onCancelAppointment) {
      onCancelAppointment(appointmentToCancel);
      setShowCancelConfirm(false);
      setAppointmentToCancel(null);
    }
  };
  
  // Gérer la reprogrammation d'un rendez-vous
  const handleRescheduleAppointment = (e: React.MouseEvent, appointmentId: string) => {
    e.stopPropagation(); // Empêcher la propagation de l'événement au parent
    
    // Trouver le rendez-vous à reprogrammer
    const appointment = appointments.find(app => app.id === appointmentId);
    
    if (appointment) {
      // Vérifier si le rendez-vous est dans moins de 24h
      if (isWithin24Hours(appointment.date, appointment.time)) {
        setShowTimeWarning(true);
      } else if (onRescheduleAppointment) {
        onRescheduleAppointment(appointmentId);
      }
    }
  };
  
  // Vérifier si une date est le jour actuel
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  // Vérifier si une date est du mois courant
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };
  
  // Obtenir le nom du mois
  const getMonthName = (date: Date): string => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[date.getMonth()];
  };
  
  // Obtenir les noms des jours de la semaine
  const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  // Obtenir les rendez-vous pour une date
  const getDayAppointments = (date: Date): Appointment[] => {
    const formattedDate = formatDate(date);
    return appointments.filter(app => app.date === formattedDate);
  };
  
  // Vérifier si une date est sélectionnée
  const isSelected = (date: Date): boolean => {
    const formattedDate = formatDate(date);
    return selectedDate === formattedDate;
  };
  
  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <div className={styles.monthDisplay}>
          <h2 className={styles.monthName}>
            {getMonthName(currentDate)}
            <span className={styles.year}>{currentDate.getFullYear()}</span>
          </h2>
        </div>
        <div className={styles.navigationControls}>
          <button 
            className={styles.navigationButton}
            onClick={handlePrevMonth}
            aria-label="Mois précédent"
          >
            <BsChevronLeft />
          </button>
          <button 
            className={styles.todayButton}
            onClick={handleGoToToday}
            aria-label="Aujourd'hui"
          >
            Aujourd'hui
          </button>
          <button 
            className={styles.navigationButton}
            onClick={handleNextMonth}
            aria-label="Mois suivant"
          >
            <BsChevronRight />
          </button>
        </div>
      </div>
      
      <div className={styles.weekdayHeader}>
        {weekdays.map((day, index) => (
          <div key={index} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>
      
      <div className={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          day && (
            <div 
              key={index}
              className={`${styles.calendarDay} 
                        ${isToday(day) ? styles.today : ""} 
                        ${hasAppointment(day) ? styles.hasAppointment : ""}
                        ${isSelected(day) ? styles.selected : ""}`}
              onClick={() => handleDateClick(day)}
            >
              <span className={styles.dayNumber}>{day.getDate()}</span>
              
              {/* Indicateurs de rendez-vous */}
              {getDayAppointments(day).length > 0 && (
                <div className={styles.appointmentIndicators}>
                  {getDayAppointments(day).slice(0, 3).map((appointment, i) => (
                    <span 
                      key={i} 
                      className={`${styles.appointmentDot} ${styles[appointment.status]}`}
                      title={`${appointment.type} à ${appointment.time}`}
                    >
                      <BsDot />
                    </span>
                  ))}
                  {getDayAppointments(day).length > 3 && (
                    <span className={styles.moreAppointments}>
                      +{getDayAppointments(day).length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        ))}
      </div>
      
      {showAppointmentDetails && selectedAppointments.length > 0 && (
        <div className={styles.appointmentDetails}>
          <div className={styles.appointmentDetailsHeader}>
            <h3>Rendez-vous du {selectedDate?.split('-').reverse().join('/')}</h3>
            <button 
              className={styles.closeButton}
              onClick={handleCloseDetails}
              aria-label="Fermer les détails"
            >
              <BsX size={18} />
            </button>
          </div>
          <div className={styles.appointmentList}>
            {selectedAppointments.map(appointment => {
              const professional = professionals.find(p => p.id === appointment.professionalId);
              
              return (
                <div 
                  key={appointment.id} 
                  className={`${styles.appointmentItem} ${styles[appointment.status]}`}
                  onClick={() => handleSelectAppointment(appointment)}
                >
                  <div className={styles.appointmentTime}>
                    {appointment.time}
                  </div>
                  <div className={styles.appointmentContent}>
                    <div className={styles.appointmentTitle}>
                      {appointment.type}
                    </div>
                    <div className={styles.appointmentPro}>
                      {professional ? professional.name : 'Professionnel inconnu'}
                    </div>
                    <div className={styles.appointmentLocation}>
                      {appointment.location}
                    </div>
                    
                    {/* Afficher les boutons seulement pour les rendez-vous à venir */}
                    {appointment.status === 'upcoming' && (
                      <div className={styles.appointmentActions}>
                        <button 
                          className={styles.cancelAppointmentButton}
                          onClick={(e) => handleCancelAppointment(e, appointment.id)}
                          aria-label="Annuler ce rendez-vous"
                        >
                          Annuler
                        </button>
                        <button 
                          className={styles.rescheduleAppointmentButton}
                          onClick={(e) => handleRescheduleAppointment(e, appointment.id)}
                          aria-label="Reprogrammer ce rendez-vous"
                        >
                          Reprogrammer
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={`${styles.appointmentStatus} ${styles[appointment.status]}`}>
                    {appointment.status === 'upcoming' ? 'À venir' : 
                     appointment.status === 'past' ? 'Passé' : 'Annulé'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Modale de confirmation d'annulation */}
      <ConfirmDialog
        isOpen={showCancelConfirm}
        title="Confirmer l'annulation"
        message="Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action est définitive."
        confirmButtonText="Annuler le rendez-vous"
        cancelButtonText="Conserver le rendez-vous"
        onConfirm={confirmCancelAppointment}
        onCancel={() => {
          setShowCancelConfirm(false);
          setAppointmentToCancel(null);
        }}
        type="error"
      />
      
      {/* Modale d'avertissement pour les rendez-vous à moins de 24h */}
      <ConfirmDialog
        isOpen={showTimeWarning}
        title="Action impossible"
        message="Les modifications ou annulations de rendez-vous ne sont pas autorisées à moins de 24h avant l'heure prévue. Pour toute urgence, veuillez contacter directement votre professionnel."
        confirmButtonText="J'ai compris"
        cancelButtonText="Fermer"
        onConfirm={() => setShowTimeWarning(false)}
        onCancel={() => setShowTimeWarning(false)}
        type="info"
      />
    </div>
  );
}
