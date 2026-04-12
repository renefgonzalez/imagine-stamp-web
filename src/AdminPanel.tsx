import { useState, useEffect } from 'react';
import { Lock, Package, TrendingUp, DollarSign, Trash2, Edit2, Plus, LogOut, Settings, List } from 'lucide-react';

// Contraseña maestra para demostración (en producción usaría un backend)
const MASTER_PASSWORD = 'admin';

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('imagine_stamp_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('imagine_stamp_categories');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('imagine_stamp_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('imagine_stamp_categories', JSON.stringify(categories));
  }, [categories]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-md">
          <Lock className="text-blue-600 mx-auto mb-4" size={48} />
          <h2 className="text-white text-center text-xl font-bold mb-6">ACCESO RESTRINGIDO - INGRESA LA CONTRASEÑA MAESTRA</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 mb-4"
            placeholder="Contraseña"
          />
          <button
            onClick={() => password === MASTER_PASSWORD && setIsAuthenticated(true)}
            className="w-full bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition"
          >
            ENTRAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">Dashboard Imagine & Stamp</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              <Package size={18} />
              PRODUCTOS
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${activeTab === 'categories' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              <List size={18} />
              CATEGORÍAS
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              CERRAR SESIÓN
            </button>
          </div>
        </div>
        
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Inventario', value: products.length, icon: Package, color: 'text-blue-400' },
            { title: 'Ventas', value: '0', icon: TrendingUp, color: 'text-green-400' },
            { title: 'Ingresos (MXN)', value: '$0', icon: DollarSign, color: 'text-orange-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={stat.color} size={32} />
            </div>
          ))}
        </div>

        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inventario */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Gestión de Inventario</h2>
              <div className="space-y-4">
                {products.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
                    <img src={p.image} alt={p.name} className="w-16 h-16 rounded object-cover" />
                    <div className="flex-1">
                      <p className="font-bold">{p.name}</p>
                      <p className="text-sm text-gray-400">${p.price} • {p.category}</p>
                    </div>
                    <button className="text-blue-400"><Edit2 size={18} /></button>
                    <button onClick={() => setProducts(products.filter((item: any) => item.id !== p.id))} className="text-red-400"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Añadir Nuevo Diseño</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newProduct = {
                  id: Date.now(),
                  name: formData.get('name'),
                  price: formData.get('price'),
                  image: formData.get('image'),
                  category: formData.get('category'),
                  description: formData.get('description'),
                };
                setProducts([...products, newProduct]);
                e.currentTarget.reset();
              }} className="space-y-4">
                <input name="name" placeholder="Nombre" className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700" required />
                <textarea name="description" placeholder="Descripción" className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700" rows={2} />
                <input name="price" type="number" placeholder="Precio" className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700" required />
                <select name="category" className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700">
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                  {categories.length === 0 && (
                    <>
                      <option>Invitaciones Digitales</option>
                      <option>Fiestas Infantiles</option>
                      <option>Social & Eventos</option>
                      <option>Boutique Corporativa</option>
                    </>
                  )}
                </select>
                <input name="image" placeholder="URL de imagen" className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700" required />
                <button type="submit" className="w-full bg-orange-500 text-white p-4 rounded-lg font-bold hover:bg-orange-600 transition">
                  PUBLICAR PRODUCTO
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lista de Categorías */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Categorías Actuales</h2>
              <div className="space-y-4">
                {categories.map((cat: any) => (
                  <div key={cat.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-blue-400">{cat.name}</h3>
                      <button 
                        onClick={() => setCategories(categories.filter((c: any) => c.id !== cat.id))}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.submenus.map((sub: string, idx: number) => (
                        <span key={idx} className="bg-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                          {sub}
                          <button 
                            onClick={() => {
                              const newCats = [...categories];
                              const targetCat = newCats.find(c => c.id === cat.id);
                              targetCat.submenus = targetCat.submenus.filter((s: string) => s !== sub);
                              setCategories(newCats);
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-gray-500 text-center py-4 italic">No hay categorías personalizadas. Se usan las predeterminadas.</p>
                )}
              </div>
            </div>

            {/* Añadir Categoría */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Nueva Categoría / Subcategoría</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const catName = formData.get('catName') as string;
                const subName = formData.get('subName') as string;
                const existingCat = categories.find((c: any) => c.name === catName);

                if (existingCat) {
                  if (subName && !existingCat.submenus.includes(subName)) {
                    const newCats = [...categories];
                    const target = newCats.find(c => c.id === existingCat.id);
                    target.submenus.push(subName);
                    setCategories(newCats);
                  }
                } else {
                  const newCat = {
                    id: catName,
                    name: catName,
                    bgColor: 'bg-blue-50',
                    iconColor: 'text-blue-500',
                    dotColor: 'bg-blue-500',
                    submenus: subName ? [subName] : []
                  };
                  setCategories([...categories, newCat]);
                }
                e.currentTarget.reset();
              }} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nombre de Categoría</label>
                  <input name="catName" placeholder="Ej: Fiestas Infantiles" className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Añadir Subcategoría (Opcional)</label>
                  <input name="subName" placeholder="Ej: Ropa Personalizada" className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition">
                  GUARDAR CATEGORÍA
                </button>
                <p className="text-xs text-gray-500 italic">Si la categoría ya existe, se le añadirá la subcategoría.</p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
