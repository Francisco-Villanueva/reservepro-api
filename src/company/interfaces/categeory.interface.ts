export const CATEGORY_VALUES = [
  'Consultorio',
  'Centro de estética',
  'Cejas y Pestañas',
  'Spa',
  'Maquillaje',
  'Uñas',
  'Masajes',
  'Depilación',
  'Tatuajes',
  'Peluquería',
  'Barbería',
  'Peluquería Mascotas',
  'Asesorías',
  'Clases particulares',
  'Fotografía',
  'Otro',
] as const;
export type Category = (typeof CATEGORY_VALUES)[number];
