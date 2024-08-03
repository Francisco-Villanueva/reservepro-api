import { createZodDto } from '@anatine/zod-nestjs';
import {
  ServiceZodSchema,
  CreateServiceZodSchema,
  UpdateServiceZodSchema,
  AddServiceToCompanySchema,
} from '../schema/service.zod';

export class ServicesDto extends createZodDto(ServiceZodSchema) {}
export class CreateServicesDto extends createZodDto(CreateServiceZodSchema) {}
export class UpdateServicesDto extends createZodDto(UpdateServiceZodSchema) {}
export class AddToCompanyServicesDto extends createZodDto(
  AddServiceToCompanySchema,
) {}
