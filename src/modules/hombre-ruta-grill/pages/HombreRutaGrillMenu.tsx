// ═══════════════════════════════════════════════════════════════════════════
// HOMBRE RUTA GRILL · CORREGIDORA, QUERÉTARO
// Menú Digital Interactivo de Alta Gama — Comida al puro estilo Hombre Ruta Grill
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame, Search, ShoppingBag, Plus, Minus, X, Heart, ArrowUp,
  Phone, MapPin, Clock, MessageCircle, Shield, Copy, Check,
  Trash2, ChevronRight, ChevronLeft, Star, Sparkles, Store,
  Bike, AlertCircle, Share2, CheckCircle2, Award, Coffee,
  UtensilsCrossed, Info, ExternalLink, SlidersHorizontal, ChevronDown
} from 'lucide-react';

import { clientConfig, bankInfo } from '../config';

// Importación de assets reales optimizados
import logoImg from '../assets/logo.webp';
import burgerImg from '../assets/burger.webp';
import burritoImg from '../assets/burrito.webp';
import porkBellyImg from '../assets/pork_belly.webp';
import alitasImg from '../assets/alitas.webp';
import atascadaImg from '../assets/atascada.webp';
import papasHierroImg from '../assets/papas_hierro.webp';
import hotdogImg from '../assets/hotdog.webp';
import cafeOllaImg from '../assets/cafe_olla.webp';

// ── Tipos y Categorías ──
export type CategoryId =
  | 'todos'
  | 'favoritos'
  | 'hamburguesas'
  | 'tacos-burros'
  | 'alitas-bonneles'
  | 'hotdogs-papas'
  | 'bebidas';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  badge?: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'todos', name: 'Todo el Menú', icon: '🔥' },
  { id: 'favoritos', name: 'Mis Favoritos', icon: '❤️' },
  { id: 'hamburguesas', name: 'Hamburguesas', icon: '🍔', badge: 'Al Carbón' },
  { id: 'tacos-burros', name: 'Tacos, Burros & Más', icon: '🌯', badge: 'Arrachera & Pork Belly' },
  { id: 'alitas-bonneles', name: 'Alitas & Bonneles', icon: '🍗', badge: 'Con Salsas' },
  { id: 'hotdogs-papas', name: 'Hot Dogs & Papas', icon: '🌭', badge: 'Hierro Fundido' },
  { id: 'bebidas', name: 'Bebidas & Café de Olla', icon: '🥤' },
];

export interface CustomOption {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  subname?: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
  badge?: string;
  featured?: boolean;
  isPopular?: boolean;
  prepTime?: string;
  canCustomize?: boolean;
  customType?: 'burger' | 'alitas' | 'burro' | 'taco' | 'bebida' | 'papas' | 'general';
}

export interface CartItem {
  lineId: string;
  productId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  image: string;
  category: CategoryId;
  sideChoice?: string;
  selectedSauce?: string;
  selectedFlavor?: string;
  removedIngredients?: string[];
  extras?: CustomOption[];
  specialNotes?: string;
}

// ── Opciones de Personalización ──
const BURGER_BASE_INGREDIENTS = [
  'Cebolla caramelizada',
  'Jitomate fresco',
  'Aguacate',
  'Pepinillos',
  'Queso panela',
  'Queso manchego',
  'Queso cheddar',
  'Jamón ahumado',
  'Tocino doradito',
  'Mayonesa',
  'Mostaza',
  'Kétchup'
];

const WING_SAUCES = [
  { id: 'bbq', name: 'Salsa BBQ Ahumada Parrillera' },
  { id: 'bufalo', name: 'Salsa Búfalo Clásica Picante' },
  { id: 'mango_habanero', name: 'Mango Habanero Glaseado' },
  { id: 'parmesano_ajo', name: 'Parmesano & Ajo Asado' },
  { id: 'limon_pimienta', name: 'Pimienta Limón Crujiente' },
];

const WING_DIPS = [
  { id: 'ranch', name: 'Dip Aderezo Ranch Casero' },
  { id: 'blue_cheese', name: 'Dip Blue Cheese Artesanal' },
  { id: 'sin_dip', name: 'Sin aderezo extra' },
];

const JARRITO_FLAVORS = [
  'Piña refrescante',
  'Limón natural',
  'Tamarindo tradicional',
  'Tutti Frutti frutal'
];

const BOING_FLAVORS = [
  'Fresa natural',
  'Mango tropical',
  'Manzana selecta'
];

const AGUAS_FLAVORS = [
  'Horchata casera con canela',
  'Jamaica fresca tatemada',
  'Limón con Chía refrescante'
];

const EXTRAS_BURGER: CustomOption[] = [
  { name: 'Combo: Papas a la Francesa Crujientes', price: 40 },
  { name: 'Carne de Res / Arrachera Extra', price: 40 },
  { name: 'Porción Extra de Tocino Crujiente', price: 15 },
  { name: 'Extra Queso Fundido (Manchego + Cheddar)', price: 15 },
  { name: 'Piña Asada al Carbón Caramelizada', price: 10 },
];

const EXTRAS_TACOS_BURROS: CustomOption[] = [
  { name: 'Guacamole Rústico Extra con Limón', price: 25 },
  { name: 'Queso Oaxaca Fundido Extra', price: 15 },
  { name: 'Cebollitas Cambray Asadas al Carbón', price: 15 },
  { name: 'Chicharrón de Jalapeño Extra', price: 15 },
];

// ── Catálogo Oficial de Platillos ──
export const PRODUCTS: Product[] = [
  // ── 1. HAMBURGUESAS ──
  {
    id: 'h-salvaje',
    name: 'La Salvaje',
    subname: 'Carne 100% de Res al Carbón',
    description: 'Nuestra burger estrella: jugosa carne de res a la brasa, queso panela, manchego y cheddar fundidos, jamón ahumado, tocino crocante, cebolla caramelizada, aguacate, jitomate, pepinillos y aderezos.',
    price: 85,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '🔥 La Más Pedida',
    featured: true,
    isPopular: true,
    prepTime: '15-20 min',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-ruta',
    name: 'La Ruta',
    subname: 'Pechuga Pollo Tempura Crujiente',
    description: 'Exquisita pechuga de pollo tempura crujiente con la sazón secreta Hombre Ruta, triple queso fundido, tocino, jamón ahumado, cebolla caramelizada, aguacate y aderezos.',
    price: 100,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '⭐ Receta Secreta',
    isPopular: true,
    prepTime: '15-20 min',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-fuego',
    name: 'La del Fuego',
    subname: 'Arrachera Marinada al Fuego Vivo',
    description: 'Riquísima carne de arrachera seleccionada marinada a las brasas, queso panela, manchego y cheddar, tocino, cebollitas caramelizadas, aguacate y aderezos en pan brioche.',
    price: 100,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '🥩 Corte Arrachera',
    featured: true,
    isPopular: true,
    prepTime: '15-20 min',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-forjada',
    name: 'La Forjada',
    subname: 'Sirloin con Lomo de Res',
    description: 'La consentida de los carnívoros: corte selecto de sirloin combinado con suave lomo de res a la parrilla, triple queso fundido, jamón, tocino, aguacate y cebolla caramelizada.',
    price: 120,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '👑 Corte Premium Sirloin & Lomo',
    featured: true,
    isPopular: true,
    prepTime: '18-22 min',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-camino',
    name: 'La del Camino',
    subname: 'Sirloin 100% a la Brasa',
    description: 'Deliciosa carne de sirloin molida y sazonada al momento, asada sobre carbón al rojo vivo con quesos derretidos, tocino, cebolla caramelizada y vegetales frescos.',
    price: 100,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '🔥 Sirloin Jugoso',
    prepTime: '15-20 min',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-indomable',
    name: 'La Indomable',
    subname: 'Carne de Res con Piña Caramelizada',
    description: 'Combinación audaz agridulce: carne de res a la brasa con rebanada de piña asada al carbón, jamón ahumado, tocino, triple queso derretido, cebolla caramelizada y aguacate.',
    price: 100,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '🍍 Toque Agridulce',
    prepTime: '15-20 min',
    canCustomize: true,
    customType: 'burger',
  },
  {
    id: 'h-montana',
    name: 'La Montaña',
    subname: 'Doble Carne 100% de Res',
    description: 'Para apetitos sin límite: doble porción de jugosa carne de res al carbón, capas dobles de queso manchego y cheddar, jamón ahumado, doble tocino, aguacate y aderezos.',
    price: 120,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '⛰️ Doble Carne Legendaria',
    isPopular: true,
    prepTime: '18-22 min',
    canCustomize: true,
    customType: 'burger',
  },

  // ── 2. TACOS, BURROS Y MÁS ──
  {
    id: 'tb-fogatero',
    name: 'El Fogatero',
    subname: 'Burrito XXL de Arrachera de Cerdo',
    description: 'Delicioso y colosal burrito XXL relleno de arrachera de cerdo a la parrilla, frijoles refritos de la olla, cebolla asada, jitomate fresco, aguacate cremoso y abundante queso Oaxaca fundido.',
    price: 50,
    category: 'tacos-burros',
    image: burritoImg,
    badge: '🌯 Burrito XXL Estrella',
    featured: true,
    isPopular: true,
    prepTime: '12-15 min',
    canCustomize: true,
    customType: 'burro',
  },
  {
    id: 'tb-escalon',
    name: 'El Escalón',
    subname: 'Taco en Tortilla Grande de Maíz',
    description: 'Delicioso taco parrillero en tortilla grande de maíz recién calentada al comal, con generosa porción de arrachera de cerdo a la parrilla, cebollitas asadas y salsas de la casa.',
    price: 25,
    category: 'tacos-burros',
    image: burritoImg,
    badge: '🌮 Taco Parrillero $25',
    prepTime: '8-10 min',
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'tb-atascada',
    name: 'La Atascada 500',
    subname: 'Charola Parrillera para Compartir',
    description: '¡La reina de la mesa! Deliciosa charola completa con medio kilo de arrachera de cerdo a la parrilla, servida con cebollitas cambray asadas, chiles toreados, cazuelita de salsa casera y tortillas calientes.',
    price: 120,
    category: 'tacos-burros',
    image: atascadaImg,
    badge: '👑 Charola para Compartir',
    featured: true,
    isPopular: true,
    prepTime: '18-25 min',
    canCustomize: true,
    customType: 'general',
  },
  {
    id: 'tb-destino-porkbelly',
    name: 'Destino Pork Belly',
    subname: 'Chicharrón de Pork Belly Crujiente',
    description: 'Exquisito chicharrón de Pork Belly horneado y terminado al carbón con corteza ultra-crujiente y carne jugosa, servido con generosa porción de guacamole fresco y limones.',
    price: 90,
    category: 'tacos-burros',
    image: porkBellyImg,
    badge: '🥑 Con Guacamole Fresco',
    isPopular: true,
    prepTime: '15-18 min',
    canCustomize: true,
    customType: 'general',
  },
  {
    id: 'tb-porkbelly-sunrise',
    name: 'Pork Belly Sunrise',
    subname: 'Pork Belly + Chicharrón de Jalapeño',
    description: 'La máxima experiencia de sabor: trozos dorados de Pork Belly crujiente acompañados de nuestro famoso chicharrón crocante de jalapeño y abundante guarnición de guacamole.',
    price: 120,
    category: 'tacos-burros',
    image: porkBellyImg,
    badge: '🌶️ Con Chicharrón de Jalapeño',
    featured: true,
    prepTime: '15-20 min',
    canCustomize: true,
    customType: 'general',
  },

  // ── 3. ALITAS Y BONNELES ──
  {
    id: 'ab-alitas-6',
    name: 'Alitas (Orden de 6 Pzas)',
    subname: 'Alitas a la Brasa con Salsa al Gusto',
    description: 'Orden de 6 jugosas alitas a la parrilla bañadas en tu salsa favorita (BBQ, Búfalo, Mango Habanero, Parmesano Ajo o Limón Pimienta), acompañadas de bastones de apio, zanahoria y dip.',
    price: 70,
    category: 'alitas-bonneles',
    image: alitasImg,
    badge: '🍗 6 Alitas Jugosas',
    prepTime: '15-18 min',
    canCustomize: true,
    customType: 'alitas',
  },
  {
    id: 'ab-alitas-12',
    name: 'Alitas (Orden de 12 Pzas)',
    subname: 'Orden Grande de 12 Alitas',
    description: '12 piezas de alitas crujientes doradas al carbón, bañadas con la salsa de tu elección, servidas con vegetales frescos crujientes y aderezo cremoso.',
    price: 130,
    category: 'alitas-bonneles',
    image: alitasImg,
    badge: '🔥 Mejor Valor para Compartir',
    featured: true,
    isPopular: true,
    prepTime: '18-22 min',
    canCustomize: true,
    customType: 'alitas',
  },
  {
    id: 'ab-bonneles-150',
    name: 'Bonneles 150 grs',
    subname: 'Pechuga Crujiente con Salsa y Papas',
    description: '150 gramos de tiernos y crujientes cubos de pechuga de pollo empanizados, bañados en tu salsa preferida y servidos con canasta de papas a la francesa.',
    price: 70,
    category: 'alitas-bonneles',
    image: alitasImg,
    badge: '🍟 Incluye Papas',
    prepTime: '12-15 min',
    canCustomize: true,
    customType: 'alitas',
  },
  {
    id: 'ab-bonneles-300',
    name: 'Bonneles 300 grs',
    subname: '300 grs de Pechuga con Salsa y Papas',
    description: 'Porción generosa de 300 gramos de boneless crujientes bañados con tu salsa favorita, servidos con abundante porción de papas a la francesa y aderezo dip.',
    price: 130,
    category: 'alitas-bonneles',
    image: alitasImg,
    badge: '⭐ 300g con Papas',
    isPopular: true,
    prepTime: '15-18 min',
    canCustomize: true,
    customType: 'alitas',
  },

  // ── 4. HOT DOGS Y PAPAS ──
  {
    id: 'hp-papas-hierro',
    name: 'Papas Hierro y Carne',
    subname: 'En Sartén de Hierro Fundido con Sirloin',
    description: 'Espectaculares papas a la francesa crujientes servidas al estilo hierro fundido con carne jugosa de sirloin picada, cebolla caramelizada, queso fundido y aderezo especial.',
    price: 80,
    category: 'hotdogs-papas',
    image: papasHierroImg,
    badge: '🍳 Especialidad Sartén de Hierro',
    featured: true,
    isPopular: true,
    prepTime: '12-15 min',
    canCustomize: true,
    customType: 'papas',
  },
  {
    id: 'hp-papas-francesa-250',
    name: 'Papas a la Francesa (250 grs)',
    subname: 'Porción Individual Doradita y Crujiente',
    description: '250 gramos de papas a la francesa corte clásico, fritas en su punto exacto con sal fina marina y aderezos para acompañar cualquier platillo.',
    price: 30,
    category: 'hotdogs-papas',
    image: papasHierroImg,
    badge: '🍟 Botana Clásica',
    prepTime: '8-10 min',
    canCustomize: false,
  },
  {
    id: 'hp-papas-salchicha',
    name: 'Papas a la Francesa con Salchicha',
    subname: 'Papas Crujientes + Salchicha a la Plancha',
    description: 'Combinación clásica de papas fritas doraditas acompañadas de salchichas asadas a la plancha rebanadas en rodajas y aderezos de mostaza y kétchup.',
    price: 50,
    category: 'hotdogs-papas',
    image: papasHierroImg,
    badge: '🌭 Con Salchicha',
    prepTime: '10-12 min',
    canCustomize: false,
  },
  {
    id: 'hp-forastero',
    name: 'El Forastero',
    subname: 'Hot Dog Estilo HRG con Pico de Gallo',
    description: 'Hot dog con salchicha asada a la parrilla, aderezo especial de la casa, coronado con fresco pico de gallo mexicano y toques de chiles toreados.',
    price: 30,
    category: 'hotdogs-papas',
    image: hotdogImg,
    badge: '🌭 Estilo HRG $30',
    prepTime: '8-10 min',
    canCustomize: true,
    customType: 'general',
  },
  {
    id: 'hp-caminante',
    name: 'El Caminante',
    subname: 'Hot Dog Jumbo Parrillero con Todo',
    description: 'Hot dog gourmet con salchicha jumbo ahumada a las brasas en pan suave tostado al grill, con cebolla caramelizada, jitomate fresco, pepinillos picaditos y rodajas de chile.',
    price: 50,
    category: 'hotdogs-papas',
    image: hotdogImg,
    badge: '⭐ Salchicha Jumbo',
    featured: true,
    isPopular: true,
    prepTime: '10-12 min',
    canCustomize: true,
    customType: 'general',
  },

  // ── 5. BEBIDAS ──
  {
    id: 'b-coca-600',
    name: 'Coca-Cola 600 ml',
    subname: 'Refresco Original Bien Frío',
    description: 'Botella de 600 ml bien fría para acompañar tus burgers y cortes parrillero.',
    price: 30,
    category: 'bebidas',
    image: cafeOllaImg,
    badge: '🥤 600 ml Fría',
    canCustomize: false,
  },
  {
    id: 'b-jarrito-600',
    name: 'Refresco Jarrito 600 ml',
    subname: 'Elige tu Sabor Tradicional Mexicano',
    description: 'Sabroso refresco tradicional mexicano en botella de 600 ml. Elige entre Piña, Limón, Tamarindo o Tutti Frutti.',
    price: 25,
    category: 'bebidas',
    image: cafeOllaImg,
    badge: '🍹 4 Sabores',
    canCustomize: true,
    customType: 'bebida',
  },
  {
    id: 'b-boing-340',
    name: 'Boing 340 ml en Lata',
    subname: 'Bebida con Pulpa de Fruta Natural',
    description: 'Lata de 340 ml de jugo Boing natural con pulpa de fruta. Elige entre Fresa, Mango o Manzana.',
    price: 20,
    category: 'bebidas',
    image: cafeOllaImg,
    badge: '🥭 Con Pulpa de Fruta',
    canCustomize: true,
    customType: 'bebida',
  },
  {
    id: 'b-cafe-olla',
    name: 'Café de Olla Tradicional',
    subname: 'Servido en Jarrito de Barro Caliente',
    description: 'Auténtico café de olla recién preparado con canela en rama y piloncillo de caña, servido caliente en jarrito de barro tradicional.',
    price: 15,
    category: 'bebidas',
    image: cafeOllaImg,
    badge: '☕ Hecho con Canela y Piloncillo',
    featured: true,
    isPopular: true,
    canCustomize: false,
  },
  {
    id: 'b-aguas-frescas',
    name: 'Aguas Frescas 500 ml',
    subname: 'Preparadas al Día con Fruta Natural',
    description: 'Vaso de 500 ml de agua fresca 100% natural preparada al día. Elige Horchata casera, Jamaica o Limón con Chía.',
    price: 25,
    category: 'bebidas',
    image: cafeOllaImg,
    badge: '🌿 100% Natural 500ml',
    canCustomize: true,
    customType: 'bebida',
  },
  {
    id: 'b-agua-natural',
    name: 'Agua Natural 500 ml',
    subname: 'Agua Purificada Refrescante',
    description: 'Botella de agua purificada de 500 ml.',
    price: 20,
    category: 'bebidas',
    image: cafeOllaImg,
    badge: '💧 Purificada 500ml',
    canCustomize: false,
  },
];

export default function HombreRutaGrillMenu() {
  // ── Estados Principales ──
  const [activeCategory, setActiveCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hrg_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Carrito
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hrg_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<1 | 2>(1);
  const [toastMessage, setToMessage] = useState<string | null>(null);

  // Modal de Personalización
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [selectedSauce, setSelectedSauce] = useState<string>('bbq');
  const [selectedDip, setSelectedDip] = useState<string>('ranch');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<CustomOption[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');

  // Formulario de Checkout (Paso 2)
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [addressNotes, setAddressNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');
  const [cashAmount, setCashAmount] = useState('');
  const [orderSent, setOrderSent] = useState(false);
  const [copiedClabe, setCopiedClabe] = useState(false);

  // Modales adicionales
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);

  // ── Efectos de Persistencia ──
  useEffect(() => {
    try {
      localStorage.setItem('hrg_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('hrg_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg: string) => {
    setToMessage(msg);
    setTimeout(() => setToMessage(null), 2400);
  };

  const toggleFavorite = (productId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => {
      const isFav = prev.includes(productId);
      const next = isFav ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(isFav ? 'Eliminado de favoritos' : '❤️ Agregado a tus favoritos');
      return next;
    });
  };

  // ── Filtrado de Productos ──
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;

    if (activeCategory === 'favoritos') {
      list = list.filter(p => favorites.includes(p.id));
    } else if (activeCategory !== 'todos') {
      list = list.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.subname && p.subname.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activeCategory, searchQuery, favorites]);

  // Totales de Carrito
  const cartTotalCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [cart]);

  // ── Abrir Modal de Producto ──
  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setSpecialNotes('');
    setRemovedIngredients([]);
    setSelectedExtras([]);

    if (product.customType === 'alitas') {
      setSelectedSauce('bbq');
      setSelectedDip('ranch');
    } else if (product.id === 'b-jarrito-600') {
      setSelectedFlavor(JARRITO_FLAVORS[0]);
    } else if (product.id === 'b-boing-340') {
      setSelectedFlavor(BOING_FLAVORS[0]);
    } else if (product.id === 'b-aguas-frescas') {
      setSelectedFlavor(AGUAS_FLAVORS[0]);
    } else {
      setSelectedFlavor('');
    }
  };

  // ── Cálculo de Precio Unitario con Extras ──
  const currentModalUnitPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
    return selectedProduct.price + extrasTotal;
  }, [selectedProduct, selectedExtras]);

  // ── Agregar al Carrito desde Modal ──
  const handleAddToCartFromModal = () => {
    if (!selectedProduct) return;

    let sauceText = '';
    if (selectedProduct.customType === 'alitas') {
      const sauceObj = WING_SAUCES.find(s => s.id === selectedSauce);
      const dipObj = WING_DIPS.find(d => d.id === selectedDip);
      sauceText = `${sauceObj?.name || selectedSauce} · ${dipObj?.name || selectedDip}`;
    }

    const newItem: CartItem = {
      lineId: `${selectedProduct.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      basePrice: selectedProduct.price,
      unitPrice: currentModalUnitPrice,
      quantity: modalQuantity,
      image: selectedProduct.image,
      category: selectedProduct.category,
      selectedSauce: sauceText || undefined,
      selectedFlavor: selectedFlavor || undefined,
      removedIngredients: removedIngredients.length > 0 ? [...removedIngredients] : undefined,
      extras: selectedExtras.length > 0 ? [...selectedExtras] : undefined,
      specialNotes: specialNotes.trim() || undefined,
    };

    setCart(prev => [...prev, newItem]);
    setSelectedProduct(null);
    showToast(`¡${selectedProduct.name} añadido a tu pedido! 🛒`);
  };

  // ── Quick Add (Para productos que no requieren personalización) ──
  const handleQuickAdd = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (product.canCustomize) {
      handleOpenProduct(product);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id && !item.extras && !item.specialNotes);
      if (existing) {
        return prev.map(item =>
          item.lineId === existing.lineId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          lineId: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          basePrice: product.price,
          unitPrice: product.price,
          quantity: 1,
          image: product.image,
          category: product.category,
        }
      ];
    });
    showToast(`¡${product.name} añadido!`);
  };

  const updateCartQuantity = (lineId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.lineId === lineId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeCartItem = (lineId: string) => {
    setCart(prev => prev.filter(item => item.lineId !== lineId));
  };

  // ── Enviar Pedido a WhatsApp (Regla Estricta: window.location.href con delay de 500ms) ──
  const handleSendWhatsAppOrder = () => {
    if (!customerName.trim()) {
      alert('Por favor escribe tu nombre completo para el pedido.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Por favor ingresa tu número de WhatsApp para contactarte.');
      return;
    }
    if (deliveryType === 'delivery' && !customerAddress.trim()) {
      alert('Por favor indica tu dirección de entrega en El Jaral / Corregidora.');
      return;
    }

    setOrderSent(true);

    let msg = `🔥 *NUEVO PEDIDO · HOMBRE RUTA GRILL* 🔥\n`;
    msg += `═══════════════════════════════\n\n`;
    msg += `👤 *Cliente:* ${customerName.trim()}\n`;
    msg += `📱 *WhatsApp:* ${customerPhone.trim()}\n`;
    msg += `🛵 *Tipo de entrega:* ${deliveryType === 'delivery' ? 'A Domicilio' : 'Pasar a Recoger (Pickup)'}\n`;

    if (deliveryType === 'delivery') {
      msg += `📍 *Dirección:* ${customerAddress.trim()}\n`;
      if (addressNotes.trim()) {
        msg += `🧭 *Referencias:* ${addressNotes.trim()}\n`;
      }
    }

    msg += `💳 *Método de pago:* ${
      paymentMethod === 'efectivo'
        ? `Efectivo al recibir${cashAmount ? ` (Paga con: $${cashAmount})` : ''}`
        : paymentMethod === 'transferencia'
        ? 'Transferencia bancaria (Comprobante)'
        : 'Tarjeta al recibir'
    }\n\n`;

    msg += `📋 *DETALLE DEL PEDIDO:*\n`;
    msg += `───────────────────────────────\n`;

    cart.forEach((item, index) => {
      msg += `*${index + 1}. ${item.name}* (x${item.quantity})\n`;
      msg += `   Subtotal: $${item.unitPrice * item.quantity} MXN\n`;

      if (item.selectedSauce) {
        msg += `   • Salsa / Dip: ${item.selectedSauce}\n`;
      }
      if (item.selectedFlavor) {
        msg += `   • Sabor: ${item.selectedFlavor}\n`;
      }
      if (item.removedIngredients && item.removedIngredients.length > 0) {
        msg += `   • Sin: ${item.removedIngredients.join(', ')}\n`;
      }
      if (item.extras && item.extras.length > 0) {
        msg += `   • Extras: ${item.extras.map(e => `${e.name} (+$${e.price})`).join(', ')}\n`;
      }
      if (item.specialNotes) {
        msg += `   • Nota especial: ${item.specialNotes}\n`;
      }
      msg += `\n`;
    });

    msg += `───────────────────────────────\n`;
    msg += `💰 *TOTAL A PAGAR: $${cartSubtotal} MXN*\n\n`;
    msg += `🕒 _Tiempo estimado: ${deliveryType === 'delivery' ? clientConfig.deliveryEstimate : clientConfig.pickupEstimate}_\n`;
    msg += `📍 _Ubicación: ${clientConfig.address}_\n`;
    msg += `_Comida al puro estilo Hombre Ruta Grill_ 🥩🔥`;

    const encodedMsg = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${clientConfig.whatsappNumber}?text=${encodedMsg}`;

    setTimeout(() => {
      window.location.href = waUrl;
    }, 500);
  };

  const copyClabe = () => {
    navigator.clipboard.writeText(bankInfo.clabe);
    setCopiedClabe(true);
    showToast('¡CLABE interbancaria copiada al portapapeles!');
    setTimeout(() => setCopiedClabe(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#FAF5EE] font-sans antialiased selection:bg-[#E65100] selection:text-white relative pb-28">
      {/* ── Toast Flotante ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1C1917]/95 border border-[#E65100]/60 text-white px-5 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-3 text-sm font-semibold tracking-wide"
          >
            <Sparkles size={16} className="text-[#E65100] animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Bar de Estatus & Contacto ── */}
      <header className="bg-[#181513] border-b border-[#332A24] text-xs text-[#A89F91] px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-400 tracking-wider uppercase">Abierto Hoy</span>
            <span className="text-[#554C44] hidden sm:inline">•</span>
            <span className="hidden sm:inline flex items-center gap-1">
              <Clock size={12} className="text-[#E65100]" /> {clientConfig.hoursShort}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${clientConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              <MessageCircle size={13} />
              <span>Pedidos: {clientConfig.whatsappDisplay}</span>
            </a>
            <span className="text-[#554C44] hidden md:inline">•</span>
            <span className="hidden md:flex items-center gap-1 text-[#A89F91]">
              <MapPin size={12} className="text-[#E65100]" /> {clientConfig.address}
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero Biker / Smokehouse Grill ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#181513] via-[#151210] to-[#121110] border-b border-[#332A24] pt-8 pb-12 px-4">
        {/* Efecto resplandor de brasas y partículas de fondo */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#E65100]/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 bg-[#D97706]/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Logo Oficial de Hombre Ruta Grill */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-block relative mb-4"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-3xl p-1.5 bg-gradient-to-br from-[#E65100] via-[#C87D43] to-[#332A24] shadow-2xl shadow-[#E65100]/25 overflow-hidden">
              <img
                src={logoImg}
                alt="Logo Hombre Ruta Grill"
                className="w-full h-full object-cover rounded-[22px] bg-[#121110]"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#E65100] text-white text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full shadow-lg border border-[#FAF5EE]/20 flex items-center gap-1">
              <Flame size={11} className="fill-white" />
              <span>GRILL & BEER</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-2"
          >
            HOMBRE RUTA <span className="text-[#E65100]">GRILL</span>
          </motion.h1>

          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-sm sm:text-base text-[#D97706] font-bold tracking-widest uppercase mb-3 flex items-center justify-center gap-2"
          >
            <span>★</span> Sabor a fuego, carbón y camino <span>★</span>
          </motion.p>

          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-[#A89F91] max-w-xl mx-auto mb-6 leading-relaxed"
          >
            Hamburguesas artesanales de sirloin y arrachera, colosales burros XXL, crujiente Pork Belly, alitas a la brasa y papas al hierro fundido en Corregidora, Qro.
          </motion.p>

          {/* Badges de Confianza / Pilares */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1917]/90 border border-[#332A24] text-xs font-semibold text-[#FAF5EE]">
              <Flame size={14} className="text-[#E65100]" />
              <span>100% al Carbón</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1917]/90 border border-[#332A24] text-xs font-semibold text-[#FAF5EE]">
              <Award size={14} className="text-[#D97706]" />
              <span>Sirloin & Arrachera</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1917]/90 border border-[#332A24] text-xs font-semibold text-[#FAF5EE]">
              <Bike size={14} className="text-emerald-400" />
              <span>Servicio a Domicilio</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1917]/90 border border-[#332A24] text-xs font-semibold text-[#FAF5EE]">
              <Store size={14} className="text-[#C87D43]" />
              <span>El Jaral, Corregidora</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Spotlight CRO: Platillos Insignia Destacados ── */}
      <section className="max-w-6xl mx-auto px-4 -mt-5 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Tarjeta 1: La Salvaje (Burger Estrella) */}
          <div
            onClick={() => handleOpenProduct(PRODUCTS[0])}
            className="group cursor-pointer rounded-2xl bg-[#1C1917]/90 border border-[#E65100]/40 p-3.5 flex items-center gap-4 hover:border-[#E65100] transition-all shadow-xl hover:shadow-[#E65100]/20 backdrop-blur-md"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
              <img src={burgerImg} alt="La Salvaje" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-1 left-1 bg-[#E65100] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                TOP
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D97706]">⭐ Burger Estrella</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#E65100] transition-colors truncate">
                La Salvaje (Res al Carbón)
              </h3>
              <p className="text-xs text-[#A89F91] line-clamp-1 mb-2">
                Triple queso fundido, tocino crujiente, cebolla caramelizada y aguacate.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-emerald-400">$85 MXN</span>
                <span className="text-xs font-bold text-[#E65100] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Pedir <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: El Fogatero (Burrito XXL) */}
          <div
            onClick={() => handleOpenProduct(PRODUCTS[7])}
            className="group cursor-pointer rounded-2xl bg-[#1C1917]/90 border border-[#D97706]/40 p-3.5 flex items-center gap-4 hover:border-[#D97706] transition-all shadow-xl hover:shadow-[#D97706]/20 backdrop-blur-md"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
              <img src={burritoImg} alt="El Fogatero" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-1 left-1 bg-[#D97706] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                XXL
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">🌯 Colosal Burro</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#D97706] transition-colors truncate">
                El Fogatero (Arrachera XXL)
              </h3>
              <p className="text-xs text-[#A89F91] line-clamp-1 mb-2">
                Arrachera de cerdo, frijoles refritos, queso Oaxaca y aguacate fresco.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-emerald-400">$50 MXN</span>
                <span className="text-xs font-bold text-[#D97706] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Pedir <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Buscador Interactivo & Barra de Categorías Sticky ── */}
      <div className="sticky top-0 z-30 bg-[#121110]/95 backdrop-blur-md border-b border-[#332A24] pt-4 pb-3 px-4 shadow-xl mt-6">
        <div className="max-w-6xl mx-auto space-y-3">
          {/* Buscador */}
          <div className="relative">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89F91]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar hamburguesas, burros, alitas, pork belly, papas..."
              className="w-full bg-[#1C1917] border border-[#332A24] focus:border-[#E65100] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#6E645A] focus:outline-none focus:ring-1 focus:ring-[#E65100] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89F91] hover:text-white p-1"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Carrusel de Categorías con Snap Táctil */}
          <div className="relative flex items-center">
            <div
              ref={categoriesRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id;
                const favCount = favorites.length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSearchQuery('');
                    }}
                    className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#E65100] text-white shadow-lg shadow-[#E65100]/30 border border-[#E65100]'
                        : 'bg-[#1C1917] text-[#A89F91] hover:text-white hover:bg-[#261F1A] border border-[#332A24]'
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.name}</span>
                    {cat.id === 'favoritos' && favCount > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isActive ? 'bg-white text-[#E65100]' : 'bg-[#E65100] text-white'}`}>
                        {favCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid Principal de Productos ── */}
      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* Banner Informativo de Hamburguesas (Ingredientes incluidos) */}
        {activeCategory === 'hamburguesas' && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#1C1917] to-[#241D17] border border-[#E65100]/30 flex items-start gap-3">
            <Info size={18} className="text-[#E65100] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#FAF5EE] space-y-1">
              <p className="font-bold text-[#E65100] uppercase tracking-wide">
                ¡Todas nuestras hamburguesas vienen preparadas con todo!
              </p>
              <p className="text-[#A89F91] leading-relaxed">
                Cebolla caramelizada, jitomate, aguacate, pepinillos, queso panela, manchego, cheddar, jamón ahumado, tocino, aderezos y la carne de tu preferencia.
                <span className="text-emerald-400 font-bold block mt-1">
                  💡 Tip: Puedes agregar papas a la francesa por solo +$40 al personalizar tu burger.
                </span>
              </p>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#1C1917]/50 rounded-3xl border border-[#332A24]">
            <UtensilsCrossed size={40} className="mx-auto text-[#6E645A] mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No encontramos platillos</h3>
            <p className="text-xs text-[#A89F91] mb-4">
              {activeCategory === 'favoritos'
                ? 'Aún no has guardado favoritos. ¡Toca el corazón en cualquier platillo!'
                : 'Intenta buscando con otra palabra o revisa otra categoría.'}
            </p>
            <button
              onClick={() => {
                setActiveCategory('todos');
                setSearchQuery('');
              }}
              className="px-5 py-2 bg-[#E65100] hover:bg-[#D84315] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Ver Todo el Menú
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {filteredProducts.map(product => {
              const isFav = favorites.includes(product.id);

              return (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => handleOpenProduct(product)}
                  className="group cursor-pointer rounded-2xl bg-[#1C1917] border border-[#332A24] hover:border-[#E65100]/70 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-[#E65100]/10"
                >
                  {/* Imagen de Platillo con Badges y Favorito */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#121110]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-transparent to-black/30" />

                    {/* Badge de platillo */}
                    {product.badge && (
                      <div className="absolute top-2.5 left-2.5 bg-[#E65100] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md border border-white/10">
                        {product.badge}
                      </div>
                    )}

                    {/* Botón Favorito */}
                    <button
                      onClick={e => toggleFavorite(product.id, e)}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                        isFav
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                          : 'bg-black/50 text-white hover:bg-black/80'
                      }`}
                      title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <Heart size={15} className={isFav ? 'fill-white' : ''} />
                    </button>

                    {/* Tiempo de preparación si aplica */}
                    {product.prepTime && (
                      <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-[10px] text-[#D97706] bg-black/70 px-2 py-0.5 rounded-full font-bold">
                        <Clock size={11} />
                        <span>{product.prepTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Información del Platillo */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {product.subname && (
                        <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider block mb-1">
                          {product.subname}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-white group-hover:text-[#E65100] transition-colors mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#A89F91] line-clamp-2 leading-relaxed mb-3">
                        {product.description}
                      </p>
                    </div>

                    {/* Footer de Tarjeta con Precio y Botón Agregar */}
                    <div className="pt-2 border-t border-[#332A24]/70 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] text-[#6E645A] block uppercase font-bold">Precio</span>
                        <span className="text-lg font-black text-emerald-400">
                          ${product.price} <span className="text-[11px] font-semibold text-[#A89F91]">MXN</span>
                        </span>
                      </div>

                      <button
                        onClick={e => handleQuickAdd(product, e)}
                        className="px-3.5 py-2 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#E65100]/25 transition-all group-hover:scale-105"
                      >
                        <Plus size={14} />
                        <span>{product.canCustomize ? 'Personalizar' : 'Agregar'}</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </main>

      {/* ── Modal Bottom Sheet de Personalización de Platillo ── */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-full max-w-lg bg-[#1C1917] border-t sm:border border-[#332A24] rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header Modal con Imagen */}
              <div className="relative h-44 sm:h-52 w-full flex-shrink-0">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-transparent to-black/40" />

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="absolute bottom-3 left-4 right-4">
                  {selectedProduct.badge && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#E65100] bg-black/70 px-2 py-0.5 rounded mb-1 inline-block">
                      {selectedProduct.badge}
                    </span>
                  )}
                  <h2 className="text-xl font-black text-white">{selectedProduct.name}</h2>
                  <p className="text-xs text-[#D97706] font-semibold">{selectedProduct.subname}</p>
                </div>
              </div>

              {/* Contenido con Scroll de Opciones */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 text-xs">
                <p className="text-[#A89F91] leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* 1. Opciones para Hamburguesas: Combo y Retirar ingredientes */}
                {selectedProduct.customType === 'burger' && (
                  <>
                    {/* Upsell Combo de Papas */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#241D17] to-[#1C1917] border border-[#E65100]/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-white text-xs flex items-center gap-1.5">
                          🍟 ¿Quieres papas a la francesa?
                        </span>
                        <span className="font-black text-emerald-400">+$40 MXN</span>
                      </div>
                      <p className="text-[11px] text-[#A89F91] mb-2.5">
                        Lleva tu orden de papas a la francesa crujientes por precio especial.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const comboOption = EXTRAS_BURGER[0];
                          const hasIt = selectedExtras.some(e => e.name === comboOption.name);
                          if (hasIt) {
                            setSelectedExtras(prev => prev.filter(e => e.name !== comboOption.name));
                          } else {
                            setSelectedExtras(prev => [...prev, comboOption]);
                          }
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                          selectedExtras.some(e => e.name === EXTRAS_BURGER[0].name)
                            ? 'bg-emerald-600 text-white border border-emerald-400'
                            : 'bg-[#121110] text-[#FAF5EE] border border-[#332A24] hover:border-[#E65100]'
                        }`}
                      >
                        {selectedExtras.some(e => e.name === EXTRAS_BURGER[0].name) ? (
                          <>
                            <Check size={14} /> ¡Papas Agregadas al Combo!
                          </>
                        ) : (
                          <>
                            <Plus size={14} /> Agregar Papas (+ $40)
                          </>
                        )}
                      </button>
                    </div>

                    {/* Ingredientes Incluidos (Toggle para quitar) */}
                    <div>
                      <h4 className="font-black uppercase tracking-wider text-[#FAF5EE] mb-2 flex items-center justify-between">
                        <span>Ingredientes base incluidos:</span>
                        <span className="text-[10px] text-[#A89F91] font-normal">Toca para quitar</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {BURGER_BASE_INGREDIENTS.map(ing => {
                          const isRemoved = removedIngredients.includes(ing);
                          return (
                            <button
                              key={ing}
                              type="button"
                              onClick={() => {
                                setRemovedIngredients(prev =>
                                  isRemoved ? prev.filter(i => i !== ing) : [...prev, ing]
                                );
                              }}
                              className={`p-2 rounded-xl text-left border flex items-center justify-between transition-all ${
                                isRemoved
                                  ? 'bg-red-950/40 border-red-800/60 text-red-300 line-through'
                                  : 'bg-[#121110] border-[#332A24] text-white hover:border-[#6E645A]'
                              }`}
                            >
                              <span className="truncate">{ing}</span>
                              <span className="text-[10px] font-bold ml-1">
                                {isRemoved ? '✕ Sin' : '✓'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Extras de Hamburguesa */}
                    <div>
                      <h4 className="font-black uppercase tracking-wider text-[#FAF5EE] mb-2">
                        Adicionales & Extras:
                      </h4>
                      <div className="space-y-1.5">
                        {EXTRAS_BURGER.slice(1).map(extra => {
                          const isSelected = selectedExtras.some(e => e.name === extra.name);
                          return (
                            <label
                              key={extra.name}
                              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-[#E65100]/15 border-[#E65100] text-white'
                                  : 'bg-[#121110] border-[#332A24] text-[#A89F91] hover:border-[#6E645A]'
                              }`}
                            >
                              <span className="font-semibold text-white">{extra.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-emerald-400">+${extra.price}</span>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    setSelectedExtras(prev =>
                                      isSelected
                                        ? prev.filter(e => e.name !== extra.name)
                                        : [...prev, extra]
                                    );
                                  }}
                                  className="accent-[#E65100] h-4 w-4 rounded"
                                />
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* 2. Opciones para Alitas y Bonneles */}
                {selectedProduct.customType === 'alitas' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-black uppercase tracking-wider text-[#FAF5EE] mb-2">
                        Elige la Salsa para tus Alitas / Bonneles: *
                      </h4>
                      <div className="space-y-1.5">
                        {WING_SAUCES.map(sauce => (
                          <label
                            key={sauce.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              selectedSauce === sauce.id
                                ? 'bg-[#E65100]/20 border-[#E65100] text-white font-bold'
                                : 'bg-[#121110] border-[#332A24] text-[#A89F91]'
                            }`}
                          >
                            <span>{sauce.name}</span>
                            <input
                              type="radio"
                              name="wing_sauce"
                              value={sauce.id}
                              checked={selectedSauce === sauce.id}
                              onChange={() => setSelectedSauce(sauce.id)}
                              className="accent-[#E65100] h-4 w-4"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-black uppercase tracking-wider text-[#FAF5EE] mb-2">
                        Elige tu Dip / Aderezo:
                      </h4>
                      <div className="space-y-1.5">
                        {WING_DIPS.map(dip => (
                          <label
                            key={dip.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              selectedDip === dip.id
                                ? 'bg-[#D97706]/20 border-[#D97706] text-white font-bold'
                                : 'bg-[#121110] border-[#332A24] text-[#A89F91]'
                            }`}
                          >
                            <span>{dip.name}</span>
                            <input
                              type="radio"
                              name="wing_dip"
                              value={dip.id}
                              checked={selectedDip === dip.id}
                              onChange={() => setSelectedDip(dip.id)}
                              className="accent-[#D97706] h-4 w-4"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Opciones para Bebidas con Sabor (Jarrito, Boing, Aguas) */}
                {selectedProduct.customType === 'bebida' && (
                  <div>
                    <h4 className="font-black uppercase tracking-wider text-[#FAF5EE] mb-2">
                      Selecciona tu Sabor Favorito: *
                    </h4>
                    <div className="space-y-1.5">
                      {(selectedProduct.id === 'b-jarrito-600'
                        ? JARRITO_FLAVORS
                        : selectedProduct.id === 'b-boing-340'
                        ? BOING_FLAVORS
                        : AGUAS_FLAVORS
                      ).map(flavor => (
                        <label
                          key={flavor}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            selectedFlavor === flavor
                              ? 'bg-[#E65100]/20 border-[#E65100] text-white font-bold'
                              : 'bg-[#121110] border-[#332A24] text-[#A89F91]'
                          }`}
                        >
                          <span>{flavor}</span>
                          <input
                            type="radio"
                            name="beverage_flavor"
                            value={flavor}
                            checked={selectedFlavor === flavor}
                            onChange={() => setSelectedFlavor(flavor)}
                            className="accent-[#E65100] h-4 w-4"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Notas Especiales para la Cocina */}
                <div>
                  <h4 className="font-black uppercase tracking-wider text-[#FAF5EE] mb-1.5">
                    Instrucciones Especiales para el Asador:
                  </h4>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={e => setSpecialNotes(e.target.value)}
                    placeholder="Ej. Bien dorado, salsa aparte, extra limones..."
                    className="w-full bg-[#121110] border border-[#332A24] focus:border-[#E65100] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#6E645A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Botón Sticky Inferior del Modal */}
              <div className="p-4 bg-[#181513] border-t border-[#332A24] flex items-center gap-3">
                {/* Selector de Cantidad */}
                <div className="flex items-center border border-[#332A24] rounded-xl bg-[#121110] p-1">
                  <button
                    onClick={() => setModalQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A89F91] hover:text-white hover:bg-[#261F1A]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-black text-sm text-white">
                    {modalQuantity}
                  </span>
                  <button
                    onClick={() => setModalQuantity(q => q + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A89F91] hover:text-white hover:bg-[#261F1A]"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Botón de Confirmar y Añadir */}
                <button
                  onClick={handleAddToCartFromModal}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white font-black uppercase tracking-wider text-xs flex items-center justify-between shadow-lg shadow-[#E65100]/30 transition-colors"
                >
                  <span>Agregar al Pedido</span>
                  <span>${currentModalUnitPrice * modalQuantity} MXN</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Carrito Drawer / Modal de 2 Pasos (Regla Obligatoria) ── */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-full max-w-md bg-[#181513] border-l border-[#332A24] h-full flex flex-col shadow-2xl"
            >
              {/* Header Carrito */}
              <div className="p-4 border-b border-[#332A24] flex items-center justify-between bg-[#1C1917]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E65100]/20 text-[#E65100] flex items-center justify-center">
                    <ShoppingBag size={17} />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-wider text-white text-sm">
                      Tu Pedido Grill
                    </h3>
                    <span className="text-[10px] text-[#A89F91]">
                      Paso {cartStep} de 2: {cartStep === 1 ? 'Revisión de Platillos' : 'Datos de Entrega y Pago'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-xl bg-[#121110] text-[#A89F91] hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Contenido Dinámico según el Paso */}
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <ShoppingBag size={48} className="text-[#332A24] mb-3" />
                  <h4 className="text-base font-bold text-white mb-1">Tu carrito está vacío</h4>
                  <p className="text-xs text-[#A89F91] mb-5">
                    Elige tus hamburguesas, burros o alitas favoritas para iniciar tu pedido.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#E65100] text-white text-xs font-bold"
                  >
                    Ver la Carta
                  </button>
                </div>
              ) : cartStep === 1 ? (
                /* ── PASO 1: Lista de Platillos ── */
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.map(item => (
                    <div
                      key={item.lineId}
                      className="p-3.5 rounded-2xl bg-[#1C1917] border border-[#332A24] space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-[#121110]"
                          />
                          <div>
                            <h4 className="font-bold text-white text-xs">{item.name}</h4>
                            <span className="text-xs font-black text-emerald-400 block">
                              ${item.unitPrice * item.quantity} MXN
                            </span>
                            <span className="text-[10px] text-[#A89F91]">
                              (${item.unitPrice} c/u)
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => removeCartItem(item.lineId)}
                          className="text-[#6E645A] hover:text-rose-400 p-1 transition-colors"
                          title="Eliminar del pedido"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Desglose de Personalizaciones */}
                      {(item.selectedSauce || item.selectedFlavor || item.removedIngredients || item.extras || item.specialNotes) && (
                        <div className="text-[10px] text-[#A89F91] pl-2 border-l-2 border-[#E65100]/50 space-y-0.5 pt-1">
                          {item.selectedSauce && <div>• Salsa: {item.selectedSauce}</div>}
                          {item.selectedFlavor && <div>• Sabor: {item.selectedFlavor}</div>}
                          {item.removedIngredients && (
                            <div className="text-red-300">• Sin: {item.removedIngredients.join(', ')}</div>
                          )}
                          {item.extras && (
                            <div className="text-emerald-400">
                              • Extras: {item.extras.map(e => `${e.name} (+$${e.price})`).join(', ')}
                            </div>
                          )}
                          {item.specialNotes && (
                            <div className="text-[#D97706] italic">• Nota: "{item.specialNotes}"</div>
                          )}
                        </div>
                      )}

                      {/* Contador de Cantidad */}
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#332A24]/60">
                        <span className="text-[10px] text-[#6E645A] uppercase font-bold mr-auto">Cantidad</span>
                        <button
                          onClick={() => updateCartQuantity(item.lineId, -1)}
                          className="w-6 h-6 rounded-lg bg-[#121110] border border-[#332A24] flex items-center justify-center text-[#A89F91] hover:text-white"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center font-black text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.lineId, 1)}
                          className="w-6 h-6 rounded-lg bg-[#121110] border border-[#332A24] flex items-center justify-center text-[#A89F91] hover:text-white"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ── PASO 2: Datos de Entrega y Método de Pago ── */
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                  {/* Selector de Tipo de Entrega */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#FAF5EE] mb-2">
                      Tipo de Servicio: *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('delivery')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          deliveryType === 'delivery'
                            ? 'bg-[#E65100]/20 border-[#E65100] text-white font-bold'
                            : 'bg-[#1C1917] border-[#332A24] text-[#A89F91]'
                        }`}
                      >
                        <Bike size={18} className={deliveryType === 'delivery' ? 'text-[#E65100]' : ''} />
                        <span>A Domicilio</span>
                        <span className="text-[9px] text-[#A89F91]">~30 - 45 min</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          deliveryType === 'pickup'
                            ? 'bg-[#D97706]/20 border-[#D97706] text-white font-bold'
                            : 'bg-[#1C1917] border-[#332A24] text-[#A89F91]'
                        }`}
                      >
                        <Store size={18} className={deliveryType === 'pickup' ? 'text-[#D97706]' : ''} />
                        <span>Pasar a Recoger</span>
                        <span className="text-[9px] text-[#A89F91]">~15 - 25 min</span>
                      </button>
                    </div>
                  </div>

                  {/* Campos de Contacto */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#FAF5EE] mb-1">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="Ej. Carlos Mendoza"
                        className="w-full bg-[#1C1917] border border-[#332A24] focus:border-[#E65100] rounded-xl px-3 py-2 text-white placeholder-[#6E645A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#FAF5EE] mb-1">
                        Tu Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        placeholder="Ej. 446 123 4567"
                        className="w-full bg-[#1C1917] border border-[#332A24] focus:border-[#E65100] rounded-xl px-3 py-2 text-white placeholder-[#6E645A] focus:outline-none"
                      />
                    </div>

                    {deliveryType === 'delivery' && (
                      <>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#FAF5EE] mb-1">
                            Dirección de Entrega en Corregidora *
                          </label>
                          <input
                            type="text"
                            value={customerAddress}
                            onChange={e => setCustomerAddress(e.target.value)}
                            placeholder="Calle, número, colonia o fraccionamiento"
                            className="w-full bg-[#1C1917] border border-[#332A24] focus:border-[#E65100] rounded-xl px-3 py-2 text-white placeholder-[#6E645A] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#FAF5EE] mb-1">
                            Referencias de la Casa / Portón
                          </label>
                          <input
                            type="text"
                            value={addressNotes}
                            onChange={e => setAddressNotes(e.target.value)}
                            placeholder="Ej. Casa blanca con reja negra, frente al parque"
                            className="w-full bg-[#1C1917] border border-[#332A24] focus:border-[#E65100] rounded-xl px-3 py-2 text-white placeholder-[#6E645A] focus:outline-none"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Método de Pago */}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#FAF5EE] mb-2">
                      Método de Pago: *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('efectivo')}
                        className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                          paymentMethod === 'efectivo'
                            ? 'bg-[#E65100]/20 border-[#E65100] text-white'
                            : 'bg-[#1C1917] border-[#332A24] text-[#A89F91]'
                        }`}
                      >
                        💵 Efectivo
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('transferencia')}
                        className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                          paymentMethod === 'transferencia'
                            ? 'bg-[#E65100]/20 border-[#E65100] text-white'
                            : 'bg-[#1C1917] border-[#332A24] text-[#A89F91]'
                        }`}
                      >
                        📲 SPEI
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('tarjeta')}
                        className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                          paymentMethod === 'tarjeta'
                            ? 'bg-[#E65100]/20 border-[#E65100] text-white'
                            : 'bg-[#1C1917] border-[#332A24] text-[#A89F91]'
                        }`}
                      >
                        💳 Terminal
                      </button>
                    </div>

                    {/* Si elige Efectivo: ¿Con cuánto va a pagar? */}
                    {paymentMethod === 'efectivo' && (
                      <div className="mt-2.5 p-3 rounded-xl bg-[#1C1917] border border-[#332A24]">
                        <label className="block text-[10px] text-[#A89F91] mb-1">
                          ¿Con cuánto vas a pagar? (Para llevarte cambio exacto)
                        </label>
                        <input
                          type="text"
                          value={cashAmount}
                          onChange={e => setCashAmount(e.target.value)}
                          placeholder={`Ej. $${Math.ceil(cartSubtotal / 100) * 100} o exacto`}
                          className="w-full bg-[#121110] border border-[#332A24] rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#E65100]"
                        />
                      </div>
                    )}

                    {/* Si elige Transferencia: Tarjeta con CLABE Copiable */}
                    {paymentMethod === 'transferencia' && (
                      <div className="mt-2.5 p-3.5 rounded-xl bg-gradient-to-br from-[#1C1917] to-[#261F1A] border border-[#D97706]/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-white text-[11px]">{bankInfo.bankName}</span>
                          <span className="text-[10px] text-emerald-400 font-bold">Transferencia Rápida</span>
                        </div>
                        <div className="text-[10px] text-[#A89F91]">
                          Titular: <span className="text-white font-semibold">{bankInfo.accountHolder}</span>
                        </div>
                        <div className="flex items-center justify-between bg-[#121110] p-2 rounded-lg border border-[#332A24]">
                          <span className="font-mono text-white text-xs font-bold">{bankInfo.clabe}</span>
                          <button
                            type="button"
                            onClick={copyClabe}
                            className="px-2 py-1 bg-[#E65100] text-white rounded text-[10px] font-bold flex items-center gap-1"
                          >
                            {copiedClabe ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copiedClabe ? 'Copiada' : 'Copiar'}</span>
                          </button>
                        </div>
                        <p className="text-[9px] text-[#A89F91]">
                          * Por favor adjunta el comprobante al enviarnos el pedido por WhatsApp.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer Carrito (Sticky con Botón de Avance o Envío WhatsApp) */}
              {cart.length > 0 && (
                <div className="p-4 bg-[#1C1917] border-t border-[#332A24] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A89F91]">Total del Pedido:</span>
                    <span className="text-xl font-black text-emerald-400">
                      ${cartSubtotal} <span className="text-xs font-normal text-[#A89F91]">MXN</span>
                    </span>
                  </div>

                  {cartStep === 1 ? (
                    <button
                      onClick={() => setCartStep(2)}
                      className="w-full py-3 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E65100]/30 transition-all"
                    >
                      <span>Continuar con Datos de Entrega</span>
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCartStep(1)}
                        className="py-3 px-3 rounded-xl bg-[#121110] border border-[#332A24] text-[#A89F91] hover:text-white font-bold text-xs"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={handleSendWhatsAppOrder}
                        className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 transition-all"
                      >
                        <MessageCircle size={17} />
                        <span>Enviar Pedido por WhatsApp</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Barra Flotante de Carrito ── */}
      {cart.length > 0 && !isCartOpen && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto"
        >
          <button
            onClick={() => {
              setCartStep(1);
              setIsCartOpen(true);
            }}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#E65100] to-[#D84315] text-white font-black uppercase tracking-wider text-xs flex items-center justify-between shadow-2xl shadow-[#E65100]/40 border border-[#FAF5EE]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white font-black">
                {cartTotalCount}
              </div>
              <span className="text-left font-bold">
                Ver Mi Pedido ({cartTotalCount} {cartTotalCount === 1 ? 'platillo' : 'platillos'})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black">${cartSubtotal} MXN</span>
              <ChevronRight size={16} />
            </div>
          </button>
        </motion.div>
      )}

      {/* ── Botón Volver Arriba ── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 z-30 w-10 h-10 rounded-full bg-[#1C1917]/90 border border-[#332A24] text-[#FAF5EE] hover:text-[#E65100] flex items-center justify-center shadow-lg backdrop-blur-md transition-all"
          title="Volver arriba"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* ── Modal de Aviso de Privacidad (LFPDPPP) ── */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#1C1917] border border-[#332A24] rounded-3xl p-6 text-xs text-[#A89F91] space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#332A24] pb-3">
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield size={18} className="text-[#E65100]" />
                  <span>Aviso de Privacidad</span>
                </h3>
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="w-7 h-7 rounded-full bg-[#121110] text-[#A89F91] hover:text-white flex items-center justify-center"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-3 leading-relaxed">
                <p>
                  En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong>, <strong>HOMBRE RUTA GRILL</strong>, ubicado en El Jaral, Corregidora, Querétaro, hace de su conocimiento que los datos personales recabados (nombre, teléfono de contacto y domicilio de entrega) serán utilizados única y exclusivamente para procesar, coordinar y entregar sus pedidos de alimentos y bebidas.
                </p>
                <p>
                  Sus datos no serán compartidos, vendidos ni transferidos a terceros bajo ninguna circunstancia. Para cualquier solicitud relacionada con sus derechos ARCO (Acceso, Rectificación, Cancelación u Oposición), puede comunicarse directamente a nuestro canal de WhatsApp: <strong>{clientConfig.phoneDisplay}</strong>.
                </p>
              </div>

              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="w-full py-2.5 bg-[#E65100] text-white font-bold uppercase tracking-wider rounded-xl text-xs hover:bg-[#D84315] transition-colors"
              >
                Entendido y de acuerdo
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Footer Obligatorio de 3 Columnas con Datos del Cliente ── */}
      <footer className="mt-16 bg-[#181513] border-t border-[#332A24] text-xs text-[#A89F91] pt-12 pb-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Columna 1: El Restaurante */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-black text-white text-sm tracking-wider uppercase">
                HOMBRE RUTA <span className="text-[#E65100]">GRILL</span>
              </span>
            </div>
            <p className="leading-relaxed text-[#A89F91]">
              Comida al puro estilo Hombre Ruta Grill. Pasión por el fuego, cortes seleccionados y las mejores hamburguesas artesanales al carbón.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
              <Flame size={14} className="text-[#E65100]" />
              <span>Sabor rústico parrillero garantizado</span>
            </div>
          </div>

          {/* Columna 2: Contacto & Pedidos */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-white text-xs border-b border-[#332A24] pb-2">
              Contacto & Pedidos
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-[#E65100] flex-shrink-0 mt-0.5" />
                <span>{clientConfig.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#D97706] flex-shrink-0" />
                <span>{clientConfig.hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: {clientConfig.phoneDisplay}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${clientConfig.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:bg-[#1EBE5D] transition-colors shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle size={14} />
              <span>Abrir Chat de WhatsApp</span>
            </a>
          </div>

          {/* Columna 3: Información & Confianza */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-white text-xs border-b border-[#332A24] pb-2">
              Métodos de Pago & Seguridad
            </h4>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-[#1C1917] border border-[#332A24] text-white">💵 Efectivo</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#1C1917] border border-[#332A24] text-white">📲 Transferencia SPEI</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#1C1917] border border-[#332A24] text-white">💳 Tarjeta</span>
            </div>
            <p className="text-[11px] text-[#A89F91]">
              Servicio a domicilio y pedidos anticipados para comidas familiares y eventos especiales.
            </p>
            <div>
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="text-[#E65100] hover:underline font-bold text-[11px] flex items-center gap-1"
              >
                <Shield size={12} />
                <span>Aviso de Privacidad (LFPDPPP)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Crédito Oficial de Imagine & Stamp */}
        <div className="max-w-6xl mx-auto pt-6 border-t border-[#332A24] text-center text-[11px] text-[#6E645A] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} HOMBRE RUTA GRILL · Todos los derechos reservados</span>
          <span className="font-semibold text-[#A89F91]">
            Diseñado con pasión por{' '}
            <a
              href="https://imagineandstamp.site"
              target="_blank"
              rel="noreferrer"
              className="text-[#E65100] hover:underline font-bold"
            >
              IMAGINE & STAMP
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
