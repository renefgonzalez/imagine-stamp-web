// ── Tipos del módulo Alitas y Más ───────────────────────────────────────────

export interface SizeOption {
  id: string;
  label: string;
  price: number;
}

export interface ExtraOption {
  id: string;
  label: string;
  price: number;
}

export interface ChoiceOption {
  id: string;
  label: string;
}

export type CategoryId = 'tacos' | 'pizzetas' | 'quesadillas' | 'alitas';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
  badge?: 'popular' | 'nuevo' | 'picante';
  featured?: boolean;
  sizes?: SizeOption[];
  needsSauce?: boolean;
  extras?: ExtraOption[];
  choices?: ChoiceOption[];
  ingredientPick?: number;
}

export interface CartItem {
  lineId: string;
  productId: string;
  name: string;
  detail?: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  deliveryMethod: 'pickup' | 'delivery';
  address: string;
  paymentMethod: 'cash' | 'transfer';
  cashAmount: string;
  notes: string;
}
