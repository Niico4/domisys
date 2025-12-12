export enum PaymentMethod {
  NEQUI = 'nequi',
  DAVIPLATA = 'daviplata',
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
}

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.NEQUI]: 'Nequi',
  [PaymentMethod.DAVIPLATA]: 'DaviPlata',
  [PaymentMethod.CASH]: 'Efectivo',
  [PaymentMethod.CREDIT_CARD]: 'Tarjeta de crédito/débito',
};
