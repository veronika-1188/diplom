// pages/Auth/SignIn/SignIn.jsx
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import './sign-in.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState(''); // ← поле-ловушка
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    // 🎯 Honeypot-валидация
    if (honeypot.trim() !== '') {
      console.warn('🚫 Spam attempt blocked on sign-in');
      return; // Тихо игнорируем, не подсказываем боту
    }
    
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      // 🔐 Не раскрываем детали: "неверный пароль" помогает брутфорсу
      // Supabase уже возвращает общее сообщение, но можно дополнительно унифицировать:
      setError('Неверный email или пароль');
    } else {
      console.log('✅ Успешный вход!', data.user);
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1 className="signin-title">Вход</h1>
        
        <form className="signin-form" onSubmit={handleSignIn}>
          
          {/* 🍯 Honeypot field */}
          <div className="honeypot-field" aria-hidden="true">
            <label>
              Не заполняйте это поле:
              <input 
                type="text" 
                name="website_url" 
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
            </label>
          </div>

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
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="current-password"
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
            {loading ? 'Вход...' : 'Войти'}
          </button>

        </form>

        <p className="signin-footer">
          Нет аккаунта? <Link to="/signup" className="link">Зарегистрироваться</Link>
        </p>
        
        <p className="signin-footer">
          <Link to="/reset-password" className="link">Забыли пароль?</Link>
        </p>
      </div>
    </div>
  );
}