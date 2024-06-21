import { createZodDto } from '@anatine/zod-nestjs';
import { ZodTenantSchema } from '../schemas/tenant.zod';
export class CreateTenantDto extends createZodDto(ZodTenantSchema) {}
