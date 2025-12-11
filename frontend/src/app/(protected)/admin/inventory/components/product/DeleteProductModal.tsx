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
import { productService } from '@/services/product.service';
import { handleApiError } from '@/utils/error-handler';
import { useState } from 'react';
import { Product } from '@/types/inventory/product';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const DeleteProductModal = ({
  isOpen,
  onClose,
  product,
}: DeleteProductModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!product) return;

    setLoading(true);
    try {
      await productService.deleteProduct(product.id);

      addToast({
        title: 'Producto eliminado',
        description: `El producto "${product.name}" ha sido eliminado exitosamente.`,
        color: 'success',
      });

      window.dispatchEvent(new CustomEvent('productDeleted'));
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
        <ModalHeader>Confirmar eliminación</ModalHeader>
        <ModalBody>
          <p>
            ¿Estás seguro de que deseas eliminar el producto{' '}
            <strong>{product?.name}</strong>?
          </p>
          <p className="text-sm text-default-500 mt-2">
            Esta acción eliminará el producto y no se podrá visualizar en el
            inventario, ni tener registro alguno.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={loading}
            isDisabled={loading}
          >
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
