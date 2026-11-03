// ── Configuración: TAQUERÍA EL PAISA DEL VALLE ──────────────────────────────
// Menú digital interactivo fiel a la carta física del cliente (Imagine & Stamp)
// Suadero estilo Arandas, Cecina 100% Yecapixtla, Arrachera Prime,
// Gringas, Costras, Burritos, Alambres, Ramen con Suadero y Tepache.

export const clientConfig = {
  businessName: 'Taquería El Paisa del Valle',
  shortName: 'El Paisa del Valle',
  tagline: '¡Donde hay TACOS hay ALEGRÍA! 🌮',
  description:
    'Auténticos tacos de suadero estilo Arandas en jugo de carne, cecina 100% de Yecapixtla y longaniza almendrada.',

  // WhatsApp oficial para pedidos (Demo dirigido con prefijo de prueba)
  phonePrimary: '525650469993',
  phonePrimaryFormatted: '56 5046 9993',

  // Ubicación y horarios
  address: 'Col. Del Valle / Benito Juárez, CDMX · Servicio en Sala y para Llevar',
  hours: 'Lun–Dom: 1:00 PM – 12:00 AM',
  badgeQuality: '🥩 Carne 100% Fresca · 🌮 Receta Tradicional · 🌶️ Salsas Caseras',

  // Paleta de colores inspirada 100% en la carta física (Amarillo Maíz, Naranja y Rojo Cómic)
  colors: {
    bg: '#FFF8E7',                  // Amarillo maíz suave / crema de alto contraste
    bgCard: '#FFFFFF',              // Tarjetas blancas limpias
    cardBorder: '#F2DFB8',          // Borde sutil cálido
    textPrimary: '#2B1A0E',         // Café oscuro intenso (legibilidad AA)
    textMuted: '#6E5846',           // Texto descriptivo suave pero legible
    pillRed: '#E8261F',             // Rojo cómic para títulos de categorías
    flameOrange: '#FF7A00',         // Naranja fuego taquero
    amberGold: '#FFB800',           // Dorado tostado
    stampBg: '#FFE358',             // Sello amarillo
    stampText: '#D0140D',           // Texto rojo del sello ¡100!
    waGreen: '#25D366',             // Verde WhatsApp oficial
  },
};

export const bankInfo = {
  bankName: 'BBVA México',
  accountHolder: 'Taquería El Paisa del Valle',
  clabe: '012 180 01565046999 3',
  cardNumber: '4152 3138 5650 4699',
};
