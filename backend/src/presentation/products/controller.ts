import { Request, Response } from 'express';

import { createProductDto } from '@/domain/dtos/products/create-product.dto';
import { updateProductDto } from '@/domain/dtos/products/update-product.dto';
import { removeStockDto } from '@/domain/dtos/products/remove-stock.dto';
import { stockAlertDto } from '@/domain/dtos/products/inventory/stock-alert.dto';
import { addStockDto } from '@/domain/dtos/products/add-stock.dto';
import { inventoryReportDto } from '@/domain/dtos/products/inventory/product-report.dto';
import { inventoryMovementsDto } from '@/domain/dtos/products/inventory/inventory-movements.dto';
import { updateProductStateDto } from '@/domain/dtos/products/update-product-state.dto';

import { ProductRepository } from '@/domain/repositories/product.repository';

import { CreateProduct } from '@/domain/use-cases/product/create-product';
import { DeleteProduct } from '@/domain/use-cases/product/delete-product';
import { GetAllProducts } from '@/domain/use-cases/product/get-all-products';
import { GetProductById } from '@/domain/use-cases/product/get-product-by-id';
import { UpdateProduct } from '@/domain/use-cases/product/update-product';
import { RemoveStock } from '@/domain/use-cases/product/remove-stock';
import { GetInventoryReport } from '@/domain/use-cases/product/inventory/get-product-report';
import { GetInventoryMovements } from '@/domain/use-cases/product/inventory/get-inventory-movements';
import { GetStockAlerts } from '@/domain/use-cases/product/inventory/get-stock-alerts';
import { AddStock } from '@/domain/use-cases/product/add-stock';
import { UpdateProductState } from '@/domain/use-cases/product/update-product-state';
import { ResponseHandler } from '@/shared/http/response-handler';
import { validateId } from '@/shared/utils/validate-id';
import { messages } from '@/shared/messages';

export const productController = (
  productRepository: ProductRepository
) => ({
  getAllProducts: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllProducts(productRepository);
      const data = await useCase.execute();

      return ResponseHandler.ok(res, messages.product.getAllSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.product.getAllError()
      );
    }
  },

  getProductById: async (req: Request, res: Response) => {
    const id = validateId(req.params.id);

    try {
      const useCase = new GetProductById(productRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, messages.product.getByIdSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.product.getByIdError()
      );
    }
  },

  createProduct: async (req: Request, res: Response) => {
    const dto = createProductDto.parse(req.body);

    try {
      const useCase = new CreateProduct(productRepository);
      const data = await useCase.execute(dto);

      return ResponseHandler.ok(
        res,
        messages.product.createSuccess(),
        data,
        201
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.product.createError()
      );
    }
  },

  updateProduct: async (req: Request, res: Response) => {
    const id = validateId(req.params.id);

    try {
      const dto = updateProductDto.parse(req.body ?? {});

      const useCase = new UpdateProduct(productRepository);
      const data = await useCase.execute(id, dto);

      return ResponseHandler.ok(res, messages.product.updateSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.product.updateError()
      );
    }
  },

  deleteProduct: async (req: Request, res: Response) => {
    const id = validateId(req.params.id);

    try {
      const useCase = new DeleteProduct(productRepository);
      const data = await useCase.execute(id);

      return ResponseHandler.ok(res, messages.product.deleteSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.product.deleteError()
      );
    }
  },

  addStock: async (req: Request, res: Response) => {
    const id = validateId(req.params.id);

    try {
      const dto = addStockDto.parse(req.body);

      const adminId = req.user!.id;

      const useCase = new AddStock(productRepository);
      const data = await useCase.execute(id, dto, adminId);

      return ResponseHandler.ok(res, messages.product.addStockSuccess(), data);
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.product.addStockError()
      );
    }
  },

  removeStock: async (req: Request, res: Response) => {
    const id = validateId(req.params.id);
    try {
      const dto = removeStockDto.parse(req.body);

      const adminId = req.user!.id;

      const useCase = new RemoveStock(productRepository);
      const data = await useCase.execute(id, dto, adminId);

      return ResponseHandler.ok(
        res,
        messages.product.removeStockSuccess(),
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.product.removeStockError()
      );
    }
  },

  updateState: async (req: Request, res: Response) => {
    const id = validateId(req.params.id);

    try {
      const dto = updateProductStateDto.parse(req.body);

      const useCase = new UpdateProductState(productRepository);
      const { state } = await useCase.execute(id, dto.state);

      return ResponseHandler.ok(res, messages.product.updateStateSuccess(), {
        state,
      });
    } catch (error: any) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.product.updateStateError()
      );
    }
  },

  getStockAlerts: async (req: Request, res: Response) => {
    try {
      const dto = stockAlertDto.parse(req.query);

      const useCase = new GetStockAlerts(productRepository);
      const data = await useCase.execute(dto);

      return ResponseHandler.ok(
        res,
        messages.product.stockAlertsSuccess(),
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.product.stockAlertsError()
      );
    }
  },

  getInventoryMovements: async (req: Request, res: Response) => {
    try {
      const dto = inventoryMovementsDto.parse(req.query);

      const useCase = new GetInventoryMovements(productRepository);
      const data = await useCase.execute(dto);

      return ResponseHandler.ok(
        res,
        messages.product.movementsSuccess(),
        data
      );
    } catch (error) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.product.movementsError()
      );
    }
  },

  inventoryReport: async (req: Request, res: Response) => {
    try {
      const dto = inventoryReportDto.parse(req.query);

      const useCase = new GetInventoryReport(productRepository);
      const data = await useCase.execute(dto);

      return ResponseHandler.ok(
        res,
        messages.product.inventoryReportSuccess(),
        data
      );
    } catch (error: any) {
      return ResponseHandler.handleException(
        res,
        error,
        messages.product.inventoryReportError()
      );
    }
  },
});
