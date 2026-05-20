import { Router } from 'express';
import { allBookings, createBooking, myBookings, updateBookingStatus } from '../controllers/booking.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { bookingSchema, statusSchema } from '../validators/booking.validator.js';

const router = Router();

router.post('/', requireAuth, validate(bookingSchema), createBooking);
router.get('/me', requireAuth, myBookings);
router.get('/', requireAuth, requireAdmin, allBookings);
router.patch('/:id/status', requireAuth, requireAdmin, validate(statusSchema), updateBookingStatus);

export default router;
