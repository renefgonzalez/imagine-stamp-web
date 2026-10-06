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
    titulo: 'Incendios Forestales por Descuido Humano',
    subtitulo: 'Más del 95% de los incendios en la sierra son originados por fogatas mal apagadas o quema agrícola descontrolada.',
    fotoId: 'fuego-en-la-montana',
    descripcion: 'Las laderas del Popocatépetl y el Iztaccíhuatl sufren cada temporada de estiaje siniestros que arrasan con cientos de hectáreas de zacatonal alpino y bosque de pino hartwegii. El efecto lupa producido por botellas de vidrio y latas expuestas al sol es otro de los detonantes silenciosos más destructivos.',
    comoMitigarlo: [
      'Prohibición total de fogatas en áreas no habilitadas y en toda la cota superior a los 3,500 m.',
      'Asegurar el apagado total de cualquier braza con tierra y abundante agua hasta comprobar que esté fría.',
      'Reportar columnas de humo de inmediato a los centros de control del Parque Nacional y brigadas comunitarias.',
      'No arrojar colillas de cigarro ni fósforos desde vehículos o senderos.'
    ],
    enlaceLugarId: 'bosque-hartwegii',
    enlaceTexto: 'Conocer el Bosque de Pino de Altura en el mapa 3D'
  },
  {
    id: 'basura-en-parajes',
    titulo: 'Contaminación y Acumulación de Residuos',
    subtitulo: 'Plásticos, latas y restos inorgánicos tardan siglos en degradarse y amenazan a la fauna silvestre.',
    fotoId: 'no-dejes-basura',
    descripcion: 'Parajes emblemáticos como Paso de Cortés, La Joya y las cañadas de acceso reciben miles de visitantes semanales. Lamentablemente, toneladas de desechos plásticos, botellas, cubrebocas y envolturas son abandonadas en barrancas y arroyos, contaminando los veneros de agua y asfixiando a la fauna nativa como el teporingo y aves rapaces.',
    comoMitigarlo: [
      'Principio estricto de No Deje Rastro: todo residuo que subes a la montaña debe regresar contigo hasta tu ciudad.',
      'Llevar siempre una bolsa reutilizable para recolectar desechos propios y basura encontrada en el sendero.',
      'Evitar plásticos de un solo uso en tus expediciones; prefiere cantimploras y recipientes lavables.',
      'Participar en nuestras faenas periódicas de saneamiento y limpieza comunitaria.'
    ],
    enlaceLugarId: 'paso-de-cortes',
    enlaceTexto: 'Ver Paso de Cortés en el mapa 3D'
  },
  {
    id: 'tala-clandestina',
    titulo: 'Tala Ilegal y Daño a la Masa Forestal',
    subtitulo: 'La pérdida de masa forestal compromete la infiltración de agua hacia los mantos freáticos del Valle de México y Puebla.',
    fotoId: 'no-cortes-arboles',
    descripcion: 'La tala ilegal, el descortezado vandálico y la fragmentación del dosel forestal debilitan a los oyameles y pinos ancestrales ante plagas como el escarabajo descortezador. Cada árbol maduro derribado reduce drásticamente la capacidad de recarga de los acuíferos que abastecen a millones de personas.',
    comoMitigarlo: [
      'Denunciar ante PROFEPA y CONANP actividades sospechosas de tala, motosierras o transporte ilegal de madera.',
      'Apoyar los programas de reforestación comunitaria con plantas nativas producidas en viveros locales certificados.',
      'No comprar madera ni carbón vegetal de procedencia clandestina o sin sello forestal sustentable.',
      'Respetar las cortezas de los árboles: no tallar nombres, fechas ni extraer resina de forma destructiva.'
    ],
    enlaceLugarId: 'bosque-hartwegii',
    enlaceTexto: 'Explorar el área forestal en el mapa 3D'
  },
  {
    id: 'extraccion-musgo-tierra',
    titulo: 'Saqueo de Musgo, Hojarasca y Tierra de Monte',
    subtitulo: 'La esponja natural que retiene la humedad de la cuenca es despojada para fines ornamentales comerciales.',
    fotoId: 'arbol-ancestral-dosel',
    descripcion: 'El musgo y la tierra de hoja tardan décadas en formarse sobre la roca volcánica. Su extracción masiva para adornos navideños o jardinería urbana deja el suelo desnudo, provocando erosión hídrica severa, deslaves y la muerte de plántulas que no logran germinar.',
    comoMitigarlo: [
      'No comprar musgo silvestre, heno ni orquídeas extraídas de áreas naturales protegidas.',
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
  fotoId: string;
  titulo: string;
  descripcion: string;
  impacto: string;
  conductaCorrecta: string;
  categoria: 'fuego' | 'basura' | 'arbolado';
}

export const EVIDENCIAS_MALAS_PRACTICAS: FotoMalaPractica[] = [
  {
    id: 'efecto-lupa-fuego',
    fotoId: 'efecto-lupa-fuego',
    titulo: 'Efecto Lupa por Botellas de Plástico',
    descripcion: 'Registro de botella plástica deformada abandonada entre hojarasca y ramas secas en el piso forestal.',
    impacto: 'La curvatura del plástico y restos de líquido concentran los rayos solares como lupas, detonando llamas en pastos secos.',
    conductaCorrecta: 'Regresar con el 100% de botellas y envases. Si encuentras envases abandonados, recógelos en tu mochila.',
    categoria: 'fuego'
  },
  {
    id: 'fuego-en-la-montana',
    fotoId: 'fuego-en-la-montana',
    titulo: 'Fuego Activo en Pastizal y Bosque',
    descripcion: 'Frente de fuego forestal consumiendo zacatonal y avanzando descontrolado hacia el arbolado maduro.',
    impacto: 'Destrucción inmediata de madrigueras de teporingo, calcinación de renuevos y pérdida del manto orgánico del suelo.',
    conductaCorrecta: 'Cero fogatas en áreas naturales protegidas. Si detectas humo o fuego, llama al 911 o CONAFOR de inmediato.',
    categoria: 'fuego'
  },
  {
    id: 'bosque-quemado-incendio',
    fotoId: 'bosque-quemado-incendio',
    titulo: 'Paisaje Calcinado frente al Iztaccíhuatl',
    descripcion: 'Laderas totalmente carbonizadas tras el paso de un incendio con las crestas nevadas al fondo.',
    impacto: 'El suelo calcinado pierde su capacidad de retener agua y queda expuesto a deslaves masivos con las lluvias.',
    conductaCorrecta: 'Participar en jornadas de reforestación comunitaria con plantas nativas y respetar las zonas en recuperación.',
    categoria: 'fuego'
  },
  {
    id: 'desperdicios-acumulados',
    fotoId: 'desperdicios-acumulados',
    titulo: 'Acumulación de Desperdicios en Cañadas',
    descripcion: 'Bolsas plásticas, botellas y desechos inorgánicos arrojados a los costados de brechas y miradores.',
    impacto: 'Los lixiviados y microplásticos se filtran con el agua de lluvia hacia los manantiales que abastecen a las comunidades.',
    conductaCorrecta: 'Llevar siempre bolsas resistentes en tu mochila y cargar tus propios residuos hasta contenedores urbanos.',
    categoria: 'basura'
  },
  {
    id: 'no-dejes-basura',
    fotoId: 'no-dejes-basura',
    titulo: 'Calzado, Ropa y Latas Abandonadas',
    descripcion: 'Prendas viejas, calzado inservible y latas oxidadas abandonadas en barrancas de la alta montaña.',
    impacto: 'Tardan siglos en degradarse y liberan tintes químicos y óxidos que alteran la acidez del suelo forestal.',
    conductaCorrecta: 'Usa equipo durable y jamás dejes calzado, ropa o empaques en la sierra. La montaña no es basurero.',
    categoria: 'basura'
  },
  {
    id: 'no-dejes-desperdicios',
    fotoId: 'no-dejes-desperdicios',
    titulo: 'Desperdicios que Amenazan a la Fauna',
    descripcion: 'Envolturas de golosinas y restos de comida procesada esparcidos en zonas de paso y descanso de excursionistas.',
    impacto: 'La fauna silvestre ingiere plásticos atraída por el olor a comida, sufriendo asfixia y obstrucciones intestinales fatales.',
    conductaCorrecta: 'Empacar alimentos en recipientes herméticos reutilizables y no alimentar a ninguna especie animal.',
    categoria: 'basura'
  },
  {
    id: 'cultura-limpieza-cartel',
    fotoId: 'cultura-limpieza-cartel',
    titulo: 'Campaña: Por una Cultura de Limpieza',
    descripcion: 'Señalización educativa comunitaria: "YO colaboro llevándome mis desechos, ¿Y tú?" colocada en puntos clave.',
    impacto: 'La falta de cultura de limpieza satura los parques nacionales; la señalización busca generar conciencia individual.',
    conductaCorrecta: 'Conviértete en embajador del bosque: educa con el ejemplo y comparte las reglas con tus compañeros de ruta.',
    categoria: 'basura'
  },
  {
    id: 'no-cortes-arboles',
    fotoId: 'no-cortes-arboles',
    titulo: 'Tala y Quema de Árboles Vivos',
    descripcion: 'Troncos de coníferas mutilados a machetazos o con quemaduras en la base hechas intencionalmente.',
    impacto: 'Se interrumpe el flujo de savia, debilitando al árbol hasta provocar su colapso y dejándolo vulnerable a plagas.',
    conductaCorrecta: 'Jamás cortes ramas ni troncos verdes para leña. En la montaña sólo se permite usar ramas secas ya caídas en el suelo.',
    categoria: 'arbolado'
  },
  {
    id: 'no-cortes-corteza-resina',
    fotoId: 'no-cortes-corteza-resina',
    titulo: 'Corte de Corteza para Extraer Resina',
    descripcion: 'Heridas profundas infringidas en la corteza de pinos maduros para forzar la salida de resina.',
    impacto: 'La corteza es la piel protectora del árbol; al rasparla queda expuesto al ataque letal de hongos y descortezadores.',
    conductaCorrecta: 'Respeta la integridad de cada ejemplar vivo. No dañes su corteza bajo ninguna circunstancia.',
    categoria: 'arbolado'
  },
  {
    id: 'no-marques-arboles',
    fotoId: 'no-marques-arboles',
    titulo: 'Pintura y Graffitis en Troncos',
    descripcion: 'Pintura al esmalte con flechas, nombres y signos grabados directamente sobre corteza viva.',
    impacto: 'Los solventes químicos de la pintura penetran los tejidos del árbol y contaminan visualmente el entorno natural.',
    conductaCorrecta: 'Navega con mapas cartográficos o GPS. No pintes ni grabes marcas en rocas ni en árboles del parque.',
    categoria: 'arbolado'
  },
  {
    id: 'evitemos-malas-practicas',
    fotoId: 'evitemos-malas-practicas',
    titulo: 'Evitemos Malas Prácticas en la Montaña',
    descripcion: 'Llamado a la reflexión sobre el impacto acumulativo de miles de visitantes irresponsables cada año.',
    impacto: 'Las pequeñas acciones destructivas repetidas por miles de personas terminan quebrando el equilibrio de la sierra.',
    conductaCorrecta: 'Practica montañismo ético y con propósito de custodia. Deja cada lugar mejor de como lo encontraste.',
    categoria: 'arbolado'
  }
];
