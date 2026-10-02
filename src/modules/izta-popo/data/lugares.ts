import { CategoriaId } from './categorias';

export interface LugarFoto {
  id: string; // nombre base del archivo sin extensión
  alt: string;
  megapixeles: number;
  esDeepZoom?: boolean;
}

export interface LugarVideo {
  id: string; // nombre base del archivo sin extensión
  resolucion: '4K' | '1080p';
  pesoOriginalGB: number;
}

export interface Lugar {
  id: string;
  nombre: string;
  categoria: CategoriaId;
  coords: [number, number]; // [lng, lat]
  altitud: number; // metros
  sensible?: boolean;
  mejorEpoca: string; // Mejor época para observar (floración, fauna o cielo despejado)
  estadoConservacion: string; // Estado de conservación ambiental (ej. 'Bien conservado', 'Presión por basura', etc.)
  resumen: string;
  relato: string[]; // 3 párrafos de testimonio y divulgación
  fechaRegistro: string;
  fotos: LugarFoto[];
  video?: LugarVideo;
}

export const LUGARES: Lugar[] = [
  {
    id: 'paso-de-cortes',
    nombre: 'Paso de Cortés',
    categoria: 'curiosidad',
    coords: [-98.6430, 19.0888],
    altitud: 3680,
    mejorEpoca: 'Noviembre a marzo (cielos despejados y heladas)',
    estadoConservacion: 'Presión por basura y tránsito vehicular',
    resumen: 'El mítico collado a 3,680 metros de altitud que separa los dos colosos del Valle de México, transitado históricamente desde 1519.',
    relato: [
      'Llegar al Paso de Cortés antes de las seis de la mañana es experimentar el silencio más sobrecogedor del altiplano central. El viento helado corta la cara mientras el cielo pasa de un añil profundo a tonos cobrizos sobre el horizonte de Puebla. Estar parado en esta brecha es sentir el peso de siglos: aquí cruzaron los emisarios de Cortés contemplando por primera vez la cuenca de Tenochtitlan custodiada por dos gigantes sagrados.',
      'A la izquierda, la silueta dormida de la Iztaccíhuatl parece esculpida en alabastro bajo la primera luz. A la derecha, el cono majestuoso del Popocatépetl se yergue con una presencia casi telúrica, emitiendo su respiración eterna de vapor blanco hacia la estratosfera. El collado funciona hoy como el corazón logístico del parque nacional, pero basta caminar trescientos metros lejos del refugio para que la civilización desaparezca por completo.',
      'Recomiendo siempre en nuestras jornadas de observación pasar al menos media hora aquí aclimatando el cuerpo, sintiendo cómo el oxígeno escaso cambia el ritmo del pulso. El aroma a resina de pino hartwegii y tierra volcánica mineral queda grabado para siempre en la memoria de quien pisa esta encrucijada geológica.',
    ],
    fechaRegistro: '12 de enero de 2026',
    fotos: [
      { id: 'paso-de-cortes', alt: 'Paso de Cortés con vista al Popocatépetl', megapixeles: 3.1 },
      { id: 'vista-noreste', alt: 'Panorámica de los volcanes desde el collado', megapixeles: 15.9 },
    ],
  },
  {
    id: 'la-joya',
    nombre: 'La Joya',
    categoria: 'ecosistema',
    coords: [-98.6480, 19.1370],
    altitud: 3950,
    mejorEpoca: 'Octubre a abril (temporada seca y observación astronómica)',
    estadoConservacion: 'Requiere jornadas periódicas de limpieza',
    resumen: 'El legendario paraje a casi 4,000 metros de altura, transición ecológica hacia las morrenas y crestas de la Mujer Dormida.',
    relato: [
      'La Joya es el umbral donde el bosque de pino se rinde ante la estepa alpina. Los últimos ejemplares retorcidos de Pinus hartwegii parecen centinelas que desafían la gravedad sobre la morrena volcánica. Aquí se reúnen observadores, botánicos y voluntarios que sienten el aire más puro y cortante que se puede encontrar a dos horas de la capital.',
      'Cuando cae la noche en este campamento base, la Vía Láctea se extiende de un extremo a otro del cielo como una cascada fosforescente. No hay contaminación lumínica que opaque los billones de estrellas que enmarcan las paredes de roca de Los Portillos. Dormir aquí implica escuchar el silbido incesante del viento andino filtrándose entre las carpas.',
      'Desde este punto nacen los esfuerzos colectivos de conservación. Cada grupo que asciende en silencio con sus lámparas frontales debe recordar el principio de No Deje Rastro. La Joya es camaradería, respeto reverencial y el inicio de la verdadera altitud.',
    ],
    fechaRegistro: '28 de noviembre de 2025',
    fotos: [
      { id: 'la-joya', alt: 'Campamento base La Joya y morrena volcánica', megapixeles: 12.2 },
      { id: 'hero-volcanes', alt: 'Perspectiva del macizo del Iztaccíhuatl', megapixeles: 18.0 },
    ],
  },
  {
    id: 'cumbre-izta',
    nombre: 'El Pecho · Cumbre Iztaccíhuatl',
    categoria: 'curiosidad',
    coords: [-98.6422, 19.1789],
    altitud: 5230,
    mejorEpoca: 'Noviembre a marzo (condición invernal estable)',
    estadoConservacion: 'Frágil por erosión y retroceso nival',
    resumen: 'La tercera cumbre más alta de México a 5,230 metros. Un santuario de roca viva, viento polar y horizontes infinitos.',
    relato: [
      'Alcanzar El Pecho requiere algo más que resistencia física: exige serenidad mental en cada paso sobre los arenales congelados y las crestas expuestas de la Arista del Sol. Cruzar la barriga y encarar la última rampa hacia los 5,230 metros es entrar en un territorio donde la atmósfera se adelgaza tanto que cada bocanada de aire se saborea como un triunfo vital.',
      'La vista desde esta cima desafía cualquier descripción terrenal. Hacia el sur, el Popocatépetl parece flotar sobre un mar de nubes bajas como una isla volcánica; hacia el oriente el Pico de Orizaba y la Malinche perforan el horizonte; y hacia el poniente la mancha urbana del altiplano queda reducida a un espejismo lejano y silencioso.',
      'En la cumbre el viento no perdona, pero el calor humano del grupo compartiendo un trago de té caliente de canela compensa cada hora de marcha nocturna. Tocar la cruz cimera es fundirse con el espíritu de una montaña venerada desde tiempos inmemoriales como la Señora Blanca.',
    ],
    fechaRegistro: '18 de febrero de 2026',
    fotos: [
      { id: 'cumbre-izta', alt: 'Aristas rocosas y cumbre de El Pecho', megapixeles: 7.5 },
      { id: 'vista-noreste', alt: 'Mar de nubes desde la cumbre', megapixeles: 15.9 },
    ],
    video: {
      id: 'video-volcanes-avion',
      resolucion: '1080p',
      pesoOriginalGB: 0.05,
    },
  },
  {
    id: 'glaciar-ayoloco',
    nombre: 'Glaciar de Ayoloco',
    categoria: 'agua',
    coords: [-98.6400, 19.1700],
    altitud: 4900,
    mejorEpoca: 'Diciembre a marzo',
    estadoConservacion: 'Glaciar extinto (santuario de memoria climática)',
    resumen: 'El emblemático glaciar declarado oficialmente extinto en 2018; hoy santuario de memoria climática y origen de arroyos subterráneos.',
    relato: [
      'Caminar sobre el lecho que ocupó el glaciar de Ayoloco durante milenios estremece el corazón de cualquier amante de la naturaleza. Recuerdo en mis primeras subidas cómo el hielo azul crujía bajo las botas y los seracs brillaban como zafiros al mediodía. Hoy, la roca pulida por el peso glacial expone las heridas directas del calentamiento global.',
      'En 2021 acompañé la colocación de la placa conmemorativa del Instituto de Geofísica de la UNAM que reza: "A las generaciones futuras: aquí existió el glaciar de Ayoloco... sabemos que hoy se extinguen porque no supimos cuidar su hogar". Tocar esa placa de bronce a casi cinco mil metros es un compromiso moral ineludible con la preservación del parque.',
      'A pesar de la pérdida de la masa helada principal, de las grietas profundas continúan manando hilos de agua glacial purísima que alimentan los mantos freáticos de la comarca. Ayoloco nos recuerda la fragilidad de nuestros ecosistemas de altura y nos exige caminar con reverencia absoluta.',
    ],
    fechaRegistro: '5 de diciembre de 2025',
    fotos: [
      { id: 'glaciar-ayoloco', alt: 'Vestigios del glaciar de Ayoloco y placa memorial', megapixeles: 5.9 },
      { id: 'hero-volcanes', alt: 'Ladera oeste del Iztaccíhuatl', megapixeles: 18.0 },
    ],
  },
  {
    id: 'bosque-hartwegii',
    nombre: 'Bosque de Pino de Altura',
    categoria: 'ecosistema',
    coords: [-98.6550, 19.1050],
    altitud: 3750,
    mejorEpoca: 'Todo el año (floración de sotobosque en lluvias)',
    estadoConservacion: 'Amenazado por incendios forestales',
    resumen: 'El reino del Pinus hartwegii, la especie de conífera que resiste a mayor altitud en todo el planeta Tierra.',
    relato: [
      'Pocos seres vivos en el mundo exhiben la tenacidad del Pinus hartwegii. A 3,750 metros sobre el nivel del mar, donde la radiación ultravioleta calcina y las heladas nocturnas descienden a quince grados bajo cero, estos árboles centenarios desarrollan cortezas gruesas y resinosas con patrones hexagonales que parecen armaduras volcánicas.',
      'Caminar bajo su dosel en las mañanas nubladas es adentrarse en un bosque encantado. La niebla se cuela entre las copas dispersas y el suelo está cubierto por un mullido tapete de acículas doradas que amortiguan cada pisada. El aire huele a trementina pura y ozono después de las tormentas vespertinas.',
      'Esta zona alberga ejemplares de más de trescientos años que han resistido erupciones de ceniza volcánica, incendios forestales y temporales de nieve ártica. Observar las ramas dobladas por el viento pero nunca quebradas es una lección silenciosa de resiliencia biológica.',
    ],
    fechaRegistro: '14 de enero de 2026',
    fotos: [
      { id: 'bosque-hartwegii', alt: 'Ejemplar centenario de Pinus hartwegii en altitud extrema (40 MP)', megapixeles: 40.3, esDeepZoom: true },
      { id: 'oyamel', alt: 'Transición entre coníferas', megapixeles: 15.9 },
    ],
  },
  {
    id: 'zacatonal',
    nombre: 'Pradera Alpina (Zacatonal)',
    categoria: 'ecosistema',
    coords: [-98.6380, 19.1250],
    altitud: 4050,
    mejorEpoca: 'Octubre a febrero (espigas doradas)',
    estadoConservacion: 'Vulnerable a quemas no autorizadas y pastoreo',
    resumen: 'El inmenso mar de pastizales dorados de Festuca tolucensis que retiene millones de litros de agua en las alturas.',
    relato: [
      'Al superar la cota de los 3,900 metros los árboles desaparecen bruscamente y se abre ante los ojos un paisaje que parece arrancado de los páramos andinos o del Tíbet: el zacatonal alpino. Manchas continuas de Festuca y Muhlenbergia se extienden como un manto dorado ondulante que baila con las ráfagas del viento.',
      'Este ecosistema es el verdadero riñón hídrico del centro de México. Cada mata tupida de pasto atrapa la humedad de la neblina condensándola gota a gota en sus raíces esponjosas, impidiendo la erosión del suelo volcánico suelto y alimentando los acuíferos que dan de beber a millones de personas valle abajo.',
      'Caminar por el zacatonal al atardecer, cuando la luz oblicua enciende las espigas doradas contra la silueta de los volcanes, es una experiencia estética de paz infinita. Entre los pastos se ocultan madrigueras de fauna diminuta que encuentran aquí su último refugio.',
    ],
    fechaRegistro: '22 de febrero de 2026',
    fotos: [
      { id: 'la-joya', alt: 'Pastizales alpinos frente al macizo volcánico', megapixeles: 12.2 },
      { id: 'flora-eryngium', alt: 'Cardo azul creciendo entre el zacate alpino', megapixeles: 46.5, esDeepZoom: true },
    ],
  },
  {
    id: 'teporingo',
    nombre: 'Hábitat del Teporingo',
    categoria: 'fauna',
    coords: [-98.6600, 19.0950],
    altitud: 3600,
    mejorEpoca: 'Todo el año (avistamiento cauto al amanecer)',
    estadoConservacion: 'En peligro crítico de extinción (NOM-059)',
    resumen: 'El hogar protegido del Romerolagus diazi o conejo de los volcanes, fósil viviente endémico exclusivo de esta cordillera.',
    relato: [
      'El teporingo o zacatuche es una joya evolutiva viviente. A diferencia de los conejos comunes, posee orejas pequeñas y redondeadas, carece de cola visible y emite sonidos agudos de advertencia muy parecidos a los de las pikas de alta montaña. Su existencia depende exclusivamente de la salud de las matas densas de zacatón.',
      'Rastrear sus huellas diminutas en el rocío matinal exige el sigilo de un felino. Es un animal tímido que huye ante el menor ruido humano, por lo que nuestras jornadas de observación avanzan en silencio absoluto, guiadas únicamente por las heces redondeadas y los pequeños túneles excavados bajo la base de las gramíneas.',
      'Ver asomar su hocico tembloroso entre dos matas de pasto dorado mientras el Popocatépetl ruge a la distancia es una bendición de la naturaleza mexicana. Proteger este corredor biológico es la razón primordial por la que promovemos la conservación activa de la montaña.',
    ],
    fechaRegistro: '19 de enero de 2026',
    fotos: [
      { id: 'teporingo', alt: 'Ejemplar de teporingo (Romerolagus diazi) en su hábitat', megapixeles: 10.2 },
      { id: 'bosque-hartwegii', alt: 'Sotobosque donde se refugia la especie', megapixeles: 40.3, esDeepZoom: true },
    ],
  },
  {
    id: 'nahualac',
    nombre: 'Nahualac (Laguna Sagrada)',
    categoria: 'arqueologia',
    coords: [-98.7100, 19.1800],
    altitud: 3870,
    sensible: true,
    mejorEpoca: 'Octubre a mayo (temporada seca)',
    estadoConservacion: 'Sitio arqueológico sagrado protegido',
    resumen: 'Enigmático adoratorio prehispánico sumergido que representaba el Teteocan o la creación cosmogónica del universo náhuatl.',
    relato: [
      'Llegar a la cuenca de Nahualac es adentrarse en la mente ritual de nuestros antepasados. A casi 3,900 metros de altitud, en un cráter natural rodeado de peñascos sagrados, yace una estructura cuadrangular de piedra labrada sumergida en el centro de un estanque estacional de deshielo.',
      'Los antiguos sacerdotes tlacuilos recrearon aquí un microcosmos acuático: el estanque simbolizaba el mar primordial (Cipactli), y la estructura central emergía de las aguas al igual que la Tierra surgió del caos originario. En sus bordes se han documentado fragmentos de cerámica polícroma, obsidianas ceremoniales y ofrendas a Tláloc.',
      'Debido a su valor incalculable y a los riesgos de expolio, no publicamos coordenadas milimétricas. Contemplar este paraje implica solicitar permiso al espíritu de la montaña y valorar las ruinas sin remover una sola piedra milenaria.',
    ],
    fechaRegistro: '10 de noviembre de 2025',
    fotos: [
      { id: 'vista-noreste', alt: 'Cuencas altas de adoración ritual (Foto de referencia)', megapixeles: 15.9 },
      { id: 'la-joya', alt: 'Paisaje montano de referencia', megapixeles: 12.2 },
    ],
  },
  {
    id: 'tenenepanco',
    nombre: 'Tenenepanco',
    categoria: 'arqueologia',
    coords: [-98.6450, 19.0450],
    altitud: 3900,
    sensible: true,
    mejorEpoca: 'Zona de exclusión CENAPRED (Solo observación a distancia)',
    estadoConservacion: 'Zona restringida por riesgo volcánico activo',
    resumen: 'Vestigios de antiguos altares en las faldas norteñas del Popocatépetl. Zona restringida por actividad volcánica activa.',
    relato: [
      'Tenenepanco es uno de los sitios arqueológicos de alta montaña más sobrecogedores y a la vez peligrosos de Mesoamérica. Emplazado sobre una cresta que mira directamente al cono humeante de Don Goyo, albergó ceremonias propiciatorias de lluvia donde se invocaba a los númenes del fuego y la tormenta.',
      'Las lajas volcánicas colocadas en terrazas demuestran la audacia de los constructores prehispánicos para soportar tempestades de nieve y ráfagas afiladas. En el suelo de ceniza gris aún es posible intuir la alineación astronómica con la salida del sol en los solsticios de invierno.',
      'Al encontrarse dentro del radio de exclusión de doce kilómetros dictado por el CENAPRED, este sitio permanece bajo estricto monitoreo científico y protección civil. Es un recordatorio vivo de que los volcanes nunca fueron domesticados por el ser humano: nosotros somos solo sus huéspedes temporales.',
    ],
    fechaRegistro: '3 de octubre de 2025',
    fotos: [
      { id: 'tenenepanco', alt: 'Laderas norte del Popocatépetl y zona de Tenenepanco', megapixeles: 15.9 },
      { id: 'mirador-popo', alt: 'Cráter activo sobre el horizonte ceremonial', megapixeles: 20.2 },
    ],
  },
  {
    id: 'arroyo-deshielo',
    nombre: 'Arroyo de Deshielo',
    categoria: 'agua',
    coords: [-98.6700, 19.1550],
    altitud: 3800,
    mejorEpoca: 'Julio a octubre (temporada de lluvias y deshielo)',
    estadoConservacion: 'Caudal puro pero vulnerable a residuos',
    resumen: 'Caudales cristalinos de aguas gélidas que descienden entre helechos y rocas de basalto alimentando los valles.',
    relato: [
      'El sonido del agua corriente a casi 4,000 metros de altitud tiene una cadencia musical que revitaliza al caminante más fatigado. Este arroyo recoge las filtraciones del manto nival del Iztaccíhuatl y se abre paso entre cañadas de roca volcánica oscura tapizadas de musgos esmeralda.',
      'Beber agua directamente de este manantial con la mano acopada es una revelación sensorial: el agua está a tres grados centígrados, pura, densa en minerales y con una frescura que no existe en ningún manantial de llanura. En sus bordes proliferan colonias de helechos alpinos y florecillas moradas.',
      'Este rincón es el sitio predilecto de nuestras jornadas para reflexionar sobre la importancia del agua. Sentarse sobre las lajas secas escuchando el murmullo del torrente mientras las aves planean en el cielo despejado restaura la conexión íntima con la naturaleza.',
    ],
    fechaRegistro: '15 de agosto de 2025',
    fotos: [
      { id: 'oyamel', alt: 'Ambiente húmedo de cañada y arroyo montano', megapixeles: 15.9 },
      { id: 'glaciar-ayoloco', alt: 'Nieves superiores que alimentan el arroyo', megapixeles: 5.9 },
    ],
  },
  {
    id: 'oyamel',
    nombre: 'Bosque de Oyamel Sagrado',
    categoria: 'ecosistema',
    coords: [-98.7000, 19.1200],
    altitud: 3200,
    mejorEpoca: 'Todo el año (refugio de mariposa monarca en invierno)',
    estadoConservacion: 'Presión por tala ilegal y extracción de musgo',
    resumen: 'El bosque nuboso y húmedo de Abies religiosa, catedral vegetal de columnas de 50 metros y niebla perpetua.',
    relato: [
      'Entrar al bosque de oyamel es traspasar el umbral de una catedral verde de escala titánica. Los fustes rectos de Abies religiosa se elevan como columnas góticas de hasta cincuenta metros de altura, bloqueando los rayos solares y creando un microclima umbrío, fresco y permanentemente húmedo.',
      'El sotobosque es un edén de musgos colgantes, líquenes plateados, hongos silvestres y alfombras de tréboles alpinos. Al caminar se respira una fragancia balsámica profunda que descongestiona los pulmones al instante. La niebla entra a oleadas desde el valle de Amecameca, difuminando los contornos en una pintura viva.',
      'En invierno, estas copas tupidas son el santuario donde hibernan colonias dispersas de mariposa monarca y parvadas de jilgueros de montaña. Es el piso ecológico más exuberante del parque y una prioridad máxima para programas de reforestación nativa.',
    ],
    fechaRegistro: '8 de enero de 2026',
    fotos: [
      { id: 'oyamel', alt: 'Ejemplar centenario de Abies religiosa (Oyamel sagrado)', megapixeles: 15.9 },
      { id: 'bosque-hartwegii', alt: 'Transición hacia el pinar de altura', megapixeles: 40.3, esDeepZoom: true },
    ],
  },
  {
    id: 'mirador-popo',
    nombre: 'Mirador del Popocatépetl',
    categoria: 'curiosidad',
    coords: [-98.6350, 19.0750],
    altitud: 3800,
    mejorEpoca: 'Octubre a marzo (madrugadas despejadas)',
    estadoConservacion: 'Monitoreo constante CENAPRED',
    resumen: 'El palco de observación más dramático hacia el cráter activo y las fumarolas de vapor y ceniza de Don Goyo.',
    relato: [
      'No hay espectáculo volcánico en el continente americano que iguale el amanecer desde este mirador. Ubicado en una terraza segura sobre el collado, permite contemplar la colosal silueta cónica del Popocatépetl alzándose sobre el vacío mientras el cielo se tiñe de púrpura, naranja y dorado incandescente.',
      'Ver elevarse la fumarola blanca desde el cráter a 5,400 metros de altura, ascendiendo en espirales perfectas hacia la estratosfera, hace temblar las piernas de asombro. En noches frías, el resplandor rojizo del domo de lava en el fondo del cráter tiñe la nube de ceniza con un fuego espectral fascinante.',
      'Equipados con telescopios terrestres y teleobjetivos de largo alcance, aquí documentamos la geodinámica del volcán respetando escrupulosamente los límites de seguridad dictados por las autoridades. Es la estampa definitiva del México indómito.',
    ],
    fechaRegistro: '25 de enero de 2026',
    fotos: [
      { id: 'mirador-popo', alt: 'Fumarola del Popocatépetl al amanecer', megapixeles: 20.2 },
      { id: 'paso-de-cortes', alt: 'Terraza de observación del coloso', megapixeles: 3.1 },
    ],
    video: {
      id: 'video-popo-4k-noaa',
      resolucion: '4K',
      pesoOriginalGB: 0.26,
    },
  },
  {
    id: 'sacromonte',
    nombre: 'Sacromonte de Amecameca',
    categoria: 'curiosidad',
    coords: [-98.7668, 19.1236],
    altitud: 2500,
    mejorEpoca: 'Todo el año (atardeceres despejados)',
    estadoConservacion: 'Patrimonio histórico y biocultural protegido',
    resumen: 'Histórico santuario colonial levantado sobre un teocalli prehispánico con el mejor mirador panorámico de ambos volcanes.',
    relato: [
      'El cerro del Sacromonte es la puerta histórica de los viajeros que buscan la alta montaña. Coronando una colina arbolada en las orillas de Amecameca, este santuario edificado sobre la antigua cueva del santo Fray Martín de Valencia fue en su origen un centro ceremonial consagrado a Tezcatlipoca.',
      'Subir la calzada empedrada flanqueada por cruces centenarias y cedros añosos es un paseo apacible de aclimatación. Al llegar al mirador superior, la recompensa es mayúscula: los dos volcanes se descubren en toda su magnitud, enmarcados por las torres coloniales del convento franciscano.',
      'Aquí solemos reunir a voluntarios y jóvenes la tarde previa a las jornadas de reforestación para repasar la cartografía y contemplar cómo el sol poniente baña las nieves del Izta con una pátina dorada. Es historia viva entretejida con geografía sagrada.',
    ],
    fechaRegistro: '12 de febrero de 2026',
    fotos: [
      { id: 'sacromonte', alt: 'Santuario del Sacromonte de Amecameca y vista a los volcanes', megapixeles: 24.0 },
      { id: 'vista-noreste', alt: 'Valle de Amecameca y cordillera volcánica', megapixeles: 15.9 },
    ],
  },
  {
    id: 'aguila-real',
    nombre: 'Avistamiento de Aves Rapaces',
    categoria: 'fauna',
    coords: [-98.6250, 19.1450],
    altitud: 4000,
    mejorEpoca: 'Noviembre a marzo (térmicas de mediodía)',
    estadoConservacion: 'Especies protegidas por la NOM-059',
    resumen: 'Térmicas de aire caliente donde planean halcones peregrinos, aguilillas cola roja y el águila real sobre los cantiles.',
    relato: [
      'A mediodía, cuando el sol calienta los farallones de roca volcánica, se generan corrientes térmicas ascendentes que son aprovechadas por los señores del viento. En este anfiteatro natural a 4,000 metros es habitual presenciar el planeo majestuoso de la aguililla cola roja (Buteo jamaicensis) y del halcón peregrino.',
      'Permanecer en silencio recostado contra una roca mientras una rapaz describe círculos concéntricos a escasos treinta metros por encima de nuestras cabezas es una comunión inolvidable. Su silueta recortada contra el azul profundo de la atmósfera de montaña evoca el símbolo patrio de nuestra tierra.',
      'Llevar prismáticos de alta resolución permite observar los giros acrobáticos con los que cazan roedores en el zacatonal. Este paraje confirma que las alturas volcánicas no son un desierto yermo, sino un ecosistema vibrante de vida salvaje.',
    ],
    fechaRegistro: '2 de marzo de 2026',
    fotos: [
      { id: 'vista-noreste', alt: 'Farallones y corrientes térmicas donde planean las rapaces', megapixeles: 15.9 },
      { id: 'la-joya', alt: 'Cantiles rocosos de alta montaña', megapixeles: 12.2 },
    ],
  },
];
