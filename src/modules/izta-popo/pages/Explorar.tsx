import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Mountain, X, Target, Flower2, PawPrint, Layers, Sparkles } from 'lucide-react';
import { LUGARES, Lugar } from '../data/lugares';
import { CATEGORIAS } from '../data/categorias';
import { CategoryChips } from '../components/CategoryChips';
import { Map3D } from '../components/Map3D';
import { PlaceSheet } from '../components/PlaceSheet';
import { BioSheet } from '../components/BioSheet';
import { getFloraMarkers, getFaunaMarkers, BioMarkerItem } from '../data/bioMarkers';
import { MEDIA_BASE } from '../config';

type TabExplorar = 'sitios' | 'flora' | 'fauna';

export const Explorar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  const tabParam = searchParams.get('tab') as TabExplorar | null;

  const [activeTab, setActiveTab] = useState<TabExplorar>(tabParam || 'sitios');
  const [selectedCat, setSelectedCat] = useState<string | null>(catParam);
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de selección
  const [selectedLugar, setSelectedLugar] = useState<Lugar | null>(null);
  const [selectedBioItem, setSelectedBioItem] = useState<BioMarkerItem | null>(null);

  // Triggers de vuelo de cámara
  const [centerTrigger, setCenterTrigger] = useState<{ lugar: Lugar; count: number } | null>(null);
  const [centerBioTrigger, setCenterBioTrigger] = useState<{ item: BioMarkerItem; count: number } | null>(null);

  const [panelOpen, setPanelOpen] = useState(true);

  // Toggles de capas en el mapa
  const [showFloraPins, setShowFloraPins] = useState(true);
  const [showFaunaPins, setShowFaunaPins] = useState(true);

  // Marcadores de Flora y Fauna
  const allFlora = useMemo(() => getFloraMarkers(), []);
  const allFauna = useMemo(() => getFaunaMarkers(), []);

  // Sincronizar parámetro de categoría
  useEffect(() => {
    if (catParam) {
      setSelectedCat(catParam);
    }
  }, [catParam]);

  const handleSelectCategory = (catId: string | null) => {
    setSelectedCat(catId);
    setSelectedLugar(null);
    setSelectedBioItem(null);
    if (catId) {
      setSearchParams({ cat: catId });
    } else {
      setSearchParams({});
    }
  };

  const handleCenterLugar = (lugar: Lugar) => {
    setSelectedBioItem(null);
    setSelectedLugar(lugar);
    setCenterTrigger((prev) => ({ lugar, count: (prev?.count || 0) + 1 }));

    if (window.innerWidth < 768) {
      setPanelOpen(false);
    }
  };

  const handleCenterBioItem = (item: BioMarkerItem) => {
    setSelectedLugar(null);
    setSelectedBioItem(item);
    setCenterBioTrigger((prev) => ({ item, count: (prev?.count || 0) + 1 }));

    if (window.innerWidth < 768) {
      setPanelOpen(false);
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

  // Filtrado reactivo de Flora
  const floraFiltrada = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allFlora;
    return allFlora.filter(
      (f) =>
        f.nombreComun.toLowerCase().includes(q) ||
        f.nombreCientifico.toLowerCase().includes(q) ||
        f.piso.toLowerCase().includes(q)
    );
  }, [allFlora, searchQuery]);

  // Filtrado reactivo de Fauna
  const faunaFiltrada = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allFauna;
    return allFauna.filter(
      (f) =>
        f.nombreComun.toLowerCase().includes(q) ||
        f.nombreCientifico.toLowerCase().includes(q) ||
        f.piso.toLowerCase().includes(q)
    );
  }, [allFauna, searchQuery]);

  // Marcadores biológicos a enviar al Mapa 3D según capas activas
  const bioMarkersFiltrados = useMemo(() => {
    const lista: BioMarkerItem[] = [];
    if (showFloraPins) lista.push(...floraFiltrada);
    if (showFaunaPins) lista.push(...faunaFiltrada);
    return lista;
  }, [showFloraPins, showFaunaPins, floraFiltrada, faunaFiltrada]);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-[#0A0B0B] text-[#F2F1EC]">
      {/* 1. MAPA 3D A PANTALLA COMPLETA */}
      <div className="w-full h-full">
        <Map3D
          lugaresFiltrados={lugaresFiltrados}
          lugarSeleccionado={selectedLugar}
          centroTrigger={centerTrigger}
          onSelectLugar={handleCenterLugar}
          bioMarkersFiltrados={bioMarkersFiltrados}
          bioMarkerSeleccionado={selectedBioItem}
          centroBioTrigger={centerBioTrigger}
          onSelectBioMarker={handleCenterBioItem}
        />
      </div>

      {/* 2. PANEL LATERAL DE EXPLORACIÓN */}
      <div
        className={`absolute top-3 left-3 bottom-3 sm:top-4 sm:left-4 sm:bottom-4 z-20 w-[calc(100%-24px)] max-w-sm sm:w-96 flex flex-col rounded-3xl bg-[#0E0F0F]/95 sm:bg-[#0E0F0F]/92 border border-white/15 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ${
          panelOpen ? 'translate-x-0' : '-translate-x-[115%]'
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
              className="p-1.5 rounded-xl text-[#9AA3A0] hover:text-white hover:bg-white/10 transition-colors"
              title="Minimizar panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pestañas de modo: Sitios · Flora · Fauna */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveTab('sitios')}
              className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'sitios'
                  ? 'bg-[#E8A15A] text-black font-bold shadow-md'
                  : 'text-[#9AA3A0] hover:text-white'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Sitios ({lugaresFiltrados.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('flora')}
              className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'flora'
                  ? 'bg-[#34D399] text-black font-bold shadow-md'
                  : 'text-[#9AA3A0] hover:text-white'
              }`}
            >
              <Flower2 className="w-3.5 h-3.5" />
              <span>Flora ({floraFiltrada.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('fauna')}
              className={`py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'fauna'
                  ? 'bg-[#818CF8] text-black font-bold shadow-md'
                  : 'text-[#9AA3A0] hover:text-white'
              }`}
            >
              <PawPrint className="w-3.5 h-3.5" />
              <span>Fauna ({faunaFiltrada.length})</span>
            </button>
          </div>

          {/* Buscador de texto unificado */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#9AA3A0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'sitios'
                  ? 'Buscar cumbre, glaciar o paraje...'
                  : activeTab === 'flora'
                  ? 'Buscar flor, hongo, pino o musgo...'
                  : 'Buscar teporingo, ave, víbora...'
              }
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-[#9AA3A0] focus:outline-none focus:border-[#E8A15A]/60"
            />
          </div>

          {/* Switches rápidos de capas sobre el mapa */}
          <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#9AA3A0]">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/50">
              <Layers className="w-3 h-3" />
              <span>Capas en Mapa 3D:</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFloraPins(!showFloraPins)}
                className={`px-2 py-0.5 rounded-lg border text-[10px] transition-colors flex items-center gap-1 ${
                  showFloraPins
                    ? 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]/40'
                    : 'bg-black/40 text-white/40 border-white/10'
                }`}
              >
                <span>🌸</span>
                <span>Flora</span>
              </button>

              <button
                onClick={() => setShowFaunaPins(!showFaunaPins)}
                className={`px-2 py-0.5 rounded-lg border text-[10px] transition-colors flex items-center gap-1 ${
                  showFaunaPins
                    ? 'bg-[#818CF8]/20 text-[#818CF8] border-[#818CF8]/40'
                    : 'bg-black/40 text-white/40 border-white/10'
                }`}
              >
                <span>🐾</span>
                <span>Fauna</span>
              </button>
            </div>
          </div>

          {/* Filtros por Categoría (solo en pestaña Sitios) */}
          {activeTab === 'sitios' && (
            <CategoryChips
              selectedCategory={selectedCat}
              onSelectCategory={handleSelectCategory}
            />
          )}
        </div>

        {/* Lista según la pestaña activa */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-2">
          {/* TAB 1: SITIOS */}
          {activeTab === 'sitios' && (
            <>
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
                      onClick={() => handleCenterLugar(lugar)}
                      className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3 group ${
                        isSelected
                          ? 'bg-white/15 border-[#E8A15A] shadow-xl shadow-[#E8A15A]/15 scale-[1.01]'
                          : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-black/60'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 relative">
                        <img
                          src={fotoThumb}
                          alt={lugar.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `${MEDIA_BASE}/fotos/bosque-hartwegii-480.webp`;
                          }}
                        />
                        <span
                          className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cat.colorHex }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs font-bold text-white group-hover:text-[#E8A15A] transition-colors truncate">
                          {lugar.nombre}
                        </h4>
                        <p className="text-[11px] text-[#9AA3A0] truncate mt-0.5">
                          {cat.nombre}
                        </p>
                        <span className="text-[10px] font-mono text-[#E8A15A]">
                          {lugar.altitud.toLocaleString()} m
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCenterLugar(lugar);
                        }}
                        className="p-2 rounded-xl bg-white/5 text-[#9AA3A0] group-hover:text-[#E8A15A] group-hover:bg-white/10 transition-colors shrink-0"
                        title="Volar al lugar"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* TAB 2: FLORA */}
          {activeTab === 'flora' && (
            <>
              {floraFiltrada.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#9AA3A0]">
                  No se encontraron especies botánicas con esa búsqueda.
                </div>
              ) : (
                floraFiltrada.map((item) => {
                  const isSelected = selectedBioItem?.id === item.id;
                  const fotoThumb = `${MEDIA_BASE}/fotos/${item.fotoId}-480.webp`;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleCenterBioItem(item)}
                      className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3 group ${
                        isSelected
                          ? 'bg-[#34D399]/20 border-[#34D399] shadow-xl shadow-[#34D399]/15 scale-[1.01]'
                          : 'bg-black/40 border-white/5 hover:border-[#34D399]/40 hover:bg-black/60'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 relative">
                        <img
                          src={fotoThumb}
                          alt={item.nombreComun}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `${MEDIA_BASE}/fotos/bosque-hartwegii-480.webp`;
                          }}
                        />
                        <span className="absolute top-1 left-1 text-[11px] leading-none drop-shadow">
                          {item.iconoEmoji}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs font-bold text-white group-hover:text-[#34D399] transition-colors truncate">
                          {item.nombreComun}
                        </h4>
                        <p className="text-[11px] italic text-[#9AA3A0] truncate mt-0.5 font-serif">
                          {item.nombreCientifico}
                        </p>
                        <span className="text-[10px] font-mono text-[#34D399]">
                          {item.altitud.toLocaleString()} m · {item.piso}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCenterBioItem(item);
                        }}
                        className="p-2 rounded-xl bg-white/5 text-[#9AA3A0] group-hover:text-[#34D399] group-hover:bg-white/10 transition-colors shrink-0"
                        title="Volar a la coordenada"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* TAB 3: FAUNA */}
          {activeTab === 'fauna' && (
            <>
              {faunaFiltrada.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#9AA3A0]">
                  No se encontraron especies de fauna con esa búsqueda.
                </div>
              ) : (
                faunaFiltrada.map((item) => {
                  const isSelected = selectedBioItem?.id === item.id;
                  const fotoThumb = `${MEDIA_BASE}/fotos/${item.fotoId}-480.webp`;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleCenterBioItem(item)}
                      className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3 group ${
                        isSelected
                          ? 'bg-[#818CF8]/20 border-[#818CF8] shadow-xl shadow-[#818CF8]/15 scale-[1.01]'
                          : 'bg-black/40 border-white/5 hover:border-[#818CF8]/40 hover:bg-black/60'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 relative">
                        <img
                          src={fotoThumb}
                          alt={item.nombreComun}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `${MEDIA_BASE}/fotos/teporingo-480.webp`;
                          }}
                        />
                        <span className="absolute top-1 left-1 text-[11px] leading-none drop-shadow">
                          {item.iconoEmoji}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs font-bold text-white group-hover:text-[#818CF8] transition-colors truncate">
                          {item.nombreComun}
                        </h4>
                        <p className="text-[11px] italic text-[#9AA3A0] truncate mt-0.5 font-serif">
                          {item.nombreCientifico}
                        </p>
                        <span className="text-[10px] font-mono text-[#818CF8]">
                          {item.altitud.toLocaleString()} m · {item.estadoLabel || item.piso}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCenterBioItem(item);
                        }}
                        className="p-2 rounded-xl bg-white/5 text-[#9AA3A0] group-hover:text-[#818CF8] group-hover:bg-white/10 transition-colors shrink-0"
                        title="Volar a la coordenada"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* Pie del panel con botón de ayuda */}
        <div className="p-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#9AA3A0] font-mono">
          <span>Relieve AWS · GPS 3D</span>
          <span className="text-[#E8A15A]">Conocimiento de la Montaña</span>
        </div>
      </div>

      {/* Botón flotante para reabrir panel si fue minimizado */}
      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="absolute top-4 left-4 z-20 px-4 py-2.5 rounded-2xl bg-[#0E0F0F]/90 text-white border border-white/15 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-mono font-semibold hover:bg-white hover:text-black transition-all"
        >
          <Mountain className="w-4 h-4 text-[#E8A15A]" />
          <span>Ver Explorador ({lugaresFiltrados.length + bioMarkersFiltrados.length})</span>
        </button>
      )}

      {/* 3. FICHA FLOTANTE DE LUGAR SELECCIONADO */}
      <PlaceSheet
        lugar={selectedLugar}
        onClose={() => setSelectedLugar(null)}
        onCenter={handleCenterLugar}
      />

      {/* 4. FICHA FLOTANTE DE FLORA Y FAUNA SELECCIONADA */}
      <BioSheet
        item={selectedBioItem}
        onClose={() => setSelectedBioItem(null)}
        onCenter={handleCenterBioItem}
      />
    </div>
  );
};
