import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { signToken } from '../utils/jwt.js';

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role || 'user'
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.validated.body;
  const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rowCount) throw new AppError('อีเมลนี้ถูกใช้งานแล้ว', 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const { rows } = await query(
    'INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
    [name, email.toLowerCase(), phone, passwordHash]
  );
  const user = publicUser(rows[0]);
  res.status(201).json({ user, token: signToken({ sub: user.id, role: 'user' }) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 401);
  }
  res.json({ user: publicUser(user), token: signToken({ sub: user.id, role: 'user' }) });
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const { rows } = await query('SELECT * FROM admins WHERE email = $1', [email.toLowerCase()]);
  const admin = rows[0];
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    throw new AppError('ข้อมูลแอดมินไม่ถูกต้อง', 401);
  }
  const user = { id: admin.id, email: admin.email, name: 'Admin', phone: '', role: 'admin' };
  res.json({ user, token: signToken({ sub: admin.id, role: 'admin' }) });
});

export const me = asyncHandler(async (req, res) => {
  if (req.auth.role === 'admin') {
    const { rows } = await query('SELECT id, email FROM admins WHERE id = $1', [req.auth.sub]);
    return res.json({ user: { ...rows[0], role: 'admin', name: 'Admin' } });
  }
  const { rows } = await query('SELECT id, name, email, phone FROM users WHERE id = $1', [req.auth.sub]);
  if (!rows[0]) throw new AppError('ไม่พบผู้ใช้', 404);
  return res.json({ user: publicUser(rows[0]) });
});
