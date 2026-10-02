import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mountain,
  AlertTriangle,
  ShieldCheck,
  Map,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Compass
} from 'lucide-react';
import { CLIENT_NAME, GUIDE_NAME, CONTACT_EMAIL, SOCIAL_LINKS } from '../config';

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
              <h4 className="text-sm font-semibold text-[#F2F1EC]">Conservación Activa & No Deje Rastro</h4>
              <p className="text-xs text-[#9AA3A0] mt-0.5">
                Respeta el Parque Nacional Izta-Popo: no dejes basura, no extraigas flora, musgo ni piedras, camina solo por senderos permitidos y cuida las fuentes de agua.
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
          {/* Columna 1: Marca y Misión */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#141615] border border-[#E8A15A]/40 overflow-hidden flex items-center justify-center shrink-0 shadow-lg ring-1 ring-[#E8A15A]/20">
                <img
                  src="/izta-popo/media/logo-izta-popo.jpg"
                  alt="Conocimiento de la Montaña - Izta y Popo"
                  className="w-full h-full object-cover scale-105"
                />
              </div>
              <div className="flex flex-col justify-center leading-none">
                <span className="font-serif text-sm font-extrabold text-[#F2F1EC] tracking-wide leading-tight">
                  CONOCIMIENTO
                </span>
                <span className="text-[11px] font-serif font-bold text-[#E8A15A] tracking-wider leading-tight">
                  DE LA MONTAÑA
                </span>
                <span className="text-[9px] tracking-[0.22em] text-[#9AA3A0] uppercase font-mono mt-0.5 leading-tight">
                  PARQUE NACIONAL IZTA-POPO
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-[#9AA3A0]">
              Divulgación y conservación de los bosques y montañas del Izta-Popo. Un proyecto de {CLIENT_NAME} coordinado por {GUIDE_NAME}.
            </p>

            {/* Correo y Redes Sociales */}
            <div className="space-y-2 pt-1">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-xs text-[#F2F1EC] hover:text-[#E8A15A] transition-colors group"
              >
                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#E8A15A]" />
                </div>
                <span className="font-mono text-[11px]">{CONTACT_EMAIL}</span>
              </a>

              <div className="flex items-center gap-2 pt-1 text-[#9AA3A0]">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:text-[#E8A15A] hover:bg-white/10 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:text-[#E8A15A] hover:bg-white/10 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:text-[#E8A15A] hover:bg-white/10 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Columna 2: Navegación y divulgación */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-[#F2F1EC] mb-4">Proyecto</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to={`${basePrefix}/conocimiento`} className="hover:text-[#E8A15A] transition-colors">
                  La Montaña (Manifiesto)
                </Link>
              </li>
              <li>
                <Link to={`${basePrefix}/explorar`} className="hover:text-[#E8A15A] transition-colors flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#E8A15A]" />
                  <span>Explorar mapa 3D</span>
                </Link>
              </li>
              <li>
                <Link to={`${basePrefix}/flora`} className="hover:text-[#E8A15A] transition-colors">
                  Pisos ecológicos & Flora
                </Link>
              </li>
              <li>
                <Link to={`${basePrefix}/problematica`} className="hover:text-[#E8A15A] transition-colors">
                  Problemática y acciones
                </Link>
              </li>
              <li>
                <Link to={`${basePrefix}/bitacora`} className="hover:text-[#E8A15A] transition-colors">
                  Bitácora de jornadas
                </Link>
              </li>
              <li>
                <Link to={`${basePrefix}/participa`} className="hover:text-[#E8A15A] transition-colors text-[#E8A15A] font-semibold">
                  Súmate como voluntario →
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Semáforo CENAPRED y alertas */}
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
                Prohibido rebasar el radio de exclusión de 12 km del cráter del Popocatépetl. Respeta las indicaciones oficiales de Protección Civil.
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

          {/* Columna 4: Créditos técnicos y enlaces */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-[#F2F1EC] mb-4 flex items-center gap-2">
              <Map className="w-4 h-4 text-[#8FC1D4]" />
              Transparencia & Créditos
            </h5>
            <ul className="space-y-2 text-xs text-[#9AA3A0]">
              <li>Relieve: AWS Terrain Tiles (Terrarium)</li>
              <li>Satélite: Esri, Maxar, Earthstar Geographics</li>
              <li>Video: Ricardo Pérez Romero</li>
              <li className="pt-2">
                <Link
                  to={`${basePrefix}/como-funciona`}
                  className="inline-flex items-center gap-1 text-[#9AA3A0] hover:text-[#E8A15A] font-mono text-xs transition-colors"
                >
                  Cómo funciona este portal →
                </Link>
              </li>
              <li>
                <Link
                  to={`${basePrefix}/creditos`}
                  className="inline-flex items-center gap-1 text-[#E8A15A] hover:underline font-mono text-xs"
                >
                  Tabla de créditos & licencias →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9AA3A0]">
          <div>
            © {new Date().getFullYear()} Conocimiento de la Montaña · Izta-Popo. Un proyecto de divulgación y conservación ambiental.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Fraunces / Inter / JetBrains Mono</span>
            <span>·</span>
            <span>Imagine & Stamp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
