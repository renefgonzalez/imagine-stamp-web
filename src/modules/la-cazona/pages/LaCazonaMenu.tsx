import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, Plus, Minus, X, ArrowRight, Truck, Tag, Flame, Lock, Facebook, Instagram, MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoCazona from '../assets/logo.png';

// --- DATA ---
type Category = 'Hamburguesas y Alimentos Ligeros' | 'Tacos y Variedades' | 'Parrilladas y Alambres' | 'Paquetes' | 'Bebidas' | 'Postres y Extras';

interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  image: string;
  price: number;           // Individual price
  priceOrder3?: number;    // Price for an order of 3 (optional)
  badge?: string;
}

const PRODUCTS: Product[] = [
  {
    "id": "pq1",
    "name": "Paquete 1",
    "description": "Alambre sencillo, frijoles y un refresco.",
    "category": "Paquetes",
    "price": 165,
    "image": "https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "pq2",
    "name": "Paquete 2",
    "description": "Costilla asada, frijoles y un refresco.",
    "category": "Paquetes",
    "price": 170,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "pq3",
    "name": "Paquete 3",
    "description": "10 Tacos a elegir (Pastor, Suadero, Longaniza, Cabeza), frijoles y un refresco.",
    "category": "Paquetes",
    "price": 165,
    "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "pq4",
    "name": "Paquete Infantil",
    "description": "Hamburguesa, Papas y Refresco.",
    "category": "Paquetes",
    "price": 115,
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "pq5",
    "name": "Carne al Pastor y Alambre para llevar",
    "description": "El Kilo. Incluye tortillas, salsas, limones y verdura.",
    "category": "Paquetes",
    "price": 340,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "b1",
    "name": "Agua de Horchata",
    "description": "Chica: $30, Grande: $40",
    "category": "Bebidas",
    "price": 30,
    "priceOrder3": 40,
    "badge": "Chica / Grande",
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "b2",
    "name": "Agua Piña Colada de Crema",
    "description": "Chica: $40, Grande: $40",
    "category": "Bebidas",
    "price": 40,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "b3",
    "name": "Agua Fresca de Crema",
    "description": "Chica: $40, Grande: $40",
    "category": "Bebidas",
    "price": 40,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "b4",
    "name": "Jarra de Agua de Crema",
    "description": "Jarra completa",
    "category": "Bebidas",
    "price": 90,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "b5",
    "name": "Jarra de Agua de Horchata",
    "description": "Jarra completa",
    "category": "Bebidas",
    "price": 80,
    "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "b6",
    "name": "Refresco Lata",
    "description": "Diferentes sabores",
    "category": "Bebidas",
    "price": 20,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "b7",
    "name": "Cerveza de Botella",
    "description": "Pregunta por disponibilidad",
    "category": "Bebidas",
    "price": 45,
    "image": "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "b8",
    "name": "Michelada 1 Litro",
    "description": "Preparada",
    "category": "Bebidas",
    "price": 110,
    "image": "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "b9",
    "name": "Gomichela 1 Litro",
    "description": "Preparada con gomitas",
    "category": "Bebidas",
    "price": 120,
    "image": "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "b10",
    "name": "Cerveza de Sabores 1 Litro",
    "description": "Tamarindo, Mango, o Mora Azul",
    "category": "Bebidas",
    "price": 110,
    "image": "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "pe1",
    "name": "Flan Napolitano",
    "description": "Delicioso flan casero",
    "category": "Postres y Extras",
    "price": 45,
    "image": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "pe2",
    "name": "Fresas con Crema",
    "description": "Fresas frescas con nuestra crema dulce",
    "category": "Postres y Extras",
    "price": 45,
    "image": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "pe3",
    "name": "Helado",
    "description": "Postre refrescante",
    "category": "Postres y Extras",
    "price": 80,
    "image": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "pe4",
    "name": "Queso Fundido Natural",
    "description": "Queso fundido servido en cazuela",
    "category": "Postres y Extras",
    "price": 85,
    "image": "https://images.unsplash.com/photo-1581452934241-11d950117865?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "pe5",
    "name": "Queso Fundido con Pastor",
    "description": "Queso fundido acompañado de nuestra carne al pastor",
    "category": "Postres y Extras",
    "price": 110,
    "image": "https://images.unsplash.com/photo-1581452934241-11d950117865?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "pe6",
    "name": "Pozole",
    "description": "Calientito y caldosito",
    "category": "Postres y Extras",
    "price": 90,
    "image": "https://images.unsplash.com/photo-1604085449502-b2f5673ec4d5?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "pe7",
    "name": "Sopa Azteca",
    "description": "Calientito y caldosito",
    "category": "Postres y Extras",
    "price": 65,
    "image": "https://images.unsplash.com/photo-1604085449502-b2f5673ec4d5?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "pe8",
    "name": "Frijoles Charros",
    "description": "Ricos frijoles charros",
    "category": "Postres y Extras",
    "price": 60,
    "image": "https://images.unsplash.com/photo-1604085449502-b2f5673ec4d5?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "h1",
    "name": "Hamburguesa Sencilla",
    "description": "Carne, pan.",
    "category": "Hamburguesas y Alimentos Ligeros",
    "price": 47,
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "h2",
    "name": "Hamburguesa Especial",
    "description": "Queso Amarillo, Queso Oaxaca.",
    "category": "Hamburguesas y Alimentos Ligeros",
    "price": 60,
    "image": "https://images.unsplash.com/photo-1594212202875-5853f65b8364?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "h3",
    "name": "Hamburguesa Hawaiana",
    "description": "Jamón, Queso Amarillo y Oaxaca, Piña.",
    "category": "Hamburguesas y Alimentos Ligeros",
    "price": 67,
    "image": "https://images.unsplash.com/photo-1594212202875-5853f65b8364?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "h4",
    "name": "Hamburguesa Super",
    "description": "Jamón, Queso Amarillo y Oaxaca, Salchicha.",
    "category": "Hamburguesas y Alimentos Ligeros",
    "price": 70,
    "image": "https://images.unsplash.com/photo-1594212202875-5853f65b8364?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "h5",
    "name": "Hamburguesa Cubana",
    "description": "Jamón, Queso Amarillo y Oaxaca, Pierna.",
    "category": "Hamburguesas y Alimentos Ligeros",
    "price": 75,
    "image": "https://images.unsplash.com/photo-1594212202875-5853f65b8364?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "h6",
    "name": "Hochos Sencillos (Orden de 3)",
    "description": "3 Hot Dogs sencillos",
    "category": "Hamburguesas y Alimentos Ligeros",
    "price": 75,
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "h7",
    "name": "Papas a la Francesa",
    "description": "Ricas papas fritas",
    "category": "Hamburguesas y Alimentos Ligeros",
    "price": 70,
    "image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "h8",
    "name": "Orden de Alitas de Sabores",
    "description": "Tamarindo-Mango-Fresa o Adobadas con papas y vegetales.",
    "category": "Hamburguesas y Alimentos Ligeros",
    "price": 130,
    "image": "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "h9",
    "name": "Ensalada \"La Cazona\"",
    "description": "Lechuga, durazno, fresa, pavo, panela, arandano y pollo a la parrilla.",
    "category": "Hamburguesas y Alimentos Ligeros",
    "price": 150,
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "h10",
    "name": "Gringa Chica",
    "description": "Ligero y delicioso",
    "category": "Hamburguesas y Alimentos Ligeros",
    "price": 85,
    "image": "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "t1",
    "name": "Tacos al Pastor",
    "description": "Individuales. Precio especial en orden de 5: $80",
    "category": "Tacos y Variedades",
    "price": 16,
    "badge": "Lunes 2x1",
    "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "t2",
    "name": "Tacos de Suadero",
    "description": "Individuales. Precio especial en orden de 5: $80",
    "category": "Tacos y Variedades",
    "price": 16,
    "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "t3",
    "name": "Tacos de Tripa",
    "description": "Individuales. Precio especial en orden de 5: $85",
    "category": "Tacos y Variedades",
    "price": 17,
    "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "t4",
    "name": "Tacos de Lengua",
    "description": "Individuales. Precio especial en orden de 5: $125",
    "category": "Tacos y Variedades",
    "price": 25,
    "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "t5",
    "name": "Tacos Parrilleros (Orden de 3)",
    "description": "Cecina, Chistorra, Chorizo Arg., Arrachera, Sirloin o Rib Eye con papas.",
    "category": "Tacos y Variedades",
    "price": 170,
    "image": "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "t6",
    "name": "Orden de 3: Bistec",
    "description": "Bistec $100 / c/Queso $115",
    "category": "Tacos y Variedades",
    "price": 100,
    "priceOrder3": 115,
    "badge": "Sin / Con Queso",
    "image": "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "t7",
    "name": "Orden de 3: Costilla",
    "description": "Costilla $100 / c/Queso $115",
    "category": "Tacos y Variedades",
    "price": 100,
    "priceOrder3": 115,
    "badge": "Sin / Con Queso",
    "image": "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "t8",
    "name": "Orden de 3: Cecina",
    "description": "Cecina $100 / c/Queso $115",
    "category": "Tacos y Variedades",
    "price": 100,
    "priceOrder3": 115,
    "badge": "Sin / Con Queso",
    "image": "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p1",
    "name": "Alambre Sencillo",
    "description": "Bistec, tocino, cebolla, morron y queso.",
    "category": "Parrilladas y Alambres",
    "price": 150,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p2",
    "name": "Alambre de Pollo",
    "description": "Pechuga de pollo, cebolla, morron, tocino y queso.",
    "category": "Parrilladas y Alambres",
    "price": 150,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p3",
    "name": "Sarape",
    "description": "Bistec, chuleta, chorizo, pastor, tocino, cebolla, morron y queso.",
    "category": "Parrilladas y Alambres",
    "price": 160,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p4",
    "name": "Costillas a la BBQ",
    "description": "Bañadas en salsa BBQ acompañadas de papas gajo y pico de gallo.",
    "category": "Parrilladas y Alambres",
    "price": 160,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p5",
    "name": "Alambre de Arrachera",
    "description": "Cebolla, morron, champiñones, arrachera y quesillo con tortillas de harina.",
    "category": "Parrilladas y Alambres",
    "price": 210,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p6",
    "name": "Alambre de Rib Eye",
    "description": "Cebolla, morron, champiñones, rib eye y quesillo con tortillas de harina.",
    "category": "Parrilladas y Alambres",
    "price": 210,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p7",
    "name": "Super Alambre Atómico (6 Personas)",
    "description": "Combinacion de carnes con cebolla, pimiento, tocino y queso c/ 20 tortillas.",
    "category": "Parrilladas y Alambres",
    "price": 675,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p8",
    "name": "Parrillada (6 Personas)",
    "description": "Variedad de carnes y pollo con guarniciones.",
    "category": "Parrilladas y Alambres",
    "price": 680,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p9",
    "name": "Cazuela Mixta (6 Personas)",
    "description": "Combinación de alambre, pastor, carne suiza, cebollitas, nopales...",
    "category": "Parrilladas y Alambres",
    "price": 680,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p10",
    "name": "Parrillada Argentina (6 Personas)",
    "description": "2kg de Arrachera, cebollitas, nopales, frijoles charros, chorizo arg...",
    "category": "Parrilladas y Alambres",
    "price": 850,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p11",
    "name": "Parrillada Super (6 Personas)",
    "description": "Costilla, chistorra, arrachera, sirloin, chorizo arg, cecina, bisteck...",
    "category": "Parrilladas y Alambres",
    "price": 950,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p12",
    "name": "Costilla Asada / Bistec / Carne Asada / Cecina",
    "description": "Porciones individuales de carne asada",
    "category": "Parrilladas y Alambres",
    "price": 160,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p13",
    "name": "Cortes Finos: Rib Eye / T-Bone / New York / Sirloin",
    "description": "Cortes americanos.",
    "category": "Parrilladas y Alambres",
    "price": 230,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=500"
  },
  {
    "id": "p14",
    "name": "Carne a la Tampiqueña / Arrachera en Tiras",
    "description": "Con sus tradicionales acompañamientos.",
    "category": "Parrilladas y Alambres",
    "price": 220,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500"
  }
];

const CATEGORIES: Category[] = [
  'Hamburguesas y Alimentos Ligeros',
  'Tacos y Variedades',
  'Parrilladas y Alambres',
  'Paquetes',
  'Bebidas',
  'Postres y Extras'
];

interface CartItem extends Product {
  cartId: string; // Unique ID for cart item (since product can be added as single or order of 3)
  quantity: number;
  isOrder3: boolean;
  activePrice: number;
}

export default function LaCazonaMenu() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Category>('Hamburguesas y Alimentos Ligeros');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'recoger',
    address: '',
    paymentMethod: 'Efectivo',
    cashAmount: '',
    notes: ''
  });

  // Derived state for products
  const filteredProducts = useMemo(() => {
    let filtered = PRODUCTS;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    } else {
      filtered = PRODUCTS.filter(p => p.category === activeTab);
    }
    return filtered;
  }, [searchQuery, activeTab]);

  // Cart Functions
  const addToCart = (product: Product, isOrder3: boolean) => {
    const activePrice = isOrder3 ? (product.priceOrder3 || product.price * 3) : product.price;
    const cartId = `${product.id}-${isOrder3 ? 'ord3' : 'ind'}`;
    
    setCart(prev => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, cartId, quantity: 1, isOrder3, activePrice }];
    });
    // Pequeño feedback visual puede añadirse aquí
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.activePrice * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const generateWhatsAppMessage = () => {
    let msg = `🔥 *NUEVO PEDIDO LA CAZONA* 🔥\n\n`;
    msg += `*Cliente:* ${customerInfo.name}\n`;
    msg += `*Tel/WhatsApp:* ${customerInfo.phone}\n`;
    
    if (customerInfo.deliveryMethod === 'domicilio') {
      msg += `*Tipo:* Entrega a domicilio\n`;
      msg += `*Dirección:* ${customerInfo.address}\n`;
    } else {
      msg += `*Tipo:* Recoger en el local\n`;
    }

    if (customerInfo.paymentMethod === 'Efectivo') {
      msg += `*Pago:* Efectivo`;
      if (customerInfo.cashAmount) {
        msg += ` (Paga con $${customerInfo.cashAmount})`;
      }
      msg += `\n`;
    } else {
      msg += `*Pago:* ${customerInfo.paymentMethod}\n`;
    }

    msg += `\n*Orden:*\n`;
    
    cart.forEach(item => {
      const typeLabel = item.isOrder3 ? '(Orden de 3)' : (item.priceOrder3 ? '(Individual)' : '');
      msg += `▪ ${item.quantity}x ${item.name} ${typeLabel} - $${(item.activePrice * item.quantity).toFixed(2)}\n`;
    });
    
    msg += `\n*TOTAL: $${cartTotal.toFixed(2)}*\n`;
    if (customerInfo.notes) msg += `\n*Notas:* ${customerInfo.notes}`;
    
    if(customerInfo.deliveryMethod === "domicilio") {
      msg += `\n❗ Por favor confírmenme el *costo de envío* a mi dirección. ¡Gracias! 🙌`;
    } else {
      msg += `\n✅ Paso a recogerlo. ¿Cuánto tiempo me dicen? 🙌`;
    }

    return `https://wa.me/525519217175?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-[#111111] text-stone-200 font-sans selection:bg-[#E84C3D] selection:text-white pb-24">
      {/* HEADER & CONTACT */}
      <header className="bg-black/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#222]">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col items-center justify-center gap-2">
          <img src={logoCazona} alt="La Cazona Logo" className="h-32 md:h-48 w-auto object-contain drop-shadow-2xl" />
          <p className="text-sm md:text-base text-stone-400 font-bold tracking-[0.2em] uppercase text-center mt-2">
            El Auténtico Sabor a la Parrilla
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* SEARCH BAR */}
        <div className="relative mb-8 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-stone-500 group-focus-within:text-[#E84C3D] transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-[#1A1A1A] border border-[#333] text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#E84C3D] focus:ring-1 focus:ring-[#E84C3D] transition-all placeholder:text-stone-500 font-medium"
            placeholder="¿Qué se te antoja hoy? Ej. Tacos, Alambre, Paquete..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* CATEGORY TABS (Only show if not searching) */}
        {!searchQuery && (
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                  activeTab === cat 
                    ? 'bg-[#E84C3D] text-white shadow-lg shadow-[#E84C3D]/20' 
                    : 'bg-[#1A1A1A] text-stone-400 hover:bg-[#222] hover:text-stone-200 border border-[#333]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(product => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={product.id}
                className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-[#222] group hover:border-[#E84C3D]/50 transition-colors flex flex-col"
              >
                <div className="relative h-48 bg-[#222] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-[#E84C3D] text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <Tag className="w-3 h-3" />
                      {product.badge}
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-sm text-stone-400 mb-6 flex-1">{product.description}</p>
                  
                  <div className="mt-auto space-y-3">
                    {product.priceOrder3 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {/* Individual Option */}
                        <div className="bg-[#111] p-3 rounded-2xl border border-[#333] flex flex-col justify-between">
                          <span className="text-[10px] uppercase font-bold text-stone-500 mb-1">Individual</span>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-white">${product.price.toFixed(2)}</span>
                            <button 
                              onClick={() => addToCart(product, false)}
                              className="w-8 h-8 rounded-full bg-[#333] text-white flex items-center justify-center hover:bg-[#E84C3D] transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {/* Order of 3 Option */}
                        <div className="bg-gradient-to-br from-[#2A1614] to-[#1A0D0C] p-3 rounded-2xl border border-[#E84C3D]/30 flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-[#E84C3D]/10 rounded-full blur-xl"></div>
                          <span className="text-[10px] uppercase font-bold text-[#E84C3D] mb-1">Orden de 3</span>
                          <div className="flex items-center justify-between relative z-10">
                            <span className="font-black text-white">${product.priceOrder3.toFixed(2)}</span>
                            <button 
                              onClick={() => addToCart(product, true)}
                              className="w-8 h-8 rounded-full bg-[#E84C3D] text-white flex items-center justify-center hover:bg-[#C0392B] shadow-lg shadow-[#E84C3D]/20 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-[#111] p-3 rounded-2xl border border-[#333]">
                        <span className="font-black text-xl text-white">${product.price.toFixed(2)}</span>
                        <button 
                          onClick={() => addToCart(product, false)}
                          className="px-5 py-2 rounded-xl bg-[#333] text-white font-bold text-sm hover:bg-[#E84C3D] transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Agregar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Search className="w-12 h-12 text-[#333] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-300">No encontramos resultados</h3>
              <p className="text-stone-500 mt-2">Intenta buscar con otros términos.</p>
            </div>
          )}
        </div>
      </main>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href="https://wa.me/525519217175"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 md:bottom-10 md:left-10 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#1EBE5D] transition-all z-40 flex items-center justify-center hover:scale-110"
        aria-label="Contactar por WhatsApp"
      >
        {/* Usando SVG puro para WhatsApp */}
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
      </a>

      {/* FOOTER */}
      <footer className="border-t border-[#222] bg-[#0A0A0A] py-12 px-4 relative mt-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Col 1: La Cazona */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-4">
              <img src={logoCazona} alt="La Cazona Logo" className="h-28 md:h-32 w-auto object-contain drop-shadow-xl" />
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Taquería y Parrilla con servicio express a domicilio. El auténtico sabor a la parrilla hasta la puerta de tu casa.
            </p>
          </div>

          {/* Col 2: Contacto y Atención */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contacto y Atención</h3>
            <div className="space-y-3 text-sm text-stone-400">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-4 h-4 text-[#E84C3D]" /> 55 6553 9197
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" /> 55 1921 7175
              </p>
              <p className="flex items-start justify-center md:justify-start gap-2 text-left">
                <MapPin className="w-4 h-4 text-[#E84C3D] mt-0.5 shrink-0" />
                <span>[Calle Ejemplo 123, Colonia Centro, CP 00000]</span>
              </p>
              <p className="flex items-start justify-center md:justify-start gap-2 text-left">
                <Clock className="w-4 h-4 text-[#E84C3D] mt-0.5 shrink-0" />
                <span>[Lun-Dom: 1:00 PM - 11:00 PM]</span>
              </p>
            </div>
          </div>

          {/* Col 3: Redes y Promociones */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Síguenos</h3>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-stone-300 hover:text-white hover:border-[#1877F2] hover:bg-[#1877F2]/10 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-stone-300 hover:text-white hover:border-[#E1306C] hover:bg-[#E1306C]/10 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://wa.me/525519217175" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-stone-300 hover:text-white hover:border-[#25D366] hover:bg-[#25D366]/10 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-3 text-sm text-stone-300">
              🎉 <span className="font-bold text-white">Pregunta por nuestras Taquizas</span> para tus próximos eventos y reuniones.
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto border-t border-[#222] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-stone-500 text-xs font-medium mb-1">&copy; {new Date().getFullYear()} La Cazona. Todos los derechos reservados.</p>
            <p className="text-stone-400 text-xs font-bold">Diseñado por IMAGINE & STAMP</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-stone-600">
            <a href="#" className="hover:text-[#E84C3D] transition-colors">Aviso de Privacidad</a>
            <span>|</span>
            <a href="#" className="hover:text-[#E84C3D] transition-colors">Términos de Servicio</a>
          </div>
        </div>

        <a href="#/admin" className="absolute bottom-4 right-4 text-stone-800 hover:text-stone-600 transition-colors" aria-label="Admin Access">
          <Lock className="w-4 h-4" />
        </a>
      </footer>

      {/* FLOATING CART BUTTON */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-[#E84C3D] text-white p-4 rounded-full shadow-2xl shadow-[#E84C3D]/30 flex items-center gap-3 hover:bg-[#C0392B] transition-colors z-40 group"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-white text-[#E84C3D] text-xs font-black w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            </div>
            <div className="font-bold pr-2 flex flex-col items-start leading-tight hidden md:flex">
              <span className="text-[10px] uppercase opacity-80">Ver Pedido</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#111] shadow-2xl z-50 flex flex-col border-l border-[#333]"
            >
              <div className="p-5 border-b border-[#222] flex items-center justify-between bg-[#1A1A1A]">
                <h2 className="text-xl font-black flex items-center gap-3 text-white">
                  <div className="w-8 h-8 rounded-full bg-[#E84C3D] text-white flex items-center justify-center">
                    {cartStep === 1 ? <ShoppingCart className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                  </div>
                  {cartStep === 1 ? 'Tu Pedido' : 'Detalles de Entrega'}
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-stone-500 hover:text-white hover:bg-[#333] rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 bg-[#111] hide-scrollbar">
                {cartStep === 1 ? (
                  // PASO 1: LISTA DE PRODUCTOS
                  cart.length === 0 ? (
                    <div className="text-center text-stone-600 mt-32">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="font-medium text-stone-400">Tu pedido está vacío.</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 px-6 py-2 bg-[#1A1A1A] border border-[#333] text-stone-300 rounded-xl font-bold text-sm hover:bg-[#222]"
                      >
                        Ver el menú
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                         <div key={item.cartId} className="flex items-center gap-4 bg-[#1A1A1A] border border-[#333] p-3 rounded-2xl">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                            <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">
                              {item.isOrder3 ? 'Orden de 3' : (item.priceOrder3 ? 'Individual' : 'Pieza/Unidad')}
                            </p>
                            <p className="text-[#E84C3D] font-black">${item.activePrice.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-[#111] rounded-xl p-1 border border-[#333]">
                            <button 
                              onClick={() => updateQuantity(item.cartId, -1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:text-white hover:bg-[#222]"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-sm w-4 text-center text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.cartId, 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:text-white hover:bg-[#222]"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  // PASO 2: DATOS DE ENTREGA
                  <div className="space-y-5">
                    <div className="bg-[#E84C3D]/10 p-4 rounded-2xl border border-[#E84C3D]/20 mb-2">
                      <p className="text-xs text-[#E84C3D] font-medium leading-relaxed">
                        Completa tus datos para procesar tu pedido por WhatsApp.
                      </p>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <button 
                        onClick={() => setCustomerInfo({...customerInfo, deliveryMethod: 'recoger'})}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-colors ${customerInfo.deliveryMethod === 'recoger' ? 'bg-[#E84C3D] text-white border-[#E84C3D]' : 'bg-[#1A1A1A] text-stone-400 border-[#333] hover:border-[#555]'}`}
                      >
                        🛍️ Paso a recoger
                      </button>
                      <button 
                        onClick={() => setCustomerInfo({...customerInfo, deliveryMethod: 'domicilio'})}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-colors ${customerInfo.deliveryMethod === 'domicilio' ? 'bg-[#E84C3D] text-white border-[#E84C3D]' : 'bg-[#1A1A1A] text-stone-400 border-[#333] hover:border-[#555]'}`}
                      >
                        🛵 Envío a domicilio
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Nombre Completo *</label>
                      <input 
                        type="text" 
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-[#333] focus:border-[#E84C3D] outline-none bg-[#1A1A1A] text-white font-medium transition-colors"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">WhatsApp o celular *</label>
                      <input 
                        type="tel" 
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-[#333] focus:border-[#E84C3D] outline-none bg-[#1A1A1A] text-white font-medium transition-colors"
                        placeholder="10 dígitos"
                      />
                    </div>
                    
                    {customerInfo.deliveryMethod === 'domicilio' && (
                      <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 mt-1">Dirección Completa *</label>
                        <input 
                          type="text" 
                          value={customerInfo.address}
                          onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl border border-[#333] focus:border-[#E84C3D] outline-none bg-[#1A1A1A] text-white font-medium transition-colors"
                          placeholder="Calle, Número, Colonia, Referencias"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Forma de Pago *</label>
                      <select 
                        value={customerInfo.paymentMethod}
                        onChange={e => setCustomerInfo({...customerInfo, paymentMethod: e.target.value, cashAmount: ''})}
                        className="w-full px-4 py-3.5 rounded-xl border border-[#333] focus:border-[#E84C3D] outline-none bg-[#1A1A1A] text-white font-medium appearance-none"
                      >
                        <option value="Efectivo">💵 Efectivo</option>
                        <option value="Transferencia">🏦 Transferencia</option>
                        <option value="Tarjeta">💳 Tarjeta (Terminal)</option>
                      </select>
                    </div>

                    {customerInfo.paymentMethod === 'Efectivo' && (
                      <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">¿Con cuánto vas a pagar? (Total: ${cartTotal.toFixed(2)})</label>
                        <input 
                          type="number" 
                          value={customerInfo.cashAmount}
                          onChange={e => setCustomerInfo({...customerInfo, cashAmount: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl border border-[#333] focus:border-[#E84C3D] outline-none bg-[#1A1A1A] text-white font-medium transition-colors"
                          placeholder="Ej. 200, 500"
                        />
                        {parseFloat(customerInfo.cashAmount) > cartTotal && (
                           <p className="text-xs text-yellow-500 mt-2">Cambio a entregar: ${(parseFloat(customerInfo.cashAmount) - cartTotal).toFixed(2)}</p>
                        )}
                      </div>
                    )}

                    {customerInfo.paymentMethod === 'Transferencia' && (
                      <div className="bg-[#111] border border-[#333] p-4 rounded-xl mt-4">
                        <label className="block text-xs font-bold text-yellow-500 uppercase tracking-wider mb-2">🏦 Datos de Transferencia</label>
                        <div className="text-sm text-stone-300 font-medium whitespace-pre-wrap leading-relaxed">
                          BBVA Bancomer{"\n"}
                          Cuenta: 1234 5678 9012 3456{"\n"}
                          CLABE: 012345678901234567{"\n"}
                          Titular: Proveedora La Cazona
                        </div>
                        <p className="text-[11px] text-yellow-500/80 mt-3 font-semibold italic">
                          * Por favor enviar comprobante de transferencia al mismo número de WhatsApp del pedido.
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 mt-4">Instrucciones Especiales (Opcional)</label>
                      <textarea 
                        value={customerInfo.notes}
                        onChange={e => setCustomerInfo({...customerInfo, notes: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-[#333] focus:border-[#E84C3D] outline-none bg-[#1A1A1A] text-white font-medium resize-none transition-colors"
                        placeholder="Sin cebolla, extra salsa..."
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-[#222] bg-[#1A1A1A]">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-stone-400 font-bold uppercase tracking-wider text-xs">Total a pagar</span>
                    <span className="text-3xl font-black text-[#E84C3D]">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  {cartStep === 1 ? (
                    <button
                      onClick={() => setCartStep(2)}
                      className="w-full bg-[#E84C3D] hover:bg-[#C0392B] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-[#E84C3D]/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                    >
                      Continuar Pedido
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCartStep(1)}
                        className="bg-[#222] hover:bg-[#333] text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-95 border border-[#333]"
                      >
                        Volver
                      </button>
                      <button
                        onClick={() => {
                          if (!customerInfo.name || !customerInfo.phone) {
                            alert("Por favor llena tu nombre y teléfono para procesar tu pedido.");
                            return;
                          }
                          window.open(generateWhatsAppMessage(), '_blank');
                          setCart([]);
                          setCartStep(1);
                          setIsCartOpen(false);
                          setCustomerInfo({
                            name: '',
                            phone: '',
                            deliveryMethod: 'recoger',
                            address: '',
                            paymentMethod: 'Efectivo',
                            cashAmount: '',
                            notes: ''
                          });
                        }}
                        className="flex-1 bg-[#1EBE5D] hover:bg-[#199E4D] text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-[#1EBE5D]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        Enviar WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
