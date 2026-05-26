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
  Eye, EyeOff, RefreshCw, Check, ChevronDown, Image as ImageIcon,
  Folder, ClipboardList, ArrowUp, ArrowDown
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
  { id: 'all',         label: '🎃 Todo' },
  { id: 'terror',      label: '💀 Terror' },
  { id: 'superheroes', label: '🦸 Superhéroes' },
  { id: 'infantiles',  label: '🧸 Infantiles' },
  { id: 'accesorios',  label: '🎭 Accesorios' },
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
      client: 'María López',
      phone: '55 1234 5678',
      paymentMethod: 'TRANSFERENCIA',
      status: 'PENDIENTE',
      products: [
        { name: 'Bruja Escarlata', qty: 1, price: 850 },
        { name: 'Telaraña Deco', qty: 2, price: 150 }
      ],
      total: 1150
    },
    {
      id: 'ORD-002',
      client: 'Carlos Ramírez',
      phone: '55 9876 5432',
      paymentMethod: 'TRANSFERENCIA',
      status: 'ENTREGADO',
      products: [
        { name: 'Máscara Jason', qty: 1, price: 450 }
      ],
      total: 450
    }
  ]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PENDIENTE' | 'ENTREGADO'>('PENDIENTE');


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
      <div style={{
        padding: '16px',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto', padding: '0 16px',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          background: '#fff', borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #FF6A00, #FF8C00)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 4px 16px rgba(255,106,0,0.35)',
            }}>
              🎃
            </div>
            <div>
              <p style={{ color: '#0a0a0a', fontWeight: 900, fontSize: 14, lineHeight: 1, margin: 0 }}>
                MUNDO DE HALLOWEEN
              </p>
              <p style={{ color: '#FF6A00', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>
                Panel de Control
              </p>
            </div>
          </div>

          {/* Tabs */}
          <nav style={{
            display: 'flex', background: 'rgba(0,0,0,0.04)',
            borderRadius: 12, padding: 4, gap: 4,
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setEditingId(null); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 9,
                  border: 'none', cursor: 'pointer',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #FF6A00, #FF8C00)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#666',
                  fontWeight: 800, fontSize: 11,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  transition: 'all 0.2s',
                }}
              >
                <tab.icon size={12} />
                <span style={{ display: window.innerWidth < 600 ? 'none' : undefined }}>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { if (confirm('¿Restaurar catálogo de demo?')) onReset(); }}
              title="Restaurar demo"
              style={{
                width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#666', transition: 'all 0.2s',
              }}
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={onClose}
              title="Cerrar panel"
              style={{
                width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#666', transition: 'all 0.2s',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 20, margin: '0 0 4px', textTransform: 'uppercase' }}>
                Borrador de Categorías
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
                Gestiona las categorías principales del catálogo
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id} layout
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#fff', borderRadius: 16, padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <button onClick={() => reorderCategory(i, 'up')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: 0 }} disabled={i === 0}>
                        <ArrowUp size={14} color={i === 0 ? 'transparent' : '#999'} />
                      </button>
                      <button onClick={() => reorderCategory(i, 'down')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: 0 }} disabled={i === categories.length - 1}>
                        <ArrowDown size={14} color={i === categories.length - 1 ? 'transparent' : '#999'} />
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
                        style={{ background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 8, padding: '4px 8px', fontSize: 14, fontWeight: 800, color: '#0a0a0a', outline: 'none' }}
                        autoFocus
                      />
                    ) : (
                      <span style={{ color: '#0a0a0a', fontWeight: 800, fontSize: 14 }}>{cat.label}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {editingCatId === cat.id ? (
                      <button
                        onClick={() => {
                          setCategories(categories.map(c => c.id === cat.id ? { ...c, label: editingCatName } : c));
                          setEditingCatId(null);
                        }}
                        style={{
                          width: 32, height: 32, borderRadius: 8, border: 'none', background: '#10B981', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                        }}
                      >
                        <Save size={14} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.label); }}
                        style={{
                          width: 32, height: 32, borderRadius: 8, border: 'none', background: '#f5f5f5', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666',
                        }}>
                        <Edit2 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar categoría "${cat.label}"?`)) {
                          setCategories(categories.filter(c => c.id !== cat.id));
                        }
                      }}
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: 'none', background: '#fee2e2', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Nueva Categoría */}
            <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
              <input
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14, padding: '0 16px', color: '#fff', fontSize: 13, outline: 'none',
                }}
                placeholder="Nombre de la categoría..."
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
              />
              <button
                onClick={() => {
                  if (newCategoryName.trim()) {
                    const id = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-');
                    setCategories([...categories, { id, label: newCategoryName.trim() }]);
                    setNewCategoryName('');
                  }
                }}
                style={{
                  background: '#3b82f6', border: 'none', borderRadius: 14, padding: '14px 20px', cursor: 'pointer',
                  color: '#fff', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <Plus size={16} /> Crear
              </button>
            </div>
          </div>
        )}

        {/* ── PEDIDOS TAB */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 20, margin: '0 0 4px', textTransform: 'uppercase' }}>
                  Pedidos & Ventas
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
                  Gestión en tiempo real
                </p>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, padding: '9px 14px', minWidth: 200,
              }}>
                <Search size={15} color="rgba(255,255,255,0.3)" />
                <input
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, width: '100%' }}
                  placeholder="Buscar folio o cliente..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { id: 'PENDIENTE', label: 'Pendientes', count: orders.filter(o => o.status === 'PENDIENTE').length },
                { id: 'ENTREGADO', label: 'Entregados', count: orders.filter(o => o.status === 'ENTREGADO').length }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id as any)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 12, cursor: 'pointer',
                    background: orderFilter === f.id ? 'rgba(255,106,0,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${orderFilter === f.id ? 'rgba(255,106,0,0.3)' : 'transparent'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    color: orderFilter === f.id ? '#FF6A00' : 'rgba(255,255,255,0.5)',
                    fontWeight: 800, fontSize: 12, textTransform: 'uppercase',
                  }}
                >
                  {f.label}
                  <span style={{
                    background: '#FF6A00', color: '#fff', padding: '2px 6px', borderRadius: 6, fontSize: 10,
                  }}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders
                .filter(o => orderFilter === 'ALL' || o.status === orderFilter)
                .filter(o => !orderSearch || o.client.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase()))
                .map(order => (
                  <div key={order.id} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, overflow: 'hidden',
                  }}>
                    {/* Order Header */}
                    <div style={{
                      padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: 'rgba(255,255,255,0.01)',
                    }}>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>{order.id}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{order.client} • {order.phone}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#FF8C00', fontWeight: 900, fontSize: 16 }}>${order.total} MXN</div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 800 }}>{order.paymentMethod}</div>
                      </div>
                    </div>
                    {/* Products */}
                    <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.2)' }}>
                      {order.products.map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                          <span style={{ color: 'rgba(255,255,255,0.7)' }}>{p.qty}x {p.name}</span>
                          <span style={{ color: 'rgba(255,255,255,0.5)' }}>${p.price * p.qty}</span>
                        </div>
                      ))}
                    </div>
                    {/* Status Update */}
                    <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Estado del Pedido</span>
                      <select
                        value={order.status}
                        onChange={e => {
                          const val = e.target.value;
                          setOrders(orders.map(o => o.id === order.id ? { ...o, status: val } : o));
                        }}
                        style={{
                          background: order.status === 'PENDIENTE' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                          color: order.status === 'PENDIENTE' ? '#F59E0B' : '#10B981',
                          border: `1px solid ${order.status === 'PENDIENTE' ? '#F59E0B' : '#10B981'}40`,
                          borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 800,
                          outline: 'none', cursor: 'pointer', appearance: 'none',
                        }}
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="ENTREGADO">ENTREGADO</option>
                      </select>
                    </div>
                  </div>
                ))}
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
