import { z } from 'zod';

export const LocationZodSchema = z.object({
  value: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});
export type Location = z.infer<typeof LocationZodSchema>;
