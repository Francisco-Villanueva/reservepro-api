import { createZodDto } from '@anatine/zod-nestjs';
import { MemberZodSchema } from '../schema/member.zod';

export class MemberDto extends createZodDto(MemberZodSchema) {}
