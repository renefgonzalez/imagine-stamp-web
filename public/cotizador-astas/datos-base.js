// ============================================================================
// DATOS BASE REALES — ASTAS Y MANTENIMIENTO (CHALCO, EDO. MÉX.)
// Fuente principal: costos reales de taller y proveedores de René.
// El acero se actualiza 1 o 2 veces al mes; la IA solo entra como soporte.
// ============================================================================

const AJUSTES_DEFAULT = {
  empresa_nombre: 'ASTAS Y MANTENIMIENTO',
  empresa_subtitulo: 'Ingeniería, Fabricación y Mantenimiento de Astas Bandera',
  director_nombre: 'Lic. René Félix González Granados',
  director_cargo: 'Dirección General',
  ubicacion_planta: 'Chalco, Estado de México',
  telefono: '56-6004-0372',
  whatsapp_intl: '525660040372',
  correo: 'astasymantenimiento@gmail.com',
  sitio_web: 'https://astasymantenimiento.com',
  factor_default: 3.5,
  anticipo_default: 75,
  vigencia_default: 30,
  iva_pct: 16,
  // Parámetros operativos de viaje desde Chalco, Edo. Méx.
  gasolina_litro: 24.5,
  rendimiento_km_litro: 10,
  desgaste_por_km: 1.8,
  comida_persona_dia: 250,
  sueldo_oficial_dia: 1000,
  sueldo_ayudante_dia: 600,
  hotel_noche_default: 1900,
  factor_viaje_default: 1.35,
  dias_alerta_acero: 18, // Aviso quincenal/mensual para refrescar precios de acero
  // Datos bancarios opcionales (solo aparecen en el PDF si se activa el switch)
  banco_nombre: '',
  banco_titular: 'René Félix González Granados',
  banco_clabe: '',
  banco_cuenta: '',
  rfc_emisor: '',
  consecutivo_folio: 1,
};

const OPCIONES_MATERIAL = [
  'Acero al Carbón Cédula 40 (ASTM A36 / A53)',
  'Acero Estructural Alta Resistencia ASTM A572 Gr. 50',
  'Acero Inoxidable AISI 304',
  'Acero Inoxidable Grado Marino AISI 316',
  'Aluminio Estructural Anodizado',
  'Acero Galvanizado por Inmersión en Caliente (HDG)',
  'Latón Brillante / Uso Institucional de Interior',
  'Textil Reglamentario Nylon Ripstop / Poliéster UV',
];

const OPCIONES_PINTURA = [
  { id: 'esmalte', label: 'Pintura Normal — Esmalte Anticorrosivo Industrial', extraPct: 0 },
  { id: 'epoxica', label: 'Pintura Epóxica + Poliuretano Alifático Alta Resistencia UV', extraPct: 12 },
  { id: 'electrostatica', label: 'Pintura Electrostática Horneada en Polvo', extraPct: 10 },
  { id: 'galvanizado_epoxico', label: 'Sistema Marino: Primario Rico en Zinc + Epóxico + Poliuretano', extraPct: 18 },
  { id: 'pulido_inox', label: 'Acabado Satinado / Pulido Espejo (Acero Inoxidable)', extraPct: 0 },
  { id: 'sin_pintura', label: 'Sin recubrimiento / Acero natural o textil', extraPct: 0 },
];

const COLORES_SUGERIDOS = [
  'Color a elegir',
  'Blanco Institucional',
  'Gris Acero / Plata Metálico',
  'Negro Mate Estructural',
  'Verde Institucional',
  'Bronce / Latonado',
  'Pulido Natural Inoxidable',
];

// Catálogo inicial con tus costos reales sin IVA (actualizables 1-2 veces al mes)
const INSUMOS_INICIALES = [
  {
    codigo: 'BASE-ASTA-10C',
    categoria: 'Acero y Tubería',
    nombre: 'Paquete Materiales Asta 10m Acero al Carbón (Tubo $1,007 + Matraca/Cable $2,650 + Poleas/Pintura $500)',
    unidad: 'juego',
    costo_sin_iva: 4157.00,
    proveedor: 'Base Taller René',
    notas: 'Referencia real asta 10m ced 40',
  },
  {
    codigo: 'AC-TUB-10M',
    categoria: 'Acero y Tubería',
    nombre: 'Tubería Estructural Asta 10m (6" y 4" Cédula 40 + Placa base 400x400mm + Cartabones)',
    unidad: 'lote',
    costo_sin_iva: 1007.00,
    proveedor: 'Proveedor Acero',
    notas: 'Revisar 1-2 veces al mes por variación del acero',
  },
  {
    codigo: 'BASE-ASTA-762',
    categoria: 'Acero y Tubería',
    nombre: 'Paquete Materiales Asta 25 pies (7.62m) Acero al Carbón Céd. 40 completa',
    unidad: 'juego',
    costo_sin_iva: 3767.40,
    proveedor: 'Base Taller René',
    notas: 'Escala real 25 pies (venta x3.5 = $13,186 + IVA)',
  },
  {
    codigo: 'BASE-ASTA-914',
    categoria: 'Acero y Tubería',
    nombre: 'Paquete Materiales Asta 30 pies (9.14m) Acero al Carbón Céd. 40 completa',
    unidad: 'juego',
    costo_sin_iva: 4070.30,
    proveedor: 'Base Taller René',
    notas: 'Escala real 30 pies (venta x3.5 = $14,246 + IVA)',
  },
  {
    codigo: 'BASE-ASTA-15M',
    categoria: 'Acero y Tubería',
    nombre: 'Paquete Materiales Asta 15m Acero al Carbón Céd. 40 (secciones cónicas/escalonadas)',
    unidad: 'juego',
    costo_sin_iva: 8450.00,
    proveedor: 'Proveedor Acero',
    notas: 'Revisar calibre y tramos según viento',
  },
  {
    codigo: 'BASE-ASTA-20M',
    categoria: 'Acero y Tubería',
    nombre: 'Paquete Materiales Asta 20m Monumental Acero Estructural A36/A572',
    unidad: 'juego',
    costo_sin_iva: 14900.00,
    proveedor: 'Proveedor Acero',
    notas: 'Revisar peso por tonelada vigente del mes',
  },
  {
    codigo: 'AC-CANASTILLA',
    categoria: 'Acero y Tubería',
    nombre: 'Canastilla de Anclaje (Pernos alta resistencia + tuercas niveladoras + plantilla)',
    unidad: 'juego',
    costo_sin_iva: 1450.00,
    proveedor: 'Taller Chalco',
    notas: 'Se envía con plano técnico para colado f\'c 250 local',
  },
  {
    codigo: 'KIT-IZAJE-MAN',
    categoria: 'Izaje y Herrajes',
    nombre: 'Material diverso de izaje manual (Matraca, cable de acero, herrajes y esfera remate)',
    unidad: 'kit',
    costo_sin_iva: 2650.00,
    proveedor: 'Ferretería Industrial',
    notas: 'Base real cotización 10m',
  },
  {
    codigo: 'CAB-GALV-316',
    categoria: 'Izaje y Herrajes',
    nombre: 'Kit 30m Cable de Acero Galvanizado 3/16" + Polea 3"',
    unidad: 'kit',
    costo_sin_iva: 1404.00,
    proveedor: 'Home Depot / Ferretera',
    notas: 'Para astas de 8m a 12m',
  },
  {
    codigo: 'CAB-INOX-316',
    categoria: 'Izaje y Herrajes',
    nombre: 'Kit 30m Cable de Acero Inoxidable 3/16" + Polea Industrial',
    unidad: 'kit',
    costo_sin_iva: 3722.00,
    proveedor: 'La Megacentral',
    notas: '$4,318 c/IVA -> $3,722 s/IVA',
  },
  {
    codigo: 'CAB-GALV-14',
    categoria: 'Izaje y Herrajes',
    nombre: 'Rollo 75m Cable de Acero Galvanizado 1/4" (astas 20m a 25m)',
    unidad: 'rollo',
    costo_sin_iva: 1823.00,
    proveedor: 'AKSI / Industrial',
    notas: '$2,115 c/IVA -> $1,823 s/IVA',
  },
  {
    codigo: 'CAB-INOX-14',
    categoria: 'Izaje y Herrajes',
    nombre: 'Rollo 60m Cable de Acero Inoxidable 1/4" (astas monumentales)',
    unidad: 'rollo',
    costo_sin_iva: 4872.00,
    proveedor: 'Monperne',
    notas: '$5,652 c/IVA -> $4,872 s/IVA',
  },
  {
    codigo: 'POL-IND-PAR',
    categoria: 'Izaje y Herrajes',
    nombre: 'Par de Poleas Industriales con Rodamiento de Alta Carga',
    unidad: 'par',
    costo_sin_iva: 1774.00,
    proveedor: 'La Megacentral',
    notas: '$2,058 c/IVA -> $1,774 s/IVA',
  },
  {
    codigo: 'MOT-NMRV075-2HP',
    categoria: 'Motorización',
    nombre: 'Motorreductor Corona-Sinfín NMRV075 (T-75) 2 HP Trifásico 220/440V rel. 30:1 flecha 1-1/4"',
    unidad: 'pieza',
    costo_sin_iva: 10800.00,
    proveedor: 'Mairsa / HAB',
    notas: 'Rango $9,107 a $13,370 s/IVA (astas 10m a 15m)',
  },
  {
    codigo: 'MOT-NMRV090-2HP',
    categoria: 'Motorización',
    nombre: 'Motorreductor Corona-Sinfín NMRV090 2 HP Trifásico 220/440V (astas 20m a 25m)',
    unidad: 'pieza',
    costo_sin_iva: 13500.00,
    proveedor: 'Mairsa / HAB',
    notas: 'Rango $12,053 a $15,516 s/IVA',
  },
  {
    codigo: 'TAB-VARIADOR',
    categoria: 'Motorización',
    nombre: 'Tablero de Control con Variador de Frecuencia (arranque/freno suave + botonera y paros)',
    unidad: 'pieza',
    costo_sin_iva: 8404.00,
    proveedor: 'Equipos Industriales HAB',
    notas: '$9,749 c/IVA -> $8,404 s/IVA',
  },
  {
    codigo: 'PIN-ESMALTE',
    categoria: 'Pintura y Recubrimientos',
    nombre: 'Lote Poleas base + Pintura Esmalte Anticorrosivo Normal (asta 10m)',
    unidad: 'lote',
    costo_sin_iva: 500.00,
    proveedor: 'Pinturas Industrial',
    notas: 'Acabado estándar',
  },
  {
    codigo: 'PIN-EPOXICA',
    categoria: 'Pintura y Recubrimientos',
    nombre: 'Kit Primario Epóxico Catalizado + Esmalte Poliuretano Alifático UV (asta 10m)',
    unidad: 'kit',
    costo_sin_iva: 1650.00,
    proveedor: 'Recubrimientos Industriales',
    notas: 'Alta resistencia intemperie / costa / industrial',
  },
  {
    codigo: 'BAN-150-250',
    categoria: 'Banderas y Escritorio',
    nombre: 'Bandera Nacional Reglamentaria 1.50 x 2.50 m Nylon Ripstop con Protección UV (astas 6-12m)',
    unidad: 'pieza',
    costo_sin_iva: 980.00,
    proveedor: 'Taller Textil',
    notas: 'Con ojillos reforzados y cinta de lona',
  },
  {
    codigo: 'BAN-300-500',
    categoria: 'Banderas y Escritorio',
    nombre: 'Bandera Monumental Plaza Pública 3.00 x 5.00 m Nylon Ripstop UV (astas 20-30m)',
    unidad: 'pieza',
    costo_sin_iva: 3400.00,
    proveedor: 'Taller Textil',
    notas: 'Costura triple aerodinámica',
  },
  {
    codigo: 'ESC-LATON-KIT',
    categoria: 'Banderas y Escritorio',
    nombre: 'Asta de Escritorio / Oficina en Latón Brillante 2.20m con Base Contrapeso + Bandera Gala',
    unidad: 'juego',
    costo_sin_iva: 1850.00,
    proveedor: 'Línea Institucional',
    notas: 'Para despachos, municipios y salas de juntas',
  },
];

// Rutas frecuentes saliendo de Chalco de Díaz Covarrubias, Edo. Méx.
const RUTAS_DESDE_CHALCO = [
  { id: 'local', nombre: 'Planta Chalco / CDMX / Área Metropolitana', km_redondos: 90, casetas: 0, dias: 1, noches: 0 },
  { id: 'puebla', nombre: 'Puebla, Pue. (San Marcos + San Martín)', km_redondos: 210, casetas: 452, dias: 1, noches: 0 },
  { id: 'pachuca', nombre: 'Pachuca, Hgo.', km_redondos: 230, casetas: 280, dias: 1, noches: 0 },
  { id: 'cuernavaca', nombre: 'Cuernavaca, Mor.', km_redondos: 195, casetas: 380, dias: 1, noches: 0 },
  { id: 'toluca', nombre: 'Toluca / Lerma, Edo. Méx.', km_redondos: 210, casetas: 420, dias: 1, noches: 0 },
  { id: 'queretaro', nombre: 'Querétaro, Qro.', km_redondos: 490, casetas: 860, dias: 1, noches: 0 },
  { id: 'veracruz', nombre: 'Veracruz / Boca del Río, Ver.', km_redondos: 760, casetas: 1580, dias: 2, noches: 1 },
  { id: 'tampico', nombre: 'Tampico / Cd. Madero, Tamps.', km_redondos: 980, casetas: 1650, dias: 2, noches: 1 },
  { id: 'monterrey', nombre: 'Monterrey / Santa Catarina, N.L.', km_redondos: 1874, casetas: 2144, dias: 3, noches: 2 },
  { id: 'guadalajara', nombre: 'Guadalajara, Jal.', km_redondos: 1160, casetas: 2290, dias: 2, noches: 1 },
  { id: 'custom', nombre: 'Otro destino (personalizado)...', km_redondos: 300, casetas: 500, dias: 1, noches: 0 },
];

// Plantillas rápidas de 1 toque para cotizar en segundos desde el celular
const PLANTILLAS_RAPIDAS = [
  {
    id: 'asta_10m_carbon',
    icono: '🏗️',
    boton: 'Asta 10m Carbón',
    categoria: 'Fabricación',
    concepto: 'Fabricación y suministro de Asta Bandera de 10 m en Acero al Carbón',
    descripcion: `- Asta bandera estructural de 10 metros de altura
- Sección inferior en tubo de 6" Cédula 40 y superior en tubo de 4" Cédula 40
- Placa base de acero estructural de 400 mm × 400 mm con cartabones de refuerzo
- Sistema de izaje manual con matraca de seguridad y cable de acero
- Aguilón giratorio superior con poleas y herrajes de elevación
- Esfera de remate latonada
- Recubrimiento y acabado industrial en color a elegir`,
    unidad: 'pieza',
    costo_unitario_directo: 4157.00,
    factor: 3.5,
  },
  {
    id: 'asta_25ft',
    icono: '📏',
    boton: 'Asta 25\' (7.62m)',
    categoria: 'Fabricación',
    concepto: 'Fabricación y suministro de Asta Bandera de 25\' (7.62 m)',
    descripcion: `- Asta bandera institucional de 7.62 m (25 pies) en tramos ensamblables
- Tubería de acero al carbón Cédula 40 soldada bajo norma AWS D1.1
- Placa base con cartabones y juego de anclas (canastilla)
- Sistema de izaje con driza de acero, matraca/cornamusa, polea y remate superior
- Acabado industrial anticorrosivo en color a elegir`,
    unidad: 'pieza',
    costo_unitario_directo: 3767.40,
    factor: 3.5,
  },
  {
    id: 'asta_30ft',
    icono: '📐',
    boton: 'Asta 30\' (9.14m)',
    categoria: 'Fabricación',
    concepto: 'Fabricación y suministro de Asta Bandera de 30\' (9.14 m)',
    descripcion: `- Asta bandera institucional de 9.14 m (30 pies) en tramos ensamblables
- Tubería de acero al carbón Cédula 40 soldada bajo norma AWS D1.1
- Placa base estructural con cartabones y canastilla de anclaje
- Sistema completo de izaje con cable de acero, poleas, herrajes y esfera de remate
- Acabado industrial anticorrosivo en color a elegir`,
    unidad: 'pieza',
    costo_unitario_directo: 4070.30,
    factor: 3.5,
  },
  {
    id: 'izaje_11m_motor',
    icono: '⚙️',
    boton: 'Izaje Eléctrico 11m',
    categoria: 'Izaje Motorizado',
    concepto: 'Suministro e instalación de Sistema de Izaje Motorizado para Asta de 10–15 m',
    descripcion: `- Motorreductor corona-sinfín tamaño NMRV075 (T-75) de 2 HP trifásico 220/440V rel. 30:1
- Flecha sólida de salida de 1-1/4" acoplada a tambor enrollador
- 30 m de cable de acero de 3/16" de alta resistencia y poleas industriales
- Mano de obra especializada de sustitución, ajuste y pruebas de carga`,
    unidad: 'servicio',
    costo_unitario_directo: 14500.00,
    factor: 2.2,
  },
  {
    id: 'izaje_25m_motor',
    icono: '⚡',
    boton: 'Izaje Monumental 25m',
    categoria: 'Izaje Motorizado',
    concepto: 'Sistema de Izaje Eléctrico Industrial con Variador para Asta Monumental (20–25 m)',
    descripcion: `- Motorreductor industrial NMRV090 de 2 HP trifásico 220/440V para carga pesada
- Tablero de control con variador de frecuencia (arranque y frenado suave) y botonera
- 60 a 75 m de cable de acero de 1/4" y 2 poleas industriales con rodamiento
- Instalación electromecánica, calibración de límites y puesta en marcha`,
    unidad: 'servicio',
    costo_unitario_directo: 28550.00,
    factor: 2.2,
  },
  {
    id: 'mantenimiento_gral',
    icono: '🛠️',
    boton: 'Mantenimiento / Pintura',
    categoria: 'Mantenimiento',
    concepto: 'Servicio de Mantenimiento Preventivo, Rehabilitación y Pintura de Asta Bandera',
    descripcion: `- Revisión estructural de fuste, placa base, pernos de anclaje y soldaduras
- Sustitución de driza (cable de acero) y lubricación técnica de poleas y aguilón
- Preparación mecánica de superficie y aplicación de recubrimiento anticorrosivo
- Pruebas de izaje y entrega de reporte técnico de operatividad`,
    unidad: 'servicio',
    costo_unitario_directo: 4800.00,
    factor: 2.5,
  },
  {
    id: 'bandera_reglamentaria',
    icono: '🇲🇽',
    boton: 'Bandera Reglamentaria',
    categoria: 'Banderas / Escritorio',
    concepto: 'Suministro de Bandera Nacional Reglamentaria en Nylon Ripstop con Protección UV',
    descripcion: `- Confeccionada bajo proporciones oficiales (Ley sobre el Escudo, la Bandera y el Himno Nacionales)
- Tela técnica Nylon Ripstop / Poliéster 150D repelente a humedad y rayos UV
- Costuras triples reforzadas en perímetro, esquinas en lona y ojillos metálicos`,
    unidad: 'pieza',
    costo_unitario_directo: 980.00,
    factor: 2.5,
  },
];
