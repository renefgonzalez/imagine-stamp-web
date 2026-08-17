// ═══════════════════════════════════════════════════════════════════════════
// TARJETA DIGITAL — Gentleman's Cut Barbería
// Linktree / vCard premium · Dark Mode · Mobile-First
// ═══════════════════════════════════════════════════════════════════════════

import { motion } from 'motion/react';
import {
  Calendar, Instagram, MapPin, Scissors,
  MessageCircle, Facebook, Clock, ChevronRight,
} from 'lucide-react';
import { clientConfig } from '../config';

interface TarjetaBarberiaProps {
  className?: string;
}

const linkItems = [
  {
    id: 'agendar',
    label: 'Agendar Cita',
    icon: Calendar,
    href: `https://wa.me/${clientConfig.phone}?text=${encodeURIComponent('Hola, quiero agendar una cita')}`,
    external: true,
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
    icon: MapPin,
    href: clientConfig.mapsUrl,
    external: true,
    featured: false,
  },
  {
    id: 'servicios',
    label: 'Lista de Servicios y Precios',
    icon: Scissors,
    href: '#',
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
  const handleNav = (label: string) => {
    console.log(`[TarjetaBarberia] Navegando a: ${label}`);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${className}`}
      style={{ backgroundColor: C.bg, fontFamily: "'Playfair Display', 'Inter', serif" }}
    >
      {/* Contenedor centrado tipo móvil */}
      <div className="relative w-full max-w-md min-h-screen md:min-h-0 md:rounded-[2.5rem] md:shadow-2xl md:shadow-black/60 overflow-hidden">
        {/* ── Fondo: imagen de barbería con overlay oscuro ── */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${clientConfig.backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />

        {/* ── Contenido ── */}
        <div className="relative z-10 flex flex-col items-center px-6 py-10 min-h-screen md:min-h-0">
          {/* HEADER / PERFIL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-28 h-28 rounded-full overflow-hidden border-2 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.35)]"
            >
              <img
                src={clientConfig.profileImage}
                alt="Gentleman's Cut Barbería"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-5 text-3xl font-bold tracking-tight text-white"
            >
              {clientConfig.businessName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5 }}
              className="mt-1 text-sm text-zinc-400"
            >
              {clientConfig.tagline}
            </motion.p>

            {/* Horario — detalle sutil */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.26, duration: 0.5 }}
              className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500"
            >
              <Clock size={12} className="text-amber-500/70" />
              {clientConfig.hours}
            </motion.div>
          </motion.div>

          {/* BOTONES INTERACTIVOS */}
          <div className="w-full mt-8 space-y-3">
            {linkItems.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => handleNav(item.label)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.45 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 border ${
                  item.featured
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-[0_0_24px_rgba(245,158,11,0.25)]'
                    : 'bg-zinc-900/60 border-zinc-800 hover:bg-amber-500/10 hover:border-amber-500'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 transition-all duration-300 ${
                    item.featured
                      ? 'bg-amber-500 text-black'
                      : 'bg-amber-500/20 text-amber-500 group-hover:bg-amber-500 group-hover:text-black'
                  }`}
                >
                  <item.icon size={20} />
                </span>
                <span className="flex-1 text-left text-[15px] font-semibold text-white">
                  {item.label}
                </span>
                <ChevronRight
                  size={18}
                  className="text-zinc-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all duration-300"
                />
              </motion.a>
            ))}
          </div>

          {/* FOOTER: iconos sociales */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex items-center gap-4 mt-8"
          >
            {socialItems.map((social) => (
              <motion.a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="w-11 h-11 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center transition-colors duration-300 hover:bg-amber-500 hover:border-amber-500"
              >
                <social.icon size={18} className="text-zinc-400 group-hover:text-black" />
              </motion.a>
            ))}
          </motion.div>

          {/* Crédito */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="mt-6 text-xs text-zinc-500 text-center"
          >
            Diseño por <span className="font-semibold text-zinc-400">Imagine &amp; Stamp</span>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
