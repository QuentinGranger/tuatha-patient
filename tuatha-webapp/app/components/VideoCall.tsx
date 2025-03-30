'use client';

import { useState, useEffect, useRef } from 'react';
import { IoMicOutline, IoMicOffOutline, IoVideocamOutline, IoVideocamOffOutline, IoCameraReverse } from 'react-icons/io5';
import { MdCallEnd, MdFilterVintage, MdOutlineScreenShare } from 'react-icons/md';
import { FaRegSmile } from 'react-icons/fa';
import styles from './VideoCall.module.css';

// Types
export type VideoCallStatus = 'idle' | 'connecting' | 'calling' | 'ongoing' | 'reconnecting' | 'ended';
export type VideoEffect = 'none' | 'blur' | 'vintage' | 'bw';

export type Professional = {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
};

// Mapping des vidéos par professionnel
// Basé sur l'analyse du code dans page.tsx
const VIDEO_MAPPING: Record<number, string> = {
  1: '/img/video/JessicaJonesVideoCall.mp4',    // Jessica Jones (Nutritionniste)
  2: '/img/video/BeverlyCrusheVideoCall.mp4',   // Dr. Beverly Crusher (Médecin du sport)
  3: '/img/video/RockyBalboaVideoCall.mp4',     // Rocky Balboa (Kiné)
  4: '/img/video/TonyStarkVideoCall.mp4',       // Tony Stark (Coach)
  // Vidéo par défaut
  0: '/img/video/TonyStarkVideoCall.mp4'
};

interface VideoCallProps {
  status: VideoCallStatus;
  professional: Professional | null;
  onEndCall: () => void;
  userImage?: string; // Rendu optionnel car nous utiliserons la webcam
}

export default function VideoCall({ status, professional, onEndCall, userImage }: VideoCallProps) {
  // États de l'interface
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [currentEffect, setCurrentEffect] = useState<VideoEffect>('none');
  const [showEffects, setShowEffects] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [usePrerecordedVideo, setUsePrerecordedVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isRinging, setIsRinging] = useState(false);
  
  // Références
  const videoModalRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const userVideoStreamRef = useRef<MediaStream | null>(null);
  const prerecordedVideoRef = useRef<HTMLVideoElement>(null);
  
  // Tableau d'emojis disponibles
  const availableEmojis = ['👍', '❤️', '😂', '👏', '🎉', '🙌', '🤩', '😮'];
  
  // Sélectionner la vidéo correspondant au professionnel
  useEffect(() => {
    if (professional && professional.id) {
      const videoPath = VIDEO_MAPPING[professional.id] || VIDEO_MAPPING[0];
      setSelectedVideo(videoPath);
      console.log(`Sélection de la vidéo pour ${professional.name} (ID: ${professional.id}):`, videoPath);
    }
  }, [professional]);

  // Animation de décrochage et passage à la vidéo préenregistrée
  useEffect(() => {
    if (status === 'calling') {
      // Déclencher l'animation de sonnerie
      setIsRinging(true);
      
      // Délai aléatoire entre 1 et 5 secondes avant de décrocher
      const randomDelay = 1000 + Math.random() * 4000;
      const timeoutId = setTimeout(() => {
        // Passer à la vidéo préenregistrée
        setUsePrerecordedVideo(true);
        setIsRinging(false);
        // Continuer avec la séquence de connexion
        onConnectionChange('connecting');
        
        // Attendre 0.5 seconde de plus avant de passer à l'état "ongoing"
        setTimeout(() => {
          onConnectionChange('ongoing');
          
          // Lancer la vidéo préenregistrée et baisser le volume
          if (prerecordedVideoRef.current && selectedVideo) {
            prerecordedVideoRef.current.src = selectedVideo;
            prerecordedVideoRef.current.volume = 0.3; // Réduire le volume à 30%
            prerecordedVideoRef.current.play().catch(err => {
              console.error("Erreur lors de la lecture de la vidéo:", err);
            });
          }
        }, 500);
      }, randomDelay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [status, selectedVideo]);

  // Simplifier l'initialisation de la caméra de l'utilisateur
  useEffect(() => {
    // Fonction pour démarrer la caméra de l'utilisateur
    const startUserCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("Le navigateur ne prend pas en charge l'API getUserMedia");
          setCameraPermission('denied');
          return;
        }

        // Arrêter tout flux vidéo précédent
        if (userVideoStreamRef.current) {
          userVideoStreamRef.current.getTracks().forEach(track => track.stop());
        }

        // Démarrer un nouveau flux vidéo avec des contraintes simples
        const constraints = { 
          video: true,
          audio: false
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        userVideoStreamRef.current = stream;
        
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        
        setCameraPermission('granted');
      } catch (err) {
        console.error("Erreur lors de l'accès à la caméra:", err);
        setCameraPermission('denied');
      }
    };

    // Ne pas essayer d'activer la caméra si on utilise une vidéo préenregistrée
    if (status !== 'idle' && isVideoEnabled && !usePrerecordedVideo) {
      startUserCamera();
    } else if (usePrerecordedVideo && userVideoStreamRef.current) {
      // Arrêter la webcam si on passe en mode vidéo préenregistrée
      userVideoStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Nettoyage lors du démontage du composant
    return () => {
      if (userVideoStreamRef.current) {
        userVideoStreamRef.current.getTracks().forEach(track => track.stop());
        userVideoStreamRef.current = null;
      }
    };
  }, [status, isVideoEnabled, usePrerecordedVideo]);

  // Effet pour couper/réactiver le micro et la vidéo
  useEffect(() => {
    if (userVideoStreamRef.current) {
      userVideoStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
      
      userVideoStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoEnabled;
      });
    }
  }, [isMuted, isVideoEnabled]);
  
  // Effet pour simuler la qualité du réseau
  useEffect(() => {
    if (status === 'ongoing') {
      const interval = setInterval(() => {
        // Simuler des fluctuations de qualité réseau
        
        // Simuler une déconnexion occasionnelle
        if (Math.random() < 0.03) { // 3% de chance de déconnexion
          onConnectionChange('reconnecting');
          
          // Reconnecter après 2-3 secondes
          setTimeout(() => {
            onConnectionChange('ongoing');
          }, 2000 + Math.random() * 1000);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [status]);
  
  // Minuterie pour la durée d'appel
  useEffect(() => {
    // Utiliser une fonction explicite pour vérifier si la status permet de démarrer le chronomètre
    const shouldStartTimer = (currentStatus: VideoCallStatus): boolean => {
      return currentStatus === 'ongoing' || currentStatus === 'calling';
    };
    
    // Utiliser une fonction explicite pour vérifier si la status nécessite d'arrêter le chronomètre
    const shouldStopTimer = (currentStatus: VideoCallStatus): boolean => {
      return currentStatus !== 'ongoing' && currentStatus !== 'calling';
    };
    
    if (shouldStartTimer(status)) {
      // Démarrer le chronomètre
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else if (shouldStopTimer(status) && callTimerRef.current) {
      // Arrêter le chronomètre si l'appel n'est plus en cours
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    
    // Nettoyage lors du démontage
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    };
  }, [status]);
  
  // Détection de clic en dehors du modal (seulement en phase d'appel)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        status === 'calling' &&
        videoModalRef.current &&
        !videoModalRef.current.contains(event.target as Node)
      ) {
        onEndCall();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [status, onEndCall]);
  
  // Reset de l'emoji au bout de 3 secondes
  useEffect(() => {
    if (selectedEmoji) {
      const timeout = setTimeout(() => {
        setSelectedEmoji(null);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [selectedEmoji]);

  // Fonction pour obtenir le filtre vidéo en fonction de l'effet sélectionné
  const getVideoFilter = () => {
    switch (currentEffect) {
      case 'blur':
        return 'blur(3px)';
      case 'vintage':
        return 'sepia(0.7) hue-rotate(-20deg) saturate(1.5)';
      case 'bw':
        return 'grayscale(1)';
      default:
        return 'none';
    }
  };

  // Fonction pour formater la durée de l'appel (mm:ss)
  const formatCallDuration = () => {
    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Gestion des changements d'état de connexion
  const onConnectionChange = (newStatus: VideoCallStatus) => {
    // Simuler un changement d'état sans modifier directement props.status
    // (Ce serait normalement géré par le composant parent)
    if (newStatus !== status) {
      console.log(`État de la connexion changé: ${status} -> ${newStatus}`);
      
      if (newStatus === 'ongoing' && (status === 'calling' || status === 'connecting')) {
        setCallDuration(0); // Réinitialiser le chrono au début de l'appel
      }
      
      // Si la nouvelle status est "ended", appeler onEndCall
      if (newStatus === 'ended') {
        onEndCall();
      }
    }
  };

  // Actions de l'interface
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // Pas besoin d'arrêter ou de redémarrer la vidéo préenregistrée
    // Cela garantit que l'audio continue de jouer
  };
  
  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };
  
  const toggleEffectsMenu = () => {
    setShowEffects(!showEffects);
    if (showEmojis) setShowEmojis(false);
  };
  
  const toggleEmojisMenu = () => {
    setShowEmojis(!showEmojis);
    if (showEffects) setShowEffects(false);
  };
  
  const applyEffect = (effect: VideoEffect) => {
    setCurrentEffect(effect);
    setShowEffects(false);
  };
  
  const sendEmoji = (emoji: string) => {
    setSelectedEmoji(emoji);
    setShowEmojis(false);
  };

  // Ne rien rendre si pas d'appel ou de professionnel
  if (status === 'idle' || !professional) {
    return null;
  }

  // Afficher le bon statut
  const getStatusMessage = () => {
    switch (status) {
      case 'connecting':
        return 'Connexion en cours...';
      case 'calling':
        return isRinging ? 'Sonnerie...' : 'Appel en cours...';
      case 'ongoing':
        return formatCallDuration();
      case 'reconnecting':
        return 'Reconnexion...';
      case 'ended':
        return 'Appel terminé';
      default:
        return '';
    }
  };
  
  // Déterminer la classe CSS pour l'effet vidéo
  const getVideoEffectClass = () => {
    switch (currentEffect) {
      case 'blur':
        return styles.blurEffect;
      case 'vintage':
        return styles.vintageEffect;
      case 'bw':
        return styles.bwEffect;
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.videoCallOverlay} ${styles[status]} ${isRinging ? styles.ringing : ''}`}>
      <div className={styles.videoCallContainer} ref={videoModalRef}>
        <div className={styles.videoScreens}>
          {/* Vidéo du professionnel (plein écran) */}
          <div className={styles.proVideoContainer}>
            {status === 'calling' && !usePrerecordedVideo && professional?.image ? (
              // Affichage de la photo en plein écran pendant la sonnerie
              <div className={styles.proVideoFallback}>
                <img 
                  src={professional.image} 
                  alt={professional.name} 
                  className={styles.callingProfileImage}
                />
              </div>
            ) : usePrerecordedVideo && selectedVideo ? (
              // Affichage de la vidéo préenregistrée
              <video 
                ref={prerecordedVideoRef}
                className={styles.proVideo}
                muted={isMuted}
                loop
                playsInline
                style={{
                  filter: getVideoFilter()
                }}
              />
            ) : (
              // Fallback pour les autres cas
              <div 
                className={styles.proVideoFallback}
                style={{
                  backgroundImage: `url(${professional?.image || ''})`,
                  filter: getVideoFilter()
                }}
              />
            )}
            
            {/* Indicateur de statut */}
            {(status === 'connecting' || status === 'calling' || status === 'reconnecting') && (
              <div className={styles.statusIndicator}>
                {getStatusMessage()}
              </div>
            )}
            
            {/* Emoji flottant */}
            {selectedEmoji && (
              <div className={styles.floatingEmoji}>
                {selectedEmoji}
              </div>
            )}
            
            {/* Info du professionnel */}
            <div className={styles.proInfo}>
              <span>{professional?.name || 'Professionnel'}</span>
              {status === 'ongoing' && (
                <span className={styles.callTime}>{formatCallDuration()}</span>
              )}
            </div>
          </div>
          
          {/* Vidéo de l'utilisateur (petite vignette) */}
          <div className={styles.userVideoContainer}>
            {cameraPermission === 'granted' ? (
              <video 
                ref={userVideoRef}
                className={styles.userVideo}
                muted
                playsInline
              />
            ) : (
              <div 
                className={styles.userVideoFallback}
                style={{
                  backgroundImage: `url(${userImage || '/img/default-user.jpg'})`
                }}
              />
            )}
          </div>
        </div>
        
        {/* Interface des effets vidéo */}
        {showEffects && (
          <div className={styles.effectsMenu}>
            <button 
              className={`${styles.effectOption} ${currentEffect === 'none' ? styles.active : ''}`}
              onClick={() => setCurrentEffect('none')}
            >
              Normal
            </button>
            <button 
              className={`${styles.effectOption} ${currentEffect === 'blur' ? styles.active : ''}`}
              onClick={() => setCurrentEffect('blur')}
            >
              Flou
            </button>
            <button 
              className={`${styles.effectOption} ${currentEffect === 'vintage' ? styles.active : ''}`}
              onClick={() => setCurrentEffect('vintage')}
            >
              Vintage
            </button>
            <button 
              className={`${styles.effectOption} ${currentEffect === 'bw' ? styles.active : ''}`}
              onClick={() => setCurrentEffect('bw')}
            >
              Noir & Blanc
            </button>
          </div>
        )}
        
        {/* Interface des emojis */}
        {showEmojis && (
          <div className={styles.emojisMenu}>
            {availableEmojis.map((emoji, index) => (
              <button 
                key={index}
                className={styles.emojiOption}
                onClick={() => sendEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        
        {/* Contrôles d'appel */}
        <div className={styles.controls}>
          <div className={styles.mainControls}>
            <button 
              className={`${styles.controlButton} ${isMuted ? styles.disabled : ''}`}
              onClick={toggleMute}
            >
              {isMuted ? 
                <IoMicOffOutline size={24} /> : 
                <IoMicOutline size={24} />
              }
            </button>
            
            <button 
              className={styles.endCallButton}
              onClick={onEndCall}
            >
              <MdCallEnd size={24} />
            </button>
            
            <button 
              className={`${styles.controlButton} ${!isVideoEnabled ? styles.disabled : ''}`}
              onClick={toggleVideo}
            >
              {isVideoEnabled ? 
                <IoVideocamOutline size={24} /> : 
                <IoVideocamOffOutline size={24} />
              }
            </button>
          </div>
          
          {/* Contrôles secondaires uniquement visibles en appel actif */}
          {status === 'ongoing' && (
            <div className={styles.secondaryControls}>
              <button 
                className={styles.secondaryButton}
                onClick={toggleCamera}
              >
                <IoCameraReverse size={20} />
                <span>Caméra</span>
              </button>
              
              <button 
                className={`${styles.secondaryButton} ${showEffects ? styles.active : ''}`}
                onClick={toggleEffectsMenu}
              >
                <MdFilterVintage size={20} />
                <span>Effets</span>
              </button>
              
              <button 
                className={`${styles.secondaryButton} ${showEmojis ? styles.active : ''}`}
                onClick={toggleEmojisMenu}
              >
                <FaRegSmile size={20} />
                <span>Emojis</span>
              </button>
              
              <button className={styles.secondaryButton}>
                <MdOutlineScreenShare size={20} />
                <span>Partager</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
