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
  FaVolumeMute
} from 'react-icons/fa';

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
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [shareMenuOpen, setShareMenuOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [notification, setNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Fonction pour afficher une notification
  const showNotificationMessage = (message: string) => {
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

  const videoList = videos.length > 0 ? videos : exampleVideos;

  useEffect(() => {
    if (videoList.length > 0 && !activeVideo) {
      setActiveVideo(videoList[0]);
    }
  }, [videoList, activeVideo]);

  useEffect(() => {
    if (videoRef.current && activeVideo) {
      videoRef.current.src = activeVideo.url;
      videoRef.current.load();
    }
  }, [activeVideo]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleShare = (platform: string) => {
    // Logique à implémenter pour chaque plateforme
    switch (platform) {
      case 'instagram':
        showNotificationMessage('Préparation du partage vers Instagram...');
        // Intégration API Instagram à implémenter
        break;
      case 'whatsapp':
        showNotificationMessage('Ouverture de WhatsApp...');
        // Construire l'URL WhatsApp avec le lien vidéo
        break;
      case 'email':
        showNotificationMessage('Préparation d\'un e-mail...');
        // Préparer un template d'email avec lien vidéo
        break;
      case 'coach':
        showNotificationMessage('Vidéo partagée avec votre coach');
        // Logique d'envoi au coach dans le système
        break;
      case 'schedule':
        showNotificationMessage('Ajout à votre calendrier d\'entraînement');
        // Intégration avec le planificateur d'entraînement
        break;
      case 'clipboard':
        navigator.clipboard.writeText(`${window.location.origin}/shared-video/${activeVideo?.id}`);
        showNotificationMessage('Lien copié dans le presse-papier');
        break;
      case 'download':
        showNotificationMessage('Téléchargement de la vidéo...');
        // Logique de téléchargement
        break;
      default:
        break;
    }
    
    setShareMenuOpen(false);
  };

  return (
    <div className={styles.videoShareContainer}>
      <div className={styles.header}>
        <h1>Bibliothèque Vidéo</h1>
        {athleteName && athleteId && (
          <div className={styles.athleteInfo}>
            <span>{athleteName}</span>
            <span className={styles.athleteId}>{athleteId}</span>
          </div>
        )}
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
                <video 
                  ref={videoRef}
                  className={styles.videoPlayer}
                  poster={activeVideo.thumbnailUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onClick={togglePlay}
                >
                  <source src={activeVideo.url} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
                
                <div className={styles.videoControls}>
                  <div className={styles.timelineContainer}>
                    <input 
                      type="range"
                      className={styles.timeline}
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                    />
                    <div className={styles.timeIndicators}>
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  <div className={styles.controlButtons}>
                    <button className={styles.controlButton} onClick={togglePlay}>
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    
                    <button className={styles.controlButton} onClick={toggleMute}>
                      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                    
                    <button className={styles.controlButton} onClick={toggleFullscreen}>
                      {isFullscreen ? <FaCompress /> : <FaExpand />}
                    </button>
                    
                    <div className={styles.shareWrapper}>
                      <button 
                        className={`${styles.controlButton} ${styles.shareButton}`}
                        onClick={() => setShareMenuOpen(!shareMenuOpen)}
                      >
                        <FaShare />
                      </button>
                      
                      {shareMenuOpen && (
                        <div className={styles.shareMenu}>
                          <button onClick={() => handleShare('instagram')} className={styles.shareOption}>
                            <FaInstagram /> Instagram
                          </button>
                          <button onClick={() => handleShare('whatsapp')} className={styles.shareOption}>
                            <FaWhatsapp /> WhatsApp
                          </button>
                          <button onClick={() => handleShare('email')} className={styles.shareOption}>
                            <FaEnvelope /> Email
                          </button>
                          <button onClick={() => handleShare('coach')} className={styles.shareOption}>
                            <FaUserFriends /> Coach
                          </button>
                          <button onClick={() => handleShare('schedule')} className={styles.shareOption}>
                            <FaCalendarPlus /> Ajouter au programme
                          </button>
                          <button onClick={() => handleShare('clipboard')} className={styles.shareOption}>
                            <FaClipboard /> Copier le lien
                          </button>
                          <button onClick={() => handleShare('download')} className={styles.shareOption}>
                            <FaDownload /> Télécharger
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={styles.videoInfo}>
                  <h2>{activeVideo.title}</h2>
                  <div className={styles.videoMeta}>
                    <span>{activeVideo.exerciseName}</span>
                    <span>{new Date(activeVideo.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {activeVideo.tags && (
                    <div className={styles.videoTags}>
                      {activeVideo.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  )}
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
            {videoList.map((video) => (
              <div 
                key={video.id}
                className={`${styles.videoItem} ${activeVideo?.id === video.id ? styles.activeVideo : ''}`}
                onClick={() => setActiveVideo(video)}
              >
                <div className={styles.videoThumbnail}>
                  <img 
                    src={video.thumbnailUrl || '/img/video/default-thumbnail.jpg'} 
                    alt={video.title} 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/img/video/default-thumbnail.jpg';
                    }}
                  />
                  <span className={styles.videoDuration}>{formatTime(video.duration || 0)}</span>
                </div>
                <div className={styles.videoItemInfo}>
                  <h3>{video.title}</h3>
                  <p>{new Date(video.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className={styles.videoItemActions}>
                  <button className={styles.videoItemAction} title="Modifier">
                    <FaPen />
                  </button>
                  <button className={styles.videoItemAction} title="Supprimer">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {notification.show && (
        <div className={styles.notification}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default VideoShare;
