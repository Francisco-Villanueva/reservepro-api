import { z } from 'zod';

export const AppointmentZodSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  time: z.string(),
  date: z.string(),
  memberId: z.string(),
  service: z.string(),
});
