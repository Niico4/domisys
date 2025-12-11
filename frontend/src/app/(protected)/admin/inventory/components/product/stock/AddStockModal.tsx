'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  NumberInput,
  addToast,
  Select,
  SelectItem,
} from '@heroui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { productService } from '@/services/product.service';
import { providerService } from '@/services/provider.service';
import { handleApiError } from '@/utils/error-handler';
import {
  addStockPayloadSchema,
  AddStockPayloadType,
} from './schemas/add-stock.schema';
import { Provider } from '@/types/provider';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  onSuccess: () => void;
}

export function AddStockModal({
  isOpen,
  onClose,
  productId,
  productName,
  onSuccess,
}: AddStockModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddStockPayloadType>({
    resolver: zodResolver(addStockPayloadSchema),
    defaultValues: {
      quantity: 0,
      providerId: undefined,
    },
    mode: 'all',
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

  const onSubmit = async (payload: AddStockPayloadType) => {
    setIsLoading(true);
    try {
      await productService.addStock(productId, payload);

      addToast({
        title: 'Stock agregado',
        description: `Se han agregado ${payload.quantity} ${
          payload.quantity === 1 ? 'unidad' : 'unidades'
        } al producto.`,
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

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1">
            Agregar Stock
            <span className="text-sm font-normal text-default-500">
              {productName}
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label="Cantidad a agregar"
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
                name="providerId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Proveedor"
                    placeholder="Selecciona el proveedor"
                    isRequired
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
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleClose}>
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Agregar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
