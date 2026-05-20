# ไอนิวพาทัวร์ API Documentation

Base URL: `https://your-backend.onrender.com/api`

ส่ง JWT ผ่าน Header:

```http
Authorization: Bearer <token>
```

## Auth

`POST /auth/register`

```json
{ "name": "สมชาย", "email": "user@gmail.com", "phone": "0962032266", "password": "password123" }
```

`POST /auth/login`

```json
{ "email": "user@gmail.com", "password": "password123" }
```

`POST /auth/admin/login`

```json
{ "email": "admin@ainewpartour.com", "password": "096203226LL" }
```

`GET /auth/me`

## Tours

`GET /tours`

`GET /tours/:slug`

`POST /tours` Admin only

`PUT /tours/:id` Admin only

`DELETE /tours/:id` Admin only

Tour payload:

```json
{
  "title": "ญี่ปุ่น โตเกียว ฟูจิ",
  "slug": "japan-tokyo-fuji",
  "location": "โตเกียว - ฟูจิ",
  "country": "ญี่ปุ่น",
  "price": 45900,
  "durationDays": 5,
  "hotel": "Tokyo Bay Luxury Hotel",
  "imageUrl": "https://...",
  "description": "รายละเอียดทัวร์",
  "itinerary": ["วันแรก...", "วันที่สอง..."],
  "isPopular": true,
  "isActive": true
}
```

## Bookings

`POST /bookings` User only

```json
{
  "tourId": "uuid",
  "travelDate": "2026-07-01",
  "travelerCount": 2,
  "customerName": "สมชาย",
  "customerEmail": "user@gmail.com",
  "customerPhone": "0962032266"
}
```

Response includes `payment.qrCodeUrl` for PromptPay QR.

`GET /bookings/me` User only

`GET /bookings` Admin only

`PATCH /bookings/:id/status` Admin only

```json
{ "status": "paid" }
```

Allowed statuses: `pending_payment`, `checking`, `paid`, `cancelled`

## Payments

`POST /payments/:bookingId/slip`

Multipart form field: `slip`

## Site

`GET /site`

`PUT /site` Admin only

```json
{
  "name": "ไอนิวพาทัวร์",
  "tagline": "เที่ยวสนุก ครบ จบในที่เดียว",
  "phone": "096-203-2266",
  "email": "udomdath21112551@gmail.com",
  "promptPay": "0962032266"
}
```
