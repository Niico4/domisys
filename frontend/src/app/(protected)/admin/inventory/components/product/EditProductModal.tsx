'use client';

import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import EditProductForm from './forms/EditProductForm';
import { Product } from '@/types/inventory/product';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function EditProductModal({
  isOpen,
  onClose,
  product,
}: EditProductModalProps) {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>Editar Producto</ModalHeader>
        <ModalBody>
          <EditProductForm product={product} onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
