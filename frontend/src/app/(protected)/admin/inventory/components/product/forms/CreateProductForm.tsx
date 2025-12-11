'use client';
import {
  Input,
  Select,
  SelectItem,
  Button,
  addToast,
  NumberInput,
  DateInput,
} from '@heroui/react';
import { parseDate } from '@internationalized/date';
import { productService } from '@/services/product.service';
import { providerService } from '@/services/provider.service';
import { categoryService } from '@/services/category.service';
import { handleApiError } from '@/utils/error-handler';
import {
  createProductPayloadSchema,
  CreateProductPayloadType,
} from '../schemas/create-product.schema';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { Provider } from '@/types/provider';
import { Category } from '@/types/category';
import { ProductState } from '@/types/inventory/enums/product-state';

export const measure = [
  { key: 'lb', label: 'Libra' },
  { key: 'lt', label: 'Litro' },
  { key: 'kg', label: 'Kilogramo' },
  { key: 'gr', label: 'Gramo' },
  { key: 'u', label: 'Unidad' },
  { key: 'p', label: 'Paquete' },
];

const CreateProductForm = () => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadData = async () => {
    setLoadingData(true);
    const [providersData, categoriesData] = await Promise.all([
      providerService.getAllProviders(),
      categoryService.getAllCategories(),
    ]);

    if (providersData) setProviders(providersData);
    if (categoriesData) setCategories(categoriesData);
    setLoadingData(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateProductPayloadType>({
    resolver: zodResolver(createProductPayloadSchema),
    defaultValues: {
      name: '',
      price: 0,
      measure: '',
      lot: '',
      expirationDate: null,
      image: null,
      state: ProductState.active,
      providerId: undefined,
      categoryId: undefined,
    },
    mode: 'all',
  });

  const onSubmit = async (payload: CreateProductPayloadType) => {
    setLoading(true);

    try {
      const res = await productService.createProduct(payload);

      if (!res) return;

      addToast({
        title: 'Producto creado',
        description: `El producto "${res.name}" ha sido creado exitosamente.`,
        color: 'success',
      });

      reset();

      window.dispatchEvent(new CustomEvent('productCreated'));
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loadingData ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-default-400">Cargando datos...</p>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nombre del producto"
            placeholder="Ej: Arroz Diana"
            isRequired
            isDisabled={loading}
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
                  isDisabled={loading}
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
                  isDisabled={loading}
                  placeholder="Selecciona la unidad de medida"
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0];
                    field.onChange(value);
                  }}
                >
                  {measure.map((measure) => (
                    <SelectItem key={measure.key}>{measure.label}</SelectItem>
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
              isDisabled={loading}
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
                  isDisabled={loading}
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
                    isDisabled={loading}
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
                    isDisabled={loading}
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
                isDisabled={loading}
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
            <Button color="primary" type="submit" isLoading={loading}>
              Crear Producto
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default CreateProductForm;
