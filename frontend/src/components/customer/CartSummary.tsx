"use client";

import { Card, CardBody } from "@heroui/react";

interface CartSummaryProps {
  totalProducts: number;
  subtotal: number;
  shipping: number;
  total: number;
}

export const CartSummary = ({
  totalProducts,
  subtotal,
  shipping,
  total,
}: CartSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-full bg-[#BBCAC6] rounded-t-2xl shadow-md p-4 sm:p-6 space-y-3">
      <div className="bg-white rounded-lg px-4 py-3">
        <div className="flex justify-between items-center text-sm sm:text-base">
          <span className="text-default-700">Productos totales</span>
          <span className="font-semibold text-default-900">
            {totalProducts}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm sm:text-base">
          <span className="text-default-700">Subtotal</span>
          <span className="font-semibold text-default-900">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm sm:text-base">
          <span className="text-default-700">Envío</span>
          <span className="font-semibold text-default-900">
            {formatPrice(shipping)}
          </span>
        </div>

        <div className="border-t border-default-300 pt-3 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg sm:text-xl text-[#313131]">
              Total
            </span>
            <span className="font-bold text-lg sm:text-xl text-[#7F645A]">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
