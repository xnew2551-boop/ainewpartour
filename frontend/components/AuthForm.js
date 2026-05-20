'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, setSession } from '../lib/api';

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const { data } = await api.post(isRegister ? '/auth/register' : '/auth/login', payload);
      setSession(data.token, data.user);
      toast.success('เข้าสู่ระบบสำเร็จ');
      window.location.href = '/tours';
    } catch (error) {
      toast.error(error.response?.data?.message || 'ดำเนินการไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-skysoft px-4">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-8">
        <Link href="/" className="text-2xl font-bold text-ink">ไอนิวพาทัวร์</Link>
        <h1 className="text-3xl font-bold">{isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</h1>
        {isRegister && (
          <>
            <input className="input" name="name" placeholder="ชื่อ-นามสกุล" value={form.name} onChange={update} required />
            <input className="input" name="phone" placeholder="เบอร์โทร" value={form.phone} onChange={update} required />
          </>
        )}
        <input className="input" name="email" type="email" placeholder="Gmail" value={form.email} onChange={update} required />
        <input className="input" name="password" type="password" placeholder="รหัสผ่าน" value={form.password} onChange={update} required />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'กำลังดำเนินการ...' : isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</button>
        <p className="text-center text-sm text-slate-600">
          {isRegister ? 'มีบัญชีแล้ว?' : 'ยังไม่มีบัญชี?'}{' '}
          <Link className="font-semibold text-ocean" href={isRegister ? '/login' : '/register'}>
            {isRegister ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </Link>
        </p>
      </form>
    </main>
  );
}
