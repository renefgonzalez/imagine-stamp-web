import React, { useState, useMemo, useEffect, useRef, ErrorInfo, ReactNode, Component, Suspense } from 'react';
import { supabase } from './lib/supabase';
import { 
  Search, Heart, Plus, Sparkles, X, ShoppingBag,
  ChevronRight, Instagram, Facebook, Mail as MailIcon,
  PartyPopper, Gift, Briefcase, LayoutGrid, Lock, MessageCircle,
  Landmark, Copy, Check, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Product } from './data/products';
import logo from './logo.png';
import DemoMenu from './modules/demo-menu/pages/DemoMenu';
import AdminPanel from './AdminPanel';

const CatalogoEtiquetas = React.lazy(() => import('./modules/etiquetas-escolares/pages/CatalogoEtiquetas'));
const CandymarMenu = React.lazy(() => import('./modules/candymar/pages/CandymarMenu'));
const LaCazonaMenu = React.lazy(() => import('./modules/la-cazona/pages/LaCazonaMenu'));
const LaMichoacanaMenu = React.lazy(() => import('./modules/la-michoacana/pages/LaMichoacanaMenu'));
const GaoliPizzaMenu = React.lazy(() => import('./modules/gaoli-pizza/pages/GaoliPizzaMenu'));
import { GlobalFooter } from './components/common/GlobalFooter';
import { useCartStore } from './store/useCartStore';
import { CartButton } from './components/common/CartButton';
import { CartDrawer } from './components/common/CartDrawer';
import { CategoryMenu } from './components/common/CategoryMenu';
import { trackMetaEvent } from './utils/metaPixel';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_: Error) { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("ErrorBoundary caught error:", error, errorInfo); }
  render() {
    if (this.state.hasError) return <div className="p-10 text-center text-red-500">Algo saliÃƒÂ³ mal. Por favor recarga la pÃƒÂ¡gina.</div>;
    return this.props.children;
  }
}

export const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'VER TODO', icon: LayoutGrid, bgColor: 'bg-gray-100', iconColor: 'text-gray-600', dotColor: 'bg-gray-400', submenus: [] },
  { id: 'fiestas-y-cumpleanos', name: 'Fiestas y CumpleaÃƒÂ±os', icon: PartyPopper, bgColor: 'bg-purple-50', iconColor: 'text-purple-500', dotColor: 'bg-purple-500', submenus: [] },
  { id: 'invitaciones', name: 'Invitaciones', icon: MailIcon, bgColor: 'bg-orange-50', iconColor: 'text-orange-500', dotColor: 'bg-orange-500', submenus: [] },
  { id: 'empresarial', name: 'Empresarial', icon: Briefcase, bgColor: 'bg-amber-50', iconColor: 'text-amber-500', dotColor: 'bg-amber-500', submenus: [] },
  { id: 'personalizacion', name: 'PersonalizaciÃƒÂ³n', icon: Gift, bgColor: 'bg-green-50', iconColor: 'text-green-500', dotColor: 'bg-green-500', submenus: [] },
  { id: 'paginas-webs-y-apps', name: 'PÃƒÂ¡ginas Web y Apps', icon: Sparkles, bgColor: 'bg-blue-50', iconColor: 'text-blue-500', dotColor: 'bg-blue-500', submenus: [] },
  { id: 'catalogo-and-portafolio', name: 'CatÃƒÂ¡logo y Portafolio', icon: Sparkles, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-500', dotColor: 'bg-indigo-500', submenus: [] }
];

const ICON_MAP: Record<string, any> = {
  'Fiestas y CumpleaÃƒÂ±os': PartyPopper,
  'Invitaciones': MailIcon,
  'Empresarial': Briefcase,
  'PersonalizaciÃƒÂ³n': Gift,
  'PÃƒÂ¡ginas Web y Apps': Sparkles,
  'CatÃƒÂ¡logo y Portafolio': Sparkles,
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
  // Helper: normaliza submenus viejos (string[]) al formato nuevo ({name,children}[])
  const normalizeSubs = (subs: any[]): {name:string; children:string[]}[] => {
    if (!subs || subs.length === 0) return [];
    if (typeof subs[0] === 'string') return subs.map((s: string) => ({ name: s, children: [] }));
    return subs;
  };

  const { cartToast, setCartToast, openCart, addToCart } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSubcategory2, setSelectedSubcategory2] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeBadgeFilter, setActiveBadgeFilter] = useState<string | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<{ status: string; whatsappMessage: string | null } | null>(null);
  const [favorites, setFavorites] = useState<(string | number)[]>(() => {
    const saved = localStorage.getItem('imagine_stamp_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [visibleItems, setVisibleItems] = useState(10);

  useEffect(() => {
    localStorage.setItem('imagine_stamp_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Reiniciar paginación cuando cambia categoría o búsqueda
  useEffect(() => {
    setVisibleItems(10);
  }, [selectedCategory, searchQuery, selectedSubcategory, selectedSubcategory2]);

  // Meta Pixel: ViewContent cuando se muestran productos (solo cuando cambia el conjunto)
  const lastViewContentKey = useRef('');
  useEffect(() => {
    const visible = filteredProducts.slice(0, visibleItems);
    if (visible.length > 0) {
      const key = visible.map(p => p.id).join(',');
      if (key !== lastViewContentKey.current) {
        lastViewContentKey.current = key;
        trackMetaEvent('ViewContent', {
          content_ids: visible.map(p => String(p.id)),
          content_names: visible.map(p => p.name),
          content_type: 'product',
          contents: visible.map(p => ({ id: String(p.id), quantity: 1 })),
          value: visible.reduce((sum, p) => sum + p.price, 0),
          currency: 'MXN',
        });
      }
    }
  }, [filteredProducts, visibleItems]);

  // Ã¢â€ â‚¬Ã¢â€ â‚¬ CARGAR DATOS DESDE SUPABASE Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬
  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes, settingsRes] = await Promise.all([
          supabase.from('categories').select('*').order('sort_order', { ascending: true }),
          supabase.from('products').select('*'),
          supabase.from('settings').select('*').eq('id', 'bank').maybeSingle()
        ]);

        if (settingsRes.data) {
          setBankInfo(settingsRes.data);
        }

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

    // Filtro por favoritos
    if (showOnlyFavorites) {
      result = result.filter(p => favorites.includes(p.id));
    }

    // BÃƒÂºsqueda global (ignora acentos y mayÃƒÂºsculas)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      result = result.filter(p => {
        const name = p.name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
        const desc = p.description?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
        return name.includes(q) || desc.includes(q);
      });
    } else {
      // Filtrar por categorÃƒÂ­a
      if (selectedCategory !== 'all') {
        result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
      }
      // Filtrar por subcategorÃƒÂ­a 1
      if (selectedSubcategory) {
        result = result.filter(p => {
          const sub = (p.sub_category || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const sel = selectedSubcategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return sub.includes(sel) || sel.includes(sub);
        });
      }
      // Filtrar por subcategorÃƒÂ­a 2
      if (selectedSubcategory2) {
        result = result.filter(p => {
          const sub2 = ((p as any).sub_category_2 || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const sel2 = selectedSubcategory2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return sub2.includes(sel2) || sel2.includes(sub2);
        });
      }
    }
    return result;
  }, [selectedCategory, selectedSubcategory, selectedSubcategory2, products, searchQuery]);

  const toggleFavorite = (productId: string | number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };


  // Ã¢â€ â‚¬Ã¢â€ â‚¬ Confirmar pago al regresar de Mercado Pago Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pago = params.get('pago');
    if (!pago) return;

    const status = params.get('status') || params.get('collection_status');
    const orderRef = params.get('external_reference');
    const paymentId = params.get('payment_id') || params.get('collection_id');

    if (pago === 'exito' && status === 'approved' && orderRef) {
      // Marcar el pedido como pagado (guarda la referencia del pago de Mercado Pago)
      supabase.from('orders')
        .update({ payment_reference: `MP-${paymentId || 'aprobado'}` })
        .eq('id', orderRef)
        .then(() => {});
    }

    let savedMessage = localStorage.getItem('imagine-pending-whatsapp');
    localStorage.removeItem('imagine-pending-whatsapp');

    // Agregar el texto de confirmaciÃƒÂ³n al mensaje si el pago fue exitoso
    if (savedMessage && pago === 'exito' && status === 'approved') {
      try {
        const decoded = decodeURIComponent(savedMessage);
        const confirmationText = `\n\nÃ¢Å“â€¦ *PAGO EN LÃƒÂ NEA CONFIRMADO*\nFolio MP: ${paymentId || 'Aprobado'}\n`;
        savedMessage = encodeURIComponent(decoded + confirmationText);
      } catch (e) {
        console.error("Error decoding whatsapp message", e);
      }
    }

    setPaymentResult({ status: pago, whatsappMessage: savedMessage });

    // Limpiar los parÃƒÂ¡metros de la URL para que no se repita el aviso al recargar
    window.history.replaceState({}, '', window.location.pathname + window.location.hash);
  }, []);

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
                      <div className="h-16 w-16 flex items-center justify-center overflow-hidden transition-all">
                        <img src={logo} alt="Imagine & Stamp Logo" className="h-full w-auto object-contain" />
                      </div>
                      <h1 className="text-lg md:text-xl font-black text-primary font-headline tracking-tighter hidden sm:block">Imagine & Stamp</h1>
                    </div>

                    {/* Redes Sociales Ã¢â‚¬â€  a la derecha del nombre */}
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
                        href="https://www.tiktok.com/@TU_USUARIO_AQUI"
                        target="_blank" rel="noreferrer"
                        title="TikTok"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-primary/40 hover:text-black hover:bg-gray-100 transition-all"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
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
                      className={`relative w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all ${showOnlyFavorites ? 'bg-accent-magenta text-white shadow-lg shadow-accent-magenta/30' : 'bg-primary/5 text-primary/40 hover:bg-accent-magenta/10 hover:text-accent-magenta'}`}
                      title="Mis Favoritos"
                      onClick={() => {
                        setShowOnlyFavorites(!showOnlyFavorites);
                        if (!showOnlyFavorites) {
                          setSelectedCategory('all');
                          setSearchQuery('');
                        }
                      }}
                    >
                      <Heart size={22} fill={showOnlyFavorites ? "currentColor" : favorites.length > 0 ? "rgba(255, 0, 255, 0.1)" : "none"} />
                      {favorites.length > 0 && (
                        <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white ${showOnlyFavorites ? 'bg-white text-accent-magenta' : 'bg-accent-magenta text-white'}`}>
                          {favorites.length}
                        </span>
                      )}
                    </div>
                    <CartButton />
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
                  <div className="mb-10 relative">
                    <div className={`relative flex items-center bg-white rounded-2xl px-5 py-4 shadow-sm border transition-all ${isSearchFocused ? 'border-secondary ring-4 ring-secondary/5' : 'border-primary/10'}`}>
                      <Search className={`${isSearchFocused ? 'text-secondary' : 'text-primary/40'} mr-3`} size={20} />
                      <input 
                        id="main-search"
                        value={searchQuery}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none focus:outline-none w-full text-sm font-medium" 
                        placeholder="Busca productos, categorÃƒÂ­as, o palabras clave..." 
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="p-1 hover:bg-primary/5 rounded-full transition-colors"
                        >
                          <X size={16} className="text-primary/40" />
                        </button>
                      )}
                    </div>

                    {/* Sugerencias de bÃƒÂºsqueda instantÃƒÂ¡neas */}
                    <AnimatePresence>
                      {isSearchFocused && searchQuery.trim().length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-primary/5 z-[60] overflow-hidden"
                        >
                          <div className="p-2 max-h-[300px] overflow-y-auto">
                            {filteredProducts.length > 0 ? (
                              <div className="grid grid-cols-1 gap-1">
                                {filteredProducts.slice(0, 6).map((product) => (
                                  <button
                                    key={product.id}
                                    onClick={() => {
                                      setSearchQuery(product.name);
                                      setIsSearchFocused(false);
                                      const element = document.getElementById(`product-${product.id}`);
                                      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }}
                                    className="flex items-center gap-3 p-3 hover:bg-primary/5 rounded-xl transition-all text-left group"
                                  >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-primary/5">
                                      <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-primary truncate group-hover:text-secondary">{product.name}</p>
                                      <p className="text-[10px] text-primary/40 font-black uppercase tracking-widest">${product.price} MXN</p>
                                    </div>
                                    <ChevronRight size={16} className="text-primary/20 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                                  </button>
                                ))}
                                {filteredProducts.length > 6 && (
                                  <div className="p-3 text-center border-t border-primary/5">
                                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">
                                      Y {filteredProducts.length - 6} resultados mÃƒÂ¡s...
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="p-8 text-center">
                                <Search size={32} className="mx-auto text-primary/10 mb-2" />
                                <p className="text-sm font-bold text-primary/40">No se encontraron coincidencias</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mb-6 flex justify-between items-center px-2">
                    <button 
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="flex items-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary font-bold py-2 px-4 rounded-xl transition-all"
                    >
                      <LayoutGrid size={18} />
                      {isCategoryOpen ? 'Ocultar CategorÃƒÂ­as' : 'Mostrar CategorÃƒÂ­as y Filtros'}
                    </button>
                  </div>
                  
                  <div className="mb-8">
                    <CategoryMenu
                      isCategoryOpen={isCategoryOpen}
                      setIsCategoryOpen={setIsCategoryOpen}
                      activeCategory={selectedCategory}
                      setActiveCategory={setSelectedCategory}
                      activeBadgeFilter={activeBadgeFilter}
                      setActiveBadgeFilter={setActiveBadgeFilter}
                    />
                  </div>

                  <section className="mb-16">
                    <h3 className="font-headline font-bold text-lg mb-4 text-primary flex items-center gap-2">
                      <span className="w-8 h-1 bg-secondary rounded-full"></span>
                      Nuestros Servicios
                    </h3>
                    {/* Contenedor con degradado para indicar scroll horizontal en mÃƒÂ³vil */}
                    <div className="relative">
                      <div className="flex items-start gap-6 md:gap-8 overflow-x-auto hide-scrollbar py-4 px-4">
                        {categories.map((cat) => (
                          <div 
                            key={cat.id} 
                            onClick={() => { 
                              setSelectedCategory(cat.id); 
                              setSelectedSubcategory('');
                              setSelectedSubcategory2('');
                            }} 
                            className="flex flex-col items-center gap-2 md:gap-3 shrink-0 cursor-pointer group"
                          >
                            {/* CÃƒÂ­rculo: pequeÃƒÂ±o en mÃƒÂ³vil, grande en escritorio */}
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
                            <span className={`text-[9.5px] md:text-[11px] font-black uppercase tracking-wider text-center w-max max-w-[95px] md:max-w-[160px] leading-tight break-keep ${selectedCategory === cat.id ? 'text-primary' : 'text-primary/40'}`}>
                              {cat.name}
                            </span>
                          </div>
                        ))}
                        {/* Espaciado final para que el degradado no tape el ÃƒÂºltimo ÃƒÂ­tem */}
                        <div className="shrink-0 w-4" />
                      </div>
                      {/* Degradado derecho Ã¢â‚¬â€  indica que hay mÃƒÂ¡s categorÃƒÂ­as */}
                      <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-background to-transparent" />
                    </div>

                    <AnimatePresence mode="wait">
                      {showOnlyFavorites && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-accent-magenta/5 border border-accent-magenta/20 rounded-2xl p-4 mb-6 flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent-magenta flex items-center justify-center text-white">
                              <Heart size={20} fill="currentColor" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-accent-magenta">Viendo tus favoritos</p>
                              <p className="text-[10px] font-medium text-accent-magenta/60 uppercase tracking-widest">
                                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} guardado{filteredProducts.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setShowOnlyFavorites(false)}
                            className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-accent-magenta/30 text-accent-magenta rounded-xl hover:bg-accent-magenta hover:text-white transition-all"
                          >
                            Ver todo
                          </button>
                        </motion.div>
                      )}

                      {selectedCategory !== 'all' && !showOnlyFavorites && (
                        <motion.div
                          key={selectedCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          className="mt-8 p-6 bg-white rounded-3xl border border-primary/5 shadow-sm mx-2"
                        >
                          {/* SubcategorÃƒÂ­a Nivel 1 */}
                          <p className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] mb-3">SubcategorÃƒÂ­a</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {(() => {
                              const cat = categories.find(c => c.id === selectedCategory);
                              if (!cat) return null;
                              const subs = normalizeSubs(cat.submenus || []);
                              if (subs.length === 0) return <span className="text-xs text-primary/20 italic">Sin subcategorÃƒÂ­as</span>;
                              return subs.map((sub: any) => {
                                const isActive = selectedSubcategory.toLowerCase() === sub.name.toLowerCase();
                                return (
                                  <button
                                    key={sub.name}
                                    onClick={() => { setSelectedSubcategory(isActive ? '' : sub.name); setSelectedSubcategory2(''); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                                      isActive ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20' : 'bg-white text-primary/60 border-primary/10 hover:border-secondary/40 hover:text-primary'
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : cat.dotColor}`} />
                                    {sub.name}
                                    {isActive && <span className="ml-1 text-white/80">Ã¢Å“â€¢</span>}
                                  </button>
                                );
                              });
                            })()}
                          </div>

                          {/* SubcategorÃƒÂ­a Nivel 2 (solo si hay sub-1 seleccionada) */}
                          {selectedSubcategory && (() => {
                            const cat = categories.find(c => c.id === selectedCategory);
                            if (!cat) return null;
                            const sub = normalizeSubs(cat.submenus || []).find((s: any) => s.name.toLowerCase() === selectedSubcategory.toLowerCase());
                            if (!sub || !sub.children || sub.children.length === 0) return null;
                            return (
                              <div className="mt-3 pt-3 border-t border-primary/5">
                                <p className="text-[9px] font-black text-primary/20 uppercase tracking-[0.2em] mb-2">Tipo</p>
                                <div className="flex flex-wrap gap-2">
                                  {sub.children.map((child: string) => {
                                    const isActive2 = selectedSubcategory2.toLowerCase() === child.toLowerCase();
                                    return (
                                      <button
                                        key={child}
                                        onClick={() => setSelectedSubcategory2(isActive2 ? '' : child)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                          isActive2 ? 'bg-primary text-white border-primary' : 'bg-background text-primary/50 border-primary/10 hover:border-primary/30'
                                        }`}
                                      >
                                        {child}
                                        {isActive2 && <span className="ml-1">Ã¢Å“â€¢</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}

                          {(selectedSubcategory || selectedSubcategory2) && (
                            <p className="text-[10px] text-secondary font-black uppercase tracking-widest mt-4 px-1">
                              Mostrando: {selectedSubcategory}{selectedSubcategory2 ? ` Ã¢â‚¬Âº ${selectedSubcategory2}` : ''} ({filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''})
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>

                  <div className="masonry-grid">
                    <AnimatePresence mode="popLayout">
                      {filteredProducts.slice(0, visibleItems).map((product) => (
                        <motion.div
                          key={product.id} id={`product-${product.id}`} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                          className="masonry-item group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all"
                        >
                          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                            <img alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-110" src={product.image} />
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                              className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                                favorites.includes(product.id)
                                  ? 'bg-accent-magenta text-white'
                                  : 'bg-white/90 text-accent-magenta hover:scale-110'
                              }`}
                            >
                              <Heart size={20} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
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

                    {/* Botón "Ver más" - solo si hay más productos por mostrar */}
                    {visibleItems < filteredProducts.length && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="col-span-full mt-12 flex justify-center"
                      >
                        <button
                          onClick={() => setVisibleItems(prev => prev + 10)}
                          className="px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-md hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-2"
                        >
                          <Plus size={18} />
                          Ver más productos ({filteredProducts.length - visibleItems} disponibles)
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </main>

              {/* Ã¢â€ â‚¬Ã¢â€ â‚¬ TOAST: Producto agregado Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬Ã¢â€ â‚¬ */}
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
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Ã‚Â¡Agregado al carrito!</p>
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

              <GlobalFooter />

              <div className="fixed bottom-8 right-6 z-50 flex flex-col gap-4 items-end">
                <motion.a
                  href="https://wa.me/525650469993?text=Hola,%20vengo%20de%20la%20página%20web%20y%20quiero%20cotizar" target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }}
                  onClick={() => trackMetaEvent('Contact')}
                  className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-full shadow-2xl"
                >
                  <span className="font-bold text-sm">¡Cotiza aquí!</span>
                  <MessageCircle size={28} fill="currentColor" />
                </motion.a>
              </div>

              <CartDrawer bankInfo={bankInfo} />

              {/* MODAL RESULTADO DE PAGO (regreso de Mercado Pago) */}
              <AnimatePresence>
                {paymentResult && (
                  <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.95, opacity: 0, y: 20 }}
                      className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full border border-primary/10 shadow-2xl relative text-center"
                    >
                      {paymentResult.status === 'exito' ? (
                        <>
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-600">
                            <Check size={32} />
                          </div>
                          <h3 className="text-primary text-xl font-black uppercase mb-2">Ã‚Â¡Pago Aprobado!</h3>
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 mt-2">
                            <p className="text-amber-600 font-bold text-xs mb-1 uppercase tracking-wider flex items-center justify-center gap-1">
                              Ã¢Å¡Â Ã¯Â¸Â  Paso Final Obligatorio
                            </p>
                            <p className="text-primary/70 text-xs">Para que preparemos tu pedido, <strong className="text-primary">DEBES ENVIARLO</strong> haciendo clic en el botÃƒÂ³n verde de WhatsApp aquÃƒÂ­ abajo.</p>
                          </div>
                        </>
                      ) : paymentResult.status === 'pendiente' ? (
                        <>
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-500">
                            <ShoppingBag size={32} />
                          </div>
                          <h3 className="text-primary text-xl font-black uppercase mb-2">Pago Pendiente</h3>
                          <p className="text-primary/60 text-sm mb-6">Tu pago estÃƒÂ¡ siendo procesado. AvÃƒÂ­sanos por WhatsApp para darle seguimiento.</p>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-500">
                            <X size={32} />
                          </div>
                          <h3 className="text-primary text-xl font-black uppercase mb-2">Pago no completado</h3>
                          <p className="text-primary/60 text-sm mb-6">No pudimos procesar tu pago. Puedes intentarlo de nuevo o contactarnos por WhatsApp.</p>
                        </>
                      )}

                      <div className="flex flex-col gap-3">
                        {paymentResult.whatsappMessage && (
                          <a
                            href={`https://wa.me/525650469993?text=${paymentResult.whatsappMessage}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setPaymentResult(null)}
                            className="w-full py-4 bg-[#25D366] text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-lg shadow-[#25D366]/30 hover:bg-[#1EBE5D] transition-colors flex items-center justify-center gap-2"
                          >
                            <MessageCircle size={18} /> Enviar pedido por WhatsApp
                          </a>
                        )}
                        <button
                          onClick={() => setPaymentResult(null)}
                          className="w-full py-3 bg-primary/5 text-primary font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-primary/10 transition-colors"
                        >
                          Cerrar
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </ErrorBoundary>
        } />
        <Route path="/demo-menu" element={<DemoMenu />} />

        <Route path="/etiquetas-escolares" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" /></div>}><CatalogoEtiquetas /></Suspense></ErrorBoundary>} />
        <Route path="/candymar" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" /></div>}><CandymarMenu /></Suspense></ErrorBoundary>} />
        {/* <Route path="/amelie-patisserie" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a896]" /></div>}><AmeliePatisserieMenu /></Suspense></ErrorBoundary>} /> */}
        <Route path="/la-cazona" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div>}><LaCazonaMenu /></Suspense></ErrorBoundary>} />
        <Route path="/la-michoacana" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" /></div>}><LaMichoacanaMenu /></Suspense></ErrorBoundary>} />
        <Route path="/gaoli-pizza" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" /></div>}><GaoliPizzaMenu /></Suspense></ErrorBoundary>} />
        <Route path="/admin" element={<ErrorBoundary><AdminPanel /></ErrorBoundary>} />
      </Routes>
    </HashRouter>
  );
}

