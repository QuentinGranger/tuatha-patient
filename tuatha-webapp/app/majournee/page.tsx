'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import NavHeader from '../components/NavHeader';
import MacroTracker from '../components/MacroTracker';
import HeartRateTracker from '../components/HeartRateTracker';
import EnergyTracker from '../components/EnergyTracker';
import StepTracker from '../components/StepTracker';
import SleepTracker from '../components/SleepTracker';
import { FaCarrot, FaBreadSlice, FaAppleAlt, FaEgg, FaLeaf } from 'react-icons/fa';

// Type pour les aliments
interface Food {
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  icon: React.ReactNode;
}

// Type pour les repas
interface Meal {
  id: number;
  name: string;
  time: string;
  foods: Food[];
}

export default function MaJournee() {
  // État pour les données nutritionnelles
  const [caloriesConsumed, setCaloriesConsumed] = useState(1450);
  const [caloriesGoal, setCaloriesGoal] = useState(2000);
  const [proteinsConsumed, setProteinsConsumed] = useState(85);
  const [proteinsGoal, setProteinsGoal] = useState(130);
  const [carbsConsumed, setCarbsConsumed] = useState(160);
  const [carbsGoal, setCarbsGoal] = useState(220);
  const [fatsConsumed, setFatsConsumed] = useState(45);
  const [fatsGoal, setFatsGoal] = useState(60);
  
  // État pour le suivi des repas
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: 1,
      name: "Petit déjeuner",
      time: "07:30",
      foods: [
        { name: "Œufs brouillés", calories: 140, proteins: 12, carbs: 1, fats: 10, icon: <FaEgg style={{ color: '#FFEB3B' }} /> },
        { name: "Pain complet", calories: 80, proteins: 3, carbs: 15, fats: 1, icon: <FaBreadSlice style={{ color: '#8D6E63' }} /> },
        { name: "Avocat", calories: 160, proteins: 2, carbs: 8, fats: 15, icon: <FaLeaf style={{ color: '#66BB6A' }} /> }
      ]
    },
    {
      id: 2,
      name: "Déjeuner",
      time: "12:30",
      foods: [
        { name: "Poulet grillé", calories: 200, proteins: 30, carbs: 0, fats: 8, icon: <span style={{ fontSize: '18px' }}>🍗</span> },
        { name: "Riz complet", calories: 150, proteins: 3, carbs: 30, fats: 1, icon: <span style={{ fontSize: '18px' }}>🍚</span> },
        { name: "Légumes variés", calories: 80, proteins: 4, carbs: 15, fats: 1, icon: <FaCarrot style={{ color: '#FF9800' }} /> }
      ]
    },
    {
      id: 3,
      name: "Collation",
      time: "16:00",
      foods: [
        { name: "Yaourt grec", calories: 130, proteins: 15, carbs: 6, fats: 4, icon: <span style={{ fontSize: '18px' }}>🥛</span> },
        { name: "Fruits rouges", calories: 50, proteins: 1, carbs: 12, fats: 0, icon: <FaAppleAlt style={{ color: '#E57373' }} /> }
      ]
    },
    {
      id: 4,
      name: "Dîner",
      time: "19:30",
      foods: [
        { name: "Saumon", calories: 220, proteins: 25, carbs: 0, fats: 13, icon: <span style={{ fontSize: '18px' }}>🐟</span> },
        { name: "Quinoa", calories: 120, proteins: 4, carbs: 21, fats: 2, icon: <span style={{ fontSize: '18px' }}>🌾</span> },
        { name: "Salade verte", calories: 30, proteins: 2, carbs: 5, fats: 0, icon: <FaLeaf style={{ color: '#4CAF50' }} /> }
      ]
    }
  ]);
  
  // État pour le statut des repas (consommé, en attente, sauté)
  const [mealStatuses, setMealStatuses] = useState<Record<number, 'pending' | 'consumed' | 'skipped'>>({
    1: 'consumed',
    2: 'consumed',
    3: 'pending',
    4: 'pending'
  });
  
  // État pour les repas dépliés/pliés
  const [expandedMeals, setExpandedMeals] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false
  });
  
  // Calculer la quantité de macronutriments consommés
  const calculateMacros = () => {
    let calories = 0;
    let proteins = 0;
    let carbs = 0;
    let fats = 0;
    
    meals.forEach(meal => {
      if (mealStatuses[meal.id] === 'consumed') {
        meal.foods.forEach(food => {
          calories += food.calories;
          proteins += food.proteins;
          carbs += food.carbs;
          fats += food.fats;
        });
      }
    });
    
    setCaloriesConsumed(calories);
    setProteinsConsumed(proteins);
    setCarbsConsumed(carbs);
    setFatsConsumed(fats);
  };
  
  // Mise à jour des macros lorsque le statut des repas change
  useEffect(() => {
    calculateMacros();
  }, [mealStatuses]);
  
  // Gérer le changement de statut d'un repas
  const handleMealStatusChange = (mealId: number, status: 'pending' | 'consumed' | 'skipped') => {
    setMealStatuses(prev => ({
      ...prev,
      [mealId]: status
    }));
  };
  
  // Gérer l'expansion/réduction d'un repas
  const toggleMealExpanded = (mealId: number) => {
    setExpandedMeals(prev => ({
      ...prev,
      [mealId]: !prev[mealId]
    }));
  };
  
  // Afficher un repas avec ses aliments
  const renderMeal = (meal: Meal) => {
    const status = mealStatuses[meal.id];
    const isExpanded = expandedMeals[meal.id];
    
    // Calculer les calories et macros pour ce repas spécifique
    const mealCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
    const mealProteins = meal.foods.reduce((sum, food) => sum + food.proteins, 0);
    const mealCarbs = meal.foods.reduce((sum, food) => sum + food.carbs, 0);
    const mealFats = meal.foods.reduce((sum, food) => sum + food.fats, 0);
    
    return (
      <div className={styles.mealCard} key={meal.id}>
        <div 
          className={styles.mealHeader}
          onClick={() => toggleMealExpanded(meal.id)}
        >
          <div className={styles.mealInfo}>
            <h3>{meal.name}</h3>
            <span className={styles.mealTime}>{meal.time}</span>
          </div>
          
          <div className={styles.mealSummary}>
            <span className={styles.mealCalories}>{mealCalories} kcal</span>
            <div className={styles.macroSummary}>
              <span className={styles.proteinSummary}>P: {mealProteins}g</span>
              <span className={styles.carbSummary}>G: {mealCarbs}g</span>
              <span className={styles.fatSummary}>L: {mealFats}g</span>
            </div>
          </div>
          
          <div className={styles.mealControls}>
            <div className={styles.mealStatus}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleMealStatusChange(meal.id, 'consumed');
                }}
                className={`${styles.statusButton} ${status === 'consumed' ? styles.activeStatus : ''}`}
              >
                <FaCarrot />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleMealStatusChange(meal.id, 'pending');
                }}
                className={`${styles.statusButton} ${status === 'pending' ? styles.activeStatus : ''}`}
              >
                <FaAppleAlt />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleMealStatusChange(meal.id, 'skipped');
                }}
                className={`${styles.statusButton} ${status === 'skipped' ? styles.activeStatus : ''}`}
              >
                <FaBreadSlice />
              </button>
            </div>
            
            <button 
              className={styles.expandButton}
              onClick={(e) => {
                e.stopPropagation();
                toggleMealExpanded(meal.id);
              }}
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          </div>
        </div>
        
        <div className={`${styles.foodList} ${isExpanded ? styles.foodListVisible : ''} ${status === 'skipped' ? styles.skippedMeal : ''}`}>
          {meal.foods.map((food, index) => (
            <div className={styles.foodItem} key={index}>
              <div className={styles.foodIcon}>{food.icon}</div>
              <div className={styles.foodInfo}>
                <span className={styles.foodName}>{food.name}</span>
                <span className={styles.foodMacros}>
                  {food.calories} kcal | P: {food.proteins}g | G: {food.carbs}g | L: {food.fats}g
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className={styles.container}>
      {/* Composant header commun */}
      <NavHeader />

      {/* En-tête et titre */}
      <div className={styles.header}>
        <div className={styles.greetingContainer}>
          <div className={styles.greeting}>
            <h2>Ma Journée</h2>
            <p>Nutrition et activités pour aujourd'hui</p>
          </div>
          <div className={styles.headerIcons}>
            <button className={styles.iconButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M21 6.5C21 8.43 19.43 10 17.5 10S14 8.43 14 6.5 15.57 3 17.5 3 21 4.57 21 6.5zm-2 0C19 5.67 18.33 5 17.5 5S16 5.67 16 6.5 16.67 8 17.5 8 19 7.33 19 6.5z"/>
                <path d="M11.6 14.93c1.13.07 2.29.21 3.4.53V11.5c0-.85.5-1.59 1.22-1.92-.74-.22-1.64-.56-2.72-.56-1.41 0-2.56.82-3.11 2-.33.07-.6.15-.92.22-.17.04-.36.08-.52.11-.3.07-.61.14-.86.27-.01 0-.02 0-.03.01-.31.15-.6.36-.84.64-.62.71-.97 1.63-.97 2.58v4.15c0 .83.67 1.5 1.5 1.5h6.75c-.71-.89-1.21-1.83-1.5-2.73-.58-.21-1.15-.34-1.76-.44v-1.4c.13-.01.26-.02.36-.02z"/>
                <path d="M10.08 14.2C9.44 14.2 8.9 14.75 8.9 15.39v4.3c0 .64.54 1.19 1.18 1.19H17c.64 0 1.18-.55 1.18-1.19v-4.3c0-.64-.54-1.19-1.18-1.19h-6.92z"/>
                <path d="M7.62 15.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-1.5-.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/>
                <path d="M7.62 10.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-1.5-.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/>
                <path d="M7.62 5.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-1.5-.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"/>
              </svg>
            </button>
            <button className={styles.iconButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19.5 3h-15C3.12 3 2 4.12 2 5.5v11c0 1.39 1.11 2.5 2.5 2.5h4c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H7v-2h10v2h-4c-.28 0-2.5.22-2.5.5s2.22.5 2.5.5h6.5c1.38 0 2.5-1.12 2.5-2.5v-11C22 4.12 20.88 3 19.5 3zM20 17c0 .28-.22.5-.5.5H19v-2H5v2h-.5c-.28 0-.5-.22-.5-.5v-3h16v3zm0-4H4V5.5c0-.28.22-.5.5-.5h15c.27 0 .5.22.5.5V13z"/>
                <path d="M8.47 9.92c.33.13.73-.05.86-.39.12-.34-.05-.73-.39-.86-1.07-.42-2.3-.42-3.38 0-.32.13-.5.52-.36.85.1.25.35.41.6.41.08 0 .16-.02.23-.05.76-.3 1.7-.3 2.44 0zM18.44 8.67c-1.07-.42-2.3-.42-3.38 0-.34.13-.51.51-.39.85.14.34.52.51.86.39.76-.3 1.7-.3 2.44 0 .08.03.16.05.24.05.25 0 .49-.16.59-.4.14-.33-.04-.72-.36-.89z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Section MacroTracker */}
        <section className={styles.macroSection}>
          <h3 className={styles.sectionTitle}>Suivi Nutritionnel</h3>
          <MacroTracker
            meals={meals}
            mealStatuses={mealStatuses}
            targetCalories={2000}
            targetProteins={150}
            targetCarbs={200}
            targetFats={70}
          />
        </section>

        {/* Section des repas */}
        <section className={styles.mealsSection}>
          <h3 className={styles.sectionTitle}>Mes Repas</h3>
          <div className={styles.mealsList}>
            {meals.map(meal => renderMeal(meal))}
          </div>
        </section>
        
        {/* Section des activités et suivi santé */}
        <section className={styles.trackerSection}>
          <h3 className={styles.sectionTitle}>Suivi d'Activité et Santé</h3>
          
          <div className={styles.trackerContainer}>
            <HeartRateTracker />
          </div>
          
          <div className={styles.trackerContainer}>
            <EnergyTracker bmr={1650} weight={65} />
          </div>
          
          <div className={styles.trackerContainer}>
            <StepTracker dailyGoal={8000} weight={65} height={165} />
          </div>
        </section>

        {/* Section du suivi du sommeil */}
        <section className={styles.trackerSection}>
          <h3 className={styles.sectionTitle}>Qualité du Sommeil</h3>
          
          <div className={styles.trackerContainer}>
            <SleepTracker targetSleep={8} sleepScore={78} />
          </div>
        </section>
      </div>
    </main>
  );
}
