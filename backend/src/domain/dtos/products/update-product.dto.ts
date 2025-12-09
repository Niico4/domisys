import { ProductState } from '@/generated/enums';
import { z } from 'zod';

export const updateProductDto = z
  .object({
    name: z
      .string({ error: 'El nombre del producto es obligatorio.' })
      .trim()
      .min(3, { error: 'El nombre debe tener mínimo 3 caracteres.' })
      .max(100, { error: 'El nombre puede tener máximo 100 caracteres.' })
      .optional(),

    price: z.coerce
      .number({ error: 'El precio es obligatorio y debe ser un número.' })
      .nonnegative({ error: 'El precio no puede ser negativo.' })
      .optional(),

    stock: z.coerce
      .number({ error: 'El stock es obligatorio y debe ser un número.' })
      .int({ error: 'El stock debe ser un número entero.' })
      .nonnegative({ error: 'El stock no puede ser negativo.' })
      .optional(),

    measure: z
      .string({ error: 'La unidad de medida es obligatoria.' })
      .trim()
      .min(1, { error: 'La unidad de medida no puede estar vacía.' })
      .max(25, {
        error: 'La unidad de medida no puede superar los 25 caracteres.',
      })
      .optional(),

    lot: z
      .string({ error: 'El lote es obligatorio.' })
      .trim()
      .min(9, { error: 'El lote debe tener al menos 9 caracteres.' })
      .max(15, { error: 'El lote no puede superar los 15 caracteres.' })
      .optional(),

    expirationDate: z.iso
      .date({ error: 'El formato de la fecha debe ser válido' })
      .nullable()
      .optional(),

    image: z
      .string({ error: 'La imagen debe ser una URL o un texto válido.' })
      .trim()
      .max(200)
      .nullable()
      .optional(),

    state: z
      .enum(ProductState, {
        error: 'El estado del producto es obligatorio y debe ser válido.',
      })
      .optional(),

    providerId: z.coerce
      .number({ error: 'El proveedor es obligatorio y debe ser un número.' })
      .int({ error: 'El proveedor debe ser un número entero.' })
      .positive({ error: 'El proveedor debe ser un ID válido.' })
      .optional(),

    categoryId: z.coerce
      .number({ error: 'La categoría es obligatoria y debe ser un número.' })
      .int({ error: 'La categoría debe ser un número entero.' })
      .positive({ error: 'La categoría debe ser un ID válido.' })
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== null),
    {
      message: 'Debes enviar al menos un campo para actualizar.',
    }
  );

export type UpdateProductDtoType = z.infer<typeof updateProductDto>;
