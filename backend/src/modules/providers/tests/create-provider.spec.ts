import { describe, expect, it, vi } from 'vitest';
import { CreateProvider } from '../application/use-cases/create-provider';
import { ProviderEntity } from '../domain/provider.entity';

const validInput = {
  name: 'Creamos S.A.S',
  nit: '900.999.999-4',
  email: 'creamos@gmail.com',
  contactNumber: '3224545678',
  address: 'Calle 123 #45-67, Bogotá',
};

describe('Create Provider', () => {
  it('create a new provider', async () => {
    const mockRepository = {
      getAll: vi.fn(),
      findById: vi.fn(),
      findByNit: vi.fn().mockResolvedValue(null),
      create: vi
        .fn()
        .mockImplementation(async (provider: ProviderEntity) => provider),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new CreateProvider(mockRepository);

    await useCase.execute(validInput);

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.any(ProviderEntity)
    );
    expect(mockRepository.findByNit).toHaveBeenCalledBefore(
      mockRepository.create
    );

    const createdProvider = mockRepository.create.mock?.calls?.[0]?.[0];

    expect(createdProvider).toMatchObject({
      name: 'Creamos S.A.S',
      address: 'Calle 123 #45-67, Bogotá',
    });

    expect(createdProvider.nit.getValue()).toBe('900999999-4');
    expect(createdProvider.email.getValue()).toBe('creamos@gmail.com');
    expect(createdProvider.contactNumber.getValue()).toBe('+573224545678');
  });

  it('throws an error if provider with the same NIT already exists', async () => {
    const mockRepository = {
      getAll: vi.fn(),
      findById: vi.fn(),
      findByNit: vi.fn().mockResolvedValue({ nit: '900.999.999-4' }),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new CreateProvider(mockRepository);

    await expect(useCase.execute(validInput)).rejects.toThrow(
      'Provider with the same NIT already exists'
    );

    expect(mockRepository.findByNit).toHaveBeenCalledTimes(1);
    expect(mockRepository.findByNit).toHaveBeenCalledWith('900999999-4');

    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});
