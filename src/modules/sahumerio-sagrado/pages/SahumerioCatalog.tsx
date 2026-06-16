import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Plus, Minus, X, MapPin, Sparkles, Heart, Share2,
  MessageCircle, Moon, Star, ArrowLeft, Volume2, VolumeX, ChevronDown,
  Globe, Search, Menu, ZoomIn, ZoomOut, Phone, Mail, QrCode, Clock,
  SlidersHorizontal, Check, CreditCard, Landmark, Copy
} from 'lucide-react';
import { SAHUMERIO_CATEGORIES, SAHUMERIO_PRODUCTS } from '../constants';
import bgImage from '../assets/sahumerio-bg.png';
import ambientAudio from '../sahumerio-sagrado.mp3';
import mainLogo from '../../../logo.png';
import { supabaseSahumerio as supabase } from '../lib/supabase';
import AdminSahumerio from './AdminSahumerio';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function SahumerioCatalog() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(10);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'cart' | 'details'>('cart');
  const [selectedProductDetails, setSelectedProductDetails] = useState<any>(null);
  const [addedToCartItem, setAddedToCartItem] = useState<any>(null);
  
  const [menuItems, setMenuItems] = useState<any[]>(SAHUMERIO_PRODUCTS);
  const [categories, setCategories] = useState<any[]>(SAHUMERIO_CATEGORIES);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [mpLoading, setMpLoading] = useState(false);
  const [cartToast, setCartToast] = useState<{name: string} | null>(null);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    const { error } = await supabase.from('reviews').insert([{
      name: reviewForm.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      approved: false
    }]);
    
    setIsSubmittingReview(false);
    if (!error) {
      setReviewSuccess(true);
      setTimeout(() => {
        setIsReviewOpen(false);
        setReviewSuccess(false);
        setReviewForm({ name: '', rating: 5, comment: '' });
      }, 3000);
    } else {
      alert('Hubo un error al enviar tu opinión. Intenta de nuevo.');
    }
  };

  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const shareProduct = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Mira este producto mágico: ${product.name}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(`Compartir: ${window.location.href}`);
    }
  };
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    shippingMethod: 'Selecciona una opción',
    paymentMethod: 'Selecciona una opción',
    notes: '',
    locationLink: ''
  });

  const [gettingLocation, setGettingLocation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // States for Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeBadgeFilter, setActiveBadgeFilter] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Bank Info States
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.03;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(e => console.log('El navegador bloqueó el autoplay:', e));
      }
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      const [catRes, prodRes, settingsRes] = await Promise.all([
        supabase.from('categories').select('*').order('order_index', { ascending: true }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('settings').select('*').eq('id', 'bank').maybeSingle()
      ]);

      if (settingsRes.data) {
        setBankInfo(settingsRes.data);
      }

      const catData = catRes.data;
      if (catData && catData.length > 0) {
        const hardcodedById = new Map(SAHUMERIO_CATEGORIES.map(c => [c.id, c]));
        const supabaseIds = new Set(catData.map(c => c.id));
        const merged = catData.map((c: any) => ({
          ...c,
          label: c.label || (hardcodedById.get(c.id) as any)?.name || c.id,
          emoji: c.emoji || (hardcodedById.get(c.id) as any)?.emoji || '✨',
        }));
        for (const hc of SAHUMERIO_CATEGORIES) {
          if (!supabaseIds.has(hc.id)) merged.push({ ...hc });
        }
        setCategories(merged);
      } else {
        setCategories(SAHUMERIO_CATEGORIES);
      }

      const prodData = prodRes.data;
      if (prodData && prodData.length > 0) {
        setMenuItems(prodData.map((d: any) => ({
          ...d,
          originalPrice: d.original_price,
          rentalPrice: d.rental_price,
          soldOut: d.sold_out,
        })));
      } else {
        setMenuItems(SAHUMERIO_PRODUCTS);
      }
    }
    loadData();
  }, []);

  const updateItem = async (id: string, patch: Partial<any>) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
    const patchDb = { ...patch } as any;
    if (patch.originalPrice !== undefined) { patchDb.original_price = patch.originalPrice; delete patchDb.originalPrice; }
    if (patch.rentalPrice !== undefined) { patchDb.rental_price = patch.rentalPrice; delete patchDb.rentalPrice; }
    if (patch.soldOut !== undefined) { patchDb.sold_out = patch.soldOut; delete patchDb.soldOut; }
    await supabase.from('products').update(patchDb).eq('id', id);
  };

  const addItem = async (item: any) => {
    const itemDb = { ...item };
    delete itemDb.id;
    if (item.originalPrice !== undefined) { itemDb.original_price = item.originalPrice; delete itemDb.originalPrice; }
    if (item.rentalPrice !== undefined) { itemDb.rental_price = item.rentalPrice; delete itemDb.rentalPrice; }
    if (item.soldOut !== undefined) { itemDb.sold_out = item.soldOut; delete itemDb.soldOut; }
    
    const { data, error } = await supabase.from('products').insert([itemDb]).select().single();
    if (!error && data) {
      const insertedItem = { ...data, originalPrice: data.original_price, rentalPrice: data.rental_price, soldOut: data.sold_out };
      setMenuItems(prev => [insertedItem, ...prev]);
    } else {
      setMenuItems(prev => [item, ...prev]);
    }
  };

  const deleteItem = async (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const scrollToCatalog = () => {
    const catalogElement = document.getElementById('catalogo');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredProducts = useMemo(() => {
    let result = menuItems;
    
    if (showOnlyFavorites) {
      result = result.filter(p => favorites.includes(p.id));
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (activeBadgeFilter) {
      result = result.filter(p => (p as any).badge === activeBadgeFilter);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, activeBadgeFilter, searchQuery, showOnlyFavorites, favorites, menuItems]);

  useEffect(() => {
    setVisibleCount(10);
  }, [selectedCategory, activeBadgeFilter, searchQuery]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    setAddedToCartItem(product);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleGetLocation = () => {
    setGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setCustomerInfo(prev => ({ ...prev, locationLink: link }));
        setGettingLocation(false);
      }, (error) => {
        console.error('Error getting location', error);
        alert('No se pudo obtener la ubicación. Por favor, asegúrate de dar los permisos correspondientes.');
        setGettingLocation(false);
      });
    } else {
      alert('Geolocalización no soportada por este navegador.');
      setGettingLocation(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pago = params.get('pago');
    if (!pago) return;

    const status = params.get('status') || params.get('collection_status');
    const orderRef = params.get('external_reference');
    const paymentId = params.get('payment_id') || params.get('collection_id');

    if (pago === 'exito' && status === 'approved' && orderRef) {
      supabase.from('orders')
        .update({ payment_reference: `MP-${paymentId || 'aprobado'}` })
        .eq('id', orderRef)
        .then(() => {});
      setCartToast({ name: '✅ ¡Pago aprobado! Tu pedido fue registrado.' });
      setTimeout(() => setCartToast(null), 6000);
    } else if (pago === 'error') {
      setCartToast({ name: '❌ El pago fue rechazado. Intenta de nuevo u otra forma de pago.' });
      setTimeout(() => setCartToast(null), 6000);
    } else if (pago === 'pendiente') {
      setCartToast({ name: '⏳ Tu pago está pendiente de confirmación.' });
      setTimeout(() => setCartToast(null), 6000);
    }

    window.history.replaceState({}, '', window.location.pathname + window.location.hash);
  }, []);

  const handleMercadoPagoCheckout = async () => {
    if (mpLoading) return;
    setMpLoading(true);

    const orderId = 'ORD-' + Date.now();
    const newOrder = {
      id: orderId,
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_city: customerInfo.address || 'Por confirmar',
      delivery_notes: customerInfo.notes,
      payment_method: 'Tarjeta (Mercado Pago)',
      items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
      total_amount: totalPrice + (customerInfo.shippingMethod === 'Envío a domicilio' ? 150 : 0),
      status: 'pending',
      internal_notes: []
    };

    try {
      const { error: orderError } = await supabase.from('orders').insert([newOrder]);
      if (orderError) throw new Error('No se pudo crear el pedido. Intenta de nuevo.');

      const { data, error } = await supabase.functions.invoke('create-preference', {
        body: {
          orderId,
          items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
          siteUrl: window.location.origin
        }
      });

      if (error) throw error;

      const redirectUrl = data?.init_point || data?.sandbox_init_point;
      if (!redirectUrl) throw new Error(data?.error ? JSON.stringify(data.error) : 'Mercado Pago no devolvió un enlace de pago.');

      window.location.href = redirectUrl;
    } catch (err: any) {
      console.error('Error en pago Mercado Pago:', err);
      alert('Hubo un problema al iniciar el pago con tarjeta. ' + (err?.message || '') + '\n\nPuedes elegir otra forma de pago o escribirnos por WhatsApp.');
      setMpLoading(false);
    }
  };

  const handleCheckout = () => {
    const phoneNumber = '525549893248';
    const shippingCost = customerInfo.shippingMethod === 'Envío a domicilio' ? 150 : 0;
    const finalTotal = totalPrice + shippingCost;
    
    const cartText = cart.map(item => `✨ ${item.name} x${item.quantity} = $${item.price * item.quantity} MXN`).join('\n');
    
    let message = `¡Hola! Me gustaría hacer un pedido místico 🌙\n\n` +
      `*Mi Pedido:*\n${cartText}\n\n` +
      `*Subtotal:* $${totalPrice} MXN\n` +
      (shippingCost > 0 ? `*Costo de Envío:* $${shippingCost} MXN\n` : '') +
      `*Total a Pagar:* $${finalTotal} MXN\n\n` +
      `*Datos de Entrega:*\n` +
      `👤 Nombre: ${customerInfo.name}\n` +
      `📱 Teléfono: ${customerInfo.phone}\n` +
      `📦 Envío: ${customerInfo.shippingMethod}\n` +
      `💳 Pago: ${customerInfo.paymentMethod}\n` +
      (customerInfo.notes ? `📝 Notas: ${customerInfo.notes}` : '');

    if (customerInfo.paymentMethod === 'Mercado Pago') {
      message += `\n\n⚠️ Requiero mi link de Mercado Pago para concretar el pedido de Sahumerios.`;
    }

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Limpiar carrito y cerrar modales después de enviar el pedido
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCartStep('cart');
  };

  return (
    <div className="bg-[#FDFBF7] font-sans text-[#4A4056] relative scroll-smooth selection:bg-[#6B5A7E]/20">
      <AnimatePresence>
        {cartToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-black/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <div className="w-2 h-2 bg-[#B892FF] rounded-full animate-pulse" />
            <span className="font-medium text-sm whitespace-nowrap">{cartToast.name}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* HEADER TRANSLÚCIDO MINIMALISTA TIPO BRASA URBANA */}
      <header className="fixed top-0 w-full z-40 bg-transparent transition-all duration-300 border-b border-white/5">
        <div className="w-full px-3 sm:px-6 md:px-12 h-24 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Se agrega un margen superior (mt-4 md:mt-6) para bajar un poco el logo y que no se corte arriba */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 mt-4 md:mt-6 ml-1 md:ml-2 flex items-center justify-center drop-shadow-[0_0_25px_rgba(184,146,255,0.8)] z-20">
              <img src={mainLogo} alt="Logo Sahumerio" className="w-full h-full object-contain" />
            </div>
          </div>
          
          {/* Center Nav - Eliminado por solicitud del cliente */}

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4 text-sm font-medium shrink-0">
            <button 
              onClick={toggleAudio}
              className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/20 bg-black/60 hover:bg-black/80 transition-colors group shadow-lg"
              title={isPlaying ? "Pausar música zen" : "Reproducir música zen"}
            >
              <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(184,146,255,0.5)] group-hover:shadow-[0_0_35px_rgba(184,146,255,0.9)] transition-shadow" />
              {isPlaying ? <Volume2 className="w-6 h-6 text-[#B892FF] relative z-10" strokeWidth={2} /> : <VolumeX className="w-6 h-6 text-[#B892FF] relative z-10" strokeWidth={2} />}
            </button>

            <button 
              onClick={() => setIsFavoritesModalOpen(true)}
              className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/20 bg-black/60 hover:bg-black/80 transition-colors group shadow-lg"
              title="Mis Favoritos"
            >
              <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(184,146,255,0.5)] group-hover:shadow-[0_0_35px_rgba(184,146,255,0.9)] transition-shadow" />
              <Heart className="w-6 h-6 text-[#B892FF] relative z-10" strokeWidth={2} fill={favorites.length > 0 ? "#B892FF" : "none"} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#B892FF] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#1A1A1A] z-20">
                  {favorites.length}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/20 bg-black/60 hover:bg-black/80 transition-colors group shadow-lg"
            >
              <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(184,146,255,0.5)] group-hover:shadow-[0_0_35px_rgba(184,146,255,0.9)] transition-shadow" />
              <ShoppingBag className="w-6 h-6 text-[#B892FF] relative z-10" strokeWidth={2} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#B892FF] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#1A1A1A] z-20">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* SECCIÓN INTRO / LANDING ATMOSFÉRICA */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
        {/* Imagen de fondo proporcionada por el usuario */}
        <div className="absolute inset-0 z-0 bg-black">
          <img 
            src={bgImage} 
            alt="Fondo de Sahumerio" 
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
            style={{ objectPosition: 'center' }}
          />
          {/* Overlay oscuro para crear atmósfera y legibilidad, más oscuro en la parte de abajo */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#121212] opacity-95" />
        </div>

        {/* Humo sutil animado subiendo desde el centro */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-[5] overflow-hidden mix-blend-screen opacity-40">
          <motion.div
            animate={{ y: [100, -600], x: [-30, 40, -20], opacity: [0, 0.5, 0], scale: [1, 1.8, 2.5] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-64 h-[400px] bg-white/10 blur-[60px] rounded-full"
          />
          <motion.div
            animate={{ y: [150, -700], x: [20, -50, 30], opacity: [0, 0.4, 0], scale: [0.8, 1.5, 2] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 5 }}
            className="absolute w-72 h-[450px] bg-gray-200/10 blur-[70px] rounded-full"
          />
          <motion.div
            animate={{ y: [50, -500], x: [-10, 20, -30], opacity: [0, 0.3, 0], scale: [1.2, 2, 3] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 10 }}
            className="absolute w-80 h-[500px] bg-white/5 blur-[80px] rounded-full"
          />
        </div>

        {/* Partículas Drifting (Brasas) */}
        <div className="absolute inset-0 pointer-events-none z-10 mix-blend-screen">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                background: i % 3 === 0 
                  ? 'rgba(255, 180, 60, 0.9)' // Brasas doradas intensas
                  : i % 3 === 1 
                    ? 'rgba(255, 100, 50, 0.8)' // Brasas rojizas/naranjas
                    : 'rgba(160, 80, 255, 0.7)', // Destellos violetas místicos
                width: Math.random() * 10 + 3 + 'px',
                height: Math.random() * 10 + 3 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                filter: `blur(${Math.random() * 1.5}px)`,
                boxShadow: i % 3 !== 2 ? '0 0 10px 2px rgba(255, 150, 50, 0.5)' : '0 0 10px 2px rgba(160, 80, 255, 0.5)'
              }}
              animate={{
                y: [0, -Math.random() * 400 - 150],
                x: [0, Math.random() * 300 - 150],
                opacity: [0, Math.random() * 0.7 + 0.3, 0],
                scale: [0, Math.random() * 2.5 + 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 6 + 4,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 4
              }}
            />
          ))}
        </div>

        {/* Contenido Central de la Intro */}
        <div className="relative z-10 text-center px-4 flex flex-col items-center mt-12 w-full max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl mb-4 drop-shadow-2xl font-normal tracking-wide uppercase font-serif flex flex-col items-center"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
          >
            <span className="text-white/90">SAHUMERIO</span>
            <span className="text-[#B892FF] mt-2">SAGRADO</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm md:text-lg text-white/70 font-medium mb-12 drop-shadow-lg flex items-center justify-center gap-3 tracking-[0.2em] md:tracking-[0.4em] uppercase"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
          >
            INCIENSO • CRISTALES • VELAS
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={scrollToCatalog}
            className="group relative px-10 py-4 bg-white text-[#4A4056] font-bold text-lg rounded-full flex items-center gap-3 hover:scale-105 hover:bg-gray-50 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] border border-white/50"
          >
            <span className="relative z-10 tracking-wide">Ver artículos</span> 
            <span className="relative z-10 text-xl font-black leading-none group-hover:translate-x-1 transition-transform">→</span>
          </motion.button>
        </div>

        {/* CONTROLES INFERIORES - Removidos */}
      </section>

      {/* AUDIO ELEMENT */}
      <audio 
        ref={audioRef} 
        loop 
        src={ambientAudio} 
      />

      {/* CATÁLOGO DE PRODUCTOS */}
      <div id="catalogo" className="min-h-screen pt-24 pb-32">
        {/* ── SEARCH BAR */}
        <div className="max-w-5xl mx-auto px-4 mb-4">
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md rounded-2xl px-4 py-3 border border-[#8A799E]/20 shadow-sm transition-all focus-within:bg-white focus-within:shadow-md focus-within:border-[#B892FF]/50">
            <Search size={18} className="text-[#8A799E]" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar aromas, velas o cristales..."
              className="bg-transparent border-none outline-none text-[#4A4056] text-sm w-full placeholder:text-[#8A799E]/70"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="bg-transparent border-none cursor-pointer p-0">
                <X size={18} className="text-[#8A799E]" />
              </button>
            )}
          </div>
        </div>

        {/* ── CATEGORY BAR + GRID PANEL */}
        <div className="max-w-5xl mx-auto mb-8 px-4 relative z-30">
          {/* Scrollable pill row */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 pt-1">
            {/* Grid toggle button */}
            <button
              onClick={() => setIsCategoryOpen(o => !o)}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all border shadow-sm"
              style={{
                border: isCategoryOpen ? '1.5px solid #B892FF' : '1px solid rgba(138, 121, 158, 0.2)',
                background: isCategoryOpen ? 'rgba(184, 146, 255, 0.1)' : '#fff',
                color: isCategoryOpen ? '#B892FF' : '#8A799E',
              }}
              title="Ver todas las categorías y filtros"
            >
              <SlidersHorizontal size={16} />
            </button>

            {/* Favorites toggle button */}
            <button
              onClick={() => setShowOnlyFavorites(prev => !prev)}
              className={`flex-shrink-0 px-4 py-2 h-10 rounded-full text-sm font-medium transition-all duration-300 border shadow-sm flex items-center gap-2 ${
                showOnlyFavorites
                  ? 'bg-[#B892FF] text-white border-[#B892FF] shadow-[0_0_15px_rgba(184,146,255,0.4)]'
                  : 'bg-white text-[#8A799E] border-[#8A799E]/10 hover:bg-[#FDFBF7] hover:text-[#4A4056]'
              }`}
            >
              <Heart size={16} className={showOnlyFavorites ? 'fill-current' : ''} />
              <span className="hidden sm:inline">Ver Favoritos</span>
            </button>

            {/* Pill chips */}
            {SAHUMERIO_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-5 py-2 h-10 rounded-full text-sm font-medium transition-all duration-300 border shadow-sm ${
                  selectedCategory === cat.id
                    ? 'bg-[#B892FF] text-white border-[#B892FF] shadow-[0_0_15px_rgba(184,146,255,0.4)]'
                    : 'bg-white text-[#8A799E] border-[#8A799E]/10 hover:bg-[#FDFBF7] hover:text-[#4A4056]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Collapsible grid panel */}
          <AnimatePresence>
            {isCategoryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="overflow-hidden mt-2 bg-white rounded-2xl shadow-xl border border-[#8A799E]/10"
              >
                <div className="p-5 max-h-[60vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="m-0 text-sm font-bold text-[#4A4056]">Filtros & Explorar</h3>
                    {(selectedCategory !== 'all' || activeBadgeFilter !== null) && (
                      <button 
                        onClick={() => { setSelectedCategory('all'); setActiveBadgeFilter(null); setIsCategoryOpen(false); }}
                        className="bg-transparent border-none text-[#B892FF] text-xs font-bold cursor-pointer"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>

                  <h4 className="m-0 mb-3 text-xs font-bold text-[#8A799E] uppercase tracking-wider">Destacados</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      { id: 'NUEVO', label: 'Nuevo', emoji: '✨' },
                      { id: 'EN OFERTA', label: 'Oferta', emoji: '🌟' },
                      { id: 'MÁS VENDIDO', label: 'Más Vendido', emoji: '⭐' },
                      { id: 'PRÓXIMAMENTE', label: 'Próximamente', emoji: '⏳' },
                    ].map(badge => (
                      <button
                        key={badge.id}
                        onClick={() => {
                          setActiveBadgeFilter(prev => prev === badge.id ? null : badge.id);
                          setIsCategoryOpen(false);
                        }}
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all border"
                        style={{
                          background: activeBadgeFilter === badge.id ? 'rgba(184,146,255,0.15)' : '#FDFBF7',
                          border: activeBadgeFilter === badge.id ? '1px solid #B892FF' : '1px solid rgba(138, 121, 158, 0.2)',
                          color: activeBadgeFilter === badge.id ? '#B892FF' : '#4A4056',
                        }}
                      >
                        <span className="text-sm">{badge.emoji}</span> {badge.label}
                      </button>
                    ))}
                  </div>

                  <h4 className="m-0 mb-3 text-xs font-bold text-[#8A799E] uppercase tracking-wider">Categorías</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {SAHUMERIO_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setIsCategoryOpen(false); }}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all border"
                        style={{
                          border: selectedCategory === cat.id ? '1.5px solid #B892FF' : '1px solid rgba(138, 121, 158, 0.1)',
                          background: selectedCategory === cat.id ? 'rgba(184,146,255,0.1)' : '#FDFBF7',
                        }}
                      >
                        <span className="text-xs font-bold text-center leading-tight" style={{ color: selectedCategory === cat.id ? '#B892FF' : '#4A4056' }}>
                          {cat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LISTA DE PRODUCTOS Y MENSAJE DE BÚSQUEDA */}
        <main className="max-w-5xl mx-auto px-4">
          {(selectedCategory !== 'all' || activeBadgeFilter) && (
            <h2 className="text-[#8A799E] text-xs font-bold uppercase tracking-widest mb-4">
              {activeBadgeFilter ? `${activeBadgeFilter} • ` : ''}
              {selectedCategory !== 'all' ? SAHUMERIO_CATEGORIES.find(c => c.id === selectedCategory)?.name : 'Todas las categorías'} — {filteredProducts.length} resultados
            </h2>
          )}
          
          {filteredProducts.length === 0 ? (
            searchQuery ? (
              <div className="text-center py-16 text-[#8A799E]">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-bold text-lg text-[#4A4056]">No hay resultados para "{searchQuery}"</p>
                <p className="text-sm mt-2">Intenta buscar con otras palabras o limpia los filtros.</p>
              </div>
            ) : (
              <div className="text-center py-16 text-[#8A799E]">
                <div className="text-5xl mb-4">✨</div>
                <p className="font-bold text-lg text-[#4A4056]">Pronto tendremos más artículos en esta sección...</p>
                <p className="text-sm mt-2">¡La magia se está preparando!</p>
              </div>
            )
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                <AnimatePresence mode="popLayout">
                  {displayedProducts.map(product => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedProductDetails(product)}
                  className="bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm border border-[#8A799E]/10 hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden relative m-2 rounded-[1rem] md:rounded-[1.5rem]">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${cart.some(item => item.id === product.id) ? 'opacity-90' : ''}`}
                    />
                    {cart.some(item => item.id === product.id) && (
                      <div className="absolute inset-0 bg-[#B892FF]/40 flex items-center justify-center z-[5] pointer-events-none transition-all duration-300">
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-12 h-12 md:w-14 md:h-14 bg-[#B892FF] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(184,146,255,0.6)]"
                        >
                          <Check className="text-white w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
                        </motion.div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                      <button 
                        onClick={(e) => toggleFavorite(e, product.id)}
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#B892FF] hover:border-[#B892FF] transition-all shadow-md group/fav"
                        title="Agregar a favoritos"
                      >
                        <Heart size={14} fill={favorites.includes(product.id) ? "white" : "none"} className={favorites.includes(product.id) ? "text-white" : "text-white group-hover/fav:text-white md:w-4 md:h-4"} />
                      </button>
                      <button 
                        onClick={(e) => shareProduct(e, product)}
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#B892FF] hover:border-[#B892FF] transition-all shadow-md group/share"
                        title="Compartir"
                      >
                        <Share2 size={14} className="text-white group-hover/share:text-white md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 flex flex-col flex-1">
                    <h3 className="font-serif font-medium text-base md:text-lg mb-1 md:mb-2 text-[#4A4056] leading-tight">{product.name}</h3>
                    <p className="text-xs md:text-sm text-[#8A799E] mb-4 md:mb-6 line-clamp-2 font-light flex-1">{product.description}</p>
                    <div className="flex flex-col mt-auto gap-2 md:gap-3">
                      <span className="text-lg md:text-xl font-bold text-[#4A4056]">${product.price}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-full py-2 text-xs md:text-sm md:py-2.5 rounded-full bg-[#B892FF] text-white font-medium hover:bg-[#A37DE6] transition-colors flex items-center justify-center gap-1 md:gap-2 shadow-sm"
                      >
                        <ShoppingBag size={14} className="md:w-[18px] md:h-[18px]" />
                        <span className="hidden sm:inline">Agregar al Carrito</span>
                        <span className="sm:hidden">Agregar</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {visibleCount < filteredProducts.length && (
                <div className="mt-12 mb-8 flex justify-center w-full">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 10)}
                    className="px-10 py-4 bg-[#B892FF] text-white font-bold text-lg rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(184,146,255,0.4)] hover:shadow-[0_0_35px_rgba(184,146,255,0.6)] hover:bg-[#A37DE6] hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Ver más productos</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-black/90 pt-16 pb-8 border-t border-white/10 mt-auto w-full relative z-30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Columna 1 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center p-1 drop-shadow-[0_0_15px_rgba(184,146,255,0.4)]">
                <img src={mainLogo} alt="Logo Sahumerio" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-serif font-medium text-lg uppercase tracking-wider leading-tight">
                Sahumerio<br/><span className="text-[#B892FF]">Sagrado</span>
              </span>
            </div>
            <p className="text-white/60 text-sm font-light leading-relaxed">
              Tu destino definitivo para inciensos, cristales, velas, decoración y elementos para purificar tu energía en México.
            </p>
            <div>
              <p className="text-[#B892FF] text-xs font-bold tracking-widest uppercase mb-4">Síguenos en Redes</p>
              <div className="flex gap-3">
                <a href="#" className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-[#B892FF] hover:bg-white/10 rounded-full px-4 py-2 transition-all group">
                  <svg width="18" height="18" fill="currentColor" className="text-white group-hover:text-[#B892FF] transition-colors" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span className="text-sm font-medium text-white group-hover:text-[#B892FF] transition-colors">Sahumerio Oficial</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#B892FF] hover:bg-white/10 flex items-center justify-center group transition-all">
                  <svg width="18" height="18" fill="currentColor" className="text-white group-hover:text-[#B892FF] transition-colors" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Columna 2 */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-bold tracking-widest text-sm uppercase">Contacto</h3>
            <ul className="space-y-4 text-sm text-white/70 font-light">
              <li>
                <a href="https://wa.me/525549893248?text=%C2%A1Hola!%20Vengo%20de%20la%20p%C3%A1gina%20web%20de%20Sahumerio%20Sagrado%20y%20me%20gustar%C3%ADa%20pedir%20informaci%C3%B3n." target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <span className="text-[#25D366] group-hover:scale-110 transition-transform"><MessageCircle size={18} /></span>
                  <span>WhatsApp Pedidos: 55 4989 3248</span>
                </a>
              </li>
              <li>
                <a href="tel:+525556336232" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <span className="text-[#B892FF] group-hover:scale-110 transition-transform"><Phone size={18} /></span>
                  <span>55 5633 6232</span>
                </a>
              </li>
              <li>
                <a href="mailto:ventas@sahumeriosagrado.com" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <span className="text-[#B892FF] group-hover:scale-110 transition-transform"><Mail size={18} /></span>
                  <span>ventas@sahumeriosagrado.com</span>
                </a>
              </li>
            </ul>
            <button className="mt-2 w-full md:w-auto px-6 py-3 border border-[#B892FF]/50 text-[#B892FF] rounded-full hover:bg-[#B892FF]/10 transition-colors flex items-center justify-center gap-2 font-medium text-sm">
              <QrCode size={18} />
              Compartir Catálogo por QR
            </button>
          </div>

          {/* Columna 3 */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-bold tracking-widest text-sm uppercase">Ubicación y Horarios</h3>
            <ul className="space-y-4 text-sm text-white/70 font-light">
              <li>
                <a href="https://maps.google.com/?q=Guillermo+Prieto+185,+Col.+Benito+Juarez,+Del.+Iztacalco,+08930,+Ciudad+de+Mexico" target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-white transition-colors group">
                  <span className="text-[#B892FF] shrink-0 mt-0.5 group-hover:scale-110 transition-transform"><MapPin size={18} /></span>
                  <span className="leading-relaxed">Guillermo Prieto #185, Col. Benito Juárez,<br/>Del. Iztacalco, C.P. 08930,<br/>Ciudad de México</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-[#B892FF] font-medium mt-2">
                <Clock size={18} />
                <span>Lun – Dom: 10:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 mt-8 flex flex-col items-center justify-center gap-3 text-center px-6">
          <p className="text-white/40 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
            © 2026 SAHUMERIO SAGRADO. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <p className="text-white/40 text-[10px] sm:text-xs font-light">
            Página web realizada por <span className="text-[#B892FF] font-bold">IMAGINE & STAMP</span>. <a href="#" className="underline hover:text-white/80 ml-2">Aviso de Privacidad y Términos de Servicio</a>
          </p>
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="mt-4 p-2 text-white/10 hover:text-white/30 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </button>
        </div>
      </footer>

      {/* Modal de Opiniones */}
      <AnimatePresence>
        {isReviewOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FDFBF7] rounded-[2rem] p-5 sm:p-6 max-w-md w-full shadow-2xl relative border border-[#B892FF]/20 h-[92vh] max-h-[850px] overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <button
                onClick={() => setIsReviewOpen(false)}
                className="absolute top-3 right-3 p-2 text-[#8A799E] hover:bg-[#B892FF]/10 rounded-full transition-colors z-10"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-3 shrink-0 mt-1">
                <h3 className="text-lg font-bold text-[#4A4056] font-serif">Cuéntanos tu experiencia</h3>
                <div className="flex gap-1.5 justify-center py-1 mt-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(p => ({...p, rating: star}))}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={24} 
                        className={reviewForm.rating >= star ? "text-[#B892FF]" : "text-[#8A799E]/30"} 
                        fill={reviewForm.rating >= star ? "#B892FF" : "none"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {reviewSuccess ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-6 bg-white border border-[#8A799E]/20 rounded-2xl shadow-sm"
                >
                  <div className="text-4xl mb-3">✨</div>
                  <h4 className="text-base font-bold text-[#4A4056] mb-1">¡Gracias por tu magia!</h4>
                  <p className="text-xs text-[#8A799E]">Tu opinión ha sido enviada y será publicada pronto.</p>
                </motion.div>
              ) : (
                <form onSubmit={submitReview} className="space-y-3 shrink-0 bg-white p-4 rounded-xl border border-[#8A799E]/20 shadow-sm">
                  <div>
                    <input
                      required
                      type="text"
                      value={reviewForm.name}
                      onChange={e => setReviewForm(p => ({...p, name: e.target.value}))}
                      className="w-full bg-[#FDFBF7] border border-[#8A799E]/20 rounded-xl px-3 py-2.5 text-[13px] text-[#4A4056] focus:outline-none focus:border-[#B892FF] transition-all placeholder:text-[#8A799E]/60"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <textarea
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(p => ({...p, comment: e.target.value}))}
                      className="w-full bg-[#FDFBF7] border border-[#8A799E]/20 rounded-xl px-3 py-2.5 text-[13px] text-[#4A4056] focus:outline-none focus:border-[#B892FF] transition-all resize-none h-16 placeholder:text-[#8A799E]/60"
                      placeholder="Comparte tu experiencia (opcional)"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-2.5 bg-[#B892FF] text-white rounded-xl font-bold text-[13px] tracking-wide hover:bg-[#A37DE6] transition-colors shadow-md disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Enviando...' : 'ENVIAR OPINIÓN'}
                  </button>
                  <p className="text-[9px] text-center text-[#8A799E] mt-1.5">Tu opinión será revisada antes de publicarse.</p>
                </form>
              )}

              {/* Espaciador flexible para distribuir altura */}
              <div className="flex-1 min-h-[1.5rem]"></div>

              {/* OPINIONES DE NUESTROS CLIENTES */}
              <div className="mt-5 shrink-0">
                <div className="text-center mb-4">
                  <h4 className="font-bold text-[#4A4056] text-[11px] uppercase tracking-wider">OPINIONES DE NUESTROS CLIENTES</h4>
                  <p className="text-[10px] text-[#8A799E] mt-0.5 font-medium">Lo que dicen quienes ya vivieron la magia ✨</p>
                </div>

                <div className="bg-white border border-[#8A799E]/20 rounded-xl p-3 sm:p-4 mb-4 shadow-sm flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-black text-[#B892FF]">4.8</span>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={10} className="text-[#B892FF]" fill="#B892FF" />
                      ))}
                    </div>
                    <span className="text-[9px] text-[#8A799E] mt-1 font-bold">6 opiniones</span>
                  </div>
                  
                  <div className="flex-1 ml-4 space-y-1">
                    {[
                      { s: 5, w: '80%', c: '5' },
                      { s: 4, w: '15%', c: '1' },
                      { s: 3, w: '0%', c: '0' },
                      { s: 2, w: '0%', c: '0' },
                      { s: 1, w: '0%', c: '0' }
                    ].map(row => (
                      <div key={row.s} className="flex items-center text-[9px] font-bold text-[#8A799E] gap-1.5">
                        <span className="w-2.5 text-right">{row.s}</span>
                        <Star size={7} className="text-[#B892FF]" fill="#B892FF" />
                        <div className="flex-1 h-1.5 bg-[#FDFBF7] rounded-full overflow-hidden">
                          <div className="h-full bg-[#B892FF] rounded-full" style={{ width: row.w }}></div>
                        </div>
                        <span className="w-2.5 text-right">{row.c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Horizontal scroll cards */}
                <div className="flex overflow-x-auto gap-3 pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {[
                    { name: 'Daniel Olvera', text: 'Excelente calidad en los sahumerios, me encantó el aroma y el empaque. ¡Recomendado ampliamente y volveré a comprar!', stars: 5, initial: 'D' },
                    { name: 'Carlos M.', text: '¡Excelente calidad! El sahumerio es idéntico al de las fotos. El material es de primera y el aroma dura muchísimo en el ambiente.', stars: 5, initial: 'C' }
                  ].map((review, i) => (
                    <div key={i} className="min-w-[200px] max-w-[200px] bg-white border border-[#8A799E]/20 rounded-xl p-3 shadow-sm snap-start flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-[#B892FF] text-white flex items-center justify-center text-[10px] font-bold">
                            {review.initial}
                          </div>
                          <span className="text-[10px] font-bold text-[#4A4056]">{review.name}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} size={8} className="text-[#B892FF]" fill="#B892FF" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-[#4A4056] font-medium leading-tight line-clamp-4">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="text-center pb-1">
                  <span className="text-[9px] text-[#8A799E] font-medium">← desliza para ver más →</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Favoritos Modal */}
      <AnimatePresence>
        {isFavoritesModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-[#1A1A1A] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/5 bg-gradient-to-r from-[#B892FF]/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#B892FF]/20 flex items-center justify-center text-[#B892FF]">
                    <Heart size={20} fill="#B892FF" />
                  </div>
                  <h2 className="text-base font-black text-white uppercase tracking-widest">Mis Favoritos</h2>
                </div>
                <button 
                  onClick={() => setIsFavoritesModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
                {favorites.length === 0 ? (
                  <div className="text-center py-10 flex flex-col items-center">
                    <Heart size={48} className="text-white/10 mb-3" />
                    <p className="text-gray-400 text-sm font-medium">Aún no tienes favoritos guardados.</p>
                    <p className="text-xs text-gray-500 mt-1">¡Explora nuestra magia y guarda tus preferidos!</p>
                  </div>
                ) : (
                  SAHUMERIO_PRODUCTS.filter(p => favorites.includes(p.id)).map(product => (
                    <div key={product.id} className="flex items-center gap-3 p-3 bg-[#222] border border-[#333] rounded-2xl group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-black">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-bold truncate">{product.name}</h4>
                        <p className="text-[#B892FF] text-xs font-black mt-1">${product.price} MXN</p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => addToCart(product)}
                          className="w-8 h-8 rounded-full bg-[#B892FF] flex items-center justify-center text-white hover:bg-[#A37AE6] transition-colors shadow-lg shadow-[#B892FF]/30"
                          title="Agregar al carrito"
                        >
                          <ShoppingBag size={14} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={(e) => toggleFavorite(e, product.id)}
                          className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          title="Eliminar de favoritos"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Carrito Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-[#4A4056]/30 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#8A799E]/10 bg-white">
                <h2 className="text-xl font-serif font-medium text-[#4A4056]">
                  Tu Selección
                </h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-[#8A799E] hover:bg-[#FDFBF7] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[#8A799E] space-y-4">
                    <Moon size={48} className="text-[#8A799E]/20" />
                    <p className="text-lg font-serif">Tu espacio está vacío</p>
                    <p className="text-sm font-light">Explora nuestro catálogo para encontrar armonía.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 px-6 py-2 bg-white border border-[#8A799E]/20 text-[#6B5A7E] rounded-full font-medium hover:bg-[#FDFBF7] transition-all"
                    >
                      Ver artículos
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-[#8A799E]/10 rounded-2xl shadow-sm">
                        <div className="flex-1">
                          <h4 className="font-medium text-[#4A4056]">{item.name}</h4>
                          <p className="text-sm font-medium text-[#8A799E]">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4 bg-[#FDFBF7] border border-[#8A799E]/10 rounded-full p-1">
                          <button 
                            onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeFromCart(item.id)}
                            className="w-8 h-8 flex items-center justify-center text-[#8A799E] hover:bg-white rounded-full transition-colors shadow-sm"
                          >
                            {item.quantity > 1 ? <Minus size={14} /> : <X size={14} />}
                          </button>
                          <span className="w-4 text-center text-sm font-medium text-[#4A4056]">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#8A799E] hover:bg-white rounded-full transition-colors shadow-sm"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-[#8A799E]/10 bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[#8A799E] font-medium">Total Estimado</span>
                    <span className="text-2xl font-medium text-[#4A4056]">${totalPrice} MXN</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-4 bg-[#6B5A7E] text-white rounded-xl font-medium text-lg hover:bg-[#5A4B6B] transition-colors shadow-md shadow-[#6B5A7E]/20"
                  >
                    Continuar Pedido
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Modal (Estilo Mundo Halloween) */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#B892FF]/30 max-h-[90vh]"
            >
              <div className="p-4 bg-[#222] border-b border-[#333] flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag size={24} className="text-[#B892FF]" />
                  Confirmar
                </h3>
                <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#1A1A1A] [&::-webkit-scrollbar-thumb]:bg-[#333]">
                {/* Resumen del Pedido */}
                <div>
                  <h4 className="text-[#B892FF] font-bold mb-3 uppercase text-sm tracking-wider">Resumen del Pedido</h4>
                  <div className="bg-[#222] rounded-xl p-4 space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-gray-300 text-sm">
                        <span>{item.name} <span className="text-gray-500 text-xs">x{item.quantity}</span></span>
                        <span className="font-medium">${item.price * item.quantity} MXN</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-[#333] flex justify-between text-white font-bold">
                      <span>Subtotal</span>
                      <span>${totalPrice} MXN</span>
                    </div>
                  </div>
                </div>

                {/* Datos de Entrega */}
                <div>
                  <h4 className="text-[#B892FF] font-bold mb-3 uppercase text-sm tracking-wider">Datos de Entrega</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo *</label>
                      <input 
                        type="text" 
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#B892FF] text-white"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono WhatsApp *</label>
                      <input 
                        type="tel" 
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#B892FF] text-white"
                        placeholder="Ej. 5512345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Método de Envío *</label>
                      <select 
                        value={customerInfo.shippingMethod}
                        onChange={e => setCustomerInfo(p => ({ ...p, shippingMethod: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#B892FF] text-white appearance-none"
                      >
                        <option value="Selecciona una opción" disabled>Selecciona una opción</option>
                        <option value="Envío a domicilio">🏠 Envío a domicilio</option>
                        <option value="Recoger en tienda">🏪 Recoger en tienda</option>
                        <option value="Entrega digital">💻 Entrega digital</option>
                        <option value="Por confirmar">⏳ Por confirmar</option>
                      </select>
                    </div>

                    {customerInfo.shippingMethod === 'Envío a domicilio' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Dirección de Envío *</label>
                        <textarea 
                          value={customerInfo.address}
                          onChange={e => setCustomerInfo(p => ({ ...p, address: e.target.value }))}
                          className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#B892FF] text-white resize-none"
                          rows={2}
                          placeholder="Calle, Número, Colonia, C.P., Ciudad"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Forma de Pago *</label>
                      <select 
                        value={customerInfo.paymentMethod}
                        onChange={e => setCustomerInfo(p => ({ ...p, paymentMethod: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#B892FF] text-white appearance-none"
                      >
                        <option value="Selecciona una opción" disabled>Selecciona una opción</option>
                        <option value="Efectivo">💵 Efectivo</option>
                        <option value="Transferencia">🏦 Transferencia</option>
                        <option value="Tarjeta">💳 Tarjeta</option>
                        <option value="Por confirmar">⏳ Por Confirmar</option>
                        <option value="Mercado Pago">💳 Mercado Pago (Tarjetas)</option>
                      </select>
                    </div>

                    {/* ── Datos bancarios para transferencia ── */}
                    <AnimatePresence>
                      {customerInfo.paymentMethod === 'Transferencia' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-2"
                        >
                          <div className="bg-[#2A2A2A] border border-[#B892FF]/20 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-[#B892FF]/20 flex items-center justify-center text-[#B892FF] shrink-0">
                                <Landmark size={16} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-[#B892FF] uppercase tracking-widest leading-none">Datos para transferencia</p>
                                <p className="text-[9px] font-medium text-gray-400 mt-0.5">Realiza tu pago y envía el comprobante por WhatsApp</p>
                              </div>
                            </div>

                            {(() => {
                              const rows = [
                                { label: 'Banco', value: bankInfo?.bank_name, field: 'bank_name' },
                                { label: 'Titular', value: bankInfo?.account_holder, field: 'account_holder' },
                                { label: 'CLABE', value: bankInfo?.clabe, field: 'clabe' },
                                { label: 'No. de Cuenta', value: bankInfo?.account_number, field: 'account_number' },
                                { label: 'No. de Tarjeta', value: bankInfo?.card_number, field: 'card_number' },
                              ].filter(r => r.value && String(r.value).trim() !== '');

                              if (rows.length === 0) {
                                return (
                                  <p className="text-xs text-gray-400 italic py-2">
                                    Los datos bancarios se mostrarán aquí. Escríbenos por WhatsApp para coordinar tu pago.
                                  </p>
                                );
                              }

                              return (
                                <div className="space-y-2">
                                  {rows.map(row => (
                                    <div key={row.field} className="flex items-center justify-between gap-2 bg-[#222] rounded-xl px-3 py-2 border border-[#333]">
                                      <div className="min-w-0">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{row.label}</p>
                                        <p className="text-sm font-bold text-gray-200 truncate">{row.value}</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => copyToClipboard(String(row.value), row.field)}
                                        title="Copiar"
                                        className="shrink-0 w-8 h-8 rounded-lg bg-[#B892FF]/10 flex items-center justify-center text-[#B892FF] hover:bg-[#B892FF] hover:text-white transition-all"
                                      >
                                        {copiedField === row.field ? <Check size={14} /> : <Copy size={14} />}
                                      </button>
                                    </div>
                                  ))}
                                  {bankInfo?.instructions && String(bankInfo.instructions).trim() !== '' && (
                                    <p className="text-[10px] text-gray-400 leading-relaxed bg-[#222] rounded-xl px-3 py-2 border border-[#333] whitespace-pre-line">
                                      {bankInfo.instructions}
                                    </p>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Notas Adicionales (Opcional)</label>
                      <textarea 
                        value={customerInfo.notes}
                        onChange={e => setCustomerInfo(p => ({ ...p, notes: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#B892FF] text-white resize-none"
                        rows={2}
                        placeholder="Ej. Dejar con el guardia, es para regalo..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#222] border-t border-[#333]">
                <div className="pt-4 mt-6">
                    <button 
                      onClick={() => {
                        setIsCheckoutOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="w-full text-center text-gray-400 text-xs font-bold hover:text-white transition-colors mb-6 uppercase flex items-center justify-center gap-1 tracking-wider"
                    >
                      ← VOLVER AL CARRITO
                    </button>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-300 font-medium">
                        <span>Subtotal</span>
                        <span>${totalPrice} MXN</span>
                      </div>
                      {customerInfo.shippingMethod === 'Envío a domicilio' && (
                        <div className="flex justify-between text-[#B892FF] text-sm font-medium border-b border-[#333] pb-3">
                          <span>Costo de envío</span>
                          <span>+$150.00 MXN</span>
                        </div>
                      )}
                      <div className="flex justify-between text-white text-lg font-bold pt-2">
                        <span>Total a pagar</span>
                        <span className="text-white text-xl">${totalPrice + (customerInfo.shippingMethod === 'Envío a domicilio' ? 150 : 0)} <span className="text-sm font-normal text-gray-400">MXN</span></span>
                      </div>
                    </div>

                    {customerInfo.paymentMethod === 'Mercado Pago' && (
                      <div className="bg-[#009EE3]/10 border border-[#009EE3]/20 rounded-xl p-3 mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#009EE3] flex items-center justify-center text-white shrink-0">
                          <CreditCard size={16} />
                        </div>
                        <p className="text-xs font-medium text-gray-300 leading-relaxed">
                          Al confirmar, te llevaremos a la pantalla segura de <strong className="text-[#009EE3]">Mercado Pago</strong> para pagar con tarjeta.
                        </p>
                      </div>
                    )}
                    {customerInfo.paymentMethod === 'Mercado Pago' ? (
                      <button 
                        onClick={handleMercadoPagoCheckout}
                        disabled={
                          !customerInfo.name || 
                          !customerInfo.phone || 
                          customerInfo.shippingMethod === 'Selecciona una opción' || 
                          (customerInfo.shippingMethod === 'Envío a domicilio' && !customerInfo.address) ||
                          mpLoading
                        }
                        className="w-full py-4 bg-[#009EE3] text-white rounded-xl font-extrabold text-lg hover:bg-[#008FCC] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,158,227,0.3)]"
                      >
                        <CreditCard size={22} className="text-white" />
                        {mpLoading ? 'Redirigiendo...' : 'Pagar con Tarjeta'}
                      </button>
                    ) : (
                      <button 
                        onClick={handleCheckout}
                        disabled={
                          !customerInfo.name || 
                          !customerInfo.phone || 
                          customerInfo.shippingMethod === 'Selecciona una opción' || 
                          (customerInfo.shippingMethod === 'Envío a domicilio' && !customerInfo.address) ||
                          customerInfo.paymentMethod === 'Selecciona una opción'
                        }
                        className="w-full py-4 bg-[#1EBE5D] text-white rounded-xl font-extrabold text-lg hover:bg-[#179B4A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(30,190,93,0.3)]"
                      >
                        <MessageCircle size={22} className="fill-white" />
                        Finalizar Pedido vía WhatsApp
                      </button>
                    )}
                  </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* MODAL DETALLES DEL PRODUCTO */}
      <AnimatePresence>
        {selectedProductDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProductDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#1A1A1A',
                borderRadius: '24px', overflow: 'hidden',
                maxWidth: '500px', width: '100%',
                maxHeight: '90vh', display: 'flex', flexDirection: 'column',
                position: 'relative'
              }}
            >
              {/* Top Image Section */}
              <div style={{ position: 'relative', height: '350px', flexShrink: 0, backgroundColor: '#000' }}>
                <img src={selectedProductDetails.image} alt={selectedProductDetails.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(26,26,26,1) 0%, rgba(26,26,26,0) 50%)',
                  pointerEvents: 'none'
                }} />
                <button onClick={() => setSelectedProductDetails(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
                  <X size={18} color="#fff" />
                </button>
              </div>

              {/* Content Section */}
              <div style={{ padding: '20px 20px 40px', overflowY: 'auto' }}>
                 {/* Title and Buttons */}
                 <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', margin: '0 0 8px' }}>
                   <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '24px', margin: 0, flex: 1, fontFamily: 'Georgia, serif' }}>{selectedProductDetails.name}</h2>
                   <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginTop: '2px' }}>
                     <button
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '50%', width: '30px', height: '30px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'all 0.2s ease',
                        }}
                     ><Heart size={15} fill="none" color="rgba(255,255,255,0.7)" /></button>
                     <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: selectedProductDetails.name, text: selectedProductDetails.description, url: window.location.href })
                              .catch(console.error);
                          }
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '50%', width: '30px', height: '30px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'all 0.2s ease',
                        }}
                     ><Share2 size={14} color="rgba(255,255,255,0.7)" /></button>
                   </div>
                 </div>
                 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 16px' }}>{selectedProductDetails.description}</p>
                 
                 {/* Stats Row */}
                 <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '12px 16px', marginBottom: '24px' }}>
                    {/* Rating */}
                    <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '18px', lineHeight: 1 }}>⭐</span>
                        <span style={{ color: '#FFB300', fontWeight: 900, fontSize: '20px' }}>4.8</span>
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 600 }}>Rating</div>
                    </div>

                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />

                    {/* Badge */}
                    <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      {selectedProductDetails.badge ? (
                        <span style={{ background: 'rgba(184,146,255,0.15)', color: '#B892FF', border: '1px solid rgba(184,146,255,0.3)', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          ✨ {selectedProductDetails.badge}
                        </span>
                      ) : (
                         <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 600 }}>Normal</span>
                      )}
                    </div>

                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />

                    {/* Price */}
                    <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
                        <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '20px', lineHeight: 1.2 }}>${selectedProductDetails.price}</div>
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>MXN</div>
                    </div>
                 </div>

                 {/* Static Size Info */}
                 <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '12px 16px' }}>
                   <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0, fontWeight: 700 }}>
                     Categoría: <span style={{ color: '#B892FF' }}>{SAHUMERIO_CATEGORIES.find(c => c.id === selectedProductDetails.category)?.name || selectedProductDetails.category}</span>
                   </p>
                 </div>

                 {/* Action Button */}
                 <div style={{ display: 'flex', gap: '8px' }}>
                   <button 
                     onClick={() => {
                        addToCart(selectedProductDetails);
                        setSelectedProductDetails(null);
                     }} 
                     style={{ flex: 1, background: '#B892FF', border: 'none', borderRadius: '14px', padding: '16px', color: '#fff', fontWeight: 900, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(184,146,255,0.4)', cursor: 'pointer' }}
                   >
                     <Plus size={20} />
                     Agregar al pedido — ${selectedProductDetails.price} MXN
                   </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ADMIN PANEL (premium, gestión en vivo del catálogo) ───────── */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 80, background: '#0a0a0a', overflowY: 'auto' }}
          >
            <AdminSahumerio
              products={menuItems}
              onUpdate={updateItem}
              onAdd={addItem}
              onDelete={deleteItem}
              onClose={() => setIsAdminOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {addedToCartItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 pointer-events-auto"
            onClick={() => setAddedToCartItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111111] rounded-3xl p-4 md:p-5 max-w-[340px] w-full flex flex-col gap-4 relative shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-[#888888]">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 3h2.5l3.5 12h10l2.5-9h-15" />
                    <circle cx="10" cy="19" r="1.5" />
                    <circle cx="17" cy="19" r="1.5" />
                    <path d="M8 9h11" />
                    <path d="M9 12h9.5" />
                    <path d="M11 6v9" />
                    <path d="M14 6v9" />
                  </svg>
                  <span className="text-[13px] md:text-[14px] font-black tracking-widest uppercase mt-1">
                    ¡Producto Agregado!
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-[46px] h-[46px] shrink-0 bg-[#B892FF] rounded-full flex items-center justify-center text-white shadow-lg">
                    <Plus size={28} strokeWidth={3} />
                  </div>
                  <span className="text-white font-bold text-[18px] md:text-[22px] leading-tight line-clamp-2">
                    {addedToCartItem.name}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => {
                    setAddedToCartItem(null);
                    setIsCartOpen(true);
                    setCartStep('cart');
                  }}
                  className="flex-1 bg-[#B892FF] text-white py-2.5 rounded-full font-black text-[10px] uppercase tracking-wider hover:bg-[#A174E8] transition-colors shadow-md"
                >
                  Ver Carrito
                </button>
                <button
                  onClick={() => setAddedToCartItem(null)}
                  className="flex-1 bg-[#222] border border-white/5 text-white py-2.5 rounded-full font-black text-[10px] uppercase tracking-wider hover:bg-[#333] transition-colors shadow-md"
                >
                  Seguir Comprando
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING BUTTONS ── */}
      {/* ── FLOATING BUTTONS ── */}
      <>
        {/* ── FLOATING CART BUTTON ── */}
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => setIsCartOpen(true)}
              style={{ pointerEvents: 'auto' }}
              className="fixed bottom-[90px] right-4 md:right-8 z-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div style={{
                background: '#B892FF',
                boxShadow: '0 8px 32px rgba(184, 146, 255, 0.8), 0 0 24px rgba(184, 146, 255, 0.6)',
                borderRadius: '100px',
                padding: '10px 20px 10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#fff',
                cursor: 'pointer',
              }}>
                <ShoppingBag size={26} strokeWidth={2.5} color="#fff" />
                
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '2px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.05em', lineHeight: 1.2, color: '#fff' }}>MI PEDIDO</span>
                  <span style={{ fontSize: '18px', fontWeight: 900, lineHeight: 1 }}>${totalPrice.toLocaleString()}</span>
                </div>

                <div style={{
                  background: '#fff',
                  color: '#B892FF',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '13px',
                  marginLeft: '8px',
                }}>
                  {totalItems}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón flotante para Opiniones */}
        <button
          onClick={() => setIsReviewOpen(true)}
          className="fixed bottom-4 right-4 md:right-6 pointer-events-auto z-40 flex items-center justify-center w-[64px] h-[64px] rounded-full bg-[#FDFBF7] shadow-[0_0_20px_rgba(184,146,255,0.4)] hover:scale-105 transition-transform duration-300 group cursor-pointer border border-[#B892FF]/30"
          title="Déjanos tu opinión"
        >
          {/* Texto circular rotando */}
          <div className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#8A799E] fill-current">
              <path id="circlePath" d="M 50, 50 m -26, 0 a 26,26 0 1,1 52,0 a 26,26 0 1,1 -52,0" fill="none" />
              <text className="text-[10px] font-bold tracking-[0.3em] uppercase">
                <textPath href="#circlePath" startOffset="0%">
                  O P I N A • O P I N A • O P I N A • 
                </textPath>
              </text>
            </svg>
          </div>
          
          {/* Centro sahumerio con estrella */}
          <div className="relative z-10 w-8 h-8 bg-[#B892FF] rounded-full flex items-center justify-center shadow-inner group-hover:bg-[#A37DE6] transition-colors border-2 border-white">
            <Star className="w-3.5 h-3.5 text-white" fill="white" strokeWidth={2.5} />
          </div>
        </button>
      </>

    </div>
  );
}
