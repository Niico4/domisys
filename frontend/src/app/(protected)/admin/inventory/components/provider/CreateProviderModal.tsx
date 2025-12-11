'use client';
import { useEffect } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';

import ProviderForm from './ProviderForm';

interface CreateProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProviderModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateProviderModalProps) => {
  useEffect(() => {
    const handleProductCreated = () => {
      onSuccess?.();
      onClose();
    };

    window.addEventListener('providerCreated', handleProductCreated);
    return () =>
      window.removeEventListener('providerCreated', handleProductCreated);
  }, [onSuccess, onClose]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>Nuevo Proveedor</ModalHeader>
        <ModalBody>
          <ProviderForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateProviderModal;
