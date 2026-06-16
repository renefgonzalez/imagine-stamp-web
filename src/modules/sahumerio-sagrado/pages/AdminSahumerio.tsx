/**
 * AdminSahumerio.tsx
 * Panel de administración para Sahumerio Sagrado.
 * Diseño premium oscuro con acento naranja #B892FF — idéntico en estructura
 * al AdminPanel principal de Imagine & Stamp, adaptado para disfraces.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock, Package, Plus, LogOut, Tag, FileText, DollarSign,
  Trash2, Edit2, Save, X, Star, Flame, ShoppingBag, Search,
  Eye, EyeOff, RefreshCw, Check, ChevronDown, ChevronUp, Image as ImageIcon,
  Folder, ClipboardList, ArrowUp, ArrowDown, Phone, Clock, CheckCircle, Settings, Ticket
} from 'lucide-react';
import { supabaseSahumerio as supabase } from '../lib/supabase';


function mergeCategoriesWithDefaults(dbCategories: any[]) {
  return dbCategories.map(dbCat => {
    const defaultCat = SAHUMERIO_CATEGORIES.find(c => c.id === dbCat.id);
    return {
      ...dbCat,
      emoji: dbCat.emoji || defaultCat?.label.match(/^[^\w\s]+/)?.[0] || '✨',
    };
  });
}
export interface Coupon {
  id: string;
  code: string;
  discount_value: number;
  discount_type: 'percentage' | 'fixed';
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  active: boolean;
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rentalPrice?: number;
  image: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  video_url?: string;
  category: string;
  type: 'Renta' | 'Venta' | 'Renta y Venta';
  sizes: string[];
  badge?: 'NUEVO' | 'EN OFERTA' | 'MÁS VENDIDO' | 'PROXIMAMENTE';
  sub_category_2?: string;
  soldOut?: boolean;
  rating?: number;
}

interface AdminSahumerioProps {
  products: Product[];
  onUpdate: (id: string, patch: Partial<Product>) => void;
  onAdd: (product: Product) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const MASTER_PASSWORD = '1212';
const SAHUMERIO_PASSWORD = 'Sagrado';

const SAHUMERIO_CATEGORIES = [
  { id: 'all',                     label: '✨ Todo' },
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
  { value: 'NUEVO', label: '✨ NUEVO' },
  { value: 'EN OFERTA', label: '🏷️ EN OFERTA' },
  { value: 'MÁS VENDIDO', label: '🔥 MÁS VENDIDO' },
  { value: 'PROXIMAMENTE', label: '⏳ PROXIMAMENTE' },
];

const COMMON_SIZES = [
  'CH', 'M', 'G', 'XG', 'Unitalla',
  'Infantil T2', 'Infantil T4', 'Infantil T6', 'Infantil T8', 'Infantil T10',
  '4-6', '7-9', '10-12',
];

const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  rentalPrice: undefined,
  image: '',
  category: 'otros',
  type: 'Renta y Venta',
  sizes: ['M', 'G'],
  badge: undefined,
  soldOut: false,
  rating: 4.8,
};

// ─── BADGE PILL ───────────────────────────────────────────────────────────────
const BadgePill = ({ badge }: { badge?: string }) => {
  if (!badge) return null;
  const cfg: Record<string, { bg: string; color: string; icon: string }> = {
    'NUEVO':    { bg: 'rgba(16,185,129,0.15)',  color: '#10B981', icon: '✨' },
    'EN OFERTA':  { bg: 'rgba(34,197,94,0.15)',   color: '#4ADE80', icon: '🏷️' },
    'MÁS VENDIDO':{ bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', icon: '🔥' },
    'PROXIMAMENTE':{ bg: 'rgba(168,85,247,0.15)', color: '#A855F7', icon: '⏳' },
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
const ProductForm = ({
  initial,
  onSave,
  onCancel,
  title,
  categoriesList,
}: {
  initial: Omit<Product, 'id'>;
  onSave: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  title: string;
  categoriesList: {id: string, label: string, emoji?: string}[];
}) => {
  const [form, setForm] = useState({ ...initial, sizes: initial.sizes || [] });
  const [sizeInput, setSizeInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFile2, setImageFile2] = useState<File | null>(null);
  const [imageFile3, setImageFile3] = useState<File | null>(null);
  const [imageFile4, setImageFile4] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Si la categoría del formulario no existe en la lista de categorías disponibles
  // (p. ej. producto antiguo con 'terror', o categoría borrada), la corregimos
  // automáticamente a la primera categoría real para que el select no muestre
  // una opción "fantasma" y el valor guardado siempre sea filtrable en el inicio.
  useEffect(() => {
    if (!categoriesList || categoriesList.length === 0) return;
    const valid = categoriesList.some(c => c.id === form.category && c.id !== 'all');
    if (!valid) {
      const firstReal = categoriesList.find(c => c.id !== 'all');
      if (firstReal) setForm(prev => ({ ...prev, category: firstReal.id }));
    }
  }, [categoriesList]);

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
        <h3 style={{ color: '#B892FF', fontWeight: 900, fontSize: 16, margin: 0 }}>{title}</h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
          <X size={20} />
        </button>
      </div>

      {/* Nombre */}
      <DarkField label="Nombre del producto *">
        <input
          style={inputStyle} value={form.name} required
          placeholder="Ej: Batman Dark Knight"
          onChange={e => set('name', e.target.value)}
          onFocus={e => (e.target.style.borderColor = '#B892FF')}
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
          onFocus={e => (e.target.style.borderColor = '#B892FF')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </DarkField>

      {/* Video URL */}
      <DarkField label="Video de TikTok o YouTube (opcional)">
        <input
          style={inputStyle} value={form.video_url || ''}
          placeholder="Ej: https://www.tiktok.com/@user/video/... o YouTube"
          onChange={e => set('video_url', e.target.value)}
          onFocus={e => (e.target.style.borderColor = '#EF4444')}
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
            onFocus={e => (e.target.style.borderColor = '#B892FF')}
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

      {form.badge === 'EN OFERTA' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <DarkField label="Precio Original (Tachado) *">
            <input
              style={{ ...inputStyle, borderColor: 'rgba(239, 68, 68, 0.4)' }} type="number" min="0" step="0.01"
              value={form.originalPrice || ''} required
              placeholder="Ej: 1200"
              onChange={e => set('originalPrice', parseFloat(e.target.value) || 0)}
              onFocus={e => (e.target.style.borderColor = '#EF4444')}
              onBlur={e => (e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)')}
            />
          </DarkField>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
              Este precio aparecerá tachado y pequeño, para resaltar el precio de oferta actual.
            </p>
          </div>
        </div>
      )}

      {/* Categoría + Tipo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <DarkField label="Categoría *">
          <select
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {categoriesList.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.id} style={{ background: '#1a1a1a' }}>
                {c.emoji ? `${c.emoji} ` : ''}{c.label}
              </option>
            ))}
          </select>
        </DarkField>
        <DarkField label="Tipo de Operación">
          <select
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            value={form.type}
            onChange={e => set('type', e.target.value as Product['type'])}
          >
            <option style={{ background: '#1a1a1a' }} value="Renta y Venta">Renta y Venta</option>
            <option style={{ background: '#1a1a1a' }} value="Renta">Solo Renta</option>
            <option style={{ background: '#1a1a1a' }} value="Venta">Solo Venta</option>
          </select>
        </DarkField>
      </div>

      {/* Insignia + Calificación */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <DarkField label="Insignia / Badge">
          <select
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            value={form.badge || ''}
            onChange={e => set('badge', e.target.value || null)}
          >
            {BADGE_OPTIONS.map(b => (
              <option key={b.value} value={b.value} style={{ background: '#1a1a1a' }}>{b.label}</option>
            ))}
          </select>
        </DarkField>
        <DarkField label="⭐ Calificación (1.0 – 5.0)">
          <input
            style={inputStyle}
            type="number"
            min="1" max="5" step="0.1"
            value={form.rating ?? 4.8}
            onChange={e => set('rating', Math.min(5, Math.max(1, parseFloat(e.target.value) || 4.8)))}
            onFocus={e => (e.target.style.borderColor = '#F59E0B')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </DarkField>
      </div>

      {/* Tallas */}
      <DarkField label="Tallas disponibles">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {form.sizes.map(s => (
            <span key={s} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'rgba(255,106,0,0.18)', color: '#CBA8FF',
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
            onFocus={e => (e.target.style.borderColor = '#B892FF')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
          <button
            onClick={() => addSize(sizeInput)}
            style={{
              background: 'rgba(255,106,0,0.2)', border: '1px solid rgba(255,106,0,0.3)',
              borderRadius: 10, padding: '0 14px', cursor: 'pointer', color: '#B892FF',
              display: 'flex', alignItems: 'center',
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </DarkField>

      {/* URL de imagen */}
      <DarkField label="Imagen del Producto *">
        <div
          style={{
            ...inputStyle,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: 100, borderStyle: 'dashed', cursor: 'pointer', position: 'relative',
            borderColor: 'rgba(255,255,255,0.1)'
          }}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {imageFile ? (
            <span style={{ color: '#fff', fontSize: 13 }}>{imageFile.name}</span>
          ) : form.image ? (
            <span style={{ color: '#fff', fontSize: 13, wordBreak: 'break-all', padding: '0 10px', textAlign: 'center' }}>
              {form.image}
            </span>
          ) : (
            <>
              <ImageIcon size={24} color="rgba(255,255,255,0.4)" style={{ marginBottom: 8 }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Haz clic para subir una imagen</span>
            </>
          )}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
          />
        </div>
      </DarkField>

      {/* Fotos adicionales (galería) */}
      <DarkField label="Foto adicional 2 (opcional)">
        <div
          style={{
            ...inputStyle,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: 80, borderStyle: 'dashed', cursor: 'pointer', position: 'relative',
            borderColor: imageFile2 || form.image_2 ? 'rgba(255,106,0,0.5)' : 'rgba(255,255,255,0.1)'
          }}
          onClick={() => document.getElementById('image-upload-2')?.click()}
        >
          {imageFile2 ? (
            <span style={{ color: '#CBA8FF', fontSize: 13 }}>✓ {imageFile2.name}</span>
          ) : form.image_2 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <img src={form.image_2} alt="foto 2" style={{ height: 48, width: 48, objectFit: 'cover', borderRadius: 8 }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Toca para cambiar</span>
            </div>
          ) : (
            <>
              <ImageIcon size={20} color="rgba(255,255,255,0.3)" style={{ marginBottom: 4 }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Foto 2 — ángulo diferente</span>
            </>
          )}
          <input id="image-upload-2" type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) setImageFile2(e.target.files[0]); }} />
        </div>
        {form.image_2 && !imageFile2 && (
          <button onClick={() => { setForm(prev => ({ ...prev, image_2: '' })); }}
            style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 12, cursor: 'pointer', marginTop: 4, textAlign: 'left' }}>
            ✕ Eliminar foto 2
          </button>
        )}
      </DarkField>

      <DarkField label="Foto adicional 3 (opcional)">
        <div
          style={{
            ...inputStyle,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: 80, borderStyle: 'dashed', cursor: 'pointer', position: 'relative',
            borderColor: imageFile3 || form.image_3 ? 'rgba(255,106,0,0.5)' : 'rgba(255,255,255,0.1)'
          }}
          onClick={() => document.getElementById('image-upload-3')?.click()}
        >
          {imageFile3 ? (
            <span style={{ color: '#CBA8FF', fontSize: 13 }}>✓ {imageFile3.name}</span>
          ) : form.image_3 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <img src={form.image_3} alt="foto 3" style={{ height: 48, width: 48, objectFit: 'cover', borderRadius: 8 }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Toca para cambiar</span>
            </div>
          ) : (
            <>
              <ImageIcon size={20} color="rgba(255,255,255,0.3)" style={{ marginBottom: 4 }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Foto 3 — detalle o accesorio</span>
            </>
          )}
          <input id="image-upload-3" type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) setImageFile3(e.target.files[0]); }} />
        </div>
        {form.image_3 && !imageFile3 && (
          <button onClick={() => { setForm(prev => ({ ...prev, image_3: '' })); }}
            style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 12, cursor: 'pointer', marginTop: 4, textAlign: 'left' }}>
            ✕ Eliminar foto 3
          </button>
        )}
      </DarkField>

      <DarkField label="Foto adicional 4 (opcional)">
        <div
          style={{
            ...inputStyle,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: 80, borderStyle: 'dashed', cursor: 'pointer', position: 'relative',
            borderColor: imageFile4 || form.image_4 ? 'rgba(255,106,0,0.5)' : 'rgba(255,255,255,0.1)'
          }}
          onClick={() => document.getElementById('image-upload-4')?.click()}
        >
          {imageFile4 ? (
            <span style={{ color: '#CBA8FF', fontSize: 13 }}>✓ {imageFile4.name}</span>
          ) : form.image_4 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <img src={form.image_4} alt="foto 4" style={{ height: 48, width: 48, objectFit: 'cover', borderRadius: 8 }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Toca para cambiar</span>
            </div>
          ) : (
            <>
              <ImageIcon size={20} color="rgba(255,255,255,0.3)" style={{ marginBottom: 4 }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Foto 4 — detalle o accesorio</span>
            </>
          )}
          <input id="image-upload-4" type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) setImageFile4(e.target.files[0]); }} />
        </div>
        {form.image_4 && !imageFile4 && (
          <button onClick={() => { setForm(prev => ({ ...prev, image_4: '' })); }}
            style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 12, cursor: 'pointer', marginTop: 4, textAlign: 'left' }}>
            ✕ Eliminar foto 4
          </button>
        )}
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

      {/* Carrusel toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>🌟 Mostrar en Carrusel Superior</span>
        <button
          onClick={() => set('sub_category_2', form.sub_category_2 === 'CARRUSEL_SAHUMERIO' ? '' : 'CARRUSEL_SAHUMERIO')}
          style={{
            width: 48, height: 26, borderRadius: 13,
            background: form.sub_category_2 === 'CARRUSEL_SAHUMERIO' ? '#B892FF' : 'rgba(255,255,255,0.1)',
            border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
          }}
        >
          <div style={{
            position: 'absolute', top: 3,
            left: form.sub_category_2 === 'CARRUSEL_SAHUMERIO' ? 25 : 3,
            width: 20, height: 20, borderRadius: '50%',
            background: '#fff', transition: 'left 0.2s',
          }} />
        </button>
      </div>

      {/* Guardar */}
      <button
        onClick={async () => {
          if (!form.name || !form.price) return;
          
          let finalImageUrl = form.image;
          let finalImage2 = form.image_2 || '';
          let finalImage3 = form.image_3 || '';
          let finalImage4 = form.image_4 || '';
          
          const uploadFile = async (file: File) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('productos').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('productos').getPublicUrl(fileName);
            return publicUrl;
          };

          setIsUploading(true);
          try {
            if (imageFile) finalImageUrl = await uploadFile(imageFile);
            if (imageFile2) finalImage2 = await uploadFile(imageFile2);
            if (imageFile3) finalImage3 = await uploadFile(imageFile3);
            if (imageFile4) finalImage4 = await uploadFile(imageFile4);
          } catch (error) {
            console.error(error);
            alert('Error al subir una imagen. Verifica que el bucket "productos" exista.');
            setIsUploading(false);
            return;
          }
          
          onSave({ ...form, image: finalImageUrl, image_2: finalImage2 || '', image_3: finalImage3 || '', image_4: finalImage4 || '' });
          setIsUploading(false);
        }}
        style={{
          width: '100%', padding: '14px',
          background: 'linear-gradient(135deg, #B892FF, #CBA8FF)',
          border: 'none', borderRadius: 14, cursor: 'pointer',
          color: '#fff', fontWeight: 900, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 8px 24px rgba(255,106,0,0.4)',
          letterSpacing: '0.05em', textTransform: 'uppercase',
          opacity: isUploading ? 0.7 : 1,
          pointerEvents: isUploading ? 'none' : 'auto',
        }}
        disabled={isUploading}
      >
        <Save size={18} /> {isUploading ? 'Subiendo imagen...' : 'Guardar Producto'}
      </button>
    </motion.div>
  );
};

// ─── MAIN ADMIN PANEL ─────────────────────────────────────────────────────────
export default function AdminSahumerio({
  products,
  onUpdate,
  onAdd,
  onDelete,
  onClose,
}: AdminSahumerioProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'categories' | 'orders' | 'settings' | 'reviews' | 'cupones' | 'promociones'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Categories state
  const [categories, setCategories] = useState<{id: string, label: string, emoji?: string, order_index?: number}[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('✨');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [editingCatEmoji, setEditingCatEmoji] = useState('');

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isCouponsLoading, setIsCouponsLoading] = useState(false);
  const [couponForm, setCouponForm] = useState<Partial<Coupon>>({ active: true, discount_type: 'percentage', discount_value: 0 });

  const loadCoupons = async () => {
    setIsCouponsLoading(true);
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setIsCouponsLoading(false);
    if (!error && data) {
      setCoupons(data as Coupon[]);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'cupones') {
      loadCoupons();
    }
  }, [activeTab]);

  const saveCoupon = async () => {
    if (!couponForm.code || !couponForm.discount_value) return alert('Llena los campos obligatorios');
    
    const couponData = {
      code: couponForm.code.trim().toUpperCase(),
      discount_value: couponForm.discount_value,
      discount_type: couponForm.discount_type || 'percentage',
      max_uses: couponForm.max_uses || null,
      expires_at: couponForm.expires_at || null,
      active: couponForm.active ?? true,
      uses_count: couponForm.uses_count ?? 0,
    };

    let error;
    if (couponForm.id) {
      // Editar cupón existente
      ({ error } = await supabase.from('coupons').update(couponData).eq('id', couponForm.id));
    } else {
      // Crear cupón nuevo (sin enviar id, Supabase lo genera)
      ({ error } = await supabase.from('coupons').insert(couponData));
    }

    if (error) {
      alert('Error guardando cupón: ' + error.message);
    } else {
      setCouponForm({ active: true, discount_type: 'percentage', discount_value: 0 });
      loadCoupons();
    }
  };

  // Guarda (inserta o actualiza) una categoría en Supabase mostrando el error
  // si la escritura falla, en lugar de fallar en silencio.
  const saveCategory = async (cat: { id: string; label: string; emoji?: string; order_index?: number }) => {
    const { error } = await supabase.from('categories').upsert({
      id: cat.id,
      label: cat.label,
      emoji: cat.emoji || '✨',
      order_index: cat.order_index ?? 0,
    });
    if (error) {
      console.error('Error al guardar categoría:', error);
      alert(`No se pudo guardar la categoría en la base de datos.\n\n${error.message}\n\nRevisa los permisos (RLS) de la tabla "categories" en Supabase.`);
      return false;
    }
    return true;
  };

  const reorderTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const reorderCategory = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;
    const newCats = [...categories];
    const swap = direction === 'up' ? index - 1 : index + 1;
    [newCats[index], newCats[swap]] = [newCats[swap], newCats[index]];
    setCategories(newCats);
    
    // Guardar nuevo orden en Supabase (en background con debounce).
    if (reorderTimeoutRef.current) clearTimeout(reorderTimeoutRef.current);
    reorderTimeoutRef.current = setTimeout(() => {
      supabase.from('categories').upsert(
        newCats.map((c, i) => ({ id: c.id, label: c.label, emoji: c.emoji || '✨', order_index: i }))
      ).then(({ error }) => {
        if (error) console.error("Error reordering categories:", error);
      });
    }, 500);
  };
  
  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderTab, setOrderTab] = useState<'pending' | 'delivered'>('pending');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [paymentRefInputs, setPaymentRefInputs] = useState<Record<string, string>>({});
  const [bankDetails, setBankDetails] = useState('');
  const [isSavingBank, setIsSavingBank] = useState(false);

  // ── Opiniones / reseñas de clientes
  const [reviews, setReviews] = useState<{ id: string; name: string; rating: number; comment: string; approved: boolean; created_at: string }[]>([]);

  const loadReviews = async () => {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data && !error) setReviews(data);
  };

  const approveReview = async (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r));
    await supabase.from('reviews').update({ approved: true }).eq('id', id);
  };

  const deleteReview = async (id: string) => {
    if (!confirm('¿Eliminar esta opinión de forma permanente?')) return;
    setReviews(prev => prev.filter(r => r.id !== id));
    await supabase.from('reviews').delete().eq('id', id);
  };

  React.useEffect(() => {
    async function loadData() {
      // Cargar Categorías (fusionando con la lista hardcodeada para
      // preservar emojis y no perder ninguna que tenga productos asignados).
      const { data: catData } = await supabase.from('categories').select('*').order('order_index', { ascending: true });
      if (catData && catData.length > 0) {
        setCategories(mergeCategoriesWithDefaults(catData));
      } else {
        setCategories(SAHUMERIO_CATEGORIES);
      }

      // Cargar Pedidos
      const { data: ordData } = await supabase.from('orders').select('*').order('date', { ascending: false });
      if (ordData) {
        setOrders(ordData.map(o => ({
          ...o,
          paymentMethod: o.payment_method,
          deliveryNotes: o.delivery_notes,
          internalNotes: o.internal_notes || [],
          date: new Date(o.date || o.created_at).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        })));
      }

      // Cargar Configuración del Banco
      const { data: bankData } = await supabase.from('settings').select('bank_details').eq('id', 1).single();
      if (bankData) {
        setBankDetails(bankData.bank_details);
      }

      // Cargar Opiniones (todas: pendientes y aprobadas)
      const { data: reviewData } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (reviewData) {
        setReviews(reviewData);
      }
    }
    loadData();
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    await supabase.from('orders').update({ status }).eq('id', id);
  };

  const deleteOrder = async (id: string) => {
    if (confirm('¿Eliminar este pedido permanentemente?')) {
      setOrders(prev => prev.filter(o => o.id !== id));
      await supabase.from('orders').delete().eq('id', id);
    }
  };

  const addNote = async (orderId: string) => {
    const text = (noteInputs[orderId] || '').trim();
    if (!text) return;
    const newNote = {
      text,
      date: new Date().toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    };
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const newNotes = [...(order.internalNotes || []), newNote];
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, internalNotes: newNotes } : o));
    setNoteInputs(prev => ({ ...prev, [orderId]: '' }));
    await supabase.from('orders').update({ internal_notes: newNotes }).eq('id', orderId);
  };

  const savePaymentRef = async (orderId: string) => {
    const ref = (paymentRefInputs[orderId] || '').trim();
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_reference: ref } : o));
    await supabase.from('orders').update({ payment_reference: ref }).eq('id', orderId);
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
            <Lock size={32} color="#B892FF" />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 22, margin: '0 0 4px' }}>
              Panel Admin
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>
              ✨ Sahumerio Sagrado
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
                if (password === MASTER_PASSWORD || password === SAHUMERIO_PASSWORD) {
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
              if (password === MASTER_PASSWORD || password === SAHUMERIO_PASSWORD) {
                setIsAuthenticated(true);
              } else {
                setAuthError(true);
              }
            }}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #B892FF, #CBA8FF)',
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
  const filtered = products.filter(c =>
    !searchTerm ||
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'inventory', icon: Package, label: '📦 INVENTARIO' },
    { id: 'add', icon: Plus, label: '➕ NUEVO' },
    { id: 'categories', icon: Folder, label: '📂 CATEGORÍAS' },
    { id: 'cupones', icon: Ticket, label: '🎫 CUPONES' },
    { id: 'orders', icon: DollarSign, label: '🛒 PEDIDOS' },
    { id: 'reviews', icon: Star, label: '⭐ OPINIONES' },
    { id: 'promociones', icon: ImageIcon, label: '🖼️ PROMO' },
    { id: 'settings', icon: Settings, label: '⚙️ AJUSTES' },
  ];

  const pendingReviewsCount = reviews.filter(r => !r.approved).length;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: "'Inter', sans-serif", paddingBottom: 80 }}>

      {/* ── TOP NAV */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-6 bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 shadow-sm max-w-6xl mx-auto w-full mt-4">
        <div className="flex items-center gap-4">
          <img 
            src="/logo-halloween.png" 
            alt="Sahumerio Sagrado" 
            style={{
              width: '64px', height: '64px',
              objectFit: 'contain',
              borderRadius: '14px',
              filter: 'drop-shadow(0 0 12px rgba(255,106,0,0.4))',
            }} 
          />
          <div>
            <p className="text-xl font-black text-white font-headline tracking-tight uppercase">SAHUMERIO SAGRADO</p>
            <p className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">Panel de Control</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto min-w-0">
          <nav className="flex bg-[#111] p-1.5 rounded-xl border border-white/5 w-full overflow-x-auto custom-scrollbar pb-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setEditingId(null); }}
                className={`relative flex items-center shrink-0 gap-2 px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === tab.id ? 'bg-[#B892FF] text-white shadow' : 'text-white/40 hover:text-white/70'}`}>
                <tab.icon size={12} /> <span>{tab.label}</span>
                {tab.id === 'reviews' && pendingReviewsCount > 0 && (
                  <span className="ml-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-green-500 text-white text-[9px] font-black flex items-center justify-center">
                    {pendingReviewsCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <button onClick={onClose} className="p-3 text-white/20 hover:text-[#B892FF] transition-colors ml-1">
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
            { label: 'Productos', value: products.length, color: '#B892FF', icon: '✨' },
            { label: 'Disponibles', value: products.filter(c => !c.soldOut).length, color: '#10B981', icon: '✅' },
            { label: 'Agotados', value: products.filter(c => c.soldOut).length, color: '#EF4444', icon: '❌' },
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
                  {filtered.length} Productos
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
              {filtered.map(product => (
                <div key={product.id}>
                  {/* Row */}
                  <motion.div
                    layout
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      background: editingId === product.id ? 'rgba(255,106,0,0.06)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${editingId === product.id ? 'rgba(255,106,0,0.3)' : 'rgba(255,255,255,0.07)'}`,
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
                      {product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon size={20} color="rgba(255,255,255,0.2)" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{product.name}</span>
                        {product.soldOut && (
                          <span style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '2px 7px', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            AGOTADO
                          </span>
                        )}
                        <BadgePill badge={product.badge} />
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                          {categories.find(c => c.id === product.category)?.label || product.category}
                        </span>
                        <span style={{ fontSize: 10, color: 'rgba(124,58,237,0.7)', fontWeight: 700 }}>
                          {product.type}
                        </span>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                          Tallas: {(product.sizes || []).join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ color: '#CBA8FF', fontWeight: 900, fontSize: 16 }}>
                        ${product.price}
                      </div>
                      {product.rentalPrice && (
                        <div style={{ color: '#a855f7', fontSize: 11, fontWeight: 700 }}>
                          Renta ${product.rentalPrice}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button
                        onClick={() => onUpdate(product.id, { soldOut: !product.soldOut })}
                        title={product.soldOut ? 'Marcar disponible' : 'Marcar agotado'}
                        style={{
                          width: 34, height: 34, borderRadius: 9,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: product.soldOut ? '#10B981' : 'rgba(239,68,68,0.6)',
                        }}
                      >
                        {product.soldOut ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => setEditingId(editingId === product.id ? null : product.id)}
                        title="Editar"
                        style={{
                          width: 34, height: 34, borderRadius: 9,
                          background: editingId === product.id ? 'rgba(255,106,0,0.2)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${editingId === product.id ? 'rgba(255,106,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: editingId === product.id ? '#B892FF' : 'rgba(255,255,255,0.3)',
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => { if (confirm(`¿Eliminar "${product.name}"?`)) onDelete(product.id); }}
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
                    {editingId === product.id && (
                      <motion.div
                        key={`edit-${product.id}`}
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden', marginTop: 6 }}
                      >
                        <ProductForm
                          title={`Editar: ${product.name}`}
                          initial={{
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            rentalPrice: product.rentalPrice,
                            image: product.image,
                            category: product.category,
                            type: product.type,
                            sizes: [...(product.sizes || [])],
                            badge: product.badge,
                            soldOut: product.soldOut,
                            image_2: product.image_2,
                            image_3: product.image_3,
                            image_4: product.image_4,
                          }}
                          onSave={data => {
                            onUpdate(product.id, data);
                            setEditingId(null);
                          }}
                          onCancel={() => setEditingId(null)}
                          categoriesList={categories}
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
                Nuevo Producto
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
                Se agrega al catálogo de forma local
              </p>
            </div>
            <ProductForm
              title="Agregar al Catálogo"
              initial={{ ...EMPTY_FORM }}
              onSave={data => {
                onAdd({ id: `custom-${Date.now()}`, ...data });
                setActiveTab('inventory');
              }}
              onCancel={() => setActiveTab('inventory')}
              categoriesList={categories}
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
                      <div className="flex gap-2">
                        <input
                          value={editingCatEmoji}
                          onChange={e => setEditingCatEmoji(e.target.value)}
                          placeholder="✨"
                          className="bg-[#111] border border-[#B892FF] rounded-xl px-2 py-2 text-center w-12 text-sm outline-none"
                        />
                        <input
                          value={editingCatName}
                          onChange={e => setEditingCatName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              const newLabel = editingCatName;
                              const newEmoji = editingCatEmoji || '✨';
                              setCategories(categories.map(c => c.id === cat.id ? { ...c, label: newLabel, emoji: newEmoji } : c));
                              saveCategory({ id: cat.id, label: newLabel, emoji: newEmoji, order_index: cat.order_index ?? i });
                              setEditingCatId(null);
                            }
                          }}
                          className="bg-[#111] border border-[#B892FF] rounded-xl px-4 py-2 text-xs font-black text-white tracking-widest uppercase outline-none"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span className="text-white font-black text-sm uppercase tracking-widest leading-none">{cat.emoji || '✨'} {cat.label}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingCatId === cat.id ? (
                      <button
                        onClick={() => {
                          const newLabel = editingCatName;
                          const newEmoji = editingCatEmoji || '✨';
                          setCategories(categories.map(c => c.id === cat.id ? { ...c, label: newLabel, emoji: newEmoji } : c));
                          saveCategory({ id: cat.id, label: newLabel, emoji: newEmoji, order_index: cat.order_index ?? i });
                          setEditingCatId(null);
                        }}
                        className="w-9 h-9 rounded-xl bg-[#10B981] text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow"
                      >
                        <Save size={14} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.label); setEditingCatEmoji(cat.emoji || '✨'); }}
                        className="w-9 h-9 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-white/30 hover:text-[#B892FF] hover:border-[#B892FF]/40 transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar categoría "${cat.label}"?`)) {
                          setCategories(categories.filter(c => c.id !== cat.id));
                          supabase.from('categories').delete().eq('id', cat.id);
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
                  value={newCategoryEmoji}
                  onChange={e => setNewCategoryEmoji(e.target.value)}
                  placeholder="✨"
                  className="w-14 bg-[#111] border border-white/10 text-center px-2 py-3 rounded-xl text-sm outline-none focus:border-[#B892FF] transition-all"
                />
                <input 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newCategoryName.trim()) {
                      const id = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-');
                      const newCat = { id, label: newCategoryName.trim(), emoji: newCategoryEmoji || '✨', order_index: categories.length };
                      setCategories([...categories, newCat]);
                      setNewCategoryName('');
                      setNewCategoryEmoji('✨');
                      supabase.from('categories').insert([newCat]);
                    }
                  }}
                  placeholder="EJ: TERROR EXTREMO..."
                  className="flex-1 bg-[#111] border border-white/10 text-white px-4 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase outline-none focus:border-[#B892FF] transition-all"
                />
                <button 
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      const id = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-');
                      const newCat = { id, label: newCategoryName.trim(), emoji: newCategoryEmoji || '✨', order_index: categories.length };
                      setCategories([...categories, newCat]);
                      setNewCategoryName('');
                      setNewCategoryEmoji('✨');
                      supabase.from('categories').insert([newCat]);
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
        {activeTab === 'cupones' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-[#CBA8FF] text-xl font-black uppercase tracking-widest mb-4">Gestión de Cupones</h2>
            
            <div className="bg-[#111] border border-white/5 p-6 rounded-xl space-y-4">
              <h3 className="text-white font-bold">{couponForm.id ? 'Editar Cupón' : 'Crear Cupón'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DarkField label="Código del Cupón (Ej: SAHUMERIO20)">
                  <input type="text" value={couponForm.code || ''} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white uppercase" />
                </DarkField>
                <div className="grid grid-cols-2 gap-4">
                  <DarkField label="Tipo de Descuento">
                    <select value={couponForm.discount_type} onChange={e => setCouponForm({ ...couponForm, discount_type: e.target.value as any })} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white">
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Monto Fijo ($)</option>
                    </select>
                  </DarkField>
                  <DarkField label="Valor">
                    <input type="number" value={couponForm.discount_value || ''} onChange={e => setCouponForm({ ...couponForm, discount_value: Number(e.target.value) })} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white" />
                  </DarkField>
                </div>
                <DarkField label="Límite de Usos (Opcional)">
                  <input type="number" placeholder="Ej: 50" value={couponForm.max_uses || ''} onChange={e => setCouponForm({ ...couponForm, max_uses: e.target.value ? Number(e.target.value) : null })} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white" />
                </DarkField>
                <DarkField label="Fecha de Expiración (Opcional)">
                  <input type="datetime-local" value={couponForm.expires_at ? new Date(new Date(couponForm.expires_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16) : ''} onChange={e => setCouponForm({ ...couponForm, expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white [color-scheme:dark]" />
                </DarkField>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 text-white/80 cursor-pointer">
                  <input type="checkbox" checked={couponForm.active ?? true} onChange={e => setCouponForm({ ...couponForm, active: e.target.checked })} />
                  Cupón Activo
                </label>
                <div className="flex-1"></div>
                {couponForm.id && (
                  <button onClick={() => setCouponForm({ active: true, discount_type: 'percentage', discount_value: 0 })} className="text-white/40 hover:text-white px-4 py-2">
                    Cancelar Edición
                  </button>
                )}
                <button onClick={saveCoupon} className="bg-[#B892FF] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                  <Save size={16} /> Guardar
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-white/50 text-sm font-bold uppercase tracking-widest mt-8 mb-4">Cupones Existentes</h3>
              {isCouponsLoading ? (
                <p className="text-white/40">Cargando cupones...</p>
              ) : coupons.length === 0 ? (
                <p className="text-white/40">No hay cupones creados.</p>
              ) : (
                coupons.map(coupon => (
                  <div key={coupon.id} className="bg-[#111] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-lg">{coupon.code}</h4>
                      <p className="text-white/50 text-xs mt-1">
                        Descuento: <strong className="text-[#CBA8FF]">{coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}</strong>
                        <span className="mx-2">•</span>
                        Usos: {coupon.uses_count} {coupon.max_uses ? `/ ${coupon.max_uses}` : ''}
                        <span className="mx-2">•</span>
                        Estado: {coupon.active ? <span className="text-green-500">Activo</span> : <span className="text-red-500">Inactivo</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCouponForm(coupon)} className="p-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={async () => {
                        if (!confirm(`¿Eliminar el cupón "${coupon.code}"?`)) return;
                        const { error } = await supabase.from('coupons').delete().eq('id', coupon.id);
                        if (error) { alert('Error eliminando cupón: ' + error.message); }
                        else { loadCoupons(); }
                      }} className="p-2 bg-red-950/30 rounded-lg text-red-400 hover:bg-red-950/50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))              )}
            </div>
          </motion.div>
        )}

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
                  className="w-full bg-[#111] text-white p-3.5 pl-11 rounded-2xl border border-white/5 focus:border-[#B892FF] focus:ring-4 focus:ring-[#B892FF]/5 outline-none text-[10px] font-black tracking-widest placeholder:text-white/20" 
                />
              </div>
            </div>

            {/* Filtros de estado */}
            <div className="flex bg-[#111] p-1.5 rounded-2xl border border-white/5 shadow-sm inline-flex">
              <button 
                onClick={() => setOrderTab('pending')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'pending' ? 'bg-[#B892FF] text-white shadow' : 'text-white/40 hover:text-white'}`}
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
                .filter(o => !orderSearch || (o.customer || '').toLowerCase().includes(orderSearch.toLowerCase()) || (o.phone || '').includes(orderSearch))
                .length === 0 ? (
                  <div className="col-span-full py-20 bg-[#1a1a1a] rounded-3xl border border-white/5 text-center">
                    <Package className="text-white/10 mx-auto mb-4" size={48} />
                    <p className="text-white/20 text-sm font-bold uppercase tracking-widest italic">
                      {orderSearch ? 'Sin resultados' : orderTab === 'pending' ? 'No hay pedidos pendientes' : 'No hay pedidos entregados'}
                    </p>
                  </div>
                ) : orders
                  .filter(o => orderTab === 'pending' ? o.status !== 'delivered' : o.status === 'delivered')
                  .filter(o => !orderSearch || (o.customer || '').toLowerCase().includes(orderSearch.toLowerCase()) || (o.phone || '').includes(orderSearch))
                  .map(order => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                    const isExpanded = expandedOrder === order.id;
                    const notesCount = (order.internalNotes || []).length;
                    const hasNotes = notesCount > 0;
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
                                title={hasNotes ? `${notesCount} nota${notesCount > 1 ? 's' : ''} interna${notesCount > 1 ? 's' : ''}` : 'Ver notas internas'}
                                className={`relative w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                                  isExpanded
                                    ? 'bg-[#B892FF]/10 border-[#B892FF]/30 text-[#B892FF]'
                                    : hasNotes
                                      ? 'bg-[#B892FF]/10 border-[#B892FF]/40 text-[#B892FF]'
                                      : 'bg-[#111] border-white/5 text-white/30 hover:text-white'
                                }`}
                              >
                                {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                {hasNotes && !isExpanded && (
                                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#B892FF] text-white text-[9px] font-black flex items-center justify-center border border-[#1a1a1a] shadow-sm">
                                    {notesCount}
                                  </span>
                                )}
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
                                <Phone size={9} className="text-[#B892FF]" />{order.phone}
                              </span>
                              {order.city && <span className="text-[10px] text-white/40 font-bold">🚚 {order.city}</span>}
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
                                    className="flex-1 bg-[#111] border border-white/5 p-1.5 rounded-lg text-[10px] uppercase font-bold outline-none focus:border-[#B892FF] text-white"
                                  />
                                  <button 
                                    onClick={() => savePaymentRef(order.id)}
                                    className="bg-[#B892FF] text-white px-2 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all"
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
                            <span className="text-[#CBA8FF] font-black text-lg">${order.total} <span className="text-[10px] text-white/40">MXN</span></span>
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
                                  <p className="text-[9px] text-[#B892FF] font-black uppercase tracking-widest mb-1">{note.date}</p>
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
                                className="flex-1 bg-[#111] border border-white/10 text-white px-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#B892FF] transition-all"
                              />
                              <button
                                onClick={() => addNote(order.id)}
                                className="px-3 py-2 bg-[#B892FF] text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-orange-600 transition-all flex items-center gap-1"
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

        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Star className="text-[#B892FF]" /> Opiniones de Clientes
              </h2>
              <button
                onClick={loadReviews}
                className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 text-white/60 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
              >
                <RefreshCw size={13} /> Actualizar
              </button>
            </div>

            {/* Pendientes de aprobación */}
            <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                ⏳ Pendientes de aprobar
                {pendingReviewsCount > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-green-500 text-white text-[10px] font-black flex items-center justify-center">{pendingReviewsCount}</span>
                )}
              </h3>
              {reviews.filter(r => !r.approved).length === 0 ? (
                <p className="text-white/30 text-sm italic">No hay opiniones pendientes. ✅</p>
              ) : (
                <div className="space-y-3">
                  {reviews.filter(r => !r.approved).map(r => (
                    <div key={r.id} className="bg-[#111] border border-white/5 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-white font-bold text-sm">{r.name}</p>
                          <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} size={13} fill={i <= r.rating ? '#CBA8FF' : 'none'} color={i <= r.rating ? '#CBA8FF' : 'rgba(255,255,255,0.2)'} />
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => approveReview(r.id)}
                            title="Aprobar y publicar"
                            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            <Check size={13} /> Aprobar
                          </button>
                          <button
                            onClick={() => deleteReview(r.id)}
                            title="Eliminar"
                            className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-white/30 hover:text-red-500 hover:border-red-500/40 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {r.comment && <p className="text-white/60 text-sm leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Publicadas */}
            <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3">✅ Publicadas ({reviews.filter(r => r.approved).length})</h3>
              {reviews.filter(r => r.approved).length === 0 ? (
                <p className="text-white/30 text-sm italic">Aún no hay opiniones publicadas.</p>
              ) : (
                <div className="space-y-3">
                  {reviews.filter(r => r.approved).map(r => (
                    <div key={r.id} className="bg-[#111] border border-white/5 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-white font-bold text-sm">{r.name}</p>
                          <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} size={13} fill={i <= r.rating ? '#CBA8FF' : 'none'} color={i <= r.rating ? '#CBA8FF' : 'rgba(255,255,255,0.2)'} />
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteReview(r.id)}
                          title="Eliminar"
                          className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-white/30 hover:text-red-500 hover:border-red-500/40 transition-all shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {r.comment && <p className="text-white/60 text-sm leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-sm">
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                <Settings className="text-[#B892FF]" /> Ajustes de la Tienda
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm font-bold mb-2">Datos para Transferencia</label>
                  <p className="text-white/40 text-xs mb-3">Estos datos se mostrarán a los clientes al seleccionar "Transferencia" en el carrito.</p>
                  <textarea
                    value={bankDetails}
                    onChange={(e) => setBankDetails(e.target.value)}
                    placeholder="Ej. Banco: Mi Banco&#10;Cuenta: 123456789&#10;CLABE: 012345678901234567&#10;Titular: Juan Pérez"
                    rows={6}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#B892FF] transition-colors"
                  />
                </div>
                
                <button
                  onClick={async () => {
                    setIsSavingBank(true);
                    const { error } = await supabase.from('settings').upsert({ id: 1, bank_details: bankDetails });
                    setIsSavingBank(false);
                    if (error) alert('Error al guardar: ' + error.message);
                    else alert('¡Datos guardados correctamente!');
                  }}
                  disabled={isSavingBank}
                  className="bg-gradient-to-r from-[#B892FF] to-[#CBA8FF] text-white px-6 py-3 rounded-xl font-black uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Save size={18} /> {isSavingBank ? 'Guardando...' : 'Guardar Ajustes'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'promociones' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* <AdminPromo /> */}
          </motion.div>
        )}
      </div>

      {/* ── DEMO BANNER */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(10,10,10,0.98)',
        borderTop: '1px solid rgba(255,106,0,0.15)',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        backdropFilter: 'blur(10px)', zIndex: 40,
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,106,0,0.15)', border: '1px solid rgba(255,106,0,0.25)',
            borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
            color: '#B892FF', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
          }}
        >
          Ver Tienda
        </button>
      </div>
    </div>
  );
}
