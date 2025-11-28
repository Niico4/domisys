import { Request, Response } from 'express';

import { createProductDto } from '@/domain/dtos/products/create-product.dto';
import { updateProductDto } from '@/domain/dtos/products/update-product.dto';
import { ProductRepository } from '@/domain/repositories/product.repository';

import { CreateProduct } from '@/domain/use-cases/product/create-product';
import { DeleteProduct } from '@/domain/use-cases/product/delete-product';
import { GetAllProducts } from '@/domain/use-cases/product/get-all-products';
import { GetProductById } from '@/domain/use-cases/product/get-product-by-id';
import { UpdateProduct } from '@/domain/use-cases/product/update-product';
import { RemoveStock } from '@/domain/use-cases/product/remove-stock';
import { GetProductReport } from '@/domain/use-cases/product/inventory/get-product-report';

import { handleError } from '../errors/http-error-handler';
import { addStockDto } from '@/domain/dtos/products/add-stock.dto';
import { AddStock } from '@/domain/use-cases/product/add-stock';
import { ProviderRepository } from '@/domain/repositories/provider.repository';
import { removeStockDto } from '@/domain/dtos/products/remove-stock.dto';
import { InventoryReportDtoType } from '@/domain/dtos/products/inventory/inventory-movement-report.dto';
import { StockAlertDtoType } from '@/domain/dtos/products/inventory/stock-alert.dto';
import { productReportDto } from '@/domain/dtos/products/inventory/product-report.dto';

export const productController = (
  productRepository: ProductRepository,
  providerRepository: ProviderRepository
) => ({
  getAllProducts: async (_req: Request, res: Response) => {
    try {
      const useCase = new GetAllProducts(productRepository);
      const products = await useCase.execute();

      return res.status(200).json(products);
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
      const getProduct = await useCase.execute(id);

      return res.status(200).json(getProduct);
    } catch (error) {
      return handleError(res, error, `Error al obtener el producto ${id}`);
    }
  },

  createProduct: async (req: Request, res: Response) => {
    const data = createProductDto.parse(req.body);

    try {
      const useCase = new CreateProduct(productRepository);
      const newProduct = await useCase.execute(data);

      return res.status(201).json(newProduct);
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
      const data = updateProductDto.parse(req.body ?? {});

      const useCase = new UpdateProduct(productRepository);
      const updatedProduct = await useCase.execute(id, data);

      return res.status(200).json(updatedProduct);
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
      const deletedProduct = await useCase.execute(id);

      return res.status(200).json(deletedProduct);
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
      const data = addStockDto.parse(req.body);

      const useCase = new AddStock(productRepository, providerRepository);
      await useCase.execute(id, data);

      return res
        .status(200)
        .json({ message: 'Cantidad agregada correctamente' });
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
      const data = removeStockDto.parse(req.body);

      const useCase = new RemoveStock(productRepository, providerRepository);
      await useCase.execute(id, data);

      return res
        .status(200)
        .json({ message: 'Cantidad retirada correctamente' });
    } catch (error) {
      return handleError(res, error, 'Error al retirar los productos');
    }
  },

  getStockAlerts: async (req: Request, res: Response) => {
    try {
      const dto: StockAlertDtoType = req.query;
      const alerts = await productRepository.getStockAlerts(dto);

      return res.status(200).json(alerts);
    } catch (error) {
      return handleError(res, error, 'Error al obtener alertas de stock');
    }
  },

  getInventoryMovementReport: async (req: Request, res: Response) => {
    try {
      const dto: InventoryReportDtoType = req.query;
      const report = await productRepository.getInventoryMovementReport(dto);

      return res.status(200).json(report);
    } catch (error) {
      return handleError(res, error, 'Error al generar reporte de inventario');
    }
  },

  productReport: async (req: Request, res: Response) => {
    try {
      const dto = productReportDto.parse(req.query);

      const useCase = new GetProductReport(productRepository);
      const products = await useCase.execute(dto);

      return res.status(200).json(products);
    } catch (error: any) {
      return handleError(
        res,
        error,
        'Error al generar el reporte de productos'
      );
    }
  },
});
