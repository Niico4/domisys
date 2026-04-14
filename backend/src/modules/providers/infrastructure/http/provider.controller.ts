import { Request, Response } from 'express';

import { ResponseHandler } from '@shared/http/response-handler';
import { validateId } from '@shared/utils/validate-id';
import { messages } from '@shared/messages';

import { ProviderRepository } from '../../domain/provider.repository';
import { createProviderDto } from '../../application/dtos/create-provider.dto';
import { updateProviderDto } from '../../application/dtos/update-provider.dto';
import { CreateProvider } from '../../application/use-cases/create-provider';
import { GetProviderById } from '../../application/use-cases/get-provider-by-id';
import { GetAllProviders } from '../../application/use-cases/get-all-providers';
import { UpdateProvider } from '../../application/use-cases/update-provider';
import { DeleteProvider } from '../../application/use-cases/delete-provider';

export const providerController = (providerRepository: ProviderRepository) => ({
  getAllProviders: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllProviders(providerRepository);
      const data = await useCase.execute();

      return ResponseHandler.ok(res, messages.provider.getAllSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.provider.getAllError()
      );
    }
  },

  getProviderById: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const useCase = new GetProviderById(providerRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, messages.provider.getByIdSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.provider.getByIdError()
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
        messages.provider.createSuccess(),
        newProvider,
        201
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.provider.createError()
      );
    }
  },

  updateProvider: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const dto = updateProviderDto.parse(req.body ?? {});

      const useCase = new UpdateProvider(providerRepository);
      const data = await useCase.execute(id, dto);

      return ResponseHandler.ok(res, messages.provider.updateSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.provider.updateError()
      );
    }
  },

  deleteProvider: async (req: Request, res: Response) => {
    const id = validateId(req.params.id);

    try {
      const useCase = new DeleteProvider(providerRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, messages.provider.deleteSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.provider.deleteError()
      );
    }
  },

  // getProviderReport: async (req: Request, res: Response) => {
  //   try {
  //     const dto = providerReportDto.parse(req.query);

  //     const useCase = new GetProviderReport(providerRepository);
  //     const data = await useCase.execute(dto);

  //     return ResponseHandler.ok(res, messages.provider.reportSuccess(), data);
  //   } catch (error) {
  //     return ResponseHandler.handleException(
  //       res,
  //       error,
  //       messages.provider.reportError()
  //     );
  //   }
  // },
});
