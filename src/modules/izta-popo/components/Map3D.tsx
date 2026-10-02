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
  modoCompacto = false,
  className = '',
  centroInicial = [-98.64, 19.10],
  zoomInicial = 11.2,
  pitchInicial = 68,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<{ [key: string]: MapLibreMarker }>({});
  const animationFrameRef = useRef<number | null>(null);

  const [isRotating, setIsRotating] = useState(false);
  const [showRutas, setShowRutas] = useState(true);
  const [showPopoRestriccion, setShowPopoRestriccion] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Vuelo de cámara suave al seleccionar un lugar adaptado a PC vs Móvil
  const volarALugar = (lugar: Lugar) => {
    if (!mapRef.current) return;
    const isDesktop = window.innerWidth >= 1024;
    const isMobile = window.innerWidth < 768;

    mapRef.current.flyTo({
      center: lugar.coords,
      zoom: isMobile ? 13.2 : 13.8,
      pitch: isMobile ? 55 : 65,
      bearing: -15,
      // En PC desplazamos hacia la derecha (el panel está a la izquierda).
      // En móvil desplazamos hacia ARRIBA (-115px) para que la montaña quede libre en la mitad superior de la pantalla.
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
            encoding: 'terrarium',
            tiles: [
              'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            maxzoom: 15,
          },
        },
        layers: [
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite',
            minzoom: 0,
            maxzoom: 19,
          },
          {
            id: 'hills',
            type: 'hillshade',
            source: 'dem',
            paint: {
              'hillshade-shadow-color': '#0E0F0F',
              'hillshade-highlight-color': '#E8A15A',
              'hillshade-accent-color': '#1A1C1B',
              'hillshade-exaggeration': 0.35,
            },
          },
        ],
      },
      center: centroInicial,
      zoom: isMobile ? zoomInicial - 0.7 : zoomInicial,
      pitch: pitchInicial,
      bearing: -15,
      maxPitch: 85,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('error', (e) => {
      console.warn('[MapLibre Event]:', e);
    });

    map.on('load', () => {
      // Activar Terreno 3D
      try {
        map.setTerrain({
          source: 'dem',
          exaggeration: isMobile ? 1.1 : 1.4,
        });
      } catch (err) {
        console.warn('Error al activar relieve 3D:', err);
      }

      // Animación suave de aproximación inicial si no es compacto
      if (!modoCompacto) {
        map.flyTo({
          center: centroInicial,
          zoom: isMobile ? zoomInicial - 0.5 : zoomInicial,
          pitch: pitchInicial,
          bearing: -15,
          duration: 2500,
          essential: true,
        });
      }

      // 1. ZONA DE EXCLUSIÓN POPOCATÉPETL (12 KM)
      try {
        const popoCircle = createGeoJSONCircle(POPO_CRATER, POPO_EXCLUSION_RADIUS_KM * 1000);
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

  // Marcadores interactivos HTML 3D adaptativos (limpios y sin amontonamiento en móviles)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const isMobile = window.innerWidth < 768;

    // Limpiar marcadores anteriores
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    lugaresFiltrados.forEach((lugar) => {
      const cat = CATEGORIAS[lugar.categoria];
      const isSelected = lugarSeleccionado?.id === lugar.id;
      const color = cat?.colorHex || '#E8A15A';

      // Elemento DOM interactivo
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

  // Reaccionar cuando cambie `lugarSeleccionado` por selección de tarjeta
  useEffect(() => {
    if (lugarSeleccionado && mapRef.current) {
      volarALugar(lugarSeleccionado);
    }
  }, [lugarSeleccionado?.id]);

  // Reaccionar ante un trigger explícito de centrado (botón "Centrar vista")
  useEffect(() => {
    if (centroTrigger?.lugar && mapRef.current) {
      volarALugar(centroTrigger.lugar);
    }
  }, [centroTrigger]);

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

  // Vista general de ambos volcanes (exactamente [-98.64, 19.10], zoom 11.2, pitch 68, bearing -15)
  const resetVistaGeneral = () => {
    if (!mapRef.current) return;
    const isMobile = window.innerWidth < 768;
    mapRef.current.flyTo({
      center: [-98.64, 19.10],
      zoom: isMobile ? 10.5 : 11.2,
      pitch: 68,
      bearing: -15,
      offset: [0, 0],
      duration: 2500,
    });
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#0A0B0B] ${className}`}>
      {/* Contenedor WebGL */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Controles flotantes superiores derechos */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col gap-1.5 sm:gap-2">
        <button
          onClick={resetVistaGeneral}
          className="p-2 sm:p-2.5 rounded-xl bg-[#1A1C1B]/90 hover:bg-[#1A1C1B] border border-white/10 text-[#F2F1EC] hover:text-[#E8A15A] shadow-xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium"
          title="Vista general de ambos volcanes"
        >
          <Compass className="w-4 h-4 text-[#E8A15A]" />
          <span className="hidden sm:inline">Vista General</span>
        </button>

        {lugarSeleccionado && (
          <button
            onClick={() => volarALugar(lugarSeleccionado)}
            className="p-2 sm:p-2.5 rounded-xl bg-[#E8A15A] hover:bg-[#f3b578] text-black font-semibold shadow-xl transition-all flex items-center gap-1.5 text-xs"
            title="Centrar en el lugar activo"
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Centrar Lugar</span>
          </button>
        )}

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2 sm:p-2.5 rounded-xl border shadow-xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium ${
            isRotating
              ? 'bg-[#E8A15A] text-black border-[#E8A15A]'
              : 'bg-[#1A1C1B]/90 hover:bg-[#1A1C1B] border-white/10 text-[#F2F1EC]'
          }`}
          title="Girar cámara lentamente"
        >
          <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Rotar</span>
        </button>

        <button
          onClick={() => setShowRutas(!showRutas)}
          className={`p-2 sm:p-2.5 rounded-xl border shadow-xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium ${
            showRutas
              ? 'bg-[#1A1C1B]/90 border-[#8FC1D4]/40 text-[#8FC1D4]'
              : 'bg-[#1A1C1B]/60 border-white/10 text-[#9AA3A0]'
          }`}
          title="Mostrar u ocultar senderos y rutas"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">Rutas</span>
        </button>

        <button
          onClick={() => setShowPopoRestriccion(!showPopoRestriccion)}
          className={`p-2 sm:p-2.5 rounded-xl border shadow-xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium ${
            showPopoRestriccion
              ? 'bg-[#1A1C1B]/90 border-[#C2502E]/40 text-[#C2502E]'
              : 'bg-[#1A1C1B]/60 border-white/10 text-[#9AA3A0]'
          }`}
          title="Zona de exclusión Popocatépetl 12 km"
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="hidden sm:inline">Zona Popo</span>
        </button>
      </div>

      {/* Controles de Zoom inferiores */}
      <div className="absolute bottom-6 right-4 z-20 hidden sm:flex flex-col bg-[#1A1C1B]/90 border border-white/10 rounded-xl overflow-hidden shadow-xl backdrop-blur-md">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="p-2 text-[#9AA3A0] hover:text-white hover:bg-white/10 transition-colors border-b border-white/5"
          title="Acercar mapa"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="p-2 text-[#9AA3A0] hover:text-white hover:bg-white/10 transition-colors"
          title="Alejar mapa"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Atribución de datos de mapas obligatoria */}
      <div className="absolute bottom-2 right-2 sm:right-16 z-10 px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white/50 backdrop-blur-sm pointer-events-none">
        Esri · AWS Terrarium DEM · MapLibre GL
      </div>
    </div>
  );
};
