import React, { useState, useMemo, useEffect } from 'react';
import { Search, Trees, Sparkles, Camera, ShieldCheck, Compass } from 'lucide-react';
import { PISOS_ECOLOGICOS, PLANTAS, PisoEcologicoId, ReinoId, Planta } from '../data/flora';
import { AltitudeProfile } from '../components/AltitudeProfile';
import { PlantCard } from '../components/PlantCard';

export const FloraPage: React.FC = () => {
  const [selectedPiso, setSelectedPiso] = useState<PisoEcologicoId | null>(null);
  const [selectedReino, setSelectedReino] = useState<ReinoId>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollAltitude, setScrollAltitude] = useState(2900);

  // Calcular número total de fotografías catalogadas
  const totalFotosCatalogadas = useMemo(() => {
    return PLANTAS.reduce((acc, p) => acc + (p.fotos ? p.fotos.length : 1), 0);
  }, []);

  // Scrollytelling: calcular altitud aproximada según posición de scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollY / (docHeight || 1)));
      // interpola de 2,800m a 5,230m
      const calculatedAlt = Math.round(2800 + progress * 2430);
      setScrollAltitude(calculatedAlt);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtrar plantas por piso, reino y búsqueda
  const plantasFiltradas = useMemo(() => {
    return PLANTAS.filter((p) => {
      const matchPiso = selectedPiso ? p.piso === selectedPiso : true;
      const matchReino = selectedReino === 'todas' ? true : p.reino === selectedReino;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        q === '' ||
        p.nombreComun.toLowerCase().includes(q) ||
        p.nombreCientifico.toLowerCase().includes(q) ||
        p.datoCurioso.toLowerCase().includes(q) ||
        p.lugares.some((lug) => lug.toLowerCase().includes(q));
      return matchPiso && matchReino && matchQuery;
    });
  }, [selectedPiso, selectedReino, searchQuery]);

  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] pb-28">
      {/* Cabecera de la página */}
      <section className="pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3F6B4F]/20 text-[#7ec295] border border-[#3F6B4F]/40 text-xs font-mono font-semibold">
            <Trees className="w-3.5 h-3.5" />
            <span>HERBARIO & MICOBIOTA VOLCÁNICA</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Flora, Funga y Microhábitats por Altitud
          </h1>

          <p className="text-sm sm:text-base text-[#9AA3A0] leading-relaxed max-w-3xl">
            Desde la catedral húmeda del bosque de oyamel hasta los riscos congelados del desierto nival, cada piso ecológico resguarda especies adaptadas al frío extremo, radiación ultravioleta y suelos de ceniza. Explora las {PLANTAS.length} especies y más de {totalFotosCatalogadas} fotografías de campo documentadas en alta resolución.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-[#E8A15A]">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Camera className="w-3.5 h-3.5" />
              Fotografía de campo en el Izta-Popo
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#8FC1D4]">
              <Compass className="w-3.5 h-3.5" />
              Gradiente: 2,800 m a 5,400 m s.n.m.
            </span>
          </div>
        </div>
      </section>

      {/* SECCIÓN INTERACTIVA: PERFIL ALTITUDINAL (STICKY SCROLLYTELLING) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <AltitudeProfile
          activePiso={selectedPiso}
          onSelectPiso={(pisoId) => setSelectedPiso(selectedPiso === pisoId ? null : pisoId)}
          currentAltitude={scrollAltitude}
        />
      </section>

      {/* BARRA DE FILTROS: REINOS Y BÚSQUEDA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 space-y-4">
        {/* Filtros por Reino / Tipo Biológico */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#141615] border border-white/10">
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar w-full sm:w-auto">
            <span className="text-[11px] font-mono uppercase text-[#9AA3A0] px-2 hidden sm:inline">
              Reino:
            </span>
            {[
              { id: 'todas', label: 'Todos' },
              { id: 'flora', label: '🌸 Flora Nativa' },
              { id: 'funga', label: '🍄 Funga (Hongos)' },
              { id: 'musgos', label: '🌿 Musgos' },
              { id: 'liquenes', label: '🌱 Líquenes' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedReino(tab.id as ReinoId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedReino === tab.id
                    ? 'bg-[#E8A15A] text-black font-bold shadow-md'
                    : 'bg-black/40 text-[#9AA3A0] hover:text-white hover:bg-black/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Buscador interactivo */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#9AA3A0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar especie, hongo o flor..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-[#9AA3A0] focus:outline-none focus:border-[#E8A15A]"
            />
          </div>
        </div>

        {/* Filtro por piso ecológico activo */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
          <button
            onClick={() => setSelectedPiso(null)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              selectedPiso === null
                ? 'bg-white text-black font-bold'
                : 'bg-black/40 text-[#9AA3A0] hover:text-white border border-white/10'
            }`}
          >
            Todos los pisos ({PLANTAS.length})
          </button>
          {PISOS_ECOLOGICOS.map((piso) => {
            const countInFloor = PLANTAS.filter((p) => p.piso === piso.id).length;
            return (
              <button
                key={piso.id}
                onClick={() => setSelectedPiso(selectedPiso === piso.id ? null : piso.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                  selectedPiso === piso.id
                    ? 'bg-white text-black font-bold'
                    : 'bg-black/40 text-[#9AA3A0] hover:text-white border border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: piso.colorHex }} />
                <span>{piso.nombre} ({countInFloor})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* CUADRÍCULA DE PLANTAS 3D FLIP CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plantasFiltradas.map((planta) => (
            <PlantCard key={planta.id} planta={planta} />
          ))}
        </div>

        {plantasFiltradas.length === 0 && (
          <div className="py-24 text-center rounded-3xl bg-[#141615] border border-white/10 p-8 space-y-3">
            <p className="text-base text-white font-medium">No se encontraron especies con los filtros seleccionados.</p>
            <p className="text-xs text-[#9AA3A0]">Prueba restableciendo los filtros de piso o reino.</p>
            <button
              onClick={() => {
                setSelectedPiso(null);
                setSelectedReino('todas');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#E8A15A] text-black text-xs font-bold hover:bg-[#f3b578] transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
