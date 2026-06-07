import { useEffect, useState } from 'react';
import { useReservations } from '../hooks/useReservations';
import { LoadingSpinner, ErrorMessage, EmptyState, StatusBadge } from '../components/ui/Feedback';
import { formatDate, formatPrice } from '../utils/formatters';

export default function MisReservas() {
  const { reservations, loading, error, fetchMy, cancel } = useReservations();
  const [filter, setFilter] = useState('all'); // all | confirmed | cancelled
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchMy();
  }, [fetchMy]);

  async function handleCancel(id) {
    if (!window.confirm('¿Cancelar esta reserva?')) return;
    setCancelling(id);
    await cancel(id);
    setCancelling(null);
  }

  const filtered = reservations.filter((r) => filter === 'all' || r.status === filter);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mis Reservas</h1>

      <div style={styles.filterRow}>
        {['all', 'confirmed', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
          >
            {f === 'all' ? 'Todas' : f === 'confirmed' ? '✓ Confirmadas' : '✗ Canceladas'}
          </button>
        ))}
        <span style={styles.counter}>
          {filtered.length} reserva{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading && <LoadingSpinner message="Cargando tus reservas..." />}
      {error && <ErrorMessage message={error} onRetry={fetchMy} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          message={filter === 'all' ? 'Aún no tienes reservas. ¡Reserva tu primera pista!' : 'No hay reservas en esta categoría'}
          icon="🎾"
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div style={styles.list}>
          {filtered.map((r) => (
            <div key={r.id} style={styles.card}>
              <img
                src={r.image || 'https://via.placeholder.com/120x90?text=Pista'}
                alt={r.court_name}
                style={styles.img}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/120x90?text=Pista'; }}
              />
              <div style={styles.info}>
                <div style={styles.infoTop}>
                  <span style={styles.courtName}>{r.court_name}</span>
                  <StatusBadge status={r.status} />
                </div>
                <p style={styles.detail}>📅 {formatDate(r.date)} · ⏰ {r.time_slot}</p>
                <p style={styles.detail}>📍 {r.zone} · 👥 {r.players} jugadores</p>
                <p style={styles.price}>{formatPrice(r.price)}</p>
              </div>
              {r.status === 'confirmed' && (
                <button
                  onClick={() => handleCancel(r.id)}
                  disabled={cancelling === r.id}
                  style={styles.cancelBtn}
                >
                  {cancelling === r.id ? '...' : 'Cancelar'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' },
  title: { color: '#f1f5f9', fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.25rem' },
  filterRow: { display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' },
  filterBtn: { padding: '0.4rem 0.9rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '20px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' },
  filterActive: { background: '#14532d', borderColor: '#4ade80', color: '#4ade80', fontWeight: 600 },
  counter: { color: '#64748b', fontSize: '0.85rem', marginLeft: 'auto' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' },
  img: { width: '100px', height: '75px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
  info: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  infoTop: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  courtName: { color: '#f1f5f9', fontWeight: 600, fontSize: '1rem' },
  detail: { color: '#94a3b8', fontSize: '0.85rem', margin: 0 },
  price: { color: '#4ade80', fontWeight: 600, fontSize: '0.95rem', margin: 0 },
  cancelBtn: { background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', flexShrink: 0 },
};
