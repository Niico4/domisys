'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from '@heroui/react';
import { accessCodeService } from '@/services/access-code.service';
import { handleApiError } from '@/utils/error-handler';
import { useState } from 'react';
import { AccessCode } from '@/types/user-management/access-code';

interface DisableAccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: AccessCode | null;
  onSuccess?: () => void;
}

export default function DisableAccessCodeModal({
  isOpen,
  onClose,
  code,
  onSuccess,
}: DisableAccessCodeModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDisable = async () => {
    if (!code) return;

    setLoading(true);
    try {
      await accessCodeService.disable(code.id);

      addToast({
        title: 'Código desactivado',
        description: `El código "${code.code}" ha sido desactivado exitosamente.`,
        color: 'success',
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Confirmar desactivación</ModalHeader>
        <ModalBody>
          <p>
            ¿Estás seguro de que deseas desactivar el código{' '}
            <strong>{code?.code}</strong>?
          </p>
          <p className="text-sm text-default-500 mt-2">
            Una vez desactivado, este código no podrá ser utilizado para crear nuevas cuentas.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={handleDisable}
            isLoading={loading}
            isDisabled={loading}
          >
            Desactivar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
