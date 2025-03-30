'use client';

import React from 'react';

interface ActionButtonsProps {
  onAppointment: (date: string) => void;
  onPayment: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAppointment, onPayment }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
      marginBottom: '20px',
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
          onAppointment(formattedDate);
        }}
        style={{
          padding: '12px 20px',
          borderRadius: '12px',
          border: 'none',
          background: 'linear-gradient(145deg, #FF6B00, #FF9248)',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
          flex: '1',
          transition: 'all 0.2s ease'
        }}
      >
        Prendre rendez-vous
      </button>
      
      <button 
        onClick={onPayment}
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
          flex: '1',
          transition: 'all 0.2s ease'
        }}
      >
        Payer en ligne
      </button>
    </div>
  );
};

export default ActionButtons;
