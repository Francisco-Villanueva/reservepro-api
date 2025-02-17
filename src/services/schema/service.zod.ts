import { z } from 'zod';
import { PROVISION_VALUES } from '../interfaces/provision.interface';
import { MemberZodSchema } from 'src/members/schema/member.zod';

export const ServiceZodSchema = z.object({
  _id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number(),
  duration: z.number(),
  provision: z.enum(PROVISION_VALUES),
  members: z.array(MemberZodSchema),
  companyId: z.string().optional(),
});

export const CreateServiceZodSchema = ServiceZodSchema.omit({
  _id: true,
  members: true,
  companyId: true,
});
export const UpdateServiceZodSchema = ServiceZodSchema.omit({
  _id: true,
  members: true,
}).partial();

export type IService = z.infer<typeof ServiceZodSchema>;
export type ICreateService = z.infer<typeof CreateServiceZodSchema>;
export type IUpdateService = z.infer<typeof UpdateServiceZodSchema>;
export const AddServiceToCompanySchema = z.object({
  companyId: z.string().min(1),
  serviceId: z.string().min(1),
});
export const AddMemberSchema = z.object({
  memberId: z.string().min(1),
  serviceId: z.string().min(1),
});
