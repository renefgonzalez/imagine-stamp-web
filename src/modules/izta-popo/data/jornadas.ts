export interface Jornada {
  id: string;
  titulo: string;
  tipo: 'Limpieza' | 'Reforestación' | 'Cultura y Taller' | 'Prevención de Incendios';
  fecha: string;
  puntoReunion: string;
  cupo: string;
  descripcion: string;
  requisitos: string[];
}

export const JORNADAS: Jornada[] = [
  {
    id: 'jornada-limpieza-joya',
    titulo: 'Jornada de Limpieza en Cañadas de La Joya',
    tipo: 'Limpieza',
    fecha: 'Sábado 24 de Octubre, 2026 · 07:30 hrs',
    puntoReunion: 'Estacionamiento de Paso de Cortés (traslado conjunto)',
    cupo: 'Cupo limitado a 25 voluntarios (Ejemplo)',
    descripcion: 'Recolección y clasificación de residuos sólidos en senderos altos y zonas de campamento para evitar contaminación de cuencas de deshielo.',
    requisitos: [
      'Botas de montaña o calzado antiderrapante',
      'Guantes gruesos de trabajo (carnaza o nitrilo)',
      'Ropa de abrigo en capas (viento y frío matutino)',
      'Agua y refrigerio personal en recipientes reutilizables'
    ]
  },
  {
    id: 'jornada-reforestacion-ayoloco',
    titulo: 'Siembra y Cuidado de Pino Hartwegii y Oyamel',
    tipo: 'Reforestación',
    fecha: 'Domingo 15 de Noviembre, 2026 · 08:00 hrs',
    puntoReunion: 'Centro de Visitantes Paso de Cortés',
    cupo: 'Cupo limitado a 30 voluntarios (Ejemplo)',
    descripcion: 'Plantación de plántulas nativas en zonas degradadas por pastoreo y erosión, fortaleciendo el cinturón boscoso de recarga acuífera.',
    requisitos: [
      'Ganas de trabajar la tierra y palas de jardinería si dispones',
      'Protección solar (sombrero y bloqueador biodegradable)',
      'Calzado cerrado resistente',
      'Impermeable ligero por cambios repentinos de clima'
    ]
  },
  {
    id: 'taller-tradicion-oral',
    titulo: 'Taller Comunitario: Tradición Oral y Montañas Sagradas',
    tipo: 'Cultura y Taller',
    fecha: 'Sábado 5 de Diciembre, 2026 · 10:30 hrs',
    puntoReunion: 'Auditorio Comunitario de Amecameca',
    cupo: 'Entrada libre con registro previo · 40 personas (Ejemplo)',
    descripcion: 'Plática participativa sobre la toponimia náhuatl de los volcanes, el valor sagrado del agua y cómo la juventud puede preservar la memoria biocultural.',
    requisitos: [
      'Cuaderno de notas o grabadora personal',
      'Interés en la historia prehispánica y ambiental',
      'Apto para toda la familia'
    ]
  }
];
