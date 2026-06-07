import { useState, useMemo } from 'react';
import WeatherBanner from '../components/ui/WeatherBanner';
import SearchBar from '../components/ui/SearchBar';
import CourtCard from '../components/ui/CourtCard';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/ui/Feedback';
import { useCourts } from '../hooks/useCourts';

const DEFAULT_FILTERS = {
  search: '',
  zone: 'Todas',
  type: 'all',
  surface: 'Todas',
  sort: 'rating_desc',
};

export default function Home() {
  const { courts, loading, error } = useCourts();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    let result = [...courts];

    if (filters.search.trim()) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(term) || c.club.toLowerCase().includes(term)
      );
    }
    if (filters.zone !== 'Todas') {
      result = result.filter((c) => c.zone === filters.zone);
    }
    if (filters.type !== 'all') {
      result = result.filter((c) => c.type === filters.type);
    }
    if (filters.surface !== 'Todas') {
      result = result.filter((c) => c.surface === filters.surface);
    }

    switch (filters.sort) {
      case 'rating_desc': result.sort((a, b) => b.rating - a.rating); break;
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'name_asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return result;
  }, [courts, filters]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pistas de Pádel en Zaragoza</h1>
      <p style={styles.subtitle}>Encuentra y reserva tu pista favorita en Zaragoza</p>

      <WeatherBanner />

      {loading && <LoadingSpinner message="Cargando pistas..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          <SearchBar
            filters={filters}
            onChange={setFilters}
            totalCourts={courts.length}
            visibleCourts={filtered.length}
          />
          {filtered.length === 0 ? (
            <EmptyState message="No hay pistas que coincidan con los filtros seleccionados" icon="🎾" />
          ) : (
            <div style={styles.grid}>
              {filtered.map((court) => (
                <CourtCard key={court.id} court={court} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' },
  title: { color: '#f1f5f9', fontSize: '2rem', fontWeight: 700, margin: '0 0 0.25rem' },
  subtitle: { color: '#94a3b8', marginBottom: '1.5rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.25rem',
  },
};
