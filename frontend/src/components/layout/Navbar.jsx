import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🎾 PadelZGZ</Link>

      <div style={styles.links}>
        <NavLink to="/" style={({ isActive }) => isActive ? styles.linkActive : styles.link} end>
          Pistas
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/mis-reservas" style={({ isActive }) => isActive ? styles.linkActive : styles.link}>
              Mis Reservas
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" style={({ isActive }) => isActive ? styles.linkActive : styles.link}>
                Dashboard
              </NavLink>
            )}
            <span style={styles.userName}>👤 {user?.name}</span>
            <button onClick={handleLogout} style={styles.btnLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={({ isActive }) => isActive ? styles.linkActive : styles.link}>
              Iniciar sesión
            </NavLink>
            <NavLink to="/register" style={styles.btnRegister}>
              Registrarse
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2rem', height: '64px', background: '#1a1a2e',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100,
  },
  brand: {
    color: '#4ade80', fontWeight: 700, fontSize: '1.3rem', textDecoration: 'none', letterSpacing: '0.5px',
  },
  links: { display: 'flex', alignItems: 'center', gap: '1rem' },
  link: { color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem', padding: '0.3rem 0.6rem', borderRadius: '4px' },
  linkActive: { color: '#4ade80', textDecoration: 'none', fontSize: '0.95rem', padding: '0.3rem 0.6rem', borderRadius: '4px', fontWeight: 600 },
  userName: { color: '#94a3b8', fontSize: '0.9rem' },
  btnLogout: {
    background: 'transparent', border: '1px solid #ef4444', color: '#ef4444',
    padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
  },
  btnRegister: {
    background: '#4ade80', color: '#1a1a2e', fontWeight: 600, padding: '0.35rem 1rem',
    borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem',
  },
};
