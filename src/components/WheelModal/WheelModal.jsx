import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Wheel from '../Wheel/Wheel';
import './wheel-modal.css';

export default function WheelModal({ closeModal, onPrizeWon, user }) {
  const [showWheel, setShowWheel] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowWheel(true), 300);
    return () => clearTimeout(timer);
  }, []);
  const saveResultToHistory = async (prizeText, prizeIndex) => {
    if (user?.id) {
      try {
        await supabase.from('user_prizes').insert({
          user_id: user.id,
          prize: prizeText
        });
      } catch (err) {
        console.error('Ошибка сохранения приза:', err);
      }
    }
    onPrizeWon?.(prizeText, prizeIndex);
    setHasSpun(true);
  };
  return (
    <div className={`wheel-modal ${showWheel ? 'visible' : ''}`}>
      <div className="wheel-modal__overlay" onClick={closeModal} />
      <div className="wheel-modal__content">
        <button className="wheel-modal__close" onClick={closeModal}>✕</button>
        <h2 className="wheel-modal__title">Испытай удачу!</h2>
        <Wheel saveResultToHistory={saveResultToHistory} />
        <p className="wheel-modal__hint">
          {hasSpun ? 'Приз сохранён! Применится в корзине.' : 'Крути и выигрывай!'}
        </p>
      </div>
    </div>
  );
}