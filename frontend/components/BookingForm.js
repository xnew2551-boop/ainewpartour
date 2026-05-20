'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { money } from '../lib/format';

export default function BookingForm({ tour }) {
  const [form, setForm] = useState({ travelDate: '', travelerCount: 1, customerName: '', customerEmail: '', customerPhone: '' });
  const [payment, setPayment] = useState(null);
  const [slip, setSlip] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/bookings', { ...form, tourId: tour.id, travelerCount: Number(form.travelerCount) });
      setPayment({ bookingId: data.booking.id, ...data.payment, total: Number(data.booking.total_amount) });
      toast.success('สร้างรายการจองแล้ว');
    } catch (error) {
      toast.error(error.response?.data?.message || 'กรุณาเข้าสู่ระบบก่อนจอง');
    } finally {
      setLoading(false);
    }
  }

  async function uploadSlip(event) {
    event.preventDefault();
    if (!slip || !payment?.bookingId) return;
    const data = new FormData();
    data.append('slip', slip);
    try {
      await api.post(`/payments/${payment.bookingId}/slip`, data);
      toast.success('อัปโหลดสลิปแล้ว รอแอดมินตรวจสอบ');
      window.location.href = '/bookings';
    } catch (error) {
      toast.error(error.response?.data?.message || 'อัปโหลดไม่สำเร็จ');
    }
  }

  if (payment) {
    return (
      <div className="card p-6">
        <h2 className="text-2xl font-bold">ชำระเงิน PromptPay</h2>
        <p className="mt-2 text-slate-600">ยอดชำระ {money(payment.total)}</p>
        <img className="mx-auto my-5 h-56 w-56" src={payment.qrCodeUrl} alt="PromptPay QR" />
        <form onSubmit={uploadSlip} className="space-y-3">
          <input className="input" type="file" accept="image/*" onChange={(event) => setSlip(event.target.files[0])} required />
          <button className="btn-primary w-full">อัปโหลดสลิป</button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <h2 className="text-2xl font-bold">จองทัวร์นี้</h2>
      <input className="input" name="travelDate" type="date" value={form.travelDate} onChange={update} required />
      <input className="input" name="travelerCount" type="number" min="1" value={form.travelerCount} onChange={update} required />
      <input className="input" name="customerName" placeholder="ชื่อผู้จอง" value={form.customerName} onChange={update} required />
      <input className="input" name="customerPhone" placeholder="เบอร์โทร" value={form.customerPhone} onChange={update} required />
      <input className="input" name="customerEmail" type="email" placeholder="Gmail" value={form.customerEmail} onChange={update} required />
      <div className="rounded-md bg-skysoft p-4 font-semibold text-ocean">
        รวมโดยประมาณ {money(tour.price * Number(form.travelerCount || 1))}
      </div>
      <button className="btn-primary w-full" disabled={loading}>{loading ? 'กำลังบันทึก...' : 'สร้างรายการจอง'}</button>
    </form>
  );
}
