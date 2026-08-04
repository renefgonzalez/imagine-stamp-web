// ── Configuración del Cliente — TAKEROS CDMX ────────────────────────────────
// Sabor auténtico de la CDMX en Cancún. Antojitos chilangos y sazón real.

export const clientConfig = {
  businessName: "Takero's CDMX",
  tagline: 'Sabor auténtico de la CDMX en Cancún',
  description: 'Antojitos chilangos y sazón real. Tacos al pastor, suadero, tripa, gringas y más. Únicamente para llevar y a domicilio en Cancún.',
  phone: '5219981096399',
  phoneNumber: '998 109 6399',
  email: '',  // No proporcionado por el cliente

  address: 'Cancún, Quintana Roo',
  mapsUrl: 'https://maps.app.goo.gl/U3ujNfNXeSxAuooYA',
  hours: 'Lunes a Domingo · 4:30 pm – 12:00 am',

  instagramUrl: 'https://www.instagram.com/takeroscdmx',
  facebookUrl: '',  // No proporcionado
  tiktokUrl: '',    // No proporcionado

  bankInfo: {
    bank_name: 'BBVA',
    account_holder: "Takero's CDMX",
    clabe: '012345678901234567',   // TODO: Reemplazar con CLABE real del cliente
    account_number: '1234567890',  // TODO: Reemplazar con cuenta real
  },

  salsas: [
    { id: 'verde', name: 'Salsa Verde', spiciness: '🌶️ Suave' },
    { id: 'roja', name: 'Salsa Roja', spiciness: '🌶️🌶️ Media' },
    { id: 'habanero', name: 'Salsa Habanero', spiciness: '🌶️🌶️🌶️ Brava' },
  ],

  colors: {
    primary: '#f97316',     // orange-500
    secondary: '#dc2626',   // red-600
    accent: '#facc15',      // yellow-400
    bg: '#000000',
    cardBg: '#18181b',      // zinc-900
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa', // zinc-400
  },
};
