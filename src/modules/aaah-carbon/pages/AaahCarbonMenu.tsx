// ═══════════════════════════════════════════════════════════════════════════
// AAAH! CARBÓN · PARRILLA - RESTAURANTE (NARVARTE, CDMX)
// Menú Digital Interactivo de Alta Gama — Cocina de Brasa y Tradicional
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame, Search, ShoppingBag, Plus, Minus, X, Heart, ArrowUp,
  Phone, MapPin, Clock, MessageCircle, Shield, Copy, Check,
  Trash2, ChevronRight, ChevronLeft, Star, Sparkles, Store,
  Bike, AlertCircle, Share2, CheckCircle2, Award, Coffee,
  Pizza, UtensilsCrossed, Info, ExternalLink, SlidersHorizontal
} from 'lucide-react';

import { clientConfig, bankInfo } from '../config';

// Importación de assets reales optimizados
import logoImg from '../assets/logo.webp';
import burgerImg from '../assets/burger.webp';
import alitasImg from '../assets/alitas.webp';
import empanadasImg from '../assets/empanadas.webp';
import sopaAztecaImg from '../assets/sopa-azteca.webp';
import comboNuggetsImg from '../assets/combo-nuggets.webp';
import pastaPequesImg from '../assets/pasta-peques.webp';
import pizzaCarismaticaImg from '../assets/pizza-carismatica.webp';
import pizzaHawaianaImg from '../assets/pizza-hawaiana.webp';
import ensaladaCesarImg from '../assets/ensalada-cesar.webp';
import ensaladaCapresseImg from '../assets/ensalada-capresse.webp';
import parrilladaImg from '../assets/parrillada.webp';
import alambreQuesoImg from '../assets/alambre-queso.webp';
import chilanguillaImg from '../assets/chilanguilla.webp';
import briocheCheeseImg from '../assets/brioche-cheese.webp';
import salmonGourmetImg from '../assets/salmon-gourmet.webp';
import crepaDulceImg from '../assets/crepa-dulce.webp';
import cheesecakeImg from '../assets/cheesecake.webp';
import cookieYorkImg from '../assets/cookie-york.webp';
import latteAzulImg from '../assets/latte-azul.webp';
import latteLotusImg from '../assets/latte-lotus.webp';
import frappeEspressoImg from '../assets/frappe-espresso.webp';
import malteadaFresaImg from '../assets/malteada-fresa.webp';
import sodaItalianaImg from '../assets/soda-italiana.webp';
import chamoyadaImg from '../assets/chamoyada.webp';
import mocktailsImg from '../assets/mocktails.webp';

// ── Tipos y Categorías ──
export type CategoryId =
  | 'todos'
  | 'favoritos'
  | 'hamburguesas'
  | 'botanas'
  | 'entradas'
  | 'combos'
  | 'pizzas'
  | 'ensaladas'
  | 'cortes'
  | 'parrilladas'
  | 'tacos'
  | 'tradicionales'
  | 'especialidades'
  | 'crepas'
  | 'postres'
  | 'cafeteria'
  | 'bebidas';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  badge?: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'todos', name: 'Todo el Menú', icon: '🔥' },
  { id: 'favoritos', name: 'Mis Favoritos', icon: '❤️' },
  { id: 'hamburguesas', name: 'Hamburguesas', icon: '🍔', badge: '180g Sirloin' },
  { id: 'cortes', name: 'Cortes Sonorenses', icon: '🥩', badge: '300g Carbón' },
  { id: 'parrilladas', name: 'Parrilladas', icon: '🥘', badge: 'Para Compartir' },
  { id: 'tacos', name: 'Tacos & Plancha', icon: '🌮', badge: 'Alambres' },
  { id: 'botanas', name: 'Botanas & Alitas', icon: '🍗' },
  { id: 'pizzas', name: 'Pizzas al Horno', icon: '🍕', badge: '6 Rebanadas' },
  { id: 'especialidades', name: 'Especialidades', icon: '👨‍🍳', badge: 'Chef' },
  { id: 'tradicionales', name: 'Tradicionales & Chapatas', icon: '🥪' },
  { id: 'entradas', name: 'Entradas & Sopas', icon: '🥟' },
  { id: 'combos', name: 'Combos & Peques', icon: '🧒' },
  { id: 'ensaladas', name: 'Ensaladas', icon: '🥗' },
  { id: 'crepas', name: 'Crepas Dulces & Saladas', icon: '🥞' },
  { id: 'postres', name: 'Postres Caseros', icon: '🍰' },
  { id: 'cafeteria', name: 'Café & Lattes Fríos', icon: '☕' },
  { id: 'bebidas', name: 'Mocktails, Tisanas & Bebidas', icon: '🍹' },
];

export interface CustomOption {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image: string;
  badge?: string;
  featured?: boolean;
  isPopular?: boolean;
  prepTime?: string;
  canCustomize?: boolean;
  customType?: 'corte' | 'burger' | 'alitas' | 'tacos' | 'combo' | 'general';
}

export interface CartItem {
  lineId: string;
  productId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  image: string;
  category: CategoryId;
  meatTerm?: string;
  sideChoice?: string;
  selectedSauce?: string;
  extras?: CustomOption[];
  specialNotes?: string;
}

// ── Opciones de Personalización ──
const MEAT_TERMS = [
  { id: 'medio', name: 'Término Medio (Jugoso al centro)' },
  { id: 'tres_cuartos', name: 'Tres Cuartos (Recomendado del Chef)' },
  { id: 'bien_cocido', name: 'Bien Cocido (Bien dorado)' },
];

const POTATO_CHOICES = [
  { id: 'francesa', name: 'Papas a la Francesa Crujientes' },
  { id: 'curly', name: 'Papas Curly en Espiral' },
  { id: 'gajo', name: 'Papas en Gajo Sazonadas' },
];

const WING_SAUCES = [
  { id: 'bbq', name: 'Salsa BBQ (Agridulce ahumada)' },
  { id: 'bufalo', name: 'Búfalo Tradicional (Ácida-picante)' },
  { id: 'mango_habanero', name: 'Mango Habanero (Toque tropical picante)' },
  { id: 'tex_mex', name: 'Tex-Mex Especial (Picante parrillero)' },
];

const EXTRAS_BURGER: CustomOption[] = [
  { name: 'Agrega Piña, Jamón y Tocino', price: 29 },
  { name: 'Doble Carne Sirloin (180g extra)', price: 59 },
  { name: 'Combo Papas + Refresco / Agua', price: 69 },
  { name: 'Combo Papas + Malteada Artesanal', price: 99 },
];

const EXTRAS_GENERAL: CustomOption[] = [
  { name: 'Queso Cheddar Derretido Extra', price: 19 },
  { name: 'Queso Manchego Gratinado Extra', price: 19 },
  { name: 'Porción de Guacamole Casero', price: 29 },
  { name: 'Chiles Toreados al Carbón', price: 15 },
];

// ═══════════════════════════════════════════════════════════════════════════
// CATÁLOGO OFICIAL COMPLETO (Extraído de las 18 páginas de MENU_NARVARTE QR.pdf)
// ═══════════════════════════════════════════════════════════════════════════
export const PRODUCTS: Product[] = [
  // ── 1. HAMBURGUESAS (Pág 2) ──
  {
    id: 'burger-sirloin',
    name: 'Hamburguesa Sirloin Clásica',
    description: '180 g de jugosa y exquisita carne de Sirloin sonorense con cremoso queso americano. Servida con jitomate, lechuga, cebolla y aderezo de la casa.',
    price: 122,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '⭐ Más Pedida',
    featured: true,
    isPopular: true,
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-pollo',
    name: 'Hamburguesa de Pollo Marinada',
    description: '120 g de pechuga natural marinada a las brasas y queso americano derretido.',
    price: 96,
    category: 'hamburguesas',
    image: burgerImg,
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-mushroom',
    name: 'Hamburguesa Mushroom Gourmet',
    description: '180 g de carne de sirloin, champiñones frescos salteados al punto y abundante queso manchego.',
    price: 129,
    category: 'hamburguesas',
    image: burgerImg,
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-choriburger',
    name: 'Choriburger al Carbón',
    description: '180 g de sirloin con un irresistible gratinado de longaniza artesanal y queso manchego.',
    price: 134,
    category: 'hamburguesas',
    image: burgerImg,
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-arrachera',
    name: 'Hamburguesa de Arrachera',
    description: '150 g de arrachera importada premium marinada a fuego vivo en la parrilla.',
    price: 159,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '🥩 Corte Premium',
    featured: true,
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-bossanova',
    name: 'Hamburguesa Bossanova',
    description: '180 g de sirloin, queso panela, queso manchego, queso philadelphia y abanico de aguacate fresco.',
    price: 144,
    category: 'hamburguesas',
    image: burgerImg,
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-midnight',
    name: 'Hamburguesa Midnight',
    description: '180 g de sirloin premium, jamón horneado, queso manchego fundido y toque de philadelphia.',
    price: 134,
    category: 'hamburguesas',
    image: burgerImg,
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-portobello',
    name: 'Hamburguesa Portobello Veggie',
    description: 'Champiñón portobello al grill, queso de cabra, queso manchego fundido y aguacate fresco.',
    price: 129,
    category: 'hamburguesas',
    image: burgerImg,
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-peculiar',
    name: 'Hamburguesa Peculiar de la Casa',
    description: '180 g de sirloin, queso edam, queso manchego y rodajas caramelizadas de plátano macho frito.',
    price: 154,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '🔥 Receta de la Casa',
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-sir-porto',
    name: 'Hamburguesa Sir Porto',
    description: '180 g de sirloin sonorense, champiñón portobello asado, queso manchego y queso de cabra cremoso.',
    price: 159,
    category: 'hamburguesas',
    image: burgerImg,
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-western',
    name: 'Hamburguesa Western BBQ',
    description: '180 g de carne de sirloin, queso americano y crujientes tiras de tocino ahumado bañadas en salsa BBQ.',
    price: 144,
    category: 'hamburguesas',
    image: burgerImg,
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-love-cheese',
    name: 'Hamburguesa Love Cheese (6 Quesos)',
    description: '180 g de sirloin, queso americano, provoleta argentina, philadelphia, manchego, panela y mozzarella.',
    price: 154,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '🧀 Explosión de Queso',
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-guacarbon',
    name: 'Hamburguesa Guacarbon',
    description: '180 g de sirloin, abundante guacamole fresco de la casa, trozos de tocino crocante y queso manchego.',
    price: 154,
    category: 'hamburguesas',
    image: burgerImg,
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-humildemente',
    name: 'Hamburguesa Humildemente',
    description: '100 g de trozos de chorizo argentino artesanal y queso mozzarella sobre 180 g de sirloin, con chimichurri casero.',
    price: 154,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '🇦🇷 Toque Argentino',
    canCustomize: true,
    customType: 'burger'
  },
  {
    id: 'burger-rib-eye',
    name: 'Hamburguesa Suprema Rib Eye',
    description: 'Láminas jugosas de Rib Eye sonorense (120 g) con queso provoleta derretido a la plancha.',
    price: 199,
    category: 'hamburguesas',
    image: burgerImg,
    badge: '👑 Corte de Lujo',
    featured: true,
    canCustomize: true,
    customType: 'burger'
  },

  // ── 2. BOTANAS & ALITAS (Pág 3) ──
  {
    id: 'botana-alitas-350',
    name: 'Alitas a la Leña (350 g)',
    description: 'Alitas crujientes con guarnición de juliana de zanahoria, pepino, jícama y aderezo blue cheese. Elige salsa: BBQ, Búfalo, Mango Habanero o Tex-Mex.',
    price: 130,
    category: 'botanas',
    image: alitasImg,
    badge: '🔥 Clásico Parrillero',
    featured: true,
    canCustomize: true,
    customType: 'alitas'
  },
  {
    id: 'botana-alitas-700',
    name: 'Alitas a la Leña Grande (700 g)',
    description: 'Porción grande para compartir con verduras frescas y aderezo blue cheese. Elige tu salsa favorita.',
    price: 239,
    category: 'botanas',
    image: alitasImg,
    canCustomize: true,
    customType: 'alitas'
  },
  {
    id: 'botana-boneless',
    name: 'Boneless de Pechuga (200 g)',
    description: 'Trozos selectos de pechuga de pollo empanizados al momento, bañados con salsa BBQ, Mango Habanero, Tex-Mex o Búfalo.',
    price: 99,
    category: 'botanas',
    image: alitasImg,
    isPopular: true,
    canCustomize: true,
    customType: 'alitas'
  },
  {
    id: 'botana-papas-francesa-ch',
    name: 'Papas a la Francesa (Chica 200g)',
    description: 'Papas clásicas doradas y crujientes con sal parrillera.',
    price: 59,
    category: 'botanas',
    image: burgerImg
  },
  {
    id: 'botana-papas-francesa-gde',
    name: 'Papas a la Francesa (Grande 400g)',
    description: 'Porción doble de papas a la francesa para compartir al centro.',
    price: 99,
    category: 'botanas',
    image: burgerImg
  },
  {
    id: 'botana-papas-curly-ch',
    name: 'Papa Curly en Espiral (Chica 200g)',
    description: 'Papa con exquisita cobertura sazonada en forma de espiral crujiente.',
    price: 59,
    category: 'botanas',
    image: burgerImg
  },
  {
    id: 'botana-papas-curly-gde',
    name: 'Papa Curly en Espiral (Grande 400g)',
    description: 'Porción grande de papa curly sazonada.',
    price: 99,
    category: 'botanas',
    image: burgerImg
  },
  {
    id: 'botana-papas-gajo-ch',
    name: 'Papa Gajo Sazonada (Chica 200g)',
    description: 'Papa en corte gajo rústico con excelente cobertura crujiente.',
    price: 59,
    category: 'botanas',
    image: burgerImg
  },
  {
    id: 'botana-papas-gajo-gde',
    name: 'Papa Gajo Sazonada (Grande 400g)',
    description: 'Orden grande de papa gajo rústica.',
    price: 99,
    category: 'botanas',
    image: burgerImg
  },
  {
    id: 'botana-papas-regias',
    name: 'Papas Regias al Queso Cheddar',
    description: '200 g de papas francesas cubiertas con crujientes trozos de tocino y bañado en queso cheddar derretido.',
    price: 109,
    category: 'botanas',
    image: burgerImg,
    badge: '🧀 Favorita'
  },
  {
    id: 'botana-palomitas',
    name: 'Palomitas de Pollo (120g)',
    description: 'Trocitos de pechuga empanizados crujientes al estilo casero.',
    price: 59,
    category: 'botanas',
    image: comboNuggetsImg
  },
  {
    id: 'botana-ahh-que-nachos',
    name: 'Ahh! Qué Nachos con Arrachera',
    description: 'Totopos crujientes con arrachera marinada, guacamole fresco y frijoles refritos, bañados con queso cheddar derretido.',
    price: 149,
    category: 'botanas',
    image: parrilladaImg,
    badge: '🔥 Imperdible',
    featured: true
  },

  // ── 3. ENTRADAS & SOPAS (Pág 4) ──
  {
    id: 'entrada-empanadas',
    name: 'Empanadas Artesanales con Queso',
    description: 'Empanada horneada y dorada. Pídela de: Tocino y Jamón, Carne de res, Elote, Espinaca o Chistorra. Todas con queso fundido.',
    price: 59,
    category: 'entradas',
    image: empanadasImg,
    badge: '🥟 Artesanales'
  },
  {
    id: 'entrada-papa-horno',
    name: 'Papa al Horno de la Casa',
    description: 'Papa horneada rellena de un dip sabroso y salpicada con crujiente tocino.',
    price: 69,
    category: 'entradas',
    image: empanadasImg
  },
  {
    id: 'entrada-papa-rellena',
    name: 'Papa Rellena Especial',
    description: 'Papa al horno rellena, pídela con chistorra dorada, longaniza o arrachera a las brasas.',
    price: 89,
    category: 'entradas',
    image: empanadasImg,
    badge: '🥔 Muy Solicitada'
  },
  {
    id: 'entrada-pure-papa',
    name: 'Puré de Papa Rallada',
    description: 'Papa rallada con mantequilla suave y trocitos dorados de tocino.',
    price: 79,
    category: 'entradas',
    image: empanadasImg
  },
  {
    id: 'entrada-guacamole',
    name: 'Guacamole Tradicional',
    description: 'Aguacate machacado al momento con jitomate, cebolla, cilantro y totopos de maíz.',
    price: 69,
    category: 'entradas',
    image: parrilladaImg
  },
  {
    id: 'entrada-guacamole-chistorra',
    name: 'Guacamole con Chistorra',
    description: 'Nuestro guacamole tradicional coronado con abundante chistorra asada a la plancha.',
    price: 89,
    category: 'entradas',
    image: parrilladaImg
  },
  {
    id: 'entrada-portobellos-margarita',
    name: 'Portobellos Margarita',
    description: '2 piezas de champiñones portobellos horneados y marinados en balsámico, con queso de cabra, jitomates cherry y albahaca fresca.',
    price: 149,
    category: 'entradas',
    image: briocheCheeseImg,
    badge: '🌿 Gourmet'
  },
  {
    id: 'sopa-azteca',
    name: 'Sopa Azteca de Tortilla',
    description: 'Tradicional sopa de tortilla en caldo de jitomate sazonado, servida con crema fresca, aguacate y queso.',
    price: 79,
    category: 'entradas',
    image: sopaAztecaImg,
    badge: '🥣 Calientita'
  },
  {
    id: 'sopa-caldito-carbon',
    name: 'Caldito Carbón',
    description: 'Reconfortante consomé con pollo deshebrado y sus verduras frescas.',
    price: 59,
    category: 'entradas',
    image: sopaAztecaImg
  },
  {
    id: 'sopa-caldo-loco',
    name: 'Caldo Loco Especial',
    description: 'Consomé de pollo con huevo cocido, queso derretido y verduras (champiñón, brócoli, elote y zanahoria) con toque de crema.',
    price: 89,
    category: 'entradas',
    image: sopaAztecaImg,
    badge: '⭐ De la Casa'
  },
  {
    id: 'sopa-consome-ranchero',
    name: 'Consomé Ranchero',
    description: 'Consomé de pollo casero con verduras, porción de arroz y cubos de aguacate fresco.',
    price: 109,
    category: 'entradas',
    image: sopaAztecaImg
  },
  {
    id: 'sopa-jugo-de-carne',
    name: 'Jugo de Carne Sonorense',
    description: 'Concentrado extracto de res preparado a nuestro estilo parrillero con mucho sabor, cebollita y cilantro.',
    price: 99,
    category: 'entradas',
    image: sopaAztecaImg,
    badge: '🥩 Parrillero'
  },

  // ── 4. COMBOS & PARA PEQUES (Pág 5) ──
  {
    id: 'combo-nuggets',
    name: 'Combo 12 Nuggets',
    description: '12 nuggets dorados, papas chicas a la francesa y refresco frío de 600 ml.',
    price: 165,
    category: 'combos',
    image: comboNuggetsImg,
    badge: '🎉 Ahorro'
  },
  {
    id: 'combo-papas',
    name: 'Combo Doble Papas Grandes',
    description: 'Escoge dos tipos de papas a tu gusto (ambas en tamaño grande de 400g cada una: francesa, curly o gajo).',
    price: 199,
    category: 'combos',
    image: comboNuggetsImg
  },
  {
    id: 'combo-alitas',
    name: 'Combo Alitas Individual',
    description: '350 g de alitas a la leña, papas chicas a la francesa y refresco de 600 ml.',
    price: 199,
    category: 'combos',
    image: alitasImg
  },
  {
    id: 'combo-duo-sirloin',
    name: 'Combo Dúo Sirloin (2 Personas)',
    description: '2 Hamburguesas de Sirloin (180g c/u), orden grande de papas y 2 refrescos fríos.',
    price: 399,
    category: 'combos',
    image: burgerImg,
    badge: '🔥 Paquete Pareja',
    featured: true
  },
  {
    id: 'peques-sincronizada',
    name: 'Sincronizada Infantil con Papas',
    description: 'Jamón y queso manchego fundido en 2 tortillas de harina, acompañada con papas a la francesa.',
    price: 98,
    category: 'combos',
    image: pastaPequesImg
  },
  {
    id: 'peques-palomitas',
    name: 'Palomitas de Pollo con Papas',
    description: '120 g de trocitos de pechuga empanizados, acompañados de papas a la francesa.',
    price: 98,
    category: 'combos',
    image: comboNuggetsImg
  },
  {
    id: 'peques-nuggets',
    name: '6 Nuggets con Papas',
    description: '6 piezas de nuggets de pollo crujientes con papas a la francesa.',
    price: 125,
    category: 'combos',
    image: comboNuggetsImg
  },
  {
    id: 'peques-spaghetti',
    name: 'Spaghetti Infantil a la Crema',
    description: 'Porción de spaghetti con crema o a la mantequilla y trozos de jamón.',
    price: 109,
    category: 'combos',
    image: pastaPequesImg
  },
  {
    id: 'peques-sabana-pollo',
    name: 'Sábana de Pechuga con Papas',
    description: '110 g de fina pechuga de pollo a la plancha acompañada de papas a la francesa.',
    price: 145,
    category: 'combos',
    image: pastaPequesImg
  },

  // ── 5. PIZZAS AL HORNO (Pág 6) ──
  {
    id: 'pizza-margarita',
    name: 'Pizza Margarita Clásica',
    description: '6 rebanadas con abundante queso derretido, albahaca fresca y salsa pomodoro casera (Horneado 25 min).',
    price: 130,
    category: 'pizzas',
    image: pizzaCarismaticaImg,
    prepTime: '25 min'
  },
  {
    id: 'pizza-hawaiana',
    name: 'Pizza Hawaiana Tradicional',
    description: '6 rebanadas de jamón horneado, piña dulce, queso y salsa pomodoro.',
    price: 159,
    category: 'pizzas',
    image: pizzaHawaianaImg,
    prepTime: '25 min'
  },
  {
    id: 'pizza-doble-peperoni',
    name: 'Pizza Doble Peperoni',
    description: 'Peperoni, más peperoni crocante, queso fundido y salsa pomodoro en masa delgada.',
    price: 169,
    category: 'pizzas',
    image: pizzaCarismaticaImg,
    badge: '🍕 La Favorita',
    prepTime: '25 min'
  },
  {
    id: 'pizza-carbone',
    name: 'Pizza Carbone Especial',
    description: 'Peperoni, champiñón fresco, aceitunas negras, cebolla morada, queso y salsa pomodoro.',
    price: 164,
    category: 'pizzas',
    image: pizzaCarismaticaImg,
    prepTime: '25 min'
  },
  {
    id: 'pizza-carismatica',
    name: 'Pizza Carismática Parrillera',
    description: 'Chistorra asada, chorizo argentino, pimiento morrón, cebolla morada, queso y salsa pomodoro.',
    price: 194,
    category: 'pizzas',
    image: pizzaCarismaticaImg,
    badge: '🔥 Especialidad Brasa',
    featured: true,
    prepTime: '25 min'
  },
  {
    id: 'pizza-cuatro-quesos',
    name: 'Pizza 4 Quesos con Chistorra',
    description: 'Selecta combinación de 4 quesos gratinados, salsa pomodoro y chistorra dorada.',
    price: 174,
    category: 'pizzas',
    image: pizzaCarismaticaImg,
    prepTime: '25 min'
  },
  {
    id: 'pizza-del-huerto',
    name: 'Pizza Del Huerto',
    description: 'Champiñones, pimientos, aceitunas negras, granos de elote, arándanos, salsa de 4 quesos y queso de cabra.',
    price: 164,
    category: 'pizzas',
    image: pizzaHawaianaImg,
    prepTime: '25 min'
  },
  {
    id: 'pizza-aah-canijo',
    name: 'Pizza Aah! Canijo Suprema',
    description: 'Peperoni, chistorra, jamón, champiñones, pimientos, aceitunas negras, cebolla morada, queso y pomodoro.',
    price: 189,
    category: 'pizzas',
    image: pizzaCarismaticaImg,
    badge: '⭐ Con Todo',
    prepTime: '25 min'
  },
  {
    id: 'pizza-mexicana',
    name: 'Pizza Mexicana al Carbón',
    description: 'Frijoles negros refritos, tocino, longaniza dorada, cebolla morada, queso gouda, aguacate y rodajas de jalapeño.',
    price: 194,
    category: 'pizzas',
    image: pizzaCarismaticaImg,
    prepTime: '25 min'
  },
  {
    id: 'pizza-boneless',
    name: 'Pizza Boneless Búfalo',
    description: '300 g de boneless crujientes bañados en salsa búfalo, salsa alfredo cremosa y mezcla de quesos.',
    price: 219,
    category: 'pizzas',
    image: pizzaCarismaticaImg,
    badge: '🍗 Boneless Lovers',
    featured: true,
    prepTime: '25 min'
  },
  {
    id: 'pizza-nutella',
    name: 'Pizza Dulce de Nutella',
    description: 'Exquisita masa horneada con abundante Nutella, fresas frescas y rodajas de plátano.',
    price: 135,
    category: 'pizzas',
    image: crepaDulceImg,
    badge: '🍫 Postre Pizza'
  },

  // ── 6. ENSALADAS (Pág 7) ──
  {
    id: 'ensalada-cesar',
    name: 'Ensalada César Tradicional',
    description: 'Lechugas frescas, crotones tostados con ajo, aderezo césar y lluvia de queso parmesano.',
    price: 105,
    category: 'ensaladas',
    image: ensaladaCesarImg
  },
  {
    id: 'ensalada-cesar-pollo',
    name: 'Ensalada César con Pollo al Grill',
    description: 'Tradicional ensalada César coronada con jugosa pechuga de pollo asada al carbón.',
    price: 149,
    category: 'ensaladas',
    image: ensaladaCesarImg,
    badge: '🥗 Saludable'
  },
  {
    id: 'ensalada-capresse',
    name: 'Ensalada Capresse al Pesto',
    description: 'Rodajas de jitomate bola, queso mozzarella fresco, un toque de salsa pesto artesanal, sobre cama de lechuga.',
    price: 179,
    category: 'ensaladas',
    image: ensaladaCapresseImg
  },
  {
    id: 'ensalada-asi-nomas',
    name: 'Ensalada Así Nomás',
    description: 'Mezcla de lechugas frescas con fresas, arándanos, zarzamoras, girasol caramelizado, manzana y aderezo de mango al habanero.',
    price: 149,
    category: 'ensaladas',
    image: ensaladaCesarImg,
    badge: '🍓 Frutos Rojos'
  },
  {
    id: 'ensalada-la-metiche',
    name: 'Ensalada La Metiche',
    description: 'Lechuga italiana, rodajas de manzana verde, manchego y provoleta en láminas, girasol caramelizado y aderezo mango-habanero.',
    price: 149,
    category: 'ensaladas',
    image: ensaladaCesarImg
  },
  {
    id: 'ensalada-la-pidio-mi-esposa',
    name: 'Ensalada La Pidió Mi Esposa',
    description: 'Pollo a la plancha, queso provoleta, aguacate, pechuga de pavo, cherry, huevo cocido, mix de lechugas y aderezo de cilantro.',
    price: 179,
    category: 'ensaladas',
    image: ensaladaCapresseImg,
    badge: '🥑 Completa y Fresca',
    featured: true
  },
  {
    id: 'ensalada-ahh-la-terca',
    name: 'Ensalada Ahh! La Terca',
    description: 'Cama de lechugas, frutos secos, almendras fileteadas, girasol y ajonjolí caramelizado, queso de cabra y aderezo de yogurt al mango.',
    price: 169,
    category: 'ensaladas',
    image: ensaladaCesarImg
  },

  // ── 7. CORTES SONORENSES (Pág 8) ──
  {
    id: 'corte-t-bone',
    name: 'Corte T-Bone Sonorense (300 g)',
    description: 'Corte que contiene lomo y filete separados por su característico hueso en T. Asado al carbón, servido con papas salteadas al romero, chile toreado y frijoles de la olla.',
    price: 269,
    category: 'cortes',
    image: parrilladaImg,
    badge: '🥩 Al Carbón',
    prepTime: '25-35 min',
    canCustomize: true,
    customType: 'corte'
  },
  {
    id: 'corte-churrasco',
    name: 'Churrasco Top Sirloin (300 g)',
    description: 'Corte limpio con grasa en la orilla para mantener sus jugos naturales. Servido con papas al romero, chile toreado y frijoles.',
    price: 269,
    category: 'cortes',
    image: parrilladaImg,
    prepTime: '25-35 min',
    canCustomize: true,
    customType: 'corte'
  },
  {
    id: 'corte-new-york',
    name: 'New York Strip Sonorense (300 g)',
    description: 'Corte ligeramente magro con marmoleo medio proveniente del lomo sonorense. Tierno y jugoso.',
    price: 299,
    category: 'cortes',
    image: parrilladaImg,
    badge: '⭐ Clásico',
    prepTime: '25-35 min',
    canCustomize: true,
    customType: 'corte'
  },
  {
    id: 'corte-rib-eye',
    name: 'Rib Eye Sonorense (300 g)',
    description: 'Corte con gran marmoleo y grasa natural que le confieren una suavidad inigualable. Sin hueso ni nervio.',
    price: 339,
    category: 'cortes',
    image: parrilladaImg,
    badge: '👑 El Rey de los Cortes',
    featured: true,
    prepTime: '25-35 min',
    canCustomize: true,
    customType: 'corte'
  },
  {
    id: 'corte-arrachera',
    name: 'Arrachera Sonorense Marina (280 g)',
    description: 'Corte suave y de gran sabor, muy poca grasa, marinada con la receta secreta de la casa y tenderizada a las brasas.',
    price: 339,
    category: 'cortes',
    image: parrilladaImg,
    badge: '🔥 Súper Suave',
    prepTime: '25-35 min',
    canCustomize: true,
    customType: 'corte'
  },
  {
    id: 'corte-picana',
    name: 'Picaña Sonorense (280 g)',
    description: 'Sabor intenso, suave y jugosa con una ligera capa de grasa dorada al carbón y marmoleo medio.',
    price: 329,
    category: 'cortes',
    image: parrilladaImg,
    badge: '🇧🇷 Estilo Pampa',
    prepTime: '25-35 min',
    canCustomize: true,
    customType: 'corte'
  },

  // ── 8. PARRILLADAS AL CARBÓN (Pág 8) ──
  {
    id: 'parrillada-taquera',
    name: 'Parrillada Taquera (640 g)',
    description: 'Generosa porción de Bistec, longaniza dorada, cecina enchilada y pechuga al carbón. Servida con papas salteadas, chiles toreados y frijoles de la olla.',
    price: 319,
    category: 'parrilladas',
    image: parrilladaImg,
    badge: '🌮 2-3 Personas',
    featured: true,
    prepTime: '25-35 min'
  },
  {
    id: 'parrillada-sencillita',
    name: 'Parrillada Sencillita (480 g)',
    description: 'Arrachera tenderizada con chorizo argentino o chistorra a elección, papas salteadas, chiles toreados y frijoles.',
    price: 399,
    category: 'parrilladas',
    image: parrilladaImg,
    prepTime: '25-35 min'
  },
  {
    id: 'parrillada-nortena',
    name: 'Parrillada Norteña (520 g)',
    description: 'Arrachera sonorense, cecina enchilada, pechuga de pollo y longaniza artesanal con guarnición completa de la casa.',
    price: 469,
    category: 'parrilladas',
    image: parrilladaImg,
    badge: '🤠 Sabor Norteño',
    prepTime: '25-35 min'
  },
  {
    id: 'parrillada-argentina',
    name: 'Parrillada Argentina (680 g)',
    description: 'Arrachera sonorense, chorizo argentino artesanal y chistorra dorada. Acompañada de chimichurri y papas salteadas.',
    price: 459,
    category: 'parrilladas',
    image: parrilladaImg,
    badge: '🇦🇷 La Consentida',
    prepTime: '25-35 min'
  },
  {
    id: 'parrillada-don-fer',
    name: 'Gran Parrillada Don Fer (1.18 kg)',
    description: 'La máxima experiencia del restaurante: Arrachera, chorizo argentino, chistorra y 1 kg de cortes varios seleccionados al carbón con guarnición abundante.',
    price: 889,
    category: 'parrilladas',
    image: parrilladaImg,
    badge: '👑 Familiar 4-5 Pax',
    featured: true,
    prepTime: '25-35 min'
  },

  // ── 9. TACOS & DE LA PLANCHA (Pág 9) ──
  {
    id: 'taco-arrachera',
    name: 'Taco de Arrachera (80 g)',
    description: 'Arrachera marinada al carbón montada en tortilla caliente. (Agrega queso por +$19).',
    price: 54,
    category: 'tacos',
    image: alambreQuesoImg,
    badge: '🌮 Favorito'
  },
  {
    id: 'taco-gaonera-filete',
    name: 'Gaonera de Filete Suave (80 g)',
    description: 'Corte fino de filete tierno asado al momento sobre tortilla caliente.',
    price: 65,
    category: 'tacos',
    image: alambreQuesoImg
  },
  {
    id: 'taco-gaonera-rib-eye',
    name: 'Gaonera de Rib Eye (80 g)',
    description: 'Lámina de Rib Eye marmoleado sonorense con sal en grano.',
    price: 75,
    category: 'tacos',
    image: alambreQuesoImg,
    badge: '⭐ Rib Eye'
  },
  {
    id: 'tacos-campechanos',
    name: 'Tacos Campechanos (Orden 2 pzas)',
    description: 'La tradicional y deliciosa mezcla de bistec jugoso con longaniza dorada.',
    price: 75,
    category: 'tacos',
    image: alambreQuesoImg
  },
  {
    id: 'taco-bistec',
    name: 'Taco de Bistec (80 g)',
    description: 'Bistec de res a la plancha bien sazonado.',
    price: 42,
    category: 'tacos',
    image: alambreQuesoImg
  },
  {
    id: 'taco-chorizo-argentino',
    name: 'Taco de Chorizo Argentino (80 g)',
    description: 'Chorizo argentino asado con chimichurri casero.',
    price: 42,
    category: 'tacos',
    image: alambreQuesoImg
  },
  {
    id: 'alambre-arrachera',
    name: 'Alambre de Arrachera Especial',
    description: 'Arrachera a la plancha con pimientos, cebolla morada, tocino crujiente, jamón y abundante queso gratinado.',
    price: 189,
    category: 'tacos',
    image: alambreQuesoImg,
    badge: '🔥 El Más Pedido',
    featured: true
  },
  {
    id: 'alambre-tradicional',
    name: 'Alambre Tradicional (Bistec, Longaniza o Pollo)',
    description: 'Carne a elección con pimientos salteados, cebolla, tocino, jamón y mucho queso fundido.',
    price: 159,
    category: 'tacos',
    image: alambreQuesoImg
  },
  {
    id: 'sincronizada-bistec',
    name: 'Sincronizada de Bistec con Aguacate',
    description: 'Tortilla grande de harina rellena de jamón, queso gratinado, bistec de res y aguacate fresco.',
    price: 139,
    category: 'tacos',
    image: alambreQuesoImg
  },
  {
    id: 'queso-fundido-arrachera',
    name: 'Queso Fundido con Arrachera',
    description: 'Mezcla generosa de quesos al gratín con fajitas de arrachera, acompañado de tortillas de harina calientes.',
    price: 139,
    category: 'tacos',
    image: alambreQuesoImg,
    badge: '🧀 Gratinado'
  },
  {
    id: 'choriqueso',
    name: 'Choriqueso al Carbón',
    description: 'Longaniza a la plancha bien doradita con queso fundido y tortillas.',
    price: 159,
    category: 'tacos',
    image: alambreQuesoImg
  },
  {
    id: 'champiqueso',
    name: 'Champiqueso con Champiñones',
    description: 'Champiñones frescos salteados con abundante queso fundido aromático.',
    price: 139,
    category: 'tacos',
    image: alambreQuesoImg
  },

  // ── 10. TRADICIONALES & SANDWICHES (Pág 10) ──
  {
    id: 'trad-enchiladas-suizas',
    name: 'Enchiladas Suizas al Gratín (4 pzas)',
    description: '4 exquisitas enchiladas rellenas de pollo deshebrado, bañadas en cremosa salsa suiza verde y queso manchego gratinado al horno.',
    price: 145,
    category: 'tradicionales',
    image: chilanguillaImg,
    badge: '🧀 Gratinadas',
    prepTime: '15-25 min'
  },
  {
    id: 'trad-flautas-ahogadas',
    name: 'Flautas Ahogadas en Salsa Verde (4 pzas)',
    description: '4 flautas doradas y crujientes (pollo, carne o papa), bañadas en rica salsa verde tibia, crema y queso fresco.',
    price: 145,
    category: 'tradicionales',
    image: chilanguillaImg,
    prepTime: '15-25 min'
  },
  {
    id: 'trad-enfrijoladas',
    name: 'Enfrijoladas con Longaniza (4 pzas)',
    description: '4 tortillas rellenas de pollo bañadas en salsa de frijol negro sazonada, servidas con cebolla, queso, crema y longaniza doradita.',
    price: 145,
    category: 'tradicionales',
    image: chilanguillaImg,
    prepTime: '15-25 min'
  },
  {
    id: 'trad-chilanguilla',
    name: 'Chilanguilla con Costilla',
    description: 'Jugosa costilla montada sobre tradicionales chilaquiles verdes con crema, queso y cebolla morada.',
    price: 135,
    category: 'tradicionales',
    image: chilanguillaImg,
    badge: '👑 Especialidad',
    featured: true,
    prepTime: '15-25 min'
  },
  {
    id: 'trad-chilanguilla-arrachera',
    name: 'Chilanguilla con Arrachera Sonorense',
    description: 'Nuestros chilaquiles verdes crujientes coronados con tierna arrachera a las brasas.',
    price: 175,
    category: 'tradicionales',
    image: chilanguillaImg,
    prepTime: '15-25 min'
  },
  {
    id: 'sand-choripan',
    name: 'Choripán en Pan Chapata',
    description: 'Delicioso pan chapata artesanal con chorizo argentino, chimichurri casero, philadelphia, queso manchego y papas gajo.',
    price: 155,
    category: 'tradicionales',
    image: briocheCheeseImg,
    badge: '🇦🇷 Porteño',
    featured: true
  },
  {
    id: 'sand-pepito-arrachera',
    name: 'Pepito de Arrachera en Chapata',
    description: 'Pan chapata relleno de arrachera al carbón, frijoles refritos, manchego, aguacate fresco y papas gajo.',
    price: 185,
    category: 'tradicionales',
    image: briocheCheeseImg,
    badge: '🥩 Clásico'
  },
  {
    id: 'sand-argentino-mix',
    name: 'Argentino Mix en Chapata',
    description: 'Fajitas de arrachera, chorizo argentino y chistorra en pan chapata con aguacate, manchego, chimichurri y papas gajo.',
    price: 195,
    category: 'tradicionales',
    image: briocheCheeseImg,
    badge: '🔥 Trilogía Brasa'
  },
  {
    id: 'sand-phily',
    name: 'Sandwich Phily Cheese Steak',
    description: 'Pan chapata relleno de fajitas de arrachera, pimientos rojos salteados, philadelphia, queso manchego y cheddar derretido con papas gajo.',
    price: 199,
    category: 'tradicionales',
    image: briocheCheeseImg,
    badge: '🧀 Extra Queso'
  },

  // ── 11. ESPECIALIDADES (Pág 11) ──
  {
    id: 'esp-lasagna-popeye',
    name: 'Lasagna Popeye de Carne y Espinacas',
    description: 'Lasagna casera rellena de carne boloñesa y espinacas con queso gouda gratinado y ensalada verde de guarnición.',
    price: 199,
    category: 'especialidades',
    image: briocheCheeseImg,
    prepTime: '25-35 min'
  },
  {
    id: 'esp-milanesa-napolitana',
    name: 'Milanesa Napolitana con Spaghetti',
    description: 'Suprema de pollo empanizada en salsa italiana y queso gratinado, acompañada de spaghetti al pomodoro.',
    price: 219,
    category: 'especialidades',
    image: briocheCheeseImg,
    prepTime: '25-35 min'
  },
  {
    id: 'esp-brioche-grill-cheese',
    name: 'Brioche Grill Cheese Gourmet',
    description: 'Pan brioche tostado con queso gouda, americano y edam gratinados con salsa bechamel sedosa.',
    price: 189,
    category: 'especialidades',
    image: briocheCheeseImg,
    badge: '🥖 Brioche Fundido',
    featured: true
  },
  {
    id: 'esp-meatloaf-bon',
    name: 'Meatloaf-Bon Sonorense (340 g)',
    description: '340 g de molida selecta de sirloin sellada al carbón, montada sobre porción de spaghetti, con papa rallada a la mantequilla y guacamole.',
    price: 249,
    category: 'especialidades',
    image: parrilladaImg,
    badge: '🥩 Creación del Chef',
    featured: true
  },
  {
    id: 'esp-salmon-pesto',
    name: 'Salmón al Pesto y Almendras',
    description: 'Filete de salmón bañado en salsa pesto artesanal, trozos de almendra tostada y limón, con arroz y verduras salteadas.',
    price: 279,
    category: 'especialidades',
    image: salmonGourmetImg,
    badge: '🐟 Salmón Premium'
  },
  {
    id: 'esp-salmon-costrado',
    name: 'Salmón Costrado en Ajonjolí Bicolor',
    description: 'Salmón marinado en balsámico y finas hierbas, con costra crujiente de ajonjolí bicolor, arroz y verduras a la mantequilla.',
    price: 279,
    category: 'especialidades',
    image: salmonGourmetImg
  },
  {
    id: 'esp-salmon-tamarindo',
    name: 'Salmón Glaseado Pasilla y Tamarindo',
    description: 'Salmón glaseado con salsa agridulce de pasilla y tamarindo, servido con verduras salteadas en mantequilla y arroz blanco.',
    price: 279,
    category: 'especialidades',
    image: salmonGourmetImg,
    badge: '⭐ Toque Mexicano'
  },

  // ── 12. CREPAS DULCES & SALADAS (Pág 12) ──
  {
    id: 'crepa-lotus-roll',
    name: 'Crepa Lotus Roll Biscoff',
    description: 'Crepa rellena de crema Biscoff, trozos de galleta Lotus crujiente, un toque de philadelphia y chocolate blanco sedoso.',
    price: 129,
    category: 'crepas',
    image: crepaDulceImg,
    badge: '🍪 La Más Famosa',
    featured: true
  },
  {
    id: 'crepa-red-berry',
    name: 'Crepa Red Berry con Frutos Rojos',
    description: 'Trozos de fresas, frambuesas y zarzamoras frescas con queso philadelphia, crema chantilly y lechera.',
    price: 109,
    category: 'crepas',
    image: crepaDulceImg
  },
  {
    id: 'crepa-mariaelena',
    name: 'Crepa Mariaelena (Gansito & Chocorol)',
    description: 'Trozos de Gansito y Chocorol, mermelada de piña, trozos de fresa natural y salsa de chocolate.',
    price: 139,
    category: 'crepas',
    image: crepaDulceImg,
    badge: '🍫 Antojo Extremo'
  },
  {
    id: 'crepa-marquesilla',
    name: 'Crepa Estilo Marquesilla',
    description: 'Fresa o plátano, Nutella generosa, queso Edam de bola y virutas de chocolate Turin.',
    price: 99,
    category: 'crepas',
    image: crepaDulceImg
  },
  {
    id: 'crepa-salada-mulata',
    name: 'Crepa Mulata de Arrachera',
    description: 'Crepa salada rellena de trozos de arrachera al carbón, frijoles refritos, queso panela y salsa de cilantro.',
    price: 109,
    category: 'crepas',
    image: crepaDulceImg,
    badge: '🥞 Salada Suprema'
  },
  {
    id: 'crepa-salada-cuatro-quesos',
    name: 'Crepa 4 Quesos en Salsa Alfredo',
    description: 'Queso de cabra, provoleta, queso crema y manchego derretidos, montada en salsa alfredo.',
    price: 99,
    category: 'crepas',
    image: crepaDulceImg
  },

  // ── 13. POSTRES CASEROS (Pág 13) ──
  {
    id: 'postre-flan-baileys',
    name: 'Flan Napolitano al Baileys',
    description: 'Flan horneado casero, bañado con crema de Baileys irlandés, cajeta o rompope, salpicado con nuez tostada.',
    price: 69,
    category: 'postres',
    image: cheesecakeImg,
    badge: '🍮 Horneado'
  },
  {
    id: 'postre-cookie-york',
    name: 'Cookie York New York (110 g)',
    description: 'Galleta gigante con mucho sabor a mantequilla al estilo New York. Sabores: Nuez, Choco-avellana, Red Velvet o Lotus.',
    price: 89,
    category: 'postres',
    image: cookieYorkImg,
    badge: '🍪 Gigante 110g',
    featured: true
  },
  {
    id: 'postre-helado-frito',
    name: 'Helado Frito al Tempura',
    description: 'Esfera rellena de helado napolitano capeada al tempura y frita al momento con chocolate y canela.',
    price: 89,
    category: 'postres',
    image: cheesecakeImg,
    badge: '🔥 Frito y Frío'
  },
  {
    id: 'postre-cheesecake',
    name: 'Cheesecake de la Casa',
    description: 'Cremoso cheesecake estilo NY. Variedades: Zarzamora, Capuchino, Oreo, Lotus o Nutella.',
    price: 85,
    category: 'postres',
    image: cheesecakeImg
  },
  {
    id: 'postre-porfirio-black',
    name: 'Porfirio Black (Panqué Frito)',
    description: 'Trozos de panqué frito sabor a plátano, acompañado de bola de helado y chocolate blanco.',
    price: 79,
    category: 'postres',
    image: cookieYorkImg
  },

  // ── 14. CAFETERÍA & LATTES FRÍOS (Pág 14) ──
  {
    id: 'cafe-latte-lotus',
    name: 'Latte Frío Lotus Biscoff',
    description: 'Crema Biscoff, espresso recién extraído y trozos crujientes de galleta Lotus con leche espumada fría.',
    price: 69,
    category: 'cafeteria',
    image: latteLotusImg,
    badge: '☕ Especialidad',
    featured: true
  },
  {
    id: 'cafe-latte-mazapan',
    name: 'Latte Frío de Mazapán',
    description: 'Crema de cacahuate artesanal, espresso y trozos de mazapán tradicional.',
    price: 69,
    category: 'cafeteria',
    image: latteAzulImg
  },
  {
    id: 'cafe-latte-salted-caramel',
    name: 'Latte Frío Salted Caramel',
    description: 'Caramelo salado artesanal, shot de espresso y un toque de sal marina con leche fría.',
    price: 69,
    category: 'cafeteria',
    image: latteLotusImg
  },
  {
    id: 'cafe-capuccino-sabor',
    name: 'Capuccino con Sabor (Vainilla / Irish / Avellana)',
    description: 'Espresso con leche texturizada y jarabe a elección: Vainilla francesa, Irish cream o Avellana.',
    price: 65,
    category: 'cafeteria',
    image: latteAzulImg
  },
  {
    id: 'cafe-americano',
    name: 'Café Americano de Grano',
    description: 'Extracción clásica de café de altura tostado medio.',
    price: 45,
    category: 'cafeteria',
    image: latteAzulImg
  },
  {
    id: 'cafe-chai-latte',
    name: 'Té Chaí Especiado (Original o Vainilla)',
    description: 'Bebida hindú a base de té negro, canela, cardamomo y especias con leche sedosa.',
    price: 69,
    category: 'cafeteria',
    image: latteAzulImg
  },

  // ── 15. BEBIDAS, MOCKTAILS & SODAS (Págs 15, 16, 17) ──
  {
    id: 'bebida-mocktail-tropifresco',
    name: 'Mocktail Tropifresco (Sin Alcohol)',
    description: 'Crema de coco sedosa, jugo natural de piña y hojas frescas de hierbabuena.',
    price: 89,
    category: 'bebidas',
    image: mocktailsImg,
    badge: '🥥 Refrescante',
    featured: true
  },
  {
    id: 'bebida-mocktail-pocima',
    name: 'Mocktail Pócima de Autor',
    description: 'Bebida cítrica con jugo fresco de naranja, un toque de limón, albahaca y Ginger Ale.',
    price: 89,
    category: 'bebidas',
    image: mocktailsImg
  },
  {
    id: 'bebida-mocktail-albahaca-boom',
    name: 'Mocktail Albahaca Boom',
    description: 'Frambuesa y hojas de albahaca fresca maceradas con jugo de limón y un toque burbujeante de ginger ale.',
    price: 89,
    category: 'bebidas',
    image: mocktailsImg,
    badge: '🌿 Autor'
  },
  {
    id: 'bebida-mocktail-carina',
    name: 'Mocktail Cariña ("Sex on the Beach" Sin Alcohol)',
    description: 'Jugo de arándano, durazno, jugo de naranja y jarabe de granadina.',
    price: 89,
    category: 'bebidas',
    image: mocktailsImg
  },
  {
    id: 'bebida-soda-italiana',
    name: 'Soda Italiana con Perlas Explosivas',
    description: 'Mezcla dulce mineral con toque de sabor y explosivas perlas de fruta que revientan en boca (Manzana Verde, Fresa, Kiwi, Cereza, Frambuesa, Blueberry, Piña o Mango).',
    price: 69,
    category: 'bebidas',
    image: sodaItalianaImg,
    badge: '🫧 Con Perlas'
  },
  {
    id: 'bebida-chamoyada',
    name: 'Chamoyada con Barra de Tamaroca',
    description: 'Mezcla frappé de fruta natural con chamoy, chile en polvo y una barra entera de tamaroca picosita (Mango, Limón, Fresa o Piña).',
    price: 79,
    category: 'bebidas',
    image: chamoyadaImg,
    badge: '🌶️ Picosita'
  },
  {
    id: 'bebida-frappe-espresso',
    name: 'Frappé Choco Moka con Espresso',
    description: '450 ml de cremosa mezcla frappé de chocolate con carga completa de café espresso.',
    price: 89,
    category: 'bebidas',
    image: frappeEspressoImg
  },
  {
    id: 'bebida-malteada-gansito',
    name: 'Malteada Especial Gansito / Baileys',
    description: 'Batido espeso y cremoso con helado premium y trozos de Gansito o Baileys.',
    price: 109,
    category: 'bebidas',
    image: malteadaFresaImg,
    badge: '🥤 Súper Espesa'
  },
  {
    id: 'bebida-agua-fresca-vaso',
    name: 'Agua de Sabor del Día (500 ml)',
    description: 'Agua fresca natural preparada diariamente: Horchata casera, Jamaica fresca o agua de fruta del día.',
    price: 42,
    category: 'bebidas',
    image: mocktailsImg
  },
  {
    id: 'bebida-agua-fresca-jarra',
    name: 'Jarra de Agua de Sabor (1.8 Litros)',
    description: 'Jarra grande para toda la mesa: Horchata, Jamaica o fruta de temporada.',
    price: 139,
    category: 'bebidas',
    image: mocktailsImg
  },
  {
    id: 'bebida-refresco-600',
    name: 'Refresco Embotellado (600 ml)',
    description: 'Coca-Cola regular, Coca Zero, Sprite, Sidral Mundet, Delaware Punch, Fanta o Topo Chico.',
    price: 55,
    category: 'bebidas',
    image: sodaItalianaImg
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function AaahCarbonMenu() {
  // ── Estados de Interfaz ──
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ── Favoritos en localStorage ──
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aaah_carbon_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aaah_carbon_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (productId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(exists ? 'Eliminado de favoritos' : '¡Guardado en favoritos! ❤️');
      return updated;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // ── Carrito de Compras (Paso 1, 2 y Éxito) ──
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aaah_carbon_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aaah_carbon_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<1 | 2 | 3>(1); // 1: productos, 2: datos, 3: éxito

  // ── Datos de Entrega del Cliente ──
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'recoger' as 'recoger' | 'domicilio',
    address: '',
    paymentMethod: 'efectivo' as 'efectivo' | 'transferencia' | 'tarjeta',
    cashAmount: '',
    notes: '',
  });

  // ── Modal de Personalización de Producto ──
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [customTerm, setCustomTerm] = useState('tres_cuartos');
  const [customSide, setCustomSide] = useState('francesa');
  const [customSauce, setCustomSauce] = useState('bbq');
  const [customExtras, setCustomExtras] = useState<CustomOption[]>([]);
  const [customNotes, setCustomNotes] = useState('');
  const [customQuantity, setCustomQuantity] = useState(1);

  const openCustomModal = (prod: Product) => {
    setCustomizingProduct(prod);
    setCustomTerm('tres_cuartos');
    setCustomSide('francesa');
    setCustomSauce('bbq');
    setCustomExtras([]);
    setCustomNotes('');
    setCustomQuantity(1);
  };

  const addCustomizedToCart = () => {
    if (!customizingProduct) return;

    let unitPrice = customizingProduct.price;
    const extrasTotal = customExtras.reduce((sum, e) => sum + e.price, 0);
    unitPrice += extrasTotal;

    const lineId = `${customizingProduct.id}-${Date.now()}`;
    const newItem: CartItem = {
      lineId,
      productId: customizingProduct.id,
      name: customizingProduct.name,
      basePrice: customizingProduct.price,
      unitPrice,
      quantity: customQuantity,
      image: customizingProduct.image,
      category: customizingProduct.category,
      meatTerm: customizingProduct.customType === 'corte' ? MEAT_TERMS.find(t => t.id === customTerm)?.name : undefined,
      sideChoice: (customizingProduct.customType === 'burger' || customizingProduct.customType === 'combo') ? POTATO_CHOICES.find(p => p.id === customSide)?.name : undefined,
      selectedSauce: customizingProduct.customType === 'alitas' ? WING_SAUCES.find(s => s.id === customSauce)?.name : undefined,
      extras: customExtras.length > 0 ? customExtras : undefined,
      specialNotes: customNotes.trim() ? customNotes.trim() : undefined,
    };

    setCart(prev => [...prev, newItem]);
    setCustomizingProduct(null);
    showToast(`¡Agregado ${customQuantity}x ${customizingProduct.name}! 🛍️`);
  };

  const addToCartDirect = (prod: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (prod.canCustomize) {
      openCustomModal(prod);
      return;
    }
    const lineId = `${prod.id}-${Date.now()}`;
    const newItem: CartItem = {
      lineId,
      productId: prod.id,
      name: prod.name,
      basePrice: prod.price,
      unitPrice: prod.price,
      quantity: 1,
      image: prod.image,
      category: prod.category,
    };
    setCart(prev => [...prev, newItem]);
    showToast(`¡Agregado: ${prod.name}! 🛒`);
  };

  const updateQuantity = (lineId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.lineId === lineId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (lineId: string) => {
    setCart(prev => prev.filter(item => item.lineId !== lineId));
  };

  // ── Totales y Cálculos ──
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cashChange = useMemo(() => {
    const cash = parseFloat(customerInfo.cashAmount) || 0;
    return cash > cartTotal ? cash - cartTotal : 0;
  }, [customerInfo.cashAmount, cartTotal]);

  // ── Filtrado de Productos ──
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;

    if (showOnlyFavorites) {
      list = list.filter(p => favorites.includes(p.id));
    } else if (selectedCategory !== 'todos') {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      list = list.filter(p => {
        const nameNorm = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const descNorm = p.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return nameNorm.includes(q) || descNorm.includes(q);
      });
    }

    return list;
  }, [selectedCategory, showOnlyFavorites, searchQuery, favorites]);

  // ── Checkout por WhatsApp (Regla Estricta: 500ms + window.location.href) ──
  const handleSendOrder = () => {
    if (!customerInfo.name.trim()) {
      alert('Por favor, ingresa tu nombre completo.');
      return;
    }
    if (!customerInfo.phone.trim()) {
      alert('Por favor, ingresa tu número de WhatsApp para confirmar el pedido.');
      return;
    }
    if (customerInfo.deliveryMethod === 'domicilio' && !customerInfo.address.trim()) {
      alert('Por favor, ingresa tu dirección completa de entrega (calle, número y colonia).');
      return;
    }

    let text = `🔥 *NUEVO PEDIDO — AAAH! CARBÓN (NARVARTE)* 🔥\n`;
    text += `──────────────────────\n`;
    text += `👤 *Cliente:* ${customerInfo.name}\n`;
    text += `📱 *WhatsApp:* ${customerInfo.phone}\n`;
    text += `📍 *Método:* ${customerInfo.deliveryMethod === 'recoger' ? '🏪 Recoger en Sucursal (Pickup)' : '🛵 Envío a Domicilio'}\n`;

    if (customerInfo.deliveryMethod === 'domicilio') {
      text += `🏠 *Dirección:* ${customerInfo.address}\n`;
    }

    text += `💳 *Forma de Pago:* `;
    if (customerInfo.paymentMethod === 'efectivo') {
      text += `Efectivo`;
      if (customerInfo.cashAmount) {
        text += ` (Paga con $${customerInfo.cashAmount} | Cambio: $${cashChange.toFixed(2)})`;
      }
    } else if (customerInfo.paymentMethod === 'transferencia') {
      text += `Transferencia Bancaria (BBVA)`;
    } else {
      text += `Tarjeta contra entrega`;
    }
    text += `\n`;

    if (customerInfo.notes.trim()) {
      text += `📝 *Notas:* ${customerInfo.notes}\n`;
    }

    text += `──────────────────────\n`;
    text += `📋 *DETALLE DEL PEDIDO:*\n`;

    cart.forEach(item => {
      text += `• *${item.quantity}x* ${item.name} — $${(item.unitPrice * item.quantity).toFixed(2)}\n`;
      if (item.meatTerm) text += `   🥩 Término: ${item.meatTerm}\n`;
      if (item.sideChoice) text += `   🍟 Papas: ${item.sideChoice}\n`;
      if (item.selectedSauce) text += `   🍗 Salsa: ${item.selectedSauce}\n`;
      if (item.extras && item.extras.length > 0) {
        text += `   ➕ Extras: ${item.extras.map(e => `${e.name} (+$${e.price})`).join(', ')}\n`;
      }
      if (item.specialNotes) text += `   ⚠️ Nota cocina: ${item.specialNotes}\n`;
    });

    text += `──────────────────────\n`;
    text += `💰 *TOTAL A PAGAR: $${cartTotal.toFixed(2)} MXN*\n\n`;
    text += `_¡Gracias por su preferencia!_`;

    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${clientConfig.whatsappNumber}&text=${encoded}`;

    // Paso 3 de éxito antes de redirigir
    setCartStep(3);

    setTimeout(() => {
      window.location.href = whatsappUrl;
      // Limpieza preventiva
      setCart([]);
      setCustomerInfo({
        name: '',
        phone: '',
        deliveryMethod: 'recoger',
        address: '',
        paymentMethod: 'efectivo',
        cashAmount: '',
        notes: '',
      });
    }, 600);
  };

  const copyClabe = () => {
    navigator.clipboard.writeText(bankInfo.clabe);
    setCopiedBank(true);
    showToast('¡CLABE copiada al portapapeles! 📋');
    setTimeout(() => setCopiedBank(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#121110] text-stone-100 font-sans selection:bg-[#FF6A00] selection:text-white pb-24 md:pb-12">
      
      {/* ── Toast Flotante ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#FF6A00] text-white px-5 py-2.5 rounded-full font-medium text-sm shadow-xl shadow-orange-950/40 flex items-center gap-2 border border-orange-400/30 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER PRINCIPAL STICKY GLASSMORPHISM ── */}
      <header className="sticky top-0 z-40 bg-[#121110]/90 backdrop-blur-md border-b border-stone-800/80 transition-all duration-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Marca */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full bg-stone-900 border border-orange-500/40 p-1 flex items-center justify-center overflow-hidden shadow-lg shadow-orange-500/10">
              <img src={logoImg} alt="AAAH! CARBÓN" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg md:text-xl tracking-tight text-white flex items-center gap-1">
                  AAAH! <span className="text-[#FF6A00]">CARBÓN</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#7A873B]/20 text-[#A3B84D] border border-[#7A873B]/40">
                  Narvarte
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">Cocina de brasa y tradicional sonora</p>
            </div>
          </div>

          {/* Acciones Header (Favoritos, Búsqueda, Carrito) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Buscador Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2.5 rounded-xl border transition-all ${
                isSearchOpen || searchQuery
                  ? 'bg-[#FF6A00] text-white border-orange-400'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
              }`}
              title="Buscar platillo"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Filtro Favoritos */}
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                showOnlyFavorites
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950/30'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
              }`}
              title="Ver favoritos"
            >
              <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-current' : ''}`} />
              {favorites.length > 0 && (
                <span className="text-xs font-bold px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Carrito Button */}
            <button
              onClick={() => {
                setIsCartOpen(true);
                setCartStep(1);
              }}
              className="relative bg-gradient-to-r from-[#FF6A00] to-[#FA8400] hover:from-[#E05500] hover:to-[#E57200] text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-950/40 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Pedido</span>
              <span className="text-sm font-black bg-black/30 px-2 py-0.5 rounded-lg">
                ${cartTotal.toFixed(0)}
              </span>
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-black text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Buscador Desplegable en Móvil/Desktop */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-stone-800 bg-[#161412] px-4 py-2.5 overflow-hidden"
            >
              <div className="max-w-xl mx-auto relative flex items-center">
                <Search className="w-4 h-4 absolute left-3 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar cortes, hamburguesas, pizzas, tacos, crepas..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-900 border border-stone-700 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#FF6A00]"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-stone-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO BANNER DE ALTA GAMA ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C1A17] via-[#161412] to-[#121110] border-b border-stone-800/60 pt-6 pb-8 px-4">
        {/* Luces de Brasa en Fondo */}
        <div className="absolute top-0 right-10 w-72 h-72 bg-[#FF6A00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-[#7A873B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Textos y Badges */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-[#FF6A00]" />
              <span>Cocina de Brasa & Tradicional Sonora</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              ¡Para todos los <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] via-[#FA8400] to-[#FFB800]">
                paladares exigentes!
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-xl font-normal">
              Más de 120 platillos preparados a la leña y al carbón sonorense: hamburguesas gourmet de sirloin, cortes premium de 300g, pizzas al horno, parrilladas, tacos, crepas y coctelería sin alcohol.
            </p>

            {/* Badges de Confianza / Horario */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs text-stone-400">
              <span className="flex items-center gap-1.5 bg-stone-900/80 px-3 py-1.5 rounded-lg border border-stone-800">
                <Clock className="w-3.5 h-3.5 text-[#A3B84D]" />
                Mar - Dom: 1:30 PM - 10:00 PM
              </span>
              <span className="flex items-center gap-1.5 bg-stone-900/80 px-3 py-1.5 rounded-lg border border-stone-800">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                Colonia Narvarte, CDMX
              </span>
              <span className="flex items-center gap-1.5 bg-stone-900/80 px-3 py-1.5 rounded-lg border border-stone-800 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Pedidos por WhatsApp
              </span>
            </div>
          </div>

          {/* Imagen Destacada del Hero */}
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
            <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-orange-500/30 shadow-2xl shadow-orange-950/50 group">
              <img
                src={parrilladaImg}
                alt="Parrilladas al carbón AAAH! CARBÓN"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-orange-400/30">
                  Especialidad de la Casa
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1">Parrillada Don Fer (1.18 kg)</h3>
                <p className="text-xs text-stone-300">Arrachera, chorizo argentino, chistorra y 1kg de cortes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BARRA DE CATEGORÍAS (SCROLL HORIZONTAL TÁCTIL) ── */}
      <nav className="sticky top-[61px] z-30 bg-[#141210]/95 backdrop-blur-md border-b border-stone-800/80 py-3 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id && !showOnlyFavorites;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setShowOnlyFavorites(false);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 border ${
                  isActive
                    ? 'bg-[#FF6A00] text-white border-orange-400 shadow-lg shadow-orange-950/40 scale-[1.02]'
                    : 'bg-stone-900/90 text-stone-300 border-stone-800 hover:border-stone-700 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {cat.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold uppercase ${
                    isActive ? 'bg-white text-[#FF6A00]' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── CUADRÍCULA DE PLATILLOS (CATÁLOGO) ── */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Título de sección activa */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>
                {showOnlyFavorites
                  ? '❤️ Tus Platillos Favoritos'
                  : CATEGORIES.find(c => c.id === selectedCategory)?.name}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700">
                {filteredProducts.length} opciones
              </span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Todos los ingredientes se pesan en crudo. Todo cambio o ingrediente extra podrá sumar costo.
            </p>
          </div>
        </div>

        {/* Estado Vacío */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 px-4 bg-stone-900/40 rounded-3xl border border-stone-800 my-4">
            <UtensilsCrossed className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-300">No encontramos platillos</h3>
            <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
              {showOnlyFavorites
                ? 'Aún no has agregado favoritos. Da clic en el corazón ❤️ de cualquier platillo para guardarlo.'
                : 'Intenta con otro término de búsqueda o selecciona otra categoría.'}
            </p>
            {(searchQuery || showOnlyFavorites) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowOnlyFavorites(false);
                  setSelectedCategory('todos');
                }}
                className="mt-4 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Ver todo el menú
              </button>
            )}
          </div>
        )}

        {/* Grid de Productos con Micro-Animaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map(product => {
            const isFav = favorites.includes(product.id);

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group relative bg-[#1A1816] hover:bg-[#201D19] border border-stone-800/80 hover:border-orange-500/40 rounded-2xl overflow-hidden shadow-lg shadow-black/40 transition-all flex flex-col justify-between"
              >
                {/* Cabecera de la tarjeta con imagen */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] via-transparent to-black/30" />

                  {/* Badge de platillo */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[#FF6A00] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md">
                      {product.badge}
                    </span>
                  )}

                  {/* Tiempo de preparación si aplica */}
                  {product.prepTime && (
                    <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-[#A3B84D] text-[10px] font-bold px-2 py-0.5 rounded border border-[#7A873B]/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {product.prepTime}
                    </span>
                  )}

                  {/* Botón Favorito */}
                  <button
                    onClick={e => toggleFavorite(product.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white transition-all active:scale-90"
                    title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? 'text-rose-500 fill-rose-500' : 'text-stone-300'
                      }`}
                    />
                  </button>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1.5 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Footer de Tarjeta: Precio y CTA */}
                  <div className="pt-4 mt-3 border-t border-stone-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">Precio</span>
                      <span className="text-lg font-black text-emerald-400">
                        ${product.price} <span className="text-xs font-normal text-stone-400">MXN</span>
                      </span>
                    </div>

                    <button
                      onClick={e => addToCartDirect(product, e)}
                      className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-[#FF6A00] text-stone-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      {product.canCustomize ? (
                        <>
                          <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400 group-hover:text-white" />
                          <span>Personalizar</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* ── MODAL BOTTOM-SHEET DE PERSONALIZACIÓN INTERACTIVA ── */}
      <AnimatePresence>
        {customizingProduct && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="bg-[#1A1816] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-stone-800 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Encabezado Modal */}
              <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-[#161412]">
                <div className="flex items-center gap-3">
                  <img
                    src={customizingProduct.image}
                    alt={customizingProduct.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-700"
                  />
                  <div>
                    <h3 className="font-black text-white text-sm sm:text-base leading-tight">
                      {customizingProduct.name}
                    </h3>
                    <p className="text-xs text-emerald-400 font-bold">
                      Base: ${customizingProduct.price} MXN
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCustomizingProduct(null)}
                  className="p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cuerpo de Opciones Scrollable */}
              <div className="p-5 overflow-y-auto space-y-5 text-sm">
                
                {/* Término de la carne si es corte */}
                {customizingProduct.customType === 'corte' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                      🥩 Término de la carne (Al Carbón)
                    </label>
                    <div className="space-y-2">
                      {MEAT_TERMS.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setCustomTerm(t.id)}
                          className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                            customTerm === t.id
                              ? 'bg-orange-500/20 border-[#FF6A00] text-white font-bold'
                              : 'bg-stone-900 border-stone-800 text-stone-300'
                          }`}
                        >
                          <span>{t.name}</span>
                          {customTerm === t.id && <Check className="w-4 h-4 text-[#FF6A00]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selección de Salsa para Alitas / Boneless */}
                {customizingProduct.customType === 'alitas' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                      🍗 Elige tu Salsa para Bañar
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {WING_SAUCES.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setCustomSauce(s.id)}
                          className={`p-3 rounded-xl text-left border flex items-center justify-between transition-all text-xs ${
                            customSauce === s.id
                              ? 'bg-orange-500/20 border-[#FF6A00] text-white font-bold'
                              : 'bg-stone-900 border-stone-800 text-stone-300'
                          }`}
                        >
                          <span>{s.name}</span>
                          {customSauce === s.id && <Check className="w-4 h-4 text-[#FF6A00]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selección de Papas para Hamburguesas o Combos */}
                {(customizingProduct.customType === 'burger' || customizingProduct.customType === 'combo') && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                      🍟 Guarnición de Papas
                    </label>
                    <div className="space-y-2">
                      {POTATO_CHOICES.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setCustomSide(p.id)}
                          className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                            customSide === p.id
                              ? 'bg-orange-500/20 border-[#FF6A00] text-white font-bold'
                              : 'bg-stone-900 border-stone-800 text-stone-300'
                          }`}
                        >
                          <span>{p.name}</span>
                          {customSide === p.id && <Check className="w-4 h-4 text-[#FF6A00]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extras Opcionales */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                    ➕ Adicionales y Upgrades
                  </label>
                  <div className="space-y-2">
                    {(customizingProduct.customType === 'burger' ? EXTRAS_BURGER : EXTRAS_GENERAL).map(extra => {
                      const isSelected = customExtras.some(e => e.name === extra.name);
                      return (
                        <button
                          key={extra.name}
                          onClick={() => {
                            if (isSelected) {
                              setCustomExtras(customExtras.filter(e => e.name !== extra.name));
                            } else {
                              setCustomExtras([...customExtras, extra]);
                            }
                          }}
                          className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                              : 'bg-stone-900 border-stone-800 text-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-stone-600'
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <span>{extra.name}</span>
                          </div>
                          <span className="text-emerald-400 font-extrabold">+${extra.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notas de Cocina */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    📝 Indicaciones para cocina (opcional)
                  </label>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={e => setCustomNotes(e.target.value)}
                    placeholder="Ej. Sin cebolla, aderezo aparte, salsa bien doradita..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#FF6A00]"
                  />
                </div>

                {/* Selector de Cantidad */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-stone-400">Cantidad de piezas:</span>
                  <div className="flex items-center gap-3 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
                    <button
                      onClick={() => setCustomQuantity(Math.max(1, customQuantity - 1))}
                      className="p-1 text-stone-400 hover:text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-extrabold text-base w-6 text-center">{customQuantity}</span>
                    <button
                      onClick={() => setCustomQuantity(customQuantity + 1)}
                      className="p-1 text-stone-400 hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Modal con Total y Botón */}
              <div className="p-4 border-t border-stone-800 bg-[#161412] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Subtotal</span>
                  <span className="text-xl font-black text-emerald-400">
                    ${(
                      (customizingProduct.price + customExtras.reduce((s, e) => s + e.price, 0)) *
                      customQuantity
                    ).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={addCustomizedToCart}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FA8400] hover:from-[#E05500] hover:to-[#E57200] text-white font-bold text-sm shadow-lg shadow-orange-950/50 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar al Pedido</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DRAWER LATERAL DEL CARRITO (OBLIGATORIO: 2 PASOS) ── */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#161412] w-full max-w-md h-full flex flex-col border-l border-stone-800 shadow-2xl"
            >
              {/* Header Carrito */}
              <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-[#121110]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FF6A00] flex items-center justify-center text-white">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base leading-tight">
                      Tu Pedido ({totalItemsCount})
                    </h3>
                    <span className="text-xs text-orange-400 font-medium">
                      Paso {cartStep} de 2: {cartStep === 1 ? 'Revisión de productos' : 'Datos de entrega'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── PASO 1: LISTA DE PRODUCTOS ── */}
              {cartStep === 1 && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                      <div className="text-center py-20 text-stone-500">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-stone-600" />
                        <p className="font-bold text-stone-300">Tu carrito está vacío</p>
                        <p className="text-xs text-stone-500 mt-1">Elige tus cortes y platillos favoritos del menú.</p>
                      </div>
                    ) : (
                      cart.map(item => (
                        <div
                          key={item.lineId}
                          className="bg-[#1C1A17] p-3 rounded-2xl border border-stone-800/80 flex items-start gap-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover border border-stone-700 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-emerald-400 font-extrabold">
                              ${item.unitPrice.toFixed(2)} MXN
                            </p>

                            {/* Desglose de variantes seleccionadas */}
                            {item.meatTerm && (
                              <p className="text-[11px] text-orange-300">🥩 {item.meatTerm}</p>
                            )}
                            {item.sideChoice && (
                              <p className="text-[11px] text-stone-400">🍟 {item.sideChoice}</p>
                            )}
                            {item.selectedSauce && (
                              <p className="text-[11px] text-orange-400">🍗 Salsa: {item.selectedSauce}</p>
                            )}
                            {item.extras && item.extras.length > 0 && (
                              <p className="text-[10px] text-stone-400 truncate">
                                ➕ {item.extras.map(e => e.name).join(', ')}
                              </p>
                            )}
                            {item.specialNotes && (
                              <p className="text-[10px] text-amber-300 italic">"{item.specialNotes}"</p>
                            )}

                            {/* Controles de Cantidad */}
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-800">
                              <div className="flex items-center gap-2 bg-stone-900 px-2 py-1 rounded-lg border border-stone-700">
                                <button
                                  onClick={() => updateQuantity(item.lineId, -1)}
                                  className="text-stone-400 hover:text-white"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.lineId, 1)}
                                  className="text-stone-400 hover:text-white"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.lineId)}
                                className="text-stone-500 hover:text-rose-400 p-1"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer Paso 1 */}
                  {cart.length > 0 && (
                    <div className="p-4 border-t border-stone-800 bg-[#121110] space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-stone-400">Total a pagar:</span>
                        <span className="text-2xl font-black text-emerald-400">
                          ${cartTotal.toFixed(2)} <span className="text-xs text-stone-400">MXN</span>
                        </span>
                      </div>
                      <button
                        onClick={() => setCartStep(2)}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FA8400] hover:from-[#E05500] hover:to-[#E57200] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50"
                      >
                        <span>Continuar con Datos de Entrega</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── PASO 2: DATOS DE ENTREGA & PAGO ── */}
              {cartStep === 2 && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                    
                    {/* Método de Entrega */}
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                        📍 Método de Entrega *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'recoger' })}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                            customerInfo.deliveryMethod === 'recoger'
                              ? 'bg-orange-500/20 border-[#FF6A00] text-white font-bold'
                              : 'bg-stone-900 border-stone-800 text-stone-400'
                          }`}
                        >
                          <Store className="w-5 h-5 text-orange-400" />
                          <span className="text-xs">Pickup / Sucursal</span>
                          <span className="text-[10px] text-stone-400">{clientConfig.pickupEstimate}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'domicilio' })}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                            customerInfo.deliveryMethod === 'domicilio'
                              ? 'bg-orange-500/20 border-[#FF6A00] text-white font-bold'
                              : 'bg-stone-900 border-stone-800 text-stone-400'
                          }`}
                        >
                          <Bike className="w-5 h-5 text-orange-400" />
                          <span className="text-xs">A Domicilio</span>
                          <span className="text-[10px] text-stone-400">{clientConfig.deliveryEstimate}</span>
                        </button>
                      </div>
                    </div>

                    {/* Nombre Completo */}
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                        👤 Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        placeholder="Ej. Roberto Martínez"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-[#FF6A00]"
                      />
                    </div>

                    {/* Teléfono / WhatsApp */}
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                        📱 Tu Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="Ej. 55 1234 5678"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-[#FF6A00]"
                      />
                    </div>

                    {/* Dirección (si es a domicilio) */}
                    {customerInfo.deliveryMethod === 'domicilio' && (
                      <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                          🏠 Dirección de Entrega (Calle, Núm, Colonia) *
                        </label>
                        <textarea
                          rows={2}
                          value={customerInfo.address}
                          onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                          placeholder="Calle, número exterior/interior, colonia y referencias..."
                          className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-[#FF6A00]"
                        />
                      </div>
                    )}

                    {/* Forma de Pago */}
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                        💳 Forma de Pago *
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'efectivo' })}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            customerInfo.paymentMethod === 'efectivo'
                              ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                              : 'bg-stone-900 border-stone-800 text-stone-400'
                          }`}
                        >
                          💵 Efectivo
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'transferencia' })}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            customerInfo.paymentMethod === 'transferencia'
                              ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                              : 'bg-stone-900 border-stone-800 text-stone-400'
                          }`}
                        >
                          🏦 BBVA
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'tarjeta' })}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            customerInfo.paymentMethod === 'tarjeta'
                              ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                              : 'bg-stone-900 border-stone-800 text-stone-400'
                          }`}
                        >
                          💳 Tarjeta
                        </button>
                      </div>

                      {/* Campo dinámico si es efectivo */}
                      {customerInfo.paymentMethod === 'efectivo' && (
                        <div className="mt-2.5 p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
                          <label className="text-xs text-stone-400 block">¿Con cuánto vas a pagar?</label>
                          <input
                            type="number"
                            value={customerInfo.cashAmount}
                            onChange={e => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })}
                            placeholder={`Ej. $${Math.ceil(cartTotal / 100) * 100}`}
                            className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-stone-700 text-white text-sm"
                          />
                          {cashChange > 0 && (
                            <p className="text-xs text-emerald-400 font-bold">
                              Tu cambio será de: ${cashChange.toFixed(2)} MXN
                            </p>
                          )}
                        </div>
                      )}

                      {/* Recuadro bancario si es transferencia */}
                      {customerInfo.paymentMethod === 'transferencia' && (
                        <div className="mt-2.5 p-3 rounded-xl bg-stone-900 border border-emerald-500/40 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-400">Datos para Transferir ({bankInfo.bankName})</span>
                            <button
                              type="button"
                              onClick={copyClabe}
                              className="text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded flex items-center gap-1"
                            >
                              {copiedBank ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedBank ? 'Copiada' : 'Copiar CLABE'}</span>
                            </button>
                          </div>
                          <p className="text-xs text-stone-300"><strong>CLABE:</strong> {bankInfo.clabe}</p>
                          <p className="text-xs text-stone-300"><strong>Titular:</strong> {bankInfo.accountHolder}</p>
                        </div>
                      )}
                    </div>

                    {/* Notas adicionales */}
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                        📝 Comentarios o referencias
                      </label>
                      <input
                        type="text"
                        value={customerInfo.notes}
                        onChange={e => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                        placeholder="Ej. Tocar timbre 4B, sin salsa en ensalada..."
                        className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-[#FF6A00]"
                      />
                    </div>
                  </div>

                  {/* Footer Paso 2 con Disparo a WhatsApp */}
                  <div className="p-4 border-t border-stone-800 bg-[#121110] space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>Total final:</span>
                      <span className="text-xl font-black text-emerald-400">${cartTotal.toFixed(2)} MXN</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCartStep(1)}
                        className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold"
                      >
                        Atrás
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOrder}
                        className="flex-1 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>Enviar Pedido por WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PASO 3: ÉXITO Y REDIRECCIÓN ── */}
              {cartStep === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-white">¡Preparando tu Comanda!</h3>
                  <p className="text-sm text-stone-400 max-w-xs">
                    Abriendo WhatsApp con tu pedido desglosado para el equipo de cocina de <strong>AAAH! CARBÓN</strong>...
                  </p>
                  <div className="w-8 h-8 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── BOTÓN FLOTANTE DE WHATSAPP ── */}
      <a
        href={`https://api.whatsapp.com/send?phone=${clientConfig.whatsappNumber}&text=${encodeURIComponent(
          '¡Hola AAAH! CARBÓN! Me gustaría hacer una consulta sobre su menú al carbón.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-30 p-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black shadow-xl shadow-emerald-950/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
        title="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>

      {/* ── FOOTER DE 3 COLUMNAS OFICIAL (REGLA ESTRICTA DE GUIA_COMPLETA) ── */}
      <footer className="mt-16 bg-[#0E0D0C] border-t border-stone-800/80 pt-12 pb-8 px-4 text-stone-400 text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-stone-800/80">
          
          {/* Columna 1: Logo & Descripción del Cliente */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="AAAH! CARBÓN" className="w-10 h-10 object-contain rounded-full bg-stone-900 p-0.5 border border-orange-500/30" />
              <span className="font-extrabold text-lg text-white tracking-tight">
                AAAH! <span className="text-[#FF6A00]">CARBÓN</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Cocina de brasa y tradicional sonorense. Más de 120 platillos preparados al fuego vivo para todos los paladares y ocasiones especiales.
            </p>
            <p className="text-xs text-stone-500">
              📍 Colonia Narvarte, Alcaldía Benito Juárez, Ciudad de México.
            </p>
          </div>

          {/* Columna 2: Horarios y Contacto Oficial */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#A3B84D]">
              Horarios & Pedidos
            </h4>
            <ul className="text-xs space-y-1.5 text-stone-300">
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span><strong>Martes a Domingo:</strong> 13:30 a 22:00 hrs.</span>
              </li>
              <li className="text-stone-500 pl-5.5">Lunes cerrado por descanso de personal.</li>
              <li className="flex items-center gap-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tel: {clientConfig.whatsappDisplay} · {clientConfig.secondaryPhone}</span>
              </li>
            </ul>
          </div>

          {/* Columna 3: Redes Sociales & Garantías */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-orange-400">
              Síguenos en Redes
            </h4>
            <div className="flex items-center gap-3">
              <a
                href={clientConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs text-stone-200 flex items-center gap-1.5 transition-all"
              >
                <span>📸 @{clientConfig.instagram}</span>
              </a>
              <a
                href={clientConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs text-stone-200 flex items-center gap-1.5 transition-all"
              >
                <span>📘 @{clientConfig.facebook}</span>
              </a>
            </div>

            <button
              onClick={() => setPrivacyModalOpen(true)}
              className="text-xs text-stone-500 hover:text-stone-300 underline block pt-1"
            >
              Aviso de Privacidad (LFPDPPP)
            </button>
          </div>
        </div>

        {/* Línea de Crédito Fija de Imagine & Stamp */}
        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} AAAH! CARBÓN Narvarte. Todos los derechos reservados.</p>
          <p className="font-semibold text-stone-400">
            Diseñado por <span className="text-[#FF6A00]">IMAGINE & STAMP</span> · Menús Digitales de Alta Conversión
          </p>
        </div>
      </footer>

      {/* ── MODAL DE AVISO DE PRIVACIDAD ── */}
      <AnimatePresence>
        {privacyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1816] max-w-lg w-full rounded-2xl p-6 border border-stone-800 shadow-2xl text-xs text-stone-300 space-y-3 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <h3 className="font-black text-white text-sm">Aviso de Privacidad Simplificado</h3>
                <button onClick={() => setPrivacyModalOpen(false)} className="text-stone-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p>
                En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong>, <strong>AAAH! CARBÓN Narvarte</strong> informa que los datos personales solicitados (nombre, teléfono y dirección) se utilizan única y exclusivamente para la gestión, elaboración y entrega de sus pedidos gastronómicos.
              </p>
              <p>
                Sus datos no serán transferidos, vendidos ni utilizados con fines de prospección comercial ajenos al servicio solicitado.
              </p>
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs mt-2"
              >
                Entendido y Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
