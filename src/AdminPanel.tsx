import { useState, useEffect } from 'react';
import { 
  Lock, Package, DollarSign, Trash2, Edit2, Plus, LogOut, 
  Tag, FileText, LayoutGrid, Box, Image as ImageIcon, Search, CheckCircle, Clock
} from 'lucide-react';

const MASTER_PASSWORD = 'admin';

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
      <div className="min-h-screen bg-[#070707] flex items-center justify-center p-4">
        <div className="bg-[#0f0f0f] border border-[#1a1a1a] shadow-inner p-8 rounded-3xl w-full max-w-md">
          <Lock className="text-cyan-500 mx-auto mb-6" size={48} strokeWidth={1} />
          <h2 className="text-white text-center text-xl font-headline tracking-widest uppercase font-bold mb-8">ACCESO RESTRINGIDO</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#050505] text-white p-4 rounded-xl border border-[#222] mb-6 focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="Contraseña"
          />
          <button
            onClick={() => password === MASTER_PASSWORD && setIsAuthenticated(true)}
            className="w-full bg-cyan-600/20 text-cyan-400 p-4 rounded-xl font-bold hover:bg-cyan-600/30 transition border border-cyan-500/30 uppercase tracking-widest text-sm"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => 
    o.status === orderTab && 
    (o.customer.toLowerCase().includes(searchOrder.toLowerCase()) || o.phone.includes(searchOrder))
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-cyan-500/30">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Header Options */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-12 border-b border-[#222] pb-6">
          <h1 className="text-2xl font-black text-white font-headline tracking-widest uppercase">Admin <span className="text-cyan-500">Panel</span></h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition border ${activeTab === 'inventory' ? 'bg-[#111] border-cyan-500/50 text-cyan-400' : 'bg-[#0a0a0a] border-[#222] text-gray-500 hover:text-gray-300'}`}
            >
              <Package size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Inventario</span>
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition border ${activeTab === 'add' ? 'bg-[#111] border-cyan-500/50 text-cyan-400' : 'bg-[#0a0a0a] border-[#222] text-gray-500 hover:text-gray-300'}`}
            >
              <Plus size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Añadir Diseño</span>
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition border ${activeTab === 'orders' ? 'bg-[#111] border-cyan-500/50 text-cyan-400' : 'bg-[#0a0a0a] border-[#222] text-gray-500 hover:text-gray-300'}`}
            >
              <DollarSign size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Pedidos</span>
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-400 px-4 py-3 rounded-2xl transition ml-2"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Views */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* INVENTORY VIEW */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-sm font-bold tracking-[0.2em] text-gray-300 uppercase">Inventario Actual</h2>
                <span className="text-xs text-gray-600 font-bold">{products.length} ITEMS</span>
              </div>
              <div className="space-y-3">
                {products.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-6 bg-[#0f0f0f] border border-[#222] p-4 rounded-[2rem] hover:border-cyan-500/50 transition-colors group">
                    <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-gray-100 truncate uppercase tracking-wide">{p.name}</h3>
                      <p className="text-[10px] text-gray-500 truncate uppercase mt-1 tracking-widest">{p.category}</p>
                    </div>
                    <div className="text-right shrink-0 px-4">
                      <p className="font-bold text-cyan-400 text-sm tracking-wide">${p.price} MXN</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">{p.stock}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setProducts(products.filter((item: any) => item.id !== p.id))} className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADD DESIGN VIEW */}
          {activeTab === 'add' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-sm font-bold tracking-[0.2em] text-gray-300 uppercase mb-8 ml-2">Añadir Nuevo Diseño</h2>
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
              }} className="bg-[#0f0f0f] border border-cyan-500/20 p-8 rounded-[2.5rem] space-y-6 form-dark">
                
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input name="name" placeholder="NOMBRE DEL PRODUCTO" className="w-full bg-[#050505] text-white p-4 pl-12 rounded-2xl border border-[#222] focus:border-cyan-500/50 outline-none text-xs font-bold tracking-widest placeholder:text-gray-700" required />
                </div>

                <div className="relative">
                  <FileText className="absolute left-4 top-5 text-gray-600" size={18} />
                  <textarea name="description" placeholder="DESCRIPCIÓN" className="w-full bg-[#050505] text-white p-4 pl-12 rounded-2xl border border-[#222] focus:border-cyan-500/50 outline-none text-xs font-bold tracking-widest placeholder:text-gray-700 min-h-[100px]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <input name="price" type="number" placeholder="PRECIO (EJ: $450)" className="w-full bg-[#050505] text-white p-4 pl-12 rounded-2xl border border-[#222] focus:border-cyan-500/50 outline-none text-xs font-bold tracking-widest placeholder:text-gray-700" required />
                  </div>
                  <div className="relative">
                    <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <select name="gender" className="w-full bg-[#050505] text-white p-4 pl-12 rounded-2xl border border-[#222] focus:border-cyan-500/50 outline-none text-xs font-bold tracking-widest appearance-none cursor-pointer">
                      <option>HOMBRE</option>
                      <option>MUJER</option>
                      <option>UNISEX</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <select name="category" className="w-full bg-[#050505] text-white p-4 pl-12 rounded-2xl border border-[#222] focus:border-cyan-500/50 outline-none text-xs font-bold tracking-widest appearance-none cursor-pointer">
                      <option>SUDADERAS</option>
                      <option>PLAYERAS</option>
                      <option>ACCESORIOS</option>
                    </select>
                  </div>
                  <div className="relative">
                    <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <select name="franchise" className="w-full bg-[#050505] text-white p-4 pl-12 rounded-2xl border border-[#222] focus:border-cyan-500/50 outline-none text-xs font-bold tracking-widest appearance-none cursor-pointer">
                      <option>HARRY POTTER</option>
                      <option>MARVEL</option>
                      <option>STAR WARS</option>
                      <option>ANIME</option>
                      <option>VINTAGE</option>
                      <option>GENÉRICO</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <select name="printLocation" className="w-full bg-[#050505] text-white p-4 pl-12 rounded-2xl border border-[#222] focus:border-cyan-500/50 outline-none text-xs font-bold tracking-widest appearance-none cursor-pointer">
                    <option>SÓLO FRENTE</option>
                    <option>SÓLO REVERSA</option>
                    <option>FRENTE Y REVERSA</option>
                  </select>
                </div>

                <div className="relative">
                  <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <select name="sizes" className="w-full bg-[#050505] text-white p-4 pl-12 rounded-2xl border border-[#222] focus:border-cyan-500/50 outline-none text-xs font-bold tracking-widest appearance-none cursor-pointer">
                    <option>¿REQUIERE TALLAS? SÍ</option>
                    <option>¿REQUIERE TALLAS? NO</option>
                  </select>
                </div>

                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <select name="specialLabel" className="w-full bg-[#050505] text-white p-4 pl-12 rounded-2xl border border-cyan-500/30 focus:border-cyan-500 outline-none text-xs font-bold tracking-widest appearance-none cursor-pointer">
                    <option>ETIQUETA ESPECIAL: NINGUNA</option>
                    <option>NUEVO LANZAMIENTO</option>
                    <option>REBAJAS</option>
                    <option>DESTACADO</option>
                  </select>
                </div>

                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input name="imageFront" placeholder="URL DE LA IMAGEN (FRENTE)" className="w-full bg-[#050505] text-white p-4 pl-12 rounded-2xl border border-[#222] focus:border-cyan-500/50 outline-none text-xs font-bold tracking-widest placeholder:text-gray-700" />
                </div>

                <div className="relative opacity-50">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input name="imageBack" placeholder="URL IMAGEN REVERSA (DESACTIVADO)" className="w-full bg-[#050505] text-gray-600 p-4 pl-12 rounded-2xl border border-[#222] outline-none text-xs font-bold tracking-widest placeholder:text-gray-700 pointer-events-none" disabled />
                </div>

                <button type="submit" className="w-full bg-white text-black p-5 rounded-3xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-4">
                  <Plus size={18} />
                  <span className="text-xs uppercase tracking-[0.2em]">Publicar Producto</span>
                </button>
              </form>
            </div>
          )}

          {/* ORDERS VIEW */}
          {activeTab === 'orders' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 px-2">
                <h2 className="text-sm font-bold tracking-[0.2em] text-gray-300 uppercase">Seguimiento de Pedidos</h2>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input 
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    placeholder="BUSCAR POR CLIENTE O TELÉFONO..." 
                    className="w-full bg-[#0f0f0f] text-white p-3 pl-10 rounded-full border border-[#222] focus:border-cyan-500/50 outline-none text-[10px] font-bold tracking-widest placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 px-2">
                <button 
                  onClick={() => setOrderTab('pending')}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${orderTab === 'pending' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-[#0f0f0f] text-gray-500 border border-[#222] hover:text-white'}`}
                >
                  <Clock size={14} className="inline mr-2 -mt-0.5" /> Pendientes
                </button>
                <button 
                  onClick={() => setOrderTab('delivered')}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${orderTab === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-[#0f0f0f] text-gray-500 border border-[#222] hover:text-white'}`}
                >
                  <CheckCircle size={14} className="inline mr-2 -mt-0.5" /> Entregados
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.length === 0 ? (
                  <p className="text-gray-600 text-sm italic col-span-full px-2">No se encontraron pedidos en esta categoría.</p>
                ) : (
                  filteredOrders.map(order => (
                    <div key={order.id} className="bg-[#0f0f0f] border border-[#222] rounded-[2rem] p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-start border-b border-[#222] pb-4">
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{order.id}</p>
                          <h4 className="text-white font-bold mt-1 uppercase tracking-wide">{order.customer}</h4>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Phone size={10} /> {order.phone}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${order.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {order.status === 'pending' ? 'Pendiente' : 'Entregado'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-300 font-medium">{order.items}</p>
                        <p className="text-[10px] text-gray-600 mt-2">{order.date}</p>
                      </div>
                      <div className="pt-4 border-t border-[#222] flex justify-between items-center">
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total</span>
                        <span className="text-cyan-400 font-bold tracking-wide">${order.amount} MXN</span>
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
