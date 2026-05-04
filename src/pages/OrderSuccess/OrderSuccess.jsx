// pages/OrderSuccess/OrderSuccess.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import PrizeWheelModal from '../../components/WheelModal/WheelModal';
import { useAuth } from '../../contexts/AuthContext';
import './order-success.css';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { totalPrice = 0, orderDate = '' } = location.state || {};
  
  const [showWheel, setShowWheel] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);

  // 🔒 Защита: если зашли напрямую — редирект
  useEffect(() => {
    if (!location.state?.totalPrice) {
      navigate('/', { replace: true });
    } else {
      // Показываем колесо через 1.5 секунды после загрузки
      const timer = setTimeout(() => setShowWheel(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate]);

  // Обработка выигрыша
  const handlePrizeWon = (prizeText, prizeIndex) => {
    setWonPrize({ text: prizeText, index: prizeIndex });
    
    // 🔹 Опционально: применить скидку к следующему заказу
    // Например, сохранить в контекст или куки
    if (prizeIndex !== 5) { // Если не "Скидок нет"
      document.cookie = `lastPrize=${encodeURIComponent(prizeText)}; max-age=${30*24*60*60}; path=/`;
    }
  };

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        
        <div className="success-icon">✓</div>
        
        <h1 className="success-title">Заказ оформлен!</h1>
        
        <p className="success-text">
          Спасибо за покупку. Менеджер свяжется с вами в ближайшее время.
        </p>

        {/* Показываем приз, если уже выиграли */}
        {wonPrize && (
          <div className="won-prize-banner">
            <span className="won-prize__icon">🎉</span>
            <div>
              <strong>Ваш приз:</strong> {wonPrize.text}
            </div>
            {wonPrize.index !== 5 && (
              <small>Применится автоматически при следующем заказе</small>
            )}
          </div>
        )}

        <div className="order-details">
          <div className="detail-row">
            <span>Дата заказа:</span>
            <strong>{orderDate}</strong>
          </div>
          <div className="detail-row">
            <span>Сумма:</span>
            <strong className="success-total">{totalPrice} ₽</strong>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/" className="btn-primary">На главную</Link>
          <Link to="/catalog" className="btn-secondary">В каталог</Link>
        </div>

      </div>

      {/* 🎡 Колесо удачи — показываем после заказа */}
      {showWheel && !wonPrize && (
        <PrizeWheelModal 
          onClose={() => setShowWheel(false)}
          onPrizeWon={handlePrizeWon}
          user={user}
        />
      )}
      
      
    </div>
  );
}