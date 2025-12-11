'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { addToast } from '@heroui/react';

import { accessCodeService } from '@/services/access-code.service';
import { AccessCodeRole } from '@/types/user-management/access-code';
import {
  createAccessCodeSchema,
  CreateAccessCodeFormData,
} from '@/schemas/access-code.schema';
import { handleApiError } from '@/utils/error-handler';

interface CreateAccessCodeFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function CreateAccessCodeForm({
  onSuccess,
  onClose,
}: CreateAccessCodeFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateAccessCodeFormData>({
    resolver: zodResolver(createAccessCodeSchema),
  });

  const onSubmit = async (data: CreateAccessCodeFormData) => {
    try {
      setIsLoading(true);
      await accessCodeService.create(data);
      addToast({
        title: 'Código creado',
        description: 'El código de acceso ha sido creado exitosamente',
        color: 'success',
      });
      onSuccess();
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Rol"
        placeholder="Selecciona un rol"
        isRequired
        isInvalid={!!errors.role}
        errorMessage={errors.role?.message}
        onChange={(e) => setValue('role', e.target.value as AccessCodeRole)}
      >
        <SelectItem key={AccessCodeRole.admin}>Administrador</SelectItem>
        <SelectItem key={AccessCodeRole.delivery}>Repartidor</SelectItem>
        <SelectItem key={AccessCodeRole.cashier}>Cajero</SelectItem>
      </Select>

      <div className="flex gap-2 justify-end">
        <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
          Cancelar
        </Button>
        <Button color="primary" type="submit" isLoading={isLoading}>
          Crear código
        </Button>
      </div>
    </form>
  );
}
