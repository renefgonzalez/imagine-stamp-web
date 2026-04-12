import { useState, useEffect } from 'react';
import { 
  Lock, Package, DollarSign, Trash2, Edit2, Plus, LogOut, 
  Tag, FileText, LayoutGrid, Box, Image as ImageIcon, Search, CheckCircle, Clock, Phone, List, X, Save, ChevronDown, ChevronUp
} from 'lucide-react';
import { PRODUCTS } from './data/products';
import { DEFAULT_CATEGORIES } from './App';

const MASTER_PASSWORD = '1212';

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'orders' | 'categories'>('inventory');
  const [orderTab, setOrderTab] = useState<'pending' | 'delivered'>('pending');
  const [searchOrder, setSearchOrder] = useState('');

  // ── CATEGORÍAS ──────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<any[]>(() => {
    const saved = localStorage.getItem('imagine_stamp_categories_v2');
    if (saved) return JSON.parse(saved);
    // Guardamos las default (sin el "all") para poder editarlas
    return DEFAULT_CATEGORIES.filter(c => c.id !== 'all').map(c => ({
      id: c.id,
      name: c.name,
      submenus: [...c.submenus]
    }));
  });

  // Para expandir/colapsar subcategorías en el panel
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [newSubInput, setNewSubInput] = useState<Record<string, string>>({});
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    localStorage.setItem('imagine_stamp_categories_v2', JSON.stringify(categories));
    // También actualizamos el formato antiguo por compatibilidad con la tienda
    localStorage.setItem('imagine_stamp_categories', JSON.stringify(
      categories.map(c => ({ ...c, bgColor: 'bg-blue-50', iconColor: 'text-blue-500', dotColor: 'bg-blue-500' }))
    ));
  }, [categories]);

  // ── PRODUCTOS ────────────────────────────────────────────────────────────
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('imagine_stamp_products');
    const localProducts = saved ? JSON.parse(saved) : [];
    return [...PRODUCTS, ...localProducts];
  });

  useEffect(() => {
    const baseIds = PRODUCTS.map(p => p.id);
    const localOnly = products.filter((p: any) => !baseIds.includes(p.id));
    localStorage.setItem('imagine_stamp_products', JSON.stringify(localOnly));
  }, [products]);

  // ── PEDIDOS ──────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem('imagine_stamp_orders') || '[]')
  );
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  // Persistir pedidos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('imagine_stamp_orders', JSON.stringify(orders));
  }, [orders]);

  // Detectar nuevos pedidos creados desde la tienda (mismo navegador, distinta pestaña)
  useEffect(() => {
    const interval = setInterval(() => {
      const stored: any[] = JSON.parse(localStorage.getItem('imagine_stamp_orders') || '[]');
      setOrders(prev => {
        const existingIds = new Set(prev.map((o: any) => o.id));
        const newOnes = stored.filter((o: any) => !existingIds.has(o.id));
        return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const updateOrderStatus = (id: string, status: string) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  const deleteOrder = (id: string) =>
    setOrders(prev => prev.filter(o => o.id !== id));

  const addNote = (orderId: string) => {
    const text = (noteInputs[orderId] || '').trim();
    if (!text) return;
    const entry = {
      text,
      date: new Date().toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    };
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, internalNotes: [...(o.internalNotes || []), entry] } : o
    ));
    setNoteInputs(prev => ({ ...prev, [orderId]: '' }));
  };

  // ── HELPERS DE CATEGORÍAS ────────────────────────────────────────────────
  const saveCatName = (id: string) => {
    setCategories(cats => cats.map(c => c.id === id ? { ...c, name: editingCatName } : c));
    setEditingCatId(null);
  };

  const addSubmenu = (catId: string) => {
    const val = (newSubInput[catId] || '').trim();
    if (!val) return;
    setCategories(cats => cats.map(c => {
      if (c.id !== catId) return c;
      if (c.submenus.includes(val)) return c;
      return { ...c, submenus: [...c.submenus, val] };
    }));
    setNewSubInput(prev => ({ ...prev, [catId]: '' }));
  };

  const removeSubmenu = (catId: string, sub: string) => {
    setCategories(cats => cats.map(c =>
      c.id === catId ? { ...c, submenus: c.submenus.filter((s: string) => s !== sub) } : c
    ));
  };

  const editSubmenu = (catId: string, oldSub: string, newSub: string) => {
    setCategories(cats => cats.map(c => {
      if (c.id !== catId) return c;
      return { ...c, submenus: c.submenus.map((s: string) => s === oldSub ? newSub.trim() : s) };
    }));
  };

  const addCategory = () => {
    const name = newCatName.trim();
    if (!name) return;
    const id = name + '-' + Date.now();
    setCategories(prev => [...prev, { id, name, submenus: [] }]);
    setNewCatName('');
  };

  const removeCategory = (id: string) => {
    setCategories(cats => cats.filter(c => c.id !== id));
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

        {/* Global Warning for Static Flow */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-lg shrink-0">
            <FileText className="text-amber-600" size={20} />
          </div>
          <div>
            <p className="text-amber-900 text-xs font-black uppercase tracking-widest mb-1">⚠️ Flujo Estático (Modo "Por Ahí")</p>
            <p className="text-amber-800/70 text-[11px] font-medium leading-relaxed">
              Los cambios hechos aquí son <strong>temporales</strong>. Para que los productos y categorías aparezcan permanentemente para todos tus clientes, debes añadirlos al archivo <code className="bg-amber-100/50 px-1 rounded text-amber-900">src/data/products.ts</code> y hacer un <strong>Push a GitHub</strong>.
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
                        {p.subCategory && <span className="text-[9px] font-bold text-primary/40 bg-primary/5 px-2 py-0.5 rounded uppercase tracking-widest">{p.subCategory}</span>}
                        {p.subCategory2 && <span className="text-[9px] font-bold text-primary/40 bg-primary/5 px-2 py-0.5 rounded uppercase tracking-widest">{p.subCategory2}</span>}
                      </div>
                    </div>
                    <div className="shrink-0 px-4 text-center sm:text-right">
                      <p className="font-black text-primary text-lg">${p.price} <span className="text-[10px]">MXN</span></p>
                      <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">En Stock</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="w-10 h-10 rounded-xl bg-background border border-primary/5 flex items-center justify-center text-primary/20 hover:text-secondary hover:border-secondary transition-all">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => setProducts(products.filter((item: any) => item.id !== p.id))}
                        className="w-10 h-10 rounded-xl bg-background border border-primary/5 flex items-center justify-center text-primary/20 hover:text-error hover:border-error transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── NUEVO PRODUCTO ───────────────────────────────────────────── */}
          {activeTab === 'add' && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 px-2">
                <h2 className="text-2xl font-black text-primary font-headline uppercase">Simular Nuevo Artículo</h2>
                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1 italic">Usa esto para previsualizar antes de editar el código.</p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const newProduct = {
                  id: Date.now(),
                  name: fd.get('name') as string,
                  description: fd.get('description') as string,
                  price: parseInt(fd.get('price') as string) || 0,
                  image: (fd.get('image') as string) || 'https://picsum.photos/seed/new/800/1000',
                  category: fd.get('category') as string,
                  subCategory: fd.get('sub1') as string,
                  subCategory2: fd.get('sub2') as string,
                };
                setProducts((prev: any[]) => [newProduct, ...prev]);
                setActiveTab('inventory');
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
                      <input name="sub1" placeholder="EJ: BODA"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest uppercase transition-all" />
                    </div>
                  </Field>
                  <Field label="Sub-Categoría 2 (opcional)">
                    <div className="relative">
                      <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <input name="sub2" placeholder="EJ: INVITACIÓN WEB"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest uppercase transition-all" />
                    </div>
                  </Field>
                </div>

                {/* Imagen */}
                <Field label="URL de Imagen">
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                    <input name="image" placeholder="HTTPS://..."
                      className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-bold tracking-widest transition-all" />
                  </div>
                </Field>

                <button type="submit"
                  className="w-full bg-secondary text-white p-5 rounded-2xl font-black hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-secondary/20 uppercase tracking-[0.2em] text-xs mt-4">
                  <Plus size={18} strokeWidth={3} /> Publicar en la Tienda
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
                      {editingCatId === cat.id ? (
                        <input
                          value={editingCatName}
                          onChange={(e) => setEditingCatName(e.target.value)}
                          className="flex-1 bg-background border border-secondary rounded-xl px-4 py-2 text-xs font-black text-primary tracking-widest uppercase outline-none"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && saveCatName(cat.id)}
                        />
                      ) : (
                        <span className="flex-1 text-sm font-black text-primary uppercase tracking-widest">{cat.name}</span>
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

        </div>
      </div>
    </div>
  );
}

// ── Componentes auxiliares ──────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">{label}</label>
      {children}
    </div>
  );
}

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
