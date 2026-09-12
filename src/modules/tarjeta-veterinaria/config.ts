// ── Configuración: VITA VET — Clínica Veterinaria Premium ───────────────────────
// Tarjeta Digital Interactiva (tipo Linktree / vCard) con Confirmación de Cita.
// ⚠️ DATOS PLACEHOLDER — reemplazar con datos reales del cliente en producción.

export const clientConfig = {
  businessName: "Vita Vet",
  tagline: 'Clínica Veterinaria Integral',
  description:
    'Cuidado experto para tu mejor amigo. Consultas, cirugía, vacunación, urgencias 24/7 y estética canina/felina.',
  phone: '5215551234567', // ⚠️ REEMPLAZAR por el WhatsApp real (formato wa.me)
  phoneNumber: '55 5123 4567',
  email: 'hola@vitavet.mx',

  address: 'Av. Insurgentes Sur 845, Col. Del Valle, 03100 CDMX',
  hours: 'Lun-Vie 9:00-20:00, Sáb 10:00-18:00, Dom 11:00-14:00 (Urgencias 24/7)',

  instagramUrl: 'https://instagram.com/vitavet.mx',
  facebookUrl: 'https://facebook.com/vitavet.mx',
  mapsUrl: 'https://maps.google.com/?q=Vita+Vet+Clinica+Veterinaria+CDMX',

  profileImage: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=400&auto=format&fit=crop',
  backgroundImage: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=800&auto=format&fit=crop',

  colors: {
    bg: '#06191a',           // teal-950
    card: '#0d2d2f',         // teal-900
    border: '#134e4a',       // teal-800
    accent: '#14b8a6',       // teal-500
    accentGlow: '#0d9488',   // teal-600
    text: '#f0fdfa',         // teal-50
    textDim: '#5eead4',      // teal-300
    textMuted: '#2dd4bf',    // teal-400
    emergency: '#ef4444',    // red-500
    trust: '#0ea5e9',        // sky-500
  },

  // Servicios veterinarios detallados (para modal individual y agendador CRO)
  services: [
    {
      id: 'consulta',
      name: 'Consulta Médica General',
      subtitle: 'Revisión física completa y diagnóstico preventivo',
      price: '$450',
      duration: '30 min',
      icon: 'stethoscope',
      badge: 'Popular',
      includes: [
        'Revisión de ojos, oídos, piel y pelaje',
        'Auscultación cardiaca y pulmonar',
        'Toma de temperatura y control de peso',
        'Plan preventivo y receta médica'
      ]
    },
    {
      id: 'vacunacion',
      name: 'Vacunación Completa',
      subtitle: 'Cuadros para cachorros, adultos y refuerzos anuales',
      price: '$650',
      duration: '20 min',
      icon: 'syringe',
      badge: 'Preventivo',
      includes: [
        'Vacuna Múltiple, Puppy o Rabia según edad',
        'Examen clínico previo sin costo adicional',
        'Registro y sello en cartilla oficial',
        'Monitoreo post-vacunal'
      ]
    },
    {
      id: 'desparasitacion',
      name: 'Desparasitación Integral',
      subtitle: 'Protección interna (parásitos) + externa (pulgas y garrapatas)',
      price: 'Desde $350',
      duration: '20 min',
      icon: 'pill',
      badge: 'Esencial',
      includes: [
        'Pesaje clínico y dosificación exacta',
        'Desparasitante interno de amplio espectro',
        'Aplicación de pipeta antipulgas y garrapatas',
        'Protección activa por hasta 3 meses'
      ]
    },
    {
      id: 'esterilizacion',
      name: 'Cirugía y Esterilización',
      subtitle: 'Procedimiento seguro con anestesia inhalada y monitoreo',
      price: '$2,200',
      duration: '60 min',
      icon: 'scissors',
      badge: 'Cirugía Segura',
      includes: [
        'Valoración pre-quirúrgica completa',
        'Anestesia inhalada de última generación',
        'Técnica de mínima invasión y rápida recuperación',
        'Seguimiento y retiro de puntos incluido'
      ]
    },
    {
      id: 'dental',
      name: 'Limpieza Dental Ultrasonido',
      subtitle: 'Eliminación profunda de sarro y prevención de gingivitis',
      price: '$950',
      duration: '45 min',
      icon: 'tooth',
      includes: [
        'Remoción de sarro con equipo de ultrasonido',
        'Pulido y abrillantado de esmalte',
        'Enjuague antiséptico de encías',
        'Recomendaciones para aliento fresco'
      ]
    },
    {
      id: 'estetica',
      name: 'Spa & Estética Canina / Felina',
      subtitle: 'Baño relajante, corte de raza y limpieza profunda',
      price: '$550',
      duration: '60 min',
      icon: 'sparkles',
      badge: 'Consentidos',
      includes: [
        'Baño tibio con shampoo hipoalergénico',
        'Corte de pelo por raza o deslanado',
        'Corte de uñas y limpieza de oídos',
        'Perfume hidratante y pañuelo de regalo'
      ]
    },
    {
      id: 'radiografia',
      name: 'Radiografía y Ultrasonido',
      subtitle: 'Diagnóstico por imagen digital de alta resolución',
      price: '$750',
      duration: '30 min',
      icon: 'scan',
      includes: [
        'Toma de placas digitales de alta definición',
        'Interpretación por médico veterinario',
        'Entrega digital inmediata vía WhatsApp',
        'Informe diagnóstico detallado'
      ]
    },
    {
      id: 'urgencias',
      name: 'Urgencias Médicas 24/7',
      subtitle: 'Atención crítica de guardia médica permanente',
      price: 'Desde $800',
      duration: 'Inmediato',
      icon: 'alert-triangle',
      emergency: true,
      badge: '24 Horas',
      includes: [
        'Atención prioritaria inmediata sin cita previa',
        'Estabilización médica y oxigenoterapia',
        'Terapia de fluidos y analgesia urgente',
        'Equipo de monitoreo continuo'
      ]
    }
  ],
};