'use client';

import React, { useState } from 'react';
import { FaPlayCircle, FaExpand, FaVolumeMute, FaVolumeUp, FaTimes } from 'react-icons/fa';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
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

  const handleVideoClick = (video: Video) => {
    setActiveVideo(video);
  };

  const closeVideo = () => {
    setActiveVideo(null);
    setIsPlaying(false);
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
        marginBottom: '25px',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        {subtitle}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {videos.map((video) => (
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
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `url(${video.thumbnail}) no-repeat center center`,
              backgroundSize: 'cover',
              filter: 'brightness(0.7)'
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
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#FF6B00' 
            }}>
              {activeVideo.title}
            </h2>
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
