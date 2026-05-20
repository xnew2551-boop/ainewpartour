export function notFound(_req, _res, next) {
  const error = new Error('ไม่พบเส้นทาง API');
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: statusCode >= 500 ? 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง' : error.message
  });
}
