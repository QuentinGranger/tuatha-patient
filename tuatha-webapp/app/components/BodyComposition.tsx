import React from 'react';
import Image from 'next/image';

interface BodyCompositionProps {
  weight: number;
  waistSize: number;
  hydration: number;
  bodyFat: number;
  height?: number;
}

const BodyComposition: React.FC<BodyCompositionProps> = ({
  weight,
  waistSize,
  hydration,
  bodyFat,
  height
}) => {
  // Calculer l'IMC si la taille est fournie
  const bmi = height ? (weight / ((height / 100) ** 2)).toFixed(1) : null;
  
  // Fonction pour obtenir une couleur en fonction d'une valeur (pour les indicateurs)
  const getColorForValue = (value: number, lowThreshold: number, highThreshold: number) => {
    if (value < lowThreshold) return '#F44336'; // Rouge si trop bas
    if (value > highThreshold) return '#F44336'; // Rouge si trop haut
    return '#4CAF50'; // Vert si dans la plage idéale
  };
  
  // Couleurs pour les indicateurs
  const hydrationColor = getColorForValue(hydration, 50, 70);
  const bodyFatColor = getColorForValue(bodyFat, 10, 25);
  
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
      position: 'relative',
      marginBottom: '25px'
    }}>
      {/* Titre */}
      <div style={{
        padding: '15px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 17, 13, 0.3)'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#FF6B00'
        }}>
          Composition Corporelle
        </h3>
        <p style={{
          margin: '5px 0 0',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          Dernière mise à jour: 30 Mars 2025
        </p>
      </div>
      
      {/* Contenu principal */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: '20px'
      }}>
        {/* Image du personnage et indicateurs principaux */}
        <div style={{
          flex: '1',
          minWidth: '180px',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: '20px'
        }}>
          <div style={{ position: 'relative', width: '160px', height: '220px' }}>
            <Image
              src="/img/Personage.png"
              alt="Silhouette de Baby Groot"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          
          {/* Indicateurs sur l'image */}
          <div style={{
            position: 'absolute',
            top: '30px',
            right: '10px',
            background: 'rgba(255, 107, 0, 0.2)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            padding: '8px 12px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}>
            {weight} kg
          </div>
          
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '10px',
            background: 'rgba(0, 38, 65, 0.5)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            padding: '8px 12px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}>
            {waistSize} cm
          </div>
        </div>
        
        {/* Métriques détaillées */}
        <div style={{
          flex: '1',
          minWidth: '220px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {/* Poids */}
          <div style={{
            background: 'rgba(0, 17, 13, 0.4)',
            borderRadius: '12px',
            padding: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Poids</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{weight} kg</div>
            </div>
            {bmi && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>IMC</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{bmi}</div>
              </div>
            )}
          </div>
          
          {/* Tour de taille */}
          <div style={{
            background: 'rgba(0, 17, 13, 0.4)',
            borderRadius: '12px',
            padding: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Tour de taille</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{waistSize} cm</div>
            </div>
          </div>
          
          {/* Hydratation */}
          <div style={{
            background: 'rgba(0, 17, 13, 0.4)',
            borderRadius: '12px',
            padding: '15px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Hydratation</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: hydrationColor }}>{hydration}%</div>
            </div>
            
            <div style={{
              height: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${hydration}%`,
                background: hydrationColor,
                borderRadius: '4px',
                transition: 'width 0.5s ease-out'
              }} />
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: '5px'
            }}>
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Masse grasse */}
          <div style={{
            background: 'rgba(0, 17, 13, 0.4)',
            borderRadius: '12px',
            padding: '15px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Masse grasse</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: bodyFatColor }}>{bodyFat}%</div>
            </div>
            
            <div style={{
              height: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${bodyFat}%`,
                background: bodyFatColor,
                borderRadius: '4px',
                transition: 'width 0.5s ease-out'
              }} />
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: '5px'
            }}>
              <span>0%</span>
              <span>15%</span>
              <span>30%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyComposition;
