import { useState, useEffect } from 'react';
import { weatherService } from '../../services/weatherService';

export default function WeatherBanner() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    weatherService
      .getZaragozaWeather()
      .then(setWeather)
      .catch(() => setWeather(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!weather) return null;

  return (
    <div style={{
      ...styles.banner,
      background: weather.isGoodForPadel ? '#14532d' : '#1c1c1c',
      borderColor: weather.isGoodForPadel ? '#4ade80' : '#64748b',
    }}>
      <span style={styles.icon}>{weather.isGoodForPadel ? '☀️' : '🌧️'}</span>
      <span style={styles.text}>
        Zaragoza ahora: <strong>{weather.temperature}°C</strong> · {weather.description} · Viento {weather.windspeed} m/s
      </span>
      <span style={{ ...styles.badge, background: weather.isGoodForPadel ? '#4ade80' : '#475569', color: weather.isGoodForPadel ? '#1a1a2e' : '#cbd5e1' }}>
        {weather.isGoodForPadel ? '✓ Ideal para pádel' : 'Condiciones adversas'}
      </span>
    </div>
  );
}

const styles = {
  banner: {
    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1.5rem',
    border: '1px solid', borderRadius: '8px', marginBottom: '1.5rem', flexWrap: 'wrap',
  },
  icon: { fontSize: '1.2rem' },
  text: { color: '#cbd5e1', fontSize: '0.9rem', flex: 1 },
  badge: { padding: '0.2rem 0.7rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600 },
};
