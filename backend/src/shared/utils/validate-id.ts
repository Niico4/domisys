import { BadRequestException } from '../exceptions/bad-request';
import { messages } from '@/shared/messages';

export const validateId = (id: string | undefined): number => {
  if (!id) {
    throw new BadRequestException(messages.validation.idRequired());
  }

  const numericId = Number(id);

  if (isNaN(numericId)) {
    throw new BadRequestException(messages.validation.idMustBeNumber());
  }
  return numericId;
};
