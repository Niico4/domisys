import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addToast, Button, Input, Textarea } from '@heroui/react';

import { categoryService } from '@/services/category.service';
import { handleApiError } from '@/utils/error-handler';
import { categoryPayloadSchema, CategoryPayloadType } from './category.schema';

const CategoryForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CategoryPayloadType>({
    resolver: zodResolver(categoryPayloadSchema),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'all',
  });

  const onSubmit = async (payload: CategoryPayloadType) => {
    setLoading(true);

    try {
      const res = await categoryService.createCategory(payload);

      if (res) {
        addToast({
          title: 'Categoría creada',
          description: `La categoría "${res.name}" ha sido creada exitosamente.`,
          color: 'success',
        });

        reset();
        window.dispatchEvent(new Event('categoryCreated'));
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
        label="Nombre de la categoría"
        placeholder="Ej: Granos"
        isRequired
        isDisabled={loading}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        {...register('name')}
      />

      <Textarea
        label="Descripción (opcional)"
        placeholder="Descripción de la categoría"
        isDisabled={loading}
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
        {...register('description')}
      />

      <div className="flex gap-3 justify-end mt-4">
        <Button color="primary" type="submit" isLoading={loading}>
          Crear Categoría
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
