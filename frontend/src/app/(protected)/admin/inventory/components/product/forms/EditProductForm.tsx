'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Input,
  Select,
  SelectItem,
  DateInput,
  addToast,
  Button,
  NumberInput,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import { parseDate } from '@internationalized/date';
import { productService } from '@/services/product.service';
import { providerService } from '@/services/provider.service';
import { categoryService } from '@/services/category.service';
import { handleApiError } from '@/utils/error-handler';
import { Provider } from '@/types/provider';
import { Category } from '@/types/category';
import { ProductState } from '@/types/inventory/enums/product-state';
import { Product } from '@/types/inventory/product';

import {
  editProductSchema,
  EditProductPayloadType,
} from '../schemas/edit-product.schema';
import { measure } from './CreateProductForm';

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
}

export default function EditProductForm({
  product,
  onClose,
}: EditProductFormProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    reset,
  } = useForm<EditProductPayloadType>({
    resolver: zodResolver(editProductSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const [providersData, categoriesData] = await Promise.all([
          providerService.getAllProviders(),
          categoryService.getAllCategories(),
        ]);

        reset({
          name: product.name,
          price: Number(product.price),
          measure: product.measure,
          lot: product.lot,
          expirationDate: product.expirationDate
            ? String(product.expirationDate).split('T')[0]
            : null,
          image: product.image,
          state: product.state,
          providerId: product.providerId || undefined,
          categoryId: product.categoryId || undefined,
        });

        if (providersData) setProviders(providersData);
        if (categoriesData) setCategories(categoriesData);
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [product, reset]);

  const onSubmit = async (payload: EditProductPayloadType) => {
    if (!product) return;

    setIsLoading(true);
    try {
      const result = await productService.updateProduct(product.id, payload);

      if (result) {
        addToast({
          title: 'Producto actualizado',
          description: `El producto ${payload.name} se ha actualizado correctamente`,
          color: 'success',
        });
        onClose();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-default-400">Cargando datos...</p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nombre del producto"
        placeholder="Ej: Arroz Diana"
        isRequired
        isDisabled={isLoading}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        {...register('name')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Precio"
              placeholder="0.00"
              isRequired
              isDisabled={isLoading}
              isInvalid={!!errors.price}
              errorMessage={errors.price?.message}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
              }}
            />
          )}
        />

        <Controller
          name="measure"
          control={control}
          render={({ field }) => (
            <Select
              className="max-w-xs"
              label="Unidad de medida"
              isRequired
              isDisabled={isLoading}
              placeholder="Selecciona la unidad de medida"
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                field.onChange(value as string);
              }}
            >
              {measure.map((animal) => (
                <SelectItem key={animal.key}>{animal.label}</SelectItem>
              ))}
            </Select>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Lote"
          placeholder="Ej: LOT-2024-001"
          isRequired
          isDisabled={isLoading}
          isInvalid={!!errors.lot}
          errorMessage={errors.lot?.message}
          {...register('lot')}
        />

        <Controller
          name="expirationDate"
          control={control}
          render={({ field }) => (
            <DateInput
              className="max-w-sm"
              label={'Fecha de vencimiento'}
              isDisabled={isLoading}
              isInvalid={!!errors.expirationDate}
              errorMessage={errors.expirationDate?.message}
              value={field.value ? parseDate(field.value) : null}
              onChange={(date) => {
                field.onChange(date ? date.toString() : null);
              }}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Controller
            name="providerId"
            control={control}
            render={({ field }) => (
              <Select
                label="Proveedor"
                placeholder="Selecciona un proveedor"
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
        </div>

        <div className="flex flex-col gap-2">
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                label="Categoría"
                placeholder="Selecciona una categoría"
                isRequired
                isDisabled={isLoading}
                isInvalid={!!errors.categoryId}
                errorMessage={errors.categoryId?.message}
                selectedKeys={field.value ? [field.value.toString()] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];
                  field.onChange(value ? Number(value) : undefined);
                }}
              >
                {categories.map((category) => (
                  <SelectItem key={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
      </div>

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
