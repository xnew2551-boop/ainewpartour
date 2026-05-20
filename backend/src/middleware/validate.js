import { AppError } from '../utils/appError.js';

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });
  if (!result.success) {
    return next(new AppError(result.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง', 400));
  }
  req.validated = result.data;
  return next();
};
