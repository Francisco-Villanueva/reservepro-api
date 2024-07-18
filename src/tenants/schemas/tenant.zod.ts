import { ROLES_VALUES } from 'src/constants/roles';
import { z } from 'zod';

export const ZodTenantSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: z.enum(ROLES_VALUES),
  userName: z.string(),
  password: z.string(),
  tenantName: z.string(),
  image: z.string().optional(),
});
