'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addToast, Button, Select, SelectItem } from '@heroui/react';
import { useState } from 'react';
import { productService } from '@/services/product.service';
import { handleApiError } from '@/utils/error-handler';
import { ProductState } from '@/types/inventory/enums/product-state';
import { Product } from '@/types/inventory/product';
import {
  updateProductStateSchema,
  UpdateProductStatePayloadType,
} from '../schemas/update-state.schema';

interface UpdateProductStateFormProps {
  product: Product;
  onSuccess: () => void;
}

export default function UpdateProductStateForm({
  product,
  onSuccess,
}: UpdateProductStateFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProductStatePayloadType>({
    resolver: zodResolver(updateProductStateSchema),
    defaultValues: {
      state: product.state,
    },
  });

  const onSubmit = async (data: UpdateProductStatePayloadType) => {
    setIsLoading(true);
    try {
      const result = await productService.updateProduct(product.id, data);

      if (result) {
        addToast({
          title: 'Estado del producto actualizado',
          description: 'El estado del producto se ha actualizado correctamente',
          color: 'success',
        });
        onSuccess();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="state"
        control={control}
        render={({ field }) => (
          <Select
            label="Estado"
            placeholder="Selecciona el estado"
            isDisabled={isLoading}
            isInvalid={!!errors.state}
            errorMessage={errors.state?.message}
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as ProductState;
              field.onChange(value);
            }}
          >
            <SelectItem key={ProductState.active}>Activo</SelectItem>
            <SelectItem key={ProductState.inactive}>Inactivo</SelectItem>
          </Select>
        )}
      />

      <div className="flex gap-3 justify-end mt-4">
        <Button
          color="primary"
          type="submit"
          isLoading={isLoading}
          isDisabled={isLoading || !isDirty}
        >
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
