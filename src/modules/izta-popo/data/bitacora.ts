import { GUIDE_NAME } from '../config';

export interface EntradaJornada {
  id: string;
  titulo: string;
  tipoJornada: 'Limpieza de parajes' | 'Reforestación' | 'Observación y censo biológico' | 'Plática y cultura comunitaria';
  fecha: string;
  lugar: string;
  voluntariosParticipantes: number;
  logro: string; // Lo que se logró en la jornada
  resumen: string;
  lugaresIds: string[];
  fotos: { id: string; pie: string }[];
  coordinador: string;
  esEjemplo: boolean;
}

export const BITACORA_JORNADAS: EntradaJornada[] = [
  {
    id: 'jornada-2026-02-limpieza-joya',
    titulo: 'Jornada de Limpieza y Retiro de Residuos en La Joya',
    tipoJornada: 'Limpieza de parajes',
    fecha: '18 de febrero de 2026',
    lugar: 'La Joya → Los Portillos',
    voluntariosParticipantes: 24,
    logro: 'Retiro de 180 kg de plásticos, latas y residuos inorgánicos de las cañadas altas.',
    resumen: 'Jornada colectiva de saneamiento ambiental a 3,950 m. Con el apoyo de voluntarios locales se retiraron desechos acumulados en zonas de campamento, previniendo la contaminación de los veneros de deshielo.',
    lugaresIds: ['la-joya', 'glaciar-ayoloco'],
    fotos: [
      { id: 'la-joya', pie: 'Inicio de la jornada en el campamento La Joya' },
      { id: 'glaciar-ayoloco', pie: 'Recolección en senderos hacia el antiguo glaciar' },
      { id: 'vista-noreste', pie: 'Revisión final de cuenca limpia' }
    ],
    coordinador: GUIDE_NAME,
    esEjemplo: true,
  },
  {
    id: 'jornada-2026-01-censo-teporingo',
    titulo: 'Monitoreo Comunitario y Censo del Teporingo en el Pinar',
    tipoJornada: 'Observación y censo biológico',
    fecha: '14 de enero de 2026',
    lugar: 'Cañada de Altzomoni → Bosque Hartwegii',
    voluntariosParticipantes: 12,
    logro: 'Registro de 3 colonias activas de conejo zacatuche y georreferenciación de madrigueras.',
    resumen: 'Recorrido silencioso de educación ambiental y ciencia ciudadana. Se documentó la interacción del zacatuche con el zacatonal alpino y se sensibilizó a los asistentes sobre no ingresar con perros que amenacen su supervivencia.',
    lugaresIds: ['bosque-hartwegii', 'teporingo', 'oyamel'],
    fotos: [
      { id: 'teporingo', pie: 'Avistamiento de teporingo entre las matas de zacate' },
      { id: 'bosque-hartwegii', pie: 'Bosque de Pinus hartwegii donde se refugia' },
      { id: 'oyamel', pie: 'Franja de abetos y amortiguamiento' }
    ],
    coordinador: GUIDE_NAME,
    esEjemplo: true,
  },
  {
    id: 'jornada-2025-11-reforestacion-oyamel',
    titulo: 'Siembra y Mantenimiento de Plántulas Nativas de Oyamel',
    tipoJornada: 'Reforestación',
    fecha: '25 de noviembre de 2025',
    lugar: 'Laderas de Amecameca y bosque de oyamel',
    voluntariosParticipantes: 35,
    logro: 'Plantación de 450 arbolitos nativos protegidos con acolchado vegetal orgánico.',
    resumen: 'Siembra comunitaria con familias y jóvenes en una ladera afectada por erosión. Se enseñó la técnica correcta de apertura de cepellón y se colocaron protectores contra heladas para asegurar una tasa de supervivencia superior al 80%.',
    lugaresIds: ['oyamel', 'sacromonte'],
    fotos: [
      { id: 'oyamel', pie: 'Bosque de Oyamel sagrado donde se integraron plántulas' },
      { id: 'sacromonte', pie: 'Punto de reunión comunitaria previo a la siembra' },
      { id: 'vista-noreste', pie: 'Verificación de humedad en el suelo de cañada' }
    ],
    coordinador: GUIDE_NAME,
    esEjemplo: true,
  },
  {
    id: 'jornada-2025-10-platica-tradicion-nahualac',
    titulo: 'Plática sobre Memoria Biocultural y Montañas Sagradas',
    tipoJornada: 'Plática y cultura comunitaria',
    fecha: '18 de octubre de 2025',
    lugar: 'Auditorio Comunitario de Amecameca',
    voluntariosParticipantes: 50,
    logro: 'Difusión de la tradición oral náhuatl y concientización contra el saqueo de sitios rituales.',
    resumen: 'Encuentro cultural donde adultos mayores y cronistas compartieron los relatos sobre el agua sagrada de Tláloc y la toponimia de los volcanes, creando un frente juvenil de protección contra el saqueo en Nahualac.',
    lugaresIds: ['sacromonte', 'paso-de-cortes'],
    fotos: [
      { id: 'vista-noreste', pie: 'Perspectiva de las cuencas sagradas analizadas' },
      { id: 'sacromonte', pie: 'Santuario del Sacromonte donde inició el diálogo' },
      { id: 'paso-de-cortes', pie: 'Los dos volcanes como testigos de la tradición oral' }
    ],
    coordinador: GUIDE_NAME,
    esEjemplo: true,
  }
];

export const BITACORA_EXPEDICIONES = BITACORA_JORNADAS;
