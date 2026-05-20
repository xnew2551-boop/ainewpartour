import { Router } from 'express';
import { adminLogin, login, me, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/admin/login', validate(loginSchema), adminLogin);
router.get('/me', requireAuth, me);

export default router;
