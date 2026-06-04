import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, LogOut, Settings, Package, Banknote, Edit2, Plus, Check, Trash2, X, Landmark, Search, Phone, Calendar, Clock } from 'lucide-react';
import { useCatalog, CatalogItem, PricingTier, SizeOption, SIZES, ProductoExpress, LazaroOrder } from '../constants';

export function AdminPasteleria() {
  const [currentRole, setCurrentRole] = useState<'admin' | 'client' | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'dashboard' | 'catalog' | 'express'>('orders');

  const [banco, setBanco] = useState('');
  const [titular, setTitular] = useState('');
  const [clabe, setClabe] = useState('');

  const { panes, rellenos, extras, decoraciones, tiers, expressProducts, expressCategories, saveCatalog } = useCatalog();

  useEffect(() => {
    const savedRole = localStorage.getItem('lazaro_admin_role');
    if (savedRole === 'admin' || savedRole === 'client') {
      setCurrentRole(savedRole as 'admin' | 'client');
    }

    const savedDatos = localStorage.getItem('lazaro_datos_bancarios');
    if (savedDatos) {
      try {
        const parsed = JSON.parse(savedDatos);
        setBanco(parsed.banco || '');
        setTitular(parsed.titular || '');
        setClabe(parsed.clabe || '');
      } catch (e) {}
    }
  }, []);

  const handleSaveBank = () => {
    localStorage.setItem('lazaro_datos_bancarios', JSON.stringify({ banco, titular, clabe }));
    alert('Datos bancarios guardados exitosamente.');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    
    if (password === '1212') {
      setCurrentRole('admin');
      localStorage.setItem('lazaro_admin_role', 'admin');
    } else if (password === 'pastel') {
      setCurrentRole('client');
      localStorage.setItem('lazaro_admin_role', 'client');
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setPassword('');
    setActiveTab('orders');
    localStorage.removeItem('lazaro_admin_role');
  };

  if (currentRole === null) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-stone-900">
        <title>Acceso Admin | Lázaro</title>
        <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-stone-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-200 via-amber-200 to-stone-200 opacity-50"></div>
          
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
            <Lock size={28} strokeWidth={1.5} />
          </div>
          
          <h1 className="text-2xl font-serif text-stone-800 mb-2">Acceso Administrativo</h1>
          <p className="text-sm font-light text-stone-500 mb-8">- Lázaro Pastelería -</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Contraseña"
                className={`w-full bg-stone-50 px-4 py-3 rounded-xl text-center font-medium tracking-widest text-sm outline-none border transition-all ${
                  error ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-amber-300 focus:bg-white'
                }`}
                autoFocus
              />
              {error && <p className="text-xs text-red-500 mt-2 font-light tracking-wide">Contraseña incorrecta. Inténtalo de nuevo.</p>}
            </div>
            
            <button 
              type="submit"
              className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-medium tracking-widest text-xs uppercase hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10"
            >
              Ingresar
            </button>
          </form>
          
          <div className="mt-8">
            <a href="/#/lazaro-pasteleria" className="text-stone-400 hover:text-stone-700 text-xs tracking-widest uppercase flex items-center justify-center gap-1">
              <ArrowLeft size={12} /> Volver al Menú
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 pb-20">
      <title>Panel {currentRole === 'admin' ? 'Administrador' : 'Cliente'} | Lázaro</title>

      <header className="px-6 py-6 border-b border-stone-200 bg-white sticky top-0 z-30 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-serif text-stone-800">Lázaro Pastelería</h1>
          <p className="text-xs text-stone-400 font-medium tracking-widest uppercase">
            {currentRole === 'admin' ? 'Suite Principal' : 'Gestión de Pedidos'}
          </p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Cerrar Sesión"
        >
          <LogOut size={20} />
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="flex space-x-4 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 text-sm font-bold tracking-wide transition-colors ${activeTab === 'orders' ? 'border-b-2 border-stone-800 text-stone-800' : 'text-stone-400 hover:text-stone-600 border-b-2 border-transparent'}`}
          >
            📋 Pedidos & Ventas
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-3 text-sm font-bold tracking-wide transition-colors ${activeTab === 'dashboard' ? 'border-b-2 border-stone-800 text-stone-800' : 'text-stone-400 hover:text-stone-600 border-b-2 border-transparent'}`}
          >
            ⚙️ Configuración
          </button>
          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-3 text-sm font-bold tracking-wide transition-colors ${activeTab === 'catalog' ? 'border-b-2 border-amber-500 text-amber-600' : 'text-stone-400 hover:text-stone-600 border-b-2 border-transparent'}`}
              >
                🎂 Catálogo
              </button>
              <button
                onClick={() => setActiveTab('express')}
                className={`px-4 py-3 text-sm font-bold tracking-wide transition-colors ${activeTab === 'express' ? 'border-b-2 border-amber-500 text-amber-600' : 'text-stone-400 hover:text-stone-600 border-b-2 border-transparent'}`}
              >
                🛍️ Express
              </button>
            </>
          )}
        </div>
      </div>

      <main className="max-w-5xl mx-auto p-6 mt-2">
        {activeTab === 'orders' ? (
          <OrdersManager />
        ) : activeTab === 'dashboard' ? (
          <>
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-stone-100 overflow-hidden">
              <div className="p-6 border-b border-stone-100">
                <h2 className="text-lg font-serif text-stone-800 flex items-center gap-2">
                  <Landmark size={20} className="text-amber-500" /> Datos Bancarios (Transferencia)
                </h2>
                <p className="text-sm text-stone-500 mt-1 font-light">
                  Estos datos serán visibles para los clientes que elijan pagar por transferencia SPEI.
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-widest">Banco</label>
                  <input type="text" value={banco} onChange={e => setBanco(e.target.value)} className="w-full text-sm px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white" placeholder="Ej. BBVA, Banorte" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-widest">Titular de la cuenta</label>
                  <input type="text" value={titular} onChange={e => setTitular(e.target.value)} className="w-full text-sm px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white" placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-widest">CLABE / Número de Tarjeta</label>
                  <input type="text" value={clabe} onChange={e => setClabe(e.target.value)} className="w-full text-sm px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white" placeholder="18 dígitos" />
                </div>
                <div className="pt-2">
                  <button onClick={handleSaveBank} className="bg-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20">
                    Guardar Datos Bancarios
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'catalog' ? (
          <CatalogManager 
            panes={panes}
            rellenos={rellenos}
            extras={extras}
            decoraciones={decoraciones}
            tiers={tiers}
            onSave={(p, r, e, d, t) => saveCatalog(p, r, e, d, t, expressProducts, expressCategories)}
          />
        ) : (
          <ExpressManager
            categories={expressCategories}
            products={expressProducts}
            onSave={(newCats, newExpress) => saveCatalog(panes, rellenos, extras, decoraciones, tiers, newExpress, newCats)}
          />
        )}
      </main>
    </div>
  );
}

function OrdersManager() {
  const [orders, setOrders] = useState<LazaroOrder[]>([]);
  const [filter, setFilter] = useState<'PENDIENTE' | 'ENTREGADO'>('PENDIENTE');
  const [search, setSearch] = useState('');
  
  const { panes, rellenos, extras, decoraciones } = useCatalog();

  useEffect(() => {
    const raw = localStorage.getItem('lazaro_pedidos');
    if (raw) {
      try {
        setOrders(JSON.parse(raw));
      } catch (e) {}
    }
  }, []);

  const handleStatusChange = (id: string, newStatus: 'PENDIENTE' | 'ENTREGADO') => {
    const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem('lazaro_pedidos', JSON.stringify(updated));
  };

  const handleUpdateNotas = (id: string, notas: string) => {
    const updated = orders.map(o => o.id === id ? { ...o, notasInternas: notas } : o);
    setOrders(updated);
    localStorage.setItem('lazaro_pedidos', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    if(confirm('¿Seguro que deseas eliminar este pedido?')) {
      const updated = orders.filter(o => o.id !== id);
      setOrders(updated);
      localStorage.setItem('lazaro_pedidos', JSON.stringify(updated));
    }
  };

  const filtered = orders.filter(o => {
    if (o.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return o.customerName.toLowerCase().includes(s) || o.customerPhone.includes(s);
    }
    return true;
  });

  const pendientesCount = orders.filter(o => o.status === 'PENDIENTE').length;
  const entregadosCount = orders.filter(o => o.status === 'ENTREGADO').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-stone-100 gap-4">
        <div className="flex gap-4">
          <div className="text-center px-4 py-2 bg-amber-50 rounded-lg">
            <span className="block text-2xl font-bold text-amber-600">{pendientesCount}</span>
            <span className="text-xs text-amber-800 uppercase tracking-wider">Pendientes</span>
          </div>
          <div className="text-center px-4 py-2 bg-stone-50 rounded-lg">
            <span className="block text-2xl font-bold text-stone-600">{entregadosCount}</span>
            <span className="text-xs text-stone-500 uppercase tracking-wider">Entregados</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o teléfono..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button 
          onClick={() => setFilter('PENDIENTE')}
          className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-colors ${filter === 'PENDIENTE' ? 'bg-amber-100 text-amber-800' : 'bg-white text-stone-500 hover:bg-stone-50 shadow-sm border border-stone-100'}`}
        >
          ⏳ Pendientes
        </button>
        <button 
          onClick={() => setFilter('ENTREGADO')}
          className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-colors ${filter === 'ENTREGADO' ? 'bg-stone-200 text-stone-800' : 'bg-white text-stone-500 hover:bg-stone-50 shadow-sm border border-stone-100'}`}
        >
          ✅ Entregados
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(order => (
          <div key={order.id} className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-stone-100 flex flex-col relative overflow-hidden transition-all hover:shadow-[0_4px_25px_rgb(0,0,0,0.08)]">
            {order.status === 'PENDIENTE' && <div className="absolute top-0 left-0 w-full h-1 bg-amber-400" />}
            {order.status === 'ENTREGADO' && <div className="absolute top-0 left-0 w-full h-1 bg-green-400" />}
            
            <div className="flex justify-between items-start mb-4 border-b border-stone-100 pb-4">
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">ID: {order.id.slice(0, 8)}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => handleDelete(order.id)} className="text-stone-300 hover:text-red-500 transition-colors p-1 bg-stone-50 rounded-md hover:bg-red-50">
                <X size={16} />
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-serif font-bold text-stone-800 leading-tight">{order.customerName}</h3>
              <p className="text-sm text-stone-500 flex items-center gap-1 mt-1 font-medium"><Phone size={14} className="text-amber-500"/> {order.customerPhone}</p>
            </div>

            <div className="bg-stone-50 rounded-xl p-3 mb-4 text-sm border border-stone-100">
              <div className="flex items-center gap-2 text-stone-700 font-bold mb-1">
                <Calendar size={14} className="text-amber-500" />
                {order.deliveryDate} a las {order.deliveryTime}
              </div>
              <p className="text-stone-500 ml-6 text-xs">{order.deliveryType === 'tienda' ? 'Recoger en Tienda' : order.deliveryAddress}</p>
              {order.specialNotes && (
                <div className="mt-3 p-2 bg-amber-50/50 border border-amber-100/50 rounded-lg text-amber-800 text-xs italic">
                  <span className="font-bold mr-1">Notas:</span> {order.specialNotes}
                </div>
              )}
            </div>

            <div className="mb-4 flex-1">
              <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Detalle del Pedido</h4>
              <ul className="space-y-3">
                {order.items.map((item, i) => (
                  <li key={i} className="text-sm text-stone-600 flex gap-2">
                    <span className="font-bold text-stone-800">{item.quantity}x</span>
                    {item.type === 'express' ? (
                      <span className="font-medium text-stone-700">{item.name}</span>
                    ) : (
                      <div className="flex-1">
                        <strong className="text-stone-800 block">Pastel ({item.size})</strong>
                        <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                          {panes.find(p => p.id === item.pan)?.name || item.pan} | {rellenos.find(r => r.id === item.relleno)?.name || item.relleno}
                          {item.extras && item.extras.length > 0 && ` | +${item.extras.map(eId => extras.find(e => e.id === eId)?.name || eId).join(', ')}`}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Notas Internas (Staff)</h4>
              <textarea 
                defaultValue={order.notasInternas || ''}
                onBlur={(e) => handleUpdateNotas(order.id, e.target.value)}
                placeholder="Añade recordatorios, anticipos, notas..."
                className="w-full h-20 bg-stone-50 border border-stone-100 rounded-xl p-3 text-xs text-stone-700 resize-none focus:outline-none focus:border-amber-300 focus:bg-white transition-all"
              />
            </div>

            <div className="flex justify-between items-end border-t border-stone-100 pt-4 mt-auto">
              <div>
                <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest ${order.paymentMethod === 'efectivo' ? 'bg-green-100 text-green-700' : order.paymentMethod === 'tarjeta' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {order.paymentMethod}
                </span>
                <p className="text-xl font-bold text-stone-800 mt-2">${order.totalAmount.toFixed(2)}</p>
              </div>
              
              <select 
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                className={`text-xs font-bold px-3 py-2 rounded-lg border outline-none cursor-pointer transition-colors ${
                  order.status === 'PENDIENTE' 
                    ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' 
                    : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="ENTREGADO">ENTREGADO</option>
              </select>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <Package size={48} className="mx-auto text-stone-200 mb-4" />
            <p className="text-stone-400 font-medium">No hay pedidos {filter.toLowerCase()}s para mostrar.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// CATALOG MANAGER COMPONENTS
// ----------------------------------------------------------------------

interface CatalogManagerProps {
  panes: CatalogItem[];
  rellenos: CatalogItem[];
  extras: CatalogItem[];
  decoraciones: CatalogItem[];
  tiers: PricingTier[];
  onSave: (p: CatalogItem[], r: CatalogItem[], e: CatalogItem[], d: CatalogItem[], t: PricingTier[]) => void;
}

function CatalogManager({ panes, rellenos, extras, decoraciones, tiers, onSave }: CatalogManagerProps) {
  const [localPanes, setLocalPanes] = useState(panes);
  const [localRellenos, setLocalRellenos] = useState(rellenos);
  const [localExtras, setLocalExtras] = useState(extras);
  const [localDecoraciones, setLocalDecoraciones] = useState(decoraciones);
  const [localTiers, setLocalTiers] = useState(tiers);
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'items'>('matrix');

  const handleSaveAll = () => {
    onSave(localPanes, localRellenos, localExtras, localDecoraciones, localTiers);
    alert('Catálogo actualizado exitosamente.');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-2xl shadow-sm border border-stone-100 gap-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveSubTab('matrix')} 
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeSubTab === 'matrix' ? 'bg-amber-100 text-amber-700' : 'text-stone-500 hover:bg-stone-50'}`}
          >
            Matriz de Precios
          </button>
          <button 
            onClick={() => setActiveSubTab('items')} 
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeSubTab === 'items' ? 'bg-amber-100 text-amber-700' : 'text-stone-500 hover:bg-stone-50'}`}
          >
            Ingredientes y Categorías
          </button>
        </div>
        <button
          onClick={handleSaveAll}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Check size={16} /> Guardar Todo
        </button>
      </div>

      {activeSubTab === 'matrix' ? (
        <MatrixManager tiers={localTiers} setTiers={setLocalTiers} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CatalogSection 
            title="Panes" 
            items={localPanes} 
            setItems={setLocalPanes} 
            tiers={localTiers.filter(t => t.type === 'pan')}
          />
          <CatalogSection 
            title="Rellenos" 
            items={localRellenos} 
            setItems={setLocalRellenos} 
            tiers={localTiers.filter(t => t.type === 'relleno')}
          />
          <CatalogSection 
            title="Extras" 
            items={localExtras} 
            setItems={setLocalExtras} 
            tiers={localTiers.filter(t => t.type === 'extra')}
          />
          <CatalogSection 
            title="Decoraciones" 
            items={localDecoraciones} 
            setItems={setLocalDecoraciones} 
            tiers={localTiers.filter(t => t.type === 'decoracion')}
          />
        </div>
      )}
    </div>
  );
}

function MatrixManager({ tiers, setTiers }: { tiers: PricingTier[], setTiers: React.Dispatch<React.SetStateAction<PricingTier[]>> }) {
  const handlePriceChange = (tierId: string, size: SizeOption | 'fixed', value: string) => {
    const num = Number(value) || 0;
    setTiers(prev => prev.map(t => {
      if (t.id !== tierId) return t;
      
      if (size === 'fixed') {
        return { ...t, prices: num };
      } else {
        if (typeof t.prices === 'number') return t;
        return { ...t, prices: { ...t.prices, [size]: num } };
      }
    }));
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-stone-100 overflow-hidden">
      <div className="p-6 border-b border-stone-100">
        <h3 className="font-serif text-lg text-stone-800">Matriz de Precios por Porciones</h3>
        <p className="text-sm text-stone-500 mt-1 font-light">Actualiza los costos base para cada categoría según el tamaño del pastel.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/50 text-stone-500 text-xs uppercase tracking-widest border-b border-stone-100">
              <th className="p-4 font-medium min-w-[200px]">Categoría</th>
              {SIZES.map(s => <th key={s} className="p-4 font-medium text-center min-w-[100px]">{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, index) => (
              <tr key={tier.id} className={`border-b border-stone-50 hover:bg-stone-50/50 transition-colors ${index === tiers.length - 1 ? 'border-none' : ''}`}>
                <td className="p-4">
                  <span className="font-medium text-stone-800 text-sm">{tier.name}</span>
                  <span className="block text-xs text-stone-400 uppercase tracking-widest mt-1">{tier.type}</span>
                </td>
                {typeof tier.prices === 'number' ? (
                  <td colSpan={SIZES.length} className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 bg-stone-50 rounded-lg p-2 max-w-[200px] mx-auto border border-stone-100">
                      <span className="text-stone-400 font-medium">$</span>
                      <input 
                        type="number" 
                        value={tier.prices}
                        onChange={(e) => handlePriceChange(tier.id, 'fixed', e.target.value)}
                        className="w-full bg-transparent outline-none text-stone-800 font-medium text-center"
                      />
                      <span className="text-xs text-stone-400 uppercase">Fijo</span>
                    </div>
                  </td>
                ) : (
                  SIZES.map(size => (
                    <td key={size} className="p-4">
                      <div className="flex items-center justify-center gap-1 bg-white rounded-lg p-2 border border-stone-200 focus-within:border-amber-400 transition-colors">
                        <span className="text-stone-400 font-medium text-sm">$</span>
                        <input 
                          type="number" 
                          value={tier.prices[size as SizeOption]}
                          onChange={(e) => handlePriceChange(tier.id, size as SizeOption, e.target.value)}
                          className="w-full bg-transparent outline-none text-stone-800 text-sm text-center font-medium"
                        />
                      </div>
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface CatalogSectionProps {
  title: string;
  items: CatalogItem[];
  setItems: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
  tiers: PricingTier[];
}

function CatalogSection({ title, items, setItems, tiers }: CatalogSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCat, setEditCat] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState(tiers[0]?.id || '');

  const startEdit = (item: CatalogItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditCat(item.category || tiers[0]?.id);
  };

  const saveEdit = () => {
    setItems(prev => prev.map(item => 
      item.id === editingId ? { ...item, name: editName, category: editCat } : item
    ));
    setEditingId(null);
  };

  const saveNew = () => {
    if (newName.trim() === '') return;
    const newItem: CatalogItem = {
      id: newName.toLowerCase().replace(/\s+/g, '-'),
      name: newName,
      category: newCat
    };
    setItems(prev => [...prev, newItem]);
    setIsAdding(false);
    setNewName('');
    setNewCat(tiers[0]?.id || '');
  };

  const removeItem = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este elemento?')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-stone-100 overflow-hidden flex flex-col h-[600px]">
      <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
        <h3 className="font-serif text-lg text-stone-800">{title}</h3>
        <span className="bg-white text-stone-500 text-xs px-2.5 py-1 rounded-full border border-stone-200 font-medium">
          {items.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map(item => (
          <div key={item.id} className="p-4 rounded-xl border border-stone-100 bg-white shadow-sm group hover:border-amber-200 transition-colors">
            {editingId === item.id ? (
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)} 
                  className="w-full text-sm px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400"
                />
                <select 
                  value={editCat} 
                  onChange={e => setEditCat(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white"
                >
                  {tiers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <div className="flex gap-2 pt-1">
                  <button onClick={saveEdit} className="flex-1 bg-stone-800 text-white py-1.5 rounded-lg text-xs font-medium hover:bg-stone-700">Guardar</button>
                  <button onClick={() => setEditingId(null)} className="flex-1 bg-stone-100 text-stone-600 py-1.5 rounded-lg text-xs font-medium hover:bg-stone-200">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-medium text-sm text-stone-800">{item.name}</p>
                  <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest mt-1">
                    {tiers.find(t => t.id === item.category)?.name || 'Sin Categoría'}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0">
                  <button onClick={() => startEdit(item)} className="p-1.5 text-stone-400 hover:text-amber-600 bg-stone-50 hover:bg-amber-50 rounded-md">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => removeItem(item.id)} className="p-1.5 text-stone-400 hover:text-red-600 bg-stone-50 hover:bg-red-50 rounded-md">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isAdding && (
          <div className="p-4 rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/30 space-y-3">
            <input 
              type="text" 
              placeholder="Nombre del ingrediente"
              value={newName} 
              onChange={e => setNewName(e.target.value)} 
              className="w-full text-sm px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400"
            />
            <select 
              value={newCat} 
              onChange={e => setNewCat(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white"
            >
              {tiers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <div className="flex gap-2 pt-1">
              <button onClick={saveNew} className="flex-1 bg-amber-500 text-white py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-amber-600">Añadir</button>
              <button onClick={() => setIsAdding(false)} className="px-3 bg-stone-100 text-stone-600 py-1.5 rounded-lg hover:bg-stone-200">
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-stone-100 bg-stone-50/50">
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-stone-500 text-sm font-medium hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/50 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Agregar {title.slice(0, -1)}
          </button>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// EXPRESS MANAGER COMPONENTS
// ----------------------------------------------------------------------

interface ExpressManagerProps {
  categories: string[];
  products: ProductoExpress[];
  onSave: (cats: string[], p: ProductoExpress[]) => void;
}

function ExpressManager({ categories, products, onSave }: ExpressManagerProps) {
  const [localCategories, setLocalCategories] = useState(categories);
  const [localProducts, setLocalProducts] = useState(products);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [etiqueta, setEtiqueta] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatName, setEditingCatName] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImg: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setNombre('');
    setCategoria('');
    setPrecio('');
    setImg1('');
    setImg2('');
    setEtiqueta('');
    setDescripcion('');
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (p: ProductoExpress) => {
    setEditingId(p.id);
    setNombre(p.nombre);
    setCategoria(p.categoria);
    setPrecio(p.precio.toString());
    setImg1(p.imagenes[0] || '');
    setImg2(p.imagenes[1] || '');
    setEtiqueta(p.etiqueta || '');
    setDescripcion(p.descripcion);
    setIsAdding(true);
  };

  const handleSaveProduct = () => {
    if (!nombre.trim() || !categoria.trim() || !precio || !img1) {
      alert('Nombre, Categoría, Precio y al menos una imagen son obligatorios.');
      return;
    }
    
    const newProd: ProductoExpress = {
      id: editingId || crypto.randomUUID(),
      nombre,
      categoria,
      precio: Number(precio),
      imagenes: [img1, img2].filter(Boolean),
      etiqueta: etiqueta || undefined,
      descripcion
    };

    let newProds;
    if (editingId) {
      newProds = localProducts.map(p => p.id === editingId ? newProd : p);
    } else {
      newProds = [...localProducts, newProd];
    }
    
    setLocalProducts(newProds);
    onSave(localCategories, newProds);
    resetForm();
    alert('Inventario actualizado exitosamente.');
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      const newProds = localProducts.filter(p => p.id !== id);
      setLocalProducts(newProds);
      onSave(localCategories, newProds);
    }
  };

  const handleSaveCategory = () => {
    if (!newCatName.trim()) return;
    
    if (editingCatName) {
      if (newCatName.trim() === editingCatName) {
        setEditingCatName(null);
        setNewCatName('');
        return;
      }
      if (localCategories.includes(newCatName.trim())) {
        alert('Esta categoría ya existe.');
        return;
      }

      const newCats = localCategories.map(c => c === editingCatName ? newCatName.trim() : c);
      setLocalCategories(newCats);
      
      const updatedProducts = localProducts.map(p => 
        p.categoria === editingCatName ? { ...p, categoria: newCatName.trim() } : p
      );
      setLocalProducts(updatedProducts);
      
      onSave(newCats, updatedProducts);
      setEditingCatName(null);
      setNewCatName('');
    } else {
      if (localCategories.includes(newCatName.trim())) {
        alert('Esta categoría ya existe.');
        return;
      }
      const newCats = [...localCategories, newCatName.trim()];
      setLocalCategories(newCats);
      onSave(newCats, localProducts);
      setNewCatName('');
    }
  };

  const handleEditCategory = (cat: string) => {
    setEditingCatName(cat);
    setNewCatName(cat);
  };

  const handleDeleteCategory = (cat: string) => {
    if (confirm(`¿Estás seguro de eliminar la categoría "${cat}"?`)) {
      const newCats = localCategories.filter(c => c !== cat);
      setLocalCategories(newCats);
      onSave(newCats, localProducts);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Módulo de Gestión de Categorías */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-stone-100 overflow-hidden p-6 mb-8">
        <h3 className="font-serif text-lg text-stone-800">Administrar Pestañas / Categorías</h3>
        <p className="text-sm text-stone-500 font-light mt-1 mb-4">Crea categorías aquí para organizar tus productos. Cada una será una pestaña nueva para tus clientes.</p>
        
        <div className="flex gap-2 mb-6">
          <input 
            type="text"
            placeholder="Nueva categoría (ej. Postres Fríos)"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            className="flex-1 text-sm px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400"
          />
          <button 
            onClick={handleSaveCategory}
            className={`${editingCatName ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'} text-white px-5 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-colors shadow-md flex items-center gap-2`}
          >
            {editingCatName ? <><Edit2 size={16} /> Actualizar</> : <><Plus size={16} /> Crear</>}
          </button>
          {editingCatName && (
             <button 
               onClick={() => { setEditingCatName(null); setNewCatName(''); }}
               className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-5 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-colors"
             >
               Cancelar
             </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {localCategories.map(cat => (
            <div key={cat} className="flex items-center gap-1 bg-stone-50 border border-stone-200 text-stone-600 px-3 py-1.5 rounded-full text-sm">
              <span>{cat}</span>
              <button 
                onClick={() => handleEditCategory(cat)}
                className="text-stone-400 hover:text-blue-500 p-0.5 rounded-full transition-colors ml-1"
                title="Editar categoría"
              >
                <Edit2 size={12} />
              </button>
              <button 
                onClick={() => handleDeleteCategory(cat)}
                className="text-stone-400 hover:text-red-500 p-0.5 rounded-full transition-colors"
                title="Eliminar categoría"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {localCategories.length === 0 && (
            <p className="text-sm text-stone-400 italic">No hay categorías. Crea una arriba.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-stone-100 overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
          <div>
            <h3 className="font-serif text-lg text-stone-800">Inventario Express y Catálogo Directo</h3>
            <p className="text-sm text-stone-500 font-light mt-1">Añade productos de venta directa. Las categorías que uses aquí se convertirán en pestañas en la vista del cliente.</p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-colors shadow-md shadow-stone-900/10 flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Nuevo Producto
            </button>
          )}
        </div>

        {isAdding && (
          <div className="p-6 border-b border-stone-100 bg-stone-50/50">
            <h4 className="font-medium text-stone-800 mb-4">{editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-widest">Nombre del Artículo</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full text-sm px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white" placeholder="Ej. Cupcakes de Vainilla" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Categoría *</label>
                <select 
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                  className="w-full text-sm px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 bg-white"
                >
                  <option value="" disabled>Selecciona una categoría</option>
                  {localCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-widest">Precio de Venta ($)</label>
                <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} className="w-full text-sm px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white" placeholder="450" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-widest">Etiqueta / Tag (Opcional)</label>
                <select value={etiqueta} onChange={e => setEtiqueta(e.target.value)} className="w-full text-sm px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white">
                  <option value="">Sin Etiqueta</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Oferta">Oferta</option>
                  <option value="Novedad">Novedad</option>
                  <option value="Agotado">Agotado</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-widest">Descripción</label>
                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full text-sm px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white" rows={2}></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-widest">Imagen 1 (Principal)</label>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setImg1)} className="w-full text-sm px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white" />
                {img1 && <img src={img1} alt="Preview 1" className="mt-2 h-16 w-16 object-cover rounded-md border border-stone-200 shadow-sm" />}
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-widest">Imagen 2 (Hover/Opcional)</label>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setImg2)} className="w-full text-sm px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white" />
                {img2 && <img src={img2} alt="Preview 2" className="mt-2 h-16 w-16 object-cover rounded-md border border-stone-200 shadow-sm" />}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveProduct} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg text-sm font-bold uppercase transition-colors"><Check size={16} className="inline mr-1" /> Guardar Producto</button>
              <button onClick={resetForm} className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 text-stone-500 text-xs uppercase tracking-widest border-b border-stone-100">
                <th className="p-4 font-medium min-w-[250px]">Producto</th>
                <th className="p-4 font-medium min-w-[150px]">Categoría</th>
                <th className="p-4 font-medium">Precio</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {localProducts.map((p, index) => (
                <tr key={p.id} className={`border-b border-stone-50 hover:bg-stone-50/50 transition-colors ${index === localProducts.length - 1 ? 'border-none' : ''}`}>
                  <td className="p-4 flex items-center gap-3">
                    {p.imagenes[0] && <img src={p.imagenes[0]} alt={p.nombre} className="w-10 h-10 rounded-md object-cover border border-stone-200" />}
                    <div>
                      <span className="font-medium text-stone-800 text-sm block">{p.nombre}</span>
                      {p.etiqueta && <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-sm font-medium mt-1 inline-block">{p.etiqueta}</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">{p.categoria}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-stone-800">${p.precio.toFixed(2)}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => startEdit(p)} className="p-1.5 text-stone-400 hover:text-amber-600 bg-white hover:bg-amber-50 rounded-md border border-stone-200 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-stone-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-md border border-stone-200 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {localProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-stone-400 text-sm">
                    No hay productos en el inventario.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
