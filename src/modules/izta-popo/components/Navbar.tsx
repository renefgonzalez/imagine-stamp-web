import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Mountain,
  Compass,
  Trees,
  BookOpen,
  HeartHandshake,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { QualitySwitch } from './QualitySwitch';
import { LogoVolcanes } from './LogoVolcanes';
import { useQuality } from '../context/QualityContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toastMessage, dismissToast } = useQuality();
  const location = useLocation();

  // Prefijo base del módulo dentro del router de Imagine & Stamp
  const basePrefix = '/izta-popo';

  const navLinks = [
    { to: `${basePrefix}/conocimiento`, label: 'La Montaña', icon: Mountain },
    { to: `${basePrefix}/explorar`, label: 'Explorar 3D', icon: Compass },
    { to: `${basePrefix}/flora`, label: 'Flora', icon: Trees },
    { to: `${basePrefix}/problematica`, label: 'Problemática', icon: AlertTriangle },
    { to: `${basePrefix}/bitacora`, label: 'Bitácora', icon: BookOpen },
    { to: `${basePrefix}/participa`, label: 'Participa', icon: HeartHandshake },
  ];

  return (
    <>
      {toastMessage && (
        <div className="bg-[#1A1C1B] border-b border-[#E8A15A]/30 text-xs px-4 py-2 text-[#F2F1EC] flex items-center justify-between z-50 relative">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertCircle className="w-4 h-4 text-[#E8A15A] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={dismissToast}
            className="text-[#9AA3A0] hover:text-white text-xs px-2 py-0.5 rounded ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0E0F0F]/90 border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo Oficial: CONOCIMIENTO DE LA MONTAÑA / Izta-Popo */}
          <Link
            to={basePrefix}
            className="group flex items-center gap-3 select-none shrink-0"
          >
            <LogoVolcanes size={40} className="group-hover:scale-105" />
            <div className="flex flex-col justify-center leading-none">
              <span className="font-serif text-sm sm:text-base font-extrabold text-[#F2F1EC] tracking-wide leading-tight group-hover:text-white transition-colors">
                CONOCIMIENTO
              </span>
              <span className="text-[11px] sm:text-xs font-serif font-bold text-[#E8A15A] tracking-wider leading-tight">
                DE LA MONTAÑA
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[#9AA3A0] uppercase font-mono mt-0.5 leading-tight">
                PARQUE NACIONAL IZTA-POPO
              </span>
            </div>
          </Link>

          {/* Enlaces de escritorio (exactamente en el orden de E6) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.to);
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? 'bg-white/10 text-[#E8A15A] font-semibold'
                      : 'text-[#9AA3A0] hover:text-[#F2F1EC] hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Selector de Calidad y Menú Móvil */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <QualitySwitch />
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#9AA3A0] hover:text-[#F2F1EC] hover:bg-white/5 focus:outline-none"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú Móvil desplegable */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 bg-[#0E0F0F]/98 border-b border-white/10 backdrop-blur-2xl animate-fade-in-up space-y-3">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/10 text-[#E8A15A] font-semibold'
                        : 'text-[#9AA3A0] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#E8A15A]" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#9AA3A0]">Modo de calidad</span>
              <QualitySwitch />
            </div>
          </div>
        )}
      </header>
    </>
  );
};
