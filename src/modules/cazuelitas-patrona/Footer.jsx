import React from 'react';
import { Clock, Bike, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0f0a07] border-t border-[#D35400]/20 py-8 px-4 mt-8">
      <div className="max-w-md mx-auto flex flex-col items-center gap-6 text-center">
        
        <div className="space-y-4 w-full">
          {/* Horario */}
          <div className="flex flex-col items-center gap-1">
            <div className="bg-[#1A110D] p-2 rounded-full border border-[#D35400]/30 mb-1">
              <Clock size={20} className="text-[#D35400]" />
            </div>
            <p className="text-[#F9E79F]/60 text-xs font-bold uppercase tracking-widest">Horario</p>
            <p className="text-white text-sm font-medium">6:30 am - 1:30 pm</p>
          </div>

          {/* Servicio */}
          <div className="flex flex-col items-center gap-1">
            <div className="bg-[#1A110D] p-2 rounded-full border border-[#D35400]/30 mb-1">
              <Bike size={20} className="text-[#D35400]" />
            </div>
            <p className="text-[#F9E79F]/60 text-xs font-bold uppercase tracking-widest">Servicio</p>
            <p className="text-white text-sm font-medium">Servicio a domicilio disponible <br/><span className="text-xs opacity-70">(costo extra)</span></p>
          </div>

          {/* Contacto */}
          <div className="flex flex-col items-center gap-1">
            <div className="bg-[#1A110D] p-2 rounded-full border border-[#D35400]/30 mb-1">
              <MessageCircle size={20} className="text-[#25D366]" />
            </div>
            <p className="text-[#F9E79F]/60 text-xs font-bold uppercase tracking-widest">Contacto</p>
            <a href="https://wa.me/529381281914" className="text-white text-sm font-medium hover:text-[#25D366] transition-colors">
              WhatsApp: 938 128 1914
            </a>
          </div>
        </div>

        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D35400]/50 to-transparent my-2"></div>
        
        <p className="text-[#F9E79F]/40 text-xs italic tracking-wider">
          Auténticas Cazuelitas La Patrona
        </p>
      </div>
    </footer>
  );
};

export default Footer;
