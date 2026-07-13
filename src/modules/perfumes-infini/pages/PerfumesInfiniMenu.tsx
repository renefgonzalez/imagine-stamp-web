import { useState, useMemo, useEffect } from 'react';
import logoPerfumes from '../assets/logo.png';

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  inspiration: string;
  description: string;
  price60: number;
  price100: number;
  family: string;
  gender: 'Dama' | 'Caballero' | 'Unisex';
  image: string;
  bestSeller?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
  size: '60ml' | '100ml';
}

type SizeOption = '60ml' | '100ml';
type CartStep = 1 | 2;

// ─── Datos del cliente real ─────────────────────────────────────────────────
const FAMILIES = [
  'Todos',
  'Florales/Cálidos',
  'Cítricos/Frescos',
  'Amaderados/Elegantes',
  'Orientales/Sensuales',
  'Gourmand/Adictivos',
  'Aromáticos/Frescos',
  'Tradicionales',
];

const GENDERS = ['Todos', 'Dama', 'Caballero', 'Unisex'];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Baccarat Rouge 540',
    inspiration: 'Inspirado en Maison Francis Kurkdjian',
    description:
      'Luminoso y sofisticado. Azafrán, ámbar gris y cedro. Un ícono unisex.',
    price60: 220,
    price100: 360,
    family: 'Amaderados/Elegantes',
    gender: 'Unisex',
    image:
      'https://images.unsplash.com/photo-1615486171448-4afd492160a2?auto=format&fit=crop&w=400&q=80',
    bestSeller: true,
  },
  {
    id: 2,
    name: 'Bleu de Chanel',
    inspiration: 'Inspirado en Chanel',
    description:
      'Amaderado aromático. Pomelo, jengibre y sándalo. Elegancia masculina atemporal.',
    price60: 220,
    price100: 360,
    family: 'Amaderados/Elegantes',
    gender: 'Caballero',
    image:
      'https://images.unsplash.com/photo-1523293115678-efa30dbb1e42?auto=format&fit=crop&w=400&q=80',
    bestSeller: true,
  },
  {
    id: 3,
    name: 'Good Girl',
    inspiration: 'Inspirado en Carolina Herrera',
    description:
      'Oriental floral. Almendra, jazmín y cacao. La icónica zapatilla de tacón.',
    price60: 220,
    price100: 360,
    family: 'Orientales/Sensuales',
    gender: 'Dama',
    image:
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=400&q=80',
    bestSeller: true,
  },
  {
    id: 4,
    name: 'Sauvage',
    inspiration: 'Inspirado en Dior',
    description:
      'Fresco, crudo y noble. Bergamota, pimienta y ambroxán. Fuerza salvaje.',
    price60: 220,
    price100: 360,
    family: 'Aromáticos/Frescos',
    gender: 'Caballero',
    image:
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=400&q=80',
    bestSeller: false,
  },
  {
    id: 5,
    name: 'La Vie Est Belle',
    inspiration: 'Inspirado en Lancôme',
    description:
      'Gourmand floral. Iris, pera y praliné. La felicidad en una fragancia.',
    price60: 220,
    price100: 360,
    family: 'Gourmand/Adictivos',
    gender: 'Dama',
    image:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80',
    bestSeller: true,
  },
  {
    id: 6,
    name: 'Light Blue',
    inspiration: 'Inspirado en Dolce & Gabbana',
    description:
      'Cítrico fresco. Limón, manzana verde y cedro. La esencia del Mediterráneo.',
    price60: 220,
    price100: 360,
    family: 'Cítricos/Frescos',
    gender: 'Dama',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
    bestSeller: false,
  },
  {
    id: 7,
    name: "J'adore",
    inspiration: 'Inspirado en Dior',
    description:
      'Floral radiante. Ylang-ylang, rosa y jazmín. El oro líquido de Dior.',
    price60: 220,
    price100: 360,
    family: 'Florales/Cálidos',
    gender: 'Dama',
    image:
      'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=400&q=80',
    bestSeller: false,
  },
  {
    id: 8,
    name: 'Creed Aventus',
    inspiration: 'Inspirado en Creed',
    description:
      'Amaderado afrutado. Piña, grosella negra y abedul. Poder y éxito.',
    price60: 220,
    price100: 360,
    family: 'Amaderados/Elegantes',
    gender: 'Caballero',
    image:
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=400&q=80',
    bestSeller: false,
  },
  {
    id: 9,
    name: 'Flowerbomb',
    inspiration: 'Inspirado en Viktor & Rolf',
    description:
      'Explosión floral. Bergamota, rosa, jazmín y pachulí. Adictivo y femenino.',
    price60: 220,
    price100: 360,
    family: 'Florales/Cálidos',
    gender: 'Dama',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
    bestSeller: false,
  },
  {
    id: 10,
    name: 'Black Opium',
    inspiration: 'Inspirado en Yves Saint Laurent',
    description:
      'Café floral. Café, vainilla y flor de azahar. Adicción pura.',
    price60: 220,
    price100: 360,
    family: 'Orientales/Sensuales',
    gender: 'Dama',
    image:
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=400&q=80',
    bestSeller: true,
  },
  {
    id: 11,
    name: 'Acqua di Giò Profondo',
    inspiration: 'Inspirado en Giorgio Armani',
    description:
      'Acuático aromático. Bergamota, romero y almizcle. La profundidad del mar.',
    price60: 220,
    price100: 360,
    family: 'Aromáticos/Frescos',
    gender: 'Caballero',
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
    bestSeller: false,
  },
  {
    id: 12,
    name: 'Versace Eros',
    inspiration: 'Inspirado en Versace',
    description:
      'Aromático fougère. Menta, manzana verde y vainilla. Pasión y seducción.',
    price60: 220,
    price100: 360,
    family: 'Tradicionales',
    gender: 'Caballero',
    image:
      'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=400&q=80',
    bestSeller: false,
  },
];

const DELIVERY_METHODS = ['Envío a domicilio', 'Recoger en tienda'];
const PAYMENT_METHODS = ['Efectivo', 'Transferencia', 'Tarjeta'];

const PRICE_LABELS: Record<SizeOption, { label: string; price: number }> = {
  '60ml': { label: '60 ml', price: 220 },
  '100ml': { label: '100 ml', price: 360 },
};

// ─── Componente principal ────────────────────────────────────────────────────
export default function PerfumesInfiniMenu() {
  // Catálogo — filtros
  const [selectedFamily, setSelectedFamily] = useState('Todos');
  const [visibleItems, setVisibleItems] = useState(10);
  const ITEMS_PER_PAGE = 10;

  const resetPagination = () => setVisibleItems(ITEMS_PER_PAGE);

  const [selectedGender, setSelectedGender] = useState('Todos');
  const [selectedSize, setSelectedSize] = useState<SizeOption>('100ml');
  const [searchQuery, setSearchQuery] = useState('');

  // Carrito
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartStep, setCartStep] = useState<CartStep>(1);
  const [cartOpen, setCartOpen] = useState(false);

  // Cliente
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState(DELIVERY_METHODS[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [customerNotes, setCustomerNotes] = useState('');

  // Favoritos
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('infini_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('infini_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleShare = async (product: typeof PRODUCTS[0]) => {
    const shareData = {
      title: `Perfumes Infini - ${product.name}`,
      text: `Descubre ${product.name}, inspirado en ${product.inspiration}.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`);
        alert('¡Enlace copiado al portapapeles!');
      }
    } catch (error) {
      console.error('Error compartiendo:', error);
    }
  };

  // ─── Filtrado ─────────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchFamily =
        selectedFamily === 'Todos' || p.family === selectedFamily;
      const matchGender =
        selectedGender === 'Todos' || p.gender === selectedGender;
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchFamily && matchGender && matchSearch;
    });
  }, [selectedFamily, selectedGender, searchQuery]);

  // ─── Utilidades carrito ───────────────────────────────────────────────────
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotal = cart.reduce((acc, i) => {
    const unitPrice = i.size === '60ml' ? i.product.price60 : i.product.price100;
    return acc + unitPrice * i.quantity;
  }, 0);

  const getPrice = (p: Product) =>
    selectedSize === '60ml' ? p.price60 : p.price100;

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exist = prev.find(
        (i) => i.product.id === product.id && i.size === selectedSize,
      );
      if (exist) {
        return prev.map((i) =>
          i.product.id === product.id && i.size === selectedSize
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { product, quantity: 1, size: selectedSize }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId: number, size: SizeOption) => {
    setCart((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.size === size)),
    );
  };

  const updateQuantity = (productId: number, size: SizeOption, qty: number) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size
          ? { ...i, quantity: qty }
          : i,
      ),
    );
  };

  // ─── WhatsApp ─────────────────────────────────────────────────────────────
  const buildWhatsAppMessage = (): string => {
    const items = cart
      .map((i) => {
        const unitPrice =
          i.size === '60ml' ? i.product.price60 : i.product.price100;
        return `• *${i.product.name}* (${i.size}) x${i.quantity} — $${unitPrice * i.quantity}`;
      })
      .join('\n');

    return (
      `🛍️ *PEDIDO — PERFUMES INFINI*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Cliente:* ${customerName}\n` +
      `*Teléfono:* ${customerPhone}\n` +
      `*Entrega:* ${deliveryMethod}\n` +
      `*Pago:* ${paymentMethod}\n` +
      (customerNotes ? `*Notas:* ${customerNotes}\n` : '') +
      `\n📦 *Productos:*\n${items}\n\n` +
      `💰 *Total: $${cartTotal}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `✨ ELIXIR PREMIUM 40% + Feromonas\n` +
      `💎 99% de igualdad con marcas de lujo`
    );
  };

  const handleSendWhatsApp = () => {
    const msg = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    setCart([]);
    setCartStep(1);
    setCartOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryMethod(DELIVERY_METHODS[0]);
    setPaymentMethod(PAYMENT_METHODS[0]);
    setCustomerNotes('');
  };

  const step2Valid = customerName.trim() !== '' && customerPhone.trim() !== '';

  // ─── Render ───────────────────────────────────────────────────────────────
  const displayedProducts = filteredProducts.slice(0, visibleItems);
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37]/30 selection:text-white">
      {/* ════════════════ HEADER ════════════════ */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-xl border-b border-[#D4AF37]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo + tagline */}
          <div className="flex flex-col">
            <img 
              src={logoPerfumes} 
              alt="Perfumes Infini" 
              className="h-16 sm:h-24 w-auto object-contain" 
            />
            <p className="text-[10px] sm:text-xs text-[#D4AF37]/60 tracking-[0.35em] uppercase mt-0.5">
              ✦ El Aroma Infinito ✦
            </p>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Favoritos */}
            <button
              onClick={() => setFavoritesOpen(true)}
              className="relative p-2.5 text-[#D4AF37] hover:text-[#F3E5AB] transition-colors rounded-lg hover:bg-[#D4AF37]/5"
              aria-label="Mis Favoritos"
              title="Mis Favoritos"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-[#050505] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Carrito */}
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2.5 text-[#D4AF37] hover:text-[#F3E5AB] transition-colors rounded-lg hover:bg-[#D4AF37]/5"
              aria-label="Abrir carrito"
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 sm:h-7 sm:w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-[#050505] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                {cartCount}
              </span>
            )}
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════ CONTENEDOR PRINCIPAL ════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8">
        {/* ─── COLUMNA PRINCIPAL ─── */}
        <main
          className={`flex-1 py-6 sm:py-8 transition-all duration-300 ${
            cartOpen ? 'lg:pr-4' : ''
          }`}
        >
          {/* Buscador */}
          <div className="mb-6">
            <div className="relative group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                placeholder="Busca tu fragancia..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); resetPagination(); }}
                className="w-full pl-12 pr-4 py-3 bg-[#121212] border border-[#D4AF37]/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>
          </div>

          {/* Separador decorativo */}
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
            <span className="text-[#D4AF37]/40 text-xs tracking-[0.3em] uppercase">
              Colección
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
          </div>

          {/* Familias olfativas — categorías principales */}
          <div className="mb-4 overflow-x-auto pb-2 scrollbar-thin">
            <div className="flex gap-2 min-w-max">
              {FAMILIES.map((fam) => (
                <button
                  key={fam}
                  onClick={() => { setSelectedFamily(fam); resetPagination(); }}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedFamily === fam
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#050505] shadow-lg shadow-[#D4AF37]/25 font-bold'
                      : 'bg-[#0a0a0a] text-gray-400 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 hover:text-gray-200'
                  }`}
                >
                  {fam}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-filtro de género */}
          <div className="flex gap-2 mb-6">
            {GENDERS.map((g) => (
              <button
                key={g}
                onClick={() => { setSelectedGender(g); resetPagination(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedGender === g
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                    : 'text-gray-500 border border-transparent hover:text-gray-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Selector de tamaño global */}
          <div className="flex items-center gap-3 mb-8 bg-[#0a0a0a] border border-[#D4AF37]/10 rounded-xl p-2 w-fit">
            <span className="text-xs text-gray-500 pl-2 pr-1 tracking-wider">
              PRESENTACIÓN
            </span>
            {(Object.entries(PRICE_LABELS) as [SizeOption, typeof PRICE_LABELS['60ml']][]).map(
              ([key, val]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSize(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    selectedSize === key
                      ? 'bg-[#D4AF37] text-[#050505] shadow-md shadow-[#D4AF37]/20'
                      : 'text-gray-400 hover:text-white hover:bg-[#D4AF37]/10'
                  }`}
                >
                  {val.label}{' '}
                  <span className="opacity-80">— ${val.price}</span>
                </button>
              ),
            )}
          </div>

          {/* Grid de productos */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#121212] border border-[#D4AF37]/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
              <p className="text-gray-400 text-lg">No encontramos esa fragancia</p>
              <p className="text-gray-600 text-sm mt-1">
        Intenta con otro nombre, familia olfativa o género
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {displayedProducts.map((product) => {
                const price = getPrice(product);
                return (
                  <article
                    key={product.id}
                    className="group bg-[#0a0a0a] border border-[#D4AF37]/10 rounded-xl sm:rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/5 hover:-translate-y-1 transition-all duration-400 flex flex-col"
                  >
                    {/* Imagen */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#121212]">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Overlay inferior en imagen */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />

                      {/* Botón Favorito */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm transition-all z-10 group/btn"
                        title={favorites.includes(product.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${favorites.includes(product.id) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white group-hover/btn:text-[#D4AF37]'}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth={favorites.includes(product.id) ? 0 : 1.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </button>

                      {/* Botón Compartir */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleShare(product);
                        }}
                        className="absolute top-10 right-2 sm:top-14 sm:right-3 p-1.5 sm:p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm transition-all z-10 group/shareBtn"
                        title="Compartir"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover/shareBtn:text-[#D4AF37] transition-colors" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth={1.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                      </button>

                      {/* Badge ELIXIR PREMIUM */}
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#D4AF37]/90 text-[#050505] text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded sm:rounded-md shadow-lg">
                        ELIXIR 40%
                      </span>

                      {/* Badge Más vendido */}
                      {product.bestSeller && (
                        <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#050505] text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded sm:rounded-md shadow-lg shadow-[#D4AF37]/30 z-10">
                          ★ Top
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 sm:p-6 flex flex-col flex-1">
                      {/* Familia */}
                      <span className="text-[8px] sm:text-[10px] text-[#D4AF37]/70 uppercase tracking-[0.2em] font-medium line-clamp-1">
                        {product.family}
                      </span>

                      {/* Nombre */}
                      <h3 className="text-white font-bold text-xs sm:text-lg mt-1 leading-tight group-hover:text-[#D4AF37] transition-colors line-clamp-1 sm:line-clamp-none">
                        {product.name}
                      </h3>

                      {/* Inspiración */}
                      <p className="text-gray-500 text-[9px] sm:text-xs mt-0.5 italic line-clamp-1">
                        {product.inspiration}
                      </p>

                      {/* Descripción */}
                      <p className="text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed line-clamp-2 hidden sm:block">
                        {product.description}
                      </p>

                      {/* Concentración */}
                      <div className="items-center gap-1.5 mt-2 sm:mt-3 text-[8px] sm:text-[10px] text-gray-500 hidden sm:flex">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50" />
                        ELIXIR PREMIUM 40% + Feromonas
                      </div>
                      
                      <div className="flex-1" />

                      {/* Precio + Botón */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#D4AF37]/10 gap-2 sm:gap-0">
                        <div>
                          <span className="text-[#D4AF37] text-sm sm:text-xl font-bold">
                            ${price}
                          </span>
                          <span className="text-gray-500 text-[9px] sm:text-xs ml-1 sm:ml-2">
                            {selectedSize}
                          </span>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full sm:w-auto px-3 py-1.5 sm:px-5 sm:py-2.5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#050505] text-[10px] sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#D4AF37]/25 active:scale-95"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Botón Ver más */}
          {visibleItems < filteredProducts.length && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleItems((prev) => prev + ITEMS_PER_PAGE)}
                className="px-8 py-3 bg-transparent border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] font-semibold rounded-xl transition-all duration-200 tracking-wide text-sm group"
              >
                <span className="flex items-center gap-2">
                  Ver más productos
                  <span className="text-xs opacity-60">
                    ({visibleItems} de {filteredProducts.length})
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 group-hover:translate-y-0.5 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </button>
            </div>
          )}

          {/* Leyenda de calidad al final del catálogo */}
          <div className="mt-12 text-center border border-[#D4AF37]/10 rounded-2xl bg-[#0a0a0a] p-6">
            <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                Concentración ELIXIR PREMIUM 40%
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                + Feromonas
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                99% de igualdad con marcas de lujo
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                Envíos a toda la República MX
              </span>
            </div>
          </div>
        </main>

        {/* ════════════════ SIDEBAR — CARRITO ════════════════ */}
        {cartOpen && (
          <>
            {/* Mobile Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden" 
              onClick={() => setCartOpen(false)}
            />
            
            <aside className="fixed inset-y-0 right-0 z-[70] w-[85vw] sm:w-96 bg-[#0a0a0a] lg:bg-black/60 backdrop-blur-xl border-l lg:border lg:border-[#D4AF37]/15 border-[#D4AF37]/15 p-6 overflow-y-auto shadow-2xl shadow-black lg:static lg:block lg:w-96 lg:rounded-2xl lg:mb-0 lg:max-h-[calc(100vh-8rem)] lg:sticky lg:top-24 lg:self-start">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white tracking-wide">
                Tu Pedido{' '}
                <span className="text-[#D4AF37]">({cartCount})</span>
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[#121212] border border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 transition-all flex items-center justify-center"
                aria-label="Cerrar carrito"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Carrito vacío */}
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#121212] border border-[#D4AF37]/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400">Tu carrito está vacío</p>
                <p className="text-gray-600 text-xs mt-1">
                  Explora nuestra colección y agrega tus favoritos
                </p>
              </div>
            ) : (
              <>
                {/* Navegación de pasos */}
                <div className="flex mb-6 bg-[#0a0a0a] rounded-lg p-1">
                  <button
                    onClick={() => setCartStep(1)}
                    className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-all ${
                      cartStep === 1
                        ? 'bg-[#D4AF37] text-[#050505]'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Artículos
                  </button>
                  <button
                    onClick={() => setCartStep(2)}
                    className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-all ${
                      cartStep === 2
                        ? 'bg-[#D4AF37] text-[#050505]'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Datos &amp; Pago
                  </button>
                </div>

                {/* ─── PASO 1: Artículos ─── */}
                {cartStep === 1 && (
                  <>
                    <ul className="space-y-3 mb-6">
                      {cart.map((item) => {
                        const unitPrice =
                          item.size === '60ml'
                            ? item.product.price60
                            : item.product.price100;
                        return (
                          <li
                            key={`${item.product.id}-${item.size}`}
                            className="flex gap-3 bg-[#121212] rounded-xl p-3 border border-[#D4AF37]/10"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              loading="lazy"
                              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">
                                {item.product.name}
                              </p>
                              <p className="text-[#D4AF37]/80 text-xs">
                                {item.size} — ${unitPrice}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.size,
                                      item.quantity - 1,
                                    )
                                  }
                                  className="w-6 h-6 rounded-md bg-[#050505] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 text-xs flex items-center justify-center transition-all"
                                >
                                  −
                                </button>
                                <span className="text-white text-sm font-medium w-6 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.size,
                                      item.quantity + 1,
                                    )
                                  }
                                  className="w-6 h-6 rounded-md bg-[#050505] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 text-xs flex items-center justify-center transition-all"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() =>
                                    removeFromCart(item.product.id, item.size)
                                  }
                                  className="ml-auto text-red-500/70 hover:text-red-400 text-xs transition-colors"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Total */}
                    <div className="border-t border-[#D4AF37]/15 pt-4 mb-6">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-[#D4AF37]">${cartTotal}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCartStep(2)}
                      className="w-full py-3 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#050505] font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#D4AF37]/25"
                    >
                      Continuar pedido
                    </button>
                  </>
                )}

                {/* ─── PASO 2: Datos, entrega y pago ─── */}
                {cartStep === 2 && (
                  <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ej. María García"
                        className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#D4AF37]/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/20 text-sm transition-all"
                      />
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Ej. 555 123 4567"
                        className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#D4AF37]/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/20 text-sm transition-all"
                      />
                    </div>

                    {/* Método de entrega */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                        Método de entrega
                      </label>
                      <select
                        value={deliveryMethod}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#D4AF37]/10 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/20 text-sm transition-all"
                      >
                        {DELIVERY_METHODS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Forma de pago */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                        Forma de pago
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#D4AF37]/10 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/20 text-sm transition-all"
                      >
                        {PAYMENT_METHODS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>

                      {/* Datos de Transferencia */}
                      {paymentMethod === 'Transferencia' && (
                        <div className="mt-3 p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl">
                          <p className="text-[#D4AF37] text-xs font-semibold mb-1">
                            Datos para transferencia
                          </p>
                          <p className="text-gray-400 text-xs leading-relaxed">
                            Los datos de la cuenta te serán proporcionados por WhatsApp al confirmar tu pedido para mayor seguridad, o enviaremos un link de pago.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Notas */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                        Notas adicionales
                      </label>
                      <textarea
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="Dirección, referencias, instrucciones especiales..."
                        rows={3}
                        className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#D4AF37]/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/20 text-sm resize-none transition-all"
                      />
                    </div>

                    {/* Total */}
                    <div className="border-t border-[#D4AF37]/15 pt-4 flex justify-between text-lg font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-[#D4AF37]">${cartTotal}</span>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setCartStep(1)}
                        className="flex-1 py-2.5 bg-[#121212] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 rounded-xl transition-all text-sm font-medium"
                      >
                        Volver
                      </button>
                      <button
                        onClick={handleSendWhatsApp}
                        disabled={!step2Valid}
                        className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-sm ${
                          step2Valid
                            ? 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/20'
                            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        Confirmar por WhatsApp
                      </button>
                    </div>

                    <p className="text-[10px] text-gray-600 text-center pt-2">
                      Al confirmar se abrirá WhatsApp con tu pedido listo
                    </p>
                  </div>
                )}
              </>
            )}
          </aside>
          </>
        )}
      </div>

      {/* ════════════════ FAVORITOS DRAWER ════════════════ */}
      {favoritesOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setFavoritesOpen(false)}
          />

          {/* Drawer */}
          <aside className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-[#050505] border-l border-[#D4AF37]/20 z-50 flex flex-col shadow-2xl shadow-[#D4AF37]/10 animate-in slide-in-from-right duration-300">
            {/* Header Favoritos */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#D4AF37]/10">
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-widest">
                Mis Favoritos
              </h2>
              <button
                onClick={() => setFavoritesOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-900 transition-colors"
                aria-label="Cerrar favoritos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido Favoritos */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              {favorites.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#121212] flex items-center justify-center border border-[#D4AF37]/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">Aún no tienes favoritos guardados.</p>
                  <button
                    onClick={() => setFavoritesOpen(false)}
                    className="mt-4 px-6 py-2 bg-transparent border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl text-sm font-bold transition-all"
                  >
                    Seguir explorando
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {favorites.map((favId) => {
                    const product = PRODUCTS.find((p) => p.id === favId);
                    if (!product) return null;
                    return (
                      <div key={favId} className="flex gap-4 items-center bg-[#0a0a0a] border border-[#D4AF37]/10 p-3 rounded-xl">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-[#121212]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold text-sm truncate">{product.name}</h4>
                          <p className="text-[10px] text-gray-500 line-clamp-1">{product.inspiration}</p>
                          <div className="mt-2">
                            <span className="text-[#D4AF37] text-sm font-bold">${getPrice(product)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              addToCart(product);
                              setFavoritesOpen(false);
                            }}
                            className="p-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#050505] rounded-lg transition-colors"
                            title="Agregar al carrito"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </button>
                          <button
                            onClick={() => toggleFavorite(favId)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                            title="Eliminar de favoritos"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="mt-16 bg-black border-t border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Separador decorativo */}
          <div className="flex items-center gap-3 pt-10 pb-8">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
            <span className="text-[#D4AF37]/30 text-xl">✦</span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          </div>

          {/* Grid 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
            {/* Col 1 — Logo + Descripción */}
            <div>
              <img 
                src={logoPerfumes} 
                alt="Perfumes Infini" 
                className="h-14 sm:h-20 w-auto object-contain mb-4" 
              />
              <p className="text-gray-500 text-sm leading-relaxed">
                Fragancias inspiradas en las mejores casas de lujo del mundo.
                Concentración <strong className="text-[#D4AF37]/80">ELIXIR PREMIUM 40%</strong> + Feromonas para una
                experiencia olfativa inolvidable a una fracción del precio.
              </p>
              <p className="text-xs text-gray-600 mt-4 italic">
                "Crear recuerdos convertidos en un aroma infinito"
              </p>
            </div>

            {/* Col 2 — Contacto */}
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase tracking-[0.2em] text-xs">
                Contacto
              </h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-3 group">
                  <span className="w-8 h-8 rounded-lg bg-[#121212] border border-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#050505] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                  </span>
                  contacto@perfumesinfini.com
                </li>
                <li className="flex items-center gap-3 group">
                  <span className="w-8 h-8 rounded-lg bg-[#121212] border border-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#050505] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                  </span>
                  +52 555 123 4567
                </li>
                <li className="flex items-center gap-3 group">
                  <span className="w-8 h-8 rounded-lg bg-[#121212] border border-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#050505] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                  </span>
                  Ciudad de México, MX
                </li>
              </ul>
            </div>

            {/* Col 3 — Redes Sociales */}
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase tracking-[0.2em] text-xs">
                Síguenos
              </h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-[#121212] border border-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-all hover:shadow-lg hover:shadow-[#D4AF37]/20"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" /></svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-[#121212] border border-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-all hover:shadow-lg hover:shadow-[#D4AF37]/20"
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-[#121212] border border-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] transition-all hover:shadow-lg hover:shadow-[#D4AF37]/20"
                  aria-label="TikTok"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
                </a>
              </div>
              <p className="text-gray-600 text-xs mt-5 leading-relaxed">
                Síguenos en redes para conocer lanzamientos exclusivos, promociones y nuevos aromas cada mes.
              </p>
            </div>
          </div>

          {/* Firma */}
          <div className="border-t border-[#D4AF37]/10 py-5 text-center">
            <p className="text-gray-600 text-xs">
              &copy; {new Date().getFullYear()} Perfumes Infini — El Aroma Infinito. Todos los derechos reservados.
            </p>
            <p className="text-[#D4AF37]/50 text-[10px] mt-1 tracking-[0.15em]">
              Diseñado por IMAGINE &amp; STAMP
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
