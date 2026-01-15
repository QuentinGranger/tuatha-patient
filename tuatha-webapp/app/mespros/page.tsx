'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
// Import des icônes
import { BsCameraVideo, BsBell, BsChatDots, BsCalendarEvent } from 'react-icons/bs';
import { FiChevronLeft, FiUser, FiSettings, FiFileText, FiCamera, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
// Import des composants
import ChatMessage, { Professional } from '../components/ChatMessage';
import VideoCall, { VideoCallStatus } from '../components/VideoCall';
import AppointmentManager from '../components/AppointmentManager';
import Calendar from '../components/Calendar';
import NavHeader from '../components/NavHeader';
import SwipeableNotification from '../components/SwipeableNotification';

// Définition des types
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

export default function MesPros() {
  // État pour les notifications
  const [showNotifications, setShowNotifications] = useState(false);
  
  // État pour les paramètres
  const [showSettings, setShowSettings] = useState(false);
  
  // État pour le DOM côté client
  const [isMounted, setIsMounted] = useState(false);

  // États pour les modales de chat, vidéo et rendez-vous
  const [showChat, setShowChat] = useState(false);
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  
  // États pour l'appel vidéo
  const [videoCallStatus, setVideoCallStatus] = useState<VideoCallStatus>('idle');
  const [videoCallPro, setVideoCallPro] = useState<Professional | null>(null);

  // État pour le gestionnaire de rendez-vous
  const [showAppointmentManager, setShowAppointmentManager] = useState(false);
  const [appointmentPro, setAppointmentPro] = useState<Professional | null>(null);
  
  // État pour les rendez-vous et le calendrier
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // État pour les professionnels
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
  
  // État pour la notification de collaboration entre médecins
  const [showCollabNotification, setShowCollabNotification] = useState(true);
  const [collabStatus, setCollabStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');
  
  // État pour l'édition du profil
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileImage, setProfileImage] = useState("/img/BabyGroot.jpg");
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Données pour les professionnels de santé
  const healthProfessionals = [
    {
      id: "1",
      name: "Dr. Tony Stark",
      specialty: "Kinésithérapeute",
      image: "/img/TonyStark.jpg",
      accessLevel: "full", // full, partial, none
    },
    {
      id: "2",
      name: "Dr. Beverly Crusher",
      specialty: "Orthopédiste",
      image: "/img/BeverlyCrusher.jpg",
      accessLevel: "partial",
    },
    {
      id: "3",
      name: "Dr. Stephen Strange",
      specialty: "Neurologue",
      image: "/img/StephenStrange.jpg",
      accessLevel: "none",
    }
  ];
  
  // Gestionnaire pour accepter la collaboration
  const handleAcceptCollab = () => {
    setCollabStatus('accepted');
    // La notification reste visible avec son nouvel état
  };
  
  // Gestionnaire pour refuser la collaboration
  const handleRejectCollab = () => {
    setCollabStatus('rejected');
    // La notification reste visible avec son nouvel état
  };

  // Gestionnaire pour le changement de photo de profil
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Fonction pour déclencher le dialogue de sélection de fichier
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Données de démonstration pour les rendez-vous
  const demoAppointments: Appointment[] = [
    {
      id: "app1",
      professionalId: 1,
      date: "2025-03-30", // Aujourd'hui
      time: "14:30",
      duration: 45,
      location: "Vidéo consultation",
      type: "Consultation nutrition",
      notes: "Bilan mensuel",
      status: "upcoming",
      createdAt: "2025-03-15T10:00:00Z",
      updatedAt: "2025-03-15T10:00:00Z"
    },
    {
      id: "app2",
      professionalId: 2,
      date: "2025-04-05",
      time: "10:00",
      duration: 60,
      location: "Centre médical Paris",
      type: "Séance de kinésithérapie",
      notes: "Apporter tenue confortable",
      status: "upcoming",
      createdAt: "2025-03-20T14:30:00Z",
      updatedAt: "2025-03-20T14:30:00Z"
    },
    {
      id: "app3",
      professionalId: 3,
      date: "2025-03-28", // Passé (hier)
      time: "17:15",
      duration: 90,
      location: "Salle de sport",
      type: "Entraînement",
      status: "past",
      createdAt: "2025-03-10T09:15:00Z",
      updatedAt: "2025-03-10T09:15:00Z"
    },
    {
      id: "app4",
      professionalId: 4,
      date: "2025-04-10",
      time: "11:30",
      duration: 30,
      location: "Visio-conférence",
      type: "Formation technologie",
      status: "upcoming",
      createdAt: "2025-03-22T16:45:00Z",
      updatedAt: "2025-03-22T16:45:00Z"
    },
    {
      id: "app5",
      professionalId: 1,
      date: "2025-03-18", // Passé
      time: "09:00",
      duration: 45,
      location: "Vidéo consultation",
      type: "Suivi nutritionnel",
      status: "past",
      createdAt: "2025-03-05T11:20:00Z",
      updatedAt: "2025-03-05T11:20:00Z"
    },
    {
      id: "app6",
      professionalId: 2,
      date: "2025-04-02",
      time: "16:00",
      duration: 60,
      location: "Centre médical Paris",
      type: "Bilan articulaire",
      status: "canceled",
      createdAt: "2025-03-15T13:10:00Z",
      updatedAt: "2025-03-25T09:30:00Z"
    }
  ];

  // Références
  const notificationsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  
  // Détection de clic en dehors des éléments
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showNotifications &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      
      if (
        showSettings &&
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showSettings]);
  
  // Effet pour gérer le montage du composant côté client uniquement
  useEffect(() => {
    setIsMounted(true);
    
    // Charger les rendez-vous de démonstration
    setAppointments(demoAppointments);
  }, []);

  // Gestionnaire pour ouvrir le chat avec un professionnel
  const handleOpenChat = (pro: Professional) => {
    setSelectedPro(pro);
    setShowChat(true);
  };

  // Gestionnaire pour fermer le chat
  const handleCloseChat = () => {
    setShowChat(false);
  };
  
  // Gestionnaire pour gérer les appels vidéo
  const handleVideoCall = (pro: Professional) => {
    setVideoCallPro(pro);
    setVideoCallStatus('calling');
  };
  
  // Gestionnaire pour terminer l'appel vidéo
  const handleEndVideoCall = () => {
    setVideoCallStatus('idle');
    setVideoCallPro(null);
  };

  // Gestionnaire pour ouvrir le gestionnaire de rendez-vous
  const handleOpenAppointmentManager = (pro: Professional) => {
    setAppointmentPro(pro);
    setShowAppointmentManager(true);
  };

  // Gestionnaire pour fermer le gestionnaire de rendez-vous
  const handleCloseAppointmentManager = () => {
    setShowAppointmentManager(false);
    setAppointmentPro(null);
  };
  
  // Gestionnaire pour sélectionner un rendez-vous dans le calendrier
  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    
    // Trouver le professionnel associé au rendez-vous
    const pro = professionals.find(p => p.id === appointment.professionalId);
    if (pro) {
      setAppointmentPro(pro);
      setShowAppointmentManager(true);
    }
  };
  
  // Gestionnaire pour ajouter un rendez-vous à une date spécifique
  const handleAddAppointment = (date: string) => {
    // Ouvrir le gestionnaire de rendez-vous sans professionnel sélectionné
    setShowAppointmentManager(true);
    setAppointmentPro(null);
  };
  
  // Gestionnaire pour annuler un rendez-vous
  const handleCancelAppointment = (appointmentId: string) => {
    // Mettre à jour le statut du rendez-vous à "canceled"
    setAppointments(appointments.map(app => 
      app.id === appointmentId 
        ? { ...app, status: 'canceled', updatedAt: new Date().toISOString() }
        : app
    ));
    
    // Afficher un message de confirmation
    // alert("Votre rendez-vous a été annulé avec succès.");
  };
  
  // Gestionnaire pour reprogrammer un rendez-vous
  const handleRescheduleAppointment = (appointmentId: string) => {
    // Trouver le rendez-vous à reprogrammer
    const appointmentToReschedule = appointments.find(app => app.id === appointmentId);
    
    if (appointmentToReschedule) {
      // Trouver le professionnel associé au rendez-vous
      const pro = professionals.find(p => p.id === appointmentToReschedule.professionalId);
      
      // Ouvrir le gestionnaire de rendez-vous avec le professionnel sélectionné
      if (pro) {
        setSelectedAppointment(appointmentToReschedule);
        setAppointmentPro(pro);
        setShowAppointmentManager(true);
      }
    }
  };
  
  // Gestionnaire pour enregistrer un nouveau rendez-vous
  const handleSaveAppointment = (newAppointment: Appointment) => {
    setAppointments([...appointments, newAppointment]);
    setShowAppointmentManager(false);
  };

  return (
    <div className={styles.container}>
      {/* Overlay flou quand dropdown ouvert */}
      {isMounted && (showNotifications || showSettings) && (
        <div className={styles.blurOverlay} onClick={() => {
          setShowNotifications(false);
          setShowSettings(false);
        }}></div>
      )}
      
      {/* Navigation */}
      <NavHeader />
      
      {/* En-tête avec salutation */}
      <header className={styles.header}>
        <div className={styles.greetingContainer}>
          <div className={styles.greeting}>
            <h2>Hello, <span className={styles.username}>Groot</span> !</h2>
            <p>Voyons comment vous vous sentez aujourd'hui.</p>
          </div>
          <div className={`${styles.headerIcons} ${styles.flexAlignCenter}`}>
            <div className={styles.notificationContainer}>
              <button 
                className={styles.iconButton} 
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <BsBell size={18} />
                <span className={styles.notificationBadge}>4</span>
              </button>
              
              {/* Dropdown des notifications */}
              {showNotifications && (
                <div className={styles.notificationsDropdown}>
                  <div className={styles.notificationHeader}>
                    <h4>Notifications</h4>
                    <span className={styles.notificationCount}>4</span>
                  </div>
                  <div className={styles.notificationList}>
                    
                    {showCollabNotification && (
                      <SwipeableNotification
                        title="Demande de collaboration"
                        text="Dr. Beverly Crusher souhaite collaborer avec Dr. Tony Stark pour votre traitement"
                        time="Il y a 30 minutes"
                        onAccept={handleAcceptCollab}
                        onReject={handleRejectCollab}
                        status={collabStatus}
                      />
                    )}
                    
                    <div className={styles.notificationItem}>
                      <div className={styles.notificationIcon}>
                        <BsChatDots size={14} />
                      </div>
                      <div className={styles.notificationContent}>
                        <p className={styles.notificationTitle}>Nouveau message</p>
                        <p className={styles.notificationText}>Beverly Crusher vous a envoyé un message</p>
                        <p className={styles.notificationTime}>Il y a 1 heure</p>
                      </div>
                    </div>
                    
                    <div className={styles.notificationItem}>
                      <div className={styles.notificationIcon}>
                        <FiUser size={14} />
                      </div>
                      <div className={styles.notificationContent}>
                        <p className={styles.notificationTitle}>Profil mis à jour</p>
                        <p className={styles.notificationText}>Votre profil a été mis à jour avec succès</p>
                        <p className={styles.notificationTime}>Hier, 15:30</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.notificationFooter}>
                    <button className={styles.notificationButton}>Tout marquer comme lu</button>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.settingsContainer}>
              <button 
                className={styles.iconButton} 
                onClick={() => {
                  setShowSettings(!showSettings);
                  if (showNotifications) setShowNotifications(false);
                }}
              >
                <FiSettings size={18} />
              </button>
              
              {/* Dropdown des paramètres */}
              {showSettings && (
                <div className={styles.settingsDropdown}>
                  <div className={styles.settingsHeader}>
                    <h4>Paramètres</h4>
                  </div>
                  
                  {/* Profil utilisateur */}
                  <div className={styles.profileSummary}>
                    <div className={styles.profileImage}>
                      <img src={profileImage} alt="Profil" />
                    </div>
                    <div className={styles.profileInfo}>
                      <h5 className={styles.profileName}>Baby Groot</h5>
                      <p className={styles.profileDetails}>3 ans • À bord du Benatar</p>
                      <p className={styles.profileStatus}>En pleine croissance</p>
                    </div>
                  </div>
                  
                  <div className={styles.settingsList}>
                    <div 
                      className={`${styles.settingsItem} ${showProfileEdit ? styles.settingsItemActive : ''}`}
                      onClick={() => setShowProfileEdit(!showProfileEdit)}
                    >
                      <div className={styles.settingsIcon}>
                        <FiUser size={16} />
                      </div>
                      <div className={styles.settingsText}>Mon profil</div>
                      <div className={styles.settingsChevron}>
                        <IoChevronForward size={14} className={showProfileEdit ? styles.chevronDown : ''} />
                      </div>
                    </div>
                    
                    {showProfileEdit && (
                      <div className={styles.profileEditSection}>
                        <div className={styles.profileEditHeader}>
                          <h5>Modifier mon profil</h5>
                        </div>
                        
                        <div className={styles.profileImageUpload}>
                          <div className={styles.currentProfileImage}>
                            <img src={profileImage} alt="Profil" />
                            <div className={styles.imageOverlay} onClick={triggerFileInput}>
                              <FiCamera size={18} />
                            </div>
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          <p className={styles.uploadHint} onClick={triggerFileInput}>Changer ma photo</p>
                        </div>
                        
                        <div className={styles.profileForm}>
                          <div className={styles.formGroup}>
                            <label htmlFor="profileName">Nom</label>
                            <input 
                              type="text" 
                              id="profileName" 
                              className={styles.formInput} 
                              defaultValue="Baby Groot" 
                            />
                          </div>
                          
                          <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                              <label htmlFor="profileAge">Âge</label>
                              <input 
                                type="number" 
                                id="profileAge" 
                                className={styles.formInput} 
                                defaultValue="3" 
                              />
                            </div>
                            
                            <div className={styles.formGroup}>
                              <label htmlFor="profileLocation">Localisation</label>
                              <input 
                                type="text" 
                                id="profileLocation" 
                                className={styles.formInput} 
                                defaultValue="À bord du Benatar" 
                              />
                            </div>
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label htmlFor="profileStatus">Statut</label>
                            <input 
                              type="text" 
                              id="profileStatus" 
                              className={styles.formInput} 
                              defaultValue="En pleine croissance" 
                            />
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label htmlFor="profileBio">Bio</label>
                            <textarea 
                              id="profileBio" 
                              className={styles.formTextarea} 
                              defaultValue="Je s'appelle Groot. Je s'appelle Groot. Je s'appelle Groot!" 
                              rows={3}
                            />
                          </div>
                        </div>
                        
                        {/* Section de changement de mot de passe */}
                        <div className={styles.passwordSection}>
                          <h5 className={styles.sectionTitle}>Changer mon mot de passe</h5>
                          
                          <div className={styles.profileForm}>
                            <div className={styles.formGroup}>
                              <label htmlFor="currentPassword">Mot de passe actuel</label>
                              <input 
                                type="password" 
                                id="currentPassword" 
                                className={styles.formInput} 
                                placeholder="••••••••" 
                              />
                            </div>
                            
                            <div className={styles.formGroup}>
                              <label htmlFor="newPassword">Nouveau mot de passe</label>
                              <input 
                                type="password" 
                                id="newPassword" 
                                className={styles.formInput} 
                                placeholder="••••••••" 
                              />
                              <small className={styles.passwordHint}>
                                Minimum 8 caractères, dont un chiffre et un caractère spécial
                              </small>
                            </div>
                            
                            <div className={styles.formGroup}>
                              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                              <input 
                                type="password" 
                                id="confirmPassword" 
                                className={styles.formInput} 
                                placeholder="••••••••" 
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Boutons d'action globaux en bas du formulaire */}
                        <div className={styles.formActionsGlobal}>
                          <button className={styles.secondaryButton}>Annuler</button>
                          <button className={styles.primaryButton}>Sauvegarder</button>
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.settingsItem}>
                      <div className={styles.settingsIcon}>
                        <BsBell size={16} />
                      </div>
                      <div className={styles.settingsText}>Notifications</div>
                      <div className={styles.settingsToggle}>
                        <input type="checkbox" id="notifToggle" className={styles.toggleCheckbox} defaultChecked />
                        <label htmlFor="notifToggle" className={styles.toggleLabel}></label>
                      </div>
                    </div>
                    
                    <div 
                      className={`${styles.settingsItem} ${showPrivacySettings ? styles.settingsItemActive : ''}`}
                      onClick={() => setShowPrivacySettings(!showPrivacySettings)}
                    >
                      <div className={styles.settingsIcon}>
                        <FiFileText size={16} />
                      </div>
                      <div className={styles.settingsText}>Confidentialité</div>
                      <div className={styles.settingsChevron}>
                        <IoChevronForward size={14} className={showPrivacySettings ? styles.chevronDown : ''} />
                      </div>
                    </div>

                    {showPrivacySettings && (
                      <div className={styles.privacySection}>
                        <div className={styles.privacyHeader}>
                          <h5>Gestion des autorisations</h5>
                          <p className={styles.privacyDescription}>
                            Choisissez quelles informations sont partagées entre vos professionnels de santé
                          </p>
                        </div>
                        
                        {/* Liste des professionnels */}
                        <div className={styles.professionalsList}>
                          {healthProfessionals.map(pro => (
                            <div key={pro.id} className={styles.privacyProCard}>
                              <div className={styles.professionalInfo}>
                                <div className={styles.professionalAvatar}>
                                  <img src={pro.image} alt={pro.name} />
                                </div>
                                <div>
                                  <h5 className={styles.professionalName}>{pro.name}</h5>
                                  <p className={styles.professionalSpecialty}>{pro.specialty}</p>
                                </div>
                              </div>
                              
                              <div className={styles.accessControls}>
                                <div className={styles.radioGroup}>
                                  <div className={styles.radioOption}>
                                    <input 
                                      type="radio" 
                                      id={`full-${pro.id}`} 
                                      name={`access-${pro.id}`} 
                                      defaultChecked={pro.accessLevel === "full"} 
                                      className={styles.radioInput}
                                    />
                                    <label htmlFor={`full-${pro.id}`} className={styles.radioLabel}>Accès complet</label>
                                  </div>
                                  
                                  <div className={styles.radioOption}>
                                    <input 
                                      type="radio" 
                                      id={`partial-${pro.id}`} 
                                      name={`access-${pro.id}`} 
                                      defaultChecked={pro.accessLevel === "partial"} 
                                      className={styles.radioInput}
                                    />
                                    <label htmlFor={`partial-${pro.id}`} className={styles.radioLabel}>Accès limité</label>
                                  </div>
                                  
                                  <div className={styles.radioOption}>
                                    <input 
                                      type="radio" 
                                      id={`none-${pro.id}`} 
                                      name={`access-${pro.id}`} 
                                      defaultChecked={pro.accessLevel === "none"} 
                                      className={styles.radioInput}
                                    />
                                    <label htmlFor={`none-${pro.id}`} className={styles.radioLabel}>Aucun accès</label>
                                  </div>
                                </div>
                                <button className={styles.infoButton} title="Plus d'informations">
                                  <FiHelpCircle size={14} />
                                </button>
                              </div>
                              
                              <div className={styles.permissionDetails}>
                                <h6>Détails des autorisations :</h6>
                                <div className={styles.permissionOption}>
                                  <input 
                                    type="checkbox" 
                                    id={`data-medical-${pro.id}`} 
                                    defaultChecked={pro.accessLevel !== "none"} 
                                    className={styles.checkboxInput}
                                  />
                                  <label htmlFor={`data-medical-${pro.id}`} className={styles.checkboxLabel}>Données médicales</label>
                                </div>
                                <div className={styles.permissionOption}>
                                  <input 
                                    type="checkbox" 
                                    id={`data-training-${pro.id}`} 
                                    defaultChecked={pro.accessLevel !== "none"} 
                                    className={styles.checkboxInput}
                                  />
                                  <label htmlFor={`data-training-${pro.id}`} className={styles.checkboxLabel}>Données d'entraînement</label>
                                </div>
                                <div className={styles.permissionOption}>
                                  <input 
                                    type="checkbox" 
                                    id={`data-sleep-${pro.id}`} 
                                    defaultChecked={pro.accessLevel === "full"} 
                                    className={styles.checkboxInput}
                                  />
                                  <label htmlFor={`data-sleep-${pro.id}`} className={styles.checkboxLabel}>Données de sommeil</label>
                                </div>
                                <div className={styles.permissionOption}>
                                  <input 
                                    type="checkbox" 
                                    id={`data-collab-${pro.id}`} 
                                    defaultChecked={pro.accessLevel === "full"} 
                                    className={styles.checkboxInput}
                                  />
                                  <label htmlFor={`data-collab-${pro.id}`} className={styles.checkboxLabel}>Autoriser la collaboration</label>
                                </div>
                              </div>
                              
                              <div className={styles.cardFooter}>
                                <button className={styles.secondaryButton}>Réinitialiser</button>
                                <button className={styles.primaryButton}>Sauvegarder</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className={styles.privacyFooter}>
                          <button className={styles.secondaryButton}>Annuler</button>
                          <button className={styles.primaryButton}>Appliquer à tous</button>
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.settingsItem}>
                      <div className={styles.settingsIcon}>
                        <FiHelpCircle size={16} />
                      </div>
                      <div className={styles.settingsText}>Aide et support</div>
                      <div className={styles.settingsChevron}>
                        <IoChevronForward size={14} />
                      </div>
                    </div>
                    
                    <div className={styles.settingsDivider}></div>
                    
                    <div className={styles.settingsItem}>
                      <div className={styles.settingsIcon}>
                        <FiLogOut size={16} />
                      </div>
                      <div className={styles.settingsText}>Déconnexion</div>
                    </div>
                  </div>
                  <div className={styles.settingsFooter}>
                    <small>Version 1.0.0</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Grille de professionnels */}
      <div className={styles.professionalGrid}>
        {professionals.map((pro) => (
          <div className={styles.professionalCard} key={pro.id}>
            <Link href={`/praticien/${pro.id}`} className={styles.professionalLink}>
              <div className={styles.professionalImage} style={{
                backgroundImage: `url("${pro.image}")`
              }}></div>
              <div className={styles.proInfo}>
                <h3>{pro.name}</h3>
                <p>{pro.title}</p>
                <p className={styles.subtitle}>{pro.subtitle}</p>
                <div className={styles.cardActions}>
                  <span className={styles.actionIcon} onClick={(e) => {
                    e.preventDefault();
                    handleOpenChat(pro);
                  }}>
                    <BsChatDots size={16} />
                  </span>
                  <span className={styles.actionIcon} onClick={(e) => {
                    e.preventDefault();
                    handleVideoCall(pro);
                  }}>
                    <BsCameraVideo size={16} />
                  </span>
                  <span className={styles.actionIcon} onClick={(e) => {
                    e.preventDefault();
                    handleOpenAppointmentManager(pro);
                  }}>
                    <BsCalendarEvent size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Calendrier des rendez-vous */}
      {isMounted && (
        <Calendar 
          appointments={appointments}
          professionals={professionals}
          onSelectAppointment={handleSelectAppointment}
          onAddAppointment={handleAddAppointment}
          onCancelAppointment={handleCancelAppointment}
          onRescheduleAppointment={handleRescheduleAppointment}
        />
      )}

      {/* Modal de chat inspiré d'iMessage */}
      {showChat && selectedPro && (
        <ChatMessage 
          professional={selectedPro} 
          onClose={handleCloseChat} 
        />
      )}
      
      {/* Modal d'appel vidéo */}
      {videoCallStatus !== 'idle' && videoCallPro && (
        <VideoCall
          status={videoCallStatus}
          professional={videoCallPro}
          onEndCall={handleEndVideoCall}
        />
      )}

      {/* Gestionnaire de rendez-vous */}
      {showAppointmentManager && (
        <AppointmentManager
          isOpen={showAppointmentManager}
          onClose={handleCloseAppointmentManager}
          professional={appointmentPro}
        />
      )}

      {/* Pied de page */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>Sitemap</a>
          <a href="#" className={styles.footerLink}>Politique de confidentialité</a>
          <a href="#" className={styles.footerLink}>Support & aide</a>
          <a href="#" className={styles.footerLink}>Mentions légales</a>
          <a href="#" className={styles.footerLink}>CGU</a>
          <a href="#" className={styles.footerLink}>FAQ</a>
        </div>
      </footer>
    </div>
  );
}