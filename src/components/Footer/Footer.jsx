import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Бренд */}
        <div className="footer-col">
          <h3 className="footer-logo">ToyStore</h3>
          <p className="footer-text">Развивающие игрушки для детей от 3 лет</p>
        </div>

        {/* Навигация */}
        <div className="footer-col">
          <h4 className="footer-heading">Разделы</h4>
          <nav className="footer-links">
            <Link to="/catalog">Каталог</Link>
            <Link to="/account">Личный кабинет</Link>
            <a href="#contacts">Контакты</a>
          </nav>
        </div>

        {/* Контакты */}
        <div className="footer-col">
          <h4 className="footer-heading">Связаться</h4>
          <p className="footer-text">+7 (999) 999-99-99</p>
          <p className="footer-text">eetk@mail.ru</p>
        </div>

      </div>

      {/* Копирайт */}
      <div className="footer-bottom">
        <p>© {year} ToyStore. Все права защищены.</p>
      </div>
    </footer>
  );
}