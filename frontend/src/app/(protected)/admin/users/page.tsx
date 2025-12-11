'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown';
import { IconPlus, IconChevronDown, IconSearch } from '@tabler/icons-react';

import { userService } from '@/services/user.service';
import { accessCodeService } from '@/services/access-code.service';
import { User } from '@/types/user';
import { handleApiError } from '@/utils/error-handler';
import {
  AccessCode,
  AccessCodeState,
  AccessCodeRole,
} from '@/types/user-management/access-code';

import UsersTable from './components/users/UsersTable';
import AccessCodesTable from './components/access-codes/AccessCodesTable';
import CreateAccessCodeModal from './components/access-codes/CreateAccessCodeModal';
import DisableAccessCodeModal from './components/access-codes/DisableAccessCodeModal';
import Heading from '@/components/shared/Heading';

export default function UsersPage() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [deliveries, setDeliveries] = useState<User[]>([]);
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
  const [isLoadingDeliveries, setIsLoadingDeliveries] = useState(true);
  const [isLoadingCodes, setIsLoadingCodes] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<AccessCode | null>(null);

  const [userSearch, setUserSearch] = useState('');
  const [roleFilterUsers, setRoleFilterUsers] = useState<Set<string>>(
    new Set(['all'])
  );
  const [statusFilter, setStatusFilter] = useState<Set<string>>(
    new Set(['all'])
  );
  const [roleFilter, setRoleFilter] = useState<Set<string>>(new Set(['all']));

  const fetchAdmins = async () => {
    try {
      setIsLoadingAdmins(true);
      const data = await userService.getAllAdmins();
      setAdmins(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  const fetchDeliveries = async () => {
    try {
      setIsLoadingDeliveries(true);
      const data = await userService.getAllDeliveries();
      setDeliveries(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingDeliveries(false);
    }
  };

  const fetchAccessCodes = async () => {
    try {
      setIsLoadingCodes(true);
      const data = await accessCodeService.getAll();
      setAccessCodes(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingCodes(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchDeliveries();
    fetchAccessCodes();
  }, []);

  const handleDisableCode = (code: AccessCode) => {
    setSelectedCode(code);
    setIsDisableModalOpen(true);
  };

  const handleDisableSuccess = () => {
    fetchAccessCodes();
  };

  const handleCreateSuccess = () => {
    fetchAccessCodes();
    fetchAdmins();
    fetchDeliveries();
  };

  const filteredUsers = useMemo(() => {
    const allUsers = [...admins, ...deliveries];
    return allUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.username.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole =
        roleFilterUsers.has('all') || roleFilterUsers.has(user.role);
      return matchesSearch && matchesRole;
    });
  }, [admins, deliveries, userSearch, roleFilterUsers]);

  const filteredAccessCodes = useMemo(() => {
    return accessCodes.filter((code) => {
      const matchesStatus =
        statusFilter.has('all') || statusFilter.has(code.status);
      const matchesRole = roleFilter.has('all') || roleFilter.has(code.role);
      return matchesStatus && matchesRole;
    });
  }, [accessCodes, statusFilter, roleFilter]);

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <Heading
          title="Gestión de Usuarios"
          subtitle="Administra usuarios y códigos de acceso"
        />

        <Button
          color="primary"
          startContent={<IconPlus size={18} />}
          onPress={() => setIsCreateModalOpen(true)}
        >
          Nuevo código
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-large bg-default-50 p-6 shadow-small">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Usuarios Registrados</h3>
            <p className="text-sm text-default-500 mt-1">
              {filteredUsers.length} usuario
              {filteredUsers.length !== 1 ? 's' : ''} encontrado
              {filteredUsers.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="mb-4 flex gap-3 flex-wrap">
            <Input
              isClearable
              placeholder="Buscar por nombre o usuario..."
              startContent={<IconSearch size={18} />}
              value={userSearch}
              onValueChange={setUserSearch}
              onClear={() => setUserSearch('')}
              className="flex-1 min-w-[200px]"
            />
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<IconChevronDown size={18} />}
                  variant="flat"
                >
                  Rol:{' '}
                  {roleFilterUsers.has('all')
                    ? 'Todos'
                    : roleFilterUsers.has('admin')
                    ? 'Admins'
                    : 'Repartidores'}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtro de rol"
                closeOnSelect={true}
                selectedKeys={roleFilterUsers}
                selectionMode="single"
                onSelectionChange={(keys) =>
                  setRoleFilterUsers(keys as Set<string>)
                }
              >
                <DropdownItem key="all">Todos</DropdownItem>
                <DropdownItem key="admin">Administradores</DropdownItem>
                <DropdownItem key="delivery">Repartidores</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div>
            <UsersTable
              users={filteredUsers}
              isLoading={isLoadingAdmins || isLoadingDeliveries}
            />
          </div>
        </div>

        <div className="rounded-large bg-default-50 p-6 shadow-small">
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Códigos de Acceso</h3>
            <p className="text-sm text-default-500 mt-1">
              {filteredAccessCodes.length} código
              {filteredAccessCodes.length !== 1 ? 's' : ''} encontrado
              {filteredAccessCodes.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="mb-4 flex gap-3 flex-wrap">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<IconChevronDown size={18} />}
                  variant="flat"
                >
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtro de estado"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setStatusFilter(keys as Set<string>)
                }
              >
                <DropdownItem key="all">Todos</DropdownItem>
                <DropdownItem key={AccessCodeState.active}>Activo</DropdownItem>
                <DropdownItem key={AccessCodeState.disabled}>
                  Inactivo
                </DropdownItem>
                <DropdownItem key={AccessCodeState.expired}>
                  Expirado
                </DropdownItem>
                <DropdownItem key={AccessCodeState.used}>Usado</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<IconChevronDown size={18} />}
                  variant="flat"
                >
                  Rol
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtro de rol"
                closeOnSelect={false}
                selectedKeys={roleFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => setRoleFilter(keys as Set<string>)}
              >
                <DropdownItem key="all">Todos</DropdownItem>
                <DropdownItem key={AccessCodeRole.admin}>
                  Administrador
                </DropdownItem>
                <DropdownItem key={AccessCodeRole.delivery}>
                  Repartidor
                </DropdownItem>
                <DropdownItem key={AccessCodeRole.cashier}>Cajero</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div>
            <AccessCodesTable
              codes={filteredAccessCodes}
              isLoading={isLoadingCodes}
              onDisable={handleDisableCode}
            />
          </div>
        </div>
      </div>

      <CreateAccessCodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <DisableAccessCodeModal
        isOpen={isDisableModalOpen}
        onClose={() => setIsDisableModalOpen(false)}
        code={selectedCode}
        onSuccess={handleDisableSuccess}
      />
    </div>
  );
}
