import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const defaults = {
  name: 'ไอนิวพาทัวร์',
  tagline: 'เที่ยวสนุก ครบ จบในที่เดียว',
  phone: '096-203-2266',
  email: 'udomdath21112551@gmail.com',
  promptPay: '0962032266'
};

export const getSiteInfo = asyncHandler(async (_req, res) => {
  const { rows } = await query('SELECT key, value FROM site_settings');
  const settings = rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), defaults);
  res.json(settings);
});

export const updateSiteInfo = asyncHandler(async (req, res) => {
  const allowed = ['name', 'tagline', 'phone', 'email', 'promptPay'];
  for (const key of allowed) {
    if (typeof req.body[key] === 'string') {
      await query(
        `INSERT INTO site_settings (key, value) VALUES ($1,$2)
         ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=NOW()`,
        [key, req.body[key]]
      );
    }
  }
  const { rows } = await query('SELECT key, value FROM site_settings');
  res.json(rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), defaults));
});
