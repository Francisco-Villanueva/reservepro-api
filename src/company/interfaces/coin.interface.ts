export const COIN_VALUES = ['ARS', 'USD'] as const;
export type Coin = (typeof COIN_VALUES)[number];
