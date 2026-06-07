import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [localError, setLocalError] = useState('');

  function handleChange(e) {
    clearError();
    setLocalError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setLocalError('Completa todos los campos');
      return;
    }
    if (form.password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (form.password !== form.confirm) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    try {
      await register(form.name, form.email, form.password);
      navigate('/', { replace: true });
    } catch {
      // error gestionado por el contexto
    }
  }

  const displayError = localError || error;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎾 PadelZGZ</h1>
        <h2 style={styles.subtitle}>Crear cuenta</h2>

        {displayError && <div style={styles.errorBox}>{displayError}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Nombre completo</label>
            <input
              type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="Tu nombre" style={styles.input} autoComplete="name"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="tu@email.com" style={styles.input} autoComplete="email"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="Mínimo 6 caracteres" style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Confirmar contraseña</label>
            <input
              type="password" name="confirm" value={form.confirm} onChange={handleChange}
              placeholder="Repite la contraseña" style={styles.input}
            />
          </div>
          <button type="submit" disabled={isLoading} style={styles.btn}>
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p style={styles.login}>
          ¿Ya tienes cuenta? <Link to="/login" style={styles.link}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px' },
  title: { color: '#4ade80', textAlign: 'center', margin: '0 0 0.25rem', fontSize: '1.5rem' },
  subtitle: { color: '#f1f5f9', textAlign: 'center', margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 400 },
  errorBox: { background: '#2d1515', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500 },
  input: { padding: '0.65rem 0.8rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none' },
  btn: { padding: '0.75rem', background: '#4ade80', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  login: { textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginTop: '1rem' },
  link: { color: '#4ade80', fontWeight: 600 },
};
