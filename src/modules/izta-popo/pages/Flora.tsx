import React, { useState, useMemo, useEffect } from 'react';
import { Search, Trees, Mountain, ArrowUp, Filter, Sparkles } from 'lucide-react';
import { PISOS_ECOLOGICOS, PLANTAS, PisoEcologicoId, Planta } from '../data/flora';
import { AltitudeProfile } from '../components/AltitudeProfile';
import { PlantCard } from '../components/PlantCard';

export const FloraPage: React.FC = () => {
  const [selectedPiso, setSelectedPiso] = useState<PisoEcologicoId | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollAltitude, setScrollAltitude] = useState(2900);

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

  // Filtrar plantas por piso y búsqueda
  const plantasFiltradas = useMemo(() => {
    return PLANTAS.filter((p) => {
      const matchPiso = selectedPiso ? p.piso === selectedPiso : true;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        q === '' ||
        p.nombreComun.toLowerCase().includes(q) ||
        p.nombreCientifico.toLowerCase().includes(q) ||
        p.datoCurioso.toLowerCase().includes(q);
      return matchPiso && matchQuery;
    });
  }, [selectedPiso, searchQuery]);

  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] pb-28">
      {/* Cabecera de la página */}
      <section className="pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3F6B4F]/20 text-[#7ec295] border border-[#3F6B4F]/40 text-xs font-mono font-semibold">
            <Trees className="w-3.5 h-3.5" />
            <span>BIODIVERSIDAD VOLCÁNICA</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Flora nativa clasificada por altitud
          </h1>

          <p className="text-sm sm:text-base text-[#9AA3A0] leading-relaxed">
            A medida que se asciende por las faldas del Izta y el Popo, la temperatura se desploma, el oxígeno escasea y la radiación ultravioleta se intensifica. Descubre cómo cada especie vegetal desarrolló adaptaciones asombrosas en sus respectivos pisos ecológicos.
          </p>
        </div>
      </section>

      {/* SECCIÓN INTERACTIVA: PERFIL ALTITUDINAL (STICKY SCROLLYTELLING) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <AltitudeProfile
          activePiso={selectedPiso}
          onSelectPiso={(pisoId) => setSelectedPiso(selectedPiso === pisoId ? null : pisoId)}
          currentAltitude={scrollAltitude}
        />
      </section>

      {/* BARRA DE FILTROS Y BÚSQUEDA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="p-4 rounded-2xl bg-[#141615] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Botones de filtro rápido */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto">
            <button
              onClick={() => setSelectedPiso(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedPiso === null
                  ? 'bg-[#E8A15A] text-black font-semibold'
                  : 'bg-black/40 text-[#9AA3A0] hover:text-white'
              }`}
            >
              Todos los pisos ({PLANTAS.length})
            </button>
            {PISOS_ECOLOGICOS.map((piso) => (
              <button
                key={piso.id}
                onClick={() => setSelectedPiso(selectedPiso === piso.id ? null : piso.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedPiso === piso.id
                    ? 'bg-white text-black font-semibold'
                    : 'bg-black/40 text-[#9AA3A0] hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: piso.colorHex }} />
                <span>{piso.nombre}</span>
              </button>
            ))}
          </div>

          {/* Buscador */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#9AA3A0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar planta por nombre..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-[#9AA3A0] focus:outline-none focus:border-[#E8A15A]"
            />
          </div>
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
          <div className="py-20 text-center text-sm text-[#9AA3A0]">
            No se encontraron especies con los filtros seleccionados.
          </div>
        )}
      </section>
    </div>
  );
};
