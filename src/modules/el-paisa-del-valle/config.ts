// ── Configuración: TAQUERÍA EL PAISA DEL VALLE ──────────────────────────────
// Menú digital interactivo de alta conversión (Imagine & Stamp)
// Suadero estilo Arandas, Cecina 100% Yecapixtla, Arrachera Prime,
// Gringas, Costras, Burritos, Alambres, Ramen con Suadero y Tepache.

export const clientConfig = {
  businessName: 'Taquería El Paisa del Valle',
  shortName: 'El Paisa del Valle',
  tagline: '¡Donde hay TACOS hay ALEGRÍA! 🌮',
  description:
    'Auténticos tacos de suadero estilo Arandas marinado en jugo de carne, cecina 100% de Yecapixtla con longaniza almendrada, arrachera prime, gringas, costras, alambres, ramen con suadero y tepache artesanal.',

  // WhatsApp oficial para pedidos (Demo dirigido con prefijo de prueba)
  phonePrimary: '525650469993',
  phonePrimaryFormatted: '56 5046 9993',

  // Ubicación y horarios
  address: 'Col. Del Valle / Benito Juárez, CDMX · Servicio en Sala, Pickup y Domicilio',
  hours: 'Lun–Dom: 1:00 PM – 12:00 AM',
  badgeQuality: '🥩 Carne 100% Fresca · 🌮 Receta Tradicional · 🌶️ Salsas Caseras',
  sauceSpecialty: 'Salsa Verde Taquera, Roja de Chile de Árbol & Habanero 🌶️',

  // Redes y plataformas de delivery
  deliveryPlatforms: [
    { name: 'Uber Eats', color: '#06C167', label: 'Disponible' },
    { name: 'DiDi Food', color: '#FF7D41', label: 'Disponible' },
    { name: 'Rappi', color: '#FF441F', label: 'Disponible' },
  ],

  // Paleta de colores gastronómica premium (Carbón, Fuego, Maíz y Chile)
  colors: {
    bg: '#12100E',                  // Fondo carbón tostado profundo
    bgElevated: '#1A1613',          // Barras y modales
    cardBg: '#221D18',              // Tarjetas de productos
    cardBorder: 'rgba(255, 90, 0, 0.22)', // Resplandor naranja suave
    flameOrange: '#FF5E00',         // Naranja vivo de la marca
    amberGold: '#FFB703',           // Amarillo maíz y queso dorado
    chileRed: '#E63946',            // Rojo picante
    creamWhite: '#FFFDF9',          // Crema nixtamal de alta legibilidad
    textMuted: '#AFA498',           // Texto secundario
    waGreen: '#25D366',             // Verde WhatsApp oficial
  },
};

export const bankInfo = {
  bankName: 'BBVA México',
  accountHolder: 'Taquería El Paisa del Valle',
  clabe: '012 180 01565046999 3',
  cardNumber: '4152 3138 5650 4699',
};
