import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, addToast } from '@heroui/react';

import { providerService } from '@/services/provider.service';
import { handleApiError } from '@/utils/error-handler';
import { ProviderPayloadType, providerPayloadSchema } from './provider.schema';

const ProviderForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ProviderPayloadType>({
    resolver: zodResolver(providerPayloadSchema),
    defaultValues: {
      name: '',
      nit: '',
      email: '',
      contactNumber: '',
      address: '',
    },
    mode: 'all',
  });

  const onSubmit = async (payload: ProviderPayloadType) => {
    setLoading(true);

    try {
      const res = await providerService.createProvider(payload);

      if (res) {
        addToast({
          title: 'Proveedor creado',
          description: `El proveedor "${res.name}" ha sido creado exitosamente.`,
          color: 'success',
        });

        reset();
        window.dispatchEvent(new Event('providerCreated'));
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nombre del proveedor"
        placeholder="Ej: Distribuidora ABC"
        isRequired
        isDisabled={loading}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="NIT"
        placeholder="123456789-0"
        isRequired
        isDisabled={loading}
        isInvalid={!!errors.nit}
        errorMessage={errors.nit?.message}
        {...register('nit')}
      />

      <Input
        type="email"
        label="Correo electrónico"
        placeholder="proveedor@ejemplo.com"
        isRequired
        isDisabled={loading}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Número de contacto"
        placeholder="3001234567"
        isRequired
        isDisabled={loading}
        isInvalid={!!errors.contactNumber}
        errorMessage={errors.contactNumber?.message}
        {...register('contactNumber')}
      />

      <Input
        label="Dirección"
        placeholder="Calle 123 # 45-67"
        isRequired
        isDisabled={loading}
        isInvalid={!!errors.address}
        errorMessage={errors.address?.message}
        {...register('address')}
      />
      <div className="flex gap-3 justify-end mt-4">
        <Button color="primary" type="submit" isLoading={loading}>
          Crear Proveedor
        </Button>
      </div>
    </form>
  );
};

export default ProviderForm;
