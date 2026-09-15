// ═══════════════════════════════════════════════════════════════════════════
// MESA JAROCHA · MARISCOS & SABOR COSTERO — Menú Digital de Alta Gama
// Especialidades en mariscos frescos, mariscadas gourmet, camarones al mojo,
// pulpo a las brasas, aguachiles, cocteles estilo veracruzano y bebidas frías.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, X, ShoppingBag, Flame, Sparkles,
  Phone, MapPin, Clock, MessageCircle, ArrowUp, Shield,
  Copy, Check, Trash2, Landmark, Wallet, Store, Bike,
  Heart, CheckCircle2, ChevronRight, ChevronLeft, Award, Utensils,
  Share2, AlertCircle, Info, Star, Edit3, Waves, Fish
} from 'lucide-react';
import { clientConfig, bankInfo } from '../config';
import heroImg from '../assets/hero-mariscada.webp';
import logoImg from '../assets/logo-mesa-jarocha.webp';
import memelaImg from '../assets/memela-de-cecina.webp';
import enmoladasImg from '../assets/enmoladas-jarochas.webp';

const C = clientConfig.colors;

// ── Categorías Oficiales de la Carta ──
type CategoryId =
  | 'todos'
  | 'favoritos'
  | 'caldos-sopas'
  | 'mar'
  | 'proteina'
  | 'maiz'
  | 'servicio-cuarto'
  | 'peques'
  | 'postres';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image?: string;
  badge?: string;
  featured?: boolean;
  isPopular?: boolean;
  canCustomize?: boolean;
  customType?: 'memela' | 'enchiladas' | 'carne' | 'coctel' | 'general';
  sizes?: { name: string; price: number }[];
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
  category: CategoryId;
  selectedProtein?: string;
  selectedSauce?: string;
  selectedPrep?: string;
  extras?: CustomOption[];
  specialNotes?: string;
}

// ── Extras sugeridos ──
const MENU_EXTRAS: CustomOption[] = [
  { name: 'Porción Extra de Queso Oaxaca', price: 20 },
  { name: 'Porción de Guacamole Casero', price: 35 },
  { name: 'Frijoles Refritos con Totopos', price: 25 },
  { name: 'Orden Extra de Tortillas Calientes (4 pzas)', price: 15 },
  { name: 'Porción Extra de Aguacate', price: 20 },
];

// ── Catálogo Oficial Fiel a la Carta Física de Mesa Jarocha ──
const PRODUCTS: Product[] = [
  // ── 1. CALDOS Y SOPAS ──
  {
    id: 'cal-01',
    name: 'Caldo de Pollo',
    description: 'Tradicional y reconfortante caldo con pollo tierno, verduras de temporada y consomé sazonado con hierbas.',
    price: 90,
    category: 'caldos-sopas',
    badge: 'CONFORT 🍲',
    isPopular: true,
  },
  {
    id: 'cal-02',
    name: 'Sopa Azteca',
    description: 'Sopa tradicional de tortilla crujiente en caldo de jitomate y pasilla, con aguacate, queso fresco, crema y tiritas de chile.',
    price: 90,
    category: 'caldos-sopas',
    badge: 'CLÁSICA 🥑',
    isPopular: true,
  },
  {
    id: 'cal-03',
    name: 'Caldo de Camarón',
    description: 'Consomé caliente y especiado con camarones frescos cocinados en su punto y verduras tiernas con epazote.',
    price: 165,
    category: 'caldos-sopas',
    badge: 'COSTERO 🦐',
    isPopular: true,
  },
  {
    id: 'cal-04',
    name: 'Chilpachole de Jaiba',
    description: 'Especialidad culinaria jarocha: caldo espeso y aromático preparado con jaiba fresca entera, masa de maíz, chiles y epazote.',
    price: 240,
    category: 'caldos-sopas',
    badge: 'ESTRELLA JAROCHA 🦀',
    featured: true,
    isPopular: true,
  },

  // ── 2. DEL MAR A TU MESA ──
  {
    id: 'mar-01',
    name: 'Coctel de Camarón',
    description: 'Camarón en salsa coctelera con cilantro, cebolla, jitomate y aguacate.',
    price: 105,
    category: 'mar',
    badge: 'FRESCO 🦐',
    isPopular: true,
    canCustomize: true,
    customType: 'coctel',
  },
  {
    id: 'mar-02',
    name: 'Campechana',
    description: 'Camarón y pulpo en salsa coctelera con cilantro, cebolla, jitomate y aguacate.',
    price: 145,
    category: 'mar',
    badge: 'CLÁSICA 🦐🐙',
    isPopular: true,
    canCustomize: true,
    customType: 'coctel',
  },
  {
    id: 'mar-03',
    name: 'Vuelve a la Vida',
    description: 'Pulpo, camarón y jaiba en salsa coctelera.',
    price: 225,
    category: 'mar',
    badge: 'ESPECIAL DEL MAR 🌊',
    featured: true,
    isPopular: true,
    canCustomize: true,
    customType: 'coctel',
  },
  {
    id: 'mar-04',
    name: 'Tacos de Marisco (3)',
    description: 'Orden de tres tacos con mariscos selectos en tortilla de maíz con guarnición y aderezo especial de la casa.',
    price: 210,
    category: 'mar',
    badge: '3 TACOS 🌮',
    isPopular: true,
  },
  {
    id: 'mar-05',
    name: 'Tacos de Pulpo Zarandeado',
    description: 'Tentáculos de pulpo marinados y asados con adobo zarandeado en tres tortillas de maíz calientes.',
    price: 210,
    category: 'mar',
    badge: 'ZARANDEADO 🐙',
    featured: true,
    isPopular: true,
  },
  {
    id: 'mar-06',
    name: 'Tacos de Camarón',
    description: 'Camarones salteados con sazón de la costa, servidos en tres tacos de maíz con aguacate y limón.',
    price: 225,
    category: 'mar',
    badge: 'CRUJIENTES 🦐',
    isPopular: true,
  },
  {
    id: 'mar-07',
    name: 'Aguacate Relleno de Atún',
    description: 'Mitades de aguacate fresco rellenas de ensalada fresca de atún con verduras y toques de mayonesa y limón.',
    price: 175,
    category: 'mar',
    badge: 'FRESCO & LIGERO 🥑',
  },
  {
    id: 'mar-08',
    name: 'Camarones al Ajillo',
    description: 'Salteados en salsa especial con arroz y verduras.',
    price: 260,
    category: 'mar',
    badge: 'CHEF PICK 🧄',
    featured: true,
    isPopular: true,
  },

  // ── 3. PROTEÍNA ──
  {
    id: 'pro-01',
    name: 'Pollo con Mole',
    description: 'Pechuga rellena de queso bañada en mole de la casa acompañado de arroz.',
    price: 185,
    category: 'proteina',
    badge: 'TRADICIÓN 🍗',
    featured: true,
    isPopular: true,
  },
  {
    id: 'pro-02',
    name: 'Pierna de Cerdo al Pipián',
    description: 'En pipián verde con arroz y frijoles.',
    price: 175,
    category: 'proteina',
    badge: 'ESPECIALIDAD 🍃',
    isPopular: true,
  },
  {
    id: 'pro-03',
    name: 'Arrachera',
    description: 'A la plancha, con guacamole, frijoles y chiles toreados.',
    price: 245,
    category: 'proteina',
    badge: 'A LA PLANCHA 🥩',
    featured: true,
    isPopular: true,
  },
  {
    id: 'pro-04',
    name: 'Tacos de Arrachera o Picaña',
    description: 'Orden de tacos de corte selecto a la plancha. Elige entre Arrachera marinada o Picaña jugosa.',
    price: 225,
    category: 'proteina',
    badge: 'CORTE SELECTO 🌮',
    canCustomize: true,
    customType: 'carne',
    isPopular: true,
  },

  // ── 4. MAÍZ ──
  {
    id: 'mai-01',
    name: 'Memela de la Casa',
    description: 'Con carne chinameca o pollo o cecina y queso oaxaca.',
    price: 140,
    category: 'maiz',
    image: memelaImg,
    badge: 'ANTOJITO JAROCHO 🫓',
    featured: true,
    canCustomize: true,
    customType: 'memela',
    isPopular: true,
  },
  {
    id: 'mai-02',
    name: 'Enchiladas (3)',
    description: 'Rellenas de pollo con salsa roja o verde o pipián.',
    price: 145,
    category: 'maiz',
    badge: '3 PIEZAS 🌶️',
    canCustomize: true,
    customType: 'enchiladas',
    isPopular: true,
  },
  {
    id: 'mai-03',
    name: 'Enmoladas (3)',
    description: 'Tres tortillas rellenas de pollo bañadas en mole artesanal de la casa con crema fresca y queso.',
    price: 145,
    category: 'maiz',
    image: enmoladasImg,
    badge: 'MOLE DE LA CASA 🍫',
    featured: true,
    isPopular: true,
  },

  // ── 5. SERVICIO AL CUARTO ──
  {
    id: 'ser-01',
    name: 'Club Sandwich',
    description: 'Tradicional sándwich de tres pisos con jamón, pollo, queso, tocino crocante, lechuga y jitomate, servido con papas a la francesa.',
    price: 155,
    category: 'servicio-cuarto',
    badge: 'CON PAPAS 🥪',
    isPopular: true,
  },
  {
    id: 'ser-02',
    name: 'Hamburguesa de la Casa',
    description: 'Jugosa carne artesanal con queso fundido, aderezos de la casa y vegetales frescos, acompañada de papas crujientes.',
    price: 175,
    category: 'servicio-cuarto',
    badge: 'GOURMET 🍔',
    featured: true,
    isPopular: true,
  },

  // ── 6. PARA LOS PEQUES ──
  {
    id: 'peq-01',
    name: 'Perrocho',
    description: 'Hot dog clásico infantil con salchicha de pavo, cátsup y mayonesa con papas a la francesa.',
    price: 70,
    category: 'peques',
    badge: 'INFANTIL 🌭',
  },
  {
    id: 'peq-02',
    name: 'Nuggets de Pollo',
    description: 'Crujientes nuggets de pechuga de pollo empanizada servidos con aderezo y papas a la francesa.',
    price: 85,
    category: 'peques',
    badge: 'CRUJIENTES 🍗',
    isPopular: true,
  },
  {
    id: 'peq-03',
    name: 'Mini Hamburguesa',
    description: 'Hamburguesita jugosa con queso fundido y papas a la francesa para los pequeños de la casa.',
    price: 90,
    category: 'peques',
    badge: 'FAVORITA 🍔',
    isPopular: true,
  },

  // ── 7. POSTRES ──
  {
    id: 'pos-01',
    name: 'Oveja Negra',
    description: 'Betún artesanal de chocolate Turin con cacahuate.',
    price: 200,
    category: 'postres',
    badge: 'POSTRE ESTRELLA 🍫',
    featured: true,
    isPopular: true,
  },
  {
    id: 'pos-02',
    name: 'Crepas de Cajeta',
    description: 'Delicadas crepas bañadas en cajeta tradicional con trocitos de nuez tostada.',
    price: 95,
    category: 'postres',
    badge: 'DULCE TRADICIÓN 🍯',
    isPopular: true,
  },
];

// ── Categorías para navegación (fieles a la carta física) ──
const CATEGORIES: { id: CategoryId; name: string; icon: string }[] = [
  { id: 'todos', name: 'Todo el Menú', icon: '📋' },
  { id: 'caldos-sopas', name: 'Caldos y Sopas', icon: '🍲' },
  { id: 'mar', name: 'Del Mar a Tu Mesa', icon: '🌊' },
  { id: 'proteina', name: 'Proteína', icon: '🥩' },
  { id: 'maiz', name: 'Maíz', icon: '🌽' },
  { id: 'servicio-cuarto', name: 'Servicio al Cuarto', icon: '🛎️' },
  { id: 'peques', name: 'Para los Peques', icon: '👶' },
  { id: 'postres', name: 'Postres', icon: '🍨' },
];

// ── Emojis representativos por categoría ──
const CATEGORY_EMOJIS: Record<CategoryId, string> = {
  todos: '📋',
  favoritos: '❤️',
  'caldos-sopas': '🍲',
  mar: '🌊',
  proteina: '🥩',
  maiz: '🌽',
  'servicio-cuarto': '🛎️',
  peques: '👶',
  postres: '🍨',
};

export default function MesaJarochaMenu() {
  // ── Estados de navegación y catálogo ──
  const [activeCategory, setActiveCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mesajarocha_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);

  // ── Estados del carrito (2 pasos + éxito) ──
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mesajarocha_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<1 | 2 | 3>(1); // 1: productos, 2: datos, 3: confirmación

  // ── Datos de entrega y pago del cliente ──
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'recoger' | 'domicilio'>('domicilio');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo');
  const [cashAmount, setCashAmount] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [lastWaUrl, setLastWaUrl] = useState('');

  // ── Errores de validación inline ──
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
  }>({});

  // ── Modal de personalización de producto ──
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedProtein, setSelectedProtein] = useState<string>('Carne Chinameca');
  const [selectedSauce, setSelectedSauce] = useState<string>('Salsa Roja');
  const [selectedPrep, setSelectedPrep] = useState<string>('Con todo (Cilantro, Cebolla, Jitomate y Aguacate)');
  const [selectedExtras, setSelectedExtras] = useState<CustomOption[]>([]);
  const [specialNoteInput, setSpecialNoteInput] = useState('');

  // ── Modal de Aviso de Privacidad ──
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // ── Referencias para scroll ──
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Guardar favoritos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mesajarocha_favs', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Guardar carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mesajarocha_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Toggle de favorito
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Abrir modal de personalización
  const openCustomModal = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCustomizingProduct(product);
    setSelectedProtein(
      product.customType === 'memela'
        ? 'Carne Chinameca'
        : product.customType === 'carne'
        ? 'Arrachera'
        : ''
    );
    setSelectedSauce(product.customType === 'enchiladas' ? 'Salsa Roja' : '');
    setSelectedPrep('Con todo (Cilantro, Cebolla, Jitomate y Aguacate)');
    setSelectedExtras([]);
    setSpecialNoteInput('');
  };

  // Agregar directo (sin modal si no requiere)
  const handleQuickAdd = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (product.canCustomize) {
      openCustomModal(product);
      return;
    }

    const itemPrice = product.price;
    const lineId = `${product.id}-${Date.now()}`;
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id && !item.extras?.length);
      if (existing) {
        return prev.map(item =>
          item.lineId === existing.lineId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          name: product.name,
          basePrice: product.price,
          unitPrice: itemPrice,
          quantity: 1,
          category: product.category,
        },
      ];
    });
  };

  // Confirmar desde modal de personalización
  const confirmCustomAdd = () => {
    if (!customizingProduct) return;

    const base = customizingProduct.price;
    const extrasTotal = selectedExtras.reduce((sum, ext) => sum + ext.price, 0);
    const unitPrice = base + extrasTotal;
    const lineId = `${customizingProduct.id}-${Date.now()}`;

    const newItem: CartItem = {
      lineId,
      productId: customizingProduct.id,
      name: customizingProduct.name,
      basePrice: base,
      unitPrice,
      quantity: 1,
      category: customizingProduct.category,
      selectedProtein: selectedProtein || undefined,
      selectedSauce: selectedSauce || undefined,
      selectedPrep: customizingProduct.customType === 'coctel' ? selectedPrep : undefined,
      extras: selectedExtras.length > 0 ? selectedExtras : undefined,
      specialNotes: specialNoteInput.trim() || undefined,
    };

    setCart(prev => [...prev, newItem]);
    setCustomizingProduct(null);
  };

  // Modificar cantidad en carrito
  const updateQuantity = (lineId: string, delta: number) => {
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

  // Totales
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const deliveryCost = deliveryMethod === 'domicilio' && cartSubtotal > 0 ? 25 : 0;
  const cartTotal = cartSubtotal + deliveryCost;
  const totalCartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  // Cambio en efectivo
  const cashGiven = parseFloat(cashAmount) || 0;
  const changeDue = cashGiven >= cartTotal ? cashGiven - cartTotal : 0;

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(prod => {
      // Filtro de categoría
      if (showOnlyFavs) {
        if (!favorites.includes(prod.id)) return false;
      } else if (activeCategory !== 'todos') {
        if (prod.category !== activeCategory) return false;
      }

      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const nameClean = prod.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const descClean = prod.description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return nameClean.includes(q) || descClean.includes(q);
      }

      return true;
    });
  }, [activeCategory, searchQuery, favorites, showOnlyFavs]);

  // Checkout WhatsApp seguro con window.location.href (Regla del proyecto)
  const handleFinalizeWhatsAppOrder = () => {
    const errors: { name?: string; phone?: string; address?: string } = {};

    if (!customerName.trim()) {
      errors.name = 'Por favor escribe tu nombre completo para el pedido.';
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      errors.phone = 'Ingresa un número de WhatsApp válido (mínimo 8 dígitos).';
    }
    if (deliveryMethod === 'domicilio' && !customerAddress.trim()) {
      errors.address = 'Ingresa la dirección completa para la entrega a domicilio.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    // Armar mensaje WhatsApp estructurado
    let text = `🦞 *NUEVO PEDIDO — ${clientConfig.businessName.toUpperCase()}*\n`;
    text += `──────────────────────\n`;
    text += `👤 *Cliente:* ${customerName.trim()}\n`;
    text += `📱 *Teléfono:* ${customerPhone.trim()}\n`;
    text += `🛵 *Entrega:* ${deliveryMethod === 'domicilio' ? `A Domicilio\n📍 *Dirección:* ${customerAddress.trim()}` : 'Para Recoger en Sucursal'}\n`;
    text += `💳 *Pago:* ${paymentMethod === 'efectivo' ? `Efectivo (Paga con: $${cashGiven || cartTotal}${changeDue > 0 ? ` · Cambio: $${changeDue}` : ''})` : 'Transferencia Bancaria'}\n`;

    if (orderNotes.trim()) {
      text += `📝 *Notas:* ${orderNotes.trim()}\n`;
    }

    text += `──────────────────────\n`;
    text += `📋 *DETALLE DEL PEDIDO:*\n`;

    cart.forEach((item, idx) => {
      text += `\n${idx + 1}. *${item.quantity}x ${item.name}* — $${item.unitPrice * item.quantity}\n`;
      if (item.selectedProtein) text += `   • Carne/Corte: ${item.selectedProtein}\n`;
      if (item.selectedSauce) text += `   • Salsa: ${item.selectedSauce}\n`;
      if (item.selectedPrep) text += `   • Prep: ${item.selectedPrep}\n`;
      if (item.extras?.length) {
        text += `   • Extras: ${item.extras.map(e => `${e.name} (+$${e.price})`).join(', ')}\n`;
      }
      if (item.specialNotes) text += `   • Nota especial: ${item.specialNotes}\n`;
    });

    text += `\n──────────────────────\n`;
    text += `💵 *Subtotal:* $${cartSubtotal}\n`;
    if (deliveryCost > 0) {
      text += `🛵 *Envío local:* $${deliveryCost}\n`;
    }
    text += `💰 *TOTAL A PAGAR:* $${cartTotal} MXN\n`;
    text += `──────────────────────\n`;
    text += `🌊 _Enviado desde el Menú Digital Oficial Mesa Jarocha_`;

    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/${clientConfig.phonePrimary}?text=${encoded}`;

    // Guardar URL persistente para evitar fallos si se pulsa el botón manual en paso 3
    setLastWaUrl(waUrl);

    // Paso 1: Mostrar pantalla de éxito
    setCartStep(3);

    // Paso 2: Redirección obligatoria con window.location.href (Regla Crítica: no window.open)
    setTimeout(() => {
      window.location.href = waUrl;
      // Paso 3: Limpiar carrito tras disparo exitoso
      setCart([]);
      localStorage.removeItem('mesajarocha_cart');
    }, 600);
  };

  // Copiar datos bancarios
  const handleCopyBank = () => {
    const info = `Banco: ${bankInfo.bankName}\nTitular: ${bankInfo.accountHolder}\nCLABE: ${bankInfo.clabe}\nTarjeta: ${bankInfo.cardNumber}`;
    navigator.clipboard.writeText(info);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  // Compartir menú
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: clientConfig.businessName,
        text: clientConfig.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07111E] text-[#F1F7FF] font-sans selection:bg-[#0084C7] selection:text-white pb-24 md:pb-12">
      
      {/* ── BARRA SUPERIOR / HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#07111E]/92 backdrop-blur-xl border-b border-[#00A8E8]/15 shadow-xl transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          {/* Logo y Nombre */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#FFC043]/80 shadow-md shadow-[#0084C7]/20 flex-shrink-0 bg-[#0D1B2D]">
              <img src={logoImg} alt="Mesa Jarocha" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-base md:text-lg leading-tight tracking-tight text-white flex items-center gap-1.5 font-serif">
                Mesa Jarocha
                <span className="inline-block w-2 h-2 rounded-full bg-[#25D366] animate-pulse" title="Abierto Ahora" />
              </h1>
              <p className="text-[11px] text-[#8EA5C2] flex items-center gap-1 font-medium">
                <span className="text-[#FF5942]">🦞</span> Mariscos & Sabor Costero
              </p>
            </div>
          </div>

          {/* Acciones de Cabecera */}
          <div className="flex items-center gap-2">
            
            {/* Botón Favoritos */}
            <button
              onClick={() => {
                setShowOnlyFavs(prev => !prev);
                setActiveCategory('todos');
              }}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                showOnlyFavs
                  ? 'bg-[#FF5942] border-[#FF5942] text-white shadow-lg shadow-[#FF5942]/30'
                  : 'bg-[#0D1B2D] border-[#00A8E8]/20 text-[#8EA5C2] hover:text-white hover:border-[#00A8E8]/50'
              }`}
              title="Mis Favoritos"
            >
              <Heart size={16} className={showOnlyFavs ? 'fill-white' : ''} />
              {favorites.length > 0 && (
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Botón Compartir */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-[#0D1B2D] border border-[#00A8E8]/20 text-[#8EA5C2] hover:text-white transition-all hover:border-[#00A8E8]/50 hidden sm:flex items-center"
              title="Compartir Menú"
            >
              <Share2 size={16} />
            </button>

            {/* Botón Carrito Header */}
            <button
              onClick={() => {
                setIsCartOpen(true);
                setCartStep(1);
              }}
              className="relative p-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#0084C7] to-[#00A8E8] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#0084C7]/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <ShoppingBag size={17} />
              <span className="hidden sm:inline font-medium">Mi Pedido</span>
              {totalCartCount > 0 && (
                <span className="bg-[#FF5942] text-white text-[11px] font-black px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER "GRAN MARISCADA JAROCHA" ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#07111E] via-[#0D1B2D] to-[#07111E] border-b border-[#00A8E8]/15">
        
        {/* Efecto de oleaje y resplandor de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,168,232,0.12),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Texto y presentación */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1B2D]/90 border border-[#FFC043]/40 text-[#FFC043] text-xs font-bold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FFC043] animate-ping" />
                MENÚ MAR Y TIERRA · SERVIDO DESDE LA 1:00 PM 🦞🥩
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight font-serif tracking-tight">
                Menú Mar y Tierra <br className="hidden md:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A8E8] via-[#2DD4BF] to-[#FFC043]">
                  Tradición, Caldos & Cortes
                </span>
              </h2>

              <p className="text-sm md:text-base text-[#8EA5C2] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                {clientConfig.description}
              </p>

              {/* 4 Badges de Confianza */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="bg-[#13243B]/80 border border-[#00A8E8]/15 rounded-xl p-2.5 text-center backdrop-blur-sm">
                  <span className="text-lg block mb-0.5">🍲</span>
                  <span className="text-[11px] font-bold text-[#F1F7FF] block">Caldos y Sopas</span>
                  <span className="text-[9px] text-[#8EA5C2]">Chilpachole & Camarón</span>
                </div>
                <div className="bg-[#13243B]/80 border border-[#00A8E8]/15 rounded-xl p-2.5 text-center backdrop-blur-sm">
                  <span className="text-lg block mb-0.5">🌊</span>
                  <span className="text-[11px] font-bold text-[#F1F7FF] block">Del Mar a Tu Mesa</span>
                  <span className="text-[9px] text-[#8EA5C2]">Cocteles y Ajillo</span>
                </div>
                <div className="bg-[#13243B]/80 border border-[#00A8E8]/15 rounded-xl p-2.5 text-center backdrop-blur-sm">
                  <span className="text-lg block mb-0.5">🥩</span>
                  <span className="text-[11px] font-bold text-[#F1F7FF] block">Proteína Selecta</span>
                  <span className="text-[9px] text-[#8EA5C2]">Arrachera a la plancha</span>
                </div>
                <div className="bg-[#13243B]/80 border border-[#00A8E8]/15 rounded-xl p-2.5 text-center backdrop-blur-sm">
                  <span className="text-lg block mb-0.5">🌽</span>
                  <span className="text-[11px] font-bold text-[#F1F7FF] block">Maíz Casero</span>
                  <span className="text-[9px] text-[#8EA5C2]">Memelas & Enmoladas</span>
                </div>
              </div>

              {/* Spotlight CTA */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => {
                    const heroProd = PRODUCTS.find(p => p.id === 'cal-04');
                    if (heroProd) handleQuickAdd(heroProd);
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5942] to-[#FF8C00] text-white font-black text-xs md:text-sm tracking-wide uppercase shadow-xl shadow-[#FF5942]/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sparkles size={18} /> Probar Chilpachole de Jaiba · $240
                </button>
                <div className="text-xs text-[#8EA5C2] flex items-center gap-1.5">
                  <Clock size={14} className="text-[#25D366]" />
                  <span>{clientConfig.hours}</span>
                </div>
              </div>

            </div>

            {/* Imagen del Hero con Marco Estilizado */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#00A8E8]/30 shadow-2xl shadow-[#0084C7]/30 group">
                <img
                  src={heroImg}
                  alt="Menú Mar y Tierra Mesa Jarocha"
                  className="w-full h-[260px] sm:h-[340px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111E] via-transparent to-transparent opacity-80" />
                
                {/* Badge flotante en la foto */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#0D1B2D]/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-[#FFC043]/30 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-[#FFC043] uppercase tracking-wider block truncate">Especialidad de la Casa</span>
                    <span className="text-xs font-black text-white block truncate">Chilpachole de Jaiba Tradicional</span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#2DD4BF] bg-[#07111E]/80 px-2.5 py-1 rounded-xl border border-[#2DD4BF]/30 flex-shrink-0 whitespace-nowrap">
                    $240 MXN
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BARRA DE BÚSQUEDA Y CATEGORÍAS ── */}
      <section className="sticky top-[61px] z-30 bg-[#07111E]/95 backdrop-blur-xl border-b border-[#00A8E8]/15 py-3 shadow-md">
        <div className="max-w-6xl mx-auto px-4 space-y-2.5">
          
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8EA5C2]" size={17} />
            <input
              type="text"
              placeholder="Buscar camarones, ceviche, pulpo, mojarra, bebidas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#0D1B2D] border border-[#00A8E8]/20 text-white placeholder-[#8EA5C2]/60 text-xs md:text-sm focus:outline-none focus:border-[#00A8E8] focus:ring-1 focus:ring-[#00A8E8] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8EA5C2] hover:text-white p-1"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Selector de Categorías Horizontal */}
          <div className="relative flex items-center">
            {/* Gradiente izquierdo para indicar scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#07111E] to-transparent z-10 pointer-events-none md:hidden" />

            {/* Flecha Izquierda */}
            <button
              onClick={() => scrollCategories('left')}
              className="hidden md:flex p-1.5 rounded-full bg-[#0D1B2D] border border-[#00A8E8]/20 text-[#8EA5C2] hover:text-white transition-all mr-1.5 flex-shrink-0"
              title="Anterior"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Contenedor Scroll */}
            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full snap-x snap-mandatory px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {CATEGORIES.map(cat => {
                const isActive = !showOnlyFavs && activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setShowOnlyFavs(false);
                      setActiveCategory(cat.id);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 snap-start border ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0084C7] to-[#00A8E8] text-white border-[#00A8E8] shadow-lg shadow-[#0084C7]/25 scale-[1.02]'
                        : 'bg-[#0D1B2D] text-[#8EA5C2] border-[#00A8E8]/15 hover:text-white hover:border-[#00A8E8]/40'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Flecha Derecha */}
            <button
              onClick={() => scrollCategories('right')}
              className="hidden md:flex p-1.5 rounded-full bg-[#0D1B2D] border border-[#00A8E8]/20 text-[#8EA5C2] hover:text-white transition-all ml-1.5 flex-shrink-0"
              title="Siguiente"
            >
              <ChevronRight size={16} />
            </button>

            {/* Gradiente derecho para indicar scroll */}
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#07111E] to-transparent z-10 pointer-events-none md:hidden" />
          </div>

        </div>
      </section>

      {/* ── GRID DE PRODUCTOS CON STAGGER ANIMATION ── */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Cabecera del Grid */}
        <div className="flex items-center justify-between mb-6 min-h-[48px]">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white font-serif flex items-center gap-2">
              {showOnlyFavs ? '❤️ Mis Platillos Favoritos' : CATEGORIES.find(c => c.id === activeCategory)?.name || 'Catálogo'}
              <span className="text-xs font-bold text-[#8EA5C2] font-sans bg-[#0D1B2D] px-2 py-0.5 rounded-lg border border-[#00A8E8]/20">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'platillo' : 'platillos'}
              </span>
            </h3>
            {searchQuery && (
              <p className="text-xs text-[#8EA5C2] mt-0.5">
                Resultados para: <span className="text-[#00A8E8] font-bold">"{searchQuery}"</span>
              </p>
            )}
          </div>

          {showOnlyFavs && (
            <button
              onClick={() => setShowOnlyFavs(false)}
              className="text-xs text-[#00A8E8] hover:underline font-bold"
            >
              Ver todo el menú
            </button>
          )}
        </div>

        {/* Sin resultados */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#0D1B2D]/50 rounded-3xl border border-[#00A8E8]/15">
            <Fish size={48} className="mx-auto text-[#8EA5C2] mb-3 opacity-60" />
            <h4 className="text-lg font-bold text-white mb-1">No encontramos platillos</h4>
            <p className="text-xs text-[#8EA5C2] max-w-sm mx-auto mb-4">
              {showOnlyFavs
                ? 'Aún no has agregado platillos a tus favoritos. ¡Toca el corazón en cualquier platillo!'
                : 'Intenta con otra palabra clave o selecciona otra categoría.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setShowOnlyFavs(false);
                setActiveCategory('todos');
              }}
              className="px-4 py-2 rounded-xl bg-[#0084C7] text-white text-xs font-bold shadow-md hover:brightness-110"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          /* Grid de Productos */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredProducts.map((product) => {
              const isFav = favorites.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#13243B]/80 hover:bg-[#13243B] border border-[#00A8E8]/15 hover:border-[#00A8E8]/40 rounded-3xl p-4 md:p-5 flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-[#0084C7]/10 transition-all group backdrop-blur-sm relative"
                >
                    {/* Botón Favorito */}
                    <button
                      onClick={e => toggleFavorite(product.id, e)}
                      className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
                        isFav
                          ? 'bg-[#FF5942] text-white shadow-md shadow-[#FF5942]/40'
                          : 'bg-[#07111E]/70 text-[#8EA5C2] hover:text-white hover:bg-[#07111E]'
                      }`}
                      title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                    >
                      <Heart size={15} className={isFav ? 'fill-white' : ''} />
                    </button>

                    <div>
                      {/* Imagen si el platillo la tiene */}
                      {product.image && (
                        <div className="w-full h-36 mb-3 rounded-2xl overflow-hidden relative border border-[#00A8E8]/20 bg-[#07111E]">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Badge si tiene, o chip con emoji de categoría como fallback */}
                      <div className="mb-2">
                        {product.badge ? (
                          <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FFC043]/15 text-[#FFC043] border border-[#FFC043]/30">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#00A8E8]/10 text-[#00A8E8] border border-[#00A8E8]/20">
                            <span>{CATEGORY_EMOJIS[product.category] || '🌊'}</span>
                            <span>{CATEGORIES.find(c => c.id === product.category)?.name || 'Mesa Jarocha'}</span>
                          </span>
                        )}
                      </div>

                      {/* Título */}
                      <h4 className="font-bold text-base text-white group-hover:text-[#00A8E8] transition-colors leading-snug font-serif pr-8">
                        {product.name}
                      </h4>

                      {/* Descripción */}
                      <p className="text-xs text-[#8EA5C2] mt-2 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    {/* Precios y Botones de Acción */}
                    <div className="mt-4 pt-3 border-t border-[#00A8E8]/10 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[#8EA5C2] uppercase tracking-wider block font-semibold">
                          {product.sizes ? 'Desde' : 'Precio'}
                        </span>
                        <span className="text-lg font-black text-[#2DD4BF]">
                          ${product.price} <span className="text-[10px] text-[#8EA5C2] font-normal">MXN</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {product.canCustomize ? (
                          <button
                            onClick={e => openCustomModal(product, e)}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0084C7] to-[#00A8E8] text-white text-xs font-bold shadow-md shadow-[#0084C7]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                          >
                            <Edit3 size={13} />
                            <span>Personalizar</span>
                          </button>
                        ) : (
                          <button
                            onClick={e => handleQuickAdd(product, e)}
                            className="p-2.5 rounded-xl bg-[#0084C7] hover:bg-[#00A8E8] text-white shadow-md shadow-[#0084C7]/20 active:scale-95 transition-all flex items-center justify-center"
                            title="Agregar al pedido"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                  </motion.div>
                );
              })}
          </div>
        )}

      </main>

      {/* ── MODAL DE PERSONALIZACIÓN DE PRODUCTO ── */}
      <AnimatePresence>
        {customizingProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-[#0D1B2D] border border-[#00A8E8]/25 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header Modal */}
              <div className="p-4 border-b border-[#00A8E8]/15 flex items-start justify-between bg-[#13243B]">
                <div>
                  <span className="text-[10px] font-bold text-[#FFC043] uppercase tracking-wider">A Tu Gusto</span>
                  <h3 className="font-bold text-lg text-white font-serif">{customizingProduct.name}</h3>
                  <p className="text-xs text-[#2DD4BF] font-black mt-0.5">
                    Precio base: ${customizingProduct.price} MXN
                  </p>
                </div>
                <button
                  onClick={() => setCustomizingProduct(null)}
                  className="p-1.5 rounded-full bg-[#07111E] text-[#8EA5C2] hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Contenido scrolleable */}
              <div className="p-5 overflow-y-auto space-y-5 text-xs text-[#8EA5C2]">
                
                {/* 1. Selector de Carne para Memela de la Casa */}
                {customizingProduct.customType === 'memela' && (
                  <div>
                    <label className="block text-white font-bold mb-2 uppercase text-[11px] tracking-wide">
                      🥩 Elige la carne de tu Memela:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Carne Chinameca', 'Pollo', 'Cecina'].map(protein => (
                        <button
                          key={protein}
                          onClick={() => setSelectedProtein(protein)}
                          className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                            selectedProtein === protein
                              ? 'bg-[#0084C7] border-[#00A8E8] text-white shadow-md'
                              : 'bg-[#13243B] border-[#00A8E8]/15 text-[#8EA5C2] hover:text-white'
                          }`}
                        >
                          <span className="block text-xs">{protein}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Selector de Salsa para Enchiladas (3) */}
                {customizingProduct.customType === 'enchiladas' && (
                  <div>
                    <label className="block text-white font-bold mb-2 uppercase text-[11px] tracking-wide">
                      🌶️ Elige tu salsa para las Enchiladas:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Salsa Roja', 'Salsa Verde', 'Pipián'].map(sauce => (
                        <button
                          key={sauce}
                          onClick={() => setSelectedSauce(sauce)}
                          className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                            selectedSauce === sauce
                              ? 'bg-[#0084C7] border-[#00A8E8] text-white shadow-md'
                              : 'bg-[#13243B] border-[#00A8E8]/15 text-[#8EA5C2] hover:text-white'
                          }`}
                        >
                          <span className="block text-xs">{sauce}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Selector de Corte para Tacos de Arrachera o Picaña */}
                {customizingProduct.customType === 'carne' && (
                  <div>
                    <label className="block text-white font-bold mb-2 uppercase text-[11px] tracking-wide">
                      🥩 Elige tu corte para los tacos:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Arrachera', 'Picaña'].map(corte => (
                        <button
                          key={corte}
                          onClick={() => setSelectedProtein(corte)}
                          className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                            selectedProtein === corte
                              ? 'bg-[#0084C7] border-[#00A8E8] text-white shadow-md'
                              : 'bg-[#13243B] border-[#00A8E8]/15 text-[#8EA5C2] hover:text-white'
                          }`}
                        >
                          <span className="block text-xs">{corte}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Selector de Preparación para Cocteles y Del Mar */}
                {customizingProduct.customType === 'coctel' && (
                  <div>
                    <label className="block text-white font-bold mb-2 uppercase text-[11px] tracking-wide">
                      🥗 Preparación de Verduras & Sazón:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Con todo (Cilantro, Cebolla, Jitomate y Aguacate)',
                        'Sin Cebolla',
                        'Sin Cilantro',
                        'Solo salsa coctelera (Sin verduras)',
                        'Verduras por separado',
                      ].map(prep => (
                        <button
                          key={prep}
                          onClick={() => setSelectedPrep(prep)}
                          className={`p-2 rounded-xl border text-left font-medium transition-all ${
                            selectedPrep === prep
                              ? 'bg-[#0084C7]/25 border-[#00A8E8] text-white'
                              : 'bg-[#13243B] border-[#00A8E8]/15 text-[#8EA5C2] hover:text-white'
                          }`}
                        >
                          {prep}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extras Añadibles */}
                <div>
                  <label className="block text-white font-bold mb-2 uppercase text-[11px] tracking-wide">
                    ➕ Extras para acompañar tu platillo:
                  </label>
                  <div className="space-y-1.5">
                    {MENU_EXTRAS.map(extra => {
                      const isSelected = selectedExtras.some(e => e.name === extra.name);
                      return (
                        <button
                          key={extra.name}
                          onClick={() => {
                            setSelectedExtras(prev =>
                              isSelected ? prev.filter(e => e.name !== extra.name) : [...prev, extra]
                            );
                          }}
                          className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                            isSelected
                              ? 'bg-[#0084C7]/20 border-[#00A8E8] text-white font-bold'
                              : 'bg-[#13243B] border-[#00A8E8]/15 text-[#8EA5C2] hover:text-white'
                          }`}
                        >
                          <span>{extra.name}</span>
                          <span className="text-[#2DD4BF] font-black">+${extra.price} MXN</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nota especial */}
                <div>
                  <label className="block text-white font-bold mb-1 uppercase text-[11px] tracking-wide">
                    📝 Indicación Especial o Alergia:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Salsa aparte, término de la carne, limón extra..."
                    value={specialNoteInput}
                    onChange={e => setSpecialNoteInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#13243B] border border-[#00A8E8]/20 text-white placeholder-[#8EA5C2]/50 text-xs focus:outline-none focus:border-[#00A8E8]"
                  />
                </div>

              </div>

              {/* Botón Sticky al Pie */}
              <div className="p-4 bg-[#13243B] border-t border-[#00A8E8]/20 flex items-center justify-between gap-3 shadow-lg">
                <div>
                  <span className="text-[10px] text-[#8EA5C2] uppercase font-bold block">Total Platillo</span>
                  <span className="text-xl font-black text-[#2DD4BF]">
                    ${customizingProduct.price + selectedExtras.reduce((sum, e) => sum + e.price, 0)} <span className="text-[10px] text-[#8EA5C2] font-normal">MXN</span>
                  </span>
                </div>

                <button
                  onClick={confirmCustomAdd}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF5942] to-[#FF8C00] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF5942]/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Check size={16} /> Confirmar & Agregar
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CARRITO LATERAL DE 2 PASOS (DRAWER) ── */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#0D1B2D] border-l border-[#00A8E8]/20 w-full max-w-md h-full flex flex-col shadow-2xl"
            >
              
              {/* Header Carrito */}
              <div className="p-4 border-b border-[#00A8E8]/15 bg-[#13243B] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#00A8E8]" />
                  <h3 className="font-bold text-base text-white font-serif">
                    {cartStep === 1 ? 'Tu Pedido' : cartStep === 2 ? 'Datos de Entrega y Pago' : '¡Pedido Listo!'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full bg-[#07111E] text-[#8EA5C2] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Indicador de 2 Pasos */}
              {cartStep !== 3 && (
                <div className="grid grid-cols-2 text-center text-[11px] font-bold border-b border-[#00A8E8]/15 bg-[#07111E]/80">
                  <div
                    onClick={() => setCartStep(1)}
                    className={`py-2.5 cursor-pointer border-b-2 transition-all ${
                      cartStep === 1
                        ? 'border-[#00A8E8] text-[#00A8E8]'
                        : 'border-transparent text-[#8EA5C2]'
                    }`}
                  >
                    1. Platillos ({totalCartCount})
                  </div>
                  <div
                    onClick={() => {
                      if (cart.length > 0) setCartStep(2);
                    }}
                    className={`py-2.5 cursor-pointer border-b-2 transition-all ${
                      cartStep === 2
                        ? 'border-[#00A8E8] text-[#00A8E8]'
                        : 'border-transparent text-[#8EA5C2]'
                    }`}
                  >
                    2. Entrega y Pago
                  </div>
                </div>
              )}

              {/* ── CUERPO DEL CARRITO SEGÚN PASO ── */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* ── PASO 1: LISTADO DE PRODUCTOS ── */}
                {cartStep === 1 && (
                  <>
                    {cart.length === 0 ? (
                      <div className="text-center py-20">
                        <ShoppingBag size={48} className="mx-auto text-[#8EA5C2] mb-3 opacity-40" />
                        <p className="text-sm font-bold text-white mb-1">Tu canasta está vacía</p>
                        <p className="text-xs text-[#8EA5C2] max-w-xs mx-auto mb-4">
                          Explora nuestras especialidades y agrega tus platillos favoritos.
                        </p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="px-5 py-2.5 rounded-xl bg-[#0084C7] text-white text-xs font-bold shadow-md hover:brightness-110"
                        >
                          Ver Menú
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map(item => (
                          <div
                            key={item.lineId}
                            className="bg-[#13243B] border border-[#00A8E8]/15 rounded-2xl p-3.5 flex flex-col justify-between gap-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-sm text-white font-serif">{item.name}</h4>
                                <div className="text-[11px] text-[#8EA5C2] space-y-0.5 mt-1">
                                  {item.selectedProtein && <div>• Carne / Corte: <span className="text-white font-semibold">{item.selectedProtein}</span></div>}
                                  {item.selectedSauce && <div>• Salsa: <span className="text-white font-semibold">{item.selectedSauce}</span></div>}
                                  {item.selectedPrep && <div>• {item.selectedPrep}</div>}
                                  {item.extras?.map(e => (
                                    <div key={e.name} className="text-[#2DD4BF]">
                                      + {e.name} (${e.price})
                                    </div>
                                  ))}
                                  {item.specialNotes && (
                                    <div className="italic text-[#FFC043]">
                                      "{item.specialNotes}"
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className="font-black text-sm text-[#2DD4BF] whitespace-nowrap">
                                ${item.unitPrice * item.quantity}
                              </span>
                            </div>

                            {/* Controles de cantidad */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#00A8E8]/10 mt-1">
                              <span className="text-[10px] text-[#8EA5C2] font-semibold">
                                ${item.unitPrice} c/u
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.lineId, -1)}
                                  className="w-7 h-7 rounded-lg bg-[#07111E] border border-[#00A8E8]/20 flex items-center justify-center text-[#8EA5C2] hover:text-white"
                                >
                                  {item.quantity === 1 ? <Trash2 size={13} className="text-[#FF5942]" /> : <Minus size={13} />}
                                </button>
                                <span className="text-xs font-bold text-white w-5 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.lineId, 1)}
                                  className="w-7 h-7 rounded-lg bg-[#07111E] border border-[#00A8E8]/20 flex items-center justify-center text-[#8EA5C2] hover:text-white"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* ── PASO 2: DATOS DE ENTREGA Y PAGO ── */}
                {cartStep === 2 && (
                  <div className="space-y-4 text-xs">
                    
                    {/* Datos del Cliente */}
                    <div className="bg-[#13243B] border border-[#00A8E8]/15 rounded-2xl p-4 space-y-3">
                      <h4 className="font-bold text-sm text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Utensils size={14} className="text-[#00A8E8]" /> Tus Datos de Contacto
                      </h4>
                      <div>
                        <label className="block text-[#8EA5C2] mb-1 font-semibold">Nombre Completo *</label>
                        <input
                          type="text"
                          placeholder="Ej. Juan Carlos López"
                          value={customerName}
                          onChange={e => {
                            setCustomerName(e.target.value);
                            if (formErrors.name) setFormErrors(prev => ({ ...prev, name: undefined }));
                          }}
                          className={`w-full p-2.5 rounded-xl bg-[#07111E] border text-white placeholder-[#8EA5C2]/40 focus:outline-none transition-all ${
                            formErrors.name ? 'border-[#FF5942] ring-1 ring-[#FF5942]' : 'border-[#00A8E8]/20 focus:border-[#00A8E8]'
                          }`}
                        />
                        {formErrors.name && (
                          <p className="text-[#FF5942] text-[11px] font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {formErrors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[#8EA5C2] mb-1 font-semibold">Número de WhatsApp (10 dígitos) *</label>
                        <input
                          type="tel"
                          placeholder="Ej. 55 1234 5678"
                          value={customerPhone}
                          onChange={e => {
                            setCustomerPhone(e.target.value);
                            if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: undefined }));
                          }}
                          className={`w-full p-2.5 rounded-xl bg-[#07111E] border text-white placeholder-[#8EA5C2]/40 focus:outline-none transition-all ${
                            formErrors.phone ? 'border-[#FF5942] ring-1 ring-[#FF5942]' : 'border-[#00A8E8]/20 focus:border-[#00A8E8]'
                          }`}
                        />
                        {formErrors.phone && (
                          <p className="text-[#FF5942] text-[11px] font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {formErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Método de Entrega */}
                    <div className="bg-[#13243B] border border-[#00A8E8]/15 rounded-2xl p-4 space-y-3">
                      <h4 className="font-bold text-sm text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Bike size={14} className="text-[#00A8E8]" /> Método de Entrega
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('domicilio')}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold transition-all ${
                            deliveryMethod === 'domicilio'
                              ? 'bg-[#0084C7]/20 border-[#00A8E8] text-white shadow-md'
                              : 'bg-[#07111E] border-[#00A8E8]/15 text-[#8EA5C2]'
                          }`}
                        >
                          <Bike size={18} className="text-[#00A8E8]" />
                          <span>A Domicilio</span>
                          <span className="text-[10px] text-[#2DD4BF]">+$25 MXN</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('recoger')}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold transition-all ${
                            deliveryMethod === 'recoger'
                              ? 'bg-[#0084C7]/20 border-[#00A8E8] text-white shadow-md'
                              : 'bg-[#07111E] border-[#00A8E8]/15 text-[#8EA5C2]'
                          }`}
                        >
                          <Store size={18} className="text-[#FFC043]" />
                          <span>Pickup Local</span>
                          <span className="text-[10px] text-[#2DD4BF]">Sin Costo</span>
                        </button>
                      </div>

                      {/* Dirección obligatoria si es a domicilio */}
                      {deliveryMethod === 'domicilio' && (
                        <div className="pt-2">
                          <label className="block text-[#8EA5C2] mb-1 font-semibold">
                            Dirección de Entrega Completa (Calle, #, Colonia, Referencias) *
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Ej. Calle Miramar #104, Col. Centro. Portón blanco frente a la tienda."
                            value={customerAddress}
                            onChange={e => {
                              setCustomerAddress(e.target.value);
                              if (formErrors.address) setFormErrors(prev => ({ ...prev, address: undefined }));
                            }}
                            className={`w-full p-2.5 rounded-xl bg-[#07111E] border text-white placeholder-[#8EA5C2]/40 focus:outline-none transition-all ${
                              formErrors.address ? 'border-[#FF5942] ring-1 ring-[#FF5942]' : 'border-[#00A8E8]/20 focus:border-[#00A8E8]'
                            }`}
                          />
                          {formErrors.address && (
                            <p className="text-[#FF5942] text-[11px] font-semibold mt-1 flex items-center gap-1">
                              <AlertCircle size={12} /> {formErrors.address}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Forma de Pago */}
                    <div className="bg-[#13243B] border border-[#00A8E8]/15 rounded-2xl p-4 space-y-3">
                      <h4 className="font-bold text-sm text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Wallet size={14} className="text-[#00A8E8]" /> Forma de Pago
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('efectivo')}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold transition-all ${
                            paymentMethod === 'efectivo'
                              ? 'bg-[#0084C7]/20 border-[#00A8E8] text-white shadow-md'
                              : 'bg-[#07111E] border-[#00A8E8]/15 text-[#8EA5C2]'
                          }`}
                        >
                          <Wallet size={18} className="text-[#25D366]" />
                          <span>Efectivo</span>
                          <span className="text-[10px] text-[#8EA5C2]">Al recibir</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('transferencia')}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold transition-all ${
                            paymentMethod === 'transferencia'
                              ? 'bg-[#0084C7]/20 border-[#00A8E8] text-white shadow-md'
                              : 'bg-[#07111E] border-[#00A8E8]/15 text-[#8EA5C2]'
                          }`}
                        >
                          <Landmark size={18} className="text-[#00A8E8]" />
                          <span>Transferencia</span>
                          <span className="text-[10px] text-[#8EA5C2]">SPEI / BBVA</span>
                        </button>
                      </div>

                      {/* Campo cambio en efectivo */}
                      {paymentMethod === 'efectivo' && (
                        <div className="pt-2 bg-[#07111E] p-3 rounded-xl border border-[#00A8E8]/15">
                          <label className="block text-[#8EA5C2] mb-1 font-semibold">
                            ¿Con cuánto vas a pagar? (Para llevarte cambio exacto)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA5C2] font-bold">$</span>
                            <input
                              type="number"
                              placeholder={cartTotal.toString()}
                              value={cashAmount}
                              onChange={e => setCashAmount(e.target.value)}
                              className="w-full pl-7 pr-3 py-2 rounded-lg bg-[#13243B] border border-[#00A8E8]/20 text-white focus:outline-none focus:border-[#00A8E8]"
                            />
                          </div>
                          {changeDue > 0 && (
                            <p className="text-[11px] text-[#2DD4BF] font-bold mt-1.5 flex items-center gap-1">
                              <CheckCircle2 size={13} /> Tu cambio será de: ${changeDue} MXN
                            </p>
                          )}
                        </div>
                      )}

                      {/* Recuadro datos de transferencia */}
                      {paymentMethod === 'transferencia' && (
                        <div className="pt-2 bg-[#07111E] p-3.5 rounded-xl border border-[#00A8E8]/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">Datos Bancarios SPEI:</span>
                            <button
                              onClick={handleCopyBank}
                              className="text-[10px] text-[#00A8E8] hover:text-white flex items-center gap-1 font-bold bg-[#13243B] px-2 py-1 rounded-md border border-[#00A8E8]/30"
                            >
                              {copiedBank ? <Check size={12} className="text-[#25D366]" /> : <Copy size={12} />}
                              {copiedBank ? 'Copiado' : 'Copiar Todo'}
                            </button>
                          </div>
                          <div className="text-[11px] space-y-1 text-[#8EA5C2]">
                            <p>• <strong className="text-white">Banco:</strong> {bankInfo.bankName}</p>
                            <p>• <strong className="text-white">Titular:</strong> {bankInfo.accountHolder}</p>
                            <p>• <strong className="text-white">CLABE:</strong> <span className="font-mono text-white select-all">{bankInfo.clabe}</span></p>
                          </div>
                          <p className="text-[10px] text-[#FFC043] italic pt-1">
                            * Al enviar el WhatsApp podrás adjuntar tu comprobante de pago.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Notas adicionales */}
                    <div>
                      <label className="block text-[#8EA5C2] mb-1 font-semibold">
                        Observaciones adicionales para cocina
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Tostadas extra, limón partido, salsa aparte..."
                        value={orderNotes}
                        onChange={e => setOrderNotes(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#13243B] border border-[#00A8E8]/20 text-white placeholder-[#8EA5C2]/40 focus:outline-none focus:border-[#00A8E8]"
                      />
                    </div>

                  </div>
                )}

                {/* ── PASO 3: PANTALLA DE ÉXITO ── */}
                {cartStep === 3 && (
                  <div className="text-center py-16 px-4 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#25D366]/20 border border-[#25D366] text-[#25D366] flex items-center justify-center mx-auto animate-pulse">
                      <Check size={32} />
                    </div>
                    <h4 className="text-xl font-black text-white font-serif">¡Pedido Registrado con Éxito!</h4>
                    <p className="text-xs text-[#8EA5C2] leading-relaxed max-w-xs mx-auto">
                      Estamos abriendo WhatsApp automáticamente para que confirmes tu orden con nuestro equipo de cocina...
                    </p>
                    <div className="p-3.5 bg-[#13243B] rounded-2xl border border-[#00A8E8]/20 text-[11px] text-[#FFC043] font-bold">
                      🌊 Si no se abrió la aplicación, toca el botón verde de abajo.
                    </div>
                    <button
                      onClick={() => {
                        if (lastWaUrl) {
                          window.location.href = lastWaUrl;
                        } else {
                          handleFinalizeWhatsAppOrder();
                        }
                      }}
                      className="w-full py-3.5 rounded-xl bg-[#25D366] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#25D366]/30 hover:brightness-110 flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={18} /> Abrir WhatsApp Manualmente
                    </button>
                  </div>
                )}

              </div>

              {/* Footer Sticky del Carrito */}
              {cartStep !== 3 && cart.length > 0 && (
                <div className="p-4 bg-[#13243B] border-t border-[#00A8E8]/20 space-y-3">
                  {/* Desglose de totales */}
                  <div className="space-y-1 text-xs text-[#8EA5C2]">
                    <div className="flex justify-between">
                      <span>Subtotal de platillos</span>
                      <span className="text-white font-semibold">${cartSubtotal} MXN</span>
                    </div>
                    {deliveryMethod === 'domicilio' && (
                      <div className="flex justify-between text-[#2DD4BF]">
                        <span>Envío local</span>
                        <span className="font-semibold">+${deliveryCost} MXN</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-black text-white pt-1 border-t border-[#00A8E8]/10">
                      <span>Total</span>
                      <span className="text-[#2DD4BF]">${cartTotal} MXN</span>
                    </div>
                  </div>

                  {/* Botón de avance según paso */}
                  {cartStep === 1 ? (
                    <button
                      onClick={() => setCartStep(2)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0084C7] to-[#00A8E8] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#0084C7]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      Continuar a Entrega & Pago <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinalizeWhatsAppOrder}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1EBE5D] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#25D366]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={18} /> Enviar Pedido por WhatsApp · ${cartTotal}
                    </button>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FOOTER DE 3 COLUMNAS OBLIGATORIO (CON DATOS REALES DEL CLIENTE) ── */}
      <footer className="mt-16 bg-[#040B14] border-t border-[#00A8E8]/15 text-[#8EA5C2] text-xs">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-[#00A8E8]/10">
            
            {/* Columna 1: Logo y Presentación del Negocio */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FFC043] bg-[#07111E]">
                  <img src={logoImg} alt="Mesa Jarocha Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base font-serif">Mesa Jarocha</h4>
                  <span className="text-[10px] text-[#00A8E8] font-bold">Marisquería & Tradición</span>
                </div>
              </div>
              <p className="text-xs text-[#8EA5C2] leading-relaxed">
                El auténtico sabor del Golfo y la tradición Jarocha en tu mesa. Especialistas en mariscadas, pescados a las brasas y coctelería fresca.
              </p>
              <div className="pt-1">
                <span className="text-[10px] font-bold text-[#FFC043] block uppercase tracking-wider">Horario de Servicio</span>
                <span className="text-white text-xs">{clientConfig.hours}</span>
              </div>
            </div>

            {/* Columna 2: Contacto, Ubicación y Pedidos */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider font-serif">
                Contacto & Pedidos
              </h4>
              <div className="space-y-2 text-xs">
                <p className="flex items-start gap-2">
                  <MapPin size={15} className="text-[#FF5942] flex-shrink-0 mt-0.5" />
                  <span>{clientConfig.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={15} className="text-[#25D366] flex-shrink-0" />
                  <span>WhatsApp: <strong className="text-white">{clientConfig.phonePrimaryFormatted}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Wallet size={15} className="text-[#00A8E8] flex-shrink-0" />
                  <span>Aceptamos: Efectivo & Transferencia SPEI</span>
                </p>
              </div>
            </div>

            {/* Columna 3: Redes Sociales y Sellos de Confianza */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider font-serif">
                Síguenos & Comparte
              </h4>
              <p className="text-xs text-[#8EA5C2]">
                Conoce nuestras promociones de temporada, platillos del día y eventos especiales.
              </p>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <a
                  href={clientConfig.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group px-3 py-2 rounded-xl bg-[#0D1B2D] border border-[#00A8E8]/20 text-[#8EA5C2] hover:text-white hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 transition-all text-xs font-semibold flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 text-[#1877F2] fill-current flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </a>
                <a
                  href={clientConfig.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group px-3 py-2 rounded-xl bg-[#0D1B2D] border border-[#00A8E8]/20 text-[#8EA5C2] hover:text-white hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10 transition-all text-xs font-semibold flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 text-[#E1306C] fill-current flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram</span>
                </a>
                <a
                  href={clientConfig.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group px-3 py-2 rounded-xl bg-[#0D1B2D] border border-[#00A8E8]/20 text-[#8EA5C2] hover:text-white hover:border-[#25F4EE]/50 hover:bg-[#25F4EE]/10 transition-all text-xs font-semibold flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 text-[#25F4EE] fill-current flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.75 1.25-.05 2.37-.77 2.92-1.87.28-.53.37-1.13.37-1.73.03-4.7.01-9.4.02-14.1z" />
                  </svg>
                  <span>TikTok</span>
                </a>
              </div>
            </div>

          </div>

          {/* Pie de Crédito y Privacidad */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8EA5C2]">
            <p>© {new Date().getFullYear()} Mesa Jarocha. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-white transition-colors underline"
              >
                Aviso de Privacidad
              </button>
              <span>•</span>
              <span className="text-[#8EA5C2]">
                Diseñado por <strong className="text-white">IMAGINE & STAMP</strong>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── BOTÓN FLOTANTE WHATSAPP ── */}
      <a
        href={`https://wa.me/${clientConfig.phonePrimary}?text=${encodeURIComponent('¡Hola Mesa Jarocha! Quiero consultar el menú y hacer un pedido.')}`}
        className={`fixed z-40 p-3.5 rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center right-5 ${
          totalCartCount > 0 && !isCartOpen ? 'bottom-24 sm:bottom-5' : 'bottom-5'
        }`}
        title="Preguntar por WhatsApp"
      >
        <MessageCircle size={24} />
      </a>

      {/* ── BARRA FLOTANTE MÓVIL DE CARRITO (SI TIENE PRODUCTOS) ── */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
          <button
            onClick={() => {
              setIsCartOpen(true);
              setCartStep(1);
            }}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#FF5942] via-[#FF8C00] to-[#0084C7] text-white font-black text-xs uppercase tracking-wider shadow-2xl shadow-[#FF5942]/40 border border-white/20 flex items-center justify-between active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} />
              <span>Ver mi pedido ({totalCartCount})</span>
            </div>
            <span className="font-black text-sm bg-black/20 px-2.5 py-1 rounded-xl border border-white/20">${cartTotal} MXN</span>
          </button>
        </div>
      )}

      {/* ── MODAL AVISO DE PRIVACIDAD (LFPDPPP) ── */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0D1B2D] border border-[#00A8E8]/30 rounded-3xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-[#00A8E8]/15 flex items-center justify-between bg-[#13243B]">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield size={16} className="text-[#0084C7]" /> Aviso de Privacidad
                </h3>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-1 rounded-full bg-[#07111E] text-[#8EA5C2] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 overflow-y-auto text-xs text-[#8EA5C2] space-y-3 leading-relaxed">
                <p>
                  En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> de México, <strong>{clientConfig.businessName}</strong>, con domicilio comercial en {clientConfig.address}, informa que los datos personales recabados (nombre, teléfono y dirección) son utilizados exclusivamente para la gestión, preparación y entrega de sus pedidos de alimentos y bebidas.
                </p>
                <p>
                  Sus datos no son transferidos ni compartidos con terceros con fines comerciales ni publicitarios. La información de pago en efectivo o transferencia es tratada de manera estrictamente confidencial.
                </p>
                <p>
                  Usted tiene derecho a ejercer sus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) comunicándose a nuestro WhatsApp oficial: <strong>{clientConfig.phonePrimaryFormatted}</strong>.
                </p>
              </div>
              <div className="p-4 bg-[#13243B] border-t border-[#00A8E8]/15 flex justify-end">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#0084C7] text-white text-xs font-bold hover:brightness-110"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Compartir */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#25D366] text-white text-xs font-bold py-2 px-4 rounded-xl shadow-lg shadow-[#25D366]/30 flex items-center gap-2"
          >
            <Check size={16} /> ¡Enlace del menú copiado al portapapeles!
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
