export interface ProblemaAmbiental {
  id: string;
  titulo: string;
  subtitulo: string;
  fotoId: string;
  descripcion: string;
  comoMitigarlo: string[];
  enlaceLugarId?: string;
  enlaceTexto?: string;
}

export const PROBLEMAS_AMBIENTALES: ProblemaAmbiental[] = [
  {
    id: 'incendios-forestales',
    titulo: 'Incendios Forestales Provocados',
    subtitulo: 'La gran mayoría de los siniestros en la sierra derivan de descuidos humanos.',
    fotoId: 'bosque-hartwegii',
    descripcion: 'Las fogatas mal apagadas, colillas arrojadas al zacatonal y quemas agrícolas no controladas devoran cientos de hectáreas de bosque de alta montaña cada temporada de estiaje, destruyendo renuevos de pino hartwegii y fauna endémica.',
    comoMitigarlo: [
      'Cero fogatas en áreas naturales protegidas; utiliza estufillas de gas de montaña.',
      'No arrojar colillas ni vidrios que puedan concentrar calor como lupas.',
      'Apoyar en jornadas preventivas de apertura y limpieza de brechas cortafuego.',
      'Reportar columnas de humo de inmediato al 911 o al Centro Nacional de Manejo del Fuego.'
    ]
  },
  {
    id: 'basura-en-parajes',
    titulo: 'Acumulación de Residuos en Parajes y Barrancas',
    subtitulo: 'Plásticos, latas y residuos inorgánicos amenazan las cuencas de agua.',
    fotoId: 'paso-de-cortes',
    descripcion: 'A pesar de la señalización, toneladas de desechos abandonados en barrancas y senderos contaminan los escurrimientos que abastecen de agua a los valles circundantes y envenenan a animales silvestres que los ingieren por error.',
    comoMitigarlo: [
      'Aplica el principio de "No Deje Rastro": todo residuo que sube contigo, regresa contigo a casa.',
      'Evita plásticos de un solo uso; opta por envases y botellas reutilizables.',
      'Participa activamente en nuestras jornadas colectivas de saneamiento y limpieza de parajes.',
      'Educa e invita respetuosamente a otros visitantes a levantar sus residuos.'
    ]
  },
  {
    id: 'tala-clandestina',
    titulo: 'Tala Clandestina y Cambio de Uso de Suelo',
    subtitulo: 'La fragmentación del bosque debilita la fábrica de oxígeno y agua del Valle.',
    fotoId: 'oyamel',
    descripcion: 'La tala ilegal despoja laderas enteras de árboles maduros de oyamel y pino, acelerando la erosión del suelo volcánico, reduciendo la captación de agua en los mantos freáticos y alterando el microclima regional.',
    comoMitigarlo: [
      'Denunciar cargamentos y motosierras ilegales ante PROFEPA y autoridades comunitarias.',
      'Exigir y consumir únicamente productos de madera con certificación forestal sustentable.',
      'Sumarte a jornadas de reforestación comunitaria con plántulas nativas verificadas.',
      'Promover la valorización económica de los bosques en pie para las comunidades locales.'
    ]
  },
  {
    id: 'extraccion-musgo-tierra',
    titulo: 'Extracción de Musgo, Heno y Tierra de Monte',
    subtitulo: 'El saqueo navideño despoja a la montaña de su esponja natural de agua.',
    fotoId: 'flora-eryngium',
    descripcion: 'Cada invierno, el saqueo desmedido de musgo y tierra de monte para nacimientos navideños destruye la capa vegetal que retiene la humedad, evita deslaves y da albergue a microorganismos y germinación de semillas.',
    comoMitigarlo: [
      'Rechazar la compra de musgo, heno silvestre y tierra de monte en tianguis y mercados.',
      'Optar por materiales decorativos sustentables, telas, aserrín o plantas cultivadas en vivero.',
      'Difundir el impacto ecológico de la extracción en redes sociales y círculos familiares.',
      'Proteger la capa de hojarasca y musgo en los recorridos de observación.'
    ]
  },
  {
    id: 'perdida-de-glaciares',
    titulo: 'Pérdida Definitiva de Glaciares Andinos',
    subtitulo: 'El calentamiento global cobró la extinción del emblemático glaciar de Ayoloco.',
    fotoId: 'glaciar-ayoloco',
    descripcion: 'El Iztaccíhuatl albergaba masas de hielo milenario que regulaban los arroyos de deshielo en el altiplano. El glaciar de Ayoloco fue declarado oficialmente extinto, dejando una placa de luto que advierte sobre la urgencia climática.',
    comoMitigarlo: [
      'Conocer la historia del glaciar y compartirla como testimonio vivo del impacto climático.',
      'Reducir nuestra huella de carbono personal y promover energías limpias en nuestras comunidades.',
      'Proteger los humedales y arroyos de deshielo restantes frente a contaminación y desvío.',
      'Visitar y estudiar las cumbres con respeto reverencial a su memoria geológica.'
    ],
    enlaceLugarId: 'glaciar-ayoloco',
    enlaceTexto: 'Ver ficha del Glaciar de Ayoloco en el mapa 3D'
  },
  {
    id: 'especies-en-riesgo',
    titulo: 'Especies Endémicas en Riesgo Crítico',
    subtitulo: 'El zacatonal del volcán es el único hogar del conejo de los volcanes (teporingo).',
    fotoId: 'teporingo',
    descripcion: 'La fragmentación del hábitat, los perros ferales sin control y los incendios de zacatón han acorralado al teporingo (Romerolagus diazi), un fósil viviente que solo subsiste en las laderas altas del Eje Neovolcánico.',
    comoMitigarlo: [
      'No ingresar con mascotas domésticas a las zonas núcleo del parque nacional.',
      'Proteger los pastizales alpinos (Festuca y Muhlenbergia) sin pisotear fuera de senderos.',
      'Apoyar el monitoreo comunitario y la investigación biológica no invasiva.',
      'Respetar el silencio natural para no perturbar áreas de anidación y madrigueras.'
    ],
    enlaceLugarId: 'habitat-teporingo',
    enlaceTexto: 'Ver ficha del Hábitat del Teporingo en el mapa 3D'
  }
];
