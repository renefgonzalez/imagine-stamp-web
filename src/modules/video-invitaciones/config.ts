export interface PaqueteInvitacion {
  id: string;
  nombre: string;
  precio: number;
  badge?: string;
  destacado?: boolean;
  color: string;
  descripcionCorta: string;
  incluye: string[];
  tiempoEntrega: string;
  idealPara: string;
}

export interface DemoItem {
  id: string;
  titulo: string;
  categoria: string;
  paquete: string;
  tipo: 'video' | 'imagen';
  url: string;
  poster?: string;
  descripcion: string;
}

export const inviteConfig = {
  whatsapp: '5215650469993',
  paquetes: [
    {
      id: 'interactiva',
      nombre: 'Interactiva Digital',
      precio: 99,
      badge: 'Opción Express',
      color: '#10B981',
      descripcionCorta: 'Tarjeta digital en PDF para celular con botones que abren Maps y WhatsApp.',
      incluye: [
        'Diseño temático personalizado con foto o personaje',
        'Botón de Ubicación directa a Google Maps',
        'Botón de Confirmar Asistencia por WhatsApp',
        'Botón opcional de Mesa de Regalos / Buzón',
        'Archivo PDF ligero listo para reenviar a invitados',
        'Lista en menos de 24 horas'
      ],
      tiempoEntrega: '24 horas',
      idealPara: 'Cumpleaños rápidos, practicidad y presupuesto accesible'
    },
    {
      id: 'video_animado',
      nombre: 'Video Animado',
      precio: 399,
      badge: 'El Más Vendido 🔥',
      destacado: true,
      color: '#06B6D4',
      descripcionCorta: 'Video vertical 9:16 con personajes en movimiento, música rítmica y datos del evento.',
      incluye: [
        'Personajes animados del tema favorito en movimiento',
        'Música temática de fiesta en alta calidad',
        'Nombre, edad, fecha, hora y salón con efectos visuales',
        'Video MP4 en alta definición (ideal para WhatsApp e Instagram Stories)',
        '1 ronda de cambios de texto incluida',
        'Entrega rápida por WhatsApp'
      ],
      tiempoEntrega: '24 a 48 horas',
      idealPara: 'Fiestas temáticas que buscan impacto moderno a precio justo'
    },
    {
      id: 'cinematica',
      nombre: 'Historia Cinemática',
      precio: 499,
      badge: 'Cuento de Hadas ✨',
      color: '#8B5CF6',
      descripcionCorta: 'Experiencia narrativa de 4 a 5 escenas con sobre mágico 3D y aventura animada.',
      incluye: [
        'Escena 1: Sobre o libro 3D abriéndose con destello mágico',
        'Escena 2: Presentación del festejado en su mundo de fantasía',
        'Escena 3: Fecha y hora con animación mágica de personajes',
        'Escena 4: Pantalla del salón y mapa interactivo',
        'Música orquestal o de película de fondo',
        'Formato vertical MP4 en calidad cinematográfica'
      ],
      tiempoEntrega: '24 a 48 horas',
      idealPara: 'Primeros añitos, 3 años, princesas y temáticas mágicas'
    },
    {
      id: 'protagonista_vip',
      nombre: 'Protagonista 3D + Canción',
      precio: 699,
      badge: 'Experiencia VIP ⭐',
      color: '#EC4899',
      descripcionCorta: 'Tu peque convertido en personaje 3D con su foto real, habla e invita + canción con su nombre.',
      incluye: [
        'Transformamos la foto real de tu hijo en personaje 3D animado',
        'El personaje habla a cámara (lip-sync): dice su nombre e invita',
        'Canción original personalizada con el nombre del festejado',
        '3 escenas de acción y aventura con su traje o vestuario',
        'Subtítulos dinámicos integrados y efectos de sonido',
        'Versión vertical (Stories/WhatsApp) + versión cuadrada de recuerdo'
      ],
      tiempoEntrega: '48 horas',
      idealPara: 'Momentos inolvidables: 1er añito, 5 años, 10 años y XV'
    }
  ] as PaqueteInvitacion[],

  temasPopulares: [
    'Guerreras K-Pop / Idols',
    'Superhéroes / Spider-Man / Batman',
    'Princesas / Blanca Nieves / Frozen',
    'Bluey y Familia',
    'Hot Wheels / Autos de Carreras',
    'Dinosaurios / Jurassic',
    'Unicornios y Magia',
    'Gamer / Roblox / Minecraft',
    'Bautizo / Primera Comunión',
    'Baby Shower / Revelación',
    'XV Años / Boda',
    'Otro tema (personalizado)'
  ],

  demos: [
    {
      id: 'mateo',
      titulo: 'Mateo Héroe 3D (Habla a cámara)',
      categoria: 'Protagonista 3D',
      paquete: 'Protagonista 3D + Canción ($699)',
      tipo: 'video',
      url: '/videoinvitaciones/assets/hero_mateo.mp4',
      poster: '/videoinvitaciones/assets/poster_mateo.jpg',
      descripcion: 'El niño convertido en 3D a partir de su foto real, habla diciendo su nombre e invita con música épica.'
    },
    {
      id: 'kpop',
      titulo: 'Guerreras K-Pop (Idols en Concierto)',
      categoria: 'Video Animado',
      paquete: 'Video Animado ($399)',
      tipo: 'video',
      url: '/videoinvitaciones/assets/demo_kpop.mp4',
      poster: '/videoinvitaciones/assets/poster_kpop.jpg',
      descripcion: 'Coreografía enérgica en escenario neón con stickers festivos y datos del evento al pie.'
    },
    {
      id: 'bluey',
      titulo: 'Bluey & Amigos',
      categoria: 'Video Animado',
      paquete: 'Video Animado ($399)',
      tipo: 'video',
      url: '/videoinvitaciones/assets/demo_bluey.mp4',
      poster: '/videoinvitaciones/assets/poster_bluey.jpg',
      descripcion: 'Marco infantil tierno con los personajes favoritos de los pequeños y música alegre.'
    },
    {
      id: 'blanca',
      titulo: 'Blanca Nieves y el Sobre Mágico',
      categoria: 'Historia Cinemática',
      paquete: 'Historia Cinemática ($499)',
      tipo: 'video',
      url: '/videoinvitaciones/assets/demo_blancanieves.mp4',
      poster: '/videoinvitaciones/assets/poster_blanca.jpg',
      descripcion: 'El sobre se abre con polvito de hadas y da paso a un recorrido de 4 escenas animadas en el bosque.'
    },
    {
      id: 'interactiva',
      titulo: 'Tarjeta Interactiva con Botones',
      categoria: 'Interactiva Digital',
      paquete: 'Interactiva Express ($99)',
      tipo: 'imagen',
      url: '/videoinvitaciones/assets/carrusel_1.jpg',
      descripcion: 'Diseño para celular con botones directos para abrir Google Maps y confirmar en WhatsApp.'
    }
  ] as DemoItem[],

  faqs: [
    {
      pregunta: '¿Cómo le llega la invitación a mis invitados?',
      respuesta: 'Te enviamos tu video en MP4 de alta calidad y/o tu archivo PDF interactivo directamente a tu WhatsApp. Desde ahí lo reenvías con un toque a todos tus contactos o grupos familiares, y también lo puedes subir a tus estados de WhatsApp o Instagram.'
    },
    {
      pregunta: '¿Puedo pedir cualquier personaje o tema?',
      respuesta: '¡Sí, absolutamente! Trabajamos cualquier tema: películas infantiles, superhéroes, princesas, K-pop, deportes, videojuegos, o temáticas para adultos como Bautizo, Boda y XV Años.'
    },
    {
      pregunta: '¿Qué necesito mandar para el paquete Protagonista 3D?',
      respuesta: 'Solo nos mandas una foto de tu hijo/a de frente, con buena luz y donde se aprecie bien su carita. Nuestro equipo la transforma en un personaje animado 3D conservando su peinado, ojos y sonrisa.'
    },
    {
      pregunta: '¿Cuánto tiempo tarda la entrega?',
      respuesta: 'Interactiva ($99): menos de 24 horas. Video Animado ($399) e Historia Cinemática ($499): de 24 a 48 horas. Protagonista 3D + Canción ($699): 48 horas.'
    },
    {
      pregunta: '¿Cómo se realiza el pago?',
      respuesta: 'Aceptamos transferencias bancarias (SPEI) y depósitos en cualquier tienda OXXO. Se solicita un anticipo del 50% para comenzar y liquidas el 50% restante al aprobar tu vista previa.'
    },
    {
      pregunta: '¿Incluye cambios si me equivoco en algún dato?',
      respuesta: '¡Claro que sí! Tienes una ronda de cambios sin costo en fecha, hora, dirección o nombres.'
    }
  ]
};
