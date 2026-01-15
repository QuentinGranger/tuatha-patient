'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import NavHeader from '../components/NavHeader';
import CalendarHeader from '../components/CalendarHeader';
import WeekStrip from '../components/WeekStrip';
import DailyTimeline, { TimelineEvent } from '../components/DailyTimeline';
import { IoFilter, IoClose, IoCheckmark, IoCalendarOutline, IoTimeOutline, IoLocationOutline } from 'react-icons/io5';
import { BsCalendarEvent, BsPlus, BsClock, BsGeoAlt, BsPerson, BsCardText, BsStarFill, BsInfoCircle } from 'react-icons/bs';

// Type pour les professionnels
interface Professional {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
}

// Type pour les rendez-vous
interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  professional: Professional;
  location: string;
  status: 'upcoming' | 'past' | 'canceled';
  type?: string;
  notes?: string;
}

// Type pour les filtres
interface Filters {
  professionals: number[];
  types: string[];
  status: string[];
  dateRange: 'all' | 'week' | 'month';
}

// Type pour le nouveau rendez-vous
interface NewAppointment {
  title: string;
  date: string;
  time: string;
  duration: number;
  professionalId: number;
  location: string;
  notes?: string;
  type?: string;
}

export default function MesRDV() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  
  // État pour l'overlay de filtre
  const [showFilter, setShowFilter] = useState(false);
  
  // État pour suivre les filtres sélectionnés
  const [filters, setFilters] = useState<Filters>({
    professionals: [],
    types: [],
    status: ['upcoming', 'past'],
    dateRange: 'all'
  });
  
  // État pour le modal de création de rendez-vous
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  
  // État pour le nouveau rendez-vous
  const [newAppointment, setNewAppointment] = useState<NewAppointment>({
    title: '',
    date: currentDate.toISOString().split('T')[0],
    time: '',
    duration: 30,
    professionalId: 0,
    location: '',
    notes: '',
    type: ''
  });
  
  // État pour la modale de détail du rendez-vous
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // État pour la modale de reprogrammation
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date>(new Date());
  const [rescheduleTime, setRescheduleTime] = useState('');
  
  // État pour la modale d'évaluation
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  
  // État pour la modale de confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  
  // État pour les notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  
  // Référence pour fermer l'overlay en cliquant à l'extérieur
  const filterOverlayRef = useRef<HTMLDivElement>(null);
  const addAppointmentRef = useRef<HTMLDivElement>(null);
  const appointmentDetailsRef = useRef<HTMLDivElement>(null);
  const rescheduleRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  
  // Liste des professionnels de l'utilisateur (la même que dans mespros)
  const professionals: Professional[] = [
    {
      id: 1,
      name: "Jessica Jones",
      title: "Nutritionniste",
      subtitle: "New York",
      image: "/img/Jessica-Jones.jpg"
    },
    {
      id: 2,
      name: "Beverly Crusher",
      title: "Kinésithérapeute",
      subtitle: "Paris",
      image: "/img/Beverly_Crusher.webp"
    },
    {
      id: 3,
      name: "Rocky Balboa",
      title: "Coach sportif",
      subtitle: "Philadelphie",
      image: "/img/Rocky-Balboa.jpeg"
    },
    {
      id: 4,
      name: "Tony Stark",
      title: "Kinésithérapeute",
      subtitle: "Malibu",
      image: "/img/TonyStark.jpg"
    }
  ];

  // Fonction pour générer des rendez-vous dynamiques basés sur la date actuelle
  const generateDynamicAppointments = (): Appointment[] => {
    const today = new Date();
    const appointments: Appointment[] = [];
    
    // Templates de rendez-vous réalistes
    const appointmentTemplates = [
      { title: "Consultation nutrition", type: "Consultation", duration: 45, proIndex: 0, locations: ["Vidéo consultation", "Cabinet Paris 15e"], notes: "Suivi du plan alimentaire" },
      { title: "Séance de kinésithérapie", type: "Soin", duration: 60, proIndex: 1, locations: ["Centre médical Paris", "Cabinet kinésithérapie"], notes: "Rééducation lombaire" },
      { title: "Entraînement sportif", type: "Entraînement", duration: 90, proIndex: 2, locations: ["Salle de sport Fitness Park", "Gymnase municipal"], notes: "Programme renforcement" },
      { title: "Bilan postural", type: "Soin", duration: 30, proIndex: 3, locations: ["Centre médical Malibu", "Clinique du sport"], notes: "Évaluation posture" },
      { title: "Suivi diététique", type: "Consultation", duration: 30, proIndex: 0, locations: ["Vidéo consultation", "Cabinet Paris 15e"], notes: "Point sur les objectifs" },
      { title: "Massage thérapeutique", type: "Soin", duration: 45, proIndex: 1, locations: ["Centre bien-être", "Cabinet kinésithérapie"], notes: "Détente musculaire" },
      { title: "Coaching personnalisé", type: "Entraînement", duration: 60, proIndex: 2, locations: ["À domicile", "Parc Monceau"], notes: "Séance cardio" },
      { title: "Consultation de suivi", type: "Consultation", duration: 30, proIndex: 3, locations: ["Téléconsultation", "Cabinet médical"], notes: "Bilan trimestriel" },
    ];
    
    const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
    
    // Générer des rendez-vous passés (7 derniers jours)
    for (let i = 7; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // 60% de chance d'avoir un rdv ce jour-là
      if (Math.random() < 0.6) {
        const template = appointmentTemplates[Math.floor(Math.random() * appointmentTemplates.length)];
        const time = times[Math.floor(Math.random() * times.length)];
        const dateStr = date.toISOString().split('T')[0];
        
        appointments.push({
          id: `past-${dateStr}-${i}`,
          title: template.title,
          date: dateStr,
          time: time,
          duration: template.duration,
          professional: professionals[template.proIndex],
          location: template.locations[Math.floor(Math.random() * template.locations.length)],
          status: "past" as const,
          type: template.type,
          notes: template.notes
        });
      }
    }
    
    // Rendez-vous aujourd'hui (si après 8h)
    const todayStr = today.toISOString().split('T')[0];
    const currentHour = today.getHours();
    
    if (currentHour >= 8) {
      // RDV passé aujourd'hui
      if (currentHour >= 12) {
        appointments.push({
          id: `today-morning`,
          title: "Suivi diététique",
          date: todayStr,
          time: "10:00",
          duration: 30,
          professional: professionals[0],
          location: "Vidéo consultation",
          status: "past" as const,
          type: "Consultation",
          notes: "Bilan du matin"
        });
      }
      
      // RDV à venir aujourd'hui
      if (currentHour < 17) {
        appointments.push({
          id: `today-afternoon`,
          title: "Séance de kinésithérapie",
          date: todayStr,
          time: "17:30",
          duration: 45,
          professional: professionals[1],
          location: "Centre médical Paris",
          status: "upcoming" as const,
          type: "Soin",
          notes: "Séance hebdomadaire"
        });
      }
    }
    
    // Générer des rendez-vous futurs (14 prochains jours)
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      
      // Pas de rdv le dimanche, moins le samedi
      if (dayOfWeek === 0) continue;
      if (dayOfWeek === 6 && Math.random() > 0.3) continue;
      
      // 50-70% de chance d'avoir un rdv
      if (Math.random() < (dayOfWeek === 6 ? 0.3 : 0.55)) {
        const template = appointmentTemplates[Math.floor(Math.random() * appointmentTemplates.length)];
        const time = times[Math.floor(Math.random() * times.length)];
        const dateStr = date.toISOString().split('T')[0];
        
        appointments.push({
          id: `future-${dateStr}-${i}`,
          title: template.title,
          date: dateStr,
          time: time,
          duration: template.duration,
          professional: professionals[template.proIndex],
          location: template.locations[Math.floor(Math.random() * template.locations.length)],
          status: "upcoming" as const,
          type: template.type,
          notes: template.notes
        });
      }
    }
    
    // Trier par date et heure
    return appointments.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  };

  // Charger les rendez-vous dynamiques
  useEffect(() => {
    const dynamicAppointments = generateDynamicAppointments();
    setAppointments(dynamicAppointments);
    setFilteredAppointments(dynamicAppointments);
  }, []);

  // Génère les jours de la semaine courante
  useEffect(() => {
    const generateWeekDays = (date: Date) => {
      const day = date.getDay();
      const diff = date.getDate() - day;
      
      return Array(7).fill(0).map((_, index) => {
        const d = new Date(date);
        d.setDate(diff + index);
        return d;
      });
    };
    
    setWeekDays(generateWeekDays(currentDate));
    
    // Mettre à jour la date du nouveau rendez-vous lorsque la date courante change
    setNewAppointment(prev => ({
      ...prev,
      date: currentDate.toISOString().split('T')[0]
    }));
  }, [currentDate]);
  
  // Récupérer des données uniques pour les filtres
  const getUniqueDataForFilters = () => {
    const types = [...new Set(appointments.map(app => app.type))].filter(Boolean) as string[];
    
    return { professionals, types };
  };
  
  // Gérer le clic en dehors de l'overlay pour le fermer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterOverlayRef.current && !filterOverlayRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
      
      if (addAppointmentRef.current && !addAppointmentRef.current.contains(event.target as Node)) {
        setShowAddAppointment(false);
      }
      
      if (appointmentDetailsRef.current && !appointmentDetailsRef.current.contains(event.target as Node)) {
        setShowAppointmentDetails(false);
      }
      
      if (rescheduleRef.current && !rescheduleRef.current.contains(event.target as Node)) {
        setShowReschedule(false);
      }
      
      if (ratingRef.current && !ratingRef.current.contains(event.target as Node)) {
        setShowRating(false);
      }
      
      if (confirmRef.current && !confirmRef.current.contains(event.target as Node)) {
        setShowConfirm(false);
      }
    };
    
    if (showFilter || showAddAppointment || showAppointmentDetails || showReschedule || showRating || showConfirm) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilter, showAddAppointment, showAppointmentDetails, showReschedule, showRating, showConfirm]);

  // Gestion du changement de date
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  // Retour à aujourd'hui
  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  // Mise à jour des filtres
  const updateFilters = (key: keyof Filters, value: any) => {
    setFilters(prev => {
      // Cas spécial pour les tableaux (toggle)
      if (Array.isArray(prev[key])) {
        const prevArray = prev[key] as any[];
        const newArray = prevArray.includes(value)
          ? prevArray.filter(item => item !== value)
          : [...prevArray, value];
        
        return { ...prev, [key]: newArray };
      }
      
      // Cas pour les valeurs simples
      return { ...prev, [key]: value };
    });
  };
  
  // Appliquer les filtres
  const applyFilters = () => {
    let filtered = [...appointments];
    
    // Filtre par professionnel
    if (filters.professionals.length > 0) {
      filtered = filtered.filter(app => 
        filters.professionals.includes(app.professional.id)
      );
    }
    
    // Filtre par type
    if (filters.types.length > 0) {
      filtered = filtered.filter(app => 
        app.type && filters.types.includes(app.type)
      );
    }
    
    // Filtre par statut
    if (filters.status.length > 0) {
      filtered = filtered.filter(app => 
        filters.status.includes(app.status)
      );
    }
    
    // Filtre par plage de dates
    if (filters.dateRange !== 'all') {
      const today = new Date();
      const endDate = new Date(today);
      
      if (filters.dateRange === 'week') {
        endDate.setDate(today.getDate() + 7);
      } else if (filters.dateRange === 'month') {
        endDate.setMonth(today.getMonth() + 1);
      }
      
      filtered = filtered.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= today && appDate <= endDate;
      });
    }
    
    setFilteredAppointments(filtered);
    setShowFilter(false);
  };
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      professionals: [],
      types: [],
      status: ['upcoming', 'past'],
      dateRange: 'all'
    });
    setFilteredAppointments(appointments);
  };

  // Mettre à jour le nouveau rendez-vous
  const updateNewAppointment = (key: keyof NewAppointment, value: any) => {
    setNewAppointment(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Créer un nouveau rendez-vous
  const createAppointment = () => {
    // Validation des champs obligatoires
    if (!newAppointment.title || !newAppointment.date || !newAppointment.time || 
        !newAppointment.professionalId || !newAppointment.location) {
      setNotification({
        type: 'error',
        message: 'Veuillez remplir tous les champs obligatoires'
      });
      
      // Faire disparaître la notification après 3 secondes
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return;
    }
    
    const professional = professionals.find(p => p.id === newAppointment.professionalId);
    
    if (!professional) {
      setNotification({
        type: 'error',
        message: 'Professionnel non trouvé'
      });
      
      // Faire disparaître la notification après 3 secondes
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return;
    }
    
    // Créer un nouvel ID unique
    const newId = `app${appointments.length + 1}`;
    
    // Création du nouveau rendez-vous
    const appointment: Appointment = {
      id: newId,
      title: newAppointment.title,
      date: newAppointment.date,
      time: newAppointment.time,
      duration: newAppointment.duration,
      professional: professional,
      location: newAppointment.location,
      status: 'upcoming',
      type: newAppointment.type
    };
    
    // Ajouter le rendez-vous à la liste
    const updatedAppointments = [...appointments, appointment];
    setAppointments(updatedAppointments);
    setFilteredAppointments(updatedAppointments);
    
    // Réinitialiser le formulaire et fermer le modal
    setNewAppointment({
      title: '',
      date: currentDate.toISOString().split('T')[0],
      time: '',
      duration: 30,
      professionalId: 0,
      location: '',
      notes: '',
      type: ''
    });
    setShowAddAppointment(false);
  };

  // Filtrer les rendez-vous pour la date sélectionnée et éviter les doublons
  const getDayAppointments = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    // Utiliser un Map pour filtrer les rendez-vous identiques
    const uniqueAppointments = new Map();
    
    filteredAppointments
      .filter(app => app.date === dateString)
      .forEach(app => {
        // Clé unique basée sur l'heure, la durée et le professionnel
        const key = `${app.time}_${app.duration}_${app.professional.id}`;
        
        // Ne conserver que le premier rendez-vous pour une combinaison donnée
        if (!uniqueAppointments.has(key)) {
          uniqueAppointments.set(key, app);
        }
      });
    
    return Array.from(uniqueAppointments.values());
  };

  // Préparer les données pour le WeekStrip
  const getEventsData = () => {
    return filteredAppointments.map(app => ({
      date: app.date,
      count: 1
    })).reduce((acc, curr) => {
      const existingEvent = acc.find(e => e.date === curr.date);
      if (existingEvent) {
        existingEvent.count += 1;
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as { date: string; count: number }[]);
  };
  
  // Extraire les données uniques pour les filtres
  const { types } = getUniqueDataForFilters();

  // Calculer l'heure de fin à partir de l'heure de début et de la durée
  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    
    let endHours = hours + Math.floor((minutes + durationMinutes) / 60);
    let endMinutes = (minutes + durationMinutes) % 60;
    
    // Format pour avoir toujours deux chiffres
    const formattedEndHours = endHours < 10 ? `0${endHours}` : `${endHours}`;
    const formattedEndMinutes = endMinutes < 10 ? `0${endMinutes}` : `${endMinutes}`;
    
    return `${formattedEndHours}:${formattedEndMinutes}`;
  };
  
  // Obtenir une couleur en fonction du type de rendez-vous
  const getColorByType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'consultation':
        return '#FF6B00'; // Orange primaire
      case 'soin':
        return '#30D158'; // Vert
      case 'entraînement':
        return '#0A84FF'; // Bleu
      case 'contrôle':
        return '#5E5CE6'; // Violet
      default:
        return '#FF6B00'; // Orange par défaut
    }
  };

  // Gérer le clic sur un rendez-vous
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  // Fonctions pour gérer les actions sur les rendez-vous
  const handleRescheduleAppointment = () => {
    if (selectedAppointment) {
      // Initialiser avec les valeurs actuelles
      setRescheduleDate(new Date(selectedAppointment.date));
      const [hours, minutes] = selectedAppointment.time.split(':');
      setRescheduleTime(`${hours}:${minutes}`);
      
      // Ouvrir la modale de reprogrammation
      setShowReschedule(true);
      setShowAppointmentDetails(false);
    }
  };
  
  const handleCancelAppointment = () => {
    if (selectedAppointment) {
      setConfirmAction('cancel');
      setConfirmMessage(`Êtes-vous sûr de vouloir annuler votre rendez-vous "${selectedAppointment.title}" avec ${selectedAppointment.professional.name} le ${new Date(selectedAppointment.date).toLocaleDateString('fr-FR')} à ${selectedAppointment.time} ?`);
      setShowConfirm(true);
      setShowAppointmentDetails(false);
    }
  };
  
  const handleRateAppointment = () => {
    if (selectedAppointment) {
      setRating(0);
      setRatingComment('');
      setShowRating(true);
      setShowAppointmentDetails(false);
    }
  };
  
  const confirmCancelAppointment = () => {
    if (selectedAppointment) {
      // Simuler l'annulation du rendez-vous
      const updatedAppointments = appointments.map(app => 
        app.id === selectedAppointment.id 
          ? { ...app, status: 'canceled' as const } 
          : app
      );
      
      setAppointments(updatedAppointments);
      setShowConfirm(false);
      
      // Afficher une notification au lieu d'une alerte
      setNotification({
        type: 'success',
        message: 'Le rendez-vous a été annulé avec succès.'
      });
      
      // Faire disparaître la notification après 3 secondes
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };
  
  const confirmRescheduleAppointment = () => {
    if (selectedAppointment && rescheduleTime) {
      // Simuler la reprogrammation du rendez-vous
      const updatedAppointments = appointments.map(app => 
        app.id === selectedAppointment.id 
          ? { 
              ...app, 
              date: rescheduleDate.toISOString().split('T')[0], 
              time: rescheduleTime 
            } 
          : app
      );
      
      setAppointments(updatedAppointments);
      setShowReschedule(false);
      
      // Afficher une notification au lieu d'une alerte
      setNotification({
        type: 'success',
        message: 'Le rendez-vous a été reprogrammé avec succès.'
      });
      
      // Faire disparaître la notification après 3 secondes
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };
  
  const submitRating = () => {
    if (selectedAppointment && rating > 0) {
      // Simuler l'envoi de l'évaluation
      setShowRating(false);
      
      // Afficher une notification au lieu d'une alerte
      setNotification({
        type: 'success',
        message: `Votre évaluation de ${rating}/5 a été envoyée avec succès.`
      });
      
      // Faire disparaître la notification après 3 secondes
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } else {
      // Afficher une notification d'erreur au lieu d'une alerte
      setNotification({
        type: 'error',
        message: 'Veuillez attribuer une note avant de soumettre votre évaluation.'
      });
      
      // Faire disparaître la notification après 3 secondes
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <main className={styles.container}>
      {/* Overlay flou quand filtre ouvert */}
      {(showFilter || showAddAppointment || showAppointmentDetails || showReschedule || showRating || showConfirm) && (
        <div className={styles.blurOverlay} onClick={() => {
          setShowFilter(false);
          setShowAddAppointment(false);
          setShowAppointmentDetails(false);
          setShowReschedule(false);
          setShowRating(false);
          setShowConfirm(false);
        }}></div>
      )}
      
      {/* Composant header commun */}
      <NavHeader />

      {/* Header du calendrier */}
      <CalendarHeader 
        currentDate={currentDate}
        onDateChange={handleDateChange}
        onToday={handleTodayClick}
        displayDays={false} // Désactive l'affichage des jours dans le CalendarHeader car on utilise WeekStrip
        useHamburger={false}
        onBack={() => window.history.back()}
      />

      {/* Sélecteur de jours hebdomadaire */}
      <div className={styles.weekStripContainer}>
        <WeekStrip 
          currentDate={currentDate}
          onDateSelect={handleDateChange}
          events={getEventsData()}
          startOnMonday={true}
        />
      </div>

      {/* Contenu des rendez-vous pour la date sélectionnée */}
      <div className={styles.appointmentsContainer}>
        <div className={styles.appointmentsHeader}>
          <h3 className={styles.dateHeading}>
            {currentDate.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </h3>
          <div className={styles.appointmentControls}>
            <button 
              className={`${styles.filterButton} ${filters.professionals.length > 0 || filters.types.length > 0 || filters.dateRange !== 'all' ? styles.activeFilter : ''}`}
              onClick={() => setShowFilter(true)}
            >
              <IoFilter size={16} />
              <span>Filtrer</span>
              {(filters.professionals.length > 0 || filters.types.length > 0 || filters.dateRange !== 'all') && (
                <span className={styles.filterBadge}></span>
              )}
            </button>
            <button 
              className={styles.addButton}
              onClick={() => setShowAddAppointment(true)}
            >
              <BsPlus size={20} />
            </button>
          </div>
        </div>

        {/* Overlay de filtre */}
        {showFilter && (
          <div className={styles.filterOverlay} ref={filterOverlayRef}>
            <div className={styles.filterHeader}>
              <h4>Filtrer les rendez-vous</h4>
              <button className={styles.closeButton} onClick={() => setShowFilter(false)}>
                <IoClose size={20} />
              </button>
            </div>
            
            <div className={styles.filterContent}>
              {/* Filtre par professionnel */}
              <div className={styles.filterSection}>
                <h5>Professionnels</h5>
                <div className={styles.filterOptions}>
                  {professionals.map(pro => (
                    <div 
                      key={pro.id} 
                      className={`${styles.filterOption} ${filters.professionals.includes(pro.id) ? styles.selected : ''}`}
                      onClick={() => updateFilters('professionals', pro.id)}
                    >
                      <div className={styles.proFilterImageContainer}>
                        <img 
                          src={pro.image} 
                          alt={pro.name}
                          className={styles.proFilterImage}
                        />
                      </div>
                      <span>{pro.name}</span>
                      {filters.professionals.includes(pro.id) && (
                        <span className={styles.checkmark}><IoCheckmark size={14} /></span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Filtre par type */}
              {types.length > 0 && (
                <div className={styles.filterSection}>
                  <h5>Type de rendez-vous</h5>
                  <div className={styles.filterOptions}>
                    {types.map(type => (
                      <div 
                        key={type} 
                        className={`${styles.filterOption} ${filters.types.includes(type) ? styles.selected : ''}`}
                        onClick={() => updateFilters('types', type)}
                      >
                        <span>{type}</span>
                        {filters.types.includes(type) && (
                          <span className={styles.checkmark}><IoCheckmark size={14} /></span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Filtre par statut */}
              <div className={styles.filterSection}>
                <h5>Statut</h5>
                <div className={styles.filterOptions}>
                  <div 
                    className={`${styles.filterOption} ${filters.status.includes('upcoming') ? styles.selected : ''}`}
                    onClick={() => updateFilters('status', 'upcoming')}
                  >
                    <span>À venir</span>
                    {filters.status.includes('upcoming') && (
                      <span className={styles.checkmark}><IoCheckmark size={14} /></span>
                    )}
                  </div>
                  <div 
                    className={`${styles.filterOption} ${filters.status.includes('past') ? styles.selected : ''}`}
                    onClick={() => updateFilters('status', 'past')}
                  >
                    <span>Passés</span>
                    {filters.status.includes('past') && (
                      <span className={styles.checkmark}><IoCheckmark size={14} /></span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Filtre par plage de dates */}
              <div className={styles.filterSection}>
                <h5>Période</h5>
                <div className={styles.filterOptions}>
                  <div 
                    className={`${styles.filterOption} ${filters.dateRange === 'all' ? styles.selected : ''}`}
                    onClick={() => updateFilters('dateRange', 'all')}
                  >
                    <span>Tous</span>
                    {filters.dateRange === 'all' && (
                      <span className={styles.checkmark}><IoCheckmark size={14} /></span>
                    )}
                  </div>
                  <div 
                    className={`${styles.filterOption} ${filters.dateRange === 'week' ? styles.selected : ''}`}
                    onClick={() => updateFilters('dateRange', 'week')}
                  >
                    <span>Cette semaine</span>
                    {filters.dateRange === 'week' && (
                      <span className={styles.checkmark}><IoCheckmark size={14} /></span>
                    )}
                  </div>
                  <div 
                    className={`${styles.filterOption} ${filters.dateRange === 'month' ? styles.selected : ''}`}
                    onClick={() => updateFilters('dateRange', 'month')}
                  >
                    <span>Ce mois</span>
                    {filters.dateRange === 'month' && (
                      <span className={styles.checkmark}><IoCheckmark size={14} /></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.filterActions}>
              <button className={styles.resetButton} onClick={resetFilters}>
                Réinitialiser
              </button>
              <button className={styles.applyButton} onClick={applyFilters}>
                Appliquer
              </button>
            </div>
          </div>
        )}
        
        {/* Modal d'ajout de rendez-vous */}
        {showAddAppointment && (
          <div className={styles.addAppointmentModal} ref={addAppointmentRef}>
            <div className={styles.modalHeader}>
              <h4>Nouveau rendez-vous</h4>
              <button 
                className={styles.closeButton} 
                onClick={() => setShowAddAppointment(false)}
              >
                <IoClose size={20} />
              </button>
            </div>
            
            <div className={styles.modalContent}>
              {/* Formulaire d'ajout de rendez-vous */}
              <form onSubmit={(e) => { e.preventDefault(); createAppointment(); }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Titre</span>
                    <div className={styles.inputWithIcon}>
                      <BsCardText className={styles.inputIcon} />
                      <input
                        type="text"
                        value={newAppointment.title}
                        onChange={(e) => updateNewAppointment('title', e.target.value)}
                        className={styles.formInput}
                        placeholder="Ex: Consultation nutrition"
                        required
                      />
                    </div>
                  </label>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <span>Date</span>
                      <div className={styles.inputWithIcon}>
                        <IoCalendarOutline className={styles.inputIcon} />
                        <input
                          type="date"
                          value={newAppointment.date}
                          onChange={(e) => updateNewAppointment('date', e.target.value)}
                          className={styles.formInput}
                          required
                        />
                      </div>
                    </label>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <span>Heure</span>
                      <div className={styles.inputWithIcon}>
                        <IoTimeOutline className={styles.inputIcon} />
                        <input
                          type="time"
                          value={newAppointment.time}
                          onChange={(e) => updateNewAppointment('time', e.target.value)}
                          className={styles.formInput}
                          required
                        />
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <span>Durée (minutes)</span>
                      <div className={styles.inputWithIcon}>
                        <BsClock className={styles.inputIcon} />
                        <select
                          value={newAppointment.duration}
                          onChange={(e) => updateNewAppointment('duration', parseInt(e.target.value))}
                          className={styles.formInput}
                          required
                        >
                          <option value={15}>15 min</option>
                          <option value={30}>30 min</option>
                          <option value={45}>45 min</option>
                          <option value={60}>1 heure</option>
                          <option value={90}>1h30</option>
                          <option value={120}>2 heures</option>
                        </select>
                      </div>
                    </label>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <span>Type</span>
                      <div className={styles.inputWithIcon}>
                        <BsCardText className={styles.inputIcon} />
                        <input
                          type="text"
                          value={newAppointment.type || ''}
                          onChange={(e) => updateNewAppointment('type', e.target.value)}
                          className={styles.formInput}
                          placeholder="Ex: Consultation"
                        />
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Professionnel</span>
                    <div className={styles.inputWithIcon}>
                      <BsPerson className={styles.inputIcon} />
                      <select
                        value={newAppointment.professionalId}
                        onChange={(e) => updateNewAppointment('professionalId', parseInt(e.target.value))}
                        className={styles.formInput}
                        required
                      >
                        <option value={0} disabled>Sélectionner un professionnel</option>
                        {professionals.map(pro => (
                          <option key={pro.id} value={pro.id}>
                            {pro.name} ({pro.title})
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Lieu</span>
                    <div className={styles.inputWithIcon}>
                      <IoLocationOutline className={styles.inputIcon} />
                      <input
                        type="text"
                        value={newAppointment.location}
                        onChange={(e) => updateNewAppointment('location', e.target.value)}
                        className={styles.formInput}
                        placeholder="Ex: Centre médical Paris"
                        required
                      />
                    </div>
                  </label>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <span>Notes (optionnel)</span>
                    <textarea
                      value={newAppointment.notes || ''}
                      onChange={(e) => updateNewAppointment('notes', e.target.value)}
                      className={styles.formTextarea}
                      placeholder="Informations supplémentaires..."
                      rows={3}
                    />
                  </label>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={() => setShowAddAppointment(false)}
                  >
                    Annuler
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    Créer le rendez-vous
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Modale de détail du rendez-vous */}
        {showAppointmentDetails && selectedAppointment && (
          <div className={styles.appointmentDetailsModal} ref={appointmentDetailsRef}>
            <div className={styles.modalHeader}>
              <h4>{selectedAppointment.title}</h4>
              <button 
                className={styles.closeButton} 
                onClick={() => setShowAppointmentDetails(false)}
              >
                <IoClose size={20} />
              </button>
            </div>
            
            {/* En-tête avec couleur associée au type */}
            <div 
              className={styles.appointmentDetailsHeader}
              style={{
                backgroundColor: `${getColorByType(selectedAppointment.type || '')}20`,
                borderBottom: `3px solid ${getColorByType(selectedAppointment.type || '')}`
              }}
            >
              <div className={styles.appointmentType}>
                {selectedAppointment.type || 'Rendez-vous'}
              </div>
              <div className={styles.appointmentStatus}>
                {selectedAppointment.status === 'upcoming' && 'À venir'}
                {selectedAppointment.status === 'past' && 'Passé'}
                {selectedAppointment.status === 'canceled' && 'Annulé'}
              </div>
            </div>
            
            {/* Informations principales */}
            <div className={styles.appointmentInfo}>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>
                  <IoCalendarOutline className={styles.infoIcon} />
                  <span>Date et heure</span>
                </div>
                <div className={styles.infoValue}>
                  {new Date(selectedAppointment.date).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}
                  {' à '}
                  {selectedAppointment.time}
                  {' ('}
                  {selectedAppointment.duration} min
                  {')'}
                </div>
              </div>
              
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>
                  <BsPerson className={styles.infoIcon} />
                  <span>Professionnel</span>
                </div>
                <div className={styles.infoValue}>
                  <div className={styles.proDetailsContainer}>
                    <div className={styles.proImageContainer}>
                      <img 
                        src={selectedAppointment.professional.image} 
                        alt={selectedAppointment.professional.name}
                        className={styles.proImage}
                      />
                    </div>
                    <div className={styles.proInfo}>
                      <span className={styles.proName}>{selectedAppointment.professional.name}</span>
                      <span className={styles.proTitle}>{selectedAppointment.professional.title}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>
                  <IoLocationOutline className={styles.infoIcon} />
                  <span>Lieu</span>
                </div>
                <div className={styles.infoValue}>
                  {selectedAppointment.location}
                </div>
              </div>
              
              {selectedAppointment.notes && (
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>
                    <BsCardText className={styles.infoIcon} />
                    <span>Notes</span>
                  </div>
                  <div className={styles.infoValue}>
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}
            </div>
            
            {/* Actions disponibles */}
            <div className={styles.appointmentActions}>
              {selectedAppointment.status === 'upcoming' && (
                <>
                  <button 
                    className={styles.actionButton} 
                    onClick={handleRescheduleAppointment}
                  >
                    <BsClock size={16} />
                    <span>Reprogrammer</span>
                  </button>
                  <button 
                    className={styles.dangerButton} 
                    onClick={handleCancelAppointment}
                  >
                    <IoClose size={16} />
                    <span>Annuler</span>
                  </button>
                </>
              )}
              
              {selectedAppointment.status === 'past' && (
                <button 
                  className={styles.actionButton} 
                  style={{width: '100%'}} 
                  onClick={handleRateAppointment}
                >
                  <BsStarFill size={16} />
                  <span>Évaluer</span>
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Modale de reprogrammation de rendez-vous */}
        {showReschedule && selectedAppointment && (
          <div className={styles.appointmentDetailsModal} ref={rescheduleRef}>
            <div className={styles.modalHeader}>
              <h4>Reprogrammer le rendez-vous</h4>
              <button 
                className={styles.closeButton} 
                onClick={() => setShowReschedule(false)}
              >
                <IoClose size={20} />
              </button>
            </div>
            
            <div className={styles.appointmentInfo}>
              <p>Vous reprogrammez : <strong>{selectedAppointment.title}</strong> avec <strong>{selectedAppointment.professional.name}</strong></p>
              
              <div className={styles.formGroup}>
                <label>Nouvelle date</label>
                <input 
                  type="date" 
                  value={rescheduleDate.toISOString().split('T')[0]} 
                  onChange={(e) => setRescheduleDate(new Date(e.target.value))} 
                  min={new Date().toISOString().split('T')[0]}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Nouvel horaire</label>
                <input 
                  type="time" 
                  value={rescheduleTime} 
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  min="08:00"
                  max="20:00"
                  className={styles.input}
                />
              </div>
            </div>
            
            <div className={styles.appointmentActions}>
              <button 
                className={styles.actionButton} 
                onClick={confirmRescheduleAppointment}
              >
                <IoCheckmark size={16} />
                <span>Confirmer</span>
              </button>
              <button 
                className={styles.dangerButton} 
                onClick={() => setShowReschedule(false)}
              >
                <IoClose size={16} />
                <span>Annuler</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Modale d'évaluation de rendez-vous */}
        {showRating && selectedAppointment && (
          <div className={styles.appointmentDetailsModal} ref={ratingRef}>
            <div className={styles.modalHeader}>
              <h4>Évaluer le rendez-vous</h4>
              <button 
                className={styles.closeButton} 
                onClick={() => setShowRating(false)}
              >
                <IoClose size={20} />
              </button>
            </div>
            
            <div className={styles.appointmentInfo}>
              <p>Votre séance de <strong>{selectedAppointment.title}</strong> avec <strong>{selectedAppointment.professional.name}</strong></p>
              
              <div className={styles.ratingContainer}>
                <div className={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      type="button"
                      className={styles.starButton} 
                      onClick={() => setRating(star)}
                    >
                      {star <= rating ? (
                        <BsStarFill size={24} color="#FF6B00" />
                      ) : (
                        <BsStarFill size={24} color="rgba(255, 255, 255, 0.2)" />
                      )}
                    </button>
                  ))}
                </div>
                <div className={styles.ratingLabel}>
                  {rating > 0 ? `${rating}/5` : "Notez votre expérience"}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Commentaire (optionnel)</label>
                <textarea 
                  value={ratingComment} 
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Partagez votre expérience..."
                  className={styles.textarea}
                  rows={4}
                />
              </div>
            </div>
            
            <div className={styles.appointmentActions}>
              <button 
                className={styles.actionButton} 
                onClick={submitRating}
                style={{width: '100%'}}
              >
                <IoCheckmark size={16} />
                <span>Envoyer mon évaluation</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Modale de confirmation */}
        {showConfirm && (
          <div className={styles.confirmModal} ref={confirmRef}>
            <div className={styles.confirmContent}>
              <p>{confirmMessage}</p>
              
              <div className={styles.confirmActions}>
                {confirmAction === 'cancel' && (
                  <>
                    <button 
                      className={styles.actionButton} 
                      onClick={() => setShowConfirm(false)}
                    >
                      Non, revenir
                    </button>
                    <button 
                      className={styles.dangerButton} 
                      onClick={confirmCancelAppointment}
                    >
                      Oui, annuler
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Liste des rendez-vous */}
        <div className={styles.appointmentsContent}>
          {getDayAppointments(currentDate).length > 0 ? (
            <DailyTimeline 
              date={currentDate}
              events={getDayAppointments(currentDate).map(app => ({
                id: app.id,
                title: app.title,
                startTime: app.time,
                endTime: calculateEndTime(app.time, app.duration),
                duration: app.duration,
                professional: app.professional,
                location: app.location,
                type: app.type,
                status: app.status,
                color: getColorByType(app.type || '')
              }))}
              onEventClick={(event) => {
                // Trouver le rendez-vous correspondant
                const appointment = getDayAppointments(currentDate).find(app => app.id === event.id);
                if (appointment) {
                  handleAppointmentClick(appointment);
                }
              }}
            />
          ) : (
            <div className={styles.noAppointments}>
              <div className={styles.emptyIcon}>
                <BsCalendarEvent size={30} />
              </div>
              <p>Aucun rendez-vous programmé à cette date</p>
              <button 
                className={styles.scheduleButton}
                onClick={() => setShowAddAppointment(true)}
              >
                Prendre rendez-vous
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Notifications */}
      {notification && (
        <div className={`${styles.notification} ${styles[`notification${notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}`]}`}>
          <div className={styles.notificationIcon}>
            {notification.type === 'success' && <IoCheckmark size={18} />}
            {notification.type === 'error' && <IoClose size={18} />}
            {notification.type === 'info' && <BsInfoCircle size={18} />}
          </div>
          <div className={styles.notificationMessage}>
            {notification.message}
          </div>
        </div>
      )}
    </main>
  );
}
