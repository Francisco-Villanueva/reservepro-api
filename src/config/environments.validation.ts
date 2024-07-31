import { z } from 'zod';

export const ZodEnvironmentsSchema = z.object({
  DB_CONNECTION_STRING: z.string().min(1),
  PORT: z.string().default('3001'),
  JWTSECRETKEY: z.string().min(1),
  JWTREFRESHTOKENKEY: z.string().min(1),
  GOOGLE_MAPS_APIKEY: z.string().min(1),
  NODE_ENV: z.string().optional(),
});

type EnvType = z.infer<typeof ZodEnvironmentsSchema>;
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvType {}
  }
}
