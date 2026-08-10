// ── Configuración del Cliente: ALITAS Y MÁS ─────────────────────────────────
// Demo: menú digital estilo urbano/industrial (blanco, negro, rojo, dorado).
// ⚠️ DATOS PLACEHOLDER — reemplazar phone, address, hours, redes y bankInfo
//    con los datos reales del cliente antes de pasar a producción.

export const clientConfig = {
  businessName: 'Alitas y Más',
  tagline: 'Cocina Urbana',
  description:
    'Alitas, boneless, pizzetas y tacos con actitud urbana. Salsas de la casa, desde BBQ hasta la legendaria Atómica. Pide por WhatsApp y recoge o recibe en casa.',
  phone: '521234567890', // ⚠️ REEMPLAZAR: WhatsApp del cliente (con código de país)
  phoneNumber: '55 1234 5678', // ⚠️ REEMPLAZAR: teléfono visible
  email: 'contacto@alitasymas.mx', // ⚠️ placeholder

  address: 'Av. Principal 123, Col. Centro, Ciudad', // ⚠️ placeholder
  hours: 'Lun-Dom 1:00 PM - 10:00 PM', // ⚠️ placeholder

  instagramUrl: 'https://instagram.com/', // ⚠️ placeholder
  facebookUrl: 'https://facebook.com/', // ⚠️ placeholder
  tiktokUrl: 'https://tiktok.com/@', // ⚠️ placeholder

  // Paleta urbana/industrial (hex directo en clases Tailwind del módulo)
  colors: {
    primary: '#111113', // negro intenso — texto y fondos contrastantes
    secondary: '#DC2626', // rojo brillante — CTAs y picante
    accent: '#F59E0B', // amarillo/dorado — precios y destacados
    bg: '#FAFAF8', // fondo general
    cardBg: '#FFFFFF',
    textPrimary: '#111113',
    textSecondary: '#52525B',
  },

  // Promoción activa (cintillo debajo del hero)
  promo: {
    text: 'El cumpleañero no paga su platillo',
    note: 'Aplica restricciones',
  },
};

// ── Datos bancarios (Transferencia) — ⚠️ PLACEHOLDERS ──────────────────────
export const bankInfo = {
  bankName: 'BBVA', // ⚠️ placeholder
  accountHolder: 'Alitas y Más', // ⚠️ placeholder
  clabe: '012 180 01234567890 1', // ⚠️ placeholder
  cardNumber: '4152 3134 5678 9012', // ⚠️ placeholder
};

// ── Reglas del negocio ──────────────────────────────────────────────────────

// Salsas para alitas y boneless (heat = nivel de picante 0-5)
export const SALSAS = [
  { id: 'sweet-chili', name: 'Sweet Chili', heat: 1 },
  { id: 'bbq', name: 'BBQ', heat: 0 },
  { id: 'chipotle', name: 'Chipotle', heat: 2 },
  { id: 'picosita', name: 'Picosita', heat: 3 },
  { id: 'habanero', name: 'Habanero', heat: 4 },
  { id: 'atomica', name: 'Atómica', heat: 5 },
] as const;

// Acompañamiento: apio siempre incluido + dip a elegir
export const DIPS = ['Ranch', 'Blue Cheese'] as const;

// Extras globales para la categoría Tacos
export const TACO_EXTRAS = [
  { id: 'queso', label: 'Extra Queso', price: 15 },
  { id: 'aguacate', label: 'Aguacate', price: 15 },
] as const;

// Ingredientes disponibles para la Pizzeta "Al Gusto" (elegir 2)
export const PIZZETA_INGREDIENTS = [
  'Pepperoni',
  'Champiñones',
  'Jamón',
  'Piña',
  'Tocino',
  'Cebolla',
  'Pimiento Morrón',
  'Chorizo',
  'Carne Molida',
  'Jalapeño',
  'Extra Queso',
] as const;
