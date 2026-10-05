// ═══════════════════════════════════════════════════════════════════════════
// BROTHERS PIZZA — Menú Digital Interactivo · Casera y con Mucho Queso 🍕🔥
// ═══════════════════════════════════════════════════════════════════════════
// Identidad visual de horno de piedra, salsa pomodoro y queso fundido:
// #E11D48 Carmesí, #F59E0B Dorado Queso, #0F0E0D Carbón / Horno
// Cumplimiento estricto del Checklist de Auditoría de Imagine & Stamp

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, X, ShoppingBag, Flame, Pizza, LayoutGrid, Star,
  Sparkles, Phone, MapPin, Clock, Instagram, Facebook, MessageCircle,
  ArrowUp, Shield, ChevronRight, Check, UtensilsCrossed, Heart,
  Slice, Bike, Store, Award, CheckCircle2, CupSoda
} from 'lucide-react';
import {
  clientConfig,
  bankInfo,
  SIZES_ESPECIALIDADES,
  SIZES_4_A_6,
  SIZES_2_A_3,
  SIZES_1_INGREDIENTE
} from '../config';
import { Product, CartItem, CategoryId } from '../types';
import CustomizeModal from '../components/CustomizeModal';
import CartDrawer from '../components/CartDrawer';

// Assets locales
import logoBrothersPizza from '../assets/logo-brothers-pizza.webp';
import heroCover from '../assets/hero-cover.webp';
import pizzaCloseUp from '../assets/pizza-close-up.webp';
import pizzaSupremaCrop from '../assets/pizza-suprema-crop.webp';
import pizzaEspecialCrop from '../assets/pizza-especial-crop.webp';

// ═══════════════════ CATÁLOGO OFICIAL BROTHERS PIZZA ═══════════════════
const PRODUCTS: Product[] = [
  // ── 1. ESPECIALIDADES ($195 / $295 / $390) ──
  {
    id: 'esp-chilorio',
    name: 'Pizza Chilorio',
    description: 'Auténtico chilorio norteño deshebrado, cebolla caramelizada, champiñones frescos, pimiento verde crujiente, salchicha y piña asada.',
    price: 195,
    category: 'especialidades',
    image: pizzaEspecialCrop,
    featured: true,
    badge: 'Favorita ⭐',
    sizes: SIZES_ESPECIALIDADES,
    ingredientsList: ['Chilorio', 'Cebolla', 'Champiñón', 'Pimiento', 'Salchicha', 'Piña'],
  },
  {
    id: 'esp-calzone',
    name: 'Calzone Brothers Relleno',
    description: 'Pizza cerrada con dos capas de masa artesanal horneada a la perfección, rellena con doble queso mozzarella, jamón, champiñones, pepperoni, pimiento, cebolla, piña y chorizo.',
    price: 195,
    category: 'especialidades',
    image: pizzaCloseUp,
    featured: true,
    badge: 'Especial de la Casa',
    sizes: SIZES_ESPECIALIDADES,
    ingredientsList: ['Jamón', 'Champiñón', 'Pepperoni', 'Pimiento', 'Cebolla', 'Piña', 'Chorizo'],
  },
  {
    id: 'esp-pizzadog',
    name: 'Pizza Dog Especial',
    description: 'Original creación: rebanadas de salchicha de primera, tocino crujiente, cebolla, jitomate picado, jalapeños toreados, mayonesa suave y toque de mostaza.',
    price: 195,
    category: 'especialidades',
    image: pizzaSupremaCrop,
    badge: 'Estilo Único',
    sizes: SIZES_ESPECIALIDADES,
    ingredientsList: ['Salchicha', 'Tocino', 'Cebolla', 'Jitomate', 'Jalapeño', 'Mayonesa y Mostaza'],
  },
  {
    id: 'esp-disada',
    name: 'Pizza Disada Norteña',
    description: 'La consentida de los carnívoros: jamón de pierna, tocino doradito, salchicha, chorizo norteño bien sazonado y pimiento morrón verde sobre mozzarella.',
    price: 195,
    category: 'especialidades',
    sizes: SIZES_ESPECIALIDADES,
    ingredientsList: ['Jamón', 'Tocino', 'Salchicha', 'Chorizo', 'Pimiento Morrón'],
  },
  {
    id: 'esp-pastor',
    name: 'Pizza al Pastor con Queso',
    description: 'Carne al pastor marinada con adobo casero de chiles y especias, cebollitas asadas, cilantro fresco picado y piña dulce asada con mucho queso fundido.',
    price: 195,
    category: 'especialidades',
    image: pizzaCloseUp,
    featured: true,
    badge: 'Top Ventas 🔥',
    sizes: SIZES_ESPECIALIDADES,
    ingredientsList: ['Pastor', 'Cebolla', 'Cilantro', 'Piña'],
  },

  // ── 2. 4 A 6 INGREDIENTES ($180 / $280 / $385) ──
  {
    id: '46-mexicana',
    name: 'Pizza Mexicana',
    description: 'Sabor nacional con chorizo ranchero sazonado, tocino crujiente, chiles jalapeños toreados y cebolla fileteada sobre cama de mozzarella derretido.',
    price: 180,
    category: '4-a-6-ingredientes',
    image: pizzaSupremaCrop,
    featured: true,
    badge: 'Picosita 🌶️',
    sizes: SIZES_4_A_6,
    ingredientsList: ['Chorizo', 'Tocino', 'Jalapeño', 'Cebolla'],
  },
  {
    id: '46-carnes-frias',
    name: 'Pizza Carnes Frías Suprema',
    description: 'Festín carnívoro con jamón de pierna, salchicha en rodajas, chorizo artesanal y abundante pepperoni americano crujiente con extra queso.',
    price: 180,
    category: '4-a-6-ingredientes',
    image: pizzaCloseUp,
    featured: true,
    badge: 'Más Pedida',
    sizes: SIZES_4_A_6,
    ingredientsList: ['Jamón', 'Salchicha', 'Chorizo', 'Pepperoni'],
  },
  {
    id: '46-ranchera',
    name: 'Pizza Ranchera',
    description: 'Chorizo selecto, tocino ahumado crocante, champiñones frescos salteados, pimiento morrón y cebolla dorada al horno.',
    price: 180,
    category: '4-a-6-ingredientes',
    sizes: SIZES_4_A_6,
    ingredientsList: ['Chorizo', 'Tocino', 'Champiñón', 'Pimiento', 'Cebolla'],
  },
  {
    id: '46-vigilia',
    name: 'Pizza Vigilia (Del Mar)',
    description: 'Atún seleccionado de lomo claro, champiñones rebanados, pimiento morrón fresco, piña miel dulce y cebolla morada acitronada.',
    price: 180,
    category: '4-a-6-ingredientes',
    sizes: SIZES_4_A_6,
    ingredientsList: ['Atún', 'Champiñón', 'Pimiento', 'Piña', 'Cebolla Morada'],
  },
  {
    id: '46-estravaganza',
    name: 'Pizza Estravaganza',
    description: 'Explosión de sabor: pepperoni americano, chorizo norteño, pimiento morrón verde, piña en trocitos dulces y cebolla morada finamente picada.',
    price: 180,
    category: '4-a-6-ingredientes',
    image: pizzaSupremaCrop,
    sizes: SIZES_4_A_6,
    ingredientsList: ['Pepperoni', 'Chorizo', 'Pimiento', 'Piña', 'Cebolla Morada'],
  },
  {
    id: '46-pepperoni-suprema',
    name: 'Pepperoni Suprema',
    description: 'Para los auténticos amantes del pepperoni: capa extra de pepperoni crujiente combinada con chorizo, pimiento morrón, piña y cebolla morada.',
    price: 180,
    category: '4-a-6-ingredientes',
    sizes: SIZES_4_A_6,
    badge: 'Suprema',
    ingredientsList: ['Pepperoni', 'Chorizo', 'Pimiento', 'Piña', 'Cebolla Morada'],
  },

  // ── 3. 2 A 3 INGREDIENTES ($159 / $240 / $340) ──
  {
    id: '23-hawaiana',
    name: 'Hawaiana Clásica con Cereza',
    description: 'La favorita de chicos y grandes: generosa porción de jamón de pierna, piña miel jugosa y un toque distintivo de cerezas marrasquino con queso mozzarella.',
    price: 159,
    category: '2-a-3-ingredientes',
    image: pizzaEspecialCrop,
    featured: true,
    badge: 'Clásica ⭐',
    sizes: SIZES_2_A_3,
    ingredientsList: ['Jamón', 'Piña', 'Cereza'],
  },
  {
    id: '23-casual',
    name: 'Pizza Casual',
    description: 'Combinación ligera y deliciosa: jamón horneado y champiñones frescos rebanados salteados con orégano y mozzarella fundido.',
    price: 159,
    category: '2-a-3-ingredientes',
    sizes: SIZES_2_A_3,
    ingredientsList: ['Jamón', 'Champiñón'],
  },
  {
    id: '23-mister-bro',
    name: 'Mister Bro Pizza',
    description: 'La firma de la casa: combinación adictiva de chorizo norteño, pepperoni americano bien doradito y piña miel caramelizada.',
    price: 159,
    category: '2-a-3-ingredientes',
    image: pizzaCloseUp,
    featured: true,
    badge: 'Recomendación Bro 🔥',
    sizes: SIZES_2_A_3,
    ingredientsList: ['Chorizo', 'Pepperoni', 'Piña'],
  },
  {
    id: '23-pepper-bro',
    name: 'Pepper Bro',
    description: 'El balance perfecto: abundante pepperoni crujiente y champiñones frescos fileteados sobre salsa pomodoro artesanal.',
    price: 159,
    category: '2-a-3-ingredientes',
    sizes: SIZES_2_A_3,
    ingredientsList: ['Pepperoni', 'Champiñón'],
  },
  {
    id: '23-salchi-toci',
    name: 'Salchi y Toci',
    description: 'Doble delicia: rodajas de salchicha asadas con trocitos de tocino ahumado extra crujiente y queso mozzarella derretido.',
    price: 159,
    category: '2-a-3-ingredientes',
    sizes: SIZES_2_A_3,
    ingredientsList: ['Salchicha', 'Tocino'],
  },

  // ── 4. 1 INGREDIENTE ($140 / $200 / $310) ──
  {
    id: '1-pepperoni',
    name: 'Pizza de Pepperoni',
    description: 'El clásico indiscutible: abundante pepperoni americano crujiente con borde dorado y queso mozzarella 100% fundido.',
    price: 140,
    category: '1-ingrediente',
    image: pizzaSupremaCrop,
    featured: true,
    badge: 'Favorita',
    sizes: SIZES_1_INGREDIENTE,
    ingredientsList: ['Pepperoni'],
  },
  {
    id: '1-jamon',
    name: 'Pizza de Jamón',
    description: 'Delicioso jamón de pierna horneado en cubos sobre salsa de tomate de la casa y mucho queso mozzarella.',
    price: 140,
    category: '1-ingrediente',
    sizes: SIZES_1_INGREDIENTE,
    ingredientsList: ['Jamón'],
  },
  {
    id: '1-champinon',
    name: 'Pizza de Champiñones',
    description: 'Champiñones frescos salteados a la perfección con finas hierbas y mozzarella derretido.',
    price: 140,
    category: '1-ingrediente',
    sizes: SIZES_1_INGREDIENTE,
    ingredientsList: ['Champiñón'],
  },
  {
    id: '1-tocino',
    name: 'Pizza de Tocino Crujiente',
    description: 'Tiras de tocino ahumado doraditas en el horno de piedra con extra queso derretido.',
    price: 140,
    category: '1-ingrediente',
    sizes: SIZES_1_INGREDIENTE,
    ingredientsList: ['Tocino'],
  },
  {
    id: '1-chorizo',
    name: 'Pizza de Chorizo',
    description: 'Chorizo ranchero con sazón mexicano tradicional y queso mozzarella gratinado.',
    price: 140,
    category: '1-ingrediente',
    sizes: SIZES_1_INGREDIENTE,
    ingredientsList: ['Chorizo'],
  },
  {
    id: '1-salchicha',
    name: 'Pizza de Salchicha',
    description: 'Rodajas de salchicha de primera doraditas sobre capa generosa de queso derretido.',
    price: 140,
    category: '1-ingrediente',
    sizes: SIZES_1_INGREDIENTE,
    ingredientsList: ['Salchicha'],
  },
  {
    id: '1-atun',
    name: 'Pizza de Atún',
    description: 'Lomo de atún claro seleccionado con toque de orégano y abundante mozzarella.',
    price: 140,
    category: '1-ingrediente',
    sizes: SIZES_1_INGREDIENTE,
    ingredientsList: ['Atún'],
  },
  {
    id: '1-jalapeno',
    name: 'Pizza de Jalapeño',
    description: 'Jalapeños toreados rebanados para los amantes del picor mexicano auténtico.',
    price: 140,
    category: '1-ingrediente',
    sizes: SIZES_1_INGREDIENTE,
    ingredientsList: ['Jalapeño'],
  },

  // ── 5. ARMA TU PIZZA ──
  {
    id: 'arma-tu-pizza',
    name: 'Arma Tu Brother Pizza',
    description: '¡Elige tu tamaño ideal y escoge hasta 4 ingredientes frescos a tu entero gusto con base de salsa pomodoro y mucho queso mozzarella!',
    price: 169,
    category: 'arma-tu-pizza',
    image: pizzaCloseUp,
    featured: true,
    badge: '¡Tú Eres el Chef!',
    sizes: [
      { id: 'mediana', label: 'Mediana', slices: '8 Rebanadas', price: 169, sublabel: 'Para 2-3 personas' },
      { id: 'grande', label: 'Grande', slices: '8 Rebanadas Grandes', price: 250, sublabel: 'Para 3-4 personas' },
      { id: 'pizzota', label: 'Pizzota', slices: '18 Rebanadas', price: 350, sublabel: '¡Familiar para compartir!' },
    ],
    maxIngredients: 4,
  },

  // ── 6. BEBIDAS & DIPS ──
  {
    id: 'beb-coca-600',
    name: 'Coca-Cola Original 600ml',
    description: 'Refresco bien frío en botella de 600ml para acompañar tu pizza recién salida del horno.',
    price: 32,
    category: 'bebidas',
  },
  {
    id: 'beb-coca-2l',
    name: 'Coca-Cola 2 Litros (Familiar)',
    description: 'Para toda la familia o la reunión con los brothers, bien fría.',
    price: 48,
    category: 'bebidas',
    badge: 'Familiar',
  },
  {
    id: 'beb-sidral-600',
    name: 'Sidral Mundet 600ml',
    description: 'Sabor tradicional de manzana mexicana, refrescante y bien fría.',
    price: 28,
    category: 'bebidas',
  },
  {
    id: 'beb-sprite-600',
    name: 'Sprite Lima-Limón 600ml',
    description: 'Cítrico y refrescante con burbujas intensas.',
    price: 28,
    category: 'bebidas',
  },
  {
    id: 'beb-agua-600',
    name: 'Agua Purificada 600ml',
    description: 'Botella de agua purificada natural.',
    price: 20,
    category: 'bebidas',
  },
  {
    id: 'dip-chimichurri',
    name: 'Dip de Chimichurri Casero de la Casa',
    description: 'Receta secreta con aceite de oliva, perejil fresco, ajo asado y especias italianas. ¡El acompañamiento perfecto para la orilla!',
    price: 18,
    category: 'bebidas',
    badge: 'Casero 🌿',
  },
  {
    id: 'dip-habanero',
    name: 'Salsa Habanera Casera Asada',
    description: 'Habaneros asados al comal con limón y sal de grano para darle el golpe de fuego a tus rebanadas.',
    price: 15,
    category: 'bebidas',
    badge: 'Picante 🌶️',
  },
];

// Categorías del Menú
const CATEGORIES: { id: CategoryId; label: string; icon: any }[] = [
  { id: 'todos', label: 'Ver Todo', icon: LayoutGrid },
  { id: 'especialidades', label: 'Especialidades', icon: Flame },
  { id: '4-a-6-ingredientes', label: '4 a 6 Ings', icon: Pizza },
  { id: '2-a-3-ingredientes', label: '2 a 3 Ings', icon: Sparkles },
  { id: '1-ingrediente', label: '1 Ingrediente', icon: Slice },
  { id: 'arma-tu-pizza', label: 'Arma Tu Pizza', icon: UtensilsCrossed },
  { id: 'bebidas', label: 'Bebidas & Dips', icon: CupSoda },
];

export default function BrothersPizzaMenu() {
  const [selectedCat, setSelectedCat] = useState<CategoryId>('todos');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('brothers_pizza_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('brothers_pizza_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Sincronizar título de pestaña
  useEffect(() => {
    document.title = `${clientConfig.businessName} · Casera y con Mucho Queso | Menú Digital`;
  }, []);

  // Persistir carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('brothers_pizza_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Persistir favoritos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('brothers_pizza_favs', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Scroll listener para botón "Volver arriba"
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddToCart = (
    lineId: string,
    productId: string,
    name: string,
    detail: string,
    unitPrice: number,
    quantity: number,
    image?: string
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.lineId === lineId);
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      const prod = PRODUCTS.find((p) => p.id === productId);
      return [
        ...prev,
        {
          lineId,
          productId,
          name,
          category: prod?.category || 'especialidades',
          detail,
          unitPrice,
          quantity,
          image,
        },
      ];
    });
    showToast(`¡${name} añadida a tu pedido! 🍕`);
  };

  const handleQuickAdd = (product: Product) => {
    // Si tiene tamaños o ingredientes personalizables, abrir modal
    if ((product.sizes && product.sizes.length > 1) || product.ingredientsList || product.maxIngredients) {
      setCustomizingProduct(product);
      return;
    }
    // Agregar directo si es bebida/dip sencillo
    const lineId = `${product.id}-${Date.now()}`;
    handleAddToCart(lineId, product.id, product.name, 'Estándar', product.price, 1, product.image);
  };

  const handleUpdateQty = (lineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.lineId === lineId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (lineId: string) => {
    setCart((prev) => prev.filter((i) => i.lineId !== lineId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Filtro de Favoritos
      if (showOnlyFavs && !favorites.includes(p.id)) return false;

      // Filtro de Categoría
      if (selectedCat !== 'todos' && p.category !== selectedCat) return false;

      // Filtro de Búsqueda
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchIngs = (p.ingredientsList || []).some((ing) =>
          ing.toLowerCase().includes(query)
        );
        return matchName || matchDesc || matchIngs;
      }

      return true;
    });
  }, [selectedCat, search, favorites, showOnlyFavs]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0F0E0D] text-white selection:bg-[#E11D48] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* ══════════════════ 1. HEADER STICKY CON GLASSMORPHISM ══════════════════ */}
      <header className="sticky top-0 z-40 bg-[#0F0E0D]/90 backdrop-blur-xl border-b border-[#F59E0B]/20 transition-all">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={scrollToTop}>
              <div className="w-11 h-11 rounded-2xl bg-black/60 border border-[#F59E0B]/40 p-1 flex items-center justify-center overflow-hidden shadow-lg shadow-[#E11D48]/20 group-hover:border-[#F59E0B] transition-all">
                <img
                  src={logoBrothersPizza}
                  alt={clientConfig.businessName}
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-1.5">
                  <span>Brothers Pizza</span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#E11D48] text-white uppercase tracking-wider">
                    QRO
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#F59E0B] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>Horno Encendido · Servicio a Domicilio</span>
              </div>
            </div>
          </div>

          {/* Acciones del Header: Favoritos y Carrito */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOnlyFavs(!showOnlyFavs)}
              className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                showOnlyFavs
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title="Mis Favoritos"
            >
              <Heart size={16} className={showOnlyFavs ? 'fill-rose-500 text-rose-500' : ''} />
              {favorites.length > 0 && <span>{favorites.length}</span>}
            </button>

            <a
              href={clientConfig.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-2xl border border-white/10 bg-white/5 text-white/70 hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 transition-all flex items-center justify-center"
              title="Visítanos en Facebook"
            >
              <Facebook size={16} />
            </a>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-gradient-to-r from-[#E11D48] to-[#F59E0B] hover:from-[#BE123C] hover:to-[#D97706] text-white rounded-2xl shadow-lg shadow-[#E11D48]/30 flex items-center gap-2 transition-all transform active:scale-95"
              aria-label="Abrir Carrito"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="font-black text-xs px-2 py-0.5 rounded-full bg-black/60 text-white">
                  ${cartTotal}
                </span>
              )}
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-black font-black text-[10px] flex items-center justify-center shadow-md animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════ 2. HERO PRINCIPAL GOURMET ══════════════════ */}
      <section className="relative overflow-hidden border-b border-[#F59E0B]/15">
        {/* Fondo con textura y foto de pizza al horno con glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1816]/70 via-[#0F0E0D]/90 to-[#0F0E0D] z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-105 filter blur-xs"
          style={{ backgroundImage: `url(${heroCover})` }}
        />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#E11D48]/20 filter blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-[#F59E0B]/15 filter blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 pt-10 pb-8 sm:pt-16 sm:pb-12 z-20 flex flex-col items-center text-center">
          {/* Badge superior */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/70 border border-[#F59E0B]/40 text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-4 shadow-md"
          >
            <Flame size={14} className="text-[#E11D48] animate-pulse" />
            <span>Casera y con Mucho Queso</span>
          </motion.div>

          {/* Título Hero de Alto Impacto */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white max-w-3xl leading-none sm:leading-tight mb-4"
          >
            Hoy Se Come <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-amber-200 to-[#E11D48]">Pizza</span>
          </motion.h2>

          <p className="text-sm sm:text-base text-white/80 max-w-xl mb-6 font-medium leading-relaxed">
            Masa artesanal crujiente horneada al punto exacto, salsa pomodoro casera y una generosa cascada de queso mozzarella. Pídela por WhatsApp y recíbela calientita en tu puerta.
          </p>

          {/* Badges de Confianza */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-2xl mb-8">
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2.5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-[#E11D48]/20 text-[#E11D48] flex items-center justify-center shrink-0">
                <Pizza size={18} />
              </div>
              <div className="text-left">
                <span className="block text-xs font-black text-white">Masa Casera</span>
                <span className="text-[10px] text-white/50">Elaborada a diario</span>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2.5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center shrink-0">
                <Flame size={18} />
              </div>
              <div className="text-left">
                <span className="block text-xs font-black text-white">Mucho Queso</span>
                <span className="text-[10px] text-white/50">100% Mozzarella</span>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2.5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Bike size={18} />
              </div>
              <div className="text-left">
                <span className="block text-xs font-black text-white">A Domicilio</span>
                <span className="text-[10px] text-white/50">Envíos rápidos</span>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2.5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Store size={18} />
              </div>
              <div className="text-left">
                <span className="block text-xs font-black text-white">Bancoppel</span>
                <span className="text-[10px] text-white/50">Y Efectivo</span>
              </div>
            </div>
          </div>

          {/* Banner de Contacto y Teléfonos */}
          <div className="w-full max-w-xl p-3 bg-black/60 border border-[#F59E0B]/30 rounded-2xl flex flex-wrap items-center justify-around gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-[#F59E0B]" />
              <span className="text-white/60">Pedidos:</span>
              <a
                href={`tel:${clientConfig.phone}`}
                className="font-black text-white hover:text-[#F59E0B] transition-colors"
              >
                {clientConfig.phoneNumberFormatted}
              </a>
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-[#F59E0B]" />
              <span className="text-white/60">Alterno:</span>
              <a
                href={`tel:${clientConfig.secondaryPhone.replace(/\s/g, '')}`}
                className="font-black text-white hover:text-[#F59E0B] transition-colors"
              >
                {clientConfig.secondaryPhone}
              </a>
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <a
              href={clientConfig.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-white/70 hover:text-[#1877F2] transition-colors"
            >
              <Facebook size={14} className="text-[#1877F2]" />
              <span className="font-bold">Facebook Oficial</span>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════ 3. BUSCADOR & BARRA DE CATEGORÍAS ══════════════════ */}
      <section className="sticky top-[61px] z-30 bg-[#0F0E0D]/95 backdrop-blur-lg border-b border-white/10 py-3">
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          {/* Buscador en vivo */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              placeholder="Buscar pizza, ingrediente (chilorio, pepperoni, pastor, piña...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '16px' }}
              className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 focus:border-[#F59E0B] rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Carrusel Horizontal de Categorías con scroll snap */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar snap-x snap-mandatory">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCat === cat.id && !showOnlyFavs;
              const count = PRODUCTS.filter((p) => cat.id === 'todos' || p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCat(cat.id);
                    setShowOnlyFavs(false);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all border snap-start ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#E11D48] to-[#F59E0B] text-white border-transparent shadow-md shadow-[#E11D48]/25 scale-[1.02]'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ 4. GRID DE PRODUCTOS STAGGER ══════════════════ */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Banner si está activo filtro de favoritos */}
        {showOnlyFavs && (
          <div className="p-3 mb-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-xs text-rose-300">
            <span className="flex items-center gap-2">
              <Heart size={14} className="fill-rose-500 text-rose-500" />
              Mostrando solo tus pizzas favoritas ({filteredProducts.length})
            </span>
            <button
              onClick={() => setShowOnlyFavs(false)}
              className="text-white underline hover:text-rose-200"
            >
              Ver todo el menú
            </button>
          </div>
        )}

        {/* Sin resultados */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mb-3">
              <Pizza size={32} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No se encontraron productos</h3>
            <p className="text-xs text-white/50 mb-4">
              Intenta con otra palabra clave como "pepperoni", "hawaiana", o limpia el filtro.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCat('todos');
                setShowOnlyFavs(false);
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold text-white transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const isFav = favorites.includes(product.id);
              const minPrice = product.sizes ? Math.min(...product.sizes.map((s) => s.price)) : product.price;

              return (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-gradient-to-b from-[#1A1816] to-[#141210] border border-white/10 hover:border-[#F59E0B]/50 rounded-3xl p-4 sm:p-5 flex flex-col justify-between group shadow-lg shadow-black/40 hover:shadow-[#F59E0B]/10 transition-all"
                >
                  <div>
                    {/* Header de la Card: Badges y Botón Favorito */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {product.badge ? (
                          <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#E11D48] to-[#F59E0B] text-white rounded-full shadow-sm">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/50 rounded-full border border-white/10">
                            {product.category.replace(/-/g, ' ')}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(product.id)}
                        className={`p-2 rounded-full border transition-all ${
                          isFav
                            ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                            : 'bg-white/5 border-white/10 text-white/30 hover:text-white hover:bg-white/10'
                        }`}
                        aria-label="Marcar como favorito"
                      >
                        <Heart size={14} className={isFav ? 'fill-rose-500' : ''} />
                      </button>
                    </div>

                    {/* Imagen de Producto si tiene */}
                    {product.image && (
                      <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden mb-3.5 bg-black/40 border border-white/5">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent opacity-60" />
                      </div>
                    )}

                    {/* Nombre y Descripción */}
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#F59E0B] transition-colors mb-1.5 tracking-wide">
                      {product.name}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed line-clamp-3 mb-3">
                      {product.description}
                    </p>

                    {/* Ingredientes en Chips */}
                    {product.ingredientsList && product.ingredientsList.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.ingredientsList.map((ing) => (
                          <span
                            key={ing}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Desglose de Tamaños si aplica */}
                    {product.sizes && product.sizes.length > 1 && (
                      <div className="p-2.5 bg-black/40 border border-white/5 rounded-2xl mb-4 text-[11px] space-y-1">
                        <div className="text-[10px] font-black uppercase text-white/40 mb-1 flex items-center justify-between">
                          <span>Tamaños oficiales</span>
                          <span>Rebanadas</span>
                        </div>
                        {product.sizes.map((sz) => (
                          <div key={sz.id} className="flex items-center justify-between text-white/80">
                            <span className="font-semibold">{sz.label}:</span>
                            <span className="text-[#F59E0B] font-bold">${sz.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer de la Card: Precio y Botón de Acción */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-white/50 block font-medium">
                        {product.sizes && product.sizes.length > 1 ? 'Desde' : 'Precio'}
                      </span>
                      <span className="text-lg font-black text-[#F59E0B]">
                        ${minPrice} <span className="text-[11px] font-normal text-white/40">MXN</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className="px-4 py-2.5 bg-gradient-to-r from-[#E11D48] to-[#F59E0B] hover:from-[#BE123C] hover:to-[#D97706] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-md shadow-[#E11D48]/20 flex items-center gap-1.5 transition-all transform active:scale-95"
                    >
                      <Plus size={14} strokeWidth={3} />
                      <span>{product.sizes && product.sizes.length > 1 ? 'Personalizar' : 'Agregar'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* ══════════════════ 5. FOOTER OFICIAL DE 3 COLUMNAS ══════════════════ */}
      {/* Regla estricta Imagine & Stamp: 3 columnas enfocadas 100% en el CLIENTE */}
      <footer className="mt-16 border-t border-[#F59E0B]/20 bg-[#0A0908] text-white/80">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna 1: Logo & Identidad */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black/60 border border-[#F59E0B]/30 p-1 flex items-center justify-center">
                  <img
                    src={logoBrothersPizza}
                    alt={clientConfig.businessName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">Brothers Pizza</h3>
                  <p className="text-xs text-[#F59E0B] font-semibold">{clientConfig.tagline}</p>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Pizzas caseras horneadas al momento con doble ración de queso mozzarella fundido. Especialidades, pizzas clásicas y combinaciones al gusto para disfrutar en casa.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-emerald-400 font-semibold">
                <CheckCircle2 size={13} />
                <span>Envíos a Domicilio y Punto de Entrega</span>
              </div>
            </div>

            {/* Columna 2: Contacto & Horarios */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#F59E0B]">
                Pedidos & Horarios
              </h4>
              <ul className="space-y-2.5 text-xs text-white/70">
                <li className="flex items-start gap-2.5">
                  <Clock size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block">Horario de Atención:</span>
                    <span>{clientConfig.hours}</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block">Teléfonos de Pedido:</span>
                    <a href={`tel:${clientConfig.phone}`} className="hover:text-white transition-colors block">
                      {clientConfig.phoneNumberFormatted} (WhatsApp)
                    </a>
                    <a href={`tel:${clientConfig.secondaryPhone.replace(/\s/g, '')}`} className="hover:text-white transition-colors block">
                      {clientConfig.secondaryPhone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block">Cobertura:</span>
                    <span>{clientConfig.address}</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Columna 3: Formas de Pago & Seguridad */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#F59E0B]">
                Formas de Pago
              </h4>
              <p className="text-xs text-white/60">
                Aceptamos efectivo al recibir (llevamos cambio) y transferencia directa vía SPEI Bancoppel.
              </p>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-xs space-y-1.5">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>Bancoppel SPEI:</span>
                  <span className="text-emerald-400 font-mono text-[11px]">{bankInfo.clabe}</span>
                </div>
                <div className="text-[11px] text-white/50">
                  Titular: {bankInfo.accountHolder}
                </div>
              </div>

              {/* Botones de Redes Sociales y WhatsApp */}
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={clientConfig.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3 bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/30 text-[#1877F2] hover:text-[#4294FF] rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Facebook size={16} />
                  <span>Síguenos en Facebook</span>
                </a>

                <a
                  href={`https://wa.me/${clientConfig.phone}?text=${encodeURIComponent('¡Hola Brothers Pizza! Quisiera pedir informes o hacer un pedido 🍕')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>Contactar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Barra Inferior Legal & Crédito */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50">
            <div>
              © 2026 {clientConfig.businessName}. Todos los derechos reservados.
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-white underline transition-colors"
              >
                Aviso de Privacidad (LFPDPPP)
              </button>
              <span>·</span>
              <span className="text-white/40">
                Diseñado por <strong className="text-white/80">IMAGINE & STAMP</strong>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════ 6. MODALES Y ELEMENTOS FLOTANTES ══════════════════ */}

      {/* Modal de Personalización */}
      {customizingProduct && (
        <CustomizeModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onAdd={handleAddToCart}
        />
      )}

      {/* Carrito Lateral de 2 Pasos */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveItem}
        cartTotal={cartTotal}
        whatsappNumber={clientConfig.phone}
        businessName={clientConfig.businessName}
        onClearCart={handleClearCart}
      />

      {/* Modal de Aviso de Privacidad */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowPrivacyModal(false)}
          />
          <div className="relative w-full max-w-lg bg-[#141210] border border-white/10 rounded-3xl p-6 text-white text-xs z-10 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-sm uppercase tracking-wider text-[#F59E0B]">
                Aviso de Privacidad (LFPDPPP)
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-white/70 leading-relaxed">
              En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong>, <strong>{clientConfig.businessName}</strong> informa que los datos personales recabados (nombre, teléfono y dirección de entrega) son utilizados exclusivamente para la gestión, preparación y entrega de sus pedidos de alimentos y bebidas solicitados a través de esta plataforma digital y WhatsApp.
            </p>
            <p className="text-white/70 leading-relaxed">
              Sus datos no son compartidos ni transferidos a terceros comerciales bajo ninguna circunstancia. Usted puede solicitar la rectificación o cancelación del uso de sus datos en cualquier momento comunicándose directamente a nuestro canal de atención por WhatsApp al <strong>{clientConfig.phoneNumberFormatted}</strong>.
            </p>
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-[#E11D48] to-[#F59E0B] text-white font-bold rounded-xl text-xs uppercase"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón Flotante del Carrito (Mobile & Desktop) */}
      {totalItems > 0 && !isCartOpen && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 right-4 sm:right-6 z-40"
        >
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#E11D48] to-[#F59E0B] hover:from-[#BE123C] hover:to-[#D97706] text-white rounded-full shadow-2xl shadow-[#E11D48]/40 border border-white/20 transform active:scale-95 transition-all group"
          >
            <div className="relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-black font-black text-[10px] flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            </div>
            <span className="font-black text-xs uppercase tracking-wider">Ver Mi Pedido</span>
            <span className="font-black text-xs px-2 py-0.5 rounded-full bg-black/40">
              ${cartTotal}
            </span>
          </button>
        </motion.div>
      )}

      {/* Botón Volver Arriba */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 left-4 z-30 p-3 bg-black/70 hover:bg-black/90 border border-white/10 rounded-full text-white/70 hover:text-white backdrop-blur-md shadow-lg transition-all"
          aria-label="Volver arriba"
        >
          <ArrowUp size={16} />
        </button>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#161412] border border-[#F59E0B]/50 px-5 py-2.5 rounded-2xl shadow-xl shadow-black/80 flex items-center gap-2.5 text-xs font-bold text-white"
          >
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
