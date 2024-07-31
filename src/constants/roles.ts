export const ROLES_VALUES = ['BASIC', 'ADMIN'] as const;

export type Role = (typeof ROLES_VALUES)[number];

export enum ACCESS_LEVEL {
  DEVELOPER = 30,
  MANTEINER = 40,
  OWNER = 50,
}
