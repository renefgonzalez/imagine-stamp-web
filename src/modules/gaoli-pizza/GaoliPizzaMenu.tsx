import React, { useState, useEffect, useRef } from 'react';
import { 
  Pizza, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Settings, 
  Upload, 
  Eye, 
  EyeOff, 
  Edit, 
  Phone, 
  MapPin, 
  X,
  Check,
  Coffee,
  Gift,
  Clock,
  Info,
  Instagram,
  Facebook,
  Mail,
  Copy,
  ChevronLeft,
  Search
} from 'lucide-react';

// --- INITIAL DATA ---
const PRODUCTS = [
  // Especialidades
  { id: 'esp1', name: 'Pizza Hawaiana', description: 'Jamón de pavo, piña, queso, puré de tomate', price: 120, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },
  { id: 'esp2', name: 'Pizza Carnes Frías', description: 'Jamón de pavo, pepperoni, queso, salchicha de pavo', price: 130, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop' },
  { id: 'esp3', name: 'Pizza Diabla', description: 'Chorizo, chile seco, queso, puré de tomate', price: 125, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop' },
  { id: 'esp4', name: 'Pizza Mexicana', description: 'Frijol, chorizo, cebolla, jalapeño, queso, puré de tomate', price: 135, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop' },
  { id: 'esp5', name: 'Pizza Caprichosa', description: 'Jamón de pavo, salchicha de pavo, champiñones, aceitunas, queso, puré', price: 140, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop' },
  { id: 'esp6', name: 'Pizza Española', description: 'Jamón de pavo, champiñones, salchicha, cebolla, jalapeño, queso', price: 140, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop' },
  { id: 'esp7', name: 'Pizza Vegetariana', description: 'Champiñones, morrón, elote, queso, puré de tomate', price: 120, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop' },
  { id: 'esp8', name: 'Pizza Sencilla', description: 'Queso, jamón de pavo, puré de tomate', price: 100, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop' },
  { id: 'esp9', name: 'Pizza Pepperoni', description: 'Pepperoni, jamón de pavo, queso, puré', price: 110, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop' },
  { id: 'esp10', name: 'Pizza 4 Quesos', description: 'Gouda, mozzarella, cheddar, parmesano', price: 150, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&auto=format&fit=crop' },
  { id: 'esp11', name: 'Pizza al Pastor', description: 'Carne al pastor, piña, cebolla, cilantro, queso', price: 140, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },
  { id: 'esp12', name: 'Pizza Norteña', description: 'Arrachera, chorizo, cebolla, pimiento, queso', price: 160, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&auto=format&fit=crop' },
  { id: 'esp13', name: 'Pizza Italiana', description: 'Salami, pepperoni, jamón, aceitunas, queso', price: 150, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop' },
  { id: 'esp14', name: 'Super Pepperoni', description: 'Extra pepperoni, extra queso, puré', price: 130, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop' },
  { id: 'esp15', name: 'Pizza del Mar', description: 'Camarones, pimiento, cebolla, queso', price: 180, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },
  { id: 'esp16', name: 'Pizza Azteca', description: 'Pollo, chorizo, jalapeño, elote, queso', price: 145, category: 'Especialidades', available: true, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop' },
  
  // Especiales y Porciones
  { id: 'porc1', name: 'Fugazatta Rellena', description: 'Deliciosa masa rellena de queso y cebolla', price: 150, category: 'Porciones y Más', available: true, image: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600&auto=format&fit=crop' },
  { id: 'porc2', name: 'Calzone', description: 'Empanada italiana rellena al gusto', price: 80, category: 'Porciones y Más', available: true, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop' },
  { id: 'porc3', name: 'Rebanada de Pizza', description: 'Rebanada gigante, varios ingredientes', price: 25, category: 'Porciones y Más', available: true, image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=600&auto=format&fit=crop' },
  { id: 'porc4', name: 'Deditos de Queso', description: 'Palitos de pan rellenos de queso mozzarella (orden)', price: 60, category: 'Porciones y Más', available: true, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop' },
  
  // Combos
  { id: 'combo1', name: 'Domo Escolar #1', description: '2 Rebanadas de pizza + 1 Frutsi', price: 60, category: 'Combos', available: true, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop' },
  { id: 'combo2', name: 'Domo Escolar #2', description: '1 Rebanada de pizza + 1 Dedo de queso + 1 Frutsi', price: 65, category: 'Combos', available: true, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop' },
  { id: 'combo3', name: 'Domo Escolar #3', description: '2 Rebanadas de pizza + Papas + 1 Frutsi', price: 80, category: 'Combos', available: true, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop' },
  { id: 'combo4', name: 'Combo Fiesta 1', description: '2 Pizzas grandes (hasta 3 ingredientes) + Refresco 3L', price: 320, category: 'Combos', available: true, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop' },
  { id: 'combo5', name: 'Combo Fiesta 2', description: '3 Pizzas grandes + 2 Refrescos 3L', price: 500, category: 'Combos', available: true, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop' },
  { id: 'promo1', name: 'Promo 1', description: 'Pizza grande + Refresco 1.5L', price: 160, category: 'Combos', available: true, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop' },
  { id: 'promo2', name: 'Promo 2', description: 'Pizza grande + Deditos de queso + Refresco', price: 190, category: 'Combos', available: true, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop' },
  { id: 'promo3', name: 'Promo 3', description: '2 Pizzas grandes sencillas + Refresco', price: 220, category: 'Combos', available: true, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop' },
  { id: 'promo4', name: 'Promo 4', description: 'Pizza gigante + Refresco 3L', price: 210, category: 'Combos', available: true, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop' },
  
  // Bebidas y Postres
  { id: 'beb1', name: 'Licuado', description: 'Fresa, plátano, mamey, chocolate', price: 35, category: 'Bebidas y Postres', available: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop' },
  { id: 'beb2', name: 'Refresco lata', description: 'Coca-Cola, Sprite, Fanta', price: 20, category: 'Bebidas y Postres', available: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop' },
  { id: 'beb3', name: 'Electrolit', description: 'Varios sabores', price: 30, category: 'Bebidas y Postres', available: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop' },
  { id: 'beb4', name: 'Café', description: 'Americano o de olla', price: 25, category: 'Bebidas y Postres', available: true, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&auto=format&fit=crop' },
  { id: 'beb5', name: 'Agua sabor / Purificada', description: 'Horchata, jamaica, embotellada', price: 15, category: 'Bebidas y Postres', available: true, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop' },
  { id: 'beb6', name: 'Coca-Cola 600ml', description: 'Familiar', price: 25, category: 'Bebidas y Postres', available: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop' },
  { id: 'beb7', name: 'Coca-Cola 3L', description: 'Tamaño familiar', price: 55, category: 'Bebidas y Postres', available: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop' },
  { id: 'beb8', name: 'Boing', description: 'Mango, manzana, guayaba', price: 15, category: 'Bebidas y Postres', available: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop' },
  { id: 'beb9', name: 'Galletas Besitos/Avena', description: 'Paquete individual', price: 15, category: 'Bebidas y Postres', available: true, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop' },
  { id: 'beb10', name: 'Hotchos', description: 'Hot dog clásico', price: 30, category: 'Bebidas y Postres', available: true, image: 'https://images.unsplash.com/photo-1594211175653-b09e25d259c6?w=600&auto=format&fit=crop' },
];

export default function GaoliPizzaMenu() {
  const [menu, setMenu] = useState(() => {
    // Limpiamos el localStorage temporalmente para forzar que tome las nuevas imágenes
    localStorage.removeItem('gaoli_menu');
    return PRODUCTS;
  });
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [cartStep, setCartStep] = useState('cart'); // 'cart' | 'details' | 'success'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin form state
  const [editingItem, setEditingItem] = useState(null);
  const fileInputRef = useRef(null);

  // Customer info (canonical fields per guía)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'domicilio',
    address: '',
    paymentMethod: 'Efectivo',
    cashAmount: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  const categories = Array.from(new Set(menu.map(i => i.category)));

  useEffect(() => {
    localStorage.setItem('gaoli_menu', JSON.stringify(menu));
  }, [menu]);

  // Reset cartStep when closing cart
  useEffect(() => {
    if (!isCartOpen) {
      setTimeout(() => setCartStep('cart'), 300);
    }
  }, [isCartOpen]);

  // --- CART LOGIC ---
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }).filter(i => i.qty > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Bank info (hardcoded for demo — replace with real data)
  const bankInfo = {
    bank_name: 'BBVA',
    account_holder: 'Gaoli Pizza',
    clabe: '012345678901234567',
    account_number: '0123456789',
    card_number: '4152 3134 5678 9012'
  };

  const sendOrder = () => {
    const name = customerInfo.name.trim();
    const phone = customerInfo.phone.trim();
    
    let ok = true;
    const newErrs = {};
    if (!name) { newErrs.name = true; ok = false; }
    if (!phone) { newErrs.phone = true; ok = false; }
    if (customerInfo.deliveryMethod === 'domicilio' && !customerInfo.address.trim()) {
      newErrs.address = true; ok = false;
    }
    if (customerInfo.paymentMethod === 'Efectivo' && !customerInfo.cashAmount.trim()) {
      newErrs.cashAmount = true; ok = false;
    }
    setErrors(newErrs);
    if (!ok) {
      alert("Completa los datos marcados en rojo para poder enviar tu pedido.");
      return;
    }

    const itemsText = cart.map(i => `🍕 ${i.qty}x ${i.name} ($${i.price * i.qty})`).join('\n');
    
    const telefonoDestino = '527461350089';
    
    let pedido = `*NUEVO PEDIDO - GAOLI PIZZA* 🍕\n`;
    pedido += `------------------------\n`;
    pedido += `*Cliente:* ${name}\n`;
    pedido += `*Teléfono:* ${phone}\n`;
    pedido += `*Entrega:* ${customerInfo.deliveryMethod === 'domicilio' ? 'A domicilio' : 'Recoger en sucursal'}\n`;
    if (customerInfo.deliveryMethod === 'domicilio') {
      pedido += `*Dirección:* ${customerInfo.address.trim()}\n`;
    }
    pedido += `------------------------\n`;
    pedido += `*PRODUCTOS:*\n${itemsText}\n`;
    pedido += `------------------------\n`;
    pedido += `*TOTAL A PAGAR:* $${cartTotal}\n`;
    pedido += `*Método de Pago:* ${customerInfo.paymentMethod}`;
    
    if (customerInfo.paymentMethod === 'Efectivo') {
      pedido += ` (Paga con $${customerInfo.cashAmount})`;
      const cambioNum = parseFloat(customerInfo.cashAmount);
      if (!isNaN(cambioNum) && cambioNum >= cartTotal) {
        pedido += ` — Cambio: $${cambioNum - cartTotal}`;
      }
    }
    pedido += `\n`;
    if (customerInfo.notes.trim()) {
      pedido += `*Notas:* ${customerInfo.notes.trim()}\n`;
    }

    // Step 3: show success screen first
    setCartStep('success');
    
    const url = `https://wa.me/${telefonoDestino}?text=${encodeURIComponent(pedido.trim())}`;
    
    // CRITICAL: use location.href NOT window.open (per guía)
    setTimeout(() => {
      window.location.href = url;
    }, 500);

    // Clean cart & customerInfo after redirect (per guía)
    setTimeout(() => {
      setCart([]);
      setCustomerInfo({
        name: '', phone: '', deliveryMethod: 'domicilio', address: '',
        paymentMethod: 'Efectivo', cashAmount: '', notes: ''
      });
      setErrors({});
      setIsCartOpen(false);
    }, 800);
  };

  const copyBankInfo = () => {
    const info = `Banco: ${bankInfo.bank_name}\nTitular: ${bankInfo.account_holder}\nCLABE: ${bankInfo.clabe}\nCuenta: ${bankInfo.account_number}`;
    navigator.clipboard.writeText(info).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // --- ADMIN LOGIC ---
  const resetMenu = () => {
    if(confirm('¿Seguro que deseas restablecer el menú a su estado original?')) {
      setMenu(PRODUCTS);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEditingItem = () => {
    if (!editingItem.name || !editingItem.price) return;
    
    if (editingItem.id) {
      setMenu(prev => prev.map(i => i.id === editingItem.id ? editingItem : i));
    } else {
      const newItem = { ...editingItem, id: 'new_' + Date.now() };
      setMenu(prev => [...prev, newItem]);
    }
    setEditingItem(null);
  };

  const startEdit = (item = null) => {
    if (item) {
      setEditingItem({ ...item });
    } else {
      setEditingItem({ id: null, name: '', description: '', price: 0, category: 'Especialidades', available: true, image: '' });
    }
  };

  // --- FILTERS ---
  const filteredMenu = menu.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const name = (item.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const desc = (item.description || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      matchesSearch = name.includes(q) || desc.includes(q);
    }
    if (isAdminOpen) return matchesCategory && matchesSearch;
    return matchesCategory && matchesSearch && item.available;
  });

  const getCategoryIcon = (catName) => {
    if (catName.includes('Pizza') || catName.includes('Especial')) return <Pizza className="w-5 h-5" />;
    if (catName.includes('Combo')) return <Gift className="w-5 h-5" />;
    if (catName.includes('Bebida') || catName.includes('Postre')) return <Coffee className="w-5 h-5" />;
    return <Pizza className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-[#f4ebd9] font-sans text-[#4a2511] selection:bg-[#d35400] selection:text-white flex flex-col">
      
      {/* HEADER / HERO SECTION (Rústico Artesanal) */}
      <div className="relative w-full shadow-2xl border-b-[6px] border-[#4a2511]">
        <div className="h-64 sm:h-80 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1600&auto=format&fit=crop" 
            alt="Fondo Horno de Leña" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center p-4">
            <div className="bg-[#4a2511]/90 px-8 py-4 rounded-xl border-2 border-[#d35400] backdrop-blur-sm shadow-xl transform -rotate-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-widest text-[#f4ebd9] uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                Gaoli <span className="text-[#d35400]">Pizza</span>
              </h1>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3 font-bold text-sm">
              <span className="flex items-center gap-2 bg-[#d35400] text-white px-5 py-2 rounded-lg border border-[#f4ebd9]/30 shadow-lg">
                <MapPin className="w-4 h-4"/> Tihuatlán y Castillo de Teayo
              </span>
            </div>
            <div className="mt-3 flex gap-3 font-bold text-sm bg-white/10 backdrop-blur-md px-5 py-2 rounded-lg border border-white/20">
              <a href="tel:7461350089" className="flex items-center gap-1 hover:text-[#d35400] transition-colors"><Phone className="w-4 h-4 text-[#d35400]"/> 746 135 0089</a>
              <a href="tel:7651096663" className="flex items-center gap-1 hover:text-[#d35400] transition-colors"><Phone className="w-4 h-4 text-[#d35400]"/> 765 109 6663</a>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN TOGGLE */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsAdminOpen(!isAdminOpen)}
          className={`p-3 rounded-xl shadow-xl transition-all border-2 ${isAdminOpen ? 'bg-red-600 text-white border-red-800' : 'bg-[#4a2511] text-[#f4ebd9] border-[#d35400] hover:bg-[#341a0c]'}`}
        >
          {isAdminOpen ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
        </button>
      </div>

      {/* CATEGORIES (Rústico) */}
      <div className="max-w-5xl mx-auto px-4 mt-8 mb-4 overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex gap-4">
          <button 
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className={`flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-lg font-bold text-sm shadow-md transition-all duration-300 border-2 ${selectedCategory === 'all' ? 'bg-[#d35400] text-white border-[#4a2511] transform scale-105' : 'bg-[#fcf8f2] text-[#4a2511] border-[#e2d5c3] hover:bg-[#f4ebd9]'}`}
          >
            <Pizza className="w-5 h-5" /> Todas
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-lg font-bold text-sm shadow-md transition-all duration-300 border-2 ${selectedCategory === cat ? 'bg-[#d35400] text-white border-[#4a2511] transform scale-105' : 'bg-[#fcf8f2] text-[#4a2511] border-[#e2d5c3] hover:bg-[#f4ebd9]'}`}
            >
              {getCategoryIcon(cat)}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7d5641] w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim() && selectedCategory !== 'all') setSelectedCategory('all');
            }}
            onFocus={() => { if (selectedCategory !== 'all') setSelectedCategory('all'); }}
            placeholder="Busca pizzas, combos, bebidas..."
            className="w-full pl-12 pr-10 py-3 bg-white border-2 border-[#e2d5c3] rounded-xl text-[#4a2511] font-medium outline-none focus:border-[#d35400] transition-colors placeholder-[#7d5641]/50"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7d5641] hover:text-[#d35400]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* MENU GRID */}
      <div className="max-w-5xl mx-auto px-4 pb-12 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map(item => (
            <div key={item.id} className={`bg-white rounded-xl shadow-[0_4px_12px_rgba(74,37,17,0.1)] border border-[#e2d5c3] hover:shadow-[0_8px_24px_rgba(74,37,17,0.2)] transition-all duration-300 flex flex-col overflow-hidden ${!item.available && !isAdminOpen ? 'hidden' : ''} ${!item.available ? 'opacity-50 grayscale' : ''}`}>
              
              {/* Product Image */}
              <div className="h-48 w-full bg-[#f4ebd9] relative border-b-2 border-[#e2d5c3]">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                {!item.available && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm">AGOTADO</div>
                )}
              </div>

              {/* Product Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-[#4a2511] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>{item.name}</h3>
                </div>
                <p className="text-sm text-[#7d5641] leading-relaxed mb-4 flex-1">{item.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-[#d35400]">${item.price}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-[#4a2511] hover:bg-[#341a0c] text-white px-4 py-2 rounded-lg flex items-center gap-1 transition-all shadow-md border border-[#d35400]/30 active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Agregar
                  </button>
                </div>
              </div>

              {/* Admin controls */}
              {isAdminOpen && (
                <div className="p-3 bg-gray-50 border-t border-[#e2d5c3] flex gap-2">
                  <button 
                    onClick={() => setMenu(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i))}
                    className={`text-xs font-bold px-3 py-1 rounded ${item.available ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                  >
                    {item.available ? <><EyeOff className="w-3 h-3 inline" /> Ocultar</> : <><Eye className="w-3 h-3 inline" /> Mostrar</>}
                  </button>
                  <button onClick={() => startEdit(item)} className="text-xs font-bold px-3 py-1 rounded bg-blue-100 text-blue-700">
                    <Edit className="w-3 h-3 inline" /> Editar
                  </button>
                  <button onClick={() => { if(confirm('Eliminar?')) setMenu(prev => prev.filter(i => i.id !== item.id)); }} className="text-xs font-bold px-3 py-1 rounded bg-red-100 text-red-700">
                    <Trash2 className="w-3 h-3 inline" /> Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Admin Panel */}
        {isAdminOpen && (
          <div className="mt-8 bg-white rounded-xl border border-[#e2d5c3] p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black text-[#4a2511]" style={{ fontFamily: 'Georgia, serif' }}>Panel de Administración</h2>
              <div className="flex gap-2">
                <button onClick={() => startEdit()} className="bg-[#d35400] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#b04500] transition-colors">
                  <Plus className="w-4 h-4 inline" /> Nuevo Producto
                </button>
                <button onClick={resetMenu} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-300 transition-colors">
                  Restablecer Menú
                </button>
              </div>
            </div>

            {editingItem && (
              <div className="bg-[#fcf8f2] border border-[#e2d5c3] rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-[#4a2511]">{editingItem.id ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4a2511] mb-1">Nombre *</label>
                    <input type="text" className="w-full border border-[#e2d5c3] rounded p-2 bg-white" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4a2511] mb-1">Precio *</label>
                    <input type="number" className="w-full border border-[#e2d5c3] rounded p-2 bg-white" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#4a2511] mb-1">Descripción</label>
                    <input type="text" className="w-full border border-[#e2d5c3] rounded p-2 bg-white" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4a2511] mb-1">Categoría</label>
                    <select className="w-full border border-[#e2d5c3] rounded p-2 bg-white" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4a2511] mb-1">Imagen</label>
                    <div className="flex gap-2">
                      <input type="text" className="flex-1 border border-[#e2d5c3] rounded p-2 bg-white text-xs" value={editingItem.image} onChange={e => setEditingItem({...editingItem, image: e.target.value})} placeholder="URL de imagen" />
                      <label className="bg-[#4a2511] text-white px-3 py-2 rounded cursor-pointer hover:bg-[#341a0c] transition-colors">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} ref={fileInputRef} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-lg font-bold text-sm border border-[#e2d5c3] hover:bg-gray-50">Cancelar</button>
                  <button onClick={saveEditingItem} className="px-6 py-2 rounded-lg font-bold text-sm bg-[#d35400] text-white hover:bg-[#b04500]">Guardar</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── FOOTER DE 3 COLUMNAS ── */}
      <footer className="bg-[#4a2511] text-[#f4ebd9] mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna 1: Logo y descripción */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black tracking-widest uppercase mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Gaoli <span className="text-[#d35400]">Pizza</span>
              </h3>
              <p className="text-[#e2d5c3] text-sm leading-relaxed">
                Las pizzas más sabrosas al horno de leña. Tradición y sabor en cada rebanada. Servicio a domicilio en Tihuatlán y Castillo de Teayo.
              </p>
            </div>

            {/* Columna 2: Contacto, Teléfonos, Dirección y Horarios */}
            <div className="text-center">
              <h4 className="font-black text-[#d35400] uppercase text-sm tracking-wider mb-4">Contacto</h4>
              <div className="space-y-2 text-sm text-[#e2d5c3]">
                <p className="flex items-center justify-center gap-1"><Phone className="w-3 h-3 text-[#d35400]" /> 746 135 0089</p>
                <p className="flex items-center justify-center gap-1"><Phone className="w-3 h-3 text-[#d35400]" /> 765 109 6663</p>
                <p className="flex items-center justify-center gap-1"><MapPin className="w-3 h-3 text-[#d35400]" /> Tihuatlán y Castillo de Teayo, Ver.</p>
                <p className="flex items-center justify-center gap-1"><Clock className="w-3 h-3 text-[#d35400]" /> Lun-Dom · 12:00 - 22:00 hrs</p>
              </div>
            </div>

            {/* Columna 3: Redes Sociales */}
            <div className="text-center">
              <h4 className="font-black text-[#d35400] uppercase text-sm tracking-wider mb-4">Síguenos</h4>
              <div className="flex justify-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-[#341a0c] border border-[#d35400]/30 flex items-center justify-center text-[#e2d5c3] hover:text-[#d35400] hover:border-[#d35400] transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#341a0c] border border-[#d35400]/30 flex items-center justify-center text-[#e2d5c3] hover:text-[#d35400] hover:border-[#d35400] transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="mailto:gaolipizza@gmail.com" className="w-10 h-10 rounded-full bg-[#341a0c] border border-[#d35400]/30 flex items-center justify-center text-[#e2d5c3] hover:text-[#d35400] hover:border-[#d35400] transition-all">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="mt-10 pt-6 border-t border-[#d35400]/20 text-center text-xs text-[#7d5641] space-y-1">
            <p>© {new Date().getFullYear()} GAOLI PIZZA. TODOS LOS DERECHOS RESERVADOS.</p>
            <p>DISEÑADO POR <span className="text-[#d35400] font-bold">IMAGINE & STAMP</span></p>
            <p className="space-x-4">
              <a href="/privacidad" className="hover:text-[#d35400] transition-colors underline">AVISO DE PRIVACIDAD</a>
              <span>|</span>
              <a href="/terminos" className="hover:text-[#d35400] transition-colors underline">TÉRMINOS DE SERVICIO</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 ${cartCount > 0 ? 'bg-[#d35400] text-white scale-100' : 'bg-[#4a2511] text-[#f4ebd9] scale-0 pointer-events-none'}`}
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#4a2511] text-[#f4ebd9] w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          )}
        </div>
      </button>

      {/* ── CART DRAWER ── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-[#fcf8f2] shadow-2xl flex flex-col border-l-[6px] border-[#4a2511] animate-in slide-in-from-right">
            
            {/* Header */}
            <div className="p-6 bg-white border-b-2 border-[#e2d5c3] flex justify-between items-center shrink-0">
              {cartStep === 'details' && (
                <button onClick={() => setCartStep('cart')} className="p-2 bg-[#f4ebd9] hover:bg-[#e2d5c3] rounded-lg transition-colors text-[#4a2511] mr-2">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-2xl font-black text-[#4a2511] flex items-center gap-3" style={{ fontFamily: 'Georgia, serif' }}>
                <ShoppingCart className="text-[#d35400] w-6 h-6" /> 
                {cartStep === 'cart' && 'Tu Pedido'}
                {cartStep === 'details' && 'Datos de Entrega'}
                {cartStep === 'success' && '¡Pedido Enviado!'}
              </h2>
              {cartStep !== 'success' && (
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-[#f4ebd9] hover:bg-[#e2d5c3] rounded-lg transition-colors text-[#4a2511]">
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartStep === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center text-[#7d5641] mt-20 flex flex-col items-center">
                      <Pizza className="w-16 h-16 mb-4 opacity-30" />
                      <p className="text-lg font-medium">Aún no has agregado pizzas</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-bold text-[#d35400] uppercase text-sm tracking-wider border-b border-[#e2d5c3] pb-2">Resumen de Productos</h3>
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-[#e2d5c3]">
                          <div className="flex-1">
                            <h4 className="font-bold text-[#4a2511] leading-tight">{item.name}</h4>
                            <p className="text-[#d35400] font-black">${item.price * item.qty}</p>
                          </div>
                          <div className="flex items-center gap-3 bg-[#f4ebd9] p-1.5 rounded-lg border border-[#e2d5c3]">
                            <button onClick={() => updateQty(item.id, -1)} className="p-1.5 bg-white rounded flex items-center justify-center text-[#4a2511] shadow-sm hover:text-red-600 transition-colors">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-5 text-center font-bold text-[#4a2511]">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="p-1.5 bg-[#4a2511] rounded flex items-center justify-center text-white shadow-sm hover:bg-[#341a0c] transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {cartStep === 'details' && (
                <div className="space-y-4">
                  {/* Método de Entrega */}
                  <div className="bg-white p-5 rounded-xl border border-[#e2d5c3] shadow-sm space-y-4">
                    <h3 className="font-bold text-[#d35400] uppercase text-sm tracking-wider border-b border-[#e2d5c3] pb-2">Método de Entrega</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCustomerInfo({...customerInfo, deliveryMethod: 'domicilio'})}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border-2 ${customerInfo.deliveryMethod === 'domicilio' ? 'bg-[#d35400] text-white border-[#d35400]' : 'bg-white text-[#4a2511] border-[#e2d5c3] hover:border-[#d35400]/50'}`}
                      >
                        🛵 A domicilio
                      </button>
                      <button
                        onClick={() => setCustomerInfo({...customerInfo, deliveryMethod: 'recoger'})}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border-2 ${customerInfo.deliveryMethod === 'recoger' ? 'bg-[#d35400] text-white border-[#d35400]' : 'bg-white text-[#4a2511] border-[#e2d5c3] hover:border-[#d35400]/50'}`}
                      >
                        🛍️ Recoger
                      </button>
                    </div>
                  </div>

                  {/* Datos del Cliente */}
                  <div className="bg-white p-5 rounded-xl border border-[#e2d5c3] shadow-sm space-y-4">
                    <h3 className="font-bold text-[#d35400] uppercase text-sm tracking-wider border-b border-[#e2d5c3] pb-2">Datos del Cliente</h3>
                    
                    <div>
                      <label className="block text-xs font-bold text-[#4a2511] mb-1">Nombre Completo *</label>
                      <input type="text" className={`w-full border rounded p-2 bg-[#fcf8f2] outline-none focus:border-[#d35400] ${errors.name ? 'border-red-500 bg-red-50' : 'border-[#e2d5c3]'}`} 
                        value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} placeholder="Ej. Juan Pérez" />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-[#4a2511] mb-1">Teléfono / WhatsApp *</label>
                      <input type="tel" className={`w-full border rounded p-2 bg-[#fcf8f2] outline-none focus:border-[#d35400] ${errors.phone ? 'border-red-500 bg-red-50' : 'border-[#e2d5c3]'}`} 
                        value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} placeholder="10 dígitos" />
                    </div>

                    {customerInfo.deliveryMethod === 'domicilio' && (
                      <div>
                        <label className="block text-xs font-bold text-[#4a2511] mb-1">Dirección Completa *</label>
                        <textarea className={`w-full border rounded p-2 bg-[#fcf8f2] outline-none focus:border-[#d35400] ${errors.address ? 'border-red-500 bg-red-50' : 'border-[#e2d5c3]'}`} rows="2"
                          value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} placeholder="Calle, Número, Colonia, Referencias..." />
                      </div>
                    )}
                  </div>

                  {/* Método de Pago */}
                  <div className="bg-white p-5 rounded-xl border border-[#e2d5c3] shadow-sm space-y-4">
                    <h3 className="font-bold text-[#d35400] uppercase text-sm tracking-wider border-b border-[#e2d5c3] pb-2">Forma de Pago</h3>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCustomerInfo({...customerInfo, paymentMethod: 'Efectivo'})}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border-2 ${customerInfo.paymentMethod === 'Efectivo' ? 'bg-[#d35400] text-white border-[#d35400]' : 'bg-white text-[#4a2511] border-[#e2d5c3] hover:border-[#d35400]/50'}`}
                      >
                        💵 Efectivo
                      </button>
                      <button
                        onClick={() => setCustomerInfo({...customerInfo, paymentMethod: 'Transferencia'})}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border-2 ${customerInfo.paymentMethod === 'Transferencia' ? 'bg-[#d35400] text-white border-[#d35400]' : 'bg-white text-[#4a2511] border-[#e2d5c3] hover:border-[#d35400]/50'}`}
                      >
                        🏦 Transferencia
                      </button>
                    </div>

                    {customerInfo.paymentMethod === 'Efectivo' && (
                      <div>
                        <label className="block text-xs font-bold text-[#4a2511] mb-1">¿Con cuánto pagas? (Para cambio) *</label>
                        <input type="number" className={`w-full border rounded p-2 bg-[#fcf8f2] outline-none focus:border-[#d35400] ${errors.cashAmount ? 'border-red-500 bg-red-50' : 'border-[#e2d5c3]'}`} 
                          value={customerInfo.cashAmount} onChange={e => setCustomerInfo({...customerInfo, cashAmount: e.target.value})} placeholder="Ej. 500" />
                        {customerInfo.cashAmount && !isNaN(parseFloat(customerInfo.cashAmount)) && parseFloat(customerInfo.cashAmount) >= cartTotal && (
                          <p className="text-green-600 text-sm font-bold mt-2">
                            Cambio: ${parseFloat(customerInfo.cashAmount) - cartTotal}
                          </p>
                        )}
                      </div>
                    )}

                    {customerInfo.paymentMethod === 'Transferencia' && (
                      <div className="bg-[#f4ebd9] border border-[#e2d5c3] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-[#4a2511] text-sm">Datos Bancarios</h4>
                          <button onClick={copyBankInfo} className="text-xs font-bold text-[#d35400] hover:text-[#b04500] flex items-center gap-1">
                            {copied ? <><Check className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
                          </button>
                        </div>
                        <div className="text-sm text-[#7d5641] space-y-1">
                          <p><span className="font-bold">Banco:</span> {bankInfo.bank_name}</p>
                          <p><span className="font-bold">Titular:</span> {bankInfo.account_holder}</p>
                          <p><span className="font-bold">CLABE:</span> {bankInfo.clabe}</p>
                          <p><span className="font-bold">Cuenta:</span> {bankInfo.account_number}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notas */}
                  <div className="bg-white p-5 rounded-xl border border-[#e2d5c3] shadow-sm">
                    <label className="block text-xs font-bold text-[#4a2511] mb-1">Notas especiales (Opcional)</label>
                    <input type="text" className="w-full border border-[#e2d5c3] rounded p-2 bg-[#fcf8f2] outline-none focus:border-[#d35400]" 
                      value={customerInfo.notes} onChange={e => setCustomerInfo({...customerInfo, notes: e.target.value})} placeholder="Ej. Sin cebolla, extra salsa..." />
                  </div>
                </div>
              )}

              {cartStep === 'success' && (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-black text-[#4a2511] mb-2" style={{ fontFamily: 'Georgia, serif' }}>¡Pedido Listo!</h3>
                  <p className="text-[#7d5641] text-sm mb-2">Redirigiendo a WhatsApp...</p>
                  <p className="text-[#7d5641] text-xs opacity-70">Envía el mensaje para confirmar tu pedido.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && cartStep !== 'success' && (
              <div className="p-6 bg-white border-t-2 border-[#e2d5c3] shadow-[0_-10px_20px_rgba(74,37,17,0.05)] shrink-0">
                <div className="flex justify-between items-center mb-4 text-lg">
                  <span className="font-bold text-[#7d5641]">Total:</span>
                  <span className="font-black text-2xl text-[#d35400]">${cartTotal}</span>
                </div>
                {cartStep === 'cart' ? (
                  <button 
                    onClick={() => setCartStep('details')}
                    className="w-full bg-[#d35400] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg hover:bg-[#b04500] transition-colors shadow-lg border-2 border-[#d35400]"
                  >
                    Continuar <ChevronLeft className="w-5 h-5 rotate-180" />
                  </button>
                ) : (
                  <button 
                    onClick={sendOrder}
                    className="w-full bg-[#d35400] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg hover:bg-[#b04500] transition-colors shadow-lg border-2 border-[#d35400]"
                  >
                    <Check className="w-6 h-6" /> Enviar Pedido por WhatsApp
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin link (subtle) */}
      <a href="#gaoli-admin" onClick={(e) => { e.preventDefault(); setIsAdminOpen(!isAdminOpen); }} className="fixed bottom-6 left-6 z-40 opacity-20 hover:opacity-60 transition-opacity">
        🔒
      </a>
    </div>
  );
}
