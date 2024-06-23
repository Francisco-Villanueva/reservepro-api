import { createZodDto } from '@anatine/zod-nestjs';
import { MemberZodSchema, UpdateMemberZodSchema } from '../schema/member.zod';

export class MemberDto extends createZodDto(MemberZodSchema) {}
export class UpdateMemberDto extends createZodDto(UpdateMemberZodSchema) {}
