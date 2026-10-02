import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, AlertTriangle, ShieldCheck, Map, Instagram, Facebook, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  const basePrefix = '/izta-popo';

  return (
    <footer className="w-full bg-[#080909] text-[#9AA3A0] border-t border-white/[0.08] pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner de Ética y Respeto al Parque Nacional */}
        <div className="mb-12 p-5 rounded-2xl bg-[#1A1C1B]/80 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#3F6B4F]/20 text-[#7ec295] border border-[#3F6B4F]/40 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F2F1EC]">Código de Montaña Ética & Huella Cero</h4>
              <p className="text-xs text-[#9AA3A0] mt-0.5">
                Respeta el Parque Nacional Izta-Popo Zoquiapan: no dejes basura, no extraigas plantas ni piedras, camina solo por senderos marcados y registra tu acceso en Paso de Cortés.
              </p>
            </div>
          </div>
          <a
            href="https://www.gob.mx/conanp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#E8A15A] hover:underline whitespace-nowrap"
          >
            Normativa CONANP →
          </a>
        </div>

        {/* Columnas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Columna 1: Marca */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8A15A]/15 border border-[#E8A15A]/30 flex items-center justify-center text-[#E8A15A]">
                <Mountain className="w-5 h-5" />
              </div>
              <span className="font-serif tracking-widest text-lg font-bold text-[#F2F1EC]">
                IZTA<span className="text-[#E8A15A]">·</span>POPO
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#9AA3A0]">
              Expediciones de alta montaña, ecología y arqueología en los colosos del Valle de México. Documentación fotográfica de ultra alta resolución y cartografía 3D interactiva.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#9AA3A0]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:text-[#E8A15A] hover:bg-white/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:text-[#E8A15A] hover:bg-white/10 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Columna 2: Navegación rápida */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-[#F2F1EC] mb-4">Exploración</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to={`${basePrefix}/explorar`} className="hover:text-[#E8A15A] transition-colors flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#E8A15A]" />
                  <span>Mapa 3D del macizo</span>
                </Link>
              </li>
              <li>
                <Link to={`${basePrefix}/flora`} className="hover:text-[#E8A15A] transition-colors">
                  Pisos ecológicos & Flora
                </Link>
              </li>
              <li>
                <Link to={`${basePrefix}/bitacora`} className="hover:text-[#E8A15A] transition-colors">
                  Bitácora de expediciones
                </Link>
              </li>
              <li>
                <Link to={`${basePrefix}/recorre-conmigo`} className="hover:text-[#E8A15A] transition-colors">
                  Recorre conmigo (Tours guiados)
                </Link>
              </li>
              <li>
                <Link to={`${basePrefix}/como-funciona`} className="hover:text-[#E8A15A] transition-colors">
                  Cómo funciona este portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Semáforo CENAPRED */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-[#F2F1EC] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C2502E]" />
              Monitoreo Volcánico
            </h5>
            <div className="p-3.5 rounded-xl bg-[#C2502E]/10 border border-[#C2502E]/30 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8A15A] animate-ping" />
                <span className="font-medium text-[#F2F1EC]">Semáforo Amarillo Fase 2</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#9AA3A0]">
                Prohibido rebasar el radio de exclusión de 12 km del cráter del Popocatépetl. Respeta los comunicados de Protección Civil.
              </p>
              <a
                href="https://www.gob.mx/cenapred"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[11px] text-[#C2502E] font-medium hover:underline pt-1"
              >
                Consultar CENAPRED oficial →
              </a>
            </div>
          </div>

          {/* Columna 4: Créditos técnicos y licencias */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-[#F2F1EC] mb-4 flex items-center gap-2">
              <Map className="w-4 h-4 text-[#8FC1D4]" />
              Cartografía & Créditos
            </h5>
            <ul className="space-y-2 text-xs text-[#9AA3A0]">
              <li>Relieve: AWS Terrain Tiles (Terrarium)</li>
              <li>Satélite: Esri, Maxar, Earthstar Geographics</li>
              <li>Motor 3D: MapLibre GL sin API keys</li>
              <li className="pt-2">
                <Link
                  to={`${basePrefix}/creditos`}
                  className="inline-flex items-center gap-1 text-[#E8A15A] hover:underline font-mono text-xs"
                >
                  Ver tabla de créditos Wikimedia Commons →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9AA3A0]">
          <div>
            © {new Date().getFullYear()} Izta-Popo · Expediciones. Prototipo demo desarrollado por Imagine & Stamp.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Fraunces / Inter / JetBrains Mono</span>
            <span>·</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
