import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Mountain, Compass, Trees, BookOpen, Send, HelpCircle, AlertCircle } from 'lucide-react';
import { QualitySwitch } from './QualitySwitch';
import { useQuality } from '../context/QualityContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toastMessage, dismissToast } = useQuality();
  const location = useLocation();

  // Prefijo base del módulo dentro del router de Imagine & Stamp
  const basePrefix = '/izta-popo';

  const navLinks = [
    { to: `${basePrefix}/explorar`, label: 'Explorar 3D', icon: Compass },
    { to: `${basePrefix}/flora`, label: 'Flora por Altitud', icon: Trees },
    { to: `${basePrefix}/bitacora`, label: 'Bitácora', icon: BookOpen },
    { to: `${basePrefix}/recorre-conmigo`, label: 'Recorre Conmigo', icon: Send },
    { to: `${basePrefix}/como-funciona`, label: 'Cómo Funciona', icon: HelpCircle },
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

      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0E0F0F]/85 border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to={basePrefix}
            className="group flex items-center gap-3 select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8A15A]/20 to-[#3F6B4F]/20 border border-[#E8A15A]/30 flex items-center justify-center text-[#E8A15A] group-hover:scale-105 transition-transform">
              <Mountain className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-widest text-lg font-bold text-[#F2F1EC] group-hover:text-[#E8A15A] transition-colors leading-tight">
                IZTA<span className="text-[#E8A15A]">·</span>POPO
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#9AA3A0] uppercase font-mono">
                Expediciones
              </span>
            </div>
          </Link>

          {/* Enlaces de escritorio */}
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
          <div className="lg:hidden px-4 pt-2 pb-6 bg-[#0E0F0F]/95 border-b border-white/10 backdrop-blur-2xl animate-fade-in-up">
            <div className="mb-4 pt-2 pb-3 border-b border-white/10">
              <p className="text-[11px] font-mono uppercase text-[#9AA3A0] mb-2">Modo de Calidad</p>
              <QualitySwitch />
            </div>
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname.startsWith(link.to);
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#E8A15A]/15 text-[#E8A15A] font-semibold'
                        : 'text-[#9AA3A0] hover:text-[#F2F1EC] hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#E8A15A]" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
