import sanitizeHtml from 'sanitize-html';
import { query } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

const mapTour = (row) => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  location: row.location,
  country: row.country,
  price: Number(row.price),
  durationDays: row.duration_days,
  hotel: row.hotel,
  imageUrl: row.image_url,
  description: row.description,
  itinerary: row.itinerary || [],
  isPopular: row.is_popular,
  isActive: row.is_active
});

export const listTours = asyncHandler(async (req, res) => {
  const includeInactive = req.auth?.role === 'admin' && req.query.includeInactive === 'true';
  const { rows } = await query(
    `SELECT * FROM tours ${includeInactive ? '' : 'WHERE is_active = true'} ORDER BY is_popular DESC, created_at DESC`
  );
  res.json({ tours: rows.map(mapTour) });
});

export const getTour = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT * FROM tours WHERE slug = $1 OR id::text = $1 LIMIT 1', [req.params.slug]);
  if (!rows[0]) throw new AppError('ไม่พบแพ็กเกจทัวร์', 404);
  res.json({ tour: mapTour(rows[0]) });
});

export const createTour = asyncHandler(async (req, res) => {
  const tour = req.validated.body;
  const { rows } = await query(
    `INSERT INTO tours (title, slug, location, country, price, duration_days, hotel, image_url, description, itinerary, is_popular, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [
      tour.title,
      tour.slug,
      tour.location,
      tour.country,
      tour.price,
      tour.durationDays,
      tour.hotel,
      tour.imageUrl,
      sanitizeHtml(tour.description),
      JSON.stringify(tour.itinerary),
      tour.isPopular,
      tour.isActive
    ]
  );
  res.status(201).json({ tour: mapTour(rows[0]) });
});

export const updateTour = asyncHandler(async (req, res) => {
  const tour = req.validated.body;
  const { rows } = await query(
    `UPDATE tours SET title=$1, slug=$2, location=$3, country=$4, price=$5, duration_days=$6, hotel=$7,
     image_url=$8, description=$9, itinerary=$10, is_popular=$11, is_active=$12, updated_at=NOW()
     WHERE id=$13 RETURNING *`,
    [
      tour.title,
      tour.slug,
      tour.location,
      tour.country,
      tour.price,
      tour.durationDays,
      tour.hotel,
      tour.imageUrl,
      sanitizeHtml(tour.description),
      JSON.stringify(tour.itinerary),
      tour.isPopular,
      tour.isActive,
      req.params.id
    ]
  );
  if (!rows[0]) throw new AppError('ไม่พบแพ็กเกจ', 404);
  res.json({ tour: mapTour(rows[0]) });
});

export const deleteTour = asyncHandler(async (req, res) => {
  await query('DELETE FROM tours WHERE id = $1', [req.params.id]);
  res.status(204).send();
});
