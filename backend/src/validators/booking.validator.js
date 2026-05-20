import { z } from 'zod';

export const bookingSchema = z.object({
  body: z.object({
    tourId: z.string().uuid(),
    travelDate: z.string().date(),
    travelerCount: z.coerce.number().int().positive(),
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    customerPhone: z.string().min(9)
  })
});

export const statusSchema = z.object({
  body: z.object({
    status: z.enum(['pending_payment', 'checking', 'paid', 'cancelled'])
  })
});
