export interface Expedicion {
  id: string;
  titulo: string;
  fecha: string;
  ruta: string;
  distanciaKm: number;
  desnivelM: number;
  duracionHoras: number;
  resumen: string;
  lugaresIds: string[];
  fotos: { id: string; pie: string }[];
  clima: string;
  guia: string;
}

export const BITACORA_EXPEDICIONES: Expedicion[] = [
  {
    id: 'exp-2026-03-cumbre-invernal',
    titulo: 'Travesía Invernal a El Pecho bajo Cielo Polar',
    fecha: '18 de febrero de 2026',
    ruta: 'La Joya → Refugio de los Cien → Arista del Sol → El Pecho',
    distanciaKm: 13.5,
    desnivelM: 1280,
    duracionHoras: 9.5,
    resumen: 'Apertura de temporada con condiciones de nieve compacta y viento de 45 km/h. Amanecer nítido a 5,000 m con visión completa del Pico de Orizaba.',
    lugaresIds: ['la-joya', 'cumbre-izta', 'glaciar-ayoloco'],
    fotos: [
      { id: 'la-joya', pie: 'Partida a las 2:30 AM desde La Joya' },
      { id: 'cumbre-izta', pie: 'Cresta cimera en El Pecho (5,230 m)' },
      { id: 'glaciar-ayoloco', pie: 'Paso por el lecho del extinto Ayoloco' },
    ],
    clima: '-6 °C en base, -14 °C en cumbre, cielo despejado',
    guia: 'Martín Hernández',
  },
  {
    id: 'exp-2026-01-vigilia-volcanica',
    titulo: 'Vigilia Geológica y Amanecer en Paso de Cortés',
    fecha: '25 de enero de 2026',
    ruta: 'Paso de Cortés → Mirador del Popocatépetl → Laderas de Tenenepanco',
    distanciaKm: 6.8,
    desnivelM: 220,
    duracionHoras: 4.5,
    resumen: 'Sesión de astrofotografía y observación vulcanológica con teleobjetivos. El Popocatépetl presentó tres exhalaciones de vapor blanco y ceniza fina hacia el este.',
    lugaresIds: ['paso-de-cortes', 'mirador-popo', 'tenenepanco'],
    fotos: [
      { id: 'paso-de-cortes', pie: 'Llegada antes del alba al collado' },
      { id: 'mirador-popo', pie: 'Fumarola iluminada por el sol naciente' },
      { id: 'tenenepanco', pie: 'Laderas volcánicas norteñas' },
    ],
    clima: '1 °C, calma de viento, excelente visibilidad astronómica',
    guia: 'Martín Hernández',
  },
  {
    id: 'exp-2026-01-santuario-hartwegii',
    titulo: 'Rastreo del Teporingo y Censo en Bosque Hartwegii',
    fecha: '14 de enero de 2026',
    ruta: 'Circuito Cañada de Altzomoni → Pinar de Altura',
    distanciaKm: 8.2,
    desnivelM: 450,
    duracionHoras: 5.0,
    resumen: 'Recorrido de ecología aplicada documentando ejemplares centenarios de Pinus hartwegii y avistamiento de tres individuos de Romerolagus diazi en su madriguera.',
    lugaresIds: ['bosque-hartwegii', 'teporingo', 'oyamel'],
    fotos: [
      { id: 'bosque-hartwegii', pie: 'Corteza hexagonal centenaria a 3,750 m' },
      { id: 'teporingo', pie: 'Avistamiento de teporingo entre el zacate' },
      { id: 'oyamel', pie: 'Descenso por la franja de abetos' },
    ],
    clima: '4 °C a 12 °C, neblina flotante intermitente',
    guia: 'Martín Hernández',
  },
  {
    id: 'exp-2025-11-santuarios-prehispanicos',
    titulo: 'Exploración Arqueoastronómica en Nahualac',
    fecha: '10 de noviembre de 2025',
    ruta: 'Amecameca → Sacromonte → Aproximación al adoratorio de Nahualac',
    distanciaKm: 11.0,
    desnivelM: 780,
    duracionHoras: 7.0,
    resumen: 'Expedición de memoria histórica conectando el antiguo santuario del Sacromonte con el adoratorio sumergido de Tláloc a 3,870 m. Registro fotográfico sin impacto.',
    lugaresIds: ['sacromonte', 'nahualac', 'arroyo-deshielo'],
    fotos: [
      { id: 'sacromonte', pie: 'Santuario del Sacromonte con vista a volcanes' },
      { id: 'vista-noreste', pie: 'Cuenca ceremonial de Nahualac' },
      { id: 'oyamel', pie: 'Cañada húmeda y arroyo de deshielo' },
    ],
    clima: '6 °C, viento moderado del noroeste',
    guia: 'Martín Hernández',
  },
];
