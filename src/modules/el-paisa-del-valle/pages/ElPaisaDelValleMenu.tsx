// ═══════════════════════════════════════════════════════════════════════════
// TAQUERÍA EL PAISA DEL VALLE — Menú Digital Interactivo Fiel a la Carta Física
// Estilo: Amarillo Maíz, Naranja y Rojo Cómic · Fotos Reales de Platillos
// Tarjetas Compactas en Fila · Carrito CRO 2 Pasos · WhatsApp Directo 550ms
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, X, ShoppingBag, Flame, Sparkles,
  Phone, MapPin, Clock, MessageCircle, Shield,
  Copy, Check, Trash2, Landmark, Wallet, Store, Bike,
  Star, ChevronRight, Utensils
} from 'lucide-react';
import { clientConfig, bankInfo } from '../config';

// ── Assets WebP Optimizados (<40 KB cada uno, logo <60 KB) ──
import paisaLogo from '../assets/logo.webp';
import fotoSuadero from '../assets/foto-suadero.webp';
import fotoPastor from '../assets/foto-pastor.webp';
import fotoBistec from '../assets/foto-bistec.webp';
import fotoCecina from '../assets/foto-cecina.webp';
import fotoArrachera from '../assets/foto-arrachera.webp';
import fotoGringa from '../assets/foto-gringa.webp';
import fotoBurrito from '../assets/foto-burrito.webp';
import fotoAlambre from '../assets/foto-alambre.webp';
import fotoRamen from '../assets/foto-ramen.webp';
import fotoChicharron from '../assets/foto-chicharron.webp';
import fotoQuesoFundido from '../assets/foto-queso-fundido.webp';
import fotoCervezas from '../assets/foto-cervezas.webp';
import fotoJugo from '../assets/foto-jugo.webp';

const C = clientConfig.colors;

// ── Categorías Oficiales de la Carta ──
type CategoryId =
  | 'todos'
  | 'tacos'
  | 'arrachera-pechuga'
  | 'gringas'
  | 'costras'
  | 'burritos'
  | 'alambres'
  | 'especialidades'
  | 'gorditas'
  | 'bebidas';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  portion?: string;
  stamp?: string;
  image?: string;
  featured?: boolean;
  canCustomize?: boolean;
  customType?: 'suadero' | 'taco' | 'cecina' | 'gringa' | 'costra' | 'burrito' | 'alambre' | 'ramen' | 'queso' | 'gordita' | 'cerveza' | 'refresco';
}

interface CustomOption {
  name: string;
  price: number;
}

interface CartItem {
  lineId: string;
  productId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  category: CategoryId;
  portion?: string;
  image?: string;
  selectedSauce?: string;
  selectedVeggie?: string;
  extras?: CustomOption[];
  specialNotes?: string;
}

// ── Salsas y Verdura (Ajustadas exactamente a lo que ofrece la taquería) ──
const SALSAS_DISPONIBLES = [
  { id: 'verde', name: 'Salsa Verde Taquera', desc: 'Receta de la casa con tomatillo' },
  { id: 'roja_arbol', name: 'Salsa Roja de Chile de Árbol', desc: 'Chile de árbol tostado al comal' },
  { id: 'sin_salsa', name: 'Salsas Aparte', desc: 'Te enviamos porciones para servir al gusto' },
];

const VERDURA_OPCIONES = [
  { id: 'con_todo', name: 'Con Todo (Cilantro y Cebolla)' },
  { id: 'sin_cebolla', name: 'Solo Cilantro (Sin Cebolla)' },
  { id: 'sin_cilantro', name: 'Solo Cebolla (Sin Cilantro)' },
  { id: 'sin_verdura', name: 'Sin Verdura (Carne Sola)' },
  { id: 'verdura_aparte', name: 'Verdura y Limones Aparte' },
];

const REFRESCO_SABORES = [
  'Coca-Cola Original',
  'Coca-Cola Sin Azúcar',
  'Sidral Mundet',
  'Sprite Limón',
  'Fanta Naranja',
  'Boing de Mango',
  'Boing de Guayaba',
  'Agua Mineral Tehuacán',
];

// ── CATÁLOGO COMPLETO EXTRAÍDO FIELMENTE DEL MENÚ FÍSICO ──
const PRODUCTS: Product[] = [
  // ── PÁGINA 1: TACOS ──
  {
    id: 'taco-suadero',
    name: 'Taco de Suadero',
    description: '¡La especialidad del Paisa! Delicioso suadero estilo Arandas, preparado en jugo de carne con la receta de la casa.',
    price: 30,
    category: 'tacos',
    portion: '60g',
    stamp: 'ESPECIALIDAD',
    image: fotoSuadero,
    featured: true,
    canCustomize: true,
    customType: 'suadero',
  },
  {
    id: 'taco-suadero-campechano',
    name: 'Taco Campechano de Suadero',
    description: 'Suadero confitado al jugo combinado con longaniza almendrada.',
    price: 30,
    category: 'tacos',
    portion: '60g',
    image: fotoSuadero,
    canCustomize: true,
    customType: 'suadero',
  },
  {
    id: 'taco-bistec',
    name: 'Taco de Bistec',
    description: '¡Solo la mejor calidad! Jugoso bistec centro marinado con la receta de la casa.',
    price: 32,
    category: 'tacos',
    portion: '60g',
    stamp: 'CALIDAD 100%',
    image: fotoBistec,
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-bistec-campechano',
    name: 'Taco Campechano de Bistec',
    description: 'Bistec centro marinado combinado con longaniza almendrada.',
    price: 32,
    category: 'tacos',
    portion: '60g',
    image: fotoBistec,
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-pastor',
    name: 'Taco de Pastor',
    description: '¡Prueba nuestra receta secreta! Te encantará su gran sabor, servido con piña fresca.',
    price: 20,
    category: 'tacos',
    portion: '40g',
    image: fotoPastor,
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'orden-3-pastor',
    name: 'Orden de 3 Tacos de Pastor',
    description: 'Trío de tacos al pastor al comal con piña, cilantro y cebolla.',
    price: 55,
    category: 'tacos',
    portion: '3 pzas',
    stamp: 'PRECIO ESPECIAL',
    image: fotoPastor,
    featured: true,
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-cecina',
    name: 'Taco de Cecina de Yecapixtla',
    description: '¡100% de Yecapixtla! Prueba la cecina de la mejor calidad que traemos directamente de la capital de la cecina.',
    price: 45,
    category: 'tacos',
    portion: '60g',
    stamp: 'YECAPIXTLA ¡100!',
    image: fotoCecina,
    featured: true,
    canCustomize: true,
    customType: 'cecina',
  },
  {
    id: 'taco-campechano-cecina',
    name: 'Taco Campechano Cecina',
    description: 'Cecina auténtica de Yecapixtla con deliciosa longaniza almendrada.',
    price: 45,
    category: 'tacos',
    portion: '60g',
    image: fotoCecina,
    canCustomize: true,
    customType: 'cecina',
  },
  {
    id: 'taco-cecina-enchilada',
    name: 'Taco de Cecina Enchilada',
    description: 'Cecina adobada artesanal con chiles secos aromáticos.',
    price: 35,
    category: 'tacos',
    portion: '60g',
    image: fotoCecina,
    canCustomize: true,
    customType: 'cecina',
  },
  {
    id: 'taco-campechano-enchilada',
    name: 'Taco Campechano Enchilada',
    description: 'Cecina enchilada y longaniza almendrada doraditas.',
    price: 35,
    category: 'tacos',
    portion: '60g',
    image: fotoCecina,
    canCustomize: true,
    customType: 'cecina',
  },
  {
    id: 'taco-yeca-especial',
    name: 'Taco Yeca (con Aguacate y Nopales)',
    description: 'Cecina de Yecapixtla servida con rebanadas de aguacate y nopales asados.',
    price: 55,
    category: 'tacos',
    portion: '60g',
    stamp: 'DE LA CASA',
    image: fotoCecina,
    canCustomize: true,
    customType: 'cecina',
  },
  {
    id: 'taco-yeca-camp',
    name: 'Taco Yeca Camp. (con Aguacate y Nopales)',
    description: 'Cecina de Yecapixtla, longaniza almendrada, aguacate y nopales asados.',
    price: 55,
    category: 'tacos',
    portion: '60g',
    image: fotoCecina,
    canCustomize: true,
    customType: 'cecina',
  },
  {
    id: 'taco-longaniza',
    name: 'Taco de Longaniza Almendrada',
    description: 'Receta artesanal con almendra molida y especias al comal.',
    price: 28,
    category: 'tacos',
    portion: '60g',
    image: fotoCecina,
    canCustomize: true,
    customType: 'taco',
  },

  // ── PÁGINA 2: ARRACHERA & PECHUGA ──
  {
    id: 'taco-arrachera',
    name: 'Taco Arrachera Prime',
    description: 'Jugosa y exquisita arrachera prime de importación en nuestro marinado especial.',
    price: 55,
    category: 'arrachera-pechuga',
    portion: '100g',
    stamp: 'CALIDAD PRIME ¡100!',
    image: fotoArrachera,
    featured: true,
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'orden-arrachera-queso',
    name: 'Orden Arrachera con Queso',
    description: 'Arrachera prime marinada gratinada con abundante queso fundido.',
    price: 110,
    category: 'arrachera-pechuga',
    portion: 'Orden',
    stamp: 'CALIDAD PRIME ¡100!',
    image: fotoArrachera,
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-pechuga',
    name: 'Taco de Pechuga',
    description: 'Pechuga marinada a la plancha, suave y jugosa.',
    price: 30,
    category: 'arrachera-pechuga',
    portion: '60g',
    image: '',
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-pechuga-campechano',
    name: 'Taco Campechano de Pechuga',
    description: 'Pechuga asada combinada con longaniza almendrada.',
    price: 30,
    category: 'arrachera-pechuga',
    portion: '60g',
    image: '',
    canCustomize: true,
    customType: 'taco',
  },

  // ── PÁGINA 2: GRINGAS (100g) ──
  {
    id: 'gringa-pastor',
    name: 'Gringa de Pastor',
    description: 'Tortilla de harina con queso fundido y carne al pastor con piña.',
    price: 75,
    category: 'gringas',
    portion: '100g',
    image: fotoGringa,
    canCustomize: true,
    customType: 'gringa',
  },
  {
    id: 'gringa-suadero',
    name: 'Gringa de Suadero',
    description: 'Suadero al jugo de carne con queso fundido en tortilla de harina.',
    price: 75,
    category: 'gringas',
    portion: '100g',
    image: fotoGringa,
    canCustomize: true,
    customType: 'gringa',
  },
  {
    id: 'gringa-bistec',
    name: 'Gringa de Bistec',
    description: 'Bistec centro marinado con queso fundido.',
    price: 85,
    category: 'gringas',
    portion: '100g',
    image: fotoGringa,
    canCustomize: true,
    customType: 'gringa',
  },
  {
    id: 'gringa-cecina',
    name: 'Gringa de Cecina de Yecapixtla',
    description: 'Cecina auténtica de Yecapixtla con queso derretido.',
    price: 110,
    category: 'gringas',
    portion: '100g',
    stamp: 'YECAPIXTLA ¡100!',
    image: fotoGringa,
    canCustomize: true,
    customType: 'gringa',
  },
  {
    id: 'gringa-enchilada',
    name: 'Gringa de Cecina Enchilada',
    description: 'Cecina adobada y queso fundido en tortilla de harina.',
    price: 80,
    category: 'gringas',
    portion: '100g',
    image: fotoGringa,
    canCustomize: true,
    customType: 'gringa',
  },
  {
    id: 'gringa-arrachera',
    name: 'Gringa de Arrachera Prime',
    description: 'Arrachera prime marinada y queso derretido en tortilla de harina.',
    price: 100,
    category: 'gringas',
    portion: '100g',
    stamp: 'CALIDAD PRIME ¡100!',
    image: fotoGringa,
    canCustomize: true,
    customType: 'gringa',
  },
  {
    id: 'gringa-longaniza',
    name: 'Gringa de Longaniza Almendrada',
    description: 'Longaniza almendrada dorada con queso derretido.',
    price: 75,
    category: 'gringas',
    portion: '100g',
    image: fotoGringa,
    canCustomize: true,
    customType: 'gringa',
  },
  {
    id: 'gringa-pechuga',
    name: 'Gringa de Pechuga',
    description: 'Pechuga a la plancha con queso en tortilla de harina.',
    price: 70,
    category: 'gringas',
    portion: '100g',
    image: fotoGringa,
    canCustomize: true,
    customType: 'gringa',
  },

  // ── PÁGINA 2: COSTRAS (120g) ──
  {
    id: 'costra-pastor',
    name: 'Costra de Pastor',
    description: 'Queso dorado crujiente a la plancha relleno de carne al pastor.',
    price: 80,
    category: 'costras',
    portion: '120g',
    image: '',
    canCustomize: true,
    customType: 'costra',
  },
  {
    id: 'costra-suadero',
    name: 'Costra de Suadero',
    description: 'Manto de queso tostado crujiente con suadero al jugo.',
    price: 80,
    category: 'costras',
    portion: '120g',
    image: '',
    canCustomize: true,
    customType: 'costra',
  },
  {
    id: 'costra-bistec',
    name: 'Costra de Bistec',
    description: 'Queso dorado al comal con bistec jugoso.',
    price: 90,
    category: 'costras',
    portion: '120g',
    image: '',
    canCustomize: true,
    customType: 'costra',
  },
  {
    id: 'costra-cecina',
    name: 'Costra de Cecina de Yecapixtla',
    description: 'Costra de queso crujiente con cecina 100% de Yecapixtla.',
    price: 120,
    category: 'costras',
    portion: '120g',
    stamp: 'YECAPIXTLA ¡100!',
    image: '',
    canCustomize: true,
    customType: 'costra',
  },
  {
    id: 'costra-enchilada',
    name: 'Costra de Cecina Enchilada',
    description: 'Queso dorado crujiente con cecina adobada.',
    price: 85,
    category: 'costras',
    portion: '120g',
    image: '',
    canCustomize: true,
    customType: 'costra',
  },
  {
    id: 'costra-arrachera',
    name: 'Costra de Arrachera Prime',
    description: 'Queso dorado con arrachera prime jugosa.',
    price: 110,
    category: 'costras',
    portion: '120g',
    stamp: 'CALIDAD PRIME ¡100!',
    image: '',
    canCustomize: true,
    customType: 'costra',
  },
  {
    id: 'costra-longaniza',
    name: 'Costra de Longaniza Almendrada',
    description: 'Costra de queso dorado con longaniza almendrada.',
    price: 75,
    category: 'costras',
    portion: '120g',
    image: '',
    canCustomize: true,
    customType: 'costra',
  },
  {
    id: 'costra-pechuga',
    name: 'Costra de Pechuga',
    description: 'Queso dorado al comal con pechuga asada.',
    price: 75,
    category: 'costras',
    portion: '120g',
    image: '',
    canCustomize: true,
    customType: 'costra',
  },

  // ── PÁGINA 2: BURRITOS (Gran Porción 200g) ──
  {
    id: 'burrito-pastor',
    name: 'Burrito de Pastor',
    description: 'Gran porción de 200g en tortilla de harina con abundante queso y pastor.',
    price: 110,
    category: 'burritos',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoBurrito,
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-suadero',
    name: 'Burrito de Suadero',
    description: '200g de suadero en jugo de carne con queso fundido.',
    price: 115,
    category: 'burritos',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoBurrito,
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-bistec',
    name: 'Burrito de Bistec',
    description: 'Bistec centro de res y queso fundido en tortilla norteña.',
    price: 130,
    category: 'burritos',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoBurrito,
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-cecina',
    name: 'Burrito de Cecina de Yecapixtla',
    description: 'Auténtica cecina de Yecapixtla con queso fundido.',
    price: 190,
    category: 'burritos',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoBurrito,
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-enchilada',
    name: 'Burrito de Cecina Enchilada',
    description: 'Cecina enchilada adobada y queso en tortilla norteña.',
    price: 130,
    category: 'burritos',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoBurrito,
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-arrachera',
    name: 'Burrito de Arrachera Prime',
    description: 'Arrachera prime importada y queso fundido.',
    price: 160,
    category: 'burritos',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoBurrito,
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-longaniza',
    name: 'Burrito de Longaniza Almendrada',
    description: 'Longaniza almendrada dorada y queso fundido.',
    price: 100,
    category: 'burritos',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoBurrito,
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-pechuga',
    name: 'Burrito de Pechuga',
    description: 'Pechuga marinada a la plancha con queso fundido.',
    price: 100,
    category: 'burritos',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoBurrito,
    canCustomize: true,
    customType: 'burrito',
  },

  // ── PÁGINA 3: ALAMBRES (200g con tocino, pimiento, cebolla, queso y tortillas de harina y maíz) ──
  {
    id: 'alambre-suadero',
    name: 'Alambre de Suadero',
    description: '200 Gramos de carne, pimiento morrón, queso, tocino, cebolla y tortillas de harina y maíz.',
    price: 160,
    category: 'alambres',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoAlambre,
    featured: true,
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-pastor',
    name: 'Alambre de Pastor',
    description: '200g de carne al pastor, morrón, queso, tocino, cebolla y tortillas.',
    price: 150,
    category: 'alambres',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoAlambre,
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-bistec',
    name: 'Alambre de Bistec',
    description: '200g de bistec centro, morrón, queso, tocino, cebolla y tortillas.',
    price: 175,
    category: 'alambres',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoAlambre,
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-cecina',
    name: 'Alambre de Cecina de Yecapixtla',
    description: '200g de cecina de Yecapixtla, morrón, queso, tocino, cebolla y tortillas.',
    price: 210,
    category: 'alambres',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoAlambre,
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-enchilada',
    name: 'Alambre de Cecina Enchilada',
    description: '200g de cecina enchilada, morrón, queso, tocino, cebolla y tortillas.',
    price: 190,
    category: 'alambres',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoAlambre,
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-arrachera',
    name: 'Alambre de Arrachera Prime',
    description: '200g de arrachera prime, morrón, queso, tocino, cebolla y tortillas.',
    price: 200,
    category: 'alambres',
    portion: '200g',
    stamp: 'CALIDAD PRIME ¡100!',
    image: fotoAlambre,
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-longaniza',
    name: 'Alambre de Longaniza Almendrada',
    description: '200g de longaniza almendrada, morrón, queso, tocino, cebolla y tortillas.',
    price: 140,
    category: 'alambres',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoAlambre,
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-pechuga',
    name: 'Alambre de Pechuga',
    description: '200g de pechuga, pimiento morrón, queso, tocino, cebolla y tortillas.',
    price: 150,
    category: 'alambres',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoAlambre,
    canCustomize: true,
    customType: 'alambre',
  },

  // ── PÁGINA 3: RAMEN CON SUADERO ──
  {
    id: 'ramen-suadero',
    name: 'Ramen con Suadero',
    description: 'Disfruta de este manjar: 200 gr de suadero, ramen sazonado en jugo de carne del paisa y queso chihuahua, ¡una delicia!',
    price: 110,
    category: 'especialidades',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoRamen,
    featured: true,
    canCustomize: true,
    customType: 'ramen',
  },
  {
    id: 'ramen-suadero-queso',
    name: 'Ramen Suadero c/Queso Extra',
    description: '200g de suadero en caldo sazonado con doble queso chihuahua fundido.',
    price: 140,
    category: 'especialidades',
    portion: '200g',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoRamen,
    canCustomize: true,
    customType: 'ramen',
  },

  // ── PÁGINA 3: CHICHARRÓN DE QUESO & QUESO FUNDIDO ──
  {
    id: 'chicharron-queso-jumbo',
    name: 'Chicharrón de Queso Jumbo',
    description: 'Gran porción crujiente de queso dorado al comal con limones y salsas.',
    price: 80,
    category: 'especialidades',
    portion: 'Jumbo',
    stamp: 'GRAN PORCIÓN ¡100!',
    image: fotoChicharron,
    canCustomize: true,
    customType: 'queso',
  },
  {
    id: 'chicharron-queso-mediano',
    name: 'Chicharrón de Queso Mediano',
    description: 'Rollo de queso dorado crujiente para botanear.',
    price: 60,
    category: 'especialidades',
    portion: 'Mediano',
    image: fotoChicharron,
    canCustomize: true,
    customType: 'queso',
  },
  {
    id: 'queso-fundido-chistorra',
    name: 'Queso Fundido Chistorra',
    description: 'Cazuela de queso fundido con chistorra dorada y tortillas calientes.',
    price: 75,
    category: 'especialidades',
    portion: 'Cazuela',
    image: fotoQuesoFundido,
    canCustomize: true,
    customType: 'queso',
  },
  {
    id: 'queso-fundido-longaniza',
    name: 'Queso Fundido Longaniza',
    description: 'Queso fundido con longaniza almendrada.',
    price: 75,
    category: 'especialidades',
    portion: 'Cazuela',
    image: fotoQuesoFundido,
    canCustomize: true,
    customType: 'queso',
  },
  {
    id: 'queso-fundido-champinones',
    name: 'Queso Fundido Champiñones',
    description: 'Queso fundido con champiñones frescos salteados.',
    price: 70,
    category: 'especialidades',
    portion: 'Cazuela',
    image: fotoQuesoFundido,
    canCustomize: true,
    customType: 'queso',
  },
  {
    id: 'queso-fundido-long-champ',
    name: 'Queso Fundido Longaniza Champ.',
    description: 'Queso fundido mixto con longaniza almendrada y champiñones.',
    price: 75,
    category: 'especialidades',
    portion: 'Cazuela',
    image: fotoQuesoFundido,
    canCustomize: true,
    customType: 'queso',
  },

  // ── PÁGINA 3: GORDITAS ──
  {
    id: 'gordita-suadero',
    name: 'Gordita de Suadero',
    description: 'Gordita de maíz al comal rellena de suadero confitado al jugo.',
    price: 50,
    category: 'gorditas',
    portion: 'Pieza',
    image: '',
    canCustomize: true,
    customType: 'gordita',
  },
  {
    id: 'gordita-bistec',
    name: 'Gordita de Bistec',
    description: 'Gordita de maíz rellena de bistec centro.',
    price: 60,
    category: 'gorditas',
    portion: 'Pieza',
    image: '',
    canCustomize: true,
    customType: 'gordita',
  },
  {
    id: 'gordita-cecina',
    name: 'Gordita de Cecina de Yecapixtla',
    description: 'Rellena de auténtica cecina de Yecapixtla.',
    price: 75,
    category: 'gorditas',
    portion: 'Pieza',
    stamp: 'YECAPIXTLA ¡100!',
    image: '',
    canCustomize: true,
    customType: 'gordita',
  },
  {
    id: 'gordita-enchilada',
    name: 'Gordita de Cecina Enchilada',
    description: 'Gordita rellena de cecina adobada.',
    price: 55,
    category: 'gorditas',
    portion: 'Pieza',
    image: '',
    canCustomize: true,
    customType: 'gordita',
  },
  {
    id: 'gordita-camp-cecina',
    name: 'Gordita Campechana Cecina',
    description: 'Rellena de cecina de Yecapixtla y longaniza almendrada.',
    price: 75,
    category: 'gorditas',
    portion: 'Pieza',
    image: '',
    canCustomize: true,
    customType: 'gordita',
  },
  {
    id: 'gordita-camp-suadero',
    name: 'Gordita Campechana Suadero',
    description: 'Suadero con longaniza almendrada.',
    price: 50,
    category: 'gorditas',
    portion: 'Pieza',
    image: '',
    canCustomize: true,
    customType: 'gordita',
  },
  {
    id: 'gordita-camp-bistec',
    name: 'Gordita Campechana Bistec',
    description: 'Bistec suave y longaniza almendrada.',
    price: 65,
    category: 'gorditas',
    portion: 'Pieza',
    image: '',
    canCustomize: true,
    customType: 'gordita',
  },

  // ── PÁGINA 4: BEBIDAS, CERVEZAS & TEPACHE ──
  {
    id: 'refrescos',
    name: 'Refrescos Surtidos',
    description: 'Bien fríos: Coca-Cola, Sin Azúcar, Mundet, Sprite, Fanta, Boing Mango o Guayaba.',
    price: 25,
    category: 'bebidas',
    portion: '355ml',
    image: fotoCervezas,
    canCustomize: true,
    customType: 'refresco',
  },
  {
    id: 'cerveza-corona',
    name: 'Cerveza Corona',
    description: 'Cerveza clara bien fría con limón y sal.',
    price: 35,
    category: 'bebidas',
    portion: '355ml',
    image: fotoCervezas,
    canCustomize: false,
  },
  {
    id: 'cerveza-victoria',
    name: 'Cerveza Victoria',
    description: 'Cerveza oscura tipo Vienna bien fría.',
    price: 35,
    category: 'bebidas',
    portion: '355ml',
    image: fotoCervezas,
    canCustomize: false,
  },
  {
    id: 'cerveza-pacifico',
    name: 'Cerveza Pacífico',
    description: 'Cerveza clara bien fría de botella.',
    price: 38,
    category: 'bebidas',
    portion: '355ml',
    image: fotoCervezas,
    canCustomize: false,
  },
  {
    id: 'cerveza-modelo-especial',
    name: 'Cerveza Modelo Especial',
    description: 'Cerveza de barril en botella bien helada.',
    price: 40,
    category: 'bebidas',
    portion: '355ml',
    image: fotoCervezas,
    canCustomize: false,
  },
  {
    id: 'cerveza-negra-modelo',
    name: 'Cerveza Negra Modelo',
    description: 'Cerveza tipo Munich bien fría.',
    price: 40,
    category: 'bebidas',
    portion: '355ml',
    image: fotoCervezas,
    canCustomize: false,
  },
  {
    id: 'tepache-medio',
    name: 'Tepache 1/2 Litro',
    description: 'Auténtico tepache artesanal fermentado con piña miel y piloncillo bien frío.',
    price: 25,
    category: 'bebidas',
    portion: '500ml',
    stamp: 'ARTESANAL',
    image: fotoCervezas,
    featured: true,
    canCustomize: false,
  },
  {
    id: 'tepache-litro',
    name: 'Tepache 1 Litro',
    description: 'Litro completo de tepache artesanal de piña bien helado.',
    price: 45,
    category: 'bebidas',
    portion: '1000ml',
    stamp: 'ARTESANAL',
    image: fotoCervezas,
    featured: true,
    canCustomize: false,
  },

  // ── EXTRAS DIRECTOS DE LA CARTA (PÁGINA 1) ──
  {
    id: 'extra-jugo-carne',
    name: 'Jugo de Carne',
    description: 'Consomé caliente y concentrado del suadero de la casa.',
    price: 20,
    category: 'tacos',
    portion: 'Porción',
    image: fotoJugo,
    canCustomize: false,
  },
  {
    id: 'extra-nopal',
    name: 'Nopal Asado',
    description: 'Nopal asado al comal para acompañar tus tacos.',
    price: 17,
    category: 'tacos',
    portion: 'Porción',
    image: '',
    canCustomize: false,
  },
];

export default function ElPaisaDelValleMenu() {
  // ── Estados Principales ──
  const [activeCategory, setActiveCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('elpaisa_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [isSendingOrder, setIsSendingOrder] = useState(false);

  // ── Datos de Entrega ──
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerRef, setCustomerRef] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo');
  const [cashAmount, setCashAmount] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [copiedClabe, setCopiedClabe] = useState(false);

  // ── Modal de Personalización ──
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedSauce, setSelectedSauce] = useState(SALSAS_DISPONIBLES[0].name);
  const [selectedVeggie, setSelectedVeggie] = useState(VERDURA_OPCIONES[0].name);
  const [selectedRefresco, setSelectedRefresco] = useState(REFRESCO_SABORES[0]);
  const [selectedExtras, setSelectedExtras] = useState<CustomOption[]>([]);
  const [itemNotes, setItemNotes] = useState('');

  // ── Feedback y Modales ──
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // ── SEO Dinámico y Título en Pestaña ──
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Taquería El Paisa del Valle | Menú Digital con Pedido por WhatsApp 🌮🔥';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  // ── Persistencia del Carrito ──
  useEffect(() => {
    try {
      localStorage.setItem('elpaisa_cart_v2', JSON.stringify(cart));
    } catch (e) {
      console.error('Error guardando carrito:', e);
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // ── Totales ──
  const cartItemCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0), [cart]);
  const packagingFee = deliveryType === 'delivery' ? 10 : 0;
  const cartTotal = cartSubtotal + packagingFee;

  const changeCalculation = useMemo(() => {
    if (paymentMethod !== 'efectivo' || !cashAmount) return null;
    const paid = parseFloat(cashAmount.replace(/[^0-9.]/g, ''));
    if (isNaN(paid)) return null;
    return paid - cartTotal;
  }, [paymentMethod, cashAmount, cartTotal]);

  // ── Productos Filtrados ──
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        (product.portion && product.portion.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (activeCategory === 'todos') return true;
      return product.category === activeCategory;
    });
  }, [activeCategory, searchQuery]);

  // ── Productos Imperdibles para el Carrusel Superior ──
  const featuredProducts = useMemo(() => PRODUCTS.filter((p) => p.featured), []);

  // ── Abrir Modal de Personalización ──
  const handleOpenCustomize = (product: Product) => {
    setCustomizingProduct(product);
    setSelectedSauce(SALSAS_DISPONIBLES[0].name);
    setSelectedVeggie(VERDURA_OPCIONES[0].name);
    setSelectedRefresco(REFRESCO_SABORES[0]);
    setSelectedExtras([]);
    setItemNotes('');
  };

  // ── Botón "+" en tarjeta ──
  const handleAddToCart = (product: Product) => {
    if (product.canCustomize) {
      handleOpenCustomize(product);
    } else {
      const lineId = `${product.id}-${Date.now()}`;
      const newItem: CartItem = {
        lineId,
        productId: product.id,
        name: product.name,
        basePrice: product.price,
        unitPrice: product.price,
        quantity: 1,
        category: product.category,
        portion: product.portion,
        image: product.image,
      };
      setCart((prev) => [...prev, newItem]);
      showToast(`¡${product.name} agregado!`);
    }
  };

  // ── Confirmar Personalización ──
  const handleConfirmCustomization = () => {
    if (!customizingProduct) return;

    let unitPrice = customizingProduct.price;
    selectedExtras.forEach((ext) => {
      unitPrice += ext.price;
    });

    let displayNotes = itemNotes.trim();
    if (customizingProduct.customType === 'refresco') {
      displayNotes = `Sabor: ${selectedRefresco}${displayNotes ? ` | ${displayNotes}` : ''}`;
    }

    const lineId = `${customizingProduct.id}-${Date.now()}`;
    const newItem: CartItem = {
      lineId,
      productId: customizingProduct.id,
      name: customizingProduct.name,
      basePrice: customizingProduct.price,
      unitPrice,
      quantity: 1,
      category: customizingProduct.category,
      portion: customizingProduct.portion,
      image: customizingProduct.image,
      selectedSauce: customizingProduct.customType === 'refresco' ? undefined : selectedSauce,
      selectedVeggie: ['suadero', 'taco', 'cecina'].includes(customizingProduct.customType || '')
        ? selectedVeggie
        : undefined,
      extras: selectedExtras.length > 0 ? selectedExtras : undefined,
      specialNotes: displayNotes || undefined,
    };

    setCart((prev) => [...prev, newItem]);
    setCustomizingProduct(null);
    showToast(`¡${customizingProduct.name} agregado!`);
  };

  const updateQuantity = (lineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.lineId === lineId) {
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleCopyClabe = () => {
    navigator.clipboard.writeText(bankInfo.clabe);
    setCopiedClabe(true);
    setTimeout(() => setCopiedClabe(false), 2000);
  };

  // ── Checkout WhatsApp (delay 550ms, window.location.href) ──
  const handleSendWhatsAppOrder = () => {
    if (!customerName.trim()) {
      alert('Por favor indica tu nombre.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Por favor indica tu WhatsApp.');
      return;
    }
    if (deliveryType === 'delivery' && !customerAddress.trim()) {
      alert('Por favor indica tu dirección de entrega.');
      return;
    }

    setIsSendingOrder(true);

    let message = `*🌮 ¡NUEVO PEDIDO — TAQUERÍA EL PAISA DEL VALLE!* 🌮\n`;
    message += `_Tag de control: [DEMO El Paisa del Valle]_\n\n`;

    message += `📋 *DETALLE DEL PEDIDO:*\n`;
    cart.forEach((item, idx) => {
      message += `*${idx + 1}. ${item.quantity}x ${item.name}* — $${item.unitPrice * item.quantity}\n`;
      if (item.portion) message += `   • Porción: ${item.portion}\n`;
      if (item.selectedVeggie) message += `   • Preparación: ${item.selectedVeggie}\n`;
      if (item.selectedSauce) message += `   • Salsa: ${item.selectedSauce}\n`;
      if (item.extras && item.extras.length > 0) {
        message += `   • Extras: ${item.extras.map((e) => `${e.name} (+$${e.price})`).join(', ')}\n`;
      }
      if (item.specialNotes) message += `   • Nota: ${item.specialNotes}\n`;
    });

    message += `\n`;
    message += `🛒 *Subtotal:* $${cartSubtotal}\n`;
    if (packagingFee > 0) message += `📦 *Empaque:* $${packagingFee}\n`;
    message += `💰 *TOTAL A PAGAR: $${cartTotal} MXN*\n\n`;

    message += `📍 *DATOS DE ENTREGA:*\n`;
    message += `• *Tipo:* ${deliveryType === 'pickup' ? 'Para Recoger en Sucursal' : 'Envío a Domicilio'}\n`;
    message += `• *Cliente:* ${customerName.trim()}\n`;
    message += `• *WhatsApp:* ${customerPhone.trim()}\n`;

    if (deliveryType === 'delivery') {
      message += `• *Dirección:* ${customerAddress.trim()}\n`;
      if (customerRef.trim()) message += `• *Referencias:* ${customerRef.trim()}\n`;
    }

    message += `• *Pago:* ${paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia BBVA'}\n`;
    if (paymentMethod === 'efectivo' && cashAmount.trim()) {
      const paid = parseFloat(cashAmount.replace(/[^0-9.]/g, ''));
      const change = paid - cartTotal;
      message += `  - Paga con: $${paid} (Cambio: $${change > 0 ? change : 0})\n`;
    }

    if (generalNotes.trim()) {
      message += `\n💬 *Instrucciones:* ${generalNotes.trim()}\n`;
    }

    const waUrl = `https://wa.me/${clientConfig.phonePrimary}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      setIsSendingOrder(false);
      setIsCartOpen(false);
      setCheckoutStep(1);
      window.location.href = waUrl;
    }, 550);
  };

  // ── Categorías para las pestañas ──
  const CATEGORIES: { id: CategoryId; name: string }[] = [
    { id: 'todos', name: 'VER TODO' },
    { id: 'tacos', name: 'TACOS' },
    { id: 'arrachera-pechuga', name: 'ARRACHERA' },
    { id: 'gringas', name: 'GRINGAS' },
    { id: 'costras', name: 'COSTRAS' },
    { id: 'burritos', name: 'BURRITOS' },
    { id: 'alambres', name: 'ALAMBRES' },
    { id: 'especialidades', name: 'RAMEN & QUESO' },
    { id: 'gorditas', name: 'GORDITAS' },
    { id: 'bebidas', name: 'BEBIDAS' },
  ];

  return (
    <div
      className="min-h-screen font-sans text-[#2B1A0E] antialiased selection:bg-[#FF7A00] selection:text-white"
      style={{ backgroundColor: C.bg }}
    >
      {/* Fuente Lilita One para títulos estilo carta física */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap"
      />

      {/* ── Toast de confirmación ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl text-xs font-black tracking-wide text-white bg-[#E8261F] border border-white/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER SUPERIOR CON LOGO Y ESTATUS ── */}
      <header className="sticky top-0 z-40 bg-[#FFF3D1] border-b border-[#F2DFB8] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={paisaLogo}
              alt="Logo El Paisa"
              className="w-10 h-10 object-contain drop-shadow"
            />
            <div>
              <span
                className="text-base sm:text-lg font-black tracking-wide uppercase text-[#E8261F] leading-none block"
                style={{ fontFamily: "'Lilita One', sans-serif" }}
              >
                {clientConfig.shortName}
              </span>
              <p className="text-[11px] text-[#6E5846] flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Abierto hoy · 1:00 PM – 12:00 AM
              </p>
            </div>
          </div>

          {/* Botón Carrito Header */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full font-black text-xs text-white shadow-md transition-all active:scale-95 bg-[#E8261F] hover:bg-[#D0140D]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedido</span>
            {cartItemCount > 0 && (
              <span className="flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-black bg-[#FFE358] text-[#2B1A0E]">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── HERO BANNER: RAYOS AMARILLO/NARANJA Y LOGO GRANDE ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFA726] via-[#FFB74D] to-[#FFF8E7] pt-5 pb-4 text-center border-b border-[#F2DFB8]">
        {/* Fondo limpio con rayos cómics en CSS (sin logo ni botellas de fondo) */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              'repeating-conic-gradient(from 0deg at 50% 38%, #F57C00 0deg 9deg, #FFB300 9deg 18deg)',
            maskImage: 'radial-gradient(circle at 50% 45%, black 45%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 45%, black 45%, transparent 85%)',
          }}
        />

        <div className="relative max-w-xl mx-auto px-4 flex flex-col items-center">
          {/* Logo oficial grande centrado (~200px) */}
          <img
            src={paisaLogo}
            alt="Logo oficial El Paisa del Valle"
            className="w-44 sm:w-56 h-auto object-contain filter drop-shadow-md mb-2"
          />

          {/* Frase oficial de la carta física en blanco con contorno oscuro marcado */}
          <h1
            className="text-[26px] sm:text-4xl text-white tracking-wide uppercase mb-1 leading-tight"
            style={{
              fontFamily: "'Lilita One', cursive",
              textShadow:
                '2px 2px 0 #7A100B, -2px -2px 0 #7A100B, 2px -2px 0 #7A100B, -2px 2px 0 #7A100B, 0 3px 6px rgba(0,0,0,0.45)',
            }}
          >
            Donde hay <span className="text-[#FFE358]">TACOS</span> hay{' '}
            <span className="text-[#FFE358]">ALEGRÍA...</span>
          </h1>

          {/* Descripción corta de una sola línea */}
          <p className="text-xs sm:text-sm text-[#4E3928] font-extrabold max-w-md">
            Suadero estilo Arandas al jugo de carne y cecina 100% de Yecapixtla
          </p>
        </div>
      </section>

      {/* ── BUSCADOR EN VIVO ── */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7662]" />
          <input
            type="text"
            placeholder="Buscar suadero, pastor, cecina, ramen, alambre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 rounded-xl text-sm text-[#2B1A0E] bg-white placeholder-[#8C7662] focus:outline-none focus:ring-2 focus:ring-[#FF7A00] border border-[#F2DFB8] shadow-sm transition-all"
            style={{ fontSize: '16px' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7662] hover:text-[#2B1A0E]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── BARRA STICKY DE CATEGORÍAS ── */}
      <div className="sticky top-[53px] z-30 bg-[#FFF8E7]/95 backdrop-blur-md border-b border-[#F2DFB8] py-2 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-black transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#E8261F] text-white shadow-sm'
                    : 'bg-white text-[#6E5846] hover:bg-[#FFF0CE] border border-[#F2DFB8]'
                }`}
                style={{ fontFamily: "'Lilita One', sans-serif" }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL: CATÁLOGO DE PLATILLOS ── */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-3 space-y-4">
        {/* CARRUSEL SUPERIOR: LOS IMPERDIBLES DEL PAISA (SOLO SI VER TODO O SIN BÚSQUEDA) */}
        {!searchQuery && activeCategory === 'todos' && (
          <div className="pt-0.5 pb-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-white bg-[#E8261F] shadow-sm"
                style={{ fontFamily: "'Lilita One', sans-serif" }}
              >
                LOS IMPERDIBLES DEL PAISA
              </span>
              <span className="text-[10px] text-[#6E5846] font-bold">¡Los favoritos de la casa!</span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar">
              {featuredProducts.map((p) => (
                <div
                  key={`feat-${p.id}`}
                  className="flex-shrink-0 w-36 sm:w-40 bg-white rounded-xl p-2 border border-[#F2DFB8] shadow-sm flex flex-col justify-between"
                >
                  <div className="relative w-full h-20 rounded-lg overflow-hidden mb-1.5 bg-[#FFF3D1] border border-[#F2DFB8] flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#FFF0CE] p-2">
                        <img src={paisaLogo} alt={p.name} className="w-10 h-10 object-contain opacity-75" />
                      </div>
                    )}
                    {p.stamp && (
                      <span className="absolute top-1 left-1 bg-[#FFE358] text-[#D0140D] border border-[#D0140D] font-black uppercase text-[8px] px-1 py-0.2 rounded shadow">
                        {p.stamp}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-[#2B1A0E] line-clamp-1">{p.name}</h4>
                    <p className="text-[9px] text-[#6E5846] line-clamp-1 mb-1">{p.portion}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#F2DFB8]">
                    <span className="text-xs font-black text-[#E8261F]">${p.price}</span>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="px-2 py-0.5 rounded text-[10px] font-black bg-[#E8261F] text-white active:scale-95 flex items-center gap-0.5 shadow-sm"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>Pedir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AGRUPACIÓN POR CATEGORÍA CON PÍLDORA ROJA COMO LA CARTA FÍSICA ── */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-[#F2DFB8]">
            <Utensils className="w-10 h-10 text-[#8C7662] mx-auto mb-2 opacity-50" />
            <h3 className="text-sm font-bold text-[#2B1A0E]">No se encontró ese platillo</h3>
            <p className="text-xs text-[#6E5846] mb-3">Prueba buscando por suadero, pastor, bistec o cecina</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('todos');
              }}
              className="px-4 py-1.5 rounded-full text-xs font-black bg-[#E8261F] text-white"
            >
              Ver Carta Completa
            </button>
          </div>
        ) : (
          (() => {
            // Agrupar los productos por su categoría oficial para replicar los bloques de la carta
            const categoryGroups: { [key in CategoryId]?: Product[] } = {};
            filteredProducts.forEach((prod) => {
              if (!categoryGroups[prod.category]) categoryGroups[prod.category] = [];
              categoryGroups[prod.category]!.push(prod);
            });

            const categoryTitles: { [key in CategoryId]: string } = {
              todos: 'TODOS',
              tacos: 'TACOS',
              'arrachera-pechuga': 'ARRACHERA & PECHUGA',
              gringas: 'GRINGAS - 100g -',
              costras: 'COSTRAS - 120g -',
              burritos: 'BURRITOS - 200g -',
              alambres: 'ALAMBRES - 200g -',
              especialidades: 'RAMEN & QUESO',
              gorditas: 'GORDITAS',
              bebidas: 'BEBIDAS & CERVEZAS',
            };

            return (Object.keys(categoryGroups) as CategoryId[]).map((catKey) => {
              const items = categoryGroups[catKey] || [];
              if (items.length === 0) return null;

              return (
                <div key={catKey} className="space-y-1.5">
                  {/* Píldora roja estilo carta física */}
                  <div className="flex items-center gap-2 pt-1">
                    <span
                      className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-black uppercase text-white tracking-wide shadow-sm"
                      style={{
                        backgroundColor: '#E8261F',
                        fontFamily: "'Lilita One', cursive",
                        letterSpacing: '0.04em',
                      }}
                    >
                      {categoryTitles[catKey]}
                    </span>
                    <span className="text-[10px] text-[#8C7662] font-semibold">
                      ({items.length})
                    </span>
                  </div>

                  {/* LISTA COMPACTA DE FILAS (altura ~74px en móvil) */}
                  <div className="space-y-1.5">
                    {items.map((product) => {
                      const inCart = cart
                        .filter((c) => c.productId === product.id)
                        .reduce((a, b) => a + b.quantity, 0);

                      return (
                        <div
                          key={product.id}
                          className="bg-white rounded-xl py-1.5 px-2.5 sm:py-2 sm:px-3 border border-[#F2DFB8] shadow-sm flex items-center justify-between gap-2.5 hover:border-[#FF7A00] transition-colors"
                        >
                          {/* Izquierda: Foto cuadrada de 64-68px o recuadro de la marca */}
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#FFF3D1] border border-[#F2DFB8] flex items-center justify-center flex-shrink-0">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-1.5 bg-[#FFF0CE]">
                                <img
                                  src={paisaLogo}
                                  alt="El Paisa del Valle"
                                  className="w-9 h-9 sm:w-11 sm:h-11 object-contain opacity-75"
                                />
                              </div>
                            )}
                            {product.portion && (
                              <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white font-bold text-[8px] px-1 py-0.2 rounded">
                                {product.portion}
                              </span>
                            )}
                          </div>

                          {/* Centro: Nombre, sello y descripción corta (2 líneas máx) */}
                          <div className="flex-1 min-w-0 pr-0.5">
                            <div className="flex flex-wrap items-center gap-1 mb-0.5">
                              <h3 className="text-xs sm:text-sm font-black text-[#2B1A0E] leading-tight">
                                {product.name}
                              </h3>
                              {product.stamp && (
                                <span className="bg-[#FFE358] text-[#D0140D] border border-[#D0140D] font-black uppercase text-[8px] px-1 py-0.2 rounded shadow-none">
                                  {product.stamp}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-[#6E5846] leading-tight line-clamp-2">
                              {product.description}
                            </p>
                          </div>

                          {/* Derecha: Precio y Botón circular "+" */}
                          <div className="flex flex-col items-end justify-center flex-shrink-0">
                            <span className="text-xs sm:text-sm font-black text-[#2B1A0E] mb-1">
                              ${product.price}
                            </span>

                            {inCart > 0 ? (
                              <div className="flex items-center gap-1 bg-[#FFF0CE] rounded-full p-0.5 border border-[#F2DFB8]">
                                <button
                                  onClick={() => {
                                    const found = cart.find((i) => i.productId === product.id);
                                    if (found) updateQuantity(found.lineId, -1);
                                  }}
                                  className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#2B1A0E] active:scale-90 font-bold"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-[11px] font-black px-1 min-w-3 text-center">
                                  {inCart}
                                </span>
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="w-5 h-5 rounded-full bg-[#E8261F] flex items-center justify-center text-white active:scale-90 font-bold"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="w-7 h-7 rounded-full bg-[#E8261F] hover:bg-[#D0140D] active:scale-90 text-white flex items-center justify-center shadow transition-all"
                                title="Agregar al pedido"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()
        )}

        {/* ── BLOQUE DE CALIDAD DE SU PÁGINA 5 ── */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-[#FFE358] to-[#FFCA28] border border-[#E8261F]/30 shadow-sm text-center">
          <span
            className="inline-block text-[11px] font-black uppercase text-[#D0140D] tracking-wider mb-1"
            style={{ fontFamily: "'Lilita One', cursive" }}
          >
            COMPROMISO Y TRADICIÓN
          </span>
          <p className="text-[11px] sm:text-xs text-[#2B1A0E] font-medium leading-relaxed max-w-xl mx-auto mb-1.5">
            “En <strong>El Paisa del Valle</strong> tenemos el compromiso de ofrecerte la mejor calidad y nos lo tomamos muy en serio, toda nuestra carne es fresca y usamos los mejores cortes de carne e insumos.”
          </p>
          <p
            className="text-sm sm:text-base font-black text-[#E8261F] uppercase tracking-wide"
            style={{ fontFamily: "'Lilita One', cursive" }}
          >
            Donde hay TACOS hay ALEGRÍA... 💛🌮
          </p>
        </div>
      </main>

      {/* ── FOOTER DE 3 COLUMNAS DEL CLIENTE (LIMPIO, SIN APPS DE DELIVERY) ── */}
      <footer className="mt-8 bg-[#2B1A0E] text-[#F2DFB8] pt-6 pb-20 text-xs border-t border-[#FF7A00]/20">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Columna 1: Marca */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src={paisaLogo} alt="Logo" className="w-8 h-8 object-contain" />
              <span
                className="text-base font-black text-white uppercase"
                style={{ fontFamily: "'Lilita One', sans-serif" }}
              >
                {clientConfig.businessName}
              </span>
            </div>
            <p className="text-[11px] text-[#C4B2A0] leading-relaxed mb-3">
              Suadero estilo Arandas confitado al jugo, auténtica cecina 100% de Yecapixtla Morelos, arrachera prime y tepache tradicional.
            </p>
            <p className="text-[11px] text-[#FFE358] font-bold">Horarios: {clientConfig.hours}</p>
          </div>

          {/* Columna 2: Ubicación */}
          <div>
            <h4
              className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1"
              style={{ fontFamily: "'Lilita One', sans-serif" }}
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF7A00]" />
              Ubicación y Servicio
            </h4>
            <p className="text-[11px] text-[#C4B2A0] mb-2">{clientConfig.address}</p>
            <p className="text-[11px] text-[#FFE358] font-semibold">• Servicio en comedor y para llevar</p>
            <p className="text-[11px] text-[#FFE358] font-semibold">• Pedidos directos a domicilio</p>
          </div>

          {/* Columna 3: Contacto WhatsApp y Privacidad */}
          <div>
            <h4
              className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1"
              style={{ fontFamily: "'Lilita One', sans-serif" }}
            >
              <Phone className="w-3.5 h-3.5 text-[#FF7A00]" />
              Pedidos Directos
            </h4>
            <p className="text-[11px] text-[#C4B2A0] mb-3">
              Haz tu pedido directo en este menú y recíbelo por WhatsApp sin intermediarios ni comisiones:
            </p>
            <a
              href={`https://wa.me/${clientConfig.phonePrimary}?text=Hola,%20quisiera%20hacer%20un%20pedido%20en%20El%20Paisa%20del%20Valle`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-xs text-white bg-[#25D366] hover:bg-[#20BA5A] transition-all mb-3 shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {clientConfig.phonePrimaryFormatted}</span>
            </a>
            <div>
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-[11px] text-[#C4B2A0] hover:text-white underline flex items-center gap-1"
              >
                <Shield className="w-3 h-3 text-[#FFE358]" />
                <span>Aviso de Privacidad (LFPDPPP)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="max-w-4xl mx-auto px-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#8C7662]">
          <p>© 2026 {clientConfig.businessName}. Todos los derechos reservados.</p>
          <p>
            Menú digital interactivo por{' '}
            <a
              href="https://imagineandstamp.site"
              target="_blank"
              rel="noreferrer"
              className="text-[#FF7A00] font-black hover:underline"
            >
              IMAGINE & STAMP
            </a>
          </p>
        </div>
      </footer>

      {/* ── BOTÓN FLOTANTE DEL CARRITO (SAFE-AREA) ── */}
      {cartItemCount > 0 && !isCartOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 p-3 z-40 backdrop-blur-md bg-white/70 border-t border-[#F2DFB8]"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between px-5 py-3 rounded-2xl text-white font-black shadow-lg transition-all active:scale-98 bg-[#E8261F] hover:bg-[#D0140D]"
            >
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FFE358] text-[#2B1A0E] text-xs font-black">
                  {cartItemCount}
                </span>
                <span
                  className="text-sm uppercase tracking-wide"
                  style={{ fontFamily: "'Lilita One', sans-serif" }}
                >
                  Ver Pedido
                </span>
              </div>
              <div className="flex items-center gap-1 text-base font-black">
                <span>${cartTotal} MXN</span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL BOTTOM-SHEET: PERSONALIZACIÓN GASTRONÓMICA ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {customizingProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-[#F2DFB8] shadow-2xl flex flex-col bg-white"
            >
              {/* Header Modal */}
              <div className="sticky top-0 z-10 px-5 py-3.5 border-b border-[#F2DFB8] flex items-center justify-between bg-[#FFF8E7]">
                <div>
                  <span
                    className="text-[11px] font-black uppercase text-[#E8261F]"
                    style={{ fontFamily: "'Lilita One', sans-serif" }}
                  >
                    PERSONALIZA TU PLATILLO
                  </span>
                  <h3 className="text-base font-black text-[#2B1A0E] leading-tight">
                    {customizingProduct.name}
                  </h3>
                </div>
                <button
                  onClick={() => setCustomizingProduct(null)}
                  className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#2B1A0E]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Opciones */}
              <div className="p-4 space-y-4 text-xs">
                {/* 1. Salsas Caseras (Verde, Roja o Aparte) */}
                {customizingProduct.customType !== 'refresco' && (
                  <div>
                    <label
                      className="block text-xs font-black uppercase text-[#E8261F] mb-1.5"
                      style={{ fontFamily: "'Lilita One', sans-serif" }}
                    >
                      1. Salsa de la Casa
                    </label>
                    <div className="space-y-1.5">
                      {SALSAS_DISPONIBLES.map((sauce) => (
                        <button
                          key={sauce.id}
                          type="button"
                          onClick={() => setSelectedSauce(sauce.name)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                            selectedSauce === sauce.name
                              ? 'bg-[#FFF0CE] border-[#FF7A00] text-[#2B1A0E] font-bold'
                              : 'bg-white border-[#F2DFB8] text-[#6E5846]'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-xs">{sauce.name}</p>
                            <p className="text-[10px] text-[#8C7662]">{sauce.desc}</p>
                          </div>
                          {selectedSauce === sauce.name && (
                            <Check className="w-4 h-4 text-[#E8261F]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Verdura y Limón (para tacos) */}
                {['suadero', 'taco', 'cecina'].includes(customizingProduct.customType || '') && (
                  <div>
                    <label
                      className="block text-xs font-black uppercase text-[#E8261F] mb-1.5"
                      style={{ fontFamily: "'Lilita One', sans-serif" }}
                    >
                      2. Verdura y Limón
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {VERDURA_OPCIONES.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedVeggie(opt.name)}
                          className={`p-2 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                            selectedVeggie === opt.name
                              ? 'bg-[#FFF0CE] border-[#FF7A00] text-[#2B1A0E]'
                              : 'bg-white border-[#F2DFB8] text-[#6E5846]'
                          }`}
                        >
                          <span>{opt.name}</span>
                          {selectedVeggie === opt.name && (
                            <Check className="w-3.5 h-3.5 text-[#E8261F]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Selección de Sabor para Refresco */}
                {customizingProduct.customType === 'refresco' && (
                  <div>
                    <label
                      className="block text-xs font-black uppercase text-[#E8261F] mb-1.5"
                      style={{ fontFamily: "'Lilita One', sans-serif" }}
                    >
                      Elige el sabor de tu refresco
                    </label>
                    <select
                      value={selectedRefresco}
                      onChange={(e) => setSelectedRefresco(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#F2DFB8] text-[#2B1A0E] font-bold text-xs"
                      style={{ fontSize: '16px' }}
                    >
                      {REFRESCO_SABORES.map((ref) => (
                        <option key={ref} value={ref}>
                          {ref}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 4. Extras oficiales de su carta (Queso $12 en suadero, $15 en demás, Nopal $17, Jugo $20) */}
                {['suadero', 'taco', 'cecina', 'arrachera-pechuga'].includes(customizingProduct.category) && (
                  <div>
                    <label
                      className="block text-xs font-black uppercase text-[#E8261F] mb-1.5"
                      style={{ fontFamily: "'Lilita One', sans-serif" }}
                    >
                      Extras de la Carta
                    </label>
                    <div className="space-y-1.5">
                      {[
                        // Queso extra $12 en suadero (en su carta física), $15 en los demás
                        {
                          name: 'Queso Extra',
                          price: customizingProduct.customType === 'suadero' ? 12 : 15,
                        },
                        { name: 'Nopal Asado', price: 17 },
                        { name: 'Jugo de Carne', price: 20 },
                      ].map((extra) => {
                        const isSelected = selectedExtras.some((e) => e.name === extra.name);
                        return (
                          <button
                            key={extra.name}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedExtras(selectedExtras.filter((e) => e.name !== extra.name));
                              } else {
                                setSelectedExtras([...selectedExtras, extra]);
                              }
                            }}
                            className={`w-full p-2 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#FFE358]/50 border-[#D0140D] text-[#2B1A0E]'
                                : 'bg-white border-[#F2DFB8] text-[#6E5846]'
                            }`}
                          >
                            <span>{extra.name}</span>
                            <span className="text-[#E8261F] font-black">+${extra.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. Instrucción al taquero */}
                <div>
                  <label className="block text-[11px] font-bold text-[#6E5846] mb-1">
                    Instrucción para taquero o cocina:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. bien dorado, con piña extra, limones..."
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FFF8E7] border border-[#F2DFB8] text-[#2B1A0E] text-xs placeholder-[#8C7662]"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>

              {/* Botón Sticky Inferior */}
              <div className="sticky bottom-0 p-3.5 border-t border-[#F2DFB8] bg-[#FFF8E7]">
                <button
                  onClick={handleConfirmCustomization}
                  className="w-full py-3 rounded-2xl text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2 bg-[#E8261F] hover:bg-[#D0140D] active:scale-98 transition-all"
                  style={{ fontFamily: "'Lilita One', sans-serif" }}
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    Agregar al Pedido • $
                    {customizingProduct.price +
                      selectedExtras.reduce((acc, curr) => acc + curr.price, 0)}{' '}
                    MXN
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── DRAWER DEL CARRITO: 2 PASOS CRO ESTRICTOS ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="w-full max-w-md h-full flex flex-col shadow-2xl bg-[#FFF8E7] border-l border-[#F2DFB8]"
            >
              {/* Header Carrito */}
              <div className="px-5 py-3.5 border-b border-[#F2DFB8] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E8261F] flex items-center justify-center text-white">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3
                      className="text-sm font-black text-[#2B1A0E] uppercase"
                      style={{ fontFamily: "'Lilita One', sans-serif" }}
                    >
                      {checkoutStep === 1 ? 'Tu Pedido' : 'Datos de Entrega'}
                    </h3>
                    <p className="text-[10px] text-[#6E5846]">Paso {checkoutStep} de 2</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#2B1A0E]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* PASO 1: LISTADO DE PRODUCTOS */}
              {checkoutStep === 1 && (
                <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 px-4">
                      <ShoppingBag className="w-12 h-12 text-[#8C7662] mx-auto mb-2 opacity-50" />
                      <h4 className="text-sm font-bold text-[#2B1A0E]">Tu pedido está vacío</h4>
                      <p className="text-xs text-[#6E5846] mb-4">
                        Agrega unos deliciosos tacos de suadero para comenzar.
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="px-4 py-2 rounded-full text-xs font-black bg-[#E8261F] text-white"
                      >
                        Ver Menú
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.lineId}
                        className="p-3 rounded-2xl bg-white border border-[#F2DFB8] shadow-sm space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover bg-[#FFF3D1]"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#FFF0CE] border border-[#F2DFB8] flex items-center justify-center p-1">
                                <img src={paisaLogo} alt="Logo" className="w-6 h-6 object-contain opacity-75" />
                              </div>
                            )}
                            <div>
                              <h4 className="text-xs font-black text-[#2B1A0E] leading-tight">
                                {item.name}
                              </h4>
                              <p className="text-[11px] font-bold text-[#E8261F]">
                                ${item.unitPrice} MXN c/u
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setCart((prev) => prev.filter((i) => i.lineId !== item.lineId))
                            }
                            className="text-[#8C7662] hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Desglose */}
                        {(item.selectedSauce || item.selectedVeggie || item.extras?.length || item.specialNotes) && (
                          <div className="text-[10px] text-[#6E5846] bg-[#FFF8E7] p-1.5 rounded-lg space-y-0.5">
                            {item.selectedSauce && <p>• Salsa: {item.selectedSauce}</p>}
                            {item.selectedVeggie && <p>• Prep: {item.selectedVeggie}</p>}
                            {item.extras && item.extras.length > 0 && (
                              <p>• Extras: {item.extras.map((e) => e.name).join(', ')}</p>
                            )}
                            {item.specialNotes && <p>• Nota: {item.specialNotes}</p>}
                          </div>
                        )}

                        {/* Cantidad y subtotal */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#F2DFB8]">
                          <span className="text-xs font-black text-[#2B1A0E]">
                            ${item.unitPrice * item.quantity}
                          </span>
                          <div className="flex items-center gap-2 bg-[#FFF8E7] p-0.5 rounded-lg border border-[#F2DFB8]">
                            <button
                              onClick={() => updateQuantity(item.lineId, -1)}
                              className="w-5 h-5 rounded bg-white flex items-center justify-center font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black px-1">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.lineId, 1)}
                              className="w-5 h-5 rounded bg-[#E8261F] text-white flex items-center justify-center font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* PASO 2: DATOS DE ENTREGA */}
              {checkoutStep === 2 && (
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                  {/* Modalidad */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-[#E8261F] mb-1">
                      Modalidad de Entrega:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                          deliveryType === 'pickup'
                            ? 'bg-[#FFF0CE] border-[#FF7A00] text-[#2B1A0E]'
                            : 'bg-white border-[#F2DFB8] text-[#6E5846]'
                        }`}
                      >
                        <Store className="w-4 h-4 text-[#FF7A00]" />
                        <span>Para Recoger</span>
                        <span className="text-[9px] text-emerald-600 font-semibold">Sin costo extra</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('delivery')}
                        className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                          deliveryType === 'delivery'
                            ? 'bg-[#FFF0CE] border-[#FF7A00] text-[#2B1A0E]'
                            : 'bg-white border-[#F2DFB8] text-[#6E5846]'
                        }`}
                      >
                        <Bike className="w-4 h-4 text-[#E8261F]" />
                        <span>A Domicilio</span>
                        <span className="text-[9px] text-[#E8261F] font-semibold">Empaque +$10</span>
                      </button>
                    </div>
                  </div>

                  {/* Campos */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#2B1A0E] mb-1">
                        Tu Nombre *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. René González"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border border-[#F2DFB8] text-[#2B1A0E] font-medium"
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#2B1A0E] mb-1">
                        WhatsApp de Contacto *
                      </label>
                      <input
                        type="tel"
                        placeholder="Ej. 55 1234 5678"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border border-[#F2DFB8] text-[#2B1A0E] font-medium"
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    {deliveryType === 'delivery' && (
                      <>
                        <div>
                          <label className="block text-[11px] font-bold text-[#2B1A0E] mb-1">
                            Dirección de Entrega *
                          </label>
                          <input
                            type="text"
                            placeholder="Calle, número y colonia"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white border border-[#F2DFB8] text-[#2B1A0E] font-medium"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#2B1A0E] mb-1">
                            Referencias
                          </label>
                          <input
                            type="text"
                            placeholder="Entre calles, color de portón..."
                            value={customerRef}
                            onChange={(e) => setCustomerRef(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white border border-[#F2DFB8] text-[#2B1A0E] font-medium"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Forma de Pago */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-[#E8261F] mb-1">
                      Forma de Pago:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('efectivo')}
                        className={`p-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'efectivo'
                            ? 'bg-[#FFF0CE] border-[#FF7A00] text-[#2B1A0E]'
                            : 'bg-white border-[#F2DFB8] text-[#6E5846]'
                        }`}
                      >
                        <Wallet className="w-3.5 h-3.5 text-[#FF7A00]" />
                        <span>Efectivo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('transferencia')}
                        className={`p-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'transferencia'
                            ? 'bg-[#FFF0CE] border-[#FF7A00] text-[#2B1A0E]'
                            : 'bg-white border-[#F2DFB8] text-[#6E5846]'
                        }`}
                      >
                        <Landmark className="w-3.5 h-3.5 text-[#E8261F]" />
                        <span>Transferencia</span>
                      </button>
                    </div>

                    {paymentMethod === 'efectivo' && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#F2DFB8] space-y-1.5">
                        <label className="block text-[10px] text-[#6E5846]">
                          ¿Con cuánto pagas? (Para cambio)
                        </label>
                        <input
                          type="text"
                          placeholder={`Ej. $${Math.ceil((cartTotal + 50) / 100) * 100}`}
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          className="w-full p-2 rounded-lg bg-[#FFF8E7] border border-[#F2DFB8] text-[#2B1A0E] font-bold"
                          style={{ fontSize: '16px' }}
                        />
                        {changeCalculation !== null && (
                          <p
                            className={`text-[11px] font-bold ${
                              changeCalculation >= 0 ? 'text-emerald-700' : 'text-red-600'
                            }`}
                          >
                            {changeCalculation >= 0
                              ? `Cambio: $${changeCalculation.toFixed(2)} MXN`
                              : `Faltan $${Math.abs(changeCalculation).toFixed(2)}`}
                          </p>
                        )}
                      </div>
                    )}

                    {paymentMethod === 'transferencia' && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#F2DFB8] space-y-1.5">
                        <p className="text-[10px] text-[#6E5846]">Datos para transferir por BBVA:</p>
                        <div className="p-2 rounded-lg bg-[#FFF8E7] border border-[#F2DFB8] flex items-center justify-between">
                          <div>
                            <p className="text-[9px] text-[#8C7662] uppercase font-bold">BBVA • CLABE</p>
                            <p className="font-mono font-bold text-xs text-[#2B1A0E]">{bankInfo.clabe}</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyClabe}
                            className="px-2 py-1 rounded bg-[#E8261F] text-white font-bold text-[10px] flex items-center gap-1 active:scale-90"
                          >
                            {copiedClabe ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedClabe ? 'Listo' : 'Copiar'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2B1A0E] mb-1">
                      Comentarios adicionales:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. salsas bien empacadas, tocar timbre..."
                      value={generalNotes}
                      onChange={(e) => setGeneralNotes(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white border border-[#F2DFB8] text-[#2B1A0E]"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>
              )}

              {/* Footer Drawer */}
              {cart.length > 0 && (
                <div className="p-3.5 border-t border-[#F2DFB8] bg-white space-y-2.5">
                  <div className="flex justify-between text-xs font-bold text-[#6E5846]">
                    <span>Subtotal:</span>
                    <span>${cartSubtotal} MXN</span>
                  </div>
                  {packagingFee > 0 && (
                    <div className="flex justify-between text-xs text-[#6E5846]">
                      <span>Empaque:</span>
                      <span>${packagingFee} MXN</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-[#2B1A0E] pt-1 border-t border-[#F2DFB8]">
                    <span>Total a Pagar:</span>
                    <span className="text-[#E8261F] text-base">${cartTotal} MXN</span>
                  </div>

                  {checkoutStep === 1 ? (
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full py-3 rounded-2xl text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow flex items-center justify-center gap-1 bg-[#E8261F] hover:bg-[#D0140D] active:scale-98 transition-all"
                      style={{ fontFamily: "'Lilita One', sans-serif" }}
                    >
                      <span>Continuar con Entrega</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCheckoutStep(1)}
                        className="px-3.5 py-2.5 rounded-2xl bg-[#FFF0CE] text-[#2B1A0E] font-bold text-xs"
                      >
                        Volver
                      </button>
                      <button
                        disabled={isSendingOrder}
                        onClick={handleSendWhatsAppOrder}
                        className="flex-1 py-3 rounded-2xl text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20BA5A] active:scale-98 transition-all disabled:opacity-50"
                        style={{ fontFamily: "'Lilita One', sans-serif" }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{isSendingOrder ? 'Generando...' : 'Confirmar Pedido WhatsApp'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: AVISO DE PRIVACIDAD LFPDPPP ── */}
      <AnimatePresence>
        {isPrivacyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl p-5 border border-[#F2DFB8] shadow-2xl text-xs space-y-2.5 bg-white"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#F2DFB8]">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#E8261F]" />
                  <h3 className="text-xs font-black text-[#2B1A0E] uppercase">Aviso de Privacidad</h3>
                </div>
                <button
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 text-[#6E5846] leading-relaxed text-[11px]">
                <p>
                  En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong>, <strong>{clientConfig.businessName}</strong> informa que los datos personales solicitados (nombre, número telefónico y dirección para entregas a domicilio) son utilizados exclusivamente para la gestión, preparación, entrega y cobro de su pedido gastronómico.
                </p>
                <p>
                  Sus datos personales no son compartidos, vendidos ni transferidos a terceras partes. Este menú digital procesa los pedidos directamente hacia el canal oficial de WhatsApp del restaurante sin almacenar información financiera sensible como números de tarjetas de crédito o débito.
                </p>
              </div>

              <div className="pt-2 border-t border-[#F2DFB8] text-right">
                <button
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="px-4 py-1.5 rounded-full bg-[#E8261F] text-white font-bold text-xs"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
