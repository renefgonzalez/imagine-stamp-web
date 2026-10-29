// ═══════════════════════════════════════════════════════════════════════════
// LAVANDERÍA BURBUJA — Lavado, Planchado & Tintorería
// Demo Oficial de Carrito de 2 Pasos + Consulta de Orden por Folio
// Imagine & Stamp · Mobile-First (375px) · Motion + Lucide
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, ShoppingBag, Plus, Minus, Trash2, Search, Check,
  Clock, MapPin, MessageCircle, Instagram, Facebook, Shield,
  X, Copy, ChevronRight, ArrowLeft, Truck, Store, DollarSign,
  CreditCard, CheckCircle2, AlertCircle, ExternalLink, Package
} from 'lucide-react';
import { clientConfig } from '../config';

// ── Imágenes WebP locales (< 80 KB) ──
import heroImg from '../assets/hero.webp';
import lavadoKiloImg from '../assets/lavado-kilo.webp';
import planchadoImg from '../assets/planchado.webp';
import edredonImg from '../assets/edredon.webp';
import tintoreriaImg from '../assets/tintoreria.webp';
import suavizanteImg from '../assets/suavizante.webp';
import expressImg from '../assets/express.webp';

const IMAGE_MAP: Record<string, string> = {
  hero: heroImg,
  'lavado-kilo': lavadoKiloImg,
  planchado: planchadoImg,
  edredon: edredonImg,
  tintoreria: tintoreriaImg,
  suavizante: suavizanteImg,
  express: expressImg,
};

const C = clientConfig.colors;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageKey: string;
  unit?: string;
}

export default function Lavanderia() {
  const [selectedCategory, setSelectedCategory] = useState('kilo');
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'kilo-5',
      name: 'Lavado por Kilo (5 kg aprox)',
      price: 150,
      quantity: 1,
      imageKey: 'lavado-kilo',
      unit: '5 kg'
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [copiedClabe, setCopiedClabe] = useState(false);

  // Estados de rastreo de orden por Folio
  const [folioInput, setFolioInput] = useState('LB-1024');
  const [searchedFolio, setSearchedFolio] = useState<string | null>('LB-1024');
  const [trackerOrders, setTrackerOrders] = useState<Record<string, any>>(clientConfig.demoOrders);

  // Formulario del Paso 2 del Carrito
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupDay, setPickupDay] = useState('Hoy');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('Mañana (09:00 - 13:00)');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [generatedFolio, setGeneratedFolio] = useState('');

  const trackerRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const changeDue = useMemo(() => {
    if (paymentMethod === 'cash' && cashAmount) {
      const val = parseFloat(cashAmount);
      if (!isNaN(val) && val >= cartTotal) {
        return val - cartTotal;
      }
    }
    return null;
  }, [paymentMethod, cashAmount, cartTotal]);

  const handleAddToCart = (product: typeof clientConfig.products[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageKey: product.imageKey,
          unit: product.unit
        }
      ];
    });

    setToastMessage(`Agregado: ${product.name}`);
    setTimeout(() => setToastMessage(''), 2200);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const scrollToTracker = () => {
    trackerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchFolio = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = folioInput.trim().toUpperCase();
    setSearchedFolio(clean);
  };

  const handleCopyClabe = () => {
    navigator.clipboard.writeText(clientConfig.bankInfo.clabe.replace(/\s/g, ''));
    setCopiedClabe(true);
    setTimeout(() => setCopiedClabe(false), 2000);
  };

  const handleStep1Next = () => {
    if (cart.length === 0) return;
    setCartStep(2);
    setFormError('');
  };

  const handleStep2Submit = () => {
    if (!customerName.trim()) {
      setFormError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setFormError('Por favor ingresa un número de WhatsApp válido.');
      return;
    }
    if (deliveryMethod === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Por favor escribe tu dirección de recolección.');
      return;
    }

    setFormError('');

    // Generar un folio nuevo único (ej. LB- + 4 dígitos)
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newFolio = `LB-${randomDigits}`;
    setGeneratedFolio(newFolio);

    // Guardar también en el rastreador en memoria para consulta inmediata
    setTrackerOrders((prev) => ({
      ...prev,
      [newFolio]: {
        folio: newFolio,
        customerName: customerName.trim(),
        serviceSummary: cart.map((i) => `${i.name} x${i.quantity}`).join(', '),
        currentStep: 1, // Recibida
        stepName: 'Orden Recibida',
        stepDescription: 'Hemos recibido tu orden y estamos coordinando la recolección.',
        date: 'Recién generada',
        estimatedDelivery: 'Coordinando por WhatsApp',
        deliveryMethod: deliveryMethod === 'delivery' ? 'Recolección a domicilio' : 'Llevar a mostrador'
      }
    }));

    setCartStep(3); // Éxito

    // Construir mensaje oficial con prefijo obligatorio [DEMO lavandería]
    const itemsList = cart
      .map((item, idx) => `${idx + 1}. ${item.name} x${item.quantity} ($${item.price * item.quantity})`)
      .join('\n');

    const entregaText =
      deliveryMethod === 'delivery'
        ? `Recolección a domicilio: ${deliveryAddress.trim()} (${pickupDay}, ${pickupTimeSlot})`
        : 'Entrega directa en mostrador';

    const pagoText =
      paymentMethod === 'cash'
        ? `Efectivo ${cashAmount ? `(Paga con $${cashAmount}${changeDue !== null ? `, cambio $${changeDue}` : ''})` : ''}`
        : 'Transferencia bancaria';

    const message =
      `[DEMO lavandería] Hola, quiero confirmar mi orden:\n\n` +
      `*Folio:* ${newFolio}\n` +
      `*Cliente:* ${customerName.trim()}\n` +
      `*WhatsApp:* ${customerPhone.trim()}\n` +
      `*Entrega:* ${entregaText}\n` +
      `*Forma de pago:* ${pagoText}\n\n` +
      `*Servicios:* \n${itemsList}\n\n` +
      `*TOTAL:* $${cartTotal} MXN\n` +
      (orderNotes.trim() ? `*Notas:* ${orderNotes.trim()}` : '');

    const waUrl = `https://wa.me/${clientConfig.phone}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.location.href = waUrl;
    }, 550);
  };

  const activeOrderData = searchedFolio ? trackerOrders[searchedFolio] : null;

  return (
    <div
      className="min-h-screen flex flex-col antialiased selection:bg-[#0284C7]/20 selection:text-[#0F172A]"
      style={{ backgroundColor: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── BARRA SUPERIOR STICKY ── */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-[#BAE6FD]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7] shadow-xs">
              <Sparkles size={16} />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-black tracking-tight text-[#0F172A]">
                {clientConfig.businessName}
              </span>
              <span className="block text-[10px] font-medium text-[#475569]">
                {clientConfig.tagline}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollToTracker}
              className="px-2.5 py-1.5 rounded-full text-[11px] font-bold text-[#0284C7] bg-[#E0F2FE] border border-[#BAE6FD] hover:bg-[#BAE6FD]/50 transition-colors flex items-center gap-1"
            >
              <Package size={13} />
              Rastrear
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-white bg-[#0284C7] hover:bg-[#0369A1] transition-all active:scale-95 shadow-xs"
              title="Ver mi pedido"
            >
              <ShoppingBag size={17} />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F59E0B] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENEDOR PRINCIPAL MOBILE-FIRST (375px a 440px) ── */}
      <main className="w-full max-w-md mx-auto flex-1 flex flex-col px-4 pt-4 pb-16">
        
        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden rounded-3xl bg-white border border-[#BAE6FD] shadow-sm p-5 text-center">
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#E0F2FE] to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Imagen Hero / Avatar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md shadow-[#0284C7]/20"
            >
              <img
                src={heroImg}
                alt={clientConfig.businessName}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Servicio activo" />
            </motion.div>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-[#0F172A]">
              {clientConfig.businessName}
            </h1>

            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#0284C7]">
              {clientConfig.tagline}
            </p>

            <p className="mt-2 text-xs text-[#475569] leading-relaxed max-w-xs">
              {clientConfig.description}
            </p>

            {/* Badges de servicio */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] font-bold border border-[#BAE6FD]">
                <Truck size={12} /> Recolección a Domicilio
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#475569] font-medium border border-[#BAE6FD]">
                <Clock size={11} className="text-[#F59E0B]" /> {clientConfig.hours.split(',')[0]}
              </span>
            </div>

            {/* Botones de acción rápida */}
            <div className="mt-4 flex items-center justify-center gap-2.5 w-full pt-3 border-t border-[#BAE6FD]">
              <a
                href={`https://wa.me/${clientConfig.phone}?text=${encodeURIComponent('[DEMO lavandería] Hola, me gustaría pedir informes sobre los servicios de Lavandería Burbuja')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-[#25D366]/10 text-[#128C7E] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#25D366]/25 hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>
              <button
                onClick={scrollToTracker}
                className="flex-1 py-2 px-3 rounded-xl bg-[#E0F2FE] text-[#0284C7] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#BAE6FD] hover:bg-[#BAE6FD]/40 transition-colors"
              >
                <Search size={15} />
                Rastrear Orden
              </button>
              <a
                href={clientConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-[#4285F4]/10 text-[#1a73e8] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#4285F4]/20 hover:bg-[#4285F4]/20 transition-colors"
              >
                <MapPin size={15} />
                Ubicación
              </a>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN "CONSULTA TU ORDEN" (SEGUIMIENTO POR FOLIO) ── */}
        <section ref={trackerRef} className="mt-6 p-4 rounded-3xl bg-white border border-[#BAE6FD] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0284C7] flex items-center gap-1.5">
              <Package size={14} />
              Consulta tu Orden
            </h2>
            <span className="text-[10px] text-[#94A3B8]">Seguimiento en vivo</span>
          </div>

          <p className="text-[11px] text-[#475569] leading-relaxed mb-3">
            Escribe el folio de tu nota para ver el avance en tiempo real de tus prendas:
          </p>

          <form onSubmit={handleSearchFolio} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={folioInput}
                onChange={(e) => setFolioInput(e.target.value)}
                placeholder="Ej. LB-1024"
                className="w-full p-2.5 pl-8 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-xs font-bold text-[#0F172A] uppercase placeholder:normal-case focus:outline-none focus:border-[#0284C7]"
              />
              <Search size={14} className="absolute left-2.5 top-3 text-[#94A3B8]" />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#0284C7] text-white font-bold text-xs shadow-xs hover:bg-[#0369A1] transition-colors"
            >
              Consultar
            </button>
          </form>

          {/* Chips de folios de prueba recomendados */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-[10px] text-[#475569]">
            <span>Prueba con folios de demo:</span>
            <button
              type="button"
              onClick={() => {
                setFolioInput('LB-1024');
                setSearchedFolio('LB-1024');
              }}
              className="px-2 py-0.5 rounded-md bg-[#E0F2FE] text-[#0284C7] font-bold border border-[#BAE6FD] hover:bg-[#BAE6FD]/50"
            >
              LB-1024 (Lavando)
            </button>
            <button
              type="button"
              onClick={() => {
                setFolioInput('LB-1025');
                setSearchedFolio('LB-1025');
              }}
              className="px-2 py-0.5 rounded-md bg-[#E0F2FE] text-[#0284C7] font-bold border border-[#BAE6FD] hover:bg-[#BAE6FD]/50"
            >
              LB-1025 (Lista)
            </button>
          </div>

          {/* Resultado del Rastreo */}
          <div className="mt-4 pt-3 border-t border-[#BAE6FD]">
            {activeOrderData ? (
              <div className="space-y-3">
                {/* Cabecera de la Orden */}
                <div className="p-3 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#0284C7] uppercase tracking-wider block">
                      Folio Activo
                    </span>
                    <span className="text-base font-black text-[#0F172A]">
                      {activeOrderData.folio}
                    </span>
                    <span className="block text-[11px] text-[#475569]">
                      Cliente: {activeOrderData.customerName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0284C7] text-white">
                      {activeOrderData.stepName}
                    </span>
                    <span className="block text-[10px] text-[#94A3B8] mt-1">
                      {activeOrderData.date}
                    </span>
                  </div>
                </div>

                {/* Resumen del Servicio */}
                <div className="px-1 text-xs text-[#475569]">
                  <p><strong>Prendas:</strong> {activeOrderData.serviceSummary}</p>
                  <p><strong>Entrega estimada:</strong> {activeOrderData.estimatedDelivery}</p>
                </div>

                {/* Línea de Tiempo de 5 Estados */}
                <div className="pt-2">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
                    Avance del Proceso (Línea de Tiempo)
                  </span>

                  <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#BAE6FD]">
                    {clientConfig.timelineSteps.map((step) => {
                      const isCompleted = step.step < activeOrderData.currentStep;
                      const isCurrent = step.step === activeOrderData.currentStep;

                      return (
                        <div key={step.id} className="relative flex items-start gap-2.5">
                          {/* Dot / Check Icon */}
                          <div
                            className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                              isCurrent
                                ? 'bg-[#0284C7] text-white ring-4 ring-[#BAE6FD]'
                                : isCompleted
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white border-2 border-[#BAE6FD] text-[#94A3B8]'
                            }`}
                          >
                            {isCompleted ? <Check size={11} /> : step.step}
                          </div>

                          <div>
                            <span
                              className={`block text-xs font-bold leading-tight ${
                                isCurrent
                                  ? 'text-[#0284C7]'
                                  : isCompleted
                                  ? 'text-[#0F172A]'
                                  : 'text-[#94A3B8]'
                              }`}
                            >
                              {step.name}
                            </span>
                            <span className="block text-[10px] text-[#475569]">
                              {isCurrent ? activeOrderData.stepDescription : step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : searchedFolio ? (
              /* Folio No Encontrado */
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
                <AlertCircle size={22} className="text-amber-600 mx-auto" />
                <h4 className="text-xs font-bold text-amber-900">
                  No encontramos el folio &ldquo;{searchedFolio}&rdquo;
                </h4>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Verifica que esté bien escrito o escríbenos directamente por WhatsApp para rastrear tu orden manualmente.
                </p>
                <a
                  href={`https://wa.me/${clientConfig.phone}?text=${encodeURIComponent(`[DEMO lavandería] Hola, necesito consultar el estatus de mi orden con folio: ${searchedFolio}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-xs hover:opacity-95"
                >
                  <MessageCircle size={14} />
                  Consultar por WhatsApp
                </a>
              </div>
            ) : null}
          </div>

          <p className="mt-3 text-[9px] text-[#94A3B8] text-center">
            * Conexión directa a base de datos de órdenes en producción (panel de taller / Supabase).
          </p>
        </section>

        {/* ── CATÁLOGO DE SERVICIOS CON CARRITO ── */}
        <section ref={catalogRef} className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#475569] flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-[#0284C7]" />
              Servicios & Pedido en Línea
            </h2>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-[11px] font-bold text-[#0284C7] hover:underline flex items-center gap-1"
            >
              Carrito ({totalItemCount}) →
            </button>
          </div>

          {/* Categorías en pills horizontales */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {clientConfig.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  selectedCategory === cat.id
                    ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                    : 'bg-white text-[#475569] border-[#BAE6FD] hover:bg-[#E0F2FE]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Cards de Servicios */}
          <div className="mt-3 space-y-3">
            {clientConfig.products
              .filter((p) => p.category === selectedCategory)
              .map((product) => {
                const img = IMAGE_MAP[product.imageKey] || lavadoKiloImg;
                const inCart = cart.find((i) => i.id === product.id);

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-white border border-[#BAE6FD] shadow-xs flex gap-3.5 items-center hover:border-[#0284C7]/60 transition-colors"
                  >
                    {/* Foto */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#BAE6FD]">
                      <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.badge && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#F59E0B] text-white shadow-xs">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-sm font-bold text-[#0F172A] truncate">
                          {product.name}
                        </h3>
                        <span className="text-sm font-black text-[#0284C7] shrink-0">
                          ${product.price}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#475569] line-clamp-2 leading-relaxed mt-0.5">
                        {product.description}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-[#F0F9FF]">
                        <span className="text-[10px] text-[#94A3B8]">
                          {product.unit ? `Por ${product.unit}` : 'Servicio completo'}
                        </span>

                        {inCart ? (
                          <div className="flex items-center gap-2 bg-[#E0F2FE] px-2 py-1 rounded-xl border border-[#BAE6FD]">
                            <button
                              onClick={() => handleUpdateQty(product.id, -1)}
                              className="w-5 h-5 rounded-md bg-white text-[#0284C7] font-bold flex items-center justify-center hover:bg-slate-100"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-xs font-black text-[#0284C7]">
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(product.id, 1)}
                              className="w-5 h-5 rounded-md bg-white text-[#0284C7] font-bold flex items-center justify-center hover:bg-slate-100"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="px-3 py-1 rounded-xl text-xs font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD] hover:bg-[#0284C7] hover:text-white transition-all flex items-center gap-1"
                          >
                            <Plus size={13} />
                            Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </section>

        {/* ── RECUADRO HONESTO DE PRUEBA SOCIAL (Sin reseñas inventadas) ── */}
        <section className="mt-8 p-4 rounded-2xl bg-white border-2 border-dashed border-[#BAE6FD] text-center">
          <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto mb-2">
            <Shield size={18} />
          </div>
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Aquí van las reseñas reales de tus clientes
          </h3>
          <p className="mt-1 text-[11px] text-[#475569] leading-relaxed max-w-xs mx-auto">
            En tu aplicación personalizada, este bloque muestra las calificaciones y comentarios verificados de Google Maps y WhatsApp para generar tranquilidad en el cuidado de prendas.
          </p>
        </section>

      </main>

      {/* ── BARRA FLOTANTE DEL CARRITO (Sticky bottom si hay items) ── */}
      {cart.length > 0 && !isCartOpen && (
        <aside aria-label="Carrito de compras" className="fixed bottom-3 left-0 right-0 z-30 px-4 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                setCartStep(1);
                setIsCartOpen(true);
              }}
              className="w-full p-3.5 rounded-2xl text-white shadow-xl shadow-[#0284C7]/30 flex items-center justify-between"
              style={{
                background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold">
                    {totalItemCount} {totalItemCount === 1 ? 'servicio' : 'servicios'} en tu pedido
                  </span>
                  <span className="block text-[10px] text-white/85">
                    Toca para ver el detalle y pedir
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-black text-sm">
                <span>${cartTotal} MXN</span>
                <ChevronRight size={18} />
              </div>
            </motion.button>
          </div>
        </aside>
      )}

      {/* ── TOAST FLOTANTE AL AGREGAR ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#0284C7] text-white text-xs font-bold shadow-lg flex items-center gap-1.5"
          >
            <Check size={14} /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER DE 3 COLUMNAS DEL CLIENTE + LEGALES ── */}
      <footer className="mt-auto border-t border-[#BAE6FD] bg-white pt-8 pb-0">
        <div className="max-w-md mx-auto px-4 grid grid-cols-1 gap-6 pb-8">
          
          {/* Columna 1: Marca */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-tight text-[#0F172A]">
              {clientConfig.businessName}
            </h4>
            <p className="text-xs text-[#475569] leading-relaxed mt-1">
              {clientConfig.description}
            </p>
          </div>

          {/* Columna 2: Contacto */}
          <div className="space-y-1.5 text-xs text-[#475569]">
            <p className="font-bold uppercase text-[10px] tracking-wider text-[#0F172A]">Contacto & Mostrador</p>
            <p className="flex items-center gap-2">
              <MapPin size={13} className="text-[#0284C7] shrink-0" />
              <span>{clientConfig.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock size={13} className="text-[#0284C7] shrink-0" />
              <span>{clientConfig.hours}</span>
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle size={13} className="text-[#25D366] shrink-0" />
              <span>WhatsApp: {clientConfig.phoneNumber}</span>
            </p>
          </div>

          {/* Columna 3: Redes Sociales */}
          <div>
            <p className="font-bold uppercase text-[10px] tracking-wider text-[#0F172A] mb-2">Síguenos</p>
            <div className="flex gap-2">
              <a
                href={clientConfig.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD] flex items-center justify-center hover:scale-105 transition-transform"
                title="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={clientConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD] flex items-center justify-center hover:scale-105 transition-transform"
                title="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={`https://wa.me/${clientConfig.phone}?text=${encodeURIComponent('[DEMO lavandería] Hola!')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/20 flex items-center justify-center hover:scale-105 transition-transform"
                title="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="py-6 border-t border-[#BAE6FD] bg-[#F0F9FF]">
          <div className="max-w-md mx-auto px-4 flex flex-col items-center gap-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              © {new Date().getFullYear()} {clientConfig.businessName.toUpperCase()} · DEMO OFICIAL
            </p>

            <a
              href="https://imagineandstamp.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#BAE6FD] text-[10px] font-bold uppercase tracking-wider text-[#475569] hover:text-[#0284C7] transition-colors shadow-xs"
            >
              <span>Diseñado por</span>
              <span className="text-[#0284C7] font-black">IMAGINE & STAMP</span>
              <ExternalLink size={10} className="text-[#0284C7]" />
            </a>

            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="flex items-center gap-1 text-[10px] font-semibold text-[#94A3B8] hover:text-[#475569] transition-colors underline"
            >
              <Shield size={11} /> Aviso de Privacidad (LFPDPPP)
            </button>
          </div>
        </div>
      </footer>

      {/* ── MODAL CARRITO DE 2 PASOS + ÉXITO CON FOLIO ── */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-md max-h-[92vh] bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl border-t sm:border border-[#BAE6FD] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Barra superior de acento */}
              <div className="h-1.5 bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#F59E0B] shrink-0" />

              {/* Header */}
              <div className="p-4 border-b border-[#BAE6FD] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {cartStep === 2 && (
                    <button
                      onClick={() => setCartStep(1)}
                      className="w-8 h-8 rounded-full bg-[#F0F9FF] text-[#475569] flex items-center justify-center hover:bg-[#E0F2FE]"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                      <ShoppingBag size={15} className="text-[#0284C7]" />
                      {cartStep === 1 && 'Paso 1: Tu Pedido'}
                      {cartStep === 2 && 'Paso 2: Entrega y Pago'}
                      {cartStep === 3 && '¡Pedido Registrado!'}
                    </h3>
                    <p className="text-[10px] text-[#475569]">
                      {cartStep === 1 && `${totalItemCount} artículos en tu carrito`}
                      {cartStep === 2 && 'Dirección, horario y forma de pago'}
                      {cartStep === 3 && 'Folio generado para seguimiento'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#F0F9FF] text-[#475569] flex items-center justify-center hover:bg-[#E0F2FE]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Error inline */}
              {formError && (
                <div className="px-4 py-2 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle size={14} /> {formError}
                </div>
              )}

              {/* Contenido según el paso */}
              <div className="p-4 overflow-y-auto space-y-4 flex-1">
                
                {/* ── PASO 1: Lista de prendas en el carrito ── */}
                {cartStep === 1 && (
                  <div>
                    {cart.length === 0 ? (
                      <div className="py-12 text-center space-y-2">
                        <ShoppingBag size={32} className="text-[#94A3B8] mx-auto" />
                        <p className="text-sm font-bold text-[#0F172A]">Tu carrito está vacío</p>
                        <p className="text-xs text-[#475569]">Agrega servicios de lavado o planchado.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => {
                          const img = IMAGE_MAP[item.imageKey] || lavadoKiloImg;
                          return (
                            <div
                              key={item.id}
                              className="p-3 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-between gap-3"
                            >
                              <img
                                src={img}
                                alt={item.name}
                                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#BAE6FD]"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-[#0F172A] truncate">
                                  {item.name}
                                </h4>
                                <span className="text-[11px] font-semibold text-[#0284C7]">
                                  ${item.price} {item.unit ? `(${item.unit})` : ''}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleUpdateQty(item.id, -1)}
                                  className="w-7 h-7 rounded-lg bg-white border border-[#BAE6FD] flex items-center justify-center text-[#0284C7] font-bold"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-6 text-center text-xs font-black">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQty(item.id, 1)}
                                  className="w-7 h-7 rounded-lg bg-white border border-[#BAE6FD] flex items-center justify-center text-[#0284C7] font-bold"
                                >
                                  <Plus size={12} />
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center ml-1"
                                  title="Quitar"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Total del Carrito */}
                        <div className="p-3.5 rounded-2xl bg-white border border-[#BAE6FD] flex items-center justify-between">
                          <span className="text-xs font-bold text-[#475569]">Total estimado</span>
                          <span className="text-lg font-black text-[#0284C7]">${cartTotal} MXN</span>
                        </div>

                        <button
                          onClick={handleStep1Next}
                          className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#0284C7]/25 transition-all hover:bg-[#0369A1] active:scale-98 flex items-center justify-center gap-1"
                          style={{ backgroundColor: C.primary }}
                        >
                          Continuar a Entrega y Pago →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── PASO 2: Recolección / Mostrador + Pago ── */}
                {cartStep === 2 && (
                  <div className="space-y-4">
                    {/* Nombre y WhatsApp */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ej. Roberto Fuentes"
                        className="w-full p-2.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                        Tu WhatsApp (10 dígitos) *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="55 1234 5678"
                        className="w-full p-2.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>

                    {/* Método de Entrega */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                        Modalidad de Servicio
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('delivery')}
                          className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                            deliveryMethod === 'delivery'
                              ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                              : 'bg-[#F0F9FF] text-[#475569] border-[#BAE6FD]'
                          }`}
                        >
                          <Truck size={14} /> Recolección Domicilio
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod('pickup')}
                          className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                            deliveryMethod === 'pickup'
                              ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                              : 'bg-[#F0F9FF] text-[#475569] border-[#BAE6FD]'
                          }`}
                        >
                          <Store size={14} /> Lo llevo a sucursal
                        </button>
                      </div>
                    </div>

                    {/* Campos de domicilio si es recolección */}
                    {deliveryMethod === 'delivery' && (
                      <div className="p-3 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-2.5">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                            Dirección de Recolección (Calle, número y referencias) *
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Calle 4 #123, Col. Leyes de Reforma..."
                            className="w-full p-2.5 rounded-xl bg-white border border-[#BAE6FD] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-[#475569] mb-1">
                              Día de Recolección
                            </label>
                            <select
                              value={pickupDay}
                              onChange={(e) => setPickupDay(e.target.value)}
                              className="w-full p-2 rounded-xl bg-white border border-[#BAE6FD] text-xs font-bold text-[#0F172A]"
                            >
                              <option value="Hoy">Hoy mismo</option>
                              <option value="Mañana">Mañana</option>
                              <option value="Sábado">Sábado</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold uppercase text-[#475569] mb-1">
                              Horario
                            </label>
                            <select
                              value={pickupTimeSlot}
                              onChange={(e) => setPickupTimeSlot(e.target.value)}
                              className="w-full p-2 rounded-xl bg-white border border-[#BAE6FD] text-xs font-bold text-[#0F172A]"
                            >
                              <option value="Mañana (09:00 - 13:00)">Mañana (09:00 - 13:00)</option>
                              <option value="Tarde (14:00 - 18:00)">Tarde (14:00 - 18:00)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Forma de Pago */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                        Forma de Pago
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cash')}
                          className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                            paymentMethod === 'cash'
                              ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                              : 'bg-[#F0F9FF] text-[#475569] border-[#BAE6FD]'
                          }`}
                        >
                          <DollarSign size={14} /> Efectivo
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('transfer')}
                          className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                            paymentMethod === 'transfer'
                              ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                              : 'bg-[#F0F9FF] text-[#475569] border-[#BAE6FD]'
                          }`}
                        >
                          <CreditCard size={14} /> Transferencia
                        </button>
                      </div>
                    </div>

                    {/* Detalles de pago en efectivo con cálculo de cambio */}
                    {paymentMethod === 'cash' && (
                      <div className="p-3 rounded-2xl bg-[#FFFBEB] border border-amber-200">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1">
                          ¿Con cuánto billete pagas? (Opcional, para llevar cambio)
                        </label>
                        <input
                          type="number"
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          placeholder={`Ej. ${cartTotal <= 200 ? '200 o 500' : '500'}`}
                          className="w-full p-2.5 rounded-xl bg-white border border-amber-300 text-xs font-bold text-[#0F172A]"
                        />
                        {changeDue !== null && (
                          <p className="mt-1.5 text-xs font-black text-emerald-700 flex items-center gap-1">
                            <Check size={14} /> Tu cambio será de: ${changeDue} MXN
                          </p>
                        )}
                      </div>
                    )}

                    {/* Detalles de transferencia con copiar */}
                    {paymentMethod === 'transfer' && (
                      <div className="p-3 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] block">
                          Datos de Transferencia
                        </span>
                        <div className="p-2 rounded-xl bg-white border border-[#BAE6FD] flex items-center justify-between text-xs">
                          <div>
                            <span className="block font-bold text-[#0F172A]">{clientConfig.bankInfo.bank}</span>
                            <span className="block font-mono text-[11px] text-[#475569]">{clientConfig.bankInfo.clabe}</span>
                            <span className="block text-[9px] text-[#0284C7]">Titular: {clientConfig.bankInfo.accountHolder}</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyClabe}
                            className="px-2.5 py-1.5 rounded-lg bg-[#E0F2FE] text-[#0284C7] text-[10px] font-bold border border-[#BAE6FD] flex items-center gap-1"
                          >
                            {copiedClabe ? <Check size={12} /> : <Copy size={12} />}
                            {copiedClabe ? 'Copiado' : 'Copiar'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Notas adicionales */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                        Instrucciones o Notas Especiales
                      </label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Ej. Cuidado con camisa de seda, tocar timbre blanco..."
                        rows={2}
                        className="w-full p-2.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>

                    {/* Botón de Enviar Pedido */}
                    <button
                      type="button"
                      onClick={handleStep2Submit}
                      className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#25D366]/25 transition-all hover:opacity-95 active:scale-98 flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      <MessageCircle size={16} />
                      Enviar Orden por WhatsApp
                    </button>
                  </div>
                )}

                {/* ── PASO 3: Éxito con Folio Generado ── */}
                {cartStep === 3 && (
                  <div className="py-6 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-base font-black text-[#0F172A]">
                      ¡Pedido Registrado con Éxito!
                    </h3>

                    {/* Tarjeta de Folio */}
                    <div className="p-3.5 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] inline-block mx-auto min-w-[200px]">
                      <span className="block text-[10px] uppercase font-bold text-[#0284C7] tracking-wider">
                        Tu Folio de Seguimiento
                      </span>
                      <span className="text-xl font-black text-[#0F172A] tracking-wider font-mono">
                        {generatedFolio}
                      </span>
                    </div>

                    <p className="text-xs text-[#475569] leading-relaxed max-w-xs mx-auto">
                      Redirigiendo a WhatsApp oficial para confirmar recolección y entrega con <strong>{clientConfig.businessName}</strong>...
                    </p>

                    <div className="pt-2">
                      <span className="inline-block w-6 h-6 border-2 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL AVISO DE PRIVACIDAD (LFPDPPP) ── */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 border border-[#BAE6FD] max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F0F9FF] text-[#475569] flex items-center justify-center hover:bg-[#E0F2FE]"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-tight">
                    Aviso de Privacidad
                  </h3>
                  <p className="text-[10px] text-[#475569]">
                    Ley Federal de Protección de Datos Personales (LFPDPPP)
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#475569] leading-relaxed">
                <p>
                  En <strong>{clientConfig.businessName}</strong>, con domicilio en {clientConfig.address}, valoramos la seguridad de tus prendas y de tu información.
                </p>
                <p>
                  <strong>Uso de datos:</strong> Tu nombre, teléfono y dirección de entrega se utilizan única y exclusivamente para procesar tu pedido, coordinar la recolección de ropa y notificarte el avance mediante tu folio.
                </p>
                <p>
                  <strong>Protección:</strong> No almacenamos datos bancarios confidenciales ni compartimos tu información personal con terceros.
                </p>
                <p>
                  <strong>Contacto ARCO:</strong> Puedes solicitar la actualización o eliminación de tus datos escribiendo a <strong>{clientConfig.email}</strong> o vía WhatsApp al <strong>{clientConfig.phoneNumber}</strong>.
                </p>
              </div>

              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#0284C7] text-white font-bold text-xs uppercase tracking-wider hover:opacity-95"
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
