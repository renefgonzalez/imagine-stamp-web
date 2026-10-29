// ═══════════════════════════════════════════════════════════════════════════
// Configuración: UÑAS ROSÉ STUDIO — Salón de Uñas, Pestañas & Spa
// Demo interactivo de agendamiento CRO de 2 pasos para estética / salón.
// ═══════════════════════════════════════════════════════════════════════════

export const clientConfig = {
  businessName: 'Uñas Rosé Studio',
  tagline: 'Nail Bar & Beauty Lounge',
  description: 'Diseño, técnica y cuidado profesional para tus manos y pies. Esmaltado en gel, acrílico esculpido y spa relajante.',
  
  // WhatsApp oficial del demo (René) con prefijo obligatorio [DEMO salón de uñas]
  phone: '5215650469993',
  phoneNumber: '55 6504 6999',
  email: 'citas@unasrose.mx',
  
  // Ubicación ficticia y genérica según reglas (solo alcaldía/ciudad)
  address: 'Iztapalapa, CDMX',
  hours: 'Lun-Sáb 10:00 a 19:00 (Domingos cerrado)',

  instagramUrl: 'https://instagram.com/',
  facebookUrl: 'https://facebook.com/',
  mapsUrl: 'https://maps.google.com/?q=Iztapalapa+CDMX',

  // Colores propios: rosa empolvado, nude y dorado suave
  colors: {
    bg: '#FAF6F7',
    bgCard: '#FFFFFF',
    bgCardSubtle: '#FFF5F8',
    border: '#F0DCE4',
    borderActive: '#D47A94',
    primary: '#D47A94',         // Rosa empolvado refinado
    primaryDark: '#B85873',
    primaryLight: '#FDEEF2',
    gold: '#C5A059',            // Dorado suave
    goldLight: '#F7F2E7',
    text: '#2D1E25',            // Tinta carbón mora profunda
    textMuted: '#7D6A73',
    textSubtle: '#A6959D',
  },

  // Anticipo y política de cancelación
  depositAmount: 100, // $100 MXN para apartar cita
  cancellationPolicy: 'Si cancelas con menos de 24 horas de anticipación, se pierde el anticipo.',
  
  // Datos de transferencia bancaria de muestra (CLABE de ejemplo)
  bankInfo: {
    bank: 'BBVA (Ejemplo)',
    accountHolder: 'Uñas Rosé Studio',
    clabe: '0121 8001 2345 6789 01', // CLABE de muestra
    conceptPrefix: 'CITA-',
  },

  // Horarios de atención disponibles para citas (en bloques de 1 hora)
  timeSlots: [
    '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00'
  ],

  // Categorías de servicios con pestañas
  categories: [
    { id: 'gel', name: 'Gel Semi' },
    { id: 'acrilico', name: 'Acrílico' },
    { id: 'pedicure', name: 'Pedicure' },
    { id: 'pestanas', name: 'Pestañas y Cejas' },
  ],

  // Servicios detallados por categoría
  services: [
    // ── Gel ──
    {
      id: 'gel-liso',
      categoryId: 'gel',
      name: 'Gel Liso',
      subtitle: 'Esmaltado semipermanente 1 tono con manicura rusa',
      price: 250,
      priceFormatted: '$250',
      duration: '60 min',
      imageKey: 'gel',
      badge: 'Más pedido',
      includes: [
        'Limpieza y retiro de cutícula (manicura rusa básica)',
        'Limado y forma personalizada de uña natural',
        'Base fortalecedora + 2 capas de color a elegir',
        'Top coat brillante o mate de larga duración',
        'Aceite aromático de cutícula'
      ]
    },
    {
      id: 'gel-diseno',
      categoryId: 'gel',
      name: 'Gel con Diseño',
      subtitle: 'Nail art a mano alzada, french, efectos o foil',
      price: 350,
      priceFormatted: '$350',
      duration: '90 min',
      imageKey: 'diseno-1',
      badge: 'Favorito',
      includes: [
        'Manicura rusa completa y nivelación de uña',
        'Esmaltado en gel con paleta de temporada',
        'Diseño en 2 a 4 uñas (french, líneas, glitter o foil)',
        'Top coat ultra brillo resistente a rayaduras',
        'Masaje hidratante final de manos'
      ]
    },
    {
      id: 'gel-bano-acrilico',
      categoryId: 'gel',
      name: 'Baño de Acrílico + Gel',
      subtitle: 'Capa protectora sobre tu uña natural para evitar quiebres',
      price: 320,
      priceFormatted: '$320',
      duration: '75 min',
      imageKey: 'acrilico',
      includes: [
        'Preparación y deshidratación de la uña natural',
        'Capa fina de acrílico cristal o cover de refuerzo',
        'Esmaltado en gel semipermanente liso',
        'Ideal para uñas débiles o quebradizas'
      ]
    },

    // ── Acrílico ──
    {
      id: 'acrilico-esculpido',
      categoryId: 'acrilico',
      name: 'Acrílico Esculpido',
      subtitle: 'Set nuevo con forma almendra, cofin, cuadrada o stiletto',
      price: 450,
      priceFormatted: '$450',
      duration: '120 min',
      imageKey: 'diseno-4',
      badge: 'Escultural',
      includes: [
        'Escultura con formas profesionales (sin tips plásticos)',
        'Monómero libre de MMA para salud de tus uñas',
        'Largo hasta número 3 en acrílico cover o nude',
        'Esmaltado en gel o técnica baby boomer incluida',
        'Garantía de aplicación de 7 días'
      ]
    },
    {
      id: 'acrilico-retoque',
      categoryId: 'acrilico',
      name: 'Retoque de Acrílico',
      subtitle: 'Relleno de crecimiento, nivelación y cambio de diseño',
      price: 280,
      priceFormatted: '$280',
      duration: '75 min',
      imageKey: 'diseno-3',
      includes: [
        'Retiro de esmalte previo y desprendimientos',
        'Limpieza de zona de cutícula y desinfección',
        'Relleno de acrílico en área de crecimiento',
        'Nuevo esmaltado en gel semipermanente'
      ]
    },
    {
      id: 'acrilico-retiro',
      categoryId: 'acrilico',
      name: 'Retiro Seguro de Acrílico',
      subtitle: 'Remoción cuidadosa sin dañar la queratina natural',
      price: 120,
      priceFormatted: '$120',
      duration: '30 min',
      imageKey: 'diseno-2',
      includes: [
        'Rebaje con torno profesional de baja vibración',
        'Disolución suave con humectantes botánicos',
        'Pulido ligero y tratamiento fortalecedor de queratina'
      ]
    },

    // ── Pedicure ──
    {
      id: 'pedicure-spa',
      categoryId: 'pedicure',
      name: 'Pedicure Spa Relajante',
      subtitle: 'Terapia completa con sales, exfoliación y masaje',
      price: 300,
      priceFormatted: '$300',
      duration: '60 min',
      imageKey: 'pedicure',
      badge: 'Relajante',
      includes: [
        'Tina de hidromasaje con sales marinas minerales',
        'Exfoliación profunda con cristales de azúcar y aceites',
        'Limpieza de canales, corte y limado de uñas',
        'Remoción suave de asperezas y mascarilla humectante',
        'Esmaltado tradicional o gel con secado rápido'
      ]
    },
    {
      id: 'pedicure-clinico',
      categoryId: 'pedicure',
      name: 'Pedicure Profundo',
      subtitle: 'Atención detallada a callosidades, talones y cutículas',
      price: 380,
      priceFormatted: '$380',
      duration: '75 min',
      imageKey: 'diseno-6',
      includes: [
        'Evaluación de pies y talones agrietados',
        'Desbastado profundo de callosidades con instrumental esterilizado',
        'Limpieza minuciosa de bordes ungueales',
        'Bálsamo regenerador intensivo con urea y karité'
      ]
    },
    {
      id: 'pedicure-gel-pies',
      categoryId: 'pedicure',
      name: 'Gel Semipermanente en Pies',
      subtitle: 'Color impecable que dura hasta 4 semanas intacto',
      price: 220,
      priceFormatted: '$220',
      duration: '45 min',
      imageKey: 'diseno-5',
      includes: [
        'Corte, limado y retiro de cutícula exprés',
        'Aplicación de gel semipermanente con secado UV/LED',
        'Brillo extremo sin descascararse con zapatos cerrados'
      ]
    },

    // ── Pestañas y Cejas ──
    {
      id: 'pestanas-lifting',
      categoryId: 'pestanas',
      name: 'Lifting de Pestañas + Tinte',
      subtitle: 'Curvatura natural desde la raíz con efecto rímel 24/7',
      price: 400,
      priceFormatted: '$400',
      duration: '60 min',
      imageKey: 'pestanas',
      badge: 'Mirada Top',
      includes: [
        'Elevación con pads de silicona según el tamaño de tu ojo',
        'Tratamiento de queratina y botox de pestañas para nutrición',
        'Tinte negro azabache o café intenso',
        'Duración estimada de 6 a 8 semanas'
      ]
    },
    {
      id: 'cejas-laminado',
      categoryId: 'pestanas',
      name: 'Laminado de Cejas',
      subtitle: 'Efecto ceja peinada, más densa, definida y estilizada',
      price: 350,
      priceFormatted: '$350',
      duration: '50 min',
      imageKey: 'diseno-7',
      includes: [
        'Direccionamiento y fijación del vello rebelde',
        'Diseño de cejas con depilación con pinza y cera tibia',
        'Tratamiento de nutrición capilar profunda'
      ]
    },
    {
      id: 'cejas-tinte-diseno',
      categoryId: 'pestanas',
      name: 'Diseño + Tinte de Cejas',
      subtitle: 'Visagismo según las facciones de tu rostro y tono ideal',
      price: 200,
      priceFormatted: '$200',
      duration: '30 min',
      imageKey: 'diseno-8',
      includes: [
        'Mapeo facial con hilo medidor para simetría',
        'Depilación de precisión con pinza',
        'Pigmento semipermanente tipo henna suave'
      ]
    }
  ],

  // Galería de diseños reales con lightbox
  gallery: [
    { id: 'g1', title: 'French Rosé con Glitter', category: 'Gel', imageKey: 'diseno-1' },
    { id: 'g2', title: 'Almendra Nude Minimalista', category: 'Gel', imageKey: 'diseno-2' },
    { id: 'g3', title: 'Aura & Ojo de Gato', category: 'Acrílico', imageKey: 'diseno-3' },
    { id: 'g4', title: 'Baby Boomer Escultural', category: 'Acrílico', imageKey: 'diseno-4' },
    { id: 'g5', title: 'Flores Mano Alzada', category: 'Nail Art', imageKey: 'diseno-5' },
    { id: 'g6', title: 'Pedicure Spa & Esmalte', category: 'Pedicure', imageKey: 'diseno-6' },
    { id: 'g7', title: 'Lifting & Mirada Abierta', category: 'Lash & Brow', imageKey: 'diseno-7' },
    { id: 'g8', title: 'Foil Dorado & Acabado Mate', category: 'Diseño', imageKey: 'diseno-8' },
  ]
};
