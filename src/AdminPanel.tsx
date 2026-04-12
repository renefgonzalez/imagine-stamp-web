import { useState, useEffect } from 'react';
import { 
  Lock, Package, DollarSign, Trash2, Edit2, Plus, LogOut, 
  Tag, FileText, LayoutGrid, Box, Image as ImageIcon, Search, CheckCircle, Clock, Phone
} from 'lucide-react';

const MASTER_PASSWORD = '1212';

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'orders'>('inventory');
  const [orderTab, setOrderTab] = useState<'pending' | 'delivered'>('pending');
  const [searchOrder, setSearchOrder] = useState('');
  
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('imagine_stamp_products');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'PLAYERA NY HERALD TRIBUNE', category: 'HOMBRE - PLAYERA - VINTAGE', price: 150, stock: 'EN STOCK', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop' },
      { id: 2, name: 'PLAYERA NY HERALD TRIBUNE', category: 'MUJER - PLAYERA - VINTAGE', price: 150, stock: 'EN STOCK', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=200&auto=format&fit=crop' },
      { id: 3, name: 'MARÍA FÉLIX - ÉPOCA DE ORO', category: 'MUJER - PLAYERA - CINE MEXICANO', price: 150, stock: 'EN STOCK', image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=200&auto=format&fit=crop' },
      { id: 4, name: 'YOU NEVER WALK ALONE', category: 'MUJER - SUDADERAS - BTS', price: 450, stock: 'EN STOCK', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200&auto=format&fit=crop' },
      { id: 5, name: '"CARRIE" - EDICIÓN TERROR CLÁSICO', category: 'HOMBRE - SUDADERAS - CINE', price: 450, stock: 'EN STOCK', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200&auto=format&fit=crop' },
    ];
  });

  const [orders, setOrders] = useState([
    { id: 'ORD-001', customer: 'Ana Sánchez', phone: '5512345678', amount: 600, status: 'pending', items: '2x Playera Vintage', date: '12 Abr 2026' },
    { id: 'ORD-002', customer: 'Luis Pérez', phone: '5598765432', amount: 450, status: 'pending', items: '1x Sudadera BTS', date: '12 Abr 2026' },
    { id: 'ORD-003', customer: 'María Gómez', phone: '5533322211', amount: 150, status: 'delivered', items: '1x Playera María Félix', date: '10 Abr 2026' },
  ]);

  useEffect(() => {
    localStorage.setItem('imagine_stamp_products', JSON.stringify(products));
  }, [products]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface border border-primary/10 shadow-xl p-10 rounded-2xl w-full max-w-md">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-secondary" size={40} />
          </div>
          <h2 className="text-primary text-center text-2xl font-headline font-black tracking-tight mb-8">Panel de Control</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-primary/60 uppercase tracking-widest mb-2 ml-1">Contraseña Maestra</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white text-primary p-4 rounded-xl border border-primary/10 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                placeholder="••••"
              />
            </div>
            <button
              onClick={() => password === MASTER_PASSWORD && setIsAuthenticated(true)}
              className="w-full bg-secondary text-white p-4 rounded-xl font-bold hover:secondary/90 transition shadow-lg shadow-secondary/20 uppercase tracking-widest text-sm"
            >
              Entrar al Sistema
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
    <div className="min-h-screen bg-background text-on-background font-sans">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10 bg-surface p-6 rounded-2xl border border-primary/5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <Plus className="text-secondary" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-primary font-headline tracking-tight leading-none uppercase">Imagine & Stamp</h1>
              <p className="text-[10px] font-bold text-primary/40 tracking-[0.2em] mt-1 uppercase">Administración de Boutique</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <nav className="flex bg-background p-1.5 rounded-xl border border-primary/5">
              {[
                { id: 'inventory', icon: Package, label: 'Inventario' },
                { id: 'add', icon: Plus, label: 'Nuevo' },
                { id: 'orders', icon: DollarSign, label: 'Pedidos' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all text-xs font-bold uppercase tracking-widest ${activeTab === tab.id ? 'bg-secondary text-white shadow-md' : 'text-primary/40 hover:text-primary/70'}`}
                >
                  <tab.icon size={14} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
            <button 
              onClick={onLogout}
              className="p-3 text-primary/20 hover:text-error transition-colors ml-4"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in duration-300">
          
          {/* INVENTORY VIEW */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end px-2">
                <div>
                  <h2 className="text-2xl font-black text-primary font-headline tracking-tight uppercase">Inventario Actual</h2>
                  <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">Control de existencias y productos</p>
                </div>
                <div className="bg-secondary/10 px-4 py-2 rounded-lg border border-secondary/20">
                  <span className="text-xs font-black text-secondary tracking-widest uppercase">{products.length} Items</span>
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
                        {p.category.split('-').map((tag: string, i: number) => (
                          <span key={i} className="text-[9px] font-bold text-primary/50 bg-primary/5 px-2 py-0.5 rounded uppercase tracking-widest">{tag.trim()}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-center sm:text-right shrink-0 px-4">
                      <p className="font-black text-secondary text-lg tracking-tight">${p.price} <span className="text-[10px]">MXN</span></p>
                      <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[9px] font-bold uppercase tracking-widest mt-1">{p.stock}</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="w-11 h-11 rounded-xl bg-background border border-primary/5 flex items-center justify-center text-primary/40 hover:text-secondary hover:border-secondary transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setProducts(products.filter((item: any) => item.id !== p.id))} className="w-11 h-11 rounded-xl bg-background border border-primary/5 flex items-center justify-center text-primary/40 hover:text-error hover:border-error transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADD DESIGN VIEW */}
          {activeTab === 'add' && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-8 text-center sm:text-left">
                <h2 className="text-2xl font-black text-primary font-headline tracking-tight uppercase">Añadir Nuevo Diseño</h2>
                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">Carga de productos al catálogo público</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newProduct = {
                  id: Date.now(),
                  name: formData.get('name'),
                  price: parseInt(formData.get('price') as string) || 0,
                  image: formData.get('imageFront') || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop',
                  category: `${formData.get('gender')} - ${formData.get('category')} - ${formData.get('franchise')}`.toUpperCase(),
                  stock: 'EN STOCK'
                };
                setProducts([newProduct, ...products]);
                setActiveTab('inventory');
              }} className="bg-surface border border-primary/5 p-8 md:p-10 rounded-2xl shadow-xl space-y-6">
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Nombre del producto</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                      <input name="name" placeholder="Ej: Playera Marvel Vintage" className="w-full bg-background text-primary p-4 pl-12 rounded-xl border border-primary/5 focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none text-xs font-bold tracking-widest placeholder:text-primary/20 transition-all" required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Descripción</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 text-primary/20" size={18} />
                      <textarea name="description" placeholder="Detalles del diseño, tela, etc." className="w-full bg-background text-primary p-4 pl-12 rounded-xl border border-primary/5 focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none text-xs font-bold tracking-widest placeholder:text-primary/20 min-h-[100px] transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Precio Unitario ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <input name="price" type="number" placeholder="450" className="w-full bg-background text-primary p-4 pl-12 rounded-xl border border-primary/5 focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none text-xs font-bold tracking-widest" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Género</label>
                      <div className="relative">
                        <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <select name="gender" className="w-full bg-background text-primary p-4 pl-12 rounded-xl border border-primary/5 focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none text-xs font-bold tracking-widest appearance-none cursor-pointer uppercase">
                          <option>HOMBRE</option>
                          <option>MUJER</option>
                          <option>UNISEX</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Categoría</label>
                      <div className="relative">
                        <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <select name="category" className="w-full bg-background text-primary p-4 pl-12 rounded-xl border border-primary/5 focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none text-xs font-bold tracking-widest appearance-none cursor-pointer uppercase">
                          <option>SUDADERAS</option>
                          <option>PLAYERAS</option>
                          <option>ACCESORIOS</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Franquicia / Estilo</label>
                      <div className="relative">
                        <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <select name="franchise" className="w-full bg-background text-primary p-4 pl-12 rounded-xl border border-primary/5 focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none text-xs font-bold tracking-widest appearance-none cursor-pointer uppercase">
                          <option>HARRY POTTER</option>
                          <option>MARVEL</option>
                          <option>STAR WARS</option>
                          <option>ANIME</option>
                          <option>VINTAGE</option>
                          <option>GENÉRICO</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Posición Impresión</label>
                      <div className="relative">
                        <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <select name="printLocation" className="w-full bg-background text-primary p-4 pl-12 rounded-xl border border-primary/5 focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none text-xs font-bold tracking-widest appearance-none cursor-pointer uppercase">
                          <option>SÓLO FRENTE</option>
                          <option>SÓLO REVERSA</option>
                          <option>FRENTE Y REVERSA</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">Etiqueta Especial</label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                        <select name="specialLabel" className="w-full bg-background text-primary p-4 pl-12 rounded-xl border border-primary/5 focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none text-xs font-bold tracking-widest appearance-none cursor-pointer uppercase">
                          <option>NINGUNA</option>
                          <option>NUEVO LANZAMIENTO</option>
                          <option>REBAJAS</option>
                          <option>DESTACADO</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-1">URL Imagen Frontal</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                      <input name="imageFront" placeholder="https://..." className="w-full bg-background text-primary p-4 pl-12 rounded-xl border border-primary/5 focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none text-xs font-bold tracking-widest transition-all" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-secondary text-white p-5 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-3 mt-6 shadow-lg shadow-secondary/20 uppercase tracking-widest text-sm">
                  <Plus size={20} />
                  <span>Publicar Diseño</span>
                </button>
              </form>
            </div>
          )}

          {/* ORDERS VIEW */}
          {activeTab === 'orders' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 px-2">
                <div>
                  <h2 className="text-2xl font-black text-primary font-headline tracking-tight uppercase">Seguimiento de Pedidos</h2>
                  <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-1">Control de entregas y estatus de venta</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                  <input 
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    placeholder="CLIENTE O TELÉFONO..." 
                    className="w-full bg-surface text-primary p-3.5 pl-12 rounded-2xl border border-primary/5 focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none text-[10px] font-black tracking-widest placeholder:text-primary/20"
                  />
                </div>
              </div>

              <div className="flex bg-surface p-1.5 rounded-2xl border border-primary/5 shadow-sm inline-flex">
                <button 
                  onClick={() => setOrderTab('pending')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${orderTab === 'pending' ? 'bg-secondary text-white shadow-md' : 'text-primary/40 hover:text-primary'}`}
                >
                  <Clock size={14} /> Pendientes
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
                    <p className="text-primary/20 text-sm font-bold uppercase tracking-widest italic">No se encontraron registros</p>
                  </div>
                ) : (
                  filteredOrders.map(order => (
                    <div key={order.id} className="bg-surface border border-primary/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black text-secondary bg-secondary/10 px-2 py-0.5 rounded tracking-widest uppercase">{order.id}</span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {order.status === 'pending' ? 'En Cola' : 'Listo'}
                        </span>
                      </div>
                      <div className="space-y-1 mb-6">
                        <h4 className="text-primary font-black text-base uppercase tracking-tight">{order.customer}</h4>
                        <p className="text-xs text-primary/40 font-bold flex items-center gap-1.5 tracking-wide"><Phone size={12} className="text-secondary" /> {order.phone}</p>
                      </div>
                      <div className="bg-background/50 p-4 rounded-xl border border-primary/5 mb-6">
                        <p className="text-[11px] text-primary/60 font-medium leading-relaxed uppercase tracking-wide italic">"{order.items}"</p>
                        <p className="text-[9px] text-primary/30 font-bold mt-3 text-right uppercase tracking-[2px]">{order.date}</p>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-primary/30 text-[10px] font-black uppercase tracking-widest">Total Venta</span>
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
