export const PROVISION_VALUES = [
  'Presencial',
  'Online',
  'A Domicilio',
] as const;
export type Provision = (typeof PROVISION_VALUES)[number];
