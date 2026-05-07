import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './order.css';
import Loading from '../../components/Loading/Loading';

export default function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const { cartItems = [], totalPrice = 0, cartId = null, prizeId = null } = location.state || {};
  
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    deliveryDate: '',
    payment: 'nal'
  });
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const itemsToSave = cartItems
        .filter(item => !item.is_gift)
        .map(item => ({ product_id: item.product_id, quantity: item.quantity, price_at_time: item.product?.price || 0, product_name: item.product?.name || 'Товар'
        }));
      const {  data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({ user_id: user.id, phone: formData.phone, address: formData.address, delivery_date: formData.deliveryDate, payment_method: formData.payment, total_price: totalPrice
        })
        .select('id')
        .single();
      if (orderErr) throw orderErr;
      if (itemsToSave.length > 0) {
        const itemsWithOrder = itemsToSave.map(i => ({ ...i, order_id: order.id }));
        const { error: itemsErr } = await supabase.from('order_items').insert(itemsWithOrder);
        if (itemsErr) throw itemsErr;
      }
      if (cartId) {
        await supabase.from('cart_items').delete().eq('cart_id', cartId);
        window.dispatchEvent(new Event('cart-updated'));
      }

      if (prizeId) {
        await supabase.from('user_prizes').delete().eq('id', prizeId);
      }
      navigate('/order-success', { 
        state: { 
          totalPrice,
          orderDate: new Date().toLocaleDateString('ru-RU')
        } 
      });
    } catch (err) {
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading || !cartItems.length) {
    return <Loading/>;
  }
  return (
    <div className="order-container">
      <h1 className="order-title">Оформление</h1>
      
      <div className="order-summary-mini">
        <p>Товаров: {cartItems.filter(i => !i.is_gift).reduce((sum, i) => sum + (i.quantity || 1), 0)} шт.</p>
        <p><strong>Итого: {totalPrice} ₽</strong></p>
      </div>
      <form className="order-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Телефон *</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+7 (___) ___-__-__" required disabled={loading} />
        </div>
        <div className="form-group">
          <label>Адрес *</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Улица, дом, квартира" required disabled={loading} />
        </div>
        <div className="form-group">
          <label>Дата доставки *</label>
          <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} min={today} required disabled={loading} />
        </div>
        <div className="form-group">
          <label>Оплата</label>
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" name="payment" value="nal" checked={formData.payment === 'nal'} onChange={handleChange} disabled={loading} /> Наличные
            </label>
            <label className="radio-option">
              <input type="radio" name="payment" value="beznal" checked={formData.payment === 'beznal'} onChange={handleChange} disabled={loading} /> Карта
            </label>
          </div>
        </div>
        <div className="order-actions">
          <button type="button" className="btn-back" onClick={() => navigate(-1)} disabled={loading}>Назад</button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Отправка...' : `Заказать`}
          </button>
        </div>
      </form>
    </div>
  );
}