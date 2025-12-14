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
  RadioGroup,
  Radio,
} from '@heroui/react';
import { IconAlertTriangle } from '@tabler/icons-react';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  orderId: number | null;
}

const CANCELLATION_REASONS = [
  'Cliente no disponible',
  'Dirección incorrecta',
  'Producto agotado',
  'Problema con el pago',
  'Solicitud del cliente',
  'Otro',
];

export const CancelOrderModal = ({
  isOpen,
  onClose,
  onConfirm,
  orderId,
}: CancelOrderModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const finalReason =
      selectedReason === 'Otro' ? customReason.trim() : selectedReason;

    if (!finalReason) {
      setError('Debes seleccionar o escribir una razón para cancelar');
      return;
    }

    onConfirm(finalReason);
    handleClose();
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-danger-100">
                  <IconAlertTriangle size={24} className="text-danger-600" />
                </div>
                <span>Cancelar Pedido #{orderId}</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-default-600 mb-4">
                Por favor, indica el motivo de la cancelación. Esta información
                será visible para el cliente.
              </p>

              <RadioGroup
                label="Motivo de cancelación"
                value={selectedReason}
                onValueChange={(value) => {
                  setSelectedReason(value);
                  setError('');
                }}
              >
                {CANCELLATION_REASONS.map((reason) => (
                  <Radio key={reason} value={reason}>
                    {reason}
                  </Radio>
                ))}
              </RadioGroup>

              {selectedReason === 'Otro' && (
                <Textarea
                  label="Describe el motivo"
                  placeholder="Escribe el motivo de la cancelación..."
                  value={customReason}
                  onValueChange={(value) => {
                    setCustomReason(value);
                    setError('');
                  }}
                  className="mt-4"
                  minRows={2}
                  maxRows={4}
                />
              )}

              {error && <p className="text-danger-500 text-sm mt-2">{error}</p>}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={handleClose}>
                Volver
              </Button>
              <Button
                color="danger"
                onPress={handleConfirm}
                startContent={<IconAlertTriangle size={18} />}
              >
                Confirmar cancelación
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
