// ═══════════════════════════════════════════════════════════════════════════
// SONRISA CLARA · CONSULTORIO DENTAL
// Demo Oficial de Citas Odontológicas CRO con Privacidad Médica (LFPDPPP)
// Imagine & Stamp · Mobile-First (375px) · Motion + Lucide
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Calendar, Clock, MapPin, MessageCircle, Instagram,
  Facebook, Shield, X, Check, ChevronRight, ArrowLeft,
  Info, ExternalLink, UserCheck, Stethoscope, AlertCircle, CheckCircle2,
  Lock, FileText, CheckCircle
} from 'lucide-react';
import { clientConfig } from '../config';

// ── Imágenes WebP locales (< 80 KB) ──
import doctorPlaceholderImg from '../assets/doctor-placeholder.webp';
import consultorioImg from '../assets/consultorio.webp';
import valoracionImg from '../assets/valoracion.webp';
import limpiezaImg from '../assets/limpieza.webp';
import resinaImg from '../assets/resina.webp';
import blanqueamientoImg from '../assets/blanqueamiento.webp';
import ortodonciaImg from '../assets/ortodoncia.webp';

const IMAGE_MAP: Record<string, string> = {
  valoracion: valoracionImg,
  limpieza: limpiezaImg,
  resina: resinaImg,
  blanqueamiento: blanqueamientoImg,
  ortodoncia: ortodonciaImg,
  consultorio: consultorioImg,
};

const C = clientConfig.colors;

export default function ConsultorioDental() {
  const [modalService, setModalService] = useState<typeof clientConfig.services[0] | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Estados del Agendador CRO de 2 Pasos (sin persistencia en localStorage)
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingService, setBookingService] = useState<typeof clientConfig.services[0]>(clientConfig.services[1]); // Limpieza dental por default
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [consultationReason, setConsultationReason] = useState(clientConfig.consultationReasons[0].label);
  const [bookingError, setBookingError] = useState('');

  const servicesRef = useRef<HTMLDivElement>(null);
  const preparationRef = useRef<HTMLDivElement>(null);

  // Próximos 14 días sin domingos
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

  // Preseleccionar fecha y hora por defecto
  React.useEffect(() => {
    if (availableDates.length > 0 && !bookingDate) {
      setBookingDate(availableDates[0].dateStr);
    }
    if (clientConfig.timeSlots.length > 0 && !bookingTime) {
      setBookingTime(clientConfig.timeSlots[1] || '11:00');
    }
  }, [availableDates, bookingDate, bookingTime]);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPreparation = () => {
    preparationRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      setBookingError('Por favor selecciona un día para tu cita.');
      return;
    }
    if (!bookingTime) {
      setBookingError('Por favor selecciona un horario.');
      return;
    }
    setBookingError('');
    setBookingStep(2);
  };

  const handleStep2Submit = () => {
    if (!customerName.trim()) {
      setBookingError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setBookingError('Por favor ingresa un número de WhatsApp válido.');
      return;
    }

    setBookingError('');
    setBookingStep(3); // Pantalla de éxito

    // Mensaje estricto con prefijo [DEMO consultorio dental] hacia WhatsApp oficial tras 500ms
    const msg = `[DEMO consultorio dental] Hola, quiero agendar: ${bookingService.name} · ${bookingDate} · ${bookingTime} · Motivo: ${consultationReason} · Nombre: ${customerName.trim()} · WhatsApp: ${customerPhone.trim()}`;
    const url = `https://wa.me/${clientConfig.phone}?text=${encodeURIComponent(msg)}`;

    setTimeout(() => {
      window.location.href = url;
    }, 550);
  };

  return (
    <div
      className="min-h-screen flex flex-col antialiased selection:bg-[#0D9488]/20 selection:text-[#0F172A]"
      style={{ backgroundColor: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── BARRA SUPERIOR STICKY ── */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-[#E2E8F0]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#CCFBF1] border border-[#99F6E4] flex items-center justify-center text-[#0D9488] shadow-xs">
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

          <button
            onClick={() => handleOpenBooking()}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xs transition-all hover:bg-[#0F766E] active:scale-95 flex items-center gap-1.5"
            style={{ backgroundColor: C.primary }}
          >
            <Calendar size={13} />
            Agendar Cita
          </button>
        </div>
      </header>

      {/* ── CONTENEDOR PRINCIPAL MOBILE-FIRST (375px a 440px) ── */}
      <main className="w-full max-w-md mx-auto flex-1 flex flex-col px-4 pt-4 pb-16">
        
        {/* ── HERO BANNER: CONSULTORIO + PLACEHOLDER DEL DOCTOR (SIN PERSONA REAL) ── */}
        <section className="relative overflow-hidden rounded-3xl bg-white border border-[#E2E8F0] shadow-sm p-5 text-center">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#F0FDFA] to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Avatar Placeholder Médico Ilustrado */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md shadow-[#0D9488]/15 bg-[#CCFBF1]"
            >
              <img
                src={doctorPlaceholderImg}
                alt="Especialista en Odontología Integral"
                className="w-full h-full object-cover"
              />
              <span
                className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"
                title="Consultas activas hoy"
              />
            </motion.div>

            <h1 className="mt-3 text-xl font-black tracking-tight text-[#0F172A]">
              {clientConfig.businessName}
            </h1>

            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              {clientConfig.specialistName}
            </p>

            <p className="text-[11px] font-medium text-[#475569]">
              {clientConfig.specialistTitle}
            </p>

            <p className="mt-2 text-xs text-[#475569] leading-relaxed max-w-xs">
              {clientConfig.description}
            </p>

            {/* Badges de Confianza y Horarios */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0FDFA] text-[#0D9488] font-bold border border-[#CCFBF1]">
                <Clock size={11} /> {clientConfig.hours.split(',')[0]}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#475569] font-medium border border-[#E2E8F0]">
                <MapPin size={11} className="text-[#0D9488]" /> {clientConfig.address}
              </span>
            </div>

            {/* Botones de Contacto Rápido */}
            <div className="mt-4 flex items-center justify-center gap-2.5 w-full pt-3 border-t border-[#E2E8F0]">
              <a
                href={`https://wa.me/${clientConfig.phone}?text=${encodeURIComponent('[DEMO consultorio dental] Hola, me gustaría pedir informes sobre las consultas en Sonrisa Clara')}`}
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

        {/* ── BOTÓN BANNER PRINCIPAL: AGENDAR CITA ── */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="mt-4"
        >
          <button
            onClick={() => handleOpenBooking()}
            className="w-full p-4 rounded-2xl text-white shadow-lg shadow-[#0D9488]/20 flex items-center justify-between text-left transition-all relative overflow-hidden"
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
                  Selecciona servicio, día y tu horario preferido
                </span>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/80 shrink-0" />
          </button>
        </motion.div>

        {/* ── FOTO DE INSTALACIONES / CONSULTORIO ── */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs relative">
          <img
            src={consultorioImg}
            alt="Instalaciones del Consultorio Dental"
            className="w-full h-36 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Stethoscope size={14} className="text-[#99F6E4]" /> Unidad e instrumental 100% esterilizado
            </span>
          </div>
        </div>

        {/* ── CATÁLOGO DE SERVICIOS DENTALES ── */}
        <section ref={servicesRef} className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#475569] flex items-center gap-1.5">
              <Stethoscope size={14} className="text-[#0D9488]" />
              Servicios Odontológicos
            </h2>
            <button
              onClick={scrollToPreparation}
              className="text-[11px] font-semibold text-[#0D9488] hover:underline"
            >
              Antes de tu cita →
            </button>
          </div>

          <div className="space-y-3">
            {clientConfig.services.map((service) => {
              const img = IMAGE_MAP[service.imageKey] || valoracionImg;
              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex gap-3.5 items-center hover:border-[#0D9488]/60 transition-colors"
                >
                  {/* Foto del Servicio */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#E2E8F0]">
                    <img
                      src={img}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    {service.badge && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#0D9488] text-white shadow-xs">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-bold text-[#0F172A] truncate">
                        {service.name}
                      </h3>
                      <span className="text-xs font-black text-[#0D9488] shrink-0">
                        {service.priceFrom}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#475569] line-clamp-2 leading-relaxed mt-0.5">
                      {service.description}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
                      <span className="text-[10px] text-[#94A3B8] flex items-center gap-1 font-medium">
                        <Clock size={11} className="text-[#0D9488]" />
                        {service.duration}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setModalService(service)}
                          className="px-2 py-1 rounded-lg text-[10px] font-semibold text-[#475569] hover:text-[#0D9488] transition-colors"
                        >
                          Detalles
                        </button>
                        <button
                          onClick={() => handleOpenBooking(service)}
                          className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1] hover:bg-[#0D9488] hover:text-white transition-all"
                        >
                          Agendar
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── SECCIÓN: ANTES DE TU CITA (REGLA MÉDICA) ── */}
        <section ref={preparationRef} className="mt-8 p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center">
              <FileText size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Antes de tu Cita
              </h3>
              <p className="text-[10px] text-[#475569]">
                Recomendaciones para tu consulta odontológica
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {clientConfig.beforeYourVisit.map((item, i) => (
              <div key={i} className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="block text-xs font-bold text-[#0D9488] mb-1">
                  {item.title}
                </span>
                <p className="text-[10px] text-[#475569] leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Sello de Privacidad Médica Destacado */}
          <div className="mt-4 p-3 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center gap-2.5">
            <Lock size={16} className="text-[#0D9488] shrink-0" />
            <p className="text-[10px] text-[#0D9488] font-medium leading-snug">
              <strong>Compromiso de Privacidad:</strong> No solicitamos datos de salud por medios digitales. Tu diagnóstico es estrictamente confidencial en consulta.
            </p>
          </div>
        </section>

        {/* ── RECUADRO HONESTO DE PRUEBA SOCIAL (Sin opiniones inventadas) ── */}
        <section className="mt-8 p-4 rounded-2xl bg-white border-2 border-dashed border-[#E2E8F0] text-center">
          <div className="w-10 h-10 rounded-full bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center mx-auto mb-2">
            <UserCheck size={18} />
          </div>
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Aquí van las reseñas reales de tus pacientes
          </h3>
          <p className="mt-1 text-[11px] text-[#475569] leading-relaxed max-w-xs mx-auto">
            En tu aplicación personalizada, este espacio muestra testimonios verificados de pacientes satisfechos vinculados directamente a tu ficha de Google Maps.
          </p>
        </section>

      </main>

      {/* ── FOOTER DE 3 COLUMNAS DEL CLIENTE + LEGALES ── */}
      <footer className="mt-auto border-t border-[#E2E8F0] bg-white pt-8 pb-0">
        <div className="max-w-md mx-auto px-4 grid grid-cols-1 gap-6 pb-8">
          
          {/* Columna 1: Datos de la Clínica */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-tight text-[#0F172A]">
              {clientConfig.businessName}
            </h4>
            <p className="text-xs text-[#475569] leading-relaxed mt-1">
              {clientConfig.description}
            </p>
          </div>

          {/* Columna 2: Contacto & Consultorio */}
          <div className="space-y-1.5 text-xs text-[#475569]">
            <p className="font-bold uppercase text-[10px] tracking-wider text-[#0F172A]">Contacto & Citas</p>
            <p className="flex items-center gap-2">
              <MapPin size={13} className="text-[#0D9488] shrink-0" />
              <span>{clientConfig.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock size={13} className="text-[#0D9488] shrink-0" />
              <span>{clientConfig.hours}</span>
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle size={13} className="text-[#25D366] shrink-0" />
              <span>WhatsApp Citas: {clientConfig.phoneNumber}</span>
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
                className="w-9 h-9 rounded-xl bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1] flex items-center justify-center hover:scale-105 transition-transform"
                title="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={clientConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1] flex items-center justify-center hover:scale-105 transition-transform"
                title="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={`https://wa.me/${clientConfig.phone}?text=${encodeURIComponent('[DEMO consultorio dental] Hola!')}`}
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

        {/* Barra Inferior: Crédito Imagine & Stamp + Aviso de Privacidad Médica */}
        <div className="py-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="max-w-md mx-auto px-4 flex flex-col items-center gap-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              © {new Date().getFullYear()} {clientConfig.businessName.toUpperCase()} · DEMO OFICIAL
            </p>

            <a
              href="https://imagineandstamp.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#475569] hover:text-[#0D9488] transition-colors shadow-xs"
            >
              <span>Diseñado por</span>
              <span className="text-[#0D9488] font-black">IMAGINE & STAMP</span>
              <ExternalLink size={10} className="text-[#0D9488]" />
            </a>

            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="flex items-center gap-1 text-[10px] font-semibold text-[#94A3B8] hover:text-[#475569] transition-colors underline"
            >
              <Shield size={11} /> Aviso de Privacidad Médica (LFPDPPP)
            </button>
          </div>
        </div>
      </footer>

      {/* ── MODAL AGENDADOR DE 2 PASOS CON PRIVACIDAD ESTRICTA ── */}
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
              className="relative w-full max-w-md max-h-[92vh] bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl border-t sm:border border-[#E2E8F0] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Barra de acento */}
              <div className="h-1.5 bg-gradient-to-r from-[#0D9488] to-[#14B8A6] shrink-0" />

              {/* Header */}
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {bookingStep === 2 && (
                    <button
                      onClick={() => setBookingStep(1)}
                      className="w-8 h-8 rounded-full bg-[#F8FAFC] text-[#475569] flex items-center justify-center hover:bg-[#F0FDFA]"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Calendar size={15} className="text-[#0D9488]" />
                      {bookingStep === 1 && 'Paso 1: Servicio y Horario'}
                      {bookingStep === 2 && 'Paso 2: Datos de Contacto'}
                      {bookingStep === 3 && '¡Cita en Proceso!'}
                    </h3>
                    <p className="text-[10px] text-[#475569]">
                      {bookingStep === 1 && 'Elige el día y la hora que mejor te convenga'}
                      {bookingStep === 2 && 'Nombre, teléfono y motivo de tu visita'}
                      {bookingStep === 3 && 'Confirmación directa en WhatsApp'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#F8FAFC] text-[#475569] flex items-center justify-center hover:bg-[#F0FDFA]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Mensaje de error si falta algún campo */}
              {bookingError && (
                <div className="px-4 py-2 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle size={14} /> {bookingError}
                </div>
              )}

              {/* Contenido según el paso */}
              <div className="p-4 overflow-y-auto space-y-4 flex-1">
                
                {/* ── PASO 1: Servicio + Día + Hora ── */}
                {bookingStep === 1 && (
                  <div className="space-y-4">
                    {/* Servicio Elegido */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                        Servicio Odontológico
                      </label>
                      <select
                        value={bookingService.id}
                        onChange={(e) => {
                          const found = clientConfig.services.find((s) => s.id === e.target.value);
                          if (found) setBookingService(found);
                        }}
                        className="w-full p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
                      >
                        {clientConfig.services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} — {s.priceFrom} ({s.duration})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Días disponibles (próximos 14 días sin domingos) */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                        Día de la Consulta (Próximos 14 días)
                      </label>
                      <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                        {availableDates.map((item) => (
                          <button
                            key={item.dateStr}
                            type="button"
                            onClick={() => setBookingDate(item.dateStr)}
                            className={`p-2 rounded-xl text-center text-xs transition-all border ${
                              bookingDate === item.dateStr
                                ? 'bg-[#0D9488] text-white font-bold border-[#0D9488] shadow-xs'
                                : 'bg-[#F8FAFC] text-[#0F172A] font-medium border-[#E2E8F0] hover:bg-[#F0FDFA]'
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
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                        Horario de Consulta
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {clientConfig.timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingTime(slot)}
                            className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all border ${
                              bookingTime === slot
                                ? 'bg-[#0D9488] text-white border-[#0D9488] shadow-xs'
                                : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F0FDFA]'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Resumen del paso 1 */}
                    <div className="p-3 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-between text-xs">
                      <div>
                        <span className="block font-bold text-[#0F172A]">{bookingService.name}</span>
                        <span className="block text-[11px] text-[#475569]">
                          {bookingDate} a las {bookingTime} hrs
                        </span>
                      </div>
                      <span className="text-xs font-black text-[#0D9488]">
                        {bookingService.priceFrom}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleStep1Submit}
                      className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#0D9488]/20 transition-all hover:bg-[#0F766E] active:scale-98 flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: C.primary }}
                    >
                      Continuar a Datos de Contacto →
                    </button>
                  </div>
                )}

                {/* ── PASO 2: Nombre, WhatsApp + Motivo en Lista Cerrada (Sin Síntomas) ── */}
                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ej. Dr. Mauricio Sandoval"
                        className="w-full p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
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
                        className="w-full p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
                      />
                    </div>

                    {/* Motivo de consulta estrictamente como opción de lista */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                        Motivo Principal de Consulta (Selecciona una opción) *
                      </label>
                      <select
                        value={consultationReason}
                        onChange={(e) => setConsultationReason(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
                      >
                        {clientConfig.consultationReasons.map((r) => (
                          <option key={r.id} value={r.label}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Aviso de Privacidad y Confidencialidad Médica */}
                    <div className="p-3 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[#0D9488] font-bold text-[11px]">
                        <Lock size={13} />
                        <span>Privacidad Médica Garantizada</span>
                      </div>
                      <p className="text-[10px] text-[#475569] leading-relaxed">
                        Este formulario recopila únicamente tus datos básicos para apartar tu turno. <strong>No recopilamos historial clínico ni síntomas de salud</strong> por internet.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleStep2Submit}
                      className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#25D366]/25 transition-all hover:opacity-95 active:scale-98 flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: '#25D366' }}
                    >
                      <MessageCircle size={16} />
                      Solicitar Cita por WhatsApp
                    </button>
                  </div>
                )}

                {/* ── PASO 3: Éxito ── */}
                {bookingStep === 3 && (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-base font-black text-[#0F172A]">
                      ¡Solicitud de Cita Lista!
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed max-w-xs mx-auto">
                      Abriendo WhatsApp con los datos de tu cita para <strong>{bookingService.name}</strong> el <strong>{bookingDate}</strong> a las <strong>{bookingTime}</strong>...
                    </p>
                    <div className="pt-2">
                      <span className="inline-block w-6 h-6 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
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
              className="relative w-full max-w-md max-h-[85vh] bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl border-t sm:border border-[#E2E8F0] p-5 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">{modalService.name}</h3>
                  <span className="text-xs text-[#0D9488] font-semibold">{modalService.priceFrom}</span>
                </div>
                <button
                  onClick={() => setModalService(null)}
                  className="w-8 h-8 rounded-full bg-[#F8FAFC] text-[#475569] flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-[#F0FDFA] flex items-center justify-between text-xs">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#475569]">Inversión</span>
                  <span className="text-base font-black text-[#0D9488]">{modalService.priceFrom}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-[#475569]">Tiempo estimado</span>
                  <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                    <Clock size={12} className="text-[#0D9488]" /> {modalService.duration}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-[#475569] leading-relaxed">
                {modalService.description}
              </p>

              {modalService.includes && (
                <div className="mt-4 space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
                    ¿Qué incluye este procedimiento?
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#475569]">
                    {modalService.includes.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={14} className="text-[#0D9488] shrink-0 mt-0.5" />
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
                  className="flex-1 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#0D9488]/20"
                  style={{ backgroundColor: C.primary }}
                >
                  Agendar Este Procedimiento
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL AVISO DE PRIVACIDAD MÉDICA (LFPDPPP) ── */}
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
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 border border-[#E2E8F0] max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F8FAFC] text-[#475569] flex items-center justify-center hover:bg-[#F0FDFA]"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-tight">
                    Aviso de Privacidad Médica
                  </h3>
                  <p className="text-[10px] text-[#475569]">
                    Ley Federal de Protección de Datos Personales (LFPDPPP)
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#475569] leading-relaxed">
                <p>
                  En <strong>{clientConfig.businessName}</strong>, con domicilio en {clientConfig.address}, garantizamos el manejo confidencial de tus datos personales conforme a la LFPDPPP y la NOM-004-SSA3-2012 del expediente clínico.
                </p>
                <p>
                  <strong>Alcance digital:</strong> Esta plataforma digital solicita únicamente tu nombre, teléfono y motivo general de visita para agendar tu horario. <strong>No recopilamos ni almacenamos datos de salud, antecedentes médicos ni diagnósticos por medios digitales.</strong>
                </p>
                <p>
                  <strong>Confidencialidad:</strong> Toda información clínica y expediente médico se elabora de forma presencial bajo secreto profesional odontológico.
                </p>
                <p>
                  <strong>Derechos ARCO:</strong> Para dudas o revocación de datos de contacto, comunícate a <strong>{clientConfig.email}</strong> o vía WhatsApp al <strong>{clientConfig.phoneNumber}</strong>.
                </p>
              </div>

              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#0D9488] text-white font-bold text-xs uppercase tracking-wider hover:opacity-95"
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
