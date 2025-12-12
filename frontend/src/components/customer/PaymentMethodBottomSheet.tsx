'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { Button, Card, CardBody, Radio, RadioGroup } from '@heroui/react';
import { addToast } from '@heroui/react';
import { PaymentMethod, PaymentMethodLabels } from '@/types/payment-method';
import { orderService } from '@/services/order.service';
import { useCartStore } from '@/store/cart.store';
import { handleApiError } from '@/utils/error-handler';

interface PaymentMethodBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (paymentMethod: PaymentMethod) => void;
  addressId: number | null;
}

export const PaymentMethodBottomSheet = ({
  isOpen,
  onClose,
  onConfirm,
  addressId,
}: PaymentMethodBottomSheetProps) => {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    PaymentMethod.NEQUI
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!addressId) {
      addToast({
        title: 'Error',
        description: 'Por favor selecciona una dirección',
        color: 'danger',
      });
      return;
    }

    if (items.length === 0) {
      addToast({
        title: 'Error',
        description: 'El carrito está vacío',
        color: 'danger',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order payload
      const orderPayload = {
        paymentMethod: selectedMethod,
        addressId: addressId,
        products: items.map((item) => ({
          productId: parseInt(item.id),
          quantity: item.quantity,
        })),
      };

      // Create order
      const order = await orderService.createOrder(orderPayload);

      if (order) {
        // Clear cart on success
        clearCart();

        addToast({
          title: '¡Pedido creado!',
          description: 'Tu pedido ha sido creado exitosamente',
          color: 'success',
        });

        // Call optional onConfirm callback
        onConfirm?.(selectedMethod);

        // Close the bottom sheet
        onClose();

        // Navigate to home or order confirmation page
        router.push('/customer/home');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="¿Con qué pagarás?"
      maxHeight="70vh"
    >
      <div className="p-4 space-y-6">
        <p className="text-sm text-default-500">
          Selecciona tu método de pago
        </p>

        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
          className="space-y-3 w-full"
        >
          {Object.values(PaymentMethod).map((method) => (
            <Radio
              key={method}
              value={method}
              classNames={{
                base: 'w-full max-w-full',
                label: 'w-full max-w-full',
                wrapper: 'mr-3',
              }}
            >
              <Card
                className={`w-full max-w-full transition-all ${
                  selectedMethod === method
                    ? 'bg-primary-50 border-2 border-primary-500 shadow-md'
                    : 'bg-white border border-default-200 hover:border-primary-300 hover:shadow-sm'
                }`}
              >
                <CardBody className="p-4">
                  <span className="font-medium text-default-900">
                    {PaymentMethodLabels[method]}
                  </span>
                </CardBody>
              </Card>
            </Radio>
          ))}
        </RadioGroup>

        <div className="pt-4 pb-2">
          <Button
            className="w-full bg-primary-600 text-white font-semibold rounded-lg py-6 text-base"
            onPress={handleConfirm}
            isDisabled={isSubmitting || !addressId || items.length === 0}
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Creando pedido...' : 'Confirmar pedido'}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};
