'use client';
import { useCallback, useMemo, useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Select,
  SelectItem,
} from '@heroui/react';
import {
  IconDotsCircleHorizontal,
  IconPlus,
  IconHistory,
} from '@tabler/icons-react';

import Title from '@/components/shared/Title';
import { productService } from '@/services/product.service';
import { providerService } from '@/services/provider.service';
import { categoryService } from '@/services/category.service';
import { Product } from '@/types/inventory/product';
import CreateCategoryModal from '@/app/(protected)/admin/inventory/components/category/CreateCategoryModal';
import CreateProviderModal from '@/app/(protected)/admin/inventory/components/provider/CreateProviderModal';
import { Category } from '@/types/category';
import { Provider } from '@/types/provider';
import { ProductState } from '@/types/inventory/enums/product-state';

import { AddStockModal } from './components/product/stock/AddStockModal';
import CreateProductModal from './components/product/CreateProductModal';
import RemoveStockModal from './components/product/stock/RemoveStockModal';
import EditProductModal from './components/product/EditProductModal';
import UpdateProductStateModal from './components/product/UpdateProductStateModal';
import { DeleteProductModal } from './components/product/DeleteProductModal';
import { InventoryFilters } from './components/InventoryFilters';
import { useInventoryFilters } from './hooks/useInventoryFilters';
import InventoryMovementsModal from './components/movements/InventoryMovementsModal';

const columns = [
  { name: 'NOMBRE', uid: 'name', sortable: true },
  { name: 'PRECIO', uid: 'price', sortable: true },
  { name: 'STOCK', uid: 'stock', sortable: true },
  { name: 'LOTE', uid: 'lot', sortable: true },
  { name: 'ESTADO', uid: 'state', sortable: true },
  { name: 'CATEGORÍA', uid: 'categoryId', sortable: true },
  { name: 'PROVEEDOR', uid: 'providerId', sortable: true },
  { name: 'FECHA DE VENCIMIENTO', uid: 'expirationDate', sortable: true },
  { name: 'ACCIONES', uid: 'actions' },
];

const InventoryPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Set<number>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: 'ascending' | 'descending';
  }>({
    column: 'name',
    direction: 'ascending',
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [isRemoveStockModalOpen, setIsRemoveStockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMovementsModalOpen, setIsMovementsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateStateModalOpen, setIsUpdateStateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    filterValue,
    stateFilter,
    categoryFilter,
    providerFilter,
    page,
    filteredItems,
    setStateFilter,
    setCategoryFilter,
    setProviderFilter,
    setPage,
    onSearchChange,
    onClear,
  } = useInventoryFilters(products);

  const refreshProducts = useCallback(async () => {
    const [productsData, lowStockData] = await Promise.all([
      productService.getAllProducts(),
      productService.getLowStockProducts(),
    ]);
    if (productsData) {
      setProducts(productsData);
    }
    if (lowStockData) {
      setLowStockProducts(new Set(lowStockData.map((p) => p.id)));
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      const [productsData, providersData, categoriesData, lowStockData] =
        await Promise.all([
          productService.getAllProducts(),
          providerService.getAllProviders(),
          categoryService.getAllCategories(),
          productService.getLowStockProducts(),
        ]);
      if (isMounted && productsData) {
        setProducts(productsData);
      }
      if (isMounted && providersData) {
        setProviders(providersData);
      }
      if (isMounted && categoriesData) {
        setCategories(categoriesData);
      }
      if (isMounted && lowStockData) {
        setLowStockProducts(new Set(lowStockData.map((p) => p.id)));
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    const handleProductCreated = () => {
      loadProducts();
    };

    loadProducts();
    window.addEventListener('productCreated', handleProductCreated);
    window.addEventListener('productDeleted', handleProductCreated);

    return () => {
      isMounted = false;
      window.removeEventListener('productCreated', handleProductCreated);
      window.removeEventListener('productDeleted', handleProductCreated);
    };
  }, []);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Product];
      const second = b[sortDescriptor.column as keyof Product];

      let cmp = 0;
      if (first == null && second == null) {
        cmp = 0;
      } else if (first == null) {
        cmp = -1;
      } else if (second == null) {
        cmp = 1;
      } else {
        cmp = first < second ? -1 : first > second ? 1 : 0;
      }

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleProductAction = useCallback(
    (product: Product, action: string) => {
      setSelectedProduct(product);

      switch (action) {
        case 'edit':
          setIsEditModalOpen(true);
          break;
        case 'update-state':
          setIsUpdateStateModalOpen(true);
          break;
        case 'add-stock':
          setIsAddStockModalOpen(true);
          break;
        case 'remove-stock':
          setIsRemoveStockModalOpen(true);
          break;
        case 'delete':
          setIsDeleteModalOpen(true);
          break;
      }
    },
    []
  );

  const renderCell = useCallback(
    (product: Product, columnKey: React.Key) => {
      switch (columnKey) {
        case 'name':
          return <div className="font-medium">{product.name}</div>;
        case 'price':
          return <div>${Number(product.price).toFixed(2)}</div>;
        case 'stock':
          return (
            <Chip
              color={
                product.stock === 0
                  ? 'danger'
                  : lowStockProducts.has(product.id)
                  ? 'warning'
                  : 'success'
              }
              size="sm"
              variant="flat"
            >
              {product.stock}
            </Chip>
          );
        case 'lot':
          return <div>{product.lot}</div>;
        case 'state':
          return (
            <Chip
              color={
                product.state === ProductState.active
                  ? 'success'
                  : product.state === ProductState.inactive
                  ? 'danger'
                  : 'warning'
              }
              size="sm"
              variant="dot"
            >
              {product.state === ProductState.active
                ? 'Activo'
                : product.state === ProductState.inactive
                ? 'Inactivo'
                : 'Descontinuado'}
            </Chip>
          );
        case 'categoryId':
          const category = categories.find((c) => c.id === product.categoryId);
          return <div>{category?.name || 'Sin categoría'}</div>;
        case 'providerId':
          const provider = providers.find((p) => p.id === product.providerId);
          return <div>{provider?.name || 'Sin proveedor'}</div>;
        case 'expirationDate':
          return product.expirationDate ? (
            <div>
              {new Date(product.expirationDate).toLocaleDateString('es-ES')}
            </div>
          ) : (
            <div className="text-default-400">Sin fecha</div>
          );
        case 'actions':
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <IconDotsCircleHorizontal stroke={1.5} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Acciones del producto"
                onAction={(key) => handleProductAction(product, key as string)}
              >
                <DropdownItem key="edit">Editar</DropdownItem>
                <DropdownItem key="update-state">
                  Actualizar Estado
                </DropdownItem>
                <DropdownItem key="add-stock">Agregar Stock</DropdownItem>
                <DropdownItem key="remove-stock">Retirar Stock</DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                >
                  Eliminar
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return null;
      }
    },
    [categories, providers, lowStockProducts, handleProductAction]
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <InventoryFilters
          filterValue={filterValue}
          stateFilter={stateFilter}
          categoryFilter={categoryFilter}
          providerFilter={providerFilter}
          categories={categories}
          providers={providers}
          onSearchChange={onSearchChange}
          onClear={onClear}
          onStateFilterChange={setStateFilter}
          onCategoryFilterChange={setCategoryFilter}
          onProviderFilterChange={setProviderFilter}
        />
      </div>
    );
  }, [
    filterValue,
    stateFilter,
    categoryFilter,
    providerFilter,
    categories,
    providers,
    onSearchChange,
    onClear,
    setStateFilter,
    setCategoryFilter,
    setProviderFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex justify-between items-center">
        <span className="text-neutral-600 text-small">
          Total {products.length} productos
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages || 1}
          onChange={setPage}
        />
        <Select
          placeholder={String(rowsPerPage)}
          label="Filas por página"
          size="sm"
          color="secondary"
          className="max-w-[150px]"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          <SelectItem key="5">5</SelectItem>
          <SelectItem key="10">10</SelectItem>
          <SelectItem key="15">15</SelectItem>
          <SelectItem key="20">20</SelectItem>
        </Select>
      </div>
    );
  }, [page, pages, products.length, rowsPerPage, setPage]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <Title title="Inventario" />
        <div className="flex-center gap-4">
          <Button
            color="default"
            size="sm"
            variant="flat"
            startContent={<IconHistory size={18} />}
            onPress={() => setIsMovementsModalOpen(true)}
          >
            Ver Movimientos
          </Button>

          <Button
            color="secondary"
            size="sm"
            variant="flat"
            endContent={<IconPlus size={18} />}
            onPress={() => setIsCategoryModalOpen(true)}
          >
            Nueva Categoría
          </Button>

          <Button
            color="secondary"
            size="sm"
            variant="flat"
            endContent={<IconPlus size={18} />}
            onPress={() => setIsProviderModalOpen(true)}
          >
            Nuevo Proveedor
          </Button>

          <Button
            color="primary"
            size="sm"
            endContent={<IconPlus size={18} />}
            onPress={() => setIsCreateModalOpen(true)}
          >
            Nuevo Producto
          </Button>
        </div>
      </div>

      <Table
        classNames={{
          base: 'bg-[rgba(189,189,189,0.1)] border border-[rgba(189,189,189,0.13)]  p-6 rounded-xl',
        }}
        aria-label="Tabla de productos"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={(descriptor) =>
          setSortDescriptor({
            column: descriptor.column as string,
            direction: descriptor.direction as 'ascending' | 'descending',
          })
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'end' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            loading ? (
              <Spinner label="Cargando productos..." />
            ) : (
              'No se encontraron productos'
            )
          }
          items={sortedItems}
          isLoading={loading}
          loadingContent={<Spinner label="Cargando productos..." />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {}}
      />

      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => {}}
      />

      <CreateProviderModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        onSuccess={() => {}}
      />

      {selectedProduct && (
        <>
          <AddStockModal
            isOpen={isAddStockModalOpen}
            onClose={() => {
              setIsAddStockModalOpen(false);
              setSelectedProduct(null);
            }}
            productId={selectedProduct.id}
            productName={selectedProduct.name}
            onSuccess={refreshProducts}
          />

          <RemoveStockModal
            isOpen={isRemoveStockModalOpen}
            onClose={() => {
              setIsRemoveStockModalOpen(false);
              setSelectedProduct(null);
            }}
            productId={selectedProduct.id}
            productName={selectedProduct.name}
            onSuccess={refreshProducts}
          />

          <EditProductModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
          />

          <UpdateProductStateModal
            isOpen={isUpdateStateModalOpen}
            onClose={() => {
              setIsUpdateStateModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
            onSuccess={refreshProducts}
          />

          <DeleteProductModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
          />
        </>
      )}

      <InventoryMovementsModal
        isOpen={isMovementsModalOpen}
        onClose={() => setIsMovementsModalOpen(false)}
        products={products}
      />
    </div>
  );
};

export default InventoryPage;
