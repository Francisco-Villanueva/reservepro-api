import mongoose from 'mongoose';
import { MemberZodSchema } from 'src/members/schema/member.zod';
import { z } from 'zod';
const isoStringRegex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))$/;
export const AppointmentZodSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  time: z.string().min(1),
  duration: z.number().optional(),
  date: z
    .string()
    .trim()
    .refine((value) => isoStringRegex.test(value), {
      message:
        'Date must be a valid ISO 8601 string including time and timezone',
    }),
  memberId: z.string().min(1),
  member: MemberZodSchema.omit({
    password: true,
  }).optional(),
  serviceId: z.string().min(1),
});

export const SlotsZodSchmea = z.object({
  date: z
    .string()
    .trim()
    .refine((value) => isoStringRegex.test(value), {
      message:
        'Date must be a valid ISO 8601 string including time and timezone',
    }),
  memberId: z.string().min(1),
  duration: z.number(),
});
export const CancelAppointmentZodSchema = z.object({
  memberId: z.string().min(1),
  appointmemntId: z.instanceof(mongoose.Schema.ObjectId),
});

export type IAppointment = z.infer<typeof AppointmentZodSchema>;
