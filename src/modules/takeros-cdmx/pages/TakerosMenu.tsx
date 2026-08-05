// ═══════════════════════════════════════════════════════════════════════════
// TAKERO'S CDMX — Menú Digital
// Dark · Fuego · Sin imágenes en productos · Hero con imagen
// Cumple: carrito 2 pasos, salsas, transferencia, footer 3 col, persistencia
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, X, ShoppingBag, Flame,
  MapPin, Clock,
  ArrowRight, ArrowUp, ChevronLeft, Shield, ExternalLink,
  Beef, Layers, Sandwich, CircleDot, Package,
  ChefHat, Coffee, Pizza, UtensilsCrossed, Copy, Check,
  Instagram, MessageCircle,
} from 'lucide-react';
import { clientConfig } from '../config';
import takerosLogo from '../assets/takeros-logo.png';
import SkylineImg from '../assets/cdmx-skyline.png';

const WHATSAPP = clientConfig.phone;
const BUSINESS = clientConfig.businessName;
const C = clientConfig.colors;

// ── Extra: Queso Manchego (solo tacos y gorditas, según PDF) ──
const QUESO_PRICE = 13;
const QUESO_CATEGORIES = ['tacos', 'gorditas'];

// ═══════════════════ TYPES ═══════════════════

interface OptionChoice {
  name: string;
  extraPrice: number;
}
interface ProductOption {
  title: string;
  choices: OptionChoice[];
}

interface LocalProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  badge?: string;
  options?: ProductOption[];
}

interface CartItem extends LocalProduct {
  quantity: number;
  cartId: string;        // id único en carrito: "t3" o "t3-queso"
  variant?: 'queso';     // variante: con Queso Manchego (+$13)
  selectedOptionsText?: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  deliveryMethod: 'domicilio' | 'recoger';
  address: string;
  paymentMethod: 'efectivo' | 'transferencia';
  cashAmount: string;
  notes: string;
  salsas: string[];
}

// ═══════════════════ CATEGORÍAS (orden de la nota del cliente) ═══════════════════

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: UtensilsCrossed },
  { id: 'paquetes', name: 'Paquetes Taqueros', icon: Package },
  { id: 'combos-gorditas', name: 'Combos Gorditas', icon: Package },
  { id: 'entradas', name: 'Entradas', icon: ChefHat },
  { id: 'gringas', name: 'Gringas', icon: Pizza },
  { id: 'alambres', name: 'Alambres', icon: Beef },
  { id: 'tlacoyos', name: 'Tlacoyos', icon: Layers },
  { id: 'tortas', name: 'Tortas', icon: Sandwich },
  { id: 'tacos', name: 'Tacos', icon: Flame },
  { id: 'gorditas', name: 'Gorditas', icon: CircleDot },
  { id: 'bebidas', name: 'Bebidas', icon: Coffee },
];

// ═══════════════════ MENÚ (precios verificados contra PDF del cliente) ═══════════════════

const PRODUCTS: LocalProduct[] = [
  // ── PAQUETES POR KG (incluyen tortillas, salsas y verdura) ──
  { id: 'p1', name: 'PKT DUO (2 Personas)', description: '1/2 KG Proteína (Incluye 28 tortillas, salsa, verdura).', price: 304, category: 'paquetes', badge: 'Más Pedido',
    options: [{ title: 'Elige tu Proteína', choices: [{ name: 'Pastor', extraPrice: 0 }, { name: 'Suadero', extraPrice: 95 }, { name: 'Bistec', extraPrice: 95 }, { name: 'Tripa', extraPrice: 155 }] }] },
  { id: 'p2', name: 'PKT FAMILIAR (4 Personas)', description: '1 KG Proteína (Incluye 56 tortillas, salsa, verdura).', price: 585, category: 'paquetes',
    options: [{ title: 'Elige tu Proteína', choices: [{ name: 'Pastor', extraPrice: 0 }, { name: 'Suadero', extraPrice: 195 }, { name: 'Bistec', extraPrice: 195 }, { name: 'Tripa', extraPrice: 295 }] }] },
  { id: 'p3', name: 'PKT FIESTA (6 Personas)', description: '1.5 KG Proteína (Incluye 84 tortillas, salsa, verdura).', price: 880, category: 'paquetes',
    options: [{ title: 'Elige tu Proteína', choices: [{ name: 'Pastor', extraPrice: 0 }, { name: 'Suadero', extraPrice: 290 }, { name: 'Bistec', extraPrice: 290 }, { name: 'Tripa', extraPrice: 440 }] }] },
  { id: 'p4', name: 'TAKE MIX CLÁSICO (2 Personas)', description: '1/4 KG Pastor + 1/4 KG Suadero o Bistec. (28 tortillas, salsa, verdura).', price: 380, category: 'paquetes',
    options: [{ title: '2da Proteína', choices: [{ name: 'Suadero', extraPrice: 0 }, { name: 'Bistec', extraPrice: 0 }] }] },
  { id: 'p5', name: 'TAKE MIX TRIPA (2 Personas)', description: '1/4 KG Pastor + 1/4 KG Tripa. (28 tortillas, salsa, verdura).', price: 410, category: 'paquetes' },
  { id: 'p6', name: 'TAKE MIX SUPREMO (2 Personas)', description: '1/4 KG Suadero o Bistec + 1/4 KG Tripa. (28 tortillas, salsa, verdura).', price: 465, category: 'paquetes',
    options: [{ title: '1ra Proteína', choices: [{ name: 'Suadero', extraPrice: 0 }, { name: 'Bistec', extraPrice: 0 }] }] },
  { id: 'p7', name: 'PKT GORDITAS DUO (2 Personas)', description: '2 Gorditas de Pastor + 2 Gorditas a elegir.', price: 199, category: 'combos-gorditas',
    options: [{ title: 'Gorditas a elegir', choices: [{ name: 'Suadero', extraPrice: 0 }, { name: 'Bistec', extraPrice: 0 }, { name: 'Pastor', extraPrice: 0 }] }] },
  { id: 'p8', name: 'PKT GORDITAS FAMILIAR (4 Personas)', description: '4 Gorditas de Pastor + 4 Gorditas a elegir.', price: 399, category: 'combos-gorditas',
    options: [{ title: 'Gorditas a elegir', choices: [{ name: 'Suadero', extraPrice: 0 }, { name: 'Bistec', extraPrice: 0 }, { name: 'Pastor', extraPrice: 0 }] }] },

  // ── ENTRADAS Y ACOMPAÑAMIENTOS ──
  { id: 'e1', name: 'Choriqueso', description: 'Queso fundido con chorizo. 200 gr.', price: 128, category: 'entradas', badge: 'Para Compartir' },
  { id: 'e2', name: 'Queso con Champiñones', description: 'Queso fundido con champiñones. 200 gr.', price: 120, category: 'entradas' },
  { id: 'e3', name: 'Cebollas Cambray', description: 'Cebollitas asadas con sal de grano.', price: 48, category: 'entradas' },
  { id: 'e4', name: 'Empaque Grande', description: 'Para llevar.', price: 9, category: 'entradas' },
  { id: 'e5', name: 'Empaque Pequeño', description: 'Para llevar.', price: 4, category: 'entradas' },

  // ── GRINGAS (80 gr de proteína) ──
  { id: 'g1', name: 'Gringa de Pastor', description: '80 gr de proteína con queso.', price: 86, category: 'gringas', badge: '⭐ Favorita' },
  { id: 'g2', name: 'Gringa de Bistec', description: '80 gr de proteína con queso.', price: 96, category: 'gringas' },
  { id: 'g3', name: 'Gringa de Suadero', description: '80 gr de proteína con queso.', price: 92, category: 'gringas' },
  { id: 'g4', name: 'Gringa de Tripa', description: '80 gr de proteína con queso.', price: 95, category: 'gringas' },
  { id: 'g5', name: 'Gringa Campechana', description: '80 gr de proteína con queso.', price: 95, category: 'gringas' },

  // ── ALAMBRES (120 gr de proteína) ──
  { id: 'a1', name: 'Alambre de Bistec', description: '120 gr de proteína.', price: 195, category: 'alambres' },
  { id: 'a2', name: 'Alambre de Pastor', description: '120 gr de proteína.', price: 178, category: 'alambres' },
  { id: 'a3', name: 'Alambre Hawaiano', description: '120 gr de proteína con piña.', price: 186, category: 'alambres' },

  // ── ORDEN DE TLACOYOS (105 gr de proteína) ──
  { id: 'tl1', name: 'Tlacoyos Sencillos', description: 'Orden. 105 gr de proteína al agregar.', price: 86, category: 'tlacoyos' },
  { id: 'tl2', name: 'Tlacoyos c/ Bistec', description: '105 gr de proteína.', price: 178, category: 'tlacoyos' },
  { id: 'tl3', name: 'Tlacoyos c/ Suadero', description: '105 gr de proteína.', price: 178, category: 'tlacoyos' },
  { id: 'tl4', name: 'Tlacoyos c/ Pastor', description: '105 gr de proteína.', price: 164, category: 'tlacoyos' },
  { id: 'tl5', name: 'Tlacoyos c/ Tripa', description: '105 gr de proteína.', price: 186, category: 'tlacoyos' },

  // ── TORTAS ──
  { id: 'to1', name: 'Torta de Milanesa de Res', price: 135, category: 'tortas' },
  { id: 'to2', name: 'Torta de Pierna', price: 118, category: 'tortas' },
  { id: 'to3', name: 'Torta de Pastor', price: 118, category: 'tortas', badge: '🔥 Recomendada' },

  // ── TACOS INDIVIDUALES (80 gr de proteína) ──
  { id: 't3', name: 'Taco de Pastor', description: '80 gr. C/ Queso Manchego +$13.', price: 29, category: 'tacos', badge: '⭐ Favorito' },
  { id: 't1', name: 'Taco de Suadero', description: '80 gr. C/ Queso Manchego +$13.', price: 35, category: 'tacos' },
  { id: 't2', name: 'Taco de Tripa', description: '80 gr. C/ Queso Manchego +$13.', price: 38, category: 'tacos' },
  { id: 't4', name: 'Taco de Longaniza', description: '80 gr. C/ Queso Manchego +$13.', price: 30, category: 'tacos' },
  { id: 't5', name: 'Campechano c/ Suadero', description: '80 gr. C/ Queso Manchego +$13.', price: 35, category: 'tacos' },
  { id: 't6', name: 'Campechano c/ Tripa', description: '80 gr. C/ Queso Manchego +$13.', price: 38, category: 'tacos' },
  { id: 't7', name: 'Taco de Bistec', description: '80 gr. C/ Queso Manchego +$13.', price: 45, category: 'tacos' },
  { id: 't8', name: 'Campechano con Bistec', description: '80 gr. C/ Queso Manchego +$13.', price: 45, category: 'tacos' },

  // ── GORDITAS INDIVIDUALES ──
  { id: 'go1', name: 'Gordita Sencilla', price: 38, category: 'gorditas' },
  { id: 'go2', name: 'Gordita de Pastor', price: 48, category: 'gorditas', badge: '🔥 Popular' },
  { id: 'go3', name: 'Gordita de Bistec', price: 59, category: 'gorditas' },
  { id: 'go4', name: 'Gordita de Suadero', price: 58, category: 'gorditas' },
  { id: 'go5', name: 'Gordita de Tripa', price: 60, category: 'gorditas' },
  { id: 'go6', name: 'Gordita Campechana', price: 60, category: 'gorditas' },

  // ── BEBIDAS Y CERVEZAS ──
  { id: 'b9', name: 'Agua de Horchata', price: 39, category: 'bebidas', badge: 'Casera' },
  { id: 'b10', name: 'Agua de Jamaica', price: 39, category: 'bebidas' },
  { id: 'b11', name: 'Tepache', price: 42, category: 'bebidas' },
  { id: 'b6', name: 'Limonada Natural', price: 39, category: 'bebidas' },
  { id: 'b5', name: 'Limonada Mineral', price: 46, category: 'bebidas' },
  { id: 'b8', name: 'Naranjada Natural', price: 39, category: 'bebidas' },
  { id: 'b7', name: 'Naranjada Mineral', price: 46, category: 'bebidas' },
  { id: 'b12', name: 'Refresco (Coca/Manzana/Light/Zero)', price: 44, category: 'bebidas' },
  { id: 'b1', name: 'Coronita', price: 36, category: 'bebidas' },
  { id: 'b2', name: 'Corona', price: 62, category: 'bebidas' },
  { id: 'b3', name: 'Victoria', price: 62, category: 'bebidas' },
  { id: 'b4', name: 'Cerveza Premium (Negra M. / M. Especial)', price: 69, category: 'bebidas' },
  { id: 'b13', name: 'Chelada', price: 16, category: 'bebidas' },
  { id: 'b14', name: 'Michelada', price: 22, category: 'bebidas' },
  { id: 'b15', name: 'Ojo Rojo', price: 26, category: 'bebidas' },
  { id: 'b16', name: 'Michelada Mango/Piña con Chile', price: 34, category: 'bebidas', badge: 'Nueva' },
];

// ═══════════════════ COMPONENTE PRINCIPAL ═══════════════════

export default function TakerosMenu() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [toastMsg, setToastMsg] = useState('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [quesoModalProduct, setQuesoModalProduct] = useState<LocalProduct | null>(null);
  const [optionsModalProduct, setOptionsModalProduct] = useState<LocalProduct | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ── Botón "volver arriba": aparece tras hacer scroll ──
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Bloquear scroll del fondo cuando hay drawer/modal abierto ──
  useEffect(() => {
    const anyOpen = isOpen || quesoModalProduct !== null || optionsModalProduct !== null || isPrivacyOpen;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, quesoModalProduct, optionsModalProduct, isPrivacyOpen]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '', phone: '', deliveryMethod: 'domicilio',
    address: '', paymentMethod: 'efectivo', cashAmount: '', notes: '', salsas: [],
  });

  // ── document.title ──
  useEffect(() => {
    document.title = "TAKERO'S CDMX | Menú Digital";
    return () => { document.title = 'IMAGINE & STAMP'; };
  }, []);

  // ── Persistencia del carrito (localStorage) ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem('takeroscdmx_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migración: items viejos sin cartId se descartan (estructura cambió)
        if (Array.isArray(parsed) && parsed.every(i => i.cartId)) setCart(parsed);
        else localStorage.removeItem('takeroscdmx_cart');
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('takeroscdmx_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // ── Filtrado ──
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      result = result.filter(p =>
        p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q) ||
        p.description?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
      );
    } else if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    return result;
  }, [activeCategory, searchQuery]);

  // ── Cart operations ──
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── Al tocar "Agregar": tacos/gorditas preguntan por queso, paquetes preguntan por opciones ──
  const addToCart = useCallback((product: LocalProduct) => {
    if (product.options && product.options.length > 0) {
      setOptionsModalProduct(product);
      setSelectedOptionIndex(0); // Select first option by default
      return;
    }
    if (QUESO_CATEGORIES.includes(product.category)) {
      setQuesoModalProduct(product);
      return;
    }
    confirmAdd(product, false);
  }, []);

  // ── Agrega al carrito con o sin variante de queso o opciones ──
  const confirmAdd = useCallback((product: LocalProduct, withQueso: boolean, selectedOptionInfo?: { choiceName: string, extraPrice: number, optionTitle: string }) => {
    let cartId = product.id;
    let finalPrice = product.price;
    let variant: 'queso' | undefined = undefined;
    let selectedOptionsText: string | undefined = undefined;

    if (withQueso) {
      cartId += '-queso';
      finalPrice += QUESO_PRICE;
      variant = 'queso';
    } else if (selectedOptionInfo) {
      // Usar nombre de la opción en el cartId para diferenciar (ej. p1-Suadero)
      cartId += `-${selectedOptionInfo.choiceName.replace(/\s+/g, '')}`;
      finalPrice += selectedOptionInfo.extraPrice;
      selectedOptionsText = `[${selectedOptionInfo.optionTitle}: ${selectedOptionInfo.choiceName}]`;
    }

    setCart(prev => {
      const existing = prev.find(i => i.cartId === cartId);
      if (existing) return prev.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, price: finalPrice, quantity: 1, cartId, variant, selectedOptionsText }];
    });
    setToastMsg(withQueso ? `${product.name} c/ Queso` : product.name);
    setTimeout(() => setToastMsg(''), 2000);
    setQuesoModalProduct(null);
    setOptionsModalProduct(null);
  }, []);

  const updateQuantity = useCallback((cartId: string, qty: number) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i.cartId !== cartId));
    else setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleSalsa = (salsaName: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      salsas: prev.salsas.includes(salsaName)
        ? prev.salsas.filter(s => s !== salsaName)
        : [...prev.salsas, salsaName],
    }));
  };

  const copyBankInfo = () => {
    const b = clientConfig.bankInfo;
    const info = `Banco: ${b.bank_name}\nTitular: ${b.account_holder}\nCLABE: ${b.clabe}\nCuenta: ${b.account_number}`;
    navigator.clipboard.writeText(info).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const openCartDrawer = () => { setStep('cart'); setIsOpen(true); };
  const closeCartDrawer = () => setIsOpen(false);

  const changeAmount = customerInfo.cashAmount && customerInfo.paymentMethod === 'efectivo'
    ? Math.max(0, Number(customerInfo.cashAmount) - cartTotal)
    : null;

  const canCheckout =
    customerInfo.name.trim() !== '' &&
    customerInfo.phone.trim() !== '' &&
    (customerInfo.deliveryMethod === 'recoger' || customerInfo.address.trim() !== '');

  // ── WhatsApp Checkout (éxito → 500ms → window.location.href → limpieza) ──
  const handleSendWhatsApp = () => {
    const itemsText = cart.map((item, i) =>
      `${i + 1}. *${item.name}${item.variant === 'queso' ? ' (c/ Queso Manchego)' : ''}*${item.selectedOptionsText ? ` ${item.selectedOptionsText}` : ''} x${item.quantity} — $${item.price * item.quantity}`
    ).join('\n');

    const deliveryText = customerInfo.deliveryMethod === 'recoger'
      ? 'Recoger en local'
      : `Envío a domicilio: ${customerInfo.address}`;
    const paymentText = customerInfo.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia';

    let cashInfo = '';
    if (customerInfo.paymentMethod === 'efectivo' && customerInfo.cashAmount) {
      cashInfo = `\n*Paga con:* $${customerInfo.cashAmount} → *Cambio:* $${Math.max(0, Number(customerInfo.cashAmount) - cartTotal)}`;
    }

    let salsaInfo = '';
    if (customerInfo.salsas.length > 0) {
      salsaInfo = `\n🌶️ *Salsas:* ${customerInfo.salsas.join(', ')}`;
    }

    const message = `🌮 *NUEVO PEDIDO — ${BUSINESS.toUpperCase()}*\n\n` +
      `👤 *Cliente:* ${customerInfo.name}\n` +
      `📱 *WhatsApp:* ${customerInfo.phone}\n` +
      `📦 *Entrega:* ${deliveryText}\n` +
      `💰 *Pago:* ${paymentText}${cashInfo}${salsaInfo}\n\n` +
      `📋 *Productos:*\n${itemsText}\n\n` +
      `💵 *TOTAL: $${cartTotal}*` +
      (customerInfo.notes ? `\n\n📝 *Notas:* ${customerInfo.notes}` : '');

    setStep('success');
    setTimeout(() => {
      window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
      clearCart();
      setCustomerInfo({ name: '', phone: '', deliveryMethod: 'domicilio', address: '', paymentMethod: 'efectivo', cashAmount: '', notes: '', salsas: [] });
      closeCartDrawer();
    }, 500);
  };

  // ═══════════════════ RENDER ═══════════════════

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">

      {/* ══════════ HEADER STICKY ══════════ */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-orange-500/20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-black bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent">
            {BUSINESS}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                document.getElementById('menu-search')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => document.getElementById('menu-search')?.focus(), 400);
              }}
              className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-400"
            >
              <Search size={20} />
            </button>
            <button onClick={openCartDrawer} className="relative p-2 rounded-full hover:bg-white/5 transition-colors text-orange-500">
              <ShoppingBag size={24} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute right-0 top-0 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white bg-red-600 border-2 border-black"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════ HERO (con imagen) ══════════ */}
      <section className="relative h-[48vh] min-h-[360px] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 text-center px-4 max-w-3xl flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-4 flex justify-center">
              <img
                src={takerosLogo}
                alt="Takero's CDMX Logo"
                className="w-full max-w-[260px] sm:max-w-sm md:max-w-md drop-shadow-[0_0_25px_rgba(255,100,0,0.6)]"
              />
            </div>
            <p className="text-base sm:text-xl md:text-2xl font-bold text-white mb-3 tracking-wide">
              {clientConfig.tagline}
            </p>
            <p className="text-sm font-medium text-orange-400 mb-8 uppercase tracking-widest">
              Antojitos chilangos y sazón real
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-zinc-300">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <Clock size={14} className="text-orange-500" />
                <span>{clientConfig.hours}</span>
              </div>
              <a
                href={clientConfig.mapsUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:border-orange-500/50 transition-colors"
              >
                <MapPin size={14} className="text-orange-500" />
                <span>{clientConfig.address}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ BUSCADOR ══════════ */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20 w-full">
        <div className="relative shadow-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            id="menu-search"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tacos, paquetes, bebidas..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-orange-500/20 bg-zinc-900 text-white text-sm font-medium focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-500 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={16} className="text-zinc-500" />
            </button>
          )}
        </div>
      </div>

      {/* ══════════ CATEGORÍAS STICKY (con íconos) ══════════ */}
      <div className="sticky top-16 z-40 bg-black/90 backdrop-blur-md border-b border-white/5 mt-8">
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth pb-3 pt-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all shrink-0 border min-h-[44px] ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                    : 'bg-orange-600/20 text-orange-500 border-orange-500/30 hover:bg-orange-600/40'
                }`}
              >
                <cat.icon size={13} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ LISTA DE PRODUCTOS (sin imágenes) ══════════ */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {activeCategory !== 'all' && !searchQuery && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              {CATEGORIES.find(c => c.id === activeCategory)?.name}
            </h2>
            <div className="w-12 h-0.5 mt-2 rounded-full bg-orange-500" />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id} layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                className="bg-zinc-900 border border-orange-500/20 rounded-xl p-4 flex flex-col justify-between hover:border-orange-500/60 transition-colors group"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-lg text-white leading-tight">{product.name}</h3>
                      {product.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-orange-500/15 text-orange-400 shrink-0">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <span className="font-black text-xl text-yellow-400 shrink-0">${product.price}</span>
                  </div>
                  {product.description && (
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">{product.description}</p>
                  )}
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 w-full min-h-[44px] bg-black border border-white/5 hover:border-orange-500/40 text-orange-500 font-bold text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition-all group-hover:bg-white/5 active:scale-[0.98]"
                >
                  <Plus size={16} />
                  Agregar al Pedido
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold">No encontramos productos con esa búsqueda.</p>
          </div>
        )}

        {/* Nota de extras */}
        <div className="mt-8 p-4 rounded-2xl text-center bg-white/[0.02] border border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Agrega queso manchego a cualquier taco o gordita por solo <span className="text-yellow-400">+$13</span>
          </p>
        </div>
      </main>

      {/* ══════════ BOTÓN FLOTANTE DEL CARRITO ══════════ */}
      <AnimatePresence>
        {cartCount > 0 && !isOpen && (
          <motion.button
            initial={{ opacity: 0, y: 80, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.8 }}
            onClick={openCartDrawer}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full shadow-2xl font-bold text-sm bg-red-600 text-white"
            style={{ boxShadow: '0 8px 30px rgba(220,38,38,0.4)', bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            <ShoppingBag size={18} />
            <span>{cartCount} · ${cartTotal}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══════════ BOTÓN VOLVER ARRIBA ══════════ */}
      <AnimatePresence>
        {showScrollTop && !isOpen && (
          <motion.button
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-zinc-900/90 backdrop-blur-md border border-orange-500/40 text-orange-500 shadow-2xl hover:border-orange-500 hover:bg-zinc-800 transition-colors"
            style={{ boxShadow: '0 8px 25px rgba(0,0,0,0.5)', bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            title="Volver arriba"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══════════ CART DRAWER — 2 PASOS + ÉXITO ══════════ */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeCartDrawer}
              className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md z-[80] flex flex-col bg-zinc-950 border-l border-white/10"
            >
              {/* Header del drawer */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  {step === 'details' && (
                    <button onClick={() => setStep('cart')} className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
                      <ChevronLeft size={18} className="text-zinc-400" />
                    </button>
                  )}
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    {step === 'cart' ? 'Tu Pedido' : step === 'details' ? 'Tus Datos' : '¡Listo!'}
                  </h2>
                </div>
                <button onClick={closeCartDrawer} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Indicador de pasos */}
              {step !== 'success' && (
                <div className="flex gap-2 px-5 pt-4">
                  <div className={`flex-1 h-1 rounded-full ${step === 'cart' || step === 'details' ? 'bg-orange-500' : 'bg-white/10'}`} />
                  <div className={`flex-1 h-1 rounded-full ${step === 'details' ? 'bg-orange-500' : 'bg-white/10'}`} />
                </div>
              )}

              {/* ── PASO 1: CARRITO + SALSAS ── */}
              {step === 'cart' && (
                <div className="flex-1 overflow-y-auto p-5">
                  {cart.length === 0 ? (
                    <div className="text-center py-16">
                      <ShoppingBag size={48} className="mx-auto mb-4 text-zinc-700" />
                      <p className="text-sm font-medium text-zinc-500">Tu carrito está vacío</p>
                      <p className="text-[10px] mt-1 text-zinc-600">Agrega productos del menú</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <motion.div
                            key={item.cartId} layout
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                            className="flex justify-between items-center gap-3 bg-black/50 p-3 rounded-xl border border-white/5"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-white truncate">{item.name}</p>
                              {item.variant === 'queso' && (
                                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-yellow-400/15 text-yellow-400">
                                  🧀 c/ Queso Manchego
                                </span>
                              )}
                              <p className="text-orange-500 text-xs font-medium mt-0.5">${item.price} c/u</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <button
                                  onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors active:scale-90"
                                >
                                  <Minus size={14} className="text-zinc-400" />
                                </button>
                                <span className="text-sm font-bold text-white w-5 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors active:scale-90"
                                >
                                  <Plus size={14} className="text-zinc-400" />
                                </button>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end justify-between self-stretch">
                              <p className="font-black text-sm text-white">${item.price * item.quantity}</p>
                              <button
                                onClick={() => updateQuantity(item.cartId, 0)}
                                className="text-[9px] font-bold uppercase tracking-wider text-zinc-600 hover:text-red-400 transition-colors"
                              >
                                Quitar
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* ── SELECTOR DE SALSAS ── */}
                      <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-orange-500/20">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-orange-500">
                          🌶️ Elige tus Salsas Gratis:
                        </p>
                        <div className="space-y-1.5">
                          {clientConfig.salsas.map((salsa) => {
                            const isChecked = customerInfo.salsas.includes(salsa.name);
                            return (
                              <button
                                key={salsa.id}
                                onClick={() => toggleSalsa(salsa.name)}
                                className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                                  isChecked
                                    ? 'bg-orange-500/15 border-orange-500/50 text-orange-400'
                                    : 'border-white/5 text-zinc-400 hover:bg-white/5'
                                }`}
                              >
                                <span>{salsa.name}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isChecked ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-zinc-500'}`}>
                                  {salsa.spiciness}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── PASO 2: DATOS DE ENTREGA/PAGO ── */}
              {step === 'details' && (
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1.5 text-zinc-500">Nombre *</label>
                    <input
                      type="text"
                      placeholder="Tu nombre completo"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1.5 text-zinc-500">WhatsApp *</label>
                    <input
                      type="tel"
                      placeholder="998 123 4567"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1.5 text-zinc-500">Método de Entrega</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'domicilio' })}
                        className={`py-3 text-xs font-bold rounded-xl border transition-colors ${customerInfo.deliveryMethod === 'domicilio' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-black border-white/10 text-zinc-500'}`}
                      >
                        🛵 Domicilio
                      </button>
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'recoger' })}
                        className={`py-3 text-xs font-bold rounded-xl border transition-colors ${customerInfo.deliveryMethod === 'recoger' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-black border-white/10 text-zinc-500'}`}
                      >
                        📍 Recoger
                      </button>
                    </div>
                  </div>

                  {customerInfo.deliveryMethod === 'domicilio' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1.5 text-zinc-500">Dirección de envío *</label>
                      <input
                        type="text"
                        placeholder="Calle, número, colonia, CP"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-600"
                      />
                    </motion.div>
                  )}

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1.5 text-zinc-500">Forma de Pago</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'efectivo' })}
                        className={`py-3 text-xs font-bold rounded-xl border transition-colors ${customerInfo.paymentMethod === 'efectivo' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-black border-white/10 text-zinc-500'}`}
                      >
                        💵 Efectivo
                      </button>
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'transferencia' })}
                        className={`py-3 text-xs font-bold rounded-xl border transition-colors ${customerInfo.paymentMethod === 'transferencia' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-black border-white/10 text-zinc-500'}`}
                      >
                        🏦 Transferencia
                      </button>
                    </div>
                  </div>

                  {/* Efectivo → cambio */}
                  {customerInfo.paymentMethod === 'efectivo' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1.5 text-zinc-500">¿Con cuánto vas a pagar?</label>
                      <input
                        type="number"
                        placeholder="Ej: 500"
                        value={customerInfo.cashAmount}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-600"
                      />
                      {changeAmount !== null && changeAmount > 0 && (
                        <p className="text-xs font-bold mt-1.5 text-green-500">Tu cambio: ${changeAmount}</p>
                      )}
                    </motion.div>
                  )}

                  {/* Transferencia → datos bancarios + copiar */}
                  {customerInfo.paymentMethod === 'transferencia' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 rounded-2xl space-y-2 bg-orange-500/5 border border-orange-500/30"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">🏦 Datos de Transferencia</p>
                      <div className="text-[11px] leading-relaxed space-y-1 text-zinc-400">
                        <p><strong className="text-white/60">Banco:</strong> {clientConfig.bankInfo.bank_name}</p>
                        <p><strong className="text-white/60">Titular:</strong> {clientConfig.bankInfo.account_holder}</p>
                        <p><strong className="text-white/60">Cuenta:</strong> {clientConfig.bankInfo.account_number}</p>
                        <p className="font-mono font-bold text-yellow-400">CLABE: {clientConfig.bankInfo.clabe}</p>
                      </div>
                      <button
                        onClick={copyBankInfo}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 bg-orange-500/15 text-orange-400 hover:bg-orange-500/25 transition-all"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? '¡Copiado!' : 'Copiar datos'}
                      </button>
                      <p className="text-[9px] font-bold text-orange-500/70">
                        * Envía tu comprobante al mismo WhatsApp del pedido.
                      </p>
                    </motion.div>
                  )}

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1.5 text-zinc-500">Notas</label>
                    <textarea
                      placeholder="Sin cebolla, extra salsa, bien dorado..."
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      rows={2}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors resize-none placeholder:text-zinc-600"
                    />
                  </div>
                </div>
              )}

              {/* ── PASO 3: ÉXITO ── */}
              {step === 'success' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-5 bg-green-500/10"
                  >
                    <Check size={40} className="text-green-500" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="text-xl font-black text-white mb-2">¡Pedido Enviado!</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    Te redirigimos a WhatsApp para confirmar tu pedido con {BUSINESS}.
                  </p>
                </div>
              )}

              {/* ── FOOTER DEL CARRITO ── */}
              {cart.length > 0 && step !== 'success' && (
                <div className="p-5 border-t border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      {cartCount} producto{cartCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-2xl font-black text-yellow-400">${cartTotal}</span>
                  </div>
                  {step === 'cart' && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setStep('details')}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      Continuar <ArrowRight size={18} />
                    </motion.button>
                  )}
                  {step === 'details' && (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSendWhatsApp}
                        disabled={!canCheckout}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                      >
                        <MessageCircle size={18} />
                        Enviar pedido por WhatsApp
                      </motion.button>
                      {!canCheckout && (
                        <p className="text-[10px] text-center mt-2 font-medium text-red-500">
                          Completa nombre, WhatsApp{customerInfo.deliveryMethod === 'domicilio' ? ' y dirección' : ''} para continuar
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════ MODAL: ¿Con Queso Manchego? ══════════ */}
      <AnimatePresence>
        {quesoModalProduct && (
          <div className="fixed inset-0 z-[85] flex items-end sm:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setQuesoModalProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="relative w-full sm:max-w-md bg-zinc-900 border-t sm:border border-orange-500/30 sm:rounded-3xl rounded-t-3xl overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">Personaliza</p>
                    <h3 className="text-lg font-black text-white leading-tight">{quesoModalProduct.name}</h3>
                  </div>
                  <button
                    onClick={() => setQuesoModalProduct(null)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-zinc-400 mb-5">¿Lo quieres con Queso Manchego?</p>

                <div className="space-y-2.5">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => confirmAdd(quesoModalProduct, false)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-black border border-white/10 hover:border-orange-500/40 transition-all"
                  >
                    <span className="font-bold text-sm text-white">Normal</span>
                    <span className="font-black text-yellow-400">${quesoModalProduct.price}</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => confirmAdd(quesoModalProduct, true)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/40 hover:border-yellow-400 transition-all"
                  >
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      🧀 Con Queso Manchego
                      <span className="text-[9px] font-black uppercase tracking-wider text-yellow-400/80">+${QUESO_PRICE}</span>
                    </span>
                    <span className="font-black text-yellow-400">${quesoModalProduct.price + QUESO_PRICE}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════ MODAL: Opciones del Producto ══════════ */}
      <AnimatePresence>
        {optionsModalProduct && optionsModalProduct.options && (
          <div className="fixed inset-0 z-[85] flex items-end sm:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOptionsModalProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="relative w-full sm:max-w-md bg-zinc-900 border-t sm:border border-orange-500/30 sm:rounded-3xl rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 shrink-0" />
              <div className="p-6 overflow-y-auto">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">Elige tus Opciones</p>
                    <h3 className="text-lg font-black text-white leading-tight">{optionsModalProduct.name}</h3>
                  </div>
                  <button
                    onClick={() => setOptionsModalProduct(null)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Asumimos que solo hay un grupo de opciones por ahora (index 0) */}
                <p className="text-xs text-zinc-400 mb-5">{optionsModalProduct.options[0].title}</p>

                <div className="space-y-2.5">
                  {optionsModalProduct.options[0].choices.map((choice, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => confirmAdd(optionsModalProduct, false, {
                        choiceName: choice.name,
                        extraPrice: choice.extraPrice,
                        optionTitle: optionsModalProduct.options![0].title
                      })}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        choice.extraPrice > 0 
                          ? 'bg-yellow-400/10 border-yellow-400/40 hover:border-yellow-400' 
                          : 'bg-black border-white/10 hover:border-orange-500/40'
                      }`}
                    >
                      <span className="font-bold text-sm text-white flex items-center gap-2">
                        {choice.name}
                        {choice.extraPrice > 0 && (
                          <span className="text-[9px] font-black uppercase tracking-wider text-yellow-400/80">
                            +${choice.extraPrice}
                          </span>
                        )}
                      </span>
                      <span className={`font-black ${choice.extraPrice > 0 ? 'text-yellow-400' : 'text-white'}`}>
                        ${optionsModalProduct.price + choice.extraPrice}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════ TOAST: agregado al carrito ══════════ */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 bg-orange-500 text-white"
          >
            <Plus size={16} />
            ¡Agregado! — {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ FOOTER (3 columnas: marca / contacto / redes) ══════════ */}
      <footer className="relative bg-zinc-950 border-t border-orange-500/20 pt-12 mt-auto overflow-hidden">
        {/* Silueta de CDMX en el fondo */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-48 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url(${SkylineImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'bottom center',
            backgroundRepeat: 'repeat-x',
          }}
        />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 text-center md:text-left">

          {/* Col 1: Marca + descripción */}
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent mb-3">
              {BUSINESS}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {clientConfig.description}
            </p>
          </div>

          {/* Col 2: Contacto / dirección / horarios */}
          <div className="space-y-3">
            <h4 className="text-orange-500 font-black uppercase tracking-widest text-xs">Contacto</h4>
            <div className="space-y-2.5 text-sm">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="flex items-center justify-center md:justify-start gap-2.5 text-zinc-400 hover:text-white transition-colors">
                <span className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <MessageCircle size={14} className="text-green-500" />
                </span>
                {clientConfig.phoneNumber}
              </a>
              <a href={clientConfig.mapsUrl} target="_blank" rel="noreferrer" className="flex items-start justify-center md:justify-start gap-2.5 text-zinc-400 hover:text-white transition-colors">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin size={14} />
                </span>
                {clientConfig.address}
              </a>
              <p className="flex items-start justify-center md:justify-start gap-2.5 text-zinc-400">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Clock size={14} />
                </span>
                {clientConfig.hours}
              </p>
            </div>
          </div>

          {/* Col 3: Redes sociales */}
          <div className="space-y-3">
            <h4 className="text-orange-500 font-black uppercase tracking-widest text-xs">Síguenos</h4>
            <div className="flex gap-3 justify-center md:justify-start">
              {clientConfig.instagramUrl && (
                <motion.a
                  href={clientConfig.instagramUrl} target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ background: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)' }}
                  title="Instagram"
                >
                  <Instagram size={18} />
                </motion.a>
              )}
              <motion.a
                href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-[#25D366]"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </motion.a>
              <motion.a
                href={clientConfig.mapsUrl} target="_blank" rel="noreferrer"
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-white/10"
                title="Cómo llegar"
              >
                <MapPin size={18} />
              </motion.a>
            </div>
            <p className="text-zinc-500 text-xs">Únicamente para llevar y a domicilio.</p>
          </div>
        </div>

        {/* Barra inferior: derechos + crédito + privacidad */}
        <div className="py-8 border-t border-white/5">
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} {BUSINESS.toUpperCase()}. Todos los derechos reservados.
            </p>
            <motion.a
              href="https://imagineandstamp.site" target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.03 }}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-orange-500/40 transition-all duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 group-hover:text-zinc-300 transition-colors">Página web realizada por</span>
              <span className="text-sm font-black tracking-tight text-orange-500">IMAGINE & STAMP</span>
              <ExternalLink size={12} className="text-orange-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            </motion.a>
            <div className="w-16 h-px bg-white/10" />
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              <Shield size={12} /> Aviso de Privacidad
            </button>
          </div>
        </div>
      </footer>

      {/* ══════════ MODAL AVISO DE PRIVACIDAD ══════════ */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-orange-500/30 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600" />
              <div className="p-8">
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
                    <Shield size={20} className="text-orange-500" />
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight uppercase">Aviso de Privacidad</h2>
                </div>
                <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
                  <p>En <strong className="text-white">{BUSINESS}</strong> protegemos y respetamos tu privacidad. La información personal que compartes se utiliza exclusivamente para procesar tus pedidos y comunicarnos contigo.</p>
                  <p>No almacenamos datos de tarjetas bancarias. Tus datos de contacto solo se usan para confirmar tu pedido. Nunca compartimos tu información con terceros sin tu consentimiento.</p>
                  <p>Para ejercer tus derechos ARCO, contáctanos por WhatsApp al <span className="text-orange-500">{clientConfig.phoneNumber}</span>.</p>
                </div>
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="mt-8 w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest transition-colors"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════ ESTILOS GLOBALES ══════════ */}
      <style>{`
        *::-webkit-scrollbar { width: 4px; height: 0px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }

        /* ── Optimización móvil ── */
        button, a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        input, textarea, select { font-size: 16px !important; }
        input:focus, textarea:focus { font-size: 16px !important; }
      `}</style>
    </div>
  );
}
