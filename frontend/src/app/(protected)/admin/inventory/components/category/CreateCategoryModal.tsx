'use client';
import { useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import CategoryForm from './CategoryForm';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateCategoryModalProps) => {
  useEffect(() => {
    const handleCategoryCreated = () => {
      onSuccess?.();
      onClose();
    };

    window.addEventListener('categoryCreated', handleCategoryCreated);
    return () =>
      window.removeEventListener('categoryCreated', handleCategoryCreated);
  }, [onSuccess, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Nueva Categoría
        </ModalHeader>
        <ModalBody>
          <CategoryForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateCategoryModal;
