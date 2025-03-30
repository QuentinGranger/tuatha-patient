import React, { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Types de données pour les graphiques
interface ChartDataPoint {
  date: string;
  value: number;
}

interface ProgressData {
  weight: ChartDataPoint[];
  waistSize: ChartDataPoint[];
  hydration: ChartDataPoint[];
  bodyFat: ChartDataPoint[];
}

interface ProgressSliderProps {
  data: ProgressData;
}

const ProgressSlider: React.FC<ProgressSliderProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Définition des graphiques disponibles
  const charts = [
    { id: 'weight', title: 'Évolution du poids', unit: 'kg', data: data.weight },
    { id: 'waistSize', title: 'Tour de taille', unit: 'cm', data: data.waistSize },
    { id: 'hydration', title: 'Hydratation', unit: '%', data: data.hydration },
    { id: 'bodyFat', title: 'Masse grasse', unit: '%', data: data.bodyFat }
  ];
  
  // Fonction pour passer au graphique suivant
  const nextChart = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % charts.length);
  };
  
  // Fonction pour passer au graphique précédent
  const prevChart = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + charts.length) % charts.length);
  };
  
  // Gestionnaire d'événements de swipe
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe gauche
        nextChart();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe droite
        prevChart();
      }
    };
    
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('touchstart', handleTouchStart);
      sliderElement.addEventListener('touchmove', handleTouchMove);
      sliderElement.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        sliderElement.removeEventListener('touchstart', handleTouchStart);
        sliderElement.removeEventListener('touchmove', handleTouchMove);
        sliderElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, []);
  
  // Construction des données pour le graphique actif
  const activeChart = charts[activeIndex];
  
  // Configuration du graphique
  const chartData = {
    labels: activeChart.data.map(point => {
      // Formatage de la date pour l'affichage (ex: "10 Mars")
      const date = new Date(point.date);
      return `${date.getDate()} ${date.toLocaleString('fr-FR', { month: 'short' })}`;
    }),
    datasets: [
      {
        label: activeChart.title,
        data: activeChart.data.map(point => point.value),
        borderColor: '#FF6B00',
        backgroundColor: 'rgba(255, 107, 0, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#FF6B00',
        pointBorderColor: 'rgba(255, 255, 255, 0.8)',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };
  
  // Options du graphique
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 38, 65, 0.9)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            return `${context.parsed.y} ${activeChart.unit}`;
          }
        }
      }
    }
  };
  
  // Calculer la tendance
  const calculateTrend = () => {
    const values = activeChart.data.map(point => point.value);
    if (values.length < 2) return { direction: 'stable', percentage: 0 };
    
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const difference = lastValue - firstValue;
    
    let direction = 'stable';
    if (difference > 0) direction = 'up';
    if (difference < 0) direction = 'down';
    
    const percentageChange = (difference / firstValue) * 100;
    
    return {
      direction,
      percentage: Math.abs(parseFloat(percentageChange.toFixed(1)))
    };
  };
  
  const trend = calculateTrend();
  
  return (
    <div style={{
      width: '100%',
      background: 'rgba(0, 38, 65, 0.35)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
      overflow: 'hidden',
      color: 'white',
      marginBottom: '25px'
    }}>
      {/* En-tête */}
      <div style={{
        padding: '15px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 17, 13, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#FF6B00'
          }}>
            {activeChart.title}
          </h3>
          <p style={{
            margin: '5px 0 0',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            Suivi sur {activeChart.data.length} points
          </p>
        </div>
        
        {/* Indicateur de tendance */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: trend.direction === 'up' ? '#F44336' : 
                  trend.direction === 'down' ? '#4CAF50' : 
                  'rgba(255, 255, 255, 0.7)'
          }}>
            {trend.direction === 'up' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L20 11H15V21H9V11H4L12 3Z" fill="currentColor" />
              </svg>
            )}
            {trend.direction === 'down' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21L4 13H9V3H15V13H20L12 21Z" fill="currentColor" />
              </svg>
            )}
            {trend.direction === 'stable' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 12H6" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
              {trend.percentage}%
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Depuis le début
          </span>
        </div>
      </div>
      
      {/* Slider avec les contrôles */}
      <div ref={sliderRef} style={{ position: 'relative', padding: '20px 15px' }}>
        {/* Graphique */}
        <div style={{ height: '250px', position: 'relative' }}>
          <Line data={chartData} options={chartOptions as any} />
        </div>
        
        {/* Boutons de navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          padding: '0 10px'
        }}>
          <button
            onClick={prevChart}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(0, 38, 65, 0.7)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
              pointerEvents: 'auto'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <button
            onClick={nextChart}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(0, 38, 65, 0.7)',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
              pointerEvents: 'auto'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Indicateurs de pagination */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        padding: '0 0 20px'
      }}>
        {charts.map((chart, index) => (
          <button
            key={chart.id}
            onClick={() => setActiveIndex(index)}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: index === activeIndex ? '#FF6B00' : 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              boxShadow: index === activeIndex ? '0 0 5px rgba(255, 107, 0, 0.5)' : 'none'
            }}
            aria-label={`Voir le graphique ${chart.title}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressSlider;
