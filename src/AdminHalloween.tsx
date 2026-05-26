/**
 * AdminHalloween.tsx
 * Panel de administración para Mundo de Halloween.
 * Diseño premium oscuro con acento naranja #FF6A00 — idéntico en estructura
 * al AdminPanel principal de Imagine & Stamp, adaptado para disfraces.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock, Package, Plus, LogOut, Tag, FileText, DollarSign,
  Trash2, Edit2, Save, X, Star, Flame, ShoppingBag, Search,
  Eye, EyeOff, RefreshCw, Check, ChevronDown, ChevronUp, Image as ImageIcon,
  Folder, ClipboardList, ArrowUp, ArrowDown, Phone, Clock, CheckCircle
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Costume {
  id: string;
  name: string;
  description: string;
  price: number;
  rentalPrice?: number;
  image: string;
  category: string;
  type: 'Renta' | 'Venta' | 'Renta y Venta';
  sizes: string[];
  badge?: 'NOVEDAD' | 'EN OFERTA' | 'MÁS VENDIDO';
  soldOut?: boolean;
}

interface AdminHalloweenProps {
  costumes: Costume[];
  onUpdate: (id: string, patch: Partial<Costume>) => void;
  onAdd: (costume: Costume) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const MASTER_PASSWORD = '1212';
const HALLOWEEN_PASSWORD = 'halloween';

const HALLOWEEN_CATEGORIES = [
  { id: 'all',                     label: '🎃 Todo' },
  { id: 'aliens',                  label: '👽 Alíens' },
  { id: 'brujas',                  label: '🧙‍♀️ Brujas' },
  { id: 'caretas',                 label: '🎭 Caretas' },
  { id: 'creepypasta',             label: '👾 Creepypasta' },
  { id: 'dr-peste',                label: '🦠 Dr. Peste' },
  { id: 'esqueletos',              label: '💀 Esqueletos' },
  { id: 'hombres-lobo',            label: '🐺 Hombres Lobo' },
  { id: 'masacre-en-texas',        label: '🪚 Masacre en Texas' },
  { id: 'michael-myers',           label: '🔪 Michael Myers' },
  { id: 'monstruos',               label: '👹 Monstruos' },
  { id: 'payasos',                 label: '🤡 Payasos' },
  { id: 'personajes-de-peliculas', label: '🎬 Personajes de Películas' },
  { id: 'scarecrow',               label: '🌾 Scarecrow' },
  { id: 'soldados',                label: '🪖 Soldados' },
  { id: 'vampiros',                label: '🧛 Vampiros' },
  { id: 'zombies',                 label: '🧟 Zombies' },
  { id: 'decorativos',             label: '🕯️ Decorativos' },
  { id: 'disfraces',               label: '👗 Disfraces' },
  { id: 'silla-electrica',         label: '⚡ Silla eléctrica' },
  { id: 'animatronics',            label: '🤖 Animatronics' },
  { id: 'otros',                   label: '✨ Otros' },
];

const BADGE_OPTIONS = [
  { value: '', label: '— Sin insignia —' },
  { value: 'NOVEDAD', label: '✨ NOVEDAD' },
  { value: 'EN OFERTA', label: '🏷️ EN OFERTA' },
  { value: 'MÁS VENDIDO', label: '🔥 MÁS VENDIDO' },
];

const COMMON_SIZES = [
  'CH', 'M', 'G', 'XG', 'Unitalla',
  'Infantil T2', 'Infantil T4', 'Infantil T6', 'Infantil T8', 'Infantil T10',
  '4-6', '7-9', '10-12',
];

const EMPTY_FORM: Omit<Costume, 'id'> = {
  name: '',
  description: '',
  price: 0,
  rentalPrice: undefined,
  image: '',
  category: 'terror',
  type: 'Renta y Venta',
  sizes: ['M', 'G'],
  badge: undefined,
  soldOut: false,
};

// ─── BADGE PILL ───────────────────────────────────────────────────────────────
const BadgePill = ({ badge }: { badge?: string }) => {
  if (!badge) return null;
  const cfg: Record<string, { bg: string; color: string; icon: string }> = {
    'NOVEDAD':    { bg: 'rgba(16,185,129,0.15)',  color: '#10B981', icon: '✨' },
    'EN OFERTA':  { bg: 'rgba(239,68,68,0.15)',   color: '#EF4444', icon: '🏷️' },
    'MÁS VENDIDO':{ bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', icon: '🔥' },
  };
  const c = cfg[badge];
  if (!c) return null;
  return (
    <span
      style={{
        background: c.bg, color: c.color,
        border: `1px solid ${c.color}40`,
        borderRadius: 6, padding: '2px 8px',
        fontSize: 10, fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        display: 'inline-flex', alignItems: 'center', gap: 4,
      }}
    >
      {c.icon} {badge}
    </span>
  );
};

// ─── INPUT FIELD WRAPPER ──────────────────────────────────────────────────────
const DarkField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{
      fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)',
    }}>
      {label}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12, padding: '12px 14px',
  color: '#fff', fontSize: 13, fontWeight: 600,
  outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

// ─── COSTUME FORM ─────────────────────────────────────────────────────────────
const CostumeForm = ({
  initial,
  onSave,
  onCancel,
  title,
}: {
  initial: Omit<Costume, 'id'>;
  onSave: (data: Omit<Costume, 'id'>) => void;
  onCancel: () => void;
  title: string;
}) => {
  const [form, setForm] = useState(initial);
  const [sizeInput, setSizeInput] = useState('');

  const set = (k: keyof typeof form, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const addSize = (s: string) => {
    const val = s.trim();
    if (val && !form.sizes.includes(val)) set('sizes', [...form.sizes, val]);
    setSizeInput('');
  };
  const removeSize = (s: string) => set('sizes', form.sizes.filter(x => x !== s));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,106,0,0.25)',
        borderRadius: 20, padding: 24,
        display: 'flex', flexDirection: 'column', gap: 18,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: '#FF6A00', fontWeight: 900, fontSize: 16, margin: 0 }}>{title}</h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
          <X size={20} />
        </button>
      </div>

      {/* Nombre */}
      <DarkField label="Nombre del disfraz *">
        <input
          style={inputStyle} value={form.name} required
          placeholder="Ej: Batman Dark Knight"
          onChange={e => set('name', e.target.value)}
          onFocus={e => (e.target.style.borderColor = '#FF6A00')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </DarkField>

      {/* Descripción */}
      <DarkField label="Descripción">
        <textarea
          style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
          value={form.description}
          placeholder="Describe el disfraz brevemente..."
          onChange={e => set('description', e.target.value)}
          onFocus={e => (e.target.style.borderColor = '#FF6A00')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </DarkField>

      {/* Precio Venta + Precio Renta */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <DarkField label="Precio de Venta ($) *">
          <input
            style={inputStyle} type="number" min="0" step="0.01"
            value={form.price || ''} required
            placeholder="850"
            onChange={e => set('price', parseFloat(e.target.value) || 0)}
            onFocus={e => (e.target.style.borderColor = '#FF6A00')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </DarkField>
        <DarkField label="Precio de Renta ($)">
          <input
            style={inputStyle} type="number" min="0" step="0.01"
            value={form.rentalPrice || ''}
            placeholder="350 (opcional)"
            onChange={e => set('rentalPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
            onFocus={e => (e.target.style.borderColor = '#7c3aed')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </DarkField>
      </div>

      {/* Categoría + Tipo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <DarkField label="Categoría *">
          <select
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {HALLOWEEN_CATEGORIES.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#1a1a1a' }}>{c.label}</option>
            ))}
          </select>
        </DarkField>
        <DarkField label="Tipo de Operación">
          <select
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            value={form.type}
            onChange={e => set('type', e.target.value as Costume['type'])}
          >
            <option style={{ background: '#1a1a1a' }} value="Renta y Venta">Renta y Venta</option>
            <option style={{ background: '#1a1a1a' }} value="Renta">Solo Renta</option>
            <option style={{ background: '#1a1a1a' }} value="Venta">Solo Venta</option>
          </select>
        </DarkField>
      </div>

      {/* Insignia */}
      <DarkField label="Insignia / Badge">
        <select
          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
          value={form.badge || ''}
          onChange={e => set('badge', e.target.value || undefined)}
        >
          {BADGE_OPTIONS.map(b => (
            <option key={b.value} value={b.value} style={{ background: '#1a1a1a' }}>{b.label}</option>
          ))}
        </select>
      </DarkField>

      {/* Tallas */}
      <DarkField label="Tallas disponibles">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {form.sizes.map(s => (
            <span key={s} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,106,0,0.18)', color: '#FF8C00',
              border: '1px solid rgba(255,106,0,0.35)',
              borderRadius: 8, padding: '4px 10px',
              fontSize: 11, fontWeight: 700,
            }}>
              {s}
              <button onClick={() => removeSize(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 0 }}>
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        {/* Tallas rápidas */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
          {COMMON_SIZES.filter(s => !form.sizes.includes(s)).map(s => (
            <button key={s} onClick={() => addSize(s)} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)',
              borderRadius: 7, padding: '3px 9px', cursor: 'pointer',
              color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600,
            }}>
              + {s}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Talla personalizada y Enter..."
            value={sizeInput}
            onChange={e => setSizeInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSize(sizeInput); } }}
            onFocus={e => (e.target.style.borderColor = '#FF6A00')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
          <button
            onClick={() => addSize(sizeInput)}
            style={{
              background: 'rgba(255,106,0,0.2)', border: '1px solid rgba(255,106,0,0.3)',
              borderRadius: 10, padding: '0 14px', cursor: 'pointer', color: '#FF6A00',
              display: 'flex', alignItems: 'center',
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </DarkField>

      {/* URL de imagen */}
      <DarkField label="URL de Imagen">
        <input
          style={inputStyle}
          placeholder="https://... o ./disfraz-local.png"
          value={form.image}
          onChange={e => set('image', e.target.value)}
          onFocus={e => (e.target.style.borderColor = '#FF6A00')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </DarkField>

      {/* Agotado toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>Marcar como Agotado</span>
        <button
          onClick={() => set('soldOut', !form.soldOut)}
          style={{
            width: 48, height: 26, borderRadius: 13,
            background: form.soldOut ? '#EF4444' : 'rgba(255,255,255,0.1)',
            border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
          }}
        >
          <div style={{
            position: 'absolute', top: 3,
            left: form.soldOut ? 25 : 3,
            width: 20, height: 20, borderRadius: '50%',
            background: '#fff', transition: 'left 0.2s',
          }} />
        </button>
      </div>

      {/* Guardar */}
      <button
        onClick={() => {
          if (!form.name || !form.price) return;
          onSave(form);
        }}
        style={{
          width: '100%', padding: '14px',
          background: 'linear-gradient(135deg, #FF6A00, #FF8C00)',
          border: 'none', borderRadius: 14, cursor: 'pointer',
          color: '#fff', fontWeight: 900, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 8px 24px rgba(255,106,0,0.4)',
          letterSpacing: '0.05em', textTransform: 'uppercase',
        }}
      >
        <Save size={18} /> Guardar Disfraz
      </button>
    </motion.div>
  );
};

// ─── MAIN ADMIN PANEL ─────────────────────────────────────────────────────────
export default function AdminHalloween({
  costumes,
  onUpdate,
  onAdd,
  onDelete,
  onReset,
  onClose,
}: AdminHalloweenProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'categories' | 'orders'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Categories state
  const [categories, setCategories] = useState(HALLOWEEN_CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const reorderCategory = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;
    const newCats = [...categories];
    const swap = direction === 'up' ? index - 1 : index + 1;
    [newCats[index], newCats[swap]] = [newCats[swap], newCats[index]];
    setCategories(newCats);
  };
  
  // Orders state
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'María López',
      phone: '55 1234 5678',
      city: 'CDMX',
      paymentMethod: 'TRANSFERENCIA',
      payment_reference: 'REF-88392',
      status: 'pending',
      date: '26/may 14:15',
      items: [
        { name: 'Bruja Escarlata', quantity: 1, price: 850 },
        { name: 'Telaraña Deco', quantity: 2, price: 150 }
      ],
      total: 1150,
      deliveryNotes: 'Dejar con el portero.',
      internalNotes: [
        { date: '26/may 14:16', text: 'Confirmó pago por transferencia.' }
      ]
    },
    {
      id: 'ORD-002',
      customer: 'Carlos Ramírez',
      phone: '55 9876 5432',
      city: 'Guadalajara',
      paymentMethod: 'TRANSFERENCIA',
      payment_reference: '',
      status: 'delivered',
      date: '25/may 11:30',
      items: [
        { name: 'Máscara Jason', quantity: 1, price: 450 }
      ],
      total: 450,
      deliveryNotes: '',
      internalNotes: []
    }
  ]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderTab, setOrderTab] = useState<'pending' | 'delivered'>('pending');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [paymentRefInputs, setPaymentRefInputs] = useState<Record<string, string>>({});

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = (id: string) => {
    if (confirm('¿Eliminar este pedido permanentemente?')) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const addNote = (orderId: string) => {
    const text = (noteInputs[orderId] || '').trim();
    if (!text) return;
    const newNote = {
      text,
      date: new Date().toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    };
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, internalNotes: [...(o.internalNotes || []), newNote] } : o));
    setNoteInputs(prev => ({ ...prev, [orderId]: '' }));
  };

  const savePaymentRef = (orderId: string) => {
    const ref = (paymentRefInputs[orderId] || '').trim();
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_reference: ref } : o));
    alert("Referencia guardada!");
  };

  const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
    pending:      { label: 'Pendiente',  color: 'text-orange-400',  bg: 'bg-orange-950/30',  border: 'border-orange-500/30' },
    'in-process': { label: 'En Proceso', color: 'text-blue-400',    bg: 'bg-blue-950/30',    border: 'border-blue-500/30'   },
    delayed:      { label: 'Demorado',   color: 'text-red-400',     bg: 'bg-red-950/30',     border: 'border-red-500/30'    },
    delivered:    { label: 'Entregado',  color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-500/30'},
  };


  // ── Login screen ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,106,0,0.2)',
            borderRadius: 24, padding: 40,
            width: '100%', maxWidth: 360,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
          }}
        >
          {/* Back button */}
          <button
            onClick={onClose}
            style={{
              alignSelf: 'flex-start', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
              padding: '6px 14px', cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700,
            }}
          >
            ← Volver
          </button>

          {/* Icon */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(255,106,0,0.12)',
            border: '2px solid rgba(255,106,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock size={32} color="#FF6A00" />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 22, margin: '0 0 4px' }}>
              Panel Admin
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>
              🎃 Mundo de Halloween
            </p>
          </div>

          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setAuthError(false); }}
            placeholder="••••"
            style={{
              width: '100%', background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${authError ? '#EF4444' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 14, padding: '14px 18px',
              color: '#fff', fontSize: 24, fontWeight: 900,
              textAlign: 'center', letterSpacing: '0.5em',
              outline: 'none', boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (password === MASTER_PASSWORD || password === HALLOWEEN_PASSWORD) {
                  setIsAuthenticated(true);
                } else {
                  setAuthError(true);
                }
              }
            }}
          />

          {authError && (
            <p style={{ color: '#EF4444', fontSize: 12, fontWeight: 700, margin: '-12px 0' }}>
              Contraseña incorrecta
            </p>
          )}

          <button
            onClick={() => {
              if (password === MASTER_PASSWORD || password === HALLOWEEN_PASSWORD) {
                setIsAuthenticated(true);
              } else {
                setAuthError(true);
              }
            }}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #FF6A00, #FF8C00)',
              border: 'none', borderRadius: 14, cursor: 'pointer',
              color: '#fff', fontWeight: 900, fontSize: 14,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              boxShadow: '0 8px 24px rgba(255,106,0,0.35)',
            }}
          >
            Ingresar
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Authenticated Panel ───────────────────────────────────────────────────
  const filtered = costumes.filter(c =>
    !searchTerm ||
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'inventory', icon: Package, label: '📦 INVENTARIO' },
    { id: 'add', icon: Plus, label: '➕ NUEVO' },
    { id: 'categories', icon: Folder, label: '📁 CATEGORÍAS' },
    { id: 'orders', icon: DollarSign, label: '💰 PEDIDOS' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: "'Inter', sans-serif", paddingBottom: 80 }}>

      {/* ── TOP NAV */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-6 bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#FF6A00]/10 rounded-xl">
            <span style={{ fontSize: '22px' }}>🎃</span>
          </div>
          <div>
            <p className="text-xl font-black text-white font-headline tracking-tight uppercase">MUNDO DE HALLOWEEN</p>
            <p className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">Panel de Control</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex bg-[#111] p-1.5 rounded-xl border border-white/5">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setEditingId(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'bg-[#FF6A00] text-white shadow' : 'text-white/40 hover:text-white/70'}`}>
                <tab.icon size={12} /> <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          <button
            onClick={() => { if (confirm('¿Restaurar catálogo de demo?')) onReset(); }}
            title="Restaurar demo"
            className="p-3 text-white/20 hover:text-[#FF6A00] transition-colors ml-2"
          >
            <RefreshCw size={20} />
          </button>
          <button onClick={onClose} className="p-3 text-white/20 hover:text-[#FF6A00] transition-colors ml-1">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* ── CONTENT */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 16px' }}>

        {/* Stats bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24,
        }}>
          {[
            { label: 'Disfraces', value: costumes.length, color: '#FF6A00', icon: '🎃' },
            { label: 'Disponibles', value: costumes.filter(c => !c.soldOut).length, color: '#10B981', icon: '✅' },
            { label: 'Agotados', value: costumes.filter(c => c.soldOut).length, color: '#EF4444', icon: '❌' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: '16px 12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ color: stat.color, fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── INVENTARIO TAB */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 20, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
                  Inventario
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>
                  {filtered.length} disfraces
                </p>
              </div>
              {/* Search */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, padding: '9px 14px',
                minWidth: 200,
              }}>
                <Search size={15} color="rgba(255,255,255,0.3)" />
                <input
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, width: '100%' }}
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(255,255,255,0.3)', display: 'flex' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.2)' }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
                  <p style={{ fontWeight: 700 }}>No hay resultados</p>
                </div>
              )}
              {filtered.map(costume => (
                <div key={costume.id}>
                  {/* Row */}
                  <motion.div
                    layout
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      background: editingId === costume.id ? 'rgba(255,106,0,0.06)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${editingId === costume.id ? 'rgba(255,106,0,0.3)' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 16, padding: '12px 16px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: 56, height: 60, borderRadius: 10,
                      overflow: 'hidden', flexShrink: 0,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      {costume.image ? (
                        <img src={costume.image} alt={costume.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon size={20} color="rgba(255,255,255,0.2)" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{costume.name}</span>
                        {costume.soldOut && (
                          <span style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '2px 7px', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            AGOTADO
                          </span>
                        )}
                        <BadgePill badge={costume.badge} />
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                          {HALLOWEEN_CATEGORIES.find(c => c.id === costume.category)?.label || costume.category}
                        </span>
                        <span style={{ fontSize: 10, color: 'rgba(124,58,237,0.7)', fontWeight: 700 }}>
                          {costume.type}
                        </span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                          Tallas: {costume.sizes.join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ color: '#FF8C00', fontWeight: 900, fontSize: 16 }}>
                        ${costume.price}
                      </div>
                      {costume.rentalPrice && (
                        <div style={{ color: '#a855f7', fontSize: 11, fontWeight: 700 }}>
                          Renta ${costume.rentalPrice}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => onUpdate(costume.id, { soldOut: !costume.soldOut })}
                        title={costume.soldOut ? 'Marcar disponible' : 'Marcar agotado'}
                        style={{
                          width: 34, height: 34, borderRadius: 9,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: costume.soldOut ? '#10B981' : 'rgba(239,68,68,0.6)',
                        }}
                      >
                        {costume.soldOut ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => setEditingId(editingId === costume.id ? null : costume.id)}
                        title="Editar"
                        style={{
                          width: 34, height: 34, borderRadius: 9,
                          background: editingId === costume.id ? 'rgba(255,106,0,0.2)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${editingId === costume.id ? 'rgba(255,106,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: editingId === costume.id ? '#FF6A00' : 'rgba(255,255,255,0.3)',
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => { if (confirm(`¿Eliminar "${costume.name}"?`)) onDelete(costume.id); }}
                        title="Eliminar"
                        style={{
                          width: 34, height: 34, borderRadius: 9,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'rgba(239,68,68,0.5)',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>

                  {/* Edit form inline */}
                  <AnimatePresence>
                    {editingId === costume.id && (
                      <motion.div
                        key={`edit-${costume.id}`}
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden', marginTop: 6 }}
                      >
                        <CostumeForm
                          title={`Editar: ${costume.name}`}
                          initial={{
                            name: costume.name,
                            description: costume.description,
                            price: costume.price,
                            rentalPrice: costume.rentalPrice,
                            image: costume.image,
                            category: costume.category,
                            type: costume.type,
                            sizes: [...costume.sizes],
                            badge: costume.badge,
                            soldOut: costume.soldOut,
                          }}
                          onSave={data => {
                            onUpdate(costume.id, data);
                            setEditingId(null);
                          }}
                          onCancel={() => setEditingId(null)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── NUEVO DISFRAZ TAB */}
        {activeTab === 'add' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 20, margin: '0 0 4px', textTransform: 'uppercase' }}>
                Nuevo Disfraz
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
                Se agrega al catálogo de forma local
              </p>
            </div>
            <CostumeForm
              title="Agregar al Catálogo"
              initial={{ ...EMPTY_FORM }}
              onSave={data => {
                onAdd({ id: `custom-${Date.now()}`, ...data });
                setActiveTab('inventory');
              }}
              onCancel={() => setActiveTab('inventory')}
            />
          </div>
        )}

        {/* ── CATEGORÍAS TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="px-2">
              <h2 className="text-2xl font-black text-white font-headline uppercase">Borrador de Categorías</h2>
              <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Gestiona las categorías principales del catálogo</p>
            </div>
            
            <div className="space-y-3">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id} layout
                  className="bg-[#1a1a1a] border border-white/5 rounded-2xl shadow-sm flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => reorderCategory(i, 'up')} className="text-white/20 hover:text-white" disabled={i === 0}>
                        <ArrowUp size={12} className={i === 0 ? 'opacity-0' : ''} />
                      </button>
                      <button onClick={() => reorderCategory(i, 'down')} className="text-white/20 hover:text-white" disabled={i === categories.length - 1}>
                        <ArrowDown size={12} className={i === categories.length - 1 ? 'opacity-0' : ''} />
                      </button>
                    </div>
                    {editingCatId === cat.id ? (
                      <input
                        value={editingCatName}
                        onChange={e => setEditingCatName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            setCategories(categories.map(c => c.id === cat.id ? { ...c, label: editingCatName } : c));
                            setEditingCatId(null);
                          }
                        }}
                        className="bg-[#111] border border-[#FF6A00] rounded-xl px-4 py-2 text-xs font-black text-white tracking-widest uppercase outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="text-white font-black text-sm uppercase tracking-widest leading-none">{cat.label}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingCatId === cat.id ? (
                      <button
                        onClick={() => {
                          setCategories(categories.map(c => c.id === cat.id ? { ...c, label: editingCatName } : c));
                          setEditingCatId(null);
                        }}
                        className="w-9 h-9 rounded-xl bg-[#10B981] text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow"
                      >
                        <Save size={14} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.label); }}
                        className="w-9 h-9 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-white/30 hover:text-[#FF6A00] hover:border-[#FF6A00]/40 transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar categoría "${cat.label}"?`)) {
                          setCategories(categories.filter(c => c.id !== cat.id));
                        }
                      }}
                      className="w-9 h-9 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-white/20 hover:text-red-500 hover:border-red-500/40 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Nueva Categoría */}
            <div className="bg-[#1a1a1a] border border-dashed border-white/10 rounded-2xl p-6">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">+ Nueva Categoría Principal</p>
              <div className="flex gap-3">
                <input 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newCategoryName.trim()) {
                      const id = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-');
                      setCategories([...categories, { id, label: newCategoryName.trim() }]);
                      setNewCategoryName('');
                    }
                  }}
                  placeholder="EJ: TERROR EXTREMO..."
                  className="flex-1 bg-[#111] border border-white/10 text-white px-4 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase outline-none focus:border-[#FF6A00] transition-all"
                />
                <button 
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      const id = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-');
                      setCategories([...categories, { id, label: newCategoryName.trim() }]);
                      setNewCategoryName('');
                    }
                  }}
                  className="px-6 py-3 bg-[#3b82f6] text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-blue-600 transition-all flex items-center gap-2"
                >
                  <Plus size={13} /> Crear
                </button>
              </div>
            </div>
          </div>
        )}


        {/* ── PEDIDOS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Header / Buscador */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 px-2">
              <div>
                <h2 className="text-2xl font-black text-white font-headline uppercase">Pedidos & Ventas</h2>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">
                  {orders.filter(o => o.status !== 'delivered').length} pendientes · {orders.filter(o => o.status === 'delivered').length} entregados
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={15} />
                <input 
                  value={orderSearch} 
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="BUSCAR POR NOMBRE O TELÉFONO..."
                  className="w-full bg-[#111] text-white p-3.5 pl-11 rounded-2xl border border-white/5 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/5 outline-none text-[10px] font-black tracking-widest placeholder:text-white/20" 
                />
              </div>
            </div>

            {/* Filtros de estado */}
            <div className="flex bg-[#111] p-1.5 rounded-2xl border border-white/5 shadow-sm inline-flex">
              <button 
                onClick={() => setOrderTab('pending')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'pending' ? 'bg-[#FF6A00] text-white shadow' : 'text-white/40 hover:text-white'}`}
              >
                <Clock size={13} /> Pendientes ({orders.filter(o => o.status !== 'delivered').length})
              </button>
              <button 
                onClick={() => setOrderTab('delivered')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'delivered' ? 'bg-emerald-500 text-white shadow' : 'text-white/40 hover:text-white'}`}
              >
                <CheckCircle size={13} /> Entregados ({orders.filter(o => o.status === 'delivered').length})
              </button>
            </div>

            {/* Lista de Pedidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {orders
                .filter(o => orderTab === 'pending' ? o.status !== 'delivered' : o.status === 'delivered')
                .filter(o => !orderSearch || o.customer.toLowerCase().includes(orderSearch.toLowerCase()) || o.phone.includes(orderSearch))
                .length === 0 ? (
                  <div className="col-span-full py-20 bg-[#1a1a1a] rounded-3xl border border-white/5 text-center">
                    <Package className="text-white/10 mx-auto mb-4" size={48} />
                    <p className="text-white/20 text-sm font-bold uppercase tracking-widest italic">
                      {orderSearch ? 'Sin resultados' : orderTab === 'pending' ? 'No hay pedidos pendientes' : 'No hay pedidos entregados'}
                    </p>
                  </div>
                ) : orders
                  .filter(o => orderTab === 'pending' ? o.status !== 'delivered' : o.status === 'delivered')
                  .filter(o => !orderSearch || o.customer.toLowerCase().includes(orderSearch.toLowerCase()) || o.phone.includes(orderSearch))
                  .map(order => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                    const isExpanded = expandedOrder === order.id;
                    return (
                      <div key={order.id} className="bg-[#1a1a1a] border border-white/5 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                        <div className="flex flex-col gap-3 p-5 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                {order.id}
                              </span>
                              <p className="text-[10px] text-white/30 font-bold mt-1">{order.date}</p>
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                title="Ver notas internas"
                                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                                  isExpanded ? 'bg-[#FF6A00]/10 border-[#FF6A00]/30 text-[#FF6A00]' : 'bg-[#111] border-white/5 text-white/30 hover:text-white'
                                }`}
                              >
                                {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                              </button>
                              <button
                                onClick={() => deleteOrder(order.id)}
                                title="Eliminar pedido"
                                className="w-8 h-8 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-white/20 hover:text-red-500 hover:border-red-500/40 transition-all"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white font-black text-sm uppercase tracking-wide">{order.customer}</h4>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                              <span className="text-[10px] text-white/40 font-bold flex items-center gap-1">
                                <Phone size={9} className="text-[#FF6A00]" />{order.phone}
                              </span>
                              {order.city && <span className="text-[10px] text-white/40 font-bold">📍 {order.city}</span>}
                            </div>
                          </div>

                          {/* Forma de pago */}
                          {order.paymentMethod && (
                            <div className="flex flex-col gap-2">
                              <span className={`self-start text-[9px] font-black px-2 py-0.5 rounded-full border tracking-widest uppercase ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                                💳 {order.paymentMethod}
                              </span>
                              
                              {(order.paymentMethod.toLowerCase().includes('transferencia') || order.paymentMethod.toLowerCase().includes('tarjeta') || order.payment_reference) && (
                                <div className="flex gap-2">
                                  <input 
                                    placeholder="REF: #000000"
                                    defaultValue={order.payment_reference || ''}
                                    onChange={(e) => setPaymentRefInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                                    className="flex-1 bg-[#111] border border-white/5 p-1.5 rounded-lg text-[10px] uppercase font-bold outline-none focus:border-[#FF6A00] text-white"
                                  />
                                  <button 
                                    onClick={() => savePaymentRef(order.id)}
                                    className="bg-[#FF6A00] text-white px-2 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all"
                                  >
                                    OK
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Items / Desglose de totales */}
                          <div className="bg-[#111] p-3 rounded-xl border border-white/5 space-y-1">
                            {(order.items || []).map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-[11px]">
                                <span className="text-white/60 font-medium truncate pr-2">{item.name} <span className="font-black">x{item.quantity}</span></span>
                                <span className="text-white font-black shrink-0">${item.price * item.quantity}</span>
                              </div>
                            ))}
                            {order.deliveryNotes && (
                              <p className="text-[10px] text-white/30 italic border-t border-white/5 pt-1.5 mt-1">📝 {order.deliveryNotes}</p>
                            )}
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">Total</span>
                            <span className="text-[#FF8C00] font-black text-lg">${order.total} <span className="text-[10px] text-white/40">MXN</span></span>
                          </div>

                          {/* Selector de estatus */}
                          <select
                            value={order.status || 'pending'}
                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                            className={`w-full p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer transition-all ${cfg.bg} ${cfg.border} ${cfg.color}`}
                          >
                            <option value="pending" style={{ background: '#111' }}>⏳ Pendiente</option>
                            <option value="in-process" style={{ background: '#111' }}>🔄 En Proceso</option>
                            <option value="delayed" style={{ background: '#111' }}>⚠️ Demorado</option>
                            <option value="delivered" style={{ background: '#111' }}>✅ Entregado</option>
                          </select>
                        </div>

                        {/* Panel de notas internas (expandible) */}
                        {isExpanded && (
                          <div className="border-t border-white/5 p-4 bg-black/30 space-y-3">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Notas Internas</p>
                            <div className="space-y-2 max-h-36 overflow-y-auto">
                              {(order.internalNotes || []).length === 0 ? (
                                <p className="text-[11px] text-white/20 italic">Sin notas todavía...</p>
                              ) : (order.internalNotes || []).map((note: any, i: number) => (
                                <div key={i} className="bg-[#111] rounded-xl p-3 border border-white/5">
                                  <p className="text-[9px] text-[#FF6A00] font-black uppercase tracking-widest mb-1">{note.date}</p>
                                  <p className="text-xs text-white/70 font-medium leading-relaxed">{note.text}</p>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2 pt-1">
                              <input
                                value={noteInputs[order.id] || ''}
                                onChange={e => setNoteInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                                onKeyDown={e => e.key === 'Enter' && addNote(order.id)}
                                placeholder="Añadir nota interna..."
                                className="flex-1 bg-[#111] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#FF6A00] transition-all"
                              />
                              <button
                                onClick={() => addNote(order.id)}
                                className="px-3 py-2 bg-[#FF6A00] text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-orange-600 transition-all flex items-center gap-1"
                              >
                                <Save size={12} /> Guardar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
            </div>
          </div>
        )}
      </div>

      {/* ── DEMO BANNER */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(10,10,10,0.98)',
        borderTop: '1px solid rgba(255,106,0,0.15)',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backdropFilter: 'blur(10px)', zIndex: 40,
      }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          🎃 Modo Demo — Los cambios son locales (sesión actual)
        </p>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,106,0,0.15)', border: '1px solid rgba(255,106,0,0.25)',
            borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
            color: '#FF6A00', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
          }}
        >
          Ver Tienda
        </button>
      </div>
    </div>
  );
}
