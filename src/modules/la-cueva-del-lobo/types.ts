// ── Tipos para La Cueva del Lobo (Xochimilco) ──────────────────────────────────

export type CategoryId =
  | 'todos'
  | 'antojitos'
  | 'micheladas'
  | 'pulques'
  | 'bebidas-preparadas'
  | 'cervezas'
  | 'refrescos-y-vasos';

export interface SizeOption {
  id: string;
  label: string; // ej. '1 Litro' | '½ Litro'
  price: number;
  sublabel?: string;
}

export interface ExtraOption {
  id: string;
  label: string;
  price: number;
}

export interface VariantOption {
  id: string;
  name: string;
  price?: number; // Precio adicional o precio específico
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Precio base o desde
  category: CategoryId;
  image?: string;
  featured?: boolean;
  badge?: 'estrella' | 'tradicion' | 'artesanal' | 'imperdible' | 'nuevo';
  sizes?: SizeOption[];
  variants?: VariantOption[]; // ej. tipo de carne o sabor
  variantTitle?: string; // ej. 'Elige tu proteína' o 'Elige tu sabor'
  extras?: ExtraOption[]; // ej. queso extra +$10
  allowsSalsas?: boolean; // Para antojitos mexicanos
  allowsEscarchado?: boolean; // Para micheladas y bebidas
  isCustomizable?: boolean;
}

export interface CartItem {
  lineId: string;
  productId: string;
  name: string;
  category: CategoryId;
  detail: string; // Resumen legible de tamaño, carne, salsas, extras
  unitPrice: number;
  quantity: number;
  image?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  deliveryMethod: 'mesa-trajinera' | 'pickup' | 'delivery';
  address: string; // Dirección o número de mesa / trajinera / embarcadero
  paymentMethod: 'cash' | 'transfer';
  cashAmount: string; // Con cuánto paga para cambio
  notes: string;
}
