// ── Configuración Oficial: La Cueva del Lobo (Xochimilco) ──────────────────────
// Alimentos, Cerveza & Aventura · Pulquería Kāniixnii
// Menú Digital Interactivo de Alta Gama con Carrito de 2 Pasos y Pedido a WhatsApp

export const clientConfig = {
  businessName: 'La Cueva del Lobo',
  shortName: 'Cueva del Lobo',
  concept: 'Alimentos, Cerveza & Aventura · Xochimilco',
  tagline: 'Sabores que nacen de la tierra y se quedan en el alma',
  subtagline: 'Antojitos mexicanos hechos con tradición, pulques curados de los dioses y micheladas bien frías.',
  description:
    'Rincón tradicional en el corazón lacustre de Xochimilco. Disfruta de la mejor cocina de comal tradicional, micheladas de un litro con escarchado especial, pulque curado artesanal y bebidas preparadas para tu trajinera o reunión.',

  // WhatsApp oficial para pedidos (sin espacios ni símbolos)
  phone: '5215650469993',
  phoneNumberFormatted: '56 5046 9993',
  email: 'lacuevadellobo.xochimilco@gmail.com',

  // Ubicación física y cobertura
  address: 'Embarcadero y Canales Tradicionales de Xochimilco, CDMX',
  reference: 'Servicio en Mesa, Entrega en Embarcadero / Trajinera y Servicio a Domicilio',
  mapsUrl: 'https://maps.google.com/?q=Xochimilco+CDMX',
  hours: 'Jueves a Domingo: 12:00 PM - 9:00 PM',

  // Redes sociales oficiales
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  tiktokUrl: 'https://tiktok.com',

  // Paleta de marca de alta fidelidad inspirada en fogata, noche lacustre, maíz y maguey
  colors: {
    primary: '#E08722', // Ocre / Ámbar dorado fuego
    primaryHover: '#C67115',
    primaryGlow: 'rgba(224, 135, 34, 0.4)',
    secondary: '#10B981', // Verde Agave / Chinampas
    secondaryHover: '#059669',
    secondaryGlow: 'rgba(16, 185, 129, 0.3)',
    accent: '#EA580C', // Naranja brasa / Pambazo
    bg: '#0F0E0D', // Carbón / Piedra volcánica noche
    bgElevated: '#171614', // Fondo de tarjetas
    cardBg: '#1C1A18', // Tarjeta con glassmorphism
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    cardBorderGlow: 'rgba(224, 135, 34, 0.25)',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    muted: '#9CA3AF',
  },

  // Salsas artesanales de la casa
  salsas: [
    { id: 'verde-tatemada', label: '🟢 Salsa Verde Tatemada (Asada en comal)' },
    { id: 'roja-arbol', label: '🔴 Salsa Roja de Chile de Árbol (Picosita)' },
    { id: 'macha', label: '🌶️ Salsa Macha con Cacahuate & Ajonjolí (Especial)' },
    { id: 'habanero', label: '🟡 Salsa de Habanero con Cebolla Morada' },
    { id: 'sin-salsa', label: '🚫 Sin salsa / Envasada aparte' },
  ],

  // Escarchados especiales para micheladas y vasos preparados
  escarchados: [
    { id: 'clasico', label: '🧂 Clásico (Limón con Sal de Grano)' },
    { id: 'chamoy-ajonjoli', label: '🥭 Chamoy Especial con Ajonjolí y Chilito' },
    { id: 'miguelito-fresa', label: '🍓 Miguelito Dulce con Tamarindo' },
    { id: 'tajin-fuego', label: '🔥 Tajín Fuego Extremo' },
    { id: 'solo-hielo', label: '🧊 Vaso natural con solo hielo' },
  ],

  // Promoción activa
  promo: {
    badge: 'TRADICIÓN XOCHIMILCO',
    text: '¡Entrega directa a tu Trajinera, Mesa o a Domicilio!',
    note: 'Pide por WhatsApp y paga al recibir en efectivo o transferencia bancaria.',
  },
};

// ── Datos Bancarios Reales para Transferencia Directa ─────────────────────────
export const bankInfo = {
  bankName: 'BBVA México',
  accountHolder: 'La Cueva del Lobo - Alimentos & Cerveza',
  clabe: '012180015948372619',
  accountNumber: '1594837261',
  whatsappProof: '5215650469993',
  instructions:
    'Al realizar tu transferencia, envía la captura del comprobante por WhatsApp al 56 5046 9993 para comenzar a preparar tus platillos y bebidas calientitos de inmediato.',
};
