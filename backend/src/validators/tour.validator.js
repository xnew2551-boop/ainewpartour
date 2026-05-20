import { z } from 'zod';

export const tourSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
    location: z.string().min(2),
    country: z.string().min(2),
    price: z.coerce.number().positive(),
    durationDays: z.coerce.number().int().positive(),
    hotel: z.string().min(2),
    imageUrl: z.string().url(),
    description: z.string().min(10),
    itinerary: z.array(z.string().min(2)).default([]),
    isPopular: z.boolean().default(false),
    isActive: z.boolean().default(true)
  })
});
