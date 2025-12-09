import { Request, Response } from 'express';

import { createCodeDto } from '@/domain/dtos/access-codes/create-code.dto';
import { AccessCodeRepository } from '@/domain/repositories/access-code.repository';

import { CreateAccessCode } from '@/domain/use-cases/access-code/create-code';

import { ResponseHandler } from '@/shared/http/response-handler';
import { validateId } from '@/shared/utils/validate-id';
import { messages } from '@/shared/messages';
import { BadRequestException } from '@/shared/exceptions/bad-request';

export const accessCodeController = (
  accessCodeRepository: AccessCodeRepository
) => ({
  getAllCodes: async (_req: Request, res: Response) => {
    try {
      const data = await accessCodeRepository.getAll();

      return ResponseHandler.ok(res, messages.accessCode.getAllSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.accessCode.getAllError()
      );
    }
  },

  getCodeById: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);
      const data = await accessCodeRepository.findById(id);

      return ResponseHandler.ok(
        res,
        messages.accessCode.getByIdSuccess(),
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.accessCode.getByIdError()
      );
    }
  },

  createCode: async (req: Request, res: Response) => {
    try {
      const createdBy = req.user!.id;
      if (!createdBy) {
        return new BadRequestException(messages.auth.unauthorized());
      }

      const dto = createCodeDto.parse({ ...req.body, createdBy });

      const useCase = new CreateAccessCode(accessCodeRepository);
      const data = await useCase.execute(dto);

      return ResponseHandler.ok(
        res,
        messages.accessCode.createSuccess(),
        data,
        201
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.accessCode.createError()
      );
    }
  },

  disableCode: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);
      const data = await accessCodeRepository.disableCode(id);

      return ResponseHandler.ok(
        res,
        messages.accessCode.disableSuccess(),
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.accessCode.disableError()
      );
    }
  },
});
