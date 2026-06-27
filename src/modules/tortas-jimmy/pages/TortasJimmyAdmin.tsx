import React, { useState } from 'react';
import { Lock, Plus, List, Tag, Settings, ShoppingBag, Edit, Trash, Save } from 'lucide-react';

const MASTER_PASSWORD = '1212';
const ALT_PASSWORD = 'tortas';

// Datos iniciales estáticos para demostración
const INITIAL_PRODUCTS = [
  { id: 't1', name: 'Torta de la Barda', price: 70, category: '🍴 Tortas', emoji: '🍔' },
  { id: 't2', name: 'Torta de Pierna', price: 75, category: '🍴 Tortas', emoji: '🍔' },
  { id: 'tc', name: 'Tacos de Cochinita', price: 15, category: '🌮 Antojitos', emoji: '🌮' },
  { id: 'b1', name: 'Refresco 600 ml', price: 26, category: '🥤 Bebidas', emoji: '🥤' }
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

  // Estados locales (en memoria, no persisten al recargar)
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Acceso Admin</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (password === MASTER_PASSWORD || password === ALT_PASSWORD) setIsAuthenticated(true); else alert('Contraseña incorrecta'); }}>
            <input 
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña maestra"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-red-600">Tortas Jimmy</h1>
          <p className="text-xs text-gray-400">Panel de Control</p>
        </div>
        <nav className="p-4 flex flex-col gap-2">
          {[
            { id: 'inventario', name: 'Inventario', icon: List },
            { id: 'nuevo', name: 'Nuevo Producto', icon: Plus },
            { id: 'categorias', name: 'Categorías', icon: Tag },
            { id: 'pedidos', name: 'Pedidos', icon: ShoppingBag },
            { id: 'ajustes', name: 'Ajustes', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === tab.id ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} /> {tab.name}
            </button>
          ))}
        </nav>
      </aside>
      
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'inventario' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Inventario</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-medium">{p.emoji} {p.name}</td>
                      <td className="px-4 py-3">${p.price}</td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">{p.category}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-blue-500 hover:text-blue-700 mr-3"><Edit size={16} /></button>
                        <button className="text-red-500 hover:text-red-700" onClick={() => deleteProduct(p.id)}><Trash size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No hay productos</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'nuevo' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Agregar Producto</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <form onSubmit={e => {
                e.preventDefault();
                alert("Producto agregado (modo demostración).");
                setActiveTab('inventario');
              }}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Ej. Torta Mixta" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Precio ($)</label>
                    <input required type="number" className="w-full border border-gray-300 rounded-lg p-2" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2">
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700">Guardar Producto</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'categorias' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Gestión de Categorías</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
               <h3 className="font-bold text-gray-700 mb-4">Añadir Categoría</h3>
               <div className="flex gap-2">
                 <input type="text" className="flex-1 border border-gray-300 rounded-lg p-2" placeholder="Ej. 🍰 Postres" />
                 <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">Añadir</button>
               </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {categories.map(c => (
                  <li key={c.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                    <span className="font-medium">{c.name}</span>
                    <button className="text-red-500 hover:text-red-700"><Trash size={18} /></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'pedidos' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Pedidos Recientes</h2>
            <div className="grid gap-4">
              {orders.map(o => (
                <div key={o.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{o.customer_name} <span className="text-sm font-normal text-gray-500">({o.customer_phone})</span></h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      o.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {o.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Total: <strong>${o.total_amount}</strong> ({o.payment_method})</p>
                  <p className="text-xs text-gray-400 mb-4">{new Date(o.created_at).toLocaleString()}</p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-sm mb-4 border border-gray-100">
                    {Array.isArray(o.items) && o.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between mb-1">
                        <span>{item.qty}x {item.nombre}</span>
                        <span>${item.precio * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  {o.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => markDelivered(o.id)} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-green-200">
                        Marcar como Entregado
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-gray-400 py-8">No hay pedidos registrados</p>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'ajustes' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Ajustes del Negocio</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Lock size={18}/> Datos de Transferencia</h3>
              <form onSubmit={e => { e.preventDefault(); alert("Ajustes guardados (modo demostración)."); }}>
                <div className="grid gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Banco</label>
                    <input type="text" defaultValue={bankSettings.bank_name} className="w-full border border-gray-300 rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Titular</label>
                    <input type="text" defaultValue={bankSettings.account_holder} className="w-full border border-gray-300 rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">CLABE o Cuenta</label>
                    <input type="text" defaultValue={bankSettings.clabe} className="w-full border border-gray-300 rounded-lg p-2" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black flex items-center justify-center gap-2">
                  <Save size={18} /> Guardar Ajustes
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
