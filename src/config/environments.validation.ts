import { z } from 'zod';

export const ZodEnvironmentsSchema = z.object({
  DB_CONNECTION_STRING: z.string().min(1),
  PORT: z.string().default('3001'),
  JWTSECRETKEY: z.string().min(1),
  JWTREFRESHTOKENKEY: z.string().min(1),
});
