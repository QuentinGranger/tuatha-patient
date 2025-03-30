import React from 'react';

interface MacroTrackerProps {
  calories: number;
  caloriesGoal: number;
  proteins: number;
  proteinsGoal: number;
  carbs: number;
  carbsGoal: number;
  fats: number;
  fatsGoal: number;
}

const MacroTracker: React.FC<MacroTrackerProps> = ({
  calories,
  caloriesGoal,
  proteins,
  proteinsGoal,
  carbs,
  carbsGoal,
  fats,
  fatsGoal
}) => {
  // Calculer les pourcentages
  const caloriesPercentage = Math.min(100, (calories / caloriesGoal) * 100);
  const proteinsPercentage = Math.min(100, (proteins / proteinsGoal) * 100);
  const carbsPercentage = Math.min(100, (carbs / carbsGoal) * 100);
  const fatsPercentage = Math.min(100, (fats / fatsGoal) * 100);
  
  // Calculer les valeurs en pourcentage du total des calories
  const proteinCalories = proteins * 4;
  const carbCalories = carbs * 4;
  const fatCalories = fats * 9;
  const totalCalories = calories > 0 ? calories : (proteinCalories + carbCalories + fatCalories);
  
  const proteinPercent = Math.round((proteinCalories / totalCalories) * 100) || 0;
  const carbPercent = Math.round((carbCalories / totalCalories) * 100) || 0;
  const fatPercent = Math.round((fatCalories / totalCalories) * 100) || 0;

  // Calculer les angles pour les cercles SVG
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const proteinDashOffset = circumference * (1 - proteinsPercentage / 100);
  const carbDashOffset = circumference * (1 - carbsPercentage / 100);
  const fatDashOffset = circumference * (1 - fatsPercentage / 100);

  // Créer un composant de cercle réutilisable
  const CircleProgress = ({ 
    percentage, 
    color, 
    value, 
    total, 
    title, 
    percent 
  }: { 
    percentage: number, 
    color: string, 
    value: number, 
    total: number, 
    title: string, 
    percent: number 
  }) => {
    const dashOffset = circumference * (1 - percentage / 100);
    
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '30%',
        position: 'relative'
      }}>
        <svg width="100" height="100" viewBox="0 0 120 120">
          {/* Fond du cercle */}
          <circle 
            cx="60" 
            cy="60" 
            r={radius} 
            fill="rgba(0, 17, 13, 0.5)" 
            stroke="rgba(255, 255, 255, 0.05)" 
            strokeWidth="2"
          />
          
          {/* Cercle de progression */}
          <circle 
            cx="60" 
            cy="60" 
            r={radius} 
            fill="none" 
            stroke={color} 
            strokeWidth="8" 
            strokeDasharray={circumference} 
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
          
          {/* Valeur */}
          <text 
            x="60" 
            y="55" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fill="white" 
            style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
            }}
          >
            {value}g
          </text>
          <text 
            x="60" 
            y="75" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fill="rgba(255,255,255,0.7)" 
            style={{ fontSize: '12px' }}
          >
            sur {total}g
          </text>
        </svg>
        
        <div style={{
          marginTop: '10px', 
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          color: color,
          textShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}>
          {title} ({percent}%)
        </div>
      </div>
    );
  };

  return (
    <div style={{
      width: '100%',
      margin: '20px 0',
      padding: '10px'
    }}>
      <div style={{
        background: 'rgba(0, 38, 65, 0.35)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 107, 0, 0.15)',
        padding: '25px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white',
        overflow: 'hidden'
      }}>
        {/* Affichage des calories totales */}
        <div style={{
          fontSize: '22px',
          fontWeight: 'bold',
          marginBottom: '5px',
          background: 'linear-gradient(90deg, #FF6B00, #FF9248)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))'
        }}>
          {calories} kcal
        </div>
        
        <div style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '20px'
        }}>
          Objectif: {caloriesGoal} kcal
        </div>
        
        <div style={{
          height: '8px',
          width: '90%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          marginBottom: '30px',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            height: '100%',
            width: `${caloriesPercentage}%`,
            background: 'linear-gradient(90deg, #FF6B00, #FF9248)',
            borderRadius: '4px',
            transition: 'width 0.5s ease-out'
          }}></div>
        </div>
        
        {/* 3 cercles séparés pour les macronutriments */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          marginBottom: '30px',
          gap: '15px',
          padding: '0 10px'
        }}>
          <CircleProgress 
            percentage={proteinsPercentage}
            color="#FF6B00"
            value={proteins}
            total={proteinsGoal}
            title="Protéines"
            percent={proteinPercent}
          />
          
          <CircleProgress 
            percentage={carbsPercentage}
            color="#4A88F2"
            value={carbs}
            total={carbsGoal}
            title="Glucides"
            percent={carbPercent}
          />
          
          <CircleProgress 
            percentage={fatsPercentage}
            color="#00C853"
            value={fats}
            total={fatsGoal}
            title="Lipides"
            percent={fatPercent}
          />
        </div>
        
        {/* Ligne décorative */}
        <div style={{
          width: '80%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.3), transparent)',
          margin: '10px 0 20px'
        }}></div>
        
        {/* Détails des macros avec barres de progression */}
        <div style={{ width: '100%' }}>
          {/* Protéines */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '5px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '3px', 
                  backgroundColor: '#FF6B00',
                  marginRight: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}></div>
                <span style={{ fontSize: '14px' }}>Protéines</span>
              </div>
              <span style={{ fontSize: '14px' }}>{proteins}g / {proteinsGoal}g</span>
            </div>
            <div style={{ 
              height: '8px', 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${proteinsPercentage}%`, 
                backgroundColor: '#FF6B00',
                borderRadius: '4px',
                transition: 'width 0.5s ease-out'
              }}></div>
            </div>
          </div>
          
          {/* Glucides */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '5px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '3px', 
                  backgroundColor: '#4A88F2',
                  marginRight: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}></div>
                <span style={{ fontSize: '14px' }}>Glucides</span>
              </div>
              <span style={{ fontSize: '14px' }}>{carbs}g / {carbsGoal}g</span>
            </div>
            <div style={{ 
              height: '8px', 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${carbsPercentage}%`, 
                backgroundColor: '#4A88F2',
                borderRadius: '4px',
                transition: 'width 0.5s ease-out'
              }}></div>
            </div>
          </div>
          
          {/* Lipides */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '5px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '3px', 
                  backgroundColor: '#00C853',
                  marginRight: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}></div>
                <span style={{ fontSize: '14px' }}>Lipides</span>
              </div>
              <span style={{ fontSize: '14px' }}>{fats}g / {fatsGoal}g</span>
            </div>
            <div style={{ 
              height: '8px', 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${fatsPercentage}%`, 
                backgroundColor: '#00C853',
                borderRadius: '4px',
                transition: 'width 0.5s ease-out'
              }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacroTracker;
