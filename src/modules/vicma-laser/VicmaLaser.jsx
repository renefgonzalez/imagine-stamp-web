import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, X, MessageCircle, ArrowRight, ArrowUpRight,
  Crosshair, Zap, BadgeCheck, MapPin, Phone, Mail, Clock,
  FileUp, PenTool, Layers, ShieldCheck, Check, ChevronRight,
  Handshake, CircleDollarSign, Ruler, Timer, Instagram, Facebook, Send,
  Award, Users, Headset, Factory, Sparkles, Truck, Building2, Cog, Car, Home, Sprout,
  ChevronDown, HelpCircle, FileText, Image as ImageIcon,
} from 'lucide-react';
import celosiaFachadas from './assets/celosia-fachadas.webp';
import celosiaPortones from './assets/celosia-portones.webp';
import celosiaPergolas from './assets/celosia-pergolas.webp';
import celosiaDivisiones from './assets/celosia-divisiones.webp';
import celosiaBarandal from './assets/celosia-barandal.webp';
import celosiaMuros from './assets/celosia-muros-decorativos.webp';
import videoFondo from './assets/video-fondo.mp4';
import videoPoster from './assets/video-poster.webp';

/* ================================================================
   VICMA LASER — Landing Page Industrial Multi-Página
   Corte láser · Celosías metálicas · Maquila industrial
   ================================================================ */

/* ---------- Datos configurables ---------- */
const WHATSAPP = '5215512345678'; // TODO: número real de WhatsApp
const PHONE = '+52 55 1234 5678';
const EMAIL = 'contacto@vicmalaser.com';
const ADDRESS = 'Calle Industrial #123, Col. Centro, Ciudad de México';
const wa = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

/* ---------- Subpáginas / Pestañas principales ---------- */
const NAV_PAGES = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'corte-laser', label: 'Corte Láser' },
  { id: 'celosias', label: 'Celosías Metálicas' },
  { id: 'materiales', label: 'Materiales' },
  { id: 'galeria', label: 'Galería' },
  { id: 'cotizar', label: 'Cotizar y FAQ' },
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

/* ---------- Corte Láser por material ---------- */
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
  { q: '¿Cuál es el espesor máximo que pueden cortar?', a: 'Cortamos lámina desde 0.5 mm hasta placa de 25 mm, dependiendo del material. Consulta la sección de Materiales para conocer su rango exacto.' },
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
  { icon: CircleDollarSign, title: 'Precios transparentes', desc: 'Tarifas honestas y competitivas que cuidan tu presupuesto.' },
  { icon: Ruler, title: 'Exactitud milimétrica', desc: 'Cada milímetro cuenta. Piezas con tolerancia de ±0.1 mm.' },
  { icon: Timer, title: 'Puntualidad de entrega', desc: 'Entregas de 24 a 72 horas para que tu producción nunca se detenga.' },
];

/* ---------- Componentes de UI reutilizables ---------- */
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-600 shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
      {children}
    </span>
  );
}

/* Banner de cabecera para subpáginas */
function SubpageHeader({ badge, title, highlight, desc }) {
  return (
    <div className="relative overflow-hidden bg-slate-900 py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-from)_0%,_transparent_70%)] from-orange-500/15 via-transparent to-transparent" />
      <div className="absolute inset-0 metal-grid opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          {badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400 backdrop-blur-sm shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
              {badge}
            </span>
          )}
          <h1 className="font-display mt-4 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
            {title} <span className="text-orange-500">{highlight}</span>
          </h1>
          {desc && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-xl">
              {desc}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Formulario de cotización ---------- */
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
          placeholder="Teléfono (requerido)"
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
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
          placeholder="Empresa o Taller"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
        />
      </div>
      <select
        className={inputCls}
        value={material}
        onChange={(e) => setMaterial(e.target.value)}
      >
        <option value="">Material requerido (opcional)</option>
        <option>Acero al Carbón</option>
        <option>Acero Inoxidable</option>
        <option>Aluminio</option>
        <option>Acero Galvanizado</option>
        <option>Cobre</option>
        <option>Latón</option>
        <option>Hierro</option>
        <option>Celosía Arquitectónica</option>
        <option>Aún no sé / Asesoría requerida</option>
      </select>
      <textarea
        className={`${inputCls} min-h-[120px] resize-none`}
        placeholder="Describe tu proyecto: medidas, espesor/calibre, número de piezas, observaciones…"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />

      {/* Drag & drop */}
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
          DXF, DWG, PDF, planos o fotos (máx. 5 archivos)
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
              <li key={i} className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm">
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
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-[0.98]"
      >
        <Send size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        Enviar cotización por WhatsApp
      </button>
      <p className="text-center text-xs text-slate-400">
        Respuesta rápida sin compromiso. Horario de atención: Lun – Sáb 9:00 a 18:00.
      </p>
    </form>
  );
}

/* ---------- Acordeón de material ---------- */
function MaterialCard({ material, onCotizar }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`group overflow-hidden rounded-2xl border transition-all ${
        open ? 'border-orange-300 shadow-lg shadow-orange-500/10' : 'border-slate-200 hover:border-orange-300'
      } bg-white`}
    >
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
            <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-slate-900">
              {material.name}
            </h3>
            <span className="mt-0.5 inline-block text-xs font-semibold uppercase tracking-wider text-orange-600">
              {material.tag}
            </span>
          </div>
        </div>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-transform ${open ? 'rotate-180 border-orange-300 text-orange-500' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </button>

      <div className={`grid transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-1">
            <p className="text-sm leading-relaxed text-slate-600">{material.desc}</p>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
              <Ruler size={18} className="shrink-0 text-orange-500" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Rango de espesor</p>
                <p className="text-sm font-bold text-slate-800">{material.espesor}</p>
              </div>
            </div>

            <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Ventajas clave</p>
            <ul className="mt-2 space-y-1.5">
              {material.ventajas.map((v) => (
                <li key={v} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check size={16} className="mt-0.5 shrink-0 text-orange-500" />
                  {v}
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Aplicaciones frecuentes</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {material.aplicaciones.map((a) => (
                <span key={a} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  {a}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={wa(`Hola VICMA LASER, quiero cotizar corte láser de ${material.name}.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-orange-500"
              >
                Cotizar {material.name} por WhatsApp
                <ArrowRight size={14} />
              </a>
            </div>
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
    <div className={`rounded-2xl border transition-all ${open ? 'border-orange-300 bg-white shadow-sm' : 'border-slate-200 bg-white/70'}`}>
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
   COMPONENTE PRINCIPAL VICMA LASER
   ================================================================ */
export default function VicmaLaser() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab') || 'inicio';
  const validTabs = ['inicio', 'corte-laser', 'celosias', 'materiales', 'galeria', 'cotizar'];
  const activeTab = validTabs.includes(rawTab) ? rawTab : 'inicio';

  const [menuOpen, setMenuOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [privacidadOpen, setPrivacidadOpen] = useState(false);
  const [filtroPortafolio, setFiltroPortafolio] = useState('Todas');
  const [lightbox, setLightbox] = useState(null);
  const videoRef = useRef(null);

  const setPage = (pageId) => {
    setSearchParams({ tab: pageId });
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Video autoplay en background
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const attemptPlay = () => {
      if (video && video.paused) {
        video.muted = true;
        video.play().catch(() => {});
      }
    };

    attemptPlay();
    video.addEventListener('loadeddata', attemptPlay);
    video.addEventListener('canplay', attemptPlay);

    const unlockOnGesture = () => {
      attemptPlay();
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('click', unlockOnGesture);
    };

    window.addEventListener('touchstart', unlockOnGesture, { passive: true, once: true });
    window.addEventListener('click', unlockOnGesture, { once: true });

    return () => {
      video.removeEventListener('loadeddata', attemptPlay);
      video.removeEventListener('canplay', attemptPlay);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('click', unlockOnGesture);
    };
  }, [activeTab]);

  // Botón volver arriba
  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="font-body min-h-screen bg-gray-50 text-slate-800 antialiased flex flex-col justify-between">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Barlow Condensed', sans-serif; }
        .font-body { font-family: 'Barlow', sans-serif; }
        html { scroll-behavior: smooth; }
        video::-webkit-media-controls,
        video::-webkit-media-controls-start-playback-button,
        video::-webkit-media-controls-play-button,
        video::-webkit-media-controls-panel,
        video::-webkit-media-controls-overlay-play-button {
          display: none !important;
          -webkit-appearance: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .metal-grid {
          background-image:
            linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between gap-4">
            {/* Logo */}
            <button
              onClick={() => setPage('inicio')}
              className="flex items-center gap-1 font-display text-2xl font-bold tracking-tight text-left cursor-pointer"
            >
              <span className="text-slate-900">VICMA</span>
              <span className="text-orange-500">LASER</span>
              <span className="ml-1 hidden text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:inline-block">
                · Maquila Industrial
              </span>
            </button>

            {/* Navegación desktop organizada en subpáginas */}
            <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex">
              {NAV_PAGES.map((p) => {
                const isActive = activeTab === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPage(p.id)}
                    className={`relative rounded-full px-3.5 py-2 text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </nav>

            {/* CTA WhatsApp rápido */}
            <div className="flex items-center gap-3">
              <a
                href={wa('Hola VICMA LASER, quiero cotizar un proyecto.')}
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#25D366]/20 transition-all hover:bg-[#1ebe5d] active:scale-[0.98] sm:inline-flex"
              >
                <MessageCircle size={15} />
                WhatsApp Directo
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
        </div>

        {/* Menú móvil desplegable */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-slate-200 bg-white lg:hidden shadow-xl"
            >
              <nav className="mx-auto max-w-7xl space-y-1.5 px-4 py-4 sm:px-6">
                <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Secciones de la página
                </p>
                {NAV_PAGES.map((p) => {
                  const isActive = activeTab === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPage(p.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                        isActive
                          ? 'bg-orange-500 text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{p.label}</span>
                      <ChevronRight size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                    </button>
                  );
                })}
                <div className="pt-2">
                  <a
                    href={wa('Hola VICMA LASER, quiero cotizar un proyecto.')}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-base font-bold text-white shadow-md shadow-[#25D366]/20"
                  >
                    <MessageCircle size={18} />
                    Cotizar por WhatsApp
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===================== CONTENIDO PRINCIPAL SEGÚN SUBPÁGINA ===================== */}
      <main className="flex-1">
        {/* ================================================================
            1. SUBPÁGINA: INICIO (DATOS BÁSICOS, ACCESOS RÁPIDOS Y RESUMEN)
            ================================================================ */}
        {activeTab === 'inicio' && (
          <div>
            {/* HERO PRINCIPAL CON VIDEO */}
            <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-slate-900">
              <video
                ref={videoRef}
                src={videoFondo}
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                preload="auto"
                poster={videoPoster}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_75%] z-0 brightness-135 contrast-120 saturate-130 sm:object-center sm:brightness-100 sm:contrast-100 sm:saturate-100"
              >
                <source src={videoFondo} type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 z-10 bg-black/40 sm:bg-black/60" />
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/30" />

              <div className="relative z-20 mx-auto w-full max-w-7xl px-4 py-12 sm:py-24 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-3xl"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-300 backdrop-blur-sm shadow-md">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
                    Maquila de corte láser industrial
                  </span>

                  <h1 className="font-display mt-3 sm:mt-5 text-4xl sm:text-7xl lg:text-8xl font-extrabold uppercase leading-[0.96] tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                    Precisión Absoluta en{' '}
                    <span className="text-orange-500">Corte Láser</span>.
                  </h1>

                  <p className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-xl leading-relaxed text-slate-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    Maquila de corte láser de fibra óptica y celosías arquitectónicas en México.
                    Tolerancias de ±0.1 mm, entregas en 24-72 h y cortes limpios sin rebabas.
                  </p>

                  <div className="mt-6 sm:mt-10 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => setPage('cotizar')}
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-orange-500/30 transition-all hover:bg-orange-600 active:scale-[0.98] cursor-pointer"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest">COTIZAR PROYECTO</span>
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                      onClick={() => setPage('corte-laser')}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 cursor-pointer"
                    >
                      <span>Explorar Servicios</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-orange-400" />
                      <span>Tolerancia ±0.1 mm</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Timer size={16} className="text-orange-400" />
                      <span>Entregas 24-72 h</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck size={16} className="text-orange-400" />
                      <span>Envíos a todo México</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* 4 PILARES DE CONFIANZA - 2x2 en móvil para ahorrar scroll */}
            <section className="border-b border-slate-200 bg-white py-8 sm:py-12 lg:py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {CONFIANZA.map((c, i) => (
                    <Reveal key={c.title} delay={i * 0.04}>
                      <div className="flex h-full flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-slate-50/70 sm:bg-transparent border border-slate-100 sm:border-0">
                        <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-orange-500/10 text-orange-600">
                          <c.icon size={22} className="sm:w-6 sm:h-6" strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display mt-2 sm:mt-4 text-sm sm:text-xl font-bold uppercase tracking-tight text-slate-900">
                          {c.title}
                        </h3>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 max-w-xs">{c.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* RESUMEN DE SOLUCIONES (ACCESOS RÁPIDOS DIRECTOS) */}
            <section className="bg-slate-50 py-10 sm:py-16 lg:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-3xl mx-auto">
                  <Eyebrow>Nuestras Soluciones</Eyebrow>
                  <h2 className="font-display mt-3 sm:mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold uppercase leading-tight text-slate-900">
                    Todo lo que necesitas en <span className="text-orange-500">corte y metales</span>
                  </h2>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-base text-slate-600">
                    Elige el área de tu interés para consultar fichas técnicas, capacidades y fotos de proyectos.
                  </p>
                </Reveal>

                <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Card 1: Corte Láser */}
                  <Reveal delay={0.05} className="h-full">
                    <div className="flex h-full flex-col justify-between rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm transition-all hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5">
                      <div>
                        <div className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl sm:rounded-2xl bg-slate-900 text-white">
                          <Zap size={22} className="sm:w-6 sm:h-6 text-orange-400" />
                        </div>
                        <h3 className="font-display mt-4 sm:mt-5 text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-900">
                          Corte Láser CNC
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                          Fibra óptica de alta velocidad y tolerancias milimétricas (±0.1 mm). Desde prototipos hasta maquila industrial de alto volumen.
                        </p>
                        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-slate-600">Sin rebabas</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-slate-600">Entregas 24-72h</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-slate-600">ZAC Mínima</span>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100">
                        <button
                          onClick={() => setPage('corte-laser')}
                          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-600 transition-colors hover:text-orange-700 cursor-pointer"
                        >
                          Ver ventajas y sectores
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </Reveal>

                  {/* Card 2: Celosías Metálicas */}
                  <Reveal delay={0.1} className="h-full">
                    <div className="flex h-full flex-col justify-between rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm transition-all hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5">
                      <div>
                        <div className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl sm:rounded-2xl bg-orange-500 text-white">
                          <Building2 size={22} className="sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="font-display mt-4 sm:mt-5 text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-900">
                          Celosías Arquitectónicas
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                          Diseños de celosías para fachadas, portones residenciales, pérgolas, barandales y muros decorativos con acabados de alta gama.
                        </p>
                        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-slate-600">Fachadas</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-slate-600">Portones</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-slate-600">Pérgolas</span>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100">
                        <button
                          onClick={() => setPage('celosias')}
                          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-600 transition-colors hover:text-orange-700 cursor-pointer"
                        >
                          Ver catálogo de celosías
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </Reveal>

                  {/* Card 3: Materiales */}
                  <Reveal delay={0.15} className="h-full sm:col-span-2 lg:col-span-1">
                    <div className="flex h-full flex-col justify-between rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm transition-all hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5">
                      <div>
                        <div className="flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-xl sm:rounded-2xl bg-slate-900 text-white">
                          <Layers size={22} className="sm:w-6 sm:h-6 text-orange-400" />
                        </div>
                        <h3 className="font-display mt-4 sm:mt-5 text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-900">
                          Materiales y Espesores
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                          Cortamos lámina y placa desde 0.5 mm hasta 25 mm en acero al carbón, acero inoxidable, aluminio, cobre, latón y hierro.
                        </p>
                        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-slate-600">Hasta 25 mm</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-slate-600">6 Metales</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-slate-600">Fichas técnicas</span>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100">
                        <button
                          onClick={() => setPage('materiales')}
                          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-600 transition-colors hover:text-orange-700 cursor-pointer"
                        >
                          Ver tabla de materiales
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>

            {/* STATS RÁPIDOS - 2x2 en móvil */}
            <section className="bg-slate-900 py-8 sm:py-12 lg:py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                  {STATS.map((s, i) => (
                    <Reveal key={s.label} delay={i * 0.04}>
                      <div className="text-center">
                        <div className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-orange-500">
                          {s.value}
                        </div>
                        <p className="mt-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                          {s.label}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* TESTIMONIOS - HORIZONTAL SWIPE EN MÓVIL, GRID EN DESKTOP */}
            <section className="bg-white py-10 sm:py-16 lg:py-20 overflow-hidden">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-3xl mx-auto">
                  <Eyebrow>Testimonios</Eyebrow>
                  <h2 className="font-display mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-slate-900">
                    Confianza de <span className="text-orange-500">la industria</span>
                  </h2>
                  <p className="mt-2 text-xs text-slate-400 md:hidden flex items-center justify-center gap-1.5">
                    <span>← Desliza para ver más →</span>
                  </p>
                </Reveal>

                {/* Contenedor horizontal en móvil (snap) y grid en desktop */}
                <div className="mt-6 sm:mt-10 flex gap-3.5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none px-4 -mx-4 sm:px-0 sm:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
                  {TESTIMONIOS.map((t, i) => (
                    <div
                      key={t.nombre}
                      className="w-[84vw] max-w-[310px] shrink-0 snap-center md:w-auto md:max-w-none flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 shadow-sm"
                    >
                      <div>
                        <div className="flex gap-1 text-orange-500">
                          {[...Array(5)].map((_, j) => (
                            <svg key={j} width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l2.9 6.26 6.6.64-5 4.36 1.5 6.74L12 16.9 5.99 20l1.5-6.74-5-4.36 6.6-.64z"/>
                            </svg>
                          ))}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600 italic">"{t.quote}"</p>
                      </div>
                      <div className="mt-5 border-t border-slate-200/70 pt-3">
                        <p className="font-display text-base font-bold uppercase tracking-tight text-slate-900">
                          {t.nombre}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{t.rol}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA INFERIOR INICIO */}
            <section className="bg-slate-900 py-10 sm:py-16 lg:py-20 relative overflow-hidden text-center">
              <div className="absolute inset-0 metal-grid opacity-20" />
              <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase text-white">
                  ¿Listo para arrancar tu <span className="text-orange-500">producción</span>?
                </h2>
                <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-300 max-w-xl mx-auto">
                  Envíanos tus planos o bocetos. Te respondemos con cotización formal en menos de 24 horas.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
                  <button
                    onClick={() => setPage('cotizar')}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-colors cursor-pointer"
                  >
                    <FileText size={16} />
                    Ir a Cotizar y Subir Archivo
                  </button>
                  <a
                    href={wa('Hola VICMA LASER, quiero cotizar un proyecto.')}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#25D366]/20 hover:bg-[#1ebe5d] transition-colors"
                  >
                    <MessageCircle size={16} />
                    Hablar por WhatsApp
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================
            2. SUBPÁGINA: CORTE LÁSER (VENTAJAS, POR QUÉ ELEGIRNOS, INDUSTRIAS)
            ================================================================ */}
        {activeTab === 'corte-laser' && (
          <div>
            <SubpageHeader
              badge="Maquila de corte láser industrial"
              title="Corte Láser CNC de"
              highlight="Fibra Óptica"
              desc="Tecnología de última generación para cortes exactos, limpios y sin rebabas en lámina y placa con entregas rápidas de 24 a 72 horas."
            />

            {/* 3 PILARES TÉCNICOS */}
            <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-3xl mx-auto mb-12">
                  <Eyebrow>Capacidad y precisión</Eyebrow>
                  <h2 className="font-display mt-4 text-4xl font-bold uppercase text-slate-900 sm:text-5xl">
                    Tecnología de corte <span className="text-orange-500">sin tolerancias al error</span>
                  </h2>
                </Reveal>

                <div className="grid gap-6 md:grid-cols-3">
                  {CORTE_FEATURES.map((f, i) => (
                    <Reveal key={f.title} delay={i * 0.08} className="h-full">
                      <div className="h-full rounded-2xl bg-slate-100 p-2 ring-1 ring-slate-200/70">
                        <div className="h-full rounded-xl bg-white p-8">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                            <f.icon size={26} strokeWidth={1.75} />
                          </div>
                          <h3 className="font-display mt-6 text-2xl font-bold uppercase tracking-tight text-slate-900">
                            {f.title}
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* 6 VENTAJAS COMPETITIVAS */}
            <section className="bg-slate-50 py-20 lg:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-3xl mx-auto">
                  <Eyebrow>Ventajas industriales</Eyebrow>
                  <h2 className="font-display mt-4 text-4xl font-bold uppercase text-slate-900 sm:text-5xl">
                    Ventajas del Corte Láser <span className="text-orange-500">Industrial</span>
                  </h2>
                  <p className="mt-3 text-base text-slate-600">
                    Aumenta la productividad de tu taller o empresa con piezas listas para ensamble inmediato.
                  </p>
                </Reveal>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {VENTAJAS_LASER.map((v, i) => (
                    <Reveal key={v.title} delay={i * 0.05}>
                      <div className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-orange-300 hover:shadow-lg">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white group-hover:bg-orange-500 transition-colors">
                          <v.icon size={24} strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display mt-5 text-2xl font-bold uppercase tracking-tight text-slate-900">
                          {v.title}
                        </h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{v.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* POR QUÉ ELEGIR VICMA LASER */}
            <section className="bg-slate-900 py-20 lg:py-24 text-white relative overflow-hidden">
              <div className="absolute inset-0 metal-grid opacity-20" />
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-3xl mx-auto">
                  <Eyebrow>Respaldo de planta</Eyebrow>
                  <h2 className="font-display mt-4 text-4xl font-bold uppercase text-white sm:text-5xl">
                    ¿Por qué elegir <span className="text-orange-500">Vicma Laser</span>?
                  </h2>
                  <p className="mt-3 text-base text-slate-400">
                    No solo cortamos metal: somos el eslabón de certeza que tu cadena productiva necesita.
                  </p>
                </Reveal>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {POR_QUE_ELEGIR.map((p, i) => (
                    <Reveal key={p.title} delay={i * 0.04}>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          <p.icon size={26} strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display mt-5 text-xl font-bold uppercase tracking-tight text-white">
                          {p.title}
                        </h3>
                        <p className="mt-2.5 text-xs leading-relaxed text-slate-400">{p.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* APLICACIONES INDUSTRIALES */}
            <section className="bg-white py-20 lg:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-3xl mx-auto">
                  <Eyebrow>Sectores que servimos</Eyebrow>
                  <h2 className="font-display mt-4 text-4xl font-bold uppercase text-slate-900 sm:text-5xl">
                    Aplicaciones <span className="text-orange-500">Industriales</span>
                  </h2>
                  <p className="mt-3 text-base text-slate-600">
                    Nuestros cortes son utilizados en los proyectos más rigurosos del país.
                  </p>
                </Reveal>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {INDUSTRIAS.map((ind, i) => (
                    <Reveal key={ind.name} delay={i * 0.05}>
                      <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/60 p-7 transition-all hover:border-orange-300 hover:shadow-md">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                          <ind.icon size={24} strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display mt-5 text-2xl font-bold uppercase tracking-tight text-slate-900">
                          {ind.name}
                        </h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{ind.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <div className="mt-14 text-center">
                  <button
                    onClick={() => setPage('cotizar')}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-colors cursor-pointer"
                  >
                    Cotizar piezas de corte láser
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================
            3. SUBPÁGINA: CELOSÍAS METÁLICAS
            ================================================================ */}
        {activeTab === 'celosias' && (
          <div>
            <SubpageHeader
              badge="Arquitectura, interiorismo y diseño"
              title="Celosías Metálicas para"
              highlight="Fachadas y Espacios"
              desc="Diseños cortados con láser para control solar, ventilación, seguridad y estética contemporánea en proyectos residenciales y comerciales."
            />

            <section className="bg-white py-16 lg:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-3xl mx-auto mb-12">
                  <Eyebrow>Catálogo de aplicaciones</Eyebrow>
                  <h2 className="font-display mt-4 text-4xl font-bold uppercase text-slate-900 sm:text-5xl">
                    6 Aplicaciones de <span className="text-orange-500">Celosías de Alta Gama</span>
                  </h2>
                  <p className="mt-3 text-base text-slate-600">
                    Fabricamos con tu diseño o te ayudamos a crear el patrón arquitectónico ideal para tu obra.
                  </p>
                </Reveal>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {CELOSIAS.map((c, i) => (
                    <Reveal key={c.title} delay={i * 0.06} className="h-full">
                      <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10">
                        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-slate-800">
                          <img
                            src={c.img}
                            alt={`Celosía metálica ${c.title} — Vicma Laser`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute bottom-3 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                            Celosía · {c.title}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-6">
                          <div>
                            <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-slate-900">
                              {c.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.use}</p>
                          </div>
                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <a
                              href={wa(`Hola VICMA LASER, me interesa cotizar una celosía para ${c.title}.`)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold uppercase tracking-wider text-orange-600 hover:text-orange-700 inline-flex items-center gap-1.5"
                            >
                              Cotizar esta celosía
                              <ArrowRight size={14} />
                            </a>
                            <button
                              onClick={() => setLightbox({ title: `Celosía para ${c.title}`, img: c.img, categoria: 'Celosías' })}
                              className="text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              Ver foto
                            </button>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* BENEFICIOS PARA ARQUITECTOS */}
            <section className="bg-slate-900 py-16 lg:py-24 text-white relative overflow-hidden">
              <div className="absolute inset-0 metal-grid opacity-25" />
              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-3xl mx-auto">
                  <Eyebrow>Especificaciones para obra</Eyebrow>
                  <h2 className="font-display mt-4 text-4xl font-bold uppercase text-white sm:text-5xl">
                    Por qué los arquitectos <span className="text-orange-500">eligen nuestras celosías</span>
                  </h2>
                </Reveal>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { t: 'Diseños Personalizados', d: 'Patrones geométricos, orgánicos o paramétricos en cualquier escala.' },
                    { t: 'Materiales Resistentes', d: 'Acero al carbón para pintar, galvanizado anticorrosión o acero inoxidable.' },
                    { t: 'Plegado y Bastidor', d: 'Servicio de doblez perimetral para rigidizar y anclar fácil en obra.' },
                    { t: 'Envío Protegido', d: 'Embalaje de madera para evitar deformaciones en transporte a cualquier estado.' },
                  ].map((item, idx) => (
                    <Reveal key={item.t} delay={idx * 0.05}>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                        <div className="h-2 w-8 bg-orange-500 rounded-full mb-4" />
                        <h3 className="font-display text-xl font-bold uppercase text-white">{item.t}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.d}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <button
                    onClick={() => setPage('cotizar')}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-colors cursor-pointer"
                  >
                    Cotizar proyecto de celosías
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================
            4. SUBPÁGINA: MATERIALES (FICHAS COMPLETAS DE CADA METAL)
            ================================================================ */}
        {activeTab === 'materiales' && (
          <div>
            <SubpageHeader
              badge="Capacidades de corte y calibres"
              title="Materiales y"
              highlight="Espesores de Corte"
              desc="Trabajamos lámina delgada y placa pesada desde 0.5 mm hasta 25 mm de espesor en 8 metales y aleaciones industriales."
            />

            <section className="bg-white py-16 lg:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-3xl mx-auto mb-12">
                  <Eyebrow>Fichas técnicas</Eyebrow>
                  <h2 className="font-display mt-4 text-4xl font-bold uppercase text-slate-900 sm:text-5xl">
                    ¿Qué material <span className="text-orange-500">requiere tu proyecto</span>?
                  </h2>
                  <p className="mt-3 text-base text-slate-600">
                    Haz clic en cada tarjeta para desplegar el rango de espesores, ventajas y aplicaciones específicas.
                  </p>
                </Reveal>

                <div className="grid gap-5 sm:grid-cols-2">
                  {CORTE_MATERIALES.map((m, i) => (
                    <Reveal key={m.id} delay={(i % 2) * 0.05}>
                      <MaterialCard material={m} />
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* TABLA COMPARATIVA RÁPIDA */}
            <section className="bg-slate-50 py-16 lg:py-20 border-t border-slate-200">
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <h3 className="font-display text-3xl font-bold uppercase text-slate-900">
                    Resumen de <span className="text-orange-500">Capacidades Máximas</span>
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Corte láser de fibra óptica con tolerancias dimensionales de ±0.1 mm.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700">
                      <tr>
                        <th className="px-6 py-4">Material</th>
                        <th className="px-6 py-4">Rango de Espesor</th>
                        <th className="px-6 py-4">Uso Principal</th>
                        <th className="px-6 py-4 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {CORTE_MATERIALES.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{m.name}</td>
                          <td className="px-6 py-4 font-semibold text-orange-600">{m.espesor}</td>
                          <td className="px-6 py-4 text-xs">{m.aplicaciones.slice(0, 2).join(', ')}</td>
                          <td className="px-6 py-4 text-right">
                            <a
                              href={wa(`Hola VICMA LASER, quiero cotizar corte de ${m.name}.`)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold uppercase text-slate-900 hover:text-orange-500"
                            >
                              Cotizar
                              <ArrowRight size={12} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-10 text-center">
                  <p className="text-sm text-slate-500">
                    ¿Tu material no aparece en la lista o requieres aleaciones especiales?
                  </p>
                  <button
                    onClick={() => setPage('cotizar')}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-500 transition-colors cursor-pointer"
                  >
                    Consultar a un Ingeniero
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================
            5. SUBPÁGINA: GALERÍA (FILTROS Y LIGHTBOX INTERACTIVO)
            ================================================================ */}
        {activeTab === 'galeria' && (
          <div>
            <SubpageHeader
              badge="Portafolio fotográfico de proyectos"
              title="Galería de"
              highlight="Trabajos Entregados"
              desc="Conoce la calidad de corte, celosías metálicas y piezas industriales fabricadas en nuestra planta."
            />

            <section className="bg-white py-16 lg:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Botones de filtro */}
                <div className="flex flex-wrap justify-center gap-2.5 mb-12">
                  {PORTFOLIO_CATEGORIAS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFiltroPortafolio(cat)}
                      className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        filtroPortafolio === cat
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid fotográfico */}
                <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {PORTFOLIO.filter((p) => filtroPortafolio === 'Todas' || p.categoria === filtroPortafolio).map((p) => (
                      <motion.button
                        key={p.title}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setLightbox(p)}
                        className="group relative aspect-square overflow-hidden rounded-3xl bg-slate-900 text-left shadow-sm cursor-pointer"
                      >
                        <img
                          src={p.img}
                          alt={`${p.title} — Vicma Laser`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="absolute inset-x-0 bottom-0 translate-y-3 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <span className="inline-block rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                            {p.categoria}
                          </span>
                          <h3 className="font-display mt-2 text-2xl font-bold uppercase tracking-tight text-white">
                            {p.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-300">Clic para ampliar imagen</p>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </motion.div>

                <div className="mt-16 text-center">
                  <p className="text-base text-slate-600">
                    ¿Viste un diseño que te gustó o tienes tu propio boceto?
                  </p>
                  <button
                    onClick={() => setPage('cotizar')}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-colors cursor-pointer"
                  >
                    Cotizar este tipo de pieza
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================
            6. SUBPÁGINA: COTIZAR Y FAQ
            ================================================================ */}
        {activeTab === 'cotizar' && (
          <div>
            <SubpageHeader
              badge="Atención directa y cotizaciones rápidas"
              title="Cotiza tu Proyecto en"
              highlight="Menos de 24 Horas"
              desc="Sube tus archivos DWG, DXF o planos en PDF. Si aún no tienes diseño, nuestro equipo de ingeniería te asesora desde cero."
            />

            <section className="bg-gray-100 py-16 lg:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Estrategia dual */}
                <div className="grid gap-6 lg:grid-cols-2 mb-16">
                  {/* Opción 1: Tengo diseño */}
                  <div className="flex flex-col justify-between rounded-3xl bg-white p-8 lg:p-10 shadow-sm border border-slate-200">
                    <div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white">
                        <FileUp size={26} />
                      </div>
                      <h3 className="font-display mt-6 text-3xl font-bold uppercase tracking-tight text-slate-900">
                        Ya tengo mi archivo
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        Envíanos tu archivo en formato vectorial o plano acotado. Optimizamos el anidado para darte el mejor precio por lámina.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {['DXF', 'DWG', 'PDF', 'AI / EPS'].map((f) => (
                          <span
                            key={f}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <a
                        href={wa('Hola VICMA LASER, ya tengo mi diseño (DXF/DWG/PDF) listo para cotizar.')}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-slate-800"
                      >
                        Enviar archivo por WhatsApp
                        <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </div>

                  {/* Opción 2: No tengo diseño */}
                  <div className="flex flex-col justify-between rounded-3xl bg-white p-8 lg:p-10 shadow-sm border border-slate-200">
                    <div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                        <PenTool size={26} className="text-orange-400" />
                      </div>
                      <h3 className="font-display mt-6 text-3xl font-bold uppercase tracking-tight text-slate-900">
                        No tengo el archivo digital
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        ¿Solo tienes medidas o un dibujo en papel? Nuestro equipo te ayuda a digitalizarlo y prepararlo para corte CNC sin costo extra.
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {['Boceto en papel', 'Medidas en obra', 'Fotos de muestra'].map((f) => (
                          <span
                            key={f}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <a
                        href={wa('Hola VICMA LASER, no tengo archivo CAD pero tengo las medidas de mi proyecto y quiero asesoría.')}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600"
                      >
                        Solicitar Asesoría Técnica
                        <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Formulario + Proceso */}
                <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <Eyebrow>Paso a paso</Eyebrow>
                      <h3 className="font-display mt-3 text-3xl font-bold uppercase tracking-tight text-slate-900">
                        ¿Cómo funciona la cotización?
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {[
                        { n: '1', t: 'Envía tus requerimientos', d: 'Adjunta tu archivo, dibujo o describe los espesores y medidas necesarias.' },
                        { n: '2', t: 'Revisión por ingeniería', d: 'Analizamos la geometría y calculamos el aprovechamiento óptimo de material.' },
                        { n: '3', t: 'Cotización en < 24 hrs', d: 'Recibes presupuesto detallado con tiempos de entrega garantizados.' },
                      ].map((s) => (
                        <div key={s.n} className="flex gap-4 rounded-2xl bg-white p-5 border border-slate-200">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 font-display text-xl font-bold text-white">
                            {s.n}
                          </div>
                          <div>
                            <h4 className="font-display text-lg font-bold uppercase tracking-tight text-slate-900">{s.t}</h4>
                            <p className="mt-1 text-xs leading-relaxed text-slate-500">{s.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Datos de contacto */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 text-xs text-slate-600">
                      <p className="font-bold uppercase tracking-wider text-slate-900 text-sm">Contacto Directo de Planta</p>
                      <div className="flex items-center gap-2.5">
                        <Phone size={15} className="text-orange-500" />
                        <span>{PHONE}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Mail size={15} className="text-orange-500" />
                        <span>{EMAIL}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock size={15} className="text-orange-500" />
                        <span>Lunes a Sábado · 9:00 a 18:00</span>
                      </div>
                    </div>
                  </div>

                  {/* Formulario */}
                  <div className="lg:col-span-7">
                    <div className="rounded-3xl bg-white p-8 lg:p-10 shadow-sm border border-slate-200">
                      <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-slate-900 mb-6">
                        Formulario de Cotización Inmediata
                      </h3>
                      <QuoteForm />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PREGUNTAS FRECUENTES (FAQ) */}
            <section className="bg-white py-16 lg:py-24 border-t border-slate-200">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <Eyebrow>Dudas habituales</Eyebrow>
                  <h2 className="font-display mt-4 text-4xl font-bold uppercase text-slate-900 sm:text-5xl">
                    Preguntas <span className="text-orange-500">Frecuentes</span>
                  </h2>
                </div>

                <div className="space-y-3.5">
                  {FAQ.map((f) => (
                    <FaqItem key={f.q} q={f.q} a={f.a} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Bloque 1: Identidad */}
            <div className="space-y-3">
              <button
                onClick={() => setPage('inicio')}
                className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-left cursor-pointer"
              >
                <span className="text-white">VICMA</span>
                <span className="text-orange-500">LASER</span>
              </button>
              <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-slate-400">
                Maquila industrial de corte láser de fibra óptica y celosías metálicas para arquitectura, diseño e ingeniería mexicana.
              </p>
              <div className="flex gap-2.5 pt-1">
                <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-orange-500 hover:text-white">
                  <Facebook size={16} />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-orange-500 hover:text-white">
                  <Instagram size={16} />
                </a>
              </div>
            </div>

            {/* Bloques 2 y 3: Dos columnas paralelas en móvil (Páginas y Planta/Atención) */}
            <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:col-span-2 lg:grid-cols-2">
              {/* Bloque 2: Páginas del Sitio */}
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white">
                  Páginas
                </h4>
                <ul className="mt-3.5 space-y-2 text-xs sm:text-sm">
                  {NAV_PAGES.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => setPage(p.id)}
                        className="inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-orange-400 cursor-pointer"
                      >
                        <ChevronRight size={12} className="text-orange-500 shrink-0" />
                        <span>{p.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bloque 3: Planta y Contacto */}
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white">
                  Planta y Contacto
                </h4>
                <ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-orange-500" />
                    <span className="text-slate-400 line-clamp-2">{ADDRESS}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone size={15} className="shrink-0 text-orange-500" />
                    <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="text-slate-400 hover:text-white truncate">
                      {PHONE}
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle size={15} className="shrink-0 text-[#25D366]" />
                    <a
                      href={wa('Hola VICMA LASER, quiero información.')}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white truncate"
                    >
                      WhatsApp
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail size={15} className="shrink-0 text-orange-500" />
                    <a href={`mailto:${EMAIL}`} className="text-slate-400 hover:text-white truncate">
                      {EMAIL}
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock size={15} className="shrink-0 text-orange-500" />
                    <span className="text-slate-400">Lun – Sáb · 9-18h</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Barra legal */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2.5 px-4 py-4 sm:py-5 text-center sm:flex-row sm:px-6 lg:px-8">
            <p className="text-xs text-slate-500">
              © 2026 VICMA LASER. Todos los derechos reservados.
            </p>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <button
                onClick={() => setPrivacidadOpen(true)}
                className="text-xs text-slate-500 transition-colors hover:text-orange-400 cursor-pointer"
              >
                Aviso de Privacidad
              </button>
              <p className="text-xs text-slate-500">
                Diseñado por{' '}
                <a
                  href="https://imagineandstamp.site"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-400 hover:text-orange-400"
                >
                  IMAGINE &amp; STAMP
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* BOTÓN VOLVER ARRIBA */}
      <button
        onClick={scrollTop}
        aria-label="Volver arriba"
        className={`fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 ${
          showTopBtn ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <ChevronDown size={22} className="rotate-180" />
      </button>

      {/* BOTÓN FLOTANTE WHATSAPP */}
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

      {/* LIGHTBOX PORTAFOLIO */}
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
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1ebe5d]"
                >
                  <MessageCircle size={16} />
                  Quiero algo similar
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL AVISO DE PRIVACIDAD */}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
