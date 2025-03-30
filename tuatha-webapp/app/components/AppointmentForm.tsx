'use client';

import styles from './AppointmentManager.module.css';

// Définir les interfaces localement plutôt que d'importer de AppointmentManager
export interface Professional {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface AppointmentFormData {
  id?: string;
  professionalId: number;
  date: string;
  time: string;
  duration: number;
  location: string;
  type: string;
  notes: string;
}

// Enumérations et constantes
const AppointmentTypes = [
  "Consultation",
  "Séance de kinésithérapie",
  "Entraînement personnalisé", 
  "Suivi nutritionnel",
  "Bilan annuel",
  "Consultation à distance"
];

const AppointmentLocations = [
  "Centre médical Tuatha - Paris",
  "Cabinet Santé Plus - Lyon",
  "Salle de sport Élite - Marseille",
  "Centre Tuatha - Bordeaux",
  "Visioconférence"
];

// Composant pour le formulaire de rendez-vous
export function AppointmentForm({
  formData,
  professionals,
  onFormChange,
  onSubmit,
  isEditing
}: {
  formData: AppointmentFormData;
  professionals: Professional[];
  onFormChange: (field: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className={styles.appointmentForm}>
      <div className={styles.formGroup}>
        <label htmlFor="professionalId">Professionnel</label>
        <select 
          id="professionalId"
          value={formData.professionalId}
          onChange={(e) => onFormChange('professionalId', parseInt(e.target.value))}
          required
          className={styles.formControl}
        >
          <option value="">Sélectionner un professionnel</option>
          {professionals.map((pro) => (
            <option key={pro.id} value={pro.id}>
              {pro.name} - {pro.title}
            </option>
          ))}
        </select>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="date">Date</label>
        <input 
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => onFormChange('date', e.target.value)}
          required
          className={styles.formControl}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="time">Heure</label>
        <input 
          type="time"
          id="time"
          value={formData.time}
          onChange={(e) => onFormChange('time', e.target.value)}
          required
          className={styles.formControl}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="duration">Durée (minutes)</label>
        <select 
          id="duration"
          value={formData.duration}
          onChange={(e) => onFormChange('duration', parseInt(e.target.value))}
          required
          className={styles.formControl}
        >
          <option value="">Sélectionner une durée</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">1 heure</option>
          <option value="90">1 heure 30</option>
          <option value="120">2 heures</option>
        </select>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="type">Type de rendez-vous</label>
        <select 
          id="type"
          value={formData.type}
          onChange={(e) => onFormChange('type', e.target.value)}
          required
          className={styles.formControl}
        >
          <option value="">Sélectionner un type</option>
          {AppointmentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="location">Lieu</label>
        <select 
          id="location"
          value={formData.location}
          onChange={(e) => onFormChange('location', e.target.value)}
          required
          className={styles.formControl}
        >
          <option value="">Sélectionner un lieu</option>
          {AppointmentLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="notes">Notes (optionnel)</label>
        <textarea 
          id="notes"
          value={formData.notes}
          onChange={(e) => onFormChange('notes', e.target.value)}
          className={styles.formControl}
          rows={3}
        />
      </div>
      
      <div className={styles.formActions}>
        <button type="submit" className={styles.submitButton}>
          {isEditing ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}

export default AppointmentForm;
