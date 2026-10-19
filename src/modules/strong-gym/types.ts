// ── Tipos Oficiales: Strong Gym Iron City ─────────────────────────────────────
// Menú y Catálogo Digital Interactivo con Carrito de 2 Pasos y Pedido a WhatsApp

export type GymCategoryId =
  | 'todos'
  | 'ofertas-mes'
  | 'membresias'
  | 'shakes-barra'
  | 'proteinas'
  | 'creatinas-fuerza'
  | 'pre-entrenos'
  | 'aminoacidos-salud'
  | 'gear-accesorios';

export interface SizeOption {
  id: string;
  label: string; // ej. '2 lbs (907g)' | '5 lbs (2.27kg)' | '1 Mes' | '1 Litro'
  price: number;
  originalPrice?: number; // Para mostrar descuento tachado
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
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Precio regular tachado para ofertas especiales
  discountBadge?: string; // ej. '-20%', 'AHORRA $350'
  category: GymCategoryId;
  image?: string;
  featured?: boolean;
  isMonthlyOffer?: boolean; // Destacado en carrusel de Ofertas del Mes
  badge?: 'mas-vendido' | 'recomendado' | 'promo' | 'barra-shake' | 'nuevo' | 'oferta';
  badgeText?: string;
  sizes?: SizeOption[];
  variants?: VariantOption[]; // Sabores o presentaciones
  variantTitle?: string; // ej. 'Elige el Sabor', 'Elige tu Disciplina'
  extras?: ExtraOption[]; // Extras en barra de shakes (scoop extra, avena, crema cacahuate)
  isCustomizable?: boolean;
  servingInfo?: string; // ej. '24g Proteína · 5.5g BCAAs', '30 Servicios'
}

export interface CartItem {
  lineId: string;
  productId: string;
  name: string;
  category: GymCategoryId;
  detail: string; // Resumen legible de sabor, tamaño, extras
  unitPrice: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  deliveryMethod: 'recepcion' | 'pickup' | 'delivery';
  address: string; // Área del gym (ej. Pesas piso 1, Spinning) o dirección para envío
  paymentMethod: 'cash' | 'transfer' | 'terminal';
  cashAmount: string; // Con cuánto paga para cambio
  notes: string;
}
