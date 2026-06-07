import { useState, useEffect } from 'react';
import { courtsService } from '../services/courtsService';

export function useCourts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    courtsService
      .getAll()
      .then((data) => { if (!cancelled) setCourts(data); })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.error || 'Error al cargar pistas'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { courts, loading, error };
}

export function useCourt(id) {
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    courtsService
      .getById(id)
      .then((data) => { if (!cancelled) setCourt(data); })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.error || 'Pista no encontrada'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  return { court, loading, error };
}
