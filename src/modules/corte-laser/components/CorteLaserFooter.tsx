import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Lock } from 'lucide-react';

interface CorteLaserFooterProps {
  onAdminAccess?: () => void;
}

export default function CorteLaserFooter({ onAdminAccess }: CorteLaserFooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-200 border-t border-gray-800 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Marca y Descripción */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-bold text-gray-900 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                CL
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                Corte Láser
              </h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transformamos tus ideas en piezas únicas con tecnología de precisión. Diseño, calidad y detalle en cada corte.
            </p>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wide">Contacto</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3 hover:text-cyan-400 transition-colors cursor-pointer group">
                <Phone className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                <span>+52 (55) 1234 5678</span>
              </li>
              <li className="flex items-center gap-3 hover:text-cyan-400 transition-colors cursor-pointer group">
                <Mail className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                <span>contacto@cortelaser.com</span>
              </li>
              <li className="flex items-center gap-3 hover:text-cyan-400 transition-colors cursor-pointer group">
                <MapPin className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                <span>Av. de la Luz #123, Ciudad de México</span>
              </li>
            </ul>
          </div>

          {/* Horario de Atención */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wide">Horario</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span>Lunes - Viernes:</span>
                <span className="text-cyan-500">9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span>Sábados:</span>
                <span className="text-cyan-500">10:00 AM - 2:00 PM</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Domingos:</span>
                <span className="text-gray-500">Cerrado</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wide">Síguenos</h3>
            <p className="text-sm text-gray-400 mb-4">Descubre nuestros últimos trabajos y promociones.</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-gray-900 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-gray-900 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-gray-900 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Barra Inferior */}
        <div className="pt-8 border-t border-gray-800 flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-gray-500 text-center">
            © 2026 Corte Láser. Todos los derechos reservados.
          </p>
          <p className="text-sm text-gray-500 text-center">
            Página web realizada por{' '}
            <span className="text-cyan-400 font-semibold tracking-wide drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
              IMAGINE & STAMP
            </span>
            . Aviso de Privacidad y Términos de Servicio
          </p>
          {onAdminAccess && (
            <button 
              onClick={onAdminAccess}
              className="mt-4 p-2 text-gray-600 hover:text-cyan-400 transition-colors"
              title="Admin"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
