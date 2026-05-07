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
      navigate('/');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Регистрация</h1>
        
        <form className="signup-form" onSubmit={handleSignUp}>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required disabled={loading} autoComplete="email"/>
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Минимум 6 символов" minLength={6} required disabled={loading} autoComplete="new-password"/>
          </div>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn-submit"disabled={loading}>
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