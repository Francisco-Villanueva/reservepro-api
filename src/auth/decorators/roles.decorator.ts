import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/constants/key-decorators';
import { ROLES_VALUES } from 'src/constants/roles';

export const Roles = (...roles: Array<keyof typeof ROLES_VALUES>) =>
  SetMetadata(ROLES_KEY, roles);