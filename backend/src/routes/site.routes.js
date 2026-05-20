import { Router } from 'express';
import { getSiteInfo, updateSiteInfo } from '../controllers/site.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getSiteInfo);
router.put('/', requireAuth, requireAdmin, updateSiteInfo);

export default router;
