import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, X, ShoppingBag,
  Phone, MapPin, Clock,
  Instagram, Facebook, MessageCircle,
  LayoutGrid, Sparkles, Shield,
  Flower2, BadgeCheck, Heart, Gem, ChevronRight, ArrowDown
} from 'lucide-react';
import { clientConfig } from '../config';
import { useCartStore } from '../../../store/useCartStore';

// ═══════════════════ DATOS ═══════════════════

const WHATSAPP = clientConfig.phone;
const BUSINESS = clientConfig.businessName;

interface LocalProduct {
  id: string;
  nombre: string;
  description?: string;
  categoria: string;
  precioMenudeo: number;
  precioMedioMayoreo: number;
  precioMayoreo: number;
  image: string;
  badge?: string;
}

const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'Todos', icon: LayoutGrid },
  { id: 'tratamiento-facial', name: 'Tratamiento Facial', icon: Flower2 },
  { id: 'manicura-pedicura', name: 'Manicura y Pedicura', icon: Gem },
  { id: 'esteticas-barberias', name: 'Estéticas y Barberías', icon: BadgeCheck },
];

const productos: LocalProduct[] = [
  {
    id: '1',
    nombre: 'Paso 1: Loción Limpiadora',
    description: 'Limpieza profunda y desmaquillante. Con manteca de karité. Para todo tipo de cutis. · Presentación: Loción Limpiadora LABAL 125 ml.',
    categoria: 'tratamiento-facial',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format',
    badge: 'Paso 1',
  },
  {
    id: '2',
    nombre: 'Paso 2: Agua de Rosas',
    description: 'Retira la loción limpiadora. Con extracto de pétalos de rosas. Para todo tipo de cutis. · Presentaciones: 125 ml, atomizador 125 ml y 250 ml.',
    categoria: 'tratamiento-facial',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format',
    badge: 'Paso 2',
  },
  {
    id: '3',
    nombre: 'Paso 2: Agua de Hamamelis',
    description: 'Retira la loción limpiadora. Con extracto de hamamelis. Para cutis normal a graso. · Presentaciones: 125 ml y atomizador 125 ml.',
    categoria: 'tratamiento-facial',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&auto=format',
    badge: 'Paso 2',
  },
  {
    id: '4',
    nombre: 'Paso 3: Loción Refrescante',
    description: 'Para cerrar los poros después de la limpieza profunda. Con extracto de manzanilla. Para cutis seco. · Presentaciones: 125 ml y atomizador 125 ml.',
    categoria: 'tratamiento-facial',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=600&auto=format',
    badge: 'Paso 3',
  },
  {
    id: '5',
    nombre: 'Paso 3: Loción Astringente',
    description: 'Para cerrar los poros después de la limpieza profunda. Con extracto de romero. Para cutis graso y mixto. · Presentaciones: 125 ml y atomizador 125 ml.',
    categoria: 'tratamiento-facial',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format',
    badge: 'Paso 3',
  },
  {
    id: '6',
    nombre: 'Paso 3: Loción Humectante',
    description: 'Para cerrar los poros después de la limpieza profunda. Con glicerina. Para cutis normal y mixto. · Presentaciones: 125 ml y atomizador 125 ml.',
    categoria: 'tratamiento-facial',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1571781564619-21ebd4d62326?w=600&auto=format',
    badge: 'Paso 3',
  },
  {
    id: '7',
    nombre: 'Paso 3: Loción Tónica',
    description: 'Para cerrar los poros después de la limpieza profunda. Con extracto de hamamelis. Para cutis mixto a graso. · Presentaciones: 125 ml y atomizador 125 ml.',
    categoria: 'tratamiento-facial',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format',
    badge: 'Paso 3',
  },
  {
    id: '8',
    nombre: 'Paso 4: Crema Limpiadora y Exfoliante',
    description: 'Para cerrar los poros después de la limpieza profunda. Con ácido hialurónico. Para cutis normal y mixto. · Presentación: Crema Limpiadora y Exfoliante 70 g.',
    categoria: 'tratamiento-facial',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1608248593859-99443dbbc082?w=600&auto=format',
    badge: 'Paso 4',
  },
  {
    id: '9',
    nombre: 'Piedra Pómez Sintética CLASICA',
    description: 'Medidas: 8.5 x 5.0 x 2.5 cm. Colores: Amarillo, Rosa, Verde, Naranja y Azul.',
    categoria: 'manicura-pedicura',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&auto=format',
  },
  {
    id: '10',
    nombre: 'Piedra Pómez Sintética PROFESIONAL',
    description: 'Tamaño cómodo para tomar entre los dedos y trabajar detalladamente. Colores: Amarillo, Rosa, Verde, Naranja y Azul.',
    categoria: 'manicura-pedicura',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1629198725881-ebdf853b0e36?w=600&auto=format',
  },
  {
    id: '17',
    nombre: 'Piedra Pómez Sintética CON MANGO',
    description: 'Más cómodo: se usa toda la piedra al sostenerla del mango y llega más lejos. Con lija en la parte posterior. Medidas: 13 x 3.2 x 1.1 cm. Colores: Amarillo, Rosa, Verde, Naranja y Azul.',
    categoria: 'manicura-pedicura',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&auto=format',
  },
  {
    id: '18',
    nombre: 'Piedra Pómez Sintética CON AZUFRE',
    description: 'El azufre es antiséptico y desinfectante; mantiene los pies sanos. Presentaciones: Clásica, Profesional y Cepillo.',
    categoria: 'manicura-pedicura',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1629198725881-ebdf853b0e36?w=600&auto=format',
  },
  {
    id: '11',
    nombre: 'Piedra Pómez Sintética CON AROMA',
    description: 'Contienen aroma en sí mismas, tamaño de la Piedra Clásica. Caballero: maderas dulces · Dama: flores frescas. Medidas: 8.5 x 5.0 x 2.5 cm.',
    categoria: 'manicura-pedicura',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&auto=format',
  },
  {
    id: '12',
    nombre: 'Aceite Para Cutícula',
    description: 'Hidrata la cutícula, la piel y las uñas; protege y mejora su salud y apariencia. · Presentaciones: botella de 60 ml y de 120 ml.',
    categoria: 'manicura-pedicura',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1619421712410-6bc113bc3f16?w=600&auto=format',
  },
  {
    id: '13',
    nombre: 'Plantilla para Uña Francesa',
    description: 'Facilita la decoración estilo Uña Francesa: menos tiempo y más exacto. Varía el tamaño de la zona blanca. Alcanza para 2 o 3 usos.',
    categoria: 'manicura-pedicura',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&auto=format',
  },
  {
    id: '14',
    nombre: 'Polvo Estíptico',
    description: 'Ayuda a cicatrizar rápidamente la piel en los pequeños accidentes del trabajo cotidiano (barbería, manicura y pedicura). · Presentaciones: 10 g y 10 g para Barbería.',
    categoria: 'esteticas-barberias',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1622288033621-e3fbd5508a65?w=600&auto=format',
  },
  {
    id: '15',
    nombre: 'Lápiz Estíptico',
    description: 'Ayuda a cicatrizar rápidamente la piel en barbería, Manicure y Pedicure. · Presentaciones: Lápiz Estíptico LABAL 10 g y VULCANIA 10 g.',
    categoria: 'esteticas-barberias',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format',
  },
  {
    id: '16',
    nombre: 'VEN-SAL-UD (Desinfectante)',
    description: 'Desinfecta sin maltratar cada utensilio del salón de belleza. · Presentaciones: 250 ml, 500 ml, 1 L y 1 Galón (rosa, azul y transparente).',
    categoria: 'esteticas-barberias',
    precioMenudeo: 65.0,
    precioMedioMayoreo: 54.0,
    precioMayoreo: 47.5,
    image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format',
  },
];

const C = clientConfig.colors;

// ── Paleta premium derivada de la marca (ciruela / rosa / crema) ──
const P = {
  primary: C.primary,                 // #A0487D plum
  primaryDeep: '#7C2D54',             // wine
  primarySoft: '#BE6B98',             // rose
  accent: C.accent,                   // #FADFF0 blush
  accentSoft: '#FFF6FB',              // light blush
  cream: '#FBF3F7',                   // page bg
  white: '#FFFFFF',
  gold: '#C9A86A',                    // champagne
  text: '#46383F',
  textSoft: '#8B7B84',
};

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Jost', sans-serif";

// Lógica de precios según cantidad
const getPriceForQuantity = (product: LocalProduct, quantity: number) => {
  if (quantity >= 12) return product.precioMayoreo;
  if (quantity >= 6) return product.precioMedioMayoreo;
  return product.precioMenudeo;
};

// ── Diadema decorativa (flor / pétalos) ──
const PetalOrb = ({ className, color }: { className?: string; color: string }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute rounded-full blur-3xl ${className || ''}`}
    style={{ backgroundColor: color }}
  />
);

// ── Ícono de carrito ──
const CartIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6h13l1.5 9.5a1.5 1.5 0 0 1-1.5 1.5H9.5A1.5 1.5 0 0 1 8 15.5L6 6Z" />
    <path d="M6 6 4.8 3.2A1 1 0 0 0 3.9 2.5H2.5" />
    <circle cx="10.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="17.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export default function LabalMenu() {
  const { addToCart, cart, clearCart, isCartOpen, openCart, closeCart, updateQuantity } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleItems, setVisibleItems] = useState(productos.length);
  const [cartStep, setCartStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '', phone: '', deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    address: '', paymentMethod: 'cash' as 'cash' | 'transfer',
    notes: '', cashAmount: '',
  });
  const [toastMsg, setToastMsg] = useState('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedField(key);
    setTimeout(() => setCopiedField(''), 1800);
  };

  const scrollToCatalog = () => {
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => { setVisibleItems(productos.length); }, [activeCategory, searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = productos;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      result = result.filter(p =>
        p.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q) ||
        (p.description && p.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q))
      );
    } else if (activeCategory !== 'all') {
      result = result.filter(p => p.categoria === activeCategory);
    }
    return result;
  }, [activeCategory, searchQuery]);

  // Cálculo del total dinámico basado en las reglas de mayoreo
  const dynamicCartTotal = useMemo(() => {
    return cart.reduce((total, cartItem) => {
      const product = productos.find(p => String(p.id) === String(cartItem.id));
      if (!product) return total + (cartItem.price * cartItem.quantity); // Fallback
      const currentPrice = getPriceForQuantity(product, cartItem.quantity);
      return total + (currentPrice * cartItem.quantity);
    }, 0);
  }, [cart]);

  const handleAddToCart = (product: LocalProduct) => {
    const existing = cart.find(i => String(i.id) === String(product.id));
    if (existing) {
        updateQuantity(product.id, 1);
    } else {
        addToCart({ id: product.id, name: product.nombre, price: product.precioMenudeo, image: product.image, quantity: 1, category: product.categoria, description: product.description } as any);
    }

    setToastMsg(product.nombre);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleSendWhatsApp = () => {
    const itemsText = cart.map((cartItem, i) => {
      const product = productos.find(p => String(p.id) === String(cartItem.id));
      const currentPrice = product ? getPriceForQuantity(product, cartItem.quantity) : cartItem.price;
      const subtotal = currentPrice * cartItem.quantity;
      return `${i + 1}. ${cartItem.name} x${cartItem.quantity} — $${currentPrice} c/u = $${subtotal}`;
    }).join('\n');

    const totalText = `*TOTAL: $${dynamicCartTotal}*`;
    const deliveryText = customerInfo.deliveryMethod === 'pickup' ? 'Recoger en local' : `Envío a: ${customerInfo.address}`;
    const paymentText = customerInfo.paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia';
    const message = `🛒 *PEDIDO — ${BUSINESS}*\n\n*Cliente:* ${customerInfo.name}\n*Teléfono:* ${customerInfo.phone}\n*Entrega:* ${deliveryText}\n*Pago:* ${paymentText}\n\n${itemsText}\n\n${totalText}\n\n${customerInfo.notes ? `Notas: ${customerInfo.notes}` : ''}`;

    setCartStep(3);
    setTimeout(() => {
      window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
      clearCart();
      setCustomerInfo({ name: '', phone: '', deliveryMethod: 'pickup', address: '', paymentMethod: 'cash', notes: '', cashAmount: '' });
      closeCart();
      setCartStep(1);
    }, 500);
  };

  const changeAmount = customerInfo.cashAmount && customerInfo.paymentMethod === 'cash'
    ? Math.max(0, Number(customerInfo.cashAmount) - dynamicCartTotal)
    : null;

  return (
    <div
      id="labal"
      className="min-h-screen flex flex-col relative overflow-x-clip"
      style={{ backgroundColor: P.cream, fontFamily: SANS, color: P.text }}
    >
      {/* ── Fondo decorativo global ── */}
      <PetalOrb className="-top-32 -right-24 w-[28rem] h-[28rem] opacity-40" color={P.accent} />
      <PetalOrb className="top-1/2 -left-40 w-[24rem] h-[24rem] opacity-30" color="#F3D9E7" />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50">
        <div className="px-4 pt-3">
          <div className="mx-auto max-w-6xl flex items-center justify-between rounded-full px-3 py-2.5 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.82)', boxShadow: '0 10px 40px -18px rgba(124,45,84,0.45), inset 0 1px 0 rgba(255,255,255,0.8)', border: '1px solid rgba(186,107,152,0.22)' }}>
            <div className="flex items-center gap-3 pl-1">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${P.primaryDeep}, ${P.primary} 60%, ${P.primarySoft})`, boxShadow: `0 8px 20px -8px ${P.primary}cc` }}>
                <Flower2 size={22} />
              </div>
              <div className="leading-none">
                <span className="text-lg font-bold tracking-[0.18em] uppercase" style={{ fontFamily: SANS, color: P.primaryDeep }}>LABAL</span>
                <span className="block text-[9px] font-medium uppercase tracking-[0.24em] mt-1" style={{ color: P.textSoft }}>Laboratorio Alcázar</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={openCart}
                aria-label="Abrir carrito"
                className="relative p-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ backgroundColor: P.accentSoft, color: P.primaryDeep, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)' }}
              >
                <CartIcon />
                {cart.length > 0 && (
                  <motion.span
                    key={cart.length}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: P.primary }}
                  >
                    {cart.length}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative px-4 pt-8 md:pt-14 pb-2">
        <PetalOrb className="top-20 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] opacity-50" color="#F8E1EE" />
        <div className="mx-auto max-w-6xl relative rounded-[2.5rem] overflow-hidden"
          style={{
            background: `linear-gradient(150deg, ${P.accentSoft} 0%, ${P.white} 42%, #F6E3EF 100%)`,
            boxShadow: '0 40px 80px -50px rgba(124,45,84,0.55)',
            border: '1px solid rgba(186,107,152,0.25)',
          }}>
          <div className="absolute inset-0 opacity-25 mix-blend-multiply"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1400&auto=format)', backgroundSize: 'cover', backgroundPosition: 'center 20%' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <PetalOrb className="-bottom-24 -right-16 w-96 h-96 opacity-50" color={P.accent} />

          <div className="relative px-6 py-12 md:px-16 md:py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="flex justify-center mb-6"
            >
              <motion.a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank" rel="noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] backdrop-blur-md"
                style={{ backgroundColor: 'rgba(255,255,255,0.7)', color: P.primaryDeep, border: '1px solid rgba(186,107,152,0.4)', boxShadow: '0 8px 24px -12px rgba(124,45,84,0.5)' }}
              >
                <Sparkles size={13} style={{ color: P.primary }} /> Laboratorio profesional · CDMX
              </motion.a>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
              className="text-[2.6rem] leading-[1.02] md:text-[4.4rem] font-semibold tracking-tight text-balance"
              style={{ fontFamily: SERIF, color: P.primaryDeep }}
            >
              El cuidado que tu piel<br />merece, <em style={{ color: P.primary }}>desde hoy</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed font-light"
              style={{ color: P.textSoft }}
            >
              Rutinas faciales, manicura y productos profesionales para estéticas y barberías.
              Calidad de laboratorio al alcance de tu rutina, al menudeo y mayoreo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: [0.32, 0.72, 0, 1] }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <motion.button
                type="button"
                onClick={scrollToCatalog}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
                style={{ background: `linear-gradient(135deg, ${P.primaryDeep}, ${P.primary})`, boxShadow: `0 18px 40px -16px ${P.primary}cc` }}
              >
                Explorar catálogo
                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-white/20 transition-transform group-hover:translate-x-0.5">
                  <ArrowDown size={13} />
                </span>
              </motion.button>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium"
                style={{ backgroundColor: P.white, color: P.primaryDeep, border: '1px solid rgba(186,107,152,0.4)' }}
              >
                Pedir por WhatsApp
              </a>
            </motion.div>

            {/* ── Trust pills ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-9 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.14em]"
              style={{ color: P.textSoft }}
            >
              {['Menudeo', 'Medio mayoreo', 'Mayoreo 12+', 'Precios por volumen'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-white/70 backdrop-blur-sm" style={{ border: '1px solid rgba(186,107,152,0.18)' }}>
                  <Heart size={11} style={{ color: P.primary }} /> {t}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FRANJA DE BENEFICIOS ── */}
      <section className="px-4 py-10 md:py-14">
        <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Flower2, t: 'Rutina completa', d: 'Del paso 1 al 4 para todo tipo de cutis.' },
            { icon: Gem, t: 'Manicura & pedicura', d: 'Herramientas profesionales para tu salón.' },
            { icon: BadgeCheck, t: 'Precio por volumen', d: 'Compra 6+ piezas y descuento automático.' },
          ].map((b, i) => (
            <motion.div
              key={b.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="group relative rounded-3xl p-6 overflow-hidden"
              style={{ backgroundColor: P.white, border: '1px solid rgba(186,107,152,0.18)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundImage: `radial-gradient(circle at 20% 0%, ${P.accent}99, transparent 60%)` }} />
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${P.accentSoft}, ${P.accent})`, color: P.primaryDeep, boxShadow: `0 10px 22px -10px ${P.primary}66` }}>
                  <b.icon size={22} />
                </div>
                <div>
                  <h3 className="font-semibold leading-tight" style={{ fontFamily: SERIF, fontSize: 18, color: P.primaryDeep }}>{b.t}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed font-light" style={{ color: P.textSoft }}>{b.d}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BUSCADOR ── */}
      <section className="px-4 pb-4" id="productos">
        <div className="mx-auto max-w-6xl">
          <div className="relative group mx-auto max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors" size={18} style={{ color: P.textSoft }} />
            <input
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca por producto o paso de rutina..."
              className="w-full pl-14 pr-5 py-4 rounded-full text-sm font-medium outline-none transition-all duration-300"
              style={{ backgroundColor: P.white, border: '1.5px solid rgba(186,107,152,0.22)', boxShadow: '0 14px 40px -24px rgba(124,45,84,0.5)', fontFamily: SANS }}
              onFocus={(e) => (e.currentTarget.style.borderColor = P.primary)}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(186,107,152,0.22)')}
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <section className="px-4 py-5">
        <div className="mx-auto max-w-6xl">
          <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-2">
            {DEFAULT_CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="group flex items-center gap-2.5 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 shrink-0"
                  style={{
                    backgroundColor: active ? P.primary : 'rgba(255,255,255,0.8)',
                    color: active ? '#fff' : P.textSoft,
                    boxShadow: active ? `0 14px 30px -12px ${P.primary}bb` : '0 6px 18px -12px rgba(124,45,84,0.4), inset 0 1px 0 rgba(255,255,255,0.9)',
                    border: active ? `1px solid ${P.primary}` : '1px solid rgba(186,107,152,0.18)',
                  }}
                >
                  <Icon size={15} style={{ transition: 'transform 0.3s' }} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS ── */}
      <main className="flex-1 px-4 py-4 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.slice(0, visibleItems).map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.45, delay: (idx % 4) * 0.05, ease: [0.32, 0.72, 0, 1] }}
                className="group relative flex flex-col rounded-[2rem] p-2 transition-shadow duration-500"
                style={{ backgroundColor: 'rgba(186,107,152,0.08)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)' }}
              >
                <div className="relative flex flex-col flex-1 overflow-hidden rounded-[1.6rem]"
                  style={{ backgroundColor: P.white, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)' }}>
                  {/* Imagen */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <div className="absolute inset-0 transition-opacity duration-500 opacity-70 group-hover:opacity-100"
                      style={{ backgroundImage: `radial-gradient(circle at 50% 30%, ${P.accent} 0%, transparent 70%)` }} />
                    <img
                      src={product.image}
                      alt={product.nombre}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-3.5 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${P.primaryDeep}, ${P.primary})` }}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-semibold leading-tight" style={{ fontFamily: SERIF, fontSize: 20, color: P.primaryDeep }}>{product.nombre}</h3>
                    {product.description && (
                      <p className="mt-2 text-[12.5px] leading-relaxed line-clamp-3 font-light" style={{ color: P.textSoft }}>{product.description}</p>
                    )}

                    {/* Tarjeta de precios */}
                    <div className="mt-4 rounded-2xl p-1" style={{ backgroundColor: P.accentSoft, border: '1px solid rgba(186,107,152,0.15)' }}>
                      <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'rgba(186,107,152,0.14)' }}>
                        {[
                          { k: '1–5 pzs', v: product.precioMenudeo, label: 'Menudeo' },
                          { k: '6–11 pzs', v: product.precioMedioMayoreo, label: 'Medio' },
                          { k: '12+ pzs', v: product.precioMayoreo, label: 'Mayoreo' },
                        ].map((tier) => (
                          <div key={tier.label} className="flex flex-col items-center py-3 px-1">
                            <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: P.textSoft }}>{tier.k}</span>
                            <span className="mt-1 text-lg font-bold leading-none" style={{ fontFamily: SERIF, color: tier.label === 'Mayoreo' ? P.primary : P.text }}>
                              ${tier.v}
                            </span>
                            <span className="mt-0.5 text-[8px] uppercase tracking-widest" style={{ color: tier.label === 'Mayoreo' ? P.primary : P.textSoft }}>{tier.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="group/btn mt-4 w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 active:scale-[0.97]"
                      style={{ background: `linear-gradient(135deg, ${P.primaryDeep}, ${P.primary})`, boxShadow: `0 14px 30px -14px ${P.primary}cc` }}
                    >
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover/btn:rotate-90">
                        <Plus size={13} />
                      </span>
                      Agregar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {visibleItems < filteredProducts.length && (
          <div className="flex justify-center pt-12">
            <button
              onClick={() => setVisibleItems((v) => v + 10)}
              className="px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 active:scale-95"
              style={{ backgroundColor: P.white, color: P.primaryDeep, border: '1px solid rgba(186,107,152,0.25)', boxShadow: '0 12px 30px -18px rgba(124,45,84,0.5)' }}
            >
              Cargar más productos
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: P.accentSoft, color: P.primary }}>
              <Search size={26} />
            </div>
            <p className="font-medium text-sm" style={{ color: P.textSoft }}>No encontramos productos con esa búsqueda</p>
          </div>
        )}
      </main>

      {/* ── CART DRAWER ── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart} className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] flex flex-col"
              style={{ fontFamily: SANS }}
            >
              <div className="flex items-center justify-between px-6 py-5"
                style={{ background: `linear-gradient(135deg, ${P.accentSoft}, ${P.white})`, borderBottom: `1px solid ${P.accent}` }}>
                <h2 className="font-semibold" style={{ fontFamily: SERIF, fontSize: 22, color: P.primaryDeep }}>
                  {cartStep === 1 ? 'Tu carrito' : cartStep === 2 ? 'Tus datos' : '¡Casi listo!'}
                </h2>
                <button onClick={closeCart} aria-label="Cerrar" className="p-2.5 rounded-full transition-colors hover:opacity-70" style={{ backgroundColor: 'rgba(255,255,255,0.8)', color: P.textSoft }}>
                  <X size={18} />
                </button>
              </div>

              {cartStep === 1 && (
                <div className="flex-1 overflow-y-auto p-5">
                  {cart.length === 0 ? (
                    <div className="text-center py-24">
                      <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ backgroundColor: P.accentSoft, color: P.primary }}>
                        <ShoppingBag size={26} />
                      </div>
                      <p className="text-sm font-medium" style={{ color: P.textSoft }}>Tu carrito está vacío</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((cartItem) => {
                        const product = productos.find(p => String(p.id) === String(cartItem.id));
                        const currentPrice = product ? getPriceForQuantity(product, cartItem.quantity) : cartItem.price;
                        const subtotal = currentPrice * cartItem.quantity;

                        let currentTier = 'Menudeo';
                        if (cartItem.quantity >= 12) currentTier = 'Mayoreo 12+';
                        else if (cartItem.quantity >= 6) currentTier = 'Medio mayoreo';

                        return (
                          <div key={cartItem.id} className="flex gap-4 p-4 rounded-3xl"
                            style={{ backgroundColor: P.cream, border: `1px solid ${P.accent}`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)' }}>
                            <img src={product?.image || ''} alt={cartItem.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" style={{ backgroundColor: P.accentSoft }} />
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <p className="font-medium text-sm leading-tight mb-1" style={{ fontFamily: SERIF, fontSize: 15, color: P.primaryDeep }}>{cartItem.name}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold" style={{ color: P.text }}>${currentPrice}</span>
                                  <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ backgroundColor: P.accent, color: P.primaryDeep }}>
                                    {currentTier}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-3 rounded-xl p-1"
                                  style={{ backgroundColor: P.white, border: `1px solid ${P.accent}` }}>
                                  <button onClick={() => updateQuantity(cartItem.id, -1)} aria-label="Restar" className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:shadow-sm transition-all active:scale-90" style={{ backgroundColor: P.accentSoft, color: P.primaryDeep }}>
                                    <Minus size={12} />
                                  </button>
                                  <span className="text-sm font-bold w-4 text-center" style={{ color: P.text }}>{cartItem.quantity}</span>
                                  <button onClick={() => updateQuantity(cartItem.id, 1)} aria-label="Sumar" className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all active:scale-90" style={{ backgroundColor: P.primary }}>
                                    <Plus size={12} />
                                  </button>
                                </div>
                                <p className="font-bold text-sm" style={{ color: P.primaryDeep }}>${subtotal}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {cartStep === 2 && (
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  <div className="space-y-4 rounded-3xl p-5"
                    style={{ backgroundColor: P.cream, border: `1px solid ${P.accent}` }}>
                    <h3 className="font-semibold flex items-center gap-2" style={{ fontFamily: SERIF, fontSize: 17, color: P.primaryDeep }}>
                      <MapPin size={16} style={{ color: P.primary }} /> Entrega
                    </h3>
                    <div>
                      <select
                        value={customerInfo.deliveryMethod}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryMethod: e.target.value as 'pickup' | 'delivery' })}
                        className="w-full p-3.5 rounded-2xl border text-sm font-medium bg-white outline-none focus:ring-4"
                        style={{ borderColor: 'rgba(186,107,152,0.25)', fontFamily: SANS }}
                      >
                        <option value="pickup">Recoger en sucursal</option>
                        <option value="delivery">Envío a domicilio</option>
                      </select>
                    </div>
                    {customerInfo.deliveryMethod === 'delivery' && (
                      <div>
                        <input
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                          placeholder="Calle, número, colonia..."
                          className="w-full p-3.5 rounded-2xl border text-sm bg-white outline-none focus:ring-4"
                          style={{ borderColor: 'rgba(186,107,152,0.25)', fontFamily: SANS }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-widest ml-1" style={{ color: P.textSoft }}>Tu nombre</label>
                      <input
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        placeholder="Nombre completo"
                        className="w-full p-3.5 rounded-2xl border text-sm bg-white outline-none focus:ring-4 mt-1.5"
                        style={{ borderColor: 'rgba(186,107,152,0.25)', fontFamily: SANS }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-widest ml-1" style={{ color: P.textSoft }}>WhatsApp</label>
                      <input
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="10 dígitos"
                        type="tel"
                        className="w-full p-3.5 rounded-2xl border text-sm bg-white outline-none focus:ring-4 mt-1.5"
                        style={{ borderColor: 'rgba(186,107,152,0.25)', fontFamily: SANS }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-3xl p-5"
                    style={{ backgroundColor: P.cream, border: `1px solid ${P.accent}` }}>
                    <h3 className="font-semibold flex items-center gap-2" style={{ fontFamily: SERIF, fontSize: 17, color: P.primaryDeep }}>
                      <Shield size={16} style={{ color: P.primary }} /> Pago
                    </h3>
                    <div>
                      <select
                        value={customerInfo.paymentMethod}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value as 'cash' | 'transfer' })}
                        className="w-full p-3.5 rounded-2xl border text-sm font-medium bg-white outline-none focus:ring-4"
                        style={{ borderColor: 'rgba(186,107,152,0.25)', fontFamily: SANS }}
                      >
                        <option value="cash">Efectivo al recibir</option>
                        <option value="transfer">Transferencia Bancaria</option>
                      </select>
                    </div>
                    {customerInfo.paymentMethod === 'cash' && (
                      <div>
                        <input
                          type="number"
                          value={customerInfo.cashAmount}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })}
                          placeholder="¿Con cuánto vas a pagar?"
                          className="w-full p-3.5 rounded-2xl border text-sm bg-white outline-none focus:ring-4"
                          style={{ borderColor: 'rgba(186,107,152,0.25)', fontFamily: SANS }}
                        />
                        {changeAmount !== null && changeAmount > 0 && (
                          <p className="text-xs font-semibold mt-2 ml-1" style={{ color: '#0E8A5F' }}>Tu cambio será de: ${changeAmount}</p>
                        )}
                      </div>
                    )}
                    {customerInfo.paymentMethod === 'transfer' && (
                      <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid rgba(186,107,152,0.2)' }}>
                        <p className="text-[11px] font-medium leading-relaxed mb-3" style={{ color: P.textSoft }}>
                          Realiza tu transferencia a los siguientes datos y confirma tu pedido por WhatsApp.
                        </p>
                        {[
                          { k: 'Banco', v: clientConfig.bankInfo.bank, key: 'bank' },
                          { k: 'CLABE', v: clientConfig.bankInfo.clabe, key: 'clabe' },
                          { k: 'Titular', v: clientConfig.bankInfo.accountName, key: 'name' },
                        ].map((row) => (
                          <div key={row.key} className="flex items-center justify-between gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'rgba(186,107,152,0.14)' }}>
                            <div className="min-w-0">
                              <span className="block text-[9px] font-semibold uppercase tracking-widest" style={{ color: P.textSoft }}>{row.k}</span>
                              <span className="block mt-0.5 text-sm font-semibold truncate" style={{ color: P.text }}>{row.v}</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(row.v, row.key)}
                              className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all active:scale-95"
                              style={{
                                backgroundColor: copiedField === row.key ? '#0E8A5F' : P.accent,
                                color: copiedField === row.key ? '#fff' : P.primaryDeep,
                              }}
                            >
                              {copiedField === row.key ? '¡Copiado!' : 'Copiar'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest ml-1" style={{ color: P.textSoft }}>Notas del pedido (opcional)</label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      placeholder="Instrucciones especiales..."
                      rows={3}
                      className="w-full p-3.5 rounded-2xl border text-sm bg-white outline-none focus:ring-4 mt-1.5 resize-none"
                      style={{ borderColor: 'rgba(186,107,152,0.25)', fontFamily: SANS }}
                    />
                  </div>
                </div>
              )}

              {cartStep === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                  style={{ background: `linear-gradient(160deg, ${P.accentSoft}, ${P.white})` }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg"
                    style={{ backgroundColor: P.accent, border: `1px solid ${P.primarySoft}` }}
                  >
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke={P.primaryDeep} strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-semibold" style={{ fontFamily: SERIF, color: P.primaryDeep }}>¡Casi listo!</h3>
                  <p className="text-sm mt-3 leading-relaxed max-w-xs font-light" style={{ color: P.textSoft }}>
                    Te redirigiremos a WhatsApp para enviar y confirmar tu pedido directamente con nosotros.
                  </p>
                </div>
              )}

              {/* ── Footer del carrito ── */}
              {cart.length > 0 && (
                <div className="p-5" style={{ borderTop: `1px solid ${P.accent}`, backgroundColor: P.white, boxShadow: '0 -14px 34px -26px rgba(124,45,84,0.45)' }}>
                  <div className="flex justify-between items-end mb-4 px-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: P.textSoft }}>Total a pagar</span>
                      <span className="text-xs mt-1 font-light" style={{ color: P.textSoft }}>{cart.reduce((s, i) => s + i.quantity, 0)} productos</span>
                    </div>
                    <span className="text-2xl font-bold" style={{ fontFamily: SERIF, color: P.primary }}>${dynamicCartTotal}</span>
                  </div>
                  {cartStep === 1 && (
                    <button
                      onClick={() => setCartStep(2)}
                      className="w-full py-4 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]"
                      style={{ background: `linear-gradient(135deg, ${P.primaryDeep}, ${P.primary})`, boxShadow: `0 16px 34px -16px ${P.primary}bb` }}
                    >
                      Continuar <ChevronRight size={18} />
                    </button>
                  )}
                  {cartStep === 2 && (
                    <div className="flex gap-3">
                      <button onClick={() => setCartStep(1)} className="px-5 rounded-2xl font-semibold text-sm transition-colors hover:opacity-80"
                        style={{ backgroundColor: P.accentSoft, color: P.primaryDeep, border: `1px solid ${P.accent}` }}>
                        Volver
                      </button>
                      <button
                        onClick={handleSendWhatsApp}
                        className="flex-1 py-4 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]"
                        style={{ background: 'linear-gradient(135deg,#1FAD5A,#25D366)', boxShadow: '0 16px 34px -16px rgba(37,211,102,0.7)' }}
                      >
                        <MessageCircle size={18} /> Confirmar por WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] px-6 py-4 rounded-full text-white font-medium text-sm flex items-center gap-3 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${P.primaryDeep}, ${P.primary})`, boxShadow: `0 20px 44px -16px ${P.primary}cc` }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Heart size={15} className="text-white" /></div>
            Agregado: {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER ── */}
      <footer className="relative mt-20 pt-16"
        style={{ backgroundColor: P.primaryDeep, backgroundImage: `radial-gradient(circle at 20% 0%, ${P.primary}55, transparent 55%), radial-gradient(circle at 90% 100%, ${P.primarySoft}33, transparent 45%)` }}>
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-10 pb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${P.primarySoft}, #D89BB9)` }}>
                <Flower2 size={20} />
              </div>
              <h3 className="font-bold text-xl tracking-[0.14em] uppercase" style={{ color: '#fff' }}>LABAL</h3>
            </div>
            <p className="text-sm leading-relaxed max-w-sm font-light" style={{ color: 'rgba(255,255,255,0.7)' }}>{clientConfig.description}</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">Contacto</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-3 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <Phone size={16} className="text-[#F0C9DD]" />
                </span>
                {clientConfig.phoneNumber}
              </p>
              <p className="flex items-start gap-3 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <MapPin size={16} className="text-[#F0C9DD]" />
                </span>
                <span className="pt-1.5">{clientConfig.address}</span>
              </p>
              <p className="flex items-start gap-3 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <Clock size={16} className="text-[#F0C9DD]" />
                </span>
                <span className="pt-1.5">{clientConfig.hours}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">Síguenos</h4>
            <div className="flex gap-3">
              <a href={clientConfig.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                <Instagram size={19} />
              </a>
              <a href={clientConfig.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook"
                className="w-12 h-12 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                <Facebook size={19} />
              </a>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"
                className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                <MessageCircle size={19} />
              </a>
            </div>
          </div>
        </div>

        {/* Barra inferior: créditos + legales */}
        <div className="py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex flex-col items-center gap-5 text-center px-4 max-w-6xl mx-auto">
            <p className="text-white/35 text-[10px] font-semibold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} {BUSINESS.toUpperCase()}. TODOS LOS DERECHOS RESERVADOS.
            </p>
            <motion.a
              href="https://imagineandstamp.site" target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.03 }}
              className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-300 shadow-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)' }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50 transition-colors group-hover:text-white/70">Diseñado por</span>
              <span className="text-sm font-bold tracking-tight group-hover:-translate-y-0.5 transition-transform" style={{ color: '#F0C9DD' }}>IMAGINE & STAMP</span>
            </motion.a>
            <button onClick={() => setIsPrivacyOpen(true)} className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/45 hover:text-white/80 transition-colors">
              <Shield size={12} /> Aviso de Privacidad
            </button>
          </div>
        </div>
      </footer>

      {/* ── MODAL AVISO DE PRIVACIDAD ── */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPrivacyOpen(false)} className="absolute inset-0" style={{ backgroundColor: 'rgba(60,35,50,0.7)' }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${P.primaryDeep}, ${P.primary}, ${P.gold})` }} />
              <div className="p-8">
                <button onClick={() => setIsPrivacyOpen(false)} aria-label="Cerrar" className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity" style={{ backgroundColor: P.accentSoft, color: P.textSoft }}>
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${P.accentSoft}, ${P.accent})` }}>
                    <Shield size={20} style={{ color: P.primaryDeep }} />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight uppercase" style={{ fontFamily: SERIF, color: P.primaryDeep }}>Aviso de Privacidad</h2>
                </div>
                <div className="space-y-4 text-sm leading-relaxed font-light" style={{ color: P.text }}>
                  <p>En <strong style={{ fontWeight: 600, color: P.primaryDeep }}>{BUSINESS}</strong> protegemos y respetamos tu privacidad. La información personal que compartes se utiliza exclusivamente para procesar tus pedidos y comunicarnos contigo.</p>
                  <p>No almacenamos datos bancarios. Tus datos de contacto solo se usan para confirmar tu pedido. Nunca compartimos tu información con terceros sin tu consentimiento.</p>
                  <p>Para ejercer tus derechos ARCO, contáctanos en <a href={`mailto:${clientConfig.email}`} className="hover:underline" style={{ color: P.primary }}>{clientConfig.email}</a>.</p>
                </div>
                <button onClick={() => setIsPrivacyOpen(false)} className="mt-8 w-full py-4 rounded-2xl text-white font-semibold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${P.primaryDeep}, ${P.primary})` }}>
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}