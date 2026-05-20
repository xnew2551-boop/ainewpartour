import bcrypt from 'bcryptjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query, pool } from '../config/db.js';
import { env } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, '../../database/schema.sql');

const tours = [
  {
    title: 'ญี่ปุ่น โตเกียว ฟูจิ',
    slug: 'japan-tokyo-fuji',
    location: 'โตเกียว - ภูเขาไฟฟูจิ',
    country: 'ญี่ปุ่น',
    price: 45900,
    durationDays: 5,
    hotel: 'Tokyo Bay Luxury Hotel',
    imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1400&q=80',
    description: 'ชมเมืองโตเกียว วัดอาซากุสะ ช้อปปิ้งชินจูกุ และวิวภูเขาไฟฟูจิแบบเต็มตา',
    itinerary: ['บินสู่โตเกียวและเช็คอิน', 'วัดอาซากุสะและชินจูกุ', 'ภูเขาไฟฟูจิและทะเลสาบคาวากุจิ', 'อิสระช้อปปิ้ง', 'เดินทางกลับ'],
    isPopular: true
  },
  {
    title: 'เกาหลี โซล',
    slug: 'korea-seoul',
    location: 'โซล',
    country: 'เกาหลีใต้',
    price: 29900,
    durationDays: 4,
    hotel: 'Seoul City Boutique',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7c8edec2f61e?auto=format&fit=crop&w=1400&q=80',
    description: 'เที่ยวพระราชวังเคียงบกกุง เมียงดง ฮงแด และคาเฟ่ยอดนิยม',
    itinerary: ['ถึงโซล', 'พระราชวังและหมู่บ้านบุกชอน', 'เมียงดงและฮงแด', 'เดินทางกลับ'],
    isPopular: true
  },
  {
    title: 'สิงคโปร์ Universal',
    slug: 'singapore-universal',
    location: 'สิงคโปร์',
    country: 'สิงคโปร์',
    price: 25900,
    durationDays: 3,
    hotel: 'Marina View Hotel',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1400&q=80',
    description: 'ครบทั้ง Universal Studios, Gardens by the Bay และแลนด์มาร์กเมืองสิงคโปร์',
    itinerary: ['Merlion และ Marina Bay', 'Universal Studios เต็มวัน', 'Gardens by the Bay และกลับไทย'],
    isPopular: true
  },
  {
    title: 'ภูเก็ต เกาะพีพี',
    slug: 'phuket-phi-phi',
    location: 'ภูเก็ต - เกาะพีพี',
    country: 'ไทย',
    price: 12900,
    durationDays: 3,
    hotel: 'Phuket Beach Resort',
    imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1400&q=80',
    description: 'พักริมทะเล ล่องเรือเกาะพีพี ดำน้ำ และชมพระอาทิตย์ตก',
    itinerary: ['ถึงภูเก็ต', 'ล่องเรือเกาะพีพี', 'คาเฟ่และเดินทางกลับ'],
    isPopular: true
  },
  {
    title: 'เชียงใหม่ ดอยอินทนนท์',
    slug: 'chiangmai-doi-inthanon',
    location: 'เชียงใหม่',
    country: 'ไทย',
    price: 8900,
    durationDays: 3,
    hotel: 'Chiang Mai Nature Stay',
    imageUrl: 'https://images.unsplash.com/photo-1576180436110-86c8d520c3f3?auto=format&fit=crop&w=1400&q=80',
    description: 'สัมผัสอากาศเย็นบนดอยอินทนนท์ วัดสวย คาเฟ่ และวัฒนธรรมล้านนา',
    itinerary: ['วัดพระธาตุดอยสุเทพ', 'ดอยอินทนนท์', 'นิมมานและกลับ'],
    isPopular: false
  },
  {
    title: 'มัลดีฟส์ Luxury',
    slug: 'maldives-luxury',
    location: 'มัลดีฟส์',
    country: 'มัลดีฟส์',
    price: 69900,
    durationDays: 4,
    hotel: 'Overwater Luxury Villa',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80',
    description: 'พักวิลล่ากลางน้ำ น้ำทะเลใส กิจกรรมดำน้ำ และบริการระดับลักชัวรี',
    itinerary: ['เดินทางถึงรีสอร์ต', 'พักผ่อนและดำน้ำ', 'กิจกรรมทางทะเล', 'เดินทางกลับ'],
    isPopular: true
  }
];

async function seed() {
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
       ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, location=EXCLUDED.location, country=EXCLUDED.country,
       price=EXCLUDED.price, duration_days=EXCLUDED.duration_days, hotel=EXCLUDED.hotel, image_url=EXCLUDED.image_url,
       description=EXCLUDED.description, itinerary=EXCLUDED.itinerary, is_popular=EXCLUDED.is_popular, updated_at=NOW()`,
      [
        tour.title,
        tour.slug,
        tour.location,
        tour.country,
        tour.price,
        tour.durationDays,
        tour.hotel,
        tour.imageUrl,
        tour.description,
        JSON.stringify(tour.itinerary),
        tour.isPopular
      ]
    );
  }
  console.log('Seed completed');
  await pool.end();
}

seed().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
