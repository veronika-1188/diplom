import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import './add_to_cart.css'

export default function AddToCart({ product }) {
  const { user } = useAuth();
  const [isInCart, setIsInCart] = useState(false);

  // Проверяем наличие товара при загрузке
  useEffect(() => {
    if (!user) return;

    async function checkCart() {
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (cart) {
        const { data: existing } = await supabase
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
    if (!user) return alert('Войдите в аккаунт');
    if (isInCart) return alert('Товар уже в корзине');

    try {
      let { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!cart) {
        const { data: newCart } = await supabase
          .from('carts')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        cart = newCart;
      }

      const { data: existing } = await supabase
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={addToCart} disabled={isInCart} className={`btn-add ${isInCart ? 'in-cart' : ''}`}>
      {isInCart ? 'В корзине' : 'Добавить'}
    </button>
  );
}