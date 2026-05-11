import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import './sign-up.css';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [honeypot, setHoneypot] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (honeypot.trim() !== '') {
      console.warn('Spam blocked');
      return;
    }
    if (!agree) {
      setError('Для регистрации необходимо согласие на обработку персональных данных');
      return;
    }
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
          
          {/* 🍯 Honeypot field - скрытая ловушка для ботов */}
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
              placeholder="Минимум 6 символов" 
              minLength={6} 
              required 
              disabled={loading} 
              autoComplete="new-password"
            />
          </div>

          {/* Чекбокс согласия с ФЗ-152 */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={agree} 
                onChange={(e) => setAgree(e.target.checked)} 
                disabled={loading}
                required
              />
              <span className="checkbox-text">
                Я даю согласие на{' '}
                <Link to="/privacy" target="_blank" className="link">
                  обработку персональных данных
                </Link>{' '}
                в соответствии с{' '}
                <a 
                  href="https://www.consultant.ru/document/cons_doc_LAW_68888/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link"
                >
                  ФЗ-152 «О персональных данных»
                </a>
              </span>
            </label>
          </div>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="form-success" role="status">
              На ваш email отправлено письмо для подтверждения регистрации
            </div>
          )}

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading || !agree}
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