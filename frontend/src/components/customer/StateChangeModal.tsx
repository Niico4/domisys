'use client';

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from '@heroui/react';
import { IconCheck, IconTruck, IconPackage } from '@tabler/icons-react';
import { OrderState } from '@/types/order';

interface StateChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note?: string) => void;
  orderId: number | null;
  currentState: OrderState | null;
  nextState: OrderState | null;
}

const StateConfig: Record<
  OrderState,
  { label: string; icon: typeof IconCheck; color: string; description: string }
> = {
  [OrderState.PENDING]: {
    label: 'Pendiente',
    icon: IconPackage,
    color: 'warning',
    description: '',
  },
  [OrderState.CONFIRMED]: {
    label: 'Confirmar Pedido',
    icon: IconCheck,
    color: 'primary',
    description:
      'Al confirmar, el cliente será notificado y el pedido pasará a preparación.',
  },
  [OrderState.SHIPPED]: {
    label: 'En Camino',
    icon: IconTruck,
    color: 'primary',
    description:
      'Indica que has recogido el pedido y estás en camino al cliente.',
  },
  [OrderState.DELIVERED]: {
    label: 'Entregado',
    icon: IconCheck,
    color: 'success',
    description:
      'Confirma que el pedido ha sido entregado exitosamente al cliente.',
  },
  [OrderState.CANCEL]: {
    label: 'Cancelado',
    icon: IconCheck,
    color: 'danger',
    description: '',
  },
};

export const StateChangeModal = ({
  isOpen,
  onClose,
  onConfirm,
  orderId,
  currentState,
  nextState,
}: StateChangeModalProps) => {
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    onConfirm(note.trim() || undefined);
    handleClose();
  };

  const handleClose = () => {
    setNote('');
    onClose();
  };

  if (!nextState) return null;

  const config = StateConfig[nextState];
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full bg-${config.color}-100`}>
                  <Icon size={24} className={`text-${config.color}-600`} />
                </div>
                <span>{config.label}</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-default-600 mb-2">{config.description}</p>
              <p className="text-sm text-default-500 mb-4">
                Pedido #{orderId}
              </p>

              <Textarea
                label="Nota adicional (opcional)"
                placeholder="Agrega información relevante sobre este cambio..."
                value={note}
                onValueChange={setNote}
                minRows={2}
                maxRows={4}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={handleClose}>
                Cancelar
              </Button>
              <Button color={config.color as 'primary'} onPress={handleConfirm}>
                Confirmar {config.label}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
