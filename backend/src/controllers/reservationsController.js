const { getDb } = require('../db/database');

const AVAILABLE_SLOTS = ['09:00', '10:30', '12:00', '14:00', '17:00', '18:30', '20:00', '21:30'];

function getMyReservations(req, res) {
  const db = getDb();
  const rows = db.prepare(`
    SELECT r.*, c.name as court_name, c.club, c.zone, c.type, c.price, c.image
    FROM reservations r JOIN courts c ON r.court_id = c.id
    WHERE r.user_id = ?
    ORDER BY r.date DESC, r.time_slot DESC
  `).all(req.user.id);
  return res.json(rows);
}

function getAllReservations(req, res) {
  const db = getDb();
  const rows = db.prepare(`
    SELECT r.*, c.name as court_name, c.club, c.zone, c.type, c.price,
           u.name as user_name, u.email as user_email
    FROM reservations r
    JOIN courts c ON r.court_id = c.id
    JOIN users u ON r.user_id = u.id
    ORDER BY r.date DESC, r.time_slot DESC
  `).all();
  return res.json(rows);
}

function getAvailableSlots(req, res) {
  const { courtId, date } = req.query;
  if (!courtId || !date) return res.status(400).json({ error: 'courtId y date son obligatorios' });

  const db = getDb();
  const taken = db.prepare(
    `SELECT time_slot FROM reservations WHERE court_id = ? AND date = ? AND status = 'confirmed'`
  ).all(courtId, date).map(r => r.time_slot);

  return res.json({ slots: AVAILABLE_SLOTS.filter(s => !taken.includes(s)), taken });
}

function create(req, res) {
  const { court_id, date, time_slot, players } = req.body;
  if (!court_id || !date || !time_slot)
    return res.status(400).json({ error: 'court_id, date y time_slot son obligatorios' });
  if (!AVAILABLE_SLOTS.includes(time_slot))
    return res.status(400).json({ error: 'Franja horaria no válida' });

  const db = getDb();
  const court = db.prepare('SELECT id FROM courts WHERE id = ? AND active = 1').get(court_id);
  if (!court) return res.status(404).json({ error: 'Pista no encontrada' });

  const conflict = db.prepare(
    `SELECT id FROM reservations WHERE court_id = ? AND date = ? AND time_slot = ? AND status = 'confirmed'`
  ).get(court_id, date, time_slot);
  if (conflict) return res.status(409).json({ error: 'Esa franja ya está reservada' });

  db.prepare('INSERT INTO reservations (user_id, court_id, date, time_slot, players) VALUES (?, ?, ?, ?, ?)').run(
    req.user.id, court_id, date, time_slot, players || 2
  );

  // Recuperar la reserva recién creada (última del usuario para esa pista/fecha/franja)
  const reservation = db.prepare(`
    SELECT r.*, c.name as court_name, c.club, c.zone, c.type, c.price, c.image
    FROM reservations r JOIN courts c ON r.court_id = c.id
    WHERE r.user_id = ? AND r.court_id = ? AND r.date = ? AND r.time_slot = ?
    ORDER BY r.id DESC LIMIT 1
  `).get(req.user.id, court_id, date, time_slot);

  return res.status(201).json(reservation);
}

function cancel(req, res) {
  const db = getDb();
  const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id);
  if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });
  if (req.user.role !== 'admin' && reservation.user_id !== req.user.id)
    return res.status(403).json({ error: 'No tienes permiso para cancelar esta reserva' });

  db.prepare(`UPDATE reservations SET status = 'cancelled' WHERE id = ?`).run(req.params.id);
  return res.json({ message: 'Reserva cancelada' });
}

function getStats(req, res) {
  const db = getDb();
  const totalReservations = db.prepare(`SELECT COUNT(*) as c FROM reservations WHERE status = 'confirmed'`).get().c;
  const totalUsers = db.prepare(`SELECT COUNT(*) as c FROM users WHERE role = 'user'`).get().c;
  const totalCourts = db.prepare(`SELECT COUNT(*) as c FROM courts WHERE active = 1`).get().c;
  const revenue = db.prepare(`
    SELECT COALESCE(SUM(c.price), 0) as total
    FROM reservations r JOIN courts c ON r.court_id = c.id WHERE r.status = 'confirmed'
  `).get().total;
  const byZone = db.prepare(`
    SELECT c.zone, COUNT(*) as count FROM reservations r
    JOIN courts c ON r.court_id = c.id WHERE r.status = 'confirmed'
    GROUP BY c.zone ORDER BY count DESC
  `).all();
  const byMonth = db.prepare(`
    SELECT substr(date, 1, 7) as month, COUNT(*) as count
    FROM reservations WHERE status = 'confirmed'
    GROUP BY month ORDER BY month DESC LIMIT 6
  `).all();
  return res.json({ totalReservations, totalUsers, totalCourts, revenue, byZone, byMonth });
}

module.exports = { getMyReservations, getAllReservations, getAvailableSlots, create, cancel, getStats };
