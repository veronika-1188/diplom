// pages/Order/Order.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './Order.css';
import OrderSuccess from '../OrderSuccess/OrderSuccess';

export default function Order() {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Получаем доступ к state
  const { user } = useAuth();
  
  // 👇 Принимаем данные из корзины (или пустые значения)
  const { cartItems = [], totalPrice = 0, cartId = null } = location.state || {};
  
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    deliveryDate: '',
    payment: 'nal'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔒 Защита: если нет данных и пользователь зашёл напрямую на /order
  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    // Если нет товаров в корзине — редирект назад
    if (!cartItems.length && !loading) {
      navigate('/cart', { replace: true });
    }
  }, [user, cartItems, navigate, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 👇 Используем переданные данные — без лишних запросов!
      const itemsToSave = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_time: item.product?.price || 0,
        product_name: item.product?.name || 'Товар'
      }));

      // 1. Создаём заказ
      const {  data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          phone: formData.phone,
          address: formData.address,
          delivery_date: formData.deliveryDate,
          payment_method: formData.payment,
          total_price: totalPrice // 👇 Берём из пропсов
        })
        .select('id')
        .single();

      if (orderErr) throw orderErr;

      // 2. Сохраняем товары заказа
      if (itemsToSave.length > 0) {
        const itemsWithOrder = itemsToSave.map(i => ({
          ...i,
          order_id: order.id
        }));
        
        const { error: itemsErr } = await supabase
          .from('order_items')
          .insert(itemsWithOrder);
        
        if (itemsErr) throw itemsErr;
      }

      // 3. Очищаем корзину (если есть cartId)
      if (cartId) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cartId);
      }

      // 4. Успех!
      setSubmitted(true);
      navigate('/order-success', { 
        state: { 
          totalPrice: totalPrice,
          orderDate: new Date().toLocaleDateString('ru-RU')
        } 
      });

    } catch (err) {
      console.error('Order error:', err);
      alert('Не удалось оформить заказ. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];



  // 🟢 Загрузка или защита
  if (loading || !cartItems.length) {
    return <div className="order-loading">Проверка данных...</div>;
  }

  // 🟢 Основная форма
  return (
    <div className="order-container">
      <h1 className="order-title">Оформление</h1>
      
      {/* 👇 Показываем состав заказа для уверенности пользователя */}
      <div className="order-summary-mini">
        <p>Товаров: {cartItems.reduce((sum, i) => sum + i.quantity, 0)} шт.</p>
        <p><strong>Итого: {totalPrice} ₽</strong></p>
      </div>
      
      <form className="order-form" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Телефон *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7 (___) ___-__-__"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Адрес *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Улица, дом, квартира"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Дата доставки *</label>
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            min={today}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Оплата</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="payment"
                value="nal"
                checked={formData.payment === 'nal'}
                onChange={handleChange}
                disabled={loading}
              />
              Наличные
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="payment"
                value="beznal"
                checked={formData.payment === 'beznal'}
                onChange={handleChange}
                disabled={loading}
              />
              Карта
            </label>
          </div>
        </div>

        <div className="order-actions">
          <button 
            type="button" 
            className="btn-back" 
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Назад
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Отправка...' : `Заказать за ${totalPrice} ₽`}
          </button>
        </div>

      </form>
    </div>
  );
}