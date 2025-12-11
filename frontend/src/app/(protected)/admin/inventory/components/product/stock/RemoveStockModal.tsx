'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  addToast,
  Button,
  NumberInput,
  Select,
  SelectItem,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { productService } from '@/services/product.service';
import { providerService } from '@/services/provider.service';
import { handleApiError } from '@/utils/error-handler';
import {
  MovementReason,
  MovementReasonLabels,
} from '@/types/inventory/enums/movement-inventory';
import {
  RemoveStockPayloadType,
  removeStockPayloadSchema,
} from './schemas/remove-stock.schema';
import { Provider } from '@/types/provider';

interface RemoveStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  onSuccess: () => void;
}

export default function RemoveStockModal({
  isOpen,
  onClose,
  productId,
  productName,
  onSuccess,
}: RemoveStockModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RemoveStockPayloadType>({
    resolver: zodResolver(removeStockPayloadSchema),
    defaultValues: {
      quantity: 1,
      reason: MovementReason.other,
      providerId: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadProviders();
    }
  }, [isOpen]);

  const loadProviders = async () => {
    try {
      const data = await providerService.getAllProviders();
      if (!data) return;
      setProviders(data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const onSubmit = async (payload: RemoveStockPayloadType) => {
    setIsLoading(true);
    try {
      await productService.removeStock(productId, payload);
      addToast({
        title: 'Stock retirado',
        description: 'El stock se ha retirado correctamente',
        color: 'success',
      });
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Retirar Stock
          <span className="text-sm font-normal text-default-500">
            {productName}
          </span>
        </ModalHeader>
        <ModalBody className="pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Cantidad a retirar"
                  placeholder="0"
                  isRequired
                  isInvalid={!!errors.quantity}
                  errorMessage={errors.quantity?.message}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            />

            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <Select
                  label="Motivo"
                  isRequired
                  isDisabled={isLoading}
                  placeholder="Selecciona el motivo"
                  isInvalid={!!errors.reason}
                  errorMessage={errors.reason?.message}
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as MovementReason;
                    field.onChange(value);
                  }}
                >
                  {Object.values(MovementReason).map((value) => (
                    <SelectItem key={value}>
                      {MovementReasonLabels[value]}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              name="providerId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Proveedor"
                  placeholder="Selecciona el proveedor"
                  isRequired
                  isDisabled={isLoading}
                  isInvalid={!!errors.providerId}
                  errorMessage={errors.providerId?.message}
                  selectedKeys={field.value ? [field.value.toString()] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0];
                    field.onChange(value ? Number(value) : undefined);
                  }}
                >
                  {providers.map((provider) => (
                    <SelectItem key={provider.id.toString()}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                color="danger"
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                Retirar Stock
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
