// ── Configuración del Cliente ───────────────────────────────────────────────
// Copiar este archivo al nuevo módulo y reemplazar todos los valores.
// Todos los campos son obligatorios (los usa el footer y el checkout).

export const clientConfig = {
  businessName: 'LABAL Laboratorio Alcázar',
  description: 'Profesionales en el cuidado de la piel. Catálogo de productos (Menudeo y Mayoreo).',
  phone: '525532727608',
  phoneNumber: '59 79 77 54 44',
  email: 'contacto@labal.com',

  address: 'Ciudad de México',
  hours: 'Lun-Vie 9:00-18:00',

  instagramUrl: 'https://instagram.com/laboratorio_alcazar',
  facebookUrl: 'https://www.facebook.com/laboratorioalcazar/?locale=es_LA',
  tiktokUrl: 'https://tiktok.com/@',

  // ── Datos para Transferencia (rellena estos datos reales antes de publicar) ──
  bankInfo: {
    bank: 'Nombre del Banco',            // ej. Banco Azteca, BBVA, Santander
    clabe: '000000000000000000',         // CLABE de 18 dígitos
    accountName: 'Nombre del titular',   // ej. Laboratorio Alcázar
  },

  colors: {
    primary: '#A0487D',      // Plum/Magenta
    secondary: '#88929A',    // Light Gray
    accent: '#FADFF0',       // Light Pink
    bg: '#FDFBFC',           // Off-white with pink tint
    cardBg: '#FFFFFF',
    textPrimary: '#4A4A4A',
    textSecondary: '#6B7280',
  },
};
