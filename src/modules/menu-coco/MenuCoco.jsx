import { useState, useEffect } from 'react';
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import imgHero from './coco-hero.png';

// ──────────────────────────────────────────────────────────────
//  Módulo AISLADO: Agua de Coco 100% Natural
//  No comparte estado ni variables con otros módulos del proyecto.
// ──────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = '523328199159';

// Iconos vectoriales personalizados para los productos
const BotellaSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2h4v4l2 3v13a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V9l2-3V2z" />
  </svg>
);

const GarrafonSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 2h6v4l3 3v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9l3-3V2z" />
    <path d="M18 9h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" />
  </svg>
);

// Catálogo local (base de datos del módulo)
const PRODUCTOS = [
  { 
    id: 'medio-litro', 
    nombre: 'Medio Litro', 
    detalle: '500 ml bien frío', 
    precio: 30,
    icono: <BotellaSVG className="w-8 h-8 text-white" />
  },
  { 
    id: 'litro', 
    nombre: 'Litro', 
    detalle: '1 litro para compartir', 
    precio: 50,
    icono: <BotellaSVG className="w-12 h-12 text-white" />
  },
  { 
    id: 'galon', 
    nombre: 'Galón (4 litros)', 
    detalle: 'Rinde para toda la familia', 
    precio: 180,
    icono: <GarrafonSVG className="w-14 h-14 text-white" />
  },
];

const formatoMXN = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

export default function MenuCoco() {
  const [cart, setCart] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    metodoPago: 'Efectivo',
    notas: '',
  });

  useEffect(() => {
    const prev = document.title;
    document.title = 'Agua de Coco | 100% Natural';
    return () => {
      document.title = prev;
    };
  }, []);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  const addItem = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));

  const removeItem = (id) =>
    setCart((c) => {
      const cant = (c[id] || 0) - 1;
      const next = { ...c };
      if (cant <= 0) delete next[id];
      else next[id] = cant;
      return next;
    });

  const lineas = PRODUCTOS
    .filter((p) => cart[p.id] > 0)
    .map((p) => ({ ...p, cantidad: cart[p.id], importe: cart[p.id] * p.precio }));

  const subtotal = lineas.reduce((acc, l) => acc + l.importe, 0);
  const totalItems = lineas.reduce((acc, l) => acc + l.cantidad, 0);

  const envioGratis = (cart['galon'] || 0) >= 1 || subtotal >= 200;
  const costoEnvio = envioGratis ? 0 : 200;
  const total = subtotal + costoEnvio;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const enviarPedido = () => {
    if (lineas.length === 0) {
      alert('Agrega al menos un producto a tu pedido 🥥');
      return;
    }
    if (!form.nombre.trim() || !form.direccion.trim()) {
      alert('Por favor completa tu nombre y dirección de entrega.');
      return;
    }

    const resumen = lineas
      .map((l) => `• ${l.cantidad}x ${l.nombre} — ${formatoMXN(l.importe)}`)
      .join('%0A');

    const envioTexto = envioGratis
      ? 'ENVÍO GRATIS 🍃'
      : `${formatoMXN(costoEnvio)}`;

    const mensaje =
      `¡Hola! 🥥 Quiero hacer un pedido de Agua de Coco 100%25 Natural:` +
      `%0A%0A` +
      `*Resumen del pedido:*%0A${resumen}` +
      `%0A%0A*Subtotal:* ${formatoMXN(subtotal)}` +
      `%0A*Envío:* ${envioTexto}` +
      `%0A*TOTAL:* ${formatoMXN(total)}` +
      `%0A%0A*Método de pago:* ${form.metodoPago}` +
      `%0A%0A*Datos de entrega:*` +
      `%0ANombre: ${form.nombre}` +
      `%0ADirección: ${form.direccion}` +
      (form.notas.trim() ? `%0ANotas: ${form.notas}` : '') +
      `%0A%0A_Recordatorio: mantener el producto frío 🌡️_`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      className="min-h-screen bg-stone-50 text-green-950 pb-28" 
      style={{ fontFamily: "'Fredoka', sans-serif" }}
    >
      {/* ── Hero Banner ── */}
      <header className="relative w-full h-auto py-4 md:py-6 bg-green-900 overflow-hidden">
        {/* Imagen de hojas de palma oscura en el fondo */}
        <img 
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Hojas de palma tropicales"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 to-transparent"></div>
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 px-4 h-full">
          {/* Columna Izquierda: Textos */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left z-10">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xl md:text-2xl font-bold text-white drop-shadow-md tracking-widest uppercase mb-[-6px] md:mb-[-8px] z-10 transform -rotate-3 ml-2">
                Agua de
              </span>
              <h1 className="text-[3.5rem] md:text-[4.5rem] font-bold text-[#84CC16] drop-shadow-2xl tracking-tighter uppercase leading-none">
                COCO
              </h1>
            </div>
            
            <div className="mt-1 bg-[#84CC16] text-green-950 px-5 py-1 md:py-1.5 rounded-[2rem] font-bold tracking-widest text-sm md:text-base shadow-xl transform -rotate-2 inline-flex items-center gap-2">
              <span className="text-base">🍃</span> 100% NATURAL <span className="text-base transform scale-x-[-1]">🍃</span>
            </div>

            <div className="mt-3 border-b-2 border-[#84CC16] pb-1 inline-block">
              <p className="text-white font-semibold tracking-[0.1em] md:tracking-[0.15em] text-[9px] md:text-[10px] uppercase drop-shadow-md">
                Lo natural siempre es mejor
              </p>
            </div>
          </div>
          
          {/* Columna Derecha: Imagen del Coco */}
          <img 
            src={imgHero} 
            alt="Agua de Coco Fresca" 
            className="w-36 md:w-48 object-contain drop-shadow-2xl animate-fade-in-up" 
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* ── Catálogo ── */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PRODUCTOS.map((p) => {
              const cant = cart[p.id] || 0;
              const esGalon = p.id === 'galon';
              
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border-2 border-green-100 shadow-sm overflow-hidden flex flex-col relative"
                >
                  <div className="flex p-4 flex-1">
                    {/* Ícono a la Izquierda */}
                    <div className="w-24 shrink-0 flex flex-col items-center justify-center">
                      <div className="bg-[#84CC16] rounded-full w-20 h-20 flex items-center justify-center shadow-inner">
                        {p.icono}
                      </div>
                    </div>

                    {/* Info Derecha */}
                    <div className="pl-4 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-bold text-green-900 leading-tight text-xl">{p.nombre}</h3>
                        <p className="text-sm text-stone-500 mt-1">{p.detalle}</p>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <p className="font-extrabold text-[#84CC16] text-2xl flex items-center gap-1 drop-shadow-sm">
                          {formatoMXN(p.precio)} <span className="text-lg">🍃</span>
                        </p>
                        
                        <div className="flex items-center gap-3">
                          {cant > 0 ? (
                            <>
                              <button
                                onClick={() => removeItem(p.id)}
                                className="w-9 h-9 rounded-full bg-green-100 text-green-900 flex items-center justify-center hover:bg-green-200 transition-colors shadow-sm"
                              >
                                <Minus size={20} strokeWidth={3} />
                              </button>
                              <span className="w-4 text-center font-bold text-lg">{cant}</span>
                              <button
                                onClick={() => addItem(p.id)}
                                className="w-9 h-9 rounded-full bg-green-900 text-white flex items-center justify-center hover:bg-green-800 transition-colors shadow-md"
                              >
                                <Plus size={20} strokeWidth={3} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => addItem(p.id)}
                              className="bg-green-100 text-green-900 hover:bg-green-200 font-bold px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <Plus size={18} strokeWidth={3} /> Agregar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insignias de Envío (Crucial) */}
                  <div className="w-full bg-stone-50 border-t border-green-50 px-4 py-2 flex items-center justify-center">
                    {esGalon ? (
                      <span className="bg-[#84CC16] text-white font-bold px-4 py-1 rounded-full text-sm animate-pulse shadow-sm tracking-wide">
                        🚀 ENVÍO GRATIS
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                        📍 Envío con costo extra
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ── Botón Flotante (FAB) ── */}
      <AnimatePresence>
        {totalItems > 0 && !isModalOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-40"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-green-900 hover:bg-green-800 text-white shadow-2xl rounded-2xl p-4 flex items-center justify-between transition-transform active:scale-95"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-[#84CC16] text-green-950 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-green-900 shadow-sm">
                    {totalItems}
                  </span>
                </div>
                <span className="font-bold text-lg tracking-wide">Ver pedido</span>
              </div>
              <span className="font-extrabold text-xl bg-green-800 px-3 py-1 rounded-xl text-[#84CC16]">
                {formatoMXN(subtotal)}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal de Checkout ── */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 md:top-4 md:bottom-4 md:left-auto md:right-4 md:w-[26rem] md:rounded-3xl bg-stone-50 z-50 rounded-t-3xl overflow-hidden flex flex-col shadow-2xl"
              style={{ maxHeight: '90vh' }}
            >
              {/* Header Modal */}
              <div className="bg-white px-6 py-5 border-b border-stone-100 flex items-center justify-between shrink-0">
                <h2 className="text-2xl font-bold text-green-900 flex items-center gap-2">
                  <ShoppingCart size={24} className="text-[#84CC16]" />
                  Tu pedido
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-stone-100 text-stone-500 rounded-full hover:bg-stone-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contenido Modal Scrollable */}
              <div className="overflow-y-auto p-6 space-y-6 flex-1">
                
                {/* Banners de promoción */}
                <div className="space-y-2">
                  <div className="bg-[#84CC16] text-green-950 font-bold rounded-2xl px-4 py-3 text-center shadow-sm flex items-center justify-center gap-2 text-sm tracking-wide">
                    <span>🍃</span> En la compra de Galón ENVÍO GRATIS
                  </div>
                  <p className="text-xs text-center text-stone-400 font-medium tracking-wide">
                    Importante: Mantener el producto frío 🌡️
                  </p>
                </div>

                {/* Resumen del carrito */}
                <div className="bg-green-50 rounded-3xl p-5 border border-green-100">
                  <div className="space-y-4">
                    {lineas.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => {
                              setCart(prev => {
                                const next = { ...prev };
                                delete next[item.id];
                                return next;
                              });
                            }}
                            className="text-red-400 hover:text-red-600 transition-colors bg-white rounded-full p-1.5 shadow-sm border border-red-100 flex-shrink-0"
                            title="Eliminar producto"
                          >
                            <Trash2 size={16} />
                          </button>
                          <span className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded-lg text-sm">
                            {item.cantidad}x
                          </span>
                          <span className="font-bold text-green-950 leading-tight">{item.nombre}</span>
                        </div>
                        <span className="font-bold text-green-800 ml-4">{formatoMXN(item.importe)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-green-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-800">Subtotal</span>
                      <span className="font-bold text-green-950">{formatoMXN(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-800">Costo de Envío</span>
                      <span className="font-bold text-green-950">
                        {envioGratis ? <span className="text-[#84CC16] uppercase text-xs tracking-wider">¡Gratis!</span> : formatoMXN(costoEnvio)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-green-100 pt-2">
                      <span className="font-black text-green-950 text-lg">Total</span>
                      <span className="text-2xl font-extrabold text-[#84CC16] drop-shadow-sm">
                        {formatoMXN(total)}
                      </span>
                    </div>
                  </div>
                  {envioGratis && (
                    <p className="mt-4 text-sm font-bold text-[#84CC16] text-center bg-white py-2.5 rounded-xl border border-green-100 shadow-sm tracking-wide">
                      ¡Tu pedido incluye ENVÍO GRATIS! 🚀
                    </p>
                  )}
                </div>

                {/* Formulario de checkout */}
                <div className="space-y-3">
                  <h3 className="font-bold text-green-900 mb-2 text-lg">Datos de entrega</h3>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    className="w-full rounded-2xl border-2 border-stone-100 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#84CC16] focus:border-transparent bg-white shadow-sm font-medium text-stone-700"
                  />
                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    placeholder="Dirección de entrega completa"
                    className="w-full rounded-2xl border-2 border-stone-100 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#84CC16] focus:border-transparent bg-white shadow-sm font-medium text-stone-700"
                  />
                  <select
                    name="metodoPago"
                    value={form.metodoPago}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-2 border-stone-100 px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#84CC16] focus:border-transparent shadow-sm font-medium text-stone-700"
                  >
                    <option value="Efectivo">Pago en Efectivo</option>
                    <option value="Transferencia">Pago con Transferencia</option>
                    <option value="Tarjeta">Pago con Tarjeta</option>
                  </select>
                  <textarea
                    name="notas"
                    value={form.notas}
                    onChange={handleChange}
                    placeholder="Notas adicionales (opcional)"
                    rows={2}
                    className="w-full rounded-2xl border-2 border-stone-100 px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#84CC16] focus:border-transparent bg-white shadow-sm font-medium text-stone-700"
                  />
                </div>
              </div>

              {/* Footer Modal (Botón Enviar) */}
              <div className="bg-white p-5 border-t border-stone-100 shrink-0">
                <button
                  onClick={enviarPedido}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-4 rounded-2xl transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-2 text-xl tracking-wide"
                >
                  Pedir por WhatsApp 🥥
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <footer className="bg-green-900 text-white mt-12 pb-12">
        <div className="max-w-4xl mx-auto px-6 py-10 grid gap-8 sm:grid-cols-3 text-center sm:text-left">
          <div>
            <h3 className="font-bold text-[#84CC16] text-xl mb-3">Visítanos</h3>
            <p className="text-base text-green-100">
              Av. Siempre Fresca #123,<br />
              Col. Las Palmas,<br />
              Guadalajara, Jal.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#84CC16] text-xl mb-3">Contacto</h3>
            <p className="text-base text-green-100">
              Tel: 332 819 9159<br />
              Pedidos por WhatsApp
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#84CC16] text-xl mb-3">Síguenos</h3>
            <ul className="text-base text-green-100 space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TikTok</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-800">
          <p className="max-w-4xl mx-auto px-6 py-6 text-center text-sm text-[#84CC16] font-medium tracking-wide">
            Lo natural siempre es mejor. Disfruta lo natural, disfruta lo fresco.
          </p>
        </div>
      </footer>
    </div>
  );
}
