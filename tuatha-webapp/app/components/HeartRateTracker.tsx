'use client';

import React, { useState, useEffect } from 'react';
import { FaHeart, FaChevronDown, FaChevronUp, FaRunning, FaWalking, FaBed } from 'react-icons/fa';
import styles from './HeartRateTracker.module.css';

interface HeartRateDataPoint {
  time: string;
  rate: number;
  activity: 'rest' | 'light' | 'moderate' | 'intense';
}

interface HeartRateTrackerProps {
  dailyAverage?: number;
  restingRate?: number;
  maxRate?: number;
}

const HeartRateTracker: React.FC<HeartRateTrackerProps> = ({
  dailyAverage = 72,
  restingRate = 62,
  maxRate = 136
}) => {
  const [expanded, setExpanded] = useState(false);
  const [heartRateData, setHeartRateData] = useState<HeartRateDataPoint[]>([]);

  // Génère des données de fréquence cardiaque simulées
  useEffect(() => {
    const generateHeartRateData = () => {
      const data: HeartRateDataPoint[] = [];
      const now = new Date();
      
      // Générer des données pour les dernières 24 heures
      for (let i = 0; i < 24; i++) {
        const hour = (now.getHours() - 24 + i + 24) % 24;
        
        // Simulation de différentes activités selon l'heure
        let activity: 'rest' | 'light' | 'moderate' | 'intense' = 'rest';
        let baseRate = restingRate;
        
        if (hour >= 6 && hour < 8) {
          // Matin - exercice léger
          activity = 'light';
          baseRate = restingRate + 20;
        } else if (hour >= 12 && hour < 13) {
          // Midi - exercice modéré
          activity = 'moderate';
          baseRate = restingRate + 40;
        } else if (hour >= 18 && hour < 19) {
          // Soir - exercice intense
          activity = 'intense';
          baseRate = restingRate + 60;
        } else if (hour >= 22 || hour < 6) {
          // Nuit - repos
          activity = 'rest';
          baseRate = restingRate - 5;
        } else {
          // Autres heures - activité légère
          activity = 'light';
          baseRate = restingRate + 10;
        }
        
        // Ajouter un peu de variation aléatoire
        const rate = Math.round(baseRate + (Math.random() * 10 - 5));
        
        data.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          rate,
          activity
        });
      }
      
      return data;
    };
    
    setHeartRateData(generateHeartRateData());
  }, [restingRate]);

  const toggleExpand = () => {
    console.log("Toggling expanded state:", !expanded);
    setExpanded(!expanded);
  };

  // Calcul des zones de fréquence cardiaque
  const calculateZones = () => {
    const timeInZones = {
      rest: 0,
      light: 0,
      moderate: 0,
      intense: 0
    };

    heartRateData.forEach(point => {
      timeInZones[point.activity]++;
    });

    return timeInZones;
  };

  const zones = calculateZones();

  // Rendu du graphique
  const renderHeartRateGraph = () => {
    const maxHeight = 100; // hauteur maximale en pixels
    const maxRateInData = Math.max(...heartRateData.map(point => point.rate));
    
    return (
      <div className={styles.graphContainer}>
        {heartRateData.map((point, index) => {
          const height = (point.rate / maxRateInData) * maxHeight;
          let barColor = '';
          
          switch (point.activity) {
            case 'rest':
              barColor = styles.restBar;
              break;
            case 'light':
              barColor = styles.lightBar;
              break;
            case 'moderate':
              barColor = styles.moderateBar;
              break;
            case 'intense':
              barColor = styles.intenseBar;
              break;
          }
          
          return (
            <div key={index} className={styles.barContainer}>
              <div 
                className={`${styles.bar} ${barColor}`} 
                style={{ height: `${height}%` }}
                title={`${point.time} - ${point.rate} BPM`}
              ></div>
              {index % 3 === 0 && <span className={styles.timeLabel}>{point.time}</span>}
            </div>
          );
        })}
        
        <div className={styles.axisLabels}>
          <span>{maxRateInData} BPM</span>
          <span>{Math.floor(maxRateInData/2)} BPM</span>
          <span>{restingRate} BPM</span>
        </div>
      </div>
    );
  };

  // Rendu des statistiques de la journée
  const renderDailyStats = () => {
    return (
      <div className={styles.dailyStats}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FaHeart /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Moyenne</span>
            <span className={styles.statValue}>{dailyAverage} BPM</span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FaBed /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Au repos</span>
            <span className={styles.statValue}>{restingRate} BPM</span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statIcon}><FaRunning /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Maximum</span>
            <span className={styles.statValue}>{maxRate} BPM</span>
          </div>
        </div>
      </div>
    );
  };

  // Rendu des zones
  const renderZones = () => {
    const totalHours = Object.values(zones).reduce((a, b) => a + b, 0);
    
    // Descriptions des différentes zones de fréquence cardiaque
    const zoneDescriptions = {
      rest: "Repos & récupération",
      light: "Activité légère",
      moderate: "Activité modérée",
      intense: "Activité intense"
    };
    
    return (
      <div className={styles.zonesContainer}>
        <h4 className={styles.zonesTitle}>Temps par zone</h4>
        <div className={styles.zones}>
          <div className={styles.zone}>
            <div className={`${styles.zoneColor} ${styles.restZone}`}></div>
            <div className={styles.zoneInfo}>
              <div className={styles.zoneLeftInfo}>
                <span className={styles.zoneName}>
                  <FaBed /> Repos
                </span>
                <span className={styles.zoneDescription}>{zoneDescriptions.rest}</span>
                <div className={styles.zoneProgressContainer}>
                  <div 
                    className={`${styles.zoneProgress} ${styles.restProgress}`} 
                    style={{ width: `${Math.round((zones.rest / totalHours) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className={styles.zoneRightInfo}>
                <span className={styles.zoneTime}>{zones.rest} h</span>
                <span className={styles.zonePercent}>{Math.round((zones.rest / totalHours) * 100)}%</span>
              </div>
            </div>
          </div>
          
          <div className={styles.zone}>
            <div className={`${styles.zoneColor} ${styles.lightZone}`}></div>
            <div className={styles.zoneInfo}>
              <div className={styles.zoneLeftInfo}>
                <span className={styles.zoneName}>
                  <FaWalking /> Légère
                </span>
                <span className={styles.zoneDescription}>{zoneDescriptions.light}</span>
                <div className={styles.zoneProgressContainer}>
                  <div 
                    className={`${styles.zoneProgress} ${styles.lightProgress}`} 
                    style={{ width: `${Math.round((zones.light / totalHours) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className={styles.zoneRightInfo}>
                <span className={styles.zoneTime}>{zones.light} h</span>
                <span className={styles.zonePercent}>{Math.round((zones.light / totalHours) * 100)}%</span>
              </div>
            </div>
          </div>
          
          <div className={styles.zone}>
            <div className={`${styles.zoneColor} ${styles.moderateZone}`}></div>
            <div className={styles.zoneInfo}>
              <div className={styles.zoneLeftInfo}>
                <span className={styles.zoneName}>
                  Modérée
                </span>
                <span className={styles.zoneDescription}>{zoneDescriptions.moderate}</span>
                <div className={styles.zoneProgressContainer}>
                  <div 
                    className={`${styles.zoneProgress} ${styles.moderateProgress}`} 
                    style={{ width: `${Math.round((zones.moderate / totalHours) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className={styles.zoneRightInfo}>
                <span className={styles.zoneTime}>{zones.moderate} h</span>
                <span className={styles.zonePercent}>{Math.round((zones.moderate / totalHours) * 100)}%</span>
              </div>
            </div>
          </div>
          
          <div className={styles.zone}>
            <div className={`${styles.zoneColor} ${styles.intenseZone}`}></div>
            <div className={styles.zoneInfo}>
              <div className={styles.zoneLeftInfo}>
                <span className={styles.zoneName}>
                  <FaRunning /> Intense
                </span>
                <span className={styles.zoneDescription}>{zoneDescriptions.intense}</span>
                <div className={styles.zoneProgressContainer}>
                  <div 
                    className={`${styles.zoneProgress} ${styles.intenseProgress}`} 
                    style={{ width: `${Math.round((zones.intense / totalHours) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className={styles.zoneRightInfo}>
                <span className={styles.zoneTime}>{zones.intense} h</span>
                <span className={styles.zonePercent}>{Math.round((zones.intense / totalHours) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.heartRateTracker}>
      <div className={styles.header} onClick={toggleExpand}>
        <div className={styles.headerTitle}>
          <FaHeart className={styles.heartIcon} />
          <h3>Fréquence Cardiaque</h3>
        </div>
        
        <div className={styles.currentRate}>
          <span className={styles.rateValue}>{heartRateData.length > 0 ? heartRateData[heartRateData.length - 1].rate : dailyAverage}</span>
          <span className={styles.rateUnit}>BPM</span>
        </div>
        
        <button 
          className={styles.expandButton} 
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand();
          }}
        >
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      
      {expanded && (
        <div className={styles.contentExpanded}>
          {renderDailyStats()}
          {renderHeartRateGraph()}
          {renderZones()}
        </div>
      )}
    </div>
  );
};

export default HeartRateTracker;
