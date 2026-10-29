// ═══════════════════════════════════════════════════════════════════════════
// Configuración: LAVANDERÍA BURBUJA — Lavado, Planchado & Tintorería
// Demo Oficial de Carrito de 2 Pasos + Consulta de Orden por Folio.
// ═══════════════════════════════════════════════════════════════════════════

// ℹ️ NOTA TÉCNICA: En producción, este módulo se conecta directamente a la tabla
// 'orders' de Supabase (id, folio, status, cliente, items, timeline, timestamps),
// reutilizando el motor de pedidos en tiempo real y el AdminPanel de Imagine & Stamp
// tal como opera en el sistema desplegado de Tacos Chepe.

export const clientConfig = {
  businessName: 'Lavandería Burbuja',
  tagline: 'Lavado por Kilo, Planchado & Tintorería',
  description: 'Tu ropa limpia, suave y doblada con el mayor cuidado. Servicio en sucursal o con recolección y entrega a domicilio con seguimiento en vivo.',

  // WhatsApp oficial del demo (René) con prefijo obligatorio [DEMO lavandería]
  phone: '5215650469993',
  phoneNumber: '56 5046 9993',
  email: 'hola@lavanderiaburbuja.mx',

  // Ubicación ficticia y genérica según reglas
  address: 'Iztapalapa, CDMX',
  hours: 'Lun-Sáb 08:30 a 20:00, Dom 09:00 a 15:00',

  instagramUrl: 'https://instagram.com/',
  facebookUrl: 'https://facebook.com/',
  mapsUrl: 'https://maps.google.com/?q=Iztapalapa+CDMX',

  // Paleta propia: azul agua, blanco y acento amarillo cálido
  colors: {
    bg: '#F0F9FF',              // Sky 50 (Agua cristalina)
    bgCard: '#FFFFFF',
    bgCardSubtle: '#E0F2FE',    // Sky 100
    border: '#BAE6FD',          // Sky 200
    primary: '#0284C7',         // Sky 600 (Azul agua vibrante)
    primaryDark: '#0369A1',     // Sky 700
    primaryLight: '#E0F2FE',
    accentYellow: '#F59E0B',    // Amber 500 (Acento cálido de burbuja/sol)
    accentYellowLight: '#FEF3C7',
    text: '#0F172A',            // Slate 900
    textMuted: '#475569',       // Slate 600
    textSubtle: '#94A3B8',      // Slate 400
  },

  // Datos bancarios de muestra para transferencias
  bankInfo: {
    bank: 'BBVA (Muestra)',
    accountHolder: 'Lavandería Burbuja',
    clabe: '0121 8009 8765 4321 09',
  },

  // Folios precargados de ejemplo para el rastreador de órdenes
  demoOrders: {
    'LB-1024': {
      folio: 'LB-1024',
      customerName: 'Valeria Morales',
      serviceSummary: 'Carga de 8 kg (Ropa de diario)',
      currentStep: 2, // 'lavando'
      stepName: 'Lavando y Centrifugando',
      stepDescription: 'Tu ropa está en ciclo de lavado con detergente biodegradable hipoalergénico.',
      date: 'Hoy, 29 oct · 11:20 AM',
      estimatedDelivery: 'Hoy, 18:30 hrs',
      deliveryMethod: 'Recolección a domicilio'
    },
    'LB-1025': {
      folio: 'LB-1025',
      customerName: 'Roberto Fuentes',
      serviceSummary: 'Edredón Matrimonial + 3 Camisas planchadas',
      currentStep: 4, // 'lista'
      stepName: 'Lista para Entrega',
      stepDescription: 'Tu orden está empacada, doblada y lista para recibir en tu puerta o pasar por ella.',
      date: 'Hoy, 29 oct · 09:45 AM',
      estimatedDelivery: 'Listo para recolección inmediata',
      deliveryMethod: 'Entrega en mostrador'
    }
  },

  // Pasos de la línea de tiempo de la orden
  timelineSteps: [
    { step: 1, id: 'recibida', name: 'Recibida', desc: 'Prendas contadas y pesadas' },
    { step: 2, id: 'lavando', name: 'Lavando', desc: 'Lavado y centrifugado' },
    { step: 3, id: 'planchando', name: 'Planchando / Secando', desc: 'Vapor y doblado' },
    { step: 4, id: 'lista', name: 'Lista para Entrega', desc: 'Empacado higiénico' },
    { step: 5, id: 'entregada', name: 'Entregada', desc: 'Cliente satisfecho' },
  ],

  // Categorías de catálogo
  categories: [
    { id: 'kilo', name: 'Lavado por Kilo' },
    { id: 'planchado', name: 'Planchado' },
    { id: 'edredones', name: 'Edredones & Colchas' },
    { id: 'tintoreria', name: 'Tintorería' },
    { id: 'extras', name: 'Extras & Exprés' },
  ],

  // Catálogo completo de servicios con precios de muestra
  products: [
    // ── Lavado por Kilo ──
    {
      id: 'kilo-3',
      name: 'Lavado por Kilo (3 kg aprox)',
      category: 'kilo',
      price: 90,
      description: 'Carga ligera (playeras, shorts, ropa interior). Incluye jabón y suavizante básico.',
      imageKey: 'lavado-kilo',
      unit: '3 kg',
      badge: 'Carga básica'
    },
    {
      id: 'kilo-5',
      name: 'Lavado por Kilo (5 kg aprox)',
      category: 'kilo',
      price: 150,
      description: 'Carga mediana de ropa semanal. Lavado profundo, secado completo y doblado impecable.',
      imageKey: 'lavado-kilo',
      unit: '5 kg',
      badge: 'Más popular'
    },
    {
      id: 'kilo-8',
      name: 'Lavado por Kilo (8 kg aprox)',
      category: 'kilo',
      price: 240,
      description: 'Carga familiar. Cuidado especial en separación de prendas de color y blancas.',
      imageKey: 'lavado-kilo',
      unit: '8 kg'
    },
    {
      id: 'kilo-10',
      name: 'Lavado por Kilo (10 kg aprox)',
      category: 'kilo',
      price: 300,
      description: 'Carga extra grande. Máxima economía y ropa doblada lista para guardar en clóset.',
      imageKey: 'lavado-kilo',
      unit: '10 kg',
      badge: 'Ahorro'
    },

    // ── Planchado por pieza ──
    {
      id: 'planchado-camisa',
      name: 'Planchado de Camisa / Blusa',
      category: 'planchado',
      price: 20,
      description: 'Planchado profesional con vapor continuo. Cuello y puños firmes sin brillos.',
      imageKey: 'planchado',
      unit: 'pieza'
    },
    {
      id: 'planchado-pantalon',
      name: 'Planchado de Pantalón',
      category: 'planchado',
      price: 20,
      description: 'Línea de quiebre perfecta para vestir formal o casual.',
      imageKey: 'planchado',
      unit: 'pieza'
    },
    {
      id: 'planchado-vestido',
      name: 'Planchado de Vestido Casual',
      category: 'planchado',
      price: 35,
      description: 'Cuidado especial en telas delicadas, tablas, olanes y aplicaciones.',
      imageKey: 'planchado',
      unit: 'pieza'
    },

    // ── Edredones & Colchas ──
    {
      id: 'edredon-individual',
      name: 'Edredón Individual',
      category: 'edredones',
      price: 120,
      description: 'Lavado antibacteriano con secado esponjoso para conservar el relleno.',
      imageKey: 'edredon',
      unit: 'pieza'
    },
    {
      id: 'edredon-matrimonial',
      name: 'Edredón Matrimonial',
      category: 'edredones',
      price: 160,
      description: 'Elimina ácaros y olores. Entregado en bolsa protectora con cierre.',
      imageKey: 'edredon',
      unit: 'pieza',
      badge: 'Cuidado total'
    },
    {
      id: 'edredon-king',
      name: 'Edredón King Size / Queen',
      category: 'edredones',
      price: 200,
      description: 'Capacidad en lavadoras de gran volumen para un enjuague impecable.',
      imageKey: 'edredon',
      unit: 'pieza'
    },

    // ── Tintorería ──
    {
      id: 'tintoreria-saco',
      name: 'Saco / Blazer',
      category: 'tintoreria',
      price: 90,
      description: 'Limpieza en seco profesional que protege la estructura y entretelas.',
      imageKey: 'tintoreria',
      unit: 'pieza'
    },
    {
      id: 'tintoreria-traje',
      name: 'Traje Completo (2 piezas)',
      category: 'tintoreria',
      price: 160,
      description: 'Saco + pantalón con acabado sastre en gancho y cubrepolvo plástico.',
      imageKey: 'tintoreria',
      unit: 'set'
    },

    // ── Extras & Exprés ──
    {
      id: 'extra-suavizante',
      name: 'Suavizante Especial Downy / Cuidado Fino',
      category: 'extras',
      price: 15,
      description: 'Aroma premium de larga duración e hipoalergénico para piel sensible.',
      imageKey: 'suavizante',
      unit: 'servicio'
    },
    {
      id: 'extra-expres',
      name: 'Servicio Exprés Mismo Día',
      category: 'extras',
      price: 50,
      description: 'Entrega prioritaria en menos de 6 horas (recibiendo antes de las 12:00 PM).',
      imageKey: 'express',
      unit: 'orden',
      badge: 'Urgente'
    },
  ]
};

