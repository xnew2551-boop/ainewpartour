import bcrypt from 'bcryptjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, '../../database/schema.sql');

const tours = [
  ['ญี่ปุ่น โตเกียว ฟูจิ', 'japan-tokyo-fuji', 'โตเกียว - ภูเขาไฟฟูจิ', 'ญี่ปุ่น', 45900, 5, 'Tokyo Bay Luxury Hotel', 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1400&q=80', 'ชมเมืองโตเกียว วัดอาซากุสะ ช้อปปิ้งชินจูกุ และวิวภูเขาไฟฟูจิแบบเต็มตา', ['บินสู่โตเกียวและเช็คอิน', 'วัดอาซากุสะและชินจูกุ', 'ภูเขาไฟฟูจิและทะเลสาบคาวากุจิ', 'อิสระช้อปปิ้ง', 'เดินทางกลับ'], true],
  ['เกาหลี โซล', 'korea-seoul', 'โซล', 'เกาหลีใต้', 29900, 4, 'Seoul City Boutique', 'https://images.unsplash.com/photo-1538485399081-7c8edec2f61e?auto=format&fit=crop&w=1400&q=80', 'เที่ยวพระราชวังเคียงบกกุง เมียงดง ฮงแด และคาเฟ่ยอดนิยม', ['ถึงโซล', 'พระราชวังและหมู่บ้านบุกชอน', 'เมียงดงและฮงแด', 'เดินทางกลับ'], true],
  ['สิงคโปร์ Universal', 'singapore-universal', 'สิงคโปร์', 'สิงคโปร์', 25900, 3, 'Marina View Hotel', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1400&q=80', 'ครบทั้ง Universal Studios, Gardens by the Bay และแลนด์มาร์กเมืองสิงคโปร์', ['Merlion และ Marina Bay', 'Universal Studios เต็มวัน', 'Gardens by the Bay และกลับไทย'], true],
  ['ภูเก็ต เกาะพีพี', 'phuket-phi-phi', 'ภูเก็ต - เกาะพีพี', 'ไทย', 12900, 3, 'Phuket Beach Resort', 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1400&q=80', 'พักริมทะเล ล่องเรือเกาะพีพี ดำน้ำ และชมพระอาทิตย์ตก', ['ถึงภูเก็ต', 'ล่องเรือเกาะพีพี', 'คาเฟ่และเดินทางกลับ'], true],
  ['เชียงใหม่ ดอยอินทนนท์', 'chiangmai-doi-inthanon', 'เชียงใหม่', 'ไทย', 8900, 3, 'Chiang Mai Nature Stay', 'https://images.unsplash.com/photo-1576180436110-86c8d520c3f3?auto=format&fit=crop&w=1400&q=80', 'สัมผัสอากาศเย็นบนดอยอินทนนท์ วัดสวย คาเฟ่ และวัฒนธรรมล้านนา', ['วัดพระธาตุดอยสุเทพ', 'ดอยอินทนนท์', 'นิมมานและกลับ'], false],
  ['มัลดีฟส์ Luxury', 'maldives-luxury', 'มัลดีฟส์', 'มัลดีฟส์', 69900, 4, 'Overwater Luxury Villa', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80', 'พักวิลล่ากลางน้ำ น้ำทะเลใส กิจกรรมดำน้ำ และบริการระดับลักชัวรี', ['เดินทางถึงรีสอร์ต', 'พักผ่อนและดำน้ำ', 'กิจกรรมทางทะเล', 'เดินทางกลับ'], true]
];

export const seedDatabase = asyncHandler(async (req, res) => {
  const secret = req.query.secret || req.headers['x-seed-secret'];
  if (secret !== env.adminPassword) throw new AppError('Seed secret ไม่ถูกต้อง', 403);

  await query(await fs.readFile(schemaPath, 'utf8'));
  const adminHash = await bcrypt.hash(env.adminPassword, 12);
  await query(
    `INSERT INTO admins (email, password_hash) VALUES ($1,$2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [env.adminEmail.toLowerCase(), adminHash]
  );

  const settings = {
    name: 'ไอนิวพาทัวร์',
    tagline: 'เที่ยวสนุก ครบ จบในที่เดียว',
    phone: '096-203-2266',
    email: 'udomdath21112551@gmail.com',
    promptPay: env.promptPayId
  };
  for (const [key, value] of Object.entries(settings)) {
    await query(
      `INSERT INTO site_settings (key, value) VALUES ($1,$2)
       ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=NOW()`,
      [key, value]
    );
  }

  for (const tour of tours) {
    await query(
      `INSERT INTO tours (title, slug, location, country, price, duration_days, hotel, image_url, description, itinerary, is_popular)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, price=EXCLUDED.price, updated_at=NOW()`,
      [tour[0], tour[1], tour[2], tour[3], tour[4], tour[5], tour[6], tour[7], tour[8], JSON.stringify(tour[9]), tour[10]]
    );
  }

  res.json({ ok: true, message: 'Seed completed' });
});
