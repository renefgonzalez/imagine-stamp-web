// ── Configuración del Cliente: GO! WINGS GO ──────────────────────────────────
// Menú digital estilo Wings & Sports Bar Gourmet · Dark Fire Theme
// Identidad visual extraída del logo oficial (#FF4816 Fuego, #FFB800 Dorado, #0D0C0B Carbón).

export const clientConfig = {
  businessName: 'GO! WINGS GO',
  tagline: 'Alitas, Boneless & Craving House',
  description:
    'Las alitas y boneless más crujientes con salsas exclusivas de la casa, pizzetas a la plancha, tacos al carbón y cerveza bien fría. Pide por WhatsApp y recoge en sucursal o recibe calientito en tu puerta.',
  phone: '5215650469993', // WhatsApp oficial Imagine & Stamp para demos
  phoneNumber: '56 5046 9993',
  email: 'contacto@gowingsgo.mx',

  address: 'Av. Insurgentes Sur 1450, Col. Actipan, Benito Juárez, CDMX',
  hours: 'Mar a Dom: 1:00 PM - 11:00 PM · Lunes cerrado',

  instagramUrl: 'https://instagram.com/gowingsgo',
  facebookUrl: 'https://facebook.com/gowingsgo',
  tiktokUrl: 'https://tiktok.com/@gowingsgo',

  // Paleta de marca de alta fidelidad
  colors: {
    primary: '#FF4816', // Naranja Fuego Wings Oficial (extraído del logo)
    primaryHover: '#FF5E31',
    primaryGlow: 'rgba(255, 72, 22, 0.35)',
    secondary: '#FFB800', // Dorado Crispy
    accent: '#EF4444', // Rojo Fuego Picante
    bg: '#0D0C0B', // Negro Carbón Ahumado
    cardBg: '#171615', // Card de superficie oscura
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#FFFFFF',
    textSecondary: '#9CA3AF',
    muted: '#52525B',
  },

  // Promoción activa del mes
  promo: {
    badge: 'PROMO HOY',
    text: 'En la compra de 12 alitas, ¡papas gajo al 50% de descuento!',
    note: 'Válido martes a jueves en pedidos para llevar o a domicilio.',
  },
};

// ── Datos bancarios (Transferencia SPEI) con 1-tap copy ─────────────────────────
export const bankInfo = {
  bankName: 'BBVA Bancomer',
  accountHolder: 'GO! WINGS GO MÉXICO S.A. DE C.V.',
  clabe: '012 180 01589412039 4',
  cardNumber: '4152 3138 9021 4482',
};

// ── Salsas de la casa para Alitas y Boneless (heat = 0 a 5 chiles) ─────────────
export const SALSAS = [
  { id: 'bbq-dulce', name: 'BBQ Ahumada Dulce', heat: 0, desc: 'Ahumada a la leña, toque dulce de miel' },
  { id: 'lemon-pepper', name: 'Lemon Pepper Crunch', heat: 0, desc: 'Cítrica, mantecosa con pimienta negra recién molida' },
  { id: 'garlic-parmesan', name: 'Ajo Parmesano', heat: 1, desc: 'Mantequilla dorada, ajo asado y lluvia de parmesano' },
  { id: 'buffalo-classic', name: 'Buffalo Clásica NY', heat: 2, desc: 'La reina de la casa: picor balanceado con vinagreta' },
  { id: 'sweet-chili', name: 'Sweet Chili Thai', heat: 2, desc: 'Toque agridulce oriental ligeramente especiado' },
  { id: 'mango-habanero', name: 'Mango Habanero Glaze', heat: 4, desc: 'Pulpa de mango dulce y golpe picante de habanero fresco' },
  { id: 'fuego-atomico', name: 'Fuego Atómico Go!', heat: 5, desc: '¡Solo para valientes! Carolina Reaper + Habanero tatemado' },
] as const;

// ── Dips artesanales para acompañar ───────────────────────────────────────────
export const DIPS = [
  { id: 'ranch', name: 'Ranch Artesanal de la Casa', desc: 'Cremoso con finas hierbas y eneldo' },
  { id: 'blue-cheese', name: 'Blue Cheese Auténtico', desc: 'Intenso, con trozos de queso azul maduro' },
] as const;

// ── Extras para Tacos y Costras ───────────────────────────────────────────────
export const TACO_EXTRAS = [
  { id: 'queso-gratinado', label: 'Queso Gouda Fundido', price: 18 },
  { id: 'aguacate-fresco', label: 'Aguacate en Abanico', price: 18 },
  { id: 'chiles-toreados', label: 'Chiles Toreados con Cebollitas', price: 15 },
] as const;

// ── Ingredientes para Pizzeta "Al Gusto" (máx 2) ──────────────────────────────
export const PIZZETA_INGREDIENTS = [
  'Pepperoni Clásico',
  'Tocino Ahumado',
  'Champiñones Frescos',
  'Pollo Crispy Buffalo',
  'Arrachera Marinada',
  'Piña Asada Caramelizada',
  'Cebolla Morada',
  'Pimiento Morrón Verde',
  'Jalapeño Toreado',
  'Extra Queso Mozzarella',
] as const;
