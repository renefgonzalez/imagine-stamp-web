// ── Configuración Oficial: Strong Gym Iron City ──────────────────────────────
// Gimnasio de Alto Rendimiento, Suplementación Deportiva & Barra de Shakes
// Nezahualcóyotl, Estado de México

import { Product } from './types';

export const clientConfig = {
  businessName: 'Strong Gym Iron City',
  shortName: 'Strong Gym',
  concept: 'Gimnasio de Alto Rendimiento · Suplementación & Barra de Shakes',
  tagline: 'FORJA TU MEJOR VERSIÓN EN LA CIUDAD DE HIERRO',
  subtagline:
    'Aparatos de uso rudo, peso libre, spinning, crossfit, barra de nutrición y suplementación deportiva 100% original.',
  description:
    'El templo del entrenamiento pesado en Nezahualcóyotl. Diseñado para atletas, culturistas y entusiastas que buscan resultados reales con el mejor equipamiento, ambiente motivador y asesoría profesional.',

  // Contacto oficial verificado
  phone: '525531174415',
  phoneNumberFormatted: '55 3117 4415',
  email: 'strongmangym@hotmail.com',

  // Ubicación física y cobertura
  address: 'Av. Texcoco No. 556, Esq. calle 5, Nezahualcóyotl, Estado de México, C.P. 57900',
  reference: 'Esq. Calle 5, cerca de límites CDMX y Av. Pantitlán. Fácil acceso y zona segura.',
  mapsUrl: 'https://maps.app.goo.gl/dr2jGPCweyzyacoz7',

  // Horarios de atención
  hours: 'Lun - Vie: 6:00 AM - 10:00 PM | Sáb: 7:00 AM - 4:00 PM | Dom: 8:00 AM - 2:00 PM',
  hoursDetail: {
    weekdays: 'Lunes a Viernes: 6:00 AM - 10:00 PM',
    saturday: 'Sábado: 7:00 AM - 4:00 PM',
    sunday: 'Domingo: 8:00 AM - 2:00 PM',
  },

  // Redes sociales oficiales
  facebookUrl: 'https://www.facebook.com/stronggym0206',
  instagramUrl: 'https://www.instagram.com/strong_gym_ironcity',
  instagramHandle: '@strong_gym_ironcity',

  // Prueba social
  rating: {
    score: '4.9',
    reviewsCount: 210,
    recommendationRate: '90% recomendado',
  },

  // Paleta de marca de alta fidelidad: Rojo Hierro Vivo y Negro Mate Deportivo
  colors: {
    primary: '#E50914', // Rojo vibrante Iron Gym
    primaryHover: '#C80812',
    primaryGlow: 'rgba(229, 9, 20, 0.45)',
    secondary: '#FF2E38',
    secondaryHover: '#E50914',
    secondaryGlow: 'rgba(255, 46, 56, 0.3)',
    accent: '#F59E0B', // Dorado para trofeos/destacados
    bg: '#0A0A0A', // Negro profundo carbón
    bgElevated: '#121212',
    cardBg: '#161616',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    cardBorderGlow: 'rgba(229, 9, 20, 0.35)',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    muted: '#9CA3AF',
  },

  // Promoción activa destacada
  promo: {
    badge: '🔥 PROMOCIÓN ESPECIAL',
    title: '¡PAGA MÁS DE 3 MESES A SOLO $500 CADA MES!',
    subtitle: 'Incluye acceso total a pesas, peso libre, spinning y asesoría en rutina.',
    note: 'Aparta tu membresía hoy por WhatsApp o recarga en mostrador.',
  },
};

// ── Datos Bancarios Oficiales para Transferencias SPEI ───────────────────────
export const bankInfo = {
  bankName: 'BBVA México',
  accountHolder: 'Strong Gym Iron City',
  clabe: '012180015531174415',
  accountNumber: '1553117441',
  whatsappProof: '525531174415',
  instructions:
    'Al transferir, manda tu comprobante al WhatsApp 55 3117 4415 con tu nombre para activar tu membresía o apartar tus suplementos de inmediato.',
};

// ── Categorías con Identidad Deportiva ───────────────────────────────────────
export const CATEGORIES = [
  { id: 'todos', label: '🔥 Todo el Catálogo', shortLabel: 'Todos' },
  { id: 'membresias', label: '🏆 Membresías & Pases', shortLabel: 'Membresías' },
  { id: 'shakes-barra', label: '🥤 Shakes & Barra de Proteína', shortLabel: 'Shakes' },
  { id: 'proteinas', label: '⚡ Proteínas & Gainers', shortLabel: 'Proteínas' },
  { id: 'creatinas-fuerza', label: '💥 Creatinas & Fuerza', shortLabel: 'Creatinas' },
  { id: 'pre-entrenos', label: '🚀 Pre-Entrenos & Energía', shortLabel: 'Pre-Workouts' },
  { id: 'aminoacidos-salud', label: '🩸 Aminoácidos & Quemadores', shortLabel: 'Aminoácidos' },
  { id: 'gear-accesorios', label: '🥊 Gear & Accesorios', shortLabel: 'Accesorios' },
] as const;

// ── Catálogo Maestro de Productos y Servicios ────────────────────────────────
export const PRODUCTS: Product[] = [
  // ── 🏆 MEMBRESÍAS & PASES
  {
    id: 'membresia-trimestral-promo',
    name: 'Plan 3+ Meses Iron City ($500/mes)',
    description:
      'La suscripción más popular de Strong Gym. Acceso ilimitado a todas las áreas de aparatos, zona de peso libre y cardio. ¡Ahorra y asegura tu transformación!',
    price: 1500,
    category: 'membresias',
    featured: true,
    badge: 'promo',
    badgeText: '🔥 $500 / MES',
    servingInfo: 'Acceso Total 90 Días · Sin costo de inscripción',
    isCustomizable: true,
    variantTitle: 'Elige tu Turno Preferente',
    variants: [
      { id: 'turno-libre', name: 'Turno Libre (Acceso 100% Sin Restricción de Horario)' },
      { id: 'turno-matutino', name: 'Matutino (Ideal 6:00 AM a 12:00 PM)' },
      { id: 'turno-vespertino', name: 'Vespertino / Nocturno (4:00 PM a 10:00 PM)' },
    ],
  },
  {
    id: 'mensualidad-general',
    name: 'Mensualidad General Strong Gym',
    description:
      '1 mes de entrenamiento completo en Iron City. Uso ilimitado de máquinas de discos, barras olímpicas, mancuernas hasta 120 lbs y zona funcional.',
    price: 550,
    category: 'membresias',
    badge: 'mas-vendido',
    badgeText: 'POPULAR',
    servingInfo: 'Vigencia de 30 días naturales',
    isCustomizable: true,
    variantTitle: 'Disciplina Principal',
    variants: [
      { id: 'pesas-cardio', name: 'Pesas + Peso Libre + Cardio' },
      { id: 'combo-spinning', name: 'Pesas + Clase de Spinning Matutina' },
      { id: 'combo-crossfit', name: 'Pesas + Funcional / Cross Training' },
    ],
  },
  {
    id: 'visita-dia',
    name: 'Pase por Día (Visita Individual)',
    description:
      '¿Vienes de paso o quieres probar las instalaciones? Entrena todo el día sin límite de tiempo y comprueba por qué somos el gimnasio más pesado de Neza.',
    price: 60,
    category: 'membresias',
    servingInfo: 'Pase de 1 día de entrenamiento',
  },
  {
    id: 'anualidad-black-iron',
    name: 'Membresía Anual Black Iron (12 Meses)',
    description:
      'Para los verdaderos disciplinados. 12 meses completos con descuento exclusivo, casillero con candado de cortesía y 1 Shaker oficial de Strong Gym de regalo.',
    price: 5200,
    category: 'membresias',
    badge: 'recomendado',
    badgeText: '⭐ MEJOR PRECIO ANUAL',
    servingInfo: '365 días de entrenamiento + Shaker de Regalo',
  },

  // ── 🥤 SHAKES & BARRA DE PROTEÍNA AL MOMENTO
  {
    id: 'shake-proteina-gourmet',
    name: 'Shake de Proteína Post-Entreno (Vaso 600ml)',
    description:
      'Recupérate saliendo de entrenar. Preparado al momento en recepción con 1 scoop colmado de 25g de proteína Whey, hielo frappé y la base que prefieras.',
    price: 55,
    category: 'shakes-barra',
    featured: true,
    badge: 'barra-shake',
    badgeText: '🥤 PREPARADO AL MOMENTO',
    servingInfo: '25g Proteína · Cero Azúcar Añadida',
    isCustomizable: true,
    variantTitle: 'Elige el Sabor de Proteína',
    variants: [
      { id: 'choc-suizo', name: 'Chocolate Suizo Intenso' },
      { id: 'vainilla-french', name: 'Vainilla Francesa Cremosa' },
      { id: 'fresa-silvestre', name: 'Fresas con Crema' },
      { id: 'cookies-cream', name: 'Cookies & Cream' },
      { id: 'cafe-moka', name: 'Moka Cold Brew (+ Cafeína)' },
    ],
    extras: [
      { id: 'scoop-extra-whey', label: 'Scoop Extra de Proteína (+25g)', price: 25 },
      { id: 'scoop-creatina', label: 'Scoop de Creatina Creapure 5g', price: 15 },
      { id: 'crema-cacahuate', label: 'Cucharada de Crema de Cacahuate 100% Natural', price: 12 },
      { id: 'avena-platano', label: 'Plátano Natural + Avena Integral', price: 15 },
      { id: 'leche-almendra', label: 'Cambiar a Leche de Almendras Sin Azúcar', price: 10 },
    ],
  },
  {
    id: 'shake-monster-mass',
    name: 'Shake Mass Gainer Hipercalórico (750ml)',
    description:
      'Bomba de volumen y ganancia muscular. Doble scoop de proteína, avena entera, crema de cacahuate, plátano y miel. Ideal para ectomorfos y etapa de volumen.',
    price: 85,
    category: 'shakes-barra',
    badge: 'mas-vendido',
    badgeText: '💪 GANADOR DE MASA',
    servingInfo: '55g Proteína · 780 kcal · Energía Pura',
    isCustomizable: true,
    variantTitle: 'Sabor de Gainer',
    variants: [
      { id: 'mass-chocolate', name: 'Doble Chocolate' },
      { id: 'mass-vainilla', name: 'Vainilla Canela' },
    ],
    extras: [
      { id: 'extra-creatina-mass', label: '5g Creatina Monohidratada', price: 15 },
      { id: 'leche-deslactosada', label: 'Preparar con Leche Deslactosada Light', price: 0 },
    ],
  },
  {
    id: 'pre-workout-shot-barra',
    name: 'Shot de Pre-Entreno Helado en Mostrador',
    description:
      '¿Llegaste cansado de la chamba o la escuela? Pídelo en recepción bien frío antes de tocar los fierros: 200mg cafeína, beta-alanina y citrulina malato para bombeo extremo.',
    price: 35,
    category: 'shakes-barra',
    servingInfo: 'Efecto en 15 min · Bombeo y Enfoque Mental',
    isCustomizable: true,
    variantTitle: 'Sabor del Shot',
    variants: [
      { id: 'shot-fruit-punch', name: 'Fruit Punch Explosivo' },
      { id: 'shot-blue-razz', name: 'Blue Raspberry Ácido' },
      { id: 'shot-sandia', name: 'Sandía Fuego' },
    ],
  },
  {
    id: 'bebida-isotonica-fria',
    name: 'Bebida de Electrolitos Fría 600ml',
    description:
      'Hidratación celular inmediata durante tu rutina pesada de pierna o tu clase de spinning. Sodio, potasio y magnesio para evitar calambres.',
    price: 28,
    category: 'shakes-barra',
    servingInfo: 'Cero Calorías · Electrolitos Completos',
  },

  // ── ⚡ PROTEÍNAS & GAINERS (LÍDERES EN MERCADO)
  {
    id: 'on-gold-standard-whey',
    name: 'Optimum Nutrition Gold Standard 100% Whey',
    description:
      'La proteína de suero de leche más vendida y respetada a nivel mundial. Contiene aislado de suero de rápida absorción, ideal para el desarrollo de masa magra sin grasa.',
    price: 1399,
    category: 'proteinas',
    featured: true,
    badge: 'mas-vendido',
    badgeText: '⭐ N°1 MUNDIAL',
    servingInfo: '24g Proteína · 5.5g BCAAs · 4g Glutamina',
    isCustomizable: true,
    sizes: [
      { id: 'on-2lb', label: 'Bote 2 lbs (~29 servicios)', price: 1399 },
      { id: 'on-5lb', label: 'Bote 5 lbs (~74 servicios) [Recomendado]', price: 2299 },
    ],
    variantTitle: 'Elige tu Sabor Favorito',
    variants: [
      { id: 'on-double-rich-choc', name: 'Double Rich Chocolate' },
      { id: 'on-vanilla-ice-cream', name: 'Vanilla Ice Cream' },
      { id: 'on-delicious-strawberry', name: 'Delicious Strawberry' },
      { id: 'on-extreme-milk-choc', name: 'Extreme Milk Chocolate' },
    ],
  },
  {
    id: 'dymatize-iso-100',
    name: 'Dymatize ISO 100 Hidrolizada 100% Isolate',
    description:
      'Pureza suprema. Aislado de proteína hidrolizada ultra-rápida, cero azúcar, menos de 1g de carbohidratos y prácticamente libre de lactosa. Calidad grado concurso.',
    price: 1849,
    category: 'proteinas',
    badge: 'recomendado',
    badgeText: '🏆 GRADO COMPETICIÓN',
    servingInfo: '25g Proteína Hidrolizada · Cero Grasa',
    isCustomizable: true,
    sizes: [
      { id: 'iso-1.6lb', label: '1.6 lbs (~24 servicios)', price: 1380 },
      { id: 'iso-5lb', label: '5 lbs (~71 servicios)', price: 2650 },
    ],
    variantTitle: 'Elige el Sabor',
    variants: [
      { id: 'iso-gourmet-choc', name: 'Gourmet Chocolate' },
      { id: 'iso-fudge-brownie', name: 'Fudge Brownie' },
      { id: 'iso-birthday-cake', name: 'Birthday Cake' },
      { id: 'iso-fruity-pebbles', name: 'Fruity Pebbles (Cereal Clásico)' },
    ],
  },
  {
    id: 'mutant-mass-gainer',
    name: 'Mutant Mass Gainer Extremo',
    description:
      'Diseñado específicamente para los atletas que les cuesta subir de peso. Matriz de carbohidratos limpios, avena, camote y 56g de proteína de múltiples fuentes.',
    price: 1250,
    category: 'proteinas',
    servingInfo: '56g Proteína · 1,100 kcal · BCAA y EAA',
    isCustomizable: true,
    sizes: [
      { id: 'mutant-5lb', label: 'Bolsa 5 lbs (2.27 kg)', price: 1250 },
      { id: 'mutant-12lb', label: 'Saco 12 lbs (5.44 kg)', price: 2190 },
    ],
    variantTitle: 'Sabor',
    variants: [
      { id: 'mutant-triple-choc', name: 'Triple Chocolate' },
      { id: 'mutant-cookies', name: 'Cookies and Cream' },
      { id: 'mutant-vainilla', name: 'Vanilla Ice Cream' },
    ],
  },
  {
    id: 'birdman-falcon-vegana',
    name: 'Birdman Falcon Proteína Vegana Orgánica',
    description:
      'Proteína a base de plantas (chícharo, arroz, amaranto y quinua). De fácil digestión, adicionada con enzimas y probióticos, libre de lácteos y soya.',
    price: 990,
    category: 'proteinas',
    servingInfo: '24g Proteína Vegana · Con Probióticos y Enzimas',
    isCustomizable: true,
    sizes: [
      { id: 'falcon-1kg', label: 'Bote 1.08 kg (~36 servicios)', price: 990 },
    ],
    variantTitle: 'Sabor',
    variants: [
      { id: 'falcon-choc', name: 'Chocolate Orgánico' },
      { id: 'falcon-vainilla', name: 'Vainilla Suave' },
      { id: 'falcon-chai', name: 'Chai Especiado' },
    ],
  },

  // ── 💥 CREATINAS & FUERZA
  {
    id: 'creatina-creapure-birdman',
    name: 'Creatina Creapure® Monohidratada 100% Pura 300g',
    description:
      'El suplemento con mayor respaldo científico del mundo para fuerza, potencia y volumen muscular. Sello original Creapure® fabricada en Alemania, ultra-micronizada.',
    price: 680,
    category: 'creatinas-fuerza',
    featured: true,
    badge: 'mas-vendido',
    badgeText: '🔥 FUERZA PURA',
    servingInfo: '60 Servicios (5g por scoop) · Cero Sabor',
    isCustomizable: true,
    variantTitle: 'Presentación',
    variants: [
      { id: 'creapure-300g', name: 'Bote 300g (60 Tomas)' },
      { id: 'creapure-500g', name: 'Bote 500g (100 Tomas)', price: 920 },
    ],
  },
  {
    id: 'dymatize-micronized-creatine',
    name: 'Dymatize Micronized Creatine 300g / 500g',
    description:
      'Creatina monohidratada micronizada para disolución instantánea en agua o jugo sin asentamientos. Incrementa la recuperación entre series pesadas.',
    price: 620,
    category: 'creatinas-fuerza',
    servingInfo: '5g Creatina Pura por toma · Sin gluten',
    isCustomizable: true,
    sizes: [
      { id: 'dy-creatine-300', label: '300g (60 Servicios)', price: 620 },
      { id: 'dy-creatine-500', label: '500g (100 Servicios)', price: 890 },
    ],
  },
  {
    id: 'beast-creature-powder',
    name: 'Beast Creature Complejo 5 Creatinas',
    description:
      'Fórmula avanzada con 5 tipos de creatinas de absorción escalonada + agentes de captación celular para evitar la retención hídrica subcutánea.',
    price: 790,
    category: 'creatinas-fuerza',
    servingInfo: '60 Servicios · Sabores Frutales Explosivos',
    isCustomizable: true,
    variantTitle: 'Sabor Frutal',
    variants: [
      { id: 'beast-blue-citrus', name: 'Blue Citrus' },
      { id: 'beast-pink-lemonade', name: 'Pink Lemonade' },
      { id: 'beast-unflavored', name: 'Natural Sin Sabor' },
    ],
  },

  // ── 🚀 PRE-ENTRENOS & ENERGÍA
  {
    id: 'cellucor-c4-original',
    name: 'Cellucor C4 Original Pre-Workout (30 / 60 Serv)',
    description:
      'El rey clásico de los pre-entrenamientos. Explosión de energía limpia, enfoque mental nítido y bombeo vascular con CarnoSyn® Beta-Alanina y Nitrato de Creatina.',
    price: 749,
    category: 'pre-entrenos',
    featured: true,
    badge: 'mas-vendido',
    badgeText: '⚡ ENERGÍA EXPLOSIVA',
    servingInfo: '150mg Cafeína · 1.6g Beta-Alanina · 1g Arginina',
    isCustomizable: true,
    sizes: [
      { id: 'c4-30serv', label: 'Bote 30 Servicios', price: 749 },
      { id: 'c4-60serv', label: 'Bote 60 Servicios [Ahorro]', price: 1290 },
    ],
    variantTitle: 'Sabor Explosivo',
    variants: [
      { id: 'c4-fruit-punch', name: 'Fruit Punch Clásico' },
      { id: 'c4-icy-blue-razz', name: 'Icy Blue Razz' },
      { id: 'c4-watermelon', name: 'Watermelon Explosive' },
      { id: 'c4-orange-burst', name: 'Orange Burst' },
    ],
  },
  {
    id: 'insane-labz-psychotic',
    name: 'Insane Labz Psychotic High Stimulant',
    description:
      '¡SOLO PARA ATLETAS EXPERIMENTADOS! Fórmula con AMPiberry® y cafeína anhidra extrema. Enfoque psicótico y energía que dura hasta 3 horas continuas de entrenamiento.',
    price: 860,
    category: 'pre-entrenos',
    badge: 'recomendado',
    badgeText: '⚠️ ESTIMULANTE EXTREMO',
    servingInfo: '35 Servicios · 400mg Complejo de Cafeína y Estimulantes',
    isCustomizable: true,
    variantTitle: 'Elige tu Sabor',
    variants: [
      { id: 'psychotic-gummy-candy', name: 'Gummy Candy' },
      { id: 'psychotic-apple', name: 'Sour Apple' },
      { id: 'psychotic-cotton-candy', name: 'Cotton Candy' },
    ],
  },
  {
    id: 'redcon1-total-war',
    name: 'Redcon1 Total War Pre-Workout Militar',
    description:
      'Formulado con dosis clínicas reales: 6g de L-Citrulina Malato para vascularización y bombeos gigantescos que hinchan las venas.',
    price: 890,
    category: 'pre-entrenos',
    servingInfo: '30 Dosis Clínicas · 6g Citrulina Malato',
    isCustomizable: true,
    variantTitle: 'Sabor Militar',
    variants: [
      { id: 'totalwar-blue-lemonade', name: 'Blue Lemonade' },
      { id: 'totalwar-strawberry-kiwi', name: 'Strawberry Kiwi' },
      { id: 'totalwar-tiger-blood', name: 'Tiger\'s Blood (Coco Fresa)' },
    ],
  },

  // ── 🩸 AMINOÁCIDOS, QUEMADORES & SALUD
  {
    id: 'scivation-xtend-bcaas',
    name: 'Scivation XTEND 7g BCAAs + Electrolitos (30 Serv)',
    description:
      'El intra-entreno definitivo. 7 gramos de aminoácidos ramificados en ratio 2:1:1 probado, glutamina y electrolitos para beber sorbo a sorbo entre series.',
    price: 680,
    category: 'aminoacidos-salud',
    featured: true,
    badge: 'mas-vendido',
    badgeText: '💧 INTRA-ENTRENO',
    servingInfo: '7g BCAAs · Cero Azúcar · Cero Calorías',
    isCustomizable: true,
    variantTitle: 'Sabor Refrescante',
    variants: [
      { id: 'xtend-watermelon-madness', name: 'Watermelon Madness' },
      { id: 'xtend-mango-madness', name: 'Mango Madness' },
      { id: 'xtend-blue-raspberry', name: 'Blue Raspberry Ice' },
      { id: 'xtend-lemon-lime', name: 'Lemon Lime Squeeze' },
    ],
  },
  {
    id: 'l-carnitina-3000-liquida',
    name: 'L-Carnitina 3000 Líquida Ultra Concentrada 473ml',
    description:
      'Convierte los ácidos grasos en energía mitocondrial durante tu sesión de cardio y spinning. Rápida asimilación sin alterar el sistema nervioso.',
    price: 490,
    category: 'aminoacidos-salud',
    servingInfo: '3,000 mg de L-Carnitina por cucharada · 31 Tomas',
    isCustomizable: true,
    variantTitle: 'Sabor Líquido',
    variants: [
      { id: 'carnitina-berry', name: 'Berry Blast' },
      { id: 'carnitina-naranja', name: 'Citrus Orange' },
      { id: 'carnitina-manzana', name: 'Green Apple' },
    ],
  },
  {
    id: 'lipo-6-black-ultra',
    name: 'Nutrex Lipo-6 Black Ultra Concentrate (60 Caps)',
    description:
      'Termogénico de máxima potencia en cápsulas líquidas de rápida acción. Acelera el metabolismo basal, suprime el apetito y eleva la temperatura corporal.',
    price: 699,
    category: 'aminoacidos-salud',
    badge: 'recomendado',
    badgeText: '🔥 TERMOGÉNICO',
    servingInfo: '60 Cápsulas · 1 Sola Cápsula por Dosis',
  },
  {
    id: 'universal-animal-pak',
    name: 'Universal Nutrition Animal Pak 44 Packs',
    description:
      'El multivitamínico de culto para atletas de halterofilia y fisicoculturismo. Paquetes completos con vitaminas, minerales, aminoácidos y enzimas digestivas.',
    price: 990,
    category: 'aminoacidos-salud',
    servingInfo: '44 Packs Individuales · Fórmula Hardcore desde 1983',
  },

  // ── 🥊 GEAR & ACCESORIOS DE ENTRENAMIENTO
  {
    id: 'straps-profesionales-strong-gym',
    name: 'Straps Profesionales de Levantamiento Strong Gym',
    description:
      'Correas de algodón reforzado de uso pesado con almohadilla de neopreno en la muñeca. Levanta más peso en peso muerto, jalones de espalda y remos sin que falle tu agarre.',
    price: 199,
    category: 'gear-accesorios',
    featured: true,
    badge: 'mas-vendido',
    badgeText: '🏋️‍♂️ OFICIAL IRON CITY',
    servingInfo: 'Par de Correas con Costura Doble Reforzada',
    isCustomizable: true,
    variantTitle: 'Color / Detalle',
    variants: [
      { id: 'straps-negro-rojo', name: 'Negro con Bordado Rojo Strong Gym' },
      { id: 'straps-rojo-negro', name: 'Rojo Carmesí con Logotipo Negro' },
    ],
  },
  {
    id: 'cinturon-lumbar-cuero',
    name: 'Cinturón Lumbar de Cuero Pesado (Hebilla Acero)',
    description:
      'Protección intra-abdominal esencial para sentadillas y peso muerto pesado. Cuero genuino de 10mm de espesor con doble hebilla de acero inoxidable.',
    price: 650,
    category: 'gear-accesorios',
    servingInfo: 'Cuero Genuino 10mm · Hebilla Doble Perno',
    isCustomizable: true,
    variantTitle: 'Talla de Cintura',
    variants: [
      { id: 'cinturon-chica', name: 'Talla Chica (28 - 32)' },
      { id: 'cinturon-mediana', name: 'Talla Mediana (32 - 36)' },
      { id: 'cinturon-grande', name: 'Talla Grande (36 - 40)' },
      { id: 'cinturon-xl', name: 'Talla XL (40 - 44)' },
    ],
  },
  {
    id: 'shaker-antiderrames-strong',
    name: 'Shaker Mezclador Antiderrames 700ml con Rejilla',
    description:
      'Vaso batidor de plástico libre de BPA con escala medidora en onzas y mililitros, tapa hermética con cierre de click y rejilla anti-grumos.',
    price: 140,
    category: 'gear-accesorios',
    servingInfo: '700 ml / 24 oz · Libre de BPA · Fácil Lavado',
    isCustomizable: true,
    variantTitle: 'Color del Vaso',
    variants: [
      { id: 'shaker-negro-humo', name: 'Negro Humo con Tapa Roja' },
      { id: 'shaker-rojo-transparente', name: 'Rojo Rubí con Tapa Negra' },
    ],
  },
  {
    id: 'munequeras-soporte-pesado',
    name: 'Muñequeras Elásticas de Fuerza (Wrist Wraps)',
    description:
      'Máxima estabilidad en la articulación de la muñeca para press de banca, militar con barra y press con mancuernas pesadas. Cierre con velcro grado militar.',
    price: 180,
    category: 'gear-accesorios',
    servingInfo: 'Par de Muñequeras con Bucle de Pulgar',
  },
];
