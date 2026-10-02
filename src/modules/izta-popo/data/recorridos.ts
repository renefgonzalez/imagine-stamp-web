export interface Recorrido {
  id: string;
  nombre: string;
  distanciaKm: number;
  desnivelPositivoM: number;
  tiempoEstimado: string;
  dificultad: 'Fácil' | 'Media' | 'Alta';
  color: string;
  descripcion: string;
  coordenadas: [number, number][]; // [lng, lat]
}

export const RECORRIDOS: Recorrido[] = [
  {
    id: 'paso-mirador-popo',
    nombre: 'Paso de Cortés → Mirador del Popo',
    distanciaKm: 4.8,
    desnivelPositivoM: 180,
    tiempoEstimado: '1 h 45 min',
    dificultad: 'Fácil',
    color: '#E8A15A', // Amanecer
    descripcion: 'Paseo panorámico entre el collado histórico y la balconada hacia la fumarola activa.',
    coordenadas: [
      [-98.6430, 19.0888],
      [-98.6415, 19.0850],
      [-98.6398, 19.0815],
      [-98.6380, 19.0785],
      [-98.6362, 19.0762],
      [-98.6350, 19.0750],
    ],
  },
  {
    id: 'la-joya-el-pecho',
    nombre: 'La Joya → El Pecho (Los Arenales)',
    distanciaKm: 13.5,
    desnivelPositivoM: 1280,
    tiempoEstimado: '8 - 10 horas',
    dificultad: 'Alta',
    color: '#8FC1D4', // Glaciar
    descripcion: 'La gran travesía técnica de alta montaña ascendiendo por Los Portillos y la Arista del Sol.',
    coordenadas: [
      [-98.6480, 19.1370],
      [-98.6465, 19.1430],
      [-98.6450, 19.1510],
      [-98.6442, 19.1585],
      [-98.6435, 19.1660],
      [-98.6418, 19.1720],
      [-98.6422, 19.1789],
    ],
  },
  {
    id: 'oyamel-arroyo-deshielo',
    nombre: 'Bosque de Oyamel → Arroyo de Deshielo',
    distanciaKm: 6.2,
    desnivelPositivoM: 600,
    tiempoEstimado: '3 h 30 min',
    dificultad: 'Media',
    color: '#3F6B4F', // Pino
    descripcion: 'Inmersión botánica desde la espesura musgosa del abeto sagrado hasta los saltos de agua gélida.',
    coordenadas: [
      [-98.7000, 19.1200],
      [-98.6920, 19.1280],
      [-98.6850, 19.1360],
      [-98.6780, 19.1450],
      [-98.6730, 19.1510],
      [-98.6700, 19.1550],
    ],
  },
];
