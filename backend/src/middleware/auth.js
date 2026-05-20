import { AppError } from '../utils/appError.js';
import { verifyToken } from '../utils/jwt.js';

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new AppError('กรุณาเข้าสู่ระบบ', 401));
  try {
    req.auth = verifyToken(token);
    return next();
  } catch {
    return next(new AppError('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่', 401));
  }
}

export function requireAdmin(req, _res, next) {
  if (req.auth?.role !== 'admin') return next(new AppError('ไม่มีสิทธิ์เข้าถึงหลังบ้าน', 403));
  return next();
}
