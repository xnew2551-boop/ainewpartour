import { cloudinary } from '../config/cloudinary.js';
import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

function uploadBuffer(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });
}

export const uploadSlip = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('กรุณาอัปโหลดสลิป', 400);
  const booking = await query('SELECT user_id FROM bookings WHERE id = $1', [req.params.bookingId]);
  if (!booking.rows[0]) throw new AppError('ไม่พบรายการจอง', 404);
  if (req.auth.role !== 'admin' && booking.rows[0].user_id !== req.auth.sub) {
    throw new AppError('ไม่มีสิทธิ์อัปโหลดสลิปนี้', 403);
  }
  const result = await uploadBuffer(req.file.buffer, 'ainewpartour/slips');
  const { rows } = await query(
    `UPDATE payments SET slip_url=$1, status='checking', updated_at=NOW() WHERE booking_id=$2 RETURNING *`,
    [result.secure_url, req.params.bookingId]
  );
  await query("UPDATE bookings SET status='checking', updated_at=NOW() WHERE id=$1", [req.params.bookingId]);
  res.json({ payment: rows[0] });
});
