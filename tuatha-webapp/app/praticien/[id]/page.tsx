'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal';
import Calendar from '../../components/Calendar';
import { FaRegCreditCard, FaLock, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcApplePay } from 'react-icons/fa';

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
    bio: "Bonjour, je suis Jessica Jones, diététicienne-nutritionniste avec plus de 8 ans d'expérience. Après une période difficile dans ma vie où j'ai dû reconstruire ma relation avec la nourriture, j'ai décidé de mettre mon expérience personnelle et ma force au service des autres. Je suis spécialisée dans les troubles alimentaires et la nutrition sportive. Mon approche est directe mais efficace - pas de promesses miraculeuses, juste des plans nutritionnels basés sur des preuves scientifiques et adaptés à votre réalité quotidienne. Je travaille souvent avec des athlètes, mais aussi avec des personnes souffrant de troubles alimentaires ou cherchant simplement à retrouver une relation saine avec leur alimentation. J'ai vécu à Hell's Kitchen pendant des années, ce qui m'a appris l'importance de rester ancrée dans la réalité et de comprendre les véritables défis de la vie quotidienne. Si vous cherchez quelqu'un qui vous dira la vérité sans détour et vous aidera réellement à atteindre vos objectifs, nous devrions travailler ensemble."
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
    specialty: "Médecin du sport",
    imageUrl: "/img/TonyStark.jpg",
    bio: "Dr. Tony Stark à votre service. Oui, le même qui a révolutionné la technologie des prothèses médicales et de l'équipement sportif à travers les industries Stark. Après des années à développer des technologies de pointe et à repousser les limites du corps humain (y compris le mien), j'ai décidé de me consacrer à la médecine du sport. Pourquoi? Parce que la performance m'a toujours fasciné, et qui de mieux que moi pour comprendre comment optimiser le potentiel du corps humain? Ma double expertise en ingénierie biomédicale et en médecine me permet d'offrir des traitements innovants pour les blessures sportives. J'utilise des technologies exclusives de régénération tissulaire et des protocoles de rééducation que j'ai personnellement développés et testés. Mon approche combine haute technologie et connaissance approfondie de la biomécanique. J'ai traité des athlètes olympiques, des membres des forces spéciales, et même quelques super-héros (mais ça, c'est confidentiel). Si vous voulez revenir de blessure plus fort qu'avant ou simplement repousser vos limites actuelles, mon équipe et moi avons la solution. Et non, je ne porte pas mon armure pendant les consultations... sauf demande spéciale."
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
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const [practitioner, setPractitioner] = useState<Practitioner | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // État pour la modale de prise de rendez-vous
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [newAppointmentDate, setNewAppointmentDate] = useState('');
  const [newAppointmentTime, setNewAppointmentTime] = useState('14:00');
  const [newAppointmentDuration, setNewAppointmentDuration] = useState(30);
  const [newAppointmentType, setNewAppointmentType] = useState('Consultation standard');
  
  // État pour la modale de paiement
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
    if (id && practitionerData[id]) {
      setPractitioner(practitionerData[id]);
    }
  }, [id]);

  const [isBioOpen, setIsBioOpen] = useState(false);
  
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
      background: 'linear-gradient(145deg, rgba(0, 38, 65, 0.9), rgba(0, 17, 13, 0.9))',
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
          <Link href="/mespros" style={{ 
            color: 'white', 
            textDecoration: 'none',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '8px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px'
          }}>
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
            Vos rendez-vous avec {practitioner.firstName}
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
          
          {/* Boutons d'action */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
            flexDirection: 'column' // Empilés pour mobile
          }}>
            <button 
              onClick={() => {
                // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const formattedDate = `${yyyy}-${mm}-${dd}`;
                
                // Appeler la fonction handleAddAppointment avec la date d'aujourd'hui
                handleAddAppointment(formattedDate);
              }}
              style={{
                background: 'linear-gradient(145deg, #FF6B00, #FF9248)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                transition: 'all 0.2s ease'
              }}
            >
              Prendre rendez-vous
            </button>
            
            <button 
              onClick={() => setShowPaymentModal(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 107, 0, 0.4)',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                transition: 'all 0.2s ease'
              }}
            >
              Payer en ligne
            </button>
          </div>
        </div>
      </div>
      
      {/* Modale de prise de rendez-vous */}
      <Modal 
        isOpen={showAppointmentModal} 
        onClose={() => setShowAppointmentModal(false)}
        title={`Prendre rendez-vous avec ${practitioner?.firstName || ''}`}
      >
        <div style={{
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: '500'
            }}>
              Date
            </label>
            <input
              type="date"
              value={newAppointmentDate}
              onChange={(e) => setNewAppointmentDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 107, 0, 0.3)',
                background: 'rgba(0, 38, 65, 0.25)',
                color: 'white',
                fontSize: '15px',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: '500'
            }}>
              Heure
            </label>
            <input
              type="time"
              value={newAppointmentTime}
              onChange={(e) => setNewAppointmentTime(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 107, 0, 0.3)',
                background: 'rgba(0, 38, 65, 0.25)',
                color: 'white',
                fontSize: '15px',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: '500'
            }}>
              Durée (minutes)
            </label>
            <select
              value={newAppointmentDuration}
              onChange={(e) => setNewAppointmentDuration(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 107, 0, 0.3)',
                background: 'rgba(0, 38, 65, 0.25)',
                color: 'white',
                fontSize: '15px',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
                outline: 'none',
                WebkitAppearance: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23FF6B00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                paddingRight: '40px'
              }}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 heure</option>
            </select>
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: '500'
            }}>
              Type de rendez-vous
            </label>
            <select
              value={newAppointmentType}
              onChange={(e) => setNewAppointmentType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 107, 0, 0.3)',
                background: 'rgba(0, 38, 65, 0.25)',
                color: 'white',
                fontSize: '15px',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
                outline: 'none',
                WebkitAppearance: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23FF6B00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                paddingRight: '40px'
              }}
            >
              <option value="Consultation standard">Consultation standard</option>
              <option value="Premier rendez-vous">Premier rendez-vous</option>
              <option value="Suivi">Rendez-vous de suivi</option>
              <option value="Urgence">Urgence</option>
            </select>
          </div>
          
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <button 
              onClick={() => setShowAppointmentModal(false)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(0, 0, 0, 0.2)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '500',
                flex: '1',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              Annuler
            </button>
            
            <button 
              onClick={handleConfirmAppointment}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(145deg, #FF6B00, #FF9248)',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)',
                flex: '1.5',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)',
                transform: 'translateX(-100%)',
                animation: 'shine 1.5s infinite'
              }} />
              Confirmer
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes shine {
            0% {
              transform: translateX(-100%);
            }
            60% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </Modal>
      
      {/* Modale de paiement en ligne */}
      <Modal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        title={`Paiement en ligne - ${practitioner?.firstName || ''} ${practitioner?.lastName || ''}`}
      >
        <div style={{
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          {pendingAppointments.length > 0 && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: '500'
              }}>
                Rendez-vous en attente de règlement
              </label>
              <select
                value={selectedAppointmentForPayment || ''}
                onChange={(e) => handleSelectAppointment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 107, 0, 0.3)',
                  backgroundColor: selectedAppointmentForPayment ? 'rgba(0, 38, 65, 0.15)' : 'rgba(0, 38, 65, 0.25)',
                  color: 'white',
                  fontSize: '15px',
                  boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(5px)',
                  outline: 'none',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: !selectedAppointmentForPayment ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23FF6B00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")` : 'none',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: !selectedAppointmentForPayment ? 'right 16px center' : 'center',
                  paddingRight: selectedAppointmentForPayment ? '16px' : '40px',
                  opacity: selectedAppointmentForPayment ? 0.8 : 1
                }}
              >
                <option value="">Sélectionnez un rendez-vous...</option>
                {pendingAppointments.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.date} à {app.time} - {app.type} ({app.price}€)
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {pendingAppointments.length === 0 && (
            <div style={{
              padding: '12px 15px',
              background: 'rgba(255, 107, 0, 0.15)',
              borderRadius: '12px',
              marginBottom: '5px'
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                Aucun rendez-vous en attente de règlement avec ce praticien.
              </p>
            </div>
          )}
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: '500'
            }}>
              Montant (€)
            </label>
            <select
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              disabled={selectedAppointmentForPayment !== null}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 107, 0, 0.3)',
                backgroundColor: selectedAppointmentForPayment ? 'rgba(0, 38, 65, 0.15)' : 'rgba(0, 38, 65, 0.25)',
                color: 'white',
                fontSize: '15px',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
                outline: 'none',
                WebkitAppearance: 'none',
                appearance: 'none',
                backgroundImage: !selectedAppointmentForPayment ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23FF6B00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")` : 'none',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: !selectedAppointmentForPayment ? 'right 16px center' : 'center',
                paddingRight: selectedAppointmentForPayment ? '16px' : '40px',
                opacity: selectedAppointmentForPayment ? 0.8 : 1
              }}
            >
              <option value={30}>30 €</option>
              <option value={50}>50 €</option>
              <option value={70}>70 €</option>
              <option value={90}>90 €</option>
              <option value={120}>120 €</option>
            </select>
            {selectedAppointmentForPayment && (
              <p style={{ 
                margin: '5px 0 0', 
                fontSize: '12px', 
                color: 'rgba(255, 255, 255, 0.7)',
                fontStyle: 'italic'
              }}>
                Montant défini par le rendez-vous sélectionné
              </p>
            )}
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: '500'
            }}>
              Motif du paiement
            </label>
            <select
              value={paymentPurpose}
              onChange={(e) => setPaymentPurpose(e.target.value)}
              disabled={selectedAppointmentForPayment !== null}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 107, 0, 0.3)',
                backgroundColor: selectedAppointmentForPayment ? 'rgba(0, 38, 65, 0.15)' : 'rgba(0, 38, 65, 0.25)',
                color: 'white',
                fontSize: '15px',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
                outline: 'none',
                WebkitAppearance: 'none',
                appearance: 'none',
                backgroundImage: !selectedAppointmentForPayment ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23FF6B00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")` : 'none',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: !selectedAppointmentForPayment ? 'right 16px center' : 'center',
                paddingRight: selectedAppointmentForPayment ? '16px' : '40px',
                opacity: selectedAppointmentForPayment ? 0.8 : 1
              }}
            >
              <option value="Consultation">Consultation</option>
              <option value="Suivi">Suivi</option>
              <option value="Téléconsultation">Téléconsultation</option>
              <option value="Première séance">Première séance</option>
              <option value="Autre">Autre</option>
            </select>
            {selectedAppointmentForPayment && (
              <p style={{ 
                margin: '5px 0 0', 
                fontSize: '12px', 
                color: 'rgba(255, 255, 255, 0.7)',
                fontStyle: 'italic'
              }}>
                Motif défini par le rendez-vous sélectionné
              </p>
            )}
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: '500'
            }}>
              Numéro de carte
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(formatCardNumber(e.target.value));
                // Effacer l'erreur quand l'utilisateur commence à corriger
                if (formErrors.cardNumber) {
                  setFormErrors({...formErrors, cardNumber: undefined});
                }
              }}
              maxLength={19} // 16 digits + 3 spaces
              placeholder="1234 5678 9012 3456"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: formErrors.cardNumber 
                  ? '1px solid rgba(255, 0, 0, 0.5)' 
                  : '1px solid rgba(255, 107, 0, 0.3)',
                backgroundColor: 'rgba(0, 38, 65, 0.25)',
                color: 'white',
                fontSize: '15px',
                boxShadow: formErrors.cardNumber 
                  ? 'inset 0 2px 5px rgba(255, 0, 0, 0.1)' 
                  : 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            {formErrors.cardNumber && (
              <p style={{ 
                margin: '5px 0 0', 
                fontSize: '12px', 
                color: 'rgba(255, 120, 120, 1)',
                fontStyle: 'italic'
              }}>
                {formErrors.cardNumber}
              </p>
            )}
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: '500'
            }}>
              Titulaire de la carte
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => {
                setCardHolder(e.target.value);
                if (formErrors.cardHolder) {
                  setFormErrors({...formErrors, cardHolder: undefined});
                }
              }}
              placeholder="NOM Prénom"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: formErrors.cardHolder 
                  ? '1px solid rgba(255, 0, 0, 0.5)' 
                  : '1px solid rgba(255, 107, 0, 0.3)',
                backgroundColor: 'rgba(0, 38, 65, 0.25)',
                color: 'white',
                fontSize: '15px',
                boxShadow: formErrors.cardHolder 
                  ? 'inset 0 2px 5px rgba(255, 0, 0, 0.1)' 
                  : 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            {formErrors.cardHolder && (
              <p style={{ 
                margin: '5px 0 0', 
                fontSize: '12px', 
                color: 'rgba(255, 120, 120, 1)',
                fontStyle: 'italic'
              }}>
                {formErrors.cardHolder}
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: '500'
              }}>
                Date d'expiration
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => {
                  handleExpiryDateChange(e.target.value);
                  if (formErrors.expiryDate) {
                    setFormErrors({...formErrors, expiryDate: undefined});
                  }
                }}
                placeholder="MM/YY"
                maxLength={5}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: formErrors.expiryDate 
                    ? '1px solid rgba(255, 0, 0, 0.5)' 
                    : '1px solid rgba(255, 107, 0, 0.3)',
                  backgroundColor: 'rgba(0, 38, 65, 0.25)',
                  color: 'white',
                  fontSize: '15px',
                  boxShadow: formErrors.expiryDate 
                    ? 'inset 0 2px 5px rgba(255, 0, 0, 0.1)' 
                    : 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(5px)',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              {formErrors.expiryDate && (
                <p style={{ 
                  margin: '5px 0 0', 
                  fontSize: '12px', 
                  color: 'rgba(255, 120, 120, 1)',
                  fontStyle: 'italic'
                }}>
                  {formErrors.expiryDate}
                </p>
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: '500'
              }}>
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => {
                  setCvv(e.target.value.replace(/\D/g, '').substring(0, 3));
                  if (formErrors.cvv) {
                    setFormErrors({...formErrors, cvv: undefined});
                  }
                }}
                maxLength={3}
                placeholder="123"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: formErrors.cvv 
                    ? '1px solid rgba(255, 0, 0, 0.5)' 
                    : '1px solid rgba(255, 107, 0, 0.3)',
                  backgroundColor: 'rgba(0, 38, 65, 0.25)',
                  color: 'white',
                  fontSize: '15px',
                  boxShadow: formErrors.cvv 
                    ? 'inset 0 2px 5px rgba(255, 0, 0, 0.1)' 
                    : 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(5px)',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              {formErrors.cvv && (
                <p style={{ 
                  margin: '5px 0 0', 
                  fontSize: '12px', 
                  color: 'rgba(255, 120, 120, 1)',
                  fontStyle: 'italic'
                }}>
                  {formErrors.cvv}
                </p>
              )}
            </div>
          </div>
          
          <div style={{ 
            padding: '12px 15px', 
            background: 'rgba(255, 107, 0, 0.1)', 
            borderRadius: '12px',
            border: '1px solid rgba(255, 107, 0, 0.2)',
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ 
              background: 'rgba(255, 107, 0, 0.2)', 
              borderRadius: '50%', 
              width: '32px', 
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center' 
            }}>
              <FaLock size={14} color="#FF6B00" />
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: '13px', 
              color: 'rgba(255, 255, 255, 0.85)'
            }}>
              Vos informations de paiement sont sécurisées. Nous utilisons un cryptage SSL pour protéger vos données.
            </p>
          </div>
          
          {formErrors.general && (
            <div style={{ 
              padding: '12px 15px', 
              background: 'rgba(255, 0, 0, 0.1)', 
              borderRadius: '12px',
              border: '1px solid rgba(255, 0, 0, 0.2)',
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '13px', 
                color: 'rgba(255, 255, 255, 0.95)'
              }}>
                {formErrors.general}
              </p>
            </div>
          )}

          {paymentSuccess && (
            <div style={{ 
              padding: '15px', 
              background: 'rgba(0, 200, 83, 0.15)', 
              borderRadius: '12px',
              border: '1px solid rgba(0, 200, 83, 0.3)',
              marginTop: '10px',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-out'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(0, 200, 83, 0.2)',
                margin: '0 auto 10px',
                display: 'flex',
                alignItems: 'center', 
                justifyContent: 'center',
                animation: 'pulse 1.5s infinite'
              }}>
                <div style={{
                  width: '18px',
                  height: '9px',
                  borderBottom: '2px solid rgba(0, 200, 83, 0.8)',
                  borderRight: '2px solid rgba(0, 200, 83, 0.8)',
                  transform: 'rotate(45deg) translate(-1px, -4px)'
                }} />
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '15px', 
                fontWeight: 'bold',
                color: 'white'
              }}>
                Paiement effectué avec succès !
              </p>
              <p style={{ 
                margin: '5px 0 0', 
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                Un email de confirmation vous sera envoyé.
              </p>
            </div>
          )}
          
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <button 
              onClick={() => setShowPaymentModal(false)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(0, 0, 0, 0.2)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '500',
                flex: '1',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              Annuler
            </button>
            
            <button 
              onClick={handlePaymentSubmit}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(145deg, #FF6B00, #FF9248)',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)',
                flex: '1.5',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <FaRegCreditCard />
              Payer {paymentAmount}€
              <div style={{
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)',
                transform: 'translateX(-100%)',
                animation: 'shine 1.5s infinite'
              }} />
            </button>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '10px', 
            marginTop: '15px'
          }}>
            <FaCcVisa size={24} color="rgba(255, 255, 255, 0.8)" />
            <FaCcMastercard size={24} color="rgba(255, 255, 255, 0.8)" />
            <FaCcAmex size={24} color="rgba(255, 255, 255, 0.8)" />
            <FaCcApplePay size={24} color="rgba(255, 255, 255, 0.8)" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
