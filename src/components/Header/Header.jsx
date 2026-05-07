import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/img/logo.svg';
import cartIcon from '../../assets/img/cart.svg'; 
import './header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);  
    const [cartCount, setCartCount] = useState(0);     
    
    const { user } = useAuth();

   
    async function loadCartCount() {
        if (!user?.id) {
            setCartCount(0);
            return;
        }

        try {
            // 
            const {  data: cart } = await supabase
                .from('carts')
                .select('id')                      
                .eq('user_id', user.id)            
                .single();                         

            if (!cart?.id) {
                setCartCount(0);
                return;
            }

            const {  data: items, error: itemsError } = await supabase
                .from('cart_items')
                .select('quantity')             
                .eq('cart_id', cart.id);     

            if (itemsError) throw itemsError;

            const total = items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
            
            setCartCount(total);

        } catch (err) {
            setCartCount(0); 
        }
    }

   
    useEffect(() => {
        loadCartCount();

        const handleCartUpdate = () => {
            loadCartCount();
        };

       
        window.addEventListener('cart-updated', handleCartUpdate);

      
        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
        };

    }, [user?.id]);

   
    const closeMenu = () => setIsMenuOpen(false);
    const toggleMenu = () => setIsMenuOpen(prev => !prev);

   
    return (
        <header className="header">
            <div className="header-container">
                
                <NavLink to="/" className="header-logo" onClick={closeMenu}>
                    <img src={logo} alt="Логотип" />
                </NavLink>

                <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
                    <NavLink to="/" className="header-link" onClick={closeMenu}>Главная</NavLink>
                    <NavLink to="/catalog" className="header-link" onClick={closeMenu}>Каталог</NavLink>
                    <NavLink to="/account" className="header-link" onClick={closeMenu}>Профиль</NavLink>
                    
                    {!user && (
                        <NavLink to="/signin" className="header-link" onClick={closeMenu}>
                            Войти
                        </NavLink>
                    )}
                </nav>

                <div className="header-actions">
                    <NavLink to="/cart" className="header-cart" onClick={closeMenu}>
                        <img src={cartIcon} alt="Корзина" />
                        
                        {cartCount > 0 && (
                            <span className="cart-count">{cartCount}</span>
                        )}
                    </NavLink>

                    <button 
                        className={`burger-btn ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Меню"
                    >
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="menu-overlay" onClick={closeMenu} />
            )}
        </header>
    );
};

export default Header;