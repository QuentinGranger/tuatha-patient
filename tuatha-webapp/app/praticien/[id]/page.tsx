'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal';
import Calendar from '../../components/Calendar';
import { FaRegCreditCard, FaLock, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcApplePay, FaCarrot, FaBreadSlice, FaAppleAlt, FaEgg, FaLeaf, FaShareAlt, FaDownload, FaFilePdf, FaFileUpload, FaFileAlt } from 'react-icons/fa';
import MacroTracker from '@/app/components/MacroTracker';
import BodyComposition from '@/app/components/BodyComposition';
import ProgressSlider from '@/app/components/ProgressSlider';
import AlertJournal, { Alert, AlertType } from '@/app/components/AlertJournal';
import PrescriptionList, { Prescription } from '@/app/components/PrescriptionList';
import VideoLibrary from '@/app/components/VideoLibrary';
import ActionButtons from '@/app/components/ActionButtons';
import RehabProgress from '@/app/components/RehabProgress';
import RehabHistory from '@/app/components/RehabHistory';
import RehabTable from '@/app/components/RehabTable';
import TrainingCycle from '@/app/components/TrainingCycle';
import TrainingProgram from '@/app/components/TrainingProgram';
import VideoShare from '@/app/components/VideoShare';
import jsPDF from 'jspdf';

interface Practitioner {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  imageUrl: string;
  bio: string;
}

interface Appointment {
  id: string;
  professionalId: number;
  date: string;
  time: string;
  duration: number;
  location: string;
  type: string;
  notes?: string;
  status: 'upcoming' | 'past' | 'canceled';
  createdAt: string;
  updatedAt: string;
  price?: number; // Prix du rendez-vous
  paymentStatus?: 'paid' | 'pending' | 'not_required'; // Statut de paiement
}

// Données des praticiens
const practitionerData: Record<string, Practitioner> = {
  "1": {
    id: 1,
    firstName: "Jessica",
    lastName: "Jones",
    specialty: "Diététicienne - Nutritionniste",
    imageUrl: "/img/Jessica-Jones.jpg",
    bio: "Bonjour, je suis Jessica Jones, diététicienne-nutritionniste avec plus de 8 ans d'expérience. Après une période difficile dans ma vie où j'ai dû reconstruire ma relation avec la nourriture, j'ai décidé de mettre mon expérience personnelle et ma force au service des autres. Je suis spécialisée dans les troubles alimentaires et la nutrition sportive. Ma méthode est directe mais efficace - pas de promesses miraculeuses, juste des plans nutritionnels basés sur des preuves scientifiques et adaptés à votre réalité quotidienne. Je travaille souvent avec des athlètes, mais aussi avec des personnes souffrant de troubles alimentaires ou cherchant simplement à retrouver une relation saine avec leur alimentation. J'ai vécu à Hell's Kitchen pendant des années, ce qui m'a appris l'importance de rester ancrée dans la réalité et de comprendre les véritables défis de la vie quotidienne. Si vous cherchez quelqu'un qui vous dira la vérité sans détour et vous aidera réellement à atteindre vos objectifs, nous devrions travailler ensemble."
  },
  "2": {
    id: 2,
    firstName: "Beverly",
    lastName: "Crusher",
    specialty: "Médecin généraliste",
    imageUrl: "/img/Beverly_Crusher.webp",
    bio: "Je suis le Dr. Beverly Crusher, médecin généraliste avec plus de 15 ans d'expérience en médecine familiale et d'urgence. Après avoir servi comme médecin-chef à bord de l'USS Enterprise, j'ai développé une approche holistique de la santé qui intègre les dernières avancées médicales tout en maintenant une relation humaine privilégiée avec mes patients. Ma formation m'a permis de traiter des conditions médicales extrêmement diverses, des plus courantes aux plus rares. Je m'intéresse particulièrement à la médecine préventive et à l'éducation à la santé, car je crois fermement que comprendre son corps est la première étape vers le bien-être. Mon fils Wesley m'a appris la patience et l'importance d'expliquer clairement les traitements. J'ai également développé une expertise en xénobiologie que j'applique aujourd'hui dans ma compréhension des différences génétiques entre patients. Mon cabinet est un espace où la science médicale rencontre l'empathie, et où chaque patient est traité avec respect, quelle que soit son origine ou sa condition."
  },
  "3": {
    id: 3,
    firstName: "Rocky",
    lastName: "Balboa",
    specialty: "Coach sportif",
    imageUrl: "/img/Rocky-Balboa.jpeg",
    bio: "Yo, moi c'est Rocky Balboa ! Après une carrière dans la boxe qui m'a mené du quartier de Philadelphie jusqu'au titre de champion du monde poids lourd, j'ai décidé de partager tout ce que j'ai appris sur la force mentale et physique. Je suis pas du genre à vous faire des grands discours compliqués - je crois en l'effort, la persévérance et le cœur qu'on met dans chaque entraînement. Ma méthode est basée sur ce que j'ai appris dans les rues et sur le ring : peu importe combien de fois vous tombez, c'est combien de fois vous vous relevez qui compte. Je travaille avec des clients de tous niveaux, des débutants complets aux athlètes de compétition. Ce que j'apporte, c'est pas juste un programme d'entraînement, c'est une mentalité. Comme je le dis souvent : 'Ce n'est pas la force qui fait un champion, mais la volonté, la détermination et la capacité à encaisser les coups durs de la vie.' Ensemble, on va repousser vos limites et vous montrer que vous êtes bien plus fort que vous ne le pensez - mentalement et physiquement. Adrian, ma femme, m'a toujours soutenu, et c'est ce genre de soutien que je veux vous apporter dans votre parcours sportif."
  },
  "4": {
    id: 4,
    firstName: "Tony",
    lastName: "Stark",
    specialty: "Kinésithérapeute",
    imageUrl: "/img/TonyStark.jpg",
    bio: "Dr. Tony Stark à votre service. Oui, le même qui a révolutionné la technologie des prothèses médicales et de l'équipement sportif à travers les industries Stark. Après des années à développer des technologies de pointe et à repousser les limites du corps humain (y compris le mien), j'ai décidé de me consacrer à la kinésithérapie. Pourquoi? Parce que la performance m'a toujours fasciné, et qui de mieux que moi pour comprendre comment optimiser le potentiel du corps humain? Ma double expertise en ingénierie biomédicale et en kinésithérapie me permet d'offrir des traitements innovants pour les blessures et troubles musculo-squelettiques. J'utilise des technologies exclusives de rééducation et des protocoles de réadaptation que j'ai personnellement développés et testés. Mon approche combine haute technologie et connaissance approfondie de la biomécanique. J'ai traité des athlètes olympiques, des membres des forces spéciales, et même quelques super-héros (mais ça, c'est confidentiel). Si vous voulez récupérer d'une blessure ou simplement améliorer votre mobilité, mon équipe et moi avons la solution. Et non, je ne porte pas mon armure pendant les consultations... sauf demande spéciale."
  }
};

// Données des rendez-vous
const appointmentData: Appointment[] = [
  {
    id: "app1",
    professionalId: 1, // Jessica Jones
    date: "2025-04-01",
    time: "10:00",
    duration: 60,
    location: "Cabinet principal",
    type: "Première consultation",
    status: "upcoming",
    createdAt: "2025-03-15T09:00:00Z",
    updatedAt: "2025-03-15T09:00:00Z",
    price: 70,
    paymentStatus: 'pending'
  },
  {
    id: "app2",
    professionalId: 1, // Jessica Jones
    date: "2025-04-05",
    time: "14:30",
    duration: 45,
    location: "Cabinet principal",
    type: "Suivi nutritionnel",
    status: "upcoming",
    createdAt: "2025-03-15T10:15:00Z",
    updatedAt: "2025-03-15T10:15:00Z",
    price: 50,
    paymentStatus: 'paid'
  },
  {
    id: "app3",
    professionalId: 2, // Beverly Crusher
    date: "2025-04-03",
    time: "09:15",
    duration: 30,
    location: "Clinique médicale",
    type: "Consultation médicale",
    status: "upcoming",
    createdAt: "2025-03-15T11:30:00Z",
    updatedAt: "2025-03-15T11:30:00Z",
    price: 60,
    paymentStatus: 'pending'
  },
  {
    id: "app4",
    professionalId: 3, // Rocky Balboa
    date: "2025-04-10",
    time: "17:00",
    duration: 90,
    location: "Salle de sport",
    type: "Entraînement personnel",
    status: "upcoming",
    createdAt: "2025-03-15T12:45:00Z",
    updatedAt: "2025-03-15T12:45:00Z",
    price: 90,
    paymentStatus: 'not_required'
  },
  {
    id: "app5",
    professionalId: 2, // Beverly Crusher
    date: "2025-04-08",
    time: "11:30",
    duration: 45,
    location: "Clinique médicale",
    type: "Suivi médical",
    status: "upcoming",
    createdAt: "2025-03-15T13:00:00Z",
    updatedAt: "2025-03-15T13:00:00Z",
    price: 60,
    paymentStatus: 'pending'
  },
  {
    id: "app6",
    professionalId: 4, // Tony Stark
    date: "2025-04-12",
    time: "16:00",
    duration: 60,
    location: "Clinique du sport",
    type: "Bilan sportif",
    status: "upcoming",
    createdAt: "2025-03-15T13:10:00Z",
    updatedAt: "2025-03-15T13:10:00Z",
    price: 120,
    paymentStatus: 'pending'
  }
];

export default function PraticienPage() {
  const params = useParams();
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showEditMealModal, setShowEditMealModal] = useState(false);
  const [currentEditMeal, setCurrentEditMeal] = useState<Meal | null>(null);
  const [editedFoods, setEditedFoods] = useState<Food[]>([]);
  const [mealStatuses, setMealStatuses] = useState<Record<number, 'pending' | 'consumed' | 'skipped'>>({
    1: 'pending',
    2: 'pending',
    3: 'pending',
    4: 'pending'
  });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [currentSwipeMeal, setCurrentSwipeMeal] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState<number>(0);
  const [isBioOpen, setIsBioOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [sharedDocuments, setSharedDocuments] = useState<Array<{
    id: string;
    title: string;
    description: string;
    fileName: string;
    date: string;
    size: string;
  }>>([
    {
      id: '1',
      title: 'Résultats d\'analyse sanguine',
      description: 'Résultats de la dernière prise de sang du 15 mars 2025',
      fileName: 'analyse_sang_15032025.pdf',
      date: '2025-03-15',
      size: '1.2 MB'
    },
    {
      id: '2',
      title: 'Carnet alimentaire semaine 10',
      description: 'Journal détaillé des repas de la semaine 10',
      fileName: 'carnet_alimentaire_semaine10.pdf',
      date: '2025-03-10',
      size: '0.8 MB'
    }
  ]);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: AlertType.WARNING,
      date: '2025-03-29T10:15:00',
      title: 'Glycémie élevée détectée',
      description: 'Votre glycémie a dépassé le seuil recommandé de 1.26 g/L à jeun. Il est conseillé de consulter votre professionnel de santé si cela persiste.',
      metric: {
        name: 'Glycémie',
        value: 1.35,
        unit: 'g/L',
        trend: 'up',
        threshold: 1.26
      },
      isRead: false,
      action: {
        label: 'Prendre RDV',
        onClick: () => setShowAppointmentModal(true)
      }
    },
    {
      id: '2',
      type: AlertType.INFO,
      date: '2025-03-28T08:30:00',
      title: 'Rappel: compléter votre journal alimentaire',
      description: 'Votre nutritionniste a remarqué que vous n\'avez pas rempli votre journal alimentaire depuis 3 jours. Pensez à le mettre à jour régulièrement pour un meilleur suivi.',
      isRead: true,
      action: {
        label: 'Mettre à jour',
        onClick: () => setShowMealModal(true)
      }
    },
    {
      id: '3',
      type: AlertType.SUCCESS,
      date: '2025-03-26T16:45:00',
      title: 'Objectif d\'hydratation atteint!',
      description: 'Félicitations! Vous avez atteint votre objectif d\'hydratation quotidienne pendant 7 jours consécutifs. Continuez comme ça!',
      metric: {
        name: 'Hydratation',
        value: 65,
        unit: '%',
        trend: 'up'
      },
      isRead: true
    },
    {
      id: '4',
      type: AlertType.WARNING,
      date: '2025-03-24T14:20:00',
      title: 'Baisse du taux de protéines',
      description: 'Votre apport en protéines est inférieur à l\'objectif fixé. Essayez d\'incorporer plus de sources de protéines dans votre alimentation.',
      metric: {
        name: 'Protéines',
        value: 52,
        unit: 'g',
        trend: 'down',
        threshold: 80
      },
      isRead: false
    },
    {
      id: '5',
      type: AlertType.WARNING,
      date: '2025-03-30T09:15:00',
      title: 'Douleur au genou signalée',
      description: 'Vous avez signalé une douleur de niveau 6/10 au genou droit lors de votre dernière séance d\'exercices. Veuillez contacter votre kinésithérapeute si cette douleur persiste ou s\'intensifie.',
      metric: {
        name: 'Douleur',
        value: 6,
        unit: '/10',
        trend: 'up',
        threshold: 5
      },
      isRead: false,
      action: {
        label: 'Prendre RDV',
        onClick: () => setShowAppointmentModal(true)
      }
    },
    {
      id: '6',
      type: AlertType.INFO,
      date: '2025-03-29T14:30:00',
      title: 'Rappel: exercices quotidiens',
      description: 'N\'oubliez pas de compléter vos exercices proprioceptifs aujourd\'hui. Ces exercices sont essentiels pour la stabilisation de votre genou.',
      isRead: true,
      action: {
        label: 'Voir programme',
        onClick: () => {
          const rehabElement = document.getElementById('rehab-table');
          if (rehabElement) {
            rehabElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    },
    {
      id: '7',
      type: AlertType.SUCCESS,
      date: '2025-03-27T18:45:00',
      title: 'Progression significative!',
      description: 'Félicitations! Votre amplitude de mouvement du genou s\'est améliorée de 15° depuis votre dernière évaluation. Continuez vos exercices réguliers pour maintenir cette progression.',
      metric: {
        name: 'Flexion genou',
        value: 125,
        unit: '°',
        trend: 'up'
      },
      isRead: true
    },
    {
      id: '8',
      type: AlertType.WARNING,
      date: '2025-03-25T11:20:00',
      title: 'Progression ralentie des quadriceps',
      description: 'La force de vos quadriceps n\'a pas progressé comme prévu ces deux dernières semaines. Assurez-vous de suivre correctement les exercices de renforcement prescrits.',
      metric: {
        name: 'Force quadriceps',
        value: 65,
        unit: '%',
        trend: 'stable',
        threshold: 75
      },
      isRead: false,
      action: {
        label: 'Revoir exercices',
        onClick: () => {
          const rehabElement = document.getElementById('rehab-table');
          if (rehabElement) {
            rehabElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
  ]);
  
  // État pour la modale de prise de rendez-vous
  const [newAppointmentDate, setNewAppointmentDate] = useState('');
  const [newAppointmentTime, setNewAppointmentTime] = useState('14:00');
  const [newAppointmentDuration, setNewAppointmentDuration] = useState(30);
  const [newAppointmentType, setNewAppointmentType] = useState('Consultation standard');
  
  // État pour la modale de paiement
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(50);
  const [paymentPurpose, setPaymentPurpose] = useState('Consultation');
  const [selectedAppointmentForPayment, setSelectedAppointmentForPayment] = useState<string | null>(null);

  // États pour la gestion des erreurs de formulaire
  const [formErrors, setFormErrors] = useState<{
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
    general?: string;
  }>({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Formater le numéro de carte avec des espaces après chaque groupe de 4 chiffres
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Gérer la soumission du paiement
  const handlePaymentSubmit = () => {
    // Réinitialiser les erreurs précédentes
    setFormErrors({});
    let hasErrors = false;
    const newErrors: {
      cardNumber?: string;
      cardHolder?: string;
      expiryDate?: string;
      cvv?: string;
      general?: string;
    } = {};
    
    // Validation
    if (cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Veuillez entrer un numéro de carte valide (16 chiffres)';
      hasErrors = true;
    }
    
    if (!cardHolder.trim()) {
      newErrors.cardHolder = 'Veuillez entrer le nom du titulaire de la carte';
      hasErrors = true;
    }
    
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiryDate = 'Format invalide (MM/YY)';
      hasErrors = true;
    }
    
    if (cvv.length < 3) {
      newErrors.cvv = 'CVV invalide (3 chiffres)';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setFormErrors(newErrors);
      return;
    }
    
    // Afficher animation de chargement et message de succès
    setPaymentSuccess(true);
    
    // Simulation d'un délai de traitement du paiement
    setTimeout(() => {
      // Mise à jour du statut de paiement du rendez-vous si un rendez-vous est sélectionné
      if (selectedAppointmentForPayment) {
        // Dans une vraie application, on ferait un appel API pour mettre à jour le statut
        console.log(`Paiement de ${paymentAmount}€ pour le rendez-vous du ${
          appointmentData.find(app => app.id === selectedAppointmentForPayment)?.date
        } effectué avec succès !`);
      } else {
        // Paiement sans rendez-vous spécifique
        console.log(`Paiement de ${paymentAmount}€ effectué avec succès !`);
      }
      
      // Fermer la modale après un court délai
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        
        // Réinitialiser les champs
        setCardNumber('');
        setCardHolder('');
        setExpiryDate('');
        setCvv('');
        setSelectedAppointmentForPayment(null);
      }, 1000);
    }, 1500);
  };

  // Gérer le format de la date d'expiration (MM/YY)
  const handleExpiryDateChange = (value: string) => {
    const v = value.replace(/\D/g, '');
    
    if (v.length <= 2) {
      setExpiryDate(v);
    } else {
      setExpiryDate(`${v.slice(0, 2)}/${v.slice(2, 4)}`);
    }
  };

  // Filtrer les rendez-vous par praticien et par statut de paiement en attente
  const pendingAppointments = appointmentData.filter(app => 
    app.professionalId === practitioner?.id && 
    app.paymentStatus === 'pending'
  );

  // Sélectionner un rendez-vous pour le paiement et mettre à jour les détails
  const handleSelectAppointment = (appointmentId: string) => {
    const selectedApp = appointmentData.find(app => app.id === appointmentId);
    if (selectedApp) {
      setSelectedAppointmentForPayment(appointmentId);
      setPaymentAmount(selectedApp.price || 50);
      setPaymentPurpose(selectedApp.type);
    }
  };

  // Effet pour récupérer les données du praticien
  useEffect(() => {
    const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
    if (id && practitionerData[id]) {
      setPractitioner(practitionerData[id]);
    }
  }, [params.id]);

  // Effet pour charger les rendez-vous filtrés lors du montage du composant
  useEffect(() => {
    // Simuler un chargement asynchrone
    const timer = setTimeout(() => {
      // Filtrer les rendez-vous pour ce praticien
      if (practitioner) {
        const filteredAppointments = appointmentData.filter(
          appt => appt.professionalId === practitioner.id
        );
        setAppointments(filteredAppointments);
        setIsMounted(true);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [practitioner]);
  
  // Gestionnaires d'événements pour les rendez-vous
  const handleSelectAppointmentForCalendar = (appointment: Appointment) => {
    console.log('Rendez-vous sélectionné:', appointment);
    // Ici vous pourriez ouvrir un modal avec les détails du rendez-vous
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    console.log('Annuler le rendez-vous:', appointmentId);
    // Mettre à jour le statut du rendez-vous à "canceled"
    setAppointments(prevAppointments => {
      return prevAppointments.map(appt => {
        if (appt.id === appointmentId) {
          return { ...appt, status: 'canceled' };
        }
        return appt;
      });
    });
  };
  
  const handleRescheduleAppointment = (appointmentId: string) => {
    console.log('Reprogrammer le rendez-vous:', appointmentId);
    // Ici vous pourriez ouvrir un gestionnaire de rendez-vous pour reprogrammer
  };
  
  const handleAddAppointment = (date: string) => {
    console.log('Ajouter un rendez-vous à la date:', date);
    
    // Vérifier que le praticien existe
    if (!practitioner) return;
    
    // Ouvrir la modale et définir la date sélectionnée
    setNewAppointmentDate(date);
    setShowAppointmentModal(true);
  };
  
  const handleConfirmAppointment = () => {
    // Vérifier que le praticien existe
    if (!practitioner) return;
    
    // Créer un nouveau rendez-vous
    const newAppointment: Appointment = {
      id: `app${Math.floor(Math.random() * 1000)}`,
      professionalId: practitioner.id,
      date: newAppointmentDate,
      time: newAppointmentTime,
      duration: newAppointmentDuration,
      location: "Cabinet médical",
      type: newAppointmentType,
      status: "upcoming",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Ajouter le rendez-vous à la liste
    setAppointments(prev => [...prev, newAppointment]);
    
    // Fermer la modale
    setShowAppointmentModal(false);
  };

  // Définition des types pour les aliments
  interface Food {
    name: string;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    icon: React.ReactNode;
  }

  interface Meal {
    id: number;
    name: string;
    time: string;
    foods: Food[];
  }

  // Composant conditionnel pour afficher le suivi nutritionnel 
  // uniquement pour Jessica Jones (praticien ID = 1)
  const renderNutritionTracking = () => {
    if (practitioner?.id === 1) {
      const calculatedMacros = calculateMacros();
      return (
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginTop: '30px',
            marginBottom: '15px',
            color: 'white',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Votre suivi nutritionnel
          </h2>
          <p style={{
            fontSize: '0.95rem',
            marginBottom: '25px',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            Suivez votre progression en temps réel avec Jessica Jones.
          </p>
          <MacroTracker
            calories={calculatedMacros.calories}
            caloriesGoal={1750}
            proteins={calculatedMacros.proteins}
            proteinsGoal={80}
            carbs={calculatedMacros.carbs}
            carbsGoal={200}
            fats={calculatedMacros.fats}
            fatsGoal={60}
          />
          <div style={{ marginTop: '30px' }}>
          </div>
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setShowMealModal(true)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(145deg, #FF6B00, #FF9248)',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: '1',
                minWidth: '200px',
                justifyContent: 'center'
              }}
            >
              Mettre à jour mon journal alimentaire
            </button>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={downloadNutritionPDF}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(0, 38, 65, 0.7)',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  flex: 1
                }}
              >
                <FaFilePdf /> Télécharger PDF
              </button>
              
              <button
                onClick={shareNutritionPlan}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(0, 17, 13, 0.7)',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  flex: 1
                }}
              >
                <FaShareAlt /> Partager
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Fonction pour générer un PDF du plan nutritionnel
  const generateNutritionPDF = () => {
    // Calculer les macros actuelles
    const macros = calculateMacros();
    const currentDate = new Date().toLocaleDateString();
    
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    
    // Ajouter un titre
    doc.setFontSize(20);
    doc.setTextColor(255, 107, 0); // Couleur orange
    doc.text(`Plan Nutritionnel de Baby Groot`, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Date: ${currentDate}`, 105, 30, { align: 'center' });
    
    // Ajouter un séparateur
    doc.setDrawColor(255, 107, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Résumé des macros
    doc.setFontSize(14);
    doc.setTextColor(0, 38, 65); // Bleu foncé
    doc.text('Résumé des macronutriments', 20, 45);
    
    // Tableau des macros
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Calories: ${macros.calories} / 1750 kcal (${Math.round((macros.calories / 1750) * 100)}%)`, 25, 55);
    doc.text(`Protéines: ${macros.proteins} / 80g (${Math.round((macros.proteins / 80) * 100)}%)`, 25, 65);
    doc.text(`Glucides: ${macros.carbs} / 200g (${Math.round((macros.carbs / 200) * 100)}%)`, 25, 75);
    doc.text(`Lipides: ${macros.fats} / 60g (${Math.round((macros.fats / 60) * 100)}%)`, 25, 85);
    
    // Ajouter un séparateur
    doc.line(20, 95, 190, 95);
    
    // Liste des repas
    doc.setFontSize(14);
    doc.setTextColor(0, 38, 65);
    doc.text('Détail des repas', 20, 105);
    
    let yPosition = 115;
    
    meals.forEach((meal: Meal) => {
      if (yPosition > 270) {
        // Ajouter une nouvelle page si on dépasse la hauteur
        doc.addPage();
        yPosition = 20;
      }
      
      const status = mealStatuses[meal.id] || 'pending';
      const statusText = status === 'consumed' ? 'Consommé' : status === 'skipped' ? 'Non consommé' : 'En attente';
      
      doc.setFontSize(12);
      doc.setTextColor(255, 107, 0);
      doc.text(`${meal.name} (${meal.time})`, 25, yPosition);
      
      // Status du repas
      doc.setFontSize(10);
      doc.setTextColor(
        status === 'consumed' ? 76 : status === 'skipped' ? 244 : 255,
        status === 'consumed' ? 175 : status === 'skipped' ? 67 : 152,
        status === 'consumed' ? 80 : status === 'skipped' ? 54 : 0
      );
      doc.text(`Statut: ${statusText}`, 130, yPosition);
      
      yPosition += 7;
      
      // Total calories du repas
      doc.setTextColor(80, 80, 80);
      doc.text(`Total: ${totalMealCalories(meal.foods)} kcal`, 25, yPosition);
      
      yPosition += 7;
      
      // Liste des aliments
      doc.setFontSize(9);
      meal.foods.forEach((food: Food) => {
        doc.text(`• ${food.name}: ${food.calories} kcal (P: ${food.proteins}g, G: ${food.carbs}g, L: ${food.fats}g)`, 30, yPosition);
        yPosition += 6;
      });
      
      yPosition += 7;
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Plan nutritionnel généré par Tuatha - Votre application de suivi de santé`, 105, 290, { align: 'center' });
      doc.text(`Page ${i} / ${pageCount}`, 105, 295, { align: 'center' });
    }
    
    // Sauvegarder le PDF
    const pdfName = `plan-nutritionnel-babygroot-${new Date().toISOString().slice(0, 10)}.pdf`;
    
    // Retourner le blob du PDF pour téléchargement ou partage
    const pdfBlob = doc.output('blob');
    return { blob: pdfBlob, name: pdfName };
  };
  
  // Fonction pour télécharger le PDF
  const downloadNutritionPDF = () => {
    const { blob, name } = generateNutritionPDF();
    
    // Créer un URL pour le blob
    const url = URL.createObjectURL(blob);
    
    // Créer un lien de téléchargement et le déclencher
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    
    // Nettoyer
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  // Fonction pour partager le plan nutritionnel
  const shareNutritionPlan = async () => {
    const { blob, name } = generateNutritionPDF();
    
    // Vérifier si l'API Web Share est disponible
    if (navigator.share) {
      try {
        // Créer un fichier à partir du blob
        const file = new File([blob], name, { type: 'application/pdf' });
        
        // Partager le fichier
        await navigator.share({
          title: 'Mon Plan Nutritionnel',
          text: 'Voici mon plan nutritionnel généré par Tuatha',
          files: [file]
        });
      } catch (error) {
        console.error('Erreur lors du partage:', error);
        // Fallback au téléchargement si le partage échoue
        downloadNutritionPDF();
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      downloadNutritionPDF();
    }
  };

  // Calcul des macronutriments en fonction des repas consommés
  const calculateMacros = () => {
    let totalCalories = 0;
    let totalProteins = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    // Parcourir tous les repas
    meals.forEach(meal => {
      // Ne compter que les repas consommés
      if (mealStatuses[meal.id] === 'consumed') {
        meal.foods.forEach(food => {
          totalCalories += food.calories;
          totalProteins += food.proteins;
          totalCarbs += food.carbs;
          totalFats += food.fats;
        });
      }
    });
    
    return {
      calories: totalCalories,
      proteins: totalProteins,
      carbs: totalCarbs,
      fats: totalFats
    };
  };

  const totalMealCalories = (foods: Food[]): number => {
    return foods.reduce((total: number, food: Food) => total + food.calories, 0);
  };

  // Fonctions pour la gestion du swipe
  const handleTouchStart = (e: React.TouchEvent, mealId: number) => {
    setTouchStart(e.targetTouches[0].clientX);
    setCurrentSwipeMeal(mealId);
    setSwipeDistance(0);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);
    
    // Calculer la distance de swipe pour l'animation
    const distance = touchStart - currentX;
    setSwipeDistance(distance);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !currentSwipeMeal) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // swipe vers la gauche (marquer comme consommé)
    const isRightSwipe = distance < -50; // swipe vers la droite (marquer comme non consommé)
    
    if (isLeftSwipe) {
      // Marquer comme non consommé
      setMealStatuses(prev => ({
        ...prev,
        [currentSwipeMeal]: 'skipped'
      }));
    } else if (isRightSwipe) {
      // Marquer comme consommé
      setMealStatuses(prev => ({
        ...prev,
        [currentSwipeMeal]: 'consumed'
      }));
    }
    
    // Réinitialiser les valeurs
    setTouchStart(null);
    setTouchEnd(null);
    setCurrentSwipeMeal(null);
    setSwipeDistance(0);
  };
  
  // Interactions par clic pour les navigateurs de bureau
  const markMealStatus = (mealId: number, status: 'consumed' | 'skipped' | 'pending') => {
    setMealStatuses(prev => ({
      ...prev,
      [mealId]: status
    }));
  };

  // Données des repas pour Baby Groot
  const meals: Meal[] = [
    {
      id: 1,
      name: "Petit déjeuner",
      time: "07:30",
      foods: [
        { name: "Terre fertile enrichie", calories: 150, proteins: 5, carbs: 20, fats: 2, icon: <FaCarrot style={{ color: '#FF6B00' }} /> },
        { name: "Eau de rosée du matin", calories: 0, proteins: 0, carbs: 0, fats: 0, icon: <span style={{ fontSize: '18px', color: '#4A88F2' }}>💧</span> },
        { name: "Granola solaire", calories: 250, proteins: 8, carbs: 40, fats: 10, icon: <FaBreadSlice style={{ color: '#C78C19' }} /> }
      ]
    },
    {
      id: 2,
      name: "Déjeuner",
      time: "12:30",
      foods: [
        { name: "Mix protéiné forestier", calories: 350, proteins: 30, carbs: 15, fats: 12, icon: <FaLeaf style={{ color: '#00C853' }} /> },
        { name: "Lumière solaire concentrée", calories: 100, proteins: 0, carbs: 25, fats: 0, icon: <span style={{ fontSize: '18px', color: '#FFD700' }}>☀️</span> },
        { name: "Noix du jardin", calories: 200, proteins: 8, carbs: 5, fats: 18, icon: <span style={{ fontSize: '18px', color: '#A0522D' }}>🌰</span> }
      ]
    },
    {
      id: 3,
      name: "Collation",
      time: "16:00",
      foods: [
        { name: "Nectar de fleur d'étoile", calories: 120, proteins: 1, carbs: 30, fats: 0, icon: <span style={{ fontSize: '18px', color: '#E91E63' }}>🌸</span> },
        { name: "Algues de croissance", calories: 80, proteins: 5, carbs: 10, fats: 1, icon: <span style={{ fontSize: '18px', color: '#009688' }}>🌿</span> }
      ]
    },
    {
      id: 4,
      name: "Dîner",
      time: "19:30",
      foods: [
        { name: "Racines colorées", calories: 180, proteins: 4, carbs: 35, fats: 2, icon: <FaCarrot style={{ color: '#FF5722' }} /> },
        { name: "Champignons luminescents", calories: 120, proteins: 8, carbs: 10, fats: 4, icon: <span style={{ fontSize: '18px', color: '#9C27B0' }}>🍄</span> },
        { name: "Bourgeons de saison", calories: 200, proteins: 12, carbs: 15, fats: 8, icon: <FaAppleAlt style={{ color: '#8BC34A' }} /> }
      ]
    }
  ];

  // Modale du journal alimentaire
  const renderMealJournalModal = () => {
    const handleEditMeal = (meal: Meal) => {
      setCurrentEditMeal(meal);
      setEditedFoods([...meal.foods]);
      setShowEditMealModal(true);
    };
    
    return (
      <Modal
        isOpen={showMealModal}
        onClose={() => setShowMealModal(false)}
        title="Journal alimentaire de Baby Groot"
      >
        <div style={{ color: 'white', maxHeight: '70vh', overflowY: 'auto', padding: '10px 5px' }}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.8)' }}>
              Date: 30 mars 2025
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '10px',
                  background: 'rgba(0, 38, 65, 0.5)',
                  borderRadius: '50%', 
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}>
                  <FaCarrot style={{ color: '#FF6B00' }} />
                </div>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Consommé</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '10px',
                  background: 'rgba(255, 59, 48, 0.5)',
                  borderRadius: '50%', 
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}>
                  <FaBreadSlice style={{ color: '#F44336' }} />
                </div>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Non consommé</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '10px',
                  background: 'rgba(255, 107, 0, 0.5)',
                  borderRadius: '50%', 
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}>
                  <FaAppleAlt style={{ color: '#FF9800' }} />
                </div>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>En attente</span>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '10px' }}>
              <i>Glissez vers la gauche pour marquer comme non consommé ✗<br />
              Glissez vers la droite pour marquer comme consommé ✓</i>
            </p>
          </div>
          
          {meals.map((meal: Meal) => (
            <div key={meal.id} style={{
              marginBottom: '25px',
              background: 'rgba(0, 38, 65, 0.25)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '15px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{meal.name}</h3>
                <span style={{ 
                  marginLeft: '10px', 
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>{meal.time}</span>
              </div>
              
              <div>
                {meal.foods.map((food: Food) => (
                  <div key={food.name} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: food === meal.foods[meal.foods.length - 1] ? 'none' : '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '30px', 
                        height: '30px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginRight: '10px',
                        background: 'rgba(0, 17, 13, 0.5)',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                      }}>
                        {food.icon}
                      </div>
                      <span>{food.name}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'flex-end',
                      fontSize: '13px'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>{food.calories} kcal</span>
                      <span style={{ 
                        color: 'rgba(255, 255, 255, 0.6)', 
                        fontSize: '11px' 
                      }}>
                        P: {food.proteins}g • G: {food.carbs}g • L: {food.fats}g
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Boutons de contrôle manuel */}
              <div style={{ 
                marginTop: '15px', 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <button 
                  onClick={() => handleEditMeal(meal)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Modifier
                </button>
              </div>
            </div>
          ))}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            margin: '30px 0 20px',
            padding: '15px',
            background: 'rgba(255, 107, 0, 0.15)',
            borderRadius: '12px',
            boxShadow: 'inset 0 0 0 1px rgba(255, 107, 0, 0.2)'
          }}>
            <div>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: 'bold' 
              }}>Total journalier</span>
            </div>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: '16px',
              color: '#FF6B00'
            }}>
              {calculateMacros().calories} kcal
            </div>
          </div>
          
          <div style={{
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: '20px' 
          }}>
            <button 
              onClick={() => setShowMealModal(false)}
              style={{
                background: 'linear-gradient(145deg, #FF6B00, #FF9248)',
                color: 'white',
                fontWeight: 'bold',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              Enregistrer mon journal
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  // Modale d'édition d'un repas
  const renderEditMealModal = () => {
    if (!currentEditMeal) return null;
    
    const updateFoodItem = (index: number, field: keyof Food, value: any) => {
      const updatedFoods = [...editedFoods];
      updatedFoods[index] = {
        ...updatedFoods[index],
        [field]: field === 'calories' || field === 'proteins' || field === 'carbs' || field === 'fats' 
          ? parseInt(value) || 0 
          : value
      };
      setEditedFoods(updatedFoods);
    };
    
    const addNewFood = () => {
      const newFood: Food = {
        name: "Nouvel aliment",
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
        icon: <FaLeaf style={{ color: '#4CAF50' }} />
      };
      setEditedFoods([...editedFoods, newFood]);
    };
    
    const removeFood = (index: number) => {
      const updatedFoods = [...editedFoods];
      updatedFoods.splice(index, 1);
      setEditedFoods(updatedFoods);
    };
    
    const saveChanges = () => {
      // Mettre à jour le repas avec les aliments modifiés
      const updatedMeals = meals.map(meal => 
        meal.id === currentEditMeal.id 
          ? { ...meal, foods: editedFoods } 
          : meal
      );
      
      // Fermer la modale
      setShowEditMealModal(false);
      setCurrentEditMeal(null);
    };
    
    return (
      <Modal
        isOpen={showEditMealModal}
        onClose={() => setShowEditMealModal(false)}
        title={`Modifier ${currentEditMeal.name} (${currentEditMeal.time})`}
      >
        <div style={{ color: 'white', maxHeight: '70vh', overflowY: 'auto', padding: '10px 5px' }}>
          {editedFoods.map((food: Food, index: number) => (
            <div key={index} style={{
              marginBottom: '15px',
              background: 'rgba(0, 38, 65, 0.25)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '15px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={food.name}
                  onChange={(e) => updateFoodItem(index, 'name', e.target.value)}
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    width: '70%',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => removeFood(index)}
                  style={{
                    background: 'rgba(255, 59, 48, 0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Supprimer
                </button>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                <div style={{ flex: '1 1 45%', minWidth: '120px' }}>
                  <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '5px' }}>
                    Calories
                  </label>
                  <input
                    type="number"
                    value={food.calories}
                    onChange={(e) => updateFoodItem(index, 'calories', e.target.value)}
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: 'white',
                      width: '100%',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div style={{ flex: '1 1 45%', minWidth: '120px' }}>
                  <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '5px' }}>
                    Protéines (g)
                  </label>
                  <input
                    type="number"
                    value={food.proteins}
                    onChange={(e) => updateFoodItem(index, 'proteins', e.target.value)}
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: 'white',
                      width: '100%',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div style={{ flex: '1 1 45%', minWidth: '120px' }}>
                  <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '5px' }}>
                    Glucides (g)
                  </label>
                  <input
                    type="number"
                    value={food.carbs}
                    onChange={(e) => updateFoodItem(index, 'carbs', e.target.value)}
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: 'white',
                      width: '100%',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div style={{ flex: '1 1 45%', minWidth: '120px' }}>
                  <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '5px' }}>
                    Lipides (g)
                  </label>
                  <input
                    type="number"
                    value={food.fats}
                    onChange={(e) => updateFoodItem(index, 'fats', e.target.value)}
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: 'white',
                      width: '100%',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <button
              onClick={addNewFood}
              style={{
                background: 'rgba(76, 175, 80, 0.2)',
                border: '1px dashed rgba(76, 175, 80, 0.5)',
                borderRadius: '8px',
                padding: '8px 15px',
                color: 'white',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              + Ajouter un aliment
            </button>
          </div>
          
          <div style={{
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '20px' 
          }}>
            <button 
              onClick={() => setShowEditMealModal(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            
            <button 
              onClick={saveChanges}
              style={{
                background: 'linear-gradient(145deg, #FF6B00, #FF9248)',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  // Données de démonstration pour les graphiques d'évolution
  const progressData = {
    weight: [
      { date: '2025-01-01', value: 18.5 },
      { date: '2025-01-15', value: 18.7 },
      { date: '2025-02-01', value: 19.2 },
      { date: '2025-02-15', value: 19.5 },
      { date: '2025-03-01', value: 19.8 },
      { date: '2025-03-15', value: 20.0 }
    ],
    waistSize: [
      { date: '2025-01-01', value: 40 },
      { date: '2025-01-15', value: 40.5 },
      { date: '2025-02-01', value: 41 },
      { date: '2025-02-15', value: 41.3 },
      { date: '2025-03-01', value: 41.7 },
      { date: '2025-03-15', value: 42 }
    ],
    hydration: [
      { date: '2025-01-01', value: 60 },
      { date: '2025-01-15', value: 58 },
      { date: '2025-02-01', value: 62 },
      { date: '2025-02-15', value: 63 },
      { date: '2025-03-01', value: 64 },
      { date: '2025-03-15', value: 65 }
    ],
    bodyFat: [
      { date: '2025-01-01', value: 20 },
      { date: '2025-01-15', value: 19.5 },
      { date: '2025-02-01', value: 19 },
      { date: '2025-02-15', value: 18.7 },
      { date: '2025-03-01', value: 18.3 },
      { date: '2025-03-15', value: 18 }
    ]
  };

  // Données de démonstration pour les alertes
  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, isRead: true } 
          : alert
      )
    );
  };

  if (!practitioner) {
    return (
      <div style={{ padding: '20px', color: 'white' }}>
        <Link href="/mespros" style={{ color: '#FF6B00', textDecoration: 'none' }}>
          ← Retour
        </Link>
        <h1 style={{ marginTop: '20px' }}>Praticien non trouvé</h1>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: 0, 
      color: 'white',
      minHeight: '100vh'
    }}>
      {/* Header avec photo */}
      <div style={{ 
        position: 'relative',
        height: '250px',
        backgroundImage: `url(${practitioner.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        borderBottomLeftRadius: '15px',
        borderBottomRightRadius: '15px',
      }}>
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          zIndex: 2
        }}>
          <Link href="/mespros" style={{ color: 'white', textDecoration: 'none' }}>
            ← Retour
          </Link>
        </div>
        
        {/* Dégradé sur la photo */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
          borderBottomLeftRadius: '15px',
          borderBottomRightRadius: '15px',
        }}></div>
        
        {/* Informations pro */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px'
        }}>
          <h1 style={{
            margin: '0 0 5px 0',
            fontSize: '24px',
            fontWeight: 'bold',
          }}>
            {practitioner.firstName} {practitioner.lastName}
          </h1>
          <p style={{
            margin: 0,
            fontSize: '16px',
            color: '#FF6B00',
          }}>
            {practitioner.specialty}
          </p>
        </div>
      </div>
      
      {/* Contenu */}
      <div style={{ padding: '20px' }}>
        {/* Bio déroulante */}
        <div style={{
          marginTop: '15px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          <div 
            onClick={() => setIsBioOpen(!isBioOpen)}
            style={{
              padding: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              borderBottom: isBioOpen ? '1px solid rgba(255, 107, 0, 0.3)' : 'none'
            }}
          >
            <h2 style={{ margin: 0, fontSize: '18px' }}>Biographie</h2>
            <span style={{ 
              color: '#FF6B00', 
              fontSize: '20px', 
              fontWeight: 'bold' 
            }}>
              {isBioOpen ? '▲' : '▼'}
            </span>
          </div>
          
          {isBioOpen && (
            <div style={{ padding: '15px', lineHeight: '1.6' }}>
              <p>{practitioner.bio}</p>
            </div>
          )}
        </div>
        
        {/* Section des rendez-vous */}
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            marginBottom: '15px',
            borderBottom: '1px solid rgba(255, 107, 0, 0.3)',
            paddingBottom: '10px'
          }}>
            Vos rendez-vous avec {practitioner.firstName} {practitioner.lastName}
          </h2>
          
          {/* Calendrier filtré par praticien */}
          {isMounted && (
            <Calendar 
              appointments={appointments}
              professionals={[{
                id: practitioner.id,
                name: `${practitioner.firstName} ${practitioner.lastName}`,
                title: practitioner.specialty,
                subtitle: "",
                image: practitioner.imageUrl
              }]}
              onSelectAppointment={handleSelectAppointmentForCalendar}
              onAddAppointment={handleAddAppointment}
              onCancelAppointment={handleCancelAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
            />
          )}
          
          {/* Boutons d'action entre le calendrier et la bibliothèque vidéo */}
          <div style={{
            marginTop: '25px',
            background: 'rgba(0, 38, 65, 0.25)',
            borderRadius: '15px',
            padding: '15px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.08)'
          }}>
            <ActionButtons 
              onAppointment={handleAddAppointment}
              onPayment={() => setShowPaymentModal(true)}
            />
          </div>
          
          {/* Bibliothèque vidéo pour Tony Stark */}
          {practitioner.id === 4 && isMounted && (
            <div style={{ marginTop: '25px' }}>
              <VideoLibrary 
                title="Vidéos d'exercices - Kinésithérapie"
                subtitle="Visionnez ces exercices recommandés pour compléter votre traitement"
                videos={[
                  {
                    id: "1",
                    title: "Exercices pour douleurs lombaires",
                    description: "Série d'exercices doux pour soulager les douleurs lombaires. À pratiquer quotidiennement pendant 10 minutes pour renforcer progressivement les muscles du dos et améliorer la mobilité.",
                    url: "/img/video/kine/video1.mp4",
                    category: "Dos"
                  },
                  {
                    id: "2",
                    title: "Mobilité des épaules",
                    description: "Programme complet pour restaurer la mobilité des épaules et renforcer la coiffe des rotateurs. Idéal pour les personnes souffrant de douleurs chroniques ou en récupération post-opératoire.",
                    url: "/img/video/kine/video2.mp4",
                    category: "Épaules"
                  },
                  {
                    id: "3",
                    title: "Renforcement du genou",
                    description: "Exercices ciblés pour renforcer l'articulation du genou et les muscles environnants. Particulièrement recommandé après une entorse ou pour les douleurs liées à l'arthrose.",
                    url: "/img/video/kine/video3.mp4",
                    category: "Genoux"
                  },
                  {
                    id: "4",
                    title: "Étirements cervicaux",
                    description: "Séquence d'étirements doux pour soulager les tensions cervicales et améliorer la mobilité du cou. Parfait pour les personnes travaillant longtemps sur ordinateur ou souffrant de migraines.",
                    url: "/img/video/kine/video4.mp4",
                    category: "Cervicales"
                  },
                  {
                    id: "5",
                    title: "Rééducation de la cheville",
                    description: "Programme progressif pour retrouver stabilité et force après une entorse de la cheville. Ces exercices améliorent la proprioception et renforcent les muscles stabilisateurs.",
                    url: "/img/video/kine/video5.mp4",
                    category: "Chevilles"
                  }
                ]}
              />
            </div>
          )}
          
          {/* Cycle d'entraînement pour Rocky Balboa (ID 3) */}
          {practitioner?.id === 3 && isMounted && (
            <div style={{ marginTop: '25px' }}>
              <TrainingCycle
                athleteName="Baby Groot"
                athleteId="P-12345"
              />
            </div>
          )}
          
          {/* Programme d'entraînement pour Rocky Balboa (ID 3) */}
          {practitioner?.id === 3 && isMounted && (
            <div style={{ marginTop: '25px' }}>
              <TrainingProgram
                athleteName="Baby Groot"
                athleteId="P-12345"
              />
            </div>
          )}
          
          {/* Composant de partage de vidéos pour Rocky Balboa */}
          {practitioner?.id === 3 && isMounted && (
            <div style={{ marginTop: '25px' }}>
              <VideoShare
                athleteName="Baby Groot"
                athleteId="P-12345"
              />
            </div>
          )}
          
          {/* Composant de progression de rééducation pour Tony Stark */}
          {practitioner.id === 4 && isMounted && (
            <div style={{ marginTop: '25px' }}>
              <RehabProgress
                patientName="Baby Groot"
                injury="Entorse grave de la cheville gauche"
                startDate="2025-02-10"
                estimatedEndDate="2025-05-15"
                currentProgress={65}
                metrics={[
                  {
                    id: "1",
                    name: "Amplitude de mouvement (degrés)",
                    unit: "°",
                    values: [
                      { date: "2025-02-10", value: 10 },
                      { date: "2025-02-17", value: 15 },
                      { date: "2025-02-24", value: 22 },
                      { date: "2025-03-03", value: 28 },
                      { date: "2025-03-10", value: 35 },
                      { date: "2025-03-17", value: 42 },
                      { date: "2025-03-24", value: 48 }
                    ],
                    target: 70
                  },
                  {
                    id: "2",
                    name: "Force musculaire (échelle 0-5)",
                    unit: "",
                    values: [
                      { date: "2025-02-10", value: 1.5 },
                      { date: "2025-02-24", value: 2.0 },
                      { date: "2025-03-10", value: 3.0 },
                      { date: "2025-03-24", value: 3.5 }
                    ],
                    target: 5
                  },
                  {
                    id: "3",
                    name: "Distance de marche sans douleur",
                    unit: "m",
                    values: [
                      { date: "2025-02-10", value: 50 },
                      { date: "2025-02-24", value: 100 },
                      { date: "2025-03-10", value: 250 },
                      { date: "2025-03-24", value: 500 }
                    ],
                    target: 1000
                  },
                  {
                    id: "4",
                    name: "Douleur (échelle 0-10)",
                    unit: "",
                    values: [
                      { date: "2025-02-10", value: 8 },
                      { date: "2025-02-17", value: 7 },
                      { date: "2025-02-24", value: 6 },
                      { date: "2025-03-03", value: 5 },
                      { date: "2025-03-10", value: 4 },
                      { date: "2025-03-17", value: 3 },
                      { date: "2025-03-24", value: 2 }
                    ],
                    target: 0
                  }
                ]}
                goals={[
                  {
                    id: "g1",
                    title: "Marcher sans béquilles",
                    description: "Capacité à marcher 100m sans support ni assistance",
                    targetDate: "2025-03-01",
                    isCompleted: true
                  },
                  {
                    id: "g2",
                    title: "Monter un escalier standard",
                    description: "Monter un étage d'escalier sans assistance et avec un mouvement fluide",
                    targetDate: "2025-03-15",
                    isCompleted: true
                  },
                  {
                    id: "g3",
                    title: "Courir sur tapis roulant",
                    description: "Courir 5 minutes à 8 km/h sans douleur",
                    targetDate: "2025-04-01",
                    isCompleted: false
                  },
                  {
                    id: "g4",
                    title: "Réaliser 10 sauts de petite hauteur",
                    description: "Effectuer 10 sauts consécutifs avec réception contrôlée sans douleur",
                    targetDate: "2025-04-15",
                    isCompleted: false
                  },
                  {
                    id: "g5",
                    title: "Reprise de l'activité sportive complète",
                    description: "Retour aux activités sportives habituelles sans limitation",
                    targetDate: "2025-05-10",
                    isCompleted: false
                  }
                ]}
              />
            </div>
          )}
          
          {/* Historique des rééducations pour Tony Stark */}
          {practitioner.id === 4 && isMounted && (
            <div style={{ marginTop: '25px' }}>
              <RehabHistory
                patientName="Baby Groot"
                patientId="P-12345"
              />
            </div>
          )}
          
          {/* Tableau de rééducation pour Tony Stark */}
          {practitioner.id === 4 && isMounted && (
            <div style={{ marginTop: '25px' }}>
              <RehabTable
                patientName="Baby Groot"
                patientId="P-12345"
              />
            </div>
          )}
          
          {/* Journal d'alertes - affiché pour les deux praticiens (Jessica Jones et Tony Stark) */}
          {(practitioner.id === 1 || practitioner.id === 4) && isMounted && (
            <div style={{ marginTop: '30px' }}>
              <AlertJournal 
                alerts={alerts}
                onMarkAsRead={handleMarkAsRead}
              />
            </div>
          )}
          
          {/* Ces composants ne doivent apparaître que pour la nutritionniste (ID 1) */}
          {practitioner?.id === 1 && (
            <>
              {/* Afficher le suivi nutritionnel uniquement pour Jessica Jones */}
              {renderNutritionTracking()}
              
              {/* Composition corporelle actuelle */}
              <BodyComposition 
                weight={20}
                waistSize={42}
                hydration={65}
                bodyFat={18}
                height={120}
              />
              
              {/* Slider d'évolution des métriques */}
              <div style={{ marginTop: '30px' }}>
                <ProgressSlider data={progressData} />
              </div>
            </>
          )}
          
          {/* Liste des ordonnances pour le médecin généraliste (ID 2) */}
          {practitioner?.id === 2 && (
            <div style={{ marginTop: '25px' }}>
              <PrescriptionList 
                prescriptions={[
                  {
                    id: '1',
                    title: 'Traitement anti-douleur',
                    date: '2025-03-15',
                    doctor: 'Beverly Crusher',
                    medications: [
                      {
                        name: 'Paracétamol 1000mg',
                        dosage: '1 comprimé',
                        frequency: '3 fois par jour',
                        duration: '7 jours'
                      }
                    ],
                    expiryDate: '2025-04-15',
                    refillsLeft: 2,
                    isPermanent: false
                  },
                  {
                    id: '2',
                    title: 'Traitement anti-inflammatoire',
                    date: '2025-03-20',
                    doctor: 'Beverly Crusher',
                    medications: [
                      {
                        name: 'Ibuprofène 400mg',
                        dosage: '1 comprimé',
                        frequency: '3 fois par jour',
                        duration: '5 jours'
                      }
                    ],
                    expiryDate: '2025-04-20',
                    refillsLeft: 1,
                    isPermanent: false
                  }
                ]}
                onDownload={(prescription) => {
                  // Génération d'un PDF d'ordonnance avec jsPDF
                  const doc = new jsPDF();
                  doc.setFontSize(22);
                  doc.text("Ordonnance médicale", 105, 20, { align: "center" });
                  doc.setFontSize(14);
                  doc.text(`Dr. ${prescription.doctor}`, 20, 40);
                  doc.text(`Date: ${new Date(prescription.date).toLocaleDateString('fr-FR')}`, 20, 50);
                  doc.text(`Patient: ${practitioner.firstName} ${practitioner.lastName}`, 20, 60);
                  
                  doc.setFontSize(16);
                  doc.text("Médicaments prescrits:", 20, 80);
                  
                  let yPos = 90;
                  prescription.medications.forEach((med, index) => {
                    doc.setFontSize(14);
                    doc.text(`${index + 1}. ${med.name}`, 25, yPos);
                    doc.setFontSize(12);
                    doc.text(`   Posologie: ${med.dosage}`, 30, yPos + 8);
                    doc.text(`   Fréquence: ${med.frequency}`, 30, yPos + 16);
                    doc.text(`   Durée: ${med.duration}`, 30, yPos + 24);
                    yPos += 35;
                  });
                  
                  if (!prescription.isPermanent) {
                    doc.text(`Expire le: ${new Date(prescription.expiryDate).toLocaleDateString('fr-FR')}`, 20, yPos + 10);
                  } else {
                    doc.text(`Traitement permanent`, 20, yPos + 10);
                  }
                  
                  // Signature et cachet
                  doc.setFontSize(12);
                  doc.text("Signature et cachet:", 130, yPos + 40);
                  doc.text("Dr. Beverly Crusher", 130, yPos + 50);
                  doc.text("Médecin généraliste", 130, yPos + 58);
                  
                  // Téléchargement du PDF
                  doc.save(`ordonnance_${prescription.id}.pdf`);
                }}
                onShare={(prescription) => {
                  // Création de l'URL de partage
                  const shareData = {
                    title: 'Ordonnance médicale',
                    text: `Ordonnance: ${prescription.title} prescrite par Dr. ${prescription.doctor}`,
                    url: window.location.href
                  };
                  
                  // Utilisation de l'API Web Share si disponible
                  if (navigator.share && navigator.canShare(shareData)) {
                    navigator.share(shareData)
                      .then(() => console.log('Ordonnance partagée avec succès'))
                      .catch((error) => console.log('Erreur lors du partage:', error));
                  } else {
                    // Fallback si l'API Web Share n'est pas disponible
                    const emailSubject = encodeURIComponent('Ordonnance médicale');
                    const emailBody = encodeURIComponent(
                      `Ordonnance: ${prescription.title}\n
                      Prescrite par: Dr. ${prescription.doctor}\n
                      Date: ${new Date(prescription.date).toLocaleDateString('fr-FR')}\n
                      Médicaments: ${prescription.medications.map(med => `${med.name} (${med.dosage})`).join(', ')}`
                    );
                    
                    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
                  }
                }}
              />
            </div>
          )}
          
          {/* Composant de documents partagés */}
          <div style={{ 
            marginTop: '40px', 
            marginBottom: '40px',
            padding: '0 20px'
          }}>
            <div style={{ 
              width: '100%',
              background: 'rgba(0, 38, 65, 0.35)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              color: 'white',
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '15px',
                color: '#FF6B00',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                {practitioner.id === 1 && "Documents partagés - Nutrition"}
                {practitioner.id === 2 && "Documents partagés - Médical"}
                {practitioner.id === 3 && "Documents partagés - Entraînement"}
                {practitioner.id === 4 && "Documents partagés - Kinésithérapie"}
              </h2>
              <p style={{
                fontSize: '0.95rem',
                marginBottom: '25px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                {practitioner.id === 1 && "Partagez vos journaux alimentaires, analyses nutritionnelles ou journaux alimentaires."}
                {practitioner.id === 2 && "Partagez vos résultats d'examens, dossiers médicaux ou informations importantes concernant votre santé."}
                {practitioner.id === 3 && "Partagez vos plans d'entraînement, suivis de performances ou objectifs sportifs."}
                {practitioner.id === 4 && "Partagez vos radiographies, bilans et notes d'exercices de rééducation."}
              </p>

              {/* Liste des documents partagés */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                width: '100%',
                marginBottom: '25px'
              }}>
                {sharedDocuments.length === 0 ? (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(0, 17, 13, 0.4)',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    Vous n'avez pas encore partagé de documents avec ce praticien.
                  </div>
                ) : (
                  sharedDocuments.map((doc) => (
                    <div key={doc.id} style={{
                      padding: '16px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(0, 17, 13, 0.4)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: 'white' }}>{doc.title}</h3>
                        <span style={{ 
                          marginLeft: '10px', 
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.6)'
                        }}>{doc.fileName}</span>
                      </div>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                        {doc.description}
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '8px',
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.6)'
                      }}>
                        <span>
                          {new Date(doc.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Bouton pour ajouter un document */}
              <button
                onClick={() => setShowDocumentModal(true)}
                style={{
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(145deg, #FF6B00, #FF9248)',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <FaFileUpload /> Partager un document
              </button>
            </div>
          </div>
        </div>
        
        {/* Modale de prise de rendez-vous */}
        <Modal 
          isOpen={showAppointmentModal} 
          onClose={() => setShowAppointmentModal(false)}
          title={`Prendre rendez-vous avec ${practitioner.firstName} ${practitioner.lastName}`}
        >
          <div style={{ padding: '10px', color: 'white' }}>
            {/* ... */}
          </div>
        </Modal>
        
        {/* Modale du journal alimentaire */}
        {renderMealJournalModal()}
        
        {/* Modale d'édition de repas */}
        {renderEditMealModal()}
        
        {/* Modale pour partager un document */}
        <Modal
          isOpen={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
          title={`Partager un document avec ${practitioner.firstName} ${practitioner.lastName}`}
        >
          <div style={{ padding: '20px', color: 'white' }}>
            {/* ... */}
          </div>
        </Modal>
      </div>
    </div>
  );
}
