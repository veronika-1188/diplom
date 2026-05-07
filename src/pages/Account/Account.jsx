import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './account.css';

export default function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [prize, setPrize] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    async function load() {
      const {  data: prizeData } = await supabase
        .from('user_prizes')
        .select('prize')
        .eq('user_id', user.id)
        .limit(1)
        .single();
      
      if (prizeData) setPrize(prizeData.prize);

      const {  data: ordersData } = await supabase
        .from('orders')
        .select('id, total_price, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (ordersData) setOrders(ordersData);
    }
    load();
  }, [user?.id]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="account-empty">
        <h2>Профиль</h2>
        <p>Вы не авторизованы</p>
        <Link to="/signin" className="btn-primary">Войти</Link>
      </div>
    );
  }

  return (
    <div className="account">
      <div className="account-card">
        <div className="avatar">{user.email?.[0]?.toUpperCase() || 'U'}</div>
        <div className="user-info">
          <p className="email">{user.email}</p>
          <button onClick={handleLogout} className="btn-logout">Выйти</button>
        </div>
      </div>

      {prize && (
        <div className="prize-banner">
          
          <div>
            <strong>Ваш бонус:</strong> {prize}
          </div>
          <Link to="/catalog" className="btn-use">Использовать</Link>
        </div>
      )}

      <h3 className="section-title">Заказы</h3>
      
      {orders.length === 0 ? (
        <p className="empty">
          Пока нет заказов. <Link to="/catalog">Перейти в каталог</Link>
        </p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-item">
              <div className="order-top">
                <span className="order-id">#{order.id?.slice(0, 8)}</span>
              </div>
              <div className="order-bottom">
                <span>{new Date(order.created_at).toLocaleDateString('ru-RU')}</span>
                <strong>{order.total_price} ₽</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}