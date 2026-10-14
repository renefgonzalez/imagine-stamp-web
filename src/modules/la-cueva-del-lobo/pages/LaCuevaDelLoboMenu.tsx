// ── La Cueva del Lobo — Menú Digital Interactivo de Alta Gama ─────────────────
// Xochimilco, CDMX · Alimentos, Cerveza & Aventura · Pulquería Kāniixnii
// Carrito de 2 Pasos · WhatsApp Checkout · Bottom-Sheet · Mobile-First

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UtensilsCrossed, Beer, Flame, Sparkles, Search, ShoppingBag,
  MapPin, Clock, Phone, MessageCircle, ShieldCheck, ChevronRight,
  Heart, X, Check, Star, Info, ArrowUp
} from 'lucide-react';

import { Product, CategoryId, CartItem } from '../types';
import { clientConfig } from '../config';
import CustomizeModal from '../components/CustomizeModal';
import CartDrawer from '../components/CartDrawer';

import heroImg from '../assets/hero-cueva-lobo.jpg';
import logoImg from '../assets/logo-cueva-del-lobo.jpg';

// ── CATÁLOGO COMPLETO DE PRODUCTOS (Extraído fielmente de las cartas físicas) ──
const PRODUCTS: Product[] = [
  // ── ANTOJITOS MEXICANOS KÃNIIXNII ──────────────────────────────────────────
  {
    id: 'tacos-tradicionales',
    name: 'Tacos al Comal (Orden)',
    description:
      'Orden de tacos de maíz calientitos, servidos con papas cambray doraditas y nopales asados de la chinampa.',
    price: 70,
    category: 'antojitos',
    featured: true,
    badge: 'tradicion',
    isCustomizable: true,
    allowsSalsas: true,
    variantTitle: 'Elige tu Carne',
    variants: [
      { id: 'bistec', name: 'Bistec al comal' },
      { id: 'suadero', name: 'Suadero suave' },
      { id: 'longaniza', name: 'Longaniza de rancho' },
      { id: 'cecina', name: 'Cecina natural' },
      { id: 'pechuga', name: 'Pechuga de pollo' },
      { id: 'campechano', name: 'Campechanos (Especial)', price: 10 },
      { id: 'arrachera', name: 'Arrachera marinada (Especial)', price: 10 },
    ],
    extras: [
      { id: 'queso-extra', label: 'Queso fundido extra', price: 10 },
      { id: 'cebollitas', label: 'Cebollitas cambray asadas', price: 15 },
    ],
  },
  {
    id: 'quesadillas-comal',
    name: 'Quesadillas Artesanales de Comal',
    description:
      'Quesadilla frita o al comal hecha a mano con masa de maíz nixtamalizado, rellena de tu guisado favorito.',
    price: 50,
    category: 'antojitos',
    featured: true,
    badge: 'favorita' as any,
    isCustomizable: true,
    allowsSalsas: true,
    variantTitle: 'Elige tu Guisado',
    variants: [
      { id: 'pollo', name: 'Tinga de Pollo' },
      { id: 'hongos', name: 'Hongos frescos al ajillo' },
      { id: 'flor-calabaza', name: 'Flor de Calabaza tradicional' },
      { id: 'chicharron-prensado', name: 'Chicharrón prensado sazonado' },
      { id: 'huitlacoche', name: 'Huitlacoche (Caviar mexicano)' },
      { id: 'papa-queso', name: 'Papa con Queso' },
      { id: 'choriqueso', name: 'Choriqueso doradito' },
      { id: 'papa-longaniza', name: 'Papa con Longaniza' },
    ],
    extras: [{ id: 'queso-extra-q', label: 'Queso extra', price: 5 }],
  },
  {
    id: 'huaraches-comal',
    name: 'Huaraches Tradicionales',
    description:
      'Base alargada de masa de maíz con cama de frijoles refritos, bañada en salsa verde o roja, lechuga fresca, crema de rancho y queso añejo.',
    price: 140,
    category: 'antojitos',
    featured: true,
    badge: 'imperdible',
    isCustomizable: true,
    allowsSalsas: true,
    variantTitle: 'Elige tu Carne',
    variants: [
      { id: 'bistec-h', name: 'Bistec tierno' },
      { id: 'suadero-h', name: 'Suadero de comal' },
      { id: 'cecina-h', name: 'Cecina artesanal' },
      { id: 'campechano-h', name: 'Campechano especial' },
    ],
    extras: [{ id: 'queso-extra-h', label: 'Queso extra fundido', price: 10 }],
  },
  {
    id: 'sopes-caseros',
    name: 'Sopes Pellizcados de Comal',
    description:
      'Masa pellizcada en las orillas con frijoles sazonados, proteína a elegir, lechuga crujiente, crema y queso rallado.',
    price: 90,
    category: 'antojitos',
    isCustomizable: true,
    allowsSalsas: true,
    variantTitle: 'Elige tu Carne',
    variants: [
      { id: 'cecina-s', name: 'Cecina de res' },
      { id: 'suadero-s', name: 'Suadero suave' },
      { id: 'bistec-s', name: 'Bistec al comal' },
      { id: 'campechano-s', name: 'Campechano' },
    ],
    extras: [{ id: 'queso-extra-s', label: 'Queso extra', price: 10 }],
  },
  {
    id: 'gorditas-comal',
    name: 'Gorditas de Maíz Rellenas',
    description:
      'Gordita esponjadita rellena de chicharrón prensado crujiente con nopales y queso rallado.',
    price: 70,
    category: 'antojitos',
    badge: 'tradicion',
    isCustomizable: true,
    allowsSalsas: true,
    variantTitle: 'Elige el Estilo',
    variants: [
      { id: 'chicharron-tradicional', name: 'Chicharrón prensado clásico' },
      { id: 'con-nopales-queso', name: 'Con nopales tatemados y queso rallado' },
    ],
    extras: [{ id: 'queso-extra-g', label: 'Queso extra', price: 10 }],
  },
  {
    id: 'pambazos-dorados',
    name: 'Pambazo Tradicional al Comal',
    description:
      'Pan suave bañado en auténtica salsa de chile guajillo, doradito a la plancha, relleno con crema, queso y lechuga.',
    price: 65,
    category: 'antojitos',
    badge: 'favorita' as any,
    isCustomizable: true,
    allowsSalsas: true,
    variantTitle: 'Elige tu Relleno',
    variants: [
      { id: 'papa-longaniza-p', name: 'Papa con longaniza (El clásico de Xochimilco)' },
      { id: 'pollo-p', name: 'Pollo deshebrado sazonado' },
      { id: 'choriqueso-p', name: 'Choriqueso bien doradito' },
    ],
  },
  {
    id: 'tostadas-comal',
    name: 'Tostadas Crujientes de Maíz',
    description:
      'Tostada de maíz dorada con cama de frijoles refritos, guisado abundante, lechuga, crema espesa y queso rallado.',
    price: 55,
    category: 'antojitos',
    isCustomizable: true,
    allowsSalsas: true,
    variantTitle: 'Elige tu Guisado',
    variants: [
      { id: 'tinga-pollo', name: 'Tinga de pollo con cebolla caramelizada' },
      { id: 'picadillo', name: 'Picadillo tradicional con verduras' },
    ],
  },
  {
    id: 'tlacoyos-chinampa',
    name: 'Tlacoyos de Comal con Nopales',
    description:
      'Tlacoyo relleno hecho a mano, servido con abundante ensalada de nopales frescos de la chinampa y queso rallado.',
    price: 50,
    category: 'antojitos',
    badge: 'tradicion',
    isCustomizable: true,
    allowsSalsas: true,
    variantTitle: 'Elige el Relleno',
    variants: [
      { id: 'frijol', name: 'Frijol negro molido' },
      { id: 'chicharron-t', name: 'Chicharrón prensado' },
    ],
    extras: [{ id: 'queso-extra-t', label: 'Queso extra', price: 10 }],
  },

  // ── MICHELADAS & SABORES (1L y ½L) ─────────────────────────────────────────
  {
    id: 'michelada-tradicional',
    name: 'Michelada Tradicional',
    description:
      'Cerveza ultra helada servida con jugo de limón fresco recién exprimido, mezcla inglesa, salsas negras y escarchado al gusto.',
    price: 130,
    category: 'micheladas',
    featured: true,
    badge: 'estrella',
    isCustomizable: true,
    allowsEscarchado: true,
    sizes: [
      { id: '1-litro', label: '1 Litro Gigante', price: 130 },
      { id: 'medio-litro', label: '½ Litro Personal', price: 65 },
    ],
  },
  {
    id: 'michelada-cubana',
    name: 'Michelada Cubana Especial',
    description:
      'Receta de la casa con limón abundante, salsa inglesa Crosse & Blackwell, Jugo Maggi, toque de salsa Tabasco y escarchado picosito.',
    price: 140,
    category: 'micheladas',
    isCustomizable: true,
    allowsEscarchado: true,
    sizes: [
      { id: '1-litro', label: '1 Litro Gigante', price: 140 },
      { id: 'medio-litro', label: '½ Litro Personal', price: 70 },
    ],
  },
  {
    id: 'clamachela-reina',
    name: 'Clamachela Xochimilca',
    description:
      'La combinación perfecta: cerveza fría con jugo de Clamato sazonado con salsas negras, limón, pimienta y apio fresco.',
    price: 150,
    category: 'micheladas',
    featured: true,
    badge: 'favorita' as any,
    isCustomizable: true,
    allowsEscarchado: true,
    sizes: [
      { id: '1-litro', label: '1 Litro Gigante', price: 150 },
      { id: 'medio-litro', label: '½ Litro Personal', price: 75 },
    ],
  },
  {
    id: 'gomichela-loca',
    name: 'Gomichela Dulce & Picosa',
    description:
      'Cerveza escarchada con abundante chamoy artesanal, ajonjolí tostado, chilito Miguelito, gomitas enchiladas y banderilla de tamarindo.',
    price: 140,
    category: 'micheladas',
    isCustomizable: true,
    allowsEscarchado: true,
    sizes: [
      { id: '1-litro', label: '1 Litro Gigante', price: 140 },
      { id: 'medio-litro', label: '½ Litro Personal', price: 70 },
    ],
  },
  {
    id: 'chelada-clasica',
    name: 'Chelada Clásica de Limón y Sal',
    description:
      'Sencilla, cristalina y súper refrescante: cerveza helada con puro jugo de limón natural y aro escarchado con sal de grano.',
    price: 130,
    category: 'micheladas',
    isCustomizable: true,
    allowsEscarchado: true,
    sizes: [
      { id: '1-litro', label: '1 Litro Gigante', price: 130 },
      { id: 'medio-litro', label: '½ Litro Personal', price: 65 },
    ],
  },
  {
    id: 'michelada-camarones',
    name: 'Michelada con Camarones',
    description:
      'Nuestra obra maestra: michelada preparada con Clamato, coronada con brocheta de camarones sazonados al limón, pepino y salsas.',
    price: 200,
    category: 'micheladas',
    featured: true,
    badge: 'imperdible',
    isCustomizable: true,
    allowsEscarchado: true,
    sizes: [
      { id: '1-litro', label: '1 Litro Gigante', price: 200 },
      { id: 'medio-litro', label: '½ Litro Personal', price: 100 },
    ],
  },
  {
    id: 'michelada-sabores',
    name: 'Michelada de Sabores Frutales',
    description:
      'Elaborada con pulpa de fruta 100% natural, cerveza bien fría y escarchado de chamoy artesanal.',
    price: 140,
    category: 'micheladas',
    badge: 'favorita' as any,
    isCustomizable: true,
    allowsEscarchado: true,
    sizes: [
      { id: '1-litro', label: '1 Litro Gigante', price: 140 },
      { id: 'medio-litro', label: '½ Litro Personal', price: 70 },
    ],
    variantTitle: 'Elige el Sabor Frutal',
    variants: [
      { id: 'mango', name: 'Mango Natural' },
      { id: 'frutos-rojos', name: 'Frutos Rojos Silvestres' },
      { id: 'tamarindo', name: 'Tamarindo Concentrado' },
      { id: 'maracuya', name: 'Maracuyá Tropical' },
      { id: 'fresa', name: 'Fresa Madura' },
      { id: 'mora-azul', name: 'Mora Azul Ácida' },
      { id: 'manzana-verde', name: 'Manzana Verde' },
    ],
  },
  {
    id: 'michelada-doble-00',
    name: 'Michelada Doble 00',
    description: 'Preparación especial suave con salsas de la casa y limón fresco.',
    price: 120,
    category: 'micheladas',
    isCustomizable: true,
    allowsEscarchado: true,
    sizes: [
      { id: '1-litro', label: '1 Litro Gigante', price: 120 },
      { id: 'medio-litro', label: '½ Litro Personal', price: 60 },
    ],
  },
  {
    id: 'trago-cerillo',
    name: 'El Cerillo',
    description: 'Trago corto y potente preparado al momento con cerveza fría y toque picante.',
    price: 65,
    category: 'micheladas',
    isCustomizable: true,
  },

  // ── PULQUES KÃNIIXNII (1L y ½L) ───────────────────────────────────────────
  {
    id: 'pulque-curado',
    name: 'Pulque Curado de Temporada',
    description:
      'La bebida de los dioses. Pulque artesanal curado con fruta fresca natural (avena, apio, frutos rojos, guayaba, piñón según temporada).',
    price: 100,
    category: 'pulques',
    featured: true,
    badge: 'artesanal',
    isCustomizable: true,
    sizes: [
      { id: '1-litro', label: '1 Litro en Jarro', price: 100 },
      { id: 'medio-litro', label: '½ Litro Personal', price: 50 },
    ],
    variantTitle: 'Elige tu Curado',
    variants: [
      { id: 'avena', name: 'Avena con canela tradicional' },
      { id: 'frutos-rojos-p', name: 'Frutos Rojos' },
      { id: 'apio', name: 'Apio fresco desintoxicante' },
      { id: 'guayaba', name: 'Guayaba de temporada' },
      { id: 'mazapan', name: 'Mazapán de cacahuate' },
    ],
  },
  {
    id: 'pulque-natural',
    name: 'Pulque Blanco Natural de Maguey',
    description:
      'Pulque 100% puro fermentado de aguamiel de maguey, nutritivo, espeso y con tradición milenaria mexicana.',
    price: 50,
    category: 'pulques',
    featured: true,
    badge: 'tradicion',
    isCustomizable: true,
    sizes: [
      { id: '1-litro', label: '1 Litro en Jarro de Barro', price: 50 },
      { id: 'medio-litro', label: '½ Litro Personal', price: 30 },
    ],
  },

  // ── BEBIDAS PREPARADAS (Coctelería & Tragos) ────────────────────────────────
  {
    id: 'cantarito-xochimilco',
    name: 'Cantarito Xochimilca',
    description:
      'Servido en cantarito de barro escarchado con chile y sal, tequila, gajos de naranja y toronja, jugo de limón y refresco Squirt.',
    price: 95,
    category: 'bebidas-preparadas',
    featured: true,
    badge: 'estrella',
    isCustomizable: true,
    allowsEscarchado: true,
  },
  {
    id: 'azulito-preparado',
    name: 'Azulito Pitufo Electrizante',
    description:
      'Vodka, licor de Curaçao azul, bebida energetizante, refresco de limón, escarchado de chamoy azul y banderilla de gomitas.',
    price: 90,
    category: 'bebidas-preparadas',
    badge: 'favorita' as any,
    isCustomizable: true,
    allowsEscarchado: true,
  },
  {
    id: 'mezcalita-artesanal',
    name: 'Mezcalita de Sabor con Sal de Gusano',
    description:
      'Mezcal espadín artesanal con jugo de cítricos o maracuyá y aro escarchado con auténtica sal de gusano de maguey.',
    price: 95,
    category: 'bebidas-preparadas',
    badge: 'artesanal',
    isCustomizable: true,
    variantTitle: 'Elige el Sabor',
    variants: [
      { id: 'maracuya-m', name: 'Maracuyá fresco' },
      { id: 'tamarindo-m', name: 'Tamarindo concentrado' },
      { id: 'jamaica-m', name: 'Flor de Jamaica' },
    ],
  },
  {
    id: 'pina-colada',
    name: 'Piña Colada Cremosa',
    description:
      'Ron caribeño con crema de coco Calahua, jugo de piña dulce y hielo frappé coronada con canela y cereza.',
    price: 85,
    category: 'bebidas-preparadas',
    isCustomizable: true,
  },
  {
    id: 'paloma-brava',
    name: 'Paloma Brava con Tequila',
    description:
      'Tequila reposado, refresco de toronja Squirt, jugo de limón recién exprimido y sal de grano.',
    price: 80,
    category: 'bebidas-preparadas',
    isCustomizable: true,
    allowsEscarchado: true,
  },
  {
    id: 'mojito-refrescante',
    name: 'Mojito Cubano con Hierbabuena',
    description:
      'Ron blanco con hojas de hierbabuena fresca maceradas al momento, azúcar de caña, limón y agua mineral burbujeante.',
    price: 85,
    category: 'bebidas-preparadas',
    isCustomizable: true,
  },
  {
    id: 'tequilada-especial',
    name: 'Tequilada de la Casa',
    description: 'Tequila blanco reposado combinado con cítricos y toque dulce de granadina.',
    price: 85,
    category: 'bebidas-preparadas',
    isCustomizable: true,
  },
  {
    id: 'alfonso-xiii',
    name: 'Alfonso XIII',
    description: 'Licor de café Kahlúa con capa flotante de leche evaporada fría en las rocas.',
    price: 80,
    category: 'bebidas-preparadas',
    isCustomizable: true,
  },
  {
    id: 'media-de-seda',
    name: 'Media de Seda',
    description: 'Ginebra con jarabe de granadina dulce, leche evaporada y toque de canela.',
    price: 80,
    category: 'bebidas-preparadas',
    isCustomizable: true,
  },
  {
    id: 'copa-ron-whisky',
    name: 'Copa de Destilado (Ron o Whisky)',
    description: 'Servido con tu mezclador favorito (Coca-Cola, agua mineral o refresco de manzana).',
    price: 85,
    category: 'bebidas-preparadas',
    isCustomizable: true,
    variantTitle: 'Elige tu Destilado',
    variants: [
      { id: 'ron', name: 'Ron Añejo con mezclador' },
      { id: 'whisky', name: 'Whisky con mezclador' },
    ],
  },

  // ── CERVEZAS & CAGUAMAS (1.2L) ─────────────────────────────────────────────
  {
    id: 'caguama-1-2l',
    name: 'Caguama Familiar (1.2 Litros)',
    description: 'Caguamón de 1.2 litros servido bien helado para compartir en la trajinera o mesa.',
    price: 120,
    category: 'cervezas',
    featured: true,
    badge: 'estrella',
    isCustomizable: true,
    variantTitle: 'Elige la Cerveza (1.2L)',
    variants: [
      { id: 'corona-c', name: 'Corona Extra (1.2L)' },
      { id: 'victoria-c', name: 'Victoria (1.2L)' },
      { id: 'pacifico-c', name: 'Pacífico Clara (1.2L)' },
      { id: 'leon-c', name: 'León Negra (1.2L)' },
      { id: 'xx-lager-c', name: 'XX Lager (1.2L)' },
    ],
  },
  {
    id: 'cerveza-litro',
    name: 'Cerveza de Litro Especial',
    description: 'Botella de 1 Litro bien fría.',
    price: 100,
    category: 'cervezas',
    isCustomizable: true,
    variantTitle: 'Elige la Cerveza de Litro',
    variants: [
      { id: 'negra-modelo-1l', name: 'Negra Modelo (1 Litro)' },
      { id: 'modelo-especial-1l', name: 'Modelo Especial (1 Litro)' },
    ],
  },
  {
    id: 'cerveza-botella-355',
    name: 'Cerveza de Media en Botella (355 ml)',
    description: 'Botella de 355ml destapada bien fría al instante.',
    price: 45,
    category: 'cervezas',
    isCustomizable: false,
  },
  {
    id: 'cerveza-lata',
    name: 'Cerveza en Lata Fría',
    description: 'Lata individual fría.',
    price: 55,
    category: 'cervezas',
    isCustomizable: false,
  },

  // ── REFRESCOS PREPARADOS & VASOS ───────────────────────────────────────────
  {
    id: 'refresco-preparado',
    name: 'Refresco Preparado Especial',
    description:
      'Refresco servido con hielo abundante, jugo de limón natural, sal y preparación refrescante.',
    price: 70,
    category: 'refrescos-y-vasos',
    featured: true,
    isCustomizable: true,
    sizes: [
      { id: '1-litro', label: '1 Litro', price: 70 },
      { id: 'medio-litro', label: '½ Litro', price: 40 },
    ],
    variantTitle: 'Elige tu Refresco Preparado',
    variants: [
      { id: 'sangria', name: 'Sangría Preparada' },
      { id: 'tehuacan', name: 'Tehuacán Mineral Preparado' },
      { id: 'squirt', name: 'Squirt de Toronja Preparado' },
      { id: 'naranjada', name: 'Naranjada Fresca' },
      { id: 'limonada', name: 'Limonada Mineral' },
      { id: 'diablito', name: 'Diablito Preparado con Chamoy y Chile' },
    ],
  },
  {
    id: 'refresco-600ml',
    name: 'Refresco de 600 ml',
    description: 'Botella individual fría (Coca-Cola, Sidral, Fanta, Sprite).',
    price: 40,
    category: 'refrescos-y-vasos',
    isCustomizable: false,
  },
  {
    id: 'boing-fruta',
    name: 'Jugo Boing Tradicional',
    description: 'Envase tradicional de jugo Boing de pulpa de fruta (Mango o Guayaba).',
    price: 35,
    category: 'refrescos-y-vasos',
    isCustomizable: false,
  },
  {
    id: 'topo-chico-mineral',
    name: 'Agua Mineral Topo Chico',
    description: 'Auténtica agua mineral de manantial con gas extra burbujeante en botella de vidrio.',
    price: 45,
    category: 'refrescos-y-vasos',
    isCustomizable: false,
  },
  {
    id: 'vasos-preparados-solos',
    name: 'Vaso Preparado (Solo Vaso con Salsas e Hielo)',
    description:
      'Vaso escarchado con hielo, limón y salsas listo para que viertas tu cerveza o refresco favorito.',
    price: 20,
    category: 'refrescos-y-vasos',
    isCustomizable: true,
    variantTitle: 'Elige el Tipo de Vaso',
    variants: [
      { id: 'michelado-1l', name: 'Michelado (1 Litro)', price: 0 },
      { id: 'michelado-medio', name: 'Michelado (½ Litro)', price: -10 },
      { id: 'cubano-1l', name: 'Cubano con salsas negras (1 Litro)', price: 10 },
      { id: 'cubano-medio', name: 'Cubano con salsas negras (½ Litro)', price: -5 },
      { id: 'clamato-1l', name: 'Con Jugo Clamato (1 Litro)', price: 10 },
      { id: 'clamato-medio', name: 'Con Jugo Clamato (½ Litro)', price: -5 },
      { id: 'solo-1l', name: 'Solo escarchado (1 Litro)', price: -10 },
      { id: 'solo-medio', name: 'Solo escarchado (½ Litro)', price: -15 },
    ],
  },
  {
    id: 'vaso-numero-8',
    name: 'Vaso Desechable #8',
    description: 'Vaso desechable individual adicional.',
    price: 3,
    category: 'refrescos-y-vasos',
    isCustomizable: false,
  },
];

// ── CATEGORÍAS CON ÍCONOS ──────────────────────────────────────────────────
const CATEGORIES: { id: CategoryId; name: string; icon: any; count: number }[] = [
  { id: 'todos', name: 'Ver Todo', icon: Sparkles, count: PRODUCTS.length },
  {
    id: 'antojitos',
    name: 'Comal & Antojitos',
    icon: UtensilsCrossed,
    count: PRODUCTS.filter((p) => p.category === 'antojitos').length,
  },
  {
    id: 'micheladas',
    name: 'Micheladas & Sabores',
    icon: Beer,
    count: PRODUCTS.filter((p) => p.category === 'micheladas').length,
  },
  {
    id: 'pulques',
    name: 'Pulquería Kāniixnii',
    icon: Flame,
    count: PRODUCTS.filter((p) => p.category === 'pulques').length,
  },
  {
    id: 'bebidas-preparadas',
    name: 'Cocteles & Tragos',
    icon: Sparkles,
    count: PRODUCTS.filter((p) => p.category === 'bebidas-preparadas').length,
  },
  {
    id: 'cervezas',
    name: 'Caguamas & Cerveza',
    icon: Beer,
    count: PRODUCTS.filter((p) => p.category === 'cervezas').length,
  },
  {
    id: 'refrescos-y-vasos',
    name: 'Refrescos & Vasos',
    icon: Sparkles,
    count: PRODUCTS.filter((p) => p.category === 'refrescos-y-vasos').length,
  },
];

export default function LaCuevaDelLoboMenu() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cueva_del_lobo_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Carrito persistente en localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cueva_del_lobo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cueva_del_lobo_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('cueva_del_lobo_favs', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAddToCart = (
    lineId: string,
    productId: string,
    name: string,
    detail: string,
    unitPrice: number,
    quantity: number,
    image?: string
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.lineId === lineId);
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      const prod = PRODUCTS.find((p) => p.id === productId);
      return [
        ...prev,
        {
          lineId,
          productId,
          name,
          category: prod?.category || 'antojitos',
          detail,
          unitPrice,
          quantity,
          image,
        },
      ];
    });

    setToastMsg(`¡Agregado! ${quantity}x ${name}`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleUpdateQty = (lineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.lineId === lineId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (lineId: string) => {
    setCart((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const totalItemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Filtrado de productos por categoría y búsqueda
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (activeCategory !== 'todos') {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.variants?.some((v) => v.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0E0D0B] text-gray-200 font-sans selection:bg-[#E08722]/30 selection:text-white pb-28">
      {/* ── HEADER SUPERIOR / NAV ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0E0D0B]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#E08722] shadow-[0_0_12px_rgba(224,135,34,0.35)] shrink-0">
              <img
                src={logoImg}
                alt="La Cueva del Lobo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-black text-white tracking-tight leading-none">
                  {clientConfig.businessName}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Abierto
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#E08722] font-semibold flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                Xochimilco · Alimentos, Cerveza & Aventura
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón Carrito Header */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E08722] via-[#F59E0B] to-[#E08722] hover:brightness-110 active:scale-95 text-black font-extrabold text-xs sm:text-sm shadow-[0_0_15px_rgba(224,135,34,0.3)] transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-black stroke-[2.5]" />
              <span className="hidden xs:inline">Orden</span>
              {totalItemsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-black text-white text-[11px] font-black">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER CINEMATOGRÁFICO ────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#E08722]/30">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="La Cueva del Lobo Xochimilco"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0B] via-[#0E0D0B]/75 to-black/60" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0E0D0B]/50 to-[#0E0D0B]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-14 sm:pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-[#E08722]/60 text-amber-300 shadow-lg mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{clientConfig.promo.badge}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-md"
          >
            LA CUEVA DEL LOBO
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-lg text-amber-300 font-serif italic mt-2 drop-shadow"
          >
            "{clientConfig.tagline}"
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl mx-auto leading-relaxed drop-shadow"
          >
            {clientConfig.subtagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-6 text-xs"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-gray-300">
              <Clock className="w-3.5 h-3.5 text-[#E08722]" />
              <span>{clientConfig.hours}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-[#E08722]" />
              <span>Entrega en Trajineras & Domicilio</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-emerald-400 font-semibold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Pedidos: {clientConfig.phoneNumberFormatted}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BARRA STICKY: BUSCADOR & CATEGORÍAS ─────────────────────────────── */}
      <div className="sticky top-[58px] z-30 bg-[#0E0D0B]/95 backdrop-blur-xl border-b border-white/10 py-3 px-4 sm:px-6 shadow-xl">
        <div className="max-w-6xl mx-auto space-y-3">
          {/* Input Buscador */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar antojitos, micheladas, curados, caguamas, tacos..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 focus:border-[#E08722] focus:outline-none text-white text-xs sm:text-sm placeholder-gray-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 p-1 rounded-full text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Chips de Categorías */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs scroll-smooth">
            {CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#E08722] text-black shadow-[0_0_12px_rgba(224,135,34,0.35)] scale-[1.02]'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-black/30 text-black' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CUADRÍCULA DE PRODUCTOS (DOUBLE-BEZEL CARDS) ───────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>
                {CATEGORIES.find((c) => c.id === activeCategory)?.name || 'Todos los Platillos'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10 font-bold">
                {filteredProducts.length} opciones
              </span>
            </h3>
            {searchQuery && (
              <p className="text-xs text-amber-300 mt-0.5">
                Resultados para: "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
            <Search className="w-10 h-10 text-gray-600 mx-auto" />
            <h4 className="text-base font-bold text-white">No encontramos coincidencias</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Intenta con otro término o selecciona una categoría diferente en la barra superior.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('todos');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E08722] text-black"
            >
              Ver Toda la Carta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const isFav = favorites.includes(product.id);
              const minPrice =
                product.sizes && product.sizes.length > 0
                  ? Math.min(...product.sizes.map((s) => s.price))
                  : product.price;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => {
                    if (product.isCustomizable) {
                      setSelectedProduct(product);
                    } else {
                      handleAddToCart(
                        `${product.id}-${Date.now()}`,
                        product.id,
                        product.name,
                        'Orden Estándar',
                        product.price,
                        1,
                        product.image
                      );
                    }
                  }}
                  className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent hover:from-[#E08722]/50 hover:to-[#E08722]/10 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(224,135,34,0.15)] flex flex-col"
                >
                  <div className="flex-1 rounded-[calc(1rem-1px)] bg-[#141210] p-4 flex flex-col justify-between">
                    <div>
                      {/* Badges superiores y botón de favoritos */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {product.badge === 'estrella' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-amber-300" />
                              Estrella
                            </span>
                          )}
                          {product.badge === 'imperdible' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                              <Flame className="w-2.5 h-2.5" />
                              Imperdible
                            </span>
                          )}
                          {product.badge === 'artesanal' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Artesanal
                            </span>
                          )}
                          {product.badge === 'tradicion' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E08722]/20 text-[#E08722] border border-[#E08722]/40">
                              Tradición
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(product.id, e)}
                          className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-red-400 transition-colors"
                          title="Favorito"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isFav ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Nombre y descripción */}
                      <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>

                      {/* Píldoras de variantes o tamaños */}
                      {product.sizes && product.sizes.length > 1 && (
                        <div className="flex items-center gap-1.5 mt-2.5">
                          {product.sizes.map((s) => (
                            <span
                              key={s.id}
                              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-300 font-semibold"
                            >
                              {s.label}: <strong className="text-amber-400">${s.price}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Precios y Botón de Acción */}
                    <div className="pt-3.5 mt-3 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">
                          {product.sizes && product.sizes.length > 1 ? 'Desde' : 'Precio'}
                        </span>
                        <div className="text-lg font-black text-white tracking-tight flex items-baseline gap-1">
                          <span>${minPrice}</span>
                          <span className="text-[10px] text-amber-400 font-bold">MXN</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-white/10 hover:bg-[#E08722] text-white hover:text-black group-hover:bg-[#E08722] group-hover:text-black transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                      >
                        {product.isCustomizable ? (
                          <>
                            <span>Elegir</span>
                            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </>
                        ) : (
                          <>
                            <span>Pedir</span>
                            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── FOOTER OFICIAL DE 3 COLUMNAS DEL CLIENTE (Obligatorio CRO) ─────── */}
      <footer className="mt-16 border-t border-white/10 bg-[#0A0908] text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {/* Columna 1: Marca y Horarios */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="Logo La Cueva del Lobo"
                className="w-12 h-12 rounded-full border-2 border-[#E08722] object-cover shadow-lg"
              />
              <div>
                <h4 className="font-black text-base text-white tracking-tight">
                  {clientConfig.businessName}
                </h4>
                <p className="text-[11px] text-[#E08722] font-semibold">
                  {clientConfig.concept}
                </p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-xs">
              {clientConfig.description}
            </p>
            <div className="pt-2 flex items-center gap-2 text-amber-300 font-bold">
              <Clock className="w-4 h-4 text-[#E08722]" />
              <span>{clientConfig.hours}</span>
            </div>
          </div>

          {/* Columna 2: Ubicación & Trajineras */}
          <div className="space-y-3">
            <h4 className="font-black text-sm uppercase tracking-wider text-white border-b border-white/10 pb-2">
              Ubicación & Cobertura
            </h4>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E08722] shrink-0 mt-0.5" />
                <span>{clientConfig.address}</span>
              </p>
              <p className="text-xs text-gray-400 pl-6">
                {clientConfig.reference}
              </p>
              <div className="pl-6 pt-1">
                <a
                  href={clientConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 font-bold transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ver en Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Columna 3: Contacto, Pedidos WhatsApp & Privacidad */}
          <div className="space-y-3">
            <h4 className="font-black text-sm uppercase tracking-wider text-white border-b border-white/10 pb-2">
              Atención & Pedidos
            </h4>
            <p className="text-gray-400">
              Pide directamente para servir en tu mesa, entrega hasta tu trajinera en los canales o envío a domicilio.
            </p>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${clientConfig.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {clientConfig.phoneNumberFormatted}</span>
              </a>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="text-[11px] text-gray-400 hover:text-amber-300 underline block pt-1"
              >
                Aviso de Privacidad (LFPDPPP)
              </button>
            </div>
          </div>
        </div>

        {/* Barra inferior de créditos */}
        <div className="border-t border-white/5 py-4 px-4 sm:px-6 bg-black/60 text-center text-[11px] text-gray-500">
          <p>
            © 2026 {clientConfig.businessName} · Todos los derechos reservados. Desarrollado con tecnología gastronómica de{' '}
            <strong className="text-gray-300">IMAGINE & STAMP</strong>.
          </p>
        </div>
      </footer>

      {/* ── BARRA FLOTANTE MÓVIL (SAFE-AREA BOTTOM) ────────────────────────── */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 bg-gradient-to-t from-black via-black/95 to-transparent pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="max-w-md mx-auto">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCartOpen(true)}
              className="w-full py-3.5 px-5 rounded-2xl font-black text-sm uppercase tracking-wide bg-gradient-to-r from-[#E08722] via-[#F59E0B] to-[#E08722] text-black shadow-[0_0_25px_rgba(224,135,34,0.4)] flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">
                  {totalItemsCount}
                </span>
                <span>Ver Mi Orden</span>
              </div>
              <div className="flex items-center gap-1.5 text-base font-black">
                <span>${cartTotal}</span>
                <span className="text-xs">MXN</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </motion.button>
          </div>
        </div>
      )}

      {/* ── BOTÓN VOLVER ARRIBA ────────────────────────────────────────────── */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 right-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-[#E08722] text-gray-400 hover:text-black border border-white/10 transition-all shadow-lg hidden sm:block"
        title="Volver arriba"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* ── TOAST FLOTANTE AL AGREGAR ──────────────────────────────────────── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-emerald-500 text-black font-extrabold text-xs shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL CUSTOMIZE BOTTOM-SHEET ──────────────────────────────────── */}
      <AnimatePresence>
        {selectedProduct && (
          <CustomizeModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAdd={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* ── CART DRAWER DE 2 PASOS ────────────────────────────────────────── */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemoveItem}
            cartTotal={cartTotal}
            whatsappNumber={clientConfig.phone}
            businessName={clientConfig.businessName}
            onClearCart={handleClearCart}
          />
        )}
      </AnimatePresence>

      {/* ── MODAL AVISO DE PRIVACIDAD (LFPDPPP) ───────────────────────────── */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-[#141210] border border-white/10 rounded-2xl p-6 shadow-2xl text-xs space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#E08722]" />
                  <h3 className="font-bold text-sm text-white">
                    Aviso de Privacidad Simplificado
                  </h3>
                </div>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-gray-300 space-y-2.5 leading-relaxed">
                <p>
                  En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong>, {clientConfig.businessName}, con domicilio en {clientConfig.address}, le informa que los datos personales recabados a través de esta plataforma digital (nombre, teléfono y referencias de ubicación o entrega) serán utilizados única y exclusivamente para:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-gray-400">
                  <li>Procesar, preparar y coordinar la entrega de su pedido gastronómico.</li>
                  <li>Comunicarnos vía WhatsApp para confirmar estatus y detalles de pago.</li>
                  <li>Garantizar un servicio óptimo y seguro al cliente.</li>
                </ul>
                <p>
                  Sus datos personales no serán transferidos, vendidos ni compartidos con terceros bajo ninguna circunstancia sin su consentimiento expreso.
                </p>
                <p className="text-gray-400">
                  Para ejercer sus derechos ARCO (Acceso, Rectificación, Cancelación u Oposición), puede contactar directamente a la administración al WhatsApp: <strong>{clientConfig.phoneNumberFormatted}</strong>.
                </p>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#E08722] text-black font-bold text-xs"
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
