import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Compass,
  Trees,
  BookOpen,
  Instagram,
  Facebook,
  Youtube,
  Play,
  Volume2
} from 'lucide-react';
import { MANIFIESTO } from '../data/manifiesto';
import { MEDIA_BASE, SOCIAL_LINKS, GUIDE_NAME, CLIENT_NAME } from '../config';
import { SmartVideo } from '../components/SmartVideo';
import { PresentationModal } from '../components/PresentationModal';

const LANG_STORAGE_KEY = 'izta_popo_manifiesto_lang';

export const Conocimiento: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlLang = searchParams.get('lang');

  const [lang, setLang] = useState<'es' | 'en'>(() => {
    if (urlLang === 'en' || urlLang === 'es') return urlLang;
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'es') return saved;
    } catch (e) {
      // ignore
    }
    return 'es';
  });

  const [isFading, setIsFading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const playBtnRef = useRef<HTMLButtonElement>(null);

  // Sincronizar parámetro url si cambia
  useEffect(() => {
    if (urlLang === 'en' || urlLang === 'es') {
      setLang(urlLang);
    }
  }, [urlLang]);

  // Actualizar título de la pestaña
  useEffect(() => {
    document.title = 'Conocimiento de la Montaña · Izta-Popo';
  }, []);

  const handleLangChange = (newLang: 'es' | 'en') => {
    if (newLang === lang) return;
    setIsFading(true);
    setTimeout(() => {
      setLang(newLang);
      try {
        localStorage.setItem(LANG_STORAGE_KEY, newLang);
      } catch (e) {
        // ignore
      }
      setIsFading(false);
    }, 200);
  };

  const contenido = MANIFIESTO[lang];

  // Helper para renderizar párrafos reemplazando [[palabra]] por Fraunces en color amanecer
  const renderParrafoConEnfasis = (texto: string) => {
    const regex = /\[\[(.*?)\]\]/g;
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(texto)) !== null) {
      if (match.index > lastIndex) {
        parts.push(texto.substring(lastIndex, match.index));
      }
      parts.push(
        <span
          key={match.index}
          className="font-serif text-[#E8A15A] text-[1.08em] tracking-wide inline-block"
        >
          {match[1]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < texto.length) {
      parts.push(texto.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div
      lang={lang === 'es' ? 'es-MX' : 'en'}
      className="w-full bg-[#0A0B0B] text-[#F2F1EC] min-h-screen selection:bg-[#E8A15A]/30 selection:text-[#E8A15A]"
    >
      {/* 1. APERTURA A PANTALLA COMPLETA */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-end p-6 sm:p-12 md:p-20 overflow-hidden">
        {/* Foto de bosque de fondo */}
        <div className="absolute inset-0 z-0">
          <img
            src={`${MEDIA_BASE}/fotos/laguna-reflejo-volcanes-2560.webp`}
            alt="Bosque sagrado de Oyamel"
            className="w-full h-full object-cover scale-105 animate-fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0B] via-[#0A0B0B]/60 to-black/30" />
        </div>

        {/* Selector de idioma arriba a la derecha */}
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20 flex items-center p-1 rounded-2xl bg-[#1A1C1B]/90 border border-white/15 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => handleLangChange('es')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              lang === 'es'
                ? 'bg-[#E8A15A] text-black shadow-md'
                : 'text-[#9AA3A0] hover:text-white'
            }`}
          >
            ES
          </button>
          <button
            onClick={() => handleLangChange('en')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              lang === 'en'
                ? 'bg-[#E8A15A] text-black shadow-md'
                : 'text-[#9AA3A0] hover:text-white'
            }`}
          >
            EN
          </button>
        </div>

        {/* Textos de cabecera del manifiesto */}
        <div
          className={`relative z-10 max-w-4xl transition-opacity duration-200 ${
            isFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.08] mb-4">
            {contenido.titulo}
          </h1>
          <p className="text-base sm:text-xl text-[#9AA3A0] font-sans font-light max-w-2xl leading-relaxed">
            {contenido.bajada}
          </p>
        </div>
      </section>

      {/* 2. SECCIÓN: MIRA LA PRESENTACIÓN (Video oficial del cliente) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-white/[0.06] bg-[#0E0F0F]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8A15A] animate-pulse" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                {lang === 'es' ? 'Mira la presentación oficial' : 'Watch the official presentation'}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#E8A15A] bg-[#E8A15A]/10 border border-[#E8A15A]/25 px-2.5 py-1 rounded-full">
              SD · 1:27 min
            </span>
          </div>

          {/* Marco del video de presentación */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl group">
            <img
              src={`${MEDIA_BASE}/video/presentacion-poster.webp`}
              alt="Presentación Conocimiento de la Montaña"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <button
              ref={playBtnRef}
              onClick={() => setModalOpen(true)}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#E8A15A] hover:bg-[#f3b578] text-black flex items-center justify-center shadow-2xl shadow-[#E8A15A]/50 hover:scale-110 transition-all z-10 group"
              aria-label="Reproducir video de presentación"
            >
              <Play className="w-8 h-8 fill-black translate-x-0.5" />
            </button>

            <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs text-white/90">
              <span className="font-serif italic text-white/80">
                {lang === 'es'
                  ? 'Fauna, bosques y tradición de la sierra nevada'
                  : 'Fauna, forests and living heritage'}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#E8A15A]">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Con sonido</span>
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-[#9AA3A0] font-sans pt-1">
            Video: {GUIDE_NAME} · {CLIENT_NAME}
          </p>
        </div>
      </section>

      {/* 3. CUERPO DEL MANIFIESTO (Columna de 65-70 carácteres, espaciosa y serena) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div
          className={`max-w-[68ch] mx-auto space-y-8 sm:space-y-10 text-base sm:text-lg leading-[1.8] text-[#D8D7CE] transition-opacity duration-200 ${
            isFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {contenido.parrafos.slice(0, 3).map((p, idx) => (
            <p key={idx} className="font-sans font-normal">
              {renderParrafoConEnfasis(p)}
            </p>
          ))}
        </div>
      </section>

      {/* 4. CITA DESTACADA A MITAD DEL TEXTO */}
      <section className="relative my-8 sm:my-16 py-20 sm:py-28 px-6 sm:px-12 overflow-hidden border-y border-white/10">
        <div className="absolute inset-0 z-0">
          <img
            src={`${MEDIA_BASE}/fotos/mirador-popo-2560.webp`}
            alt="Paisaje de los volcanes"
            className="w-full h-full object-cover brightness-[0.28] contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-white leading-relaxed tracking-wide">
            “{contenido.cita}”
          </blockquote>
          <div className="w-16 h-0.5 bg-[#E8A15A] mx-auto mt-6" />
        </div>
      </section>

      {/* 5. CONTINUACIÓN DEL CUERPO DEL MANIFIESTO */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div
          className={`max-w-[68ch] mx-auto space-y-8 sm:space-y-10 text-base sm:text-lg leading-[1.8] text-[#D8D7CE] transition-opacity duration-200 ${
            isFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {contenido.parrafos.slice(3).map((p, idx) => (
            <p key={idx + 3} className="font-sans font-normal">
              {renderParrafoConEnfasis(p)}
            </p>
          ))}
        </div>
      </section>

      {/* 6. CIERRE: TRES ACCESOS A LO QUE EL SITIO MUESTRA (En tamaños distintos) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0E0F0F] border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              {lang === 'es' ? 'Explora la evidencia viva' : 'Explore the living evidence'}
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA3A0]">
              {lang === 'es'
                ? 'El relieve, la botánica y las jornadas comunitarias demuestran la necesidad de proteger la sierra.'
                : 'Topography, botany, and community work show the urgency of protecting the range.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Tarjeta 1: Mapa 3D (Grande, 7 columnas) */}
            <Link
              to="/izta-popo/explorar"
              className="md:col-span-7 group relative rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[360px] border border-white/10 hover:border-[#E8A15A]/40 transition-all flex flex-col justify-end p-6 sm:p-8"
            >
              <img
                src={`${MEDIA_BASE}/fotos/hero-volcanes-1280.webp`}
                alt="Mapa 3D del relieve"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#E8A15A]">
                  <Compass className="w-4 h-4" />
                  <span>Cartografía 3D</span>
                </div>
                <h4 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-[#E8A15A] transition-colors">
                  {lang === 'es' ? 'Explorar el mapa 3D' : 'Explore the 3D Map'}
                </h4>
                <p className="text-xs sm:text-sm text-[#9AA3A0] max-w-md">
                  {lang === 'es'
                    ? '14 parajes georreferenciados con elevación topográfica continua y zonas de exclusión.'
                    : '14 georeferenced landmarks with continuous terrain elevation and safety zones.'}
                </p>
              </div>
            </Link>

            {/* Columna derecha con 2 tarjetas (5 columnas) */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {/* Tarjeta 2: Flora por Altitud */}
              <Link
                to="/izta-popo/flora"
                className="flex-1 group relative rounded-3xl overflow-hidden min-h-[170px] border border-white/10 hover:border-[#E8A15A]/40 transition-all flex flex-col justify-end p-5 sm:p-6"
              >
                <img
                  src={`${MEDIA_BASE}/fotos/flora-eryngium-1280.webp`}
                  alt="Flora por altitud"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="relative z-10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#7ec295]">
                    <Trees className="w-3.5 h-3.5" />
                    <span>Botánica nativa</span>
                  </div>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#E8A15A] transition-colors">
                    {lang === 'es' ? 'Flora por altitud' : 'Flora by Altitude'}
                  </h4>
                </div>
              </Link>

              {/* Tarjeta 3: Bitácora de jornadas */}
              <Link
                to="/izta-popo/bitacora"
                className="flex-1 group relative rounded-3xl overflow-hidden min-h-[170px] border border-white/10 hover:border-[#E8A15A]/40 transition-all flex flex-col justify-end p-5 sm:p-6"
              >
                <img
                  src={`${MEDIA_BASE}/fotos/la-joya-1280.webp`}
                  alt="Bitácora de jornadas"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="relative z-10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#E8A15A]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Voluntariado</span>
                  </div>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#E8A15A] transition-colors">
                    {lang === 'es' ? 'Bitácora de jornadas' : 'Action Log'}
                  </h4>
                </div>
              </Link>
            </div>
          </div>

          {/* Redes Sociales del proyecto */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9AA3A0]">
            <span>
              {lang === 'es'
                ? 'Conecta con las plataformas de difusión de Conocimiento de la Montaña:'
                : 'Connect with Mountain Knowledge social platforms:'}
            </span>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:text-[#E8A15A] hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <Facebook className="w-4 h-4" />
                <span className="font-medium">Facebook</span>
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:text-[#E8A15A] hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <Instagram className="w-4 h-4" />
                <span className="font-medium">Instagram</span>
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:text-[#E8A15A] hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <Youtube className="w-4 h-4" />
                <span className="font-medium">YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reproductor cinematográfico Modal */}
      <PresentationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        triggerElementRef={playBtnRef}
      />
    </div>
  );
};

export const ConocimientoPage = Conocimiento;
