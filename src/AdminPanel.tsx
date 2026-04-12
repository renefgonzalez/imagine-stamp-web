import { useState, useEffect } from 'react';
import { 
  Lock, Package, DollarSign, Trash2, Edit2, Plus, LogOut, 
  Tag, FileText, LayoutGrid, Box, Image as ImageIcon, Search, CheckCircle, Clock, Phone, List, X
} from 'lucide-react';
import { PRODUCTS } from './data/products';

const MASTER_PASSWORD = '1212';

const DEFAULT_CATEGORIES = [
  { id: 'Fiestas Infantiles', name: 'Fiestas y Cumpleaños' },
  { id: 'Invitaciones Digitales', name: 'Invitaciones' },
  { id: 'Boutique Corporativa', name: 'Empresarial' },
  { id: 'Social & Eventos', name: 'Personalización' },
  { id: 'Portfolio', name: 'Catálogo / Portfolio' }
];

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'orders' | 'categories'>('inventory');
  const [orderTab, setOrderTab] = useState<'pending' | 'delivered'>('pending');
  const [searchOrder, setSearchOrder] = useState('');
  
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('imagine_stamp_products');
    const localProducts = saved ? JSON.parse(saved) : [];
    // Combinamos los productos base con los locales para que el admin vea todo
    return [...PRODUCTS, ...localProducts];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('imagine_stamp_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [orders, setOrders] = useState([
    { id: 'ORD-001', customer: 'Ana Sánchez', phone: '5512345678', amount: 600, status: 'pending', items: '2x Playera Vintage', date: '12 Abr 2026' },
    { id: 'ORD-002', customer: 'Luis Pérez', phone: '5598765432', amount: 450, status: 'pending', items: '1x Sudadera BTS', date: '12 Abr 2026' },
    { id: 'ORD-003', customer: 'María Gómez', phone: '5533322211', amount: 150, status: 'delivered', items: '1x Playera María Félix', date: '10 Abr 2026' },
  ]);

  useEffect(() => {
    // Solo guardamos los productos que NO están en el archivo base para evitar duplicados al recargar
    const baseIds = PRODUCTS.map(p => p.id);
    const localOnly = products.filter(p => !baseIds.includes(p.id));
    localStorage.setItem('imagine_stamp_products', JSON.stringify(localOnly));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('imagine_stamp_categories', JSON.stringify(categories));
  }, [categories]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface border border-primary/10 shadow-xl p-10 rounded-2xl w-full max-w-md">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-secondary" size={40} />
          </div>
          <h2 className="text-primary text-center text-2xl font-headline font-black tracking-tight mb-8">Acceso Admin</h2>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white text-primary p-4 rounded-xl border border-primary/10 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-center text-2xl tracking-[0.5em]"
              placeholder="••••"
              onKeyDown={(e) => e.key === 'Enter' && password === MASTER_PASSWORD && setIsAuthenticated(true)}
            />
            <button
              onClick={() => password === MASTER_PASSWORD && setIsAuthenticated(true)}
              className="w-full bg-secondary text-white p-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-secondary/20 uppercase tracking-widest text-sm"
            >
              Autenticar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => 
    o.status === orderTab && 
    (o.customer.toLowerCase().includes(searchOrder.toLowerCase()) || o.phone.includes(searchOrder))
  );

  return (
    <div className="min-h-screen bg-background text-on-background font-sans pb-20">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Header Navigation */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-10 bg-surface p-6 rounded-2xl border border-primary/5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <Plus className="text-secondary" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-primary font-headline tracking-tight leading-none uppercase">Imagine & Stamp</h1>
              <p className="text-[10px] font-bold text-primary/40 tracking-[0.2em] mt-1 uppercase">Panel de Control Boutique</p>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0">
            <nav className="flex bg-background p-1.5 rounded-xl border border-primary/5 shrink-0">
              {[
                { id: 'inventory', icon: Package, label: 'Inventario' },
                { id: 'add', icon: Plus, label: 'Nuevo Art' },
                { id: 'categories', icon: List, label: 'Categorías' },
                { id: 'orders', icon: DollarSign, label: 'Pedidos' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'bg-secondary text-white shadow-md' : 'text-primary/40 hover:text-primary/70'}`}
                >
                  <tab.icon size={12} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
            <button 
              onClick={onLogout}
              className="p-3 text-primary/10 hover:text-error transition-colors ml-2"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Views */}
        <div className="animate-in fade-in duration-300">
          
          {/* INVENTORY VIEW */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end px-2">
                <div>
                  <h2 className="text-2xl font-black text-primary font-headline tracking-tight uppercase">Inventario General</h2>
                  <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">Sincronizado con la tienda pública</p>
                </div>
                <div className="bg-secondary/10 px-4 py-2 rounded-lg border border-secondary/20">
                  <span className="text-xs font-black text-secondary tracking-widest uppercase">{products.length} Productos</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {products.map((p: any) => (
                  <div key={p.id} className="flex flex-col sm:flex-row items-center gap-6 bg-surface border border-primary/5 p-4 rounded-2xl hover:border-secondary/30 transition-all shadow-sm group">
                    <div className="w-20 h-20 bg-background rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 border border-primary/5">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h3 className="font-bold text-sm text-primary truncate uppercase tracking-wide">{p.name}</h3>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                        <span className="text-[9px] font-black text-secondary bg-secondary/5 px-2 py-0.5 rounded uppercase tracking-widest border border-secondary/10">{p.category}</span>
                        {p.subCategory && (
                          <span className="text-[9px] font-bold text-primary/40 bg-primary/5 px-2 py-0.5 rounded uppercase tracking-widest">{p.subCategory}</span>
                        )}
                        {p.subCategory2 && (
                          <span className="text-[9px] font-bold text-primary/40 bg-primary/5 px-2 py-0.5 rounded uppercase tracking-widest">{p.subCategory2}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-center sm:text-right shrink-0 px-4">
                      <p className="font-black text-primary text-lg tracking-tight">${p.price} <span className="text-[10px]">MXN</span></p>
                      <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">En Stock</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="w-11 h-11 rounded-xl bg-background border border-primary/5 flex items-center justify-center text-primary/20 hover:text-secondary hover:border-secondary transition-all shadow-sm">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setProducts(products.filter((item: any) => item.id !== p.id))} className="w-11 h-11 rounded-xl bg-background border border-primary/5 flex items-center justify-center text-primary/20 hover:text-error hover:border-error transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADD PRODUCT VIEW */}
          {activeTab === 'add' && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-8 text-center sm:text-left ml-2">
                <h2 className="text-2xl font-black text-primary font-headline tracking-tight uppercase">Nuevo Diseño</h2>
                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">Completa los datos para publicar en la web</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newProduct = {
                  id: Date.now(),
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  price: parseInt(formData.get('price') as string) || 0,
                  image: formData.get('image') || 'https://picsum.photos/seed/new/800/1000',
                  category: formData.get('category') as string,
                  subCategory: formData.get('sub1') as string,
                  subCategory2: formData.get('sub2') as string,
                };
                setProducts([newProduct, ...products]);
                setActiveTab('inventory');
              }} className="bg-surface border border-primary/5 p-8 md:p-10 rounded-3xl shadow-xl space-y-6">
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Nombre del artículo</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                      <input name="name" placeholder="EJ: PLAYERA SUBLIMACIÓN FULL COLOR" className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-xs font-black tracking-widest uppercase transition-all" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Descripción corta</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-5 text-primary/20" size={18} />
                      <textarea name="description" placeholder="DETALLES QUE APARECERÁN EN LA TIENDA..." className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-xs font-bold tracking-widest min-h-[100px] transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Precio Unitario ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <input name="price" type="number" placeholder="0.00" className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-xs font-black tracking-widest" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Categoría Principal</label>
                      <div className="relative">
                        <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <select name="category" className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-xs font-black tracking-widest appearance-none cursor-pointer uppercase">
                          {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Sub-Categoría 1 (Opcional)</label>
                      <div className="relative">
                        <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <input name="sub1" placeholder="EJ: CABALLERO" className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-xs font-black tracking-widest uppercase transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Sub-Categoría 2 (Opcional)</label>
                      <div className="relative">
                        <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <input name="sub2" placeholder="EJ: MARVEL" className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-xs font-black tracking-widest uppercase transition-all" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">URL de Imagen</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                      <input name="image" placeholder="HTTPS://..." className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-xs font-bold tracking-widest transition-all" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-secondary text-white p-5 rounded-2xl font-black hover:bg-orange-600 transition-all flex items-center justify-center gap-4 mt-6 shadow-xl shadow-secondary/20 uppercase tracking-[0.2em] text-xs">
                  <Plus size={20} strokeWidth={3} />
                  Publicar en la Tienda
                </button>
              </form>
            </div>
          )}

          {/* CATEGORIES VIEW */}
          {activeTab === 'categories' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="px-2">
                <h2 className="text-2xl font-black text-primary font-headline tracking-tight uppercase">Gestión de Categorías</h2>
                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">Define las secciones de tu boutique</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface p-8 rounded-3xl border border-primary/5 shadow-sm space-y-6">
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest border-b border-primary/5 pb-4">Lista Actual</h3>
                  <div className="space-y-3">
                    {categories.map((cat: any) => (
                      <div key={cat.id} className="flex justify-between items-center bg-background p-4 rounded-xl border border-primary/5 group">
                        <span className="text-xs font-black text-primary uppercase tracking-widest">{cat.name}</span>
                        {!DEFAULT_CATEGORIES.some(d => d.id === cat.id) && (
                          <button onClick={() => setCategories(categories.filter((c: any) => c.id !== cat.id))} className="text-primary/20 hover:text-error transition-colors">
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface p-8 rounded-3xl border border-primary/5 shadow-sm space-y-6">
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest border-b border-primary/5 pb-4">Nueva Categoría</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const name = formData.get('catName') as string;
                    if (name && !categories.some((c: any) => c.name === name)) {
                      setCategories([...categories, { id: name, name: name }]);
                      e.currentTarget.reset();
                    }
                  }} className="space-y-4">
                    <input name="catName" placeholder="NOMBRE DE LA CATEGORÍ..." className="w-full bg-background text-primary p-4 rounded-xl border border-primary/5 outline-none text-xs font-black tracking-widest uppercase" required />
                    <button type="submit" className="w-full bg-primary text-white p-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-all">
                      Añadir al Menú
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS VIEW */}
          {activeTab === 'orders' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 px-2">
                <div>
                  <h2 className="text-2xl font-black text-primary font-headline tracking-tight uppercase">Pedidos & Ventas</h2>
                  <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">Sincronización de pedidos vía WhatsApp</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                  <input 
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    placeholder="BUSCAR CLIENTE..." 
                    className="w-full bg-surface text-primary p-3.5 pl-12 rounded-2xl border border-primary/5 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-[10px] font-black tracking-widest placeholder:text-primary/20"
                  />
                </div>
              </div>

              <div className="flex bg-surface p-1.5 rounded-2xl border border-primary/5 shadow-sm inline-flex">
                <button 
                  onClick={() => setOrderTab('pending')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'pending' ? 'bg-secondary text-white shadow-md' : 'text-primary/40 hover:text-primary'}`}
                >
                  <Clock size={14} /> En Espera
                </button>
                <button 
                  onClick={() => setOrderTab('delivered')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'delivered' ? 'bg-emerald-500 text-white shadow-md' : 'text-primary/40 hover:text-primary'}`}
                >
                  <CheckCircle size={14} /> Entregados
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.length === 0 ? (
                  <div className="col-span-full py-20 bg-surface rounded-3xl border border-primary/5 text-center">
                    <p className="text-primary/20 text-sm font-bold uppercase tracking-widest italic">Sin pedidos registrados</p>
                  </div>
                ) : (
                  filteredOrders.map(order => (
                    <div key={order.id} className="bg-surface border border-primary/5 rounded-3xl p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black text-secondary bg-secondary/10 px-2 py-0.5 rounded tracking-widest uppercase">{order.id}</span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {order.status === 'pending' ? 'Pendiente' : 'Listo'}
                        </span>
                      </div>
                      <div className="space-y-1 mb-6">
                        <h4 className="text-primary font-black text-base uppercase tracking-tight">{order.customer}</h4>
                        <p className="text-xs text-primary/40 font-bold flex items-center gap-1.5 tracking-wide"><Phone size={12} className="text-secondary" /> {order.phone}</p>
                      </div>
                      <div className="bg-background/50 p-4 rounded-xl border border-primary/5 mb-6">
                        <p className="text-[11px] text-primary/60 font-medium leading-relaxed uppercase tracking-wide">"{order.items}"</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-primary/30 text-[10px] font-black uppercase tracking-widest">Total</span>
                        <span className="text-primary font-black text-xl tracking-tight">${order.amount} <span className="text-[10px]">MXN</span></span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
