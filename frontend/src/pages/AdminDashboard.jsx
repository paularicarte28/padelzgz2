import { useEffect, useState, useMemo } from 'react';
import { reservationsService } from '../services/reservationsService';
import { LoadingSpinner, ErrorMessage, EmptyState, StatusBadge } from '../components/ui/Feedback';
import { formatDate, formatPrice } from '../utils/formatters';

// Componente de tarjeta de estadística
function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ ...styles.statCard, borderTop: `3px solid ${color}` }}>
      <span style={{ fontSize: '1.8rem' }}>{icon}</span>
      <div>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>{label}</p>
        <p style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros y ordenación
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    setLoading(true);
    Promise.all([reservationsService.getAll(), reservationsService.getStats()])
      .then(([res, st]) => {
        setReservations(res);
        setStats(st);
      })
      .catch((err) => setError(err.response?.data?.error || 'Error al cargar datos'))
      .finally(() => setLoading(false));
  }, []);

  function handleSort(field) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('¿Cancelar esta reserva?')) return;
    try {
      await reservationsService.cancel(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cancelar');
    }
  }

  const filtered = useMemo(() => {
    let result = [...reservations];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.court_name?.toLowerCase().includes(term) ||
          r.user_name?.toLowerCase().includes(term) ||
          r.user_email?.toLowerCase().includes(term) ||
          r.zone?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter);
    }

    result.sort((a, b) => {
      let va = a[sortField] ?? '';
      let vb = b[sortField] ?? '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [reservations, search, statusFilter, sortField, sortDir]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span style={{ color: '#475569' }}> ↕</span>;
    return <span style={{ color: '#4ade80' }}>{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>;
  };

  if (loading) return <LoadingSpinner message="Cargando dashboard..." />;
  if (error) return <div style={{ padding: '2rem' }}><ErrorMessage message={error} /></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard Administrador</h1>

      {/* Estadísticas */}
      {stats && (
        <div style={styles.statsGrid}>
          <StatCard label="Reservas activas" value={stats.totalReservations} icon="📅" color="#4ade80" />
          <StatCard label="Usuarios registrados" value={stats.totalUsers} icon="👥" color="#60a5fa" />
          <StatCard label="Pistas disponibles" value={stats.totalCourts} icon="🎾" color="#f59e0b" />
          <StatCard label="Ingresos estimados" value={formatPrice(stats.revenue)} icon="💶" color="#a78bfa" />
        </div>
      )}

      {/* Por zona */}
      {stats?.byZone?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Reservas por zona</h2>
          <div style={styles.zoneRow}>
            {stats.byZone.map((z) => (
              <div key={z.zone} style={styles.zoneChip}>
                <span style={styles.zoneName}>{z.zone}</span>
                <span style={styles.zoneCount}>{z.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de reservas */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Todas las reservas</h2>

        {/* Filtros */}
        <div style={styles.filterRow}>
          <input
            type="text"
            placeholder="🔍 Buscar por pista, usuario o zona..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            aria-label="Buscar reservas"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.select}>
            <option value="all">Todos los estados</option>
            <option value="confirmed">Confirmadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
          <span style={styles.counter}>
            {filtered.length} de {reservations.length} reservas
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="No hay reservas que coincidan con los filtros" />
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  {[
                    { field: 'id', label: '#' },
                    { field: 'user_name', label: 'Usuario' },
                    { field: 'court_name', label: 'Pista' },
                    { field: 'zone', label: 'Zona' },
                    { field: 'date', label: 'Fecha' },
                    { field: 'time_slot', label: 'Franja' },
                    { field: 'players', label: 'Jugadores' },
                    { field: 'status', label: 'Estado' },
                    { field: null, label: 'Acción' },
                  ].map((col) => (
                    <th
                      key={col.label}
                      onClick={() => col.field && handleSort(col.field)}
                      style={{ ...styles.th, cursor: col.field ? 'pointer' : 'default' }}
                    >
                      {col.label}
                      {col.field && <SortIcon field={col.field} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? '#1e293b' : '#172033' }}>
                    <td style={styles.td}>{r.id}</td>
                    <td style={styles.td}>
                      <div style={{ color: '#f1f5f9', fontSize: '0.85rem' }}>{r.user_name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{r.user_email}</div>
                    </td>
                    <td style={styles.td}>{r.court_name}</td>
                    <td style={styles.td}>{r.zone}</td>
                    <td style={styles.td}>{formatDate(r.date)}</td>
                    <td style={styles.td}>{r.time_slot}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>{r.players}</td>
                    <td style={styles.td}><StatusBadge status={r.status} /></td>
                    <td style={styles.td}>
                      {r.status === 'confirmed' && (
                        <button onClick={() => handleCancel(r.id)} style={styles.cancelBtn}>
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' },
  title: { color: '#f1f5f9', fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  statCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' },
  section: { marginBottom: '2rem' },
  sectionTitle: { color: '#f1f5f9', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' },
  zoneRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  zoneChip: { background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' },
  zoneName: { color: '#94a3b8', fontSize: '0.85rem' },
  zoneCount: { background: '#4ade80', color: '#1a1a2e', borderRadius: '10px', padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 },
  filterRow: { display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' },
  searchInput: { flex: '2 1 220px', padding: '0.55rem 0.8rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none' },
  select: { flex: '1 1 160px', padding: '0.55rem 0.7rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem' },
  counter: { color: '#64748b', fontSize: '0.85rem', marginLeft: 'auto' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  thead: { background: '#0f172a' },
  th: { color: '#94a3b8', padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #334155', whiteSpace: 'nowrap' },
  td: { color: '#cbd5e1', padding: '0.7rem 1rem', borderBottom: '1px solid #1e293b', verticalAlign: 'middle' },
  cancelBtn: { background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '0.25rem 0.6rem', borderRadius: '5px', cursor: 'pointer', fontSize: '0.78rem' },
};
