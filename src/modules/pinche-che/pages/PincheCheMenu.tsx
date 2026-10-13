// ═══════════════════════════════════════════════════════════════════════════
// PINCHE CHE · PARRILLA ARGENTINA — Menú Digital Interactivo de Alta Gama
// Choripanes Cancheros, Empanadas Artesanales Fritas, Burgers al Carbón,
// Papas Poutine y Postres Caseros con Estilo Parrilla Urbana.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, X, ShoppingBag, Flame, Sparkles,
  Phone, MapPin, Clock, MessageCircle, ArrowUp, Shield,
  Copy, Check, Trash2, Landmark, Wallet, Store, Bike,
  Heart, CheckCircle2, ChevronRight, ChevronLeft, Utensils,
  Share2, AlertCircle, Info, Star, Edit3
} from 'lucide-react';
import { clientConfig, bankInfo } from '../config';
import pincheLogo from '../assets/logo.jpg';
import pincheHero from '../assets/hero.jpg';

const C = clientConfig.colors;

// ── Categorías ──
type CategoryId =
  | 'todos'
  | 'favoritos'
  | 'empezar'
  | 'parrilla'
  | 'postres'
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
  customType?: 'pancho' | 'choripan' | 'burger' | 'refresco' | 'boing';
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
  selectedToppings?: string[];
  selectedDressings?: string[];
  selectedSauce?: string;
  selectedFlavor?: string;
  extras?: CustomOption[];
  specialNotes?: string;
}

// ── Toppings y Aderezos para EL PINCHE PANCHO ──
const PANCHO_TOPPINGS = [
  { id: 'jalapenos', name: 'Jalapeños en Vinagre 🫑' },
  { id: 'elote', name: 'Elote Amarillo Dulce 🌽' },
  { id: 'pico_gallo', name: 'Pico de Gallo Fresco 🥗' },
  { id: 'cebolla_crocante', name: 'Cebolla Crocante Crujiente 🧅' },
  { id: 'papas_fritas', name: 'Papas Fritas Integradas 🍟' },
  { id: 'pina_asada', name: 'Piña Asada al Carbón 🍍' },
  { id: 'cebolla_asada', name: 'Cebolla Asada a la Parrilla 🔥' },
];

const PANCHO_DRESSINGS = [
  { id: 'miel_habanero', name: 'Miel de Habanero 🍯🌶️' },
  { id: 'chimichurri', name: 'Chimichurri Casero 🌿' },
  { id: 'salsa_criolla', name: 'Salsa Criolla Argentina 🧅' },
  { id: 'ketchup', name: 'Kétchup Tradicional 🥫' },
  { id: 'bbq', name: 'Salsa BBQ Ahumada 🍖' },
  { id: 'mayo_habanero', name: 'Mayo Habanero 🌶️' },
  { id: 'mayo_jalapeno', name: 'Mayo Jalapeño 🫑' },
  { id: 'salsa_secreta', name: 'Salsa Secreta del Che 🤫' },
  { id: 'mostaza', name: 'Mostaza Amarilla 🟡' },
];

// ── Extras opcionales para Choripanes y Burgers ──
const EXTRAS_PARRILLA: CustomOption[] = [
  { name: 'Tocino Asado Crujiente', price: 15 },
  { name: 'Queso Gouda Fundido Extra', price: 15 },
  { name: 'Queso Provolone Fundido', price: 18 },
  { name: 'Piña Asada al Carbón', price: 12 },
  { name: 'Chimichurri Casero Extra', price: 10 },
  { name: 'Salsa Criolla Extra', price: 10 },
];

const SAUCE_PREFERENCES = [
  { id: 'chimichurri', name: 'Chimichurri Casero 🌿', label: 'Tradicional Argentino' },
  { id: 'mayo_jalapeno', name: 'Mayo Jalapeño 🫑', label: 'Cremoso y Suave' },
  { id: 'miel_habanero', name: 'Miel de Habanero 🍯🌶️', label: 'Agridulce Picosito' },
  { id: 'criolla', name: 'Salsa Criolla 🧅', label: 'Fresca y Sazonada' },
  { id: 'sin_picante', name: 'Sin Aderezos Picosos 🚫', label: 'Al Natural' },
];

const FLAVORS_COCA = ['Coca Cola Original', 'Coca Cola Sin Azúcar', 'Sidral Mundet', 'Sprite', 'Fanta Naranja'];
const FLAVORS_BOING = ['Jugo de Mango', 'Jugo de Guayaba', 'Jugo de Manzana', 'Jugo de Uva', 'Jugo de Durazno'];

// ── CATÁLOGO DE PRODUCTOS (Menú Oficial Pinche Che) ──
const PRODUCTS: Product[] = [
  // ── P' EMPEZAR CHE ──
  {
    id: 'papas-poutine',
    name: 'PINCHES PAPAS POUTINE',
    description: 'Mix de papas fritas crocantes, con chorizo argentino asado a la leña, bañado en abundante queso fundido y salsas especiales de la casa.',
    price: 149,
    category: 'empezar',
    badge: '🔥 Especialidad del Che',
    featured: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'criollita',
    name: 'CRIOLLITA (Empanada de Carne)',
    description: 'Jugosita y sabrosa empanada de carne frita estilo tradicional argentino, sazonada a la perfección y servida con chimichurri casero.',
    price: 33,
    category: 'empezar',
    badge: '🇦🇷 Tradicional',
    featured: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'choclo',
    name: 'CHOCLO (Empanada de Elote)',
    description: 'Cremosita y quesosa empanada frita rellena de elote dulce y generoso queso gouda fundido.',
    price: 33,
    category: 'empezar',
    badge: '🧀 Quesosa',
    image: 'https://images.unsplash.com/photo-1604467794349-0b74285de7e7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'calabresa',
    name: 'CALABRESA (Empanada Pepperoni)',
    description: 'Rellena de pepperoni artesanal de Chipilo y abundante queso mozzarella fundido súper elástico.',
    price: 42,
    category: 'empezar',
    badge: '🍕 Sabor Único',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fritas-caseras',
    name: 'FRITAS CASERAS (450g)',
    description: '450 grs de crujientes papas fritas caseras recién sazonadas, servidas con su salsa especial de la casa.',
    price: 79,
    category: 'empezar',
    badge: '🍟 450 Gramos',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'papas-che',
    name: 'PAPAS CHE (450g Ajo Parmesano)',
    description: '450 grs de papitas gajos caseras sazonadas al sartén con mantequilla de ajo y queso parmesano gratinado.',
    price: 89,
    category: 'empezar',
    badge: '🧀 Ajo Parmesano',
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1630384060421-cb3f20e0649d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pinche-papas',
    name: 'PINCHE PAPAS (Bolitas de Queso)',
    description: 'Deliciosas, cremositas, quesosas y crocantes por fuera... bolitas empanizadas de papa con queso fundido y salsas de la casa.',
    price: 99,
    category: 'empezar',
    badge: '⭐ Favorito Botanero',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  },

  // ── DE LA PARRILLA ──
  {
    id: 'pinche-pancho',
    name: 'EL PINCHE PANCHO',
    description: 'Espectacular hot dog jumbo argentino en suave pan artesanal. Ármalo como vos querés eligiendo 3 toppings y 2 salsas de elección.',
    price: 89,
    category: 'parrilla',
    badge: '🌭 Ármalo a Tu Gusto',
    canCustomize: true,
    customType: 'pancho',
    featured: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'choripan-canchero',
    name: 'CHORIPÁN CANCHERO',
    description: 'Sabrosito chorizo argentino a la parrilla de carbón, pan doradito, abundante chimichurri casero y mayonesa de jalapeño.',
    price: 89,
    category: 'parrilla',
    badge: '🇦🇷 Clásico Canchero',
    canCustomize: true,
    customType: 'choripan',
    featured: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'el-completo',
    name: 'EL COMPLETO (Choripán Recargado)',
    description: 'Nuestro delicioso choripán canchero recargado con queso gouda fundido, tocino asado, cebollita crocante, chimichurri casero, lechuga y tomate.',
    price: 119,
    category: 'parrilla',
    badge: '🔥 El Más Pedido',
    canCustomize: true,
    customType: 'choripan',
    featured: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'choriburger-arg',
    name: 'CHORIBURGER.ARG',
    description: 'Delicioso medallón de carne de 125 grs a la parrilla, queso provolone fundido, salsa criolla y mayonesa de jalapeño en suave pan de papa.',
    price: 99,
    category: 'parrilla',
    badge: '🧀 Queso Provolone',
    canCustomize: true,
    customType: 'burger',
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'che-burger',
    name: 'CHE BURGER',
    description: 'Sabrosita burger de 125 grs de carne a la parrilla, queso gouda fundido, mayonesa de jalapeño, lechuga, tomate y pan esponjosito de mantequilla.',
    price: 79,
    category: 'parrilla',
    badge: '🍔 Clásica Jugosa',
    canCustomize: true,
    customType: 'burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pinche-che-burger',
    name: 'PINCHE CHE BURGER',
    description: 'La Che Burger deliciosa recargada con tocino asado crujiente, miel de habanero agridulce y papas fritas integradas.',
    price: 99,
    category: 'parrilla',
    badge: '🥓 Tocino + Miel Habanero',
    canCustomize: true,
    customType: 'burger',
    featured: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pinche-che-xx',
    name: 'PINCHE CHE XX (250g Rellena)',
    description: 'Sabrosa burger de 250 grs de carne, RELLENA de queso fundido, BAÑADA en abundante queso fundido extra, tocino asado, lechuga, tomate y miel de habanero.',
    price: 166,
    category: 'parrilla',
    badge: '👑 La Reyna (250g Rellena)',
    canCustomize: true,
    customType: 'burger',
    featured: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3a99?auto=format&fit=crop&w=800&q=80',
  },

  // ── LOS POSTRES ──
  {
    id: 'flancito',
    name: 'FLANCITO TUN TUN',
    description: 'Cremosito y sabroso flan napolitano artesanal preparado diariamente con su toque de caramelo de vainilla.',
    price: 59,
    category: 'postres',
    badge: '🍮 Casero Napolitano',
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'brownie',
    name: 'BROWNIE TRIPLE CHOCOLATE',
    description: 'De triple chocolate artesanal, húmedo, cremosito y bien chocolatoso.',
    price: 59,
    category: 'postres',
    badge: '🍫 Triple Chocolate',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'oreo-cheesecake',
    name: 'OREO CHEESECAKE',
    description: 'Cremosita y dulce tarta de queso estilo New York con trocitos crujientes de galletero Oreo.',
    price: 59,
    category: 'postres',
    badge: '🍰 Estilo New York',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
  },

  // ── EL CHUPE ──
  {
    id: 'coca-cola',
    name: 'REFRESCOS COCA-COLA (355ml)',
    description: 'Refresco bien helado en lata de 355 ml. Elige tu sabor favorito.',
    price: 26,
    category: 'bebidas',
    badge: '🥤 355 ml',
    canCustomize: true,
    customType: 'refresco',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'boing',
    name: 'JUGOS BOING (500ml)',
    description: 'Delicioso jugo de fruta tradicional bien helado en envase de 500 ml.',
    price: 26,
    category: 'bebidas',
    badge: '🧃 500 ml',
    canCustomize: true,
    customType: 'boing',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'agua-sabor',
    name: 'AGUA DE SABOR DEL DÍA',
    description: 'Fresca y natural, preparada en casa todos los días con fruta fresca de temporada.',
    price: 20,
    category: 'bebidas',
    badge: '💧 Fresca del Día',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fernet-coca',
    name: 'FERNET BRANCA CON COCA',
    description: 'El clásico trago patrio argentino. Fernet Branca helado servido con Coca-Cola y mucho hielo.',
    price: 85,
    category: 'bebidas',
    badge: '🇦🇷 Trago Patrio',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  },
];

export default function PincheCheMenu() {
  // ── ESTADOS ──
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pinche_che_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pinche_che_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<1 | 2>(1);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  // ── MODAL DE PERSONALIZACIÓN ──
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedDressings, setSelectedDressings] = useState<string[]>([]);
  const [selectedSauce, setSelectedSauce] = useState<string>('chimichurri');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('Coca Cola Original');
  const [selectedExtras, setSelectedExtras] = useState<CustomOption[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');

  // ── CAMPOS DE FORMULARIO DE PEDIDO ──
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'domicilio' | 'pickup'>('domicilio');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');
  const [cashAmount, setCashAmount] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: boolean; phone?: boolean; address?: boolean }>({});

  // Guardar favoritos y carrito
  useEffect(() => {
    try {
      localStorage.setItem('pinche_che_favs', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('pinche_che_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ── FILTRADO DE PRODUCTOS ──
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory =
        selectedCategory === 'todos'
          ? true
          : selectedCategory === 'favoritos'
          ? favorites.includes(p.id)
          : p.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.badge && p.badge.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, favorites]);

  // ── ABRIR MODAL DE PERSONALIZACIÓN ──
  const openCustomizer = (product: Product) => {
    setCustomizingProduct(product);
    setSpecialNotes('');
    setSelectedExtras([]);

    if (product.customType === 'pancho') {
      setSelectedToppings(['cebolla_crocante', 'elote', 'pico_gallo']);
      setSelectedDressings(['chimichurri', 'miel_habanero']);
    } else if (product.customType === 'refresco') {
      setSelectedFlavor(FLAVORS_COCA[0]);
    } else if (product.customType === 'boing') {
      setSelectedFlavor(FLAVORS_BOING[0]);
    } else {
      setSelectedSauce('chimichurri');
    }
  };

  const toggleTopping = (id: string) => {
    if (selectedToppings.includes(id)) {
      setSelectedToppings((prev) => prev.filter((t) => t !== id));
    } else {
      if (selectedToppings.length >= 3) return; // máx 3 toppings
      setSelectedToppings((prev) => [...prev, id]);
    }
  };

  const toggleDressing = (id: string) => {
    if (selectedDressings.includes(id)) {
      setSelectedDressings((prev) => prev.filter((d) => d !== id));
    } else {
      if (selectedDressings.length >= 2) return; // máx 2 aderezos
      setSelectedDressings((prev) => [...prev, id]);
    }
  };

  const toggleExtra = (extra: CustomOption) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.name === extra.name)
        ? prev.filter((e) => e.name !== extra.name)
        : [...prev, extra]
    );
  };

  // ── AGREGAR AL CARRITO ──
  const handleAddToCart = (product: Product, isDirect = false) => {
    if (product.canCustomize && !isDirect) {
      openCustomizer(product);
      return;
    }

    let unitPrice = product.price;
    let extrasList: CustomOption[] = [];
    let toppingsList: string[] = [];
    let dressingsList: string[] = [];
    let sauce: string | undefined = undefined;
    let flavor: string | undefined = undefined;

    if (!isDirect && customizingProduct?.id === product.id) {
      extrasList = selectedExtras;
      const extrasCost = extrasList.reduce((acc, curr) => acc + curr.price, 0);
      unitPrice += extrasCost;

      if (product.customType === 'pancho') {
        toppingsList = selectedToppings.map(
          (tId) => PANCHO_TOPPINGS.find((pt) => pt.id === tId)?.name || tId
        );
        dressingsList = selectedDressings.map(
          (dId) => PANCHO_DRESSINGS.find((pd) => pd.id === dId)?.name || dId
        );
      } else if (product.customType === 'refresco' || product.customType === 'boing') {
        flavor = selectedFlavor;
      } else {
        sauce = SAUCE_PREFERENCES.find((s) => s.id === selectedSauce)?.name || selectedSauce;
      }
    }

    const lineId = `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const newItem: CartItem = {
      lineId,
      productId: product.id,
      name: product.name,
      basePrice: product.price,
      unitPrice,
      quantity: 1,
      image: product.image,
      category: product.category,
      selectedToppings: toppingsList.length > 0 ? toppingsList : undefined,
      selectedDressings: dressingsList.length > 0 ? dressingsList : undefined,
      selectedSauce: sauce,
      selectedFlavor: flavor,
      extras: extrasList.length > 0 ? extrasList : undefined,
      specialNotes: specialNotes.trim() ? specialNotes.trim() : undefined,
    };

    setCart((prev) => [...prev, newItem]);
    setCustomizingProduct(null);
    setShowSuccessToast(`¡${product.name} agregado al carrito!`);
    setTimeout(() => setShowSuccessToast(null), 2500);
  };

  const updateCartQuantity = (lineId: string, delta: number) => {
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

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const totalCartItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Costo de empaque / envío automático
  const deliveryFee = deliveryType === 'domicilio' ? 15 : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  // ── ENVIAR PEDIDO POR WHATSAPP ──
  const handleWhatsAppCheckout = () => {
    const errors: { name?: boolean; phone?: boolean; address?: boolean } = {};
    if (!customerName.trim()) errors.name = true;
    if (!customerPhone.trim()) errors.phone = true;
    if (deliveryType === 'domicilio' && !customerAddress.trim()) errors.address = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    let msg = `🔥 *NUEVO PEDIDO — PINCHE CHE PARRILLA* 🔥\n\n`;
    msg += `👤 *Cliente:* ${customerName.trim()}\n`;
    msg += `📱 *WhatsApp:* ${customerPhone.trim()}\n`;
    msg += `🛵 *Entrega:* ${deliveryType === 'domicilio' ? 'Servicio a Domicilio' : 'Pickup en Sucursal'}\n`;
    if (deliveryType === 'domicilio') {
      msg += `📍 *Dirección:* ${customerAddress.trim()}\n`;
    }
    msg += `💳 *Pago:* ${
      paymentMethod === 'efectivo'
        ? `Efectivo${cashAmount ? ` (Paga con $${cashAmount})` : ''}`
        : paymentMethod === 'transferencia'
        ? 'Transferencia Bancaria (BBVA)'
        : 'Tarjeta en Entrega'
    }\n\n`;

    msg += `🛒 *DETALLE DEL PEDIDO:* \n`;
    cart.forEach((item, idx) => {
      msg += `\n*${idx + 1}. ${item.quantity}x ${item.name}* — $${item.unitPrice * item.quantity}\n`;
      if (item.selectedFlavor) msg += `   • Sabor: ${item.selectedFlavor}\n`;
      if (item.selectedToppings && item.selectedToppings.length > 0) {
        msg += `   • Toppings: ${item.selectedToppings.join(', ')}\n`;
      }
      if (item.selectedDressings && item.selectedDressings.length > 0) {
        msg += `   • Aderezos: ${item.selectedDressings.join(', ')}\n`;
      }
      if (item.selectedSauce) msg += `   • Aderezo: ${item.selectedSauce}\n`;
      if (item.extras && item.extras.length > 0) {
        msg += `   • Extras: ${item.extras.map((e) => `${e.name} (+$${e.price})`).join(', ')}\n`;
      }
      if (item.specialNotes) msg += `   • Nota: "${item.specialNotes}"\n`;
    });

    msg += `\n─────────────────────\n`;
    msg += `💵 *Subtotal:* $${cartSubtotal}\n`;
    if (deliveryFee > 0) msg += `🛵 *Envío Domicilio:* $${deliveryFee}\n`;
    msg += `💰 *TOTAL A PAGAR:* *$${grandTotal} MXN*\n\n`;
    msg += `¡Gracias Che! Quedo a la espera de confirmación. 🥩🇦🇷`;

    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${clientConfig.phonePrimary}?text=${encoded}`;

    setTimeout(() => {
      setIsSubmitting(false);
      window.location.href = waUrl;
    }, 500);
  };

  const copyCLABE = () => {
    navigator.clipboard.writeText(bankInfo.clabe.replace(/\s/g, ''));
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#141210] text-[#FDFBF7] font-sans relative selection:bg-[#E0531B] selection:text-white pb-24">
      {/* Toast de confirmación */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#E0531B] text-white font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-white/20"
          >
            <CheckCircle2 size={20} />
            <span className="text-sm">{showSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SUPERIOR FLOTANTE */}
      <header className="sticky top-0 z-40 bg-[#141210]/92 backdrop-blur-xl border-b border-[#E0531B]/20 shadow-xl transition-all">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-3">
            <img
              src={pincheLogo}
              alt="Pinche Che Logo"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#E0531B] shadow-md"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <h1 className="font-black text-base md:text-lg tracking-wider text-white uppercase leading-none flex items-center gap-1.5">
                PINCHE CHE <span className="text-xs px-2 py-0.5 rounded-full bg-[#E0531B] text-white font-bold">PARRILLA</span>
              </h1>
              <p className="text-[11px] text-[#A39C94] font-medium hidden sm:block">
                Choripanes Cancheros & Burgers a la Parrilla 🇦🇷
              </p>
            </div>
          </div>

          {/* Acciones de Header */}
          <div className="flex items-center gap-2">
            {/* Botón Favoritos */}
            <button
              onClick={() => setSelectedCategory(selectedCategory === 'favoritos' ? 'todos' : 'favoritos')}
              className={`p-2.5 rounded-full border transition-all flex items-center gap-1.5 ${
                selectedCategory === 'favoritos'
                  ? 'bg-[#E0531B] text-white border-[#E0531B]'
                  : 'bg-[#1D1A17] text-[#A39C94] border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              <Heart size={18} fill={selectedCategory === 'favoritos' ? 'currentColor' : 'none'} />
              {favorites.length > 0 && (
                <span className="text-xs font-bold bg-white text-[#141210] px-1.5 py-0.2 rounded-full">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Botón Carrito Header */}
            <button
              onClick={() => {
                setCartStep(1);
                setIsCartOpen(true);
              }}
              className="relative bg-gradient-to-r from-[#E0531B] to-[#F59E0B] text-white px-4 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#E0531B]/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <ShoppingBag size={18} />
              <span className="hidden xs:inline">Carrito</span>
              {totalCartItems > 0 && (
                <span className="bg-white text-[#E0531B] text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO BANNER ATMÓSFERA PARRILLA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1D1A17] to-[#141210] border-b border-white/5 py-8 md:py-12">
        {/* Glowing radial background & micro-particles */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#E0531B_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#E0531B]/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Chispas flotantes animadas (Atmósfera de brasas vivas) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-10, -70, -120],
              x: [0, i % 2 === 0 ? 25 : -25, i % 2 === 0 ? -15 : 15],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.2],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
            className="absolute pointer-events-none rounded-full bg-gradient-to-t from-[#E0531B] to-[#F59E0B] shadow-[0_0_8px_#F59E0B]"
            style={{
              width: `${3 + (i % 3)}px`,
              height: `${3 + (i % 3)}px`,
              bottom: `${15 + i * 10}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* Imagen Hero con marco de fuego */}
          <div className="w-full md:w-1/2 relative rounded-3xl overflow-hidden border-2 border-[#E0531B]/40 shadow-[0_15px_40px_rgba(224,83,27,0.25)] group">
            <img
              src={pincheHero}
              alt="Pinche Che Parrilla Feast"
              className="w-full h-56 sm:h-72 object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent opacity-85" />
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-[#141210]/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                ABIERTO HOY · 1:00 PM – 11:00 PM
              </span>
              <span className="text-[11px] font-bold text-[#F59E0B] flex items-center gap-1">
                <Flame size={14} className="text-[#E0531B]" /> Fuego a la Leña
              </span>
            </div>
          </div>

          {/* Texto y Badges */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0531B]/20 border border-[#E0531B]/40 text-[#F59E0B] text-xs font-black uppercase tracking-wider shadow-sm">
              <span>🇦🇷 Auténtica Parrilla Argentina Urbana</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none drop-shadow-sm">
              CHORIPANES & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0531B] via-[#F59E0B] to-[#F59E0B]">BURGERS</span>
            </h2>

            <p className="text-[#A39C94] text-xs sm:text-sm leading-relaxed max-w-lg">
              Empanadas frita jugosita, choripan canchero con chimichurri casero, burgers 100% res a la parrilla y papas poutine cargadas. ¡Sabor argentino artesanal!
            </p>

            {/* Badges de Confianza */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="bg-[#231F1C] border border-white/10 p-2.5 rounded-2xl text-center shadow-md">
                <span className="text-xs font-bold text-white block">🥩 100% Res</span>
                <span className="text-[10px] text-[#A39C94]">A la parrilla</span>
              </div>
              <div className="bg-[#231F1C] border border-white/10 p-2.5 rounded-2xl text-center shadow-md">
                <span className="text-xs font-bold text-white block">🌿 Chimichurri</span>
                <span className="text-[10px] text-[#A39C94]">Receta casera</span>
              </div>
              <div className="bg-[#231F1C] border border-white/10 p-2.5 rounded-2xl text-center shadow-md">
                <span className="text-xs font-bold text-white block">🌭 Custom</span>
                <span className="text-[10px] text-[#A39C94]">Pinche Pancho</span>
              </div>
              <div className="bg-[#231F1C] border border-white/10 p-2.5 rounded-2xl text-center shadow-md">
                <span className="text-xs font-bold text-white block">🛵 Domicilio</span>
                <span className="text-[10px] text-[#A39C94]">Envío rápido</span>
              </div>
            </div>

            {/* Spotlight Combo Platillo Estrella */}
            <div className="pt-2">
              <button
                onClick={() => {
                  const item = PRODUCTS.find((p) => p.id === 'el-completo');
                  if (item) openCustomizer(item);
                }}
                className="w-full bg-gradient-to-r from-[#231F1C] to-[#2A2521] hover:from-[#2A2521] hover:to-[#332C27] border-2 border-[#E0531B] p-3 rounded-2xl transition-all flex items-center justify-between gap-3 group text-left shadow-[0_0_20px_rgba(224,83,27,0.25)] active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#E0531B]/50 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=300&q=80"
                      alt="El Completo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-[#F59E0B] uppercase tracking-wider">
                        🔥 Más Vendido
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-white group-hover:text-[#E0531B] transition-colors line-clamp-1">
                      EL COMPLETO (Gouda + Tocino) — $119
                    </span>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-[#E0531B] to-[#F59E0B] text-white px-3.5 py-2 rounded-xl font-black text-xs whitespace-nowrap shadow-md flex items-center gap-1">
                  Pedir <ChevronRight size={14} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BUSCADOR Y CATEGORÍAS (Sticky en Mobile para Máxima Comodidad) */}
      <div className="sticky top-[58px] z-30 bg-[#141210]/95 backdrop-blur-xl border-b border-white/5 py-3 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          {/* Buscador interactivo */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A39C94]" size={18} />
            <input
              type="text"
              placeholder="Buscar choripán, empanadas, burgers, postres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1D1A17] border border-white/10 focus:border-[#E0531B] text-white placeholder-[#A39C94] text-xs sm:text-sm pl-11 pr-10 py-3 rounded-2xl outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39C94] hover:text-white p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Chips de Categorías con Scroll Snap Suave */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
            {[
              { id: 'todos', label: 'Ver Todo', icon: '🍽️' },
              { id: 'empezar', label: "P' Empezar Che", icon: '🥟' },
              { id: 'parrilla', label: 'De la Parrilla', icon: '🔥' },
              { id: 'postres', label: 'Los Postres', icon: '🍮' },
              { id: 'bebidas', label: 'El Chupe', icon: '🥤' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as CategoryId)}
                className={`snap-start whitespace-nowrap px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 border ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#E0531B] to-[#F59E0B] text-white border-transparent shadow-lg shadow-[#E0531B]/30 scale-105'
                    : 'bg-[#1D1A17] text-[#A39C94] border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID DE PRODUCTOS */}
      <main className="max-w-5xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-lg text-white uppercase tracking-wider flex items-center gap-2">
            <span>
              {selectedCategory === 'todos'
                ? 'Menú Completo'
                : selectedCategory === 'empezar'
                ? "Entradas — P' Empezar Che"
                : selectedCategory === 'parrilla'
                ? 'Parrilla & Burgers'
                : selectedCategory === 'postres'
                ? 'Postres Caseros'
                : selectedCategory === 'bebidas'
                ? 'Bebidas & Chupe'
                : 'Mis Favoritos'}
            </span>
            <span className="text-xs font-normal text-[#A39C94]">({filteredProducts.length} platillos)</span>
          </h3>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-[#1D1A17] border border-white/10 rounded-3xl p-10 text-center space-y-3">
            <span className="text-4xl">🔍</span>
            <p className="text-white font-bold text-sm">No encontramos platillos con esa búsqueda.</p>
            <p className="text-xs text-[#A39C94]">Intenta buscar otro término o cambiar de categoría.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
              }}
              className="mt-2 bg-[#E0531B] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Ver Todo el Menú
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredProducts.map((product) => {
              const isFav = favorites.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#231F1C] ring-1 ring-white/10 hover:ring-[#E0531B]/60 hover:shadow-[0_12px_35px_rgba(224,83,27,0.25)] rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-xl active:scale-[0.99]"
                >
                  {/* Card Media */}
                  <div className="relative h-44 overflow-hidden bg-[#141210]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#231F1C] via-transparent to-black/30" />

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#E0531B] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                        {product.badge}
                      </span>
                    )}

                    {/* Heart Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(product.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      <Heart
                        size={16}
                        fill={isFav ? '#E0531B' : 'none'}
                        className={isFav ? 'text-[#E0531B]' : 'text-white'}
                      />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-black text-sm text-white uppercase tracking-wide group-hover:text-[#F59E0B] transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#A39C94] leading-relaxed mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Card Footer Price & CTA */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div>
                        <span className="text-[10px] text-[#A39C94] uppercase block">Precio</span>
                        <span className="text-lg font-black text-[#F59E0B]">${product.price} MXN</span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-[#E0531B] hover:bg-[#F59E0B] text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                      >
                        {product.canCustomize ? (
                          <>
                            <Edit3 size={14} /> Personalizar
                          </>
                        ) : (
                          <>
                            <Plus size={14} /> Agregar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>

      {/* MODAL BOTTOM SHEET DE PERSONALIZACIÓN */}
      <AnimatePresence>
        {customizingProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-[#1D1A17] border border-white/10 sm:rounded-3xl rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#141210]">
                <div className="flex items-center gap-3">
                  <img
                    src={customizingProduct.image}
                    alt={customizingProduct.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E0531B]/40"
                  />
                  <div>
                    <h3 className="font-black text-sm text-white uppercase">{customizingProduct.name}</h3>
                    <span className="text-xs font-bold text-[#F59E0B]">${customizingProduct.price} MXN</span>
                  </div>
                </div>
                <button
                  onClick={() => setCustomizingProduct(null)}
                  className="p-2 text-[#A39C94] hover:text-white rounded-full bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body Scrollable */}
              <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* OPCIONES PARA EL PINCHE PANCHO */}
                {customizingProduct.customType === 'pancho' && (
                  <>
                    {/* Toppings max 3 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-black text-white uppercase flex items-center gap-1.5">
                          <span>1. Elige hasta 3 Toppings</span>
                          <span className="text-[10px] text-[#E0531B] font-bold">(*Incluidos)</span>
                        </label>
                        {selectedToppings.length === 3 ? (
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 animate-pulse">
                            ✅ ¡3/3 Elegidos!
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-[#F59E0B]">
                            ({selectedToppings.length}/3 elegidos)
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {PANCHO_TOPPINGS.map((top) => {
                          const isSel = selectedToppings.includes(top.id);
                          return (
                            <button
                              key={top.id}
                              onClick={() => toggleTopping(top.id)}
                              className={`p-2.5 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${
                                isSel
                                  ? 'bg-[#E0531B]/20 border-[#E0531B] text-white'
                                  : 'bg-[#231F1C] border-white/5 text-[#A39C94] hover:border-white/10'
                              }`}
                            >
                              <span>{top.name}</span>
                              {isSel ? <CheckCircle2 size={16} className="text-[#E0531B]" /> : <Plus size={14} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Aderezos max 2 */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="font-black text-white uppercase flex items-center gap-1.5">
                          <span>2. Elige hasta 2 Aderezos</span>
                          <span className="text-[10px] text-[#E0531B] font-bold">(*Incluidos)</span>
                        </label>
                        {selectedDressings.length === 2 ? (
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 animate-pulse">
                            ✅ ¡2/2 Elegidos!
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-[#F59E0B]">
                            ({selectedDressings.length}/2 elegidos)
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {PANCHO_DRESSINGS.map((dress) => {
                          const isSel = selectedDressings.includes(dress.id);
                          return (
                            <button
                              key={dress.id}
                              onClick={() => toggleDressing(dress.id)}
                              className={`p-2.5 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${
                                isSel
                                  ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-white'
                                  : 'bg-[#231F1C] border-white/5 text-[#A39C94] hover:border-white/10'
                              }`}
                            >
                              <span>{dress.name}</span>
                              {isSel ? <CheckCircle2 size={16} className="text-[#F59E0B]" /> : <Plus size={14} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* ADEREZO PREFERIDO PARA BURGERS & CHORIPANES */}
                {(customizingProduct.customType === 'burger' || customizingProduct.customType === 'choripan') && (
                  <div className="space-y-3">
                    <label className="font-black text-white uppercase block">
                      Aderezo / Salsa Principal Preferida
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {SAUCE_PREFERENCES.map((sauce) => (
                        <button
                          key={sauce.id}
                          onClick={() => setSelectedSauce(sauce.id)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                            selectedSauce === sauce.id
                              ? 'bg-[#E0531B]/20 border-[#E0531B] text-white font-bold'
                              : 'bg-[#231F1C] border-white/5 text-[#A39C94]'
                          }`}
                        >
                          <div>
                            <span className="block text-white font-bold">{sauce.name}</span>
                            <span className="text-[10px] text-[#A39C94]">{sauce.label}</span>
                          </div>
                          {selectedSauce === sauce.id && <CheckCircle2 size={18} className="text-[#E0531B]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SABOR PARA BEBIDAS */}
                {(customizingProduct.customType === 'refresco' || customizingProduct.customType === 'boing') && (
                  <div className="space-y-3">
                    <label className="font-black text-white uppercase block">Selecciona el Sabor</label>
                    <div className="grid grid-cols-1 gap-2">
                      {(customizingProduct.customType === 'refresco' ? FLAVORS_COCA : FLAVORS_BOING).map((flavor) => (
                        <button
                          key={flavor}
                          onClick={() => setSelectedFlavor(flavor)}
                          className={`p-3 rounded-xl border text-left font-bold flex items-center justify-between transition-all ${
                            selectedFlavor === flavor
                              ? 'bg-[#E0531B]/20 border-[#E0531B] text-white'
                              : 'bg-[#231F1C] border-white/5 text-[#A39C94]'
                          }`}
                        >
                          <span>{flavor}</span>
                          {selectedFlavor === flavor && <CheckCircle2 size={18} className="text-[#E0531B]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* EXTRAS DE LA PARRILLA */}
                {(customizingProduct.customType === 'burger' || customizingProduct.customType === 'choripan') && (
                  <div className="space-y-3 pt-2">
                    <label className="font-black text-white uppercase block">¿Deseas agregar Extras?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {EXTRAS_PARRILLA.map((extra) => {
                        const isSel = selectedExtras.some((e) => e.name === extra.name);
                        return (
                          <button
                            key={extra.name}
                            onClick={() => toggleExtra(extra)}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                              isSel
                                ? 'bg-[#E0531B]/20 border-[#E0531B] text-white font-bold'
                                : 'bg-[#231F1C] border-white/5 text-[#A39C94]'
                            }`}
                          >
                            <span>{extra.name}</span>
                            <span className="text-[#F59E0B] font-bold">+${extra.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* NOTAS ESPECIALES PARA COCINA */}
                <div className="space-y-2 pt-2">
                  <label className="font-black text-white uppercase block">Instrucciones Especiales para Cocina</label>
                  <textarea
                    placeholder="Ej. Término medio, sin tomate, verdura aparte..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-[#141210] border border-white/10 rounded-xl p-3 text-white placeholder-[#A39C94] outline-none focus:border-[#E0531B]"
                  />
                </div>
              </div>

              {/* Modal Footer Sticky */}
              <div className="p-4 bg-[#141210] border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-[#A39C94] block uppercase">Precio Total</span>
                  <span className="text-xl font-black text-[#F59E0B]">
                    $
                    {customizingProduct.price +
                      selectedExtras.reduce((acc, curr) => acc + curr.price, 0)}{' '}
                    MXN
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(customizingProduct, false)}
                  className="flex-1 bg-gradient-to-r from-[#E0531B] to-[#F59E0B] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  + Agregar al Carrito
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DRAWER CARRITO DE 2 PASOS */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-full max-w-md bg-[#1D1A17] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl"
            >
              {/* Cart Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#141210]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-[#E0531B]" size={20} />
                  <h3 className="font-black text-base text-white uppercase tracking-wider">
                    {cartStep === 1 ? 'Tu Carrito del Che' : 'Datos para WhatsApp'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-[#A39C94] hover:text-white rounded-full bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              {/* PASO 1: REVISIÓN DE PRODUCTOS */}
              {cartStep === 1 && (
                <>
                  <div className="p-4 overflow-y-auto flex-1 space-y-3">
                    {cart.length === 0 ? (
                      <div className="text-center py-16 space-y-3">
                        <span className="text-5xl">🛒</span>
                        <p className="text-white font-bold text-sm">Tu carrito está vacío che.</p>
                        <p className="text-xs text-[#A39C94]">¡Agrega unos choripanes o empanadas para empezar!</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.lineId}
                          className="bg-[#231F1C] border border-white/5 rounded-2xl p-3 flex gap-3 relative group"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover border border-white/10"
                          />
                          <div className="flex-1 text-xs space-y-1">
                            <div className="flex items-start justify-between">
                              <h4 className="font-bold text-white uppercase line-clamp-1">{item.name}</h4>
                              <button
                                onClick={() => updateCartQuantity(item.lineId, -99)}
                                className="text-[#A39C94] hover:text-red-400 p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            {/* Detalle de personalización */}
                            {item.selectedFlavor && (
                              <p className="text-[10px] text-[#F59E0B]">Sabor: {item.selectedFlavor}</p>
                            )}
                            {item.selectedToppings && (
                              <p className="text-[10px] text-[#A39C94]">Toppings: {item.selectedToppings.join(', ')}</p>
                            )}
                            {item.selectedDressings && (
                              <p className="text-[10px] text-[#A39C94]">Aderezos: {item.selectedDressings.join(', ')}</p>
                            )}
                            {item.selectedSauce && (
                              <p className="text-[10px] text-[#A39C94]">Aderezo: {item.selectedSauce}</p>
                            )}
                            {item.extras && (
                              <p className="text-[10px] text-[#E0531B]">
                                Extras: {item.extras.map((e) => e.name).join(', ')}
                              </p>
                            )}
                            {item.specialNotes && (
                              <p className="text-[10px] italic text-[#A39C94]">"{item.specialNotes}"</p>
                            )}

                            <div className="flex items-center justify-between pt-1">
                              <span className="font-bold text-[#F59E0B] text-sm">
                                ${item.unitPrice * item.quantity} MXN
                              </span>
                              <div className="flex items-center gap-2 bg-[#141210] px-2 py-1 rounded-lg border border-white/10">
                                <button
                                  onClick={() => updateCartQuantity(item.lineId, -1)}
                                  className="text-[#A39C94] hover:text-white"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="font-bold text-white text-xs px-1">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.lineId, 1)}
                                  className="text-[#A39C94] hover:text-white"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-4 bg-[#141210] border-t border-white/10 space-y-3">
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-[#A39C94]">
                          <span>Subtotal Productos</span>
                          <span className="text-white font-bold">${cartSubtotal} MXN</span>
                        </div>
                        <div className="flex justify-between text-[#A39C94]">
                          <span>Empaque / Servicio</span>
                          <span className="text-emerald-400 font-bold">¡GRATIS!</span>
                        </div>
                        <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/5">
                          <span>TOTAL</span>
                          <span className="text-[#F59E0B] text-base">${cartSubtotal} MXN</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setCartStep(2)}
                        className="w-full bg-gradient-to-r from-[#E0531B] to-[#F59E0B] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        Siguiente: Datos de Entrega <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* PASO 2: DATOS DE ENTREGA Y PAGO */}
              {cartStep === 2 && (
                <>
                  <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
                    {/* Botón Volver a Paso 1 */}
                    <button
                      onClick={() => setCartStep(1)}
                      className="text-[#A39C94] hover:text-white font-bold flex items-center gap-1 text-[11px]"
                    >
                      <ChevronLeft size={14} /> Volver a revisar productos
                    </button>

                    {/* Nombre obligatorio */}
                    <div className="space-y-1">
                      <label className="font-bold text-white uppercase block">
                        Tu Nombre * {formErrors.name && <span className="text-red-400 text-[10px]">(Requerido)</span>}
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Che Guevara / Martin"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (formErrors.name) setFormErrors((p) => ({ ...p, name: false }));
                        }}
                        className={`w-full bg-[#141210] border ${
                          formErrors.name ? 'border-red-500' : 'border-white/10 focus:border-[#E0531B]'
                        } rounded-xl p-3 text-white placeholder-[#A39C94] outline-none`}
                      />
                    </div>

                    {/* Teléfono obligatorio */}
                    <div className="space-y-1">
                      <label className="font-bold text-white uppercase block">
                        WhatsApp de Contacto * {formErrors.phone && <span className="text-red-400 text-[10px]">(Requerido)</span>}
                      </label>
                      <input
                        type="tel"
                        placeholder="Ej. 55 1234 5678"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: false }));
                        }}
                        className={`w-full bg-[#141210] border ${
                          formErrors.phone ? 'border-red-500' : 'border-white/10 focus:border-[#E0531B]'
                        } rounded-xl p-3 text-white placeholder-[#A39C94] outline-none`}
                      />
                    </div>

                    {/* Tipo de Entrega */}
                    <div className="space-y-1">
                      <label className="font-bold text-white uppercase block">Tipo de Entrega</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDeliveryType('domicilio')}
                          className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                            deliveryType === 'domicilio'
                              ? 'bg-[#E0531B]/20 border-[#E0531B] text-white'
                              : 'bg-[#141210] border-white/10 text-[#A39C94]'
                          }`}
                        >
                          <Bike size={16} /> Domicilio
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryType('pickup')}
                          className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                            deliveryType === 'pickup'
                              ? 'bg-[#E0531B]/20 border-[#E0531B] text-white'
                              : 'bg-[#141210] border-white/10 text-[#A39C94]'
                          }`}
                        >
                          <Store size={16} /> Pickup Sucursal
                        </button>
                      </div>
                    </div>

                    {/* Dirección si es Domicilio */}
                    {deliveryType === 'domicilio' && (
                      <div className="space-y-1">
                        <label className="font-bold text-white uppercase block">
                          Dirección Completa * {formErrors.address && <span className="text-red-400 text-[10px]">(Requerido)</span>}
                        </label>
                        <input
                          type="text"
                          placeholder="Calle, número, colonia, referencias..."
                          value={customerAddress}
                          onChange={(e) => {
                            setCustomerAddress(e.target.value);
                            if (formErrors.address) setFormErrors((p) => ({ ...p, address: false }));
                          }}
                          className={`w-full bg-[#141210] border ${
                            formErrors.address ? 'border-red-500' : 'border-white/10 focus:border-[#E0531B]'
                          } rounded-xl p-3 text-white placeholder-[#A39C94] outline-none`}
                        />
                      </div>
                    )}

                    {/* Método de Pago */}
                    <div className="space-y-2">
                      <label className="font-bold text-white uppercase block">Método de Pago</label>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('efectivo')}
                          className={`w-full p-3 rounded-xl border text-left font-bold flex items-center justify-between transition-all ${
                            paymentMethod === 'efectivo'
                              ? 'bg-[#E0531B]/20 border-[#E0531B] text-white'
                              : 'bg-[#141210] border-white/10 text-[#A39C94]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Wallet size={16} /> Efectivo contra entrega
                          </span>
                          {paymentMethod === 'efectivo' && <CheckCircle2 size={16} className="text-[#E0531B]" />}
                        </button>

                        {paymentMethod === 'efectivo' && (
                          <div className="pl-4">
                            <input
                              type="text"
                              placeholder="¿Con cuánto vas a pagar? (Ej. $500)"
                              value={cashAmount}
                              onChange={(e) => setCashAmount(e.target.value)}
                              className="w-full bg-[#141210] border border-white/10 rounded-xl p-2.5 text-white placeholder-[#A39C94] outline-none text-xs"
                            />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('transferencia')}
                          className={`w-full p-3 rounded-xl border text-left font-bold flex items-center justify-between transition-all ${
                            paymentMethod === 'transferencia'
                              ? 'bg-[#E0531B]/20 border-[#E0531B] text-white'
                              : 'bg-[#141210] border-white/10 text-[#A39C94]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Landmark size={16} /> Transferencia Bancaria
                          </span>
                          {paymentMethod === 'transferencia' && <CheckCircle2 size={16} className="text-[#E0531B]" />}
                        </button>

                        {paymentMethod === 'transferencia' && (
                          <div className="p-3 bg-[#141210] border border-white/10 rounded-xl space-y-2 text-[11px]">
                            <p className="font-bold text-[#F59E0B]">Datos de Transferencia BBVA:</p>
                            <p className="text-white">Titular: {bankInfo.accountHolder}</p>
                            <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg font-mono">
                              <span className="text-white">{bankInfo.clabe}</span>
                              <button
                                type="button"
                                onClick={copyCLABE}
                                className="text-[#E0531B] hover:text-white font-bold flex items-center gap-1"
                              >
                                {copiedBank ? <Check size={14} /> : <Copy size={14} />}
                                {copiedBank ? 'Copiado' : 'Copiar'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="p-4 bg-[#141210] border-t border-white/10 space-y-2">
                    <div className="flex justify-between text-sm font-black text-white">
                      <span>TOTAL PEDIDO</span>
                      <span className="text-[#F59E0B] text-base">${grandTotal} MXN</span>
                    </div>

                    <button
                      onClick={handleWhatsAppCheckout}
                      disabled={isSubmitting}
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={18} />
                      {isSubmitting ? 'Preparando pedido...' : '🚀 ENVIAR PEDIDO POR WHATSAPP'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BARRA FLOTANTE DE CARRITO MÓVIL (Thumb-friendly CRO) */}
      <AnimatePresence>
        {totalCartItems > 0 && !isCartOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto"
          >
            <button
              onClick={() => {
                setCartStep(1);
                setIsCartOpen(true);
              }}
              className="w-full bg-gradient-to-r from-[#E0531B] via-[#E0531B] to-[#F59E0B] text-white p-3.5 rounded-2xl shadow-[0_10px_30px_rgba(224,83,27,0.5)] flex items-center justify-between font-bold border border-white/25 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white text-[#E0531B] font-black text-xs w-7 h-7 rounded-xl flex items-center justify-center shadow">
                  {totalCartItems}
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-wider text-white/80 block leading-none">Ver Carrito</span>
                  <span className="text-sm font-black text-white leading-tight">Pedir por WhatsApp 🥩</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm font-black text-white">
                <span>${grandTotal} MXN</span>
                <ChevronRight size={18} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER OFICIAL (3 Columnas Datos Cliente) */}
      <footer className="mt-16 bg-[#181513] border-t border-white/10 text-[#A39C94] text-xs">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Datos Cliente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src={pincheLogo}
                alt="Pinche Che Logo"
                className="w-8 h-8 rounded-full border border-[#E0531B]"
              />
              <h4 className="font-black text-white text-base uppercase">PINCHE CHE</h4>
            </div>
            <p className="text-xs leading-relaxed">
              Auténtica Parrilla Argentina Urbana. Choripanes cancheros con chimichurri casero, empanadas artesanales fritas, burgers 100% res y papas poutine cargadas.
            </p>
            <span className="inline-block text-[11px] font-bold text-[#F59E0B] bg-[#E0531B]/15 px-3 py-1 rounded-full border border-[#E0531B]/30">
              {clientConfig.badgeQuality}
            </span>
          </div>

          {/* Col 2: Horarios y Ubicación */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-sm border-b border-white/10 pb-1">
              Horario & Servicio
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-[#E0531B]" />
                <span>{clientConfig.hours}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-[#E0531B] mt-0.5" />
                <span>{clientConfig.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Bike size={14} className="text-[#E0531B]" />
                <span>Servicio a Domicilio & Pickup en Sucursal</span>
              </li>
            </ul>

            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-[11px] text-[#A39C94] hover:text-white underline pt-2 block"
            >
              Aviso de Privacidad (LFPDPPP)
            </button>
          </div>

          {/* Col 3: Contacto & Redes */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-sm border-b border-white/10 pb-1">
              Pedidos & Contacto
            </h4>
            <p className="text-xs">¡Haz tu pedido en línea o contáctanos directamente!</p>
            <a
              href={`https://wa.me/${clientConfig.phonePrimary}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md hover:brightness-110 transition-all"
            >
              <MessageCircle size={16} /> WhatsApp: {clientConfig.phonePrimaryFormatted}
            </a>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={clientConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#E0531B] text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <Share2 size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Línea final crédito IMAGINE & STAMP */}
        <div className="border-t border-white/5 py-4 text-center text-[11px] text-[#A39C94]">
          <p>
            © {new Date().getFullYear()} PINCHE CHE PARRILLA ARGENTINA. Todos los derechos reservados.
          </p>
          <p className="mt-1 font-semibold text-white/80">
            Diseñado con ❤️ por{' '}
            <a
              href="https://imagineandstamp.site"
              target="_blank"
              rel="noreferrer"
              className="text-[#E0531B] hover:underline"
            >
              IMAGINE & STAMP
            </a>
          </p>
        </div>
      </footer>

      {/* MODAL AVISO DE PRIVACIDAD */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1D1A17] border border-white/10 rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-4 text-xs text-[#A39C94]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-black text-white text-sm uppercase">Aviso de Privacidad (LFPDPPP)</h3>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-1 text-[#A39C94] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="leading-relaxed">
                PINCHE CHE PARRILLA ARGENTINA es responsable del tratamiento de los datos personales (nombre, teléfono y dirección) recopilados a través de esta plataforma digital únicamente con la finalidad de procesar, preparar y entregar su pedido por WhatsApp o en sucursal.
              </p>
              <p className="leading-relaxed">
                Sus datos no serán transferidos a terceros ni utilizados con fines de prospección comercial sin su consentimiento expreso. Para consultar sus derechos ARCO, contáctenos directamente vía WhatsApp.
              </p>

              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full bg-[#E0531B] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs"
              >
                Entendido / Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
