import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, LogOut, Settings, Package, Banknote, Edit2, Plus, Check, Trash2, X } from 'lucide-react';
import { useCatalog, CatalogItem, PanOption, RellenoOption, ExtraOption } from '../constants';

export function AdminPasteleria() {
  const [currentRole, setCurrentRole] = useState<'admin' | 'client' | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalog'>('dashboard');

  const { panes, rellenos, extras, saveCatalog } = useCatalog();

  useEffect(() => {
    const savedRole = localStorage.getItem('lazaro_admin_role');
    if (savedRole === 'admin' || savedRole === 'client') {
      setCurrentRole(savedRole as 'admin' | 'client');
    }
  }, []);

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
    setActiveTab('dashboard');
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

      {currentRole === 'admin' && (
        <div className="max-w-5xl mx-auto px-6 mt-6">
          <div className="flex space-x-4 border-b border-stone-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 text-sm font-bold tracking-wide transition-colors ${activeTab === 'dashboard' ? 'border-b-2 border-stone-800 text-stone-800' : 'text-stone-400 hover:text-stone-600 border-b-2 border-transparent'}`}
            >
              📊 Dashboard / Inicio
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-3 text-sm font-bold tracking-wide transition-colors ${activeTab === 'catalog' ? 'border-b-2 border-amber-500 text-amber-600' : 'text-stone-400 hover:text-stone-600 border-b-2 border-transparent'}`}
            >
              🎂 Modificar Catálogo
            </button>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto p-6 mt-2">
        {activeTab === 'dashboard' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-stone-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Pedidos Hoy</p>
                  <p className="text-2xl font-serif text-stone-800">12</p>
                </div>
              </div>
              
              {currentRole === 'admin' && (
                <>
                  <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-stone-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                      <Banknote size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Ingresos Brutos</p>
                      <p className="text-2xl font-serif text-stone-800">$6,600</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-stone-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center">
                      <Settings size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Catálogo</p>
                      <p className="text-2xl font-serif text-stone-800">{panes.length + rellenos.length + extras.length} items</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-stone-100 overflow-hidden">
              <div className="p-6 border-b border-stone-100">
                <h2 className="text-lg font-serif text-stone-800">Órdenes Recientes</h2>
              </div>
              <div className="p-6 text-center text-stone-400 font-light py-12">
                No hay órdenes registradas todavía en esta sesión.
                <br />
                <span className="text-xs mt-2 inline-block bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
                  Panel en modo simulación
                </span>
              </div>
            </div>
          </>
        ) : (
          <CatalogManager 
            panes={panes} 
            rellenos={rellenos} 
            extras={extras} 
            onSave={(p, r, e) => saveCatalog(p, r, e)} 
          />
        )}
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// CATALOG MANAGER COMPONENTS
// ----------------------------------------------------------------------

interface CatalogManagerProps {
  panes: PanOption[];
  rellenos: RellenoOption[];
  extras: ExtraOption[];
  onSave: (p: PanOption[], r: RellenoOption[], e: ExtraOption[]) => void;
}

function CatalogManager({ panes, rellenos, extras, onSave }: CatalogManagerProps) {
  const [localPanes, setLocalPanes] = useState(panes);
  const [localRellenos, setLocalRellenos] = useState(rellenos);
  const [localExtras, setLocalExtras] = useState(extras);

  const handleSaveAll = () => {
    onSave(localPanes, localRellenos, localExtras);
    alert('Catálogo actualizado exitosamente.');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
        <p className="text-sm text-stone-500 ml-2">Los cambios se verán reflejados en el menú interactivo.</p>
        <button
          onClick={handleSaveAll}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <Check size={16} /> Guardar Todo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CatalogSection 
          title="Panes" 
          items={localPanes} 
          setItems={setLocalPanes as React.Dispatch<React.SetStateAction<CatalogItem[]>>} 
        />
        <CatalogSection 
          title="Rellenos" 
          items={localRellenos} 
          setItems={setLocalRellenos as React.Dispatch<React.SetStateAction<CatalogItem[]>>} 
        />
        <CatalogSection 
          title="Extras" 
          items={localExtras} 
          setItems={setLocalExtras as React.Dispatch<React.SetStateAction<CatalogItem[]>>} 
        />
      </div>
    </div>
  );
}

interface CatalogSectionProps {
  title: string;
  items: CatalogItem[];
  setItems: React.Dispatch<React.SetStateAction<CatalogItem[]>>;
}

function CatalogSection({ title, items, setItems }: CatalogSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(0);

  const startEdit = (item: CatalogItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price);
  };

  const saveEdit = () => {
    setItems(prev => prev.map(item => 
      item.id === editingId ? { ...item, name: editName, price: editPrice } : item
    ));
    setEditingId(null);
  };

  const saveNew = () => {
    if (newName.trim() === '') return;
    const newItem: CatalogItem = {
      id: newName.toLowerCase().replace(/\s+/g, '-'),
      name: newName,
      price: newPrice
    };
    setItems(prev => [...prev, newItem]);
    setIsAdding(false);
    setNewName('');
    setNewPrice(0);
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
                <div className="flex items-center gap-2">
                  <span className="text-stone-400 font-medium">$</span>
                  <input 
                    type="number" 
                    value={editPrice} 
                    onChange={e => setEditPrice(Number(e.target.value))} 
                    className="w-full text-sm px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={saveEdit} className="flex-1 bg-stone-800 text-white py-1.5 rounded-lg text-xs font-medium hover:bg-stone-700">Guardar</button>
                  <button onClick={() => setEditingId(null)} className="flex-1 bg-stone-100 text-stone-600 py-1.5 rounded-lg text-xs font-medium hover:bg-stone-200">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm text-stone-800">{item.name}</p>
                  <p className="text-xs text-amber-600 font-medium mt-0.5">
                    {item.price > 0 ? `+ $${item.price.toFixed(2)}` : 'Sin costo extra'}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
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
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-medium">$</span>
              <input 
                type="number" 
                placeholder="Precio extra"
                value={newPrice || ''} 
                onChange={e => setNewPrice(Number(e.target.value))} 
                className="w-full text-sm px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400"
              />
            </div>
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
