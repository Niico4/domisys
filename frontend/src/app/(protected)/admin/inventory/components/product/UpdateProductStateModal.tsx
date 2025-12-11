'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  addToast,
  Button,
  Select,
  SelectItem,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { productService } from '@/services/product.service';
import { Product } from '@/types/inventory/product';
import { ProductState } from '@/types/inventory/enums/product-state';
import { handleApiError } from '@/utils/error-handler';

import {
  UpdateProductStatePayloadType,
  updateProductStateSchema,
} from './schemas/update-state.schema';

interface UpdateProductStateModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

export default function UpdateProductStateModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: UpdateProductStateModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProductStatePayloadType>({
    resolver: zodResolver(updateProductStateSchema),
    defaultValues: {
      state: product?.state,
    },
  });

  useEffect(() => {
    if (product && isOpen) {
      reset({
        state: product.state,
      });
    }
  }, [product, isOpen, reset]);

  if (!product) return null;

  const onSubmit = async (payload: UpdateProductStatePayloadType) => {
    setIsLoading(true);
    try {
      const result = await productService.updateProduct(product.id, payload);

      if (result) {
        addToast({
          title: 'Estado del producto actualizado',
          description: 'El estado del producto se ha actualizado correctamente',
          color: 'success',
        });

        onSuccess();
        onClose();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader>Actualizar Estado del Producto</ModalHeader>
        <ModalBody>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
