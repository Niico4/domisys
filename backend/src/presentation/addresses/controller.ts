import { Request, Response } from 'express';

import { AddressRepository } from '@/domain/repositories/address.repository';

import { CreateAddress } from '@/domain/use-cases/address/create-address';
import { GetUserAddresses } from '@/domain/use-cases/address/get-user-addresses';
import { UpdateAddress } from '@/domain/use-cases/address/update-address';
import { DeleteAddress } from '@/domain/use-cases/address/delete-address';

import { createAddressDto } from '@/domain/dtos/address/create-address.dto';
import { updateAddressDto } from '@/domain/dtos/address/update-address.dto';

import { ResponseHandler } from '@/shared/http/response-handler';
import { validateId } from '@/shared/utils/validate-id';
import { messages } from '@/shared/messages';

export const addressController = (addressRepo: AddressRepository) => ({
  create: async (req: Request, res: Response) => {
    try {
      const dto = createAddressDto.parse(req.body);
      const userId = req.user!.id;

      const useCase = new CreateAddress(addressRepo);
      const data = await useCase.execute(dto, userId);

      return ResponseHandler.ok(res, messages.address.created(), data, 201);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.address.createError()
      );
    }
  },

  getUserAddresses: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      const useCase = new GetUserAddresses(addressRepo);
      const data = await useCase.execute(userId);

      return ResponseHandler.ok(res, messages.address.retrieved(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.address.fetchError()
      );
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const addressId = validateId(req.params.id);

      const dto = updateAddressDto.parse(req.body);

      const useCase = new UpdateAddress(addressRepo);
      const data = await useCase.execute(addressId, dto, userId);

      return ResponseHandler.ok(res, messages.address.updated(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.address.updateError()
      );
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const addressId = validateId(req.params.id);
      const userId = req.user!.id;

      const useCase = new DeleteAddress(addressRepo);
      await useCase.execute(userId, addressId);

      return ResponseHandler.ok(res, messages.address.deleted(), null);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.address.deleteError()
      );
    }
  },
});
