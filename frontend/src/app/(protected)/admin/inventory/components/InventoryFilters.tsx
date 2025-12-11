import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { IconSearch, IconChevronDown } from '@tabler/icons-react';
import { Category } from '@/types/category';
import { Provider } from '@/types/provider';

interface InventoryFiltersProps {
  filterValue: string;
  stateFilter: Set<string>;
  categoryFilter: Set<string>;
  providerFilter: Set<string>;
  categories: Category[];
  providers: Provider[];
  onSearchChange: (value: string) => void;
  onClear: () => void;
  onStateFilterChange: (keys: Set<string>) => void;
  onCategoryFilterChange: (keys: Set<string>) => void;
  onProviderFilterChange: (keys: Set<string>) => void;
}

const stateOptions = [
  { name: 'Activo', uid: 'active' },
  { name: 'Inactivo', uid: 'inactive' },
];

export const InventoryFilters = ({
  filterValue,
  stateFilter,
  categoryFilter,
  providerFilter,
  categories,
  providers,
  onSearchChange,
  onClear,
  onStateFilterChange,
  onCategoryFilterChange,
  onProviderFilterChange,
}: InventoryFiltersProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center gap-3">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Buscar por nombre..."
          startContent={<IconSearch size={18} />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />

        <div className="flex gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button endContent={<IconChevronDown size={18} />} variant="flat">
                Estado
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Filtro de estado"
              closeOnSelect={false}
              selectedKeys={stateFilter}
              selectionMode="multiple"
              onSelectionChange={(keys) =>
                onStateFilterChange(keys as Set<string>)
              }
            >
              <DropdownItem key="all">Todos</DropdownItem>
              <>
                {stateOptions.map((state) => (
                  <DropdownItem key={state.uid}>{state.name}</DropdownItem>
                ))}
              </>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button endContent={<IconChevronDown size={18} />} variant="flat">
                Categoría
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Filtro de categoría"
              closeOnSelect={false}
              selectedKeys={categoryFilter}
              selectionMode="multiple"
              onSelectionChange={(keys) =>
                onCategoryFilterChange(keys as Set<string>)
              }
            >
              <DropdownItem key="all">Todas</DropdownItem>
              <>
                {categories.map((category) => (
                  <DropdownItem key={category.id.toString()}>
                    {category.name}
                  </DropdownItem>
                ))}
              </>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button endContent={<IconChevronDown size={18} />} variant="flat">
                Proveedor
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Filtro de proveedor"
              closeOnSelect={false}
              selectedKeys={providerFilter}
              selectionMode="multiple"
              onSelectionChange={(keys) =>
                onProviderFilterChange(keys as Set<string>)
              }
            >
              <DropdownItem key="all">Todos</DropdownItem>
              <>
                {providers.map((provider) => (
                  <DropdownItem key={provider.id.toString()}>
                    {provider.name}
                  </DropdownItem>
                ))}
              </>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
