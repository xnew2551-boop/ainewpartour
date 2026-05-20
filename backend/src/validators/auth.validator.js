import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'กรุณากรอกชื่อ'),
    email: z.string().email('Gmail ไม่ถูกต้อง'),
    phone: z.string().min(9, 'เบอร์โทรไม่ถูกต้อง'),
    password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('อีเมลไม่ถูกต้อง'),
    password: z.string().min(1, 'กรุณากรอกรหัสผ่าน')
  })
});
