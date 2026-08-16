// ═══════════════════════════════════════════════════════════════════════════
// MEXUS MOTORS — USA • MX Imports · Agencia de autos importados y seminuevos
// SPA dark premium: catálogo + ficha técnica estilo flyer + WhatsApp
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, X, Truck, CarFront, Car, Zap, Gauge, Cog,
  Settings2, Armchair, Sun, Monitor, Speaker, Navigation, Camera, Radar,
  Snowflake, MessageCircle, Phone, MapPin, BadgeCheck, ShieldCheck,
  ChevronRight, Share2, CircleDollarSign, ArrowRight, Check,
} from 'lucide-react';
import { clientConfig } from '../config';
import logoImg from '../assets/logo.png';

const C = clientConfig.colors;
const WHATSAPP = clientConfig.phone;

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';

// ── Tipos ──
type Tipo = 'Pick Up' | 'SUV' | 'Sedán' | 'Deportivos';
type Estado = 'Disponible' | 'Reservado' | 'Vendido';
interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  year: number;
  tipo: Tipo;
  motor: string;
  hp: number;
  transmision: string;
  traccion: string;
  km: number;
  combustible: string;
  colorExt: string;
  colorInt: string;
  pasajeros: number;
  precio: number;
  descripcion: string;
  importadoUSA: boolean;
  estado: Estado;
  imagenes: string[];
  equipamiento: string[];
}

// ── Datos de los vehículos ──
// ⚠️ Los precios, kilometraje y motor son aproximados — confirmar con datos reales.
const VEHICLES: Vehicle[] = [
  {
    id: 'silverado', marca: 'Chevrolet', modelo: 'Silverado', year: 2017, tipo: 'Pick Up',
    motor: 'V8 5.3L', hp: 355, transmision: 'Automática', traccion: '4x4', km: 100000,
    combustible: 'Gasolina', colorExt: '—', colorInt: '—', pasajeros: 5, precio: 380000,
    importadoUSA: true,
    estado: 'Disponible',
    descripcion: 'Pick up importada, lista para trabajar. Factura original y papeles en regla.',
    imagenes: ['./mexus-motors/silverado-2017/1.webp', './mexus-motors/silverado-2017/2.webp', './mexus-motors/silverado-2017/3.webp'],
    equipamiento: ['Pantalla Touch', 'Cámara de reversa', 'Clima automático'],
  },
  {
    id: 'colorado', marca: 'Chevrolet', modelo: 'Colorado', year: 2017, tipo: 'Pick Up',
    motor: 'V6 3.6L', hp: 308, transmision: 'Automática', traccion: '4x4', km: 90000,
    combustible: 'Gasolina', colorExt: '—', colorInt: '—', pasajeros: 5, precio: 350000,
    importadoUSA: true,
    estado: 'Disponible',
    descripcion: 'Pick up mediana, ideal para ciudad y trabajo. Un solo dueño.',
    imagenes: ['./mexus-motors/colorado-2017/1.webp', './mexus-motors/colorado-2017/2.webp', './mexus-motors/colorado-2017/3.webp', './mexus-motors/colorado-2017/4.webp'],
    equipamiento: ['Pantalla Touch', 'Cámara de reversa', 'Sensores de estacionamiento'],
  },
  {
    id: 'wrangler', marca: 'Jeep', modelo: 'Wrangler', year: 2017, tipo: 'SUV',
    motor: 'V6 3.6L Pentastar', hp: 285, transmision: 'Automática', traccion: '4x4', km: 80000,
    combustible: 'Gasolina', colorExt: '—', colorInt: '—', pasajeros: 5, precio: 420000,
    importadoUSA: true,
    estado: 'Disponible',
    descripcion: 'SUV todoterreno icónico. Quita puertas, quita techo y sal a la aventura.',
    imagenes: ['./mexus-motors/jeep-wrangler-2017/1.webp', './mexus-motors/jeep-wrangler-2017/2.webp', './mexus-motors/jeep-wrangler-2017/3.webp'],
    equipamiento: ['Sonido Premium', 'Pantalla Touch', 'Clima automático'],
  },
];

const TIPOS: { id: 'Todos' | Tipo; label: string; icon: any }[] = [
  { id: 'Todos', label: 'Todos', icon: Car },
  { id: 'Pick Up', label: 'Pick Up', icon: Truck },
  { id: 'SUV', label: 'SUV', icon: CarFront },
  { id: 'Sedán', label: 'Sedán', icon: Car },
  { id: 'Deportivos', label: 'Deportivos', icon: Zap },
];

const ESTADO_STYLE: Record<Estado, { bg: string; color: string }> = {
  Disponible: { bg: C.green, color: '#000000' },
  Reservado: { bg: '#f59e0b', color: '#000000' },
  Vendido: { bg: '#3a4250', color: '#e4e4e7' },
};

const EQUIPMENT_ICONS: Record<string, any> = {
  'Asientos de piel': Armchair,
  'Quemacocos': Sun,
  'Pantalla Touch': Monitor,
  'Sonido Premium': Speaker,
  'GPS / Navegación': Navigation,
  'Cámara de reversa': Camera,
  'Sensores de estacionamiento': Radar,
  'Clima automático': Snowflake,
};

const GALERIA_LABELS = ['Frente', 'Trasera', 'Interior', 'Tablero'];

const formatPrice = (n: number) => `$${n.toLocaleString('es-MX')} MXN`;
const formatKm = (n: number) => `${n.toLocaleString('es-MX')} km`;
const onImgError = (e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; };

const waUrl = (v: Vehicle) => {
  const text = `¡Hola Mexus Motors! Me interesa pedir informes y disponibilidad del auto: ${v.marca} ${v.modelo} ${v.year} con precio de ${formatPrice(v.precio)}.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
};

// ═══════════════════ COMPONENTE ═══════════════════
export default function MexusMotors() {
  const [query, setQuery] = useState('');
  const [tipo, setTipo] = useState<'Todos' | Tipo>('Todos');
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { document.title = 'Mexus Motors | USA • MX Imports'; }, []);
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);
  useEffect(() => { setActiveImg(0); }, [selected]);

  const filtered = useMemo(() => {
    let r = VEHICLES;
    if (query.trim()) {
      const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      r = r.filter(v => `${v.marca} ${v.modelo} ${v.year}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q));
    } else if (tipo !== 'Todos') {
      r = r.filter(v => v.tipo === tipo);
    }
    return r;
  }, [query, tipo]);

  return (
    <div className="mexus-root min-h-screen flex flex-col" style={{ backgroundColor: C.bg, color: C.text, fontFamily: '"Inter", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap');
        .mexus-root button, .mexus-root a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        .mexus-root * { scrollbar-width: thin; scrollbar-color: ${C.border} transparent; }
        .mexus-display { font-family: "Sora", sans-serif; }
        .mexus-hide-scrollbar::-webkit-scrollbar { display: none; }
        .mexus-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ backgroundColor: `${C.bg}ee`, borderColor: C.border }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3 min-w-0">
              <img src={logoImg} alt="Mexus Motors" className="h-10 md:h-12 w-auto object-contain shrink-0" />
              <div className="leading-tight min-w-0">
                <h1 className="mexus-display font-extrabold text-base md:text-lg tracking-tight truncate">
                  MEXUS <span style={{ color: C.silver }}>MOTORS</span>
                </h1>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: C.textDim }}>
                  USA <span style={{ color: C.green }}>•</span> MX Imports
                </p>
              </div>
            </div>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all hover:scale-[1.03]" style={{ backgroundColor: '#25D366', color: 'white' }}>
              <MessageCircle size={16} /> Cotiza por WhatsApp
            </a>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="sm:hidden p-2.5 rounded-xl" style={{ backgroundColor: '#25D366', color: 'white' }}>
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* ═══ HERO STRIP ═══ */}
      <section className="relative overflow-hidden border-b min-h-[480px] flex items-center" style={{ borderColor: C.border, backgroundColor: C.card }}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=2000&q=80')` }}
        />
        {/* Gradient Overlays para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        
        <div className="relative w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Columna Izquierda (Texto & Buscador) */}
          <div className="w-full md:w-[65%]">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] mb-4 backdrop-blur-md" style={{ backgroundColor: `${C.silver}14`, color: C.silver, border: `1px solid ${C.silver}33` }}>
                <BadgeCheck size={13} style={{ color: C.green }} /> Importados & Seminuevos verificados
              </span>
              <h2 className="mexus-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[1.05] text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                Tu próximo auto, <br className="hidden md:block" />
                <span style={{ color: C.silver }}>importado con</span> <span style={{ color: C.green, textShadow: '0 0 20px rgba(37, 211, 102, 0.4)' }}>confianza</span>
              </h2>
              <p className="text-sm md:text-lg mt-4 max-w-xl font-medium" style={{ color: '#d4d4d8', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                {clientConfig.description}
              </p>
            </motion.div>

            {/* Búsqueda + filtros */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-8 space-y-4">
              <div className="relative max-w-xl group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-white" style={{ color: C.textDim }} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Busca por marca, modelo o año..."
                  className="w-full pl-11 pr-11 py-4 rounded-2xl text-sm font-medium focus:outline-none border transition-all backdrop-blur-md shadow-2xl"
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10" style={{ color: C.silver }}>
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto mexus-hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                {TIPOS.map(t => {
                  const active = tipo === t.id;
                  return (
                    <button key={t.id} onClick={() => setTipo(t.id)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 border backdrop-blur-md"
                      style={active ? { backgroundColor: C.silver, color: 'black', borderColor: C.silver } : { backgroundColor: 'rgba(0,0,0,0.6)', color: C.silver, borderColor: 'rgba(255,255,255,0.1)' }}>
                      <t.icon size={13} /> {t.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
          
          {/* Espacio derecho para lucir la imagen de fondo */}
          <div className="hidden md:flex w-full md:w-[35%] justify-end">
          </div>
        </div>
      </section>

      {/* ═══ CATÁLOGO ═══ */}
      <main className="flex-1 max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="mexus-display font-bold text-sm uppercase tracking-[0.15em]" style={{ color: C.textDim }}>
            {filtered.length} vehículo{filtered.length !== 1 ? 's' : ''}
          </h3>
          <span className="text-[11px] font-bold flex items-center gap-1.5" style={{ color: C.textDim }}>
            <ShieldCheck size={13} style={{ color: C.green }} /> Revisión de 150 puntos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((v, idx) => (
              <motion.article key={v.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                style={{ backgroundColor: C.card, borderColor: C.border, opacity: v.estado === 'Vendido' ? 0.75 : 1 }}
                onClick={() => setSelected(v)}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={v.imagenes[0]} alt={`${v.marca} ${v.modelo}`} loading="lazy" onError={onImgError} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ filter: v.estado === 'Vendido' ? 'grayscale(1)' : undefined }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: C.card, color: C.silver, border: `1px solid ${C.border}` }}>
                    {v.tipo}
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: ESTADO_STYLE[v.estado].bg, color: ESTADO_STYLE[v.estado].color }}>
                    {v.estado}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="mexus-display font-bold text-base leading-tight">{v.marca} {v.modelo}</h3>
                  <p className="text-xs mt-0.5" style={{ color: C.textDim }}>
                    {v.year} · {v.motor}{v.importadoUSA && <span className="inline-flex items-center gap-0.5 ml-1.5" style={{ color: C.green }}><BadgeCheck size={11} /> USA</span>}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: C.textDim }}>
                    <span className="flex items-center gap-1"><Gauge size={13} /> {formatKm(v.km)}</span>
                    <span className="flex items-center gap-1"><Cog size={13} /> {v.transmision.split(' ')[0]}</span>
                  </div>

                  <div className="flex items-end justify-between mt-4 pt-3 border-t" style={{ borderColor: C.border }}>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.textDim }}>Precio</p>
                      <p className="mexus-display font-extrabold text-lg leading-none" style={{ color: C.green }}>{formatPrice(v.precio)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {v.estado !== 'Vendido' && (
                        <a href={waUrl(v)} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} title="Cotizar por WhatsApp"
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105" style={{ backgroundColor: '#25D366', color: 'white' }}>
                          <MessageCircle size={18} />
                        </a>
                      )}
                      <button className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all group-hover:gap-2" style={{ backgroundColor: C.cardHover, color: C.text }}>
                        Ver Ficha <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search size={36} className="mx-auto mb-3" style={{ color: `${C.textDim}40` }} />
            <p className="font-semibold" style={{ color: C.textDim }}>No encontramos vehículos con esa búsqueda.</p>
          </div>
        )}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t" style={{ borderColor: C.border, backgroundColor: C.card }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={logoImg} alt="Mexus Motors" className="h-8 w-auto object-contain" />
              <span className="mexus-display font-extrabold" style={{ color: C.text }}>MEXUS MOTORS</span>
            </div>
            <p style={{ color: C.textDim }}>{clientConfig.description}</p>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: C.textDim }}>Contacto</h4>
            <p className="flex items-center gap-2.5" style={{ color: C.textDim }}><Phone size={15} style={{ color: C.silver }} /> {clientConfig.phone}</p>
            <p className="flex items-center gap-2.5" style={{ color: C.textDim }}><MapPin size={15} style={{ color: C.silver }} /> {clientConfig.address}</p>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: C.textDim }}>Servicios</h4>
            <p style={{ color: C.textDim }}>Importación desde USA</p>
            <p style={{ color: C.textDim }}>Financiamiento y trámites</p>
            <p style={{ color: C.textDim }}>Garantía mecánica</p>
          </div>
        </div>
        <div className="py-4 border-t text-center" style={{ borderColor: C.border }}>
          <p className="text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 flex-wrap" style={{ color: `${C.textDim}70` }}>
            © {new Date().getFullYear()} {clientConfig.businessName}. · Página realizada por
            <a href="https://imagineandstamp.site" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" style={{ color: C.silver }}>IMAGINE & STAMP</a>
          </p>
        </div>
      </footer>

      {/* ═══ MODAL FICHA TÉCNICA ═══ */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[90] flex items-end md:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full md:max-w-3xl max-h-[92vh] md:rounded-3xl overflow-hidden flex flex-col"
              style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b shrink-0" style={{ borderColor: C.border, backgroundColor: C.card }}>
                <div className="flex items-center gap-2">
                  <CircleDollarSign size={18} style={{ color: C.green }} />
                  <span className="mexus-display font-bold text-sm">Ficha Técnica</span>
                </div>
                <div className="flex items-center gap-1">
                  <a href={waUrl(selected)} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-white/5" style={{ color: C.textDim }} title="Compartir"><Share2 size={17} /></a>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-white/5" style={{ color: C.textDim }}><X size={20} /></button>
                </div>
              </div>

              {/* Contenido scroll */}
              <div className="flex-1 overflow-y-auto">
                {/* Galería */}
                <div className="relative">
                  <div className="relative aspect-[16/10] md:aspect-[16/9] bg-black">
                    <AnimatePresence mode="wait">
                      <motion.img key={activeImg} src={selected.imagenes[activeImg]} alt={`${selected.marca} ${selected.modelo}`} onError={onImgError}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full object-cover" />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-5">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: '#00000080', color: 'white', border: '1px solid #ffffff20' }}>
                        {GALERIA_LABELS[activeImg] || `Foto ${activeImg + 1}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 p-3 overflow-x-auto mexus-hide-scrollbar" style={{ backgroundColor: C.card }}>
                    {selected.imagenes.map((src, i) => (
                      <button key={i} onClick={() => setActiveImg(i)} className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all"
                        style={{ borderColor: activeImg === i ? C.green : C.border }}>
                        <img src={src} alt={GALERIA_LABELS[i] || `Foto ${i + 1}`} onError={onImgError} loading="lazy" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 text-[8px] font-bold text-center py-0.5" style={{ backgroundColor: '#00000080', color: 'white' }}>{GALERIA_LABELS[i] || `Foto ${i + 1}`}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info principal */}
                <div className="px-5 md:px-7 py-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: ESTADO_STYLE[selected.estado].bg, color: ESTADO_STYLE[selected.estado].color }}>
                          {selected.estado}
                        </span>
                        {selected.importadoUSA && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ backgroundColor: C.green, color: C.bg }}>
                            <BadgeCheck size={11} /> Importado USA
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: `${C.silver}14`, color: C.silver }}>{selected.tipo}</span>
                      </div>
                      <h2 className="mexus-display font-extrabold text-2xl md:text-3xl tracking-tight">{selected.marca} {selected.modelo}</h2>
                      <p className="text-sm mt-1" style={{ color: C.textDim }}>{selected.year} · Motor {selected.motor} · {selected.hp} HP</p>
                    </div>
                    <div className="rounded-2xl px-5 py-3 text-right border" style={{ backgroundColor: `${C.green}14`, borderColor: `${C.green}40` }}>
                      <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.textDim }}>Precio</p>
                      <p className="mexus-display font-extrabold text-xl md:text-2xl leading-tight" style={{ color: C.green }}>{formatPrice(selected.precio)}</p>
                    </div>
                  </div>

                  <p className="text-sm mt-4 leading-relaxed" style={{ color: C.textDim }}>{selected.descripcion}</p>

                  {/* Ficha técnica */}
                  <h3 className="mexus-display font-bold text-xs uppercase tracking-[0.18em] mt-7 mb-3 flex items-center gap-2" style={{ color: C.silver }}>
                    <Settings2 size={15} /> Ficha Técnica
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      ['Marca', selected.marca],
                      ['Modelo', selected.modelo],
                      ['Año', String(selected.year)],
                      ['Tipo', selected.tipo],
                      ['Motor', selected.motor],
                      ['Potencia', `${selected.hp} HP`],
                      ['Transmisión', selected.transmision],
                      ['Tracción', selected.traccion],
                      ['Kilometraje', formatKm(selected.km)],
                      ['Combustible', selected.combustible],
                      ['Color Ext.', selected.colorExt],
                      ['Color Int.', selected.colorInt],
                      ['Pasajeros', String(selected.pasajeros)],
                    ].map(([k, val]) => (
                      <div key={k} className="rounded-xl px-3 py-2.5 border" style={{ backgroundColor: C.card, borderColor: C.border }}>
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.textDim }}>{k}</p>
                        <p className="text-sm font-semibold mt-0.5">{val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Equipamiento */}
                  <h3 className="mexus-display font-bold text-xs uppercase tracking-[0.18em] mt-7 mb-3 flex items-center gap-2" style={{ color: C.silver }}>
                    <BadgeCheck size={15} /> Equipamiento Destacado
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {selected.equipamiento.map(eq => {
                      const Icon = EQUIPMENT_ICONS[eq] || Check;
                      return (
                        <div key={eq} className="flex items-center gap-2.5 rounded-xl px-3 py-3 border" style={{ backgroundColor: C.card, borderColor: C.border }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${C.green}14` }}>
                            <Icon size={16} style={{ color: C.green }} />
                          </div>
                          <span className="text-xs font-semibold leading-tight">{eq}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CTA sticky */}
              <div className="p-4 md:p-5 border-t shrink-0" style={{ borderColor: C.border, backgroundColor: C.card }}>
                <a href={waUrl(selected)} target="_blank" rel="noreferrer"
                  className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{ backgroundColor: '#25D366', color: 'white', boxShadow: '0 12px 34px -10px #25D36680' }}>
                  <MessageCircle size={20} /> Solicitar Informes por WhatsApp
                </a>
                <p className="text-center text-[10px] mt-2" style={{ color: C.textDim }}>
                  Respuesta inmediata · Asesoría sin costo <span className="mx-1">·</span> <ArrowRight size={10} className="inline" /> {selected.marca} {selected.modelo} {selected.year}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ WHATSAPP FLOTANTE ═══ */}
      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"
        className="fixed bottom-6 right-5 z-50 p-4 rounded-full transition-all hover:scale-110"
        style={{ backgroundColor: '#25D366', color: 'white', boxShadow: '0 14px 34px -8px #25D36690' }}>
        <MessageCircle size={26} fill="currentColor" />
      </a>
    </div>
  );
}
