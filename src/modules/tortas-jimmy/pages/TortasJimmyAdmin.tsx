import React, { useState } from 'react';
import { Lock, Plus, List, Tag, Settings, ShoppingBag, Edit, Trash, Search, LogOut, CheckCircle, XCircle, Package } from 'lucide-react';

const MASTER_PASSWORD = '1212';
const ALT_PASSWORD = 'tortas';

// Datos iniciales estáticos para demostración
const INITIAL_PRODUCTS = [
  { id: 't1', name: 'Torta de la Barda', desc: 'La especialidad de la casa', price: 70, category: 'Tortas', emoji: '🍔', img: '/assets/t1.jpg' },
  { id: 't2', name: 'Torta de Pierna', desc: 'Pierna jugosa al estilo Jimmy', price: 75, category: 'Tortas', emoji: '🍔', img: '/assets/t2.jpg' },
  { id: 'tc', name: 'Tacos de Cochinita', desc: 'Con tortilla recién hecha a mano', price: 15, category: 'Antojitos', emoji: '🌮', img: '/assets/tc.jpg' },
  { id: 'b1', name: 'Refresco 600 ml', desc: 'Bien frío', price: 26, category: 'Bebidas', emoji: '🥤', img: '/assets/b1.jpg' }
];

const INITIAL_CATEGORIES = [
  { id: 'tortas', name: '🍴 Tortas', sort_order: 1 },
  { id: 'antojitos', name: '🌮 Antojitos', sort_order: 2 },
  { id: 'bebidas', name: '🥤 Bebidas', sort_order: 3 }
];

const INITIAL_ORDERS = [
  {
    id: 'TJ-123456',
    customer_name: 'Juan Pérez',
    customer_phone: '8331234567',
    total_amount: 140,
    status: 'pending',
    payment_method: 'Efectivo',
    created_at: new Date().toISOString(),
    items: [
      { nombre: 'Torta de la Barda', qty: 2, precio: 70 }
    ]
  }
];

export default function TortasJimmyAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('inventario');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados locales
  const [products, setProducts] = useState<any[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<any[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<any[]>(INITIAL_ORDERS);
  const [bankSettings, setBankSettings] = useState<any>({
    bank_name: 'BBVA',
    account_holder: 'Tortas Jimmy',
    clabe: '012345678901234567'
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-[#141414] p-8 rounded-2xl border border-red-900/30 shadow-2xl w-full max-w-sm text-center">
          <div className="w-20 h-20 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-wider">Acceso Admin</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (password === MASTER_PASSWORD || password === ALT_PASSWORD) setIsAuthenticated(true); else alert('Contraseña incorrecta'); }}>
            <input 
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 text-white rounded-xl mb-6 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
            />
            <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors uppercase tracking-wide">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const deleteProduct = (id: string) => {
    if(confirm("¿Seguro que deseas eliminar este producto?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const markDelivered = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'delivered' } : o));
  };

  const TABS = [
    { id: 'inventario', name: 'INVENTARIO', icon: Package },
    { id: 'nuevo', name: 'NUEVO', icon: Plus },
    { id: 'categorias', name: 'CATEGORÍAS', icon: Tag },
    { id: 'pedidos', name: 'PEDIDOS', icon: ShoppingBag },
    { id: 'ajustes', name: 'AJUSTES', icon: Settings }
  ];

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans">
      
      {/* Top Navbar */}
      <header className="bg-[#111] border-b border-gray-800 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-50">
        
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            🍔
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-white leading-tight uppercase tracking-wider">Tortas Jimmy</h1>
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Panel de Control</p>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar mask-edges px-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={16} strokeWidth={isActive ? 2.5 : 2} /> 
                {tab.name}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button onClick={() => setIsAuthenticated(false)} className="text-gray-500 hover:text-red-500 transition-colors p-2">
          <LogOut size={20} />
        </button>

      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Dashboard Stats Row */}
        {activeTab === 'inventario' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <Package className="text-red-500 mb-2" size={32} />
              <span className="text-3xl font-black text-white">{products.length}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Productos</span>
            </div>
            <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="text-green-500 mb-2" size={32} />
              <span className="text-3xl font-black text-white">{pendingOrders}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Pendientes</span>
            </div>
            <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <Tag className="text-blue-500 mb-2" size={32} />
              <span className="text-3xl font-black text-white">{categories.length}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Categorías</span>
            </div>
          </div>
        )}

        {/* Tab Content: Inventario */}
        {activeTab === 'inventario' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Inventario</h2>
                <p className="text-sm text-gray-500">{products.length} PRODUCTOS</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-[#141414] border border-gray-800 text-white rounded-xl pl-10 pr-4 py-2.5 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid gap-3">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-[#141414] border border-gray-800 rounded-2xl p-4 flex items-center justify-between hover:border-red-500/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#0a0a0a] rounded-xl flex items-center justify-center text-3xl border border-gray-800 overflow-hidden">
                      {p.img ? <img src={p.img} alt={p.name} className="w-full h-full object-cover" /> : p.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        {p.name}
                        {p.id === 't1' && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold">✨ ESPECIAL</span>}
                      </h3>
                      <p className="text-sm text-gray-500">{p.desc}</p>
                      <p className="text-xs text-red-500 font-medium mt-1">{p.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-2xl font-black text-red-500">${p.price}</div>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-colors">
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-[#141414] rounded-2xl border border-gray-800">
                  <Search size={48} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-500 font-medium">No se encontraron productos</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Nuevo */}
        {activeTab === 'nuevo' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6">Agregar Producto</h2>
            <div className="bg-[#141414] p-6 sm:p-8 rounded-2xl border border-gray-800">
              <form onSubmit={e => {
                e.preventDefault();
                alert("Producto agregado (modo demostración).");
                setActiveTab('inventario');
              }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Nombre del Producto</label>
                    <input required type="text" className="w-full bg-[#0a0a0a] border border-gray-800 text-white rounded-xl p-3 focus:border-red-500 focus:outline-none" placeholder="Ej. Torta Mixta" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Descripción</label>
                    <input type="text" className="w-full bg-[#0a0a0a] border border-gray-800 text-white rounded-xl p-3 focus:border-red-500 focus:outline-none" placeholder="Breve descripción del producto" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Precio ($)</label>
                    <input required type="number" className="w-full bg-[#0a0a0a] border border-gray-800 text-white rounded-xl p-3 focus:border-red-500 focus:outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Categoría</label>
                    <select className="w-full bg-[#0a0a0a] border border-gray-800 text-white rounded-xl p-3 focus:border-red-500 focus:outline-none">
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white font-black py-4 rounded-xl hover:bg-red-700 uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.3)]">Guardar Producto</button>
              </form>
            </div>
          </div>
        )}

        {/* Tab Content: Categorías */}
        {activeTab === 'categorias' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6">Categorías</h2>
            <div className="bg-[#141414] p-6 rounded-2xl border border-gray-800 mb-6 flex gap-3">
              <input type="text" className="flex-1 bg-[#0a0a0a] border border-gray-800 text-white rounded-xl p-3 focus:border-red-500 focus:outline-none" placeholder="Ej. 🍰 Postres" />
              <button className="bg-red-600 text-white px-6 rounded-xl font-bold hover:bg-red-700">Añadir</button>
            </div>
            
            <div className="bg-[#141414] rounded-2xl border border-gray-800 overflow-hidden">
              <ul className="divide-y divide-gray-800">
                {categories.map(c => (
                  <li key={c.id} className="p-4 sm:p-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                    <span className="font-bold text-white text-lg">{c.name}</span>
                    <button className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-colors">
                      <Trash size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab Content: Pedidos */}
        {activeTab === 'pedidos' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6">Pedidos Recientes</h2>
            <div className="grid gap-4">
              {orders.map(o => (
                <div key={o.id} className="bg-[#141414] p-6 rounded-2xl border border-gray-800 relative overflow-hidden">
                  {/* Indicador de estado */}
                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${o.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pl-4">
                    <div>
                      <h3 className="font-black text-xl text-white">{o.customer_name}</h3>
                      <p className="text-sm text-gray-400">📱 {o.customer_phone}</p>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                        o.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                      }`}>
                        {o.status === 'pending' ? <XCircle size={12}/> : <CheckCircle size={12}/>}
                        {o.status === 'pending' ? 'Pendiente' : 'Entregado'}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">{new Date(o.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#0a0a0a] p-4 rounded-xl border border-gray-800 mb-4 pl-4">
                    {Array.isArray(o.items) && o.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center mb-2 last:mb-0">
                        <span className="text-gray-300"><span className="text-red-500 font-bold">{item.qty}x</span> {item.nombre}</span>
                        <span className="text-white font-bold">${item.precio * item.qty}</span>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-bold uppercase">Total ({o.payment_method})</span>
                      <span className="text-xl font-black text-red-500">${o.total_amount}</span>
                    </div>
                  </div>

                  {o.status === 'pending' && (
                    <div className="flex justify-end pl-4">
                      <button onClick={() => markDelivered(o.id)} className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                        <CheckCircle size={16}/> Marcar como Entregado
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-12 bg-[#141414] rounded-2xl border border-gray-800">
                  <ShoppingBag size={48} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-500 font-medium">No hay pedidos registrados</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Tab Content: Ajustes */}
        {activeTab === 'ajustes' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6">Ajustes</h2>
            <div className="bg-[#141414] p-6 sm:p-8 rounded-2xl border border-gray-800">
              <h3 className="font-bold text-gray-300 mb-6 flex items-center gap-2 border-b border-gray-800 pb-4"><Settings size={18}/> Datos de Transferencia</h3>
              <form onSubmit={e => { e.preventDefault(); alert("Ajustes guardados (modo demostración)."); }}>
                <div className="grid gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Banco</label>
                    <input type="text" defaultValue={bankSettings.bank_name} className="w-full bg-[#0a0a0a] border border-gray-800 text-white rounded-xl p-3 focus:border-red-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Titular</label>
                    <input type="text" defaultValue={bankSettings.account_holder} className="w-full bg-[#0a0a0a] border border-gray-800 text-white rounded-xl p-3 focus:border-red-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">CLABE o Número de Cuenta</label>
                    <input type="text" defaultValue={bankSettings.clabe} className="w-full bg-[#0a0a0a] border border-gray-800 text-white rounded-xl p-3 focus:border-red-500 focus:outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white font-black py-4 rounded-xl hover:bg-red-700 uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2">
                  <Save size={20} /> Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
