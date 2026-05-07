import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import { useAvailablePrize } from '../../hooks/useAvailablePrize';
import { applyPrizeDiscount } from '../../utils/applyPrizeDiscount';
import './cart.css';

export default function Cart() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartId, setCartId] = useState(null);
    const { prize, loading: prizeLoading } = useAvailablePrize();

    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const {  data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).single();
                if (!cart?.id) { setLoading(false); return; }
                
                setCartId(cart.id);
                const {  data: cartItems } = await supabase
                    .from('cart_items')
                    .select('id, quantity, product:product_id(id, name, price, image_url)')
                    .eq('cart_id', cart.id);
                
                setItems(cartItems || []);
            } catch (e) { console.error(e); setItems([]); }
            finally { setLoading(false); }
        })();
    }, [user]);

    const total = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
    const { total: finalTotal, items: finalItems, label: prizeLabel } = applyPrizeDiscount(prize?.text, total, items);

    const updateQ = async (id, qty) => {
        const method = qty < 1 ? 'delete' : 'update';
        const params = qty < 1 ? {} : { quantity: qty };
        const { error } = await supabase.from('cart_items')[method](params).eq('id', id);
        if (!error) {
            setItems(prev => qty < 1 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
            window.dispatchEvent(new Event('cart-updated'));
        }
    };

    const deleteCart = async () => {
        const { error } = await supabase.from('cart_items').delete().eq('cart_id', cartId);
        if (!error) { setItems([]); window.dispatchEvent(new Event('cart-updated')); }
    };

    if (!user) return <p className="cart-empty">Войдите в аккаунт</p>;
    if (loading || prizeLoading) return <Loading />;
    if (!finalItems.length) return <p className="cart-empty">Корзина пуста <Link to="/catalog">Вернуться в каталог</Link></p>;

    return (
        <div className="cart-container">
            <div className="cart__header">
                <h1 className="cart__header-title">Корзина</h1>
                <button className="cart__header-delete-all" onClick={deleteCart}>Очистить</button>
            </div>

            {finalItems.map(item => (
                <div key={item.id} className="cart-item">
                    <img src={item.product?.image_url || '/placeholder.png'} alt={item.product?.name} className="cart-item-image" onError={e => e.target.src = '/placeholder.png'} />
                    <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.product?.name}{item.is_gift && <span className="gift-badge"> </span>}</h4>
                        <p className="cart-item-price">{item.price === 0 ? 'Бесплатно' : `${item.product?.price} ₽`}</p>
                    </div>
                    {!item.is_gift && (
                        <div className="cart-item-quantity">
                            <button onClick={() => updateQ(item.id, item.quantity - 1)}>−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQ(item.id, item.quantity + 1)}>+</button>
                        </div>
                    )}
                    <strong className="cart-item-total">{(item.product?.price || 0) * item.quantity} ₽</strong>
                </div>
            ))}

            {prizeLabel && <div className="cart-prize">{prizeLabel}</div>}

            <div className="cart-summary">
                {prizeLabel && <div className="cart-total-old"><span className="price-strikethrough">{total} ₽</span></div>}
                <div className="cart-total-new"><strong className="price-final">{finalTotal} ₽</strong></div>
                <Link to="/order" state={{ cartItems: finalItems, totalPrice: finalTotal, cartId, prizeId: prize?.id }}>
                    <button className="btn-checkout">Оформить заказ</button>
                </Link>
            </div>
        </div>
    );
}