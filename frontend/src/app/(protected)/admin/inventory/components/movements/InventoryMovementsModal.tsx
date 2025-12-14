'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
  DateRangePicker,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from '@heroui/react';
import { IconChevronDown } from '@tabler/icons-react';
import { InventoryMovement } from '@/types/inventory/inventory-movement';
import { Product } from '@/types/inventory/product';
import { User } from '@/types/user';
import { inventoryMovementService } from '@/services/inventory-movement.service';
import { userService } from '@/services/user.service';
import { IconSearch } from '@tabler/icons-react';
import {
  MovementTypeLabels,
  MovementReasonLabels,
  MovementTypeColors,
  MovementType,
} from '@/types/inventory/enums/movement-inventory';

interface InventoryMovementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export default function InventoryMovementsModal({
  isOpen,
  onClose,
  products,
}: InventoryMovementsModalProps) {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(['all'])
  );
  const [dateRange, setDateRange] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    start: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    end: any;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          const [adminsData, deliveriesData] = await Promise.all([
            userService.getAllAdmins(),
            userService.getAllDeliveries(),
          ]);
          setUsers([...adminsData, ...deliveriesData]);
        } catch (error) {
          console.error('Error al cargar usuarios:', error);
        }
      };
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const loadMovements = async () => {
        setIsLoading(true);
        try {
          const filters = {
            startDate: dateRange?.start
              ? `${dateRange.start.year}-${String(
                  dateRange.start.month
                ).padStart(2, '0')}-${String(dateRange.start.day).padStart(
                  2,
                  '0'
                )}`
              : undefined,
            endDate: dateRange?.end
              ? `${dateRange.end.year}-${String(dateRange.end.month).padStart(
                  2,
                  '0'
                )}-${String(dateRange.end.day).padStart(2, '0')}`
              : undefined,
          };
          const data = await inventoryMovementService.getMovements(filters);
          setMovements(data);
        } catch (error) {
          console.error('Error al cargar movimientos:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadMovements();
    }
  }, [isOpen, dateRange]);

  const filteredMovements = Array.isArray(movements)
    ? movements.filter((movement) => {
        const productName =
          products
            .find((p) => p.id === movement.productId)
            ?.name.toLowerCase() || '';
        const search = searchValue.toLowerCase();

        // Filtro por productos seleccionados
        const productFilterPassed =
          selectedProducts.has('all') ||
          selectedProducts.has(movement.productId.toString());

        // Filtro por búsqueda
        const searchPassed =
          !searchValue ||
          productName.includes(search) ||
          MovementTypeLabels[movement.movementType]
            .toLowerCase()
            .includes(search) ||
          (movement.reason &&
            MovementReasonLabels[movement.reason]
              .toLowerCase()
              .includes(search));

        return productFilterPassed && searchPassed;
      })
    : [];

  const columns = [
    { key: 'date', label: 'Fecha' },
    { key: 'product', label: 'Producto' },
    { key: 'type', label: 'Tipo' },
    { key: 'reason', label: 'Motivo' },
    { key: 'quantity', label: 'Cantidad' },
    { key: 'admin', label: 'Usuario' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Movimientos de Inventario</h2>
          <p className="text-sm text-default-500 font-normal">
            Historial completo de entradas y salidas
          </p>
        </ModalHeader>
        <ModalBody className="gap-4">
          {/* Filtros */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                isClearable
                placeholder="Buscar movimientos..."
                startContent={
                  <IconSearch className="w-4 h-4 text-default-400" />
                }
                value={searchValue}
                onValueChange={setSearchValue}
                className="flex-1"
              />
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    endContent={<IconChevronDown size={18} />}
                    variant="flat"
                  >
                    {selectedProducts.has('all')
                      ? 'Todos los productos'
                      : `${selectedProducts.size} producto${
                          selectedProducts.size > 1 ? 's' : ''
                        }`}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Filtro de productos"
                  closeOnSelect={false}
                  selectedKeys={selectedProducts}
                  selectionMode="multiple"
                  onSelectionChange={(keys) => {
                    const newKeys = keys as Set<string>;
                    if (newKeys.has('all') && !selectedProducts.has('all')) {
                      setSelectedProducts(new Set(['all']));
                    } else if (newKeys.has('all')) {
                      const withoutAll = new Set(
                        Array.from(newKeys).filter((k) => k !== 'all')
                      );
                      setSelectedProducts(
                        withoutAll.size > 0 ? withoutAll : new Set(['all'])
                      );
                    } else {
                      setSelectedProducts(
                        newKeys.size > 0 ? newKeys : new Set(['all'])
                      );
                    }
                  }}
                >
                  <DropdownItem key="all">Todos</DropdownItem>
                  <>
                    {products.map((product) => (
                      <DropdownItem key={product.id.toString()}>
                        {product.name}
                      </DropdownItem>
                    ))}
                  </>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <DateRangePicker
                label="Rango de fechas"
                className="flex-1"
                value={dateRange}
                onChange={setDateRange}
                size="sm"
              />
            </div>
          </div>

          {/* Tabla */}
          <Table
            aria-label="Tabla de movimientos de inventario"
            classNames={{
              base: 'max-h-[400px] overflow-auto',
              wrapper: 'max-h-[400px]',
            }}
            isHeaderSticky
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key} className="bg-default-100">
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={filteredMovements}
              isLoading={isLoading}
              loadingContent={<Spinner />}
              emptyContent="No hay movimientos registrados"
            >
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleString('es-ES', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell>
                    {products.find((p) => p.id === item.productId)?.name ||
                      `Producto #${item.productId}`}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={MovementTypeColors[item.movementType]}
                      size="sm"
                      variant="flat"
                    >
                      {MovementTypeLabels[item.movementType]}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {item.reason
                      ? MovementReasonLabels[item.reason]
                      : 'Sin motivo'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold ${
                        item.movementType === MovementType.in
                          ? 'text-success'
                          : 'text-danger'
                      }`}
                    >
                      {item.movementType === MovementType.out ? '-' : '+'}
                      {item.quantity || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const user = users.find((u) => u.id === item.adminId);
                      if (!user) return `Usuario #${item.adminId}`;
                      const roleLabel =
                        user.role === 'admin'
                          ? 'Admin'
                          : user.role === 'delivery'
                          ? 'Repartidor'
                          : 'Usuario';
                      return (
                        <div className="flex flex-col">
                          <span className="font-medium">@{user.username}</span>
                          <span className="text-xs text-default-400">
                            {roleLabel}
                          </span>
                        </div>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Info adicional */}
          <div className="flex justify-between items-center text-sm text-default-500">
            <span>{filteredMovements.length} movimientos encontrados</span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
