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
    fotoId: 'fuego-en-la-montana',
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
    fotoId: 'no-dejes-basura',
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
    fotoId: 'no-cortes-arboles',
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
    fotoId: 'glaciar-muro-hielo',
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


export interface FotoMalaPractica {
  id: string;
  titulo: string;
  impacto: string;
  categoria: 'fuego' | 'basura' | 'arbolado';
}

export const EVIDENCIAS_MALAS_PRACTICAS: FotoMalaPractica[] = [
  {
    id: 'efecto-lupa-fuego',
    titulo: 'Efecto Lupa por Botellas de Plástico',
    impacto: 'Botellas de plástico o vidrio abandonadas en la hojarasca concentran los rayos solares como lupas e inician incendios catastróficos.',
    categoria: 'fuego'
  },
  {
    id: 'fuego-en-la-montana',
    titulo: 'Fuego Activo en Pastizal y Bosque',
    impacto: 'Incendio forestal avanzando sobre el zacatonal y consumiendo renuevos de pino de alta montaña.',
    categoria: 'fuego'
  },
  {
    id: 'bosque-quemado-incendio',
    titulo: 'Paisaje Calcinado frente al Iztaccíhuatl',
    impacto: 'Hectáreas de pastizal alpino y arbolado arrasadas por el fuego, dejando el suelo desprotegido ante la erosión.',
    categoria: 'fuego'
  },
  {
    id: 'desperdicios-acumulados',
    titulo: 'Acumulación de Desperdicios en Cañadas',
    impacto: 'Cada año aumenta la presencia de desechos inorgánicos arrastrados hacia los veneros y cuencas de agua.',
    categoria: 'basura'
  },
  {
    id: 'no-dejes-basura',
    titulo: 'Calzado y Latas Abandonadas',
    impacto: 'Prendas, botas y metales abandonados en barrancas que tardan siglos en degradarse y contaminan la tierra.',
    categoria: 'basura'
  },
  {
    id: 'no-dejes-desperdicios',
    titulo: 'Desperdicios que Amenazan a la Fauna',
    impacto: 'La basura dejada por campistas es ingerida por conejos zacatuches, aves y mamíferos endémicos.',
    categoria: 'basura'
  },
  {
    id: 'no-cortes-arboles',
    titulo: 'Tala y Quema de Árboles Vivos',
    impacto: 'Árboles mutilados o quemados en la base para facilitar su caída, destruyendo el dosel protector del bosque.',
    categoria: 'arbolado'
  },
  {
    id: 'no-cortes-corteza-resina',
    titulo: 'Corte de Corteza para Extraer Resina',
    impacto: 'El desollamiento de corteza abre heridas profundas que infectan al árbol con plagas de escarabajos descortezadores.',
    categoria: 'arbolado'
  },
  {
    id: 'no-marques-arboles',
    titulo: 'Pintura y Marcas Vandálicas en Troncos',
    impacto: 'Flechas y pintura al esmalte sobre oyameles milenarios dañan el tejido vegetal y degradan el paisaje natural.',
    categoria: 'arbolado'
  },
  {
    id: 'cultura-limpieza-cartel',
    titulo: 'Campaña: Por una Cultura de Limpieza',
    impacto: '"YO colaboro llevándome mis desechos" — Llamado formal de concientización ciudadana en la montaña.',
    categoria: 'basura'
  },
  {
    id: 'evitemos-malas-practicas',
    titulo: 'Evitemos Malas Prácticas en la Montaña',
    impacto: 'La protección de la sierra empieza con el respeto individual de cada visitante que pisa el parque nacional.',
    categoria: 'arbolado'
  }
];
