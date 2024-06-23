import { WorkhourZodSchema } from 'src/common/workhours';
import { z } from 'zod';

export const CompanuZodSchema = z.object({
  name: z.string(),
  address: z.string(),
  coin: z.string(),
  status: z.boolean().optional(),
  services: z.array(z.string()),
  category: z.array(z.string()),
  image: z.string().optional(),
  email: z.string().optional(),
  workhours: z.array(WorkhourZodSchema).optional(),
});
