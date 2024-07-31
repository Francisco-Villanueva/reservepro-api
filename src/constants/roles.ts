import { number } from 'zod';

export const ROLES_VALUES = ['BASIC', 'ADMIN', 'MANAGER', 'EDITOR'] as const;

export type ROLES = (typeof ROLES_VALUES)[number];

export enum ACCESS_LEVEL {
  DEVELOPER = 30,
  MANTEINER = 40,
  OWNER = 50,
}
