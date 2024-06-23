import { createZodDto } from '@anatine/zod-nestjs';
import {
  AppointmentZodSchema,
  CancelAppointmentZodSchema,
  SlotsZodSchmea,
} from '../schema/appointment.zod';

export class AppointmentDTO extends createZodDto(AppointmentZodSchema) {}
export class SlotAppointmentDTO extends createZodDto(SlotsZodSchmea) {}
export class CancelAppointmentDTO extends createZodDto(
  CancelAppointmentZodSchema,
) {}
