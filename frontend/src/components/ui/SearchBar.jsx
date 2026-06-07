const ZONES = ['Todas', 'Centro', 'Delicias', 'Gran Vía', 'Actur', 'Oliver'];
const SURFACES = ['Todas', 'cristal', 'moqueta', 'hormigón', 'césped'];
const SORT_OPTIONS = [
  { value: 'rating_desc', label: '⭐ Mejor valoradas' },
  { value: 'price_asc', label: '💰 Precio: menor a mayor' },
  { value: 'price_desc', label: '💸 Precio: mayor a menor' },
  { value: 'name_asc', label: '🔤 Nombre A-Z' },
];

export default function SearchBar({ filters, onChange, totalCourts, visibleCourts }) {
  function handleChange(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.row}>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o club..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          style={styles.input}
          aria-label="Buscar pistas"
        />
        <select value={filters.zone} onChange={(e) => handleChange('zone', e.target.value)} style={styles.select}>
          {ZONES.map((z) => <option key={z} value={z}>{z === 'Todas' ? 'Todas las zonas' : z}</option>)}
        </select>
        <select value={filters.type} onChange={(e) => handleChange('type', e.target.value)} style={styles.select}>
          <option value="all">Interior y exterior</option>
          <option value="indoor">Solo cubiertas</option>
          <option value="outdoor">Solo exteriores</option>
        </select>
        <select value={filters.surface} onChange={(e) => handleChange('surface', e.target.value)} style={styles.select}>
          {SURFACES.map((s) => <option key={s} value={s}>{s === 'Todas' ? 'Todas las superficies' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={filters.sort} onChange={(e) => handleChange('sort', e.target.value)} style={styles.select}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div style={styles.counter}>
        {visibleCourts === 0
          ? '⚠️ No hay pistas que coincidan con los filtros'
          : `Mostrando ${visibleCourts} de ${totalCourts} pista${totalCourts !== 1 ? 's' : ''}`}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { marginBottom: '1.5rem' },
  row: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' },
  input: {
    flex: '2 1 200px', padding: '0.55rem 0.8rem', background: '#1e293b',
    border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.9rem',
    outline: 'none',
  },
  select: {
    flex: '1 1 140px', padding: '0.55rem 0.6rem', background: '#1e293b',
    border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem',
  },
  counter: { color: '#64748b', fontSize: '0.85rem' },
};
