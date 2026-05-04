// pages/Auth/SignIn/SignIn.jsx
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import './sign-in.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log('✅ Успешный вход!', data.user);
      navigate('/'); // 👈 Редирект на главную, а не на /signin
    }
    setLoading(false);
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1 className="signin-title">Вход</h1>
        
        <form className="signin-form" onSubmit={handleSignIn}>
          
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
      </div>
    </div>
  );
}