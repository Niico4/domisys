import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@/generated/internal/prismaNamespace';

import { createProviderDto } from '@/domain/dtos/providers/create-provider.dto';
import { updateProviderDto } from '@/domain/dtos/providers/update-provider.dto';
import { ProviderRepository } from '@/domain/repositories/provider.repository';

import { CreateProvider } from '@/domain/use-cases/provider/create-provider';
import { DeleteProvider } from '@/domain/use-cases/provider/delete-provider';
import { GetAllProviders } from '@/domain/use-cases/provider/get-all-providers';
import { GetProviderById } from '@/domain/use-cases/provider/get-provider-by-id';
import { UpdateProvider } from '@/domain/use-cases/provider/update-provider';

import { handleError } from '../errors/http-error-handler';

export const providerController = (providerRepository: ProviderRepository) => ({
  getAllProviders: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllProviders(providerRepository);
      const providers = await useCase.execute();

      return res.status(200).json(providers);
    } catch (error) {
      return handleError(res, error, 'Error al obtener los proveedores');
    }
  },

  getProviderById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID no es un número' });
    }

    try {
      const useCase = new GetProviderById(providerRepository);
      const getProvider = await useCase.execute(id);

      return res.status(200).json(getProvider);
    } catch (error) {
      return handleError(res, error, `Error al obtener el proveedor ${id}`);
    }
  },

  createProvider: async (req: Request, res: Response) => {
    const data = createProviderDto.parse(req.body);

    try {
      const useCase = new CreateProvider(providerRepository);
      const newProvider = await useCase.execute(data);

      return res.status(201).json(newProvider);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return res.status(409).json({
          message: `El ${error.meta?.target} ya está registrado`,
        });
      }

      return handleError(res, error, 'Error al crear el proveedor');
    }
  },

  updateProvider: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID no es un número' });
    }

    try {
      const data = updateProviderDto.parse(req.body ?? {});

      const useCase = new UpdateProvider(providerRepository);
      const updatedProvider = await useCase.execute(id, data);

      return res.status(200).json(updatedProvider);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return res.status(409).json({
          message: `El ${error.meta?.target} ya está registrado`,
        });
      }

      return handleError(res, error, 'Error al actualizar el proveedor');
    }
  },

  deleteProvider: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID no es un número' });
    }

    try {
      const useCase = new DeleteProvider(providerRepository);
      const deletedProvider = await useCase.execute(id);

      return res.status(200).json(deletedProvider);
    } catch (error) {
      return handleError(res, error, 'Error al eliminar el proveedor');
    }
  },
});
