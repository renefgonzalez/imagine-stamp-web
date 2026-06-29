import React, { useState } from 'react';
import { Settings, Package, Plus, Grid, Tag, ShoppingCart, MessageSquare, Megaphone, Check, Trash2, Edit, Save, X, Image as ImageIcon, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../../lib/supabase';

type TabType = 'Inventario' | 'Nuevo' | 'Categorias' | 'Cupones' | 'Pedidos' | 'Opiniones' | 'Promo' | 'Ajustes';

// Reusing Product interface from Catalog for Demo
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  isDigital: boolean;
  downloadUrl?: string;
  fileFormat?: string;
}

const DEMO_PRODUCTS: Product[] = [
  { id: '1', name: 'Diseño Corte Láser 1', category: 'General', price: 100.00, image: '/img/corte-laser/prod_1.jpeg', isDigital: false },
  { id: '2', name: 'Diseño Corte Láser 2', category: 'General', price: 100.00, image: '/img/corte-laser/prod_2.jpeg', isDigital: false },
  { id: '3', name: 'Diseño Corte Láser 3', category: 'General', price: 100.00, image: '/img/corte-laser/prod_3.jpeg', isDigital: false },
  { id: '4', name: 'Diseño Corte Láser 4', category: 'General', price: 100.00, image: '/img/corte-laser/prod_4.jpeg', isDigital: false },
  { id: '5', name: 'Diseño Corte Láser 5', category: 'General', price: 100.00, image: '/img/corte-laser/prod_5.jpeg', isDigital: false },
  { id: '6', name: 'Diseño Corte Láser 6', category: 'General', price: 100.00, image: '/img/corte-laser/prod_6.jpeg', isDigital: false },
  { id: '7', name: 'Diseño Corte Láser 7', category: 'General', price: 100.00, image: '/img/corte-laser/prod_7.jpeg', isDigital: false },
  { id: '8', name: 'Diseño Corte Láser 8', category: 'General', price: 100.00, image: '/img/corte-laser/prod_8.jpeg', isDigital: false },
  { id: '9', name: 'Diseño Corte Láser 9', category: 'General', price: 100.00, image: '/img/corte-laser/prod_9.jpeg', isDigital: false },
  { id: '10', name: 'Pack 50 Vectores Religiosos', category: 'Digital', price: 299.00, image: 'https://images.unsplash.com/photo-1618641986557-1de223cb2f4f?auto=format&fit=crop&q=80&w=600', isDigital: true, downloadUrl: 'https://drive.google.com/drive/folders/ejemplo', fileFormat: 'DXF, CDR, SVG' },
];

export default function CorteLaserAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>('Inventario');
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);

  // Nuevo Producto State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');
  const [isDigital, setIsDigital] = useState(false);
  const [newFormat, setNewFormat] = useState('SVG');
  const [newDownloadUrl, setNewDownloadUrl] = useState('');

  const TABS: { id: TabType, icon: any, label: string }[] = [
    { id: 'Inventario', icon: Package, label: 'Inventario' },
    { id: 'Nuevo', icon: Plus, label: 'Nuevo' },
    { id: 'Categorias', icon: Grid, label: 'Categorías' },
    { id: 'Cupones', icon: Tag, label: 'Cupones' },
    { id: 'Pedidos', icon: ShoppingCart, label: 'Pedidos' },
    { id: 'Opiniones', icon: MessageSquare, label: 'Opiniones' },
    { id: 'Promo', icon: Megaphone, label: 'Promo' },
    { id: 'Ajustes', icon: Settings, label: 'Ajustes' },
  ];

  // Pedidos State
  const [digitalOrders, setDigitalOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  React.useEffect(() => {
    if (activeTab === 'Pedidos') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('digital_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDigitalOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleApproveOrder = async (id: string, token: string) => {
    try {
      const { error } = await supabase
        .from('digital_orders')
        .update({ status: 'paid' })
        .eq('id', id);
        
      if (error) throw error;
      fetchOrders();

      const url = `${window.location.origin}/#/descarga/${token}`;
      const message = `¡Hola! Tu pago ha sido aprobado. Aquí tienes el enlace para descargar tus archivos digitales:\n\n${url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    } catch (err) {
      console.error("Error approving order", err);
      alert("Hubo un error al aprobar la orden.");
    }
  };

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/#/descarga/${token}`;
    const message = `¡Hola! Aquí tienes nuevamente tu enlace para descargar tus archivos digitales:\n\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      category: newCategory,
      price: parseFloat(newPrice),
      image: newImage || 'https://via.placeholder.com/600',
      isDigital,
      fileFormat: isDigital ? newFormat : undefined,
      downloadUrl: isDigital ? newDownloadUrl : undefined
    };
    
    setProducts([newProduct, ...products]);
    alert('Producto creado exitosamente (Demo)');
    
    // Reset
    setNewName(''); setNewCategory(''); setNewPrice(''); setNewImage('');
    setIsDigital(false); setNewFormat('SVG'); setNewDownloadUrl('');
    setActiveTab('Inventario');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-gray-100 flex flex-col">
      {/* Dark Top-Nav */}
      <header className="bg-[#141414] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center font-bold text-white">
              CL
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Corte Láser <span className="text-gray-500 font-normal">| Admin Panel</span>
            </h1>
          </div>
          <a href="/#/corte-laser" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
            Ver Tienda &rarr;
          </a>
        </div>
        
        {/* Tabs - Horizontal Scrollable */}
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto no-scrollbar flex gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id 
                ? 'bg-amber-600/10 text-amber-500 border border-amber-600/20' 
                : 'text-gray-400 border border-transparent hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        
        {/* TAB: INVENTARIO */}
        {activeTab === 'Inventario' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Inventario de Productos</h2>
              <button 
                onClick={() => setActiveTab('Nuevo')}
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Agregar Producto
              </button>
            </div>
            
            <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs text-gray-400 uppercase bg-[#1A1A1A] border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Producto</th>
                      <th className="px-6 py-4 font-semibold">Categoría</th>
                      <th className="px-6 py-4 font-semibold">Precio</th>
                      <th className="px-6 py-4 font-semibold">Tipo</th>
                      <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-gray-800 hover:bg-[#1A1A1A]/50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={product.image} className="w-10 h-10 rounded-md object-cover bg-gray-800" alt="" />
                          <span className="font-medium text-gray-100">{product.name}</span>
                        </td>
                        <td className="px-6 py-4">{product.category}</td>
                        <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          {product.isDigital ? (
                            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded-md text-xs font-bold">
                              DIGITAL ({product.fileFormat})
                            </span>
                          ) : (
                            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs font-medium">
                              FÍSICO
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-amber-500 p-2"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No hay productos en el inventario.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB: NUEVO PRODUCTO */}
        {activeTab === 'Nuevo' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Agregar Nuevo Producto</h2>
              
              <form onSubmit={handleCreateProduct} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nombre del producto</label>
                  <input required type="text" value={newName} onChange={e => setNewName(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" 
                    placeholder="Ej. Topper Cumpleaños Acrílico" />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                    <input required type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" 
                      placeholder="Ej. Cake Topper" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Precio ($)</label>
                    <input required type="number" step="0.01" value={newPrice} onChange={e => setNewPrice(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" 
                      placeholder="0.00" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">URL de la Imagen</label>
                  <div className="flex gap-2">
                    <input type="url" value={newImage} onChange={e => setNewImage(e.target.value)}
                      className="flex-1 bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" 
                      placeholder="https://..." />
                    <button type="button" className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 pb-2">
                  <div className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-gray-800 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Es un archivo digital</h4>
                      <p className="text-sm text-gray-400">El cliente recibirá un enlace para descargar.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={isDigital} onChange={e => setIsDigital(e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                </div>

                <AnimatePresence>
                  {isDigital && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="p-5 bg-amber-900/10 border border-amber-600/20 rounded-xl space-y-4">
                        <div className="flex items-center gap-2 text-amber-500 mb-2">
                          <Download className="w-5 h-5" />
                          <h4 className="font-semibold">Configuración de Descarga</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-amber-500/80 mb-1">Formato</label>
                            <select value={newFormat} onChange={e => setNewFormat(e.target.value)}
                              className="w-full bg-[#0A0A0A] border border-amber-600/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500">
                              <option value="SVG">SVG</option>
                              <option value="DXF">DXF</option>
                              <option value="PDF">PDF</option>
                              <option value="ZIP">Archivo ZIP</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-amber-500/80 mb-1">URL del Archivo (Drive, Dropbox, etc.)</label>
                            <input required={isDigital} type="url" value={newDownloadUrl} onChange={e => setNewDownloadUrl(e.target.value)}
                              className="w-full bg-[#0A0A0A] border border-amber-600/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" 
                              placeholder="https://link-de-descarga.com" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-6">
                  <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <Save className="w-5 h-5" />
                    Guardar Producto
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* TAB: PEDIDOS (Órdenes Digitales) */}
        {activeTab === 'Pedidos' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Pedidos Digitales</h2>
              <button 
                onClick={fetchOrders}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Actualizar
              </button>
            </div>
            
            <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs text-gray-400 uppercase bg-[#1A1A1A] border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4 font-semibold">ID / Fecha</th>
                      <th className="px-6 py-4 font-semibold">Producto / Notas</th>
                      <th className="px-6 py-4 font-semibold">Estado</th>
                      <th className="px-6 py-4 font-semibold">Descargas</th>
                      <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingOrders ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Cargando pedidos...</td>
                      </tr>
                    ) : digitalOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No hay pedidos digitales.</td>
                      </tr>
                    ) : (
                      digitalOrders.map(order => (
                        <tr key={order.id} className="border-b border-gray-800 hover:bg-[#1A1A1A]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-mono text-xs text-gray-400">{String(order.id).split('-')[0]}</div>
                            <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {order.internal_notes || `Producto ID: ${order.product_id}`}
                          </td>
                          <td className="px-6 py-4">
                            {order.status === 'paid' ? (
                              <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-max">
                                <Check className="w-3 h-3" /> Pagado
                              </span>
                            ) : (
                              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded-md text-xs font-bold w-max inline-block">
                                Pendiente
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {order.download_count} / {order.max_downloads}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {order.status === 'pending' ? (
                              <button 
                                onClick={() => handleApproveOrder(order.id, order.download_token)}
                                className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                              >
                                Aprobar Pago
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleCopyLink(order.download_token)}
                                className="bg-gray-800 hover:bg-gray-700 text-amber-500 border border-gray-700 hover:border-amber-500/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-end gap-2 ml-auto"
                              >
                                Compartir por WhatsApp
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* OTROS TABS (Placeholder) */}
        {activeTab !== 'Inventario' && activeTab !== 'Nuevo' && activeTab !== 'Pedidos' && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="opacity-20 mb-4">Icon</div>
            <p className="text-lg">El módulo de <strong>{activeTab}</strong> está en construcción.</p>
          </div>
        )}

      </main>
    </div>
  );
}
