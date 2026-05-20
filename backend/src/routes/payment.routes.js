import { Router } from 'express';
import { uploadSlip } from '../controllers/payment.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/:bookingId/slip', requireAuth, upload.single('slip'), uploadSlip);

export default router;
