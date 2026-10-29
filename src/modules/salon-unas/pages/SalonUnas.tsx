// ═══════════════════════════════════════════════════════════════════════════
// UÑAS ROSÉ STUDIO — Nail Bar & Beauty Lounge
// Demo Oficial de App / Tarjeta de Citas CRO de 2 Pasos
// Imagine & Stamp · Mobile-First (375px) · Motion + Lucide
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Calendar, Clock, MapPin, MessageCircle, Instagram,
  Facebook, Shield, X, Check, Copy, ChevronRight, ArrowLeft,
  Heart, Star, Info, ExternalLink, Scissors, CheckCircle2
} from 'lucide-react';
import { clientConfig } from '../config';

// ── Imágenes de assets locales (WebP optimizados < 80 KB) ──
import heroImg from '../assets/hero.webp';
import gelImg from '../assets/gel.webp';
import acrilicoImg from '../assets/acrilico.webp';
import pedicureImg from '../assets/pedicure.webp';
import pestanasImg from '../assets/pestanas.webp';
import diseno1Img from '../assets/diseno-1.webp';
import diseno2Img from '../assets/diseno-2.webp';
import diseno3Img from '../assets/diseno-3.webp';
import diseno4Img from '../assets/diseno-4.webp';
import diseno5Img from '../assets/diseno-5.webp';
import diseno6Img from '../assets/diseno-6.webp';
import diseno7Img from '../assets/diseno-7.webp';
import diseno8Img from '../assets/diseno-8.webp';

const IMAGE_MAP: Record<string, string> = {
  hero: heroImg,
  gel: gelImg,
  acrilico: acrilicoImg,
  pedicure: pedicureImg,
  pestanas: pestanasImg,
  'diseno-1': diseno1Img,
  'diseno-2': diseno2Img,
  'diseno-3': diseno3Img,
  'diseno-4': diseno4Img,
  'diseno-5': diseno5Img,
  'diseno-6': diseno6Img,
  'diseno-7': diseno7Img,
  'diseno-8': diseno8Img,
};

const C = clientConfig.colors;

export default function SalonUnas() {
  const [selectedCategory, setSelectedCategory] = useState('gel');
  const [modalService, setModalService] = useState<typeof clientConfig.services[0] | null>(null);
  const [lightboxImg, setLightboxImg] = useState<{ title: string; imageKey: string } | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [copiedClabe, setCopiedClabe] = useState(false);

  // Estados del Agendador de 2 Pasos
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingService, setBookingService] = useState<typeof clientConfig.services[0]>(clientConfig.services[1]); // Gel con diseño por default
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingError, setBookingError] = useState('');

  const catalogRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Generar los próximos 14 días sin domingos
  const availableDates = useMemo(() => {
    const dates: { dateStr: string; label: string; dayName: string; dayNum: number; monthName: string }[] = [];
    const now = new Date();
    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

    let added = 0;
    let offset = 0;
    while (added < 14 && offset < 22) {
      const d = new Date(now);
      d.setDate(now.getDate() + offset);
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0) { // Omitir domingos
        const dayName = daysOfWeek[dayOfWeek];
        const dayNum = d.getDate();
        const monthName = months[d.getMonth()];
        const dateStr = `${dayName} ${dayNum} ${monthName}`;
        
        let label = `${dayName.slice(0, 3)} ${dayNum}`;
        if (offset === 0) label = `Hoy (${dayNum} ${monthName})`;
        else if (offset === 1) label = `Mañana (${dayNum})`;

        dates.push({ dateStr, label, dayName, dayNum, monthName });
        added++;
      }
      offset++;
    }
    return dates;
  }, []);

  // Preseleccionar primera fecha disponible
  React.useEffect(() => {
    if (availableDates.length > 0 && !bookingDate) {
      setBookingDate(availableDates[0].dateStr);
    }
    if (clientConfig.timeSlots.length > 0 && !bookingTime) {
      setBookingTime(clientConfig.timeSlots[2] || '12:00');
    }
  }, [availableDates, bookingDate, bookingTime]);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenBooking = (service?: typeof clientConfig.services[0]) => {
    if (service) setBookingService(service);
    setBookingStep(1);
    setBookingError('');
    setIsBookingOpen(true);
  };

  const handleStep1Submit = () => {
    if (!bookingService) {
      setBookingError('Por favor selecciona un servicio.');
      return;
    }
    if (!bookingDate) {
      setBookingError('Por favor selecciona un día.');
      return;
    }
    if (!bookingTime) {
      setBookingError('Por favor selecciona un horario.');
      return;
    }
    setBookingError('');
    setBookingStep(2);
  };

  const handleStep2Confirm = () => {
    if (!customerName.trim()) {
      setBookingError('Por favor escribe tu nombre completo.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setBookingError('Por favor ingresa un número de WhatsApp válido.');
      return;
    }

    setBookingError('');
    setBookingStep(3); // Pantalla de éxito

    // Mensaje estricto con prefijo [DEMO salón de uñas] hacia WhatsApp de René tras 500ms
    const msg = `[DEMO salón de uñas] Hola, quiero apartar: ${bookingService.name} · ${bookingDate} · ${bookingTime} · Nombre: ${customerName.trim()} · WhatsApp: ${customerPhone.trim()}`;
    const url = `https://wa.me/${clientConfig.phone}?text=${encodeURIComponent(msg)}`;

    setTimeout(() => {
      window.location.href = url;
    }, 550);
  };

  const handleCopyClabe = () => {
    navigator.clipboard.writeText(clientConfig.bankInfo.clabe.replace(/\s/g, ''));
    setCopiedClabe(true);
    setTimeout(() => setCopiedClabe(false), 2000);
  };

  return (
    <div
      className="min-h-screen flex flex-col antialiased selection:bg-[#D47A94]/20 selection:text-[#2D1E25]"
      style={{ backgroundColor: C.bg, color: C.text, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* ── BARRA SUPERIOR STICKY ── */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-[#F0DCE4]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FDEEF2] border border-[#F0DCE4] flex items-center justify-center text-[#D47A94] shadow-sm">
              <Sparkles size={16} />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {clientConfig.businessName}
              </span>
              <span className="block text-[10px] font-medium text-[#7D6A73]">
                {clientConfig.tagline}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleOpenBooking()}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-sm transition-all hover:opacity-95 active:scale-95 flex items-center gap-1.5"
            style={{ backgroundColor: C.primary }}
          >
            <Calendar size={13} />
            Agendar
          </button>
        </div>
      </header>

      {/* ── CONTENEDOR CENTRAL MOBILE-FIRST (375px a 440px) ── */}
      <main className="w-full max-w-md mx-auto flex-1 flex flex-col px-4 pt-4 pb-12">
        
        {/* ── HERO / PERFIL DE PRESENTACIÓN ── */}
        <section className="relative overflow-hidden rounded-3xl bg-white border border-[#F0DCE4] shadow-sm p-5 text-center">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#FDEEF2] to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Avatar / Imagen Destacada */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md shadow-[#D47A94]/20"
            >
              <img
                src={heroImg}
                alt={clientConfig.businessName}
                className="w-full h-full object-cover"
              />
              <span
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"
                title="Abierto hoy"
              />
            </motion.div>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-[#2D1E25]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {clientConfig.businessName}
            </h1>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#D47A94]">
              {clientConfig.tagline}
            </p>

            <p className="mt-2 text-xs text-[#7D6A73] leading-relaxed max-w-xs">
              {clientConfig.description}
            </p>

            {/* Badges de Confianza y Horarios */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FDEEF2] text-[#D47A94] font-bold border border-[#F0DCE4]">
                <Clock size={11} /> {clientConfig.hours.split('(')[0].trim()}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#7D6A73] font-medium border border-[#F0DCE4]">
                <MapPin size={11} className="text-[#C5A059]" /> {clientConfig.address}
              </span>
            </div>

            {/* Enlaces de Contacto Rápido */}
            <div className="mt-4 flex items-center justify-center gap-2.5 w-full pt-3 border-t border-[#F0DCE4]">
              <a
                href={`https://wa.me/${clientConfig.phone}?text=${encodeURIComponent('[DEMO salón de uñas] Hola, me gustaría pedir informes sobre los servicios de Uñas Rosé Studio')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-[#25D366]/10 text-[#128C7E] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>
              <a
                href={clientConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-[#E1306C]/10 text-[#C13584] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#E1306C]/20 hover:bg-[#E1306C]/20 transition-colors"
              >
                <Instagram size={15} />
                Instagram
              </a>
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

        {/* ── BOTÓN BANNER PRINCIPAL: AGENDAR CITA EN LÍNEA ── */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mt-4"
        >
          <button
            onClick={() => handleOpenBooking()}
            className="w-full p-4 rounded-2xl text-white shadow-lg shadow-[#D47A94]/25 flex items-center justify-between text-left transition-all relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <span className="block text-sm font-black tracking-tight leading-snug">
                  Agendar Cita en Línea
                </span>
                <span className="block text-[11px] font-normal text-white/90">
                  Elige servicio, día y tu horario preferido
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/80 shrink-0" />
          </button>
        </motion.div>

        {/* ── CATÁLOGO DE SERVICIOS POR CATEGORÍA ── */}
        <section ref={catalogRef} className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#7D6A73] flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#D47A94]" />
              Catálogo de Servicios
            </h2>
            <button
              onClick={scrollToGallery}
              className="text-[11px] font-semibold text-[#D47A94] hover:underline"
            >
              Ver Galería ({clientConfig.gallery.length}) →
            </button>
          </div>

          {/* Pestañas de categorías */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {clientConfig.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  selectedCategory === cat.id
                    ? 'bg-[#D47A94] text-white border-[#D47A94] shadow-sm'
                    : 'bg-white text-[#7D6A73] border-[#F0DCE4] hover:bg-[#FDEEF2]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Lista de Servicios filtrados */}
          <div className="mt-3 space-y-3">
            {clientConfig.services
              .filter((s) => s.categoryId === selectedCategory)
              .map((service) => {
                const img = IMAGE_MAP[service.imageKey] || gelImg;
                return (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-white border border-[#F0DCE4] shadow-sm flex gap-3.5 items-center hover:border-[#D47A94]/60 transition-colors"
                  >
                    {/* Foto del servicio */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#F0DCE4]">
                      <img
                        src={img}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                      {service.badge && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#D47A94] text-white shadow-sm">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-sm font-bold text-[#2D1E25] truncate">
                          {service.name}
                        </h3>
                        <span className="text-sm font-black text-[#D47A94] shrink-0">
                          {service.priceFormatted}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#7D6A73] line-clamp-2 leading-relaxed mt-0.5">
                        {service.subtitle}
                      </p>

                      <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-[#FAF0F3]">
                        <span className="text-[10px] text-[#A6959D] flex items-center gap-1 font-medium">
                          <Clock size={11} className="text-[#D47A94]" />
                          {service.duration}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setModalService(service)}
                            className="px-2 py-1 rounded-lg text-[10px] font-semibold text-[#7D6A73] hover:text-[#D47A94] transition-colors"
                          >
                            Detalles
                          </button>
                          <button
                            onClick={() => handleOpenBooking(service)}
                            className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#FDEEF2] text-[#D47A94] border border-[#F0DCE4] hover:bg-[#D47A94] hover:text-white transition-all"
                          >
                            Apartar
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </section>

        {/* ── GALERÍA DE DISEÑOS CON LIGHTBOX (6 a 8 fotos) ── */}
        <section ref={galleryRef} className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#7D6A73] flex items-center gap-1.5">
              <Heart size={13} className="text-[#D47A94]" />
              Galería de Diseños
            </h2>
            <span className="text-[11px] text-[#A6959D]">
              Toca para ampliar
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {clientConfig.gallery.map((item) => {
              const img = IMAGE_MAP[item.imageKey] || gelImg;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLightboxImg(item)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#F0DCE4] shadow-sm cursor-pointer"
                >
                  <img
                    src={img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90 p-2.5 flex flex-col justify-end">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A059]">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-white leading-tight drop-shadow-sm truncate">
                      {item.title}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── RECUADRO HONESTO DE PRUEBA SOCIAL (Sin reseñas falsas) ── */}
        <section className="mt-8 p-4 rounded-2xl bg-white border-2 border-dashed border-[#F0DCE4] text-center">
          <div className="w-10 h-10 rounded-full bg-[#FDEEF2] text-[#D47A94] flex items-center justify-center mx-auto mb-2">
            <Star size={18} />
          </div>
          <h3 className="text-xs font-bold text-[#2D1E25] uppercase tracking-wider">
            Aquí van las reseñas reales de tus clientes
          </h3>
          <p className="mt-1 text-[11px] text-[#7D6A73] leading-relaxed max-w-xs mx-auto">
            En tu aplicación personalizada, este bloque muestra las fotos de los resultados y las opiniones verificadas de tu perfil de Google Maps e Instagram.
          </p>
        </section>

      </main>

      {/* ── FOOTER DE 3 COLUMNAS DEL CLIENTE + CRÉDITO Y LEGALES ── */}
      <footer className="mt-auto border-t border-[#F0DCE4] bg-white pt-8 pb-0">
        <div className="max-w-md mx-auto px-4 grid grid-cols-1 gap-6 pb-8">
          
          {/* Columna 1: Datos de la Marca */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-tight text-[#2D1E25]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {clientConfig.businessName}
            </h4>
            <p className="text-xs text-[#7D6A73] leading-relaxed mt-1">
              {clientConfig.description}
            </p>
          </div>

          {/* Columna 2: Contacto y Horarios */}
          <div className="space-y-1.5 text-xs text-[#7D6A73]">
            <p className="font-bold uppercase text-[10px] tracking-wider text-[#2D1E25]">Contacto & Ubicación</p>
            <p className="flex items-center gap-2">
              <MapPin size={13} className="text-[#D47A94] shrink-0" />
              <span>{clientConfig.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock size={13} className="text-[#D47A94] shrink-0" />
              <span>{clientConfig.hours}</span>
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle size={13} className="text-[#25D366] shrink-0" />
              <span>WhatsApp: {clientConfig.phoneNumber}</span>
            </p>
          </div>

          {/* Columna 3: Redes Sociales */}
          <div>
            <p className="font-bold uppercase text-[10px] tracking-wider text-[#2D1E25] mb-2">Síguenos</p>
            <div className="flex gap-2">
              <a
                href={clientConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#FDEEF2] text-[#D47A94] border border-[#F0DCE4] flex items-center justify-center hover:scale-105 transition-transform"
                title="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={clientConfig.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#FDEEF2] text-[#D47A94] border border-[#F0DCE4] flex items-center justify-center hover:scale-105 transition-transform"
                title="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={`https://wa.me/${clientConfig.phone}?text=${encodeURIComponent('[DEMO salón de uñas] Hola!')}`}
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

        {/* Barra Inferior: Crédito Oficial y Aviso de Privacidad */}
        <div className="py-6 border-t border-[#F0DCE4] bg-[#FAF6F7]">
          <div className="max-w-md mx-auto px-4 flex flex-col items-center gap-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#A6959D]">
              © {new Date().getFullYear()} {clientConfig.businessName.toUpperCase()} · DEMO OFICIAL
            </p>

            <a
              href="https://imagineandstamp.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#F0DCE4] text-[10px] font-bold uppercase tracking-wider text-[#7D6A73] hover:text-[#D47A94] transition-colors shadow-xs"
            >
              <span>Diseñado por</span>
              <span className="text-[#D47A94] font-black">IMAGINE & STAMP</span>
              <ExternalLink size={10} className="text-[#D47A94]" />
            </a>

            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="flex items-center gap-1 text-[10px] font-semibold text-[#A6959D] hover:text-[#7D6A73] transition-colors underline"
            >
              <Shield size={11} /> Aviso de Privacidad (LFPDPPP)
            </button>
          </div>
        </div>
      </footer>

      {/* ── MODAL AGENDADOR CRO DE 2 PASOS (Bottom Sheet en Móvil) ── */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-md max-h-[92vh] bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl border-t sm:border border-[#F0DCE4] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Accent Bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#D47A94] to-[#C5A059] shrink-0" />

              {/* Header */}
              <div className="p-4 border-b border-[#F0DCE4] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {bookingStep === 2 && (
                    <button
                      onClick={() => setBookingStep(1)}
                      className="w-8 h-8 rounded-full bg-[#FAF6F7] text-[#7D6A73] flex items-center justify-center hover:bg-[#FDEEF2] transition-colors"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-[#2D1E25] flex items-center gap-1.5">
                      <Calendar size={15} className="text-[#D47A94]" />
                      {bookingStep === 1 && 'Paso 1: Elige Servicio y Horario'}
                      {bookingStep === 2 && 'Paso 2: Datos y Confirmación'}
                      {bookingStep === 3 && '¡Cita en Proceso!'}
                    </h3>
                    <p className="text-[10px] text-[#7D6A73]">
                      {bookingStep === 1 && 'Selecciona el día y la hora que prefieras'}
                      {bookingStep === 2 && 'Ingresa tus datos para apartar tu espacio'}
                      {bookingStep === 3 && 'Redirigiendo a WhatsApp oficial...'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF6F7] text-[#7D6A73] flex items-center justify-center hover:bg-[#FDEEF2] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Mensaje de error visual si falta algún dato */}
              {bookingError && (
                <div className="px-4 py-2 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                  <Info size={14} /> {bookingError}
                </div>
              )}

              {/* Contenido según el paso */}
              <div className="p-4 overflow-y-auto space-y-4 flex-1">
                
                {/* ── PASO 1: Servicio + Día + Hora ── */}
                {bookingStep === 1 && (
                  <div className="space-y-4">
                    {/* Servicio Elegido */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7D6A73] mb-1.5">
                        Servicio a Realizar
                      </label>
                      <select
                        value={bookingService.id}
                        onChange={(e) => {
                          const found = clientConfig.services.find((s) => s.id === e.target.value);
                          if (found) setBookingService(found);
                        }}
                        className="w-full p-3 rounded-xl bg-[#FAF6F7] border border-[#F0DCE4] text-xs font-bold text-[#2D1E25] focus:outline-none focus:border-[#D47A94]"
                      >
                        {clientConfig.services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} — {s.priceFormatted} ({s.duration})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Días disponibles (próximos 14 días sin domingos) */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7D6A73] mb-1.5">
                        Día de la Cita (Próximos 14 días)
                      </label>
                      <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                        {availableDates.map((item) => (
                          <button
                            key={item.dateStr}
                            type="button"
                            onClick={() => setBookingDate(item.dateStr)}
                            className={`p-2 rounded-xl text-center text-xs transition-all border ${
                              bookingDate === item.dateStr
                                ? 'bg-[#D47A94] text-white font-bold border-[#D47A94] shadow-xs'
                                : 'bg-[#FAF6F7] text-[#2D1E25] font-medium border-[#F0DCE4] hover:bg-[#FDEEF2]'
                            }`}
                          >
                            <span className="block text-[10px] uppercase font-bold opacity-80">
                              {item.dayName.slice(0, 3)}
                            </span>
                            <span className="block text-sm font-black">
                              {item.dayNum}
                            </span>
                            <span className="block text-[9px] uppercase">
                              {item.monthName}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Horarios disponibles */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7D6A73] mb-1.5">
                        Horario Disponible
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {clientConfig.timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingTime(slot)}
                            className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all border ${
                              bookingTime === slot
                                ? 'bg-[#D47A94] text-white border-[#D47A94] shadow-xs'
                                : 'bg-[#FAF6F7] text-[#7D6A73] border-[#F0DCE4] hover:bg-[#FDEEF2]'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Resumen del paso 1 */}
                    <div className="p-3 rounded-xl bg-[#FDEEF2] border border-[#F0DCE4] flex items-center justify-between text-xs">
                      <div>
                        <span className="block font-bold text-[#2D1E25]">{bookingService.name}</span>
                        <span className="block text-[11px] text-[#7D6A73]">
                          {bookingDate} a las {bookingTime} hrs
                        </span>
                      </div>
                      <span className="text-sm font-black text-[#D47A94]">
                        {bookingService.priceFormatted}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleStep1Submit}
                      className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#D47A94]/25 transition-all hover:opacity-95 active:scale-98 flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: C.primary }}
                    >
                      Continuar a Datos y Anticipo →
                    </button>
                  </div>
                )}

                {/* ── PASO 2: Nombre, WhatsApp + Anticipo ── */}
                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7D6A73] mb-1">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ej. Valeria Morales"
                        className="w-full p-3 rounded-xl bg-[#FAF6F7] border border-[#F0DCE4] text-xs font-semibold text-[#2D1E25] focus:outline-none focus:border-[#D47A94]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7D6A73] mb-1">
                        Tu WhatsApp (10 dígitos) *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="55 1234 5678"
                        className="w-full p-3 rounded-xl bg-[#FAF6F7] border border-[#F0DCE4] text-xs font-semibold text-[#2D1E25] focus:outline-none focus:border-[#D47A94]"
                      />
                    </div>

                    {/* Tarjeta de Anticipo y Transferencia */}
                    <div className="p-3.5 rounded-2xl bg-[#FFF9F3] border border-[#F0DCE4] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1">
                          <Shield size={13} /> Anticipo de Reserva
                        </span>
                        <span className="text-xs font-black text-[#2D1E25]">
                          ${clientConfig.depositAmount} MXN
                        </span>
                      </div>

                      <p className="text-[11px] text-[#7D6A73] leading-relaxed">
                        Para apartar tu lugar se solicita un anticipo de <strong>${clientConfig.depositAmount} MXN</strong> transferible a la siguiente cuenta de muestra:
                      </p>

                      <div className="p-2.5 rounded-xl bg-white border border-[#F0DCE4] flex items-center justify-between">
                        <div className="text-[11px]">
                          <span className="block font-bold text-[#2D1E25]">{clientConfig.bankInfo.bank}</span>
                          <span className="block font-mono text-[#7D6A73]">{clientConfig.bankInfo.clabe}</span>
                          <span className="block text-[9px] text-[#C5A059] font-medium">Titular: {clientConfig.bankInfo.accountHolder}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyClabe}
                          className="px-2.5 py-1.5 rounded-lg bg-[#FAF6F7] text-[10px] font-bold text-[#D47A94] border border-[#F0DCE4] hover:bg-[#FDEEF2] transition-colors flex items-center gap-1"
                        >
                          {copiedClabe ? <Check size={12} /> : <Copy size={12} />}
                          {copiedClabe ? 'Copiado' : 'Copiar'}
                        </button>
                      </div>

                      {/* Política de cancelación obligatoria */}
                      <p className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 leading-snug">
                        ⚠️ <strong>Política:</strong> {clientConfig.cancellationPolicy}
                      </p>
                    </div>

                    {/* Letra chica obligatoria */}
                    <p className="text-[10px] text-[#A6959D] text-center leading-snug">
                      * El horario se confirma directamente por WhatsApp tras revisar disponibilidad del día.
                    </p>

                    <button
                      type="button"
                      onClick={handleStep2Confirm}
                      className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#25D366]/25 transition-all hover:opacity-95 active:scale-98 flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      <MessageCircle size={16} />
                      Enviar y Confirmar por WhatsApp
                    </button>
                  </div>
                )}

                {/* ── PASO 3: Pantalla de Éxito ── */}
                {bookingStep === 3 && (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-base font-black text-[#2D1E25]">
                      ¡Solicitud Generada!
                    </h3>
                    <p className="text-xs text-[#7D6A73] leading-relaxed max-w-xs mx-auto">
                      Abriendo WhatsApp con los datos de tu cita para <strong>{bookingService.name}</strong> el <strong>{bookingDate}</strong> a las <strong>{bookingTime}</strong>...
                    </p>
                    <div className="pt-2">
                      <span className="inline-block w-6 h-6 border-2 border-[#D47A94] border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL DETALLE DE SERVICIO ── */}
      <AnimatePresence>
        {modalService && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalService(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md max-h-[85vh] bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl border-t sm:border border-[#F0DCE4] p-5 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0DCE4]">
                <div>
                  <h3 className="text-base font-bold text-[#2D1E25]">{modalService.name}</h3>
                  <span className="text-xs text-[#D47A94] font-semibold">{modalService.subtitle}</span>
                </div>
                <button
                  onClick={() => setModalService(null)}
                  className="w-8 h-8 rounded-full bg-[#FAF6F7] text-[#7D6A73] flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-[#FAF6F7]">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#7D6A73]">Inversión</span>
                  <span className="text-lg font-black text-[#D47A94]">{modalService.priceFormatted}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-[#7D6A73]">Duración</span>
                  <span className="text-xs font-bold text-[#2D1E25] flex items-center gap-1">
                    <Clock size={12} className="text-[#D47A94]" /> {modalService.duration}
                  </span>
                </div>
              </div>

              {modalService.includes && (
                <div className="mt-4 space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#2D1E25]">
                    ¿Qué incluye este servicio?
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#7D6A73]">
                    {modalService.includes.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={14} className="text-[#D47A94] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => {
                    const s = modalService;
                    setModalService(null);
                    handleOpenBooking(s);
                  }}
                  className="flex-1 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#D47A94]/25"
                  style={{ backgroundColor: C.primary }}
                >
                  Agendar Este Servicio
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── LIGHTBOX PARA FOTOS DE LA GALERÍA ── */}
      <AnimatePresence>
        {lightboxImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImg(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-sm w-full bg-white rounded-3xl overflow-hidden shadow-2xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-square w-full">
                <img
                  src={IMAGE_MAP[lightboxImg.imageKey] || gelImg}
                  alt={lightboxImg.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setLightboxImg(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#2D1E25]">{lightboxImg.title}</h4>
                  <span className="text-[10px] text-[#7D6A73]">Diseño de catálogo exclusivo</span>
                </div>
                <button
                  onClick={() => {
                    setLightboxImg(null);
                    handleOpenBooking(clientConfig.services[1]); // Gel con diseño
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#D47A94] text-white text-xs font-bold shadow-xs hover:opacity-95"
                >
                  Quiero este
                </button>
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
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 border border-[#F0DCE4] max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF6F7] text-[#7D6A73] flex items-center justify-center hover:bg-[#FDEEF2]"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#FDEEF2] text-[#D47A94] flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2D1E25] uppercase tracking-tight">
                    Aviso de Privacidad
                  </h3>
                  <p className="text-[10px] text-[#7D6A73]">
                    Ley Federal de Protección de Datos Personales (LFPDPPP)
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#7D6A73] leading-relaxed">
                <p>
                  En <strong>{clientConfig.businessName}</strong>, con domicilio en {clientConfig.address}, valoramos y respetamos tu derecho a la privacidad.
                </p>
                <p>
                  <strong>Finalidad de los datos:</strong> Los datos personales recabados (nombre, teléfono de contacto y fecha de cita solicitada) son utilizados única y exclusivamente para agendar, coordinar y confirmar tu servicio en nuestro salón.
                </p>
                <p>
                  <strong>No compartición:</strong> Tu información no es vendida, cedida ni compartida con terceros para fines comerciales o publicitarios ajenos a nuestro servicio.
                </p>
                <p>
                  <strong>Derechos ARCO:</strong> Puedes ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición escribiéndonos a <strong>{clientConfig.email}</strong> o vía WhatsApp al <strong>{clientConfig.phoneNumber}</strong>.
                </p>
              </div>

              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#D47A94] text-white font-bold text-xs uppercase tracking-wider hover:opacity-95"
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

