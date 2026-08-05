// ── Configuración del Cliente — REY SPAR-TACO ───────────────────────────────
// "Para chuparse los dedos"

export const clientConfig = {
  businessName: 'Rey Spar-Taco',
  tagline: 'Para chuparse los dedos',
  description: 'Tacos, alambres, gringas y más. El rey del sabor.',
  phone: '520000000000',           // TODO: WhatsApp real del cliente
  phoneNumber: '00 0000 0000',    // TODO: formato público

  address: 'Ubicación Pendiente',  // TODO: dirección completa
  mapsUrl: '',                     // TODO: Google Maps link
  hours: 'Lun–Jue 14:00–23:00 | Vie–Sáb 14:00–01:00 | Dom Cerrado',
  hoursShort: '14:00 - 23:00 hrs', // para hero

  instagramUrl: '',  // TODO
  facebookUrl: '',   // TODO

  bankInfo: {
    bank_name: 'BBVA',
    account_holder: 'Rey Spar-Taco',
    clabe: '012345678901234567',   // TODO: CLABE real
    account_number: '1234567890',  // TODO: cuenta real
  },

  salsas: [
    { id: 'verde', name: 'Salsa Verde', spiciness: '🌶️ Suave' },
    { id: 'roja', name: 'Salsa Roja', spiciness: '🌶️🌶️ Media' },
    { id: 'habanero', name: 'Salsa Habanero', spiciness: '🌶️🌶️🌶️ Brava' },
  ],

  colors: {
    primary: '#16a34a',     // green-700
    secondary: '#f97316',   // orange-500
    accent: '#dc2626',      // red-600
    bg: '#fafaf9',          // stone-50
    cardBg: '#ffffff',
    textPrimary: '#1c1917', // stone-900
    textSecondary: '#78716c', // stone-500
  },
};
