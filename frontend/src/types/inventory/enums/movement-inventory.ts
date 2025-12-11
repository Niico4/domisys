export enum MovementReason {
  expired = 'expired',
  return_to_supplier = 'return_to_supplier',
  sale = 'sale',
  manual_error = 'manual_error',
  damaged_product = 'damaged_product',
  return = 'return',
  other = 'other',
}

export enum MovementType {
  in = 'in',
  out = 'out',
}

export const MovementTypeLabels: Record<MovementType, string> = {
  [MovementType.in]: 'Entrada',
  [MovementType.out]: 'Salida',
};

export const MovementReasonLabels: Record<MovementReason, string> = {
  [MovementReason.expired]: 'Producto vencido',
  [MovementReason.return_to_supplier]: 'Devolución a proveedor',
  [MovementReason.sale]: 'Venta',
  [MovementReason.manual_error]: 'Error manual',
  [MovementReason.damaged_product]: 'Producto dañado',
  [MovementReason.return]: 'Devolución',
  [MovementReason.other]: 'Otro',
};

export const MovementTypeColors: Record<
  MovementType,
  'success' | 'danger' | 'warning'
> = {
  [MovementType.in]: 'success',
  [MovementType.out]: 'danger',
};
