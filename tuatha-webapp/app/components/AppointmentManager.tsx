'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { IoAdd, IoClose } from 'react-icons/io5';
import { BsCalendar3 } from 'react-icons/bs';
import styles from './AppointmentManager.module.css';

// Import des composants extraits
import AppointmentCard, { Professional, Appointment } from './AppointmentCard';
import Modal from './Modal';
import AppointmentForm, { AppointmentFormData } from './AppointmentForm';
import AppointmentFilters from './AppointmentFilters';

// Données de démo
const DEMO_PROFESSIONALS: Professional[] = [
  { id: 1, name: "Jessica Jones", title: "Nutritionniste", subtitle: "Spécialiste en nutrition sportive", image: "/img/Jessica-Jones.jpg" },
  { id: 2, name: "Beverly Crusher", title: "Kinésithérapeute", subtitle: "Expert en rééducation sportive", image: "/img/Beverly_Crusher.webp" },
  { id: 3, name: "Rocky Balboa", title: "Coach sportif", subtitle: "Spécialiste en boxe et renforcement", image: "/img/Rocky-Balboa.jpeg" },
  { id: 4, name: "Tony Stark", title: "Coach High-Tech", subtitle: "Expert en technologies de performance", image: "/img/TonyStark.jpg" }
];

const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: "app1",
    professionalId: 1,
    date: "2025-04-05",
    time: "14:30",
    duration: 45,
    location: "Centre médical Tuatha - Paris",
    type: "Consultation nutritionnelle",
    notes: "Apporter le carnet alimentaire et les dernières analyses",
    status: "upcoming",
    createdAt: "2025-03-20T10:30:00.000Z",
    updatedAt: "2025-03-20T10:30:00.000Z"
  },
  {
    id: "app2",
    professionalId: 2,
    date: "2025-04-10",
    time: "09:15",
    duration: 60,
    location: "Cabinet Santé Plus - Lyon",
    type: "Séance de kinésithérapie",
    notes: "Prévoir une tenue adaptée",
    status: "upcoming",
    createdAt: "2025-03-22T15:20:00.000Z",
    updatedAt: "2025-03-22T15:20:00.000Z"
  },
  {
    id: "app3",
    professionalId: 3,
    date: "2025-03-28",
    time: "17:00",
    duration: 90,
    location: "Salle de sport Élite - Marseille",
    type: "Entraînement personnalisé",
    status: "past",
    createdAt: "2025-03-15T09:45:00.000Z",
    updatedAt: "2025-03-15T09:45:00.000Z"
  },
  {
    id: "app4",
    professionalId: 4,
    date: "2025-03-25",
    time: "11:00",
    duration: 30,
    location: "Visioconférence",
    type: "Consultation à distance",
    notes: "Lien de connexion envoyé par email",
    status: "canceled",
    createdAt: "2025-03-10T14:20:00.000Z",
    updatedAt: "2025-03-18T16:30:00.000Z"
  }
];

// Composant principal
export default function AppointmentManager({
  isOpen = true,
  onClose = () => {},
  professional = null
}: {
  isOpen?: boolean;
  onClose?: () => void;
  professional?: Professional | null;
}) {
  // State pour les rendez-vous
  const [appointments, setAppointments] = useState<Appointment[]>(DEMO_APPOINTMENTS);
  const [professionals, setProfessionals] = useState<Professional[]>(DEMO_PROFESSIONALS);
  
  // State pour les filtres
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-asc');
  
  // State pour l'édition et la suppression
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState<string | null>(null);
  
  // State pour le formulaire
  const [formData, setFormData] = useState<AppointmentFormData>({
    professionalId: professional ? professional.id : 0,
    date: '',
    time: '',
    duration: 30,
    location: '',
    type: '',
    notes: ''
  });
  
  // State pour la suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  
  // Effet pour mettre à jour le formulaire quand le professionnel change
  useEffect(() => {
    if (professional) {
      setFormData(prev => ({
        ...prev,
        professionalId: professional.id
      }));
    }
  }, [professional]);

  // Filtrer les rendez-vous selon le professionnel sélectionné et les autres filtres
  const filteredAppointments = useMemo(() => {
    // D'abord, filtrer par professionnel si un est sélectionné
    let filtered = appointments;
    
    if (professional) {
      filtered = filtered.filter(app => app.professionalId === professional.id);
    }
    
    // Ensuite, appliquer les autres filtres
    if (filter !== 'all') {
      filtered = filtered.filter(app => app.status === filter);
    }
    
    // Trier les rendez-vous
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      
      if (sortBy === 'date-asc') return dateA.getTime() - dateB.getTime();
      if (sortBy === 'date-desc') return dateB.getTime() - dateA.getTime();
      if (sortBy === 'duration-asc') return a.duration - b.duration;
      if (sortBy === 'duration-desc') return b.duration - a.duration;
      
      return 0;
    });
  }, [appointments, filter, sortBy, professional]);
  
  // Gestion du formulaire
  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Ouverture du formulaire
  const openAddForm = () => {
    setFormData({
      professionalId: professional ? professional.id : 0,
      date: '',
      time: '',
      duration: 30,
      location: '',
      type: '',
      notes: ''
    });
    setIsEditing(false);
    setModalTitle("Ajouter un rendez-vous");
    setIsModalOpen(true);
  };
  
  // Ouverture du formulaire d'édition
  const openEditForm = (id: string) => {
    const appointment = appointments.find(a => a.id === id);
    if (!appointment) return;
    
    setFormData({
      id: appointment.id,
      professionalId: appointment.professionalId,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      location: appointment.location,
      type: appointment.type,
      notes: appointment.notes || ''
    });
    
    setIsEditing(true);
    setCurrentAppointmentId(id);
    setModalTitle("Modifier le rendez-vous");
    setIsModalOpen(true);
  };
  
  // Demande de confirmation pour la suppression
  const confirmDelete = (id: string) => {
    setAppointmentToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  // Annulation de la suppression
  const cancelDelete = () => {
    setAppointmentToDelete(null);
    setShowDeleteConfirm(false);
  };
  
  // Suppression définitive
  const handleDelete = () => {
    if (!appointmentToDelete) return;
    
    setAppointments(appointments.filter(a => a.id !== appointmentToDelete));
    setShowDeleteConfirm(false);
    setAppointmentToDelete(null);
  };
  
  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // S'assurer que le rendez-vous est associé au professionnel sélectionné
    const proId = professional ? professional.id : formData.professionalId;
    
    if (isEditing && currentAppointmentId) {
      // Mise à jour d'un rendez-vous existant
      setAppointments(appointments.map(app => 
        app.id === currentAppointmentId ? {
          ...app,
          professionalId: proId,
          date: formData.date,
          time: formData.time,
          duration: formData.duration,
          location: formData.location,
          type: formData.type,
          notes: formData.notes,
          updatedAt: new Date().toISOString()
        } : app
      ));
    } else {
      // Ajout d'un nouveau rendez-vous
      const newId = `app${Date.now()}`;
      const now = new Date().toISOString();
      
      setAppointments([
        ...appointments,
        {
          id: newId,
          professionalId: proId,
          date: formData.date,
          time: formData.time,
          duration: formData.duration,
          location: formData.location,
          type: formData.type,
          notes: formData.notes,
          status: 'upcoming',
          createdAt: now,
          updatedAt: now
        }
      ]);
    }
    
    // Fermeture du modal
    setIsModalOpen(false);
    setCurrentAppointmentId(null);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={`${styles.appointmentManager} ${isOpen ? styles.open : ''}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            {professional 
              ? `Rendez-vous avec ${professional.name}` 
              : 'Gestion des rendez-vous'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>
        
        <div className={styles.filterSection}>
          {/* N'afficher les filtres que si c'est pertinent */}
          {filteredAppointments.length > 0 && (
            <AppointmentFilters 
              filter={filter}
              setFilter={setFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          )}
          
          <button 
            className={styles.addButton}
            onClick={openAddForm}
            aria-label="Ajouter un rendez-vous"
          >
            <IoAdd size={20} />
            <span>Nouveau rendez-vous</span>
          </button>
        </div>
        
        <div className={styles.appointmentsList}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                professionals={professionals}
                onEdit={() => openEditForm(appointment.id)}
                onDelete={() => confirmDelete(appointment.id)}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <BsCalendar3 size={48} />
              </div>
              <h3>Aucun rendez-vous</h3>
              <p>
                {professional
                  ? `Vous n'avez pas encore de rendez-vous avec ${professional.name}.`
                  : "Aucun rendez-vous planifié."}
              </p>
              <button 
                className={styles.addEmptyButton}
                onClick={openAddForm}
              >
                <IoAdd size={20} />
                <span>Planifier un rendez-vous</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal pour ajouter/modifier un rendez-vous */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <AppointmentForm 
          formData={formData}
          professionals={professionals}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          isEditing={isEditing}
        />
      </Modal>
      
      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        title="Confirmer la suppression"
      >
        <div className={styles.confirmationContent}>
          <p>Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.</p>
          <div className={styles.confirmationActions}>
            <button 
              className={styles.cancelButton}
              onClick={cancelDelete}
            >
              Annuler
            </button>
            <button 
              className={styles.deleteConfirmButton}
              onClick={handleDelete}
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
