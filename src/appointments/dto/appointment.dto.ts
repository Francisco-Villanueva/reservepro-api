import { createZodDto } from '@anatine/zod-nestjs';
import { AppointmentZodSchema } from '../schema/appointment.zod';

export class AppointmentDTO extends createZodDto(AppointmentZodSchema) {}
