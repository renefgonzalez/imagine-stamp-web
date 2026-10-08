import { PLANTAS, Planta } from './flora';
import { ANIMALES, Fauna } from './fauna';
import { LUGARES, Lugar } from './lugares';

export type BioTipo = 'flora' | 'fauna';

export interface BioMarkerItem {
  id: string;
  tipo: BioTipo;
  nombreComun: string;
  nombreCientifico: string;
  piso: string;
  reinoOGrupo: string;
  altitud: number;
  altitudLabel: string;
  coords: [number, number]; // [lng, lat]
  fotoId: string;
  colorHex: string;
  iconoEmoji: string;
  badgeText: string;
  datoCurioso: string;
  floracionODieta: string;
  estadoConservacion?: string;
  estadoLabel?: string;
  lugarReferencia: string;
  esGpsNativo?: boolean;
}

// Coordenadas base de referencia por sitio documentado en el Parque Izta-Popo
const LUGAR_COORDS: Record<string, [number, number]> = {
  'paso-de-cortes': [-98.6430, 19.0888],
  'la-joya': [-98.6480, 19.1370],
  'bosque-hartwegii': [-98.6350, 19.1020],
  'oyamel': [-98.6550, 19.0720],
  'glaciar-ayoloco': [-98.6410, 19.1760],
  'sacromonte': [-98.7610, 19.0640],
  'tenenepanco': [-98.6380, 19.1200],
  'teporingo': [-98.6500, 19.0950],
  'mirador-popo': [-98.6300, 19.0550],
  'cumbre-izta': [-98.6410, 19.1790],
};

// Altitud promedio por piso ecológico
const PISO_ALTITUD: Record<string, number> = {
  'oyamel': 3150,
  'pino-altura': 3750,
  'zacatonal': 4150,
  'alpino': 4650,
};

const PISO_NOMBRES: Record<string, string> = {
  'oyamel': 'Bosque de Oyamel',
  'pino-altura': 'Pino de Altura',
  'zacatonal': 'Pradera Alpina (Zacatonal)',
  'alpino': 'Alta Montaña / Semidesierto Alpino',
};

// Generador de dispersión determinista para que cada especie tenga su propio punto en el relieve
function getDeterministicOffset(id: string): [number, number] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const h1 = Math.abs(hash);
  const h2 = Math.abs((hash ^ 0x55555555) >> 2);

  // Desplazamiento sutil de 150m a 400m
  const dLng = ((h1 % 100) / 100 - 0.5) * 0.0075;
  const dLat = ((h2 % 100) / 100 - 0.5) * 0.0075;
  return [dLng, dLat];
}

// Convertir PLANTAS en marcadores interactivos 3D
export function getFloraMarkers(): BioMarkerItem[] {
  return PLANTAS.map((planta) => {
    const primerLugar = planta.lugares[0] || 'la-joya';
    const baseCoords = LUGAR_COORDS[primerLugar] || [-98.6480, 19.1370];
    const [dLng, dLat] = getDeterministicOffset(planta.id);
    const coords: [number, number] = [
      Number((baseCoords[0] + dLng).toFixed(5)),
      Number((baseCoords[1] + dLat).toFixed(5)),
    ];

    const altPromedio = Math.round((planta.altitudMin + planta.altitudMax) / 2) || PISO_ALTITUD[planta.piso] || 3800;

    let emoji = '🌸';
    let color = '#34D399'; // Esmeralda
    if (planta.reino === 'funga') {
      emoji = '🍄';
      color = '#F59E0B'; // Ámbar Funga
    } else if (planta.reino === 'musgos') {
      emoji = '🌿';
      color = '#10B981';
    } else if (planta.reino === 'liquenes') {
      emoji = '🪨';
      color = '#A7F3D0';
    }

    return {
      id: `flora-${planta.id}`,
      tipo: 'flora',
      nombreComun: planta.nombreComun,
      nombreCientifico: planta.nombreCientifico,
      piso: PISO_NOMBRES[planta.piso] || planta.piso,
      reinoOGrupo: planta.reino.toUpperCase(),
      altitud: altPromedio,
      altitudLabel: `${planta.altitudMin.toLocaleString()} – ${planta.altitudMax.toLocaleString()} m`,
      coords,
      fotoId: planta.fotoId || planta.fotos?.[0] || 'bosque-hartwegii',
      colorHex: color,
      iconoEmoji: emoji,
      badgeText: planta.reino === 'funga' ? 'Funga Volcánica' : 'Flora de Altura',
      datoCurioso: planta.datoCurioso,
      floracionODieta: `Floración: ${planta.floracion}`,
      lugarReferencia: primerLugar,
    };
  });
}

// Convertir ANIMALES en marcadores interactivos 3D
export function getFaunaMarkers(): BioMarkerItem[] {
  return ANIMALES.map((fauna) => {
    const primerLugar = fauna.lugares[0] || 'teporingo';
    const baseCoords = LUGAR_COORDS[primerLugar] || [-98.6500, 19.0950];
    const [dLng, dLat] = getDeterministicOffset(fauna.id);
    const coords: [number, number] = [
      Number((baseCoords[0] + dLng).toFixed(5)),
      Number((baseCoords[1] + dLat).toFixed(5)),
    ];

    const altPromedio = Math.round((fauna.altitudMin + fauna.altitudMax) / 2) || PISO_ALTITUD[fauna.piso] || 3500;

    let emoji = '🐾';
    let color = '#818CF8'; // Violeta Índigo
    if (fauna.grupo === 'aves') {
      emoji = '🦅';
      color = '#38BDF8'; // Celeste Aves
    } else if (fauna.grupo === 'reptiles') {
      emoji = '🦎';
      color = '#4ADE80';
    } else if (fauna.grupo === 'insectos') {
      emoji = '🦋';
      color = '#F472B6';
    }

    return {
      id: `fauna-${fauna.id}`,
      tipo: 'fauna',
      nombreComun: fauna.nombreComun,
      nombreCientifico: fauna.nombreCientifico,
      piso: PISO_NOMBRES[fauna.piso] || fauna.piso,
      reinoOGrupo: fauna.grupo.toUpperCase(),
      altitud: altPromedio,
      altitudLabel: `${fauna.altitudMin.toLocaleString()} – ${fauna.altitudMax.toLocaleString()} m`,
      coords,
      fotoId: fauna.fotoId || fauna.fotos?.[0] || 'teporingo',
      colorHex: color,
      iconoEmoji: emoji,
      badgeText: fauna.estadoLabel,
      datoCurioso: fauna.datoCurioso,
      floracionODieta: `Alimentación: ${fauna.dieta}`,
      estadoConservacion: fauna.estadoConservacion,
      estadoLabel: fauna.estadoLabel,
      lugarReferencia: primerLugar,
    };
  });
}
