import React, { useState } from 'react';
import { FaBell, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaArrowUp, FaArrowDown, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Types d'alertes
export enum AlertType {
  WARNING = 'warning',  // Alerte importante
  INFO = 'info',        // Information
  SUCCESS = 'success'   // Bonne nouvelle
}

export interface Alert {
  id: string;
  type: AlertType;
  date: string;          // Date de l'alerte au format ISO
  title: string;         // Titre court
  description: string;   // Description détaillée
  metric?: {             // Métrique liée (optionnelle)
    name: string;
    value: number;
    unit: string;
    trend?: 'up' | 'down' | 'stable';
    threshold?: number;
  };
  isRead: boolean;       // Si l'alerte a été lue
  action?: {             // Action possible (optionnelle)
    label: string;
    onClick: () => void;
  };
}

interface AlertJournalProps {
  alerts: Alert[];
  onMarkAsRead: (alertId: string) => void;
}

const AlertJournal: React.FC<AlertJournalProps> = ({ alerts, onMarkAsRead }) => {
  const [expandedAlerts, setExpandedAlerts] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  
  // Trier les alertes par date (les plus récentes d'abord) et par statut de lecture
  const sortedAlerts = [...alerts].sort((a, b) => {
    // D'abord les non lues
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    // Ensuite par date
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Filtrer les alertes selon le type sélectionné
  const filteredAlerts = filterType 
    ? sortedAlerts.filter(alert => alert.type === filterType)
    : sortedAlerts;
  
  // Basculer l'état d'expansion d'une alerte
  const toggleExpand = (alertId: string) => {
    setExpandedAlerts(prev => 
      prev.includes(alertId)
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };
  
  // Formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isYesterday) {
      return `Hier à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };
  
  // Obtenir la couleur et l'icône selon le type d'alerte
  const getAlertStyle = (type: AlertType) => {
    switch (type) {
      case AlertType.WARNING:
        return {
          icon: <FaExclamationTriangle />,
          color: '#FF3D00',
          bgColor: 'rgba(255, 61, 0, 0.15)'
        };
      case AlertType.INFO:
        return {
          icon: <FaInfoCircle />,
          color: '#2196F3',
          bgColor: 'rgba(33, 150, 243, 0.15)'
        };
      case AlertType.SUCCESS:
        return {
          icon: <FaCheckCircle />,
          color: '#4CAF50',
          bgColor: 'rgba(76, 175, 80, 0.15)'
        };
    }
  };
  
  // Nombre d'alertes par type
  const alertCounts = {
    all: alerts.length,
    unread: alerts.filter(a => !a.isRead).length,
    [AlertType.WARNING]: alerts.filter(a => a.type === AlertType.WARNING).length,
    [AlertType.INFO]: alerts.filter(a => a.type === AlertType.INFO).length,
    [AlertType.SUCCESS]: alerts.filter(a => a.type === AlertType.SUCCESS).length
  };
  
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'rgba(255, 107, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            color: '#FF6B00'
          }}>
            <FaBell />
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#FF6B00'
            }}>
              Journal d'alertes
            </h3>
            <p style={{
              margin: '5px 0 0',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              {alertCounts.unread} nouvelle{alertCounts.unread !== 1 ? 's' : ''} alerte{alertCounts.unread !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
      
      {/* Filtres */}
      <div style={{
        display: 'flex',
        padding: '10px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        overflowX: 'auto',
        gap: '8px'
      }}>
        <button
          onClick={() => setFilterType(null)}
          style={{
            background: !filterType ? 'rgba(255, 107, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 12px',
            color: !filterType ? '#FF6B00' : 'white',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap'
          }}
        >
          Toutes ({alertCounts.all})
        </button>
        
        <button
          onClick={() => setFilterType(AlertType.WARNING)}
          style={{
            background: filterType === AlertType.WARNING ? 'rgba(255, 61, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 12px',
            color: filterType === AlertType.WARNING ? '#FF3D00' : 'white',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap'
          }}
        >
          <FaExclamationTriangle size={12} /> Alertes ({alertCounts[AlertType.WARNING]})
        </button>
        
        <button
          onClick={() => setFilterType(AlertType.INFO)}
          style={{
            background: filterType === AlertType.INFO ? 'rgba(33, 150, 243, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 12px',
            color: filterType === AlertType.INFO ? '#2196F3' : 'white',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap'
          }}
        >
          <FaInfoCircle size={12} /> Info ({alertCounts[AlertType.INFO]})
        </button>
        
        <button
          onClick={() => setFilterType(AlertType.SUCCESS)}
          style={{
            background: filterType === AlertType.SUCCESS ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 12px',
            color: filterType === AlertType.SUCCESS ? '#4CAF50' : 'white',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap'
          }}
        >
          <FaCheckCircle size={12} /> Succès ({alertCounts[AlertType.SUCCESS]})
        </button>
      </div>
      
      {/* Liste des alertes */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {filteredAlerts.length === 0 ? (
          <div style={{
            padding: '30px 20px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '15px'
          }}>
            Aucune alerte à afficher
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isExpanded = expandedAlerts.includes(alert.id);
            const { icon, color, bgColor } = getAlertStyle(alert.type);
            
            return (
              <div 
                key={alert.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  background: alert.isRead ? 'transparent' : 'rgba(255, 255, 255, 0.03)',
                  transition: 'background 0.3s'
                }}
              >
                {/* En-tête de l'alerte */}
                <div 
                  onClick={() => toggleExpand(alert.id)}
                  style={{
                    padding: '15px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    gap: '15px'
                  }}
                >
                  {/* Indicateur de type */}
                  <div style={{
                    color,
                    background: bgColor,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {icon}
                  </div>
                  
                  {/* Contenu */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: alert.isRead ? 'normal' : 'bold',
                      marginBottom: '4px'
                    }}>
                      {alert.title}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      {formatDate(alert.date)}
                    </div>
                  </div>
                  
                  {/* Indicateur d'expansion */}
                  <div style={{ color: 'rgba(255, 255, 255, 0.5)', flexShrink: 0 }}>
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  
                  {/* Indicateur non lu */}
                  {!alert.isRead && (
                    <div style={{
                      width: '10px',
                      height: '10px',
                      background: '#FF6B00',
                      borderRadius: '50%',
                      flexShrink: 0
                    }} />
                  )}
                </div>
                
                {/* Détails de l'alerte (visible si développé) */}
                {isExpanded && (
                  <div style={{
                    padding: '0 20px 15px 71px',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    <p>{alert.description}</p>
                    
                    {/* Métrique */}
                    {alert.metric && (
                      <div style={{
                        background: 'rgba(0, 17, 13, 0.4)',
                        borderRadius: '10px',
                        padding: '12px',
                        marginTop: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>
                            {alert.metric.name}
                          </div>
                          <div style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}>
                            {alert.metric.value} {alert.metric.unit}
                            
                            {alert.metric.trend === 'up' && (
                              <FaArrowUp size={12} color="#FF3D00" />
                            )}
                            {alert.metric.trend === 'down' && (
                              <FaArrowDown size={12} color="#4CAF50" />
                            )}
                          </div>
                        </div>
                        
                        {alert.metric.threshold && (
                          <div style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '5px 10px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }}>
                            Seuil: {alert.metric.threshold} {alert.metric.unit}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Bouton d'action et marquer comme lu */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '15px',
                      gap: '10px'
                    }}>
                      {alert.action && (
                        <button
                          onClick={alert.action.onClick}
                          style={{
                            background: 'rgba(255, 107, 0, 0.2)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 15px',
                            color: '#FF6B00',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {alert.action.label}
                        </button>
                      )}
                      
                      {!alert.isRead && (
                        <button
                          onClick={() => onMarkAsRead(alert.id)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 15px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginLeft: 'auto'
                          }}
                        >
                          Marquer comme lue
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertJournal;
