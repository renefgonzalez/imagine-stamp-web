import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Plus, Minus, X, MapPin, Sparkles, Heart, Share2,
  MessageCircle, Moon, Star, ArrowLeft, Volume2, VolumeX, ChevronDown,
  Globe, Search, Menu, ZoomIn, ZoomOut, Phone, Mail, QrCode, Clock
} from 'lucide-react';
import { SAHUMERIO_CATEGORIES, SAHUMERIO_PRODUCTS } from '../constants';
import bgImage from '../assets/sahumerio-bg.jpg';
import ambientAudio from '../sahumerio-sagrado.mp3';
import mainLogo from '../../../logo.png';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function SahumerioCatalog() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'cart' | 'details'>('cart');
  const [selectedProductDetails, setSelectedProductDetails] = useState<any>(null);
  
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
    paymentMethod: 'Efectivo',
    notes: '',
    locationLink: ''
  });

  const [gettingLocation, setGettingLocation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.03; // Más bajito, muy de fondo
      // Intentar reproducir automáticamente
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.log('El navegador bloqueó el autoplay:', e);
        });
      }
    }
  }, []);

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
    if (selectedCategory === 'all') return SAHUMERIO_PRODUCTS;
    return SAHUMERIO_PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
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

  const handleCheckout = () => {
    const phoneNumber = '525650469993';
    const cartText = cart.map(item => `✨ ${item.name} x${item.quantity} = $${item.price * item.quantity} MXN`).join('\n');
    
    const message = 
      `¡Hola! Me gustaría hacer un pedido místico 🌙\n\n` +
      `*Mi Pedido:*\n${cartText}\n\n` +
      `*Total:* $${totalPrice} MXN\n\n` +
      `*Datos de Entrega:*\n` +
      `👤 Nombre: ${customerInfo.name}\n` +
      `📱 Teléfono: ${customerInfo.phone}\n` +
      `📍 Dirección: ${customerInfo.address}\n` +
      (customerInfo.locationLink ? `🗺️ Mapa: ${customerInfo.locationLink}\n` : '') +
      `💳 Pago: ${customerInfo.paymentMethod}\n` +
      (customerInfo.notes ? `📝 Notas/Intenciones: ${customerInfo.notes}` : '');

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-[#FDFBF7] font-sans text-[#4A4056] relative scroll-smooth selection:bg-[#6B5A7E]/20">
      
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
          <div className="flex items-center gap-2 md:gap-4 text-sm font-medium shrink-0">
            <button 
              onClick={toggleAudio}
              className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-black/60 hover:bg-black/80 transition-colors group shadow-lg"
              title={isPlaying ? "Pausar música zen" : "Reproducir música zen"}
            >
              <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(184,146,255,0.5)] group-hover:shadow-[0_0_35px_rgba(184,146,255,0.9)] transition-shadow" />
              {isPlaying ? <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-[#B892FF] relative z-10" strokeWidth={2} /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-[#B892FF] relative z-10" strokeWidth={2} />}
            </button>

            <button 
              onClick={() => {
                if(favorites.length > 0) {
                  const favItems = SAHUMERIO_PRODUCTS.filter(p => favorites.includes(p.id)).map(p => p.name).join(', ');
                  alert('Tus favoritos:\n' + favItems);
                } else {
                  alert('Aún no tienes favoritos.');
                }
              }}
              className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-black/60 hover:bg-black/80 transition-colors group shadow-lg"
              title="Mis Favoritos"
            >
              <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(184,146,255,0.5)] group-hover:shadow-[0_0_35px_rgba(184,146,255,0.9)] transition-shadow" />
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#B892FF] relative z-10" strokeWidth={2} fill={favorites.length > 0 ? "#B892FF" : "none"} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-[#B892FF] text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#1A1A1A] z-20">
                  {favorites.length}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-black/60 hover:bg-black/80 transition-colors group shadow-lg"
            >
              <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(184,146,255,0.5)] group-hover:shadow-[0_0_35px_rgba(184,146,255,0.9)] transition-shadow" />
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-[#B892FF] relative z-10" strokeWidth={2} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-[#B892FF] text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#1A1A1A] z-20">
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
        {/* CATEGORÍAS */}
        <section className="max-w-5xl mx-auto px-4 mb-16">
          <div className="flex justify-center">
            <div className="inline-flex gap-2 p-1.5 bg-white rounded-full shadow-sm border border-[#8A799E]/10 overflow-x-auto hide-scrollbar max-w-full">
              {SAHUMERIO_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat.id 
                      ? 'bg-[#6B5A7E] text-white shadow-md' 
                      : 'bg-transparent text-[#8A799E] hover:text-[#4A4056] hover:bg-[#FDFBF7]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* LISTA DE PRODUCTOS */}
        <main className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => (
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
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
              <li className="flex items-center gap-3">
                <span className="text-[#25D366]"><MessageCircle size={18} /></span>
                <span>WhatsApp Pedidos: 55 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#B892FF]"><Phone size={18} /></span>
                <span>55 8765 4321</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#B892FF]"><Mail size={18} /></span>
                <span>hola@sahumeriosagrado.com</span>
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
              <li className="flex gap-3">
                <span className="text-[#B892FF] shrink-0 mt-0.5"><MapPin size={18} /></span>
                <span className="leading-relaxed">Ignacio Allende 45, Del Carmen,<br/>Coyoacán, 04100 Ciudad de México,<br/>CDMX</span>
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
        </div>
      </footer>

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
                <div className="flex items-center gap-3">
                  {cartStep === 'details' && (
                    <button onClick={() => setCartStep('cart')} className="p-2 -ml-2 text-[#8A799E] hover:bg-[#FDFBF7] rounded-full transition-colors">
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <h2 className="text-xl font-serif font-medium text-[#4A4056]">
                    {cartStep === 'cart' ? 'Tu Selección' : 'Datos de Envío'}
                  </h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-[#8A799E] hover:bg-[#FDFBF7] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cartStep === 'cart' ? (
                  cart.length === 0 ? (
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
                  )
                ) : (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-[#8A799E] mb-1">Nombre Completo</label>
                      <input 
                        type="text" 
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-[#8A799E]/20 rounded-xl focus:outline-none focus:border-[#6B5A7E] focus:ring-1 focus:ring-[#6B5A7E] transition-all text-[#4A4056]"
                        placeholder="Ej. Ana García"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#8A799E] mb-1">Teléfono / WhatsApp</label>
                      <input 
                        type="tel" 
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-[#8A799E]/20 rounded-xl focus:outline-none focus:border-[#6B5A7E] focus:ring-1 focus:ring-[#6B5A7E] transition-all text-[#4A4056]"
                        placeholder="Ej. 55 1234 5678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#8A799E] mb-1">Dirección de Entrega</label>
                      <input 
                        type="text" 
                        value={customerInfo.address}
                        onChange={e => setCustomerInfo(p => ({ ...p, address: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-[#8A799E]/20 rounded-xl focus:outline-none focus:border-[#6B5A7E] focus:ring-1 focus:ring-[#6B5A7E] transition-all mb-3 text-[#4A4056]"
                        placeholder="Calle, Número, Colonia, Ciudad"
                      />
                      <button 
                        onClick={handleGetLocation}
                        disabled={gettingLocation}
                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-[#6B5A7E] bg-white border border-[#6B5A7E]/20 rounded-xl hover:bg-[#6B5A7E]/5 transition-colors disabled:opacity-50"
                      >
                        <MapPin size={16} /> 
                        {gettingLocation ? 'Obteniendo ubicación...' : (customerInfo.locationLink ? 'Ubicación Obtenida ✓' : 'Usar mi ubicación actual')}
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#8A799E] mb-1">Forma de Pago</label>
                      <select 
                        value={customerInfo.paymentMethod}
                        onChange={e => setCustomerInfo(p => ({ ...p, paymentMethod: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-[#8A799E]/20 rounded-xl focus:outline-none focus:border-[#6B5A7E] focus:ring-1 focus:ring-[#6B5A7E] transition-all appearance-none text-[#4A4056]"
                      >
                        <option value="Efectivo">Efectivo contra entrega</option>
                        <option value="Transferencia">Transferencia / Depósito</option>
                        <option value="Tarjeta">Tarjeta (Clip / MercadoPago)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#8A799E] mb-1">Notas / Intenciones</label>
                      <textarea 
                        value={customerInfo.notes}
                        onChange={e => setCustomerInfo(p => ({ ...p, notes: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border border-[#8A799E]/20 rounded-xl focus:outline-none focus:border-[#6B5A7E] focus:ring-1 focus:ring-[#6B5A7E] transition-all resize-none text-[#4A4056]"
                        rows={3}
                        placeholder="¿Es para regalo? ¿Alguna intención especial?"
                      />
                    </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-[#8A799E]/10 bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[#8A799E] font-medium">Total Estimado</span>
                    <span className="text-2xl font-medium text-[#4A4056]">${totalPrice} MXN</span>
                  </div>
                  {cartStep === 'cart' ? (
                    <button 
                      onClick={() => setCartStep('details')}
                      className="w-full py-4 bg-[#6B5A7E] text-white rounded-xl font-medium text-lg hover:bg-[#5A4B6B] transition-colors shadow-md shadow-[#6B5A7E]/20"
                    >
                      Continuar Pedido
                    </button>
                  ) : (
                    <button 
                      onClick={handleCheckout}
                      disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
                      className="w-full py-4 bg-[#25D366] text-white rounded-xl font-medium text-lg hover:bg-[#1EBE5A] transition-colors shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MessageCircle size={22} fill="currentColor" />
                      Pedir por WhatsApp
                    </button>
                  )}
                </div>
              )}
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="relative h-64 shrink-0">
                <img src={selectedProductDetails.image} alt={selectedProductDetails.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedProductDetails(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <h3 className="text-2xl font-serif text-[#4A4056] mb-2">{selectedProductDetails.name}</h3>
                <p className="text-[#8A799E] mb-6 whitespace-pre-wrap">{selectedProductDetails.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-[#8A799E]/10">
                  <span className="text-2xl font-bold text-[#4A4056]">${selectedProductDetails.price}</span>
                  <button 
                    onClick={() => {
                      addToCart(selectedProductDetails);
                      setSelectedProductDetails(null);
                    }}
                    className="px-6 py-3 bg-[#B892FF] text-white rounded-full font-bold hover:bg-[#A37DE6] transition-colors shadow-md flex items-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    Agregar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
