import React, { useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
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
import { POPO_CRATER, POPO_EXCLUSION_RADIUS_KM, IZTA_CUMBRE } from '../config';
import { createGeoJSONCircle } from '../lib/geo';

interface Map3DProps {
  lugaresFiltrados?: Lugar[];
  lugarSeleccionado?: Lugar | null;
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
  onSelectLugar,
  modoCompacto = false,
  className = '',
  centroInicial = [-98.66, 19.10],
  zoomInicial = 10.6,
  pitchInicial = 70,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<{ [key: string]: MapLibreMarker }>({});
  const animationFrameRef = useRef<number | null>(null);

  const [isRotating, setIsRotating] = useState(false);
  const [showRutas, setShowRutas] = useState(true);
  const [showPopoRestriccion, setShowPopoRestriccion] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Inicialización del Mapa
  useEffect(() => {
    if (!mapContainer.current) return;

    const isMobile = window.innerWidth < 768;

    const map = new MapLibreMap({
      container: mapContainer.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
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
              'hillshade-exaggeration': 0.4,
            },
          },
        ],
        sky: {
          'sky-color': '#0E0F0F',
          'horizon-color': '#E8A15A',
          'fog-color': '#1A1C1B',
        } as any,
      },
      center: isMobile ? centroInicial : [-98.66, 19.05],
      zoom: isMobile ? zoomInicial - 0.5 : 9.8,
      pitch: pitchInicial,
      bearing: -20,
      maxPitch: 85,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      // Terreno 3D
      map.setTerrain({
        source: 'dem',
        exaggeration: isMobile ? 1.1 : 1.4,
      });

      // Animación suave de aproximación inicial
      if (!modoCompacto) {
        map.flyTo({
          center: centroInicial,
          zoom: zoomInicial,
          pitch: pitchInicial,
          bearing: -20,
          duration: 3500,
          essential: true,
        });
      }

      // 1. ZONA DE EXCLUSIÓN POPOCATÉPETL (12 KM)
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
          'fill-color': '#C2502E', // Magma
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

      // 2. ZONAS SENSIBLES ARQUEOLÓGICAS (700 M)
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
          'fill-color': '#B88A4A', // Ocre
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

      // 3. RUTAS / RECORRIDOS
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

      // 4. CAPAS GEOJSON PARA PUNTOS DE LUGARES DIRECTOS SOBRE EL RELIEVE 3D
      map.addSource('puntos-lugares', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Resplandor exterior (Glow)
      map.addLayer({
        id: 'lugares-glow',
        type: 'circle',
        source: 'puntos-lugares',
        paint: {
          'circle-radius': [
            'case',
            ['get', 'selected'],
            26,
            16,
          ],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.45,
          'circle-blur': 0.6,
        },
      });

      // Círculo del marcador con borde blanco grueso
      map.addLayer({
        id: 'lugares-circle',
        type: 'circle',
        source: 'puntos-lugares',
        paint: {
          'circle-radius': [
            'case',
            ['get', 'selected'],
            13,
            8.5,
          ],
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#FFFFFF',
        },
      });

      // Centro blanco para contraste
      map.addLayer({
        id: 'lugares-center-dot',
        type: 'circle',
        source: 'puntos-lugares',
        paint: {
          'circle-radius': 3.5,
          'circle-color': '#FFFFFF',
        },
      });

      // Etiquetas con nombre y altitud
      map.addLayer({
        id: 'lugares-label',
        type: 'symbol',
        source: 'puntos-lugares',
        layout: {
          'text-field': ['concat', ['get', 'nombre'], ' · ', ['get', 'altitud']],
          'text-size': 11,
          'text-offset': [0, 1.4],
          'text-anchor': 'top',
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#FFFFFF',
          'text-halo-color': '#0E0F0F',
          'text-halo-width': 2.5,
        },
      });

      // Eventos de clic sobre los círculos del mapa
      map.on('click', 'lugares-circle', (e) => {
        if (!e.features || e.features.length === 0) return;
        const lugarId = e.features[0].properties?.id;
        const found = LUGARES.find((l) => l.id === lugarId);
        if (found && onSelectLugar) {
          onSelectLugar(found);
        }
      });

      map.on('mouseenter', 'lugares-circle', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'lugares-circle', () => {
        map.getCanvas().style.cursor = '';
      });

      setMapLoaded(true);
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      map.remove();
    };
  }, []);

  // Sincronizar puntos GeoJSON y marcadores cuando cambian los lugares filtrados o el lugar seleccionado
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    const features = lugaresFiltrados.map((lugar) => {
      const cat = CATEGORIAS[lugar.categoria];
      const isSelected = lugarSeleccionado?.id === lugar.id;
      return {
        type: 'Feature',
        id: lugar.id,
        properties: {
          id: lugar.id,
          nombre: lugar.nombre,
          altitud: `${lugar.altitud.toLocaleString()} m`,
          color: cat?.colorHex || '#E8A15A',
          selected: isSelected,
        },
        geometry: {
          type: 'Point',
          coordinates: lugar.coords,
        },
      };
    });

    const source = map.getSource('puntos-lugares') as any;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features,
      });
    }

    // Actualizar propiedades de capas
    if (map.getLayer('lugares-glow')) {
      map.setPaintProperty('lugares-glow', 'circle-radius', [
        'case',
        ['get', 'selected'],
        26,
        16,
      ]);
    }

    if (map.getLayer('lugares-circle')) {
      map.setPaintProperty('lugares-circle', 'circle-radius', [
        'case',
        ['get', 'selected'],
        13,
        8.5,
      ]);
    }
  }, [lugaresFiltrados, lugarSeleccionado, mapLoaded]);

  // Actualizar visibilidad de capas de rutas y exclusión
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

  // Vuelo de cámara suave al seleccionar un lugar
  const volarALugar = (lugar: Lugar) => {
    if (!mapRef.current) return;
    const isDesktop = window.innerWidth >= 1024;

    mapRef.current.flyTo({
      center: lugar.coords,
      zoom: 13.8,
      pitch: 65,
      bearing: -15,
      // Desplazar el centro hacia la derecha en desktop para que no quede detrás del panel izquierdo
      offset: isDesktop ? [140, 0] : [0, -60],
      duration: 3000,
      essential: true,
    });
  };

  // Reaccionar cuando cambie `lugarSeleccionado` externamente
  useEffect(() => {
    if (lugarSeleccionado && mapLoaded) {
      volarALugar(lugarSeleccionado);
    }
  }, [lugarSeleccionado, mapLoaded]);

  // Rotación suave automática
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
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
  }, [isRotating, mapLoaded]);

  // Vista general de ambos volcanes
  const resetVistaGeneral = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [-98.66, 19.10],
      zoom: 10.6,
      pitch: 70,
      bearing: -20,
      offset: [0, 0],
      duration: 2500,
    });
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#0A0B0B] ${className}`}>
      {/* Contenedor WebGL */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Controles flotantes superiores derechos */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={resetVistaGeneral}
          className="p-2.5 rounded-xl bg-[#1A1C1B]/90 hover:bg-[#1A1C1B] border border-white/10 text-[#F2F1EC] hover:text-[#E8A15A] shadow-xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium"
          title="Vista general de ambos volcanes"
        >
          <Compass className="w-4 h-4 text-[#E8A15A]" />
          <span className="hidden sm:inline">Vista General</span>
        </button>

        {lugarSeleccionado && (
          <button
            onClick={() => volarALugar(lugarSeleccionado)}
            className="p-2.5 rounded-xl bg-[#E8A15A] text-black font-semibold shadow-xl transition-all flex items-center gap-1.5 text-xs"
            title="Centrar en el lugar activo"
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Centrar Lugar</span>
          </button>
        )}

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2.5 rounded-xl border shadow-xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium ${
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
          className={`p-2.5 rounded-xl border shadow-xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium ${
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
          className={`p-2.5 rounded-xl border shadow-xl backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium ${
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
