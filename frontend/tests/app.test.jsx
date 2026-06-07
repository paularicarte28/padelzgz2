import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── Tests del reducer de autenticación ──────────────────────────
// Importamos el reducer directamente para testearlo de forma unitaria
// sin tener que montar el Provider completo.

// Definimos el reducer aquí (igual que en AuthContext) para poder testear la lógica pura
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
      return { user: null, token: null, isAuthenticated: false, isLoading: false, error: null };
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

const initialState = {
  user: null, token: null, isAuthenticated: false, isLoading: true, error: null,
};

describe('authReducer', () => {
  it('marca isLoading=false en AUTH_INIT_DONE', () => {
    const state = authReducer(initialState, { type: 'AUTH_INIT_DONE' });
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
  });

  it('LOGIN_SUCCESS guarda usuario y token, isAuthenticated=true', () => {
    const payload = { user: { id: 1, name: 'Carlos', role: 'user' }, token: 'tok123' };
    const state = authReducer(initialState, { type: 'LOGIN_SUCCESS', payload });
    expect(state.isAuthenticated).toBe(true);
    expect(state.user.name).toBe('Carlos');
    expect(state.token).toBe('tok123');
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('LOGOUT resetea el estado', () => {
    const loggedIn = { user: { id: 1 }, token: 'tok', isAuthenticated: true, isLoading: false, error: null };
    const state = authReducer(loggedIn, { type: 'LOGOUT' });
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('SET_ERROR guarda el mensaje de error', () => {
    const state = authReducer(initialState, { type: 'SET_ERROR', payload: 'Credenciales incorrectas' });
    expect(state.error).toBe('Credenciales incorrectas');
    expect(state.isLoading).toBe(false);
  });

  it('CLEAR_ERROR elimina el error existente', () => {
    const withError = { ...initialState, error: 'algo falló' };
    const state = authReducer(withError, { type: 'CLEAR_ERROR' });
    expect(state.error).toBeNull();
  });

  it('SET_LOADING cambia isLoading', () => {
    const state = authReducer(initialState, { type: 'SET_LOADING', payload: false });
    expect(state.isLoading).toBe(false);
  });

  it('acción desconocida devuelve el estado sin cambios', () => {
    const state = authReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });
});

// ── Tests de utilidades (formatters) ────────────────────────────
import { formatDate, formatPrice, getStatusLabel, getTypeLabel } from '../src/utils/formatters';

describe('formatters', () => {
  it('formatDate convierte YYYY-MM-DD a DD/MM/YYYY', () => {
    expect(formatDate('2026-06-10')).toBe('10/06/2026');
  });

  it('formatDate devuelve cadena vacía si no hay fecha', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate(null)).toBe('');
  });

  it('formatPrice añade símbolo y dos decimales', () => {
    expect(formatPrice(14)).toBe('14.00 €');
    expect(formatPrice(9.5)).toBe('9.50 €');
  });

  it('getStatusLabel devuelve etiqueta correcta', () => {
    expect(getStatusLabel('confirmed')).toBe('Confirmada');
    expect(getStatusLabel('cancelled')).toBe('Cancelada');
  });

  it('getTypeLabel devuelve tipo correcto', () => {
    expect(getTypeLabel('indoor')).toBe('Cubierta');
    expect(getTypeLabel('outdoor')).toBe('Exterior');
  });
});

// ── Tests de componentes UI ──────────────────────────────────────
import { LoadingSpinner, ErrorMessage, EmptyState } from '../src/components/ui/Feedback';

describe('LoadingSpinner', () => {
  it('muestra el mensaje por defecto', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('muestra el mensaje personalizado', () => {
    render(<LoadingSpinner message="Cargando pistas..." />);
    expect(screen.getByText('Cargando pistas...')).toBeInTheDocument();
  });
});

describe('ErrorMessage', () => {
  it('muestra el mensaje de error', () => {
    render(<ErrorMessage message="Error de red" />);
    expect(screen.getByText('Error de red')).toBeInTheDocument();
  });

  it('muestra botón de reintentar si se pasa onRetry', () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={onRetry} />);
    const btn = screen.getByText('Reintentar');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('no muestra botón si no se pasa onRetry', () => {
    render(<ErrorMessage message="Error" />);
    expect(screen.queryByText('Reintentar')).not.toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('muestra el mensaje por defecto', () => {
    render(<EmptyState />);
    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });

  it('muestra el mensaje personalizado', () => {
    render(<EmptyState message="Sin pistas disponibles" icon="🎾" />);
    expect(screen.getByText('Sin pistas disponibles')).toBeInTheDocument();
  });
});

// ── Tests de SearchBar ───────────────────────────────────────────
import SearchBar from '../src/components/ui/SearchBar';

const defaultFilters = { search: '', zone: 'Todas', type: 'all', surface: 'Todas', sort: 'rating_desc' };

describe('SearchBar', () => {
  it('muestra el contador correcto', () => {
    render(<SearchBar filters={defaultFilters} onChange={() => {}} totalCourts={6} visibleCourts={4} />);
    expect(screen.getByText('Mostrando 4 de 6 pistas')).toBeInTheDocument();
  });

  it('muestra mensaje de lista vacía cuando visibleCourts=0', () => {
    render(<SearchBar filters={defaultFilters} onChange={() => {}} totalCourts={6} visibleCourts={0} />);
    expect(screen.getByText(/No hay pistas/)).toBeInTheDocument();
  });

  it('llama onChange al escribir en el buscador', () => {
    const onChange = vi.fn();
    render(<SearchBar filters={defaultFilters} onChange={onChange} totalCourts={6} visibleCourts={6} />);
    const input = screen.getByPlaceholderText(/Buscar por nombre/);
    fireEvent.change(input, { target: { value: 'Centro' } });
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, search: 'Centro' });
  });
});
