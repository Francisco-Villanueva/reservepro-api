import { AppointmentSchema } from 'src/appointments/schema/appointment.schema';
import { AppointmentZodSchema } from 'src/appointments/schema/appointment.zod';
import { z } from 'zod';

export const CustomerZodSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  apointments: z.array(AppointmentZodSchema),
});
export const CreateCustomerZodSchema = CustomerZodSchema.omit({
  _id: true,
  apointments: true,
});
export const UpdateCustomerZodSchema = CustomerZodSchema.omit({
  _id: true,
  apointments: true,
}).optional();

export type ICustomer = z.infer<typeof CustomerZodSchema>;
export type ICreateCustomer = z.infer<typeof CreateCustomerZodSchema>;
export type IUpdateCustomer = z.infer<typeof UpdateCustomerZodSchema>;
