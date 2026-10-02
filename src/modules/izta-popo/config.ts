// Configuración del demo Izta-Popo Expediciones
export const CLIENT_NAME: string = "Izta-Popo · Expediciones";
export const GUIDE_NAME: string = "Martín Hernández";
export const GUIDE_ROLE: string = "Guía de Alta Montaña & Explorador de Biodiversidad";
export const WHATSAPP_PHONE: string = "525500000000";
export const WHATSAPP_URL: string = `https://wa.me/${WHATSAPP_PHONE}?text=Hola,%20me%20interesa%20un%20recorrido%20en%20el%20Izta-Popo`;

// Rutas de medios (en producción: CDN / Bunny Storage & Stream)
export const MEDIA_BASE: string = "/izta-popo/media";
export const STREAM_BASE: string = ""; // en producción: "https://video.bunnycdn.com/play/..."

// Coordenadas clave
export const POPO_CRATER: [number, number] = [-98.6278, 19.0225]; // [lng, lat]
export const IZTA_CUMBRE: [number, number] = [-98.6422, 19.1789];
export const POPO_EXCLUSION_RADIUS_KM: number = 12;
