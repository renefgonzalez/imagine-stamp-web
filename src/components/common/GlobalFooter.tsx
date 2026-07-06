import React from 'react';
import { MessageCircle, MailIcon, Instagram, Facebook, Lock } from 'lucide-react';
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

  return (
    <footer className="bg-white border-t border-primary/5 pt-12 pb-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-[50px] w-auto" />
            <h2 className="text-2xl font-black text-primary font-headline tracking-tighter">{companyName}</h2>
          </div>
          <p className="text-primary/60 text-sm max-w-xs">{description}</p>
        </div>
        
        <div className="space-y-6">
          <h3 className="font-headline font-bold text-primary text-lg">Contacto</h3>
          <div className="space-y-4 text-sm text-primary/70">
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-3">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-3">
              <MailIcon size={18} /> {email}
            </a>
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{address}</span>
            </div>
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{hours}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-headline font-bold text-primary text-lg">Síguenos</h3>
          <div className="flex gap-4">
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Instagram size={22} />
              </a>
            )}
            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Facebook size={22} />
              </a>
            )}
            {tiktokUrl && (
              <a href={tiktokUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center hover:bg-primary/10 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            )}
          </div>
          <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-4">
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">🎉 Promociones</p>
            <p className="text-xs text-primary/60 leading-relaxed">
              Síguenos en redes sociales para descubrir promociones semanales, descuentos por temporada y nuevos productos.
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-primary/5 text-center">
        <p className="text-primary/30 text-[10px] uppercase tracking-widest">
          © {year} {companyName}. Todos los derechos reservados.
        </p>
        
        {/* Textos Legales Permanentes */}
        <p className="text-primary/40 font-bold text-[10px] uppercase tracking-widest mt-2">
          Página web realizada por IMAGINE & STAMP.
        </p>
        <a 
          href="/privacidad" 
          className="text-primary/40 hover:text-primary transition-colors text-[10px] uppercase tracking-widest mt-2 inline-block font-bold"
        >
          Aviso de Privacidad y Términos de Servicio
        </a>

        <button 
          onClick={() => window.location.hash = '/admin'} 
          className="mt-4 text-primary/20 hover:text-primary/60 transition-colors flex items-center justify-center mx-auto" 
          aria-label="Admin Access"
        >
          <Lock size={16} />
        </button>
      </div>
    </footer>
  );
};
