import { createZodDto } from '@anatine/zod-nestjs';
import {
  CompanyZodSchema,
  CreateCompanyZodSchema,
  UpdateCompanyZodSchema,
} from '../schema/company.zod';

export class CompanyDTO extends createZodDto(CompanyZodSchema) {}
export class CreateCompanyDTO extends createZodDto(CreateCompanyZodSchema) {}
export class UpdateCompanyDTO extends createZodDto(UpdateCompanyZodSchema) {}
