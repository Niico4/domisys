'use client';
import { useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import CreateProductForm from './forms/CreateProductForm';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateProductModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateProductModalProps) => {
  useEffect(() => {
    const handleProductCreated = () => {
      onSuccess?.();
      onClose();
    };

    window.addEventListener('productCreated', handleProductCreated);
    return () =>
      window.removeEventListener('productCreated', handleProductCreated);
  }, [onSuccess, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Nuevo Producto
        </ModalHeader>
        <ModalBody>
          <CreateProductForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateProductModal;
