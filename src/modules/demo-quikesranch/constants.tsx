import React from 'react';
import { Beef, UtensilsCrossed, Flame, Pizza, ChefHat, CupSoda } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
  isLennyBurger?: boolean;
  hasLennyOption?: boolean;
  badge?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const CATEGORIES: Category[] = [
  { id: 'burgers',  name: 'Burgers',  icon: <span className="text-lg">🍔</span> },
  { id: 'tortas',   name: 'Tortas',   icon: <span className="text-lg">🥪</span> },
  { id: 'dogos',    name: 'Dogos',    icon: <span className="text-lg">🌭</span> },
  { id: 'papas',    name: 'Papas',    icon: <span className="text-lg">🍟</span> },
  { id: 'boneless', name: 'Boneless', icon: <span className="text-lg">🍗</span> },
  { id: 'refrescos',name: 'Refrescos',icon: <span className="text-lg">🥤</span> },
];

export const PRODUCTS: Product[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // BURGERS — Con Delicioso Pan de Ajonjolí Negro
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'burg_lenny',
    category: 'burgers',
    name: 'LENNY BURGER',
    price: 60,
    description: 'Carne, queso amarillo, verduras y aderezos… envuelta en hojas de lechuga.',
    image: '/quikesranch/lenny-burger-v3.png',
    popular: true,
    isLennyBurger: true,
  },
  {
    id: 'burg_sencilla',
    category: 'burgers',
    name: 'BURGER SENCILLA',
    price: 60,
    description: 'Carne, queso amarillo, verduras y aderezos. Con delicioso pan de ajonjolí negro.',
    image: '/quikesranch/burger-single-sesame.png',
    hasLennyOption: true,
  },
  {
    id: 'burg_doble',
    category: 'burgers',
    name: 'BURGER DOBLE',
    price: 80,
    description: 'Doble carne, queso amarillo, verduras y aderezos. Con pan de ajonjolí negro.',
    image: '/quikesranch/burger-double-sesame.png',
    popular: true,
    hasLennyOption: true,
  },
  {
    id: 'burg_hawaiana',
    category: 'burgers',
    name: 'BURGER HAWAIANA',
    price: 80,
    description: 'Carne, piña asada, queso amarillo, tocino, jamón, verdura y aderezos.',
    image: '/quikesranch/burger-single-sesame.png',
    hasLennyOption: true,
  },
  {
    id: 'burg_bbq',
    category: 'burgers',
    name: 'BURGER BBQ',
    price: 80,
    description: 'Carne bañada en BBQ, queso amarillo, jamón, tocino, verdura y aderezos.',
    image: '/quikesranch/burger-single-sesame.png',
    popular: true,
    hasLennyOption: true,
  },
  {
    id: 'burg_nortena',
    category: 'burgers',
    name: 'BURGER NORTEÑA',
    price: 80,
    description: 'Carne, chorizo, asadero, jamón, verdura y aderezos. 🌶',
    image: '/quikesranch/burger-single-sesame.png',
    hasLennyOption: true,
    badge: '🌶 Picante',
  },
  {
    id: 'burg_especial',
    category: 'burgers',
    name: 'BURGER ESPECIAL',
    price: 80,
    description: 'Carne, queso amarillo, jamón, tocino, verdura y aderezos.',
    image: '/quikesranch/burger-single-sesame.png',
    hasLennyOption: true,
  },
  {
    id: 'burg_monster',
    category: 'burgers',
    name: 'BURGER MONSTER',
    price: 100,
    description: 'Carne, salchicha para asar, tocino, asadero, jamón, trozos de piña, verdura y aderezos.',
    image: '/quikesranch/burger-single-sesame.png',
    popular: true,
    hasLennyOption: true,
    badge: '👹 Monster',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TORTAS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'tort_lomo',
    category: 'tortas',
    name: 'LOMO DE RES',
    price: 80,
    description: 'Carne deshebrada, asadero, aguacate y verdura.',
    image: '/quikesranch/torta-lomo-res.png',
    popular: true,
  },
  {
    id: 'tort_pierna',
    category: 'tortas',
    name: 'PIERNA DE PUERCO',
    price: 80,
    description: 'Carne de pierna de puerco, tocino, panela, asadero, aguacate y verdura.',
    image: '/quikesranch/torta-pierna-puerco.png',
  },
  {
    id: 'tort_ahumado',
    category: 'tortas',
    name: 'LOMO AHUMADO',
    price: 80,
    description: 'Chuleta ahumada asada, asadero, aguacate y verdura.',
    image: '/quikesranch/torta-lomo-ahumado.png',
  },
  {
    id: 'tort_sirlon',
    category: 'tortas',
    name: 'SIRLÓN',
    price: 90,
    description: 'Sirlón asado, aguacate y verdura.',
    image: '/quikesranch/torta-sirlon.png',
    popular: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOGOS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'dogo_sencillo',
    category: 'dogos',
    name: 'SENCILLO',
    price: 35,
    description: 'Pico de gallo, winny y aderezos.',
    image: '/quikesranch/dogo-sencillo.png',
  },
  {
    id: 'dogo_chillibeens',
    category: 'dogos',
    name: 'CHILLI BEANS',
    price: 35,
    description: 'Chilli beans, queso amarillo y aderezos.',
    image: '/quikesranch/dogo-chillibeans.png',
    popular: true,
  },
  {
    id: 'dogo_tocino',
    category: 'dogos',
    name: 'TOCINO',
    price: 35,
    description: 'Pico de gallo, tocino y aderezos.',
    image: '/quikesranch/dogo-tocino.png',
  },
  {
    id: 'dogo_hawaiano',
    category: 'dogos',
    name: 'HAWAIANO',
    price: 35,
    description: 'Pico de gallo, trozos de piña asada y aderezos.',
    image: 'https://images.unsplash.com/photo-1619740455993-9d622bf99e8b?w=500&h=400&fit=crop',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PAPAS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'papa_fritas',
    category: 'papas',
    name: 'PAPAS FRITAS',
    price: 55,
    description: 'Queso amarillo y catsup.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&h=400&fit=crop',
  },
  {
    id: 'papa_gajo',
    category: 'papas',
    name: 'PAPAS DE GAJO',
    price: 65,
    description: 'Papas en gajo doradas y sazonadas.',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&h=400&fit=crop',
    popular: true,
  },
  {
    id: 'papa_salchi',
    category: 'papas',
    name: 'SALCHIPAPAS',
    price: 35,
    description: 'Salchicha para asar, papas a la francesa, aderezos y verdura.',
    image: '/quikesranch/salchipapas.png',
    popular: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BONELESS — 250 grs.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'bone_sencillos',
    category: 'boneless',
    name: 'SENCILLOS',
    price: 85,
    description: '250 grs. Verdura (zanahoria y apio) y aderezos.',
    image: 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=500&h=400&fit=crop',
  },
  {
    id: 'bone_sabores',
    category: 'boneless',
    name: 'BÚFALO · BBQ · MANGO HABANERO',
    price: 135,
    description: '250 grs. Aros de cebolla, papas fritas, verdura (zanahoria y apio) y aderezo ranch.',
    image: 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=500&h=400&fit=crop',
    popular: true,
    badge: '🔥 Picante disponible',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REFRESCOS (Chescos)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'refresco_lata',
    category: 'refrescos',
    name: 'REFRESCOS',
    price: 25,
    description: 'Pepsi, Coca Cola y de sabor.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&h=400&fit=crop',
  },
];

export const COMPANY_INFO = {
  name: "Quike's Ranch",
  whatsapp: '526391249030',
  phone: '639-124-90-30',
  schedule: 'Viernes, Sábado y Domingo: 7:00 PM – 12:00 AM',
  bankTransfer: {
    bank: 'BBVA',
    accountHolder: 'Ana Celia Delgado',
    clabe: '',
    accountNumber: '4152-3140-2401-7280',
  },
};
