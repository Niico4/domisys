import { Request, Response } from 'express';

import { createProductDto } from '@/domain/dtos/products/create-product.dto';
import { updateProductDto } from '@/domain/dtos/products/update-product.dto';
import { removeStockDto } from '@/domain/dtos/products/remove-stock.dto';
import { stockAlertDto } from '@/domain/dtos/products/inventory/stock-alert.dto';
import { addStockDto } from '@/domain/dtos/products/add-stock.dto';
import { inventoryReportDto } from '@/domain/dtos/products/inventory/product-report.dto';
import { inventoryMovementReportDto } from '@/domain/dtos/products/inventory/inventory-movement-report.dto';
import { updateProductStateDto } from '@/domain/dtos/products/update-product-state.dto';

import { ProviderRepository } from '@/domain/repositories/provider.repository';
import { ProductRepository } from '@/domain/repositories/product.repository';

import { CreateProduct } from '@/domain/use-cases/product/create-product';
import { DeleteProduct } from '@/domain/use-cases/product/delete-product';
import { GetAllProducts } from '@/domain/use-cases/product/get-all-products';
import { GetProductById } from '@/domain/use-cases/product/get-product-by-id';
import { UpdateProduct } from '@/domain/use-cases/product/update-product';
import { RemoveStock } from '@/domain/use-cases/product/remove-stock';
import { GetInventoryReport } from '@/domain/use-cases/product/inventory/get-product-report';
import { GetInventoryMovementReport } from '@/domain/use-cases/product/inventory/get-inventory-movement-report';
import { GetStockAlerts } from '@/domain/use-cases/product/inventory/get-stock-alerts';
import { AddStock } from '@/domain/use-cases/product/add-stock';
import { UpdateProductState } from '@/domain/use-cases/product/update-product-state';

import { handleError } from '../errors/http-error-handler';

export const productController = (
  productRepository: ProductRepository,
  providerRepository: ProviderRepository
) => ({
  getAllProducts: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllProducts(productRepository);
      const data = await useCase.execute();

      return res.status(200).json(data);
    } catch (error) {
      return handleError(res, error, 'Error al obtener los productos');
    }
  },

  getProductById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID no es un número' });
    }

    try {
      const useCase = new GetProductById(productRepository);
      const data = await useCase.execute(id);

      return res.status(200).json(data);
    } catch (error) {
      return handleError(res, error, `Error al obtener el producto ${id}`);
    }
  },

  createProduct: async (req: Request, res: Response) => {
    const dto = createProductDto.parse(req.body);

    try {
      const useCase = new CreateProduct(productRepository);
      const data = await useCase.execute(dto);

      return res
        .status(201)
        .json({ message: 'Producto creado correctamente', data });
    } catch (error) {
      return handleError(res, error, 'Error al crear el producto');
    }
  },

  updateProduct: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID no es un número' });
    }

    try {
      const dto = updateProductDto.parse(req.body ?? {});

      const useCase = new UpdateProduct(productRepository);
      const data = await useCase.execute(id, dto);

      return res.status(200).json({ message: 'Producto actualizado', data });
    } catch (error) {
      return handleError(res, error, 'Error al actualizar el producto');
    }
  },

  deleteProduct: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID no es un número' });
    }

    try {
      const useCase = new DeleteProduct(productRepository);
      const data = await useCase.execute(id);

      return res
        .status(200)
        .json({ message: 'Producto eliminado correctamente', data });
    } catch (error) {
      return handleError(res, error, 'Error al eliminar el producto');
    }
  },

  addStock: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID no es un número' });
    }
    try {
      const dto = addStockDto.parse(req.body);

      const useCase = new AddStock(productRepository, providerRepository);
      const data = await useCase.execute(id, dto);

      return res
        .status(200)
        .json({ message: 'Cantidad agregada correctamente', data });
    } catch (error) {
      return handleError(res, error, 'Error al agregar los productos');
    }
  },

  removeStock: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID no es un número' });
    }

    try {
      const dto = removeStockDto.parse(req.body);

      const useCase = new RemoveStock(productRepository, providerRepository);
      const data = await useCase.execute(id, dto);

      return res
        .status(200)
        .json({ message: 'Cantidad retirada correctamente', data });
    } catch (error) {
      return handleError(res, error, 'Error al retirar los productos');
    }
  },

  updateState: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
      const dto = updateProductStateDto.parse(req.body);

      const useCase = new UpdateProductState(productRepository);
      const { state } = await useCase.execute(id, dto.state);

      return res
        .status(200)
        .json({ message: 'Estado actualizado correctamente', state });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  getStockAlerts: async (req: Request, res: Response) => {
    try {
      const dto = stockAlertDto.parse(req.query);

      const useCase = new GetStockAlerts(productRepository);
      const data = await useCase.execute(dto);

      return res.status(200).json({
        message: `Productos con stock menor que ${dto.threshold ?? 50}`,
        data,
      });
    } catch (error) {
      return handleError(res, error, 'Error al obtener alertas de stock');
    }
  },

  getInventoryMovementReport: async (req: Request, res: Response) => {
    try {
      const dto = inventoryMovementReportDto.parse(req.query);

      const useCase = new GetInventoryMovementReport(productRepository);
      const data = await useCase.execute(dto);

      return res.status(200).json(data);
    } catch (error) {
      return handleError(res, error, 'Error al generar reporte de inventario');
    }
  },

  inventoryReport: async (req: Request, res: Response) => {
    try {
      const dto = inventoryReportDto.parse(req.query);

      const useCase = new GetInventoryReport(productRepository);
      const data = await useCase.execute(dto);

      return res.status(200).json(data);
    } catch (error: any) {
      return handleError(
        res,
        error,
        'Error al generar el reporte de productos'
      );
    }
  },
});
