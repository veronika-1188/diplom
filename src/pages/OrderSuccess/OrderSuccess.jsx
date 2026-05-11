import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import WheelModal from '../../components/WheelModal/WheelModal';
import { useAuth } from '../../contexts/AuthContext';
import './order-success.css';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { totalPrice = 0, orderDate = '' } = location.state || {};
  
  const [showWheel, setShowWheel] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);

  useEffect(() => {
    if (!location.state?.totalPrice) {
      navigate('/', { replace: true });
    } else {
      setShowWheel(true);
    }
  }, [location.state, navigate]);

  const handlePrizeWon = (prizeText, prizeIndex) => {
    setWonPrize({ text: prizeText, index: prizeIndex });
    setShowWheel(false); 
  };

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        
        <div className="success-icon">✓</div>
        
        <h1 className="success-title">Заказ оформлен!</h1>
        
        <p className="success-text">
          Спасибо за покупку. Менеджер свяжется с вами в ближайшее время.
        </p>

        {wonPrize && (
          <div className="won-prize-banner">
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

      {showWheel && !wonPrize && (
        <WheelModal 
          closeModal={() => setShowWheel(false)}
          onPrizeWon={handlePrizeWon}
          user={user}
        />
      )}
      
      
    </div>
  );
}