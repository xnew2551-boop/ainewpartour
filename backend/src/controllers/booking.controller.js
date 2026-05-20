import { pool, query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { createPromptPayPayload } from '../utils/promptpay.js';
import QRCode from 'qrcode';

const mapBooking = (row) => ({
  id: row.id,
  tourId: row.tour_id,
  tourTitle: row.tour_title,
  imageUrl: row.image_url,
  travelDate: row.travel_date,
  travelerCount: row.traveler_count,
  customerName: row.customer_name,
  customerEmail: row.customer_email,
  customerPhone: row.customer_phone,
  totalAmount: Number(row.total_amount),
  status: row.status,
  paymentStatus: row.payment_status,
  slipUrl: row.slip_url,
  qrCodeUrl: row.qr_code_url,
  createdAt: row.created_at
});

export const createBooking = asyncHandler(async (req, res) => {
  const input = req.validated.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const tourResult = await client.query('SELECT id, price FROM tours WHERE id = $1 AND is_active = true', [input.tourId]);
    const tour = tourResult.rows[0];
    if (!tour) throw new AppError('ไม่พบแพ็กเกจทัวร์', 404);
    const total = Number(tour.price) * input.travelerCount;
    const bookingRows = await client.query(
      `INSERT INTO bookings (user_id, tour_id, travel_date, traveler_count, customer_name, customer_email, customer_phone, total_amount)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.auth.sub, input.tourId, input.travelDate, input.travelerCount, input.customerName, input.customerEmail, input.customerPhone, total]
    );
    const booking = bookingRows.rows[0];
    const settingResult = await client.query("SELECT value FROM site_settings WHERE key='promptPay'");
    const promptPayId = settingResult.rows[0]?.value || process.env.PROMPTPAY_ID || '0962032266';
    const payload = createPromptPayPayload(promptPayId, total);
    const qrCodeUrl = await QRCode.toDataURL(payload);
    await client.query('INSERT INTO payments (booking_id, amount, promptpay_payload, qr_code_url) VALUES ($1,$2,$3,$4)', [
      booking.id,
      total,
      payload,
      qrCodeUrl
    ]);
    await client.query('COMMIT');
    res.status(201).json({ booking: { ...booking, total_amount: total }, payment: { promptpayPayload: payload, qrCodeUrl } });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

export const myBookings = asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT b.*, t.title AS tour_title, t.image_url, p.status AS payment_status, p.slip_url, p.qr_code_url
     FROM bookings b JOIN tours t ON t.id = b.tour_id
     LEFT JOIN payments p ON p.booking_id = b.id
     WHERE b.user_id = $1 ORDER BY b.created_at DESC`,
    [req.auth.sub]
  );
  res.json({ bookings: rows.map(mapBooking) });
});

export const allBookings = asyncHandler(async (_req, res) => {
  const { rows } = await query(
    `SELECT b.*, t.title AS tour_title, t.image_url, p.status AS payment_status, p.slip_url, p.qr_code_url
     FROM bookings b JOIN tours t ON t.id = b.tour_id
     LEFT JOIN payments p ON p.booking_id = b.id
     ORDER BY b.created_at DESC`
  );
  res.json({ bookings: rows.map(mapBooking) });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.validated.body;
  const { rows } = await query('UPDATE bookings SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *', [status, req.params.id]);
  if (!rows[0]) throw new AppError('ไม่พบรายการจอง', 404);
  if (status === 'paid') {
    await query("UPDATE payments SET status='paid', reviewed_by=$1, updated_at=NOW() WHERE booking_id=$2", [req.auth.sub, req.params.id]);
  }
  res.json({ booking: rows[0] });
});
