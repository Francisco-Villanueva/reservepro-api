import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const ZodLoginDto = z.object({
  email: z.string().optional(),
  userName: z.string().optional(),
  password: z.string(),
});

export class LoginDto extends createZodDto(ZodLoginDto) {}
