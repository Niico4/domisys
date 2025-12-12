'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Checkbox,
} from '@heroui/react';
import { Address } from '@/types/address';
import { AddressPayloadType, addressPayloadSchema } from '@/app/(protected)/customer/address/address.schema';

interface AddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressPayloadType) => Promise<void>;
  address?: Address | null;
  mode: 'create' | 'edit';
}

export const AddressForm = ({
  isOpen,
  onClose,
  onSubmit,
  address,
  mode,
}: AddressFormProps) => {
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressPayloadType>({
    resolver: zodResolver(addressPayloadSchema),
    defaultValues: {
      alias: '',
      city: '',
      neighborhood: '',
      street: '',
      details: null,
      isDefault: false,
    },
    mode: 'all',
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && address) {
        reset({
          alias: address.alias,
          city: address.city,
          neighborhood: address.neighborhood,
          street: address.street,
          details: address.details ?? null,
          isDefault: address.isDefault,
        });
      } else {
        reset({
          alias: '',
          city: '',
          neighborhood: '',
          street: '',
          details: null,
          isDefault: false,
        });
      }
    }
  }, [isOpen, mode, address, reset]);

  const onFormSubmit = async (data: AddressPayloadType) => {
    try {
      await onSubmit(data);
      onClose();
      reset();
    } catch (error) {
      console.error('Error submitting address:', error);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl" 
      scrollBehavior="inside"
      placement="center"
      classNames={{
        backdrop: '!z-[100]',
        base: '!z-[101]',
        wrapper: '!z-[101]',
      }}
    >
      <ModalContent className="relative">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <ModalHeader>
            {mode === 'create' ? 'Agregar dirección' : 'Editar dirección'}
          </ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              label="Alias (ej: Casa, Trabajo)"
              placeholder="Casa"
              isRequired
              isDisabled={isSubmitting}
              isInvalid={!!errors.alias}
              errorMessage={errors.alias?.message}
              variant="bordered"
              {...register('alias')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ciudad"
                placeholder="Bogotá"
                isRequired
                isDisabled={isSubmitting}
                isInvalid={!!errors.city}
                errorMessage={errors.city?.message}
                variant="bordered"
                {...register('city')}
              />

              <Input
                label="Barrio"
                placeholder="Centenario"
                isRequired
                isDisabled={isSubmitting}
                isInvalid={!!errors.neighborhood}
                errorMessage={errors.neighborhood?.message}
                variant="bordered"
                {...register('neighborhood')}
              />
            </div>

            <Input
              label="Calle"
              placeholder="Calle 17c #134-70"
              isRequired
              isDisabled={isSubmitting}
              isInvalid={!!errors.street}
              errorMessage={errors.street?.message}
              variant="bordered"
              {...register('street')}
            />

            <Input
              label="Detalles adicionales (opcional)"
              placeholder="Interior 6 apartamento 104"
              isDisabled={isSubmitting}
              isInvalid={!!errors.details}
              errorMessage={errors.details?.message}
              variant="bordered"
              {...register('details')}
            />

            <Controller
              name="isDefault"
              control={control}
              render={({ field }) => (
                <Checkbox
                  isSelected={field.value}
                  onValueChange={field.onChange}
                  isDisabled={isSubmitting}
                  color="primary"
                >
                  <span className="text-sm text-default-700">
                    Establecer como dirección predeterminada
                  </span>
                </Checkbox>
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={onClose}
              isDisabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={isSubmitting}
            >
              {mode === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
