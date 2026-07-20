import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ShoppingBag, X, MessageCircle, ChevronLeft,
  Plus, Minus, Check, Flame, MapPin, Phone, Clock, Star,
  ArrowUp, Truck, UtensilsCrossed
} from 'lucide-react';
import logo from '../assets/logo.png';

// ─── DATA ──────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'Hamburguesas & Entradas', label: 'Hamburguesas & Entradas' },
  { id: 'Algo Sencillo Ligero', label: 'Algo Sencillo Ligero' },
  { id: 'Tacos y Variedades', label: 'Tacos y Variedades' },
  { id: 'Quesos', label: 'Quesos' },
  { id: 'Calientito y Caldosito', label: 'Calientito y Caldosito' },
  { id: 'Carnes', label: 'Carnes' },
  { id: 'Alambres y Cazuelas', label: 'Alambres y Cazuelas' },
  { id: 'Costillas a la BBQ', label: 'Costillas a la BBQ' },
  { id: 'Paquetes', label: 'Paquetes' },
  { id: 'Bebidas & Postres', label: 'Bebidas & Postres' },
  { id: 'Extras', label: 'Extras' },
];

const FEATURED_IDS = [14, 25, 16, 30, 35];

type Product = {
  id: number;
  name: string;
  description: string;
  prices: {
    normal?: number;
    individual?: number;
    orden3?: number;
    orden5?: number;
    kilo?: number;
    media?: number;
  };
  category: string;
  isPromo2x1?: boolean;
  isEventTaquiza?: boolean;
  image?: string;
};

const PRODUCTS: Product[] = [
  // ── Hamburguesas & Entradas ──
  { id: 1, name: 'Sencilla', description: 'Carne, Pan', prices: { normal: 50 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Americana', description: 'Carne, Pan, Queso Amarillo', prices: { normal: 60 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'Especial', description: 'Queso Amarillo, Queso Oaxaca', prices: { normal: 68 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=600&auto=format&fit=crop' },
  { id: 4, name: 'Hawaiana', description: 'Jamón, Queso Amarillo y Oaxaca, Piña', prices: { normal: 70 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1615761136599-86165bdf1a83?q=80&w=600&auto=format&fit=crop' },
  { id: 5, name: 'Con Tocino', description: 'Queso Amarillo y Oaxaca, Tocino', prices: { normal: 73 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=600&auto=format&fit=crop' },
  { id: 6, name: 'Super', description: 'Jamón, Queso Amarillo y Oaxaca, Salchicha', prices: { normal: 73 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1594212691516-43f07a72382c?q=80&w=600&auto=format&fit=crop' },
  { id: 7, name: 'Cubana', description: 'Jamón, Queso Amarillo y Oaxaca, Pierna', prices: { normal: 78 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1588675402014-9fa05f7710d0?q=80&w=600&auto=format&fit=crop' },
  { id: 8, name: 'Paquete Infantil', description: 'Hamburguesa, Papas y Refresco', prices: { normal: 130 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?q=80&w=600&auto=format&fit=crop' },
  { id: 9, name: 'Hochos Sencillos', description: 'Orden de 3', prices: { normal: 80 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1615822365922-29b1399df212?q=80&w=600&auto=format&fit=crop' },
  { id: 10, name: 'Hochos con Queso y Tocino', description: 'Orden de 3', prices: { normal: 95 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1599599811417-76793a0c4f80?q=80&w=600&auto=format&fit=crop' },
  { id: 11, name: 'Papas a la Francesa', description: '', prices: { normal: 75 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=600&auto=format&fit=crop' },
  { id: 12, name: 'Orden de Nuggets', description: '', prices: { normal: 85 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop' },
  { id: 13, name: 'Orden de Alitas', description: '', prices: { normal: 85 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=600&auto=format&fit=crop' },
  { id: 101, name: 'Orden de Nuggets c/ Papas', description: '', prices: { normal: 120 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop' },
  { id: 102, name: 'Orden de Alitas c/ Papas', description: '', prices: { normal: 120 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=600&auto=format&fit=crop' },
  { id: 14, name: 'Ensalada "La Cazona"', description: 'Lechuga, Durazno, Fresa, Jamón de pavo, Queso Panela, Arándano y Semilla de Girasol, acompañado de aderezos y Pollo a la parrilla.', prices: { normal: 160, media: 110 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop' },
  { id: 244, name: 'Ensalada "La Cazona" c/ Arrachera', description: 'Cambia el pollo por una porción de arrachera.', prices: { normal: 220, media: 170 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop' },
  { id: 245, name: 'Ensalada "Cesar"', description: 'Combinación de Manzana, Jitomate, Lechuga, Queso Panela, Jamón de Pavo, Semilla de Girasol y Arandanos, acompañado de aderezos y Pollo a la parrilla.', prices: { normal: 160, media: 110 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=600&auto=format&fit=crop' },
  { id: 246, name: 'Ensalada "Cesar" c/ Arrachera', description: 'Cambia el pollo por una porción de arrachera.', prices: { normal: 220, media: 170 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=600&auto=format&fit=crop' },
  { id: 15, name: 'Aguacates Rellenos de Atun', description: 'Acompañados de Ensalada de Pepinos, Lechuga y Jitomate', prices: { normal: 150 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop' },
  { id: 247, name: 'Alitas de Sabores', description: 'Tamarindo, Mango, Fresa ó Adobadas.', prices: { normal: 95 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=600&auto=format&fit=crop' },
  { id: 248, name: 'Alitas de Sabores c/ Papas', description: 'Tamarindo, Mango, Fresa ó Adobadas. Con papas a la francesa, lechuga y pepinos.', prices: { normal: 140 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=600&auto=format&fit=crop' },
  { id: 103, name: 'Enchiladas Verdes', description: 'Res, Pollo ó Chuleta', prices: { normal: 160 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?q=80&w=600&auto=format&fit=crop' },
  { id: 104, name: 'Enchiladas Suizas', description: 'Res, Pollo ó Chuleta', prices: { normal: 180 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?q=80&w=600&auto=format&fit=crop' },
  { id: 105, name: 'Burrito', description: 'Lechuga, Frijoles, Guacamole, Papas', prices: { normal: 135 }, category: 'Hamburguesas & Entradas', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=600&auto=format&fit=crop' },

  // ── Algo Sencillo Ligero ──
  { id: 201, name: 'Gringa Chica', description: '', prices: { normal: 90 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 202, name: 'Dobladitas', description: '', prices: { normal: 45 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 203, name: 'Sincronizada', description: '', prices: { normal: 45 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 204, name: 'Burritas de Jamón (Orden de 3)', description: 'Con Frijoles y Lechuga', prices: { normal: 100 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=600&auto=format&fit=crop' },
  { id: 205, name: 'Burritas de Bistec (Orden de 3)', description: 'Con Frijoles y Lechuga', prices: { normal: 120 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=600&auto=format&fit=crop' },
  { id: 206, name: 'Tostada de Pata o Tinga', description: '', prices: { normal: 45 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 207, name: 'Tortas de Suadero o Pastor', description: '', prices: { normal: 90 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 208, name: 'Tortas de Cabeza o Bistec', description: '', prices: { normal: 90 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 209, name: 'Tortas con Queso', description: '', prices: { normal: 100 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 210, name: 'Frijoles Charros', description: '', prices: { normal: 60 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 211, name: 'Frijoles Refritos c/ Totopos', description: '', prices: { normal: 75 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 212, name: 'Volcanes', description: '', prices: { normal: 85 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 213, name: 'Orden de Guacamole c/Totopos', description: '', prices: { normal: 80 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 214, name: 'Orden de Cebollitas', description: '', prices: { normal: 20 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 215, name: 'Orden de Tortillas', description: '', prices: { normal: 20 }, category: 'Algo Sencillo Ligero', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },

  // ── Quesos ──
  { id: 216, name: 'Queso Fundido Natural', description: '', prices: { normal: 95 }, category: 'Quesos', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 217, name: 'Queso c/ Bistec', description: '', prices: { normal: 120 }, category: 'Quesos', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 218, name: 'Queso c/ Pastor', description: '', prices: { normal: 120 }, category: 'Quesos', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 219, name: 'Queso c/ Suadero', description: '', prices: { normal: 120 }, category: 'Quesos', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 220, name: 'Queso c/ Champiñones', description: '', prices: { normal: 120 }, category: 'Quesos', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 221, name: 'Queso c/ Chorizo', description: '', prices: { normal: 120 }, category: 'Quesos', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 222, name: 'Queso c/ Jamón', description: '', prices: { normal: 120 }, category: 'Quesos', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 223, name: 'Queso c/ Chistorra', description: '', prices: { normal: 120 }, category: 'Quesos', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },

  // ── Calientito y Caldosito ──
  { id: 224, name: 'Pozole', description: '', prices: { normal: 100 }, category: 'Calientito y Caldosito', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 225, name: 'Birria', description: '', prices: { normal: 115 }, category: 'Calientito y Caldosito', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 226, name: 'Frijoles Charros', description: '', prices: { normal: 60 }, category: 'Calientito y Caldosito', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 227, name: 'Frijoles Charros c/ Queso', description: '', prices: { normal: 65 }, category: 'Calientito y Caldosito', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 228, name: 'Consome de Pollo', description: '', prices: { normal: 55 }, category: 'Calientito y Caldosito', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 229, name: 'Sopa Azteca', description: '', prices: { normal: 65 }, category: 'Calientito y Caldosito', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },

  // ── Costillas a la BBQ ──
  { id: 230, name: 'Costillas de Cerdo', description: 'Bañadas en salsa BBQ Acompañadas de papas gajo y Pico de Gallo', prices: { normal: 165 }, category: 'Costillas a la BBQ', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },

  // ── Tacos y Variedades ──
  { id: 16, name: 'Al Pastor', description: 'Tacos al pastor directo del trompo', prices: { individual: 17, orden5: 85 }, category: 'Tacos y Variedades', isPromo2x1: true, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=600&auto=format&fit=crop' },
  { id: 17, name: 'Suadero', description: '', prices: { individual: 17, orden5: 85 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop' },
  { id: 18, name: 'Tripa', description: '', prices: { individual: 18, orden5: 85 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=600&auto=format&fit=crop' },
  { id: 19, name: 'Longaniza', description: '', prices: { individual: 17, orden5: 85 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=600&auto=format&fit=crop' },
  { id: 20, name: 'Cabeza', description: '', prices: { individual: 17, orden5: 85 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop' },
  { id: 106, name: 'Lengua', description: '', prices: { individual: 28, orden5: 128 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop' },
  { id: 107, name: 'Sesos', description: '', prices: { individual: 28, orden5: 128 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop' },
  { id: 21, name: 'Pastor con Queso', description: '', prices: { individual: 22 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop' },
  { id: 231, name: 'Bistec', description: 'Orden de 3', prices: { orden3: 110 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=600&auto=format&fit=crop' },
  { id: 22, name: 'Bistec c/Queso', description: 'Orden de 3', prices: { orden3: 120 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=600&auto=format&fit=crop' },
  { id: 232, name: 'Chuleta', description: 'Orden de 3', prices: { orden3: 110 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop' },
  { id: 23, name: 'Chuleta c/Queso', description: 'Orden de 3', prices: { orden3: 120 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop' },
  { id: 233, name: 'Pechuga', description: 'Orden de 3', prices: { orden3: 110 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop' },
  { id: 234, name: 'Pechuga c/Queso', description: 'Orden de 3', prices: { orden3: 120 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop' },
  { id: 235, name: 'Costilla', description: 'Orden de 3', prices: { orden3: 110 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 24, name: 'Costilla c/Queso', description: 'Orden de 3', prices: { orden3: 120 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 236, name: 'Cecina', description: 'Orden de 3', prices: { orden3: 110 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 237, name: 'Cecina c/Queso', description: 'Orden de 3', prices: { orden3: 120 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 108, name: 'Tacos Parrilleros', description: 'Cecina, Chistorra, Chorizo Argentino, Arrachera, Sirloin ó Rib Eye. Acompañados de Papas Gajo y Pico de Gallo. (Orden de 3)', prices: { orden3: 180 }, category: 'Tacos y Variedades', image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=600&auto=format&fit=crop' },

  // ── Alambres y Cazuelas ──
  { id: 25, name: 'Súper Alambre Atómico (6 Personas)', description: 'Deliciosa combinación de carnes con cebolla, pimiento morrón, tocino y queso c/20 tortillas de harina.', prices: { normal: 720 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 26, name: 'Alambre Individual', description: 'De Bistec, Chuleta o Pechuga con Tocino, Morrón y Queso.', prices: { normal: 100 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 27, name: 'Alambre Sencillo', description: 'Bistec, Tocino, Cebolla, Morrón y Queso.', prices: { normal: 170 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 109, name: 'Alambre de Pollo', description: 'Pechuga de Pollo, Cebolla, Morrón, Tocino y Queso.', prices: { normal: 170 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 28, name: 'Sarape', description: 'Bistec, Chuleta, Chorizo, Pastor, Tocino, Cebolla, Morron y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 110, name: 'Alambron', description: 'Bistec, Chuleta, Jamón, Champiñon, Tocino, Cebolla, Morron y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 111, name: 'Mula Terca', description: 'Chuleta, Tocino, Jamón y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 112, name: 'Carne Suiza', description: 'Bistec, Chuleta, Tocino y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 113, name: 'Chuleta Suiza', description: 'Chuleta, Tocino y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 114, name: 'Bistec Suizo', description: 'Bistec, Tocino y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 115, name: 'Chuleta al Pastor', description: 'Combinación de Pastor c/ Chuleta, Tocino y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 116, name: 'Nopalada', description: 'Nopal, Champiñon y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 117, name: 'Que me vez', description: 'Tocino, Al Pastor, Bistec, Piña y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 29, name: 'Taco Loco', description: 'Tocino, Chuleta, Tocino, Nopal, Champiñones, Cebolla y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 118, name: 'Gringa Especial', description: 'Chuleta, Pastor, Tocino y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 119, name: 'Que me notas', description: 'Chuleta, Tocino, Cebolla, Morron, Champiñones y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 120, name: 'Alambre Vegetariano', description: 'Cebolla, Pimiento, Champiñones, Jitomate, Nopales y Queso.', prices: { normal: 180 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 121, name: 'Alambre Mar y Tierra', description: 'Bistec, Camaron, Tocino, Cebolla, Pimiento y Queso.', prices: { normal: 230 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 122, name: 'Alambre de Camaron', description: '', prices: { normal: 230 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 30, name: 'Parrillada (6 personas)', description: 'Variedad de carnes y pollo acompañadas con: cebollitas, nopales, queso fundido y frijoles charros c/ tortillas de maíz o harina y orden de guacamole', prices: { normal: 750 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 238, name: 'Cazuela Mixta (6 personas)', description: 'Combinación de alambre, pastor, carne suiza, acompañada de cebollas, nopales, orden de guacamole y tortillas de maíz y harina', prices: { normal: 750 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 239, name: 'Parrillada Argentina (6 personas)', description: '2kg de Arrachera, cebollitas, nopales, 6 Frijoles Charros, Chorizo Argentino, Guacamole, Chiles toreados y Queso Fundido', prices: { normal: 900 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 240, name: 'Parrillada Super (6 personas)', description: 'Costilla, Chistorra, Arrachera, Sirloin, Chorizo argentino, Cecina enchilada, Bisteck, Cebollas, Nopales, Frijoles, Guacamole, Chiles toreados', prices: { normal: 1000 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 241, name: 'Alambre de Sirloin', description: 'Cebolla, morron, champiñones, Sirloin y Quesillo / con tortillas de harina', prices: { normal: 220 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 242, name: 'Alambre de Arrachera', description: 'Cebolla, morron, champiñones, Arrachera y Quesillo / con tortillas de harina', prices: { normal: 220 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 243, name: 'Alambre de Rib Eye', description: 'Cebolla, morron, champiñones, Rib Eye y Quesillo / con tortillas de harina', prices: { normal: 220 }, category: 'Alambres y Cazuelas', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 31, name: 'Servicio de Taquiza', description: 'Hacemos taquizas para sus eventos', prices: { normal: 0 }, category: 'Alambres y Cazuelas', isEventTaquiza: true, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop' },

  // ── Carnes ──
  { id: 123, name: 'Costilla Asada', description: '', prices: { normal: 180 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 124, name: 'Bistec a la Mexicana', description: '', prices: { normal: 180 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 125, name: 'Bistec Encebollado', description: '', prices: { normal: 180 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 126, name: 'Carne Asada', description: '', prices: { normal: 180 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 127, name: 'Arrachera (300grs.)', description: '', prices: { normal: 230 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 128, name: 'Cecina Enchilada', description: '', prices: { normal: 180 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 129, name: 'Chilaquiles', description: 'con Bistec, Costilla, C. Enchilada, Pastor, ó Suadero.', prices: { normal: 180 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=600&auto=format&fit=crop' },
  { id: 130, name: 'Rib Eye', description: '', prices: { normal: 250 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 131, name: 'T. Bone', description: '', prices: { normal: 250 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 132, name: 'New York', description: '', prices: { normal: 250 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 133, name: 'Sirloin', description: '', prices: { normal: 250 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 134, name: 'Milanesa Grande', description: '', prices: { normal: 165 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 135, name: 'Milanesa Grande', description: 'Gratinada c/ Queso', prices: { normal: 180 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 136, name: 'Fajitas de Res', description: '', prices: { normal: 180 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 137, name: 'Fajitas de Pollo', description: '', prices: { normal: 180 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 138, name: 'Pechuga Suiza', description: '', prices: { normal: 180 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 139, name: 'Pechuga Asada', description: '', prices: { normal: 170 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 140, name: 'Pechuga a la Mexicana', description: '', prices: { normal: 170 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 141, name: 'Pechuga Empanizada', description: '', prices: { normal: 170 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 142, name: 'Pechuga Cordon Blue', description: '', prices: { normal: 175 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 143, name: 'Arrachera en Tiras', description: 'Con Queso Fundido y Guacamole', prices: { normal: 230 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },
  { id: 144, name: 'Carne a la Tampiqueña', description: '', prices: { normal: 230 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
  { id: 145, name: 'Pechuga Hawaiana', description: 'Pechuga Asada, Jamon, Piña, Queso Amarillo y Queso Oaxaca', prices: { normal: 180 }, category: 'Carnes', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },

  // ── Paquetes ──
  { id: 32, name: 'Paquete 1', description: 'Alambre Sencillo, Frijoles, Un Refresco', prices: { normal: 185 }, category: 'Paquetes', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop' },
  { id: 33, name: 'Paquete 2', description: 'Costilla Asada, Frijoles, Un Refresco', prices: { normal: 190 }, category: 'Paquetes', image: 'https://images.unsplash.com/photo-1544025162-841f3e7a09ab?q=80&w=600&auto=format&fit=crop' },
  { id: 34, name: 'Paquete 3', description: '10 Tacos a elegir (*Pastor *Suadero *Longaniza *Cabeza), Frijoles, Un Refresco', prices: { normal: 185 }, category: 'Paquetes', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=600&auto=format&fit=crop' },
  { id: 35, name: 'Kilo de Carne', description: 'Pastor y Alambre para llevar. Incluye: Tortillas, Salsas, Limones y Verdura.', prices: { kilo: 400 }, category: 'Paquetes', image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop' },

  // ── Bebidas & Postres ──
  { id: 36, name: 'Agua de Horchata', description: '', prices: { individual: 35, media: 45 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=600&auto=format&fit=crop' },
  { id: 249, name: 'Agua Piña Colada de Crema', description: '', prices: { individual: 40, media: 60 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600&auto=format&fit=crop' },
  { id: 250, name: 'Agua Fresca de Crema', description: '', prices: { individual: 40, media: 60 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop' },
  { id: 251, name: 'Jarra de Agua de Crema', description: '', prices: { normal: 100 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=600&auto=format&fit=crop' },
  { id: 252, name: 'Jarra de Agua de Horchata', description: '', prices: { normal: 100 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=600&auto=format&fit=crop' },
  { id: 37, name: 'Refresco', description: '', prices: { normal: 33 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop' },
  { id: 253, name: 'Agua p/ Nescafe', description: '', prices: { normal: 25 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop' },
  { id: 254, name: 'Cafe de Olla', description: '', prices: { normal: 25 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop' },
  { id: 38, name: 'Cerveza de Botella', description: '', prices: { normal: 55 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1575037614876-c3853d406b88?q=80&w=600&auto=format&fit=crop' },
  { id: 39, name: 'Michelada 1/2 lt.', description: '', prices: { normal: 65 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1560507204-c5a4adce2611?q=80&w=600&auto=format&fit=crop' },
  { id: 40, name: 'Michelada 1 lt.', description: '', prices: { normal: 115 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1560507204-c5a4adce2611?q=80&w=600&auto=format&fit=crop' },
  { id: 255, name: 'Gomichela 1/2 lt.', description: '', prices: { normal: 90 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1571115177098-24def50e3037?q=80&w=600&auto=format&fit=crop' },
  { id: 256, name: 'Gomichela 1lt.', description: '', prices: { normal: 120 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1571115177098-24def50e3037?q=80&w=600&auto=format&fit=crop' },
  { id: 257, name: 'Cubana 1/2 lt.', description: '', prices: { normal: 75 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1615332579037-3c44b3660b53?q=80&w=600&auto=format&fit=crop' },
  { id: 258, name: 'Cubana 1 lt.', description: '', prices: { normal: 125 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1615332579037-3c44b3660b53?q=80&w=600&auto=format&fit=crop' },
  { id: 41, name: 'Cerveza de Barril 1/2 lt.', description: '', prices: { normal: 60 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1575037614876-c3853d406b88?q=80&w=600&auto=format&fit=crop' },
  { id: 42, name: 'Cerveza de Barril 1 lt.', description: '', prices: { normal: 110 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1575037614876-c3853d406b88?q=80&w=600&auto=format&fit=crop' },
  { id: 259, name: 'Cervezas de Sabores 1/2 lt', description: 'Tamarindo / Mango / Mora Azul', prices: { normal: 80 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1615332579037-3c44b3660b53?q=80&w=600&auto=format&fit=crop' },
  { id: 260, name: 'Cervezas de Sabores 1lt', description: 'Tamarindo / Mango / Mora Azul', prices: { normal: 120 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1615332579037-3c44b3660b53?q=80&w=600&auto=format&fit=crop' },
  { id: 43, name: 'Flan Napolitano', description: '', prices: { normal: 50 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1509482560494-4126f8225994?q=80&w=600&auto=format&fit=crop' },
  { id: 44, name: 'Fresas con Crema', description: '', prices: { normal: 50 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?q=80&w=600&auto=format&fit=crop' },
  { id: 261, name: 'Duraznos', description: '', prices: { normal: 50 }, category: 'Bebidas & Postres', image: 'https://images.unsplash.com/photo-1602111855648-fbcc49863a43?q=80&w=600&auto=format&fit=crop' },

  // ── Extras ──
  { id: 262, name: 'Orden de Crema', description: '', prices: { normal: 30 }, category: 'Extras', image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?q=80&w=600&auto=format&fit=crop' },
  { id: 263, name: 'Orden de Chicharron', description: '', prices: { normal: 30 }, category: 'Extras', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=600&auto=format&fit=crop' },
  { id: 264, name: 'Orden de Aguacate', description: '', prices: { normal: 30 }, category: 'Extras', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600&auto=format&fit=crop' },
  { id: 265, name: 'Orden de Cebollitas', description: '', prices: { normal: 20 }, category: 'Extras', image: 'https://images.unsplash.com/photo-1605333177726-5b4fc5e4df5e?q=80&w=600&auto=format&fit=crop' },
  { id: 266, name: 'Orden de Torillas de Harina', description: '', prices: { normal: 20 }, category: 'Extras', image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=600&auto=format&fit=crop' },
];

type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  selectedPriceType: 'normal' | 'individual' | 'orden3' | 'orden5' | 'media' | 'kilo';
  priceAtTimeOfAdding: number;
};

// ─── COMPONENT ─────────────────────────────────────────────────────────────────
export default function LaCazonaMenu() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [customerInfo, setCustomerInfo] = useState({
    name: '', phone: '', deliveryMethod: '', address: '',
    paymentMethod: '', cashAmount: '', notes: '',
  });

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const displayedProducts = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [searchQuery, activeCategory]);

  const featuredProducts = useMemo(
    () => PRODUCTS.filter(p => FEATURED_IDS.includes(p.id)),
    []
  );

  const cartTotal = cart.reduce((sum, i) => sum + i.priceAtTimeOfAdding * i.quantity, 0);
  const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const addToCart = (product: Product, priceType: CartItem['selectedPriceType'], priceValue: number) => {
    if (product.isEventTaquiza) return;
    const cartItemId = `${product.id}-${priceType}`;
    setCart(prev => {
      const exists = prev.find(item => item.id === cartItemId);
      if (exists) return prev.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: cartItemId, product, quantity: 1, selectedPriceType: priceType, priceAtTimeOfAdding: priceValue }];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(i =>
      i.id === cartItemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    ).filter(i => i.quantity > 0));
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setCartStep(3);
    setTimeout(() => {
      const phoneNumber = '525519217175';
      let message = `*¡Hola! Me gustaría hacer un pedido en La Cazona:*\n\n`;
      message += `*DATOS DEL CLIENTE:*\n`;
      message += `Nombre: ${customerInfo.name}\nTeléfono: ${customerInfo.phone}\n`;
      message += `Entrega: ${customerInfo.deliveryMethod}\n`;
      if (customerInfo.deliveryMethod === 'Envío a domicilio') message += `Dirección: ${customerInfo.address}\n`;
      message += `Pago: ${customerInfo.paymentMethod}\n`;
      if ((customerInfo.paymentMethod === 'Efectivo en sucursal' || customerInfo.paymentMethod === 'Efectivo (Pago contra entrega)') && customerInfo.cashAmount) {
        message += `Pago con: $${customerInfo.cashAmount}\n`;
      }
      if (customerInfo.notes) message += `Notas: ${customerInfo.notes}\n`;
      message += `\n*MI ORDEN:*\n`;
      cart.forEach(item => {
        const typeLabel =
          item.selectedPriceType === 'individual' ? ' (Individual)' :
          item.selectedPriceType === 'orden3' ? ' (Orden de 3)' :
          item.selectedPriceType === 'orden5' ? ' (Orden de 5)' :
          item.selectedPriceType === 'media' ? ' (Grande)' :
          item.selectedPriceType === 'kilo' ? ' (Kilo)' : '';
        message += `${item.quantity}x ${item.product.name}${typeLabel} - $${item.priceAtTimeOfAdding * item.quantity}\n`;
      });
      message += `\n*TOTAL: $${cartTotal}*\n`;
      window.location.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    }, 600);
  };

  const closeCartAndReset = () => {
    setCart([]);
    setCustomerInfo({ name: '', phone: '', deliveryMethod: '', address: '', paymentMethod: '', cashAmount: '', notes: '' });
    setCartStep(1);
    setIsCartOpen(false);
  };

  const getPriceLabel = (type: string) => {
    if (type === 'individual') return 'C/u';
    if (type === 'orden3') return 'Ord. 3';
    if (type === 'orden5') return 'Ord. 5';
    if (type === 'media') return 'Grande';
    if (type === 'kilo') return 'Kilo';
    return '';
  };


  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-amber-500/30">

      {/* ═══════════ HERO ═══════════ */}
          <section
            className="relative overflow-hidden bg-gradient-to-b from-[#1a1005] via-[#1f1005] to-[#0f0f0f] border-b border-amber-900/30"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]" />
              <div className="absolute top-10 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <div className="absolute top-20 right-1/3 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
              <div className="absolute top-16 right-1/4 w-1 h-1 bg-amber-300 rounded-full animate-pulse" />
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="flex-1 text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-400 font-semibold text-sm tracking-wider uppercase">Directo de la Parrilla</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4">
                      <span className="text-amber-500">LA</span>{' '}
                      <span className="text-white">CAZONA</span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-amber-400/80 font-light italic mb-2">
                      Taquería & Parrilla
                    </p>
                    <div className="w-16 h-1 bg-amber-500 rounded-full my-4 mx-auto md:mx-0" />
                    <p className="text-gray-400 max-w-md leading-relaxed mt-4">
                      Hamburguesas artesanales, tacos al pastor y parrilladas que encienden los sentidos.
                    </p>
                  </motion.div>
                </div>

                {/* Visual: logo in glowing circle */}
                <motion.div
                  className="flex-1 flex justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-600/10 to-red-800/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-44 h-44 md:w-52 md:h-52 rounded-full bg-white/5 border-2 border-amber-500/20 flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.3)] overflow-hidden p-4">
                          <img src={logo} alt="La Cazona" className="w-full h-full object-contain drop-shadow-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

      {/* ═══════════ STICKY HEADER ═══════════ */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="La Cazona" className="w-8 h-8 object-contain rounded-lg" />
            <div>
              <h2 className="text-lg font-black tracking-tight">
                <span className="text-amber-500">LA</span> CAZONA
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                searchInputRef.current?.focus();
                searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <a
              href="https://wa.me/525519217175"
              className="hidden sm:flex items-center text-[#25D366] hover:opacity-80 transition-opacity"
              title="WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-label="WhatsApp">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            <button
              onClick={() => { setIsCartOpen(true); setCartStep(1); }}
              className="relative bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-sm uppercase tracking-wider">Orden</span>
              {cartItemCount > 0 && (
                <motion.span
                  key={cartItemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════ TAQUIZA ANNOUNCEMENT ═══════════ */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-black font-black text-center py-2.5 px-4 text-sm tracking-wider uppercase overflow-hidden relative">
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="whitespace-nowrap inline-block"
        >
          Hacemos Taquizas para sus Eventos &nbsp;&mdash;&nbsp; Cotiza por WhatsApp &nbsp;&mdash;&nbsp; Servicio Express a Domicilio
        </motion.div>
      </div>

      {/* ═══════════ SEARCH ═══════════ */}
      <div id="menu-start" className="py-5 px-4">
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-500" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 bg-[#1a1a1a] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 font-medium transition-all"
            placeholder="Buscar tacos, hamburguesas, alambres..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ═══════════ CATEGORY PILLS ═══════════ */}
      {!searchQuery && (
        <nav className="max-w-6xl mx-auto px-4 mb-8 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 pb-2 min-w-max justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap uppercase tracking-wider ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className="max-w-6xl mx-auto px-4 pb-24">
        {!searchQuery && (
          <div className="text-center mb-10">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3"
            >
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                <span className="text-white">{activeCategory.split(' & ')[0]}</span>
                {activeCategory.includes('&') && (
                  <span className="text-gray-500"> & {activeCategory.split(' & ')[1]}</span>
                )}
              </h2>
            </motion.div>
            <p className="text-gray-500 mt-2 text-sm">
              {displayedProducts.length} {displayedProducts.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        )}

        {searchQuery && (
          <h2 className="text-xl font-black text-white mb-8 text-center">
            <span className="text-gray-500">Resultados para</span> &ldquo;{searchQuery}&rdquo;
            <span className="text-gray-500"> &mdash; {displayedProducts.length}</span>
          </h2>
        )}

        {/* Featured strip */}
        {!searchQuery && activeCategory === CATEGORIES[0].id && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-lg font-black text-amber-400 uppercase tracking-wider">Los Más Pedidos</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {featuredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => {
                    setActiveCategory(product.category);
                    setTimeout(() => {
                      document.getElementById(`product-${product.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 200);
                  }}
                  className="group bg-[#1a1a1a] border border-white/5 hover:border-amber-500/30 rounded-2xl p-4 text-center transition-all hover:bg-[#1f1f1f] hover:-translate-y-1 cursor-pointer"
                >
                  <p className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors leading-tight truncate">{product.name}</p>
                  {product.prices.normal ? (
                    <p className="text-amber-500 font-black text-sm mt-1">${product.prices.normal}</p>
                  ) : product.prices.individual ? (
                    <p className="text-amber-500 font-black text-sm mt-1">Desde ${product.prices.individual}</p>
                  ) : product.prices.kilo ? (
                    <p className="text-amber-500 font-black text-sm mt-1">${product.prices.kilo}/kg</p>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Product Grid */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500 font-bold text-lg">Sin resultados</p>
            <p className="text-gray-600 text-sm mt-2">
              Prueba buscar &ldquo;pastor&rdquo;, &ldquo;hamburguesa&rdquo; o &ldquo;alambre&rdquo;
            </p>
            <button onClick={() => setSearchQuery('')} className="mt-4 text-amber-500 text-sm font-bold hover:underline">
              Ver todo el menú
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedProducts.map((product, idx) => {
              return (
                <motion.div
                  key={product.id}
                  id={`product-${product.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.4 }}
                  className={`group flex flex-col bg-[#1a1a1a] border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 ${
                    product.isEventTaquiza
                      ? 'border-amber-500/30 bg-gradient-to-br from-[#1a1005] to-[#1a1a1a]'
                      : product.isPromo2x1
                        ? 'border-amber-500/20'
                        : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Product Image */}
                  {product.image && (
                    <div className="relative w-full h-48 overflow-hidden bg-black/20 shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                    </div>
                  )}

                  {/* Card info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="text-white font-black text-lg leading-tight group-hover:text-amber-400 transition-colors">
                        {product.name}
                      </h3>
                      {product.isEventTaquiza && (
                        <span className="bg-blue-500 text-white font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0">
                          Evento
                        </span>
                      )}
                      {product.isPromo2x1 && (
                        <span className="bg-amber-500 text-black font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0 shadow-lg">
                          <Flame className="w-3 h-3" />
                          2x1 L-J
                        </span>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {product.isEventTaquiza ? (
                      <a
                        href="https://wa.me/525519217175?text=Hola,%20me%20interesa%20cotizar%20una%20Taquiza%20para%20un%20evento."
                        className="mt-auto w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-wider flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        Cotizar por WhatsApp
                      </a>
                    ) : (
                      <div className="space-y-2 mt-auto">
                        {Object.entries(product.prices).map(([type, price]) =>
                          price !== undefined ? (
                            <div
                              key={type}
                              className="flex items-center justify-between bg-[#141414] rounded-xl px-3 py-2 border border-white/5"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-amber-500 font-black text-xl">${price}</span>
                                {type !== 'normal' && (
                                  <span className="text-gray-600 text-xs font-bold uppercase bg-white/5 px-2 py-0.5 rounded-full">
                                    {getPriceLabel(type)}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => addToCart(product, type as CartItem['selectedPriceType'], price)}
                                className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-bold px-3 py-1.5 rounded-lg transition-all text-sm flex items-center gap-1 border border-amber-500/20 hover:border-amber-500"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Agregar
                              </button>
                            </div>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* ═══════════ CART OVERLAY ═══════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end"
            onClick={(e) => { if (e.target === e.currentTarget) closeCartAndReset(); }}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-[#121212] h-full flex flex-col shadow-2xl border-l border-white/5"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => cartStep > 1 ? setCartStep(cartStep - 1) : closeCartAndReset()}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    {cartStep === 1 ? <X className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                  </button>
                  <h3 className="font-black text-white text-lg">
                    {cartStep === 1 && 'Tu Orden'}
                    {cartStep === 2 && 'Tus Datos'}
                    {cartStep === 3 && '¡Listo!'}
                  </h3>
                </div>
                {cartStep === 1 && cart.length > 0 && (
                  <button
                    onClick={() => { setCart([]); closeCartAndReset(); }}
                    className="text-xs text-gray-500 hover:text-red-400 font-bold transition-colors"
                  >
                    Vaciar
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {/* STEP 1: Cart items */}
                {cartStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    {cart.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 mb-5 rounded-2xl bg-white/5 flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400 font-bold text-lg mb-1">Tu orden está vacía</p>
                        <p className="text-gray-500 text-sm">Agrega productos del menú para comenzar</p>
                        <button
                          onClick={closeCartAndReset}
                          className="mt-5 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all text-sm"
                        >
                          Ver Menú
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          {cart.map(item => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 bg-[#1a1a1a] rounded-2xl p-3 border border-white/5"
                            >
                              <div className="w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/10 flex items-center justify-center">
                                <span className="text-amber-400 font-black text-[10px]">{getInitials(item.product.name)}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm truncate">{item.product.name}</p>
                                <p className="text-gray-500 text-xs">
                                  {item.selectedPriceType !== 'normal' ? getPriceLabel(item.selectedPriceType) : ''}
                                </p>
                                <p className="text-amber-500 font-black text-sm">${item.priceAtTimeOfAdding * item.quantity}</p>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-white font-bold w-6 text-center text-sm">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black transition-all"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 border-t border-white/5">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-400 font-bold">Total</span>
                            <motion.span
                              key={cartTotal}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                              className="text-2xl font-black text-amber-500"
                            >
                              ${cartTotal}
                            </motion.span>
                          </div>
                          <button
                            onClick={() => setCartStep(2)}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-3.5 rounded-xl transition-all uppercase tracking-wider text-sm"
                          >
                            Continuar Pedido
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* STEP 2: Customer info */}
                {cartStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <form onSubmit={handleConfirmOrder} className="flex-1 flex flex-col">
                      <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Nombre *</label>
                            <input
                              required
                              type="text"
                              value={customerInfo.name}
                              onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                              className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 font-medium"
                              placeholder="Tu nombre completo"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Teléfono *</label>
                            <input
                              required
                              type="tel"
                              value={customerInfo.phone}
                              onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                              className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 font-medium"
                              placeholder="55 1234 5678"
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5">
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Entrega *</label>
                          <select
                            required
                            value={customerInfo.deliveryMethod}
                            onChange={e => setCustomerInfo({ ...customerInfo, deliveryMethod: e.target.value })}
                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50 font-medium"
                          >
                            <option value="">Selecciona un método...</option>
                            <option value="Recoger en sucursal">Recoger en sucursal</option>
                            <option value="Envío a domicilio">Envío a domicilio</option>
                          </select>
                          {customerInfo.deliveryMethod === 'Envío a domicilio' && (
                            <div className="mt-3">
                              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Dirección *</label>
                              <textarea
                                required
                                value={customerInfo.address}
                                onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 font-medium"
                                placeholder="Calle, número, colonia, referencias..."
                                rows={2}
                              />
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/5">
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Forma de Pago *</label>
                          <select
                            required
                            value={customerInfo.paymentMethod}
                            onChange={e => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })}
                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50 font-medium"
                          >
                            <option value="">Selecciona...</option>
                            <option value={customerInfo.deliveryMethod === 'Envío a domicilio' ? 'Efectivo (Pago contra entrega)' : 'Efectivo en sucursal'}>
                              Efectivo
                            </option>
                            <option value="Transferencia / Depósito">Transferencia / Depósito</option>
                          </select>

                          {(customerInfo.paymentMethod === 'Efectivo en sucursal' || customerInfo.paymentMethod === 'Efectivo (Pago contra entrega)') && (
                            <div className="mt-3">
                              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">¿Con cuánto pagas? (cambio)</label>
                              <input
                                type="number"
                                value={customerInfo.cashAmount}
                                onChange={e => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 font-medium"
                                placeholder={`Ej. 500 (Total: $${cartTotal})`}
                              />
                            </div>
                          )}

                          {customerInfo.paymentMethod === 'Transferencia / Depósito' && (
                            <div className="mt-3 bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
                              <h4 className="text-amber-400 font-black text-sm mb-2">Datos Bancarios</h4>
                              <div className="space-y-1 text-sm text-gray-400 font-medium">
                                <p><strong className="text-gray-300">Banco:</strong> BBVA Bancomer</p>
                                <p><strong className="text-gray-300">Titular:</strong> La Cazona Taquería</p>
                                <p><strong className="text-gray-300">CLABE:</strong> 012 345 6789 0123 4567</p>
                              </div>
                              <p className="text-xs text-amber-500/70 mt-2 font-medium">
                                Envía tu comprobante por WhatsApp al finalizar.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-white/5">
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Instrucciones Especiales</label>
                          <textarea
                            value={customerInfo.notes}
                            onChange={e => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 font-medium"
                            placeholder="Ej. Sin cebolla, mucha salsa verde..."
                            rows={2}
                          />
                        </div>
                      </div>

                      <div className="p-4 border-t border-white/5 bg-[#121212]">
                        <div className="flex items-center justify-between mb-3 text-sm">
                          <span className="text-gray-400">Total</span>
                          <span className="text-amber-500 font-black text-lg">${cartTotal}</span>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black py-3.5 rounded-xl transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-5 h-5 fill-current" />
                          Enviar por WhatsApp
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* STEP 3: Success */}
                {cartStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.1 }}
                      className="w-24 h-24 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mb-6 border-2 border-green-500/20"
                    >
                      <Check className="w-12 h-12" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-white mb-2">¡Orden Generada!</h3>
                    <p className="text-gray-400 font-medium mb-8">
                      Serás redirigido a WhatsApp para enviar los detalles.
                    </p>
                    <div className="w-10 h-10 border-2 border-white/5 border-t-amber-500 rounded-full animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ SCROLL TO TOP ═══════════ */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-4 z-30 w-11 h-11 bg-amber-500 text-black rounded-xl flex items-center justify-center shadow-lg hover:bg-amber-400 transition-all"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 pt-16 pb-10 mt-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <h3 className="text-2xl font-black tracking-tight mb-4">
              <span className="text-amber-500">LA</span>{' '}
              <span className="text-white">CAZONA</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              El verdadero sabor de la parrilla y el trompo. Hamburguesas artesanales, tacos al pastor y parrilladas con ingredientes de primera.
            </p>
            <div className="flex items-center gap-2 text-amber-500">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Taquería & Parrilla</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-5 border-b border-white/10 pb-2">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 text-amber-500" />
                <span className="font-bold">55.65.53.91.97</span>
              </li>
              <li className="flex items-center gap-3">
                <a href="https://wa.me/525519217175" className="text-[#25D366] hover:opacity-80 transition-opacity" title="WhatsApp">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="WhatsApp">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Truck className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-sm">Servicio Express a Domicilio</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-5 border-b border-white/10 pb-2">Horario & Más</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-600" />
                Abierto todos los días
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-600" />
                Visítanos en sucursal
              </li>
              <li className="flex items-center gap-3">
                <UtensilsCrossed className="w-4 h-4 text-gray-600" />
                Taquizas para eventos
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-600 text-xs font-medium">
            &copy; {new Date().getFullYear()} La Cazona Taquería & Parrilla &mdash; Diseñado por{' '}
            <span className="text-gray-500">IMAGINE & STAMP</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
