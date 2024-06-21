import { createZodDto } from '@anatine/zod-nestjs';
import { CompanuZodSchema } from '../schema/company.zod';

export class CompanyDTO extends createZodDto(CompanuZodSchema) {}
