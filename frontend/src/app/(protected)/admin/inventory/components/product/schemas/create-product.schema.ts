import { ProductState } from '@/types/inventory/enums/product-state';
import { z } from 'zod';

export const createProductPayloadSchema = z.object({
  name: z
    .string({ message: 'El nombre del producto es obligatorio.' })
    .trim()
    .min(3, { message: 'El nombre debe tener mínimo 3 caracteres.' })
    .max(100, { message: 'El nombre puede tener máximo 100 caracteres.' }),

  price: z
    .number({ message: 'El precio es obligatorio y debe ser un número.' })
    .min(1, { message: 'El precio no puede ser negativo.' })
    .nonnegative({ message: 'El precio no puede ser negativo.' }),

  measure: z
    .string({ message: 'La unidad de medida es obligatoria.' })
    .trim()
    .min(1, { message: 'La unidad de medida no puede estar vacía.' })
    .max(25, {
      message: 'La unidad de medida no puede superar los 25 caracteres.',
    }),

  lot: z
    .string({ message: 'El lote es obligatorio.' })
    .trim()
    .min(6, { message: 'El lote debe tener al menos 6 caracteres.' })
    .max(15, { message: 'El lote no puede superar los 15 caracteres.' }),

  expirationDate: z
    .string({ message: 'El formato de la fecha debe ser válido' })
    .nullable()
    .optional(),

  image: z
    .string({ message: 'La imagen debe ser una URL o un texto válido.' })
    .trim()
    .max(200)
    .nullable()
    .optional(),

  state: z.enum(ProductState, {
    message: 'El estado del producto es obligatorio y debe ser válido.',
  }),

  providerId: z
    .number({ message: 'El proveedor es obligatorio.' })
    .int({ message: 'El proveedor debe ser un número entero.' })
    .positive({ message: 'El proveedor debe ser un ID válido.' }),

  categoryId: z
    .number({ message: 'La categoría es obligatoria.' })
    .int({ message: 'La categoría debe ser un número entero.' })
    .positive({ message: 'La categoría debe ser un ID válido.' }),
});

export type CreateProductPayloadType = z.infer<
  typeof createProductPayloadSchema
>;
