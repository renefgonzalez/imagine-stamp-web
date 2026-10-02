// Configuración de Conocimiento de la Montaña
export const CLIENT_NAME: string = "Conocimiento de la Montaña";
export const GUIDE_NAME: string = "Ricardo Pérez Romero";
export const GUIDE_ROLE: string = "Fundador de Conocimiento de la Montaña";
export const CONTACT_EMAIL: string = "riezroo@yahoo.com.mx";
export const WHATSAPP_PHONE: string = "525500000000";
export const WHATSAPP_NUMBER: string = WHATSAPP_PHONE;
export const VOLUNTEER_WHATSAPP_MESSAGE: string = "Hola, quiero sumarme como voluntario a Conocimiento de la Montaña";
export const WHATSAPP_URL: string = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(VOLUNTEER_WHATSAPP_MESSAGE)}`;

export const SOCIAL_LINKS = {
  facebook: "#", // TODO: URL real del cliente
  instagram: "#", // TODO: URL real del cliente
  youtube: "#", // TODO: URL real del cliente
};

// Rutas de medios
export const MEDIA_BASE: string = "/izta-popo/media";
export const STREAM_BASE: string = "";

// Coordenadas clave
export const POPO_CRATER: [number, number] = [-98.6278, 19.0225]; // [lng, lat]
export const IZTA_CUMBRE: [number, number] = [-98.6422, 19.1789];
export const POPO_EXCLUSION_RADIUS_KM: number = 12;

// Vista inicial de los dos volcanes de frente (Criterio E5)
export const MAPA_VISTA_INICIAL = {
  center: [-98.64, 19.10] as [number, number],
  zoom: 11.2,
  pitch: 68,
  bearing: -15,
};
