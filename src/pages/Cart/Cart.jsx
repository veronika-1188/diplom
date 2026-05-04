// pages/Cart/Cart.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import './cart.css';

export default function Cart() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartId, setCartId] = useState(null); // 👈 Новый стейт

    useEffect(() => {
        if (!user) return;

        async function loadCart() {
            try {
                const {  data: cart, error: cartError } = await supabase
                    .from('carts')
                    .select('id')
                    .eq('user_id', user.id)
                    .single();

                if (cartError && cartError.code !== 'PGRST116') {
                    console.error('Ошибка загрузки корзины:', cartError);
                    setLoading(false);
                    return;
                }

                if (!cart) {
                    setItems([]);
                    setLoading(false);
                    return;
                }

                setCartId(cart.id); 

                const {  data: cartItems, error: itemsError } = await supabase
                    .from('cart_items')
                    .select(`
                        id,
                        quantity,
                        product:product_id (id, name, price, image_url)
                    `)
                    .eq('cart_id', cart.id);

                if (itemsError) {
                    console.error('Ошибка загрузки товаров:', itemsError);
                    setItems([]);
                } else {
                    setItems(cartItems || []);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        }

        loadCart();
    }, [user]);

    const updateQty = async (itemId, qty) => {
        if (qty < 1) {
            const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
            if (!error) {
                setItems(prev => prev.filter(i => i.id !== itemId));
            }
            return;
        }

        const { error } = await supabase
            .from('cart_items')
            .update({ quantity: qty })
            .eq('id', itemId);

        if (!error) {
            setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: qty } : i));
        }
    };

   const deleteAll = async () => {
  const { error } = await supabase.from('cart_items').delete().eq('cart_id', cartId);

  if (!error) {
    setItems([]); 
  } else {
    console.error('Ошибка очистки корзины:', error);
    alert('Не удалось очистить корзину');
  }
};

    if (!user) return <p className="cart-empty">Войдите в аккаунт</p>;
    if (loading) return <Loading />;
    if (items.length === 0) {
        return (
            <p className="cart-empty">
                Корзина пуста <Link to="/catalog">Вернуться в каталог</Link>
            </p>
        );
    }



    const total = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

    return (
        <div className="cart-container">
            <div className="cart__header">
                <h1 className="cart__header-title">Корзина</h1>
                <button className="cart__header-delete-all" onClick={
                    deleteAll}>Очистить Корзину</button>
            </div>
            {items.map(item => (
                <div key={item.id} className="cart-item">
                    <img 
                        src={item.product?.image_url || '/placeholder.png'}
                        alt={item.product?.name}
                        className="cart-item-image"
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />

                    <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.product?.name}</h4>
                        <p className="cart-item-price">{item.product?.price} ₽</p>
                    </div>

                    <div className="cart-item-quantity">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    </div>

                    <strong className="cart-item-total">{(item.product?.price || 0) * item.quantity} ₽</strong>
                </div>
            ))}

            <div className="cart-summary">
                <h3>Итого: {total} ₽</h3>
                <Link to="/order"  state={{ 
    cartItems: items,  // массив товаров из стейта
    totalPrice: total, // уже посчитанная сумма
    cartId: cartId     // ID корзины для очистки после заказа
  }}>
                    <button className="btn-checkout">Оформить заказ</button>
                </Link>
            </div>
        </div>
    );
}