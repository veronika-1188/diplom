// pages/Account/Account.jsx
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './account.css';

export default function Account() {
  const { user, signOut } = useAuth(); // 👈 Получаем функцию выхода
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(); // 👈 Вызываем выход из AuthContext
      navigate('/');   // 👈 Редирект на главную после выхода
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      alert('Не удалось выйти из аккаунта');
    }
  };

  if (!user) {
    return (
      <div className="account-empty">
        <h1>Профиль</h1>
        <p>Вы не авторизованы</p>
        <button className="btn-primary" onClick={() => navigate('/signin')}>
          Войти
        </button>
      </div>
    );
  }

  return (
    <div className="account-container">
      <h1 className="account-title">Профиль</h1>
      
      <div className="account-card">
        <div className="account-info">
          <div className="account-avatar">
            {user.email?.[0]?.toUpperCase() || 'U'}
          </div>
          
          <div className="account-details">
            <p className="account-email">{user.email}</p>
            <p className="account-id">ID: {user.id?.slice(0, 8)}...</p>
          </div>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}