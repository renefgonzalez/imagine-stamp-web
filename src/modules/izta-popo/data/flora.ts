export type PisoEcologicoId = 'oyamel' | 'pino-altura' | 'zacatonal' | 'alpino';

export interface PisoEcologico {
  id: PisoEcologicoId;
  nombre: string;
  subtitulo: string;
  altitudRango: [number, number]; // [min, max]
  altitudLabel: string;
  colorHex: string;
  descripcion: string;
  caracteristicas: string[];
}

export interface Planta {
  id: string;
  nombreComun: string;
  nombreCientifico: string;
  piso: PisoEcologicoId;
  altitudMin: number;
  altitudMax: number;
  floracion: string;
  datoCurioso: string;
  fotoId: string;
  esDeepZoom?: boolean;
  megapixeles?: number;
  lugares: string[]; // IDs de lugares donde se observa
}

export const PISOS_ECOLOGICOS: PisoEcologico[] = [
  {
    id: 'oyamel',
    nombre: 'Bosque de Oyamel',
    subtitulo: 'Catedral templada húmeda',
    altitudRango: [2800, 3500],
    altitudLabel: '2,800 – 3,500 m',
    colorHex: '#2A4D35',
    descripcion: 'Espesuras densas dominadas por Abies religiosa. Atmósfera permanentemente fresca, envuelta en brumas que condensan millones de litros de agua dulce.',
    caracteristicas: ['Árboles de hasta 50 m', 'Suelo cubierto de musgos y helechos', 'Refugio de mariposa monarca y aves canoras'],
  },
  {
    id: 'pino-altura',
    nombre: 'Bosque de Pino de Altura',
    subtitulo: 'Límite arbóreo planetario',
    altitudRango: [3500, 4000],
    altitudLabel: '3,500 – 4,000 m',
    colorHex: '#3F6B4F', // Pino
    descripcion: 'Hogar del Pinus hartwegii, la conífera que sobrevive a mayor altitud en todo el mundo. Resiste heladas extremas de -15 °C y suelos de ceniza pura.',
    caracteristicas: ['Corteza gruesa contra el fuego', 'Copas abiertas y acículas largas', 'Hábitat del conejo teporingo'],
  },
  {
    id: 'zacatonal',
    nombre: 'Pradera Alpina (Zacatonal)',
    subtitulo: 'Olas doradas de alta montaña',
    altitudRango: [3900, 4300],
    altitudLabel: '3,900 – 4,300 m',
    colorHex: '#B88A4A', // Ocre / Dorado
    descripcion: 'Páramo de gramíneas macollosas donde los árboles ya no pueden subsistir. El suelo retiene humedad como una esponja gigante.',
    caracteristicas: ['Gramíneas cespitosas densas', 'Cardos y flores de tallo lanoso', 'Radiación ultravioleta muy elevada'],
  },
  {
    id: 'alpino',
    nombre: 'Desierto Alpino y Roca Nival',
    subtitulo: 'La frontera del hielo y el basalto',
    altitudRango: [4300, 5400],
    altitudLabel: '4,300 – 5,400 m',
    colorHex: '#8FC1D4', // Glaciar / Nieve
    descripcion: 'Arenales volcánicos sueltos, lajas congeladas y ventisqueros. Las plantas crecen pegadas a la roca en forma de cojines térmicos.',
    caracteristicas: ['Plantas en almohadilla', 'Metabolismo adaptado al congelamiento', 'Líquenes sobre roca volcánica centenaria'],
  },
];

export const PLANTAS: Planta[] = [
  // Piso 1: Oyamel (2,800 - 3,500 m)
  {
    id: 'abies-religiosa',
    nombreComun: 'Oyamel Sagrado',
    nombreCientifico: 'Abies religiosa',
    piso: 'oyamel',
    altitudMin: 2800,
    altitudMax: 3500,
    floracion: 'Febrero a mayo',
    datoCurioso: 'Su resina aromática era quemada como incienso ritual por los mexicas en honor a Tláloc.',
    fotoId: 'oyamel',
    megapixeles: 15.9,
    lugares: ['oyamel', 'sacromonte', 'arroyo-deshielo'],
  },
  {
    id: 'alchemilla-procumbens',
    nombreComun: 'Manto de la Virgen',
    nombreCientifico: 'Alchemilla procumbens',
    piso: 'oyamel',
    altitudMin: 2900,
    altitudMax: 3450,
    floracion: 'Junio a septiembre',
    datoCurioso: 'Sus hojas aterciopeladas atrapan gotas de rocío perfectas gracias a un fenómeno superhidrofóbico natural.',
    fotoId: 'flora-penstemon',
    megapixeles: 2.9,
    lugares: ['oyamel', 'arroyo-deshielo'],
  },
  {
    id: 'polystichum-speciosissimum',
    nombreComun: 'Helecho de las Cañadas',
    nombreCientifico: 'Polystichum speciosissimum',
    piso: 'oyamel',
    altitudMin: 3000,
    altitudMax: 3600,
    floracion: 'Esporulación en época de lluvias',
    datoCurioso: 'Crece en las hendiduras sombreadas de basalto donde el goteo de deshielo es constante.',
    fotoId: 'oyamel',
    megapixeles: 15.9,
    lugares: ['oyamel', 'arroyo-deshielo'],
  },

  // Piso 2: Pino de Altura (3,500 - 4,000 m)
  {
    id: 'pinus-hartwegii',
    nombreComun: 'Pino de las Alturas',
    nombreCientifico: 'Pinus hartwegii',
    piso: 'pino-altura',
    altitudMin: 3400,
    altitudMax: 4050,
    floracion: 'Marzo a junio',
    datoCurioso: 'Es la única conífera del planeta capaz de germinar y prosperar por encima de los cuatro mil metros.',
    fotoId: 'bosque-hartwegii',
    esDeepZoom: true,
    megapixeles: 40.3,
    lugares: ['bosque-hartwegii', 'paso-de-cortes', 'teporingo', 'la-joya'],
  },
  {
    id: 'penstemon-gentianoides',
    nombreComun: 'Campanita Morada de Altura',
    nombreCientifico: 'Penstemon gentianoides',
    piso: 'pino-altura',
    altitudMin: 3200,
    altitudMax: 3900,
    floracion: 'Julio a noviembre',
    datoCurioso: 'Sus flores tubulares púrpuras son polinizadas por colibríes de montaña que desafían el frío matinal.',
    fotoId: 'flora-penstemon',
    megapixeles: 2.9,
    lugares: ['bosque-hartwegii', 'teporingo', 'paso-de-cortes'],
  },
  {
    id: 'lupinus-montanus',
    nombreComun: 'Lupino Azul de los Volcanes',
    nombreCientifico: 'Lupinus montanus',
    piso: 'pino-altura',
    altitudMin: 3400,
    altitudMax: 4100,
    floracion: 'Mayo a octubre',
    datoCurioso: 'Fija nitrógeno atmosférico enriqueciendo los suelos de ceniza volcánica pobre en nutrientes.',
    fotoId: 'flora-lupinus-montanus',
    megapixeles: 12.2,
    lugares: ['bosque-hartwegii', 'la-joya', 'teporingo'],
  },

  // Piso 3: Zacatonal / Pradera Alpina (3,900 - 4,300 m)
  {
    id: 'eryngium-proteiflorum',
    nombreComun: 'Cardo Azul de las Cumbres',
    nombreCientifico: 'Eryngium proteiflorum',
    piso: 'zacatonal',
    altitudMin: 3800,
    altitudMax: 4350,
    floracion: 'Agosto a enero',
    datoCurioso: 'Sus inflorescencias metálicas en azul plateado poseen brácteas espinosas que reflejan la radiación UV.',
    fotoId: 'flora-eryngium',
    esDeepZoom: true,
    megapixeles: 46.5,
    lugares: ['zacatonal', 'la-joya', 'nahualac'],
  },
  {
    id: 'festuca-tolucensis',
    nombreComun: 'Zacate de Páramo',
    nombreCientifico: 'Festuca tolucensis',
    piso: 'zacatonal',
    altitudMin: 3800,
    altitudMax: 4400,
    floracion: 'Septiembre a diciembre',
    datoCurioso: 'Forma matas duras de hasta un metro de alto que sirven de refugio y alimento principal al conejo teporingo.',
    fotoId: 'la-joya',
    megapixeles: 12.2,
    lugares: ['zacatonal', 'teporingo', 'la-joya'],
  },
  {
    id: 'castilleja-tolucensis',
    nombreComun: 'Pincel Indio de Altura',
    nombreCientifico: 'Castilleja tolucensis',
    piso: 'zacatonal',
    altitudMin: 3900,
    altitudMax: 4300,
    floracion: 'Julio a octubre',
    datoCurioso: 'Especie hemiparásita: sus raíces se conectan a los pastos para obtener agua y minerales suplementarios.',
    fotoId: 'flora-castilleja',
    megapixeles: 2.8,
    lugares: ['zacatonal', 'la-joya'],
  },

  // Piso 4: Desierto Alpino y Roca Nival (4,300 - 5,400 m)
  {
    id: 'arenaria-bryoides',
    nombreComun: 'Cojín de las Nieves',
    nombreCientifico: 'Arenaria bryoides',
    piso: 'alpino',
    altitudMin: 4200,
    altitudMax: 4850,
    floracion: 'Noviembre a febrero',
    datoCurioso: 'Crece tan comprimida que su estructura interna conserva una bolsa de aire hasta 8 °C más cálida que el exterior.',
    fotoId: 'flora-arenaria',
    megapixeles: 3.1,
    lugares: ['cumbre-izta', 'glaciar-ayoloco'],
  },
  {
    id: 'senecio-procumbens',
    nombreComun: 'Margarita de Roca Volcánica',
    nombreCientifico: 'Senecio procumbens',
    piso: 'alpino',
    altitudMin: 4300,
    altitudMax: 4900,
    floracion: 'Diciembre a marzo',
    datoCurioso: 'Sus hojas están tapizadas por un fieltro denso de vellos blancos que impiden la evaporación del agua.',
    fotoId: 'flora-arenaria',
    megapixeles: 3.1,
    lugares: ['cumbre-izta', 'glaciar-ayoloco'],
  },
  {
    id: 'xanthoria-elegans',
    nombreComun: 'Liquen Naranja de las Alturas',
    nombreCientifico: 'Xanthoria elegans',
    piso: 'alpino',
    altitudMin: 4400,
    altitudMax: 5230,
    floracion: 'Organismo simbiótico perenne',
    datoCurioso: 'Sobrevive a la exposición directa del vacío espacial en experimentos de la Estación Espacial Internacional.',
    fotoId: 'cumbre-izta',
    megapixeles: 7.5,
    lugares: ['cumbre-izta', 'glaciar-ayoloco', 'mirador-popo'],
  },
];
