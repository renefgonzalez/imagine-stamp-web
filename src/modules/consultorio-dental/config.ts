// ═══════════════════════════════════════════════════════════════════════════
// Configuración: SONRISA CLARA · CONSULTORIO DENTAL
// Demo Oficial de Citas Médicas CRO con Privacidad Estricta LFPDPPP
// ═══════════════════════════════════════════════════════════════════════════

export const clientConfig = {
  businessName: 'Sonrisa Clara · Consultorio Dental',
  tagline: 'Odontología Integral, Estética & Ortodoncia',
  description: 'Atención odontológica preventiva, correctiva y estética con tecnología moderna, instrumental esterilizado y trato humano.',

  // Especialista titular (placeholder sin foto de persona real)
  specialistName: 'Dra. / Dr. — Especialista en Odontología Integral',
  specialistTitle: 'Cirujano Dentista · Certificación Profesional',

  // WhatsApp oficial del demo (René) con prefijo obligatorio [DEMO consultorio dental]
  phone: '5215650469993',
  phoneNumber: '56 5046 9993',
  email: 'citas@sonrisaclara.mx',

  // Ubicación ficticia y genérica según reglas
  address: 'Iztapalapa, CDMX',
  hours: 'Lun-Vie 10:00 a 19:00, Sáb 09:00 a 14:00 (Dom cerrado)',

  instagramUrl: 'https://instagram.com/',
  facebookUrl: 'https://facebook.com/',
  mapsUrl: 'https://maps.google.com/?q=Iztapalapa+CDMX',

  // Paleta propia: blanco, menta fresca y azul profundo
  colors: {
    bg: '#F8FAFC',              // Slate 50 (Blanco clínico cálido)
    bgCard: '#FFFFFF',
    bgCardSubtle: '#F0FDFA',    // Teal 50 (Menta sutil hielo)
    border: '#E2E8F0',          // Slate 200
    borderActive: '#0D9488',    // Teal 600
    primary: '#0D9488',         // Menta médica profunda
    primaryDark: '#0F766E',     // Teal 700
    primaryLight: '#CCFBF1',    // Teal 100
    deepNavy: '#0F172A',        // Slate 900 (Azul profundo profesional)
    text: '#0F172A',
    textMuted: '#475569',
    textSubtle: '#94A3B8',
  },

  // Horarios de consulta clínica
  timeSlots: [
    '10:00', '11:00', '12:00', '13:00',
    '16:00', '17:00', '18:00', '19:00'
  ],

  // Motivos de consulta como lista cerrada (sin campo de texto libre para síntomas)
  consultationReasons: [
    { id: 'revision', label: 'Revisión general y diagnóstico' },
    { id: 'dolor', label: 'Dolor o molestia urgente' },
    { id: 'limpieza', label: 'Limpieza dental y sarro' },
    { id: 'estetica', label: 'Estética dental o blanqueamiento' },
    { id: 'ortodoncia', label: 'Ortodoncia (brackets / alineadores)' },
    { id: 'otro', label: 'Otro motivo de valoración' },
  ],

  // Guía "Antes de tu cita"
  beforeYourVisit: [
    {
      title: 'Puntualidad',
      desc: 'Llega 10 minutos antes de tu horario para registro y ficha de recepción.'
    },
    {
      title: 'Identificación',
      desc: 'Presenta una identificación oficial vigente en la recepción.'
    },
    {
      title: 'Higiene previa',
      desc: 'Te recomendamos cepillarte los dientes antes de ingresar a la unidad.'
    },
    {
      title: 'Estudios previos',
      desc: 'Si cuentas con radiografías tomadas en los últimos 6 meses, tráelas contigo.'
    }
  ],

  // Servicios odontológicos destacados
  services: [
    {
      id: 'valoracion',
      name: 'Consulta de Valoración',
      priceFrom: 'Desde $250',
      duration: '40 min',
      description: 'Exploración visual minuciosa con cámara intraoral, diagnóstico completo y plan de tratamiento.',
      imageKey: 'valoracion',
      badge: 'Primer paso',
      includes: [
        'Exploración clínica de dientes y encías',
        'Detección temprana de caries incipientes',
        'Presupuesto claro y orden de prioridad por etapas'
      ]
    },
    {
      id: 'limpieza',
      name: 'Limpieza Dental Ultrasónica',
      priceFrom: 'Desde $450',
      duration: '50 min',
      description: 'Eliminación de sarro supra y subgingival con ultrasonido, pulido con pasta profiláctica y flúor.',
      imageKey: 'limpieza',
      badge: 'Recomendada',
      includes: [
        'Profilaxis ultrasónica sin dolor',
        'Eliminación de manchas extrínsecas (café, té)',
        'Pulido interdental con hilo y pasta de brillo',
        'Aplicación tópica de flúor protector'
      ]
    },
    {
      id: 'resinas',
      name: 'Resinas Estéticas',
      priceFrom: 'Desde $350 / pieza',
      duration: '45 min',
      description: 'Obturaciones estéticas del color exacto de tu esmalte. Libre de mercurio y metales.',
      imageKey: 'resina',
      includes: [
        'Remoción conservadora de tejido cariado',
        'Grabado ácido y adhesivo de 5ta generación',
        'Estratificación de resina nanohíbrida',
        'Ajuste de oclusión y pulido de alto brillo'
      ]
    },
    {
      id: 'blanqueamiento',
      name: 'Blanqueamiento Dental',
      priceFrom: 'Desde $1,200',
      duration: '60 min',
      description: 'Aclaramiento dental en consultorio con gel clínico de peróxido activado. Sonrisa luminosa en 1 sesión.',
      imageKey: 'blanqueamiento',
      badge: 'Estética',
      includes: [
        'Aislamiento y protector gingival de encías',
        'Aplicación clínica controlada de gel blanqueador',
        'Terapia desensibilizante post-tratamiento',
        'Comparativa en guía de color Vita antes/después'
      ]
    },
    {
      id: 'ortodoncia',
      name: 'Valoración de Ortodoncia',
      priceFrom: 'Desde $300',
      duration: '45 min',
      description: 'Estudio de maloclusión y alineación para brackets tradicionales, estéticos o alineadores invisibles.',
      imageKey: 'ortodoncia',
      includes: [
        'Análisis facial y de línea de sonrisa',
        'Orden radiográfica cefalométrica y panorámica',
        'Opciones de financiamiento y mensualidades'
      ]
    }
  ]
};

