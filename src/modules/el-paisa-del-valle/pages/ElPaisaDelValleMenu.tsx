// ═══════════════════════════════════════════════════════════════════════════
// TAQUERÍA EL PAISA DEL VALLE — Menú Digital Interactivo de Alta Conversión
// Estándar Imagine & Stamp: Carrito 2 Pasos, WhatsApp Checkout Directo,
// Modales Bottom-Sheet, Filtro por Categorías, Buscador en Vivo y Footer 3 Cols.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, X, ShoppingBag, Flame, Sparkles,
  Phone, MapPin, Clock, MessageCircle, ArrowUp, Shield,
  Copy, Check, Trash2, Landmark, Wallet, Store, Bike,
  Heart, CheckCircle2, ChevronRight, ChevronLeft, Utensils,
  Share2, AlertCircle, Info, Star, Edit3, Award, ExternalLink
} from 'lucide-react';
import { clientConfig, bankInfo } from '../config';
import paisaLogo from '../assets/logo.png';
import paisaHeroCover from '../assets/hero-cover.jpg';
import manifiestoImg from '../assets/manifiesto.jpg';

const C = clientConfig.colors;

// ── Tipos de Categorías ──
type CategoryId =
  | 'todos'
  | 'favoritos'
  | 'tacos'
  | 'gringas-costras'
  | 'burritos-alambres'
  | 'especialidades'
  | 'bebidas';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  portion?: string;
  badge?: string;
  featured?: boolean;
  isPopular?: boolean;
  canCustomize?: boolean;
  customType?: 'taco' | 'cecina' | 'gringa_costra' | 'burrito' | 'alambre' | 'ramen' | 'queso_fundido' | 'gordita' | 'cerveza' | 'refresco';
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
  selectedSauce?: string;
  selectedTortilla?: string;
  selectedVeggie?: string;
  extras?: CustomOption[];
  specialNotes?: string;
}

// ── Opciones de personalización gastronómica ──
const SALSAS_DISPONIBLES = [
  { id: 'verde', name: 'Salsa Verde Taquera 🥑', desc: 'Cremosa y con toque acidito de tomatillo' },
  { id: 'roja_arbol', name: 'Salsa Roja de Chile de Árbol 🌶️🔥', desc: 'Tostada al comal, picor sabroso' },
  { id: 'habanero', name: 'Salsa de Habanero Especial 🫑💥', desc: 'Para los valientes, gran aroma y fuego' },
  { id: 'sin_salsa', name: 'Sin Salsa (Salsas Aparte) 🥣', desc: 'Te mandamos recipientes para preparar al gusto' },
];

const VERDURA_OPCIONES = [
  { id: 'con_todo', name: 'Con Todo (Cilantro y Cebolla picadita) 🌿' },
  { id: 'sin_cebolla', name: 'Solo Cilantro (Sin Cebolla) 🚫🧅' },
  { id: 'sin_cilantro', name: 'Solo Cebolla (Sin Cilantro) 🚫🌿' },
  { id: 'sin_verdura', name: 'Sin Verdura (Carne Pura) 🥩' },
  { id: 'verdura_aparte', name: 'Verdura y Limones Aparte 🍋' },
];

const TORTILLAS_OPCIONES = [
  { id: 'maiz', name: 'Tortilla de Maíz Nixtamalizado 🌽' },
  { id: 'harina', name: 'Tortilla de Harina Norteña 🌾' },
];

// ── CATÁLOGO COMPLETO DE PRODUCTOS (CARTA OFICIAL EL PAISA DEL VALLE) ──
const PRODUCTS: Product[] = [
  // ── SECCIÓN: TACOS TRADICIONALES & ESPECIALES ──
  {
    id: 'taco-suadero',
    name: 'Taco de Suadero Especial',
    description: '¡La especialidad estrella del Paisa! Delicioso suadero estilo Arandas, preparado y confitado lentamente en jugo de carne con la receta secreta de la casa.',
    price: 30,
    category: 'tacos',
    portion: '60g',
    badge: '👑 Especialidad del Paisa',
    featured: true,
    isPopular: true,
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-suadero-campechano',
    name: 'Taco Campechano de Suadero',
    description: 'El balance perfecto: suave suadero confitado en su jugo con longaniza almendrada frita al momento.',
    price: 30,
    category: 'tacos',
    portion: '60g',
    badge: '🔥 Muy Pedido',
    featured: true,
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-bistec',
    name: 'Taco de Bistec Centro',
    description: '¡Solo la mejor calidad! Jugoso bistec centro de res de primera, marinado al comal con la receta de la casa.',
    price: 32,
    category: 'tacos',
    portion: '60g',
    badge: '🥩 100% Calidad',
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-bistec-campechano',
    name: 'Taco Campechano de Bistec',
    description: 'Bistec de res jugoso combinado con longaniza almendrada doradita.',
    price: 32,
    category: 'tacos',
    portion: '60g',
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-pastor-pieza',
    name: 'Taco al Pastor Tradicional',
    description: '¡Prueba nuestra receta secreta! Carne de cerdo marinada al achiote, cocida al trompo con rebanada de piña miel fresca.',
    price: 20,
    category: 'tacos',
    portion: '40g',
    badge: '🍍 Trompo Tradicional',
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'orden-3-pastor',
    name: 'Orden de 3 Tacos al Pastor',
    description: 'Trío de tacos al pastor con piña, cilantro y cebolla picadita. ¡La combinación ganadora y con precio especial de ahorro!',
    price: 55,
    category: 'tacos',
    portion: 'Orden 3 pzas',
    badge: '⭐ Ahorro Favorito',
    featured: true,
    isPopular: true,
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-cecina-yeca',
    name: 'Taco de Cecina de Yecapixtla',
    description: '¡100% de Yecapixtla Morelos! Traída directamente de la capital mundial de la cecina. Carne suave, curada artesanalmente.',
    price: 45,
    category: 'tacos',
    portion: '60g',
    badge: '🇲🇽 100% Yecapixtla',
    featured: true,
    isPopular: true,
    canCustomize: true,
    customType: 'cecina',
  },
  {
    id: 'taco-campechano-cecina',
    name: 'Taco Campechano Cecina & Longaniza',
    description: 'Cecina auténtica de Yecapixtla combinada con longaniza almendrada artesanal.',
    price: 45,
    category: 'tacos',
    portion: '60g',
    badge: '🔥 Recomendado',
    canCustomize: true,
    customType: 'cecina',
  },
  {
    id: 'taco-cecina-enchilada',
    name: 'Taco de Cecina Enchilada',
    description: 'Cecina adobada con chiles secos aromáticos, tierna y con el punto exacto de sabor tradicional.',
    price: 35,
    category: 'tacos',
    portion: '60g',
    canCustomize: true,
    customType: 'cecina',
  },
  {
    id: 'taco-campechano-enchilada',
    name: 'Taco Campechano Enchilada',
    description: 'Cecina enchilada tierna acompañada de longaniza almendrada dorada.',
    price: 35,
    category: 'tacos',
    portion: '60g',
    canCustomize: true,
    customType: 'cecina',
  },
  {
    id: 'taco-yeca-especial',
    name: 'Taco YECA Especial (Aguacate & Nopales)',
    description: '¡Manjar supremo! Cecina de Yecapixtla sobre comal, acompañada de generosas rebanadas de aguacate fresco y nopales asados.',
    price: 55,
    category: 'tacos',
    portion: '60g + Extras',
    badge: '🥑 Manjar de la Casa',
    featured: true,
    canCustomize: true,
    customType: 'cecina',
  },
  {
    id: 'taco-yeca-camp-especial',
    name: 'Taco YECA Campechano Especial',
    description: 'Cecina de Yecapixtla, longaniza almendrada, rebanadas de aguacate cremoso y nopales asados.',
    price: 55,
    category: 'tacos',
    portion: '60g + Extras',
    badge: '👑 De la Casa',
    canCustomize: true,
    customType: 'cecina',
  },
  {
    id: 'taco-longaniza',
    name: 'Taco de Longaniza Almendrada',
    description: 'Deliciosa longaniza con toque de almendra molida y especias finas dorada a la plancha.',
    price: 28,
    category: 'tacos',
    portion: '60g',
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-arrachera-prime',
    name: 'Taco de Arrachera Prime (100g)',
    description: '¡Calidad Prime 100%! Jugosa y exquisita arrachera prime de importación en nuestro marinado especial al carbón.',
    price: 55,
    category: 'tacos',
    portion: '100g',
    badge: '🥩 Calidad Prime 100%',
    featured: true,
    isPopular: true,
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'orden-arrachera-queso',
    name: 'Orden de Arrachera Prime con Queso',
    description: 'Porción generosa de arrachera prime gratinada con abundante queso derretido y tortillas calientitas.',
    price: 110,
    category: 'tacos',
    portion: 'Orden Doble',
    badge: '🧀 Gratinada',
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-pechuga',
    name: 'Taco de Pechuga Asada',
    description: 'Tierna pechuga de pollo marinada a las hierbas y asada a la plancha sin grasa.',
    price: 30,
    category: 'tacos',
    portion: '60g',
    canCustomize: true,
    customType: 'taco',
  },
  {
    id: 'taco-pechuga-campechana',
    name: 'Taco Campechano de Pechuga',
    description: 'Pechuga asada ligera combinada con longaniza almendrada doradita.',
    price: 30,
    category: 'tacos',
    portion: '60g',
    canCustomize: true,
    customType: 'taco',
  },

  // ── SECCIÓN: GRINGAS (100g) ──
  {
    id: 'gringa-pastor',
    name: 'Gringa de Pastor (100g)',
    description: 'En doble tortilla de harina tostada, abundante queso gouda/manchego fundido y pastor recién rebanado con piña.',
    price: 75,
    category: 'gringas-costras',
    portion: '100g',
    badge: '🧀 Clásica Querida',
    featured: true,
    isPopular: true,
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'gringa-suadero',
    name: 'Gringa de Suadero (100g)',
    description: 'Suadero confitado estilo Arandas con queso derretido en tortilla de harina doradita.',
    price: 75,
    category: 'gringas-costras',
    portion: '100g',
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'gringa-bistec',
    name: 'Gringa de Bistec (100g)',
    description: 'Bistec centro marinado con queso gratinado en tortilla de harina.',
    price: 85,
    category: 'gringas-costras',
    portion: '100g',
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'gringa-cecina',
    name: 'Gringa de Cecina de Yecapixtla (100g)',
    description: 'Auténtica cecina de Yecapixtla y queso fundido elástico en tortilla de harina.',
    price: 110,
    category: 'gringas-costras',
    portion: '100g',
    badge: '🇲🇽 Yecapixtla',
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'gringa-cecina-enchilada',
    name: 'Gringa de Cecina Enchilada (100g)',
    description: 'Cecina enchilada y queso derretido en tortilla de harina dorada a la plancha.',
    price: 80,
    category: 'gringas-costras',
    portion: '100g',
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'gringa-arrachera',
    name: 'Gringa de Arrachera Prime (100g)',
    description: 'Arrachera prime marinada de importación con costra y queso fundido.',
    price: 100,
    category: 'gringas-costras',
    portion: '100g',
    badge: '🥩 Prime',
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'gringa-longaniza',
    name: 'Gringa de Longaniza Almendrada (100g)',
    description: 'Longaniza con almendra y queso manchego fundido en tortilla de harina.',
    price: 75,
    category: 'gringas-costras',
    portion: '100g',
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'gringa-pechuga',
    name: 'Gringa de Pechuga Asada (100g)',
    description: 'Pechuga tierna a la plancha con queso fundido en tortilla de harina doradita.',
    price: 70,
    category: 'gringas-costras',
    portion: '100g',
    canCustomize: true,
    customType: 'gringa_costra',
  },

  // ── SECCIÓN: COSTRAS DE QUESO (120g) ──
  {
    id: 'costra-pastor',
    name: 'Costra de Pastor (120g)',
    description: 'Manto de queso dorado crujiente a la plancha envolviendo carne al pastor jugosa con piña.',
    price: 80,
    category: 'gringas-costras',
    portion: '120g',
    badge: '🔥 100% Queso Dorado',
    featured: true,
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'costra-suadero',
    name: 'Costra de Suadero (120g)',
    description: 'Exquisita costra de queso tostado rellena de suadero estilo Arandas con su jugo de carne.',
    price: 80,
    category: 'gringas-costras',
    portion: '120g',
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'costra-bistec',
    name: 'Costra de Bistec (120g)',
    description: 'Queso dorado crujiente relleno de bistec centro jugoso.',
    price: 90,
    category: 'gringas-costras',
    portion: '120g',
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'costra-cecina',
    name: 'Costra de Cecina de Yecapixtla (120g)',
    description: 'Elaborada con cecina premium de Yecapixtla abrazada por costra de queso crujiente.',
    price: 120,
    category: 'gringas-costras',
    portion: '120g',
    badge: '⭐ Gran Sabor',
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'costra-arrachera',
    name: 'Costra de Arrachera Prime (120g)',
    description: 'Arrachera prime jugosa envuelta en queso dorado al comal con tortillas calientes.',
    price: 110,
    category: 'gringas-costras',
    portion: '120g',
    badge: '🥩 Prime',
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'costra-cecina-enchilada',
    name: 'Costra de Cecina Enchilada (120g)',
    description: 'Cecina adobada envuelta en queso dorado crujiente.',
    price: 85,
    category: 'gringas-costras',
    portion: '120g',
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'costra-longaniza',
    name: 'Costra de Longaniza Almendrada (120g)',
    description: 'Costra de queso dorado con longaniza almendrada frita.',
    price: 75,
    category: 'gringas-costras',
    portion: '120g',
    canCustomize: true,
    customType: 'gringa_costra',
  },
  {
    id: 'costra-pechuga',
    name: 'Costra de Pechuga (120g)',
    description: 'Pechuga marinada dentro de costra dorada de queso derretido.',
    price: 75,
    category: 'gringas-costras',
    portion: '120g',
    canCustomize: true,
    customType: 'gringa_costra',
  },

  // ── SECCIÓN: BURRITOS (Gran Porción 200g) ──
  {
    id: 'burrito-pastor',
    name: 'Burrito de Pastor Gigante (200g)',
    description: 'Gran porción de 200g en tortilla gigante de harina, con frijoles refritos caseros, queso derretido y pastor con piña.',
    price: 110,
    category: 'burritos-alambres',
    portion: '200g',
    badge: '🌯 Gran Porción',
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-suadero',
    name: 'Burrito de Suadero Gigante (200g)',
    description: '200g de suadero confitado en jugo de carne, frijolitos, queso fundido y enrollado a la plancha.',
    price: 115,
    category: 'burritos-alambres',
    portion: '200g',
    badge: '👑 De la Casa',
    featured: true,
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-bistec',
    name: 'Burrito de Bistec (200g)',
    description: 'Bistec centro de res, frijoles refritos, queso y aguacate en tortilla norteña.',
    price: 130,
    category: 'burritos-alambres',
    portion: '200g',
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-cecina',
    name: 'Burrito de Cecina de Yecapixtla (200g)',
    description: 'Generosa porción de cecina auténtica de Yecapixtla con frijoles y queso fundido.',
    price: 190,
    category: 'burritos-alambres',
    portion: '200g',
    badge: '🇲🇽 Yecapixtla',
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-cecina-enchilada',
    name: 'Burrito de Cecina Enchilada (200g)',
    description: '200g de cecina enchilada adobada, queso derretido y frijolitos en tortilla gigante.',
    price: 130,
    category: 'burritos-alambres',
    portion: '200g',
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-arrachera',
    name: 'Burrito de Arrachera Prime (200g)',
    description: 'Arrachera prime importada, frijoles caseros y abundante queso fundido.',
    price: 160,
    category: 'burritos-alambres',
    portion: '200g',
    badge: '🥩 Prime',
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-longaniza',
    name: 'Burrito de Longaniza Almendrada (200g)',
    description: 'Longaniza almendrada, frijoles refritos y queso fundido enrollado.',
    price: 100,
    category: 'burritos-alambres',
    portion: '200g',
    canCustomize: true,
    customType: 'burrito',
  },
  {
    id: 'burrito-pechuga',
    name: 'Burrito de Pechuga Asada (200g)',
    description: 'Pechuga marinada a la plancha con frijoles y queso derretido.',
    price: 100,
    category: 'burritos-alambres',
    portion: '200g',
    canCustomize: true,
    customType: 'burrito',
  },

  // ── SECCIÓN: ALAMBRES (Gran Porción 200g con Tocino, Morrón, Cebolla y Queso) ──
  {
    id: 'alambre-suadero',
    name: 'Alambre de Suadero al Jugo (200g)',
    description: '200g de suadero bañado en jugo de carne, pimiento morrón, queso fundido, tocino crocante, cebolla asada y orden de tortillas de harina y maíz.',
    price: 160,
    category: 'burritos-alambres',
    portion: '200g + Tortillas',
    badge: '🔥 El Rey del Comal',
    featured: true,
    isPopular: true,
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-pastor',
    name: 'Alambre de Pastor con Piña (200g)',
    description: '200g de carne al pastor, pimiento morrón, tocino, cebolla, abundante queso fundido, piña y tortillas.',
    price: 150,
    category: 'burritos-alambres',
    portion: '200g + Tortillas',
    badge: '🍍 Con Piña',
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-bistec',
    name: 'Alambre de Bistec Centro (200g)',
    description: '200g de bistec suave, tocino, morrón dulce, cebolla asada y capa gruesa de queso gratinado.',
    price: 175,
    category: 'burritos-alambres',
    portion: '200g + Tortillas',
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-cecina',
    name: 'Alambre de Cecina de Yecapixtla (200g)',
    description: 'Cecina auténtica de Yecapixtla Morelos con tocino, morrón, cebolla y queso derretido.',
    price: 210,
    category: 'burritos-alambres',
    portion: '200g + Tortillas',
    badge: '🇲🇽 Yecapixtla 100%',
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-arrachera',
    name: 'Alambre de Arrachera Prime (200g)',
    description: 'Arrachera prime importada con tocino, pimiento morrón, cebolla asada y queso fundido.',
    price: 200,
    category: 'burritos-alambres',
    portion: '200g + Tortillas',
    badge: '🥩 Prime Calidad',
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-cecina-enchilada',
    name: 'Alambre de Cecina Enchilada (200g)',
    description: 'Cecina adobada, tocino, pimiento morrón y queso gratinado con tortillas calientes.',
    price: 190,
    category: 'burritos-alambres',
    portion: '200g + Tortillas',
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-longaniza',
    name: 'Alambre de Longaniza Almendrada (200g)',
    description: 'Longaniza con toque de almendra, pimiento, cebolla, tocino y queso fundido.',
    price: 140,
    category: 'burritos-alambres',
    portion: '200g + Tortillas',
    canCustomize: true,
    customType: 'alambre',
  },
  {
    id: 'alambre-pechuga',
    name: 'Alambre de Pechuga Asada (200g)',
    description: 'Pechuga magra en trozos con pimiento morrón, cebolla, tocino y queso derretido.',
    price: 150,
    category: 'burritos-alambres',
    portion: '200g + Tortillas',
    canCustomize: true,
    customType: 'alambre',
  },

  // ── SECCIÓN: ESPECIALIDADES & BOTANAS ──
  {
    id: 'ramen-suadero',
    name: 'Ramen con Suadero Especial (200g)',
    description: '¡Disfruta de este manjar único! 200 gr de suadero confitado, fideos ramen sazonados en el consomé de jugo de carne del paisa y delicioso queso Chihuahua derretido. ¡Una delicia total!',
    price: 110,
    category: 'especialidades',
    portion: '200g Carne + Ramen',
    badge: '🍜 Creación Única del Paisa',
    featured: true,
    isPopular: true,
    canCustomize: true,
    customType: 'ramen',
  },
  {
    id: 'ramen-suadero-queso-extra',
    name: 'Ramen con Suadero & Doble Queso Chihuahua',
    description: 'Nuestro ramen estrella con 200g de suadero en jugo de carne con doble porción de queso Chihuahua fundido.',
    price: 140,
    category: 'especialidades',
    portion: '200g + Doble Queso',
    badge: '🧀 Queso Supremo',
    canCustomize: true,
    customType: 'ramen',
  },
  {
    id: 'chicharron-queso-jumbo',
    name: 'Chicharrón de Queso JUMBO',
    description: 'Rollo gigante de queso gouda tostado crujiente al comal, servido con limones y salsas de la casa.',
    price: 80,
    category: 'especialidades',
    portion: 'Jumbo',
    badge: '🧀 Gran Porción',
    featured: true,
    canCustomize: true,
  },
  {
    id: 'chicharron-queso-mediano',
    name: 'Chicharrón de Queso Mediano',
    description: 'Costra cilíndrica de queso dorado y crujiente al comal para botanear.',
    price: 60,
    category: 'especialidades',
    portion: 'Mediano',
    canCustomize: true,
  },
  {
    id: 'queso-fundido-chistorra',
    name: 'Queso Fundido con Chistorra',
    description: 'Cazuela de queso derretido burbujeante coronado con chistorra artesanal española y tortillas calientes.',
    price: 75,
    category: 'especialidades',
    portion: 'Cazuela Caliente',
    badge: '🔥 Cazuela de Barro',
    canCustomize: true,
  },
  {
    id: 'queso-fundido-longaniza',
    name: 'Queso Fundido con Longaniza Almendrada',
    description: 'Queso derretido con longaniza frita al comal con toque de almendras y tortillas.',
    price: 75,
    category: 'especialidades',
    portion: 'Cazuela Caliente',
    canCustomize: true,
  },
  {
    id: 'queso-fundido-champinones',
    name: 'Queso Fundido con Champiñones',
    description: 'Queso fundido elástico con champiñones frescos salteados al ajillo suave.',
    price: 70,
    category: 'especialidades',
    portion: 'Cazuela Caliente',
    canCustomize: true,
  },
  {
    id: 'queso-fundido-longaniza-champ',
    name: 'Queso Fundido Longaniza & Champiñón',
    description: 'La combinación favorita: queso fundido con longaniza dorada y champiñones salteados.',
    price: 75,
    category: 'especialidades',
    portion: 'Cazuela Caliente',
    badge: '⭐ El Favorito',
    canCustomize: true,
  },

  // ── GORDITAS AL COMAL ──
  {
    id: 'gordita-suadero',
    name: 'Gordita de Maíz con Suadero',
    description: 'Gordita de masa de maíz infladita al comal, rellena de suadero en su jugo, queso fresco, crema y lechuga.',
    price: 50,
    category: 'especialidades',
    portion: 'Pieza Grande',
    badge: '🌮 Al Comal',
    canCustomize: true,
    customType: 'gordita',
  },
  {
    id: 'gordita-bistec',
    name: 'Gordita de Maíz con Bistec',
    description: 'Gordita de maíz rellena de bistec centro tierno, queso y verdura.',
    price: 60,
    category: 'especialidades',
    portion: 'Pieza Grande',
    canCustomize: true,
    customType: 'gordita',
  },
  {
    id: 'gordita-cecina-yeca',
    name: 'Gordita de Cecina de Yecapixtla',
    description: 'Rellena de auténtica cecina de Yecapixtla, frijolitos y queso fresco.',
    price: 75,
    category: 'especialidades',
    portion: 'Pieza Grande',
    badge: '🇲🇽 Yecapixtla',
    canCustomize: true,
    customType: 'gordita',
  },
  {
    id: 'gordita-cecina-enchilada',
    name: 'Gordita de Cecina Enchilada',
    description: 'Gordita infladita con cecina adobada y queso fresco.',
    price: 55,
    category: 'especialidades',
    portion: 'Pieza Grande',
    canCustomize: true,
    customType: 'gordita',
  },
  {
    id: 'gordita-campechana-cecina',
    name: 'Gordita Campechana Cecina & Longaniza',
    description: 'Rellena de cecina y longaniza almendrada doraditas.',
    price: 75,
    category: 'especialidades',
    portion: 'Pieza Grande',
    canCustomize: true,
    customType: 'gordita',
  },
  {
    id: 'gordita-campechana-suadero',
    name: 'Gordita Campechana Suadero & Longaniza',
    description: 'Suadero confitado con longaniza almendrada.',
    price: 50,
    category: 'especialidades',
    portion: 'Pieza Grande',
    canCustomize: true,
    customType: 'gordita',
  },
  {
    id: 'gordita-campechana-bistec',
    name: 'Gordita Campechana Bistec & Longaniza',
    description: 'Bistec suave y longaniza en gordita dorada.',
    price: 65,
    category: 'especialidades',
    portion: 'Pieza Grande',
    canCustomize: true,
    customType: 'gordita',
  },

  // ── SECCIÓN: BEBIDAS, TEPACHE & CERVEZAS ──
  {
    id: 'tepache-medio-litro',
    name: 'Tepache Artesanal de Piña (1/2 Litro)',
    description: 'Auténtico tepache mexicano fermentado en barrica con piña miel, piloncillo y canela. Servido bien frío con hielo.',
    price: 25,
    category: 'bebidas',
    portion: '500 ml',
    badge: '🍍 100% Artesanal',
    featured: true,
    isPopular: true,
    canCustomize: false,
  },
  {
    id: 'tepache-un-litro',
    name: 'Tepache Artesanal de Piña (1 Litro)',
    description: 'Litro completo de tepache tradicional bien frío con hielo. ¡Refrescante y digestivo!',
    price: 45,
    category: 'bebidas',
    portion: '1000 ml',
    badge: '🍍 Litro Familiar',
    featured: true,
    canCustomize: false,
  },
  {
    id: 'cerveza-corona',
    name: 'Cerveza Corona Extra (355ml)',
    description: 'Cerveza clara bien helada. Puedes pedirla sola, con limón y sal o michelada escarchada.',
    price: 35,
    category: 'bebidas',
    portion: '355 ml',
    canCustomize: true,
    customType: 'cerveza',
  },
  {
    id: 'cerveza-victoria',
    name: 'Cerveza Victoria (355ml)',
    description: 'Cerveza tipo Vienna mexicana bien fría, el maridaje perfecto para tacos de suadero y cecina.',
    price: 35,
    category: 'bebidas',
    portion: '355 ml',
    canCustomize: true,
    customType: 'cerveza',
  },
  {
    id: 'cerveza-pacifico',
    name: 'Cerveza Pacífico (355ml)',
    description: 'Cerveza clara del pacífico bien helada.',
    price: 38,
    category: 'bebidas',
    portion: '355 ml',
    canCustomize: true,
    customType: 'cerveza',
  },
  {
    id: 'cerveza-modelo-especial',
    name: 'Cerveza Modelo Especial (355ml)',
    description: 'Cerveza premium bien fría de cuerpo balanceado.',
    price: 40,
    category: 'bebidas',
    portion: '355 ml',
    canCustomize: true,
    customType: 'cerveza',
  },
  {
    id: 'cerveza-negra-modelo',
    name: 'Cerveza Negra Modelo (355ml)',
    description: 'La crema de las cervezas, oscura y maltosa, ideal para cortes y arrachera prime.',
    price: 40,
    category: 'bebidas',
    portion: '355 ml',
    canCustomize: true,
    customType: 'cerveza',
  },
  {
    id: 'refresco-cristal',
    name: 'Refrescos Surtidos (355ml)',
    description: 'Bien fríos: Coca-Cola Regular, Coca-Cola Sin Azúcar, Sidral Mundet, Sprite, Fanta Naranja, Boing de Mango, Boing de Guayaba o Agua Mineral.',
    price: 25,
    category: 'bebidas',
    portion: '355 ml',
    canCustomize: true,
    customType: 'refresco',
  },

  // ── EXTRAS Y COMPLEMENTOS INDIVIDUALES ──
  {
    id: 'extra-jugo-carne',
    name: 'Jugo de Carne del Paisa',
    description: 'Consomé concentrado del suadero estilo Arandas con especias finas y cilantro. ¡Reconfortante!',
    price: 20,
    category: 'especialidades',
    portion: 'Taza',
    badge: '🥣 Calientito',
    canCustomize: false,
  },
  {
    id: 'extra-nopal-asado',
    name: 'Orden de Nopales Asados al Comal',
    description: 'Nopales tiernos asados al carbón con sal de grano.',
    price: 17,
    category: 'especialidades',
    portion: 'Orden',
    canCustomize: false,
  },
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

const CERVEZA_PREPARACIONES = [
  { id: 'sola_fria', name: 'Sola bien helada con limón aparte 🍋', price: 0 },
  { id: 'michelada', name: 'Michelada escarchada con chamoy y ajonjolí (+$15)', price: 15 },
  { id: 'cubana', name: 'Cubana con salsas negras, limón y sal (+$15)', price: 15 },
];

export default function ElPaisaDelValleMenu() {
  // ── Estados Principales ──
  const [activeCategory, setActiveCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('elpaisa_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [isSendingOrder, setIsSendingOrder] = useState(false);

  // ── Formulario de Entrega & Pago ──
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
  const [selectedTortilla, setSelectedTortilla] = useState(TORTILLAS_OPCIONES[0].name);
  const [selectedRefresco, setSelectedRefresco] = useState(REFRESCO_SABORES[0]);
  const [selectedCervezaPrep, setSelectedCervezaPrep] = useState(CERVEZA_PREPARACIONES[0]);
  const [selectedExtras, setSelectedExtras] = useState<CustomOption[]>([]);
  const [itemNotes, setItemNotes] = useState('');

  // ── UI Helpers ──
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ── Persistencia del Carrito ──
  useEffect(() => {
    try {
      localStorage.setItem('elpaisa_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  // ── Scroll Listener para botón Top ──
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Toast Trigger ──
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // ── Cálculos del Carrito ──
  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [cart]);

  // Empaque ecológico para alimentos calientes y salsas ($8 si aplica)
  const packagingFee = deliveryType === 'delivery' ? 10 : 0;
  const cartTotal = cartSubtotal + packagingFee;

  const changeCalculation = useMemo(() => {
    if (paymentMethod !== 'efectivo' || !cashAmount) return null;
    const paid = parseFloat(cashAmount.replace(/[^0-9.]/g, ''));
    if (isNaN(paid)) return null;
    return paid - cartTotal;
  }, [paymentMethod, cashAmount, cartTotal]);

  // ── Filtrado de Productos ──
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.portion && product.portion.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeCategory === 'todos') return true;
      if (activeCategory === 'favoritos') return product.featured || product.isPopular;
      return product.category === activeCategory;
    });
  }, [activeCategory, searchQuery]);

  // ── Abrir Modal de Personalización ──
  const handleOpenCustomize = (product: Product) => {
    setCustomizingProduct(product);
    setSelectedSauce(SALSAS_DISPONIBLES[0].name);
    setSelectedVeggie(VERDURA_OPCIONES[0].name);
    setSelectedTortilla(TORTILLAS_OPCIONES[0].name);
    setSelectedRefresco(REFRESCO_SABORES[0]);
    setSelectedCervezaPrep(CERVEZA_PREPARACIONES[0]);
    setSelectedExtras([]);
    setItemNotes('');
  };

  // ── Agregar directo o abrir modal ──
  const handleAddToCartQuick = (product: Product) => {
    if (product.canCustomize) {
      handleOpenCustomize(product);
      return;
    }

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
    };

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id && !item.extras?.length);
      if (existing) {
        return prev.map((item) =>
          item.lineId === existing.lineId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, newItem];
    });

    showToast(`¡${product.name} agregado al pedido! 🌮`);
  };

  // ── Confirmar Personalización ──
  const handleConfirmCustomization = () => {
    if (!customizingProduct) return;

    let unitPrice = customizingProduct.price;
    const extras: CustomOption[] = [...selectedExtras];

    // Cerveza preparación extra
    if (customizingProduct.customType === 'cerveza' && selectedCervezaPrep.price > 0) {
      extras.push({ name: selectedCervezaPrep.name, price: selectedCervezaPrep.price });
      unitPrice += selectedCervezaPrep.price;
    }

    extras.forEach((ext) => {
      if (customizingProduct.customType !== 'cerveza') {
        unitPrice += ext.price;
      }
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
      selectedSauce,
      selectedVeggie,
      selectedTortilla: ['taco', 'cecina', 'alambre'].includes(customizingProduct.customType || '')
        ? selectedTortilla
        : undefined,
      extras: extras.length > 0 ? extras : undefined,
      specialNotes: displayNotes || undefined,
    };

    setCart((prev) => [...prev, newItem]);
    setCustomizingProduct(null);
    showToast(`¡${customizingProduct.name} personalizado agregado! 🌮`);
  };

  // ── Modificar cantidades en el carrito ──
  const updateQuantity = (lineId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.lineId === lineId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeCartItem = (lineId: string) => {
    setCart((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  // ── Copiar CLABE ──
  const handleCopyClabe = () => {
    navigator.clipboard.writeText(bankInfo.clabe);
    setCopiedClabe(true);
    setTimeout(() => setCopiedClabe(false), 2500);
  };

  // ── Checkout de WhatsApp (CRO Estricto: window.location.href + 500ms delay) ──
  const handleSendWhatsAppOrder = () => {
    if (!customerName.trim()) {
      alert('Por favor indica tu nombre para el pedido.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Por favor indica tu número de WhatsApp para confirmar tu pedido.');
      return;
    }
    if (deliveryType === 'delivery' && !customerAddress.trim()) {
      alert('Por favor indica tu dirección de entrega con calle, número y colonia.');
      return;
    }

    setIsSendingOrder(true);

    let message = `*🌮 ¡NUEVO PEDIDO — TAQUERÍA EL PAISA DEL VALLE!* 🌮\n`;
    message += `_Tag de control: [DEMO El Paisa del Valle]_\n\n`;

    message += `📋 *DETALLE DEL PEDIDO:*\n`;
    cart.forEach((item, idx) => {
      message += `*${idx + 1}. ${item.quantity}x ${item.name}* — $${item.unitPrice * item.quantity}\n`;
      if (item.portion) message += `   • Porción: ${item.portion}\n`;
      if (item.selectedTortilla) message += `   • Tortilla: ${item.selectedTortilla}\n`;
      if (item.selectedVeggie) message += `   • Preparación: ${item.selectedVeggie}\n`;
      if (item.selectedSauce) message += `   • Salsa: ${item.selectedSauce}\n`;
      if (item.extras && item.extras.length > 0) {
        message += `   • Extras: ${item.extras.map((e) => `${e.name} (+$${e.price})`).join(', ')}\n`;
      }
      if (item.specialNotes) message += `   • Nota: ${item.specialNotes}\n`;
    });

    message += `\n`;
    message += `🛒 *Subtotal:* $${cartSubtotal}\n`;
    if (packagingFee > 0) {
      message += `📦 *Empaque térmico y salsas:* $${packagingFee}\n`;
    }
    message += `💰 *TOTAL A PAGAR: $${cartTotal} MXN*\n\n`;

    message += `📍 *DATOS DE ENTREGA:*\n`;
    message += `• *Tipo:* ${deliveryType === 'pickup' ? '🏃‍♂️ Para Recoger en Sucursal (Pickup)' : '🛵 Envío a Domicilio'}\n`;
    message += `• *Cliente:* ${customerName.trim()}\n`;
    message += `• *WhatsApp:* ${customerPhone.trim()}\n`;

    if (deliveryType === 'delivery') {
      message += `• *Dirección:* ${customerAddress.trim()}\n`;
      if (customerRef.trim()) message += `• *Referencias:* ${customerRef.trim()}\n`;
    }

    message += `• *Método de Pago:* ${paymentMethod === 'efectivo' ? '💵 Efectivo' : '🏦 Transferencia BBVA'}\n`;
    if (paymentMethod === 'efectivo') {
      if (cashAmount.trim()) {
        const paidNum = parseFloat(cashAmount.replace(/[^0-9.]/g, ''));
        const changeNum = paidNum - cartTotal;
        message += `  - Paga con: $${paidNum}\n`;
        message += `  - *Cambio a llevar: $${changeNum > 0 ? changeNum : 0}*\n`;
      } else {
        message += `  - Pago exacto / por confirmar cambio\n`;
      }
    } else {
      message += `  - Adjuntaré mi comprobante a este chat\n`;
    }

    if (generalNotes.trim()) {
      message += `\n💬 *Instrucciones generales:* ${generalNotes.trim()}\n`;
    }

    message += `\n✨ _Pedido generado desde el Menú Digital Interactivo de El Paisa del Valle_`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${clientConfig.phonePrimary}?text=${encodedMessage}`;

    setTimeout(() => {
      setIsSendingOrder(false);
      setIsCartOpen(false);
      setCheckoutStep(1);
      window.location.href = waUrl;
    }, 550);
  };

  return (
    <div
      className="min-h-screen font-sans text-neutral-100 antialiased selection:bg-[#FF5E00] selection:text-white"
      style={{ backgroundColor: C.bg }}
    >
      {/* ── Toast Flotante ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl text-sm font-semibold tracking-wide text-white border border-[#FF5E00]/40 backdrop-blur-xl"
            style={{ backgroundColor: 'rgba(26, 22, 19, 0.95)' }}
          >
            <Sparkles className="w-4 h-4 text-[#FFB703] animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER SUPERIOR CON LOGO Y ACCIÓN DE CONTACTO ── */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300"
        style={{
          backgroundColor: 'rgba(18, 16, 14, 0.92)',
          borderColor: 'rgba(255, 94, 0, 0.15)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden p-1 flex items-center justify-center shadow-lg border border-[#FF5E00]/30 bg-[#1A1613]">
              <img
                src={paisaLogo}
                alt="Logo El Paisa del Valle"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  {clientConfig.shortName}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FF5E00]/20 text-[#FF8A00] border border-[#FF5E00]/40">
                  CDMX
                </span>
              </div>
              <p className="text-xs text-[#AFA498] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span className="text-emerald-400 font-semibold">Abierto hoy</span> · 1:00 PM a 12:00 AM
              </p>
            </div>
          </div>

          {/* Botón Carrito Header */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full font-bold text-xs sm:text-sm text-white shadow-lg transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #FF5E00 0%, #E63946 100%)',
              boxShadow: '0 4px 18px rgba(255, 94, 0, 0.35)',
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Mi Pedido</span>
            {cartItemCount > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-black bg-white text-[#12100E] shadow">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── HERO BANNER DEL PAISA ── */}
      <section className="relative overflow-hidden border-b border-[#FF5E00]/20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-[1px] transform scale-105"
          style={{ backgroundImage: `url(${paisaHeroCover})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(18, 16, 14, 0.75) 0%, rgba(18, 16, 14, 0.94) 80%, #12100E 100%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-10 sm:pt-12 sm:pb-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#FFB703]/10 text-[#FFB703] border border-[#FFB703]/30 mb-3 shadow-inner">
                <Flame className="w-3.5 h-3.5 text-[#FF5E00]" />
                <span>Especialidad en Suadero estilo Arandas & Cecina de Yecapixtla</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-none mb-3">
                Donde hay <span className="text-[#FF5E00]">TACOS</span> hay{' '}
                <span className="text-[#FFB703]">ALEGRÍA</span>
              </h1>
              <p className="text-sm sm:text-base text-[#D4C8BC] leading-relaxed mb-5">
                {clientConfig.description}
              </p>

              {/* Insignias de confianza y calidad */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs font-medium text-[#FFFDF9]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1613]/90 border border-white/10">
                  <Award className="w-3.5 h-3.5 text-[#FFB703]" />
                  <span>Carne 100% Fresca</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1613]/90 border border-white/10">
                  <Flame className="w-3.5 h-3.5 text-[#FF5E00]" />
                  <span>Arrachera Prime 100%</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1613]/90 border border-white/10">
                  <Star className="w-3.5 h-3.5 text-[#FFB703]" />
                  <span>100% de Yecapixtla</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1613]/90 border border-white/10">
                  <Bike className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pickup & Domicilio</span>
                </div>
              </div>
            </div>

            {/* Tarjeta Visual de Portada */}
            <div className="relative w-48 sm:w-60 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FF5E00]/40 group transform rotate-1 hover:rotate-0 transition-transform duration-300 hidden sm:block">
              <img
                src={paisaHeroCover}
                alt="Carta El Paisa del Valle"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FF5E00] text-white shadow">
                  Menú 100% Interactivo
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BARRA DE BÚSQUEDA Y CATEGORÍAS STICKY ── */}
      <div
        className="sticky top-[57px] z-30 border-b backdrop-blur-xl shadow-md"
        style={{
          backgroundColor: 'rgba(18, 16, 14, 0.95)',
          borderColor: 'rgba(255, 94, 0, 0.12)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-2.5">
          {/* Input Buscador */}
          <div className="relative mb-2.5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AFA498]" />
            <input
              type="text"
              placeholder="Buscar tacos, suadero, cecina, gringas, ramen, tepache..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-xl text-sm text-white placeholder-[#786E64] focus:outline-none focus:ring-2 focus:ring-[#FF5E00] border transition-all"
              style={{
                backgroundColor: '#1E1915',
                borderColor: 'rgba(255, 94, 0, 0.2)',
                fontSize: '16px', // Anti-zoom iOS
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AFA498] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categorías con Scroll Horizontal Suave */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold tracking-wide">
            {[
              { id: 'todos', name: '🔥 Ver Todo', icon: Utensils },
              { id: 'favoritos', name: '👑 Imperdibles', icon: Star },
              { id: 'tacos', name: '🌮 Tacos & Cecina', icon: Flame },
              { id: 'gringas-costras', name: '🧀 Gringas & Costras', icon: Award },
              { id: 'burritos-alambres', name: '🌯 Burritos & Alambres', icon: Utensils },
              { id: 'especialidades', name: '🍜 Ramen & Botanas', icon: Sparkles },
              { id: 'bebidas', name: '🍺 Bebidas & Tepache', icon: Store },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as CategoryId)}
                  className={`whitespace-nowrap px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5E00] to-[#E63946] text-white shadow-md shadow-[#FF5E00]/25'
                      : 'bg-[#1E1915] text-[#D4C8BC] hover:bg-[#28211C] hover:text-white border border-white/5'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL: CATÁLOGO DE PLATILLOS ── */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Banner de Plataformas Delivery */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#1C1814] via-[#241F1A] to-[#1C1814] border border-[#FF5E00]/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5E00]/15 border border-[#FF5E00]/30 flex items-center justify-center text-[#FF8A00]">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">¿Prefieres ordenar por aplicación de delivery?</p>
              <p className="text-xs text-[#AFA498]">También nos encuentras en DiDi Food, Uber Eats y Rappi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {clientConfig.deliveryPlatforms.map((plat) => (
              <span
                key={plat.name}
                className="px-2.5 py-1 rounded-md text-xs font-black uppercase text-white shadow"
                style={{ backgroundColor: plat.color }}
              >
                {plat.name}
              </span>
            ))}
          </div>
        </div>

        {/* Encabezado de Sección */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FF5E00]" />
              {activeCategory === 'todos' && 'Carta Completa'}
              {activeCategory === 'favoritos' && 'Especialidades Imperdibles del Paisa'}
              {activeCategory === 'tacos' && 'Tacos Tradicionales, Cecina y Arrachera'}
              {activeCategory === 'gringas-costras' && 'Gringas & Costras de Queso'}
              {activeCategory === 'burritos-alambres' && 'Burritos Gigantes & Alambres'}
              {activeCategory === 'especialidades' && 'Ramen con Suadero, Quesos & Gorditas'}
              {activeCategory === 'bebidas' && 'Tepache Artesanal, Cervezas & Refrescos'}
            </h2>
            <p className="text-xs text-[#AFA498]">
              Mostrando {filteredProducts.length} deliciosas opciones preparadas al comal
            </p>
          </div>
        </div>

        {/* GRID DE PRODUCTOS */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#1A1613] rounded-3xl border border-white/5">
            <Utensils className="w-12 h-12 text-[#786E64] mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No encontramos platillos con esa búsqueda</h3>
            <p className="text-xs text-[#AFA498] mb-4">Prueba buscando por suadero, pastor, cecina o alambre</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('todos');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF5E00] text-white"
            >
              Ver Carta Completa
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredProducts.map((product) => {
              const inCartCount = cart
                .filter((item) => item.productId === product.id)
                .reduce((acc, curr) => acc + curr.quantity, 0);

              return (
                <div
                  key={product.id}
                  className="group relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border"
                  style={{
                    backgroundColor: C.cardBg,
                    borderColor: inCartCount > 0 ? '#FF5E00' : 'rgba(255, 94, 0, 0.16)',
                    boxShadow: inCartCount > 0 ? '0 0 20px rgba(255, 94, 0, 0.15)' : 'none',
                  }}
                >
                  {/* Badges superiores */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    {product.badge ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FF5E00]/15 text-[#FF8A00] border border-[#FF5E00]/30">
                        {product.badge}
                      </span>
                    ) : (
                      <span />
                    )}
                    {product.portion && (
                      <span className="text-[11px] font-semibold text-[#FFB703] bg-[#FFB703]/10 px-2 py-0.5 rounded border border-[#FFB703]/20">
                        {product.portion}
                      </span>
                    )}
                  </div>

                  {/* Nombre y Descripción */}
                  <div className="mb-4">
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#FF8A00] transition-colors leading-snug mb-1.5">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#AFA498] leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  {/* Pie de Tarjeta: Precio y Botón */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-[#786E64] uppercase font-bold block">Precio</span>
                      <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        ${product.price} <span className="text-xs font-semibold text-[#AFA498]">MXN</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {inCartCount > 0 ? (
                        <div className="flex items-center gap-1.5 bg-[#1A1613] p-1 rounded-xl border border-[#FF5E00]/40">
                          <button
                            onClick={() => {
                              const found = cart.find((i) => i.productId === product.id);
                              if (found) updateQuantity(found.lineId, -1);
                            }}
                            className="w-7 h-7 rounded-lg bg-[#28211C] hover:bg-[#342A24] flex items-center justify-center text-white active:scale-90 transition-all"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-white px-1.5 min-w-5 text-center">
                            {inCartCount}
                          </span>
                          <button
                            onClick={() => handleAddToCartQuick(product)}
                            className="w-7 h-7 rounded-lg bg-[#FF5E00] hover:bg-[#E04B00] flex items-center justify-center text-white active:scale-90 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCartQuick(product)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF5E00] to-[#E63946] hover:brightness-110 active:scale-95 shadow-md shadow-[#FF5E00]/25 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{product.canCustomize ? 'Personalizar' : 'Agregar'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SECCIÓN DE MANIFIESTO Y COMPROMISO DEL PAISA ── */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1C1814] to-[#251F1A] border border-[#FF5E00]/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FF5E00]/20 text-[#FF8A00] border border-[#FF5E00]/40 mb-3">
              💛 Tradición y Calidad de la Casa
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
              En "El Paisa del Valle" la calidad nos la tomamos muy en serio
            </h3>
            <p className="text-sm sm:text-base text-[#D4C8BC] leading-relaxed mb-4">
              Toda nuestra carne es fresca, marinada al comal con recetas originales y con los mejores cortes e insumos. Desde la cecina traída directamente de Yecapixtla hasta nuestro suadero estilo Arandas confitado lentamente.
            </p>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 inline-block">
              <p className="text-sm font-black text-[#FFB703] italic">
                “Donde hay TACOS hay ALEGRÍA...” 🌮✨
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER DE 3 COLUMNAS DEL CLIENTE (ESTÁNDAR IMAGINE & STAMP) ── */}
      <footer
        className="mt-16 border-t pt-12 pb-24 text-sm"
        style={{
          backgroundColor: '#0D0C0A',
          borderColor: 'rgba(255, 94, 0, 0.15)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Columna 1: Marca y Eslogan */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden p-1 bg-[#1A1613] border border-[#FF5E00]/30 flex items-center justify-center">
                <img src={paisaLogo} alt="Logo Paisa" className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-black text-white uppercase tracking-tight">
                {clientConfig.businessName}
              </span>
            </div>
            <p className="text-xs text-[#AFA498] leading-relaxed mb-4">
              {clientConfig.tagline}. Suadero estilo Arandas al jugo, auténtica cecina de Yecapixtla Morelos, arrachera prime, gringas, costras y tepache tradicional.
            </p>
            <div className="text-xs text-[#786E64]">
              <p className="font-semibold text-[#AFA498]">Horarios de Atención:</p>
              <p>{clientConfig.hours}</p>
            </div>
          </div>

          {/* Columna 2: Ubicación y Zonas */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#FF5E00]" />
              Ubicación & Cobertura
            </h4>
            <p className="text-xs text-[#AFA498] leading-relaxed mb-2">
              {clientConfig.address}
            </p>
            <div className="space-y-1.5 text-xs text-[#D4C8BC]">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Servicio en Comedor y Barra</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pickup / Para Recoger sin filas</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Servicio a Domicilio en zona Del Valle</span>
              </p>
            </div>
          </div>

          {/* Columna 3: Contacto, Apps y Privacidad */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#FF5E00]" />
              Pedidos & Apps
            </h4>
            <p className="text-xs text-[#AFA498] mb-3">
              Haz tu pedido directo en este menú y recíbelo por WhatsApp sin comisiones extra:
            </p>
            <a
              href={`https://wa.me/${clientConfig.phonePrimary}?text=Hola,%20quisiera%20información%20del%20menú%20de%20El%20Paisa%20del%20Valle`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20BA5A] transition-all mb-4"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {clientConfig.phonePrimaryFormatted}</span>
            </a>

            <div className="pt-2 border-t border-white/5">
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-xs text-[#AFA498] hover:text-white underline flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5 text-[#FFB703]" />
                <span>Aviso de Privacidad (LFPDPPP)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Barra inferior de créditos */}
        <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#786E64]">
          <p>© 2026 {clientConfig.businessName}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Menú digital interactivo por</span>
            <a
              href="https://imagineandstamp.site"
              target="_blank"
              rel="noreferrer"
              className="text-[#FF8A00] font-black hover:underline"
            >
              IMAGINE & STAMP
            </a>
          </p>
        </div>
      </footer>

      {/* ── BOTÓN FLOTANTE DEL CARRITO (SAFE-AREA COMPLIANT) ── */}
      {cartItemCount > 0 && !isCartOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 z-40 backdrop-blur-md bg-gradient-to-t from-black/90 to-transparent"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-white font-black shadow-2xl transition-all duration-200 active:scale-98 animate-bounce-subtle"
              style={{
                background: 'linear-gradient(135deg, #FF5E00 0%, #E63946 100%)',
                boxShadow: '0 8px 30px rgba(255, 94, 0, 0.45)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-[#12100E] text-xs font-black">
                  {cartItemCount}
                </span>
                <span className="text-sm uppercase tracking-wide">Ver Mi Pedido</span>
              </div>
              <div className="flex items-center gap-1.5 text-base">
                <span>${cartTotal}</span>
                <span className="text-xs font-normal text-white/80">MXN</span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── BOTÓN VOLVER ARRIBA ── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 sm:right-6 z-30 w-10 h-10 rounded-full bg-[#1A1613] text-[#FF8A00] border border-[#FF5E00]/30 shadow-xl flex items-center justify-center hover:bg-[#251F1A] active:scale-90 transition-all"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL BOTTOM-SHEET: PERSONALIZACIÓN GASTRONÓMICA ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {customizingProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-[#FF5E00]/30 shadow-2xl flex flex-col"
              style={{ backgroundColor: '#1A1613' }}
            >
              {/* Header Modal */}
              <div className="sticky top-0 z-10 px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#1A1613]">
                <div>
                  <span className="text-[11px] font-black uppercase text-[#FF8A00]">
                    Personaliza a tu gusto
                  </span>
                  <h3 className="text-lg font-black text-white leading-tight">
                    {customizingProduct.name}
                  </h3>
                </div>
                <button
                  onClick={() => setCustomizingProduct(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cuerpo de Opciones */}
              <div className="p-5 space-y-6 text-sm">
                {/* 1. Selección de Salsa */}
                <div>
                  <label className="block text-xs font-black uppercase text-[#FFB703] mb-2">
                    1. ¿Qué salsa le ponemos?
                  </label>
                  <div className="space-y-2">
                    {SALSAS_DISPONIBLES.map((sauce) => (
                      <button
                        key={sauce.id}
                        type="button"
                        onClick={() => setSelectedSauce(sauce.name)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                          selectedSauce === sauce.name
                            ? 'bg-[#FF5E00]/15 border-[#FF5E00] text-white'
                            : 'bg-[#221D18] border-white/5 text-[#D4C8BC] hover:bg-[#28221D]'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-xs sm:text-sm">{sauce.name}</p>
                          <p className="text-[11px] text-[#AFA498]">{sauce.desc}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                            selectedSauce === sauce.name
                              ? 'border-[#FF5E00] bg-[#FF5E00]'
                              : 'border-white/30'
                          }`}
                        >
                          {selectedSauce === sauce.name && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Selección de Verdura / Preparación */}
                <div>
                  <label className="block text-xs font-black uppercase text-[#FFB703] mb-2">
                    2. Verdura y Limón
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {VERDURA_OPCIONES.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedVeggie(opt.name)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-1.5 ${
                          selectedVeggie === opt.name
                            ? 'bg-[#FF5E00]/20 border-[#FF5E00] text-white'
                            : 'bg-[#221D18] border-white/5 text-[#D4C8BC] hover:bg-[#28221D]'
                        }`}
                      >
                        <span>{opt.name}</span>
                        {selectedVeggie === opt.name && <Check className="w-3.5 h-3.5 text-[#FF5E00]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Tipo de Tortilla (si aplica) */}
                {['taco', 'cecina', 'alambre'].includes(customizingProduct.customType || '') && (
                  <div>
                    <label className="block text-xs font-black uppercase text-[#FFB703] mb-2">
                      3. Tipo de Tortilla
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TORTILLAS_OPCIONES.map((tort) => (
                        <button
                          key={tort.id}
                          type="button"
                          onClick={() => setSelectedTortilla(tort.name)}
                          className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                            selectedTortilla === tort.name
                              ? 'bg-[#FF5E00]/20 border-[#FF5E00] text-white'
                              : 'bg-[#221D18] border-white/5 text-[#D4C8BC]'
                          }`}
                        >
                          {tort.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Opciones específicas de Bebidas */}
                {customizingProduct.customType === 'refresco' && (
                  <div>
                    <label className="block text-xs font-black uppercase text-[#FFB703] mb-2">
                      Elige el Sabor de tu Refresco
                    </label>
                    <select
                      value={selectedRefresco}
                      onChange={(e) => setSelectedRefresco(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#221D18] border border-white/10 text-white font-bold text-xs"
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

                {customizingProduct.customType === 'cerveza' && (
                  <div>
                    <label className="block text-xs font-black uppercase text-[#FFB703] mb-2">
                      ¿Cómo la prefieres servida?
                    </label>
                    <div className="space-y-2">
                      {CERVEZA_PREPARACIONES.map((prep) => (
                        <button
                          key={prep.id}
                          type="button"
                          onClick={() => setSelectedCervezaPrep(prep)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                            selectedCervezaPrep.id === prep.id
                              ? 'bg-[#FF5E00]/20 border-[#FF5E00] text-white'
                              : 'bg-[#221D18] border-white/5 text-[#D4C8BC]'
                          }`}
                        >
                          <span>{prep.name}</span>
                          {prep.price > 0 && <span className="text-[#FFB703]">+$15</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Extras y Complementos Adicionales */}
                <div>
                  <label className="block text-xs font-black uppercase text-[#FFB703] mb-2">
                    Extras Recomendados
                  </label>
                  <div className="space-y-2">
                    {[
                      { name: 'Queso Extra Fundido 🧀', price: 15 },
                      { name: 'Nopal Asado al Carbón 🌵', price: 17 },
                      { name: 'Jugo de Carne Concentrado 🥣', price: 20 },
                      { name: 'Aguacate Fresco Extra 🥑', price: 20 },
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
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#FFB703]/20 border-[#FFB703] text-white'
                              : 'bg-[#221D18] border-white/5 text-[#D4C8BC]'
                          }`}
                        >
                          <span>{extra.name}</span>
                          <span className="text-[#FFB703]">+${extra.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Notas Especiales */}
                <div>
                  <label className="block text-xs font-black uppercase text-[#AFA498] mb-1">
                    Instrucción para taquero o cocina:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. muy dorado, sin grasa, piña aparte..."
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#221D18] border border-white/10 text-white text-xs placeholder-[#786E64]"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>

              {/* Botón Sticky Inferior */}
              <div className="sticky bottom-0 p-4 border-t border-white/10 bg-[#1A1613]">
                <button
                  onClick={handleConfirmCustomization}
                  className="w-full py-3.5 rounded-2xl text-white font-black text-sm uppercase tracking-wide shadow-xl flex items-center justify-center gap-2 active:scale-98 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #FF5E00 0%, #E63946 100%)',
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    Agregar al Pedido • $
                    {customizingProduct.price +
                      (customizingProduct.customType === 'cerveza' ? selectedCervezaPrep.price : 0) +
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
      {/* ── DRAWER DEL CARRITO: 2 PASOS ESTRICTOS (STANDARD CRO) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="w-full max-w-md h-full flex flex-col shadow-2xl border-l border-[#FF5E00]/30"
              style={{ backgroundColor: '#161310' }}
            >
              {/* Header Carrito */}
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#1A1613]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FF5E00]/20 flex items-center justify-center text-[#FF8A00]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">
                      {checkoutStep === 1 ? 'Tu Pedido' : 'Datos de Entrega'}
                    </h3>
                    <p className="text-[11px] text-[#AFA498]">Paso {checkoutStep} de 2</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── PASO 1: LISTA DE PRODUCTOS Y RESUMEN ── */}
              {checkoutStep === 1 && (
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 px-4">
                      <ShoppingBag className="w-16 h-16 text-[#786E64] mx-auto mb-3 opacity-50" />
                      <h4 className="text-base font-bold text-white mb-1">Tu canasta está vacía</h4>
                      <p className="text-xs text-[#AFA498] mb-6">
                        Agrega unos deliciosos tacos de suadero o cecina para comenzar.
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="px-5 py-2.5 rounded-xl text-xs font-black uppercase text-white bg-[#FF5E00]"
                      >
                        Ver Menú
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.lineId}
                        className="p-3.5 rounded-2xl bg-[#201B17] border border-white/5 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-black text-white leading-tight">{item.name}</h4>
                            <p className="text-xs font-bold text-[#FF8A00] mt-0.5">
                              ${item.unitPrice} MXN c/u
                            </p>
                          </div>
                          <button
                            onClick={() => removeCartItem(item.lineId)}
                            className="text-[#786E64] hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Desglose de personalización */}
                        {(item.selectedSauce || item.selectedVeggie || item.selectedTortilla || item.extras?.length) && (
                          <div className="text-[11px] text-[#AFA498] bg-[#161310] p-2 rounded-lg space-y-0.5">
                            {item.selectedSauce && <p>• Salsa: {item.selectedSauce}</p>}
                            {item.selectedVeggie && <p>• Prep: {item.selectedVeggie}</p>}
                            {item.selectedTortilla && <p>• Tortilla: {item.selectedTortilla}</p>}
                            {item.extras && item.extras.length > 0 && (
                              <p>• Extras: {item.extras.map((e) => e.name).join(', ')}</p>
                            )}
                            {item.specialNotes && <p>• Nota: {item.specialNotes}</p>}
                          </div>
                        )}

                        {/* Selector de Cantidad */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <span className="text-xs font-black text-white">
                            Subtotal: ${item.unitPrice * item.quantity}
                          </span>
                          <div className="flex items-center gap-2 bg-[#161310] p-1 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.lineId, -1)}
                              className="w-6 h-6 rounded bg-[#28211C] flex items-center justify-center text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black text-white min-w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.lineId, 1)}
                              className="w-6 h-6 rounded bg-[#FF5E00] flex items-center justify-center text-white"
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

              {/* ── PASO 2: DATOS DE ENTREGA Y MÉTODO DE PAGO ── */}
              {checkoutStep === 2 && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                  {/* Selector: Pickup o Domicilio */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-[#FFB703] mb-1.5">
                      Modalidad de Entrega:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                          deliveryType === 'pickup'
                            ? 'bg-[#FF5E00]/20 border-[#FF5E00] text-white'
                            : 'bg-[#201B17] border-white/5 text-[#AFA498]'
                        }`}
                      >
                        <Store className="w-4 h-4 text-[#FF5E00]" />
                        <span>Para Recoger</span>
                        <span className="text-[10px] text-emerald-400 font-normal">Sin cargo extra</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('delivery')}
                        className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                          deliveryType === 'delivery'
                            ? 'bg-[#FF5E00]/20 border-[#FF5E00] text-white'
                            : 'bg-[#201B17] border-white/5 text-[#AFA498]'
                        }`}
                      >
                        <Bike className="w-4 h-4 text-[#FF5E00]" />
                        <span>A Domicilio</span>
                        <span className="text-[10px] text-[#FFB703] font-normal">Empaque +$10</span>
                      </button>
                    </div>
                  </div>

                  {/* Datos del Cliente */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#D4C8BC] mb-1">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Juan Pérez"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#201B17] border border-white/10 text-white font-medium"
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#D4C8BC] mb-1">
                        WhatsApp de Contacto *
                      </label>
                      <input
                        type="tel"
                        placeholder="Ej. 55 1234 5678"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#201B17] border border-white/10 text-white font-medium"
                        style={{ fontSize: '16px' }}
                      />
                    </div>

                    {deliveryType === 'delivery' && (
                      <>
                        <div>
                          <label className="block text-[11px] font-bold text-[#D4C8BC] mb-1">
                            Dirección de Entrega Completa *
                          </label>
                          <input
                            type="text"
                            placeholder="Calle, Número exterior/interior y Colonia"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-[#201B17] border border-white/10 text-white font-medium"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#D4C8BC] mb-1">
                            Referencias de Ubicación
                          </label>
                          <input
                            type="text"
                            placeholder="Entre qué calles, color de fachada o timbre"
                            value={customerRef}
                            onChange={(e) => setCustomerRef(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-[#201B17] border border-white/10 text-white font-medium"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Forma de Pago */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-[#FFB703] mb-1.5">
                      Forma de Pago:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('efectivo')}
                        className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'efectivo'
                            ? 'bg-[#FF5E00]/20 border-[#FF5E00] text-white'
                            : 'bg-[#201B17] border-white/5 text-[#AFA498]'
                        }`}
                      >
                        <Wallet className="w-4 h-4 text-[#FFB703]" />
                        <span>Efectivo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('transferencia')}
                        className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'transferencia'
                            ? 'bg-[#FF5E00]/20 border-[#FF5E00] text-white'
                            : 'bg-[#201B17] border-white/5 text-[#AFA498]'
                        }`}
                      >
                        <Landmark className="w-4 h-4 text-[#FF8A00]" />
                        <span>Transferencia</span>
                      </button>
                    </div>

                    {/* Detalle Efectivo: Cambio */}
                    {paymentMethod === 'efectivo' && (
                      <div className="mt-2.5 p-3 rounded-xl bg-[#201B17] border border-white/5 space-y-2">
                        <label className="block text-[11px] text-[#AFA498]">
                          ¿Con cuánto vas a pagar? (Para que el repartidor lleve cambio)
                        </label>
                        <input
                          type="text"
                          placeholder={`Ej. $${Math.ceil((cartTotal + 50) / 100) * 100}`}
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          className="w-full p-2 rounded-lg bg-[#161310] border border-white/10 text-white font-bold"
                          style={{ fontSize: '16px' }}
                        />
                        {changeCalculation !== null && (
                          <p
                            className={`text-xs font-bold ${
                              changeCalculation >= 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {changeCalculation >= 0
                              ? `Tu cambio será de: $${changeCalculation.toFixed(2)} MXN`
                              : `Monto insuficiente (Faltan $${Math.abs(changeCalculation).toFixed(2)})`}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Detalle Transferencia: Datos BBVA Copiables */}
                    {paymentMethod === 'transferencia' && (
                      <div className="mt-2.5 p-3 rounded-xl bg-[#201B17] border border-white/5 space-y-2">
                        <p className="text-[11px] text-[#AFA498]">
                          Realiza tu transferencia a la cuenta de la taquería y adjunta el comprobante al enviar:
                        </p>
                        <div className="p-2.5 rounded-lg bg-[#161310] border border-white/10 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-[#786E64] uppercase font-bold">Banco BBVA • CLABE</p>
                            <p className="font-mono font-bold text-white text-xs">{bankInfo.clabe}</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyClabe}
                            className="px-2.5 py-1.5 rounded-lg bg-[#FF5E00]/20 text-[#FF8A00] font-bold text-[10px] flex items-center gap-1 active:scale-90"
                          >
                            {copiedClabe ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedClabe ? '¡Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notas Generales */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#D4C8BC] mb-1">
                      Comentarios Adicionales
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. enviar salsa habanero extra, tocar portón negro..."
                      value={generalNotes}
                      onChange={(e) => setGeneralNotes(e.target.value)}
                      className="w-full p-2 rounded-xl bg-[#201B17] border border-white/10 text-white"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>
              )}

              {/* Footer Fijo del Drawer */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-white/10 bg-[#1A1613] space-y-3">
                  {/* Desglose de Totales */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[#AFA498]">
                      <span>Subtotal Platillos:</span>
                      <span>${cartSubtotal} MXN</span>
                    </div>
                    {packagingFee > 0 && (
                      <div className="flex justify-between text-[#AFA498]">
                        <span>Empaque y Salsas:</span>
                        <span>${packagingFee} MXN</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-black text-white pt-1 border-t border-white/5">
                      <span>Total:</span>
                      <span className="text-[#FF8A00]">${cartTotal} MXN</span>
                    </div>
                  </div>

                  {/* Acciones de Botón según Paso */}
                  {checkoutStep === 1 ? (
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full py-3.5 rounded-2xl text-white font-black text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 active:scale-98 transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #FF5E00 0%, #E63946 100%)',
                      }}
                    >
                      <span>Continuar con Entrega</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCheckoutStep(1)}
                        className="px-4 py-3 rounded-2xl bg-[#28211C] hover:bg-[#342A24] text-white font-bold text-xs"
                      >
                        Volver
                      </button>
                      <button
                        disabled={isSendingOrder}
                        onClick={handleSendWhatsAppOrder}
                        className="flex-1 py-3.5 rounded-2xl text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] active:scale-98 transition-all disabled:opacity-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{isSendingOrder ? 'Enviando a WhatsApp...' : 'Confirmar Pedido por WhatsApp'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL: AVISO DE PRIVACIDAD LFPDPPP ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isPrivacyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl p-6 border border-white/10 shadow-2xl text-xs space-y-3"
              style={{ backgroundColor: '#1A1613' }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#FFB703]" />
                  <h3 className="text-sm font-black text-white uppercase">Aviso de Privacidad</h3>
                </div>
                <button
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-[#D4C8BC] leading-relaxed">
                <p>
                  En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong>, <strong>{clientConfig.businessName}</strong> informa que los datos personales solicitados (nombre, número telefónico y dirección para entregas a domicilio) son utilizados exclusivamente para la gestión, preparación, entrega y cobro de su pedido gastronómico.
                </p>
                <p>
                  Sus datos personales no son compartidos, vendidos ni transferidos a terceras partes bajo ninguna circunstancia. Este menú digital procesa los pedidos directamente hacia el canal oficial de WhatsApp del restaurante sin almacenar información financiera sensible como números de tarjetas de crédito o débito.
                </p>
                <p>
                  Para ejercer sus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición), puede comunicarse directamente al número de contacto de la taquería.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 text-right">
                <button
                  onClick={() => setIsPrivacyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FF5E00] text-white font-bold"
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
