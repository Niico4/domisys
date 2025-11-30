import { Request, Response } from 'express';

import { createProviderDto } from '@/domain/dtos/providers/create-provider.dto';
import { updateProviderDto } from '@/domain/dtos/providers/update-provider.dto';
import { ProviderRepository } from '@/domain/repositories/provider.repository';

import { CreateProvider } from '@/domain/use-cases/provider/create-provider';
import { DeleteProvider } from '@/domain/use-cases/provider/delete-provider';
import { GetAllProviders } from '@/domain/use-cases/provider/get-all-providers';
import { GetProviderById } from '@/domain/use-cases/provider/get-provider-by-id';
import { UpdateProvider } from '@/domain/use-cases/provider/update-provider';
import { ResponseHandler } from '@/shared/http/response-handler';
import { validateId } from '@/shared/utils/validate-id';

export const providerController = (providerRepository: ProviderRepository) => ({
  getAllProviders: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllProviders(providerRepository);
      const data = await useCase.execute();

      return ResponseHandler.ok(
        res,
        'Proveedores obtenidos correctamente.',
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al obtener los proveedores.'
      );
    }
  },

  getProviderById: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const useCase = new GetProviderById(providerRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, 'Proveedor obtenido correctamente.', data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al obtener el proveedor.'
      );
    }
  },

  createProvider: async (req: Request, res: Response) => {
    try {
      const data = createProviderDto.parse(req.body);

      const useCase = new CreateProvider(providerRepository);
      const newProvider = await useCase.execute(data);

      return ResponseHandler.ok(
        res,
        'Proveedor creado correctamente.',
        newProvider,
        201
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al crear el proveedor.'
      );
    }
  },

  updateProvider: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const dto = updateProviderDto.parse(req.body ?? {});

      const useCase = new UpdateProvider(providerRepository);
      const data = await useCase.execute(id, dto);

      return ResponseHandler.ok(
        res,
        'Proveedor actualizado correctamente.',
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al actualizar el proveedor.'
      );
    }
  },

  deleteProvider: async (req: Request, res: Response) => {
    const id = validateId(req.params.id);

    try {
      const useCase = new DeleteProvider(providerRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(
        res,
        'Proveedor eliminado correctamente.',
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al eliminar el proveedor.'
      );
    }
  },
});
