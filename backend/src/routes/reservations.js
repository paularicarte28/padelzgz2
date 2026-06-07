const express = require('express');
const router = express.Router();
const { getMyReservations, getAllReservations, getAvailableSlots, create, cancel, getStats } = require('../controllers/reservationsController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/my', authMiddleware, getMyReservations);
router.get('/all', authMiddleware, adminMiddleware, getAllReservations);
router.get('/slots', authMiddleware, getAvailableSlots);
router.get('/stats', authMiddleware, adminMiddleware, getStats);
router.post('/', authMiddleware, create);
router.patch('/:id/cancel', authMiddleware, cancel);

module.exports = router;
