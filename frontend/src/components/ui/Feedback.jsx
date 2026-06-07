// LoadingSpinner
export function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', gap: '1rem' }}>
      <div style={{
        width: '40px', height: '40px', border: '4px solid #1e3a2f',
        borderTop: '4px solid #4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{message}</p>
    </div>
  );
}

// ErrorMessage
export function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{
      background: '#2d1515', border: '1px solid #ef4444', borderRadius: '8px',
      padding: '1rem 1.5rem', margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      <span style={{ fontSize: '1.3rem' }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <p style={{ color: '#fca5a5', margin: 0, fontSize: '0.95rem' }}>{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} style={{
          background: '#ef4444', color: 'white', border: 'none',
          padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
        }}>
          Reintentar
        </button>
      )}
    </div>
  );
}

// EmptyState
export function EmptyState({ message = 'No hay datos disponibles', icon = '📭' }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
      <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</p>
      <p style={{ fontSize: '1rem' }}>{message}</p>
    </div>
  );
}

// Badge de estado de reserva
export function StatusBadge({ status }) {
  const isConfirmed = status === 'confirmed';
  return (
    <span style={{
      display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem',
      fontWeight: 600, background: isConfirmed ? '#14532d' : '#2d1515',
      color: isConfirmed ? '#4ade80' : '#fca5a5',
    }}>
      {isConfirmed ? '✓ Confirmada' : '✗ Cancelada'}
    </span>
  );
}
