import { useState, useCallback } from 'react';
import { reservationsService } from '../services/reservationsService';

export function useReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMy = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reservationsService.getMy();
      setReservations(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async (id) => {
    try {
      await reservationsService.cancel(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
      );
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cancelar');
      return false;
    }
  }, []);

  const create = useCallback(async (courtId, date, timeSlot, players) => {
    setError(null);
    try {
      const newRes = await reservationsService.create(courtId, date, timeSlot, players);
      setReservations((prev) => [newRes, ...prev]);
      return newRes;
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al crear la reserva';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  return { reservations, loading, error, fetchMy, cancel, create };
}
