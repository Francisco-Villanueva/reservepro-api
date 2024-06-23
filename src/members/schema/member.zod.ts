import { WorkhourZodSchema } from 'src/common/workhours';
import { ZodTenantSchema } from 'src/tenants/schemas/tenant.zod';
import { z } from 'zod';

export const MemberZodSchema = ZodTenantSchema.omit({
  tenantName: true,
}).extend({
  phone: z.string().optional(),
  workhours: z.array(WorkhourZodSchema).optional(),
});
export const UpdateMemberZodSchema = ZodTenantSchema.omit({
  tenantName: true,
})
  .partial()
  .extend({
    phone: z.string().optional(),
    workhours: z.array(WorkhourZodSchema).optional(),
  });
