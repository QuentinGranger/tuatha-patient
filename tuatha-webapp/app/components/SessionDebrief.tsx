import React, { useState, useEffect } from 'react';
import { FaSave, FaSmile, FaMeh, FaFrown, FaStar, FaRegStar, FaArrowLeft } from 'react-icons/fa';
import styles from './SessionDebrief.module.css';

type Mood = 'great' | 'good' | 'neutral' | 'tired' | 'bad';
type Pain = 0 | 1 | 2 | 3 | 4 | 5;

interface SessionDebriefProps {
  sessionId?: string;
  athleteName?: string;
  onClose?: () => void;
  onSave?: (data: SessionDebriefData) => void;
}

export interface SessionDebriefData {
  id: string;
  sessionId?: string;
  date: string;
  mood: Mood;
  painLevel: Pain;
  progress: number; // 0-100
  feedback: string;
  goals: string[];
  achievements: string[];
}

const initialData: SessionDebriefData = {
  id: `debrief_${Date.now()}`,
  date: new Date().toISOString(),
  mood: 'good',
  painLevel: 0,
  progress: 75,
  feedback: '',
  goals: [''],
  achievements: ['']
};

const SessionDebrief: React.FC<SessionDebriefProps> = ({ 
  sessionId, 
  athleteName = 'Baby Groot',
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState<SessionDebriefData>({
    ...initialData,
    sessionId
  });
  const [saved, setSaved] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  const moodEmojis = {
    great: '😄',
    good: '🙂',
    neutral: '😐',
    tired: '😓',
    bad: '😞'
  };

  const moodLabels = {
    great: 'Super',
    good: 'Bien',
    neutral: 'Neutre',
    tired: 'Fatigué',
    bad: 'Mauvais'
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const handleMoodSelect = (mood: Mood) => {
    setFormData(prev => ({
      ...prev,
      mood
    }));
  };

  const handlePainSelect = (pain: Pain) => {
    setFormData(prev => ({
      ...prev,
      painLevel: pain
    }));
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...formData.goals];
    newGoals[index] = value;
    
    // Add a new empty goal if typing in the last one
    if (index === newGoals.length - 1 && value.trim() !== '') {
      newGoals.push('');
    }
    
    // Remove empty goals (except the last one)
    const filteredGoals = newGoals.filter((goal, i) => 
      i === newGoals.length - 1 || goal.trim() !== ''
    );
    
    setFormData(prev => ({
      ...prev,
      goals: filteredGoals
    }));
  };

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    
    // Add a new empty achievement if typing in the last one
    if (index === newAchievements.length - 1 && value.trim() !== '') {
      newAchievements.push('');
    }
    
    // Remove empty achievements (except the last one)
    const filteredAchievements = newAchievements.filter((achievement, i) => 
      i === newAchievements.length - 1 || achievement.trim() !== ''
    );
    
    setFormData(prev => ({
      ...prev,
      achievements: filteredAchievements
    }));
  };

  const saveDebrief = () => {
    // Filter out empty items before saving
    const cleanData = {
      ...formData,
      goals: formData.goals.filter(goal => goal.trim() !== ''),
      achievements: formData.achievements.filter(achievement => achievement.trim() !== '')
    };
    
    if (onSave) {
      onSave(cleanData);
    }
    
    setSaved(true);
    setShowThanks(true);
    
    // Hide the thank you message after 3 seconds
    setTimeout(() => {
      setShowThanks(false);
      if (onClose) {
        onClose();
      }
    }, 3000);
  };

  return (
    <div className={styles.debriefContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {onClose && (
            <button className={styles.backButton} onClick={onClose}>
              <FaArrowLeft />
            </button>
          )}
          <h1>Débrief de séance</h1>
        </div>
        <div className={styles.headerRight}>
          <p className={styles.userName}>{athleteName}</p>
          <span className={styles.userStat}>12:1:1</span>
        </div>
      </div>

      <div className={styles.content}>
        {showThanks ? (
          <div className={styles.thanksMessage}>
            <div className={styles.thanksIcon}>✓</div>
            <h2>Merci pour votre retour!</h2>
            <p>Vos impressions aident à améliorer votre programme personnalisé.</p>
          </div>
        ) : (
          <form className={styles.debriefForm}>
            <div className={styles.section}>
              <h2>Comment vous sentez-vous après cette séance?</h2>
              <div className={styles.moodSelector}>
                {(Object.keys(moodEmojis) as Array<Mood>).map(mood => (
                  <button
                    key={mood}
                    type="button"
                    className={`${styles.moodButton} ${formData.mood === mood ? styles.selectedMood : ''}`}
                    onClick={() => handleMoodSelect(mood)}
                  >
                    <span className={styles.moodEmoji}>
                      {moodEmojis[mood]}
                    </span>
                    <span className={styles.moodLabel}>
                      {moodLabels[mood]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Niveau de douleur</h2>
              <div className={styles.painRating}>
                {[0, 1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    type="button"
                    className={`${styles.painButton} ${formData.painLevel === level ? styles.selectedPain : ''}`}
                    onClick={() => handlePainSelect(level as Pain)}
                  >
                    <span className={styles.painValue}>{level}</span>
                    {level === 0 && <span className={styles.painLabel}>Aucune</span>}
                    {level === 5 && <span className={styles.painLabel}>Sévère</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Progrès perçu</h2>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  name="progress"
                  value={formData.progress}
                  onChange={handleSliderChange}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>Minimal</span>
                  <span>{formData.progress}%</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2>Vos impressions</h2>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleTextChange}
                placeholder="Décrivez comment s'est passée votre séance..."
                className={styles.feedbackInput}
              />
            </div>

            <div className={styles.section}>
              <h2>Objectifs pour la prochaine séance</h2>
              <div className={styles.goalsList}>
                {formData.goals.map((goal, index) => (
                  <div key={`goal-${index}`} className={styles.goalItem}>
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => handleGoalChange(index, e.target.value)}
                      placeholder="Nouvel objectif"
                      className={styles.goalInput}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Réussites de cette séance</h2>
              <div className={styles.achievementsList}>
                {formData.achievements.map((achievement, index) => (
                  <div key={`achievement-${index}`} className={styles.achievementItem}>
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, e.target.value)}
                      placeholder="Nouvelle réussite"
                      className={styles.achievementInput}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button 
                type="button" 
                className={styles.saveButton}
                onClick={saveDebrief}
              >
                <FaSave /> Enregistrer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SessionDebrief;
