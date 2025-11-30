import { BadRequestException } from '../exceptions/bad-request';

export const validateId = (id: string | undefined): number => {
  if (!id) {
    throw new BadRequestException('El ID es requerido');
  }

  const numericId = Number(id);

  if (isNaN(numericId)) {
    throw new BadRequestException('El ID debe ser un número válido');
  }
  return numericId;
};
