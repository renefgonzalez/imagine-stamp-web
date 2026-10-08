import React, { useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap, Marker as MapLibreMarker, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  RotateCw,
  Compass,
  Layers,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Target
} from 'lucide-react';
import { LUGARES, Lugar } from '../data/lugares';
import { RECORRIDOS } from '../data/recorridos';
import { CATEGORIAS } from '../data/categorias';
import { BioMarkerItem } from '../data/bioMarkers';
import { POPO_CRATER, POPO_EXCLUSION_RADIUS_KM } from '../config';
import { createGeoJSONCircle } from '../lib/geo';

// Configurar URL del worker estático local para evitar fallos de resolución en Vite / producción
if (typeof window !== 'undefined') {
  try {
    setWorkerUrl('/izta-popo/maplibre-gl-worker.mjs');
  } catch (err) {
    console.warn('No se pudo establecer workerUrl de MapLibre:', err);
  }
}

interface Map3DProps {
  lugaresFiltrados?: Lugar[];
  lugarSeleccionado?: Lugar | null;
  centroTrigger?: { lugar: Lugar; count: number } | null;
  onSelectLugar?: (lugar: Lugar) => void;
  bioMarkersFiltrados?: BioMarkerItem[];
  bioMarkerSeleccionado?: BioMarkerItem | null;
  centroBioTrigger?: { item: BioMarkerItem; count: number } | null;
  onSelectBioMarker?: (item: BioMarkerItem) => void;
  modoCompacto?: boolean;
  className?: string;
  centroInicial?: [number, number];
  zoomInicial?: number;
  pitchInicial?: number;
}

export const Map3D: React.FC<Map3DProps> = ({
  lugaresFiltrados = LUGARES,
  lugarSeleccionado = null,
  centroTrigger = null,
  onSelectLugar,
  bioMarkersFiltrados = [],
  bioMarkerSeleccionado = null,
  centroBioTrigger = null,
  onSelectBioMarker,
  modoCompacto = false,
  className = '',
  centroInicial = [-98.64, 19.10],
  zoomInicial = 11.2,
  pitchInicial = 68,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<{ [key: string]: MapLibreMarker }>({});
  const bioMarkersRef = useRef<{ [key: string]: MapLibreMarker }>({});
  const animationFrameRef = useRef<number | null>(null);

  const [isRotating, setIsRotating] = useState(false);
  const [showRutas, setShowRutas] = useState(true);
  const [showPopoRestriccion, setShowPopoRestriccion] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Vuelo de cámara suave al seleccionar un lugar
  const volarALugar = (lugar: Lugar) => {
    if (!mapRef.current) return;
    const isDesktop = window.innerWidth >= 1024;
    const isMobile = window.innerWidth < 768;

    mapRef.current.flyTo({
      center: lugar.coords,
      zoom: isMobile ? 13.2 : 13.8,
      pitch: isMobile ? 55 : 65,
      bearing: -15,
      offset: isDesktop ? [140, 0] : isMobile ? [0, -115] : [0, -40],
      duration: 2200,
      essential: true,
    });
  };

  // Vuelo de cámara suave hacia una especie de flora o fauna
  const volarACoords = (coords: [number, number]) => {
    if (!mapRef.current) return;
    const isDesktop = window.innerWidth >= 1024;
    const isMobile = window.innerWidth < 768;

    mapRef.current.flyTo({
      center: coords,
      zoom: isMobile ? 13.6 : 14.3,
      pitch: isMobile ? 55 : 62,
      bearing: -15,
      offset: isDesktop ? [140, 0] : isMobile ? [0, -115] : [0, -40],
      duration: 2200,
      essential: true,
    });
  };

  // Inicialización del Mapa
  useEffect(() => {
    if (!mapContainer.current) return;

    const isMobile = window.innerWidth < 768;

    const map = new MapLibreMap({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          satellite: {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: 'Esri, Maxar, Earthstar Geographics',
          },
          dem: {
            type: 'raster-dem',
            tiles: [
              'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
            ],
            encoding: 'terrarium',
            tileSize: 256,
          },
        },
        layers: [
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite',
            paint: {
              'raster-opacity': 1,
              'raster-contrast': 0.1,
              'raster-saturation': 0.05,
            },
          },
        ],
        terrain: {
          source: 'dem',
          exaggeration: 1.45, // Relieve 3D marcado para apreciar cañadas y cumbres
        },
        sky: {
          'sky-color': '#0B0D0F',
          'sky-horizon-blend': 0.5,
          'horizon-color': '#1E232A',
          'horizon-fog-blend': 0.8,
          'fog-color': '#0B0D0F',
          'fog-ground-blend': 0.8,
        },
      } as any,
      center: centroInicial,
      zoom: isMobile ? 10.4 : zoomInicial,
      pitch: isMobile ? 55 : pitchInicial,
      bearing: -15,
      maxPitch: 85,
      antialias: true,
    });

    mapRef.current = map;

    map.on('load', () => {
      // 1. ZONA DE EXCLUSIÓN VOLCÁNICA POPOCATÉPETL (12 KM)
      try {
        const popoCircle = createGeoJSONCircle(POPO_CRATER, POPO_EXCLUSION_RADIUS_KM);
        map.addSource('popo-exclusion', {
          type: 'geojson',
          data: popoCircle,
        });

        map.addLayer({
          id: 'popo-exclusion-fill',
          type: 'fill',
          source: 'popo-exclusion',
          paint: {
            'fill-color': '#C2502E',
            'fill-opacity': 0.15,
          },
        });

        map.addLayer({
          id: 'popo-exclusion-line',
          type: 'line',
          source: 'popo-exclusion',
          paint: {
            'line-color': '#C2502E',
            'line-width': 2.5,
            'line-dasharray': [3, 2],
          },
        });
      } catch (err) {
        console.warn('Error al agregar capa Popo:', err);
      }

      // 2. ZONAS SENSIBLES ARQUEOLÓGICAS (700 M)
      try {
        const sitiosSensibles = LUGARES.filter((l) => l.sensible);
        const sensiblesFeatures = sitiosSensibles.map((s) =>
          createGeoJSONCircle(s.coords, 700)
        );

        map.addSource('zonas-sensibles', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: sensiblesFeatures,
          },
        });

        map.addLayer({
          id: 'zonas-sensibles-fill',
          type: 'fill',
          source: 'zonas-sensibles',
          paint: {
            'fill-color': '#B88A4A',
            'fill-opacity': 0.28,
          },
        });

        map.addLayer({
          id: 'zonas-sensibles-line',
          type: 'line',
          source: 'zonas-sensibles',
          paint: {
            'line-color': '#B88A4A',
            'line-width': 2,
            'line-dasharray': [2, 2],
          },
        });
      } catch (err) {
        console.warn('Error al agregar capas sensibles:', err);
      }

      // 3. RUTAS / RECORRIDOS
      try {
        const rutasFeatures = RECORRIDOS.map((r) => ({
          type: 'Feature',
          properties: { id: r.id, color: r.color },
          geometry: {
            type: 'LineString',
            coordinates: r.coordenadas,
          },
        }));

        map.addSource('recorridos-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: rutasFeatures as any,
          },
        });

        map.addLayer({
          id: 'recorridos-lines',
          type: 'line',
          source: 'recorridos-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 3.5,
            'line-opacity': 0.85,
          },
        });
      } catch (err) {
        console.warn('Error al agregar capas de rutas:', err);
      }

      setMapLoaded(true);
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      map.remove();
    };
  }, []);

  // 1. Marcadores de Lugares Geográficos
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const isMobile = window.innerWidth < 768;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    lugaresFiltrados.forEach((lugar) => {
      const cat = CATEGORIAS[lugar.categoria];
      const isSelected = lugarSeleccionado?.id === lugar.id;
      const color = cat?.colorHex || '#E8A15A';

      const el = document.createElement('div');
      el.className = 'group relative flex flex-col items-center cursor-pointer select-none transition-transform duration-200';
      el.style.zIndex = isSelected ? '50' : '10';

      const showBadge = !isMobile || isSelected;

      el.innerHTML = `
        <div class="${showBadge ? 'flex' : 'hidden group-hover:flex'} px-2 py-0.5 mb-1 rounded-full text-[10px] font-mono font-bold tracking-wider backdrop-blur-md border shadow-xl transition-all duration-200 items-center gap-1.5 whitespace-nowrap ${
          isSelected
            ? 'bg-[#E8A15A] text-black border-white shadow-[#E8A15A]/50 scale-110'
            : 'bg-[#0E0F0F]/90 text-white/90 border-white/20 group-hover:border-[#E8A15A] group-hover:scale-105'
        }">
          <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background-color: ${isSelected ? '#000000' : color};"></span>
          <span>${lugar.nombre}</span>
          <span class="opacity-60 text-[9px] font-normal">${lugar.altitud.toLocaleString()}m</span>
        </div>
        <div class="relative flex items-center justify-center">
          ${
            isSelected
              ? `<div class="absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full animate-ping opacity-75" style="background-color: ${color};"></div>`
              : ''
          }
          <div class="w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-transform duration-300 relative shadow-2xl ${
            isSelected
              ? 'scale-125 ring-4 ring-[#E8A15A]/60'
              : 'group-hover:scale-110'
          }" style="background-color: ${color}; border: 2px solid #FFFFFF;"></div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onSelectLugar) {
          onSelectLugar(lugar);
        }
        volarALugar(lugar);
      });

      const marker = new MapLibreMarker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(lugar.coords)
        .addTo(map);

      markersRef.current[lugar.id] = marker;
    });
  }, [lugaresFiltrados, lugarSeleccionado]);

  // 2. Marcadores Interactivos de FLORA y FAUNA
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const isMobile = window.innerWidth < 768;

    Object.values(bioMarkersRef.current).forEach((m) => m.remove());
    bioMarkersRef.current = {};

    bioMarkersFiltrados.forEach((item) => {
      const isSelected = bioMarkerSeleccionado?.id === item.id;
      const color = item.colorHex;

      const el = document.createElement('div');
      el.className = 'group relative flex flex-col items-center cursor-pointer select-none transition-transform duration-200';
      el.style.zIndex = isSelected ? '60' : '20';

      const showBadge = !isMobile || isSelected;

      el.innerHTML = `
        <div class="${showBadge ? 'flex' : 'hidden group-hover:flex'} px-2 py-0.5 mb-1 rounded-full text-[10px] font-mono font-bold tracking-wider backdrop-blur-md border shadow-xl transition-all duration-200 items-center gap-1.5 whitespace-nowrap ${
          isSelected
            ? 'bg-white text-black border-[#E8A15A] shadow-xl scale-110'
            : 'bg-[#0E0F0F]/95 text-white/95 border-white/20 group-hover:border-white group-hover:scale-105'
        }">
          <span class="text-xs leading-none">${item.iconoEmoji}</span>
          <span class="truncate max-w-[130px]">${item.nombreComun}</span>
          <span class="opacity-70 text-[9px] font-normal" style="color: ${color};">${item.altitud}m</span>
        </div>
        <div class="relative flex items-center justify-center">
          ${
            isSelected
              ? `<div class="absolute w-8 h-8 rounded-full animate-ping opacity-80" style="background-color: ${color};"></div>`
              : ''
          }
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-2xl transition-all duration-300 relative ${
            isSelected
              ? 'scale-125 ring-4 ring-white/80'
              : 'group-hover:scale-115'
          }" style="background-color: #141615; border: 2px solid ${color};">
            <span class="leading-none text-[11px]">${item.iconoEmoji}</span>
          </div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onSelectBioMarker) {
          onSelectBioMarker(item);
        }
        volarACoords(item.coords);
      });

      const marker = new MapLibreMarker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(item.coords)
        .addTo(map);

      bioMarkersRef.current[item.id] = marker;
    });
  }, [bioMarkersFiltrados, bioMarkerSeleccionado]);

  // Actualizar visibilidad de capas de rutas y exclusión volcánica
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    if (map.getLayer('recorridos-lines')) {
      map.setLayoutProperty('recorridos-lines', 'visibility', showRutas ? 'visible' : 'none');
    }

    if (map.getLayer('popo-exclusion-fill')) {
      map.setLayoutProperty('popo-exclusion-fill', 'visibility', showPopoRestriccion ? 'visible' : 'none');
      map.setLayoutProperty('popo-exclusion-line', 'visibility', showPopoRestriccion ? 'visible' : 'none');
    }
  }, [showRutas, showPopoRestriccion, mapLoaded]);

  // Reaccionar cuando cambie `lugarSeleccionado`
  useEffect(() => {
    if (lugarSeleccionado && mapRef.current) {
      volarALugar(lugarSeleccionado);
    }
  }, [lugarSeleccionado?.id]);

  // Reaccionar ante un trigger explícito de centrado de lugar
  useEffect(() => {
    if (centroTrigger?.lugar && mapRef.current) {
      volarALugar(centroTrigger.lugar);
    }
  }, [centroTrigger]);

  // Reaccionar ante un trigger de centrado de flora/fauna
  useEffect(() => {
    if (centroBioTrigger?.item && mapRef.current) {
      volarACoords(centroBioTrigger.item.coords);
    }
  }, [centroBioTrigger]);

  // Rotación suave automática del relieve 3D
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const rotateStep = () => {
      if (!isRotating) return;
      map.setBearing(map.getBearing() + 0.15);
      animationFrameRef.current = requestAnimationFrame(rotateStep);
    };

    if (isRotating) {
      animationFrameRef.current = requestAnimationFrame(rotateStep);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRotating]);

  // Vista general de ambos volcanes
  const resetVistaGeneral = () => {
    if (!mapRef.current) return;
    const isMobile = window.innerWidth < 768;
    mapRef.current.flyTo({
      center: [-98.64, 19.10],
      zoom: isMobile ? 10.5 : 11.2,
      pitch: 68,
      bearing: -15,
      offset: [0, 0],
      duration: 1800,
      essential: true,
    });
  };

  const zoomIn = () => {
    mapRef.current?.zoomIn({ duration: 300 });
  };

  const zoomOut = () => {
    mapRef.current?.zoomOut({ duration: 300 });
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Contenedor MapLibre GL */}
      <div ref={mapContainer} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Controles Flotantes 3D */}
      {!modoCompacto && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {/* Vista General */}
          <button
            onClick={resetVistaGeneral}
            className="p-2.5 rounded-2xl bg-[#0E0F0F]/90 hover:bg-[#E8A15A] hover:text-black text-white border border-white/10 shadow-2xl backdrop-blur-md transition-all duration-200 flex items-center justify-center group"
            title="Vista panorámica de ambos volcanes"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          </button>

          {/* Rotación 3D */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-200 flex items-center justify-center ${
              isRotating
                ? 'bg-[#E8A15A] text-black border-white'
                : 'bg-[#0E0F0F]/90 text-white border-white/10 hover:border-white/30'
            }`}
            title={isRotating ? 'Detener rotación' : 'Rotar relieve 3D'}
          >
            <RotateCw className={`w-5 h-5 ${isRotating ? 'animate-spin' : ''}`} />
          </button>

          {/* Rutas de senderismo */}
          <button
            onClick={() => setShowRutas(!showRutas)}
            className={`p-2.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-200 flex items-center justify-center ${
              showRutas
                ? 'bg-white/20 text-[#8FC1D4] border-[#8FC1D4]/50'
                : 'bg-[#0E0F0F]/90 text-white/50 border-white/10'
            }`}
            title="Activar / Desactivar senderos"
          >
            <Layers className="w-5 h-5" />
          </button>

          {/* Radio de exclusión Popo */}
          <button
            onClick={() => setShowPopoRestriccion(!showPopoRestriccion)}
            className={`p-2.5 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-200 flex items-center justify-center ${
              showPopoRestriccion
                ? 'bg-[#C2502E]/30 text-[#f89b82] border-[#C2502E]/50'
                : 'bg-[#0E0F0F]/90 text-white/50 border-white/10'
            }`}
            title="Zona de exclusión 12 km Popocatépetl"
          >
            <AlertTriangle className="w-5 h-5" />
          </button>

          {/* Zoom In / Out */}
          <div className="flex flex-col rounded-2xl bg-[#0E0F0F]/90 border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden mt-1">
            <button
              onClick={zoomIn}
              className="p-2.5 text-white hover:bg-white/10 hover:text-[#E8A15A] transition-colors"
              title="Acercar mapa"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <div className="h-[1px] bg-white/10" />
            <button
              onClick={zoomOut}
              className="p-2.5 text-white hover:bg-white/10 hover:text-[#E8A15A] transition-colors"
              title="Alejar mapa"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Brújula e indicador de altitud */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#0E0F0F]/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-[#9AA3A0]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E8A15A] animate-pulse" />
          <span>Relieve DEM AWS 3D</span>
        </span>
        <span>•</span>
        <span>Satélite Esri World Imagery</span>
      </div>
    </div>
  );
};
