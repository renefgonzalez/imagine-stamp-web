import React, { useState, useMemo, useEffect, ErrorInfo, ReactNode, Component } from 'react';
import { supabase } from './lib/supabase';
import { 
  Search, Heart, Plus, Sparkles, X, ShoppingBag,
  ChevronRight, Instagram, Facebook, Mail as MailIcon, 
  PartyPopper, Gift, Briefcase, LayoutGrid, Lock, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Product } from './data/products';
import logo from './logo.png';
import AdminPanel from './AdminPanel';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_: Error) { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("ErrorBoundary caught error:", error, errorInfo); }
  render() {
    if (this.state.hasError) return <div className="p-10 text-center text-red-500">Algo salió mal. Por favor recarga la página.</div>;
    return this.props.children;
  }
}

export const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'VER TODO', icon: LayoutGrid, bgColor: 'bg-gray-100', iconColor: 'text-gray-600', dotColor: 'bg-gray-400', submenus: [] },
  { id: 'fiestas-y-cumpleanos', name: 'Fiestas y Cumpleaños', icon: PartyPopper, bgColor: 'bg-purple-50', iconColor: 'text-purple-500', dotColor: 'bg-purple-500', submenus: [] },
  { id: 'invitaciones', name: 'Invitaciones', icon: MailIcon, bgColor: 'bg-orange-50', iconColor: 'text-orange-500', dotColor: 'bg-orange-500', submenus: [] },
  { id: 'empresarial', name: 'Empresarial', icon: Briefcase, bgColor: 'bg-amber-50', iconColor: 'text-amber-500', dotColor: 'bg-amber-500', submenus: [] },
  { id: 'personalizacion', name: 'Personalización', icon: Gift, bgColor: 'bg-green-50', iconColor: 'text-green-500', dotColor: 'bg-green-500', submenus: [] },
  { id: 'paginas-webs-y-apps', name: 'Páginas Web y Apps', icon: Sparkles, bgColor: 'bg-blue-50', iconColor: 'text-blue-500', dotColor: 'bg-blue-500', submenus: [] },
  { id: 'catalogo-and-portafolio', name: 'Catálogo y Portafolio', icon: Sparkles, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', dotColor: 'bg-indigo-500', submenus: [] }
];

const ICON_MAP: Record<string, any> = {
  'Fiestas y Cumpleaños': PartyPopper,
  'Invitaciones': MailIcon,
  'Empresarial': Briefcase,
  'Personalización': Gift,
  'Páginas Web y Apps': Sparkles,
  'Catálogo y Portafolio': Sparkles,
  'all': LayoutGrid
};

const SpeedyCartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M7 6h15l-2 10H9L7 6z" />
    <path d="M3 3h2l2 5" />
    <circle cx="10" cy="20" r="2" />
    <circle cx="18" cy="20" r="2" />
    <rect x="1" y="8" width="4" height="1.5" rx="0.75" />
    <rect x="0" y="11" width="5" height="1.5" rx="0.75" />
    <rect x="1" y="14" width="4" height="1.5" rx="0.75" />
  </svg>
);

export default function App() {
  const [cart, setCart] = useState<{ id: string | number; name: string; price: number; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'cart' | 'details'>('cart');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', city: '', notes: '', paymentMethod: 'Efectivo' });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartToast, setCartToast] = useState<{ name: string } | null>(null);

  // ── CARGAR DATOS DESDE SUPABASE ──────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          supabase.from('categories').select('*').order('sort_order', { ascending: true }),
          supabase.from('products').select('*')
        ]);

        if (catRes.data) {
          const apiCats = catRes.data.map((cat: any) => {
            const dc = DEFAULT_CATEGORIES.find(c => c.id === cat.id || c.name === cat.name);
            return {
              ...cat,
              bgColor: dc?.bgColor || 'bg-primary/5',
              iconColor: dc?.iconColor || 'text-primary',
              dotColor: dc?.dotColor || 'bg-primary',
              icon: ICON_MAP[cat.id] || ICON_MAP[cat.name] || Sparkles
            };
          });
          setCategories([DEFAULT_CATEGORIES[0], ...apiCats]); // ['VER TODO', ...otras]
        }
        if (prodRes.data) {
          setProducts(prodRes.data);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    // Búsqueda global (ignora acentos y mayúsculas)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      result = result.filter(p => {
        const name = p.name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
        const desc = p.description?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
        return name.includes(q) || desc.includes(q);
      });
    } else {
      // Filtrar por categoría
      if (selectedCategory !== 'all') {
        result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
      }
      // Filtrar por subcategoría (insensible a mayúsculas)
      if (selectedSubcategory) {
        result = result.filter(p => {
          const sub = (p.sub_category || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const sel = selectedSubcategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return sub.includes(sel) || sel.includes(sub);
        });
      }
    }
    return result;
  }, [selectedCategory, selectedSubcategory, products, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => String(item.id) === String(product.id));
      if (existing) return prev.map(item => String(item.id) === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    // Mostrar toast de confirmación
    setCartToast({ name: product.name });
    setTimeout(() => setCartToast(null), 3500);
  };

  const updateQuantity = (id: string | number, delta: number) => {
    setCart(prev => prev
      .map(item => String(item.id) === String(id) ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
    );
  };

  const removeFromCart = (id: string | number) => {
    setCart(prev => prev.filter(item => String(item.id) !== String(id)));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const openCart = () => { setCartStep('cart'); setIsCartOpen(true); };

  const handleFinalCheckout = () => {
    const phoneNumber = '525650469993';
    const lines = cart.map(item => `  • ${item.name} x${item.quantity} = $${item.price * item.quantity} MXN`).join('\n');

    // ── Crear pedido y guardarlo en Supabase ─────────────────────────────
    const newOrder = {
      id: 'ORD-' + Date.now(),
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_city: customerInfo.city,
      delivery_notes: customerInfo.notes,
      payment_method: customerInfo.paymentMethod,
      items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
      total_amount: totalPrice,
      status: 'pending',
      internal_notes: []
    };

    // GUARDAR EN SUPABASE
    supabase.from('orders').insert([newOrder]).then(({ error }) => {
      if (error) console.error("Error guardando pedido:", error);
    });

    // ── Mensaje de WhatsApp ────────────────────────────────────────────────
    const message =
      `¡Hola! Quiero realizar el siguiente pedido 🛍️\n\n` +
      `*Productos:*\n${lines}\n\n` +
      `*Total: $${totalPrice} MXN*\n\n` +
      `*Datos de entrega:*\n` +
      `👤 Nombre: ${customerInfo.name}\n` +
      `📱 WhatsApp: ${customerInfo.phone}\n` +
      `📍 Ciudad: ${customerInfo.city}\n` +
      `💳 Pago: ${customerInfo.paymentMethod}` +
      (customerInfo.notes ? `\n📝 Notas: ${customerInfo.notes}` : '');
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');

    // ── Limpiar carrito y formulario ───────────────────────────────────────
    setCart([]);
    setCustomerInfo({ name: '', phone: '', city: '', notes: '', paymentMethod: 'Efectivo' });
    setCartStep('cart');
    setIsCartOpen(false);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col bg-background">
              <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-[10px] border-b border-primary/5">
                <div className="flex justify-between items-center px-4 md:px-6 h-20 w-full max-w-7xl mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 flex items-center justify-center overflow-hidden">
                        <img src={logo} alt="Imagine & Stamp Logo" className="h-14 w-auto object-contain" />
                      </div>
                      <h1 className="text-lg md:text-xl font-black text-primary font-headline tracking-tighter hidden sm:block">Imagine & Stamp</h1>
                    </div>

                    {/* Redes Sociales — a la derecha del nombre */}
                    <div className="flex items-center gap-1 ml-2 border-l border-primary/10 pl-3">
                      <a 
                        href="https://www.instagram.com/personalizadosimagineandstamp"
                        target="_blank" rel="noreferrer"
                        title="Instagram"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-primary/40 hover:text-[#E1306C] hover:bg-pink-50 transition-all"
                      >
                        <Instagram size={16} />
                      </a>
                      <a 
                        href="https://www.facebook.com/share/1CFhhieFeV/?mibextid=wwXIfr"
                        target="_blank" rel="noreferrer"
                        title="Facebook"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-primary/40 hover:text-[#1877F2] hover:bg-blue-50 transition-all"
                      >
                        <Facebook size={16} />
                      </a>
                      <a 
                        href="mailto:imagineandstamp@gmail.com"
                        title="Correo"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-primary/40 hover:text-secondary hover:bg-secondary/5 transition-all"
                      >
                        <MailIcon size={16} />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Search 
                      className="text-primary cursor-pointer hover:opacity-70 transition-opacity" 
                      size={24} 
                      onClick={() => {
                        const element = document.getElementById('main-search');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          setTimeout(() => element.focus(), 500);
                        }
                      }}
                    />
                    <div 
                      className="relative w-11 h-11 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-secondary/20" 
                      onClick={openCart}
                    >
                      <SpeedyCartIcon className="text-white w-6 h-6" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                          {totalItems}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </header>

              <main className="pt-16 pb-12 max-w-7xl mx-auto w-full">
                <section className="relative w-full h-[350px] md:h-[400px] overflow-hidden mb-8">
                  <img 
                    alt="Hero" className="w-full h-full object-cover" 
                    src="./hero-imagine-stamp.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="text-white text-3xl md:text-5xl font-headline font-extrabold drop-shadow-lg"
                    >
                      Creamos la magia de tus momentos inolvidables
                    </motion.h2>
                  </div>
                </section>

                <div className="px-4">
                  <div className="mb-10">
                    <div className="relative flex items-center bg-white rounded-full px-5 py-3 shadow-sm border border-primary/10">
                      <Search className="text-primary/40 mr-3" size={20} />
                      <input 
                        id="main-search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none focus:outline-none w-full text-sm" 
                        placeholder="Busca productos, categorías, o palabras clave..." 
                      />
                    </div>
                  </div>

                  <section className="mb-16">
                    <h3 className="font-headline font-bold text-lg mb-4 text-primary flex items-center gap-2">
                      <span className="w-8 h-1 bg-secondary rounded-full"></span>
                      Nuestros Servicios
                    </h3>
                    {/* Contenedor con degradado para indicar scroll horizontal en móvil */}
                    <div className="relative">
                      <div className="flex items-start gap-5 md:gap-10 overflow-x-auto hide-scrollbar py-4 px-4">
                        {categories.map((cat) => (
                          <div 
                            key={cat.id} 
                            onClick={() => { 
                              setSelectedCategory(cat.id); 
                              setSelectedSubcategory('');
                            }} 
                            className="flex flex-col items-center gap-2 md:gap-4 shrink-0 cursor-pointer group"
                          >
                            {/* Círculo: pequeño en móvil, grande en escritorio */}
                            <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all ${cat.bgColor} ${
                              selectedCategory === cat.id 
                                ? 'ring-4 ring-secondary ring-offset-2 md:ring-offset-4 scale-110 shadow-xl' 
                                : 'hover:scale-105 shadow-sm'
                            }`}>
                              {cat.image_url ? (
                                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                              ) : (
                                <cat.icon className={`w-5 h-5 md:w-8 md:h-8 ${selectedCategory === cat.id ? 'text-secondary' : cat.iconColor}`} />
                              )}
                            </div>
                            <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-widest text-center max-w-[70px] md:max-w-[100px] leading-tight ${selectedCategory === cat.id ? 'text-primary' : 'text-primary/40'}`}>
                              {cat.name}
                            </span>
                          </div>
                        ))}
                        {/* Espaciado final para que el degradado no tape el último ítem */}
                        <div className="shrink-0 w-4" />
                      </div>
                      {/* Degradado derecho — indica que hay más categorías */}
                      <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-background to-transparent" />
                    </div>

                    <AnimatePresence mode="wait">
                      {selectedCategory !== 'all' && (
                        <motion.div
                          key={selectedCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="mt-8 p-8 bg-white rounded-3xl border border-primary/5 shadow-sm mx-2"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.find(c => c.id === selectedCategory)?.submenus.map((sub: string, idx: number) => {
                              const isActive = selectedSubcategory.toLowerCase() === sub.toLowerCase();
                              const dotCat = categories.find(c => c.id === selectedCategory);
                              return (
                                <div 
                                  key={idx} 
                                  onClick={() => setSelectedSubcategory(isActive ? '' : sub)}
                                  className={`flex items-center gap-3 group cursor-pointer rounded-xl px-3 py-2 transition-all ${
                                    isActive ? 'bg-secondary/10 ring-1 ring-secondary/30' : 'hover:bg-primary/5'
                                  }`}
                                >
                                  <div className={`w-2 h-2 rounded-full shrink-0 transition-all ${isActive ? 'bg-secondary scale-125' : dotCat?.dotColor}`} />
                                  <span className={`text-sm font-medium transition-colors ${
                                    isActive ? 'text-secondary font-bold' : 'text-primary/70 group-hover:text-primary'
                                  }`}>{sub}</span>
                                  {isActive && <span className="ml-auto text-[9px] font-black text-secondary uppercase tracking-widest">✕ Quitar</span>}
                                </div>
                              );
                            })}
                          </div>
                          {selectedSubcategory && (
                            <p className="text-[10px] text-secondary font-black uppercase tracking-widest mt-4 px-3">
                              Mostrando: {selectedSubcategory} ({filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''})
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>

                  <div className="masonry-grid">
                    <AnimatePresence mode="popLayout">
                      {filteredProducts.map((product) => (
                        <motion.div 
                          key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                          className="masonry-item group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all"
                        >
                          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                            <img alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" src={product.image} />
                            <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-accent-magenta shadow-sm">
                              <Heart size={20} fill="currentColor" />
                            </button>
                          </div>
                          <h3 className="font-headline font-bold text-primary text-sm mb-1">{product.name}</h3>
                          <p className="text-[10px] text-primary/60 line-clamp-2 mb-2">{product.description}</p>
                          <div className="flex flex-col gap-2 mt-auto">
                            <span className="text-primary font-black text-lg">${product.price}</span>
                      <button 
                              onClick={() => addToCart(product)}
                              className="w-full py-2 bg-secondary text-white rounded-xl font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                              <Plus size={14} /> AGREGAR AL CARRITO
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </main>

              {/* ── TOAST: Producto agregado ─────────────────────────────────── */}
              <AnimatePresence>
                {cartToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 80, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 80, scale: 0.9 }}
                    className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] w-[90vw] max-w-sm"
                  >
                    <div className="bg-primary text-white rounded-2xl shadow-2xl px-5 py-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <Plus size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/60">¡Agregado al carrito!</p>
                          <p className="text-sm font-bold truncate">{cartToast.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setCartToast(null); openCart(); }}
                          className="flex-1 py-2 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all"
                        >
                          Ver carrito
                        </button>
                        <button
                          onClick={() => setCartToast(null)}
                          className="flex-1 py-2 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                        >
                          Seguir comprando
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <footer className="bg-white border-t border-primary/5 pt-12 pb-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <img src={logo} alt="Logo" className="h-[50px] w-auto" />
                      <h2 className="text-2xl font-black text-primary font-headline tracking-tighter">Imagine & Stamp</h2>
                    </div>
                    <p className="text-primary/60 text-sm max-w-xs">Personalizamos tus momentos más especiales con diseños creativos y alta calidad.</p>
                  </div>
                  <div className="space-y-6">
                    <h3 className="font-headline font-bold text-primary text-lg">Contacto</h3>
                    <div className="space-y-4 text-sm text-primary/70">
                      <a href="https://wa.me/525650469993" target="_blank" rel="noreferrer" className="flex items-center gap-3"><MessageCircle size={18} /> WhatsApp</a>
                      <a href="mailto:imagineandstamp@gmail.com" className="flex items-center gap-3"><MailIcon size={18} /> imagineandstamp@gmail.com</a>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="font-headline font-bold text-primary text-lg">Síguenos</h3>
                    <div className="flex gap-4">
                      <a href="https://www.instagram.com/personalizadosimagineandstamp" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center"><Instagram size={22} /></a>
                      <a href="https://www.facebook.com/share/1CFhhieFeV/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center"><Facebook size={22} /></a>
                    </div>
                  </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-primary/5 text-center">
                  <p className="text-primary/30 text-[10px] uppercase tracking-widest">© 2026 Imagine & Stamp. Todos los derechos reservados.</p>
                  <button onClick={() => window.location.hash = '/admin'} className="mt-4 text-primary/20 hover:text-primary/60 transition-colors flex items-center justify-center mx-auto" aria-label="Admin Access">
                    <Lock size={16} />
                  </button>
                </div>
              </footer>

              <div className="fixed bottom-8 right-6 z-50 flex flex-col gap-4 items-end">
                <motion.a 
                  href="https://wa.me/525650469993" target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-full shadow-2xl"
                >
                  <span className="font-bold text-sm">¡Cotiza aquí!</span>
                  <MessageCircle size={28} fill="currentColor" />
                </motion.a>
              </div>

              <AnimatePresence>
                {isCartOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={() => setIsCartOpen(false)}
                      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                      className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-[70] shadow-2xl flex flex-col overflow-hidden"
                    >
                      {/* ── Paso 1: Carrito ── */}
                      <AnimatePresence mode="wait">
                        {cartStep === 'cart' ? (
                          <motion.div key="cart" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col h-full p-6">
                            <div className="flex justify-between items-center mb-6">
                              <h2 className="text-2xl font-black text-primary font-headline">Tu Carrito</h2>
                              <button onClick={() => setIsCartOpen(false)}><X size={24} className="text-primary" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3">
                              {cart.length === 0 ? (
                                <div className="text-center py-20 text-primary/40 flex flex-col items-center">
                                  <ShoppingBag size={64} className="mb-4" />
                                  <p className="font-bold text-sm">Tu carrito está vacío</p>
                                </div>
                              ) : (
                                cart.map(item => (
                                  <div key={item.id} className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-primary text-sm truncate">{item.name}</h4>
                                      <p className="text-xs text-primary/50 font-medium mt-0.5">${item.price} c/u</p>
                                    </div>
                                    {/* Controles de cantidad */}
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-8 h-8 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-lg leading-none hover:bg-secondary hover:text-white hover:border-secondary transition-all"
                                      >−</button>
                                      <span className="w-6 text-center font-black text-primary text-sm">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="w-8 h-8 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-lg leading-none hover:bg-secondary hover:text-white hover:border-secondary transition-all"
                                      >+</button>
                                    </div>
                                    {/* Subtotal */}
                                    <div className="text-right shrink-0 min-w-[60px]">
                                      <p className="font-black text-primary text-sm">${item.price * item.quantity}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-primary/20 hover:text-error transition-colors"><X size={16} /></button>
                                  </div>
                                ))
                              )}
                            </div>

                            {cart.length > 0 && (
                              <div className="pt-5 border-t border-primary/5 space-y-4 mt-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-primary/50 font-medium text-sm">{totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}</span>
                                  <span className="text-2xl font-black text-primary">${totalPrice} <span className="text-sm font-bold text-primary/40">MXN</span></span>
                                </div>
                                <button
                                  onClick={() => setCartStep('details')}
                                  className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-base shadow-lg shadow-secondary/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-3"
                                >
                                  Siguiente — Datos de Entrega
                                  <ChevronRight size={20} strokeWidth={3} />
                                </button>
                              </div>
                            )}
                          </motion.div>
                        ) : (
                        /* ── Paso 2: Datos de entrega ── */
                          <motion.div key="details" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col h-full p-6">
                            <div className="flex items-center gap-3 mb-6">
                              <button onClick={() => setCartStep('cart')} className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all">
                                <ChevronRight size={18} className="rotate-180" />
                              </button>
                              <h2 className="text-xl font-black text-primary font-headline">Datos de Entrega</h2>
                              <button onClick={() => setIsCartOpen(false)} className="ml-auto"><X size={22} className="text-primary/40" /></button>
                            </div>

                            {/* Resumen compacto */}
                            <div className="bg-white rounded-2xl p-4 border border-primary/5 shadow-sm mb-6">
                              {cart.map(item => (
                                <div key={item.id} className="flex justify-between text-xs py-1">
                                  <span className="text-primary/60 truncate pr-2">{item.name} <span className="font-bold">x{item.quantity}</span></span>
                                  <span className="font-black text-primary shrink-0">${item.price * item.quantity}</span>
                                </div>
                              ))}
                              <div className="border-t border-primary/5 mt-2 pt-2 flex justify-between">
                                <span className="text-xs font-black text-primary/40 uppercase tracking-widest">Total</span>
                                <span className="font-black text-secondary">${totalPrice} MXN</span>
                              </div>
                            </div>

                            {/* Formulario */}
                            <div className="flex-1 overflow-y-auto space-y-4">
                              <div>
                                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1.5 block ml-1">Nombre Completo *</label>
                                <input
                                  value={customerInfo.name}
                                  onChange={e => setCustomerInfo(p => ({ ...p, name: e.target.value }))}
                                  placeholder="Ej: María García López"
                                  className="w-full bg-white border border-primary/10 text-primary p-4 rounded-2xl text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1.5 block ml-1">Teléfono WhatsApp *</label>
                                <input
                                  value={customerInfo.phone}
                                  onChange={e => setCustomerInfo(p => ({ ...p, phone: e.target.value }))}
                                  placeholder="10 dígitos"
                                  type="tel"
                                  className="w-full bg-white border border-primary/10 text-primary p-4 rounded-2xl text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1.5 block ml-1">Ciudad *</label>
                                <input
                                  value={customerInfo.city}
                                  onChange={e => setCustomerInfo(p => ({ ...p, city: e.target.value }))}
                                  placeholder="Ej: Guadalajara, Jalisco"
                                  className="w-full bg-white border border-primary/10 text-primary p-4 rounded-2xl text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1.5 block ml-1">Forma de Pago *</label>
                                <select
                                  value={customerInfo.paymentMethod}
                                  onChange={e => setCustomerInfo(p => ({ ...p, paymentMethod: e.target.value }))}
                                  className="w-full bg-white border border-primary/10 text-primary p-4 rounded-2xl text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all cursor-pointer"
                                >
                                  <option value="Efectivo">💵 Efectivo</option>
                                  <option value="Transferencia">🏦 Transferencia Bancaria</option>
                                  <option value="Tarjeta">💳 Tarjeta</option>
                                  <option value="Por Confirmar">⏳ Por Confirmar</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1.5 block ml-1">Notas Adicionales <span className="normal-case font-medium">(opcional)</span></label>
                                <textarea
                                  value={customerInfo.notes}
                                  onChange={e => setCustomerInfo(p => ({ ...p, notes: e.target.value }))}
                                  placeholder="Color específico, medida, personalización..."
                                  rows={2}
                                  className="w-full bg-white border border-primary/10 text-primary p-4 rounded-2xl text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all resize-none"
                                />
                              </div>
                            </div>

                            <button
                              onClick={handleFinalCheckout}
                              disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.city}
                              className="mt-5 w-full py-4 bg-[#25D366] text-white rounded-2xl font-black text-base shadow-lg hover:bg-[#1DAD54] transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <MessageCircle size={22} fill="currentColor" />
                              Finalizar Pedido vía WhatsApp
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </ErrorBoundary>
        } />
        <Route path="/admin" element={<AdminPanel onLogout={() => window.location.hash = '/'} />} />
      </Routes>
    </HashRouter>
  );
}
