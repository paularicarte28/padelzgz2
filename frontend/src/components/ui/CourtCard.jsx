import { Link } from 'react-router-dom';
import { formatPrice, formatRating, getTypeLabel } from '../../utils/formatters';

export default function CourtCard({ court }) {
  return (
    <div style={styles.card}>
      <div style={styles.imgWrapper}>
        <img
          src={court.image || 'https://via.placeholder.com/400x200?text=Pista+de+Pádel'}
          alt={court.name}
          style={styles.img}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Pista+de+P%C3%A1del'; }}
        />
        <span style={styles.typeBadge}>{getTypeLabel(court.type)}</span>
      </div>
      <div style={styles.body}>
        <h3 style={styles.name}>{court.name}</h3>
        <p style={styles.club}>📍 {court.club} · {court.zone}</p>
        <p style={styles.surface}>Superficie: <strong>{court.surface}</strong></p>
        <div style={styles.footer}>
          <div>
            <span style={styles.rating}>⭐ {formatRating(court.rating)}</span>
            <span style={styles.reviews}>({court.reviews} reseñas)</span>
          </div>
          <span style={styles.price}>{formatPrice(court.price)}/hora</span>
        </div>
        <Link to={`/pistas/${court.id}`} style={styles.btn}>
          Ver disponibilidad →
        </Link>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#1e293b', borderRadius: '12px', overflow: 'hidden',
    border: '1px solid #334155', transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex', flexDirection: 'column',
  },
  imgWrapper: { position: 'relative', height: '180px', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  typeBadge: {
    position: 'absolute', top: '10px', right: '10px', background: 'rgba(26,26,46,0.85)',
    color: '#4ade80', padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600,
  },
  body: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 },
  name: { color: '#f1f5f9', fontSize: '1rem', fontWeight: 700, margin: 0 },
  club: { color: '#94a3b8', fontSize: '0.85rem', margin: 0 },
  surface: { color: '#cbd5e1', fontSize: '0.85rem', margin: 0 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' },
  rating: { color: '#fbbf24', fontWeight: 600, fontSize: '0.9rem' },
  reviews: { color: '#64748b', fontSize: '0.8rem', marginLeft: '4px' },
  price: { color: '#4ade80', fontWeight: 700, fontSize: '1rem' },
  btn: {
    display: 'block', textAlign: 'center', background: '#4ade80', color: '#1a1a2e',
    padding: '0.55rem', borderRadius: '8px', textDecoration: 'none',
    fontWeight: 600, fontSize: '0.9rem', marginTop: 'auto',
  },
};
