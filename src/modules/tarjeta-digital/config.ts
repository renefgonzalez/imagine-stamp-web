// ── Configuración: GENTLEMAN'S CUT — Barbería Premium ───────────────────────
// Tarjeta Digital Interactiva (Linktree/vCard premium) con Agendador CRO.
// ⚠️ DATOS PLACEHOLDER — reemplazar con datos reales del cliente en producción.

export const clientConfig = {
  businessName: "Gentleman's Cut",
  tagline: 'Barbería Premium & Grooming',
  description:
    'Cortes de precisión, perfilado de barba y grooming de alta gama. Vive la experiencia de una barbería premium.',
  phone: '521234567890', // ⚠️ REEMPLAZAR por el WhatsApp real (formato wa.me)
  phoneNumber: '55 1234 5678',
  email: 'hola@gentlemanscut.mx',

  address: 'Av. Reforma 123, Col. Centro, 06600 CDMX',
  hours: 'Lun-Sáb 10:00-20:00, Dom 11:00-17:00',

  instagramUrl: 'https://instagram.com/',
  facebookUrl: 'https://facebook.com/',
  mapsUrl: 'https://maps.google.com/?q=barberia',

  profileImage: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=400&auto=format&fit=crop',
  backgroundImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop',

  colors: {
    bg: '#09090b',        // zinc-950
    card: '#18181b',      // zinc-900
    border: '#27272a',    // zinc-800
    accent: '#f59e0b',    // amber-500
    accentGlow: '#d97706', // amber-600
    text: '#ffffff',
    textDim: '#a1a1aa',   // zinc-400
    textMuted: '#71717a', // zinc-500
  },

  // Servicios de barbería/estética detallados (para modal individual y agendador CRO)
  services: [
    {
      id: 'corte-clasico',
      name: 'Corte Clásico',
      subtitle: 'Tijera y máquina, acabado pulido',
      price: '$250',
      duration: '30 min',
      icon: 'scissors',
      badge: 'Más pedido',
      includes: [
        'Consulta de estilo y recomendación',
        'Corte con tijera y máquina profesional',
        'Perfilado de cuello y patillas',
        'Toalla caliente y producto de acabado'
      ]
    },
    {
      id: 'corte-barba',
      name: 'Corte + Barba Completa',
      subtitle: 'Corte de cabello + perfilado y arreglo de barba',
      price: '$380',
      duration: '45 min',
      icon: 'scissors',
      badge: 'Combo',
      includes: [
        'Corte de cabello personalizado',
        'Perfilado y modelado de barba',
        'Toalla caliente + aceite de barba',
        'Hidratación facial post-afeitado'
      ]
    },
    {
      id: 'barba-perfilado',
      name: 'Perfilado de Barba',
      subtitle: 'Diseño, líneas limpias y producto premium',
      price: '$180',
      duration: '20 min',
      icon: 'scissors',
      badge: 'Grooming',
      includes: [
        'Diseño de líneas y contornos',
        'Recorte con máquina de precisión',
        'Toalla caliente y vapor',
        'Aceite hidratante + bálsamo'
      ]
    },
    {
      id: 'afeitado-clasico',
      name: 'Afeitado Clásico Navaja',
      subtitle: 'Ritual tradicional con toallas calientes',
      price: '$220',
      duration: '30 min',
      icon: 'scissors',
      badge: 'Premium',
      includes: [
        'Preparación con aceite pre-afeitado',
        'Espuma caliente aplicada a brocha',
        'Afeitado a navaja contra grano',
        'Toalla fría + aftershave sin alcohol'
      ]
    },
    {
      id: 'cejas-pestañas',
      name: 'Diseño de Cejas + Pestañas',
      subtitle: 'Perfilado, tinte y lifting',
      price: '$150',
      duration: '25 min',
      icon: 'sparkles',
      badge: 'Estética',
      includes: [
        'Diseño de cejas según rostro',
        'Depilación con hilo o pinza',
        'Tinte de cejas (opcional)',
        'Lifting de pestañas (opcional +$80)'
      ]
    },
    {
      id: 'facial-hombre',
      name: 'Facial Profundo Hombre',
      subtitle: 'Limpieza, extracción e hidratación',
      price: '$320',
      duration: '40 min',
      icon: 'sparkles',
      badge: 'Skin Care',
      includes: [
        'Análisis de tipo de piel',
        'Limpieza profunda + vapor',
        'Extracción de impurezas',
        'Mascarilla + masaje + protector solar'
      ]
    },
    {
      id: 'tinte-barba',
      name: 'Tinte de Barba / Cabello',
      subtitle: 'Cobertura de canas natural',
      price: '$120',
      duration: '15 min',
      icon: 'pill',
      includes: [
        'Test de alergia previo',
        'Tinte profesional sin amoníaco',
        'Tiempo de pose controlado',
        'Lavado y acondicionador'
      ]
    },
    {
      id: 'paquete-novio',
      name: 'Paquete Novio / Evento',
      subtitle: 'Corte + barba + facial + cejas (1 día antes)',
      price: '$650',
      duration: '90 min',
      icon: 'crown',
      badge: 'Especial',
      includes: [
        'Corte de precisión',
        'Perfilado de barba completo',
        'Facial express + cejas',
        'Producto de styling para el día'
      ]
    }
  ],
};