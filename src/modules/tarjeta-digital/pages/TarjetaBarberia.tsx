// ═══════════════════════════════════════════════════════════════════════════
// TARJETA DIGITAL — Gentleman's Cut Barbería (Patrón CRO Completo)
// Linktree / vCard premium · Dark Mode · Mobile-First · Agendador + Modales
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Instagram, MapPin, Scissors,
  MessageCircle, Facebook, Clock, ChevronRight,
  Sparkles, Crown, Pill, X, Check,
  CheckCircle2, Crown as CrownIcon
} from 'lucide-react';
import { clientConfig } from '../config';

interface TarjetaBarberiaProps {
  className?: string;
}

const linkItems = [
  {
    id: 'agendar',
    label: 'Agendar Cita Rápida',
    sublabel: 'Corte, barba, facial o paquete',
    icon: Calendar,
    href: '#agendar',
    external: false,
    featured: true,
  },
  {
    id: 'instagram',
    label: 'Portafolio en Instagram',
    icon: Instagram,
    href: clientConfig.instagramUrl,
    external: true,
    featured: false,
  },
  {
    id: 'maps',
    label: 'Cómo llegar (Google Maps)',
    sublabel: clientConfig.address,
    icon: MapPin,
    href: clientConfig.mapsUrl,
    external: true,
    featured: false,
  },
  {
    id: 'servicios',
    label: 'Servicios y Precios Completos',
    icon: Scissors,
    href: '#servicios',
    external: false,
    featured: false,
  },
];

const socialItems = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, href: clientConfig.instagramUrl },
  { id: 'facebook', label: 'Facebook', icon: Facebook, href: clientConfig.facebookUrl },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/${clientConfig.phone}` },
];

const C = clientConfig.colors;

export default function TarjetaBarberia({ className = '' }: TarjetaBarberiaProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof clientConfig.services[0] | null>(null);

  const openServiceDetail = (service: typeof clientConfig.services[0]) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const openAllServices = () => {
    setSelectedService(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const confirmAppointment = (service?: typeof clientConfig.services[0]) => {
    const s = service || selectedService;
    let message = '';
    if (s) {
      message = `Hola ${clientConfig.businessName}, quiero agendar cita de *${s.name}* (${s.price}). ¿Qué horarios tienen disponibles?`;
    } else {
      message = `Hola ${clientConfig.businessName}, quiero agendar una cita. ¿Qué horarios tienen disponibles hoy o mañana?`;
    }

    window.location.href = `https://wa.me/${clientConfig.phone}?text=${encodeURIComponent(message)}`;
  };

  const renderIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'scissors': return <Scissors size={size} />;
      case 'sparkles': return <Sparkles size={size} />;
      case 'crown': return <CrownIcon size={size} />;
      case 'pill': return <Pill size={size} />;
      default: return <Scissors size={size} />;
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-0 sm:p-4 ${className}`}
      style={{ backgroundColor: C.bg, fontFamily: "'Playfair Display', 'Inter', serif" }}
    >
      {/* Contenedor central tipo móvil */}
      <div className="relative w-full max-w-md min-h-screen sm:min-h-0 sm:rounded-[2.5rem] sm:shadow-2xl sm:shadow-black/70 overflow-hidden border border-zinc-800/40">
        
        {/* Fondo con imagen y overlay de alto contraste */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${clientConfig.backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-zinc-950/92 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/95 via-zinc-950/85 to-zinc-950/98" />

        {/* Contenido Principal */}
        <div className="relative z-10 flex flex-col items-center px-5 py-8 min-h-screen sm:min-h-0">
          
          {/* ── HEADER / PERFIL ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center text-center"
          >
            {/* Foto de Perfil con Glow Amber */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500/90 shadow-[0_0_35px_rgba(245,158,11,0.4)]"
            >
              <img
                src={clientConfig.profileImage}
                alt={clientConfig.businessName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-950 shadow-sm" title="Abierto Ahora" />
            </motion.div>

            {/* Nombre y Tagline */}
            <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              {clientConfig.businessName}
              <CheckCircle2 size={20} className="text-amber-400 inline-block fill-amber-400/20" />
            </h1>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
              {clientConfig.tagline}
            </p>

            <p className="mt-2 text-xs text-zinc-100/70 max-w-xs leading-relaxed">
              {clientConfig.description}
            </p>

            {/* Badges de Confianza y Horarios */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                Abierto
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/80 text-zinc-300 font-medium">
                <Clock size={12} className="text-amber-400" />
                {clientConfig.hours.split(',')[0]}
              </span>
            </div>
          </motion.div>

          {/* ── BOTÓN CTA PRINCIPAL: AGENDAR CITA ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-full mt-6"
          >
            <motion.button
              onClick={() => openAllServices()}
              whileHover={{ scale: 1.02, y: -2, boxShadow: '0 12px 35px rgba(245,158,11,0.45)' }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full flex items-center justify-between rounded-2xl px-5 py-4 text-white font-bold text-[15px] transition-all duration-300 overflow-hidden shadow-lg shadow-amber-500/20"
              style={{
                background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentGlow} 100%)`,
                border: `1px solid rgba(255,255,255,0.2)`,
              }}
            >
              <span className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 shrink-0 transition-all duration-300 group-hover:bg-white/30">
                  <Calendar size={20} />
                </span>
                <span className="text-left">
                  <span className="block text-white leading-tight">Agendar Cita en Línea</span>
                  <span className="block text-[11px] font-normal text-zinc-100/90">Elige servicio y horario</span>
                </span>
              </span>
              <ChevronRight
                size={20}
                className="text-white/80 group-hover:translate-x-1 group-hover:text-white transition-all duration-300 shrink-0"
              />
            </motion.button>
          </motion.div>

          {/* ── BOTONES DE ENLACE RÁPIDO ── */}
          <div className="w-full mt-4 space-y-2.5">
            {linkItems.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (item.id === 'agendar' || item.id === 'servicios') {
                    e.preventDefault();
                    openAllServices();
                  }
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05, duration: 0.35 }}
                whileHover={{ scale: 1.015, y: -1.5 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex items-center justify-between rounded-2xl p-3.5 transition-all duration-200 border ${
                  item.featured
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:bg-amber-500/25'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/60 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all duration-200 ${
                      item.featured
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                        : 'bg-zinc-800/50 text-zinc-300 group-hover:bg-amber-500 group-hover:text-white'
                    }`}
                  >
                    <item.icon size={19} />
                  </span>
                  <div className="text-left truncate">
                    <span className="block text-[14px] font-semibold text-white truncate">
                      {item.label}
                    </span>
                    {item.sublabel && (
                      <span className="block text-[11px] text-zinc-300/70 truncate">
                        {item.sublabel}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="text-zinc-500/60 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-200 shrink-0 ml-2"
                />
              </motion.a>
            ))}
          </div>

          {/* ── SECCIÓN: SERVICIOS Y PRECIOS (TARJETAS AMPLIAS Y COMPLETAS) ── */}
          <div className="w-full mt-7">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                Servicios y Grooming
              </h2>
              <button
                onClick={() => openAllServices()}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-200 transition-colors"
              >
                Ver todos ({clientConfig.services.length}) →
              </button>
            </div>

            {/* Carrusel horizontal con tarjetas mejor diseñadas */}
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-none snap-x snap-mandatory">
              {clientConfig.services.slice(0, 5).map((service, i) => (
                <motion.button
                  key={service.name}
                  onClick={() => openServiceDetail(service)}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex flex-col justify-between w-44 shrink-0 p-4 rounded-2xl transition-all duration-200 border text-left snap-start"
                  style={{
                    backgroundColor: `${C.card}E6`,
                    borderColor: C.border,
                  }}
                >
                  {/* Badge superior */}
                  <div className="flex items-center justify-between w-full mb-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all ${
                        'bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-white'
                      }`}
                    >
                      {renderIcon(service.icon, 20)}
                    </div>
                    {service.badge && (
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-200 border border-amber-400/30`}
                      >
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Nombre y Subtítulo */}
                  <div>
                    <h3 className="text-[13px] font-bold text-white leading-tight group-hover:text-amber-300 transition-colors line-clamp-2">
                      {service.name}
                    </h3>
                    {service.subtitle && (
                      <p className="mt-1 text-[10px] text-zinc-200/60 line-clamp-2 leading-relaxed">
                        {service.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Precio y Tiempo */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center justify-between w-full">
                    <span className="text-[13px] font-black text-amber-400">
                      {service.price}
                    </span>
                    <span className="text-[10px] text-zinc-300/70 flex items-center gap-1 font-medium">
                      <Clock size={10} />
                      {service.duration}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── FOOTER DE CONFIANZA & REDES SOCIALES ── */}
          <div className="mt-8 pt-6 border-t border-zinc-800/40 flex flex-col items-center gap-4 w-full">
            
            {/* Redes Sociales */}
            <div className="flex items-center gap-3">
              {socialItems.map((social) => (
                <motion.a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-10 h-10 rounded-full bg-zinc-900/70 border border-zinc-700/60 flex items-center justify-center transition-colors duration-200 hover:bg-amber-500 hover:border-amber-500 text-zinc-300 hover:text-white"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>

            {/* Sellos de Calidad */}
            <div className="grid grid-cols-3 gap-2 w-full text-center text-[10px] font-medium text-zinc-300/80 pt-1">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-zinc-900/30 border border-zinc-800/40">
                <CheckCircle2 size={14} className="text-amber-400" />
                <span>Barberos Expertos</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-zinc-900/30 border border-zinc-800/40">
                <CrownIcon size={14} className="text-amber-400" />
                <span>Productos Premium</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-zinc-900/30 border border-zinc-800/40">
                <Sparkles size={14} className="text-amber-400" />
                <span>Ambiente Exclusivo</span>
              </div>
            </div>

            {/* Crédito Oficial de Agencia */}
            <p className="text-[11px] text-zinc-400/60 text-center">
              Diseñado por <a href="https://imagineandstamp.site" target="_blank" rel="noreferrer" className="font-bold text-zinc-300 hover:underline">IMAGINE & STAMP</a>
            </p>
          </div>

        </div>
      </div>

      {/* ── MODAL INTERACTIVO: DETALLE DE SERVICIO / AGENDADOR CRO ── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Contenido del Modal (Bottom Sheet en móvil, Modal centrado en Desktop) */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg max-h-[90vh] bg-zinc-950 border-t-2 sm:border-2 border-amber-500 rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Barra superior con gradiente */}
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shrink-0" />

              {/* Header del Modal */}
              <div className="p-5 pb-3 border-b border-zinc-800/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    {selectedService ? renderIcon(selectedService.icon, 20) : <Scissors size={20} />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight leading-tight">
                      {selectedService ? selectedService.name : 'Servicios de Barbería'}
                    </h2>
                    <p className="text-[11px] text-zinc-300/70">
                      {selectedService ? selectedService.subtitle : 'Selecciona un servicio para agendar'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Cuerpo del Modal */}
              <div className="p-5 overflow-y-auto space-y-5">
                
                {selectedService ? (
                  /* ── VISTA DETALLADA DEL SERVICIO SELECCIONADO (CRO ALTO) ── */
                  <div className="space-y-4">
                    
                    {/* Tarjeta de Precio y Tiempo */}
                    <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-700/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 block">
                          Costo estimado
                        </span>
                        <span className="text-2xl font-black text-amber-300">
                          {selectedService.price}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 block">
                          Duración
                        </span>
                        <span className="text-sm font-bold text-white flex items-center gap-1 justify-end">
                          <Clock size={13} className="text-amber-400" />
                          {selectedService.duration}
                        </span>
                      </div>
                    </div>

                    {/* Qué incluye este servicio (Checklist) */}
                    {selectedService.includes && (
                      <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 block mb-1">
                          ¿Qué incluye este servicio?
                        </span>
                        <ul className="space-y-1.5">
                          {selectedService.includes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-zinc-100/90 leading-snug">
                              <Check size={14} className="text-amber-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Botón de Enviar a WhatsApp */}
                    <button
                      onClick={() => confirmAppointment()}
                      className="w-full py-4 rounded-2xl text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all hover:brightness-110 active:scale-[0.98]"
                      style={{
                        background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentGlow} 100%)`,
                      }}
                    >
                      <MessageCircle size={18} />
                      Confirmar Cita por WhatsApp
                    </button>

                    {/* Ver todos los demás servicios */}
                    <button
                      onClick={() => setSelectedService(null)}
                      className="w-full py-2 text-xs font-semibold text-amber-400 hover:text-amber-200 transition-colors text-center"
                    >
                      ← Ver los demás servicios disponibles
                    </button>

                  </div>
                ) : (
                  /* ── VISTA DE CATÁLOGO COMPLETO DE SERVICIOS ── */
                  <div className="space-y-2.5">
                    {clientConfig.services.map((service) => (
                      <motion.button
                        key={service.name}
                        onClick={() => setSelectedService(service)}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        className="group w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 hover:border-amber-500 transition-all text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-500/20 text-amber-400`}
                          >
                            {renderIcon(service.icon, 18)}
                          </div>
                          <div className="truncate">
                            <span className="block text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                              {service.name}
                            </span>
                            <span className="block text-[11px] text-zinc-300/60 truncate">
                              {service.subtitle}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-3">
                          <span className="block text-sm font-extrabold text-amber-400">
                            {service.price}
                          </span>
                          <span className="block text-[10px] text-zinc-300/50">
                            {service.duration}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}