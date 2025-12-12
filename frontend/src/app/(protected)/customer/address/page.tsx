"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import { IconArrowLeft, IconMapPin, IconPlus } from "@tabler/icons-react";
import { AddressCard } from "@/components/customer/AddressCard";
import { AddressForm } from "@/components/customer/AddressForm";
import { PaymentMethodBottomSheet } from "@/components/customer/PaymentMethodBottomSheet";
import { PaymentMethod } from "@/types/payment-method";
import { Address } from "@/types/address";
import { addressService } from "@/services/address.service";
import { AddressPayloadType } from "./address.schema";

export default function AddressPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    const data = await addressService.getUserAddresses();
    if (data) {
      setAddresses(data);
      const defaultAddress = data.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
    }
    setIsLoading(false);
  };

  const handleSelectAddress = (id: number) => {
    setSelectedAddressId(id);
  };

  const handleCreateAddress = () => {
    setEditingAddress(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleDeleteAddress = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
      const success = await addressService.deleteAddress(id);
      if (success) {
        await fetchAddresses();
        if (selectedAddressId === id) {
          const remaining = addresses.filter((addr) => addr.id !== id);
          setSelectedAddressId(remaining.length > 0 ? remaining[0].id : null);
        }
      }
    }
  };

  const handleFormSubmit = async (data: AddressPayloadType) => {
    if (formMode === "create") {
      await addressService.createAddress(data);
    } else if (editingAddress) {
      await addressService.updateAddress(editingAddress.id, data);
    }
    await fetchAddresses();
  };

  const formatAddress = (address: Address): string => {
    const parts = [address.street];
    if (address.details) {
      parts.push(address.details);
    }
    parts.push(address.neighborhood, address.city);
    return parts.join(", ");
  };

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      alert("Por favor selecciona una dirección");
      return;
    }
    setIsPaymentSheetOpen(true);
  };

  const handlePaymentConfirm = (paymentMethod: PaymentMethod) => {
    console.log("Order confirmed:", {
      addressId: selectedAddressId,
      paymentMethod,
    });
    router.push("/customer/home");
  };

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-h-screen">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              isIconOnly
              variant="light"
              className="min-w-unit-10 w-10 h-10"
              onPress={() => router.back()}
              aria-label="Volver"
            >
              <IconArrowLeft
                size={24}
                className="text-primary-600"
                stroke={2}
              />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-600">
              Dirección de envío
            </h1>
          </div>

          {/* Saved Addresses Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IconMapPin size={20} className="text-primary-600" stroke={2} />
                <h2 className="text-lg font-semibold text-default-900">
                  Direcciones guardadas
                </h2>
              </div>
              <Button
                isIconOnly
                variant="flat"
                className="bg-default-100 hover:bg-default-200 min-w-unit-10 w-10 h-10"
                aria-label="Agregar dirección"
                onPress={handleCreateAddress}
              >
                <IconPlus size={20} className="text-default-600" stroke={2} />
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Spinner size="lg" color="primary" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-default-500 mb-2">
                  No hay direcciones guardadas
                </p>
                <p className="text-sm text-default-400">
                  Agrega una dirección para continuar
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    id={address.id}
                    title={address.alias}
                    address={formatAddress(address)}
                    isSelected={selectedAddressId === address.id}
                    onSelect={() => handleSelectAddress(address.id)}
                    onEdit={() => handleEditAddress(address)}
                    onDelete={() => handleDeleteAddress(address.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="h-28 sm:h-32" />
        </div>
      </div>

      <div className="fixed bottom-16 sm:bottom-20 left-0 right-0 p-4 bg-white border-t border-default-200 shadow-lg z-50">
        <div className="max-w-2xl mx-auto">
          <Button
            className="w-full bg-primary-600 text-white font-semibold rounded-lg py-6 text-base"
            onPress={handleProceedToPayment}
            isDisabled={!selectedAddressId || addresses.length === 0}
          >
            Método de pago
          </Button>
        </div>
      </div>

      <AddressForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAddress(null);
        }}
        onSubmit={handleFormSubmit}
        address={editingAddress}
        mode={formMode}
      />

      <PaymentMethodBottomSheet
        isOpen={isPaymentSheetOpen}
        onClose={() => setIsPaymentSheetOpen(false)}
        onConfirm={handlePaymentConfirm}
        addressId={selectedAddressId}
      />
    </>
  );
}
