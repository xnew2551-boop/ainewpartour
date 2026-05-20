# ไอนิวพาทัวร์

เว็บไซต์จองทัวร์ Full Stack สำหรับ “ไอนิวพาทัวร์” พร้อม Next.js, Tailwind CSS, Framer Motion, Express.js, PostgreSQL, Cloudinary, JWT และ PromptPay QR พร้อมอัปโหลดสลิป

## สิ่งที่มีในโปรเจกต์

- หน้าแรก Modern Travel UI พร้อม Hero, animation และแพ็กเกจยอดนิยม
- ระบบแพ็กเกจทัวร์จากฐานข้อมูลจริง
- สมัครสมาชิก, เข้าสู่ระบบ, Logout และ JWT Protected Routes
- ระบบจองทัวร์ เลือกวันเดินทาง จำนวนผู้เดินทาง และบันทึกลงฐานข้อมูล
- PromptPay QR Code อัตโนมัติ และอัปโหลดสลิปผ่าน Cloudinary
- Admin Dashboard เพิ่ม/แก้ไข/ลบแพ็กเกจ ดู booking ตรวจสลิป และเปลี่ยนสถานะ
- Admin แก้ไขข้อมูลเว็บไซต์พื้นฐาน เช่น ชื่อเว็บ ข้อความ hero เบอร์โทร อีเมล และ PromptPay
- PostgreSQL schema: `users`, `admins`, `tours`, `bookings`, `payments`, `reviews`
- Docker, seed script, `.env.example`, API docs

## โครงสร้าง

```text
frontend/  Next.js + Tailwind + Framer Motion
backend/   Express.js REST API + PostgreSQL + Cloudinary
API.md     เอกสาร API
```

## รันบนเครื่อง

1. ติดตั้ง dependencies

```bash
npm install
```

2. สร้างฐานข้อมูลด้วย Docker

```bash
docker compose up -d postgres
```

3. สร้างไฟล์ environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

4. แก้ `backend/.env`

```env
DATABASE_URL=postgres://ainew:ainew_password@localhost:5432/ainewpartour
JWT_SECRET=ใส่ค่าสุ่มยาวอย่างน้อย 32 ตัวอักษร
ADMIN_EMAIL=admin@ainewpartour.com
ADMIN_PASSWORD=096203226LL
PROMPTPAY_ID=0962032266
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

5. Seed database

```bash
npm run seed
```

6. เปิดระบบ

```bash
npm run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:4000/health`

## Admin เริ่มต้น

URL: `/admin`

Email: `admin@ainewpartour.com`

Password: `096203226LL`

## Deploy ออนไลน์จริง

### Database

ใช้ PostgreSQL ออนไลน์ เช่น Neon, Supabase, Railway หรือ Render PostgreSQL

1. สร้าง database
2. คัดลอก connection string ไปใส่ `DATABASE_URL`
3. รัน schema และ seed:

```bash
npm install
npm run seed -w backend
```

### Backend บน Render

1. Push source code ไป GitHub
2. สร้าง Web Service บน Render
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Environment Variables: ใช้ค่าจาก `backend/.env.example`
7. ตั้ง `NODE_ENV=production`
8. ตั้ง `FRONTEND_URL=https://ainewpartour.vercel.app`

มีไฟล์ `render.yaml` ให้ใช้ Blueprint ได้ด้วย โดยต้องใส่ secrets ใน Render เอง

หลัง Deploy จะได้ HTTPS เช่น `https://ainewpartour-api.onrender.com`

### Frontend บน Vercel

1. Import GitHub repository ใน Vercel
2. Root Directory: `frontend`
3. Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://ainewpartour-api.onrender.com/api
```

4. Deploy แล้วจะได้ HTTPS เช่น `https://ainewpartour.vercel.app`

มีไฟล์ `frontend/vercel.json` สำหรับค่า deploy พื้นฐานของ Vercel

### Custom Domain

ถ้าต้องการ `https://ainewpartour.com`

1. ซื้อโดเมน `ainewpartour.com`
2. เพิ่มโดเมนใน Vercel Project
3. ตั้ง DNS ตามค่าที่ Vercel ให้
4. Vercel จะออก HTTPS certificate ให้อัตโนมัติ

## หมายเหตุสำคัญ

ระบบพร้อม Deploy ได้จริง แต่การเปิดลิงก์ออนไลน์จริงต้องใช้บัญชี Vercel/Render/GitHub/Cloudinary และ database connection string ของเจ้าของโปรเจกต์ เพราะต้องมีสิทธิ์เข้าถึงบัญชีและ secrets เหล่านั้น
