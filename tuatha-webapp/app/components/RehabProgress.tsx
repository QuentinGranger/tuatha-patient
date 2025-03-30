'use client';

import React, { useState, useEffect } from 'react';
import { FaTrophy, FaRunning, FaChartLine } from 'react-icons/fa';

interface RehabProgressProps {
  patientName: string;
  injury: string;
  startDate: string;
  estimatedEndDate: string;
  currentProgress: number; // pourcentage de 0 à 100
  metrics: Metric[];
  goals: Goal[];
}

interface Metric {
  id: string;
  name: string;
  unit: string;
  values: {
    date: string;
    value: number;
  }[];
  target: number;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  isCompleted: boolean;
}

const RehabProgress: React.FC<RehabProgressProps> = ({
  patientName,
  injury,
  startDate,
  estimatedEndDate,
  currentProgress,
  metrics,
  goals
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'goals'>('overview');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(metrics.length > 0 ? metrics[0].id : null);
  
  // Calculer le nombre de jours écoulés et restants
  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(estimatedEndDate);
    const today = new Date();
    
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return { totalDays, daysElapsed, daysRemaining };
  };
  
  const { totalDays, daysElapsed, daysRemaining } = calculateDays();
  
  // Fonction pour obtenir la couleur en fonction du pourcentage
  const getProgressColor = (progress: number) => {
    if (progress < 30) return '#F44336';
    if (progress < 70) return '#FF9800';
    return '#4CAF50';
  };
  
  // Créer des points de données pour le graphique simplifié
  const generateChartPoints = (metric: Metric) => {
    const points = metric.values.map((value, index) => {
      // Normaliser les valeurs pour l'affichage dans le graphique
      const normalizedValue = Math.min(100, (value.value / metric.target) * 100);
      return `${(index / (metric.values.length - 1)) * 100},${100 - normalizedValue}`;
    }).join(' ');
    
    return points;
  };
  
  const selectedMetricData = metrics.find(m => m.id === selectedMetric);
  
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
      padding: '20px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#FF6B00', margin: '0 0 5px 0' }}>
          Progression de Rééducation
        </h2>
        <p style={{ margin: '0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          {injury} - Débuté le {new Date(startDate).toLocaleDateString('fr-FR')}
        </p>
      </div>
      
      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '20px', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '10px'
      }}>
        <button 
          onClick={() => setActiveTab('overview')} 
          style={{ 
            background: activeTab === 'overview' ? 'rgba(255, 107, 0, 0.2)' : 'transparent',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            color: activeTab === 'overview' ? '#FF6B00' : 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
        >
          <FaChartLine /> Vue d'ensemble
        </button>
        <button 
          onClick={() => setActiveTab('metrics')} 
          style={{ 
            background: activeTab === 'metrics' ? 'rgba(255, 107, 0, 0.2)' : 'transparent',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            color: activeTab === 'metrics' ? '#FF6B00' : 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
        >
          <FaRunning /> Métriques
        </button>
        <button 
          onClick={() => setActiveTab('goals')} 
          style={{ 
            background: activeTab === 'goals' ? 'rgba(255, 107, 0, 0.2)' : 'transparent',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            color: activeTab === 'goals' ? '#FF6B00' : 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
        >
          <FaTrophy /> Objectifs
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Barre de progression globale */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>Progression globale</span>
              <span style={{ fontSize: '14px', color: '#FF6B00', fontWeight: 'bold' }}>{currentProgress}%</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '10px', 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${currentProgress}%`, 
                height: '100%', 
                backgroundColor: getProgressColor(currentProgress),
                borderRadius: '5px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
          
          {/* Info cards */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            flexWrap: 'wrap',
            marginBottom: '20px'
          }}>
            <div style={{ 
              flex: 1,
              minWidth: '100px',
              background: 'rgba(0, 17, 13, 0.5)',
              padding: '15px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B00' }}>{daysElapsed}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Jours écoulés</div>
            </div>
            <div style={{ 
              flex: 1,
              minWidth: '100px',
              background: 'rgba(0, 17, 13, 0.5)',
              padding: '15px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B00' }}>{daysRemaining}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Jours restants</div>
            </div>
            <div style={{ 
              flex: 1,
              minWidth: '100px',
              background: 'rgba(0, 17, 13, 0.5)',
              padding: '15px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B00' }}>
                {goals.filter(goal => goal.isCompleted).length}/{goals.length}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Objectifs</div>
            </div>
          </div>
          
          {/* Récents accomplissements */}
          <div>
            <h3 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>Récents accomplissements</h3>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {goals.filter(goal => goal.isCompleted).slice(0, 3).map(goal => (
                <div key={goal.id} style={{ 
                  padding: '10px', 
                  marginBottom: '8px', 
                  background: 'rgba(76, 175, 80, 0.15)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  <div style={{ fontWeight: 'bold' }}>{goal.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    {goal.description}
                  </div>
                </div>
              ))}
              {goals.filter(goal => goal.isCompleted).length === 0 && (
                <div style={{ 
                  padding: '10px', 
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'center'
                }}>
                  Aucun objectif atteint pour le moment
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'metrics' && (
        <div>
          {/* Sélecteur de métrique */}
          <div style={{ marginBottom: '15px' }}>
            <select 
              value={selectedMetric || ''}
              onChange={(e) => setSelectedMetric(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'rgba(0, 17, 13, 0.5)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              {metrics.map(metric => (
                <option key={metric.id} value={metric.id}>{metric.name}</option>
              ))}
            </select>
          </div>
          
          {selectedMetricData && (
            <>
              {/* Graphique simplifié */}
              <div style={{ height: '200px', position: 'relative', marginBottom: '20px' }}>
                {/* Arrière-plan du graphique */}
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0, 17, 13, 0.3)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {/* Lignes horizontales */}
                  {[0, 25, 50, 75, 100].map(percent => (
                    <div key={percent} style={{
                      position: 'absolute',
                      left: 0,
                      top: `${100 - percent}%`,
                      width: '100%',
                      height: '1px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }} />
                  ))}
                </div>
                
                {/* SVG pour la ligne du graphique */}
                <svg 
                  viewBox="0 0 100 100" 
                  preserveAspectRatio="none"
                  style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
                >
                  <polyline
                    points={generateChartPoints(selectedMetricData)}
                    fill="none"
                    stroke="#FF6B00"
                    strokeWidth="2"
                  />
                  
                  {/* Points du graphique */}
                  {selectedMetricData.values.map((value, index) => {
                    const normalizedValue = Math.min(100, (value.value / selectedMetricData.target) * 100);
                    const x = (index / (selectedMetricData.values.length - 1)) * 100;
                    const y = 100 - normalizedValue;
                    
                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="2"
                        fill="#FF6B00"
                      />
                    );
                  })}
                </svg>
                
                {/* Valeur actuelle et cible */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '10px', 
                  right: '10px',
                  background: 'rgba(0, 38, 65, 0.8)',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  fontSize: '12px'
                }}>
                  Dernière valeur: {selectedMetricData.values[selectedMetricData.values.length - 1].value} {selectedMetricData.unit} / Cible: {selectedMetricData.target} {selectedMetricData.unit}
                </div>
              </div>
              
              {/* Historique des valeurs */}
              <div>
                <h3 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>Historique des mesures</h3>
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {[...selectedMetricData.values].reverse().map((value, index) => (
                    <div key={index} style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px',
                      borderBottom: index === selectedMetricData.values.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <span>{new Date(value.date).toLocaleDateString('fr-FR')}</span>
                      <span style={{ fontWeight: 'bold' }}>{value.value} {selectedMetricData.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
      
      {activeTab === 'goals' && (
        <div>
          <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {goals.filter(goal => goal.isCompleted).length}/{goals.length} objectifs atteints
            </span>
            <span style={{ color: '#FF6B00', fontWeight: 'bold' }}>
              {Math.round((goals.filter(goal => goal.isCompleted).length / goals.length) * 100)}%
            </span>
          </div>
          
          {/* Liste des objectifs */}
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {goals.map(goal => (
              <div key={goal.id} style={{ 
                padding: '12px', 
                marginBottom: '10px',
                background: goal.isCompleted ? 'rgba(76, 175, 80, 0.15)' : 'rgba(0, 17, 13, 0.5)',
                borderRadius: '10px',
                borderLeft: `4px solid ${goal.isCompleted ? '#4CAF50' : '#FF6B00'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '16px',
                    color: goal.isCompleted ? '#4CAF50' : 'white'
                  }}>
                    {goal.title}
                  </h4>
                  <div style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    background: goal.isCompleted ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 107, 0, 0.3)',
                    color: goal.isCompleted ? '#4CAF50' : '#FF6B00'
                  }}>
                    {goal.isCompleted ? 'Complété' : 'En cours'}
                  </div>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                  {goal.description}
                </p>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Objectif pour le: {new Date(goal.targetDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RehabProgress;
