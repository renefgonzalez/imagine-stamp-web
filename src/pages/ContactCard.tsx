import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Phone, Mail, MapPin, Clock, Instagram, Facebook,
  MessageCircle, ExternalLink, ArrowRight, Copy, Check, Flag,
} from 'lucide-react';
import logo from '../logo.png';

const DATA = {
  businessName: 'IMAGINE & STAMP',
  tagline: 'Personalización Profesional & Menús Digitales',
  description: 'Convertimos tus ideas en productos únicos. Playeras, stickers, invitaciones, menús digitales y páginas web con diseño de alto impacto.',
  phone: '56 5046 9993',
  whatsapp: '525650469993',
  email: 'imagineandstamp@gmail.com',
  instagram: 'https://www.instagram.com/personalizadosimagineandstamp',
  facebook: 'https://www.facebook.com/share/1CFhhieFeV/',
  website: 'https://imagineandstamp.site',
  address: 'Ciudad de México (CDMX) — Zona Iztapalapa / Tláhuac',
  hours: 'Lun - Vie: 9:00 AM - 6:00 PM\nSáb: 10:00 AM - 2:00 PM',
};

const C = {
  primary: '#002E5D',
  secondary: '#FF8C00',
  bg: '#F9F7F2',
  surface: '#FDFDFD',
};

const WA_MSG = encodeURIComponent('¡Hola IMAGINE & STAMP! 👋 Vi tu tarjeta digital y quiero más información.');

export default function ContactCard() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: C.bg }}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl border border-black/5 overflow-hidden" style={{ boxShadow: `0 25px 60px -12px ${C.primary}20` }}>
          {/* Top accent bar */}
          <div className="h-2" style={{ background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})` }} />

          <div className="p-8 text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.15 }}
              className="w-24 h-24 mx-auto mb-5 rounded-2xl bg-white border-2 flex items-center justify-center overflow-hidden shadow-lg"
              style={{ borderColor: `${C.secondary}30` }}
            >
              <img src={logo} alt={DATA.businessName} className="w-full h-full object-contain p-2" />
            </motion.div>

            {/* Brand Name */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-[26px] font-black tracking-tighter leading-none mb-1"
              style={{ color: C.primary }}
            >
              {DATA.businessName}
            </motion.h1>
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: C.secondary }}>{DATA.tagline}</p>
            <p className="text-sm leading-relaxed mb-8 max-w-sm mx-auto" style={{ color: `${C.primary}99` }}>{DATA.description}</p>

            {/* WhatsApp — MAIN CTA */}
            <motion.a
              href={`https://wa.me/${DATA.whatsapp}?text=${WA_MSG}`}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between gap-3 w-full px-5 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-wider mb-4 shadow-xl"
              style={{ backgroundColor: '#25D366', boxShadow: '0 10px 30px -5px rgba(37,211,102,0.4)' }}
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={22} />
                <span>Chatear por WhatsApp</span>
              </div>
              <ArrowRight size={18} />
            </motion.a>

            {/* Phone + Copy */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <motion.a
                href={`tel:+52${DATA.phone.replace(/\s/g, '')}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-colors"
                style={{ backgroundColor: C.primary }}
              >
                <Phone size={14} /> {DATA.phone}
              </motion.a>
              <motion.button
                onClick={() => handleCopy(DATA.phone, 'phone')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors"
                style={{ borderColor: `${C.primary}20`, color: `${C.primary}88` }}
              >
                {copied === 'phone' ? <Check size={14} style={{ color: C.secondary }} /> : <Copy size={14} />}
                {copied === 'phone' ? 'Copiado' : 'Copiar Número'}
              </motion.button>
            </div>

            {/* Info rows */}
            <div className="grid grid-cols-1 gap-3 mb-8 text-left">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: `${C.primary}08`, backgroundColor: C.surface }}>
                <Mail size={16} style={{ color: C.secondary }} className="shrink-0" />
                <span className="text-sm truncate" style={{ color: `${C.primary}99` }}>{DATA.email}</span>
                <button onClick={() => handleCopy(DATA.email, 'email')} className="ml-auto transition-colors hover:opacity-70" style={{ color: `${C.primary}40` }}>
                  {copied === 'email' ? <Check size={14} style={{ color: C.secondary }} /> : <Copy size={14} />}
                </button>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: `${C.primary}08`, backgroundColor: C.surface }}>
                <MapPin size={16} style={{ color: C.secondary }} className="shrink-0" />
                <span className="text-sm" style={{ color: `${C.primary}99` }}>{DATA.address}</span>
              </div>
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ borderColor: `${C.primary}08`, backgroundColor: C.surface }}>
                <Clock size={16} style={{ color: C.secondary }} className="shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed whitespace-pre-line" style={{ color: `${C.primary}99` }}>{DATA.hours}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <a href={DATA.instagram} target="_blank" rel="noreferrer"
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                style={{ background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)' }}
              >
                <Instagram size={20} />
              </a>
              <a href={DATA.facebook} target="_blank" rel="noreferrer"
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                style={{ backgroundColor: '#1877F2' }}
              >
                <Facebook size={20} />
              </a>
              <a href={DATA.website} target="_blank" rel="noreferrer"
                className="w-11 h-11 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                style={{ backgroundColor: `${C.primary}10`, color: C.primary }}
              >
                <ExternalLink size={20} />
              </a>
            </div>

            {/* Share button */}
            <motion.a
              href={`https://wa.me/?text=${encodeURIComponent(`IMAGINE & STAMP — Personalización Profesional y Menús Digitales\n\n✨ Playeras, stickers, invitaciones, menús digitales y páginas web.\n📱 WhatsApp: ${DATA.phone}\n🌐 ${DATA.website}\n\n— ${DATA.businessName}`)}`}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all hover:opacity-70"
              style={{ borderColor: `${C.primary}15`, color: `${C.primary}50` }}
            >
              <ExternalLink size={12} />
              Compartir esta tarjeta
            </motion.a>
          </div>

          {/* Bottom bar with brand */}
          <div className="py-4 text-center border-t" style={{ borderColor: `${C.primary}08`, backgroundColor: C.surface }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: `${C.primary}30` }}>
              © {new Date().getFullYear()} {DATA.businessName}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
