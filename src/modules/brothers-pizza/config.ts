// ── Configuración Oficial del Cliente: Brothers Pizza ────────────────────────
// Menú Digital Interactivo · Casera y con Mucho Queso
// Datos extraídos de la carta oficial enviada por el cliente.

export const clientConfig = {
  businessName: 'Brothers Pizza',
  tagline: 'Casera y con mucho queso',
  subtagline: '¡Hoy se come pizza! Pídela calientita a tu puerta o recoge en sucursal.',
  description:
    'Pizzas artesanales con masa crujiente, abundante queso mozzarella derretido y los mejores ingredientes frescos. Especialidades, pizzas de 1 a 6 ingredientes y combos para disfrutar con la banda y la familia.',

  // WhatsApp oficial para pedidos (sin espacios ni símbolos)
  phone: '524423180296',
  phoneNumberFormatted: '442 318 0296',
  secondaryPhone: '720 394 0759',
  email: 'contacto@brotherspizza.mx',

  address: 'Servicio a Domicilio y Punto de Entrega, Querétaro',
  hours: 'Mar a Dom: 1:30 PM - 10:30 PM · Lunes cerrado',

  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://www.facebook.com/share/v/1EAWcHxLvQ/',
  tiktokUrl: 'https://tiktok.com',

  // Paleta de marca de alta fidelidad inspirada en horno de leña, salsa pomodoro y queso dorado
  colors: {
    primary: '#E11D48', // Carmesí Pomodoro / Fuego Artesanal
    primaryHover: '#BE123C',
    primaryGlow: 'rgba(225, 29, 72, 0.4)',
    secondary: '#F59E0B', // Dorado Queso Mozzarella fundido
    secondaryHover: '#D97706',
    secondaryGlow: 'rgba(245, 158, 11, 0.35)',
    accent: '#10B981', // Verde Albahaca / Pimiento fresco
    bg: '#0F0E0D', // Negro Horno de Piedra / Carbón
    bgElevated: '#171614', // Fondo de tarjetas
    cardBg: '#1C1A18', // Tarjeta con glassmorphism
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    cardBorderGlow: 'rgba(245, 158, 11, 0.25)',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    muted: '#9CA3AF',
  },

  // Promoción activa
  promo: {
    badge: 'PROMO HOY',
    text: '¡Envíos a Domicilio disponibles en toda la zona!',
    note: 'Pide por WhatsApp y paga al recibir en efectivo o por transferencia.',
  },
};

// ── Datos Bancarios Reales del Cliente (Bancoppel) ───────────────────────────
// Extraídos de la ficha de Formas de Pago de Brothers Pizza
export const bankInfo = {
  bankName: 'Bancoppel',
  accountHolder: 'Emma Aguilar',
  clabe: '137680105190823877',
  accountNumber: '10519082387',
  whatsappProof: '4423180296',
  instructions: 'Al realizar tu transferencia, envía la captura del comprobante por WhatsApp al 442 318 0296 para iniciar de inmediato la preparación de tu pizza.',
};

// ── Opciones Oficiales de Tamaños para Brothers Pizza ────────────────────────
// 1. Especialidades ($195 / $295 / $390)
export const SIZES_ESPECIALIDADES = [
  { id: 'mediana', label: 'Mediana', slices: '8 Rebanadas', price: 195, sublabel: 'Para 2-3 personas' },
  { id: 'grande', label: 'Grande', slices: '8 Rebanadas Grandes', price: 295, sublabel: 'Para 3-4 personas' },
  { id: 'pizzota', label: 'Pizzota', slices: '18 Rebanadas', price: 390, sublabel: '¡Familiar para compartir!' },
];

// 2. 4 a 6 Ingredientes ($180 / $280 / $385)
export const SIZES_4_A_6 = [
  { id: 'mediana', label: 'Mediana', slices: '8 Rebanadas', price: 180, sublabel: 'Para 2-3 personas' },
  { id: 'grande', label: 'Grande', slices: '8 Rebanadas Grandes', price: 280, sublabel: 'Para 3-4 personas' },
  { id: 'pizzota', label: 'Pizzota', slices: '18 Rebanadas', price: 385, sublabel: '¡Familiar para compartir!' },
];

// 3. 2 a 3 Ingredientes ($159 / $240 / $340)
export const SIZES_2_A_3 = [
  { id: 'mediana', label: 'Mediana', slices: '8 Rebanadas', price: 159, sublabel: 'Para 2-3 personas' },
  { id: 'grande', label: 'Grande', slices: '8 Rebanadas Grandes', price: 240, sublabel: 'Para 3-4 personas' },
  { id: 'pizzota', label: 'Pizzota', slices: '18 Rebanadas', price: 340, sublabel: '¡Familiar para compartir!' },
];

// 4. 1 Ingrediente ($140 / $200 / $310)
export const SIZES_1_INGREDIENTE = [
  { id: 'mediana', label: 'Mediana', slices: '8 Rebanadas', price: 140, sublabel: 'Para 2-3 personas' },
  { id: 'grande', label: 'Grande', slices: '8 Rebanadas Grandes', price: 200, sublabel: 'Para 3-4 personas' },
  { id: 'pizzota', label: 'Pizzota', slices: '18 Rebanadas', price: 310, sublabel: '¡Familiar para compartir!' },
];

// ── Lista de Ingredientes Disponibles para "Arma Tu Pizza" ────────────────────
export const AVAILABLE_INGREDIENTS = [
  { id: 'pepperoni', name: 'Pepperoni Americano' },
  { id: 'jamon', name: 'Jamón de Pierna' },
  { id: 'tocino', name: 'Tocino Crujiente' },
  { id: 'chorizo', name: 'Chorizo Norteño' },
  { id: 'salchicha', name: 'Salchicha Dorada' },
  { id: 'atun', name: 'Atún Seleccionado' },
  { id: 'champinon', name: 'Champiñones Frescos' },
  { id: 'pimiento', name: 'Pimiento Morrón' },
  { id: 'cebolla', name: 'Cebolla Morada' },
  { id: 'jalapeno', name: 'Jalapeño Toreado' },
  { id: 'pina', name: 'Piña Miel' },
  { id: 'cereza', name: 'Cerezas Marrasquino' },
];

// ── Opciones Extras Premium para Pizza ───────────────────────────────────────
export const PIZZA_EXTRAS = [
  { id: 'orilla-queso', label: '🧀 Orilla Rellena de Queso', price: 39 },
  { id: 'extra-mozzarella', label: '🧀 Doble Queso Mozzarella', price: 35 },
  { id: 'chimichurri', label: '🌿 Dip de Chimichurri Casero', price: 18 },
  { id: 'salsa-habanera', label: '🌶️ Salsa Habanera Casera', price: 15 },
];
