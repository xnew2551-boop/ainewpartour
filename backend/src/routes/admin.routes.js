import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { allBookings } from '../controllers/booking.controller.js';
import { listTours } from '../controllers/tour.controller.js';

const router = Router();

router.use(requireAuth, requireAdmin);
router.get('/dashboard', async (_req, res) => {
  res.json({ message: 'Ainewpartour admin dashboard ready' });
});
router.get('/bookings', allBookings);
router.get('/tours', listTours);

export default router;
