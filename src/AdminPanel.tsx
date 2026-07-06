import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Package, Plus, Grid, Tag, ShoppingCart, MessageSquare, Megaphone, Trash2, Edit, Save, X, Image as ImageIcon, Upload, ChevronUp, ChevronDown, LogOut, Lock } from 'lucide-react';
import { supabase } from './lib/supabase';

type TabType = 'Inventario' | 'Nuevo' | 'Categorias' | 'Cupones' | 'Pedidos' | 'Opiniones' | 'Promo' | 'Ajustes';

interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  category: string;
  sub_category?: string;
  sub_category_2?: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
  image_url?: string;
  sort_order: number;
  submenus?: { name: string; children: string[] }[];
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  delivery_notes: string;
  payment_method: string;
  payment_reference: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Setting {
  id: string;
  bank_name: string;
  account_holder: string;
  clabe: string;
  account_number: string;
  card_number: string;
  instructions: string;
}

const TABS: { id: TabType; icon: any; label: string }[] = [
  { id: 'Inventario', icon: Package, label: 'Inventario' },
  { id: 'Nuevo', icon: Plus, label: 'Nuevo' },
  { id: 'Categorias', icon: Grid, label: 'Categorías' },
  { id: 'Cupones', icon: Tag, label: 'Cupones' },
  { id: 'Pedidos', icon: ShoppingCart, label: 'Pedidos' },
  { id: 'Opiniones', icon: MessageSquare, label: 'Opiniones' },
  { id: 'Promo', icon: Megaphone, label: 'Promo' },
  { id: 'Ajustes', icon: Settings, label: 'Ajustes' },
];

const MASTER_PASSWORD = '1212';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('Inventario');
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<Setting>({
    id: 'bank', bank_name: '', account_holder: '', clabe: '', account_number: '', card_number: '', instructions: ''
  });
  const [loading, setLoading] = useState(false);

  // New product form
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [newSubCategory2, setNewSubCategory2] = useState('');
  const [newImage, setNewImage] = useState('');

  // Category form
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);

  // Bulk price
  const [bulkCategory, setBulkCategory] = useState('');
  const [bulkSubCategory, setBulkSubCategory] = useState('');
  const [bulkPercent, setBulkPercent] = useState('');
  const [bulkPreview, setBulkPreview] = useState<Product[]>([]);

  // Settings form
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [clabe, setClabe] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [instructions, setInstructions] = useState('');

  // Opinions
  const [opinions, setOpinions] = useState<any[]>([]);
  const [newOpinion, setNewOpinion] = useState({ name: '', comment: '', rating: 5 });

  // Promo
  const [promoEnabled, setPromoEnabled] = useState(false);
  const [promoTitle, setPromoTitle] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === MASTER_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword('');
  };

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);

    async function loadData() {
      try {
        const [prodRes, catRes, ordRes, setRes, promRes] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('categories').select('*').order('sort_order', { ascending: true }),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('settings').select('*').eq('id', 'bank').maybeSingle(),
          supabase.from('settings').select('*').eq('id', 'promo').maybeSingle(),
        ]);

        if (prodRes.data) setProducts(prodRes.data);
        if (catRes.data) setCategories(catRes.data);
        if (ordRes.data) setOrders(ordRes.data);
        if (setRes.data) {
          const s = setRes.data as Setting;
          setSettings(s);
          setBankName(s.bank_name || '');
          setAccountHolder(s.account_holder || '');
          setClabe(s.clabe || '');
          setAccountNumber(s.account_number || '');
          setCardNumber(s.card_number || '');
          setInstructions(s.instructions || '');
        }
        if (promRes.data) {
          setPromoEnabled(!!(promRes.data as any).promo_enabled);
          setPromoTitle((promRes.data as any).promo_title || '');
          setPromoMessage((promRes.data as any).promo_message || '');
        }

        const opinRes = await supabase.from('opinions').select('*').order('created_at', { ascending: false });
        if (opinRes.data) setOpinions(opinRes.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadData().finally(() => setLoading(false));
  }, [authenticated]);

  // ── BULK PRICE PREVIEW ──
  useEffect(() => {
    let filtered = products;
    if (bulkCategory) filtered = filtered.filter(p => p.category?.toLowerCase() === bulkCategory.toLowerCase());
    if (bulkSubCategory) filtered = filtered.filter(p => p.sub_category?.toLowerCase() === bulkSubCategory.toLowerCase());
    setBulkPreview(filtered);
  }, [bulkCategory, bulkSubCategory, products]);

  const handleBulkPriceUpdate = async () => {
    if (!bulkPercent || bulkPreview.length === 0) return;
    const factor = 1 + parseFloat(bulkPercent) / 100;
    const confirmed = window.confirm(`¿Aplicar ${bulkPercent}% a ${bulkPreview.length} producto(s)?`);
    if (!confirmed) return;

    for (const product of bulkPreview) {
      const newPrice = Math.round(product.price * factor * 100) / 100;
      await supabase.from('products').update({ price: newPrice }).eq('id', product.id);
    }
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
    alert(`Precio aplicado a ${bulkPreview.length} producto(s)`);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      name: newName,
      description: newDescription,
      price: parseFloat(newPrice),
      category: newCategory,
      sub_category: newSubCategory || null,
      sub_category_2: newSubCategory2 || null,
      image: newImage || 'https://via.placeholder.com/600'
    };
    const { data, error } = await supabase.from('products').insert([newProduct]).select();
    if (error) { alert('Error: ' + error.message); return; }
    if (data) setProducts([data[0] as Product, ...products]);
    setNewName(''); setNewDescription(''); setNewPrice(''); setNewCategory('');
    setNewSubCategory(''); setNewSubCategory2(''); setNewImage('');
    setActiveTab('Inventario');
  };

  const handleDeleteProduct = async (id: number | string) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { alert('Error: ' + error.message); return; }
    setProducts(products.filter(p => p.id !== id));
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    if (editingCat) {
      await supabase.from('categories').update({ name: catName, image_url: catImage || null }).eq('id', editingCat);
      setEditingCat(null);
    } else {
      const id = catName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { error } = await supabase.from('categories').insert([{ id, name: catName, image_url: catImage || null, sort_order: categories.length }]);
      if (error) { alert('Error: ' + error.message); return; }
    }
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    if (data) setCategories(data);
    setCatName(''); setCatImage(''); setEditingCat(null);
  };

  const handleReorderCategory = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex(c => c.id === id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const temp = sorted[idx].sort_order;
    sorted[idx].sort_order = sorted[swapIdx].sort_order;
    sorted[swapIdx].sort_order = temp;
    await supabase.from('categories').update({ sort_order: sorted[idx].sort_order }).eq('id', sorted[idx].id);
    await supabase.from('categories').update({ sort_order: sorted[swapIdx].sort_order }).eq('id', sorted[swapIdx].id);
    setCategories([...sorted]);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    await supabase.from('categories').delete().eq('id', id);
    setCategories(categories.filter(c => c.id !== id));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('settings').upsert({
      id: 'bank', bank_name: bankName, account_holder: accountHolder,
      clabe, account_number: accountNumber, card_number: cardNumber, instructions,
      updated_at: new Date().toISOString()
    });
    if (error) { alert('Error: ' + error.message); return; }
    alert('Datos bancarios guardados');
  };

  const handleAddOpinion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpinion.name || !newOpinion.comment) return;
    const { error } = await supabase.from('opinions').insert([{
      name: newOpinion.name, comment: newOpinion.comment, rating: newOpinion.rating
    }]);
    if (error) { alert('Error: ' + error.message); return; }
    setNewOpinion({ name: '', comment: '', rating: 5 });
    const { data } = await supabase.from('opinions').select('*').order('created_at', { ascending: false });
    if (data) setOpinions(data);
  };

  const handleDeleteOpinion = async (id: number) => {
    await supabase.from('opinions').delete().eq('id', id);
    setOpinions(opinions.filter(o => o.id !== id));
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('settings').upsert({
      id: 'promo', promo_enabled: promoEnabled, promo_title: promoTitle, promo_message: promoMessage,
      updated_at: new Date().toISOString()
    });
    if (error) { alert('Error: ' + error.message); return; }
    alert('Promoción guardada');
  };

  // ── Render ──
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#141414] border border-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-600/10 border border-amber-600/20 flex items-center justify-center text-amber-500">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Panel</h1>
          <p className="text-gray-400 text-sm text-center mb-8">Imagine & Stamp</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña" autoFocus
              className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl px-4 py-3 text-white text-center text-lg font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors">
              Acceder
            </button>
          </form>
          <a href="/#/" className="block text-center text-gray-500 text-xs mt-6 hover:text-gray-400 transition-colors">&larr; Volver a la tienda</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col">
      {/* Dark Top-Nav */}
      <header className="bg-[#141414] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center font-bold text-white text-xs">
              I&amp;S
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Imagine & Stamp <span className="text-gray-500 font-normal">| Admin Panel</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/#/" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">Ver Tienda &rarr;</a>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1">
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto flex gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-amber-600/10 text-amber-500 border border-amber-600/20' : 'text-gray-400 border border-transparent hover:bg-gray-800/50 hover:text-gray-200'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* ─── INVENTARIO ─── */}
            {activeTab === 'Inventario' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <h2 className="text-2xl font-bold text-white">Inventario ({products.length})</h2>
                  <button onClick={() => setActiveTab('Nuevo')} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Agregar
                  </button>
                </div>
                
                {/* Cambio de Precio Masivo */}
                <details className="bg-[#141414] border border-gray-800 rounded-xl p-4">
                  <summary className="text-sm font-bold text-amber-500 cursor-pointer">Cambio de Precio Masivo</summary>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select value={bulkCategory} onChange={e => setBulkCategory(e.target.value)} className="bg-[#0A0A0A] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                      <option value="">Todas las categorías</option>
                      {[...new Set(products.map(p => p.category))].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input value={bulkSubCategory} onChange={e => setBulkSubCategory(e.target.value)} placeholder="Subcategoría (opcional)" className="bg-[#0A0A0A] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                    <input type="number" value={bulkPercent} onChange={e => setBulkPercent(e.target.value)} placeholder="% ej. 10 o -10" className="bg-[#0A0A0A] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
                    <button onClick={handleBulkPriceUpdate} disabled={!bulkPercent || bulkPreview.length === 0} className="bg-amber-600 hover:bg-amber-500 disabled:opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-colors">Aplicar</button>
                  </div>
                  {bulkPreview.length > 0 && (
                    <p className="text-xs text-gray-400 mt-2">{bulkPreview.length} producto(s) afectado(s)</p>
                  )}
                </details>

                <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                      <thead className="text-xs text-gray-400 uppercase bg-[#1A1A1A] border-b border-gray-800">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Producto</th>
                          <th className="px-6 py-4 font-semibold">Categoría</th>
                          <th className="px-6 py-4 font-semibold">Precio</th>
                          <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product.id} className="border-b border-gray-800 hover:bg-[#1A1A1A]/50 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <img src={product.image} className="w-10 h-10 rounded-md object-cover bg-gray-800" alt="" />
                              <div>
                                <span className="font-medium text-gray-100 block">{product.name}</span>
                                {product.description && <span className="text-xs text-gray-500 truncate max-w-[200px] block">{product.description}</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4">{product.category}{product.sub_category ? ` / ${product.sub_category}` : ''}</td>
                            <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No hay productos</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── NUEVO PRODUCTO ─── */}
            {activeTab === 'Nuevo' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Nuevo Producto</h2>
                  <form onSubmit={handleCreateProduct} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Nombre *</label>
                      <input required value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" placeholder="Ej: Playera Personalizada" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                      <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} rows={2} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" placeholder="Descripción del producto..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Precio *</label>
                        <input required type="number" step="0.01" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" placeholder="0.00" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Categoría *</label>
                        <input required value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" placeholder="Ej: Playeras" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Subcategoría</label>
                        <input value={newSubCategory} onChange={e => setNewSubCategory(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" placeholder="Ej: Vinil" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Subcategoría 2</label>
                        <input value={newSubCategory2} onChange={e => setNewSubCategory2(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" placeholder="Ej: Talla M" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">URL de Imagen</label>
                      <input value={newImage} onChange={e => setNewImage(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" placeholder="https://..." />
                    </div>
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                      <Save className="w-5 h-5" /> Guardar Producto
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ─── CATEGORÍAS ─── */}
            {activeTab === 'Categorias' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-white">Categorías</h2>
                <form onSubmit={handleCreateCategory} className="bg-[#141414] border border-gray-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-amber-500">{editingCat ? 'Editar' : 'Nueva'} Categoría</h3>
                  <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Nombre" required
                    className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" />
                  <input value={catImage} onChange={e => setCatImage(e.target.value)} placeholder="URL de imagen (opcional)"
                    className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      {editingCat ? 'Guardar' : 'Crear'}
                    </button>
                    {editingCat && <button type="button" onClick={() => { setEditingCat(null); setCatName(''); setCatImage(''); }} className="text-gray-400 hover:text-white px-4 py-2">Cancelar</button>}
                  </div>
                </form>

                <div className="space-y-2">
                  {categories.map((cat, i) => (
                    <div key={cat.id} className="bg-[#141414] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {cat.image_url && <img src={cat.image_url} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                        <div>
                          <span className="font-medium text-white">{cat.name}</span>
                          <span className="text-xs text-gray-500 ml-2">#{cat.sort_order}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleReorderCategory(cat.id, 'up')} disabled={i === 0} className="text-gray-500 hover:text-amber-500 disabled:opacity-20 p-1"><ChevronUp size={16} /></button>
                        <button onClick={() => handleReorderCategory(cat.id, 'down')} disabled={i === categories.length - 1} className="text-gray-500 hover:text-amber-500 disabled:opacity-20 p-1"><ChevronDown size={16} /></button>
                        <button onClick={() => { setEditingCat(cat.id); setCatName(cat.name); setCatImage(cat.image_url || ''); }} className="text-gray-500 hover:text-amber-500 p-1"><Edit size={14} /></button>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-500 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── CUPONES ─── */}
            {activeTab === 'Cupones' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Tag size={48} className="opacity-20 mb-4" />
                <p className="text-lg">Módulo de <strong className="text-gray-300">Cupones</strong> en construcción</p>
                <p className="text-sm text-gray-600 mt-2">Próximamente: gestión de códigos de descuento</p>
              </motion.div>
            )}

            {/* ─── PEDIDOS ─── */}
            {activeTab === 'Pedidos' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Pedidos ({orders.length})</h2>
                <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                      <thead className="text-xs text-gray-400 uppercase bg-[#1A1A1A] border-b border-gray-800">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Pedido / Fecha</th>
                          <th className="px-6 py-4 font-semibold">Cliente</th>
                          <th className="px-6 py-4 font-semibold">Total</th>
                          <th className="px-6 py-4 font-semibold">Pago</th>
                          <th className="px-6 py-4 font-semibold">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id} className="border-b border-gray-800 hover:bg-[#1A1A1A]/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-mono text-xs text-gray-400">{order.id.split('-')[0]}</div>
                              <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium">{order.customer_name}</div>
                              <div className="text-xs text-gray-500">{order.customer_phone}</div>
                            </td>
                            <td className="px-6 py-4 font-medium">${order.total_amount.toFixed(2)}</td>
                            <td className="px-6 py-4">{order.payment_method}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                                order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                order.status === 'in-process' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                order.status === 'delayed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              }`}>{order.status}</span>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No hay pedidos</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── OPINIONES ─── */}
            {activeTab === 'Opiniones' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-white">Opiniones de Clientes</h2>
                <form onSubmit={handleAddOpinion} className="bg-[#141414] border border-gray-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-amber-500">Agregar Opinión</h3>
                  <input value={newOpinion.name} onChange={e => setNewOpinion({ ...newOpinion, name: e.target.value })} placeholder="Nombre del cliente" required
                    className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" />
                  <textarea value={newOpinion.comment} onChange={e => setNewOpinion({ ...newOpinion, comment: e.target.value })} placeholder="Comentario" required rows={2}
                    className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Rating:</span>
                    {[1,2,3,4,5].map(r => (
                      <button key={r} type="button" onClick={() => setNewOpinion({ ...newOpinion, rating: r })}
                        className={`w-8 h-8 rounded-full text-sm font-bold ${newOpinion.rating >= r ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-400'}`}>{r}</button>
                    ))}
                  </div>
                  <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">Agregar</button>
                </form>
                <div className="space-y-2">
                  {opinions.map((op: any) => (
                    <div key={op.id} className="bg-[#141414] border border-gray-800 rounded-xl p-4 flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white">{op.name} <span className="text-amber-500 text-xs ml-2">{'★'.repeat(op.rating)}</span></div>
                        <p className="text-sm text-gray-400 mt-1">{op.comment}</p>
                      </div>
                      <button onClick={() => handleDeleteOpinion(op.id)} className="text-gray-500 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── PROMO ─── */}
            {activeTab === 'Promo' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Promociones</h2>
                  <form onSubmit={handleSavePromo} className="space-y-5">
                    <div className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-gray-800 rounded-xl">
                      <div>
                        <h4 className="text-white font-medium">Activar promoción</h4>
                        <p className="text-sm text-gray-400">Muestra un banner en la página principal</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={promoEnabled} onChange={e => setPromoEnabled(e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                      </label>
                    </div>
                    <AnimatePresence>
                      {promoEnabled && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                            <input value={promoTitle} onChange={e => setPromoTitle(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" placeholder="Ej: ¡Oferta de Temporada!" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Mensaje</label>
                            <textarea value={promoMessage} onChange={e => setPromoMessage(e.target.value)} rows={3} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" placeholder="Ej: 20% de descuento en todas las playeras personalizadas" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors">
                      Guardar Promoción
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ─── AJUSTES ─── */}
            {activeTab === 'Ajustes' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Datos Bancarios (Transferencia)</h2>
                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Banco</label>
                        <input value={bankName} onChange={e => setBankName(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" placeholder="BBVA, Santander..." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Titular</label>
                        <input value={accountHolder} onChange={e => setAccountHolder(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">CLABE</label>
                      <input value={clabe} onChange={e => setClabe(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" placeholder="18 dígitos" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Número de Cuenta</label>
                        <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Tarjeta (opcional)</label>
                        <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Instrucciones</label>
                      <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={3} className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500" placeholder="Ej: Por favor enviar comprobante por WhatsApp..." />
                    </div>
                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors">
                      Guardar Ajustes
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
