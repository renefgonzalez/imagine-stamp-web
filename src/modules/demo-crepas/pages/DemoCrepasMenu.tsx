// ═══════════════════════════════════════════════════════════════════════════
// LA MACARENA — Crepería & Café
// Menú digital interactivo con personalización de extras, toppings y checkout WhatsApp.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, X, ShoppingBag, Croissant, UtensilsCrossed, Coffee,
  LayoutGrid, Sparkles, Phone, MapPin, Clock, Flame,
  Instagram, Facebook, MessageCircle, ArrowUp, Shield, ExternalLink,
  Copy, Check, Trash2, Landmark, Wallet, Store, Bike, Salad, Heart,
  SlidersHorizontal, CheckCircle2
} from 'lucide-react';
import { clientConfig, bankInfo } from '../config';

const C = clientConfig.colors;
const WHATSAPP = clientConfig.phone;

// ── Tipos ──
type CategoryId = 'especiales' | 'saladas' | 'dulces' | 'cafeteria' | 'bebidas';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
  badge?: string;
  featured?: boolean;
  includesSalad?: boolean;
  canCustomize?: boolean;
}

interface CustomizationChoice {
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
  extras?: CustomizationChoice[];
  toppings?: CustomizationChoice[];
  specialNotes?: string;
}

// ── Catálogo oficial de La Macarena ──
const PRODUCTS: Product[] = [
  // ── CREPAS ESPECIALES ($90) · Incluye Ensalada ──
  {
    id: 'esp-cielo',
    name: 'Crepa Especial Cielo',
    description: 'Pollo con rajas, elote tierno, crema y queso gratinado. Incluye ensalada.',
    price: 90,
    category: 'especiales',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=75',
    badge: 'La Favorita',
    featured: true,
    includesSalad: true,
  },
  {
    id: 'esp-mexicana',
    name: 'Crepa Especial Mexicana',
    description: 'Chorizo dorado, cebolla salteada, chile jalapeño y queso gratinado. Incluye ensalada.',
    price: 90,
    category: 'especiales',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=75',
    badge: 'Con Toque Picante',
    featured: true,
    includesSalad: true,
  },
  {
    id: 'esp-hawaiana',
    name: 'Crepa Especial Hawaiana',
    description: 'Jamón de pavo selecto, piña caramelizada y queso fundido. Incluye ensalada.',
    price: 90,
    category: 'especiales',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=75',
    featured: true,
    includesSalad: true,
  },
  {
    id: 'esp-vegetariana',
    name: 'Crepa Especial Vegetariana',
    description: 'Champiñones frescos, espinacas, pimiento morrón y queso fundido. Incluye ensalada.',
    price: 90,
    category: 'especiales',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=75',
    badge: 'Veggie',
    includesSalad: true,
  },

  // ── CREPAS SALADAS ($80) · Incluye Ensalada · Ingrediente Extra $10.00 ──
  {
    id: 'sal-peperoni',
    name: 'Crepa Salada de Peperoni',
    description: 'Peperoni de primera calidad con abundante queso derretido. Incluye ensalada.',
    price: 80,
    category: 'saladas',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=75',
    includesSalad: true,
    canCustomize: true,
  },
  {
    id: 'sal-jamon',
    name: 'Crepa Salada de Jamón',
    description: 'Jamón de pavo clásico y queso manchego fundido. Incluye ensalada.',
    price: 80,
    category: 'saladas',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=75',
    includesSalad: true,
    canCustomize: true,
  },
  {
    id: 'sal-champinones',
    name: 'Crepa Salada de Champiñones',
    description: 'Champiñones salteados al punto con queso gratinado. Incluye ensalada.',
    price: 80,
    category: 'saladas',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=75',
    includesSalad: true,
    canCustomize: true,
  },
  {
    id: 'sal-chorizo',
    name: 'Crepa Salada de Chorizo',
    description: 'Chorizo artesanal con queso derretido en masa doradita. Incluye ensalada.',
    price: 80,
    category: 'saladas',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=75',
    includesSalad: true,
    canCustomize: true,
  },

  // ── CREPAS DULCES ($70) · Ingrediente Extra $5.00 · Toppings $5.00 ──
  {
    id: 'dul-nutella',
    name: 'Crepa Dulce de Nutella',
    description: 'Abundante crema de avellanas Nutella untada al calor de la crêpe.',
    price: 70,
    category: 'dulces',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=75',
    badge: 'Imperdible',
    featured: true,
    canCustomize: true,
  },
  {
    id: 'dul-philadelphia',
    name: 'Crepa Dulce de Philadelphia',
    description: 'Suave y cremoso queso crema Philadelphia tradicional.',
    price: 70,
    category: 'dulces',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=75',
    canCustomize: true,
  },
  {
    id: 'dul-lechera',
    name: 'Crepa Dulce de Lechera',
    description: 'La clásica leche condensada dulce y consentidora.',
    price: 70,
    category: 'dulces',
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=75',
    canCustomize: true,
  },
  {
    id: 'dul-cajeta',
    name: 'Crepa Dulce de Cajeta',
    description: 'Cajeta tradicional de leche con delicioso sabor acaramelado.',
    price: 70,
    category: 'dulces',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=800&q=75',
    canCustomize: true,
  },
  {
    id: 'dul-chocolate',
    name: 'Crepa Dulce de Chocolate',
    description: 'Rico chocolate dulce ideal para los amantes del cacao.',
    price: 70,
    category: 'dulces',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=75',
    canCustomize: true,
  },
  {
    id: 'dul-mermelada',
    name: 'Crepa Dulce Mermelada de Fresa',
    description: 'Mermelada de fresa natural con pedacitos de fruta fresca.',
    price: 70,
    category: 'dulces',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=75',
    canCustomize: true,
  },

  // ── CAFETERÍA ──
  {
    id: 'caf-americano',
    name: 'Café Americano',
    description: 'Café de grano recién molido, balanceado y aromático.',
    price: 30,
    category: 'cafeteria',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'caf-latte',
    name: 'Latte',
    description: 'Espresso con leche suavemente vaporizada y crema tersa.',
    price: 55,
    category: 'cafeteria',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=75',
    featured: true,
  },
  {
    id: 'caf-espresso',
    name: 'Espresso',
    description: 'Extracción corta e intensa de café de especialidad con crema dorada.',
    price: 30,
    category: 'cafeteria',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'caf-chocolate',
    name: 'Chocolate Caliente',
    description: 'Chocolate tradicional espeso y cremoso con leche caliente.',
    price: 55,
    category: 'cafeteria',
    image: 'https://images.unsplash.com/photo-1542990253-a781e04c0082?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'caf-refil',
    name: 'Café Refil',
    description: 'Café americano con refill ilimitado durante tu visita en mesa.',
    price: 40,
    category: 'cafeteria',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=75',
    badge: 'Refill',
  },

  // ── BEBIDAS ──
  {
    id: 'beb-agua-dia',
    name: 'Agua del Día',
    description: 'Agua fresca de frutas naturales preparada fresca todos los días.',
    price: 30,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'beb-agua-coco',
    name: 'Agua de Coco Natural',
    description: 'Agua de coco 100% natural, fría, refrescante y revitalizante.',
    price: 35,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&w=800&q=75',
    badge: '100% Natural',
  },
];

// Opciones de personalización según el tipo
const EXTRAS_SALADAS: CustomizationChoice[] = [
  { name: 'Peperoni Extra', price: 10 },
  { name: 'Jamón Extra', price: 10 },
  { name: 'Champiñones Extra', price: 10 },
  { name: 'Chorizo Extra', price: 10 },
  { name: 'Queso Manchego Extra', price: 10 },
];

const EXTRAS_DULCES: CustomizationChoice[] = [
  { name: 'Nutella Extra', price: 5 },
  { name: 'Philadelphia Extra', price: 5 },
  { name: 'Lechera Extra', price: 5 },
  { name: 'Cajeta Extra', price: 5 },
  { name: 'Chocolate Extra', price: 5 },
  { name: 'Mermelada Fresa Extra', price: 5 },
];

const TOPPINGS_DULCES: CustomizationChoice[] = [
  { name: 'Nuez picada', price: 5 },
  { name: 'Coco Tostado', price: 5 },
  { name: 'Plátano fresco', price: 5 },
  { name: 'Fresa fresca', price: 5 },
];

const CATEGORIES = [
  { id: 'all' as const, name: 'Todo el Menú', icon: LayoutGrid },
  { id: 'especiales' as const, name: 'Especiales $90', icon: Sparkles },
  { id: 'saladas' as const, name: 'Saladas $80', icon: UtensilsCrossed },
  { id: 'dulces' as const, name: 'Dulces $70', icon: Croissant },
  { id: 'cafeteria' as const, name: 'Cafetería', icon: Coffee },
  { id: 'bebidas' as const, name: 'Bebidas', icon: Heart },
];

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=70';
const onImgError = (e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; };

// ═══════════════════ COMPONENTE PRINCIPAL ═══════════════════
export default function DemoCrepasMenu() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const s = localStorage.getItem('macarena_cart');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [activeCategory, setActiveCategory] = useState<'all' | CategoryId>('all');
  const [query, setQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    address: '',
    paymentMethod: 'cash' as 'cash' | 'transfer',
    cashAmount: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMsg, setToastMsg] = useState('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Estado del Modal de Personalización
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<CustomizationChoice[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<CustomizationChoice[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');

  // Persistencia de Carrito
  useEffect(() => {
    try {
      localStorage.setItem('macarena_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Lock de scroll al abrir modales
  useEffect(() => {
    document.body.style.overflow = isCartOpen || isPrivacyOpen || customizingProduct !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen, isPrivacyOpen, customizingProduct]);

  useEffect(() => {
    document.title = 'La Macarena | Crepería & Café · Menú Digital';
  }, []);

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const filteredProducts = useMemo(() => {
    let r = PRODUCTS;
    if (query.trim()) {
      const q = normalize(query);
      r = r.filter(p => normalize(p.name).includes(q) || normalize(p.description).includes(q) || normalize(p.category).includes(q));
    } else if (activeCategory !== 'all') {
      r = r.filter(p => p.category === activeCategory);
    }
    return r;
  }, [activeCategory, query]);

  const featured = useMemo(() => PRODUCTS.filter(p => p.featured), []);
  const showFeatured = activeCategory === 'all' && !query.trim();

  // Abrir personalización o añadir directo
  const handleProductClick = (product: Product) => {
    if (product.category === 'saladas' || product.category === 'dulces') {
      setCustomizingProduct(product);
      setSelectedExtras([]);
      setSelectedToppings([]);
      setSpecialNotes('');
    } else {
      // Agregar directo
      addItemToCart(product, [], [], '');
    }
  };

  const addItemToCart = (
    product: Product,
    extras: CustomizationChoice[],
    toppings: CustomizationChoice[],
    notes: string
  ) => {
    const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
    const toppingsTotal = toppings.reduce((sum, t) => sum + t.price, 0);
    const unitPrice = product.price + extrasTotal + toppingsTotal;

    // Generar ID único según personalizaciones
    const extraKey = extras.map(e => e.name).sort().join('-');
    const topKey = toppings.map(t => t.name).sort().join('-');
    const lineId = `${product.id}_${extraKey}_${topKey}_${notes.trim().slice(0, 10)}`;

    setCart(prev => {
      const existing = prev.find(i => i.lineId === lineId);
      if (existing) {
        return prev.map(i => i.lineId === lineId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          name: product.name,
          basePrice: product.price,
          unitPrice,
          quantity: 1,
          image: product.image,
          category: product.category,
          extras: extras.length > 0 ? extras : undefined,
          toppings: toppings.length > 0 ? toppings : undefined,
          specialNotes: notes.trim() || undefined,
        },
      ];
    });

    setToastMsg(product.name);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleConfirmCustomization = () => {
    if (!customizingProduct) return;
    addItemToCart(customizingProduct, selectedExtras, selectedToppings, specialNotes);
    setCustomizingProduct(null);
  };

  const toggleExtra = (item: CustomizationChoice) => {
    setSelectedExtras(prev =>
      prev.some(e => e.name === item.name) ? prev.filter(e => e.name !== item.name) : [...prev, item]
    );
  };

  const toggleTopping = (item: CustomizationChoice) => {
    setSelectedToppings(prev =>
      prev.some(t => t.name === item.name) ? prev.filter(t => t.name !== item.name) : [...prev, item]
    );
  };

  const handleUpdateQty = (lineId: string, d: number) => {
    setCart(prev =>
      prev
        .map(i => (i.lineId === lineId ? { ...i, quantity: Math.max(1, i.quantity + d) } : i))
        .filter(i => i.quantity > 0)
    );
  };

  const handleRemove = (lineId: string) => setCart(prev => prev.filter(i => i.lineId !== lineId));
  const handleClearCart = () => setCart([]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!customerInfo.name.trim()) e.name = 'Ingresa tu nombre';
    if (!customerInfo.phone.trim()) e.phone = 'Ingresa tu WhatsApp';
    if (customerInfo.deliveryMethod === 'delivery' && !customerInfo.address.trim()) {
      e.address = 'Ingresa tu dirección de entrega';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOrder = () => {
    if (!validate()) return;

    const itemsText = cart
      .map((item, i) => {
        let text = `${i + 1}. *${item.quantity}× ${item.name}* — $${item.unitPrice * item.quantity}`;
        if (item.extras && item.extras.length > 0) {
          text += `\n   ➕ Extras: ${item.extras.map(e => `${e.name} (+$${e.price})`).join(', ')}`;
        }
        if (item.toppings && item.toppings.length > 0) {
          text += `\n   🍓 Toppings: ${item.toppings.map(t => `${t.name} (+$${t.price})`).join(', ')}`;
        }
        if (item.specialNotes) {
          text += `\n   📝 Nota: ${item.specialNotes}`;
        }
        return text;
      })
      .join('\n\n');

    const deliveryText =
      customerInfo.deliveryMethod === 'pickup'
        ? '🛒 *Modalidad:* Para recoger en local / Comer aquí'
        : `🛵 *Envío a domicilio:* ${customerInfo.address}`;

    let paymentText =
      customerInfo.paymentMethod === 'cash' ? '💵 *Forma de pago:* Efectivo' : '🏦 *Forma de pago:* Transferencia BBVA';
    if (customerInfo.paymentMethod === 'cash' && customerInfo.cashAmount) {
      paymentText += ` (Paga con: $${customerInfo.cashAmount} · Cambio: $${Math.max(0, Number(customerInfo.cashAmount) - cartTotal)})`;
    }

    const msg =
      `🥞 *NUEVO PEDIDO — LA MACARENA CREPERÍA & CAFÉ*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 *Detalle del Pedido (${totalItems} items):*\n\n` +
      `${itemsText}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *TOTAL A PAGAR: $${cartTotal} MXN*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 *Cliente:* ${customerInfo.name}\n` +
      `📱 *WhatsApp:* ${customerInfo.phone}\n` +
      `${deliveryText}\n` +
      `${paymentText}` +
      (customerInfo.notes ? `\n\n📝 *Notas generales:* ${customerInfo.notes}` : '') +
      `\n\n_Enviado desde el Menú Digital Oficial_`;

    setCartStep(3);
    setTimeout(() => {
      window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
      handleClearCart();
      setCustomerInfo({
        name: '', phone: '', deliveryMethod: 'pickup', address: '',
        paymentMethod: 'cash', cashAmount: '', notes: ''
      });
      setIsCartOpen(false);
    }, 500);
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };

  const bankFields = [
    { k: 'bankName', l: 'Banco', v: bankInfo.bankName },
    { k: 'holder', l: 'Titular', v: bankInfo.accountHolder },
    { k: 'clabe', l: 'CLABE', v: bankInfo.clabe },
    { k: 'card', l: 'Tarjeta', v: bankInfo.cardNumber },
  ];

  return (
    <div
      className="macarena-root min-h-screen flex flex-col selection:bg-amber-200 selection:text-amber-950"
      style={{ backgroundColor: C.bg, fontFamily: '"Karla", system-ui, sans-serif', color: C.textPrimary }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,600&family=Karla:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Bebas+Neue&display=swap');
        .macarena-root button, .macarena-root a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        .macarena-display { font-family: "Playfair Display", serif; }
        .macarena-sans { font-family: "Karla", sans-serif; }
        .macarena-hide-scrollbar::-webkit-scrollbar { display: none; }
        .macarena-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes macarena-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .macarena-marquee-track {
          display: flex;
          width: max-content;
          animation: macarena-marquee 24s linear infinite;
        }
        .macarena-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ═══ CINTILLO SUPERIOR TIPO CARRUSEL INFINITO (PRÓXIMAMENTE DESAYUNOS) ═══ */}
      <div className="bg-[#2E231D] text-[#F4ECE1] text-[11px] font-bold uppercase tracking-[0.22em] py-2 overflow-hidden border-b border-[#9E744F]/30 select-none relative z-50">
        <div className="macarena-marquee-track flex items-center">
          {/* Bloque 1 */}
          <div className="flex items-center gap-6 shrink-0 pr-6">
            <span className="flex items-center gap-1.5 text-[#FAF7F2]">
              <Sparkles size={13} className="text-[#B88E67]" />
              <span>PRÓXIMAMENTE DESAYUNOS</span>
            </span>
            <span className="text-[#9E744F]">✦</span>
            <span className="flex items-center gap-1.5 text-[#F4ECE1]/90">
              <Coffee size={13} className="text-[#B88E67]" />
              <span>CAFÉ & CRÊPES ARTESANALES</span>
            </span>
            <span className="text-[#9E744F]">✦</span>
            <span className="flex items-center gap-1.5 text-[#FAF7F2]">
              <Croissant size={13} className="text-[#B88E67]" />
              <span>LA MACARENA CREPERÍA</span>
            </span>
            <span className="text-[#9E744F]">✦</span>
            <span className="flex items-center gap-1.5 text-[#F4ECE1]/90">
              <Sparkles size={13} className="text-[#B88E67]" />
              <span>NUEVOS PLATILLOS MATUTINOS</span>
            </span>
            <span className="text-[#9E744F]">✦</span>
          </div>

          {/* Bloque 2 (Duplicado para loop infinito fluido) */}
          <div className="flex items-center gap-6 shrink-0 pr-6" aria-hidden="true">
            <span className="flex items-center gap-1.5 text-[#FAF7F2]">
              <Sparkles size={13} className="text-[#B88E67]" />
              <span>PRÓXIMAMENTE DESAYUNOS</span>
            </span>
            <span className="text-[#9E744F]">✦</span>
            <span className="flex items-center gap-1.5 text-[#F4ECE1]/90">
              <Coffee size={13} className="text-[#B88E67]" />
              <span>CAFÉ & CRÊPES ARTESANALES</span>
            </span>
            <span className="text-[#9E744F]">✦</span>
            <span className="flex items-center gap-1.5 text-[#FAF7F2]">
              <Croissant size={13} className="text-[#B88E67]" />
              <span>LA MACARENA CREPERÍA</span>
            </span>
            <span className="text-[#9E744F]">✦</span>
            <span className="flex items-center gap-1.5 text-[#F4ECE1]/90">
              <Sparkles size={13} className="text-[#B88E67]" />
              <span>NUEVOS PLATILLOS MATUTINOS</span>
            </span>
            <span className="text-[#9E744F]">✦</span>
          </div>
        </div>
      </div>

      {/* ═══ HEADER STICKY ═══ */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-[#9E744F]/15 shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
              style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color: '#FFFFFF' }}
            >
              <Croissant size={20} className="drop-shadow" />
            </div>
            <div className="leading-tight">
              <h1 className="macarena-display text-xl font-bold tracking-tight" style={{ color: C.primary }}>
                La Macarena
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: C.secondary }}>
                Crepería & Café
              </p>
            </div>
          </div>

          <button
            onClick={() => { setCartStep(1); setIsCartOpen(true); }}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
            style={{ backgroundColor: C.primary, color: '#FFFFFF', borderColor: C.primary }}
            aria-label="Ver carrito"
          >
            <ShoppingBag size={17} />
            <span className="text-xs font-bold hidden sm:inline-block">Ver Pedido</span>
            {cart.length > 0 && (
              <span
                className="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center shadow-md animate-pulse"
                style={{ backgroundColor: C.secondary, color: '#FFFFFF' }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ═══ HERO / IDENTIDAD DE MARCA ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2E231D] to-[#3B2C24] text-[#FAF7F2] pt-10 pb-12 px-4 md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#9E744F_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-3 border backdrop-blur-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F4ECE1', borderColor: 'rgba(184,142,103,0.4)' }}
            >
              <Sparkles size={11} className="text-[#B88E67]" /> Especialidad en Crêpes & Café
            </span>
            <h2 className="macarena-display text-4xl md:text-5xl font-black tracking-tight text-white">
              La Macarena
            </h2>
            <p className="text-[#B88E67] font-semibold text-sm md:text-base tracking-widest uppercase mt-1">
              Crepería & Café
            </p>
            <p className="text-white/80 text-xs md:text-sm mt-3 max-w-md mx-auto leading-relaxed">
              Crêpes preparadas al momento, dulces y saladas con ingredientes selectos, café de especialidad y bebidas refrescantes.
            </p>

            {/* Micro datos de contacto en hero */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-5 text-[11px] text-[#F4ECE1]/70">
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#B88E67]" /> V. Carranza #1725</span>
              <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#B88E67]" /> Mar–Dom 9:00 AM – 9:30 PM</span>
              <a href={`https://wa.me/${WHATSAPP}`} className="flex items-center gap-1.5 text-[#25D366] font-bold hover:underline">
                <MessageCircle size={12} /> 312 116 55 55
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ BUSCADOR & FILTROS STICKY ═══ */}
      <div className="sticky top-16 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#9E744F]/10 py-3 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 space-y-2.5">
          {/* Input de Búsqueda */}
          <div className="relative">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D6D63]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar crêpe, sabor o bebida..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white border border-[#9E744F]/20 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#9E744F]/40 shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
                aria-label="Limpiar búsqueda"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Categorías deslizables */}
          <div className="flex items-center gap-2 overflow-x-auto macarena-hide-scrollbar pb-1 pt-0.5">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id && !query;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setQuery(''); }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                    active
                      ? 'bg-[#2E231D] text-white border-[#2E231D] shadow-md scale-[1.03]'
                      : 'bg-white text-[#5B4B42] border-[#9E744F]/20 hover:border-[#9E744F]/50 hover:bg-[#F4ECE1]'
                  }`}
                >
                  <cat.icon size={13} style={{ color: active ? '#B88E67' : C.secondary }} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ SECCIÓN DESTACADOS (LOS FAVORITOS) ═══ */}
      {showFeatured && featured.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pt-6 pb-2">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="macarena-display text-lg font-black tracking-tight text-[#2E231D] flex items-center gap-1.5">
              <Sparkles size={16} className="text-[#9E744F]" /> Los Favoritos de La Macarena
            </h3>
            <span className="text-[11px] font-bold text-[#9E744F] uppercase tracking-wider">Más pedidos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {featured.map((p) => (
              <div
                key={`feat-${p.id}`}
                onClick={() => handleProductClick(p)}
                className="group cursor-pointer rounded-2xl bg-white p-3 border border-[#9E744F]/15 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-2 bg-[#F4ECE1]">
                    <img
                      src={p.image}
                      alt={p.name}
                      onError={onImgError}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {p.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#2E231D] text-white shadow-sm">
                        {p.badge}
                      </span>
                    )}
                    {p.includesSalad && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FAF7F2]/90 text-[#2E231D] backdrop-blur-sm shadow-sm flex items-center gap-1">
                        <Salad size={10} className="text-emerald-700" /> Ensalada
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs md:text-sm text-[#2E231D] leading-tight group-hover:text-[#9E744F] transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-[#7D6D63] mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#FAF7F2] flex items-center justify-between">
                  <span className="text-sm font-black text-[#2E231D]">${p.price}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleProductClick(p); }}
                    className="w-7 h-7 rounded-full bg-[#2E231D] text-white flex items-center justify-center shadow hover:bg-[#9E744F] transition-colors"
                    aria-label={`Agregar ${p.name}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ LISTADO DE PRODUCTOS / MENÚ ═══ */}
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-8 border border-[#9E744F]/15">
            <Croissant size={40} className="mx-auto text-[#9E744F]/40 mb-3" />
            <p className="text-base font-bold text-[#2E231D]">No se encontraron resultados</p>
            <p className="text-xs text-[#7D6D63] mt-1">Intenta buscando con otra palabra o selecciona una categoría.</p>
            <button
              onClick={() => { setQuery(''); setActiveCategory('all'); }}
              className="mt-4 px-4 py-2 rounded-full text-xs font-bold bg-[#2E231D] text-white hover:bg-[#9E744F] transition-colors"
            >
              Ver todo el menú
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Título de categoría actual */}
            <div className="flex items-center justify-between pb-1 border-b border-[#9E744F]/15">
              <h3 className="macarena-display text-xl font-bold text-[#2E231D]">
                {query ? `Resultados para "${query}"` : CATEGORIES.find(c => c.id === activeCategory)?.name}
              </h3>
              <span className="text-xs font-semibold text-[#7D6D63]">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'artículo' : 'artículos'}
              </span>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group cursor-pointer rounded-2xl bg-white p-3.5 border border-[#9E744F]/15 shadow-sm hover:shadow-md transition-all duration-200 flex gap-3.5 items-center justify-between"
                >
                  <div className="flex-1 pr-1">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      {product.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#2E231D] text-white">
                          {product.badge}
                        </span>
                      )}
                      {product.includesSalad && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center gap-1">
                          <Salad size={9} /> Incluye ensalada
                        </span>
                      )}
                      {product.canCustomize && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200/60">
                          Personalizable
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm md:text-base text-[#2E231D] leading-tight group-hover:text-[#9E744F] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-[#7D6D63] mt-1 leading-snug line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-sm md:text-base font-black text-[#2E231D]">${product.price}</span>
                      {product.category === 'saladas' && (
                        <span className="text-[10px] text-[#7D6D63] font-medium">+ Extra $10</span>
                      )}
                      {product.category === 'dulces' && (
                        <span className="text-[10px] text-[#7D6D63] font-medium">+ Extra / Toppings $5</span>
                      )}
                    </div>
                  </div>

                  {/* Imagen y botón añadir */}
                  <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#F4ECE1]">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={onImgError}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleProductClick(product); }}
                      className="absolute bottom-1.5 right-1.5 w-8 h-8 rounded-full bg-[#2E231D] text-white flex items-center justify-center shadow-lg hover:bg-[#9E744F] hover:scale-110 active:scale-95 transition-all"
                      aria-label={`Agregar ${product.name}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ═══ FOOTER 3 COLUMNAS CON DATOS REALES DE LA MACARENA ═══ */}
      <footer className="bg-[#2E231D] text-[#FAF7F2] mt-12 border-t border-[#9E744F]/20">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs md:text-sm">
          {/* Columna 1: Marca & Descripción */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#9E744F] text-white flex items-center justify-center">
                <Croissant size={16} />
              </div>
              <span className="macarena-display text-xl font-bold tracking-tight text-white">
                La Macarena
              </span>
            </div>
            <p className="text-white/60 leading-relaxed">
              {clientConfig.description}
            </p>
            <p className="text-[11px] font-bold text-[#B88E67] uppercase tracking-wider">
              ✨ Próximamente desayunos en La Macarena
            </p>
          </div>

          {/* Columna 2: Contacto, Dirección y Horario */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#B88E67]">
              Contacto & Ubicación
            </h4>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              className="flex items-center gap-2 text-white/80 hover:text-[#25D366] transition-colors"
            >
              <MessageCircle size={15} className="text-[#25D366]" /> {clientConfig.phoneNumber}
            </a>
            <div className="flex items-start gap-2 text-white/80">
              <MapPin size={15} className="text-[#B88E67] shrink-0 mt-0.5" />
              <span>{clientConfig.address}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Clock size={15} className="text-[#B88E67]" />
              <span>{clientConfig.hours}</span>
            </div>
          </div>

          {/* Columna 3: Redes Sociales */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#B88E67]">
              Síguenos en Redes
            </h4>
            <p className="text-white/60 text-xs">
              Descubre promociones y nuevas creaciones siguiéndonos en nuestras cuentas oficiales:
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={clientConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-[#B88E67] transition-colors"
              >
                <Instagram size={16} className="text-[#B88E67]" /> @{clientConfig.instagramHandle}
              </a>
              <span className="inline-flex items-center gap-2 text-white/80">
                <Facebook size={16} className="text-[#B88E67]" /> {clientConfig.facebookName}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Créditos & Privacidad */}
        <div className="border-t border-white/10 py-6 px-4 text-center text-[10px] text-white/50 uppercase tracking-widest space-y-2">
          <p>© {new Date().getFullYear()} La Macarena Crepería & Café. Todos los derechos reservados.</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://imagineandstamp.site"
              target="_blank"
              rel="noreferrer"
              className="text-[#B88E67] hover:underline font-bold"
            >
              Diseñado por IMAGINE & STAMP
            </a>
            <span>·</span>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-white transition-colors underline"
            >
              Aviso de Privacidad
            </button>
          </div>
        </div>
      </footer>

      {/* ═══ BOTÓN FLOTANTE DEL CARRITO (MÓVIL) ═══ */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 z-40 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <button
            onClick={() => { setCartStep(1); setIsCartOpen(true); }}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#2E231D] text-white font-bold shadow-2xl flex items-center justify-between border border-[#9E744F]/40 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#9E744F] text-white text-xs flex items-center justify-center font-black">
                {totalItems}
              </span>
              <span className="text-sm">Ver Pedido</span>
            </div>
            <span className="text-sm font-black text-[#B88E67]">${cartTotal}</span>
          </button>
        </div>
      )}

      {/* ═══ TOAST NOTIFICACIÓN ═══ */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#2E231D] text-white text-xs font-bold shadow-xl flex items-center gap-2 border border-[#9E744F]/30"
          >
            <Check size={14} className="text-[#25D366]" />
            <span>Agregado: {toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MODAL DE PERSONALIZACIÓN DE CRÊPES (EXTRAS & TOPPINGS) ═══ */}
      <AnimatePresence>
        {customizingProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizingProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.28 }}
              className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header Modal */}
              <div className="p-4 border-b border-[#FAF7F2] bg-[#F4ECE1]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={customizingProduct.image}
                    alt={customizingProduct.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-[#2E231D] leading-tight">
                      Personalizar {customizingProduct.name}
                    </h3>
                    <p className="text-xs text-[#9E744F] font-bold">
                      Base: ${customizingProduct.price} MXN
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCustomizingProduct(null)}
                  className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/60 hover:bg-black/10"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Contenido scrolleable de personalización */}
              <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs md:text-sm">
                {/* Opciones para Crepas Saladas */}
                {customizingProduct.category === 'saladas' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-[#2E231D] uppercase tracking-wider text-[11px]">
                        Ingredientes Extras (+$10 c/u)
                      </label>
                      <span className="text-[10px] text-[#7D6D63]">Opcional</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {EXTRAS_SALADAS.map((extra) => {
                        const isChecked = selectedExtras.some(e => e.name === extra.name);
                        return (
                          <button
                            type="button"
                            key={extra.name}
                            onClick={() => toggleExtra(extra)}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                              isChecked
                                ? 'bg-[#2E231D] text-white border-[#2E231D] font-bold shadow-sm'
                                : 'bg-[#FAF7F2] text-[#2E231D] border-[#9E744F]/20 hover:border-[#9E744F]'
                            }`}
                          >
                            <span>{extra.name}</span>
                            <span className={isChecked ? 'text-[#B88E67]' : 'text-[#7D6D63]'}>+$10</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Opciones para Crepas Dulces */}
                {customizingProduct.category === 'dulces' && (
                  <>
                    {/* Ingredientes Extras Dulces */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-[#2E231D] uppercase tracking-wider text-[11px]">
                          Ingredientes Extras Dulces (+$5 c/u)
                        </label>
                        <span className="text-[10px] text-[#7D6D63]">Opcional</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {EXTRAS_DULCES.map((extra) => {
                          const isChecked = selectedExtras.some(e => e.name === extra.name);
                          return (
                            <button
                              type="button"
                              key={extra.name}
                              onClick={() => toggleExtra(extra)}
                              className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                                isChecked
                                  ? 'bg-[#2E231D] text-white border-[#2E231D] font-bold shadow-sm'
                                  : 'bg-[#FAF7F2] text-[#2E231D] border-[#9E744F]/20 hover:border-[#9E744F]'
                              }`}
                            >
                              <span>{extra.name}</span>
                              <span className={isChecked ? 'text-[#B88E67]' : 'text-[#7D6D63]'}>+$5</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Toppings Dulces */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-[#2E231D] uppercase tracking-wider text-[11px]">
                          Toppings (+$5 c/u)
                        </label>
                        <span className="text-[10px] text-[#7D6D63]">Opcional</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {TOPPINGS_DULCES.map((topping) => {
                          const isChecked = selectedToppings.some(t => t.name === topping.name);
                          return (
                            <button
                              type="button"
                              key={topping.name}
                              onClick={() => toggleTopping(topping)}
                              className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                                isChecked
                                  ? 'bg-[#2E231D] text-white border-[#2E231D] font-bold shadow-sm'
                                  : 'bg-[#FAF7F2] text-[#2E231D] border-[#9E744F]/20 hover:border-[#9E744F]'
                              }`}
                            >
                              <span>{topping.name}</span>
                              <span className={isChecked ? 'text-[#B88E67]' : 'text-[#7D6D63]'}>+$5</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Notas especiales */}
                <div>
                  <label className="font-bold text-[#2E231D] uppercase tracking-wider text-[11px] block mb-1.5">
                    Instrucciones especiales (Opcional)
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Ej. Bien doradita, poca canela, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#9E744F]/20 bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#9E744F]"
                  />
                </div>
              </div>

              {/* Botón de Confirmación */}
              <div className="p-4 bg-white border-t border-[#FAF7F2] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7D6D63] block">Subtotal:</span>
                  <span className="text-lg font-black text-[#2E231D]">
                    $
                    {customizingProduct.price +
                      selectedExtras.reduce((s, e) => s + e.price, 0) +
                      selectedToppings.reduce((s, t) => s + t.price, 0)}{' '}
                    MXN
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmCustomization}
                  className="px-6 py-3 rounded-full bg-[#2E231D] text-white font-bold text-xs md:text-sm hover:bg-[#9E744F] transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <Plus size={16} /> Agregar al Pedido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ DRAWER DEL CARRITO (2 PASOS OBLIGATORIOS) ═══ */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
            >
              {/* Header Carrito */}
              <div className="p-4 bg-[#2E231D] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#B88E67]" />
                  <h3 className="font-bold text-sm">
                    {cartStep === 1 ? `Mi Pedido (${totalItems})` : cartStep === 2 ? 'Datos de Entrega' : '¡Pedido Listo!'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* PASO 1: LISTA DE ARTÍCULOS */}
              {cartStep === 1 && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  {cart.length === 0 ? (
                    <div className="p-8 text-center my-auto">
                      <ShoppingBag size={48} className="mx-auto text-[#9E744F]/30 mb-3" />
                      <p className="font-bold text-[#2E231D]">Tu carrito está vacío</p>
                      <p className="text-xs text-[#7D6D63] mt-1">Elige tus crêpes o cafés favoritos para comenzar.</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 overflow-y-auto space-y-3 flex-1">
                        {cart.map((item) => (
                          <div
                            key={item.lineId}
                            className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#9E744F]/15 flex gap-3 items-start"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs text-[#2E231D] leading-tight truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs font-black text-[#9E744F] mt-0.5">
                                ${item.unitPrice * item.quantity}{' '}
                                <span className="text-[10px] text-[#7D6D63] font-normal">
                                  (${item.unitPrice} c/u)
                                </span>
                              </p>

                              {/* Desglose de extras */}
                              {item.extras && item.extras.length > 0 && (
                                <p className="text-[10px] text-[#7D6D63] mt-1">
                                  ➕ {item.extras.map(e => e.name).join(', ')}
                                </p>
                              )}
                              {item.toppings && item.toppings.length > 0 && (
                                <p className="text-[10px] text-[#7D6D63]">
                                  🍓 {item.toppings.map(t => t.name).join(', ')}
                                </p>
                              )}
                              {item.specialNotes && (
                                <p className="text-[10px] text-amber-900 italic">
                                  📝 {item.specialNotes}
                                </p>
                              )}

                              {/* Controles de Cantidad */}
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => handleUpdateQty(item.lineId, -1)}
                                  className="w-6 h-6 rounded-full bg-white border border-black/10 flex items-center justify-center text-black active:scale-95"
                                >
                                  <Minus size={11} />
                                </button>
                                <span className="text-xs font-bold">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQty(item.lineId, 1)}
                                  className="w-6 h-6 rounded-full bg-white border border-black/10 flex items-center justify-center text-black active:scale-95"
                                >
                                  <Plus size={11} />
                                </button>
                                <button
                                  onClick={() => handleRemove(item.lineId)}
                                  className="ml-auto text-red-500 hover:text-red-700 p-1"
                                  aria-label="Eliminar"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer Paso 1 */}
                      <div className="p-4 bg-white border-t border-[#FAF7F2] space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#7D6D63]">Total del pedido:</span>
                          <span className="text-lg font-black text-[#2E231D]">${cartTotal} MXN</span>
                        </div>
                        <button
                          onClick={() => setCartStep(2)}
                          className="w-full py-3.5 rounded-full bg-[#2E231D] text-white font-bold text-xs md:text-sm hover:bg-[#9E744F] transition-all shadow-lg active:scale-98"
                        >
                          Continuar a Datos de Entrega →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* PASO 2: DATOS DE ENTREGA & PAGO */}
              {cartStep === 2 && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
                    {/* Botón Regresar */}
                    <button
                      onClick={() => setCartStep(1)}
                      className="text-xs font-bold text-[#9E744F] hover:underline flex items-center gap-1"
                    >
                      ← Modificar artículos
                    </button>

                    {/* Datos del Cliente */}
                    <div className="space-y-3">
                      <div>
                        <label className="font-bold text-[#2E231D] uppercase tracking-wider text-[10px] block mb-1">
                          Tu Nombre *
                        </label>
                        <input
                          type="text"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ej. Sofía Mendoza"
                          className={`w-full px-3.5 py-2.5 rounded-xl border ${
                            errors.name ? 'border-red-500 bg-red-50/30' : 'border-[#9E744F]/20 bg-[#FAF7F2]'
                          } focus:outline-none focus:ring-2 focus:ring-[#9E744F]`}
                        />
                        {errors.name && <span className="text-[10px] text-red-500 font-bold">{errors.name}</span>}
                      </div>

                      <div>
                        <label className="font-bold text-[#2E231D] uppercase tracking-wider text-[10px] block mb-1">
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Ej. 312 123 4567"
                          className={`w-full px-3.5 py-2.5 rounded-xl border ${
                            errors.phone ? 'border-red-500 bg-red-50/30' : 'border-[#9E744F]/20 bg-[#FAF7F2]'
                          } focus:outline-none focus:ring-2 focus:ring-[#9E744F]`}
                        />
                        {errors.phone && <span className="text-[10px] text-red-500 font-bold">{errors.phone}</span>}
                      </div>
                    </div>

                    {/* Método de Entrega */}
                    <div>
                      <label className="font-bold text-[#2E231D] uppercase tracking-wider text-[10px] block mb-1.5">
                        Tipo de Entrega
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCustomerInfo(prev => ({ ...prev, deliveryMethod: 'pickup' }))}
                          className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                            customerInfo.deliveryMethod === 'pickup'
                              ? 'bg-[#2E231D] text-white border-[#2E231D] shadow-sm'
                              : 'bg-[#FAF7F2] text-[#2E231D] border-[#9E744F]/20'
                          }`}
                        >
                          <Store size={16} />
                          <span>Comer aquí / Pickup</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerInfo(prev => ({ ...prev, deliveryMethod: 'delivery' }))}
                          className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                            customerInfo.deliveryMethod === 'delivery'
                              ? 'bg-[#2E231D] text-white border-[#2E231D] shadow-sm'
                              : 'bg-[#FAF7F2] text-[#2E231D] border-[#9E744F]/20'
                          }`}
                        >
                          <Bike size={16} />
                          <span>Envío a Domicilio</span>
                        </button>
                      </div>

                      {customerInfo.deliveryMethod === 'delivery' && (
                        <div className="mt-2.5">
                          <label className="font-bold text-[#2E231D] text-[10px] uppercase block mb-1">
                            Dirección completa *
                          </label>
                          <textarea
                            rows={2}
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Calle, número, colonia, referencias..."
                            className={`w-full px-3 py-2 rounded-xl border ${
                              errors.address ? 'border-red-500 bg-red-50/30' : 'border-[#9E744F]/20 bg-[#FAF7F2]'
                            } focus:outline-none focus:ring-2 focus:ring-[#9E744F]`}
                          />
                          {errors.address && <span className="text-[10px] text-red-500 font-bold">{errors.address}</span>}
                        </div>
                      )}
                    </div>

                    {/* Método de Pago */}
                    <div>
                      <label className="font-bold text-[#2E231D] uppercase tracking-wider text-[10px] block mb-1.5">
                        Forma de Pago
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCustomerInfo(prev => ({ ...prev, paymentMethod: 'cash' }))}
                          className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                            customerInfo.paymentMethod === 'cash'
                              ? 'bg-[#2E231D] text-white border-[#2E231D] shadow-sm'
                              : 'bg-[#FAF7F2] text-[#2E231D] border-[#9E744F]/20'
                          }`}
                        >
                          <Wallet size={16} />
                          <span>Efectivo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerInfo(prev => ({ ...prev, paymentMethod: 'transfer' }))}
                          className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                            customerInfo.paymentMethod === 'transfer'
                              ? 'bg-[#2E231D] text-white border-[#2E231D] shadow-sm'
                              : 'bg-[#FAF7F2] text-[#2E231D] border-[#9E744F]/20'
                          }`}
                        >
                          <Landmark size={16} />
                          <span>Transferencia</span>
                        </button>
                      </div>

                      {/* Pago en Efectivo: ¿Con cuánto pagas? */}
                      {customerInfo.paymentMethod === 'cash' && (
                        <div className="mt-2.5 p-3 rounded-xl bg-[#FAF7F2] border border-[#9E744F]/20">
                          <label className="font-bold text-[#2E231D] text-[10px] uppercase block mb-1">
                            ¿Con cuánto pagas? (Para llevar cambio)
                          </label>
                          <input
                            type="number"
                            value={customerInfo.cashAmount}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, cashAmount: e.target.value }))}
                            placeholder={`Ej. $${Math.ceil(cartTotal / 100) * 100}`}
                            className="w-full px-3 py-2 rounded-lg border border-[#9E744F]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#9E744F]"
                          />
                          {customerInfo.cashAmount && Number(customerInfo.cashAmount) >= cartTotal && (
                            <p className="text-[10px] text-emerald-700 font-bold mt-1">
                              Tu cambio será de: ${Number(customerInfo.cashAmount) - cartTotal} MXN
                            </p>
                          )}
                        </div>
                      )}

                      {/* Pago por Transferencia: Datos bancarios */}
                      {customerInfo.paymentMethod === 'transfer' && (
                        <div className="mt-2.5 p-3 rounded-xl bg-[#FAF7F2] border border-[#9E744F]/20 space-y-2">
                          <p className="font-bold text-[#2E231D] text-[11px]">Datos para Transferencia:</p>
                          {bankFields.map((b) => (
                            <div key={b.k} className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-black/5">
                              <div>
                                <span className="text-[#7D6D63] block text-[9px] uppercase font-bold">{b.l}</span>
                                <span className="font-semibold text-[#2E231D]">{b.v}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopy(b.v, b.k)}
                                className="p-1.5 rounded bg-[#FAF7F2] text-[#9E744F] hover:bg-[#F4ECE1]"
                                aria-label={`Copiar ${b.l}`}
                              >
                                {copied === b.k ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                              </button>
                            </div>
                          ))}
                          <p className="text-[10px] text-[#7D6D63] italic">
                            * Enviar comprobante por WhatsApp al confirmar.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Notas adicionales */}
                    <div>
                      <label className="font-bold text-[#2E231D] uppercase tracking-wider text-[10px] block mb-1">
                        Notas Generales (Opcional)
                      </label>
                      <input
                        type="text"
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Ej. Servir con servilletas extra..."
                        className="w-full px-3 py-2 rounded-xl border border-[#9E744F]/20 bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#9E744F]"
                      />
                    </div>
                  </div>

                  {/* Footer Paso 2 */}
                  <div className="p-4 bg-white border-t border-[#FAF7F2] space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#7D6D63]">Total a pagar:</span>
                      <span className="text-lg font-black text-[#2E231D]">${cartTotal} MXN</span>
                    </div>
                    <button
                      onClick={handleSendOrder}
                      className="w-full py-3.5 rounded-full bg-[#25D366] text-white font-bold text-xs md:text-sm shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-98"
                    >
                      <MessageCircle size={17} /> Enviar Pedido por WhatsApp
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 3: ESTADO DE ÉXITO */}
              {cartStep === 3 && (
                <div className="p-8 text-center my-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <Check size={32} />
                  </div>
                  <h4 className="macarena-display text-2xl font-bold text-[#2E231D]">¡Pedido Generado!</h4>
                  <p className="text-xs text-[#7D6D63] max-w-xs mx-auto">
                    Te estamos redirigiendo a WhatsApp para enviar los detalles de tu pedido a La Macarena...
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ MODAL DE AVISO DE PRIVACIDAD ═══ */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#9E744F]/20 text-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]">
                <div className="flex items-center gap-2 text-[#2E231D]">
                  <Shield size={18} className="text-[#9E744F]" />
                  <h3 className="font-bold text-sm">Aviso de Privacidad</h3>
                </div>
                <button onClick={() => setIsPrivacyOpen(false)} className="text-black/40 hover:text-black">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2 text-[#7D6D63] leading-relaxed">
                <p>
                  En <strong>La Macarena Crepería & Café</strong>, tus datos personales (nombre, teléfono y dirección) son utilizados exclusivamente para la gestión, preparación y entrega de tu pedido a través de WhatsApp.
                </p>
                <p>
                  No compartimos tu información con terceros ni almacenamos datos bancarios confidenciales. Tu privacidad y confianza son fundamentales para nosotros.
                </p>
              </div>

              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="w-full py-2.5 rounded-full bg-[#2E231D] text-white font-bold text-xs hover:bg-[#9E744F] transition-colors"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
