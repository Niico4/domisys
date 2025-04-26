import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconCash,
  IconCreditCard,
  IconPlus,
  IconShoppingCart,
  IconTransfer,
  IconX,
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Checkbox } from '@heroui/checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover';
import { AnimatePresence, motion } from 'framer-motion';
import CreditCardForm from '@modules/customer/shopping-cart/components/payment-methods/CreditCardForm';
import NequiForm from '@modules/customer/shopping-cart/components/payment-methods/NequiForm';
import CashForm from '@modules/customer/shopping-cart/components/payment-methods/CashForm';
import ProductCartCard from '@modules/customer/shopping-cart/components/ProductCartCard';
import OrderSummary from '@modules/customer/shopping-cart/components/OrderSummary';
import OrderConfirmation from '@modules/customer/shopping-cart/components/OrderConfirmation';
import { usePaymentMethods } from '@modules/customer/hooks/usePaymentMethods';

import { generateOrderId } from '@/utils/id-generator';
import useOrders from '@/hooks/useOrders';
import useCart from '@/hooks/useCart';
import { paths } from '@/constants/routerPaths';
import { SHOPPING_COST } from '@/constants/mock/mock-shopping-cart';
import { formatCardNumber } from '@/utils/format';
import { mockDelivery } from '@/constants/mock/mock-delivery';
import { Order } from '@/types/order';
import { PaymentMethod } from '@/types/payment-method';
import { mockCustomer } from '@/constants/mock/mock-customer';

const ShoppingCartPage = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    total,
  } = useCart();
  const {
    handleDeleteMethod,
    handleSelectMethod,
    handleSelectPaymentMethod,
    paymentMethodType,
    paymentMethods,
    selectedPaymentMethod,
    setPaymentMethods,
    setSelectedPaymentMethod,
    setShowAddForm,
    showAddForm,
  } = usePaymentMethods([
    {
      id: '1',
      type: 'credit_card',
      cardNumber: '4242424242424242',
      cardHolder: 'Juan Perez',
      expirationDate: '12/25',
      cvv: '123',
    },
    {
      id: '2',
      type: 'nequi',
      accountNumber: '3101234567',
      accountHolder: 'Juan Perez',
    },
  ]);
  const { addOrder } = useOrders();

  const handleAddClick = () => {
    setShowAddForm(true);
    setSelectedPaymentMethod(null);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    if (!open && hasConfirmed) {
      clearCart();
      navigate(`/${paths.orders}`);
    }

    if (!open) {
      setIsPopoverOpen(false);
      return;
    }
    if (open && !selectedPaymentMethod && paymentMethodType !== 'cash') {
      toast.info('Por favor selecciona un método de pago');
      return;
    }

    setIsPopoverOpen(open);
  };

  useEffect(() => {
    if (!isPopoverOpen) {
      setHasConfirmed(false);
    }
  }, [isPopoverOpen]);

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleContinue = async (): Promise<string | null> => {
    try {
      if (!selectedPaymentMethod && paymentMethodType !== 'cash') {
        toast.info('Por favor selecciona un método de pago');
        return null;
      }

      if (!paymentMethodType) {
        toast.error('Método de pago no definido');
        return null;
      }

      if (cart.length === 0) {
        toast.error('No hay productos en el carrito');
        return null;
      }

      const loadingToast = toast.loading('Procesando tu pedido...');

      await new Promise((resolve) => setTimeout(resolve, 1500));

      let paymentMethod: PaymentMethod;

      if (selectedPaymentMethod) {
        paymentMethod = selectedPaymentMethod;
      } else {
        paymentMethod = {
          id: `cash_${crypto.randomUUID()}`,
          type: 'cash',
          amount: total(),
        };
      }

      const newOrder: Order = {
        id: generateOrderId(),
        customer: mockCustomer,
        delivery: mockDelivery,
        products: cart,
        paymentMethod,
        status: 'pending',
        createdAt: new Date(),
        totalAmount: total(),
      };

      await addOrder(newOrder);
      toast.dismiss(loadingToast);
      toast.success('Pedido creado');
      setHasConfirmed(true);

      return newOrder.id;
    } catch (error) {
      console.error('Error al crear el pedido', error);
      toast.error(
        'Ocurrió un error al procesar tu pedido. Por favor intenta nuevamente.',
      );
      return null;
    }
  };

  const handleCloseAfterPayment = () => {
    setIsPopoverOpen(false);
    clearCart();
    navigate(`/${paths.orders}`);
  };

  const handleClearCart = () => {
    toast('¿Vaciar el carrito?', {
      action: {
        label: 'Confirmar',
        onClick: () => clearCart(),
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {},
      },
    });
  };

  const renderPaymentMethodForm = () => {
    if (!paymentMethodType) return null;

    const commonProps = {
      setPaymentMethods,
      setSelectedPaymentMethod,
      setShowAddForm,
    };

    switch (paymentMethodType) {
      case 'credit_card':
        return <CreditCardForm {...commonProps} />;
      case 'nequi':
        return <NequiForm paymentMethods={paymentMethods} {...commonProps} />;
      case 'cash':
        return <CashForm />;
      default:
        return null;
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-[60vh]">
        <IconShoppingCart size={48} className="text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-500">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-400">Agrega productos para continuar</p>
        <Button onPress={() => navigate(`${paths.root}${paths.home}`)}>
          Ver productos
        </Button>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-12">
      <h1>Carrito de Compras</h1>

      <div className="grid grid-cols-2 items-start gap-20">
        <article>
          <AnimatePresence>
            <div className="flex flex-col gap-4 mb-4 h-[576px] overflow-auto px-4">
              {cart.map(({ id, productName, price, stock, quantity }) => (
                <motion.div key={id} layout>
                  <ProductCartCard
                    key={id}
                    id={id}
                    handleQuantityChange={handleQuantityChange}
                    price={price}
                    productName={productName}
                    quantity={quantity}
                    removeFromCart={removeFromCart}
                    stock={stock}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </article>

        <article className="flex flex-col justify-center gap-5 w-4/5 mx-auto">
          <OrderSummary
            shoppingCost={SHOPPING_COST}
            subtotal={subtotal()}
            total={total()}
            totalItems={totalItems()}
          />

          <Card
            className="bg-white/10 border border-white/15 p-5 backdrop-blur-sm"
            radius="sm"
          >
            <div className="flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3">Método de pago</h3>

                <div className="space-y-3">
                  {/* Tarjeta de crédito/débito */}
                  <div
                    className={`px-4 py-3 rounded-lg transition-colors 
                      ${paymentMethodType === 'credit_card' ? 'bg-primary/10 border border-primary/20' : 'bg-white/[0.04] hover:bg-white/[0.08]'}`}
                    onClick={() => handleSelectMethod('credit_card')}
                  >
                    <div className="flex items-center gap-3 cursor-pointer">
                      <IconCreditCard size={20} />
                      <span className="font-medium">
                        Tarjeta de crédito/débito
                      </span>
                    </div>

                    {paymentMethodType === 'credit_card' && (
                      <div
                        className="mt-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {paymentMethods.filter((m) => m.type === 'credit_card')
                          .length > 0 ? (
                          <>
                            {paymentMethods
                              .filter((m) => m.type === 'credit_card')
                              .map((method) => (
                                <div
                                  key={method.id}
                                  className="flex items-center gap-3 p-2 hover:bg-white/[0.05] rounded justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <Checkbox
                                      isSelected={
                                        selectedPaymentMethod?.id === method.id
                                      }
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                      ) =>
                                        handleSelectPaymentMethod(
                                          method,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                    <div>
                                      <p>{method.cardHolder}</p>
                                      <p className="text-sm text-gray-400">
                                        {formatCardNumber(method.cardNumber)}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    isIconOnly
                                    variant="light"
                                    color="danger"
                                    size="sm"
                                    onPress={() =>
                                      handleDeleteMethod(method.id)
                                    }
                                  >
                                    <IconX size={16} />
                                  </Button>
                                </div>
                              ))}
                            <Button
                              variant="light"
                              size="sm"
                              className="mt-2"
                              startContent={<IconPlus size={16} />}
                              onPress={handleAddClick}
                            >
                              Agregar nueva tarjeta
                            </Button>
                          </>
                        ) : (
                          <>
                            <p className="text-gray-400 text-sm">
                              No tienes tarjetas guardadas
                            </p>
                            <Button
                              variant="light"
                              size="sm"
                              className="mt-2"
                              startContent={<IconPlus size={16} />}
                              onPress={handleAddClick}
                            >
                              Agregar nueva tarjeta
                            </Button>
                          </>
                        )}

                        {showAddForm && renderPaymentMethodForm()}
                      </div>
                    )}
                  </div>

                  {/* Efectivo */}
                  <div
                    className={`px-4 py-3 rounded-lg transition-colors 
                      ${paymentMethodType === 'cash' ? 'bg-primary/10 border border-primary/20' : 'bg-white/[0.04] hover:bg-white/[0.08]'}`}
                    onClick={() => handleSelectMethod('cash')}
                  >
                    <div className="flex items-center gap-3 cursor-pointer">
                      <IconCash size={20} />
                      <span className="font-medium">Efectivo</span>
                    </div>

                    {paymentMethodType === 'cash' && renderPaymentMethodForm()}
                  </div>

                  {/* Nequi o transferencia */}
                  <div
                    className={`px-4 py-3 rounded-lg transition-colors 
                      ${paymentMethodType === 'nequi' ? 'bg-primary/10 border border-primary/20' : 'bg-white/[0.04] hover:bg-white/[0.08]'}`}
                    onClick={() => handleSelectMethod('nequi')}
                  >
                    <div className="flex items-center gap-3 cursor-pointer">
                      <IconTransfer size={20} />
                      <span className="font-medium">Nequi</span>
                    </div>

                    {paymentMethodType === 'nequi' && (
                      <div
                        className="mt-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {paymentMethods.filter((m) => m.type === 'nequi')
                          .length > 0 ? (
                          <>
                            {paymentMethods
                              .filter((m) => m.type === 'nequi')
                              .map((method) => (
                                <div
                                  key={method.id}
                                  className="flex items-center gap-3 p-2 hover:bg-white/[0.05] rounded justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    <Checkbox
                                      isSelected={
                                        selectedPaymentMethod?.id === method.id
                                      }
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                      ) =>
                                        handleSelectPaymentMethod(
                                          method,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                    <div>
                                      <p>{method.accountHolder}</p>
                                      <p className="text-sm text-gray-400">
                                        {method.accountNumber}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    isIconOnly
                                    variant="light"
                                    color="danger"
                                    size="sm"
                                    onPress={() =>
                                      handleDeleteMethod(method.id)
                                    }
                                  >
                                    <IconX size={16} />
                                  </Button>
                                </div>
                              ))}
                            <Button
                              variant="light"
                              size="sm"
                              className="mt-2"
                              startContent={<IconPlus size={16} />}
                              onPress={handleAddClick}
                            >
                              Agregar nuevo número
                            </Button>
                          </>
                        ) : (
                          <>
                            <p className="text-gray-400 text-sm">
                              No tienes métodos Nequi guardados
                            </p>
                            <Button
                              variant="light"
                              size="sm"
                              className="mt-2"
                              startContent={<IconPlus size={16} />}
                              onPress={handleAddClick}
                            >
                              Agregar nuevo número
                            </Button>
                          </>
                        )}

                        {showAddForm && renderPaymentMethodForm()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-5">
                <Button
                  variant="flat"
                  color="danger"
                  radius="sm"
                  onPress={handleClearCart}
                >
                  Vaciar carrito
                </Button>

                <Popover
                  isOpen={isPopoverOpen}
                  onOpenChange={handlePopoverOpenChange}
                  placement="top-end"
                  backdrop="opaque"
                  radius="sm"
                  size="lg"
                >
                  <PopoverTrigger>
                    <Button
                      color="primary"
                      radius="sm"
                      isDisabled={
                        !paymentMethodType ||
                        (paymentMethodType !== 'cash' && !selectedPaymentMethod)
                      }
                    >
                      Continuar
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 shadow-2xl">
                    <OrderConfirmation
                      total={total()}
                      totalItems={totalItems()}
                      paymentMethod={selectedPaymentMethod}
                      paymentMethodType={paymentMethodType}
                      onConfirm={async () => {
                        const success = await handleContinue();
                        return success;
                      }}
                      onCancel={() => {
                        setIsPopoverOpen(false);
                        toast.warning('Compra cancelada');
                      }}
                      onClose={handleCloseAfterPayment}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </Card>
        </article>
      </div>
    </section>
  );
};

export default ShoppingCartPage;
