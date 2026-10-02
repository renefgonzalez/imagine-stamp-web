import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Mountain, X, ChevronRight, MapPin } from 'lucide-react';
import { LUGARES, Lugar } from '../data/lugares';
import { CATEGORIAS } from '../data/categorias';
import { CategoryChips } from '../components/CategoryChips';
import { Map3D } from '../components/Map3D';
import { PlaceSheet } from '../components/PlaceSheet';
import { MEDIA_BASE } from '../config';

export const Explorar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat');

  const [selectedCat, setSelectedCat] = useState<string | null>(catParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLugar, setSelectedLugar] = useState<Lugar | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  // Sincronizar parámetro de categoría de la URL
  useEffect(() => {
    if (catParam) {
      setSelectedCat(catParam);
    }
  }, [catParam]);

  const handleSelectCategory = (catId: string | null) => {
    setSelectedCat(catId);
    if (catId) {
      setSearchParams({ cat: catId });
    } else {
      setSearchParams({});
    }
  };

  // Filtrado reactivo de lugares
  const lugaresFiltrados = useMemo(() => {
    return LUGARES.filter((lugar) => {
      const matchCat = selectedCat ? lugar.categoria === selectedCat : true;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        lugar.nombre.toLowerCase().includes(q) ||
        lugar.resumen.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCat, searchQuery]);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-[#0A0B0B] text-[#F2F1EC]">
      {/* 1. MAPA 3D A PANTALLA COMPLETA */}
      <div className="w-full h-full">
        <Map3D
          lugaresFiltrados={lugaresFiltrados}
          lugarSeleccionado={selectedLugar}
          onSelectLugar={(lugar) => setSelectedLugar(lugar)}
        />
      </div>

      {/* 2. PANEL LATERAL IZQUIERDO (DESKTOP) / BOTTOM DRAWER (MÓVIL) */}
      <div
        className={`absolute top-4 left-4 bottom-4 z-20 w-80 sm:w-96 flex flex-col rounded-3xl bg-[#0E0F0F]/90 border border-white/10 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ${
          panelOpen ? 'translate-x-0' : '-translate-x-[110%]'
        }`}
      >
        {/* Cabecera del panel */}
        <div className="p-4 sm:p-5 border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="w-5 h-5 text-[#E8A15A]" />
              <h2 className="font-serif text-lg font-bold text-white">Explorar Volcanes</h2>
            </div>
            <button
              onClick={() => setPanelOpen(false)}
              className="p-1 rounded-lg text-[#9AA3A0] hover:text-white hover:bg-white/10"
              title="Minimizar panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Buscador de texto */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#9AA3A0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cumbre, glaciar o paraje..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-[#9AA3A0] focus:outline-none focus:border-[#E8A15A]/60"
            />
          </div>

          {/* Filtros por Categoría */}
          <CategoryChips
            selectedCategory={selectedCat}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        {/* Lista de lugares filtrados */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-2">
          {lugaresFiltrados.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#9AA3A0]">
              No se encontraron lugares con esos criterios.
            </div>
          ) : (
            lugaresFiltrados.map((lugar) => {
              const cat = CATEGORIAS[lugar.categoria];
              const isSelected = selectedLugar?.id === lugar.id;
              const firstFoto = lugar.fotos[0]?.id || 'hero-volcanes';
              const fotoThumb = `${MEDIA_BASE}/fotos/${firstFoto}-480.webp`;

              return (
                <div
                  key={lugar.id}
                  onClick={() => setSelectedLugar(lugar)}
                  className={`p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3 group ${
                    isSelected
                      ? 'bg-white/10 border-[#E8A15A] shadow-lg shadow-[#E8A15A]/10'
                      : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-black/50'
                  }`}
                >
                  {/* Miniatura */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 relative">
                    <img
                      src={fotoThumb}
                      alt={lugar.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span
                      className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.colorHex }}
                    />
                  </div>

                  {/* Datos del lugar */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs font-bold text-white group-hover:text-[#E8A15A] transition-colors truncate">
                      {lugar.nombre}
                    </h4>
                    <p className="text-[11px] text-[#9AA3A0] truncate mt-0.5">
                      {cat.nombre}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                      <span className="text-[#E8A15A] font-semibold">{lugar.altitud.toLocaleString()} m</span>
                      <span className="text-white/30">·</span>
                      <span className="text-white/60">{lugar.dificultad}</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#9AA3A0] group-hover:text-[#E8A15A] group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer del panel */}
        <div className="p-3 border-t border-white/10 text-center text-[10px] font-mono text-[#9AA3A0]">
          {lugaresFiltrados.length} lugares visibles · Haz clic para volar la cámara
        </div>
      </div>

      {/* Botón flotante para reabrir panel si fue cerrado */}
      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="absolute top-4 left-4 z-20 px-4 py-2.5 rounded-2xl bg-[#0E0F0F]/90 border border-white/15 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl flex items-center gap-2 hover:bg-[#1A1C1B]"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#E8A15A]" />
          <span>Lugares & Filtros ({lugaresFiltrados.length})</span>
        </button>
      )}

      {/* 3. TARJETA FLOTANTE DE DETALLE RÁPIDO */}
      <PlaceSheet
        lugar={selectedLugar}
        onClose={() => setSelectedLugar(null)}
      />
    </div>
  );
};
