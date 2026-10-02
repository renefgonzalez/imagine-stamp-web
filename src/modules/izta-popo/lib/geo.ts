import { POPO_CRATER, POPO_EXCLUSION_RADIUS_KM } from '../config';

// Cálculo de distancia Haversine en kilómetros entre dos coordenadas [lng, lat]
export function haversineDistance(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Genera un polígono GeoJSON circular aproximado para zonas sensibles y exclusión
export function createGeoJSONCircle(
  center: [number, number],
  radiusInMeters: number,
  points: number = 64
): GeoJSON.Feature<GeoJSON.Polygon> {
  const [lng, lat] = center;
  const coords: [number, number][] = [];
  const distanceX = radiusInMeters / (111320 * Math.cos((lat * Math.PI) / 180));
  const distanceY = radiusInMeters / 110540;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([lng + x, lat + y]);
  }
  coords.push(coords[0]); // cerrar polígono

  return {
    type: 'Feature',
    properties: {
      radius: radiusInMeters,
      center,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [coords],
    },
  };
}

// Valida si una coordenada está dentro de la zona de restricción volcánica (12 km del cráter del Popo)
export function isWithinPopoRadius(coords: [number, number]): boolean {
  return haversineDistance(coords, POPO_CRATER) <= POPO_EXCLUSION_RADIUS_KM;
}
