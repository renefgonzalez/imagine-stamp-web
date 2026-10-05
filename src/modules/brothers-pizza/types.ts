// ── Tipos para Brothers Pizza ───────────────────────────────────────────────

export type CategoryId = 'todos' | 'especialidades' | '4-a-6-ingredientes' | '2-a-3-ingredientes' | '1-ingrediente' | 'arma-tu-pizza' | 'bebidas';

export interface SizeOption {
  id: string;
  label: string;
  price: number;
  sublabel?: string;
  slices?: string; // ej. '8 Rebanadas' | '18 Rebanadas'
}

export interface ExtraOption {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Precio base (generalmente el de la mediana)
  category: CategoryId;
  image?: string;
  featured?: boolean;
  badge?: string; // 'favorita' | 'popular' | 'nueva' | 'picante' | 'suprema'
  sizes?: SizeOption[];
  ingredientsList?: string[];
  isCustomizable?: boolean;
  maxIngredients?: number;
  allowsCrustCheese?: boolean; // Permite orilla rellena de queso
}

export interface CartItem {
  lineId: string;
  productId: string;
  name: string;
  category: CategoryId;
  detail: string; // ej: "Grande (8 Reb) · Orilla rellena de queso · Sin cebolla"
  unitPrice: number;
  quantity: number;
  image?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  deliveryMethod: 'pickup' | 'delivery';
  address: string;
  paymentMethod: 'cash' | 'transfer';
  cashAmount: string; // Con cuánto va a pagar para calcular cambio
  notes: string;
}
