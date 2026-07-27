import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Mail, MapPin, Clock, Instagram, Facebook, Lock, X, ExternalLink, Sparkles, Shield } from 'lucide-react';
import logo from '../../logo.png';

interface FooterProps {
  companyName?: string;
  description?: string;
  whatsappNumber?: string;
  email?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  address?: string;
  hours?: string;
}

export const GlobalFooter: React.FC<FooterProps> = ({
  companyName = 'Imagine & Stamp',
  description = 'Personalizamos tus momentos más especiales con diseños creativos y alta calidad.',
  whatsappNumber = '525650469993',
  email = 'imagineandstamp@gmail.com',
  instagramUrl = 'https://www.instagram.com/personalizadosimagineandstamp',
  facebookUrl = 'https://www.facebook.com/share/1CFhhieFeV/?mibextid=wwXIfr',
  tiktokUrl = 'https://www.tiktok.com/@TU_USUARIO_AQUI',
  address = 'Ciudad de México (CDMX)',
  hours = 'Lun - Vie: 9:00 - 18:00 | Sáb: 10:00 - 14:00'
}) => {
  const year = new Date().getFullYear();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="relative bg-gradient-to-b from-white via-white to-slate-50 border-t border-slate-100 pt-16 pb-0 overflow-hidden">
        {/* Decorative top line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          {/* ── 3 Columnas ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
            {/* Col 1: Marca */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={logo} alt={companyName} className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-primary font-headline tracking-tighter leading-tight">{companyName}</h2>
                </div>
              </div>
              <p className="text-primary/60 text-sm leading-relaxed max-w-xs">{description}</p>
            </div>

            {/* Col 2: Contacto */}
            <div className="space-y-5">
              <h3 className="font-headline font-black text-primary/80 text-xs uppercase tracking-[0.2em]">Contacto</h3>
              <div className="space-y-3.5">
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"
                  className="group flex items-center gap-3 text-sm text-primary/60 hover:text-primary transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors shrink-0">
                    <MessageCircle size={16} className="text-[#25D366]" />
                  </span>
                  <span className="font-medium">WhatsApp</span>
                </a>
                <a href={`mailto:${email}`}
                  className="group flex items-center gap-3 text-sm text-primary/60 hover:text-primary transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                    <Mail size={16} />
                  </span>
                  <span className="font-medium truncate">{email}</span>
                </a>
                <a 
                  href="https://maps.app.goo.gl/bSuw4zRaLAUdcnM27" 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex items-center gap-3 text-sm text-primary/60 hover:text-primary transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <MapPin size={16} />
                  </span>
                  <span className="font-medium leading-relaxed">{address}</span>
                </a>
                <div className="flex items-center gap-3 text-sm text-primary/60">
                  <span className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <Clock size={16} />
                  </span>
                  <span className="font-medium leading-relaxed whitespace-pre-line">{hours}</span>
                </div>
              </div>
            </div>

            {/* Col 3: Redes Sociales */}
            <div className="space-y-5">
              <h3 className="font-headline font-black text-primary/80 text-xs uppercase tracking-[0.2em]">Síguenos</h3>
              <div className="flex gap-3">
                {instagramUrl && instagramUrl !== 'https://instagram.com/' && (
                  <a href={instagramUrl} target="_blank" rel="noreferrer"
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 hover:scale-110 transition-transform"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                {facebookUrl && facebookUrl !== 'https://facebook.com/' && (
                  <a href={facebookUrl} target="_blank" rel="noreferrer"
                    className="w-11 h-11 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 hover:scale-110 transition-transform"
                  >
                    <Facebook size={20} />
                  </a>
                )}
                {tiktokUrl && tiktokUrl !== 'https://tiktok.com/@' && (
                  <a href={tiktokUrl} target="_blank" rel="noreferrer"
                    className="w-11 h-11 rounded-xl bg-black flex items-center justify-center text-white shadow-lg shadow-black/20 hover:scale-110 transition-transform"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                )}
              </div>
              <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-secondary" />
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Promociones</p>
                </div>
                <p className="text-xs text-primary/50 leading-relaxed">
                  Síguenos en redes para descubrir promociones semanales, descuentos y nuevos productos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Barra Inferior: Agencia + Legales ── */}
        <div className="bg-gradient-to-r from-primary via-primary to-slate-900 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col items-center gap-4 text-center">
              {/* Copyright dinámico */}
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                © {year} {companyName.toUpperCase()}. TODOS LOS DERECHOS RESERVADOS.
              </p>

              {/* Firma de Agencia — ESCAPARATE para nuevos clientes */}
              <motion.a
                href="https://imagineandstamp.site"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-secondary/40 transition-all duration-300"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 group-hover:text-white/70 transition-colors">
                  Página web realizada por
                </span>
                <span className="text-sm font-black text-secondary tracking-tight group-hover:scale-105 transition-transform">
                  IMAGINE & STAMP
                </span>
                <ExternalLink size={12} className="text-secondary/50 group-hover:text-secondary transition-colors" />
              </motion.a>

              {/* Separador sutil */}
              <div className="w-16 h-px bg-white/10" />

              {/* Aviso de Privacidad + Admin */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  <Shield size={12} />
                  Aviso de Privacidad
                </button>
                <span className="text-white/20">·</span>
                <button
                  onClick={() => window.location.hash = '/admin'}
                  className="flex items-center gap-1.5 text-white/20 hover:text-white/50 transition-colors"
                  aria-label="Admin Access"
                >
                  <Lock size={11} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Modal de Aviso de Privacidad ── */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#1a1a1a] border-2 border-secondary rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-secondary via-orange-400 to-secondary" />

              <div className="p-8">
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Shield size={20} className="text-secondary" />
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight uppercase">Aviso de Privacidad</h2>
                </div>

                <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                  <p>
                    En <strong className="text-white">{companyName}</strong> protegemos y respetamos tu privacidad.
                    Toda la información personal que compartes mediante nuestros formularios de pedido se utiliza
                    exclusivamente para el procesamiento de tus pedidos y la comunicación directa contigo.
                  </p>
                  <p>
                    No almacenamos datos de tarjetas bancarias. Los pagos con tarjeta se procesan a través de
                    plataformas seguras externas. Tus datos de contacto (nombre y WhatsApp) solo se usan para
                    confirmar tu pedido y notificarte sobre su estado. Nunca compartimos tu información con
                    terceros sin tu consentimiento explícito.
                  </p>
                  <p>
                    Si deseas que eliminemos tus datos de nuestros registros, contáctanos en{' '}
                    <a href={`mailto:${email}`} className="text-secondary hover:underline">{email}</a>.
                  </p>
                </div>

                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="mt-8 w-full py-3 rounded-xl bg-secondary text-white font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-colors"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
