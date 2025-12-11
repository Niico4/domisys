'use client';

import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
import CreateAccessCodeForm from './CreateAccessCodeForm';

interface CreateAccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAccessCodeModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAccessCodeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader>Crear código de acceso</ModalHeader>
        <ModalBody>
          <CreateAccessCodeForm onSuccess={onSuccess} onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
