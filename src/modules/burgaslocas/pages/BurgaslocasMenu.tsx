// ═══════════════════════════════════════════════════════════════════════════
// BURGASLOCAS AL CARBÓN Y SNACKS — Menú Digital Interactivo de Alta Gama
// Hamburguesas al carbón 100% res artesanal, jocholocos, alitas, banderillas,
// costillas BBQ, boneless y snacks crujientes con salsa de habanero casera.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, X, ShoppingBag, Flame, Sparkles,
  Phone, MapPin, Clock, MessageCircle, ArrowUp, Shield,
  Copy, Check, Trash2, Landmark, Wallet, Store, Bike,
  Heart, CheckCircle2, ChevronRight, Award, Utensils,
  Share2, AlertCircle, Info, Star
} from 'lucide-react';
import { clientConfig, bankInfo } from '../config';

const C = clientConfig.colors;

// ── Tipos ──
type CategoryId =
  | 'todos'
  | 'paquetes'
  | 'hamburguesas'
  | 'hotdogs'
  | 'jocholocos'
  | 'alitas'
  | 'banderillas'
  | 'snacks'
  | 'costillas'
  | 'bebidas';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
  badge?: string;
  featured?: boolean;
  isPopular?: boolean;
  canCustomize?: boolean;
  customType?: 'burger' | 'hotdog' | 'alitas' | 'banderilla' | 'snack' | 'refresco' | 'paquete';
}

interface CustomOption {
  name: string;
  price: number;
}

interface CartItem {
  lineId: string;
  productId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  image: string;
  category: CategoryId;
  selectedSauce?: string;
  selectedFlavor?: string;
  extras?: CustomOption[];
  specialNotes?: string;
}

// ── Opciones de personalización ──
const EXTRAS_LIST: CustomOption[] = [
  { name: 'Tocino Crujiente', price: 8 },
  { name: 'Queso Manchego Gratinado', price: 8 },
  { name: 'Piña Asada', price: 8 },
  { name: 'Salchicha Extra', price: 8 },
  { name: 'Doritos Nachos Crujientes', price: 8 },
];

const SAUCES_BURGER = [
  'Con todo (Catsup, Mayo, Mostaza, Jalapeño)',
  'Con Salsa de Habanero Casera 🌶️ (¡Recomendada!)',
  'Con Jalapeños en vinagre',
  'Sin picante (Solo aderezos dulces)',
  'Solo verduras y aderezos',
];

const SAUCES_WINGS = [
  'Salsa Picosita de la Casa 🔥 (BBQ, Inglesa, Maggy, Tajín y Picante)',
  'Salsa BBQ al Carbón Tradicional',
  'Alitas Doradas al Carbón al Natural',
  'Bañadas en salsa con toque de limón y tajín',
];

const FLAVORS_SODA = [
  'Coca Cola',
  'Pepsi',
  'Mirinda',
  '7up',
  'Manzanita',
  'Sangría',
  'Squirt'
];

// ── Catálogo oficial fiel al menú impreso ──
const PRODUCTS: Product[] = [
  // ── PAQUETES & COMBOS DE AHORRO ──
  {
    id: 'paq-burga',
    name: 'Paquete Burga Manchego y Tocino + Papas + Pepsi',
    description: 'Nuestra burga estrella con queso manchego y tocino crujiente, servida con generosa orden de papas a la francesa y Pepsi fría.',
    price: 118,
    category: 'paquetes',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    badge: '👑 Combo Más Vendido',
    featured: true,
    isPopular: true,
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'paq-loco',
    name: 'Paquete LOCO (Ideal para 2 personas)',
    description: 'El festín definitivo: 4 aros de cebolla, 2 minibanderillas de salchicha, papas gajo sazonadas, papas a la francesa, 4 alitas doradas, 4 costillas BBQ al carbón y 2 refrescos (excepto coca).',
    price: 265,
    category: 'paquetes',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    badge: '🔥 Súper Festín Duo',
    featured: true,
    isPopular: true,
    canCustomize: true,
    customType: 'paquete',
  },
  {
    id: 'paq-cookie',
    name: 'Paquete COOKIE',
    description: 'Para amantes de la carne: Orden completa de alitas + Orden completa de costillas BBQ al carbón + Papas a la francesa.',
    price: 268,
    category: 'paquetes',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80',
    badge: '⭐ Favorito Carnívoro',
    featured: true,
  },
  {
    id: 'paq-bey',
    name: 'Paquete BEY',
    description: 'La combinación perfecta: 1/2 orden de alitas, 1/2 orden de costillas al carbón y 1/2 orden de papas a la francesa.',
    price: 142,
    category: 'paquetes',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    badge: '⚡ Trío Perfecto',
  },

  // ── HAMBURGUESAS AL CARBÓN (100% Res Artesanal) ──
  {
    id: 'h-sencilla',
    name: 'Burga Sencilla',
    description: 'Carne artesanal 100% res al carbón, lechuga fresca, jitomate, cebolla, catsup, mayonesa y mostaza.',
    price: 56,
    category: 'hamburguesas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-amarillo',
    name: 'Burga con Queso Amarillo',
    description: 'Carne 100% res al carbón con abundante queso amarillo fundido al calor de las brasas.',
    price: 57,
    category: 'hamburguesas',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-amarillo-tocino',
    name: 'Burga con Queso Amarillo y Tocino',
    description: 'Carne de res al carbón, queso amarillo derretido y tiras de tocino ahumado crujiente.',
    price: 59,
    category: 'hamburguesas',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
    badge: 'Clásica Sabrosa',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-manchego-o-tocino',
    name: 'Burga con Queso Manchego o Tocino',
    description: 'Carne artesanal al carbón con tu elección de suave queso manchego gratinado o tocino dorado.',
    price: 58,
    category: 'hamburguesas',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-manchego-tocino',
    name: 'Burga con Queso Manchego y Tocino',
    description: 'Carne 100% res al carbón, queso manchego gratinado a la plancha y crujiente tocino ahumado.',
    price: 61,
    category: 'hamburguesas',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    badge: '⭐ La Más Pedida',
    isPopular: true,
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-doble-queso',
    name: 'Burga con Doble Queso',
    description: 'Para los auténticos queseros: carne al carbón con mezcla fundida de queso manchego y queso amarillo.',
    price: 61,
    category: 'hamburguesas',
    image: 'https://images.unsplash.com/photo-1583032015879-c5c994524458?auto=format&fit=crop&w=800&q=80',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-hawaii',
    name: 'Burga Hawaii',
    description: 'Carne artesanal al carbón, queso manchego fundido, tocino crujiente y piña asada caramelizada.',
    price: 66,
    category: 'hamburguesas',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
    badge: '🍍 Toque Dulce & Salado',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-mega',
    name: 'Mega Burga',
    description: 'Doble porción de carne 100% res artesanal al carbón, queso manchego gratinado y tocino crujiente.',
    price: 76,
    category: 'hamburguesas',
    image: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?auto=format&fit=crop&w=800&q=80',
    badge: '🥩 Doble Carne',
    isPopular: true,
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-super',
    name: 'Super Burga',
    description: '¡Puro poder! Doble carne de res al carbón, doble queso manchego gratinado y doble tocino crujiente.',
    price: 86,
    category: 'hamburguesas',
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=800&q=80',
    badge: '💥 Doble Todo',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-bestia',
    name: 'Bestia (La Máxima Creación)',
    description: '¡La joya de la casa! Doble carne artesanal 100% res al carbón, doble queso manchego, doble tocino crujiente, piña asada y salchicha.',
    price: 99,
    category: 'hamburguesas',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    badge: '👑 La Bestia del Carbón',
    featured: true,
    isPopular: true,
    canCustomize: true,
    customType: 'burger',
  },

  // ── HOTDOGS ──
  {
    id: 'hd-sencillo',
    name: 'Hotdog Sencillo',
    description: 'Pan suave al vapor con salchicha premium de pavo, jitomate, cebolla y aderezos.',
    price: 28,
    category: 'hotdogs',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
    canCustomize: true,
    customType: 'hotdog',
  },
  {
    id: 'hd-orden-sencillos',
    name: 'Orden de 3 Hotdogs Sencillos',
    description: 'Trío de hotdogs con salchicha premium de pavo preparados al momento con verdura y aderezos.',
    price: 76,
    category: 'hotdogs',
    image: 'https://images.unsplash.com/photo-1627059178491-443b7f87a8ad?auto=format&fit=crop&w=800&q=80',
    badge: '🌭 Trío Clásico',
    canCustomize: true,
    customType: 'hotdog',
  },
  {
    id: 'hd-tocino',
    name: 'Hotdog con Tocino',
    description: 'Salchicha premium de pavo enrollada en tocino ahumado doradito a la plancha.',
    price: 32,
    category: 'hotdogs',
    image: 'https://images.unsplash.com/photo-1627059312015-842410f7690f?auto=format&fit=crop&w=800&q=80',
    canCustomize: true,
    customType: 'hotdog',
  },
  {
    id: 'hd-orden-tocino',
    name: 'Orden de 3 Hotdogs con Tocino',
    description: '3 hotdogs con salchicha de pavo envuelta en tocino crujiente. ¡El antojo perfecto!',
    price: 91,
    category: 'hotdogs',
    image: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?auto=format&fit=crop&w=800&q=80',
    badge: '🥓 Trío con Tocino',
    canCustomize: true,
    customType: 'hotdog',
  },

  // ── JOCHOLOCOS (Con Doritos Nachos) ──
  {
    id: 'jl-sencillo',
    name: 'Jocholoco Sencillo',
    description: 'Carne jugosa, verduras frescas picadas, aderezos de la casa y crujientes Doritos Nachos triturados encima.',
    price: 60,
    category: 'jocholocos',
    image: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?auto=format&fit=crop&w=800&q=80',
    badge: '🧀 Crunch Doritos',
    canCustomize: true,
    customType: 'hotdog',
  },
  {
    id: 'jl-sencillo-papas',
    name: 'Jocholoco Sencillo con Papas a la Francesa',
    description: 'Jocholoco con carne, verduras, aderezos y Doritos Nachos acompañado de una generosa orden de papas fritas.',
    price: 84,
    category: 'jocholocos',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
    canCustomize: true,
    customType: 'hotdog',
  },
  {
    id: 'jl-especial',
    name: 'Jocholoco Especial',
    description: 'Carne, queso manchego derretido, tocino doradito, verduras, aderezos y la lluvia crujiente de Doritos Nachos.',
    price: 66,
    category: 'jocholocos',
    image: 'https://images.unsplash.com/photo-1627059178491-443b7f87a8ad?auto=format&fit=crop&w=800&q=80',
    badge: '⭐ El Más Loco',
    isPopular: true,
    canCustomize: true,
    customType: 'hotdog',
  },
  {
    id: 'jl-especial-papas',
    name: 'Jocholoco Especial con Papas a la Francesa',
    description: 'El combo completo: carne, manchego fundido, tocino crujiente, Doritos Nachos y papas a la francesa calientitas.',
    price: 90,
    category: 'jocholocos',
    image: 'https://images.unsplash.com/photo-1627059312015-842410f7690f?auto=format&fit=crop&w=800&q=80',
    badge: '🔥 Combo Jocholoco',
    canCustomize: true,
    customType: 'hotdog',
  },

  // ── ALITAS (¡Estrellas de la Casa!) ──
  {
    id: 'al-orden',
    name: 'Alitas de Pollo al Carbón',
    description: '¡Estrellas de la casa! Alitas crujientes doradas al fuego del carbón con la sazón secreta de Burgaslocas.',
    price: 80,
    category: 'alitas',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    badge: '⭐ Estrella de la Casa',
    isPopular: true,
    canCustomize: true,
    customType: 'alitas',
  },
  {
    id: 'al-con-papas',
    name: 'Alitas de Pollo con Papas a la Francesa',
    description: 'Orden de alitas doraditas al carbón servidas con papas a la francesa bien crujientes.',
    price: 104,
    category: 'alitas',
    image: 'https://images.unsplash.com/photo-1524182576066-1be9613770ec?auto=format&fit=crop&w=800&q=80',
    badge: '🍗 Alitas + Papas',
    canCustomize: true,
    customType: 'alitas',
  },
  {
    id: 'al-picositas',
    name: 'Alitas Picositas de la Casa',
    description: '¡Bañadas en salsa especial adictiva! Mezcla de salsa BBQ, inglesa, salsa Maggi, Tajín y chile picante.',
    price: 80,
    category: 'alitas',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80',
    badge: '🌶️🌶️🌶️ Súper Picositas',
    isPopular: true,
    canCustomize: true,
    customType: 'alitas',
  },

  // ── BANDERILLAS (¡Prueba lo Nuevo!) ──
  {
    id: 'ban-salchicha',
    name: 'Banderilla de Salchicha',
    description: 'Banderilla clásica con salchicha de res/pavo y cubierta dorada esponjosa y crujiente.',
    price: 30,
    category: 'banderillas',
    image: 'https://images.unsplash.com/photo-1627059178491-443b7f87a8ad?auto=format&fit=crop&w=800&q=80',
    canCustomize: true,
    customType: 'banderilla',
  },
  {
    id: 'ban-salchicha-papas',
    name: 'Banderilla de Salchicha con Papas',
    description: 'Banderilla clásica de salchicha servida con orden de papas a la francesa doradas.',
    price: 54,
    category: 'banderillas',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
    canCustomize: true,
    customType: 'banderilla',
  },
  {
    id: 'ban-combinada',
    name: 'Banderilla Combinada (Salchicha con Queso Gouda)',
    description: 'La mitad con salchicha premium y la mitad con delicioso queso gouda derretido.',
    price: 42,
    category: 'banderillas',
    image: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?auto=format&fit=crop&w=800&q=80',
    badge: '🧀 Salchicha + Gouda',
    canCustomize: true,
    customType: 'banderilla',
  },
  {
    id: 'ban-combinada-papas',
    name: 'Banderilla Combinada con Papas',
    description: 'Banderilla de salchicha con queso gouda acompañada de papas a la francesa.',
    price: 67,
    category: 'banderillas',
    image: 'https://images.unsplash.com/photo-1627059312015-842410f7690f?auto=format&fit=crop&w=800&q=80',
    canCustomize: true,
    customType: 'banderilla',
  },
  {
    id: 'ban-gouda-120g',
    name: 'Banderilla de Queso Gouda Puro (120 gr)',
    description: '¡Puro queso! 120 gramos de queso gouda cremoso que se estira con cada mordida.',
    price: 52,
    category: 'banderillas',
    image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=800&q=80',
    badge: '🧀 120g Gouda Puro',
    isPopular: true,
    canCustomize: true,
    customType: 'banderilla',
  },
  {
    id: 'ban-gouda-papas',
    name: 'Banderilla Queso Gouda con Papas',
    description: 'Banderilla de 120g de queso gouda derretido servida con papas a la francesa.',
    price: 76,
    category: 'banderillas',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    canCustomize: true,
    customType: 'banderilla',
  },
  {
    id: 'ban-cajeta',
    name: 'Banderilla de Queso con Cajeta',
    description: '¡El postre sorpresa! Banderilla de queso gouda bañada en dulce cajeta artesanal.',
    price: 58,
    category: 'banderillas',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    badge: '✨ Dulce & Salado',
  },

  // ── PAPAS & SNACKS CRUJIENTES ──
  {
    id: 'p-queso',
    name: 'Papas a la Francesa con Queso',
    description: 'Papas fritas crujientes bañadas en queso cheddar calientito y cremoso.',
    price: 50,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-queso-tajin',
    name: 'Papas a la Francesa con Queso y Tajín',
    description: 'Papas fritas con queso cheddar fundido y espolvoreadas con el toque acidito y picante de Tajín.',
    price: 51,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-extra-queso',
    name: 'Papas a la Francesa con Extra Queso',
    description: 'Doble ración de queso cheddar calientito para los verdaderos amantes del queso.',
    price: 53,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    badge: '🧀 Extra Cheddar',
  },
  {
    id: 'p-tocino-jalapeno',
    name: 'Papas con Tocino, Queso y Jalapeños',
    description: '¡Papas estilo Loaded! Bañadas en queso fundido, trocitos de tocino crujiente y rodajas de jalapeño.',
    price: 66,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    badge: '🔥 Loaded Fries',
    isPopular: true,
  },
  {
    id: 'p-doradas',
    name: 'Papas Fritas Bien Doradas',
    description: 'Orden clásica de papas fritas corte tradicional, sazonadas con sal y súper crujientes.',
    price: 56,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-salchipapas',
    name: 'Salchipapas',
    description: 'Generosa cama de papas a la francesa con rodajas de salchicha doradita, aderezos y queso.',
    price: 58,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    badge: 'Favorito Callejero',
  },
  {
    id: 'p-salchipulpos',
    name: 'Salchipulpos',
    description: 'Divertidos pulpitos de salchicha doraditos al punto, crujientes en las puntas con salsa y aderezos.',
    price: 44,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-gajo',
    name: 'Papas Gajo Sazonadas',
    description: 'Gajos de papa con piel doraditos con paprika y especias, suaves por dentro y crujientes por fuera.',
    price: 61,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-aros-cebolla',
    name: 'Aros de Cebolla',
    description: 'Aros de cebolla fresca capeados con rebozado crujiente estilo americano.',
    price: 39,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1639024471287-032f66e5f39e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p-palomita-pollo',
    name: 'Palomita Premium de Pollo con Papas',
    description: 'Bocados crujientes de pechuga de pollo empanizada estilo popcorn, servidos con papas a la francesa.',
    price: 96,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    badge: '🍗 100% Pechuga',
  },
  {
    id: 'p-dedos-queso',
    name: 'Dedos de Queso Mozzarella',
    description: 'Dedos de queso mozzarella empanizados con hierbas italianas, doraditos y con centro derretido.',
    price: 84,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=800&q=80',
    badge: '🧀 Queso Fundido',
  },
  {
    id: 'p-boneless-10',
    name: 'Boneless de Pollo (10 pz)',
    description: '10 piezas de tierna pechuga empanizada y bañada en salsa BBQ o Salsa Picosita al gusto.',
    price: 120,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1527477378708-0ca055c832f7?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    canCustomize: true,
    customType: 'alitas',
  },
  {
    id: 'p-boneless-papas',
    name: 'Boneless con Papas a la Francesa (10 pz)',
    description: '10 jugosos boneless bañados en salsa acompañados de papas a la francesa bien crujientes.',
    price: 130,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
    badge: '👑 Boneless + Papas',
    canCustomize: true,
    customType: 'alitas',
  },

  // ── COSTILLAS AL CARBÓN ──
  {
    id: 'cost-bbq',
    name: 'Costillas BBQ al Carbón con Papas (Orden)',
    description: 'Tiernas costillitas glaseadas en salsa BBQ artesanal ahumada al carbón, servidas con papas a la francesa.',
    price: 152,
    category: 'costillas',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    badge: '🔥 Al Carbón BBQ',
    featured: true,
    isPopular: true,
  },

  // ── BEBIDAS & REFRESCOS ──
  {
    id: 'refresco-355',
    name: 'Refresco 355 ml (Lata o Botella)',
    description: 'Bien frío: Coca Cola, Pepsi, Mirinda, 7up, Manzanita, Sangría Señorial o Squirt.',
    price: 25,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    canCustomize: true,
    customType: 'refresco',
  },
];

// ── Categorías con iconos y badges ──
const CATEGORIES: { id: CategoryId; name: string; icon: string; count: number }[] = [
  { id: 'todos', name: 'Todo el Menú', icon: '🍔', count: PRODUCTS.length },
  { id: 'paquetes', name: 'Paquetes y Combos', icon: '👑', count: 4 },
  { id: 'hamburguesas', name: 'Burgas al Carbón', icon: '🔥', count: 10 },
  { id: 'hotdogs', name: 'Hotdogs', icon: '🌭', count: 4 },
  { id: 'jocholocos', name: 'Jocholocos Doritos', icon: '🧀', count: 4 },
  { id: 'alitas', name: 'Alitas de la Casa', icon: '🍗', count: 3 },
  { id: 'banderillas', name: 'Banderillas Gouda', icon: '✨', count: 7 },
  { id: 'snacks', name: 'Papas y Snacks', icon: '🍟', count: 13 },
  { id: 'costillas', name: 'Costillas BBQ', icon: '🥩', count: 1 },
  { id: 'bebidas', name: 'Refrescos', icon: '🥤', count: 1 },
];

export default function BurgaslocasMenu() {
  // ── Estados Principales ──
  const [activeCategory, setActiveCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<1 | 2 | 3>(1); // 1: productos, 2: datos, 3: éxito
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('burgaslocas_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('burgaslocas_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Personalización de Producto Modal ──
  const [modalSauce, setModalSauce] = useState(SAUCES_BURGER[0]);
  const [modalWingsSauce, setModalWingsSauce] = useState(SAUCES_WINGS[0]);
  const [modalFlavor, setModalFlavor] = useState(FLAVORS_SODA[0]);
  const [modalExtras, setModalExtras] = useState<CustomOption[]>([]);
  const [modalNotes, setModalNotes] = useState('');
  const [modalQuantity, setModalQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ── Datos de Pedido (Checkout Paso 2) ──
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'delivery' as 'delivery' | 'pickup',
    address: '',
    neighborhood: '',
    references: '',
    paymentMethod: 'cash' as 'cash' | 'transfer',
    cashAmount: '',
    orderNotes: '',
    targetWhatsApp: clientConfig.phonePrimary, // teléfono de destino (55 3103 3338 o 55 5137 5689)
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ── Persistencia Local ──
  useEffect(() => {
    try {
      localStorage.setItem('burgaslocas_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('burgaslocas_favs', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Toast Helper ──
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Manejo de Favoritos ──
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ── Abrir Modal de Producto ──
  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalSauce(SAUCES_BURGER[0]);
    setModalWingsSauce(SAUCES_WINGS[0]);
    setModalFlavor(FLAVORS_SODA[0]);
    setModalExtras([]);
    setModalNotes('');
    setModalQuantity(1);
  };

  // ── Agregar al Carrito desde el Modal ──
  const handleAddToCartFromModal = () => {
    if (!selectedProduct) return;

    const extrasTotal = modalExtras.reduce((acc, curr) => acc + curr.price, 0);
    const unitPrice = selectedProduct.price + extrasTotal;

    const lineId = `${selectedProduct.id}-${modalSauce}-${modalWingsSauce}-${modalFlavor}-${modalExtras.map(e => e.name).sort().join(',')}-${Date.now()}`;

    const newItem: CartItem = {
      lineId,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      basePrice: selectedProduct.price,
      unitPrice,
      quantity: modalQuantity,
      image: selectedProduct.image,
      category: selectedProduct.category,
      selectedSauce:
        selectedProduct.category === 'hamburguesas' || selectedProduct.category === 'paquetes'
          ? modalSauce
          : selectedProduct.category === 'alitas'
          ? modalWingsSauce
          : undefined,
      selectedFlavor: selectedProduct.category === 'bebidas' ? modalFlavor : undefined,
      extras: modalExtras.length > 0 ? modalExtras : undefined,
      specialNotes: modalNotes.trim() || undefined,
    };

    setCart((prev) => [...prev, newItem]);
    setSelectedProduct(null);
    showToast(`¡${selectedProduct.name} agregada al carrito! 🛒`);
  };

  // ── Agregar directo desde la card (rápido) ──
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.canCustomize) {
      handleOpenProduct(product);
      return;
    }
    const lineId = `${product.id}-${Date.now()}`;
    const newItem: CartItem = {
      lineId,
      productId: product.id,
      name: product.name,
      basePrice: product.price,
      unitPrice: product.price,
      quantity: 1,
      image: product.image,
      category: product.category,
    };
    setCart((prev) => [...prev, newItem]);
    showToast(`¡${product.name} agregada! 🍔`);
  };

  // ── Modificar Cantidades en Carrito ──
  const updateQuantity = (lineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.lineId === lineId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (lineId: string) => {
    setCart((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  // ── Cálculos de Carrito ──
  const totalItemsCount = useMemo(
    () => cart.reduce((acc, curr) => acc + curr.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0),
    [cart]
  );

  const deliveryCost = customerInfo.deliveryMethod === 'delivery' ? 25 : 0;
  const cartTotal = cartSubtotal + deliveryCost;

  // Cálculo del cambio en efectivo
  const cashGiven = parseFloat(customerInfo.cashAmount) || 0;
  const cashChange = cashGiven >= cartTotal ? cashGiven - cartTotal : 0;

  // ── Filtro de Productos ──
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = activeCategory === 'todos' || p.category === activeCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // ── Validación de Formulario (Paso 2) ──
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!customerInfo.name.trim()) errors.name = 'Tu nombre es obligatorio';
    if (!customerInfo.phone.trim()) errors.phone = 'Tu teléfono / WhatsApp es obligatorio';
    if (customerInfo.deliveryMethod === 'delivery') {
      if (!customerInfo.address.trim()) errors.address = 'Dirección (calle y número) obligatoria';
      if (!customerInfo.neighborhood.trim()) errors.neighborhood = 'Colonia obligatoria';
    }
    if (customerInfo.paymentMethod === 'cash') {
      if (customerInfo.cashAmount && cashGiven < cartTotal) {
        errors.cashAmount = `El monto debe ser al menos de $${cartTotal}`;
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Finalización del Pedido por WhatsApp (500ms + window.location.href) ──
  const handleCheckoutWhatsApp = () => {
    if (!validateForm()) return;

    setCartStep(3); // Mostrar pantalla de éxito

    // Construcción del mensaje elegante para cocina
    let msg = `🔥 *¡NUEVO PEDIDO — BURGASLOCAS AL CARBÓN!* 🔥\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Cliente:* ${customerInfo.name.trim()}\n`;
    msg += `📱 *Teléfono:* ${customerInfo.phone.trim()}\n`;
    msg += `🛵 *Entrega:* ${
      customerInfo.deliveryMethod === 'delivery'
        ? 'SERVICIO A DOMICILIO'
        : 'RECOGER EN LOCAL (Para Llevar)'
    }\n`;

    if (customerInfo.deliveryMethod === 'delivery') {
      msg += `📍 *Dirección:* ${customerInfo.address.trim()}\n`;
      msg += `🏘️ *Colonia:* ${customerInfo.neighborhood.trim()}\n`;
      if (customerInfo.references.trim()) {
        msg += `🧭 *Referencias:* ${customerInfo.references.trim()}\n`;
      }
    }

    msg += `💳 *Forma de Pago:* ${
      customerInfo.paymentMethod === 'cash' ? 'EFECTIVO' : 'TRANSFERENCIA BANCARIA (BBVA)'
    }\n`;

    if (customerInfo.paymentMethod === 'cash' && cashGiven > 0) {
      msg += `💵 *Paga con:* $${cashGiven} (Cambio: $${cashChange})\n`;
    }

    if (customerInfo.orderNotes.trim()) {
      msg += `📝 *Notas de Cocina:* ${customerInfo.orderNotes.trim()}\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🍔 *DETALLE DEL PEDIDO:*\n\n`;

    cart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.quantity}x ${item.name}* — $${item.unitPrice * item.quantity}\n`;
      if (item.selectedSauce) {
        msg += `   • Salsa: ${item.selectedSauce}\n`;
      }
      if (item.selectedFlavor) {
        msg += `   • Sabor: ${item.selectedFlavor}\n`;
      }
      if (item.extras && item.extras.length > 0) {
        msg += `   • Extras: ${item.extras.map((e) => e.name).join(', ')}\n`;
      }
      if (item.specialNotes) {
        msg += `   • Nota: ${item.specialNotes}\n`;
      }
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Subtotal alimentos: $${cartSubtotal}\n`;
    if (customerInfo.deliveryMethod === 'delivery') {
      msg += `Costo de envío aprox: $${deliveryCost}\n`;
    }
    msg += `💰 *TOTAL A PAGAR: $${cartTotal} MXN*\n\n`;
    msg += `¡Muchas gracias! Espero confirmación del pedido y tiempo estimado de entrega. 🚀`;

    const encodedMsg = encodeURIComponent(msg);
    const targetPhone = customerInfo.targetWhatsApp || clientConfig.phonePrimary;
    const waUrl = `https://wa.me/${targetPhone}?text=${encodedMsg}`;

    // Regla obligatoria: delay 500ms y redirección directa para evitar bloqueos in-app
    setTimeout(() => {
      window.location.href = waUrl;
      // Limpiar carrito y cerrar modal tras abrir WhatsApp
      setCart([]);
      setTimeout(() => {
        setIsCartOpen(false);
        setCartStep(1);
      }, 2000);
    }, 600);
  };

  const copyClabe = () => {
    navigator.clipboard.writeText(bankInfo.clabe.replace(/\s+/g, ''));
    setCopiedClabe(true);
    setTimeout(() => setCopiedClabe(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0E0D0C] text-[#F3F1EF] font-sans selection:bg-[#FF381E] selection:text-white relative pb-28">
      {/* ── HEADER / TOP BAR DECORATIVA CON FLAMAS ── */}
      <div className="sticky top-0 z-40 bg-[#161311]/90 backdrop-blur-md border-b border-orange-500/20 shadow-xl shadow-black/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF1493] via-[#FF381E] to-[#FF7A00] p-0.5 shadow-lg shadow-orange-600/30 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-[#12100E] rounded-[14px] flex items-center justify-center text-xl">
                🍔
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg md:text-xl tracking-tight text-white uppercase flex items-center gap-1">
                  Burgas<span className="text-[#FF1493]">locas</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Al Carbón
                </span>
              </div>
              <p className="text-xs text-orange-200/60 hidden sm:block">
                Carne 100% Res Artesanal · Sabor a las Brasas
              </p>
            </div>
          </div>

          {/* Botones de acción Header */}
          <div className="flex items-center gap-2">
            {/* Teléfonos directos */}
            <a
              href={`https://wa.me/${clientConfig.phonePrimary}`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
            >
              <Phone size={13} />
              <span>{clientConfig.phonePrimaryFormatted}</span>
            </a>

            {/* Carrito Header */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsCartOpen(true);
                setCartStep(1);
              }}
              className="relative flex items-center gap-2 bg-gradient-to-r from-[#FF381E] to-[#FF7A00] hover:from-[#FF4E36] hover:to-[#FF8C1A] text-white px-4 py-2 rounded-2xl font-black text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Ver Pedido</span>
              {totalItemsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#FF381E] text-xs font-black flex items-center justify-center shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── HERO BANNER: HAMBURGUESAS AL CARBÓN & OFERTAS ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1C1613] via-[#14110F] to-[#0E0D0C] border-b border-orange-500/15 py-8 md:py-12">
        {/* Glows de fuego de fondo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            {/* Columna Texto */}
            <div className="md:col-span-7 text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-orange-500/40 text-orange-300 text-xs font-bold tracking-wide">
                <Flame size={14} className="text-[#FF381E] animate-pulse" />
                <span>¡AL CARBÓN SABEN MÁS RICAS!</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span>100% RES ARTESANAL</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-5xl font-black tracking-tight text-white uppercase leading-[1.1]">
                Sabor Callejero <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] via-[#FFB800] to-[#FF1493]">
                  a la Brasa & Snacks
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#D4CDC7] max-w-xl mx-auto md:mx-0 font-medium">
                Hamburguesas artesanales preparadas al carbón, jocholocos con Doritos Nachos, alitas picositas, banderillas de queso gouda y costillas BBQ.
              </p>

              {/* Badges de confianza */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-white/90">
                  <Award size={14} className="text-amber-400" /> Carne 100% Res
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-white/90">
                  <Flame size={14} className="text-red-400" /> Fuego al Carbón
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-white/90">
                  <Bike size={14} className="text-emerald-400" /> Envío a Domicilio
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300">
                  🌶️ Salsa Habanero Casera
                </span>
              </div>

              {/* Teléfonos para pedidos */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                  Pedidos WhatsApp:
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${clientConfig.phonePrimary}?text=Hola%20Burgaslocas!%20Quiero%20hacer%20un%20pedido`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-black hover:bg-[#25D366]/30 transition-colors"
                  >
                    <MessageCircle size={14} /> {clientConfig.phonePrimaryFormatted}
                  </a>
                  <a
                    href={`https://wa.me/${clientConfig.phoneSecondary}?text=Hola%20Burgaslocas!%20Quiero%20hacer%20un%20pedido`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-black hover:bg-[#25D366]/30 transition-colors"
                  >
                    <MessageCircle size={14} /> {clientConfig.phoneSecondaryFormatted}
                  </a>
                </div>
              </div>
            </div>

            {/* Columna Tarjeta Promo Hero (CRO Combo Estrella) */}
            <div className="md:col-span-5">
              <div className="relative rounded-3xl p-1 bg-gradient-to-br from-amber-500/40 via-red-500/30 to-pink-500/20 shadow-2xl shadow-orange-950/50">
                <div className="bg-[#181412] rounded-[22px] p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles size={11} /> COMBO RECOMENDADO
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Ahorra $22
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=400&q=80"
                      alt="Combo Burga"
                      className="w-20 h-20 rounded-2xl object-cover border border-amber-500/30 shadow-md shrink-0"
                    />
                    <div className="min-w-0">
                      <h2 className="text-base font-black text-white uppercase leading-tight">
                        Paquete Burga + Papas + Pepsi
                      </h2>
                      <p className="text-xs text-stone-400 line-clamp-2 mt-0.5">
                        Burga queso manchego y tocino crujiente, papas doradas y refresco frío.
                      </p>
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#FFB800]">$118</span>
                        <span className="text-xs text-stone-500 line-through">$140</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const p = PRODUCTS.find((x) => x.id === 'paq-burga');
                      if (p) handleOpenProduct(p);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF381E] to-[#FF7A00] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-orange-900/40 cursor-pointer"
                  >
                    <Plus size={16} /> Pedir este paquete ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BANNER DESTACADO DE CREPAS & SALSAS ── */}
      <div className="bg-gradient-to-r from-[#1B1714] via-[#2A1F1A] to-[#1B1714] border-b border-white/5 py-2.5 px-4 text-center text-xs font-semibold text-stone-300">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <span className="flex items-center gap-1.5 text-amber-300 font-bold">
            🌶️ <span>¡Pide gratis nuestra salsa de habanero casera con tu pedido!</span>
          </span>
          <span className="hidden sm:inline text-stone-600">•</span>
          <span className="flex items-center gap-1.5 text-pink-300">
            🥞 <span>¿Antojo dulce? Pregunta por nuestras crepas dulces y saladas</span>
          </span>
        </div>
      </div>

      {/* ── BUSCADOR Y SELECTOR DE CATEGORÍAS ── */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Barra de Búsqueda */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar hamburguesa, alitas, jocholocos, banderillas, boneless..."
            className="w-full bg-[#181513] border border-stone-800 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Scroll Horizontal de Categorías */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF381E] to-[#FF7A00] text-white shadow-lg shadow-orange-700/30 scale-105'
                    : 'bg-[#181513] text-stone-400 hover:text-white border border-stone-800/80 hover:border-stone-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/30 text-white' : 'bg-stone-800 text-stone-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GRID DE PRODUCTOS ── */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#161311] rounded-3xl border border-stone-800 p-6">
            <span className="text-4xl mb-3 block">🔍</span>
            <h3 className="text-lg font-bold text-white mb-1">No encontramos ese antojo</h3>
            <p className="text-xs text-stone-400 mb-4">
              Prueba buscando por "burga", "jocholoco", "alitas" o borra el filtro.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('todos');
              }}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold"
            >
              Ver todo el menú
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredProducts.map((product) => {
              const isFav = favorites.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => handleOpenProduct(product)}
                  className="group bg-[#161311] hover:bg-[#1C1815] border border-stone-800/80 hover:border-orange-500/40 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-orange-950/30 cursor-pointer relative"
                >
                  {/* Imagen y Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-transparent to-black/30" />

                    {/* Badge de Producto */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-[#FF1493] via-[#FF381E] to-[#FF7A00] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                        {product.badge}
                      </div>
                    )}

                    {/* Botón Favorito */}
                    <button
                      onClick={(e) => toggleFavorite(product.id, e)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                        isFav
                          ? 'bg-red-500/90 text-white'
                          : 'bg-black/50 text-stone-300 hover:text-white'
                      }`}
                    >
                      <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
                    </button>

                    {/* Precio flotante en la imagen */}
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-2xl border border-amber-500/30 text-[#FFB800] font-black text-lg shadow-md">
                      ${product.price}
                    </div>
                  </div>

                  {/* Contenido de la Tarjeta */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-[#FFB800] transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-orange-400/90 flex items-center gap-1">
                        <Flame size={13} /> {product.canCustomize ? 'Personalizable' : 'Preparado al momento'}
                      </span>

                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF381E] to-[#FF7A00] text-white font-bold text-xs shadow-md shadow-orange-900/30 hover:brightness-110 active:scale-95 transition-all"
                      >
                        <Plus size={15} /> Agregar
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL DE PERSONALIZACIÓN DEL PRODUCTO (Bottom Sheet Móvil / Centrado Desktop) ── */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#181513] border border-stone-800 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header Modal */}
              <div className="relative h-44 sm:h-52 w-full bg-stone-900 shrink-0">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181513] via-black/40 to-transparent" />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="absolute bottom-3 left-4 right-4">
                  {selectedProduct.badge && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF381E] text-white inline-block mb-1">
                      {selectedProduct.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-black text-white leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-sm font-black text-[#FFB800] mt-0.5">
                    Precio base: ${selectedProduct.price} MXN
                  </p>
                </div>
              </div>

              {/* Cuerpo del Modal con Scroll */}
              <div className="p-5 overflow-y-auto space-y-5 text-sm">
                <p className="text-stone-300 text-xs leading-relaxed bg-stone-900/60 p-3 rounded-xl border border-stone-800">
                  {selectedProduct.description}
                </p>

                {/* 1. Selector de Salsa para Hamburguesas y Paquetes */}
                {(selectedProduct.category === 'hamburguesas' || selectedProduct.category === 'paquetes') && (
                  <div>
                    <label className="block text-xs font-black uppercase text-orange-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <Flame size={14} /> Elige tu salsa y aderezos:
                    </label>
                    <div className="space-y-2">
                      {SAUCES_BURGER.map((sauce) => (
                        <label
                          key={sauce}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            modalSauce === sauce
                              ? 'bg-orange-500/15 border-orange-500 text-white'
                              : 'bg-stone-900/40 border-stone-800 text-stone-400 hover:border-stone-700'
                          }`}
                        >
                          <span className="text-xs font-medium">{sauce}</span>
                          <input
                            type="radio"
                            name="burgerSauce"
                            checked={modalSauce === sauce}
                            onChange={() => setModalSauce(sauce)}
                            className="text-orange-500 focus:ring-0"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Selector de Salsa para Alitas y Boneless */}
                {selectedProduct.category === 'alitas' && (
                  <div>
                    <label className="block text-xs font-black uppercase text-orange-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <Flame size={14} /> Elige la salsa para tus alitas:
                    </label>
                    <div className="space-y-2">
                      {SAUCES_WINGS.map((sauce) => (
                        <label
                          key={sauce}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            modalWingsSauce === sauce
                              ? 'bg-orange-500/15 border-orange-500 text-white'
                              : 'bg-stone-900/40 border-stone-800 text-stone-400 hover:border-stone-700'
                          }`}
                        >
                          <span className="text-xs font-medium">{sauce}</span>
                          <input
                            type="radio"
                            name="wingsSauce"
                            checked={modalWingsSauce === sauce}
                            onChange={() => setModalWingsSauce(sauce)}
                            className="text-orange-500 focus:ring-0"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Selector de Sabor para Refrescos */}
                {selectedProduct.category === 'bebidas' && (
                  <div>
                    <label className="block text-xs font-black uppercase text-orange-400 tracking-wider mb-2">
                      Selecciona el sabor de tu refresco (355ml):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {FLAVORS_SODA.map((flavor) => (
                        <button
                          key={flavor}
                          type="button"
                          onClick={() => setModalFlavor(flavor)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                            modalFlavor === flavor
                              ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                              : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          {flavor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Ingredientes Extras (Hotdogs, Hamburguesas, Jochos: +$8 c/u) */}
                {(selectedProduct.category === 'hamburguesas' ||
                  selectedProduct.category === 'hotdogs' ||
                  selectedProduct.category === 'jocholocos' ||
                  selectedProduct.category === 'paquetes') && (
                  <div>
                    <label className="block text-xs font-black uppercase text-amber-400 tracking-wider mb-2 flex items-center justify-between">
                      <span>¿Deseas agregar ingredientes extra?</span>
                      <span className="text-[11px] font-bold text-stone-400">+$8 c/u</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {EXTRAS_LIST.map((extra) => {
                        const isSelected = modalExtras.some((e) => e.name === extra.name);
                        return (
                          <button
                            key={extra.name}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setModalExtras((prev) => prev.filter((e) => e.name !== extra.name));
                              } else {
                                setModalExtras((prev) => [...prev, extra]);
                              }
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500 text-white'
                                : 'bg-stone-900/40 border-stone-800 text-stone-400 hover:border-stone-700'
                            }`}
                          >
                            <span>+ {extra.name}</span>
                            <span className="text-amber-400 font-mono">+$8</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. Notas especiales para la cocina */}
                <div>
                  <label className="block text-xs font-black uppercase text-stone-400 tracking-wider mb-1.5">
                    Instrucciones especiales para cocina (opcional):
                  </label>
                  <input
                    type="text"
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    placeholder="Ej. Sin cebolla, papas bien doradas, salsa aparte..."
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Footer Modal: Cantidad y Agregar */}
              <div className="p-4 bg-[#14110F] border-t border-stone-800 flex items-center justify-between gap-4 shrink-0">
                {/* Selector Cantidad */}
                <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-2xl p-1">
                  <button
                    onClick={() => setModalQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-xl bg-stone-800 text-white flex items-center justify-center hover:bg-stone-700 cursor-pointer"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-6 text-center font-black text-sm text-white">
                    {modalQuantity}
                  </span>
                  <button
                    onClick={() => setModalQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-xl bg-stone-800 text-white flex items-center justify-center hover:bg-stone-700 cursor-pointer"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                {/* Botón Agregar */}
                <button
                  onClick={handleAddToCartFromModal}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF381E] to-[#FF7A00] text-white font-black text-sm uppercase tracking-wide flex items-center justify-between shadow-lg shadow-orange-950/50 hover:brightness-110 cursor-pointer"
                >
                  <span>Agregar al Pedido</span>
                  <span className="font-mono">
                    $
                    {(selectedProduct.price +
                      modalExtras.reduce((a, b) => a + b.price, 0)) *
                      modalQuantity}{' '}
                    MXN
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DRAWER LATERAL / MODAL DEL CARRITO DE 2 PASOS ── */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-md bg-[#161311] border-l border-stone-800 h-full flex flex-col shadow-2xl text-stone-200"
            >
              {/* Header Carrito */}
              <div className="p-4 bg-[#14110F] border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-orange-500" />
                  <h3 className="font-black text-base uppercase text-white tracking-wide">
                    {cartStep === 1
                      ? 'Tu Pedido'
                      : cartStep === 2
                      ? 'Datos de Entrega'
                      : '¡Pedido Generado!'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* ── PASO 1: LISTA DE PRODUCTOS ── */}
              {cartStep === 1 && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      <span className="text-5xl mb-3">🍔</span>
                      <h4 className="font-black text-lg text-white mb-1">Tu carrito está vacío</h4>
                      <p className="text-xs text-stone-400 mb-6">
                        Agrega hamburguesas al carbón, alitas, jocholocos o papas doradas para armar tu pedido.
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF381E] to-[#FF7A00] text-white font-bold text-xs uppercase cursor-pointer"
                      >
                        Explorar Menú
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {cart.map((item) => (
                          <div
                            key={item.lineId}
                            className="bg-[#1C1815] border border-stone-800 rounded-2xl p-3 flex gap-3 items-center justify-between"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-xl object-cover border border-stone-800 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs text-white truncate">
                                {item.name}
                              </h4>
                              {item.selectedSauce && (
                                <p className="text-[10px] text-orange-400/90 truncate">
                                  {item.selectedSauce}
                                </p>
                              )}
                              {item.selectedFlavor && (
                                <p className="text-[10px] text-orange-400/90">
                                  Sabor: {item.selectedFlavor}
                                </p>
                              )}
                              {item.extras && item.extras.length > 0 && (
                                <p className="text-[10px] text-amber-300/80 truncate">
                                  Extras: {item.extras.map((e) => e.name).join(', ')}
                                </p>
                              )}
                              <p className="text-xs font-black text-[#FFB800] mt-1">
                                ${item.unitPrice * item.quantity} MXN
                              </p>
                            </div>

                            {/* Controles de cantidad */}
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-lg p-0.5">
                                <button
                                  onClick={() => updateQuantity(item.lineId, -1)}
                                  className="w-6 h-6 rounded bg-stone-800 text-white flex items-center justify-center hover:bg-stone-700 cursor-pointer"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-5 text-center text-xs font-bold text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.lineId, 1)}
                                  className="w-6 h-6 rounded bg-stone-800 text-white flex items-center justify-center hover:bg-stone-700 cursor-pointer"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.lineId)}
                                className="text-stone-500 hover:text-red-400 text-[10px] flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={11} /> Quitar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Subtotal y Botón Pasar a Datos */}
                      <div className="p-4 bg-[#14110F] border-t border-stone-800 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-stone-400">Subtotal alimentos:</span>
                          <span className="font-mono font-bold text-white text-base">
                            ${cartSubtotal} MXN
                          </span>
                        </div>
                        <button
                          onClick={() => setCartStep(2)}
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF381E] to-[#FF7A00] text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 hover:brightness-110 cursor-pointer"
                        >
                          <span>Continuar con Datos de Entrega</span>
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── PASO 2: DATOS DEL CLIENTE, ENTREGA Y PAGO ── */}
              {cartStep === 2 && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                    {/* Botón Volver */}
                    <button
                      onClick={() => setCartStep(1)}
                      className="text-stone-400 hover:text-white text-xs flex items-center gap-1 font-bold mb-2 cursor-pointer"
                    >
                      ← Volver a editar productos
                    </button>

                    {/* Nombre */}
                    <div>
                      <label className="block text-stone-300 font-bold mb-1">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, name: e.target.value })
                        }
                        placeholder="Ej. Carlos Mendoza"
                        className="w-full bg-[#1C1815] border border-stone-800 rounded-xl px-3 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-orange-500"
                      />
                      {formErrors.name && (
                        <p className="text-red-400 text-[11px] mt-0.5">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Teléfono / WhatsApp */}
                    <div>
                      <label className="block text-stone-300 font-bold mb-1">
                        Teléfono / WhatsApp de Contacto *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
                        placeholder="Ej. 55 1234 5678"
                        className="w-full bg-[#1C1815] border border-stone-800 rounded-xl px-3 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-orange-500"
                      />
                      {formErrors.phone && (
                        <p className="text-red-400 text-[11px] mt-0.5">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Selector de WhatsApp de Destino (CRO / 2 líneas de WhatsApp) */}
                    <div>
                      <label className="block text-stone-300 font-bold mb-1">
                        Enviar pedido al número de WhatsApp:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setCustomerInfo({
                              ...customerInfo,
                              targetWhatsApp: clientConfig.phonePrimary,
                            })
                          }
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            customerInfo.targetWhatsApp === clientConfig.phonePrimary
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-stone-900/50 border-stone-800 text-stone-400'
                          }`}
                        >
                          <span className="block text-[11px]">Línea 1</span>
                          <span className="font-mono text-xs">
                            {clientConfig.phonePrimaryFormatted}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCustomerInfo({
                              ...customerInfo,
                              targetWhatsApp: clientConfig.phoneSecondary,
                            })
                          }
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            customerInfo.targetWhatsApp === clientConfig.phoneSecondary
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-stone-900/50 border-stone-800 text-stone-400'
                          }`}
                        >
                          <span className="block text-[11px]">Línea 2</span>
                          <span className="font-mono text-xs">
                            {clientConfig.phoneSecondaryFormatted}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Método de Entrega */}
                    <div>
                      <label className="block text-stone-300 font-bold mb-1">
                        Método de Entrega *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setCustomerInfo({ ...customerInfo, deliveryMethod: 'delivery' })
                          }
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            customerInfo.deliveryMethod === 'delivery'
                              ? 'bg-orange-500/20 border-orange-500 text-white font-bold'
                              : 'bg-stone-900/40 border-stone-800 text-stone-400'
                          }`}
                        >
                          <Bike size={18} className="text-orange-400" />
                          <span>A Domicilio</span>
                          <span className="text-[10px] text-stone-400">+$25 aprox</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setCustomerInfo({ ...customerInfo, deliveryMethod: 'pickup' })
                          }
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            customerInfo.deliveryMethod === 'pickup'
                              ? 'bg-orange-500/20 border-orange-500 text-white font-bold'
                              : 'bg-stone-900/40 border-stone-800 text-stone-400'
                          }`}
                        >
                          <Store size={18} className="text-emerald-400" />
                          <span>Para Llevar</span>
                          <span className="text-[10px] text-emerald-400 font-bold">Sin costo</span>
                        </button>
                      </div>
                    </div>

                    {/* Dirección obligatoria si es a domicilio */}
                    {customerInfo.deliveryMethod === 'delivery' && (
                      <div className="space-y-3 p-3 bg-stone-900/40 rounded-2xl border border-stone-800/80">
                        <div>
                          <label className="block text-stone-300 font-bold mb-1">
                            Calle y Número Exterior / Interior *
                          </label>
                          <input
                            type="text"
                            value={customerInfo.address}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, address: e.target.value })
                            }
                            placeholder="Ej. Av. Cuauhtémoc #145 Int. 3"
                            className="w-full bg-[#161311] border border-stone-800 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-orange-500"
                          />
                          {formErrors.address && (
                            <p className="text-red-400 text-[11px] mt-0.5">
                              {formErrors.address}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-stone-300 font-bold mb-1">Colonia *</label>
                          <input
                            type="text"
                            value={customerInfo.neighborhood}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, neighborhood: e.target.value })
                            }
                            placeholder="Ej. Centro / San Juan"
                            className="w-full bg-[#161311] border border-stone-800 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-orange-500"
                          />
                          {formErrors.neighborhood && (
                            <p className="text-red-400 text-[11px] mt-0.5">
                              {formErrors.neighborhood}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-stone-300 font-bold mb-1">
                            Referencias (fachada, entre calles, timbre):
                          </label>
                          <input
                            type="text"
                            value={customerInfo.references}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, references: e.target.value })
                            }
                            placeholder="Ej. Portón negro frente a la tienda"
                            className="w-full bg-[#161311] border border-stone-800 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Forma de Pago */}
                    <div>
                      <label className="block text-stone-300 font-bold mb-1">
                        Forma de Pago *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setCustomerInfo({ ...customerInfo, paymentMethod: 'cash' })
                          }
                          className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            customerInfo.paymentMethod === 'cash'
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-stone-900/40 border-stone-800 text-stone-400'
                          }`}
                        >
                          <Wallet size={16} /> Efectivo
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCustomerInfo({ ...customerInfo, paymentMethod: 'transfer' })
                          }
                          className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            customerInfo.paymentMethod === 'transfer'
                              ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                              : 'bg-stone-900/40 border-stone-800 text-stone-400'
                          }`}
                        >
                          <Landmark size={16} /> Transferencia
                        </button>
                      </div>
                    </div>

                    {/* Si es Efectivo: Con cuánto paga y cambio */}
                    {customerInfo.paymentMethod === 'cash' && (
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-2">
                        <label className="block text-emerald-300 font-bold">
                          ¿Con cuánto vas a pagar? (Para llevarte cambio):
                        </label>
                        <input
                          type="number"
                          value={customerInfo.cashAmount}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })
                          }
                          placeholder={`Ej. $${Math.ceil(cartTotal / 100) * 100 || 200}`}
                          className="w-full bg-[#161311] border border-stone-800 rounded-xl px-3 py-2 text-white font-mono placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                        />
                        {cashGiven >= cartTotal && (
                          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 bg-emerald-900/30 p-2 rounded-lg">
                            <span>Cambio a devolverte:</span>
                            <span className="font-mono text-sm">${cashChange} MXN</span>
                          </div>
                        )}
                        {formErrors.cashAmount && (
                          <p className="text-red-400 text-[11px]">{formErrors.cashAmount}</p>
                        )}
                      </div>
                    )}

                    {/* Si es Transferencia: Datos bancarios */}
                    {customerInfo.paymentMethod === 'transfer' && (
                      <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-300 font-bold">Datos para Transferencia:</span>
                          <span className="text-[10px] bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded font-bold">
                            {bankInfo.bankName}
                          </span>
                        </div>
                        <div className="text-[11px] space-y-1 text-stone-300">
                          <p>
                            <span className="text-stone-500">Titular:</span> {bankInfo.accountHolder}
                          </p>
                          <div className="flex items-center justify-between bg-[#12100E] p-2 rounded-lg border border-stone-800">
                            <div>
                              <p className="text-[10px] text-stone-500">CLABE Interbancaria:</p>
                              <p className="font-mono font-bold text-white text-xs">
                                {bankInfo.clabe}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={copyClabe}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                            >
                              {copiedClabe ? <Check size={12} /> : <Copy size={12} />}
                              {copiedClabe ? 'Copiada' : 'Copiar'}
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-400 pt-1">
                            * Enviar comprobante de transferencia al chat de WhatsApp.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Notas para el pedido */}
                    <div>
                      <label className="block text-stone-300 font-bold mb-1">
                        Notas adicionales de entrega:
                      </label>
                      <input
                        type="text"
                        value={customerInfo.orderNotes}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, orderNotes: e.target.value })
                        }
                        placeholder="Ej. Tocar fuerte el timbre, servilletas extra..."
                        className="w-full bg-[#1C1815] border border-stone-800 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Resumen Total y Botón Enviar WhatsApp */}
                  <div className="p-4 bg-[#14110F] border-t border-stone-800 space-y-3">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-stone-400">
                        <span>Alimentos:</span>
                        <span className="font-mono">${cartSubtotal} MXN</span>
                      </div>
                      {customerInfo.deliveryMethod === 'delivery' && (
                        <div className="flex items-center justify-between text-stone-400">
                          <span>Envío a domicilio aprox:</span>
                          <span className="font-mono">+${deliveryCost} MXN</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm font-black text-white pt-1 border-t border-stone-800">
                        <span>Total a Pagar:</span>
                        <span className="font-mono text-base text-[#FFB800]">
                          ${cartTotal} MXN
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckoutWhatsApp}
                      className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
                    >
                      <MessageCircle size={18} />
                      <span>Enviar Pedido por WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── PASO 3: PANTALLA DE ÉXITO ── */}
              {cartStep === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-4 shadow-xl"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-xl font-black text-white uppercase mb-2">
                    ¡Preparando tu WhatsApp!
                  </h3>
                  <p className="text-xs text-stone-300 max-w-xs mb-6 leading-relaxed">
                    Estamos abriendo tu conversación de WhatsApp con el pedido listo y desglosado. Solo dale <strong className="text-emerald-400">"Enviar"</strong> en el chat.
                  </p>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4" />
                  <p className="text-[11px] text-stone-500">Redirigiendo de forma segura...</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FOOTER DE 3 COLUMNAS OBLIGATORIO (DATOS REALES DEL CLIENTE) ── */}
      <footer className="mt-20 border-t border-orange-500/20 bg-[#12100E] text-stone-300 relative overflow-hidden">
        {/* Glow inferior */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-40 bg-orange-600/5 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-stone-800/80">
            {/* Columna 1: Logo y Filosofía */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF1493] via-[#FF381E] to-[#FF7A00] p-0.5 flex items-center justify-center">
                  <span className="text-lg">🍔</span>
                </div>
                <span className="font-black text-lg text-white uppercase">
                  Burgas<span className="text-[#FF1493]">locas</span> al carbón
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Carne de hamburguesa artesanal 100% res de alta calidad, asada al carbón al momento. Disfruta de nuestras especialidades, jocholocos, alitas y snacks.
              </p>
              <div className="inline-block px-3 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                🔥 ¡Al carbón saben más ricas!
              </div>
            </div>

            {/* Columna 2: Contacto, Pedidos y Horarios */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Phone size={15} className="text-orange-500" /> Pedidos WhatsApp
              </h4>
              <div className="space-y-2 text-xs">
                <a
                  href={`https://wa.me/${clientConfig.phonePrimary}`}
                  className="flex items-center gap-2 text-stone-300 hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle size={14} className="text-emerald-400 shrink-0" />
                  <span>Línea 1: {clientConfig.phonePrimaryFormatted}</span>
                </a>
                <a
                  href={`https://wa.me/${clientConfig.phoneSecondary}`}
                  className="flex items-center gap-2 text-stone-300 hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle size={14} className="text-emerald-400 shrink-0" />
                  <span>Línea 2: {clientConfig.phoneSecondaryFormatted}</span>
                </a>
                <div className="flex items-center gap-2 text-stone-400 pt-1">
                  <Clock size={14} className="text-orange-400 shrink-0" />
                  <span>{clientConfig.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <MapPin size={14} className="text-orange-400 shrink-0" />
                  <span>{clientConfig.address}</span>
                </div>
              </div>
            </div>

            {/* Columna 3: Especialidades de la Casa & Formas de Pago */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Award size={15} className="text-orange-500" /> Especialidades
              </h4>
              <ul className="text-xs space-y-1.5 text-stone-400">
                <li className="flex items-center gap-1.5">
                  <span className="text-red-500">🌶️</span> Salsa de habanero casera de la casa
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-amber-400">🧀</span> Jocholocos con Doritos Nachos
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-pink-400">🥞</span> Crepas dulces y saladas
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400">💵</span> Aceptamos Efectivo y Transferencia BBVA
                </li>
              </ul>
            </div>
          </div>

          {/* Barra Inferior Legal y Créditos */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} Burgaslocas al carbón y Snacks. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <span>Carne 100% Res Artesanal</span>
              <span>•</span>
              <a
                href="https://imagineandstamp.site"
                target="_blank"
                rel="noreferrer"
                className="text-stone-400 hover:text-orange-400 font-bold transition-colors"
              >
                Diseñado por IMAGINE & STAMP
              </a>
              <span>•</span>
              <a href="#/admin" className="text-stone-600 hover:text-stone-400 flex items-center gap-1">
                🔒
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── BOTÓN FLOTANTE INFERIOR DEL CARRITO (Móvil) ── */}
      {totalItemsCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
          <motion.button
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={() => {
              setIsCartOpen(true);
              setCartStep(1);
            }}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#FF381E] to-[#FF7A00] text-white font-black text-sm uppercase tracking-wide flex items-center justify-between shadow-2xl shadow-orange-950/80 cursor-pointer border border-orange-400/30"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white text-[#FF381E] flex items-center justify-center font-black text-xs">
                {totalItemsCount}
              </div>
              <span>Ver mi pedido</span>
            </div>
            <span className="font-mono text-base font-black">${cartSubtotal} MXN</span>
          </motion.button>
        </div>
      )}

      {/* ── BOTÓN VOLVER ARRIBA ── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 sm:bottom-6 right-4 z-30 w-11 h-11 rounded-full bg-[#1F1B18] border border-orange-500/30 text-orange-400 hover:text-white hover:bg-orange-600 shadow-xl flex items-center justify-center transition-all cursor-pointer"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* ── TOAST FLOTANTE DE NOTIFICACIONES ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#1F1B18] border border-orange-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-black/80 flex items-center gap-2 text-xs font-bold"
          >
            <Sparkles size={16} className="text-[#FFB800]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
