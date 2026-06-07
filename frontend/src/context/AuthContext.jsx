import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

// ── Estado inicial ──────────────────────────────────────────────
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // true al inicio mientras verificamos el token guardado
  error: null,
};

// ── Reducer ─────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_INIT_DONE':
      return { ...state, isLoading: false };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

// ── Contexto ────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Al montar: restaurar sesión desde localStorage
  useEffect(() => {
    const token = localStorage.getItem('padelzgz_token');
    const user = localStorage.getItem('padelzgz_user');
    if (token && user) {
      // Verificar que el token sigue siendo válido
      authService
        .getMe()
        .then((freshUser) => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: freshUser, token },
          });
        })
        .catch(() => {
          // Token expirado: limpiar
          localStorage.removeItem('padelzgz_token');
          localStorage.removeItem('padelzgz_user');
          dispatch({ type: 'AUTH_INIT_DONE' });
        });
    } else {
      dispatch({ type: 'AUTH_INIT_DONE' });
    }
  }, []);

  // ── Acciones ────────────────────────────────────────────────
  async function login(email, password) {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('padelzgz_token', data.token);
      localStorage.setItem('padelzgz_user', JSON.stringify(data.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al iniciar sesión';
      dispatch({ type: 'SET_ERROR', payload: msg });
      throw err;
    }
  }

  async function register(name, email, password) {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const data = await authService.register(name, email, password);
      localStorage.setItem('padelzgz_token', data.token);
      localStorage.setItem('padelzgz_user', JSON.stringify(data.user));
      dispatch({ type: 'REGISTER_SUCCESS', payload: data });
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al registrarse';
      dispatch({ type: 'SET_ERROR', payload: msg });
      throw err;
    }
  }

  function logout() {
    localStorage.removeItem('padelzgz_token');
    localStorage.removeItem('padelzgz_user');
    dispatch({ type: 'LOGOUT' });
  }

  function clearError() {
    dispatch({ type: 'CLEAR_ERROR' });
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook personalizado ──────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
