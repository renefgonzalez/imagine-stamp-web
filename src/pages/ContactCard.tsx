import React from 'react';
import { motion } from 'motion/react';
import {
  Phone, Mail, MapPin, Clock, Instagram, Facebook,
  MessageCircle, ExternalLink, Sparkles, ArrowRight, Copy, Check,
} from 'lucide-react';
import { useState } from 'react';

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
  logo: '/logo.png',
};

// WhatsApp message that opens directly to IMAGINE & STAMP chat
const WA_MSG = encodeURIComponent('¡Hola IMAGINE & STAMP! 👋 Vi tu tarjeta digital y quiero más información.');

export default function ContactCard() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-white/5 overflow-hidden">
          {/* Top accent */}
          <div className="h-2 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500" />

          <div className="p-8 text-center">
            {/* Logo + Brand */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-2xl shadow-orange-500/30"
            >
              <Sparkles size={42} className="text-white" />
            </motion.div>

            <h1 className="text-2xl font-black text-white tracking-tight mb-1">{DATA.businessName}</h1>
            <p className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-4">{DATA.tagline}</p>
            <p className="text-sm text-white/60 leading-relaxed mb-8 max-w-sm mx-auto">{DATA.description}</p>

            {/* Contact Buttons */}
            <div className="space-y-3 mb-8">
              {/* WhatsApp — MAIN CTA */}
              <motion.a
                href={`https://wa.me/${DATA.whatsapp}?text=${WA_MSG}`}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between gap-3 w-full px-5 py-4 rounded-2xl bg-[#25D366] text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-green-500/30"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle size={22} />
                  <span>Chatear por WhatsApp</span>
                </div>
                <ArrowRight size={18} />
              </motion.a>

              {/* Second Row: Phone + Copy */}
              <div className="grid grid-cols-2 gap-3">
                <motion.a
                  href={`tel:+52${DATA.phone.replace(/\s/g, '')}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
                >
                  <Phone size={14} /> {DATA.phone}
                </motion.a>
                <motion.button
                  onClick={() => handleCopy(DATA.phone, 'phone')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
                >
                  {copied === 'phone' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied === 'phone' ? 'Copiado' : 'Copiar Número'}
                </motion.button>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-3 mb-8 text-left">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
                <Mail size={16} className="text-orange-400 shrink-0" />
                <span className="text-sm text-white/70 truncate">{DATA.email}</span>
                <button onClick={() => handleCopy(DATA.email, 'email')} className="ml-auto text-white/30 hover:text-white transition-colors">
                  {copied === 'email' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
                <MapPin size={16} className="text-orange-400 shrink-0" />
                <span className="text-sm text-white/70">{DATA.address}</span>
              </div>
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
                <Clock size={16} className="text-orange-400 shrink-0 mt-0.5" />
                <span className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{DATA.hours}</span>
              </div>
            </div>

            {/* Social + Web */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <a href={DATA.instagram} target="_blank" rel="noreferrer"
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-pink-500/20"
              >
                <Instagram size={20} />
              </a>
              <a href={DATA.facebook} target="_blank" rel="noreferrer"
                className="w-11 h-11 rounded-xl bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-blue-500/20"
              >
                <Facebook size={20} />
              </a>
              <a href={DATA.website} target="_blank" rel="noreferrer"
                className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white hover:scale-110 hover:bg-white/20 transition-transform"
              >
                <ExternalLink size={20} />
              </a>
            </div>

            {/* Bottom pill: share this card */}
            <motion.a
              href={`https://wa.me/?text=${encodeURIComponent(`IMAGINE & STAMP — Personalización Profesional y Menús Digitales\n\n✨ Playeras, stickers, invitaciones, menús digitales y páginas web.\n📱 WhatsApp: ${DATA.phone}\n🌐 ${DATA.website}\n\n— ${DATA.businessName}`)}`}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-wider hover:text-white hover:border-white/30 transition-all"
            >
              <ExternalLink size={12} />
              Compartir esta tarjeta
            </motion.a>
          </div>
        </div>

        {/* Footer branding */}
        <p className="text-center text-white/10 text-[9px] font-bold uppercase tracking-[0.2em] mt-6">
          {DATA.businessName} © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}
