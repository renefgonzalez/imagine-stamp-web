import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Package, DollarSign, Trash2, Edit2, Plus, LogOut, 
  Tag, FileText, LayoutGrid, Box, Image as ImageIcon, Search, CheckCircle, Clock, Phone, List, X, Save, ChevronDown, ChevronUp
} from 'lucide-react';
import { DEFAULT_CATEGORIES } from './App';
import { supabase } from './lib/supabase';

const MASTER_PASSWORD = '1212';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5 h-full">
    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest px-1 shrink-0">{label}</label>
    <div className="h-full flex flex-col justify-center">
      {children}
    </div>
  </div>
);

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'orders' | 'categories'>('inventory');
  const [orderTab, setOrderTab] = useState<'pending' | 'delivered'>('pending');
  const [searchOrder, setSearchOrder] = useState('');

  // ── ESTADOS DINÁMICOS (SUPABASE) ───────────────────────────────────────
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ── CARGA INICIAL ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
      
      // Suscripción en tiempo real a pedidos
      const channel = supabase
        .channel('admin_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadOrders())
        .subscribe();
        
      return () => { supabase.removeChannel(channel); };
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([loadCategories(), loadProducts(), loadOrders()]);
    setLoading(false);
  };

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const loadOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [catUploading, setCatUploading] = useState<string | null>(null);
  const [newSubInput, setNewSubInput] = useState<Record<string, string>>({});
  const [newCatName, setNewCatName] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // ── ACCESO ───────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface border border-primary/10 shadow-xl p-10 rounded-2xl w-full max-w-sm">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-secondary" size={40} />
          </div>
          <h2 className="text-primary text-center text-2xl font-headline font-black tracking-tight mb-8">Acceso Admin</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white text-primary p-4 rounded-xl border border-primary/10 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-center text-2xl tracking-[0.5em] mb-4"
            placeholder="••••"
            onKeyDown={(e) => e.key === 'Enter' && password === MASTER_PASSWORD && setIsAuthenticated(true)}
          />
          <button
            onClick={() => password === MASTER_PASSWORD && setIsAuthenticated(true)}
            className="w-full bg-secondary text-white p-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-secondary/20 uppercase tracking-widest text-sm"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      (o.customer || '').toLowerCase().includes(searchOrder.toLowerCase()) ||
      (o.phone || '').includes(searchOrder);
    const matchesTab = orderTab === 'pending' ? o.status !== 'delivered' : o.status === 'delivered';
    return matchesSearch && matchesTab;
  });

  // ── HELPERS DE PEDIDOS ─────────────────────────────────────────────────
  const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
    pending:      { label: 'Pendiente',  color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200' },
    'in-process': { label: 'En Proceso', color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200'   },
    delayed:      { label: 'Demorado',   color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200'    },
    delivered:    { label: 'Entregado',  color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200'},
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) loadOrders();
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('¿Eliminar este pedido permanentemente?')) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) loadOrders();
  };

  const addNote = async (orderId: string) => {
    const text = (noteInputs[orderId] || '').trim();
    if (!text) return;
    
    const order = orders.find(o => o.id === orderId);
    const newNote = {
      text,
      date: new Date().toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    };
    
    const { error } = await supabase
      .from('orders')
      .update({ internal_notes: [...(order.internal_notes || []), newNote] })
      .eq('id', orderId);
      
    if (!error) {
      loadOrders();
      setNoteInputs(prev => ({ ...prev, [orderId]: '' }));
    }
  };

  // ── HELPERS DE CATEGORÍAS ────────────────────────────────────────────────
  const uploadCategoryImg = async (catId: string, file: File) => {
    try {
      setCatUploading(catId);
      // Sanitizar el nombre del archivo: quitar espacios, ñ, acentos, etc.
      const safeCatId = catId.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-');
      const safeFileName = file.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9.]/g, '-');
      const fileName = `cat-${safeCatId}-${Date.now()}-${safeFileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('categories')
        .update({ image_url: publicUrl })
        .eq('id', catId);

      if (updateError) throw updateError;
      
      loadCategories();
    } catch (err: any) {
      alert("Error al subir imagen: " + err.message);
    } finally {
      setCatUploading(null);
    }
  };

  const saveCatName = async (id: string) => {
    const { error } = await supabase.from('categories').update({ name: editingCatName }).eq('id', id);
    if (!error) {
      loadCategories();
      setEditingCatId(null);
    }
  };

  const addSubmenu = async (catId: string) => {
    const val = (newSubInput[catId] || '').trim();
    if (!val) return;
    const cat = categories.find(c => c.id === catId);
    if (cat.submenus.includes(val)) return;
    
    const { error } = await supabase
      .from('categories')
      .update({ submenus: [...cat.submenus, val] })
      .eq('id', catId);
      
    if (!error) {
      loadCategories();
      setNewSubInput(prev => ({ ...prev, [catId]: '' }));
    }
  };

  const removeSubmenu = async (catId: string, sub: string) => {
    const cat = categories.find(c => c.id === catId);
    const { error } = await supabase
      .from('categories')
      .update({ submenus: cat.submenus.filter((s: string) => s !== sub) })
      .eq('id', catId);
    if (!error) loadCategories();
  };

  const editSubmenu = async (catId: string, oldSub: string, newSub: string) => {
    const cat = categories.find(c => c.id === catId);
    const updated = cat.submenus.map((s: string) => s === oldSub ? newSub.trim() : s);
    const { error } = await supabase
      .from('categories')
      .update({ submenus: updated })
      .eq('id', catId);
    if (!error) loadCategories();
  };

  const addCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    const id = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
    const { error } = await supabase.from('categories').insert([{ id, name, submenus: [] }]);
    if (!error) {
      loadCategories();
      setNewCatName('');
    }
  };

  const removeCategory = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) loadCategories();
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'inventory', icon: Package, label: 'Inventario' },
    { id: 'add', icon: Plus, label: 'Nuevo' },
    { id: 'categories', icon: List, label: 'Categorías' },
    { id: 'orders', icon: DollarSign, label: 'Pedidos' }
  ];

  return (
    <div className="min-h-screen bg-background text-on-background font-sans pb-20">
      <div className="max-w-6xl mx-auto p-4 md:p-8">

        {/* Top Nav */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-6 bg-surface p-5 rounded-2xl border border-primary/5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <Plus className="text-secondary" size={22} />
            </div>
            <div>
              <p className="text-xl font-black text-primary font-headline tracking-tight uppercase">Imagine & Stamp</p>
              <p className="text-[10px] font-bold text-primary/40 tracking-[0.2em] uppercase">Panel de Control</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <nav className="flex bg-background p-1.5 rounded-xl border border-primary/5">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'bg-secondary text-white shadow' : 'text-primary/40 hover:text-primary/70'}`}>
                  <tab.icon size={12} /> <span>{tab.label}</span>
                </button>
              ))}
            </nav>
            <button onClick={onLogout} className="p-3 text-primary/20 hover:text-error transition-colors ml-2">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Supabase Status Banner */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-8 flex items-start gap-4">
          <div className="p-2 bg-emerald-100 rounded-lg shrink-0">
            <LayoutGrid className="text-emerald-600" size={20} />
          </div>
          <div>
            <p className="text-emerald-900 text-xs font-black uppercase tracking-widest mb-1">✅ Conexión Activa: Supabase Realtime</p>
            <p className="text-emerald-800/70 text-[11px] font-medium leading-relaxed">
              Tu catálogo está sincronizado en la nube. Cualquier cambio que hagas aquí se verá <strong>al instante</strong> en todos los dispositivos sin necesidad de actualizar el código.
            </p>
          </div>
        </div>

        <div className="animate-in fade-in duration-300">

          {/* ─── INVENTARIO ──────────────────────────────────────────────── */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end px-2">
                <div>
                  <h2 className="text-2xl font-black text-primary font-headline uppercase">Inventario General</h2>
                  <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">Sincronizado con la tienda pública</p>
                </div>
                <span className="text-xs font-black text-secondary bg-secondary/10 border border-secondary/20 px-4 py-2 rounded-lg uppercase tracking-widest">{products.length} Productos</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {products.map((p: any) => (
                  <div key={p.id} className="flex flex-col sm:flex-row items-center gap-5 bg-surface border border-primary/5 p-4 rounded-2xl hover:border-secondary/30 transition-all shadow-sm">
                    <div className="w-20 h-20 bg-background rounded-xl overflow-hidden shrink-0 border border-primary/5 p-0.5">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h3 className="font-black text-sm text-primary uppercase tracking-wide">{p.name}</h3>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-2">
                        <span className="text-[9px] font-black text-secondary bg-secondary/5 px-2 py-0.5 rounded border border-secondary/10 uppercase tracking-widest">{p.category}</span>
                        {p.sub_category && <span className="text-[9px] font-bold text-primary/40 bg-primary/5 px-2 py-0.5 rounded uppercase tracking-widest">{p.sub_category}</span>}
                      </div>
                    </div>
                    <div className="shrink-0 px-4 text-center sm:text-right">
                      <p className="font-black text-primary text-lg">${p.price} <span className="text-[10px]">MXN</span></p>
                      <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">En Stock</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => setEditingProduct(p)}
                        className="w-10 h-10 rounded-xl bg-background border border-primary/5 flex items-center justify-center text-primary/20 hover:text-secondary hover:border-secondary transition-all">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={async () => {
                        if (!confirm('¿Eliminar producto?')) return;
                        const { error } = await supabase.from('products').delete().eq('id', p.id);
                        if (!error) loadProducts();
                      }}
                        className="w-10 h-10 rounded-xl bg-background border border-primary/5 flex items-center justify-center text-primary/20 hover:text-error hover:border-error transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'add' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 px-2">
                <h2 className="text-2xl font-black text-primary font-headline uppercase">Nuevo Diseño / Servicio</h2>
                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">Se publicará instantáneamente en la tienda.</p>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setUploading(true);
                const fd = new FormData(e.currentTarget);
                const file = fd.get('imageFile') as File;
                let imageUrl = fd.get('image') as string;

                if (file && file.size > 0) {
                  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
                  const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, file);
                  
                  if (!uploadError) {
                    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
                    imageUrl = publicUrl;
                  }
                }

                const newProduct = {
                  name: fd.get('name') as string,
                  description: fd.get('description') as string,
                  price: parseFloat(fd.get('price') as string) || 0,
                  image: imageUrl || 'https://picsum.photos/seed/new/800/1000',
                  category: fd.get('category') as string,
                  sub_category: fd.get('sub1') as string,
                };

                const { error } = await supabase.from('products').insert([newProduct]);
                setUploading(false);
                if (!error) {
                  loadProducts();
                  setActiveTab('inventory');
                }
              }} className="bg-surface border border-primary/5 p-8 rounded-3xl shadow-xl space-y-5">

                {/* Nombre */}
                <Field label="Nombre del artículo">
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                    <input name="name" required placeholder="EJ: INVITACIÓN BODA ELEGANCE"
                      className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-xs font-black tracking-widest uppercase transition-all" />
                  </div>
                </Field>

                {/* Descripción */}
                <Field label="Descripción corta">
                  <div className="relative">
                    <FileText className="absolute left-4 top-5 text-primary/20" size={17} />
                    <textarea name="description" placeholder="TEXTO QUE VE EL CLIENTE EN LA TIENDA..."
                      className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-xs font-bold tracking-widest min-h-[90px] transition-all" />
                  </div>
                </Field>

                {/* Precio + Categoría */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Precio ($)">
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <input name="price" type="number" required placeholder="0.00"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest" />
                    </div>
                  </Field>
                  <Field label="Categoría Principal">
                    <div className="relative">
                      <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <select name="category"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest appearance-none cursor-pointer">
                        {categories.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </Field>
                </div>

                {/* Sub 1 + Sub 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Sub-Categoría 1 (opcional)">
                    <div className="relative">
                      <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <input name="sub1" placeholder="Ej: Boda"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest transition-all" />
                    </div>
                  </Field>
                  <Field label="Sub-Categoría 2 (opcional)">
                    <div className="relative">
                      <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <input name="sub2" placeholder="Ej: Invitación Web"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest transition-all" />
                    </div>
                  </Field>
                </div>

                {/* Imagen */}
                <Field label="Foto del Producto">
                  <div className="relative group">
                    <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-primary/5 hover:border-secondary transition-all cursor-pointer">
                      <ImageIcon className="text-primary/20" size={20} />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-primary/40">SELECCIONAR ARCHIVO</span>
                        <input name="imageFile" type="file" accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer" />
                        <p className="text-[9px] text-primary/20 italic">Formatos: WebP, PNG, JPG (Máx 2MB)</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <input name="image" placeholder="O pega un link externo (opcional)"
                        className="w-full bg-background text-primary p-3 px-4 rounded-xl border border-primary/5 focus:border-secondary outline-none text-[10px] font-bold" />
                    </div>
                  </div>
                </Field>

                <button type="submit" disabled={uploading}
                  className={`w-full ${uploading ? 'bg-primary/20' : 'bg-secondary'} text-white p-5 rounded-2xl font-black hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-secondary/20 uppercase tracking-[0.2em] text-xs mt-4`}>
                  {uploading ? <Clock className="animate-spin" size={18} /> : <Plus size={18} strokeWidth={3} />} 
                  {uploading ? 'SUBIENDO...' : 'Publicar en la Tienda'}
                </button>
              </form>
            </div>
          )}

          {/* ─── CATEGORÍAS EDITABLES ─────────────────────────────────────── */}
          {activeTab === 'categories' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="px-2">
                <h2 className="text-2xl font-black text-primary font-headline uppercase">Borrador de Categorías</h2>
                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1 italic">Los cambios aquí no afectan la tienda permanentemente.</p>
              </div>

              {/* Lista editable */}
              <div className="space-y-3">
                {categories.map((cat: any) => (
                  <div key={cat.id} className="bg-surface border border-primary/5 rounded-2xl shadow-sm overflow-hidden">
                    
                    {/* Fila principal */}
                    <div className="flex items-center gap-4 p-4">
                      {/* Imagen de Categoría */}
                      <div className="relative group shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/5 border border-primary/10 flex items-center justify-center relative">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-primary/20" size={16} />
                          )}
                          {catUploading === cat.id && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Clock className="animate-spin text-white" size={14} />
                            </div>
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadCategoryImg(cat.id, file);
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>

                      {editingCatId === cat.id ? (
                        <input
                          value={editingCatName}
                          onChange={(e) => setEditingCatName(e.target.value)}
                          className="flex-1 bg-background border border-secondary rounded-xl px-4 py-2 text-xs font-black text-primary tracking-widest uppercase outline-none"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && saveCatName(cat.id)}
                        />
                      ) : (
                        <div className="flex-1">
                          <span className="text-sm font-black text-primary uppercase tracking-widest block leading-none">{cat.name}</span>
                          <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest mt-1 block">Toca el círculo para subir imagen</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {editingCatId === cat.id ? (
                          <button onClick={() => saveCatName(cat.id)}
                            className="w-9 h-9 rounded-xl bg-secondary text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow">
                            <Save size={14} />
                          </button>
                        ) : (
                          <button onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }}
                            className="w-9 h-9 rounded-xl bg-background border border-primary/5 flex items-center justify-center text-primary/30 hover:text-secondary hover:border-secondary transition-all">
                            <Edit2 size={14} />
                          </button>
                        )}
                        <button onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${expandedCat === cat.id ? 'bg-primary/5 border-primary/10 text-primary' : 'bg-background border-primary/5 text-primary/30 hover:text-primary'}`}>
                          {expandedCat === cat.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <button onClick={() => removeCategory(cat.id)}
                          className="w-9 h-9 rounded-xl bg-background border border-primary/5 flex items-center justify-center text-primary/20 hover:text-error hover:border-error transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Panel de subcategorías */}
                    {expandedCat === cat.id && (
                      <div className="border-t border-primary/5 p-4 bg-background/40 space-y-3">
                        <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] mb-3">Subcategorías de "{cat.name}"</p>
                        
                        {/* Chips editables */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {cat.submenus.length === 0 && (
                            <span className="text-xs text-primary/20 italic">Sin subcategorías todavía...</span>
                          )}
                          {cat.submenus.map((sub: string) => (
                            <SubChip key={sub} value={sub}
                              onDelete={() => removeSubmenu(cat.id, sub)}
                              onEdit={(newVal) => editSubmenu(cat.id, sub, newVal)}
                            />
                          ))}
                        </div>

                        {/* Agregar nueva */}
                        <div className="flex gap-2">
                          <input
                            value={newSubInput[cat.id] || ''}
                            onChange={(e) => setNewSubInput(prev => ({ ...prev, [cat.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && addSubmenu(cat.id)}
                            placeholder="NUEVA SUBCATEGORÍA..."
                            className="flex-1 bg-background border border-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase outline-none focus:border-secondary transition-all"
                          />
                          <button onClick={() => addSubmenu(cat.id)}
                            className="px-4 py-2 bg-secondary text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-orange-600 transition-all flex items-center gap-1">
                            <Plus size={12} /> Añadir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Añadir categoría */}
              <div className="bg-surface border border-dashed border-primary/20 rounded-2xl p-6">
                <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] mb-4">+ Nueva Categoría Principal</p>
                <div className="flex gap-3">
                  <input value={newCatName} onChange={e => setNewCatName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCategory()}
                    placeholder="EJ: REDES SOCIALES Y CONTENIDO..."
                    className="flex-1 bg-background border border-primary/10 text-primary px-4 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase outline-none focus:border-secondary transition-all"
                  />
                  <button onClick={addCategory}
                    className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-primary/90 transition-all flex items-center gap-2">
                    <Plus size={13} /> Crear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── PEDIDOS ─────────────────────────────────────────────────── */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 px-2">
                <div>
                  <h2 className="text-2xl font-black text-primary font-headline uppercase">Pedidos & Ventas</h2>
                  <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">
                    {orders.filter(o => o.status !== 'delivered').length} pendientes · {orders.filter(o => o.status === 'delivered').length} entregados
                  </p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={15} />
                  <input value={searchOrder} onChange={(e) => setSearchOrder(e.target.value)}
                    placeholder="BUSCAR POR NOMBRE O TELÉFONO..."
                    className="w-full bg-surface text-primary p-3.5 pl-11 rounded-2xl border border-primary/5 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-[10px] font-black tracking-widest placeholder:text-primary/20" />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex bg-surface p-1.5 rounded-2xl border border-primary/5 shadow-sm inline-flex">
                <button onClick={() => setOrderTab('pending')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'pending' ? 'bg-secondary text-white shadow' : 'text-primary/40 hover:text-primary'}`}>
                  <Clock size={13} /> Pendientes ({orders.filter(o => o.status !== 'delivered').length})
                </button>
                <button onClick={() => setOrderTab('delivered')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'delivered' ? 'bg-emerald-500 text-white shadow' : 'text-primary/40 hover:text-primary'}`}>
                  <CheckCircle size={13} /> Entregados ({orders.filter(o => o.status === 'delivered').length})
                </button>
              </div>

              {/* Lista de pedidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOrders.length === 0 ? (
                  <div className="col-span-full py-20 bg-surface rounded-3xl border border-primary/5 text-center">
                    <Package className="text-primary/10 mx-auto mb-4" size={48} />
                    <p className="text-primary/20 text-sm font-bold uppercase tracking-widest italic">
                      {searchOrder ? 'Sin resultados' : orderTab === 'pending' ? 'No hay pedidos pendientes' : 'No hay pedidos entregados'}
                    </p>
                  </div>
                ) : filteredOrders.map(order => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const isExpanded = expandedOrder === order.id;
                  return (
                    <div key={order.id} className="bg-surface border border-primary/5 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                      {/* Cabecera del pedido */}
                      <div className="flex flex-col gap-3 p-5 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                              {(order.id || '').slice(-10)}
                            </span>
                            <p className="text-[10px] text-primary/30 font-bold mt-1">{order.date}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                              title="Ver notas internas"
                              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                                isExpanded ? 'bg-secondary/10 border-secondary/30 text-secondary' : 'bg-background border-primary/5 text-primary/30 hover:text-primary'
                              }`}
                            >
                              {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            </button>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              title="Eliminar pedido"
                              className="w-8 h-8 rounded-xl bg-background border border-primary/5 flex items-center justify-center text-primary/20 hover:text-error hover:border-error transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-primary font-black text-sm uppercase tracking-wide">{order.customer}</h4>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                            <span className="text-[10px] text-primary/40 font-bold flex items-center gap-1">
                              <Phone size={9} className="text-secondary" />{order.phone}
                            </span>
                            {order.city && <span className="text-[10px] text-primary/40 font-bold">📍 {order.city}</span>}
                          </div>
                        </div>

                        {/* Forma de pago */}
                        {order.paymentMethod && (
                          <span className={`self-start text-[9px] font-black px-2 py-0.5 rounded-full border tracking-widest uppercase ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                            💳 {order.paymentMethod}
                          </span>
                        )}

                        {/* Items */}
                        <div className="bg-background/60 p-3 rounded-xl border border-primary/5 space-y-1">
                          {(order.items || []).map((item: any, i: number) => (
                            <div key={i} className="flex justify-between text-[11px]">
                              <span className="text-primary/60 font-medium truncate pr-2">{item.name} <span className="font-black">x{item.quantity}</span></span>
                              <span className="text-primary font-black shrink-0">${item.price * item.quantity}</span>
                            </div>
                          ))}
                          {order.deliveryNotes && (
                            <p className="text-[10px] text-primary/30 italic border-t border-primary/5 pt-1.5 mt-1">📝 {order.deliveryNotes}</p>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-primary/20 text-[10px] font-black uppercase tracking-widest">Total</span>
                          <span className="text-primary font-black text-lg">${order.total} <span className="text-[10px]">MXN</span></span>
                        </div>

                        {/* Selector de estatus */}
                        <select
                          value={order.status || 'pending'}
                          onChange={e => updateOrderStatus(order.id, e.target.value)}
                          className={`w-full p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer transition-all ${cfg.bg} ${cfg.border} ${cfg.color}`}
                        >
                          <option value="pending">⏳ Pendiente</option>
                          <option value="in-process">🔄 En Proceso</option>
                          <option value="delayed">⚠️ Demorado</option>
                          <option value="delivered">✅ Entregado</option>
                        </select>
                      </div>

                      {/* Panel de notas internas (expandible) */}
                      {isExpanded && (
                        <div className="border-t border-primary/5 p-4 bg-background/30 space-y-3">
                          <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">Notas Internas</p>
                          <div className="space-y-2 max-h-36 overflow-y-auto">
                            {(order.internalNotes || []).length === 0 ? (
                              <p className="text-[11px] text-primary/20 italic">Sin notas todavía...</p>
                            ) : (order.internalNotes || []).map((note: any, i: number) => (
                              <div key={i} className="bg-white rounded-xl p-3 border border-primary/5">
                                <p className="text-[9px] text-secondary font-black uppercase tracking-widest mb-1">{note.date}</p>
                                <p className="text-xs text-primary/70 font-medium leading-relaxed">{note.text}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 pt-1">
                            <input
                              value={noteInputs[order.id] || ''}
                              onChange={e => setNoteInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                              onKeyDown={e => e.key === 'Enter' && addNote(order.id)}
                              placeholder="Añadir nota interna..."
                              className="flex-1 bg-white border border-primary/10 text-primary px-4 py-2.5 rounded-xl text-xs outline-none focus:border-secondary transition-all"
                            />
                            <button
                              onClick={() => addNote(order.id)}
                              className="px-3 py-2 bg-secondary text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-orange-600 transition-all flex items-center gap-1"
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

          {/* ─── MODAL EDITAR PRODUCTO ──────────────────────────────────── */}
          <AnimatePresence>
            {editingProduct && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-primary/10 overflow-hidden"
                >
                  <div className="p-6 border-b border-primary/5 flex justify-between items-center bg-background/50">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">Editar Producto</h3>
                    <button onClick={() => setEditingProduct(null)} className="text-primary/30 hover:text-primary"><X size={20}/></button>
                  </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setUploading(true);
                    const fd = new FormData(e.currentTarget);
                    const file = fd.get('imageFile') as File;
                    let imageUrl = fd.get('image') as string;

                    if (file && file.size > 0) {
                      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
                      const { error: uploadError } = await supabase.storage
                        .from('product-images')
                        .upload(fileName, file);
                      
                      if (!uploadError) {
                        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
                        imageUrl = publicUrl;
                      }
                    }

                    const updates = {
                      name: fd.get('name') as string,
                      price: parseFloat(fd.get('price') as string) || 0,
                      category: fd.get('category') as string,
                      sub_category: fd.get('sub_category') as string,
                      image: imageUrl,
                      description: fd.get('description') as string,
                    };
                    const { error } = await supabase.from('products').update(updates).eq('id', editingProduct.id);
                    setUploading(false);
                    if (!error) {
                      loadProducts();
                      setEditingProduct(null);
                    }
                  }} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                    <Field label="Nombre"><input name="name" defaultValue={editingProduct.name} className="w-full bg-background border border-primary/10 p-3 rounded-xl text-xs font-bold" /></Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Precio"><input name="price" type="number" defaultValue={editingProduct.price} className="w-full bg-background border border-primary/10 p-3 rounded-xl text-xs font-bold" /></Field>
                      <Field label="Categoría">
                        <select name="category" defaultValue={editingProduct.category} className="w-full bg-background border border-primary/10 p-3 rounded-xl text-xs font-bold uppercase outline-none">
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </Field>
                    </div>
                    <Field label="Subcategoría"><input name="sub_category" defaultValue={editingProduct.sub_category} className="w-full bg-background border border-primary/10 p-3 rounded-xl text-xs font-bold outline-none" /></Field>
                    
                    <Field label="Nueva Foto (opcional)">
                      <div className="relative group">
                        <div className="flex items-center gap-3 bg-background p-3 rounded-xl border border-primary/5 hover:border-secondary transition-all cursor-pointer">
                          <ImageIcon className="text-primary/20" size={16} />
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-primary/40">CAMBIAR IMAGEN</span>
                            <input name="imageFile" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        </div>
                        <input name="image" defaultValue={editingProduct.image} className="w-full bg-background border border-primary/10 p-3 rounded-xl text-[10px] font-bold mt-2 outline-none italic text-primary/40 truncate" />
                      </div>
                    </Field>

                    <Field label="Descripción"><textarea name="description" defaultValue={editingProduct.description} className="w-full bg-background border border-primary/10 p-3 rounded-xl text-xs font-medium h-24 outline-none" /></Field>
                    
                    <button type="submit" disabled={uploading} className={`w-full ${uploading ? 'bg-primary/20' : 'bg-secondary'} text-white p-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-secondary/20 hover:bg-orange-600 transition-all mt-4`}>
                      {uploading ? 'SUBIENDO...' : 'Guardar Cambios'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

// ── Componentes auxiliares ──────────────────────────────────────────────────

function SubChip({ value, onDelete, onEdit }: { value: string; onDelete: () => void; onEdit: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  return editing ? (
    <input
      value={text}
      onChange={e => setText(e.target.value)}
      onBlur={() => { onEdit(text); setEditing(false); }}
      onKeyDown={e => { if (e.key === 'Enter') { onEdit(text); setEditing(false); } }}
      autoFocus
      className="bg-white border border-secondary text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest outline-none w-40"
    />
  ) : (
    <span
      className="flex items-center gap-1.5 bg-white border border-primary/10 text-primary/70 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-secondary/40 transition-colors select-none"
      onDoubleClick={() => setEditing(true)}
    >
      {value}
      <button onClick={onDelete} className="text-primary/20 hover:text-error transition-colors ml-1">
        <X size={10} strokeWidth={3} />
      </button>
    </span>
  );
}
