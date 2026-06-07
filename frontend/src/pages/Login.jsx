import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  function handleChange(e) {
    clearError();
    setLocalError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setLocalError('Completa todos los campos');
      return;
    }
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch {
      // El error ya lo gestiona el contexto
    }
  }

  const displayError = localError || error;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎾 PadelZGZ</h1>
        <h2 style={styles.subtitle}>Iniciar sesión</h2>

        {displayError && (
          <div style={styles.errorBox}>{displayError}</div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={styles.input}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={isLoading} style={styles.btn}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        {/* cuentas de prueba para loggear */}
        {/* <div style={styles.hint}>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>Cuentas de prueba:</p>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Admin: admin@padelzgz.com / admin123</p>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Usuario: carlos@email.com / user123</p>
        </div> */}

        <p style={styles.register}>
          ¿No tienes cuenta? <Link to="/register" style={styles.link}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
  },
  card: {
    background: '#1e293b', border: '1px solid #334155', borderRadius: '16px',
    padding: '2.5rem', width: '100%', maxWidth: '420px',
  },
  title: { color: '#4ade80', textAlign: 'center', margin: '0 0 0.25rem', fontSize: '1.5rem' },
  subtitle: { color: '#f1f5f9', textAlign: 'center', margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 400 },
  errorBox: {
    background: '#2d1515', border: '1px solid #ef4444', color: '#fca5a5',
    borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 },
  input: {
    padding: '0.65rem 0.8rem', background: '#0f172a', border: '1px solid #334155',
    borderRadius: '8px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none',
  },
  btn: {
    padding: '0.75rem', background: '#4ade80', color: '#1a1a2e', border: 'none',
    borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem',
  },
  hint: {
    background: '#0f172a', borderRadius: '8px', padding: '0.75rem',
    marginTop: '1rem', border: '1px dashed #334155',
  },
  register: { textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginTop: '1rem' },
  link: { color: '#4ade80', fontWeight: 600 },
};
