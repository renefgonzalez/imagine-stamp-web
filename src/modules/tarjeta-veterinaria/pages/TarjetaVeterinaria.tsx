// ═══════════════════════════════════════════════════════════════════════════
// TARJETA DIGITAL — Vita Vet Clínica Veterinaria
// Linktree / vCard premium · Teal Trust Mode · Mobile-First · CRO & Agendador
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Instagram, MapPin, MessageCircle,
  Facebook, Clock, ChevronRight, Phone, Shield,
  Stethoscope, Syringe, Pill, Scissors, Smile,
  Sparkles, Scan, AlertTriangle, Heart,
  PawPrint, TrendingUp, CheckCircle2, ExternalLink,
  X, Check, Dog, Cat
} from 'lucide-react';
import { clientConfig } from '../config';

interface TarjetaVeterinariaProps {
  className?: string;
}

type PetType = 'perro' | 'gato' | 'otro';

const linkItems = [
  {
    id: 'agendar',
    label: 'Agendar Cita Rápida',
    sublabel: 'Consulta, vacunas o estética',
    icon: Calendar,
    href: '#agendar',
    external: false,
    featured: true,
  },
  {
    id: 'urgencias',
    label: 'Urgencias Médicas 24/7',
    sublabel: 'Guardia médica sin cita previa',
    icon: AlertTriangle,
    href: `https://wa.me/${clientConfig.phone}?text=${encodeURIComponent('🚨 URGENCIA: Necesito atención veterinaria inmediata para mi mascota.')}`,
    external: true,
    featured: true,
    emergency: true,
  },
  {
    id: 'servicios',
    label: 'Servicios y Precios Clínicos',
    sublabel: 'Conoce qué incluye cada procedimiento',
    icon: Stethoscope,
    href: '#servicios',
    external: false,
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
    id: 'llamar',
    label: 'Llamar a la Clínica',
    sublabel: clientConfig.phoneNumber,
    icon: Phone,
    href: `tel:${clientConfig.phoneNumber.replace(/\s/g, '')}`,
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

export default function TarjetaVeterinaria({ className = '' }: TarjetaVeterinariaProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof clientConfig.services[0] | null>(null);
  const [petType, setPetType] = useState<PetType>('perro');
  const [petName, setPetName] = useState('');

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
    setPetName('');
  };

  const confirmAppointment = (service?: typeof clientConfig.services[0]) => {
    const s = service || selectedService;
    const petLabel = petType === 'perro' ? 'Perro 🐶' : petType === 'gato' ? 'Gato 🐱' : 'Mascota 🐾';
    const namePart = petName.trim() ? ` llamado/a "${petName.trim()}"` : '';

    let message = '';
    if (s) {
      message = `Hola ${clientConfig.businessName}, quiero agendar cita de *${s.name}* (${s.price}) para mi ${petLabel}${namePart}. ¿Qué horarios tienen disponibles?`;
    } else {
      message = `Hola ${clientConfig.businessName}, quiero agendar una cita para mi ${petLabel}${namePart}. ¿Qué horarios tienen disponibles hoy o mañana?`;
    }

    window.location.href = `https://wa.me/${clientConfig.phone}?text=${encodeURIComponent(message)}`;
  };

  const renderIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'stethoscope': return <Stethoscope size={size} />;
      case 'syringe': return <Syringe size={size} />;
      case 'pill': return <Pill size={size} />;
      case 'scissors': return <Scissors size={size} />;
      case 'tooth': return <Smile size={size} />;
      case 'sparkles': return <Sparkles size={size} />;
      case 'scan': return <Scan size={size} />;
      case 'alert-triangle': return <AlertTriangle size={size} />;
      default: return <PawPrint size={size} />;
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-0 sm:p-4 ${className}`}
      style={{ backgroundColor: C.bg, fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Contenedor central tipo móvil */}
      <div className="relative w-full max-w-md min-h-screen sm:min-h-0 sm:rounded-[2.5rem] sm:shadow-2xl sm:shadow-black/70 overflow-hidden border border-teal-800/40">
        
        {/* Fondo con imagen y overlay de alto contraste */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${clientConfig.backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-teal-950/92 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/95 via-teal-950/85 to-teal-950/98" />

        {/* Contenido Principal */}
        <div className="relative z-10 flex flex-col items-center px-5 py-8 min-h-screen sm:min-h-0">
          
          {/* ── HEADER / PERFIL ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center text-center"
          >
            {/* Foto de Perfil con Glow Teal */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-teal-400/90 shadow-[0_0_35px_rgba(20,184,166,0.4)]"
            >
              <img
                src={clientConfig.profileImage}
                alt={clientConfig.businessName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-teal-950 shadow-sm" title="Abierto Ahora" />
            </motion.div>

            {/* Nombre y Tagline */}
            <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              {clientConfig.businessName}
              <CheckCircle2 size={20} className="text-teal-400 inline-block fill-teal-400/20" />
            </h1>

            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-teal-300">
              {clientConfig.tagline}
            </p>

            <p className="mt-2 text-xs text-teal-100/70 max-w-xs leading-relaxed">
              {clientConfig.description}
            </p>

            {/* Badges de Confianza y Horarios */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                Urgencias 24/7
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-200 font-medium">
                <Clock size={12} className="text-teal-400" />
                {clientConfig.hours.split(',')[0]}
              </span>
            </div>
          </motion.div>

          {/* ── BOTÓN CTA PRINCIPAL: AGENDAR CITA CON SELECCIÓN DE MASCOTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-full mt-6"
          >
            <motion.button
              onClick={() => openAllServices()}
              whileHover={{ scale: 1.02, y: -2, boxShadow: '0 12px 35px rgba(20,184,166,0.45)' }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full flex items-center justify-between rounded-2xl px-5 py-4 text-white font-bold text-[15px] transition-all duration-300 overflow-hidden shadow-lg shadow-teal-500/20"
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
                  <span className="block text-[11px] font-normal text-teal-100/90">Elige fecha, mascota y servicio</span>
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
                    ? item.emergency
                      ? 'bg-red-500/15 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:bg-red-500/25'
                      : 'bg-teal-500/15 border-teal-500/60 shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:bg-teal-500/25'
                    : 'bg-teal-900/60 border-teal-800/80 hover:bg-teal-800/60 hover:border-teal-600'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all duration-200 ${
                      item.featured
                        ? item.emergency
                          ? 'bg-red-500 text-white shadow-md shadow-red-500/40'
                          : 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                        : 'bg-teal-800/50 text-teal-300 group-hover:bg-teal-500 group-hover:text-white'
                    }`}
                  >
                    <item.icon size={19} />
                  </span>
                  <div className="text-left truncate">
                    <span className="block text-[14px] font-semibold text-white truncate">
                      {item.label}
                    </span>
                    {item.sublabel && (
                      <span className="block text-[11px] text-teal-300/70 truncate">
                        {item.sublabel}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="text-teal-400/60 group-hover:text-teal-300 group-hover:translate-x-1 transition-all duration-200 shrink-0 ml-2"
                />
              </motion.a>
            ))}
          </div>

          {/* ── SECCIÓN: SERVICIOS Y PRECIOS (TARJETAS AMPLIAS Y COMPLETAS) ── */}
          <div className="w-full mt-7">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-teal-400" />
                Servicios y Cuidados
              </h2>
              <button
                onClick={() => openAllServices()}
                className="text-[11px] font-semibold text-teal-400 hover:text-teal-200 transition-colors"
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
                    borderColor: service.emergency ? 'rgba(239,68,68,0.5)' : C.border,
                  }}
                >
                  {/* Badge superior */}
                  <div className="flex items-center justify-between w-full mb-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all ${
                        service.emergency
                          ? 'bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white'
                          : 'bg-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-white'
                      }`}
                    >
                      {renderIcon(service.icon, 20)}
                    </div>
                    {service.badge && (
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          service.emergency
                            ? 'bg-red-500/30 text-red-300 border border-red-500/40'
                            : 'bg-teal-500/25 text-teal-200 border border-teal-400/30'
                        }`}
                      >
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Nombre y Subtítulo */}
                  <div>
                    <h3 className="text-[13px] font-bold text-white leading-tight group-hover:text-teal-300 transition-colors line-clamp-2">
                      {service.name}
                    </h3>
                    {service.subtitle && (
                      <p className="mt-1 text-[10px] text-teal-200/60 line-clamp-2 leading-relaxed">
                        {service.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Precio y Tiempo */}
                  <div className="mt-4 pt-3 border-t border-teal-800/50 flex items-center justify-between w-full">
                    <span className="text-[13px] font-black text-teal-400">
                      {service.price}
                    </span>
                    <span className="text-[10px] text-teal-300/70 flex items-center gap-1 font-medium">
                      <Clock size={10} />
                      {service.duration}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── FOOTER DE CONFIANZA & REDES SOCIALES ── */}
          <div className="mt-8 pt-6 border-t border-teal-800/40 flex flex-col items-center gap-4 w-full">
            
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
                  className="w-10 h-10 rounded-full bg-teal-900/70 border border-teal-700/60 flex items-center justify-center transition-colors duration-200 hover:bg-teal-500 hover:border-teal-500 text-teal-300 hover:text-white"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>

            {/* Sellos de Calidad y Confianza Médica */}
            <div className="grid grid-cols-3 gap-2 w-full text-center text-[10px] font-medium text-teal-300/80 pt-1">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-teal-900/30 border border-teal-800/40">
                <Shield size={14} className="text-teal-400" />
                <span>Médicos Titulados</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-teal-900/30 border border-teal-800/40">
                <CheckCircle2 size={14} className="text-teal-400" />
                <span>Instalaciones Sanitizadas</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-teal-900/30 border border-teal-800/40">
                <Heart size={14} className="text-rose-400" />
                <span>Trato Amoroso</span>
              </div>
            </div>

            {/* Crédito Oficial de Agencia */}
            <p className="text-[11px] text-teal-400/60 text-center">
              Diseñado por <a href="https://imagineandstamp.site" target="_blank" rel="noreferrer" className="font-bold text-teal-300 hover:underline">IMAGINE & STAMP</a>
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
              className="relative w-full max-w-lg max-h-[90vh] bg-teal-950 border-t-2 sm:border-2 border-teal-500 rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Barra superior con gradiente */}
              <div className="h-1.5 bg-gradient-to-r from-teal-400 via-teal-500 to-sky-400 shrink-0" />

              {/* Header del Modal */}
              <div className="p-5 pb-3 border-b border-teal-800/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    {selectedService ? renderIcon(selectedService.icon, 20) : <Stethoscope size={20} />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight leading-tight">
                      {selectedService ? selectedService.name : 'Servicios Veterinarios'}
                    </h2>
                    <p className="text-[11px] text-teal-300/70">
                      {selectedService ? selectedService.subtitle : 'Selecciona un procedimiento para agendar'}
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
                    <div className="p-4 rounded-2xl bg-teal-900/50 border border-teal-700/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400/80 block">
                          Costo estimado
                        </span>
                        <span className="text-2xl font-black text-teal-300">
                          {selectedService.price}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400/80 block">
                          Duración clínica
                        </span>
                        <span className="text-sm font-bold text-white flex items-center gap-1 justify-end">
                          <Clock size={13} className="text-teal-400" />
                          {selectedService.duration}
                        </span>
                      </div>
                    </div>

                    {/* ¿Para qué mascota es? (Selector interactivo) */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block mb-2">
                        ¿Para quién es la cita?
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'perro', label: 'Perro 🐶' },
                          { id: 'gato', label: 'Gato 🐱' },
                          { id: 'otro', label: 'Otro 🐾' },
                        ].map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPetType(p.id as PetType)}
                            className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all border ${
                              petType === p.id
                                ? 'bg-teal-500 text-white border-teal-400 shadow-md shadow-teal-500/30'
                                : 'bg-teal-900/40 text-teal-200/70 border-teal-800 hover:border-teal-600'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Nombre de la Mascota (Opcional) */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block mb-1.5">
                        Nombre de tu mascota (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Max, Luna, Toby..."
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                        className="w-full bg-teal-900/60 border border-teal-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-teal-500 focus:outline-none focus:border-teal-400 transition-colors"
                      />
                    </div>

                    {/* Qué incluye este servicio (Checklist Clínico) */}
                    {selectedService.includes && (
                      <div className="p-4 rounded-2xl bg-teal-900/30 border border-teal-800/60 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block mb-1">
                          ¿Qué incluye este procedimiento?
                        </span>
                        <ul className="space-y-1.5">
                          {selectedService.includes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-teal-100/90 leading-snug">
                              <Check size={14} className="text-teal-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Botón de Enviar a WhatsApp */}
                    <button
                      onClick={() => confirmAppointment()}
                      className="w-full py-4 rounded-2xl text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 transition-all hover:brightness-110 active:scale-[0.98]"
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
                      className="w-full py-2 text-xs font-semibold text-teal-400 hover:text-teal-200 transition-colors text-center"
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
                        className="group w-full flex items-center justify-between p-3.5 rounded-2xl bg-teal-900/40 border border-teal-800/70 hover:border-teal-500 transition-all text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              service.emergency ? 'bg-red-500/20 text-red-400' : 'bg-teal-500/20 text-teal-400'
                            }`}
                          >
                            {renderIcon(service.icon, 18)}
                          </div>
                          <div className="truncate">
                            <span className="block text-sm font-bold text-white truncate group-hover:text-teal-300 transition-colors">
                              {service.name}
                            </span>
                            <span className="block text-[11px] text-teal-300/60 truncate">
                              {service.subtitle}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-3">
                          <span className="block text-sm font-extrabold text-teal-400">
                            {service.price}
                          </span>
                          <span className="block text-[10px] text-teal-300/50">
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