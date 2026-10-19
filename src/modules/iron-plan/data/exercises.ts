// ── Biblioteca de ejercicios IRON PLAN ─────────────────────────────────────
// ratio = 1RM estimado / peso corporal (hombre) por nivel [principiante, intermedio, avanzado].
// En mancuernas el ratio es por mancuerna. Sin ratio = peso corporal o tiempo.

export type Muscle =
  | 'pecho' | 'espalda' | 'hombro' | 'biceps' | 'triceps'
  | 'cuadriceps' | 'femoral' | 'gluteo' | 'pantorrilla' | 'abdomen';

export type Equipment = 'barra' | 'mancuerna' | 'maquina' | 'polea' | 'corporal' | 'cardio';
export type Injury = 'rodilla' | 'hombro' | 'lumbar';

export interface Exercise {
  id: string;
  name: string;
  muscle: Muscle;
  secondary?: Muscle[];
  eq: Equipment;
  kind: 'compuesto' | 'aislamiento' | 'cardio';
  ratio?: [number, number, number];
  single?: boolean; // una sola mancuerna (no "c/u")
  avoid?: Injury[];
  adv?: boolean; // técnica exigente: baja prioridad en principiantes
  hard?: boolean; // peso corporal exigente (dominadas, fondos)
  timed?: string; // se prescribe por tiempo
  fixedSeconds?: number;
  tip: string;
}

export const MUSCLE_LABEL: Record<Muscle, string> = {
  pecho: 'Pecho',
  espalda: 'Espalda',
  hombro: 'Hombro',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  cuadriceps: 'Cuádriceps',
  femoral: 'Femoral',
  gluteo: 'Glúteo',
  pantorrilla: 'Pantorrilla',
  abdomen: 'Abdomen',
};

export const LOWER_MUSCLES: Muscle[] = ['cuadriceps', 'femoral', 'gluteo', 'pantorrilla'];

export const EQUIPMENT_LABEL: Record<Equipment, string> = {
  barra: 'Barra',
  mancuerna: 'Mancuernas',
  maquina: 'Máquina',
  polea: 'Polea',
  corporal: 'Peso corporal',
  cardio: 'Cardio',
};

const LIST: Exercise[] = [
  // ── Pecho
  { id: 'press-banca', name: 'Press de banca con barra', muscle: 'pecho', secondary: ['triceps', 'hombro'], eq: 'barra', kind: 'compuesto', ratio: [0.6, 0.95, 1.3], avoid: ['hombro'], tip: 'Escápulas juntas y hacia abajo, pies firmes. Baja la barra a la línea del pezón y empuja en línea recta.' },
  { id: 'press-maquina-pecho', name: 'Press de pecho en máquina', muscle: 'pecho', secondary: ['triceps'], eq: 'maquina', kind: 'compuesto', ratio: [0.55, 0.85, 1.15], tip: 'Ajusta el asiento para que las manijas queden a la altura del pecho medio. Codos a 45°.' },
  { id: 'press-manc-plano', name: 'Press plano con mancuernas', muscle: 'pecho', secondary: ['triceps', 'hombro'], eq: 'mancuerna', kind: 'compuesto', ratio: [0.22, 0.34, 0.46], tip: 'Baja controlado hasta sentir estiramiento en el pecho; junta las mancuernas arriba sin chocarlas.' },
  { id: 'press-inclinado-manc', name: 'Press inclinado con mancuernas', muscle: 'pecho', secondary: ['hombro', 'triceps'], eq: 'mancuerna', kind: 'compuesto', ratio: [0.2, 0.3, 0.42], tip: 'Banco a 30°. Enfoca el pecho superior; no arquees de más la espalda.' },
  { id: 'press-inclinado-barra', name: 'Press inclinado con barra', muscle: 'pecho', secondary: ['hombro', 'triceps'], eq: 'barra', kind: 'compuesto', ratio: [0.5, 0.8, 1.1], avoid: ['hombro'], tip: 'Banco a 30°. La barra baja a la parte alta del pecho, codos ligeramente cerrados.' },
  { id: 'fondos', name: 'Fondos en paralelas', muscle: 'pecho', secondary: ['triceps', 'hombro'], eq: 'corporal', kind: 'compuesto', hard: true, avoid: ['hombro'], tip: 'Inclina el torso al frente para cargar el pecho. Baja hasta que el hombro quede a la altura del codo.' },
  { id: 'aperturas-polea', name: 'Cruces en polea', muscle: 'pecho', eq: 'polea', kind: 'aislamiento', ratio: [0.12, 0.2, 0.28], tip: 'Codos semiflexionados fijos; "abraza un árbol" y aprieta 1 s al centro.' },
  { id: 'pec-deck', name: 'Aperturas en pec deck', muscle: 'pecho', eq: 'maquina', kind: 'aislamiento', ratio: [0.35, 0.55, 0.75], tip: 'Pecho alto, hombros atrás. Cierra controlado y abre lento (3 s).' },
  { id: 'aperturas-manc', name: 'Aperturas con mancuernas', muscle: 'pecho', eq: 'mancuerna', kind: 'aislamiento', ratio: [0.1, 0.16, 0.22], avoid: ['hombro'], tip: 'Arco amplio con codos suaves; baja solo hasta la línea del hombro.' },
  { id: 'lagartijas', name: 'Lagartijas', muscle: 'pecho', secondary: ['triceps', 'hombro'], eq: 'corporal', kind: 'compuesto', tip: 'Cuerpo en línea recta, abdomen firme. Pecho casi al piso y empuja fuerte.' },
  { id: 'lagartijas-declinadas', name: 'Lagartijas con pies elevados', muscle: 'pecho', secondary: ['hombro', 'triceps'], eq: 'corporal', kind: 'compuesto', tip: 'Pies sobre un banco o silla: más énfasis en pecho superior.' },

  // ── Hombro
  { id: 'press-militar', name: 'Press militar con barra de pie', muscle: 'hombro', secondary: ['triceps'], eq: 'barra', kind: 'compuesto', ratio: [0.38, 0.58, 0.8], avoid: ['hombro', 'lumbar'], adv: true, tip: 'Glúteos y abdomen apretados. Mete la cabeza bajo la barra al subir.' },
  { id: 'press-hombro-manc', name: 'Press de hombro con mancuernas sentado', muscle: 'hombro', secondary: ['triceps'], eq: 'mancuerna', kind: 'compuesto', ratio: [0.14, 0.22, 0.3], avoid: ['hombro'], tip: 'Respaldo a 80°. Baja hasta la altura de las orejas y sube sin bloquear codos.' },
  { id: 'press-hombro-maquina', name: 'Press de hombro en máquina', muscle: 'hombro', secondary: ['triceps'], eq: 'maquina', kind: 'compuesto', ratio: [0.35, 0.55, 0.75], tip: 'Espalda pegada al respaldo; recorrido completo y controlado.' },
  { id: 'pike-pushup', name: 'Lagartijas pike (hombro)', muscle: 'hombro', secondary: ['triceps'], eq: 'corporal', kind: 'compuesto', hard: true, avoid: ['hombro'], tip: 'Cadera arriba en "V invertida"; la cabeza baja entre las manos.' },
  { id: 'elev-laterales', name: 'Elevaciones laterales con mancuernas', muscle: 'hombro', eq: 'mancuerna', kind: 'aislamiento', ratio: [0.06, 0.1, 0.14], tip: 'Sube hasta la altura del hombro, codos guían el movimiento, sin balanceo.' },
  { id: 'elev-laterales-polea', name: 'Elevación lateral en polea', muscle: 'hombro', eq: 'polea', kind: 'aislamiento', ratio: [0.04, 0.07, 0.1], tip: 'Polea baja, un brazo a la vez. Tensión constante; baja en 3 s.' },
  { id: 'face-pull', name: 'Face pull en polea', muscle: 'hombro', secondary: ['espalda'], eq: 'polea', kind: 'aislamiento', ratio: [0.2, 0.3, 0.42], tip: 'Cuerda a la altura de la cara; jala separando las manos y rota hacia atrás. Salud de hombro.' },
  { id: 'pajaros', name: 'Pájaros (deltoide posterior)', muscle: 'hombro', secondary: ['espalda'], eq: 'mancuerna', kind: 'aislamiento', ratio: [0.05, 0.08, 0.11], tip: 'Torso inclinado al frente, abre los brazos como alas sin juntar escápulas.' },

  // ── Tríceps
  { id: 'ext-polea', name: 'Extensión de tríceps en polea (cuerda)', muscle: 'triceps', eq: 'polea', kind: 'aislamiento', ratio: [0.2, 0.3, 0.42], tip: 'Codos pegados al cuerpo; abre la cuerda al final y aprieta.' },
  { id: 'press-frances', name: 'Press francés con barra Z', muscle: 'triceps', eq: 'barra', kind: 'aislamiento', ratio: [0.2, 0.32, 0.45], tip: 'Acostado, baja la barra hacia la frente moviendo solo el codo.' },
  { id: 'ext-trasnuca-manc', name: 'Extensión tras nuca con mancuerna', muscle: 'triceps', eq: 'mancuerna', kind: 'aislamiento', ratio: [0.14, 0.22, 0.3], single: true, avoid: ['hombro'], tip: 'Sujeta una mancuerna con ambas manos; codos apuntando al techo.' },
  { id: 'patada-triceps-manc', name: 'Patada de tríceps con mancuerna', muscle: 'triceps', eq: 'mancuerna', kind: 'aislamiento', ratio: [0.06, 0.1, 0.14], single: true, tip: 'Brazo paralelo al piso; extiende completo y aprieta 1 s.' },
  { id: 'lagartijas-diamante', name: 'Lagartijas diamante', muscle: 'triceps', secondary: ['pecho'], eq: 'corporal', kind: 'compuesto', tip: 'Manos juntas formando un diamante; codos rozando el torso.' },
  { id: 'fondos-banco', name: 'Fondos en banco', muscle: 'triceps', eq: 'corporal', kind: 'aislamiento', avoid: ['hombro'], tip: 'Manos en el borde del banco, cadera cerca. Baja hasta 90° de codo.' },

  // ── Espalda
  { id: 'jalon-pecho', name: 'Jalón al pecho en polea', muscle: 'espalda', secondary: ['biceps'], eq: 'polea', kind: 'compuesto', ratio: [0.5, 0.75, 1.0], tip: 'Pecho arriba, lleva la barra a la clavícula llevando los codos hacia las costillas.' },
  { id: 'dominadas', name: 'Dominadas', muscle: 'espalda', secondary: ['biceps'], eq: 'corporal', kind: 'compuesto', hard: true, adv: true, tip: 'Desde brazos estirados, sube hasta pasar la barbilla. Sin balanceo.' },
  { id: 'remo-invertido', name: 'Remo invertido', muscle: 'espalda', secondary: ['biceps'], eq: 'corporal', kind: 'compuesto', tip: 'En barra baja o mesa firme; cuerpo recto, lleva el pecho a la barra.' },
  { id: 'remo-barra', name: 'Remo con barra', muscle: 'espalda', secondary: ['biceps'], eq: 'barra', kind: 'compuesto', ratio: [0.5, 0.8, 1.1], avoid: ['lumbar'], adv: true, tip: 'Torso a 45°, espalda neutra. Jala la barra al ombligo.' },
  { id: 'remo-polea-baja', name: 'Remo sentado en polea', muscle: 'espalda', secondary: ['biceps'], eq: 'polea', kind: 'compuesto', ratio: [0.5, 0.75, 1.0], tip: 'Pecho alto, jala al abdomen juntando escápulas; regresa estirando sin encorvarte.' },
  { id: 'remo-maquina', name: 'Remo en máquina con pecho apoyado', muscle: 'espalda', secondary: ['biceps'], eq: 'maquina', kind: 'compuesto', ratio: [0.5, 0.8, 1.1], tip: 'Pecho pegado al soporte; ideal si cuidas la zona lumbar.' },
  { id: 'remo-manc', name: 'Remo con mancuerna a una mano', muscle: 'espalda', secondary: ['biceps'], eq: 'mancuerna', kind: 'compuesto', ratio: [0.25, 0.4, 0.55], single: true, tip: 'Rodilla y mano en el banco; lleva la mancuerna a la cadera.' },
  { id: 'pullover-polea', name: 'Pullover en polea alta', muscle: 'espalda', eq: 'polea', kind: 'aislamiento', ratio: [0.2, 0.3, 0.4], tip: 'Brazos casi rectos; baja la barra hasta los muslos activando dorsales.' },
  { id: 'pullover-manc', name: 'Pullover con mancuerna', muscle: 'espalda', secondary: ['pecho'], eq: 'mancuerna', kind: 'aislamiento', ratio: [0.15, 0.25, 0.35], single: true, avoid: ['hombro'], tip: 'Acostado transversal al banco; arco amplio detrás de la cabeza.' },
  { id: 'superman', name: 'Superman', muscle: 'espalda', eq: 'corporal', kind: 'aislamiento', tip: 'Boca abajo, eleva brazos y piernas 2 s sin forzar el cuello.' },

  // ── Bíceps
  { id: 'curl-barra', name: 'Curl con barra', muscle: 'biceps', eq: 'barra', kind: 'aislamiento', ratio: [0.22, 0.35, 0.48], tip: 'Codos fijos a los costados; sube sin balancear y baja en 3 s.' },
  { id: 'curl-manc-alterno', name: 'Curl alterno con mancuernas', muscle: 'biceps', eq: 'mancuerna', kind: 'aislamiento', ratio: [0.09, 0.14, 0.2], tip: 'Gira la palma hacia arriba al subir (supinación).' },
  { id: 'curl-polea', name: 'Curl en polea baja', muscle: 'biceps', eq: 'polea', kind: 'aislamiento', ratio: [0.2, 0.3, 0.42], tip: 'Tensión constante; aprieta arriba 1 s.' },
  { id: 'curl-martillo', name: 'Curl martillo', muscle: 'biceps', eq: 'mancuerna', kind: 'aislamiento', ratio: [0.1, 0.16, 0.22], tip: 'Palmas enfrentadas; trabaja braquial y antebrazo.' },
  { id: 'curl-mochila', name: 'Curl con mochila o garrafón', muscle: 'biceps', eq: 'corporal', kind: 'aislamiento', tip: 'Llena una mochila o garrafón; codos fijos y movimiento lento.' },

  // ── Cuádriceps
  { id: 'sentadilla', name: 'Sentadilla con barra', muscle: 'cuadriceps', secondary: ['gluteo', 'femoral'], eq: 'barra', kind: 'compuesto', ratio: [0.75, 1.25, 1.75], avoid: ['rodilla', 'lumbar'], adv: true, tip: 'Pies al ancho de hombros, rodillas siguen la punta del pie. Baja al menos a paralelo con el pecho alto.' },
  { id: 'prensa', name: 'Prensa de piernas', muscle: 'cuadriceps', secondary: ['gluteo'], eq: 'maquina', kind: 'compuesto', ratio: [1.6, 2.4, 3.3], tip: 'Espalda baja pegada al respaldo; baja hasta 90° sin despegar la cadera.' },
  { id: 'hack', name: 'Sentadilla hack', muscle: 'cuadriceps', secondary: ['gluteo'], eq: 'maquina', kind: 'compuesto', ratio: [0.8, 1.3, 1.8], avoid: ['rodilla'], tip: 'Pies a media plataforma; baja profundo y controlado.' },
  { id: 'sentadilla-goblet', name: 'Sentadilla goblet con mancuerna', muscle: 'cuadriceps', secondary: ['gluteo'], eq: 'mancuerna', kind: 'compuesto', ratio: [0.25, 0.4, 0.55], single: true, tip: 'Mancuerna pegada al pecho; codos por dentro de las rodillas al bajar.' },
  { id: 'sentadilla-corporal', name: 'Sentadilla con peso corporal', muscle: 'cuadriceps', secondary: ['gluteo'], eq: 'corporal', kind: 'compuesto', tip: 'Brazos al frente para equilibrio; baja 3 s y sube explosivo.' },
  { id: 'bulgara', name: 'Sentadilla búlgara con mancuernas', muscle: 'cuadriceps', secondary: ['gluteo'], eq: 'mancuerna', kind: 'compuesto', ratio: [0.12, 0.2, 0.3], avoid: ['rodilla'], tip: 'Pie trasero en el banco; torso ligeramente inclinado para más glúteo.' },
  { id: 'zancadas-manc', name: 'Zancadas con mancuernas', muscle: 'cuadriceps', secondary: ['gluteo'], eq: 'mancuerna', kind: 'compuesto', ratio: [0.14, 0.22, 0.32], avoid: ['rodilla'], tip: 'Paso largo; la rodilla de atrás casi toca el piso.' },
  { id: 'zancada-corporal', name: 'Zancadas alternas', muscle: 'cuadriceps', secondary: ['gluteo'], eq: 'corporal', kind: 'compuesto', avoid: ['rodilla'], tip: 'Torso erguido; empuja con el talón de la pierna de adelante.' },
  { id: 'ext-cuadriceps', name: 'Extensión de cuádriceps en máquina', muscle: 'cuadriceps', eq: 'maquina', kind: 'aislamiento', ratio: [0.45, 0.7, 0.95], avoid: ['rodilla'], tip: 'Sube hasta extender y aprieta 1 s arriba; baja en 3 s.' },

  // ── Femoral y glúteo
  { id: 'peso-muerto-rumano', name: 'Peso muerto rumano con barra', muscle: 'femoral', secondary: ['gluteo', 'espalda'], eq: 'barra', kind: 'compuesto', ratio: [0.6, 1.0, 1.4], avoid: ['lumbar'], tip: 'Cadera atrás con rodillas suaves; la barra roza los muslos. Espalda neutra siempre.' },
  { id: 'rumano-manc', name: 'Peso muerto rumano con mancuernas', muscle: 'femoral', secondary: ['gluteo'], eq: 'mancuerna', kind: 'compuesto', ratio: [0.25, 0.4, 0.55], avoid: ['lumbar'], tip: 'Mancuernas pegadas a las piernas; baja hasta sentir el estiramiento del femoral.' },
  { id: 'curl-femoral', name: 'Curl femoral acostado', muscle: 'femoral', eq: 'maquina', kind: 'aislamiento', ratio: [0.3, 0.45, 0.62], tip: 'Cadera pegada al banco; flexiona fuerte y baja lento.' },
  { id: 'puente-una-pierna', name: 'Puente de glúteo a una pierna', muscle: 'femoral', secondary: ['gluteo'], eq: 'corporal', kind: 'aislamiento', tip: 'Talón apoyado, empuja la cadera arriba y sostén 1 s.' },
  { id: 'hip-thrust', name: 'Hip thrust con barra', muscle: 'gluteo', secondary: ['femoral'], eq: 'barra', kind: 'compuesto', ratio: [0.8, 1.4, 2.0], tip: 'Espalda alta en el banco; mentón al pecho y extiende la cadera apretando glúteo 1 s.' },
  { id: 'hip-thrust-manc', name: 'Hip thrust con mancuerna', muscle: 'gluteo', secondary: ['femoral'], eq: 'mancuerna', kind: 'compuesto', ratio: [0.3, 0.45, 0.6], single: true, tip: 'Mancuerna sobre la cadera; pausa de 2 s arriba.' },
  { id: 'puente-gluteo', name: 'Puente de glúteo', muscle: 'gluteo', secondary: ['femoral'], eq: 'corporal', kind: 'aislamiento', tip: 'Talones cerca de la cadera; sube y aprieta 2 s.' },
  { id: 'abduccion', name: 'Abducción de cadera en máquina', muscle: 'gluteo', eq: 'maquina', kind: 'aislamiento', ratio: [0.45, 0.7, 0.95], tip: 'Torso ligeramente al frente para glúteo medio; abre y sostén 1 s.' },
  { id: 'patada-gluteo-polea', name: 'Patada de glúteo en polea', muscle: 'gluteo', eq: 'polea', kind: 'aislamiento', ratio: [0.1, 0.16, 0.22], tip: 'Pierna casi recta hacia atrás sin arquear la espalda baja.' },
  { id: 'patada-gluteo-corporal', name: 'Patada de glúteo en cuadrupedia', muscle: 'gluteo', eq: 'corporal', kind: 'aislamiento', tip: 'En 4 puntos, empuja el talón al techo; abdomen firme.' },

  // ── Pantorrilla
  { id: 'pantorrilla-pie', name: 'Elevación de talones de pie (máquina)', muscle: 'pantorrilla', eq: 'maquina', kind: 'aislamiento', ratio: [0.8, 1.3, 1.8], tip: 'Rango completo: estira abajo 1 s y sube a la punta 1 s.' },
  { id: 'pantorrilla-manc', name: 'Elevación de talones con mancuernas', muscle: 'pantorrilla', eq: 'mancuerna', kind: 'aislamiento', ratio: [0.15, 0.25, 0.35], tip: 'En un escalón para mayor rango.' },
  { id: 'pantorrilla-corporal', name: 'Elevación de talones a una pierna', muscle: 'pantorrilla', eq: 'corporal', kind: 'aislamiento', tip: 'Apóyate en la pared; sube lento con una pierna a la vez.' },

  // ── Abdomen
  { id: 'crunch-polea', name: 'Crunch en polea alta', muscle: 'abdomen', eq: 'polea', kind: 'aislamiento', ratio: [0.35, 0.5, 0.7], tip: 'De rodillas; enrolla el torso llevando los codos a los muslos.' },
  { id: 'plancha', name: 'Plancha frontal', muscle: 'abdomen', eq: 'corporal', kind: 'aislamiento', timed: '30–45 s', fixedSeconds: 50, tip: 'Codos bajo hombros, glúteo apretado; no dejes caer la cadera.' },
  { id: 'dead-bug', name: 'Dead bug', muscle: 'abdomen', eq: 'corporal', kind: 'aislamiento', tip: 'Espalda baja pegada al piso; extiende brazo y pierna contraria lento.' },
  { id: 'elev-piernas', name: 'Elevación de piernas colgado', muscle: 'abdomen', eq: 'corporal', kind: 'aislamiento', adv: true, avoid: ['lumbar'], tip: 'Sin balanceo; sube las rodillas al pecho enrollando la pelvis.' },
  { id: 'mountain-climbers', name: 'Mountain climbers', muscle: 'abdomen', eq: 'corporal', kind: 'aislamiento', timed: '30 s', fixedSeconds: 40, tip: 'Posición de lagartija; lleva rodillas al pecho rápido y alterno.' },

  // ── Recuperación / cardio
  { id: 'cardio-z2', name: 'Cardio zona 2 (bici, elíptica o caminadora inclinada)', muscle: 'abdomen', eq: 'cardio', kind: 'cardio', fixedSeconds: 1200, tip: 'Ritmo en el que puedes hablar en frases completas (60–70% FC máx).' },
  { id: 'movilidad', name: 'Circuito de movilidad (cadera, columna torácica, hombro)', muscle: 'abdomen', eq: 'cardio', kind: 'cardio', fixedSeconds: 480, tip: '90/90 de cadera, rotaciones torácicas, círculos de hombro: 1 min cada uno.' },
];

export const EXERCISES: Record<string, Exercise> = Object.fromEntries(LIST.map((e) => [e.id, e]));
export const EXERCISE_COUNT = LIST.filter((e) => e.kind !== 'cardio').length;
