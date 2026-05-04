// pages/Auth/SignUp/SignUp.jsx
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import './sign-up.css';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });

    if (error) {
      setError(error.message);
    } else if (data.session) {
      // ✅ Пользователь сразу вошёл (если не требуется подтверждение почты)
      console.log('✅ Регистрация + вход!', data.user);
      navigate('/');
    } else {
      // ⏳ Требуется подтверждение почты
      setSuccess(true);
    }
    setLoading(false);
  };

  // 🟢 Экран успеха (подтверждение почты)
  if (success) {
    return (
      <div className="signup-container">
        <div className="signup-card signup-success">
          <div className="success-icon">✓</div>
          <h2>Проверьте почту</h2>
          <p>Мы отправили ссылку для подтверждения на <strong>{email}</strong></p>
          <button className="btn-secondary" onClick={() => navigate('/signin')}>
            Вернуться ко входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Регистрация</h1>
        
        <form className="signup-form" onSubmit={handleSignUp}>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              minLength={6}
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

        </form>

        <p className="signup-footer">
          Уже есть аккаунт? <Link to="/signin" className="link">Войти</Link>
        </p>
      </div>
    </div>
  );
}