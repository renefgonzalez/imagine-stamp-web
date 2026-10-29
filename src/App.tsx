import React, { useState, useMemo, useEffect, useRef, ErrorInfo, ReactNode, Component, Suspense } from 'react';
import { supabase } from './lib/supabase';
import { 
  Search, Heart, Plus, Sparkles, X, ShoppingBag,
  ChevronRight, Instagram, Facebook, Mail as MailIcon,
  PartyPopper, Gift, Briefcase, LayoutGrid, Lock, MessageCircle,
  Landmark, Copy, Check, CreditCard, RefreshCw
} from 'lucide-react';
import { useAutoUpdate } from './hooks/useAutoUpdate';
import { motion, AnimatePresence } from 'motion/react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Product } from './data/products';
import logo from './logo.webp';
// Carga diferida: la portada no los necesita al abrir (velocidad en celular)
const DemoMenu = React.lazy(() => import('./modules/demo-menu/pages/DemoMenu'));
const ContactCard = React.lazy(() => import('./pages/ContactCard'));
const AdminPanel = React.lazy(() => import('./AdminPanel'));
import HomePage from './pages/HomePage';

const CatalogoEtiquetas = React.lazy(() => import('./modules/etiquetas-escolares/pages/CatalogoEtiquetas'));
const TarjetaBarberia = React.lazy(() => import('./modules/tarjeta-barberia/pages/TarjetaBarberia'));
const TarjetaVeterinaria = React.lazy(() => import('./modules/tarjeta-veterinaria/pages/TarjetaVeterinaria'));
const LabalMenu = React.lazy(() => import('./modules/labal/pages/LabalMenu'));
const DemoVideo = React.lazy(() => import('./modules/demo-video/pages/DemoVideo'));
const VideoInvitaciones = React.lazy(() => import('./modules/video-invitaciones/pages/VideoInvitaciones'));
const GoWingsGoMenu = React.lazy(() => import('./modules/go-wings-go/pages/GoWingsGoMenu'));
const BrothersPizzaMenu = React.lazy(() => import('./modules/brothers-pizza/pages/BrothersPizzaMenu'));
const BurgaslocasMenu = React.lazy(() => import('./modules/burgaslocas/pages/BurgaslocasMenu'));
const AaahCarbonMenu = React.lazy(() => import('./modules/aaah-carbon/pages/AaahCarbonMenu'));
const PincheCheMenu = React.lazy(() => import('./modules/pinche-che/pages/PincheCheMenu'));
const MesaJarochaMenu = React.lazy(() => import('./modules/mesa-jarocha/pages/MesaJarochaMenu'));
const LaCuevaDelLoboMenu = React.lazy(() => import('./modules/la-cueva-del-lobo/pages/LaCuevaDelLoboMenu'));
const CandymarMenu = React.lazy(() => import('./modules/candymar/pages/CandymarMenu'));
const StrongGymMenu = React.lazy(() => import('./modules/strong-gym/pages/StrongGymMenu'));
const IronPlan = React.lazy(() => import('./modules/iron-plan/pages/IronPlan'));

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
  // Helper: normaliza submenus viejos (string[]) al formato nuevo ({name,children}[])
  const normalizeSubs = (subs: any[]): {name:string; children:string[]}[] => {
    if (!subs || subs.length === 0) return [];
    if (typeof subs[0] === 'string') return subs.map((s: string) => ({ name: s, children: [] }));
    return subs;
  };

  const { cartToast, setCartToast, openCart, addToCart } = useCartStore();
  const { hasUpdate, applyUpdate } = useAutoUpdate();

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
    try {
      const saved = localStorage.getItem('imagine_stamp_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [visibleItems, setVisibleItems] = useState(10);

  useEffect(() => {
    try {
      localStorage.setItem('imagine_stamp_favorites', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  // Reiniciar paginación cuando cambia categoría o búsqueda
  useEffect(() => {
    setVisibleItems(10);
  }, [selectedCategory, searchQuery, selectedSubcategory, selectedSubcategory2]);



  // ═══════════════════════ CARGAR DATOS DESDE SUPABASE ═══════════════════════
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
      // Filtrar por subcategoría 1
      if (selectedSubcategory) {
        result = result.filter(p => {
          const sub = (p.sub_category || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const sel = selectedSubcategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return sub.includes(sel) || sel.includes(sub);
        });
      }
      // Filtrar por subcategoría 2
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

  const toggleFavorite = (productId: string | number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };


  // ═════════════ CONFIRMAR PAGO AL REGRESAR DE MERCADO PAGO ═════════════
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

    let savedMessage = null;
    try {
      savedMessage = localStorage.getItem('imagine-pending-whatsapp');
      localStorage.removeItem('imagine-pending-whatsapp');
    } catch (e) {}

    // Agregar el texto de confirmación al mensaje si el pago fue exitoso
    if (savedMessage && pago === 'exito' && status === 'approved') {
      try {
        const decoded = decodeURIComponent(savedMessage);
        const confirmationText = `\n\n✅ *PAGO EN LÍNEA CONFIRMADO*\nFolio MP: ${paymentId || 'Aprobado'}\n`;
        savedMessage = encodeURIComponent(decoded + confirmationText);
      } catch (e) {
        console.error("Error decoding whatsapp message", e);
      }
    }

    setPaymentResult({ status: pago, whatsappMessage: savedMessage });

    // Limpiar los parámetros de la URL para que no se repita el aviso al recargar
    window.history.replaceState({}, '', window.location.pathname + window.location.hash);
  }, []);

  const homeElement = (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        <HomePage 
          products={products}
          categories={categories}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          addToCart={addToCart}
        />

        {/* TOAST: Producto agregado */}
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

        {/* Botón flotante WhatsApp */}
        <div className="fixed bottom-8 right-6 z-50 flex flex-col gap-4 items-end">
          <motion.a
            href="https://wa.me/525650469993?text=Hola,%20vengo%20de%20la%20página%20web%20y%20quiero%20cotizar" target="_blank" rel="noreferrer" whileHover={{ scale: 1.05 }}
            onClick={() => trackMetaEvent('Contact')}
            className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-3.5 rounded-full shadow-2xl hover:bg-[#1EBE5D] transition-all"
          >
            <span className="font-bold text-xs uppercase tracking-wider hidden sm:inline">¡Cotizar por WhatsApp!</span>
            <MessageCircle size={26} fill="currentColor" />
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
                    <h3 className="text-primary text-xl font-black uppercase mb-2">¡Pago Aprobado!</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 mt-2">
                      <p className="text-amber-600 font-bold text-xs mb-1 uppercase tracking-wider flex items-center justify-center gap-1">
                        ⚠️ Paso Final Obligatorio
                      </p>
                      <p className="text-primary/70 text-xs">Para que preparemos tu pedido, <strong className="text-primary">DEBES ENVIARLO</strong> haciendo clic en el botón verde de WhatsApp aquí abajo.</p>
                    </div>
                  </>
                ) : paymentResult.status === 'pendiente' ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-500">
                      <ShoppingBag size={32} />
                    </div>
                    <h3 className="text-primary text-xl font-black uppercase mb-2">Pago Pendiente</h3>
                    <p className="text-primary/60 text-sm mb-6">Tu pago está siendo procesado. Avísanos por WhatsApp para darle seguimiento.</p>
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
  );

  return (
    <HashRouter>
      {/* Banner flotante discreto de Auto-Update si hay pedido en curso */}
      <AnimatePresence>
        {hasUpdate && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[92vw]"
          >
            <div className="bg-zinc-900/95 backdrop-blur-md text-white border border-white/10 shadow-2xl rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-2.5 w-2.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-medium truncate text-white/90">Cambios nuevos disponibles</span>
              </div>
              <button
                onClick={applyUpdate}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-3 py-1.5 rounded-xl text-[11px] shrink-0 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <RefreshCw size={13} />
                Actualizar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={homeElement} />
        <Route path="/apps" element={homeElement} />
        <Route path="/aplicaciones" element={homeElement} />
        <Route path="/webs" element={homeElement} />
        <Route path="/menus" element={homeElement} />
        <Route path="/tarjetas" element={homeElement} />
        <Route path="/taller" element={homeElement} />
        <Route path="/faq" element={homeElement} />
        <Route path="/preguntas" element={homeElement} />
        <Route path="/demo-menu" element={<Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>}><DemoMenu /></Suspense>} />
        <Route path="/contacto" element={<Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>}><ContactCard /></Suspense>} />
        <Route path="/tarjeta" element={<Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>}><ContactCard /></Suspense>} />

        <Route path="/etiquetas-escolares" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" /></div>}><CatalogoEtiquetas /></Suspense></ErrorBoundary>} />
        <Route path="/tarjeta-barberia" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#f59e0b' }} /></div>}><TarjetaBarberia /></Suspense></ErrorBoundary>} />
        <Route path="/tarjeta-digital" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#f59e0b' }} /></div>}><TarjetaBarberia /></Suspense></ErrorBoundary>} />
        <Route path="/tarjeta-veterinaria" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#14b8a6' }} /></div>}><TarjetaVeterinaria /></Suspense></ErrorBoundary>} />
        <Route path="/tarjeta-vet" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#14b8a6' }} /></div>}><TarjetaVeterinaria /></Suspense></ErrorBoundary>} />
        <Route path="/labal" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#000000' }} /></div>}><LabalMenu /></Suspense></ErrorBoundary>} />
        <Route path="/demo-video" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" /></div>}><DemoVideo /></Suspense></ErrorBoundary>} />
        <Route path="/video-demo" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" /></div>}><DemoVideo /></Suspense></ErrorBoundary>} />
        {/* <Route path="/amelie-patisserie" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a896]" /></div>}><AmeliePatisserieMenu /></Suspense></ErrorBoundary>} /> */}

        <Route path="/videoinvitaciones" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" /></div>}><VideoInvitaciones /></Suspense></ErrorBoundary>} />
        <Route path="/video-invitaciones" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" /></div>}><VideoInvitaciones /></Suspense></ErrorBoundary>} />
        <Route path="/invitaciones" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" /></div>}><VideoInvitaciones /></Suspense></ErrorBoundary>} />
        <Route path="/invitaciones-3d" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" /></div>}><VideoInvitaciones /></Suspense></ErrorBoundary>} />



        <Route path="/go-wings-go" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0D0C0B]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4816]" /></div>}><GoWingsGoMenu /></Suspense></ErrorBoundary>} />
        <Route path="/gowingsgo" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0D0C0B]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4816]" /></div>}><GoWingsGoMenu /></Suspense></ErrorBoundary>} />

        <Route path="/brothers-pizza" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0F0E0D]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D48]" /></div>}><BrothersPizzaMenu /></Suspense></ErrorBoundary>} />
        <Route path="/brotherspizza" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0F0E0D]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E11D48]" /></div>}><BrothersPizzaMenu /></Suspense></ErrorBoundary>} />

        <Route path="/burgaslocas" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0F0E0D]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF381E]" /></div>}><BurgaslocasMenu /></Suspense></ErrorBoundary>} />

        <Route path="/aaah-carbon" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#121110]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6A00]" /></div>}><AaahCarbonMenu /></Suspense></ErrorBoundary>} />
        <Route path="/aaahcarbon" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#121110]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6A00]" /></div>}><AaahCarbonMenu /></Suspense></ErrorBoundary>} />

        <Route path="/pinche-che" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#141210]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E0531B]" /></div>}><PincheCheMenu /></Suspense></ErrorBoundary>} />
        <Route path="/pincheche" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#141210]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E0531B]" /></div>}><PincheCheMenu /></Suspense></ErrorBoundary>} />

        <Route path="/mesa-jarocha" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#07111E]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0084C7]" /></div>}><MesaJarochaMenu /></Suspense></ErrorBoundary>} />
        <Route path="/mesajarocha" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#07111E]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0084C7]" /></div>}><MesaJarochaMenu /></Suspense></ErrorBoundary>} />

        <Route path="/la-cueva-del-lobo" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0E0D0B]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E08722]" /></div>}><LaCuevaDelLoboMenu /></Suspense></ErrorBoundary>} />
        <Route path="/lacuevadellobo" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0E0D0B]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E08722]" /></div>}><LaCuevaDelLoboMenu /></Suspense></ErrorBoundary>} />
        <Route path="/cueva-del-lobo" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0E0D0B]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E08722]" /></div>}><LaCuevaDelLoboMenu /></Suspense></ErrorBoundary>} />

        <Route path="/candymar" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#1c1c1c]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00e5ff]" /></div>}><CandymarMenu /></Suspense></ErrorBoundary>} />
        <Route path="/candymarmenu" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#1c1c1c]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00e5ff]" /></div>}><CandymarMenu /></Suspense></ErrorBoundary>} />
        <Route path="/candymar-menu" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#1c1c1c]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00e5ff]" /></div>}><CandymarMenu /></Suspense></ErrorBoundary>} />

        <Route path="/strong-gym" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0A0A0A]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50914]" /></div>}><StrongGymMenu /></Suspense></ErrorBoundary>} />
        <Route path="/stronggym" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0A0A0A]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50914]" /></div>}><StrongGymMenu /></Suspense></ErrorBoundary>} />
        <Route path="/strong-gym-ironcity" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0A0A0A]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50914]" /></div>}><StrongGymMenu /></Suspense></ErrorBoundary>} />
          <Route path="/iron-plan" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0A0A0A]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50914]" /></div>}><IronPlan /></Suspense></ErrorBoundary>} />
          <Route path="/strong-gym-rutinas" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] bg-[#0A0A0A]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50914]" /></div>}><IronPlan /></Suspense></ErrorBoundary>} />

        <Route path="/admin" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>}><AdminPanel /></Suspense></ErrorBoundary>} />
        {/* Fallback universal: previene cualquier pantalla en blanco */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
