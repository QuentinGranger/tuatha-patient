'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { IoChevronBack, IoArrowBack, IoMenu } from 'react-icons/io5';
import { FiChevronDown } from 'react-icons/fi';
import styles from './CalendarHeader.module.css';

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onToday: () => void;
  displayDays?: boolean;
  useHamburger?: boolean;
  onBack?: () => void;
  onMenuToggle?: () => void;
}

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onDateChange,
  onToday,
  displayDays = true,
  useHamburger = false,
  onBack,
  onMenuToggle
}) => {
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const monthPickerRef = useRef<HTMLDivElement>(null);
  
  // Générer les dates pour la semaine courante
  const generateWeekDays = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    
    return Array(7).fill(0).map((_, index) => {
      const d = new Date(date);
      d.setDate(diff + index);
      return d;
    });
  };
  
  const [weekDays, setWeekDays] = useState(generateWeekDays(currentDate));
  
  useEffect(() => {
    setWeekDays(generateWeekDays(currentDate));
  }, [currentDate]);
  
  // Gérer le swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // Swipe horizontal d'au moins 50px
    if (Math.abs(diff) > 50) {
      const newDate = new Date(currentDate);
      
      // Swipe gauche -> semaine suivante
      if (diff > 0) {
        newDate.setDate(newDate.getDate() + 7);
      } 
      // Swipe droite -> semaine précédente
      else {
        newDate.setDate(newDate.getDate() - 7);
      }
      
      onDateChange(newDate);
    }
  }, [touchStartX, currentDate, onDateChange]);
  
  // Fermer le sélecteur de mois si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target as Node)) {
        setIsMonthPickerOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const navigateMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    onDateChange(newDate);
  };
  
  const selectMonthYear = (month: number, year: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    newDate.setFullYear(year);
    onDateChange(newDate);
    setIsMonthPickerOpen(false);
  };
  
  // Générer les options de mois et années pour le sélecteur
  const generateMonthYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 3 }, (_, i) => currentYear - 1 + i);
    
    return (
      <div className={styles.monthPickerOptions}>
        {years.map(year => (
          <div key={year} className={styles.yearSection}>
            <div className={styles.yearHeader}>{year}</div>
            <div className={styles.monthsGrid}>
              {MONTHS_FR.map((month, idx) => (
                <button
                  key={`${year}-${idx}`}
                  className={`${styles.monthOption} ${
                    currentDate.getMonth() === idx && currentDate.getFullYear() === year 
                      ? styles.selectedMonth 
                      : ''
                  }`}
                  onClick={() => selectMonthYear(idx, year)}
                >
                  {month.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className={styles.calendarHeaderWrapper} ref={headerRef}>
      <div 
        className={styles.calendarHeader}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.headerLeft}>
          {useHamburger ? (
            <button className={styles.iconButton} onClick={onMenuToggle}>
              <IoMenu size={24} />
            </button>
          ) : (
            <button className={styles.iconButton} onClick={onBack}>
              <IoArrowBack size={20} />
            </button>
          )}
          
          <div className={styles.monthYearSelector} ref={monthPickerRef}>
            <button 
              className={styles.currentMonth}
              onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
            >
              <span>{MONTHS_FR[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
              <FiChevronDown size={16} className={isMonthPickerOpen ? styles.rotated : ''} />
            </button>
            
            {isMonthPickerOpen && (
              <div className={styles.monthPicker}>
                <div className={styles.monthPickerHeader}>
                  <button 
                    className={styles.monthNavButton}
                    onClick={() => navigateMonth(-1)}
                  >
                    <IoChevronBack size={18} />
                  </button>
                  <span>{MONTHS_FR[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                  <button 
                    className={styles.monthNavButton}
                    onClick={() => navigateMonth(1)}
                  >
                    <IoChevronBack size={18} className={styles.rotateIcon} />
                  </button>
                </div>
                {generateMonthYearOptions()}
              </div>
            )}
          </div>
        </div>
        
        <button className={styles.todayButton} onClick={onToday}>
          Aujourd'hui
        </button>
      </div>
      
      {displayDays && (
        <div className={styles.daysOfWeek}>
          <div className={styles.weekDays}>
            {DAYS_FR.map((day, index) => (
              <div key={day} className={styles.dayName}>
                {day}
              </div>
            ))}
          </div>
          
          <div className={styles.dateNumbers}>
            {weekDays.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = date.toDateString() === currentDate.toDateString();
              
              return (
                <div
                  key={index}
                  className={`${styles.dateNumber} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
                  onClick={() => onDateChange(date)}
                >
                  <span>{date.getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarHeader;
