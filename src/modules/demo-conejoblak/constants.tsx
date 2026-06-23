import React from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const CATEGORIES: Category[] = [
  { id: 'burros', name: 'Burros Supremos', icon: <span className="text-lg">🌯</span> },
  { id: 'hamburguesas', name: 'Burgers Monstruo', icon: <span className="text-lg">🍔</span> },
  { id: 'hotdogs', name: 'Hot Dogs', icon: <span className="text-lg">🌭</span> },
  { id: 'papas', name: 'Papas Crazy', icon: <span className="text-lg">🍟</span> },
  { id: 'bebidas', name: 'Bebidas', icon: <span className="text-lg">🥤</span> },
];

export const PRODUCTS: Product[] = [
  // ── BURROS SUPREMOS ──
  {
    id: 'burro_jumbo',
    category: 'burros',
    name: 'Burro Jumbo',
    price: 140,
    description: 'Opciones de carne: Bistec, Pastor, Campechanos, Carne molida, Arrachera.',
  },
  {
    id: 'burro_grande',
    category: 'burros',
    name: 'Burro Grande',
    price: 120,
    description: 'Opciones de carne: Bistec, Pastor, Campechanos, Carne molida, Arrachera.',
  },
  {
    id: 'burro_mediano',
    category: 'burros',
    name: 'Burro Mediano',
    price: 100,
    description: 'Opciones de carne: Bistec, Pastor, Campechanos, Carne molida, Arrachera.',
  },

  // ── HAMBURGUESAS MONSTRUO ──
  {
    id: 'hamburguesa_sencilla',
    category: 'hamburguesas',
    name: 'Sencilla',
    price: 70,
    description: 'Carne, queso, lechuga, jitomate, jamón, chile.',
  },
  {
    id: 'hamburguesa_hawaiana',
    category: 'hamburguesas',
    name: 'Hawaiana',
    price: 80,
    description: 'Carne, queso, piña, lechuga, jitomate, cebolla, chile.',
  },
  {
    id: 'hamburguesa_pecadora',
    category: 'hamburguesas',
    name: 'La Pecadora',
    price: 100,
    description: 'Carne, tocino, salchicha, jamón, piña, lechuga, jitomate, cebolla, chile.',
  },
  {
    id: 'hamburguesa_doble',
    category: 'hamburguesas',
    name: 'La Doble (X)',
    price: 130,
    description: 'Carne, tocino, queso, longaniza, jamón, queso Oaxaca, chile, bistec, lechuga, jitomate.',
  },

  // ── HOT DOGS ──
  {
    id: 'hotdogs_sencillos_3',
    category: 'hotdogs',
    name: '3 Hot Dogs Sencillos',
    price: 60,
    description: 'Sencillos con complementos tradicionales.',
  },
  {
    id: 'hotdogs_tocino_3',
    category: 'hotdogs',
    name: '3 Hot Dogs de Tocino',
    price: 85,
    description: 'Envueltos en tocino.',
  },
  {
    id: 'hotdog_jumbo',
    category: 'hotdogs',
    name: 'Jumbo con Todo',
    price: 70,
    description: 'Tamaño jumbo con todos los complementos.',
  },

  // ── PAPAS CRAZY ──
  {
    id: 'papas_gajo',
    category: 'papas',
    name: 'Papas Gajo',
    price: 70,
    description: 'Crujientes papas en gajo.',
  },
  {
    id: 'papas_sencillas',
    category: 'papas',
    name: 'Papas Sencillas',
    price: 50,
    description: 'Clásicas a la francesa.',
  },
  {
    id: 'papas_tocino',
    category: 'papas',
    name: 'Papas con Tocino',
    price: 60,
    description: 'Bañadas en queso y trocitos de tocino crujiente.',
  },
  {
    id: 'papas_campechanas',
    category: 'papas',
    name: 'Papas Campechanas',
    price: 75,
    description: 'Combinación especial campechana.',
  },

  // ── BEBIDAS ──
  {
    id: 'bebida_redcola',
    category: 'bebidas',
    name: 'Red Cola 600ml',
    price: 30,
    description: '',
  },
  {
    id: 'bebida_cocacola',
    category: 'bebidas',
    name: 'Coca-Cola 600ml',
    price: 30,
    description: '',
  },
  {
    id: 'bebida_jarrito',
    category: 'bebidas',
    name: 'Jarrito 600ml',
    price: 25,
    description: '',
  },
  {
    id: 'bebida_boing',
    category: 'bebidas',
    name: 'Boing 500ml',
    price: 25,
    description: '',
  },
];

export const COMPANY_INFO = {
  name: "Conejo Blak",
  whatsapp: '525515015178',
  phone: '5639305359',
  schedule: 'Lunes a Domingo', // Asumiendo horario genérico ya que no se especificó
  paymentMethods: "Aceptamos Transferencia (722969020213105654) y Mercado Pago - Ricardo Aguilar"
};
