export type PisoEcologicoId = 'oyamel' | 'pino-altura' | 'zacatonal' | 'alpino';

export type GrupoFaunaId = 'todos' | 'mamiferos' | 'aves' | 'reptiles' | 'insectos' | 'invertebrados';

export type EstadoConservacion = 'P' | 'A' | 'Pr' | 'LC' | 'Endemica';

export interface Fauna {
  id: string;
  nombreComun: string;
  nombreCientifico: string;
  grupo: 'mamiferos' | 'aves' | 'reptiles' | 'insectos' | 'invertebrados';
  piso: PisoEcologicoId;
  altitudMin: number;
  altitudMax: number;
  dieta: string;
  estadoConservacion: EstadoConservacion;
  estadoLabel: string;
  datoCurioso: string;
  fotoId: string;
  fotos?: string[]; // Para especies con múltiples fotografías
  esFotoCliente?: boolean;
  esDeepZoom?: boolean;
  megapixeles?: number;
  lugares: string[];
}

export const GRUPOS_FAUNA: { id: GrupoFaunaId; label: string; iconEmoji: string }[] = [
  { id: 'todos', label: 'Toda la Fauna', iconEmoji: '🐾' },
  { id: 'mamiferos', label: 'Mamíferos', iconEmoji: '🦊' },
  { id: 'aves', label: 'Aves', iconEmoji: '🦅' },
  { id: 'reptiles', label: 'Reptiles', iconEmoji: '🦎' },
  { id: 'insectos', label: 'Insectos', iconEmoji: '🦋' },
  { id: 'invertebrados', label: 'Invertebrados', iconEmoji: '🐌' },
];

export const ESTADO_CONSERVACION_INFO: Record<EstadoConservacion, { label: string; bg: string; text: string; border: string; desc: string }> = {
  P: {
    label: 'En Peligro de Extinción (P)',
    bg: 'bg-red-500/20',
    text: 'text-red-300',
    border: 'border-red-500/40',
    desc: 'NOM-059-SEMARNAT-2010: Especie cuyas áreas de distribución o tamaño poblacional han disminuido drásticamente.',
  },
  A: {
    label: 'Amenazada (A)',
    bg: 'bg-amber-500/20',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    desc: 'NOM-059-SEMARNAT-2010: Podría llegar a encontrarse en peligro de desaparecer a corto o mediano plazo.',
  },
  Pr: {
    label: 'Protección Especial (Pr)',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    desc: 'NOM-059-SEMARNAT-2010: Especie sujeta a protección especial para propiciar su recuperación y conservación.',
  },
  Endemica: {
    label: 'Endémica de la Sierra',
    bg: 'bg-purple-500/20',
    text: 'text-purple-300',
    border: 'border-purple-500/40',
    desc: 'Especie única de la Faja Volcánica Transmexicana que no habita de forma natural en ninguna otra parte del mundo.',
  },
  LC: {
    label: 'Preocupación Menor (LC)',
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    border: 'border-blue-500/40',
    desc: 'Poblaciones estables catalogadas por UICN dentro de la reserva de la biosfera.',
  },
};

export const ANIMALES: Fauna[] = [
  {
    id: 'vibora-cascabel-transvolcanica',
    nombreComun: 'Víbora de Cascabel Transvolcánica',
    nombreCientifico: 'Crotalus triseriatus / Crotalus ravus',
    grupo: 'reptiles',
    piso: 'zacatonal',
    altitudMin: 3000,
    altitudMax: 4300,
    dieta: 'Carnívora · Ratones de los volcanes, lagartijas Sceloporus y saltamontes alpinos',
    estadoConservacion: 'Pr',
    estadoLabel: 'Protección Especial (Pr) · Endémica',
    datoCurioso: 'Es una de las serpientes venenosas que habita a mayor altitud del continente. Su cuerpo compacto (30–65 cm) y sus escamas oscuras le permiten calentarse rápidamente con los primeros rayos de sol sobre la roca volcánica para cazar antes de que baje la helada.',
    fotoId: 'vibora-cascabel-transvolcanica-1',
    fotos: [
      'vibora-cascabel-transvolcanica-1',
      'vibora-cascabel-transvolcanica-2'
    ],
    esFotoCliente: true,
    esDeepZoom: true,
    megapixeles: 1.2,
    lugares: ['la-joya', 'paso-de-cortes', 'tenenepanco'],
  },
  {
    id: 'mariposa-cometa-montana',
    nombreComun: 'Mariposa Cometa de Montaña',
    nombreCientifico: 'Papilio multicaudata / Papilio garamas',
    grupo: 'insectos',
    piso: 'pino-altura',
    altitudMin: 2600,
    altitudMax: 3700,
    dieta: 'Nectarívora · Néctar de cardos alpinos, penstemons silvestres y zarzamoras',
    estadoConservacion: 'Pr',
    estadoLabel: 'Sujeta a Protección · Hábitat Reserva',
    datoCurioso: 'Con una envergadura de hasta 12 cm, sus largas colas en las alas traseras engañan a las aves depredadoras haciendo que ataquen los extremos falsos de las alas, salvando el cuerpo vital del insecto mientras maniobra entre las corrientes térmicas de las cañadas.',
    fotoId: 'mariposa-cometa-montana-1',
    fotos: ['mariposa-cometa-montana-1'],
    esFotoCliente: true,
    esDeepZoom: true,
    megapixeles: 1.2,
    lugares: ['paso-de-cortes', 'sacromonte', 'la-joya'],
  },
  {
    id: 'teporingo-volcanes',
    nombreComun: 'Teporingo o Conejo de los Volcanes (Zacatuche)',
    nombreCientifico: 'Romerolagus diazi',
    grupo: 'mamiferos',
    piso: 'zacatonal',
    altitudMin: 2800,
    altitudMax: 4200,
    dieta: 'Herbívora estricta · Brotes tiernos de zacatones Festuca tolucensis y Muhlenbergia',
    estadoConservacion: 'P',
    estadoLabel: 'En Peligro de Extinción (P) · Joya Endémica',
    datoCurioso: 'Es el segundo conejo más pequeño del planeta y un fósil viviente exclusivo de los volcanes de México. A diferencia de otros conejos, carece de cola visible, tiene orejas redondeadas muy cortas y emite agudos silbidos de alarma audibles a gran distancia.',
    fotoId: 'teporingo',
    fotos: ['teporingo'],
    esFotoCliente: false,
    esDeepZoom: true,
    megapixeles: 3.3,
    lugares: ['paso-de-cortes', 'la-joya', 'tenenepanco'],
  },
  {
    id: 'coyote-volcanes',
    nombreComun: 'Coyote de Montaña Transvolcánico',
    nombreCientifico: 'Canis latrans cagottis',
    grupo: 'mamiferos',
    piso: 'pino-altura',
    altitudMin: 2500,
    altitudMax: 4300,
    dieta: 'Carnívoro / Oportunista · Pequeños roedores alpinos, zacatuches, bayas y carroña',
    estadoConservacion: 'LC',
    estadoLabel: 'Preocupación Menor · Depredador Tope',
    datoCurioso: 'Dotado de un pelaje espeso y denso que lo aísla de vientos a -10 °C en la arista del volcán. Como regulador cumbre, controla naturalmente las poblaciones de roedores y dispersa semillas de enebro y arbustos a lo largo de sus extensas rutas territoriales.',
    fotoId: 'coyote-volcanes',
    fotos: ['coyote-volcanes'],
    esFotoCliente: false,
    esDeepZoom: true,
    megapixeles: 1.1,
    lugares: ['la-joya', 'paso-de-cortes', 'glaciar-ayoloco'],
  },
  {
    id: 'lagartija-espinosa-iztapopo',
    nombreComun: 'Lagartija Espinosa de los Riscos',
    nombreCientifico: 'Sceloporus grammicus',
    grupo: 'reptiles',
    piso: 'alpino',
    altitudMin: 3000,
    altitudMax: 4500,
    dieta: 'Insectívora · Escarabajos de suelo, arañas de alta montaña y hormigas',
    estadoConservacion: 'Pr',
    estadoLabel: 'Protección Especial · Vivípara',
    datoCurioso: 'Para no perecer ante las heladas nocturnas subcero que congelarían los huevos en el nido, esta lagartija es vivípara: incuba a sus crías dentro de su propio vientre y da a luz crías perfectamente formadas y listas para correr sobre las piedras de lava.',
    fotoId: 'lagartija-espinosa-iztapopo',
    fotos: ['lagartija-espinosa-iztapopo'],
    esFotoCliente: false,
    esDeepZoom: true,
    megapixeles: 1.1,
    lugares: ['la-joya', 'glaciar-ayoloco', 'tenenepanco'],
  },
  {
    id: 'buho-cornudo-iztapopo',
    nombreComun: 'Búho Cornudo de la Sierra',
    nombreCientifico: 'Bubo virginianus',
    grupo: 'aves',
    piso: 'oyamel',
    altitudMin: 2600,
    altitudMax: 3900,
    dieta: 'Carnívora rapaz · Ratones de orejas grandes (Peromyscus), conejos y aves nocturnas',
    estadoConservacion: 'Pr',
    estadoLabel: 'Protección Especial · Guardián Nocturno',
    datoCurioso: 'Los bordes dentados y afelpados de sus alas peinan el aire eliminando cualquier sonido de fricción. Puede precipitarse sobre su presa en absoluta oscuridad y silencio espectral a través de la densa niebla del bosque de oyamel.',
    fotoId: 'buho-cornudo-iztapopo',
    fotos: ['buho-cornudo-iztapopo'],
    esFotoCliente: false,
    esDeepZoom: true,
    megapixeles: 1.1,
    lugares: ['sacromonte', 'paso-de-cortes'],
  },
  {
    id: 'colibri-montana-iztapopo',
    nombreComun: 'Colibrí Garganta Azul',
    nombreCientifico: 'Lampornis clemenciae',
    grupo: 'aves',
    piso: 'pino-altura',
    altitudMin: 2400,
    altitudMax: 3800,
    dieta: 'Nectarívora · Flores tubulares rojas (Penstemon gentianoides) y diminutos dípteros',
    estadoConservacion: 'LC',
    estadoLabel: 'Preocupación Menor · Polinizador Cumbre',
    datoCurioso: 'Es uno de los colibríes más grandes de México. Para resistir las gélidas madrugadas invernales en la falda del volcán entra en estado de torpor (un letargo casi cataléptico donde baja su temperatura a casi 8 °C y reduce su corazón de 1,000 a 50 latidos por minuto).',
    fotoId: 'colibri-montana-iztapopo',
    fotos: ['colibri-montana-iztapopo'],
    esFotoCliente: false,
    esDeepZoom: true,
    megapixeles: 1.1,
    lugares: ['la-joya', 'sacromonte', 'paso-de-cortes'],
  },
  {
    id: 'abejorro-alpino-iztapopo',
    nombreComun: 'Abejorro de Alta Montaña',
    nombreCientifico: 'Bombus ephippiatus',
    grupo: 'insectos',
    piso: 'zacatonal',
    altitudMin: 2900,
    altitudMax: 4200,
    dieta: 'Herbívora · Polen y néctar de cardos gigantes Cirsium y lupinos alpinos',
    estadoConservacion: 'Pr',
    estadoLabel: 'Protección Especial · Polinizador Frío',
    datoCurioso: 'Desacopla sus alas de los músculos de vuelo para hacerlos vibrar a máxima potencia sin moverse del sitio. Esta fricción biofísica interna eleva su temperatura corporal a más de 30 °C permitiéndole volar bajo granizo y heladas matutinas.',
    fotoId: 'cardo-rojo-cirsium-2',
    fotos: ['cardo-rojo-cirsium-2'],
    esFotoCliente: true,
    esDeepZoom: true,
    megapixeles: 1.2,
    lugares: ['la-joya', 'tenenepanco'],
  },
  {
    id: 'caracol-terrestre-volcanico',
    nombreComun: 'Caracol de las Cumbres Volcánicas',
    nombreCientifico: 'Humboldtiana sp. (Stylommatophora)',
    grupo: 'invertebrados',
    piso: 'pino-altura',
    altitudMin: 3100,
    altitudMax: 3900,
    dieta: 'Detritívora / Herbívora · Líquenes saxícolas, microalgas y tejidos de echeverias',
    estadoConservacion: 'Endemica',
    estadoLabel: 'Endémica de Riscos Húmedos',
    datoCurioso: 'Habita refugiado entre las hojas suculentas de las echeverias y grietas sombrías de lava. Cuando la humedad cae o llega el invierno, sella herméticamente la boca de su concha con un epifragma mucoso endurecido que previene la deshidratación y la escarcha.',
    fotoId: 'echeveria-siempreviva-1',
    fotos: ['echeveria-siempreviva-1'],
    esFotoCliente: true,
    esDeepZoom: true,
    megapixeles: 1.2,
    lugares: ['la-joya', 'paso-de-cortes'],
  }
];
