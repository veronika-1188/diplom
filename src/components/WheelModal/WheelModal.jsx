// components/PrizeWheel/PrizeWheelModal.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // 👈 Импорт supabase
import Wheel from '../Wheel/Wheel'; // 👈 Проверьте путь!
import './wheel-modal.css';

export default function WheelModal({ onClose, onPrizeWon, user }) {
  const [showWheel, setShowWheel] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  // Показываем колесо с небольшой задержкой
  useEffect(() => {
    const timer = setTimeout(() => setShowWheel(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // 🟢 Функция сохранения результата (исправленная)
  const saveResultToHistory = async (prizeText, prizeIndex) => {
    // 1. Сохраняем в localStorage (резерв)
    const wonPrizes = JSON.parse(localStorage.getItem('wonPrizes') || '[]');
    wonPrizes.push({ 
      prize: prizeText, 
      index: prizeIndex, 
      date: new Date().toISOString() 
    });
    localStorage.setItem('wonPrizes', JSON.stringify(wonPrizes));

    // 2. Если пользователь авторизован — сохраняем в базу
    if (user?.id) {
      try {
        await supabase
          .from('user_prizes')
          .insert({
            user_id: user.id,
            prize: prizeText
          });
        console.log('✅ Приз сохранён в базу');
      } catch (err) {
        console.error('❌ Ошибка сохранения приза:', err);
        // Не прерываем работу, приз уже в localStorage
      }
    }

    // 3. Передаём приз наверх и обновляем состояние
    onPrizeWon?.(prizeText, prizeIndex);
    setHasSpun(true);
  };

  // Заглушка для stats
  const updateStats = () => {};

  const stats = {
    todayAttempts: hasSpun ? 5 : 0,
    totalSpins: hasSpun ? 1 : 0
  };

  return (
    <div className={`wheel-modal ${showWheel ? 'visible' : ''}`}>
      <div className="wheel-modal__overlay" onClick={onClose} />
      
      <div className="wheel-modal__content">
        <button className="wheel-modal__close" onClick={onClose}>✕</button>
        
        <h2 className="wheel-modal__title">🎁 Испытай удачу!</h2>
        <p className="wheel-modal__subtitle">
          Крути колесо и получи скидку на следующий заказ
        </p>
        
        <Wheel 
          saveResultToHistory={saveResultToHistory}
          updateStats={updateStats}
          stats={stats}
        />
        
        <p className="wheel-modal__hint">
          {hasSpun 
            ? '✨ Приз уже ваш! Используйте его при следующем заказе.' 
            : 'Одна попытка на заказ • Удачи! 🍀'}
        </p>
      </div>
    </div>
  );
}