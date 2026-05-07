// components/AddToCart/AddToCart.jsx
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './add_to_cart.css';

export default function AddToCart({ product }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Проверяем наличие товара при загрузке
  useEffect(() => {
    if (!user) return;

    async function checkCart() {
      const {  data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (cart) {
        const {  data: existing } = await supabase
          .from('cart_items')
          .select('id')
          .eq('cart_id', cart.id)
          .eq('product_id', product.id)
          .maybeSingle();

        setIsInCart(!!existing);
      }
    }
    checkCart();
  }, [user, product]);

  const addToCart = async () => {
    if (!user) {
      setShowModal(true); // 👈 Показываем модальное окно вместо alert
      return;
    }
    if (isInCart) return;

    try {
      let {  data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!cart) {
        const {  data: newCart } = await supabase
          .from('carts')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        cart = newCart;
      }

      const {  data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cart.id)
        .eq('product_id', product.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            product_id: product.id,
            quantity: 1
          });
      }

      setIsInCart(true);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalClose = () => setShowModal(false);
  const handleSignIn = () => {
    setShowModal(false);
    navigate('/signin');
  };

  return (
    <>
      <button 
        onClick={addToCart} 
        disabled={isInCart} 
        className={`btn-add ${isInCart ? 'in-cart' : ''}`}
      >
        {isInCart ? 'В корзине' : 'Добавить'}
      </button>

      {/* 🔹 Модальное окно входа */}
      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleModalClose}>✕</button>
            
            <div className="modal-icon">🔐</div>
            <h3 className="modal-title">Войдите в аккаунт</h3>
            <p className="modal-text">
              Чтобы добавить товар в корзину, нужно авторизоваться. Это займёт всего минуту!
            </p>
            
            <div className="modal-actions">
              <button className="btn-secondary" onClick={handleModalClose}>
                Отмена
              </button>
              <button className="btn-primary" onClick={handleSignIn}>
                Войти
              </button>
            </div>
            
            <p className="modal-hint">
              Нет аккаунта? <button className="link-btn" onClick={() => { handleModalClose(); navigate('/signup'); }}>Зарегистрироваться</button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}