import { Request, Response } from 'express';

import { SaleRepository } from '@/domain/repositories/sale.repository';

import { cancelSaleDto } from '@/domain/dtos/sales/cancel-sale.dto';
import { createSaleDto } from '@/domain/dtos/sales/create-sale.dto';
import { salesReportDto } from '@/domain/dtos/sales/sales-report.dto';

import { CancelSale } from '@/domain/use-cases/sale/cancel-sale';
import { CreateSale } from '@/domain/use-cases/sale/create-sale';
import { DeleteSale } from '@/domain/use-cases/sale/delete-sale';
import { GetAllSales } from '@/domain/use-cases/sale/get-all-sales';
import { GetSaleById } from '@/domain/use-cases/sale/get-sale-by-id';
import { GetSalesReport } from '@/domain/use-cases/sale/get-sales-report';

import { ResponseHandler } from '@/shared/http/response-handler';
import { validateId } from '@/shared/utils/validate-id';

export const saleController = (saleRepository: SaleRepository) => ({
  getAllSales: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllSales(saleRepository);
      const data = await useCase.execute();

      return ResponseHandler.ok(res, 'Ventas obtenidas correctamente.', data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al obtener las ventas.'
      );
    }
  },

  getSaleById: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const useCase = new GetSaleById(saleRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, 'Venta obtenida correctamente.', data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al obtener la venta.'
      );
    }
  },

  createSale: async (req: Request, res: Response) => {
    try {
      const dto = createSaleDto.parse(req.body);

      const useCase = new CreateSale(saleRepository);
      const data = await useCase.execute(dto);

      return ResponseHandler.ok(res, 'Venta creada correctamente.', data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al crear la venta.'
      );
    }
  },

  cancelSale: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);
      const dto = cancelSaleDto.parse(req.body);

      const useCase = new CancelSale(saleRepository);
      const data = await useCase.execute(id, dto);

      return ResponseHandler.ok(res, 'Venta cancelada correctamente.', data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al cancelar la venta.'
      );
    }
  },

  deleteSale: async (req: Request, res: Response) => {
    try {
      const id = validateId(req.params.id);

      const useCase = new DeleteSale(saleRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, 'Venta eliminada correctamente.', data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al eliminar la venta.'
      );
    }
  },

  getSalesReport: async (req: Request, res: Response) => {
    try {
      const dto = salesReportDto.parse(req.query);

      const useCase = new GetSalesReport(saleRepository);
      const data = await useCase.execute(dto);

      return ResponseHandler.ok(
        res,
        'Reporte de ventas obtenido correctamente',
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        'Error al obtener el reporte de ventas.'
      );
    }
  },
});
