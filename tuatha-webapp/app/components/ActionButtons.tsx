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
      gap: '15px',
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
          padding: '15px 24px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 107, 0, 0.3)',
          background: 'linear-gradient(145deg, rgba(255, 107, 0, 0.8), rgba(255, 146, 72, 0.9))',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(255, 107, 0, 0.25), 0 2px 5px rgba(0, 0, 0, 0.1)',
          flex: '1',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 25px rgba(255, 107, 0, 0.3), 0 3px 8px rgba(0, 0, 0, 0.15)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 107, 0, 0.25), 0 2px 5px rgba(0, 0, 0, 0.1)';
        }}
      >
        <span style={{ 
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 10H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 14H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 14H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 18H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 18H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Prendre rendez-vous
        </span>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255, 107, 0, 0), rgba(255, 255, 255, 0.1), rgba(255, 107, 0, 0))',
          backgroundSize: '200% 100%',
          animation: 'shine 3s infinite linear',
          zIndex: 1
        }} />
        <style jsx>{`
          @keyframes shine {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </button>
      
      <button 
        onClick={onPayment}
        style={{
          background: 'rgba(0, 38, 65, 0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '15px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          flex: '1',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.background = 'rgba(0, 38, 65, 0.5)';
          e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.background = 'rgba(0, 38, 65, 0.3)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 10H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 15H7.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 15H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Payer en ligne
      </button>
    </div>
  );
};

export default ActionButtons;
