import { createZodDto } from '@anatine/zod-nestjs';
import {
  CreateCustomerZodSchema,
  UpdateCustomerZodSchema,
} from '../schema/customer.zod';

export class CreateCustomerDTO extends createZodDto(CreateCustomerZodSchema) {}
export class UpdateCustomerDTO extends createZodDto(UpdateCustomerZodSchema) {}
