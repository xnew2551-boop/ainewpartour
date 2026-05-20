'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clearSession, getStoredUser } from '../lib/api';
import { LogOut, Menu, Plane } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState(null);
  useEffect(() => setUser(getStoredUser()), []);
  const logout = () => {
    clearSession();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/90 backdrop-blur">
      <div className="container-pad flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-ink">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-ocean text-white"><Plane size={20} /></span>
          ไอนิวพาทัวร์
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex">
          <Link href="/tours">แพ็กเกจทัวร์</Link>
          <Link href="/bookings">ประวัติการจอง</Link>
          <Link href="/admin">Admin</Link>
          {user ? (
            <button className="btn-outline gap-2" onClick={logout}><LogOut size={16} /> Logout</button>
          ) : (
            <Link className="btn-primary" href="/login">เข้าสู่ระบบ</Link>
          )}
        </nav>
        <Link href="/tours" className="md:hidden"><Menu /></Link>
      </div>
    </header>
  );
}
