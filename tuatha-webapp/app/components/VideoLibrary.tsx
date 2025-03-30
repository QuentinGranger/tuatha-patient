'use client';

import React, { useState, useRef } from 'react';
import { FaPlayCircle, FaExpand, FaVolumeMute, FaVolumeUp, FaTimes, FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
}

interface VideoLibraryProps {
  videos: Video[];
  title?: string;
  subtitle?: string;
}

const VideoLibrary: React.FC<VideoLibraryProps> = ({ 
  videos, 
  title = "Bibliothèque vidéo", 
  subtitle = "Exercices et techniques recommandés" 
}) => {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleVideoClick = (video: Video) => {
    setActiveVideo(video);
  };

  const closeVideo = () => {
    setActiveVideo(null);
    setIsPlaying(false);
  };

  // Extraire les catégories uniques des vidéos
  const categories = ['all', ...Array.from(new Set(videos.map(video => video.category)))];
  
  // Filtrer les vidéos en fonction de la catégorie sélectionnée
  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  // Fonction pour faire défiler horizontalement
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300; // Pixels to scroll
      
      if (direction === 'left') {
        current.scrollLeft -= scrollAmount;
      } else {
        current.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <div style={{
      width: '100%',
      background: 'rgba(0, 38, 65, 0.35)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      color: 'white',
      padding: '25px'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: '#FF6B00',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: '0.95rem',
        marginBottom: '20px',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        {subtitle}
      </p>

      {/* Filtres de catégories */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.9rem',
          marginRight: '5px'
        }}>
          <FaFilter size={14} />
          <span>Filtrer:</span>
        </div>
        
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              background: selectedCategory === category 
                ? 'linear-gradient(145deg, #FF6B00, #FF9248)' 
                : 'rgba(0, 17, 13, 0.4)',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '0.85rem',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: selectedCategory === category ? 'bold' : 'normal',
              boxShadow: selectedCategory === category 
                ? '0 4px 10px rgba(255, 107, 0, 0.3)' 
                : 'none'
            }}
          >
            {category === 'all' ? 'Tous' : category}
          </button>
        ))}
      </div>

      {/* Contrôles de défilement */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <button
          onClick={() => scroll('left')}
          style={{
            background: 'rgba(0, 17, 13, 0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          <FaChevronLeft />
        </button>
        <span style={{ 
          fontSize: '0.9rem', 
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          {filteredVideos.length} vidéo{filteredVideos.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => scroll('right')}
          style={{
            background: 'rgba(0, 17, 13, 0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          <FaChevronRight />
        </button>
      </div>

      <div 
        ref={scrollContainerRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '20px',
          marginBottom: '20px',
          padding: '5px 0',
          scrollBehavior: 'smooth',
          msOverflowStyle: 'none', // IE and Edge
          scrollbarWidth: 'none', // Firefox
          WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
          position: 'relative'
        }}
      >
        <style jsx global>{`
          div[data-video-scroller] {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          div[data-video-scroller]::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {filteredVideos.map((video) => (
          <div 
            key={video.id} 
            onClick={() => handleVideoClick(video)}
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              background: 'rgba(0, 17, 13, 0.5)',
              aspectRatio: '16/9',
              minWidth: '280px',
              maxWidth: '280px',
              flex: '0 0 auto'
            }}
            data-category={video.category}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 17, 13, 0.7)',
              backgroundSize: 'cover',
            }} />
            
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '15px',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 70%)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>{video.title}</h3>
                  
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'rgba(255, 107, 0, 0.3)',
                    borderRadius: '10px',
                    padding: '2px 8px',
                    marginTop: '5px'
                  }}>
                    {video.category}
                  </span>
                </div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF6B00',
                  fontSize: '2rem',
                  transition: 'transform 0.2s ease'
                }}>
                  <FaPlayCircle />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour la vidéo active */}
      {activeVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 17, 13, 0.9)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '20px'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
          }}>
            <video
              src={activeVideo.url}
              style={{ width: '100%', borderRadius: '15px' }}
              controls
              autoPlay={isPlaying}
              muted={isMuted}
            />
            
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              display: 'flex',
              gap: '10px'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const video = document.querySelector('video');
                  if (video) {
                    if (video.requestFullscreen) {
                      video.requestFullscreen();
                    }
                  }
                }}
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <FaExpand />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeVideo();
                }}
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <FaTimes />
              </button>
            </div>
          </div>
          
          <div style={{
            marginTop: '20px',
            width: '100%',
            maxWidth: '900px',
            color: 'white',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: 'bold',
                margin: 0,
                color: '#FF6B00' 
              }}>
                {activeVideo.title}
              </h2>
              <span style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(255, 107, 0, 0.3)',
                borderRadius: '10px',
                padding: '4px 10px'
              }}>
                {activeVideo.category}
              </span>
            </div>
            <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
              {activeVideo.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLibrary;
