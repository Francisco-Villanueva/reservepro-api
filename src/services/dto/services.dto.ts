import { createZodDto } from '@anatine/zod-nestjs';
import { ServiceZodSchema } from '../schema/service.zod';

export class ServicesDto extends createZodDto(ServiceZodSchema) {}
