'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './VideoShare.module.css';
import { 
  FaShare, 
  FaInstagram, 
  FaWhatsapp, 
  FaEnvelope, 
  FaDownload, 
  FaUserFriends, 
  FaCalendarPlus, 
  FaClipboard,
  FaTrash,
  FaPen,
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeMute,
  FaBackward,
  FaForward,
  FaShareAlt,
  FaTwitter
} from 'react-icons/fa';
import SessionDebrief from './SessionDebrief';
import Portal from './Portal';

type VideoShareProps = {
  videos?: VideoItem[];
  onClose?: () => void;
  athleteName?: string;
  athleteId?: string;
};

type VideoItem = {
  id: string;
  url: string;
  title: string;
  date: string;
  exerciseName?: string;
  thumbnailUrl?: string;
  progress?: number;
  duration?: number;
  tags?: string[];
};

const VideoShare: React.FC<VideoShareProps> = ({ videos = [], onClose, athleteName, athleteId }) => {
  const [videoList, setVideoList] = useState<VideoItem[]>(videos);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(videos.length > 0 ? videos[0] : null);
  const [shareMenuOpen, setShareMenuOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [notification, setNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({});
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isVerticalVideo, setIsVerticalVideo] = useState(false);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [showDebrief, setShowDebrief] = useState(false);

  // Pour le suivi des miniatures
  const processedVideosRef = useRef<Set<string>>(new Set());
  const isMountedRef = useRef(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fonction pour afficher une notification
  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  // Données d'exemple pour démontrer l'interface
  const exampleVideos: VideoItem[] = [
    {
      id: '1',
      url: '/img/video/sport/video1.mp4',
      title: 'Squat - Performance',
      date: '2025-03-28',
      exerciseName: 'Squat',
      thumbnailUrl: '/img/video/sport/video1.mp4',
      duration: 15,
      tags: ['Jambes', 'Force']
    },
    {
      id: '2',
      url: '/img/video/sport/video2.mp4',
      title: 'Deadlift - Technique',
      date: '2025-03-27',
      exerciseName: 'Deadlift',
      thumbnailUrl: '/img/video/sport/video2.mp4',
      duration: 22,
      tags: ['Dos', 'Technique']
    },
    {
      id: '3',
      url: '/img/video/sport/video3.mp4',
      title: 'Bench Press - PR',
      date: '2025-03-26',
      exerciseName: 'Bench Press',
      thumbnailUrl: '/img/video/sport/video3.mp4',
      duration: 18,
      tags: ['Poitrine', 'Record']
    }
  ];

  const videoListData = videos.length > 0 ? videos : exampleVideos;

  // Fonction pour extraire une miniature (isolée du cycle de rendu)
  const extractThumbnail = (videoUrl: string, videoId: string) => {
    // Si cette vidéo a déjà été traitée, ignorer
    if (processedVideosRef.current.has(videoId)) return;
    
    // Marquer comme traitée
    processedVideosRef.current.add(videoId);
    
    // Utiliser une approche qui ne bloque pas le rendu
    const videoElement = document.createElement('video');
    videoElement.crossOrigin = 'anonymous';
    videoElement.muted = true;
    videoElement.src = videoUrl;
    
    // Gérer les événements
    videoElement.onloadeddata = () => {
      if (!isMountedRef.current) return;
      
      try {
        // Accéder à la première frame
        videoElement.currentTime = 0.1;
      } catch (err) {
        console.error("Erreur lors du réglage du temps:", err);
      }
    };
    
    videoElement.onseeked = () => {
      if (!isMountedRef.current) return;
      
      try {
        // Créer un canvas pour capturer l'image
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(videoElement.videoWidth, 160);
        canvas.height = Math.max(videoElement.videoHeight, 90);
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Dessiner la vidéo sur le canvas
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          
          // Obtenir l'image
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          
          // Mettre à jour l'état SEULEMENT si l'image n'est pas vide
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          let hasContent = false;
          
          // Vérifier si l'image a du contenu (pas juste noir)
          for (let i = 0; i < imgData.length; i += 100) {
            if (imgData[i] > 10 || imgData[i+1] > 10 || imgData[i+2] > 10) {
              hasContent = true;
              break;
            }
          }
          
          if (hasContent && isMountedRef.current) {
            // Update seulement cette miniature spécifique
            setVideoThumbnails(prev => ({
              ...prev,
              [videoId]: thumbnail
            }));
          }
        }
      } catch (err) {
        console.error("Erreur d'extraction:", err);
      } finally {
        // Nettoyer
        videoElement.remove();
      }
    };
    
    // Gérer les erreurs
    videoElement.onerror = () => {
      videoElement.remove();
    };
    
    // Lancer le chargement
    videoElement.load();
  };

  // Initialiser les miniatures par défaut et démarrer l'extraction
  useEffect(() => {
    // Marquer comme monté
    isMountedRef.current = true;
    // Réinitialiser les vidéos traitées
    processedVideosRef.current.clear();
    
    // Initialiser avec des valeurs par défaut
    const initialThumbnails: Record<string, string> = {};
    
    videoListData.forEach((video) => {
      // Utiliser l'URL fournie ou l'image par défaut
      initialThumbnails[video.id] = video.thumbnailUrl || '/img/thumbnailDefault.png';
      
      // Démarrer l'extraction pour toutes les vidéos
      // Cette opération est asynchrone et met à jour l'état quand elle est prête
      if (video.url) {
        setTimeout(() => {
          if (isMountedRef.current) {
            extractThumbnail(video.url, video.id);
          }
        }, 500 * parseInt(video.id)); // Décaler chaque extraction pour éviter les conflits
      }
    });
    
    // Définir les valeurs initiales
    setVideoThumbnails(initialThumbnails);
    
    // Nettoyage
    return () => {
      isMountedRef.current = false;
    };
  }, [videos.length]); // Ne dépend que du nombre de vidéos

  useEffect(() => {
    startControlsTimer();

    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [videoListData]);

  // Fonction pour démarrer le timer de disparition des contrôles
  const startControlsTimer = () => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }

    if (!isPlaying) return;

    controlsTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  };

  // Gestionnaire pour les mouvements de souris/toucher sur la vidéo
  const handleVideoInteraction = () => {
    setControlsVisible(true);
    startControlsTimer();
  };

  // Effet pour gérer l'affichage des contrôles
  useEffect(() => {
    if (isPlaying) {
      startControlsTimer();
    } else {
      setControlsVisible(true);
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    }

    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [isPlaying]); 

  useEffect(() => {
    if (videoListData.length > 0 && !activeVideo) {
      setActiveVideo(videoListData[0]);
    }
  }, [videoListData, activeVideo]);

  useEffect(() => {
    if (videoRef.current && activeVideo) {
      videoRef.current.src = activeVideo.url;
      videoRef.current.load();
    }
  }, [activeVideo]);

  // Détecter si la vidéo est verticale ou horizontale
  const checkVideoOrientation = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      const vertical = videoHeight > videoWidth;
      setIsVerticalVideo(vertical);
    }
  };

  // Écouter les changements de métadonnées de la vidéo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleLoadedMetadata = () => {
        checkVideoOrientation();
        setDuration(videoElement.duration || 0);
      };
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [activeVideo]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        startControlsTimer();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(err => {
          console.error(`Erreur lors du passage en plein écran: ${err.message}`);
        });
      } else {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(err => {
          console.error(`Erreur lors de la sortie du plein écran: ${err.message}`);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current && !isNaN(newTime)) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleShare = (platform: string) => {
    switch (platform) {
      case 'instagram':
        showNotification('Préparation du partage vers Instagram...');
        break;
      case 'whatsapp':
        showNotification('Ouverture de WhatsApp...');
        break;
      case 'email':
        showNotification('Préparation d\'un e-mail...');
        break;
      case 'coach':
        showNotification('Vidéo partagée avec votre coach');
        break;
      case 'schedule':
        showNotification('Ajout à votre calendrier d\'entraînement');
        break;
      case 'clipboard':
        navigator.clipboard.writeText(`${window.location.origin}/shared-video/${activeVideo?.id}`);
        showNotification('Lien copié dans le presse-papier');
        break;
      case 'download':
        showNotification('Téléchargement de la vidéo...');
        break;
      default:
        break;
    }
    
    setShareMenuOpen(false);
  };

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current && !isNaN(newTime)) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleShareMenu = () => {
    const newState = !shareMenuOpen;
    setShareMenuOpen(newState);
    
    if (newState) {
      setControlsVisible(true);
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    } else {
      startControlsTimer();
    }
  };

  const handleEditVideo = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    const videoToEdit = videoListData.find(v => v.id === videoId);
    if (videoToEdit) {
      setEditingVideo({...videoToEdit}); 
      setShowEditModal(true);
    } else {
      showNotification(`Vidéo #${videoId} introuvable`);
    }
  };

  const handleDeleteVideo = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setVideoToDelete(videoId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteVideo = () => {
    if (videoToDelete) {
      const updatedList = videoListData.filter(v => v.id !== videoToDelete);
      setVideoList(updatedList);
      
      if (activeVideo && activeVideo.id === videoToDelete) {
        if (updatedList.length > 0) {
          setActiveVideo(updatedList[0]);
        } else {
          setActiveVideo(null);
        }
      }
      
      showNotification(`Vidéo supprimée avec succès`);
      
      setShowDeleteConfirm(false);
      setVideoToDelete(null);
    }
  };

  const cancelDeleteVideo = () => {
    setShowDeleteConfirm(false);
    setVideoToDelete(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingVideo) {
      setEditingVideo({
        ...editingVideo,
        [e.target.name]: e.target.value
      });
    }
  };

  const saveVideoEdit = () => {
    if (editingVideo) {
      const updatedList = videoListData.map(v => 
        v.id === editingVideo.id ? editingVideo : v
      );
      setVideoList(updatedList);
      
      if (activeVideo && activeVideo.id === editingVideo.id) {
        setActiveVideo(editingVideo);
      }
      
      showNotification(`Vidéo "${editingVideo.title}" mise à jour`);
      setShowEditModal(false);
      setEditingVideo(null);
    }
  };

  const cancelVideoEdit = () => {
    setShowEditModal(false);
    setEditingVideo(null);
  };

  const handleVideoEditClose = () => {
    setShowEditModal(false);
    setEditingVideo(null);
  };

  return (
    <div className={styles.videoShareContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Bibliothèque Vidéo</h1>
          {athleteName && athleteId && (
            <div className={styles.athleteInfo}>
              <span>Baby Groot</span>
              <span className={styles.athleteId}>{/* Easter egg des Gardiens de la Galaxie */}12:1:1</span>
            </div>
          )}
        </div>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.videoSection}>
          <div className={styles.mainVideo} ref={videoContainerRef}>
            {activeVideo ? (
              <>
                <div className={styles.videoPlayer}>
                  <video
                    ref={videoRef}
                    src={activeVideo.url}
                    poster={videoThumbnails[activeVideo.id] || activeVideo.thumbnailUrl}
                    controls={false}
                    id="videoPlayer"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => {
                      setIsPlaying(false);
                      setCurrentTime(0);
                    }}
                    onClick={handleVideoInteraction}
                    onMouseMove={handleVideoInteraction}
                    onTouchStart={handleVideoInteraction}
                  />
                  
                  {/* Contrôles overlay */}
                  <div className={`${styles.controlButtons} ${!controlsVisible ? styles.controlsHidden : ''}`}>
                    <button
                      className={styles.controlButton}
                      onClick={handleRewind}
                      title="Reculer de 10s"
                    >
                      <FaBackward />
                    </button>
                    <button
                      className={styles.controlButton}
                      onClick={togglePlay}
                      title={isPlaying ? "Pause" : "Lecture"}
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button
                      className={styles.controlButton}
                      onClick={handleForward}
                      title="Avancer de 10s"
                    >
                      <FaForward />
                    </button>
                    <div className={styles.shareWrapper}>
                      <button
                        className={`${styles.controlButton} ${styles.shareButton}`}
                        onClick={toggleShareMenu}
                        title="Partager"
                      >
                        <FaShareAlt />
                      </button>
                      {shareMenuOpen && (
                        <div className={styles.shareMenu}>
                          <button className={styles.shareOption} onClick={() => handleShare('instagram')}>
                            <FaInstagram /> Instagram
                          </button>
                          <button className={styles.shareOption} onClick={() => handleShare('whatsapp')}>
                            <FaWhatsapp /> WhatsApp
                          </button>
                          <button className={styles.shareOption} onClick={() => handleShare('email')}>
                            <FaEnvelope /> E-mail
                          </button>
                          <button className={styles.shareOption} onClick={() => handleShare('twitter')}>
                            <FaTwitter /> Twitter
                          </button>
                          <button className={styles.shareOption} onClick={() => handleShare('download')}>
                            <FaDownload /> Télécharger
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Barre de progression en bas */}
                  <div className={`${styles.videoControls} ${!controlsVisible ? styles.controlsHidden : ''}`}>
                    <div className={styles.timelineContainer}>
                      <input
                        type="range"
                        className={styles.timeline}
                        min="0"
                        max={duration || 100}
                        value={currentTime || 0}
                        onChange={handleTimelineChange}
                      />
                      <div className={styles.timeIndicators}>
                        <span>{formatTime(currentTime || 0)}</span>
                        <span>{formatTime(duration || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Informations de la vidéo */}
                <div className={styles.videoInfo}>
                  <h2>{activeVideo.title || "Squat - Performance"}</h2>
                  <div className={styles.videoMeta}>
                    <span>{activeVideo.exerciseName || "Squat"}</span>
                    <span>{new Date(activeVideo.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.noVideoSelected}>
                <p>Sélectionnez une vidéo pour la visualiser</p>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.videoLibrary}>
          <h2>Mes vidéos</h2>
          <div className={styles.videoList}>
            {videoListData.map(video => (
              <div 
                key={video.id}
                className={`${styles.videoItem} ${activeVideo?.id === video.id ? styles.activeVideo : ''}`}
                onClick={() => setActiveVideo(video)}
              >
                <div className={styles.videoThumbnail}>
                  <img 
                    src={videoThumbnails[video.id] || video.thumbnailUrl || '/img/thumbnailDefault.png'} 
                    alt={video.title} 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/img/thumbnailDefault.png';
                    }}
                  />
                  <span className={styles.videoDuration}>{formatTime(video.duration || 0)}</span>
                  
                  <div className={styles.videoItemActions}>
                    <button 
                      className={styles.videoItemAction}
                      title="Modifier cette vidéo"
                      onClick={(e) => handleEditVideo(video.id, e)}
                      aria-label="Modifier cette vidéo"
                    >
                      <FaPen />
                    </button>
                    <button 
                      className={styles.videoItemAction}
                      title="Supprimer cette vidéo"
                      onClick={(e) => handleDeleteVideo(video.id, e)}
                      aria-label="Supprimer cette vidéo"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className={styles.videoItemInfo}>
                  <h3>{video.title}</h3>
                  <p>{new Date(video.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section de débrief de séance */}
        <div className={styles.debriefSection}>
          <h2>Débrief et Ressenti</h2>
          <p>Comment s'est passée votre séance aujourd'hui?</p>
          <button 
            className={styles.debriefButton}
            onClick={() => setShowDebrief(true)}
          >
            Compléter mon débrief
          </button>
        </div>
      </div>

      {notification.show && (
        <div className={styles.notification}>
          {notification.message}
        </div>
      )}

      {/* Confirmation de suppression */}
      {showDeleteConfirm && (
        <div className={styles.deleteConfirmOverlay}>
          <div className={styles.deleteConfirmDialog}>
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer cette vidéo ?</p>
            <div className={styles.deleteConfirmButtons}>
              <button onClick={cancelDeleteVideo} className={styles.cancelButton}>Annuler</button>
              <button onClick={confirmDeleteVideo} className={styles.confirmButton}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && editingVideo && (
        <div className={styles.editModalOverlay}>
          <div className={styles.editModalDialog}>
            <h3>Modifier la vidéo</h3>
            <div className={styles.editForm}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Titre</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={editingVideo.title} 
                  onChange={handleEditChange}
                  className={styles.editInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={editingVideo.description} 
                  onChange={handleEditChange}
                  className={styles.editTextarea}
                  rows={4}
                />
              </div>
              <div className={styles.editFormButtons}>
                <button onClick={cancelVideoEdit} className={styles.cancelButton}>Annuler</button>
                <button onClick={saveVideoEdit} className={styles.confirmButton}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Composant de débrief */}
      {showDebrief && (
        <Portal selector="video-debrief-portal">
          <div className={styles.modalOverlay}>
            <div className={styles.debriefModal}>
              <SessionDebrief 
                sessionId={activeVideo?.id} 
                athleteName={athleteName || "Baby Groot"}
                onClose={() => setShowDebrief(false)}
                onSave={(data) => {
                  showNotification("Débrief enregistré avec succès");
                  setShowDebrief(false);
                }}
              />
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default VideoShare;
