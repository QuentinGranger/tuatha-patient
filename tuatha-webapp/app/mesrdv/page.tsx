'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import NavHeader from '../components/NavHeader';
import CalendarHeader from '../components/CalendarHeader';
import WeekStrip from '../components/WeekStrip';
import DailyTimeline, { TimelineEvent } from '../components/DailyTimeline';
import { IoFilter, IoClose, IoCheckmark, IoCalendarOutline, IoTimeOutline, IoLocationOutline } from 'react-icons/io5';
import { BsCalendarEvent, BsPlus, BsClock, BsGeoAlt, BsPerson, BsCardText } from 'react-icons/bs';

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
  
  // Référence pour fermer l'overlay en cliquant à l'extérieur
  const filterOverlayRef = useRef<HTMLDivElement>(null);
  const addAppointmentRef = useRef<HTMLDivElement>(null);
  
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

  // Données de démonstration pour les rendez-vous
  useEffect(() => {
    // Simuler le chargement des données
    const demoAppointments: Appointment[] = [
      {
        id: "app1",
        title: "Consultation nutrition",
        date: "2025-03-31", // Aujourd'hui
        time: "14:30",
        duration: 45,
        professional: professionals[0], // Jessica Jones
        location: "Vidéo consultation",
        status: "upcoming",
        type: "Consultation",
        notes: "Bilan mensuel"
      },
      {
        id: "app2",
        title: "Séance de kinésithérapie",
        date: "2025-04-01", // Demain
        time: "10:00",
        duration: 60,
        professional: professionals[1], // Beverly Crusher
        location: "Centre médical Paris",
        status: "upcoming",
        type: "Soin"
      },
      {
        id: "app3",
        title: "Entraînement sportif",
        date: "2025-04-02",
        time: "17:15",
        duration: 90,
        professional: professionals[2], // Rocky Balboa
        location: "Salle de sport",
        status: "upcoming",
        type: "Entraînement"
      },
      {
        id: "app4",
        title: "Séance de kinésithérapie",
        date: "2025-04-10",
        time: "11:30",
        duration: 30,
        professional: professionals[3], // Tony Stark
        location: "Centre médical Malibu",
        status: "upcoming",
        type: "Soin"
      },
      {
        id: "app5",
        title: "Contrôle médical",
        date: "2025-03-28", // Avant-hier
        time: "09:00",
        duration: 30,
        professional: professionals[0], // Jessica Jones
        location: "Centre médical Paris",
        status: "past",
        type: "Contrôle"
      }
    ];
    
    setAppointments(demoAppointments);
    setFilteredAppointments(demoAppointments);
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
    };
    
    if (showFilter || showAddAppointment) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilter, showAddAppointment]);

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
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const professional = professionals.find(p => p.id === newAppointment.professionalId);
    
    if (!professional) {
      alert('Professionnel non trouvé');
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

  return (
    <main className={styles.container}>
      {/* Overlay flou quand filtre ouvert */}
      {(showFilter || showAddAppointment) && (
        <div className={styles.blurOverlay} onClick={() => {
          setShowFilter(false);
          setShowAddAppointment(false);
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
                // Action au clic sur un événement
                console.log('Event clicked:', event);
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
    </main>
  );
}
