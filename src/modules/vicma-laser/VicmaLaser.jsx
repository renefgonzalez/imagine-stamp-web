import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, X, MessageCircle, ArrowRight, ArrowUpRight,
  Crosshair, Zap, BadgeCheck, MapPin, Phone, Mail, Clock,
  FileUp, PenTool, Layers, ShieldCheck, Check, ChevronRight,
  Handshake, CircleDollarSign, Ruler, Timer, Instagram, Facebook, Send,
  Award, Users, Headset, Factory, Sparkles, Truck, Building2, Cog, Car, Home, Sprout,
  ChevronDown,
} from 'lucide-react';
import celosiaFachadas from './assets/celosia-fachadas.webp';
import celosiaPortones from './assets/celosia-portones.webp';
import celosiaPergolas from './assets/celosia-pergolas.webp';
import celosiaDivisiones from './assets/celosia-divisiones.webp';
import celosiaBarandal from './assets/celosia-barandal.webp';
import celosiaMuros from './assets/celosia-muros-decorativos.webp';
import videoFondo from './assets/video-fondo.mp4';

/* ================================================================
   VICMA LASER — Landing Page industrial (Single-File Application)
   Corte láser · Celosías metálicas · Maquila industrial
   ================================================================ */

/* ---------- Datos configurables (edita aquí) ---------- */
const WHATSAPP = '5215512345678'; // TODO: número real de WhatsApp (sin +)
const PHONE = '+52 55 1234 5678';
const EMAIL = 'contacto@vicmalaser.com';
const ADDRESS = 'Calle Industrial #123, Col. Centro, Ciudad de México';
const wa = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

/* ---------- Navegación ---------- */
const NAV_LINKS = [
  { label: 'Inicio', id: 'inicio' },
  { label: 'Corte Láser', id: 'corte-laser', children: [
    { label: 'Corte láser de fibra óptica', id: 'corte-fibra' },
    { label: 'Corte láser de Acero al Carbón', id: 'corte-acero-carbon' },
    { label: 'Corte láser de Acero Galvanizado', id: 'corte-galvanizado' },
    { label: 'Corte láser de Acero Inoxidable', id: 'corte-inoxidable' },
    { label: 'Corte láser de Aluminio', id: 'corte-aluminio' },
    { label: 'Corte láser de Cobre', id: 'corte-cobre' },
    { label: 'Corte láser de Hierro', id: 'corte-hierro' },
    { label: 'Corte láser de Latón', id: 'corte-laton' },
  ]},
  { label: 'Celosías Metálicas', id: 'celosias' },
  { label: 'Materiales', id: 'materiales' },
];

/* ---------- Corte Láser: 3 pilares ---------- */
const CORTE_FEATURES = [
  {
    icon: Crosshair,
    title: 'Precisión milimétrica',
    desc: 'Cortes limpios y exactos, sin rebabas ni deformaciones, pieza tras pieza.',
  },
  {
    icon: Zap,
    title: 'Velocidad industrial',
    desc: 'Maquila de alto volumen con tiempos de entrega que mantienen tu producción en marcha.',
  },
  {
    icon: BadgeCheck,
    title: 'Calidad garantizada',
    desc: 'Acabado superior y uniforme en cada lote. Control de calidad en todo el proceso.',
  },
];

/* ---------- Ventajas del Corte Láser Industrial ---------- */
const VENTAJAS_LASER = [
  { icon: Crosshair, title: 'Precisión Quirúrgica', desc: 'Tolerancias de ±0.1 mm en geometrías complejas. Cortes limpios sin rebabas que eliminan procesos de acabado secundarios.' },
  { icon: Zap, title: 'Velocidad Industrial', desc: 'Corte CNC de fibra óptica a máxima velocidad. Entregas de 24 a 72 horas en lotes de cualquier volumen.' },
  { icon: Zap, title: 'Versatilidad Total', desc: 'Cortamos desde lámina de 0.5 mm hasta placa de 25 mm en acero, inoxidable, aluminio, cobre, latón y más.' },
  { icon: ShieldCheck, title: 'ZAC Mínima', desc: 'Zona afectada por calor mínima: sin deformación, sin cambio de propiedades mecánicas en el borde de corte.' },
  { icon: Sparkles, title: 'Acabados de Fábrica', desc: 'Bordes lisos y perpendiculares listos para ensamblar, soldar o pintar sin procesos intermedios.' },
  { icon: CircleDollarSign, title: 'Optimización de Costos', desc: 'Anidamiento inteligente reduce desperdicio de material hasta 30%. Menos reprocesos = menor costo total.' },
];

/* ---------- Por qué elegir Vicma Laser ---------- */
const POR_QUE_ELEGIR = [
  { icon: Award, title: 'Experiencia Comprobada', desc: 'Años dominando el corte láser de fibra óptica. Cientos de proyectos entregados a tiempo en toda la industria mexicana.' },
  { icon: Zap, title: 'Tecnología de Punta', desc: 'Máquinas de fibra óptica de última generación con control numérico avanzado para la máxima precisión.' },
  { icon: Users, title: 'Equipo Experto', desc: 'Ingenieros y técnicos especializados que revisan cada archivo antes de cortar. Cero sorpresas.' },
  { icon: ShieldCheck, title: 'Calidad Rigorosa', desc: 'Control de calidad en cada lote: medición dimensional, inspección visual y certificado de conformidad.' },
  { icon: Truck, title: 'Logística Nacional', desc: 'Entregas en 24-72 h a toda la República. Embalaje industrial que protege tus piezas puerta a puerta.' },
  { icon: Headset, title: 'Acompañamiento Total', desc: 'Desde el archivo hasta la entrega: revisamos tu diseño, optimizamos el nido y te asesoramos en materiales.' },
  { icon: Factory, title: 'Maquila Integral', desc: 'Corte + doblez + soldadura + acabado bajo un mismo techo. Una sola orden de compra, cero dolores de cabeza.' },
];

/* ---------- Corte Láser por material (subpáginas expandibles) ---------- */
const CORTE_MATERIALES = [
  {
    id: 'corte-fibra', name: 'Fibra Óptica', tag: 'CNC de alta precisión',
    desc: 'Tecnología de fibra óptica para cortes CNC de alta precisión en todos los metales.',
    espesor: 'Lámina 0.5 mm – 6 mm · Placa hasta 25 mm',
    ventajas: ['Cortes sin rebabas en geometrías complejas', 'Entregas de 24 a 72 horas', 'Zona afectada por calor mínima', 'Repetibilidad exacta en grandes lotes'],
    aplicaciones: ['Componentes estructurales', 'Piezas para maquinaria', 'Señalética industrial', 'Prototipado rápido'],
  },
  {
    id: 'corte-acero-carbon', name: 'Acero al Carbón', tag: 'Resistencia y versatilidad',
    desc: 'El caballo de batalla de la industria: resistencia, durabilidad y costo accesible.',
    espesor: 'Lámina 0.5 mm – 20 mm · Placa hasta 25 mm',
    ventajas: ['Alta resistencia estructural', 'Excelente relación costo-beneficio', 'Cortes limpios sin rebabas', 'Ideal para piezas robustas'],
    aplicaciones: ['Estructuras y vigas', 'Componentes de maquinaria', 'Piezas automotrices', 'Maquinaria agrícola'],
  },
  {
    id: 'corte-galvanizado', name: 'Acero Galvanizado', tag: 'Protección anticorrosión',
    desc: 'Corte preciso que preserva la capa de zinc para máxima protección contra óxido.',
    espesor: 'Lámina 0.5 mm – 3 mm',
    ventajas: ['Protección anticorrosiva que se conserva', 'Bordes limpios sin descapado', 'Perfecto para exteriores', 'Bajo mantenimiento'],
    aplicaciones: ['Ductos de ventilación', 'Canaletas y techos', 'Estructuras exteriores', 'Soportes y herrajes'],
  },
  {
    id: 'corte-inoxidable', name: 'Acero Inoxidable', tag: 'Acabado premium',
    desc: 'Cortes limpios que conservan el acabado espejo o cepillado. Higiene y durabilidad.',
    espesor: 'Lámina 0.5 mm – 12 mm',
    ventajas: ['Conserva acabado espejo o cepillado', 'Resistente a corrosión', 'Fácil limpieza e higiene', 'Alta durabilidad estética'],
    aplicaciones: ['Equipo de cocina industrial', 'Barandales y pasamanos', 'Mobiliario premium', 'Paneles decorativos'],
  },
  {
    id: 'corte-aluminio', name: 'Aluminio', tag: 'Ligero y versátil',
    desc: 'Corte rápido y limpio en láminas de aluminio, ideal para poco peso.',
    espesor: 'Lámina 0.5 mm – 8 mm',
    ventajas: ['Peso ligero', 'Alta velocidad de corte', 'No se corroe', 'Fácil de pintar o anodizar'],
    aplicaciones: ['Señalética', 'Paneles y fachadas', 'Mobiliario ligero', 'Componentes automotrices'],
  },
  {
    id: 'corte-cobre', name: 'Cobre', tag: 'Conductividad y estética',
    desc: 'Corte de alta precisión en cobre con mínima deformación térmica.',
    espesor: 'Lámina 0.5 mm – 6 mm',
    ventajas: ['Excelente conductividad', 'Mínima deformación térmica', 'Cortes finos y detallados', 'Acabado estético cálido'],
    aplicaciones: ['Piezas eléctricas', 'Intercambiadores de calor', 'Elementos decorativos', 'Artesanía industrial'],
  },
  {
    id: 'corte-hierro', name: 'Hierro', tag: 'Robustez estructural',
    desc: 'Corte láser en hierro para forja, estructura y piezas pesadas de gran espesor.',
    espesor: 'Lámina 1 mm – 16 mm · Placa hasta 25 mm',
    ventajas: ['Máxima robustez', 'Cortes nítidos en gran espesor', 'Perfecto para forja', 'Alta resistencia a carga'],
    aplicaciones: ['Forja y herrería', 'Estructuras de carga', 'Portones y rejas', 'Maquinaria pesada'],
  },
  {
    id: 'corte-laton', name: 'Latón', tag: 'Estética dorada',
    desc: 'Corte fino en latón para piezas de alto detalle con acabado dorado.',
    espesor: 'Lámina 0.5 mm – 5 mm',
    ventajas: ['Acabado dorado elegante', 'Cortes finos de alta precisión', 'Ideal para detalles decorativos', 'Resistente a corrosión'],
    aplicaciones: ['Herrajes y bisagras', 'Joyería industrial', 'Placas conmemorativas', 'Detalle arquitectónico'],
  },
];

/* ---------- Aplicaciones Industriales ---------- */
const INDUSTRIAS = [
  { icon: Building2, name: 'Construcción', desc: 'Elementos estructurales, vigas, placas, perfiles y herrería arquitectónica.' },
  { icon: Cog, name: 'Maquinaria Industrial', desc: 'Componentes para maquinaria pesada y equipos industriales de precisión.' },
  { icon: Car, name: 'Automotriz', desc: 'Piezas para vehículos, chasis, soportes y componentes mecánicos.' },
  { icon: Zap, name: 'Energía', desc: 'Componentes para torres eólicas, solares y estructuras de transmisión.' },
  { icon: Home, name: 'Mobiliario y Decoración', desc: 'Piezas personalizadas para muebles y elementos decorativos.' },
  { icon: Sprout, name: 'Agroindustria', desc: 'Componentes para maquinaria agrícola y equipos de riego.' },
];

/* ---------- FAQ ---------- */
const FAQ = [
  { q: '¿Qué formatos de archivo aceptan para cotizar?', a: 'Aceptamos archivos DXF, DWG y PDF. También trabajamos con bocetos hechos a mano o fotografías con medidas de referencia.' },
  { q: '¿Cuál es el tiempo de entrega?', a: 'La mayoría de los pedidos se entregan en 24 a 72 horas, dependiendo del volumen y complejidad del proyecto.' },
  { q: '¿Hacen envíos a todo México?', a: 'Sí, enviamos a toda la República Mexicana con embalaje industrial que protege tus piezas puerta a puerta.' },
  { q: '¿Cuál es el espesor máximo que pueden cortar?', a: 'Cortamos lámina desde 0.5 mm hasta placa de 25 mm, dependiendo del material. Consulta la ficha de cada material para conocer su rango exacto.' },
  { q: '¿Cobran por el diseño?', a: 'No. Si no tienes tu diseño, nuestro equipo te ayuda a crearlo desde cero con tus medidas sin costo adicional.' },
  { q: '¿Hacen trabajos de una sola pieza?', a: 'Sí, trabajamos desde una sola pieza hasta producción en serie. No hay pedido demasiado pequeño ni demasiado grande.' },
  { q: '¿Tienen servicio de doblez y soldadura?', a: 'Sí, ofrecemos maquila integral: corte, doblez, soldadura y acabado bajo un mismo techo.' },
];

/* ---------- Contadores / Stats ---------- */
const STATS = [
  { value: '500+', label: 'Proyectos entregados' },
  { value: '100%', label: 'Clientes satisfechos' },
  { value: '24-72 h', label: 'Tiempo de entrega' },
  { value: '25 mm', label: 'Espesor máximo' },
];

/* ---------- Testimonios ---------- */
const TESTIMONIOS = [
  { nombre: 'Ricardo Méndez', rol: 'Gerente de Planta — Maquinaria Industrial', quote: 'Entregaron 400 piezas en 48 horas con una precisión impecable. Se volvieron nuestro proveedor de confianza para corte láser.' },
  { nombre: 'Fernanda Torres', rol: 'Arquitecta — Estudio de Diseño', quote: 'Las celosías para la fachada quedaron perfectas. El acabado superó lo que esperábamos y cumplieron en tiempo récord.' },
  { nombre: 'Jorge Salinas', rol: 'Director — Taller de Herrería', quote: 'Llevamos más de un año trabajando con ellos. Cortes limpios, sin rebabas y siempre puntuales. Recomendados al cien.' },
];

/* ---------- Celosías Metálicas ---------- */
const CELOSIAS = [
  { title: 'Fachadas', use: 'Revestimiento arquitectónico con sombra y ventilación.', img: celosiaFachadas },
  { title: 'Portones', use: 'Accesos resistentes con diseño personalizado.', img: celosiaPortones },
  { title: 'Pérgolas', use: 'Estructuras que filtran la luz con elegancia.', img: celosiaPergolas },
  { title: 'Divisiones', use: 'Separación de espacios con continuidad visual.', img: celosiaDivisiones },
  { title: 'Barandales', use: 'Protección y estética para escaleras y balcones.', img: celosiaBarandal },
  { title: 'Muros decorativos', use: 'Acabados de alto impacto para interiores y exteriores.', img: celosiaMuros },
];

/* ---------- Portafolio / Galería ---------- */
const PORTFOLIO_CATEGORIAS = ['Todas', 'Celosías', 'Piezas', 'Proceso'];
const PORTFOLIO = [
  { title: 'Fachada de celosía', categoria: 'Celosías', img: celosiaFachadas },
  { title: 'Portón residencial', categoria: 'Celosías', img: celosiaPortones },
  { title: 'Pérgola para terraza', categoria: 'Celosías', img: celosiaPergolas },
  { title: 'División de espacios', categoria: 'Celosías', img: celosiaDivisiones },
  { title: 'Barandal de escalera', categoria: 'Celosías', img: celosiaBarandal },
  { title: 'Muro decorativo', categoria: 'Celosías', img: celosiaMuros },
];

/* ---------- 4 pilares de confianza ---------- */
const CONFIANZA = [
  { icon: Handshake, title: 'Servicio inigualable', desc: 'Dedicación excepcional que forja relaciones sólidas y duraderas.' },
  { icon: CircleDollarSign, title: 'Precios transparentes', desc: 'Sabemos lo que cuesta un proyecto: tarifas honestas que cuidan tu presupuesto.' },
  { icon: Ruler, title: 'Exactitud', desc: 'Cada milímetro cuenta. Cada pieza es el reflejo de nuestro compromiso.' },
  { icon: Timer, title: 'Puntualidad', desc: 'Un retraso frena tu plan. Entregar a tiempo es parte de nuestra disciplina.' },
];

/* ---------- Materiales ---------- */
const MATERIALES = [
  { icon: Layers, name: 'Acero al Carbón', desc: 'El caballo de batalla para estructura y maquila general.' },
  { icon: ShieldCheck, name: 'Acero Inoxidable', desc: 'Resistente a la corrosión, ideal para exteriores y cocina.' },
  { icon: Zap, name: 'Aluminio', desc: 'Ligero y versátil para acabados y aplicaciones premium.' },
  { icon: Check, name: 'Acero Galvanizado', desc: 'Protección contra óxido para ambientes exigentes.' },
  { icon: CircleDollarSign, name: 'Cobre', desc: 'Conductividad y acabado premium para piezas especiales.' },
  { icon: Layers, name: 'Latón', desc: 'Estética dorada para herrajes, decoración y detallado fino.' },
];

/* ---------- Utilidades de animación ---------- */
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-600">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
      {children}
    </span>
  );
}

/* ---------- Formulario de cotización (arma mensaje de WhatsApp) ---------- */
function QuoteForm() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [material, setMaterial] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList).filter((f) => /\.(dxf|dwg|pdf|jpg|jpeg|png)$/i.test(f.name));
    setFiles((prev) => [...prev, ...arr].slice(0, 5));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fileNames = files.length ? `\nArchivos adjuntos: ${files.map((f) => f.name).join(', ')}` : '';
    const text = [
      'Hola VICMA LASER, quiero cotizar un proyecto.',
      '',
      `Nombre: ${nombre}`,
      telefono && `Teléfono: ${telefono}`,
      email && `Email: ${email}`,
      empresa && `Empresa: ${empresa}`,
      material && `Material: ${material}`,
      '',
      'Detalles del proyecto:',
      mensaje,
      fileNames,
    ]
      .filter(Boolean)
      .join('\n');
    setTimeout(() => {
      window.location.href = wa(text);
    }, 500);
  };

  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20';

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={inputCls}
          placeholder="Nombre (requerido)"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          className={inputCls}
          placeholder="Teléfono"
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={inputCls}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={inputCls}
          placeholder="Empresa"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
        />
      </div>
      <select
        className={inputCls}
        value={material}
        onChange={(e) => setMaterial(e.target.value)}
      >
        <option value="">Material (opcional)</option>
        <option>Acero al Carbón</option>
        <option>Acero Inoxidable</option>
        <option>Aluminio</option>
        <option>Acero Galvanizado</option>
        <option>Cobre</option>
        <option>Latón</option>
      </select>
      <textarea
        className={`${inputCls} min-h-[120px] resize-none`}
        placeholder="Describe tu proyecto: medidas, grosor, cantidades, dibujos de referencia…"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />

      {/* Drag & drop de archivos */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
          dragging ? 'border-orange-500 bg-orange-50' : 'border-slate-300 bg-slate-50'
        }`}
      >
        <FileUp size={28} className="mx-auto text-orange-500" />
        <p className="mt-2 text-sm font-semibold text-slate-700">
          Arrastra y suelta tus archivos aquí
        </p>
        <p className="mt-1 text-xs text-slate-500">
          DXF, DWG, PDF o imágenes (máx. 5 archivos)
        </p>
        <label className="mt-3 inline-block cursor-pointer rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-500">
          Seleccionar archivos
          <input
            type="file"
            multiple
            accept=".dxf,.dwg,.pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>
        {files.length > 0 && (
          <ul className="mt-4 space-y-1 text-left">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-xs text-slate-600">
                <span className="truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="ml-2 shrink-0 text-slate-400 transition-colors hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-base font-bold text-white transition-all hover:bg-orange-600 active:scale-[0.98]"
      >
        <Send size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        Enviar cotización por WhatsApp
      </button>
      <p className="text-center text-xs text-slate-400">
        Te responderemos con una cotización sin compromiso.
      </p>
    </form>
  );
}

/* ---------- Acordeón de material (Fase 2: ventajas + aplicaciones + espesor) ---------- */
function MaterialCard({ material, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      id={material.id}
      className={`group scroll-mt-24 overflow-hidden rounded-2xl border transition-all ${
        open ? 'border-orange-300 shadow-lg shadow-orange-500/5' : 'border-slate-200 hover:border-orange-300'
      } bg-white`}
    >
      {/* Encabezado clickeable */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 p-6 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${open ? 'bg-orange-500 text-white' : 'bg-slate-900 text-white group-hover:bg-orange-500'}`}>
            <Layers size={22} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-slate-900">
              {material.name}
            </h3>
            <span className="mt-1 inline-block text-xs font-semibold uppercase tracking-wider text-orange-600">
              {material.tag}
            </span>
          </div>
        </div>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-transform ${open ? 'rotate-180 border-orange-300 text-orange-500' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </button>

      {/* Contenido expandible */}
      <div className={`grid transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6">
            <p className="text-sm leading-relaxed text-slate-600">{material.desc}</p>

            {/* Espesor */}
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <Ruler size={18} className="shrink-0 text-orange-500" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Rango de espesor</p>
                <p className="text-sm font-semibold text-slate-800">{material.espesor}</p>
              </div>
            </div>

            {/* Ventajas */}
            <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Ventajas</p>
            <ul className="mt-2 space-y-1.5">
              {material.ventajas.map((v) => (
                <li key={v} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check size={16} className="mt-0.5 shrink-0 text-orange-500" />
                  {v}
                </li>
              ))}
            </ul>

            {/* Aplicaciones */}
            <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Aplicaciones</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {material.aplicaciones.map((a) => (
                <span key={a} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  {a}
                </span>
              ))}
            </div>

            {/* CTA */}
            <a
              href={wa(`Hola VICMA LASER, quiero cotizar corte láser de ${material.name}.`)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-500"
            >
              Cotizar {material.name}
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Item FAQ ---------- */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-all ${open ? 'border-orange-300 bg-white' : 'border-slate-200 bg-white/60'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-lg font-bold uppercase tracking-tight text-slate-900">{q}</span>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-transform ${open ? 'rotate-180 border-orange-300 text-orange-500' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      <div className={`grid transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   COMPONENTE PRINCIPAL
   ================================================================ */
export default function VicmaLaser() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [privacidadOpen, setPrivacidadOpen] = useState(false);
  const [filtroPortafolio, setFiltroPortafolio] = useState('Todas');
  const [lightbox, setLightbox] = useState(null);

  // Scroll suave a sección SIN tocar el hash (evita romper el HashRouter)
  const goTo = (id) => (e) => {
    if (e) e.preventDefault();
    setMenuOpen(false);
    setOpenDropdown(null);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Detectar scroll para mostrar botón "volver arriba"
  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="font-body bg-gray-50 text-slate-800 antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Barlow Condensed', sans-serif; }
        .font-body { font-family: 'Barlow', sans-serif; }
        html { scroll-behavior: smooth; }
        /* Textura técnica sutil para fondos industriales */
        .metal-grid {
          background-image:
            linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <a href="#/vicma-laser" onClick={goTo('inicio')} className="font-display text-2xl font-bold tracking-tight">
              <span className="text-slate-900">VICMA</span>
              <span className="text-orange-500">LASER</span>
            </a>

            {/* Navegación desktop */}
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((l) =>
                l.children ? (
                  <div
                    key={l.id}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(l.id)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={goTo(l.id)}
                      className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      {l.label}
                      <ChevronRight size={14} className="rotate-90 text-slate-400" />
                    </button>
                    {openDropdown === l.id && (
                      <div className="absolute left-0 top-full w-72 pt-2">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/5">
                          {l.children.map((c) => (
                            <a
                              key={c.id}
                              href="#/vicma-laser"
                              onClick={goTo(c.id)}
                              className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                            >
                              {c.label}
                              <ChevronRight size={14} className="text-slate-300" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={l.id}
                    href="#/vicma-laser"
                    onClick={goTo(l.id)}
                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    {l.label}
                  </a>
                )
              )}
            </nav>

            {/* CTA WhatsApp */}
            <a
              href={wa('Hola VICMA LASER, quiero cotizar un proyecto.')}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-600 active:scale-[0.98] sm:inline-flex"
            >
              <MessageCircle size={16} />
              Cotizar por WhatsApp
            </a>

            {/* Botón menú móvil */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label="Abrir menú"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-slate-200 bg-white lg:hidden"
            >
              <div className="max-h-[80vh] overflow-y-auto">
                <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
                  {NAV_LINKS.map((l) =>
                    l.children ? (
                      <div key={l.id}>
                        <a
                          href="#/vicma-laser"
                          onClick={goTo(l.id)}
                          className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          {l.label}
                          <ChevronRight size={18} className="text-slate-400" />
                        </a>
                        <div className="ml-4 border-l border-slate-200 pl-3">
                          {l.children.map((c) => (
                            <a
                              key={c.id}
                              href="#/vicma-laser"
                              onClick={goTo(c.id)}
                              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:text-orange-600"
                            >
                              {c.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <a
                        key={l.id}
                        href="#/vicma-laser"
                        onClick={goTo(l.id)}
                        className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        {l.label}
                        <ChevronRight size={18} className="text-slate-400" />
                      </a>
                    )
                  )}
                  <a
                    href={wa('Hola VICMA LASER, quiero cotizar un proyecto.')}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-base font-semibold text-white"
                  >
                    <MessageCircle size={18} />
                    Cotizar por WhatsApp
                  </a>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===================== HERO ===================== */}
      <section id="inicio" className="relative flex min-h-[92vh] items-center overflow-hidden bg-slate-900">
        {/* Video de fondo */}
        <video
          src={videoFondo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover z-0"
        ></video>
        {/* Overlay oscuro */}
        <div className="absolute inset-0 z-10 bg-black/60" />
        {/* Vignette sutil para enfocar el centro */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/40" />

        {/* Badges de confianza superior */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center gap-4 px-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ENVÍOS A TODO MÉXICO
          </span>
        </div>

        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
              Maquila de corte láser industrial
            </span>

            <h1 className="font-display mt-6 text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
              Precisión Absoluta en{' '}
              <span className="text-orange-500">Corte Láser</span>.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200 sm:text-xl">
              Maquila de corte láser de metales en México. Cortes precisos, entregas rápidas y
              sin rebabas. Especialistas en celosías y maquila industrial.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#/vicma-laser"
                onClick={goTo('cotizar')}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-base font-bold text-white transition-all hover:bg-orange-600 active:scale-[0.98]"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">COTIZAR AHORA</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#/vicma-laser"
                onClick={goTo('cotizar')}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Subir archivo (DWG/DXF/PDF)
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>Servicio inigualable</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
                <span>Entregas 24-72 h</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>Envíos a todo México</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== 4 PILARES DE CONFIANZA ===================== */}
      <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CONFIANZA.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.07}>
                <div className="group flex flex-col items-center text-center p-4">
                  <div className="group relative flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 transition-all group-hover:bg-orange-500 group-hover:text-white">
                    <c.icon size={28} strokeWidth={1.75} />
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-display mt-5 text-xl font-bold uppercase tracking-tight text-slate-900">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500 max-w-xs">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== VENTAJAS DEL CORTE LÁSER ===================== */}
      <section className="bg-slate-50/50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto">
            <Eyebrow>Ventajas competitivas</Eyebrow>
            <h2 className="font-display mt-5 text-5xl font-bold uppercase leading-[1] tracking-tight text-slate-900 sm:text-6xl">
              Ventajas del Corte Láser <span className="text-orange-500">Industrial</span>
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-lg leading-relaxed text-slate-600">
              La tecnología de fibra óptica transforma la forma en que fabricas: precisión quirúrgica,
              velocidad industrial y versatilidad total en un solo proceso.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VENTAJAS_LASER.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 transition-all hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-white transition-all group-hover:bg-orange-500 group-hover:scale-105">
                    <v.icon size={28} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display mt-6 text-2xl font-bold uppercase tracking-tight text-slate-900">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{v.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-orange-600 group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={14} /> Ver detalle
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== POR QUÉ ELEGIR VICMA LASER ===================== */}
      <section className="bg-slate-900/95 py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-orange-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 metal-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto">
            <Eyebrow>Por qué elegirnos</Eyebrow>
            <h2 className="font-display mt-5 text-5xl font-bold uppercase leading-[1] tracking-tight text-white sm:text-6xl">
              ¿Por qué elegir <span className="text-orange-500">Vicma Laser</span>?
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-lg leading-relaxed text-slate-300">
              No solo cortamos metal. Entregamos certeza para que tu proyecto avance sin contratiempos.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {POR_QUE_ELEGIR.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="group flex flex-col items-center text-center p-4">
                  <div className="group relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 transition-all group-hover:bg-orange-500/10 group-hover:border-orange-500/30">
                    <p.icon size={28} strokeWidth={1.75} className="text-white group-hover:text-orange-400 transition-colors" />
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-display mt-5 text-xl font-bold uppercase tracking-tight text-white">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400 max-w-xs">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CORTE LÁSER ===================== */}
      <section id="corte-laser" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display max-w-3xl text-5xl font-bold uppercase leading-[1] tracking-tight text-slate-900 sm:text-6xl">
              Tecnología de corte <span className="text-orange-500">láser</span> de precisión
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Nuestro proceso combina maquinaria de última generación con técnicos especializados
              para entregar cortes rápidos, limpios y sin rebabas en cualquier geometría.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {CORTE_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl bg-slate-100 p-2 ring-1 ring-slate-200/60 transition-all hover:ring-orange-200">
                  <div className="h-full rounded-xl bg-white p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                      <f.icon size={26} strokeWidth={1.75} />
                    </div>
                    <h3 className="font-display mt-6 text-2xl font-bold uppercase tracking-tight text-slate-900">
                      {f.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-slate-600">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CORTE LÁSER POR MATERIAL ===================== */}
      <section id="corte-materiales" className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>Corte láser por material</Eyebrow>
            <h2 className="font-display mt-5 max-w-3xl text-5xl font-bold uppercase leading-[1] tracking-tight text-slate-900 sm:text-6xl">
              ¿Qué material <span className="text-orange-500">necesitas cortar</span>?
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Trabajamos lámina y placa en una amplia gama de metales. Da clic en cada material
              para conocer espesores, ventajas y aplicaciones.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {CORTE_MATERIALES.map((m, i) => (
              <Reveal key={m.id} delay={(i % 2) * 0.06} className="h-full">
                <MaterialCard material={m} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== APLICACIONES INDUSTRIALES ===================== */}
      <section id="industrias" className="bg-slate-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto">
            <Eyebrow>Industrias que servimos</Eyebrow>
            <h2 className="font-display mt-5 text-5xl font-bold uppercase leading-[1] tracking-tight text-slate-900 sm:text-6xl">
              Aplicaciones <span className="text-orange-500">Industriales</span>
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-lg leading-relaxed text-slate-600">
              Nuestro corte láser impulsa proyectos en los sectores más exigentes de México.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIAS.map((ind, i) => (
              <Reveal key={ind.name} delay={i * 0.06}>
                <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                    <ind.icon size={26} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display mt-6 text-2xl font-bold uppercase tracking-tight text-slate-900">
                    {ind.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{ind.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CELOSÍAS METÁLICAS ===================== */}
      <section id="celosias" className="metal-grid relative bg-slate-900 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>Arquitectura y diseño</Eyebrow>
            <h2 className="font-display mt-5 max-w-3xl text-5xl font-bold uppercase leading-[1] tracking-tight text-white sm:text-6xl">
              Celosías Metálicas para <span className="text-orange-500">Arquitectura</span> y Diseño
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              Ideales para fachadas, portones, pérgolas y divisiones de espacios. Diseños
              personalizados que combinan estética, funcionalidad y resistencia.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CELOSIAS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06} className="h-full">
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-orange-500/40">
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-slate-800">
                    <img
                      src={c.img}
                      alt={`Celosía metálica ${c.title} — Vicma Laser`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-3 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      Celosía · {c.title}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                      {c.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-slate-400">{c.use}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PORTAFOLIO / GALERÍA ===================== */}
      <section id="portafolio" className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto">
            <Eyebrow>Portafolio</Eyebrow>
            <h2 className="font-display mt-5 text-5xl font-bold uppercase leading-[1] tracking-tight text-slate-900 sm:text-6xl">
              Galería de <span className="text-orange-500">trabajos</span>
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-lg leading-relaxed text-slate-600">
              Una muestra de nuestros proyectos de corte láser y celosías metálicas.
            </p>
          </Reveal>

          {/* Filtros */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {PORTFOLIO_CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroPortafolio(cat)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  filtroPortafolio === cat
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de galería */}
          <motion.div layout className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {PORTFOLIO.filter((p) => filtroPortafolio === 'Todas' || p.categoria === filtroPortafolio).map((p) => (
                <motion.button
                  key={p.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setLightbox(p)}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-800 text-left"
                >
                  <img
                    src={p.img}
                    alt={`${p.title} — Vicma Laser`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-4 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="inline-block rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {p.categoria}
                    </span>
                    <h3 className="font-display mt-2 text-xl font-bold uppercase tracking-tight text-white">
                      {p.title}
                    </h3>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ===================== MATERIALES ===================== */}
      <section id="materiales" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Eyebrow>Materiales</Eyebrow>
            <h2 className="font-display mt-5 text-5xl font-bold uppercase leading-[1] tracking-tight text-slate-900 sm:text-6xl">
              Materiales que <span className="text-orange-500">trabajamos</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {MATERIALES.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.06}>
                <div className="group flex items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-orange-300 hover:shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-orange-500/10 group-hover:text-orange-600">
                    <m.icon size={22} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase tracking-tight text-slate-900">
                      {m.name}
                    </h3>
                    <p className="mt-1 leading-relaxed text-slate-600">{m.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section id="faq" className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <h2 className="font-display mt-5 text-5xl font-bold uppercase leading-[1] tracking-tight text-slate-900 sm:text-6xl">
              Resolvemos tus <span className="text-orange-500">dudas</span>
            </h2>
          </Reveal>

          <div className="mt-12 space-y-4">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.04}>
                <FaqItem q={f.q} a={f.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CONTADORES ===================== */}
      <section className="bg-slate-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.07}>
                <div className="text-center">
                  <div className="font-display text-5xl font-extrabold tracking-tight text-orange-500 sm:text-6xl">
                    {s.value}
                  </div>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIOS ===================== */}
      <section className="bg-slate-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto">
            <Eyebrow>Testimonios</Eyebrow>
            <h2 className="font-display mt-5 text-5xl font-bold uppercase leading-[1] tracking-tight text-slate-900 sm:text-6xl">
              Lo que dicen <span className="text-orange-500">nuestros clientes</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {TESTIMONIOS.map((t, i) => (
              <Reveal key={t.nombre} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5">
                  <div className="flex gap-1 text-orange-500">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26 6.6.64-5 4.36 1.5 6.74L12 16.9 5.99 20l1.5-6.74-5-4.36 6.6-.64z"/></svg>
                    ))}
                  </div>
                  <p className="mt-5 flex-1 leading-relaxed text-slate-600">"{t.quote}"</p>
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="font-display text-lg font-bold uppercase tracking-tight text-slate-900">
                      {t.nombre}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">{t.rol}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== COTICEMOS ===================== */}
      <section id="cotizar" className="bg-gray-100 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <h2 className="font-display mx-auto max-w-3xl text-5xl font-bold uppercase leading-[1] tracking-tight text-slate-900 sm:text-6xl">
              ¿Tienes un proyecto en mente?{' '}
              <span className="text-orange-500">Lo hacemos realidad.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
              No importa si es una pieza o miles: entre más clara tu información, más rápido te cotizamos.
            </p>
          </Reveal>

          {/* Estrategia dual */}
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {/* Opción 1: Ya tengo mi diseño */}
            <Reveal className="h-full">
              <div className="flex h-full flex-col rounded-3xl bg-slate-100 p-2 ring-1 ring-slate-200">
                <div className="flex h-full flex-col rounded-2xl bg-white p-8 lg:p-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500 text-white">
                    <FileUp size={26} />
                  </div>
                  <h3 className="font-display mt-6 text-3xl font-bold uppercase tracking-tight text-slate-900">
                    Ya tengo mi diseño
                  </h3>
                  <p className="mt-3 leading-relaxed text-slate-600">
                    Envíanos tu archivo y lo cortamos tal cual lo necesitas.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {['DXF', 'DWG', 'PDF'].map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-8">
                    <a
                      href={wa('Hola VICMA LASER, ya tengo mi diseño (DXF/DWG/PDF) y quiero cotizar.')}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
                    >
                      Enviar archivo
                      <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Opción 2: No tengo el diseño */}
            <Reveal delay={0.1} className="h-full">
              <div className="flex h-full flex-col rounded-3xl bg-slate-100 p-2 ring-1 ring-slate-200">
                <div className="flex h-full flex-col rounded-2xl bg-white p-8 lg:p-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <PenTool size={26} />
                  </div>
                  <h3 className="font-display mt-6 text-3xl font-bold uppercase tracking-tight text-slate-900">
                    No tengo el diseño
                  </h3>
                  <p className="mt-3 leading-relaxed text-slate-600">
                    Nuestro equipo te ayuda a crearlo desde cero con tus medidas y tu idea.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {['Medidas', 'Boceto', 'Idea'].map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-8">
                    <a
                      href={wa('Hola VICMA LASER, necesito asesoría para diseñar mi proyecto desde cero.')}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-base font-bold text-white transition-all hover:bg-orange-600 active:scale-[0.98]"
                    >
                      Necesito asesoría
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Proceso de 3 pasos + formulario */}
          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-start">
            {/* Pasos */}
            <Reveal>
              <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-slate-900">
                ¿Cómo cotizar?
              </h3>
              <div className="mt-6 space-y-4">
                {[
                  {
                    n: '1',
                    t: 'Sube tu archivo',
                    d: 'De preferencia en .DWG o .DXF. También aceptamos PDF o bocetos hechos a mano.',
                  },
                  {
                    n: '2',
                    t: 'Incluye los detalles clave',
                    d: 'Material, grosor y cantidades requeridas para una cotización precisa.',
                  },
                  {
                    n: '3',
                    t: 'Revisa y envía',
                    d: 'Asegúrate de que todo esté completo. Mientras más claro, más rápido te respondemos.',
                  },
                ].map((s) => (
                  <div key={s.n} className="flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 font-display text-xl font-bold text-white">
                      {s.n}
                    </div>
                    <div>
                      <h4 className="font-display text-xl font-bold uppercase tracking-tight text-slate-900">
                        {s.t}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Formulario */}
            <Reveal delay={0.1}>
              <div className="rounded-3xl bg-slate-100 p-2 ring-1 ring-slate-200">
                <div className="rounded-2xl bg-white p-8">
                  <QuoteForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            {/* Bloque 1: Logo + descripción */}
            <div>
              <a href="#/vicma-laser" onClick={goTo('inicio')} className="font-display text-3xl font-bold tracking-tight">
                <span className="text-white">VICMA</span>
                <span className="text-orange-500">LASER</span>
              </a>
              <p className="mt-4 max-w-xs leading-relaxed text-slate-400">
                Servicios de corte láser y fabricación de celosías metálicas para arquitectura,
                diseño e industria. Precisión y calidad en cada pieza.
              </p>
              <div className="mt-5 flex gap-3">
                <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-orange-500 hover:text-white">
                  <Facebook size={18} />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-orange-500 hover:text-white">
                  <Instagram size={18} />
                </a>
                <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-orange-500 hover:text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .58.05.85.13V9.4a6.33 6.33 0 0 0-.85-.05A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
                </a>
              </div>
            </div>

            {/* Bloque 2: Enlaces rápidos */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                Enlaces rápidos
              </h4>
              <ul className="mt-5 space-y-3">
                {NAV_LINKS.map((l) => (
                  <li key={l.id}>
                    <a
                      href="#/vicma-laser"
                      onClick={goTo(l.id)}
                      className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-orange-400"
                    >
                      <ChevronRight size={14} className="text-orange-500/60" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bloque 3: Contacto */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                Contacto
              </h4>
              <ul className="mt-5 space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-orange-500" />
                  <span className="text-slate-400">{ADDRESS}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0 text-orange-500" />
                  <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="text-slate-400 transition-colors hover:text-white">
                    {PHONE}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle size={18} className="shrink-0 text-green-500" />
                  <a
                    href={wa('Hola VICMA LASER, quiero más información.')}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    {PHONE} (WhatsApp)
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-orange-500" />
                  <a href={`mailto:${EMAIL}`} className="text-slate-400 transition-colors hover:text-white">
                    {EMAIL}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={18} className="shrink-0 text-orange-500" />
                  <span className="text-slate-400">Lun – Sáb · 9:00 a 18:00</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 lg:px-8">
            <p className="text-xs text-slate-500">
              © 2026 VICMA LASER. Todos los derechos reservados.
            </p>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <button
                onClick={() => setPrivacidadOpen(true)}
                className="text-xs text-slate-500 transition-colors hover:text-orange-400"
              >
                Aviso de privacidad
              </button>
              <p className="text-xs text-slate-500">
                Diseñado por{' '}
                <a
                  href="https://imagineandstamp.site"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-400 transition-colors hover:text-orange-400"
                >
                  IMAGINE &amp; STAMP
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ===================== BOTÓN VOLVER ARRIBA ===================== */}
      <button
        onClick={scrollTop}
        aria-label="Volver arriba"
        className={`fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 ${
          showTopBtn ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <ChevronDown size={22} className="rotate-180" />
      </button>

      {/* ===================== BOTÓN FLOTANTE WHATSAPP ===================== */}
      <a
        href={wa('Hola VICMA LASER, quiero cotizar un proyecto.')}
        target="_blank"
        rel="noreferrer"
        aria-label="Cotizar por WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] py-3.5 pl-4 pr-5 text-sm font-bold text-white shadow-xl shadow-[#25D366]/40 transition-all hover:scale-105 hover:bg-[#1ebe5d] active:scale-95"
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75"></span>
          <MessageCircle size={22} className="relative" />
        </span>
        Cotizar
      </a>

      {/* ===================== LIGHTBOX PORTAFOLIO ===================== */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[85vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-4 -right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-colors hover:bg-orange-600"
                aria-label="Cerrar"
              >
                <X size={22} />
              </button>
              <img
                src={lightbox.img}
                alt={lightbox.title}
                className="max-h-[75vh] w-full rounded-2xl object-contain"
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="inline-block rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {lightbox.categoria}
                  </span>
                  <h3 className="font-display mt-2 text-2xl font-bold uppercase tracking-tight text-white">
                    {lightbox.title}
                  </h3>
                </div>
                <a
                  href={wa(`Hola VICMA LASER, vi el proyecto "${lightbox.title}" en su portafolio y quiero algo similar.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1ebe5d]"
                >
                  <MessageCircle size={16} />
                  Quiero algo similar
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== MODAL AVISO DE PRIVACIDAD ===================== */}
      {privacidadOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setPrivacidadOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-slate-900">
                Aviso de Privacidad
              </h3>
              <button
                onClick={() => setPrivacidadOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                En <strong>VICMA LASER</strong> protegemos la privacidad de tus datos personales conforme
                a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
              </p>
              <p>
                Los datos que nos proporcionas a través de este sitio (nombre, teléfono, correo
                electrónico, empresa y archivos de proyecto) serán utilizados únicamente para atender
                tus solicitudes de cotización y dar seguimiento a tu proyecto.
              </p>
              <p>
                No compartimos, vendemos ni transferimos tu información a terceros sin tu
                consentimiento, salvo los casos previstos por la ley.
              </p>
              <p>
                Puedes ejercer tus derechos de acceso, rectificación, cancelación u oposición (ARCO)
                enviando un correo a nuestro equipo de contacto.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
