'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api, setSession, clearSession } from '../../lib/api';
import { money, statusText } from '../../lib/format';
import { Save, Trash2 } from 'lucide-react';

const emptyTour = {
  title: '',
  slug: '',
  location: '',
  country: '',
  price: '',
  durationDays: '',
  hotel: '',
  imageUrl: '',
  description: '',
  itinerary: '',
  isPopular: false,
  isActive: true
};

export default function AdminPage() {
  const [logged, setLogged] = useState(false);
  const [login, setLogin] = useState({ email: 'admin@ainewpartour.com', password: '096203226LL' });
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [tour, setTour] = useState(emptyTour);
  const [editingId, setEditingId] = useState(null);
  const [settings, setSettings] = useState({ name: '', tagline: '', phone: '', email: '', promptPay: '' });

  async function load() {
    const [bookingRes, tourRes, siteRes] = await Promise.all([api.get('/admin/bookings'), api.get('/admin/tours?includeInactive=true'), api.get('/site')]);
    setBookings(bookingRes.data.bookings || []);
    setTours(tourRes.data.tours || []);
    setSettings(siteRes.data || settings);
  }

  async function doLogin(event) {
    event.preventDefault();
    try {
      const { data } = await api.post('/auth/admin/login', login);
      setSession(data.token, data.user);
      setLogged(true);
      toast.success('เข้าสู่ระบบแอดมินสำเร็จ');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  }

  useEffect(() => {
    api.get('/admin/dashboard').then(() => {
      setLogged(true);
      load();
    }).catch(() => {});
  }, []);

  async function saveTour(event) {
    event.preventDefault();
    const payload = { ...tour, price: Number(tour.price), durationDays: Number(tour.durationDays), itinerary: tour.itinerary.split('\n').filter(Boolean) };
    if (editingId) await api.put(`/tours/${editingId}`, payload);
    else await api.post('/tours', payload);
    toast.success('บันทึกแพ็กเกจแล้ว');
    setTour(emptyTour);
    setEditingId(null);
    load();
  }

  function editTour(item) {
    setEditingId(item.id);
    setTour({ ...item, itinerary: item.itinerary.join('\n') });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function removeTour(id) {
    if (!confirm('ลบแพ็กเกจนี้?')) return;
    await api.delete(`/tours/${id}`);
    toast.success('ลบแล้ว');
    load();
  }

  async function setStatus(id, status) {
    await api.patch(`/bookings/${id}/status`, { status });
    toast.success('อัปเดตสถานะแล้ว');
    load();
  }

  async function saveSettings(event) {
    event.preventDefault();
    await api.put('/site', settings);
    toast.success('บันทึกข้อมูลเว็บไซต์แล้ว');
    load();
  }

  if (!logged) {
    return (
      <main className="grid min-h-screen place-items-center bg-skysoft px-4">
        <form onSubmit={doLogin} className="card w-full max-w-md space-y-4 p-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <input className="input" type="email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
          <input className="input" type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
          <button className="btn-primary w-full">เข้าสู่ระบบแอดมิน</button>
        </form>
      </main>
    );
  }

  return (
    <main className="container-pad py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button className="btn-outline" onClick={() => { clearSession(); setLogged(false); }}>Logout</button>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="space-y-6">
        <form onSubmit={saveSettings} className="card space-y-3 p-5">
          <h2 className="text-2xl font-bold">ข้อมูลเว็บไซต์</h2>
          {['name', 'tagline', 'phone', 'email', 'promptPay'].map((key) => (
            <input key={key} className="input" placeholder={key} value={settings[key] || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} />
          ))}
          <button className="btn-primary w-full gap-2"><Save size={18} /> บันทึกข้อมูลเว็บไซต์</button>
        </form>
        <form onSubmit={saveTour} className="card space-y-3 p-5">
          <h2 className="text-2xl font-bold">{editingId ? 'แก้ไขแพ็กเกจ' : 'เพิ่มแพ็กเกจ'}</h2>
          {['title', 'slug', 'location', 'country', 'price', 'durationDays', 'hotel', 'imageUrl'].map((key) => (
            <input key={key} className="input" placeholder={key} value={tour[key]} onChange={(e) => setTour({ ...tour, [key]: e.target.value })} required />
          ))}
          <textarea className="input min-h-24" placeholder="description" value={tour.description} onChange={(e) => setTour({ ...tour, description: e.target.value })} required />
          <textarea className="input min-h-28" placeholder="itinerary บรรทัดละ 1 วัน" value={tour.itinerary} onChange={(e) => setTour({ ...tour, itinerary: e.target.value })} />
          <label className="flex items-center gap-2"><input type="checkbox" checked={tour.isPopular} onChange={(e) => setTour({ ...tour, isPopular: e.target.checked })} /> ยอดนิยม</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={tour.isActive} onChange={(e) => setTour({ ...tour, isActive: e.target.checked })} /> เปิดขาย</label>
          <button className="btn-primary w-full gap-2"><Save size={18} /> บันทึก</button>
        </form>
        </div>
        <div className="card overflow-x-auto p-5">
          <h2 className="text-2xl font-bold">แพ็กเกจ</h2>
          <table className="mt-4 w-full min-w-[760px] text-left text-sm">
            <thead><tr className="border-b"><th className="py-3">ชื่อ</th><th>ราคา</th><th>สถานะ</th><th></th></tr></thead>
            <tbody>{tours.map((item) => (
              <tr className="border-b" key={item.id}>
                <td className="py-3 font-semibold">{item.title}</td>
                <td>{money(item.price)}</td>
                <td>{item.isActive ? 'เปิดขาย' : 'ปิด'}</td>
                <td className="space-x-2 text-right">
                  <button className="btn-outline" onClick={() => editTour(item)}>แก้ไข</button>
                  <button className="btn-outline" onClick={() => removeTour(item.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="card mt-8 overflow-x-auto p-5">
        <h2 className="text-2xl font-bold">รายการจองและตรวจสลิป</h2>
        <table className="mt-4 w-full min-w-[900px] text-left text-sm">
          <thead><tr className="border-b"><th className="py-3">ทัวร์</th><th>ลูกค้า</th><th>ยอด</th><th>สถานะ</th><th>สลิป</th><th>จัดการ</th></tr></thead>
          <tbody>{bookings.map((booking) => (
            <tr className="border-b align-top" key={booking.id}>
              <td className="py-3 font-semibold">{booking.tourTitle}</td>
              <td>{booking.customerName}<br />{booking.customerPhone}</td>
              <td>{money(booking.totalAmount)}</td>
              <td>{statusText[booking.status] || booking.status}</td>
              <td>{booking.slipUrl ? <a className="text-ocean underline" href={booking.slipUrl} target="_blank">เปิดสลิป</a> : 'ยังไม่มี'}</td>
              <td className="space-x-2">
                <button className="btn-outline" onClick={() => setStatus(booking.id, 'checking')}>ตรวจสอบ</button>
                <button className="btn-outline" onClick={() => setStatus(booking.id, 'paid')}>ชำระสำเร็จ</button>
                <button className="btn-outline" onClick={() => setStatus(booking.id, 'cancelled')}>ยกเลิก</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </section>
    </main>
  );
}
