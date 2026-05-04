// components/Header/Header.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/img/logo.svg';
import cart from '../../assets/img/cart.svg';
import './header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth(); // ✅ Проверка авторизации оставлена

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="header">
            <div className="header-container">
                
                {/* Логотип */}
                <NavLink to="/" className="header-logo" onClick={closeMenu}>
                    <img src={logo} alt="Логотип" />
                </NavLink>

                {/* Мобильное меню */}
                <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
                    <NavLink to="/" className="header-link" onClick={closeMenu}>Главная</NavLink>
                    <NavLink to="/catalog" className="header-link" onClick={closeMenu}>Каталог</NavLink>
                    <NavLink to="/account" className="header-link" onClick={closeMenu}>Профиль</NavLink>
                    
                    {/* ✅ Показываем "Войти", только если пользователь НЕ авторизован */}
                    {!user && (
                        <NavLink to="/signin" className="header-link" onClick={closeMenu}>
                            Войти
                        </NavLink>
                    )}
                </nav>

                {/* Правая часть: корзина + бургер */}
                <div className="header-actions">
                    <NavLink to="/cart" className="header-cart" onClick={closeMenu}>
                        <img src={cart} alt="Корзина" />
                    </NavLink>

                    <button 
                        className={`burger-btn ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>

            {/* Затемнение фона (оверлей) */}
            {isMenuOpen && (
                <div className="menu-overlay" onClick={closeMenu} />
            )}
        </header>
    );
};

export default Header;