'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { api } from '../../lib/api';
import { money, statusText } from '../../lib/format';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState({});

  async function load() {
    try {
      const { data } = await api.get('/bookings/me');
      setBookings(data.bookings || []);
    } catch {
      toast.error('กรุณาเข้าสู่ระบบเพื่อดูประวัติการจอง');
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function upload(bookingId) {
    if (!file[bookingId]) return toast.error('กรุณาเลือกไฟล์สลิป');
    const form = new FormData();
    form.append('slip', file[bookingId]);
    await api.post(`/payments/${bookingId}/slip`, form);
    toast.success('ส่งสลิปแล้ว');
    load();
  }

  return (
    <>
      <Header />
      <main className="container-pad min-h-[70vh] py-12">
        <h1 className="text-4xl font-bold">ประวัติการจอง</h1>
        {loading ? <p className="mt-8">กำลังโหลด...</p> : (
          <div className="mt-8 space-y-5">
            {bookings.map((booking) => (
              <div key={booking.id} className="card grid gap-5 p-5 md:grid-cols-[1fr_280px]">
                <div>
                  <p className="font-semibold text-ocean">{statusText[booking.status] || booking.status}</p>
                  <h2 className="mt-2 text-2xl font-bold">{booking.tourTitle}</h2>
                  <p className="mt-2 text-slate-600">เดินทาง {new Date(booking.travelDate).toLocaleDateString('th-TH')} • {booking.travelerCount} คน</p>
                  <p className="mt-2 text-xl font-bold">{money(booking.totalAmount)}</p>
                  {booking.slipUrl && <a className="mt-3 inline-block text-ocean underline" href={booking.slipUrl} target="_blank">ดูสลิปที่อัปโหลด</a>}
                </div>
                <div>
                  {booking.qrCodeUrl && <img src={booking.qrCodeUrl} className="mx-auto h-40 w-40" alt="PromptPay QR" />}
                  {booking.status !== 'paid' && (
                    <div className="mt-3 space-y-2">
                      <input className="input" type="file" accept="image/*" onChange={(event) => setFile({ ...file, [booking.id]: event.target.files[0] })} />
                      <button className="btn-primary w-full" onClick={() => upload(booking.id)}>อัปโหลดสลิป</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {!bookings.length && <p className="text-slate-600">ยังไม่มีรายการจอง</p>}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
