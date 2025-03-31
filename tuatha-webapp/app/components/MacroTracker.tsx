import React, { useMemo } from 'react';

interface Meal {
  id: string;
  title: string;
  time: string;
  foods: Array<{
    name: string;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    quantity: number;
    icon?: React.ReactNode;
  }>;
  completed?: boolean;
}

interface MacroTrackerProps {
  // Nouvelles props
  meals?: Meal[];
  mealStatuses?: { [key: string]: boolean };
  targetCalories?: number;
  targetProteins?: number;
  targetCarbs?: number;
  targetFats?: number;
  // Anciennes props pour compatibilité
  calories?: number;
  caloriesGoal?: number;
  proteins?: number;
  proteinsGoal?: number;
  carbs?: number;
  carbsGoal?: number;
  fats?: number;
  fatsGoal?: number;
}

const MacroTracker: React.FC<MacroTrackerProps> = ({
  // Nouvelles props
  meals = [],
  mealStatuses = {},
  targetCalories = 2000,
  targetProteins = 150,
  targetCarbs = 200,
  targetFats = 70,
  // Anciennes props
  calories: initialCalories,
  caloriesGoal: initialCaloriesGoal,
  proteins: initialProteins,
  proteinsGoal: initialProteinsGoal,
  carbs: initialCarbs,
  carbsGoal: initialCarbsGoal,
  fats: initialFats,
  fatsGoal: initialFatsGoal
}) => {
  // Calculer les valeurs à partir des repas si disponibles
  const {
    calories,
    proteins,
    carbs,
    fats,
    caloriesGoal,
    proteinsGoal,
    carbsGoal,
    fatsGoal
  } = useMemo(() => {
    if (meals && meals.length > 0) {
      // Calculer les valeurs à partir des repas
      let totalCalories = 0;
      let totalProteins = 0;
      let totalCarbs = 0;
      let totalFats = 0;
      
      meals.forEach(meal => {
        const isCompleted = mealStatuses?.[meal.id] ?? meal.completed ?? false;
        
        if (isCompleted) {
          meal.foods.forEach(food => {
            totalCalories += food.calories * food.quantity;
            totalProteins += food.proteins * food.quantity;
            totalCarbs += food.carbs * food.quantity;
            totalFats += food.fats * food.quantity;
          });
        }
      });
      
      return {
        calories: Math.max(0, totalCalories || 0),
        proteins: Math.max(0, totalProteins || 0),
        carbs: Math.max(0, totalCarbs || 0),
        fats: Math.max(0, totalFats || 0),
        caloriesGoal: Math.max(1, targetCalories || 2000),
        proteinsGoal: Math.max(1, targetProteins || 150),
        carbsGoal: Math.max(1, targetCarbs || 200),
        fatsGoal: Math.max(1, targetFats || 70)
      };
    } else {
      // Utiliser les valeurs directement fournies
      return {
        calories: Math.max(0, initialCalories || 0),
        proteins: Math.max(0, initialProteins || 0),
        carbs: Math.max(0, initialCarbs || 0),
        fats: Math.max(0, initialFats || 0),
        caloriesGoal: Math.max(1, initialCaloriesGoal || targetCalories || 2000),
        proteinsGoal: Math.max(1, initialProteinsGoal || targetProteins || 150),
        carbsGoal: Math.max(1, initialCarbsGoal || targetCarbs || 200),
        fatsGoal: Math.max(1, initialFatsGoal || targetFats || 70)
      };
    }
  }, [
    meals, 
    mealStatuses, 
    initialCalories, 
    initialProteins, 
    initialCarbs, 
    initialFats,
    targetCalories,
    targetProteins,
    targetCarbs,
    targetFats
  ]);
  
  // Calculer les pourcentages - s'assurer qu'ils ne sont pas NaN
  const caloriesPercentage = caloriesGoal > 0 ? Math.min(100, Math.max(0, (calories / caloriesGoal) * 100)) : 0;
  const proteinsPercentage = proteinsGoal > 0 ? Math.min(100, Math.max(0, (proteins / proteinsGoal) * 100)) : 0;
  const carbsPercentage = carbsGoal > 0 ? Math.min(100, Math.max(0, (carbs / carbsGoal) * 100)) : 0;
  const fatsPercentage = fatsGoal > 0 ? Math.min(100, Math.max(0, (fats / fatsGoal) * 100)) : 0;
  
  // Calculer les valeurs en pourcentage du total des calories
  const proteinCalories = Math.max(0, proteins * 4 || 0);
  const carbCalories = Math.max(0, carbs * 4 || 0);
  const fatCalories = Math.max(0, fats * 9 || 0);
  const totalCalories = Math.max(1, calories > 0 ? calories : (proteinCalories + carbCalories + fatCalories));
  
  const proteinPercent = totalCalories > 0 ? Math.round(Math.max(0, Math.min(100, (proteinCalories / totalCalories) * 100))) : 0;
  const carbPercent = totalCalories > 0 ? Math.round(Math.max(0, Math.min(100, (carbCalories / totalCalories) * 100))) : 0;
  const fatPercent = totalCalories > 0 ? Math.round(Math.max(0, Math.min(100, (fatCalories / totalCalories) * 100))) : 0;

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
    // Vérifier et nettoyer toutes les valeurs numériques
    const safePercentage = isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage));
    const safeValue = isNaN(value) ? 0 : value;
    const safeTotal = isNaN(total) ? 1 : Math.max(1, total);
    const safePercent = isNaN(percent) ? 0 : percent;
    
    // Calculer le dashoffset comme une chaîne (pour éviter NaN)
    const calculatedOffset = circumference * (1 - safePercentage / 100);
    const dashOffset = isNaN(calculatedOffset) ? '0' : calculatedOffset.toString();
    
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '30%',
        position: 'relative',
        marginBottom: '30px'
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
            {safeValue}g
          </text>
          <text 
            x="60" 
            y="75" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fill="rgba(255,255,255,0.7)" 
            style={{ fontSize: '12px' }}
          >
            sur {safeTotal}g
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
          {title} ({safePercent}%)
        </div>
      </div>
    );
  };

  // Cercle de progression
  const renderCircleProgress = () => {
    // S'assurer que tous les pourcentages sont des nombres valides
    const proteinPerc = isNaN(proteinsPercentage) ? 0 : proteinsPercentage;
    const carbPerc = isNaN(carbsPercentage) ? 0 : carbsPercentage;
    const fatPerc = isNaN(fatsPercentage) ? 0 : fatsPercentage;
    
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: '20px'
      }}>
        <CircleProgress 
          percentage={proteinPerc} 
          color="#2ecc71" 
          value={proteins} 
          total={proteinsGoal} 
          title="Protéines" 
          percent={proteinPercent} 
        />
        
        <CircleProgress 
          percentage={carbPerc} 
          color="#3498db" 
          value={carbs} 
          total={carbsGoal} 
          title="Glucides" 
          percent={carbPercent} 
        />
        
        <CircleProgress 
          percentage={fatPerc} 
          color="#e67e22" 
          value={fats} 
          total={fatsGoal} 
          title="Lipides" 
          percent={fatPercent} 
        />
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
        {renderCircleProgress()}
        
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
