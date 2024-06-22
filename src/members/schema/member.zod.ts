import { ZodTenantSchema } from 'src/tenants/schemas/tenant.zod';
import { z } from 'zod';

export const MemberZodSchema = ZodTenantSchema.omit({
  tenantName: true,
}).extend({
  phone: z.string().optional(),
});
