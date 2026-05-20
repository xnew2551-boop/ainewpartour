import { Router } from 'express';
import { createTour, deleteTour, getTour, listTours, updateTour } from '../controllers/tour.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { tourSchema } from '../validators/tour.validator.js';

const router = Router();

router.get('/', listTours);
router.get('/:slug', getTour);
router.post('/', requireAuth, requireAdmin, validate(tourSchema), createTour);
router.put('/:id', requireAuth, requireAdmin, validate(tourSchema), updateTour);
router.delete('/:id', requireAuth, requireAdmin, deleteTour);

export default router;
