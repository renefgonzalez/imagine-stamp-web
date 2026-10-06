import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Camera, ShieldCheck, Compass, Info, AlertTriangle } from 'lucide-react';
import { ANIMALES, GRUPOS_FAUNA, GrupoFaunaId, PisoEcologicoId, Fauna } from '../data/fauna';
import { PISOS_ECOLOGICOS } from '../data/flora';
import { FaunaCard } from '../components/FaunaCard';

export const FaunaPage: React.FC = () => {
  const [selectedGrupo, setSelectedGrupo] = useState<GrupoFaunaId>('todos');
  const [selectedPiso, setSelectedPiso] = useState<PisoEcologicoId | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Total de fotografías catalogadas en fauna
  const totalFotosCatalogadas = useMemo(() => {
    return ANIMALES.reduce((acc, a) => acc + (a.fotos ? a.fotos.length : 1), 0);
  }, []);

  // Filtrar animales por grupo, piso y búsqueda
  const animalesFiltrados = useMemo(() => {
    return ANIMALES.filter((a) => {
      const matchGrupo = selectedGrupo === 'todos' ? true : a.grupo === selectedGrupo;
      const matchPiso = selectedPiso ? a.piso === selectedPiso : true;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        q === '' ||
        a.nombreComun.toLowerCase().includes(q) ||
        a.nombreCientifico.toLowerCase().includes(q) ||
        a.datoCurioso.toLowerCase().includes(q) ||
        a.dieta.toLowerCase().includes(q) ||
        a.lugares.some((lug) => lug.toLowerCase().includes(q));
      return matchGrupo && matchPiso && matchQuery;
    });
  }, [selectedGrupo, selectedPiso, searchQuery]);

  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] pb-28">
      {/* Cabecera de la página */}
      <section className="pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8A15A]/20 text-[#E8A15A] border border-[#E8A15A]/40 text-xs font-mono font-semibold">
            <span>🐾</span>
            <span>BIODIVERSIDAD & FAUNA SILVESTRE</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Fauna Alpinotípica del Izta-Popo
          </h1>

          <p className="text-sm sm:text-base text-[#9AA3A0] leading-relaxed max-w-3xl">
            Desde la víbora de cascabel transvolcánica oculta en el zacatonal hasta el mítico conejo de los volcanes (teporingo), las mariposas de cañada y las lagartijas vivíparas de los riscos, la fauna del Parque Nacional Iztaccíhuatl-Popocatépetl ha evolucionado adaptaciones fisiológicas únicas para sobrevivir al frío nocturno bajo cero, la radiación ultravioleta y el viento glacial.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-[#E8A15A]">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <Camera className="w-3.5 h-3.5" />
              Fotografía de campo & fototrampeo
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Especies protegidas NOM-059-SEMARNAT
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#8FC1D4]">
              <Compass className="w-3.5 h-3.5" />
              Rango: 2,400 m a 4,500 m s.n.m.
            </span>
          </div>
        </div>
      </section>

      {/* BARRA DE FILTROS: GRUPOS Y BÚSQUEDA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 space-y-4">
        {/* Filtros por Grupo */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#141615] border border-white/10">
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar w-full sm:w-auto">
            <span className="text-[11px] font-mono uppercase text-[#9AA3A0] px-2 hidden sm:inline">
              Grupo:
            </span>
            {GRUPOS_FAUNA.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedGrupo(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  selectedGrupo === tab.id
                    ? 'bg-[#E8A15A] text-black font-bold shadow-md'
                    : 'bg-black/40 text-[#9AA3A0] hover:text-white hover:bg-black/60'
                }`}
              >
                <span>{tab.iconEmoji}</span>
                <span>{tab.label}</span>
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
              placeholder="Buscar especie, reptil, mamífero..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-[#9AA3A0] focus:outline-none focus:border-[#E8A15A]"
            />
          </div>
        </div>

        {/* Filtro por piso ecológico */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
          <button
            onClick={() => setSelectedPiso(null)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              selectedPiso === null
                ? 'bg-white text-black font-bold'
                : 'bg-black/40 text-[#9AA3A0] hover:text-white border border-white/10'
            }`}
          >
            Todos los pisos ({ANIMALES.length})
          </button>
          {PISOS_ECOLOGICOS.map((piso) => {
            const countInFloor = ANIMALES.filter((a) => a.piso === piso.id).length;
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

      {/* CUADRÍCULA DE FAUNA 3D FLIP CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {animalesFiltrados.map((animal) => (
            <FaunaCard key={animal.id} animal={animal} />
          ))}
        </div>

        {animalesFiltrados.length === 0 && (
          <div className="py-24 text-center rounded-3xl bg-[#141615] border border-white/10 p-8 space-y-3">
            <p className="text-base text-white font-medium">No se encontraron especies con los filtros seleccionados.</p>
            <p className="text-xs text-[#9AA3A0]">Prueba restableciendo los filtros de grupo o piso ecológico.</p>
            <button
              onClick={() => {
                setSelectedGrupo('todos');
                setSelectedPiso(null);
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#E8A15A] text-black text-xs font-bold hover:bg-[#f3b578] transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </section>

      {/* AVISO DE CONSERVACIÓN Y RESPETO A LA FAUNA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1A1C1B] to-[#141615] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="p-3.5 rounded-2xl bg-[#E8A15A]/15 border border-[#E8A15A]/30 text-[#E8A15A] shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-base font-bold text-white">
              Código de Ética y Observación Responsable de Fauna
            </h4>
            <p className="text-xs text-[#9AA3A0] leading-relaxed">
              Si tienes la fortuna de avistar fauna silvestre en tu ascenso, mantén al menos 15 metros de distancia. Jamás alimentes a ninguna especie, no utilices flash directo, no muevas rocas donde habitan reptiles e invertebrados y mantén a los animales domésticos fuera de las zonas núcleo del parque.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
