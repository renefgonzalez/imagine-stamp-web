import React, { useState, useMemo, ErrorInfo, ReactNode, Component } from 'react';
import { 
  Menu, Search, Heart, Plus, ShoppingBag, Store, Sparkles, User, X, 
  ChevronRight, Instagram, Facebook, Mail, Phone, Settings, ShoppingCart, 
  MessageCircle, Mail as MailIcon, PartyPopper, Gift, Briefcase, LayoutGrid 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { PRODUCTS, Product } from './data/products';
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

const DEFAULT_CATEGORIES = [
  {
    id: 'all',
    name: 'VER TODO',
    icon: LayoutGrid,
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-600',
    dotColor: 'bg-gray-400',
    submenus: []
  },
  {
    id: 'Fiestas Infantiles',
    name: 'Fiestas y Cumpleaños',
    icon: PartyPopper,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    dotColor: 'bg-purple-500',
    submenus: ['Ropa Personalizada', 'Decoración e Impresión', 'Recuerdos']
  },
  {
    id: 'Invitaciones Digitales',
    name: 'Invitaciones',
    icon: MailIcon,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500',
    dotColor: 'bg-orange-500',
    submenus: ['Digital Web (RSVP, Galería)', 'Para WhatsApp (Video, Imagen)']
  },
  {
    id: 'Boutique Corporativa',
    name: 'Empresarial',
    icon: Briefcase,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-500',
    dotColor: 'bg-amber-500',
    submenus: ['Kits Corporativos', 'Textil con Logo', 'Impresión Empresa']
  },
  {
    id: 'Social & Eventos',
    name: 'Personalización',
    icon: Gift,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
    dotColor: 'bg-green-500',
    submenus: ['Textil (Playeras, Sudaderas)', 'Accesorios (Termos, Libretas)', 'Vinil e Impresión']
  },
  {
    id: 'Portfolio',
    name: 'Catálogo / Portfolio',
    icon: Sparkles,
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    dotColor: 'bg-indigo-500',
    submenus: ['Galería de Trabajos', 'Proyectos Especiales', 'Inspiración']
  }
];

const ICON_MAP: Record<string, any> = {
  'Fiestas Infantiles': PartyPopper,
  'Invitaciones Digitales': MailIcon,
  'Boutique Corporativa': Briefcase,
  'Social & Eventos': Gift,
  'Portfolio': Sparkles,
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
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const saved = localStorage.getItem('imagine_stamp_categories');
    if (!saved) return DEFAULT_CATEGORIES;
    
    const parsed = JSON.parse(saved);
    if (parsed.length === 0) return DEFAULT_CATEGORIES;

    const dynamicCategories = parsed.map((cat: any) => ({
      ...cat,
      icon: ICON_MAP[cat.id] || Sparkles
    }));

    return [DEFAULT_CATEGORIES[0], ...dynamicCategories];
  }, []);

  const filteredProducts = useMemo(() => {
    const localProducts = JSON.parse(localStorage.getItem('imagine_stamp_products') || '[]');
    const allProducts = [...PRODUCTS, ...localProducts];
    
    if (selectedCategory === 'all') return allProducts;
    return allProducts.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    const phoneNumber = "525650469993"; 
    const summary = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    const message = `¡Hola René! Me interesa el siguiente pedido: ${summary} - Total: $${totalPrice}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const ShopView = () => (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-[10px] border-b border-primary/5">
          <div className="flex justify-between items-center px-4 md:px-6 h-20 w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-3 md:gap-4">
              <Menu className="text-primary cursor-pointer hover:opacity-70 transition-opacity" size={24} />
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 flex items-center justify-center overflow-hidden">
                  <img src={logo} alt="Imagine & Stamp Logo" className="h-14 w-auto object-contain" />
                </div>
                <h1 className="text-lg md:text-xl font-black text-primary font-headline tracking-tighter hidden sm:block">Imagine & Stamp</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Search className="text-primary cursor-pointer hover:opacity-70 transition-opacity" size={24} />
              <div 
                className="relative w-11 h-11 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-secondary/20" 
                onClick={() => setIsCartOpen(true)}
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
                <input className="bg-transparent border-none focus:outline-none w-full text-sm" placeholder="Busca productos artísticos..." />
              </div>
            </div>

            <section className="mb-16">
              <h3 className="font-headline font-bold text-lg mb-8 text-primary flex items-center gap-2">
                <span className="w-8 h-1 bg-secondary rounded-full"></span>
                Explora nuestra Boutique
              </h3>
              <div className="flex items-start gap-10 overflow-x-auto hide-scrollbar pb-6 px-4">
                {categories.map((cat) => (
                  <div key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="flex flex-col items-center gap-4 shrink-0 cursor-pointer group">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${cat.bgColor} ${selectedCategory === cat.id ? 'ring-4 ring-secondary ring-offset-4 scale-110 shadow-xl' : 'hover:scale-105 shadow-sm'}`}>
                      <cat.icon className={`w-8 h-8 ${selectedCategory === cat.id ? 'text-secondary' : cat.iconColor}`} />
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest text-center max-w-[100px] ${selectedCategory === cat.id ? 'text-primary' : 'text-primary/40'}`}>
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {selectedCategory !== 'all' && (
                  <motion.div
                    key={selectedCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="mt-8 p-8 bg-white rounded-3xl border border-primary/5 shadow-sm mx-2"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categories.find(c => c.id === selectedCategory)?.submenus.map((sub, idx) => (
                        <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${categories.find(c => c.id === selectedCategory)?.dotColor}`} />
                          <span className="text-sm font-medium text-primary/70 group-hover:text-primary transition-colors">{sub}</span>
                        </div>
                      ))}
                    </div>
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
            <button onClick={() => window.location.hash = '/admin'} className="mt-4 text-primary/20 hover:text-primary/60 transition-colors text-[10px] uppercase flex items-center gap-1 mx-auto"><Settings size={14} /> Acceso Admin</button>
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-[70] shadow-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-primary font-headline">Tu Carrito</h2>
                  <button onClick={() => setIsCartOpen(false)}><X size={24} className="text-primary" /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 text-primary/40"><ShoppingBag size={64} className="mx-auto mb-4" /> Tu carrito está vacío</div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex-1">
                          <h4 className="font-bold text-primary text-sm">{item.name}</h4>
                          <p className="text-xs text-primary/60">Cant: {item.quantity} • ${item.price * item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500"><X size={18} /></button>
                      </div>
                    ))
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="pt-6 border-t border-primary/5 space-y-4">
                    <div className="flex justify-between items-center"><span className="text-primary/60 font-medium">Total</span><span className="text-2xl font-black text-primary">${totalPrice}</span></div>
                    <button onClick={handleCheckout} className="w-full py-4 bg-secondary text-white rounded-xl font-bold text-lg">Finalizar Pedido vía WhatsApp</button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ShopView />} />
        <Route path="/admin" element={<AdminPanel onLogout={() => window.location.hash = '/'} />} />
      </Routes>
    </HashRouter>
  );
}
