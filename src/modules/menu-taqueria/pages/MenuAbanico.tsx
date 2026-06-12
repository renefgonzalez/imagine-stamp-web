import React, { useState, useEffect } from 'react';

// === CONSTANTES ===
const WHATSAPP_NUMBER = "525650469993";

// === TIPOS DE DATOS ===
interface Product {
  id: string;
  name: string;
  price: number;
}

interface Category {
  title: string;
  note?: string;
  items: Product[];
}

interface CartItem extends Product {
  quantity: number;
}

interface CustomerData {
  name: string;
  address: string;
  notes: string;
}

// === BASE DE DATOS LOCAL ===
const MENU: Category[] = [
  {
    title: 'Tacos de Carnitas',
    items: [
      { id: 'c-costilla', name: 'Costilla', price: 31 },
      { id: 'c-surtida', name: 'Surtida', price: 30 },
      { id: 'c-maciza', name: 'Maciza', price: 30 },
      { id: 'c-cuero', name: 'Cuero', price: 30 },
      { id: 'c-buche', name: 'Buche', price: 30 },
      { id: 'c-nana', name: 'Nana', price: 30 },
      { id: 'c-lengua', name: 'Lengua', price: 30 },
      { id: 'c-chamorro', name: 'Chamorro', price: 30 },
      { id: 'c-pastor', name: 'Pastor', price: 22 },
    ]
  },
  {
    title: 'Tacos de Parrilla',
    items: [
      { id: 'p-cecina', name: 'Cecina Natural', price: 31 },
      { id: 'p-longaniza', name: 'Longaniza', price: 30 },
      { id: 'p-cecina-ench', name: 'Cecina Enchilada', price: 30 },
      { id: 'p-chuleta-ah', name: 'Chuleta Ahumada', price: 30 },
      { id: 'p-chuleta-fr', name: 'Chuleta Fresca', price: 30 },
      { id: 'p-campechano', name: 'Campechano', price: 30 },
      { id: 'p-bistec', name: 'Bistec', price: 30 },
      { id: 'p-pechuga', name: 'Pechuga de Pollo', price: 30 },
    ]
  },
  {
    title: 'Carne por Kilo',
    items: [
      { id: 'k-carnitas', name: 'Carnitas', price: 340 },
      { id: 'k-parrilla', name: 'Parrilla', price: 340 },
      { id: 'k-pastor', name: 'Pastor', price: 340 },
      { id: 'k-pieza', name: 'Pieza de Chamorro con Guacamole Especial y Frijoles Charros', price: 200 },
    ]
  },
  {
    title: 'Órdenes',
    items: [
      { id: 'o-chicharron', name: 'Chicharrón', price: 25 },
      { id: 'o-cebollitas', name: 'Cebollitas', price: 25 },
      { id: 'o-papa', name: 'Papa', price: 25 },
      { id: 'o-frijoles', name: 'Frijoles', price: 25 },
      { id: 'o-aguacate', name: 'Aguacate', price: 25 },
      { id: 'o-crema', name: 'Crema', price: 25 },
      { id: 'o-nopales', name: 'Nopales', price: 25 },
      { id: 'o-salsas', name: 'Salsas', price: 25 },
    ]
  },
  {
    title: 'Quesadillas',
    note: 'Solo viernes, sábado y domingo',
    items: [
      { id: 'q-sesos', name: 'Sesos', price: 15 },
      { id: 'q-carnitas', name: 'Carnitas', price: 15 },
      { id: 'q-papa', name: 'Papa con Longaniza', price: 15 },
      { id: 'q-picadillo', name: 'Picadillo', price: 15 },
    ]
  }
];

export default function MenuAbanico() {
  // === ESTADOS ===
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    address: '',
    notes: ''
  });

  // === SEO Y METADATOS ===
  useEffect(() => {
    // Guardamos los valores originales para la limpieza
    const originalTitle = document.title;
    
    // Funciones helpers para cambiar tags de forma segura
    const setMetaTag = (attribute: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      const originalContent = element.getAttribute('content');
      element.setAttribute('content', content);
      return originalContent;
    };

    // Aplicar los nuevos metadatos de la taquería
    document.title = "Taquería El Gran Abanico | Menú Digital";
    const oldDesc = setMetaTag('name', 'description', "Pide tus tacos de carnitas, pastor y parrilla a domicilio o para recoger. Pago en efectivo.");
    const oldOgTitle = setMetaTag('property', 'og:title', "Taquería El Gran Abanico | Menú Digital");
    const oldOgDesc = setMetaTag('property', 'og:description', "Pide tus tacos de carnitas, pastor y parrilla a domicilio o para recoger. Pago en efectivo.");

    // Función de limpieza al desmontar
    return () => {
      document.title = "Imagine and Stamp";
      setMetaTag('name', 'description', oldDesc || "");
      setMetaTag('property', 'og:title', oldOgTitle || "");
      setMetaTag('property', 'og:description', oldOgDesc || "");
    };
  }, []);

  // === LÓGICA DEL CARRITO ===
  const handleUpdateQuantity = (product: Product, delta: number) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + delta;
        if (newQuantity <= 0) {
          return prev.filter(item => item.id !== product.id);
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
      } else if (delta > 0) {
        return [...prev, { ...product, quantity: 1 }];
      }
      
      return prev;
    });
  };

  const getItemQuantity = (id: string) => {
    return cart.find(item => item.id === id)?.quantity || 0;
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // === CHECKOUT DE WHATSAPP ===
  const handleCheckout = () => {
    if (!customerData.name.trim() || !customerData.address.trim()) {
      alert("Por favor llena tu nombre y dirección de entrega.");
      return;
    }

    let message = `¡Hola! Quiero hacer un pedido en *Taquería El Gran Abanico*\n\n`;
    message += `*MI PEDIDO:*\n`;
    
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} ($${item.price * item.quantity})\n`;
    });

    message += `\n*Subtotal a pagar:* $${subtotal}\n`;
    message += `*(Pago solo en Efectivo)*\n\n`;

    message += `*MIS DATOS:*\n`;
    message += `Nombre: ${customerData.name}\n`;
    message += `Dirección: ${customerData.address}\n`;
    if (customerData.notes.trim()) {
      message += `Notas: ${customerData.notes}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-24">
      
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#0A192F] text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#F5A623] tracking-tight">
              TAQUERÍA EL GRAN ABANICO
            </h1>
            <p className="text-xs text-gray-300">El verdadero sabor de México</p>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-[#F5A623] text-[#0A192F] px-4 py-2 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-colors shadow-lg"
          >
            <span>🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-black border-2 border-[#0A192F]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        
        {MENU.map((category, index) => (
          <React.Fragment key={index}>
            {category.title === 'Tacos de Carnitas' && (
              <img 
                src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Tacos de Carnitas y Pastor" 
                className="w-full h-48 md:h-56 object-cover rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300"
              />
            )}
            {category.title === 'Tacos de Parrilla' && (
              <img 
                src="https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Tacos de Parrilla y Cecina" 
                className="w-full h-48 md:h-56 object-cover rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300"
              />
            )}
            {category.title === 'Órdenes' && (
              <img 
                src="https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=800&q=80" 
                alt="Guarniciones y Nopales" 
                className="w-full h-48 md:h-56 object-cover rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300"
              />
            )}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-black text-[#0A192F]">{category.title}</h2>
              {category.note && (
                <p className="text-[#F5A623] font-bold text-sm mt-1 bg-orange-50 inline-block px-3 py-1 rounded-full">
                  ⚠️ {category.note}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((product) => {
                const quantity = getItemQuantity(product.id);
                
                return (
                  <article key={product.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex-1 pr-4">
                      <h3 className="text-base font-bold text-[#0A192F] leading-tight mb-1">{product.name}</h3>
                      <span className="text-[#F5A623] font-black text-lg">${product.price}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1 shadow-inner">
                      <button 
                        onClick={() => handleUpdateQuantity(product, -1)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${quantity > 0 ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400'}`}
                        disabled={quantity === 0}
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-bold text-[#0A192F]">{quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(product, 1)}
                        className="w-8 h-8 rounded-full bg-[#0A192F] text-white flex items-center justify-center font-bold text-lg shadow-sm hover:bg-[#112a4d] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
          </React.Fragment>
        ))}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#0A192F] text-gray-200 py-12 px-4 mt-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Ubicación */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[#F5A623] font-black text-xl mb-4 tracking-wide uppercase">Visítanos</h3>
            <p className="text-gray-300 font-medium">Calle Falsa 123, Colonia Centro, CDMX</p>
          </div>

          {/* Contacto */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[#F5A623] font-black text-xl mb-4 tracking-wide uppercase">Contáctanos</h3>
            <p className="text-gray-300 font-medium mb-1">Teléfono / WhatsApp:</p>
            <p className="text-white font-bold text-lg mb-3">(55) 0000-0000</p>
            <p className="text-gray-300 font-medium text-sm">Lunes a Domingo:<br/>10:00 am - 10:00 pm</p>
          </div>

          {/* Redes Sociales */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[#F5A623] font-black text-xl mb-4 tracking-wide uppercase">Síguenos</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F5A623] hover:text-[#0A192F] transition-colors" aria-label="Facebook">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F5A623] hover:text-[#0A192F] transition-colors" aria-label="Instagram">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F5A623] hover:text-[#0A192F] transition-colors" aria-label="TikTok">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.5 3.96-1.82 5.36-1.27 1.39-3.15 2.15-5.08 2.22-1.92.05-3.88-.47-5.38-1.74-1.5-1.29-2.39-3.2-2.39-5.18 0-1.97.91-3.87 2.4-5.14 1.48-1.28 3.42-1.83 5.35-1.81.01 1.34.01 2.68.01 4.02-1.01-.03-2.04.14-2.9.72-.88.58-1.4 1.6-1.39 2.63.02 1.05.62 2.05 1.51 2.59.88.55 1.98.71 2.97.45.98-.24 1.83-.94 2.22-1.86.37-.87.4-1.85.4-2.8V.02z"/></svg>
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* MODAL / SIDEBAR DEL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* OVERLAY */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* PANEL BLANCO */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 bg-[#0A192F] text-white flex justify-between items-center">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <span>🛒</span> Mi Pedido
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-white hover:text-[#F5A623] transition-colors"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  Tu carrito está vacío.
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <div className="flex-1">
                          <p className="font-bold text-[#0A192F]">{item.name}</p>
                          <p className="text-sm text-gray-500">${item.price} c/u</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                            <button onClick={() => handleUpdateQuantity(item, -1)} className="w-6 h-6 bg-white rounded-full font-bold text-sm shadow-sm">-</button>
                            <span className="w-4 text-center font-bold text-sm">{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item, 1)} className="w-6 h-6 bg-[#0A192F] text-white rounded-full font-bold text-sm shadow-sm">+</button>
                          </div>
                          <span className="font-black text-[#0A192F] w-16 text-right">${item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#F8F9FA] p-4 rounded-xl flex justify-between items-center border border-gray-200">
                    <span className="font-bold text-gray-600">Subtotal:</span>
                    <span className="text-2xl font-black text-[#0A192F]">${subtotal}</span>
                  </div>

                  {/* AVISO IMPORTANTE */}
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                    <p className="font-black text-red-700 uppercase tracking-wide flex items-center gap-2">
                      <span>⚠️</span> AVISO IMPORTANTE
                    </p>
                    <p className="text-red-600 text-sm font-medium mt-1">
                      El pago de tu pedido es <strong>solo en efectivo</strong> al momento de la entrega.
                    </p>
                  </div>

                  {/* FORMULARIO DE ENVÍO */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="font-black text-[#0A192F] text-lg border-b border-gray-100 pb-2">Datos de Entrega</h3>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Nombre Completo *</label>
                      <input 
                        type="text" 
                        value={customerData.name}
                        onChange={e => setCustomerData({...customerData, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Dirección Completa *</label>
                      <textarea 
                        value={customerData.address}
                        onChange={e => setCustomerData({...customerData, address: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent resize-none"
                        placeholder="Calle, número, colonia, referencias..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Notas del Pedido (Opcional)</label>
                      <input 
                        type="text" 
                        value={customerData.notes}
                        onChange={e => setCustomerData({...customerData, notes: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
                        placeholder="Ej. Sin cebolla, traer cambio de $500..."
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* FOOTER DEL MODAL */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#25D366] text-white py-4 rounded-full font-black text-lg hover:bg-[#1DA851] transition-colors shadow-lg flex justify-center items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Hacer Pedido por WhatsApp
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
