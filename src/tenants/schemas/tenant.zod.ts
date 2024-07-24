import { ROLES_VALUES } from 'src/constants/roles';
import { z } from 'zod';

export const ZodTenantSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: z.enum(ROLES_VALUES),
  userName: z.string().min(1),
  password: z.string().min(1),
  companyName: z.string().min(1),
  tenantName: z.string().optional(),
  image: z.string().optional(),
});
