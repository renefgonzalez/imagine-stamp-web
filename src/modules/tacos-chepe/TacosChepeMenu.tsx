import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, X, Plus, Minus, User, Wallet, Search, Flame,
  Heart, MapPin, Clock, Phone, Copy, Check, ChevronDown, MessageCircle,
  Facebook, Instagram, Music2
} from 'lucide-react';

// Import logo
import logoImg from './assets/logo.png';

// Import product images
import { getProductImage } from './productImages';

type Category = 'tacos' | 'gringas' | 'tortas' | 'paquetes' | 'bebidas' | 'volcanes' | 'harina' | 'queso';

const categoryLabels: Record<Category, string> = {
  tacos: 'Tacos',
  gringas: 'Gringas',
  volcanes: 'Volcanes',
  harina: 'En Harina',
  queso: 'Con Queso',
  tortas: 'Tortas',
  paquetes: 'Paquetes',
  bebidas: 'Bebidas/Extras'
};
type PaymentMethod = 'tarjeta' | 'transferencia';
type DeliveryMethod = 'domicilio' | 'recoger';

interface Product {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen: string;
  categoria: Category;
  badges?: string[];
}

interface CartItem extends Product {
  quantity: number;
  sinCebolla?: boolean;
  varianteBebida?: string;
}

const INITIAL_VISIBLE = 12;
const LOAD_MORE = 12;

export const PRODUCTS: Product[] = [
  // Tacos
  { id: 't-arrachera', nombre: 'Arrachera', precio: 45, categoria: 'tacos', imagen: getProductImage('t-arrachera') },
  { id: 't-picana', nombre: 'Picaña', precio: 46, categoria: 'tacos', imagen: getProductImage('t-picana') },
  { id: 't-bistec', nombre: 'Bistec de res', precio: 45, categoria: 'tacos', imagen: getProductImage('t-bistec') },
  { id: 't-suadero', nombre: 'Suadero', precio: 45, categoria: 'tacos', imagen: getProductImage('t-suadero') },
  { id: 't-chorizo', nombre: 'Chorizo Argentino', precio: 45, categoria: 'tacos', imagen: getProductImage('t-chorizo') },
  { id: 't-chistorra', nombre: 'Chistorra', precio: 45, categoria: 'tacos', imagen: getProductImage('t-chistorra') },
  { id: 't-longaniza', nombre: 'Longaniza', precio: 45, descripcion: '(Chorizo Chiltepin)', categoria: 'tacos', imagen: getProductImage('t-longaniza') },
  { id: 't-campechano-gen', nombre: 'Campechano', precio: 43, descripcion: '(Combinación de tu elección)', categoria: 'tacos', imagen: getProductImage('t-campechano') },
  { id: 't-pollo', nombre: 'Pollo', precio: 45, categoria: 'tacos', imagen: getProductImage('t-pollo') },
  { id: 't-vegetariano', nombre: 'Vegetariano', precio: 48, descripcion: '(Champiñón, nopal, papa, cebolla en harina y queso)', categoria: 'tacos', imagen: getProductImage('t-vegetariano') },
  { id: 't-chepekan', nombre: 'Chepekan', precio: 43, descripcion: '"Bistec con la tortilla picada" (Para la mascota)', categoria: 'tacos', imagen: getProductImage('t-chepekan') },
  { id: 't-chepe-esp', nombre: 'Chepe Especial', precio: 88, descripcion: '(Suadero en trozo)', categoria: 'tacos', imagen: getProductImage('t-chepe-esp'), badges: ['Especial'] },
  { id: 't-aguja', nombre: 'Aguja Norteña', precio: 85, categoria: 'tacos', imagen: getProductImage('t-aguja') },
  { id: 't-ribeye', nombre: 'Ribeye', precio: 80, categoria: 'tacos', imagen: getProductImage('t-ribeye') },
  { id: 't-alambre', nombre: 'Alambre', precio: 38, categoria: 'tacos', imagen: getProductImage('t-alambre') },
  { id: 't-nopal', nombre: 'Taco de Nopal', precio: 25, categoria: 'tacos', imagen: getProductImage('t-nopal') },
  { id: 't-fofis', nombre: 'Fofis con champi', precio: 55, categoria: 'tacos', imagen: getProductImage('t-fofis') },
  { id: 't-bistec-trozo', nombre: 'Bisteck en trozo', precio: 50, categoria: 'tacos', imagen: getProductImage('t-bistec-trozo') },
  { id: 't-picana-trozo', nombre: 'Picaña en trozo', precio: 48, categoria: 'tacos', imagen: getProductImage('t-picana-trozo') },

  // Volcanes
  { id: 'v-suadero', nombre: 'Volcán de Suadero', precio: 62, categoria: 'volcanes', imagen: getProductImage('v-suadero') },
  { id: 'v-bistec', nombre: 'Volcán de Bistec', precio: 62, categoria: 'volcanes', imagen: getProductImage('v-bistec') },
  { id: 'v-arrachera', nombre: 'Volcán de Arrachera', precio: 62, categoria: 'volcanes', imagen: getProductImage('v-arrachera') },
  { id: 'v-picana', nombre: 'Volcán de Picaña', precio: 62, categoria: 'volcanes', imagen: getProductImage('v-picana') },
  { id: 'v-argentino', nombre: 'Volcán de Argentino', precio: 62, categoria: 'volcanes', imagen: getProductImage('v-argentino') },
  { id: 'v-chistorra', nombre: 'Volcán de Chistorra', precio: 62, categoria: 'volcanes', imagen: getProductImage('v-chistorra') },
  { id: 'v-longaniza', nombre: 'Volcán de Longaniza', precio: 62, categoria: 'volcanes', imagen: getProductImage('v-longaniza') },
  { id: 'v-pechuga', nombre: 'Volcán de Pechuga', precio: 62, categoria: 'volcanes', imagen: getProductImage('v-pechuga') },
  { id: 'v-campechano', nombre: 'Volcán Campechano', precio: 62, categoria: 'volcanes', imagen: getProductImage('v-campechano') },
  { id: 'v-queso', nombre: 'Volcán de puro Queso', precio: 27, categoria: 'volcanes', imagen: getProductImage('v-queso') },

  // Tacos en Harina
  { id: 'h-suadero', nombre: 'Suadero en Harina', precio: 52, categoria: 'harina', imagen: getProductImage('h-suadero') },
  { id: 'h-bistec', nombre: 'Bistec en Harina', precio: 52, categoria: 'harina', imagen: getProductImage('h-bistec') },
  { id: 'h-arrachera', nombre: 'Arrachera en Harina', precio: 52, categoria: 'harina', imagen: getProductImage('h-arrachera') },
  { id: 'h-picana', nombre: 'Picaña en Harina', precio: 53, categoria: 'harina', imagen: getProductImage('h-picana') },
  { id: 'h-argentino', nombre: 'Argentino en Harina', precio: 52, categoria: 'harina', imagen: getProductImage('h-argentino') },
  { id: 'h-chistorra', nombre: 'Chistorra en Harina', precio: 52, categoria: 'harina', imagen: getProductImage('h-chistorra') },
  { id: 'h-longaniza', nombre: 'Longaniza en Harina', precio: 52, categoria: 'harina', imagen: getProductImage('h-longaniza') },
  { id: 'h-pechuga', nombre: 'Pechuga en Harina', precio: 52, categoria: 'harina', imagen: getProductImage('h-pechuga') },
  { id: 'h-alambre', nombre: 'Alambre en Harina', precio: 45, categoria: 'harina', imagen: getProductImage('h-alambre') },
  { id: 'h-campechano', nombre: 'Campechano en Harina', precio: 52, categoria: 'harina', imagen: getProductImage('h-campechano') },
  { id: 'h-chepe-esp', nombre: 'Chepe Especial en Harina', precio: 95, categoria: 'harina', imagen: getProductImage('h-chepe-esp') },
  { id: 'h-aguja', nombre: 'Aguja Norteña en Harina', precio: 95, categoria: 'harina', imagen: getProductImage('h-aguja') },
  { id: 'h-ribeye', nombre: 'Ribeye en Harina', precio: 90, categoria: 'harina', imagen: getProductImage('h-ribeye') },

  // Tacos con Queso
  { id: 'q-suadero', nombre: 'Suadero con Queso', precio: 54, categoria: 'queso', imagen: getProductImage('q-suadero') },
  { id: 'q-bistec', nombre: 'Bistec con Queso', precio: 54, categoria: 'queso', imagen: getProductImage('q-bistec') },
  { id: 'q-arrachera', nombre: 'Arrachera con Queso', precio: 54, categoria: 'queso', imagen: getProductImage('q-arrachera') },
  { id: 'q-picana', nombre: 'Picaña con Queso', precio: 56, categoria: 'queso', imagen: getProductImage('q-picana') },
  { id: 'q-argentino', nombre: 'Chorizo Argentino con Queso', precio: 54, categoria: 'queso', imagen: getProductImage('q-argentino') },
  { id: 'q-chistorra', nombre: 'Chistorra con Queso', precio: 54, categoria: 'queso', imagen: getProductImage('q-chistorra') },
  { id: 'q-longaniza', nombre: 'Chorizo Chiltepín con Queso', precio: 54, categoria: 'queso', imagen: getProductImage('q-longaniza') },
  { id: 'q-pechuga', nombre: 'Pechuga con Queso', precio: 54, categoria: 'queso', imagen: getProductImage('q-pechuga') },
  { id: 'q-campechano', nombre: 'Campechano con Queso', precio: 54, categoria: 'queso', imagen: getProductImage('q-campechano') },
  { id: 'q-chepe-esp', nombre: 'Chepe Especial con Queso', precio: 101, categoria: 'queso', imagen: getProductImage('q-chepe-esp') },
  { id: 'q-aguja', nombre: 'Aguja con Queso', precio: 100, categoria: 'queso', imagen: getProductImage('q-aguja') },
  { id: 'q-ribeye', nombre: 'Ribeye con Queso', precio: 97, categoria: 'queso', imagen: getProductImage('q-ribeye') },

  // Gringas
  { id: 'g-suadero', nombre: 'Gringa de Suadero', precio: 82, categoria: 'gringas', imagen: getProductImage('e-suaqueso') },
  { id: 'g-bistec', nombre: 'Gringa de Bistec', precio: 82, categoria: 'gringas', imagen: getProductImage('e-quesocarne') },
  { id: 'g-arrachera', nombre: 'Gringa de Arrachera', precio: 82, categoria: 'gringas', imagen: getProductImage('e-arraqueso') },
  { id: 'g-picana', nombre: 'Gringa de Picaña', precio: 92, categoria: 'gringas', imagen: getProductImage('e-picanaqueso') },
  { id: 'g-argentino', nombre: 'Gringa de Argentino', precio: 82, categoria: 'gringas', imagen: getProductImage('e-argentiqueso') },
  { id: 'g-chistorra', nombre: 'Gringa de Chistorra', precio: 82, categoria: 'gringas', imagen: getProductImage('e-chistoqueso') },
  { id: 'g-longaniza', nombre: 'Gringa de Longaniza', precio: 82, categoria: 'gringas', imagen: getProductImage('e-choriqueso') },
  { id: 'g-pechuga', nombre: 'Gringa de Pechuga', precio: 82, categoria: 'gringas', imagen: getProductImage('e-pechuqueso') },
  { id: 'g-campechana', nombre: 'Gringa Campechana', precio: 82, categoria: 'gringas', imagen: getProductImage('e-campechaqueso') },
  { id: 'g-ribeye', nombre: 'Gringa de Ribeye', precio: 120, categoria: 'gringas', imagen: getProductImage('e-quesocarne') },
  { id: 'g-aguja', nombre: 'Gringa de Aguja', precio: 110, categoria: 'gringas', imagen: getProductImage('e-quesocarne') },
  { id: 'g-arrachisto', nombre: 'Gringa Arrachisto', precio: 76, categoria: 'gringas', imagen: getProductImage('e-quesocarne') },
  { id: 'g-arra-dom', nombre: 'Gringa Arrachera (dom)', precio: 80, categoria: 'gringas', imagen: getProductImage('e-arraqueso') },
  { id: 'g-camp-arra-long-suad', nombre: 'Gringa Campechana (Arra/Long/Suad)', precio: 78, categoria: 'gringas', imagen: getProductImage('e-campechaqueso') },
  { id: 'g-camp-arra-arg', nombre: 'Gringa Campechana (Arrachera/Argentino)', precio: 79, categoria: 'gringas', imagen: getProductImage('e-campechaqueso') },
  { id: 'g-camp-arra-chis', nombre: 'Gringa Campechana (Arrachera/Chistorra)', precio: 79, categoria: 'gringas', imagen: getProductImage('e-campechaqueso') },
  { id: 'g-camp-arra', nombre: 'Gringa Campechana (Arrachera)', precio: 79, categoria: 'gringas', imagen: getProductImage('e-campechaqueso') },
  { id: 'g-chepequeso', nombre: 'Gringa Chepe Especial', precio: 100, categoria: 'gringas', imagen: getProductImage('e-quesocarne') },
  { id: 'g-pechucarne', nombre: 'Gringa Pechucarne', precio: 76, categoria: 'gringas', imagen: getProductImage('e-quesocarne') },
  { id: 'g-pichistorra', nombre: 'Gringa Pichistorra', precio: 76, categoria: 'gringas', imagen: getProductImage('e-quesocarne') },


  // Tortas
  { id: 'to-suadero', nombre: 'Suadero', precio: 100, descripcion: '(Todas llevan queso)', categoria: 'tortas', imagen: getProductImage('to-suadero') },
  { id: 'to-bistec', nombre: 'Bistec', precio: 100, descripcion: '(Todas llevan queso)', categoria: 'tortas', imagen: getProductImage('to-bistec') },
  { id: 'to-longaniza', nombre: 'Longaniza', precio: 100, descripcion: '(Todas llevan queso)', categoria: 'tortas', imagen: getProductImage('to-longaniza') },
  { id: 'to-pechuga', nombre: 'Pechuga', precio: 100, descripcion: '(Todas llevan queso)', categoria: 'tortas', imagen: getProductImage('to-pechuga') },
  { id: 'to-arrachera', nombre: 'Arrachera', precio: 100, descripcion: '(Todas llevan queso)', categoria: 'tortas', imagen: getProductImage('to-arrachera') },
  { id: 'to-picana', nombre: 'Picaña', precio: 100, descripcion: '(Todas llevan queso)', categoria: 'tortas', imagen: getProductImage('to-picana') },
  { id: 'to-vegetariana', nombre: 'Vegetariana', precio: 100, descripcion: '(Champiñón, nopal, papa, cebolla y queso)', categoria: 'tortas', imagen: getProductImage('to-vegetariana') },
  { id: 'to-argentino', nombre: 'Argentino', precio: 105, descripcion: '(Todas llevan queso)', categoria: 'tortas', imagen: getProductImage('to-argentino') },
  { id: 'to-chistorra', nombre: 'Chistorra', precio: 105, descripcion: '(Todas llevan queso)', categoria: 'tortas', imagen: getProductImage('to-chistorra') },
  { id: 'to-campechana', nombre: 'Campechana', precio: 110, descripcion: '(La combinación de tu agrado) (Llevan queso)', categoria: 'tortas', imagen: getProductImage('to-campechana'), badges: ['Más Pedida'] },
  { id: 'to-alambre', nombre: 'Alambre', precio: 115, descripcion: '(Todas llevan queso)', categoria: 'tortas', imagen: getProductImage('to-alambre') },
  { id: 'to-bistec-entero', nombre: 'Bistec Entero', precio: 115, descripcion: '(Todas llevan queso)', categoria: 'tortas', imagen: getProductImage('to-bistec-entero') },
  { id: 'to-chepe-esp', nombre: 'Chepe Especial', precio: 130, descripcion: '(Suadero en trozo) (Llevan queso)', categoria: 'tortas', imagen: getProductImage('to-chepe-esp'), badges: ['Especial'] },
  { id: 'to-ribeye', nombre: 'Ribeye', precio: 135, descripcion: '(Todas llevan queso)', categoria: 'tortas', imagen: getProductImage('to-ribeye') },

  // Paquetes
  { id: 'p-1', nombre: 'Paquete #1', precio: 155, descripcion: '3 Tacos de Arrachera + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-1'), badges: ['Promo'] },
  { id: 'p-2', nombre: 'Paquete #2', precio: 160, descripcion: '3 Tacos de Picaña + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-2'), badges: ['Promo'] },
  { id: 'p-3', nombre: 'Paquete #3', precio: 152, descripcion: '3 Tacos Campechanos + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-3'), badges: ['Promo'] },
  { id: 'p-4', nombre: 'Paquete #4', precio: 155, descripcion: '3 Tacos Suadero + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-4'), badges: ['Promo'] },
  { id: 'p-5', nombre: 'Paquete #5', precio: 255, descripcion: '2 Tortas Campechanas + 2 Refresco', categoria: 'paquetes', imagen: getProductImage('p-5'), badges: ['Familiar'] },
  { id: 'p-6', nombre: 'Paquete #6', precio: 133, descripcion: '1 Tortas Arrachera + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-6'), badges: ['Promo'] },
  { id: 'p-7', nombre: 'Paquete #7', precio: 133, descripcion: '1 Torta de Suadero + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-7'), badges: ['Promo'] },
  { id: 'p-8', nombre: 'Paquete #8', precio: 153, descripcion: '1 Gringa Arrachera + 1 Taco de Campechano + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-8'), badges: ['Promo'] },
  { id: 'p-9', nombre: 'Paquete #9', precio: 153, descripcion: '1 Gringa Suadero + 1 Taco de Campechano + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-9'), badges: ['Promo'] },
  { id: 'p-10', nombre: 'Paquete #10', precio: 153, descripcion: '1 Gringa Campechana + 1 Taco de Campechano + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-10'), badges: ['Promo'] },
  { id: 'p-11', nombre: 'Paquete #11', precio: 178, descripcion: '2 Suaqueso + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-11'), badges: ['Promo'] },
  { id: 'p-12', nombre: 'Paquete #12', precio: 178, descripcion: '2 Campechaqueso + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-12'), badges: ['Promo'] },
  { id: 'p-13', nombre: 'Paquete #13', precio: 178, descripcion: '2 Arraqueso + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-13'), badges: ['Promo'] },
  { id: 'p-14', nombre: 'Paquete #14', precio: 150, descripcion: '1 Orden de Alambre Personal + 1 Refresco', categoria: 'paquetes', imagen: getProductImage('p-14'), badges: ['Promo'] },
  { id: 'p-15', nombre: 'Paquete #15', precio: 270, descripcion: 'Orden de Alambre para 2 personas + 2 Refrescos', categoria: 'paquetes', imagen: getProductImage('p-15'), badges: ['Promo'] },

  // Bebidas y Extras
  { id: 'b-agua-guayaba-12', nombre: '1/2 Agua de Guayaba', precio: 25, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-maracuya-12', nombre: '1/2 Agua de Maracuya', precio: 25, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-avena-cafe', nombre: 'Agua de Avena con Café', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-avena-nuez', nombre: 'Agua de Avena con Nuez', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-fresa', nombre: 'Agua de Fresa', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-frutos-rojos', nombre: 'Agua de Frutos Rojos', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-guanabana', nombre: 'Agua de Guanábana', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-guayaba', nombre: 'Agua de Guayaba', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-horchata', nombre: 'Agua de Horchata', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-jamaica', nombre: 'Agua de Jamaica', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-limon-chia', nombre: 'Agua de Limón con Chía', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-limon-pepino', nombre: 'Agua de Limón con Pepino', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-mango', nombre: 'Agua de Mango', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-maracuya', nombre: 'Agua de Maracuya', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-melon', nombre: 'Agua de Melón', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-pina', nombre: 'Agua de Piña', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-pina-mango', nombre: 'Agua de Piña con Mango', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-tamarindo', nombre: 'Agua de Tamarindo', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-horchata-fresa', nombre: 'Agua Horchata con Fresa', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-agua-pina-pepino', nombre: 'Agua Piña con Pepino', precio: 46, categoria: 'bebidas', imagen: getProductImage('b-agua') },
  { id: 'b-boing-fresa', nombre: 'Boing de Fresa', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-boing') },
  { id: 'b-boing-guayaba', nombre: 'Boing de Guayaba', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-boing') },
  { id: 'b-boing-mango', nombre: 'Boing de Mango', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-boing') },
  { id: 'b-boing-manzana', nombre: 'Boing de Manzana', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-boing') },
  { id: 'b-coca-original', nombre: 'Coca Cola Original', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-coca') },
  { id: 'b-coca-zero', nombre: 'Coca Cola Zero', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-coca') },
  { id: 'b-coca-light', nombre: 'Coca Cola Light', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-coca') },
  { id: 'b-jarrito-limon', nombre: 'Jarrito de Limón', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-jarrito') },
  { id: 'b-jarrito-manzana', nombre: 'Jarrito de Manzana', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-jarrito') },
  { id: 'b-jarrito-pina', nombre: 'Jarrito de Piña', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-jarrito') },
  { id: 'b-jarrito-tamarindo', nombre: 'Jarrito de Tamarindo', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-jarrito') },
  { id: 'b-jarrito-tutifruti', nombre: 'Jarrito de Tutifruti', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-jarrito') },
  { id: 'b-jarrito-uva', nombre: 'Jarrito de Uva', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-jarrito') },
  { id: 'b-manzana', nombre: 'Sidral Mundet / Manzana', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-manzana') },
  { id: 'b-mirinda', nombre: 'Mirinda', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-mirinda') },
  { id: 'b-penafiel', nombre: 'Peñafiel Naranjada', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-penafiel') },
  { id: 'b-sangria', nombre: 'Sangría', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-sangria') },
  { id: 'b-delawere', nombre: 'Delaware Punch', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-delawere') },
  { id: 'b-agua-mineral', nombre: 'Agua Mineral', precio: 31, categoria: 'bebidas', imagen: getProductImage('b-agua-mineral') },
  { id: 'b-electrolito', nombre: 'Electrolito', precio: 35, categoria: 'bebidas', imagen: getProductImage('b-electrolito') },
  { id: 'b-cerveza', nombre: 'Cerveza de Lata', precio: 35, categoria: 'bebidas', imagen: getProductImage('b-cerveza') },
  { id: 'b-queso-extra', nombre: 'Queso Extra por Taco', precio: 16, categoria: 'bebidas', imagen: getProductImage('b-queso-extra') },
];

const bankInfo = {
  bank_name: 'BBVA',
  account_holder: 'Tacos Chepe',
  clabe: '012345678901234567',
  account_number: '0123456789',
};

const whatsappNumber = '525659800600';

export default function TacosChepeMenu() {
  // Cart state (local — avoids store field name mismatch)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'cart' | 'details' | 'success'>('cart');

  // Catalog state
  const [activeCategory, setActiveCategory] = useState<Category | 'destacados' | 'favoritos'>('destacados');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalBebida, setModalBebida] = useState<string>('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Favorites (localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tacoschepe_favs') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('tacoschepe_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // Customer info
  const [customerInfo, setCustomerInfo] = useState({
    nombre: '',
    telefono: '',
    deliveryMethod: 'domicilio' as DeliveryMethod,
    direccion: '',
    metodoPago: 'transferencia' as PaymentMethod,
    efectivoAmount: '',
    notas: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Reset visible count when category/search changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activeCategory, searchQuery]);

  // Reset cart step when drawer closes
  useEffect(() => {
    if (!isCartOpen) {
      setTimeout(() => setCartStep('cart'), 300);
    }
  }, [isCartOpen]);

  // --- CART LOGIC ---
  const addToCart = (product: Product, qty = 1, varianteBebida?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.varianteBebida === varianteBebida);
      if (existing) {
        return prev.map(i => i.id === product.id && i.varianteBebida === varianteBebida ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { ...product, quantity: qty, varianteBebida }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const toggleSinCebolla = (id: string) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, sinCebolla: !i.sinCebolla } : i));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- BANK INFO ---
  const [copied, setCopied] = useState(false);
  const copyBankInfo = () => {
    const info = `Banco: ${bankInfo.bank_name}\nTitular: ${bankInfo.account_holder}\nCLABE: ${bankInfo.clabe}\nCuenta: ${bankInfo.account_number}`;
    navigator.clipboard.writeText(info).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // --- CHECKOUT ---
  const handleCheckout = () => {
    const newErrors: Record<string, boolean> = {};
    if (!customerInfo.nombre.trim()) newErrors.nombre = true;
    if (!customerInfo.telefono.trim()) newErrors.telefono = true;
    if (customerInfo.deliveryMethod === 'domicilio' && !customerInfo.direccion.trim()) newErrors.direccion = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToast('Completa los datos marcados para continuar');
      return;
    }

    // Show success screen first
    setCartStep('success');

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 500);

    // Clean up after redirect
    setTimeout(() => {
      setCart([]);
      setCustomerInfo({
        nombre: '', telefono: '', deliveryMethod: 'domicilio', direccion: '',
        metodoPago: 'transferencia', efectivoAmount: '', notas: '',
      });
      setErrors({});
      setIsCartOpen(false);
    }, 800);
  };

  const generateWhatsAppMessage = () => {
    const itemsText = cart.map(item => `• ${item.quantity}x ${item.nombre}${item.varianteBebida ? ` (${item.varianteBebida})` : ''}${item.sinCebolla ? ' (SIN CEBOLLA)' : ''} - $${item.precio * item.quantity}`).join('\n');
    let message = `🌮 *Nuevo Pedido - Tacos Chepe*\n\n📋 *Productos:*\n${itemsText}\n\n💵 *Total: $${cartTotal.toFixed(2)}*\n\n👤 *Cliente:* ${customerInfo.nombre}\n📱 *Teléfono:* ${customerInfo.telefono}\n`;
    message += `🚚 *Entrega:* ${customerInfo.deliveryMethod === 'domicilio' ? 'A domicilio' : 'Recoger en local'}\n`;

    if (customerInfo.deliveryMethod === 'domicilio') {
      message += `📍 *Dirección:* ${customerInfo.direccion}\n`;
    }

    message += `💳 *Pago:* ${customerInfo.metodoPago === 'tarjeta' ? 'Tarjeta' : 'Transferencia'}`;

    if (customerInfo.notas) {
      message += `\n\n📝 *Nota:* ${customerInfo.notas}`;
    }

    return encodeURIComponent(message);
  };

  // --- FILTERS ---
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = searchQuery.trim() === '' ||
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeCategory === 'favoritos') return favorites.includes(p.id);
    if (activeCategory === 'destacados') return p.badges && p.badges.length > 0;
    return p.categoria === activeCategory;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 selection:bg-red-500 selection:text-white">

      {/* ── HEADER FIJO ── */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#FFB800] border-b-[3px] border-zinc-900 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logoImg} alt="Tacos Chepe Logo" className="h-20 md:h-24 w-auto object-contain drop-shadow-[2px_2px_0px_rgba(28,28,28,0.5)] transition-transform hover:scale-105" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveCategory('favoritos');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="relative p-2.5 bg-pink-500 rounded-full shadow-md text-white transition-transform active:scale-95 border-2 border-transparent hover:border-white"
              title="Mis Favoritos"
            >
              <Heart size={22} className="fill-white" />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-pink-600 text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md border-2 border-pink-500">
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-zinc-900 rounded-full shadow-md text-white transition-transform active:scale-95 border-2 border-transparent hover:border-white"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E63946] text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md border-2 border-zinc-900">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div className="relative pt-24 pb-16 px-4 bg-zinc-900 overflow-hidden flex items-center justify-center min-h-[380px] border-b-[4px] border-[#FFB800]">
        <img
          src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1200&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          alt="Taquería Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        <div className="relative z-10 text-center max-w-2xl mx-auto w-full">
          <span className="inline-block px-4 py-1.5 bg-[#E63946] text-white text-sm font-black uppercase tracking-widest rounded-full shadow-lg mb-6 rotate-[-2deg]">
            El Sabor de la Calle
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl mb-4 leading-none">
            AUTÉNTICOS <br /><span className="text-[#FFB800]">TACOS CHEPE</span>
          </h1>
          <p className="text-zinc-300 font-medium mb-8 text-lg md:text-xl drop-shadow-md">Directo de la parrilla a tu paladar. Ordena ahora.</p>

          <div className="relative max-w-md mx-auto group shadow-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#E63946] transition-colors" size={24} />
            <input
              type="search"
              placeholder="¿Qué se te antoja hoy? (ej. Arrachera)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-14 pr-4 py-4 rounded-xl font-bold text-zinc-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-[#FFB800] transition-all placeholder:text-zinc-400 text-lg border-2 border-transparent focus:border-zinc-900"
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 -mt-8 relative z-20">

        {/* ── CATEGORIES ── */}
        <div className="overflow-x-auto hide-scrollbar pb-6 mb-4">
          <div className="flex gap-3 min-w-max px-2">
            <button
              onClick={() => setActiveCategory('destacados')}
              className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 border-2 ${
                activeCategory === 'destacados'
                  ? 'bg-[#E63946] text-white border-zinc-900 shadow-[4px_4px_0px_rgba(28,28,28,1)]'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 shadow-sm'
              }`}
            >
              <Flame size={18} className={activeCategory === 'destacados' ? 'text-[#FFB800]' : 'text-orange-500'} /> Populares
            </button>
            {(['tacos', 'gringas', 'volcanes', 'harina', 'queso', 'tortas', 'paquetes', 'bebidas'] as Category[]).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all border-2 ${
                  activeCategory === cat
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-[4px_4px_0px_rgba(255,184,0,1)]'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 shadow-sm'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* ── PRODUCT GRID ── */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌮</div>
            <p className="text-xl text-zinc-400 font-bold mb-2">No encontramos nada con ese nombre</p>
            <button onClick={() => setSearchQuery('')} className="text-[#E63946] font-black hover:underline uppercase tracking-wide">Limpiar búsqueda</button>
          </div>
        ) : (
          <>
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {displayedProducts.map(product => {
                const isFav = favorites.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-[8px_8px_0px_rgba(28,28,28,1)] border-2 border-zinc-200 hover:border-zinc-900 flex flex-col group cursor-pointer transition-all duration-300"
                  >
                    {/* Image */}
                    <div
                      onClick={() => { setSelectedProduct(product); setModalQuantity(1); setModalBebida(''); }}
                      className="relative h-48 rounded-xl overflow-hidden mb-4 border border-zinc-100"
                    >
                      <img src={product.imagen} alt={product.nombre} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                      {/* Favorite heart */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md border-2 border-zinc-200 hover:border-pink-400 transition-colors"
                      >
                        <Heart
                          size={18}
                          className={isFav ? 'text-pink-500 fill-pink-500' : 'text-zinc-400'}
                        />
                      </button>

                      {/* Badge */}
                      {product.badges && product.badges.map((badge, idx) => (
                        <span key={idx} className="absolute top-3 left-3 bg-[#E63946] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-md border border-red-900">
                          {badge}
                        </span>
                      ))}

                      {/* Price tag */}
                      <div className="absolute bottom-3 right-3 bg-[#FFB800] border-2 border-zinc-900 text-zinc-900 px-3 py-1.5 rounded-lg font-black text-lg shadow-[2px_2px_0px_rgba(28,28,28,1)]">
                        ${product.precio}
                      </div>
                    </div>

                    {/* Info */}
                    <div
                      onClick={() => { setSelectedProduct(product); setModalQuantity(1); setModalBebida(''); }}
                      className="flex-1 px-1 pb-2"
                    >
                      <h3 className="font-black text-xl text-zinc-900 leading-tight mb-1 group-hover:text-[#E63946] transition-colors">{product.nombre}</h3>
                      {product.descripcion && <p className="text-sm text-zinc-500 font-medium line-clamp-2">{product.descripcion}</p>}
                    </div>

                    {/* Add to cart button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product.categoria === 'paquetes' || product.id === 'b-refresco') {
                          setSelectedProduct(product);
                          setModalQuantity(1);
                          setModalBebida('');
                        } else {
                          addToCart(product, 1);
                          showToast(`🌮 1x ${product.nombre} agregado`);
                        }
                      }}
                      className="mt-3 w-full py-3 bg-zinc-100 text-zinc-900 rounded-xl font-black uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-[#E63946] hover:text-white transition-colors active:scale-95 border-2 border-transparent hover:border-zinc-900"
                    >
                      <Plus size={20} strokeWidth={3} /> AGREGAR
                    </button>
                  </div>
                );
              })}
            </motion.div>

            {/* Load more button */}
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount(prev => prev + LOAD_MORE)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-zinc-300 text-zinc-600 rounded-xl font-black uppercase tracking-wider hover:border-zinc-900 hover:text-zinc-900 hover:shadow-[4px_4px_0px_rgba(255,184,0,1)] transition-all"
                >
                  Ver más productos <ChevronDown size={20} />
                </button>
              </div>
            )}

            {/* Results counter */}
            {filteredProducts.length > INITIAL_VISIBLE && (
              <p className="text-center text-sm text-zinc-400 font-medium mt-4">
                Mostrando {displayedProducts.length} de {filteredProducts.length} productos
              </p>
            )}
          </>
        )}
      </main>

      {/* ── PRODUCT DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden relative z-10 flex flex-col max-h-[90vh] shadow-[12px_12px_0px_rgba(255,184,0,1)] border-4 border-zinc-900"
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 bg-white border-2 border-zinc-900 text-zinc-900 hover:bg-[#FFB800] p-2 rounded-full transition-colors shadow-[2px_2px_0px_rgba(28,28,28,1)]">
                <X size={24} strokeWidth={3} />
              </button>
              <div className="h-72 relative shrink-0 border-b-4 border-zinc-900 bg-zinc-100">
                <img src={selectedProduct.imagen} className="w-full h-full object-cover" alt={selectedProduct.nombre} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <h2 className="text-4xl font-black text-white leading-tight drop-shadow-lg">{selectedProduct.nombre}</h2>
                </div>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-[#FFB800] text-zinc-900 border-2 border-zinc-900 font-black px-4 py-2 rounded-xl text-2xl shadow-[4px_4px_0px_rgba(28,28,28,1)]">
                    ${selectedProduct.precio}
                  </span>
                </div>
                <p className="text-zinc-600 mb-8 font-medium text-lg leading-relaxed">{selectedProduct.descripcion || 'El sabor auténtico de Tacos Chepe. Una delicia que no puedes dejar pasar, directo de la parrilla.'}</p>

                <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-2xl border-2 border-zinc-200 mb-8">
                  <span className="font-black text-zinc-900 ml-3 uppercase tracking-wider text-sm">Cantidad</span>
                  <div className="flex items-center gap-5 bg-white rounded-xl shadow-sm border-2 border-zinc-200 p-1.5">
                    <button onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))} className="p-2 text-zinc-400 hover:text-[#E63946] hover:bg-red-50 rounded-lg transition-colors"><Minus size={20} strokeWidth={3} /></button>
                    <span className="font-black text-2xl w-8 text-center text-zinc-900">{modalQuantity}</span>
                    <button onClick={() => setModalQuantity(modalQuantity + 1)} className="p-2 text-zinc-400 hover:text-[#25D366] hover:bg-green-50 rounded-lg transition-colors"><Plus size={20} strokeWidth={3} /></button>
                  </div>
                </div>

                {(selectedProduct.categoria === 'paquetes' || selectedProduct.id === 'b-refresco') && (
                  <div className="mb-8">
                    <span className="font-black text-zinc-900 ml-3 uppercase tracking-wider text-sm block mb-3">Sabor de Refresco</span>
                    <div className="flex flex-wrap gap-2">
                      {['Boing de Mango', 'Boing de Guayaba', 'Coca Cola', 'Coca Cola Zero'].map(sabor => (
                        <button
                          key={sabor}
                          onClick={() => setModalBebida(sabor)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                            modalBebida === sabor
                              ? 'bg-[#E63946] text-white border-zinc-900 shadow-[2px_2px_0px_rgba(28,28,28,1)]'
                              : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 shadow-sm'
                          }`}
                        >
                          {sabor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    if ((selectedProduct.categoria === 'paquetes' || selectedProduct.id === 'b-refresco') && !modalBebida) {
                      showToast('Debes seleccionar un sabor de refresco');
                      return;
                    }
                    addToCart(selectedProduct, modalQuantity, modalBebida);
                    showToast(`🌮 ${modalQuantity}x ${selectedProduct.nombre} agregado`);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-4 bg-[#E63946] text-white rounded-xl font-black text-xl hover:bg-red-700 transition-colors active:scale-95 border-2 border-zinc-900 shadow-[6px_6px_0px_rgba(28,28,28,1)] uppercase tracking-wider"
                >
                  Agregar por ${(selectedProduct.precio * modalQuantity).toFixed(2)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CART DRAWER ── */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md h-full relative z-10 flex flex-col border-l-4 border-zinc-900 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b-2 border-zinc-100 bg-white">
                <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-3 uppercase tracking-wide">
                  {cartStep === 'details' ? 'Finalizar Pedido' : cartStep === 'success' ? '¡Listo!' : 'Tu Orden'} <ShoppingBag size={24} className="text-[#E63946]" />
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 rounded-full transition-colors">
                  <X size={24} strokeWidth={2.5} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 bg-zinc-50">
                {cart.length === 0 && cartStep !== 'success' ? (
                  <div className="text-center py-24 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white border-2 border-zinc-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <ShoppingBag size={40} className="text-zinc-300" />
                    </div>
                    <p className="text-zinc-500 font-bold text-lg">Aún no hay tacos aquí</p>
                    <button onClick={() => setIsCartOpen(false)} className="mt-4 px-6 py-2 border-2 border-zinc-900 text-zinc-900 rounded-full font-black uppercase text-sm hover:bg-[#FFB800] transition-colors">Ver menú</button>
                  </div>
                ) : cartStep === 'success' ? (
                  /* SUCCESS SCREEN */
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center mb-6">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 mb-2">¡Pedido Listo!</h3>
                    <p className="text-zinc-500 text-sm mb-2">Redirigiendo a WhatsApp...</p>
                    <p className="text-zinc-400 text-xs">Envía el mensaje para confirmar tu pedido.</p>
                  </div>
                ) : cartStep === 'cart' ? (
                  /* CART ITEMS */
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl border-2 border-zinc-200 shadow-sm relative group">
                        <img src={item.imagen} alt={item.nombre} loading="lazy" className="w-24 h-24 rounded-xl object-cover border border-zinc-100" />
                        <div className="flex-1 py-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-black text-zinc-900 text-base leading-tight pr-6">
                              {item.nombre}
                              {item.varianteBebida && <span className="block text-sm text-zinc-500 font-medium mt-0.5">{item.varianteBebida}</span>}
                            </h4>
                            <p className="text-[#E63946] font-black text-base mt-1">${item.precio * item.quantity}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <button 
                              onClick={() => toggleSinCebolla(item.id)}
                              className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border-2 transition-colors ${item.sinCebolla ? 'bg-red-50 text-red-600 border-red-200' : 'bg-zinc-50 text-zinc-400 border-zinc-200 hover:border-zinc-300'}`}
                            >
                              {item.sinCebolla ? '✓ Sin Cebolla' : 'Sin Cebolla'}
                            </button>
                            <div className="flex items-center bg-zinc-50 rounded-lg p-0.5 border-2 border-zinc-200 ml-2">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-zinc-500 hover:text-zinc-900"><Minus size={16} strokeWidth={3} /></button>
                              <span className="font-black text-sm w-8 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-zinc-500 hover:text-zinc-900"><Plus size={16} strokeWidth={3} /></button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="absolute top-3 right-3 text-zinc-300 hover:text-[#E63946] transition-colors bg-white rounded-full p-1"><X size={18} strokeWidth={3} /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* CHECKOUT FORM */
                  <div className="space-y-4">
                    {/* Delivery Method */}
                    <div className="bg-white p-5 rounded-2xl border-2 border-[#FFB800] shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-[#FFB800]" />
                      <h3 className="font-black text-zinc-900 mb-4 flex items-center gap-2 uppercase tracking-wide ml-2"><User size={20} /> Tipo de Entrega</h3>
                      <div className="grid grid-cols-2 gap-3 ml-2">
                        <button
                          onClick={() => setCustomerInfo(prev => ({ ...prev, deliveryMethod: 'domicilio' }))}
                          className={`py-3.5 rounded-xl text-sm font-black uppercase tracking-wider border-2 transition-all ${customerInfo.deliveryMethod === 'domicilio' ? 'bg-[#FFB800] text-zinc-900 border-zinc-900' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'}`}
                        >
                          🛵 A domicilio
                        </button>
                        <button
                          onClick={() => setCustomerInfo(prev => ({ ...prev, deliveryMethod: 'recoger' }))}
                          className={`py-3.5 rounded-xl text-sm font-black uppercase tracking-wider border-2 transition-all ${customerInfo.deliveryMethod === 'recoger' ? 'bg-[#FFB800] text-zinc-900 border-zinc-900' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'}`}
                        >
                          🛍️ Recoger
                        </button>
                      </div>
                    </div>

                    {/* Customer Data */}
                    <div className="bg-white p-5 rounded-2xl border-2 border-zinc-900 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-zinc-900" />
                      <h3 className="font-black text-zinc-900 mb-4 flex items-center gap-2 uppercase tracking-wide ml-2"><User size={20} /> Datos de Contacto</h3>
                      <div className="space-y-3 ml-2">
                        <input
                          type="text" placeholder="Tu Nombre completo *"
                          value={customerInfo.nombre}
                          onChange={e => { setCustomerInfo({ ...customerInfo, nombre: e.target.value }); setErrors(prev => ({ ...prev, nombre: false })); }}
                          className={`w-full bg-zinc-50 px-4 py-3.5 rounded-xl text-base font-medium border-2 focus:outline-none focus:bg-white transition-colors ${errors.nombre ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-900'}`}
                        />
                        <input
                          type="tel" placeholder="Teléfono / WhatsApp *"
                          value={customerInfo.telefono}
                          onChange={e => { setCustomerInfo({ ...customerInfo, telefono: e.target.value }); setErrors(prev => ({ ...prev, telefono: false })); }}
                          className={`w-full bg-zinc-50 px-4 py-3.5 rounded-xl text-base font-medium border-2 focus:outline-none focus:bg-white transition-colors ${errors.telefono ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-900'}`}
                        />
                        {customerInfo.deliveryMethod === 'domicilio' && (
                          <input
                            type="text" placeholder="Dirección completa *"
                            value={customerInfo.direccion}
                            onChange={e => { setCustomerInfo({ ...customerInfo, direccion: e.target.value }); setErrors(prev => ({ ...prev, direccion: false })); }}
                            className={`w-full bg-zinc-50 px-4 py-3.5 rounded-xl text-base font-medium border-2 focus:outline-none focus:bg-white transition-colors ${errors.direccion ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-zinc-200 focus:border-zinc-900'}`}
                          />
                        )}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-5 rounded-2xl border-2 border-[#E63946] shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-[#E63946]" />
                      <h3 className="font-black text-zinc-900 mb-4 flex items-center gap-2 uppercase tracking-wide ml-2"><Wallet size={20} /> Método de Pago</h3>
                      <div className="grid grid-cols-2 gap-3 mb-4 ml-2">
                        <button
                          onClick={() => setCustomerInfo(prev => ({ ...prev, metodoPago: 'transferencia' }))}
                          className={`py-3.5 rounded-xl text-sm font-black uppercase tracking-wider border-2 transition-all ${customerInfo.metodoPago === 'transferencia' ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'}`}
                        >
                          🏦 Transferencia
                        </button>
                        <button
                          onClick={() => setCustomerInfo(prev => ({ ...prev, metodoPago: 'tarjeta' }))}
                          className={`py-3.5 rounded-xl text-sm font-black uppercase tracking-wider border-2 transition-all ${customerInfo.metodoPago === 'tarjeta' ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'}`}
                        >
                          💳 Tarjeta
                        </button>
                      </div>

                      {customerInfo.metodoPago === 'transferencia' && (
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 ml-2 space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-black text-zinc-900 text-sm uppercase tracking-wider">Datos Bancarios</h4>
                            <button onClick={copyBankInfo} className="text-xs font-bold text-[#E63946] hover:text-red-700 flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-lg border border-amber-300 transition-colors">
                              {copied ? <><Check className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
                            </button>
                          </div>
                          <div className="text-sm text-zinc-700 space-y-1 font-medium">
                            <p><span className="font-bold">Banco:</span> {bankInfo.bank_name}</p>
                            <p><span className="font-bold">Titular:</span> {bankInfo.account_holder}</p>
                            <p><span className="font-bold">CLABE:</span> {bankInfo.clabe}</p>
                            <p><span className="font-bold">Cuenta:</span> {bankInfo.account_number}</p>
                            <p><span className="font-bold">Tarjeta:</span> {bankInfo.card_number}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <textarea
                      placeholder="¿Notas para la cocina? (Ej. Sin cebolla, extra salsa...)"
                      value={customerInfo.notas}
                      onChange={e => setCustomerInfo({ ...customerInfo, notas: e.target.value })}
                      className="w-full bg-white px-5 py-4 rounded-2xl text-base font-medium border-2 border-zinc-200 focus:outline-none focus:border-zinc-900 min-h-[100px] resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && cartStep !== 'success' && (
                <div className="p-6 bg-white border-t-2 border-zinc-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-20">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider text-sm">Total ({cartCount} items)</span>
                    <span className="text-4xl font-black text-zinc-900 leading-none">${cartTotal.toFixed(2)}</span>
                  </div>
                  {cartStep === 'cart' ? (
                    <button
                      onClick={() => setCartStep('details')}
                      className="w-full py-4 bg-[#FFB800] text-zinc-900 border-2 border-zinc-900 rounded-xl font-black text-xl shadow-[4px_4px_0px_rgba(28,28,28,1)] hover:bg-[#FFC733] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(28,28,28,1)] transition-all uppercase tracking-wider"
                    >
                      Continuar Pedido
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button onClick={() => setCartStep('cart')} className="px-5 py-4 bg-white border-2 border-zinc-300 text-zinc-600 rounded-xl font-black uppercase hover:bg-zinc-50 hover:border-zinc-900 hover:text-zinc-900 transition-colors">Atrás</button>
                      <button onClick={handleCheckout} className="flex-1 py-4 bg-[#25D366] text-white border-2 border-zinc-900 rounded-xl font-black text-lg shadow-[4px_4px_0px_rgba(28,28,28,1)] hover:bg-[#1EBE5D] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(28,28,28,1)] transition-all flex items-center justify-center gap-2 uppercase tracking-wide">
                        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                        Pedir WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FLOATING WHATSAPP BUTTON ── */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola! Quiero hacer un pedido en Tacos Chepe 🌮')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[4px_4px_0px_rgba(28,28,28,1)] border-2 border-zinc-900 hover:bg-[#1EBE5D] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(28,28,28,1)] transition-all"
      >
        <MessageCircle size={28} fill="currentColor" />
      </a>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] bg-zinc-900 text-white px-6 py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_rgba(230,57,70,1)] border-2 border-zinc-800 flex items-center gap-3 whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER 3 COLUMNAS ── */}
      <footer className="bg-zinc-900 text-white mt-16 border-t-[6px] border-[#FFB800]">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Col 1: Logo + Descripción */}
            <div className="text-center md:text-left">
              <img src={logoImg} alt="Tacos Chepe Logo" className="h-24 w-auto object-contain mb-6 mx-auto md:mx-0 drop-shadow-[2px_2px_0px_rgba(28,28,28,0.5)]" />
              <p className="text-zinc-400 font-medium text-sm leading-relaxed">
                Los auténticos tacos callejeros que conquistan paladares. Ingredientes de primera, sazón inigualable y el sabor que te hace volver.
              </p>
            </div>

            {/* Col 2: Contacto + Redes */}
            <div className="text-center">
              <h4 className="font-black text-[#FFB800] uppercase tracking-wider text-sm mb-4">Contacto</h4>
              <div className="space-y-3 text-zinc-300 text-sm">
                <p className="flex items-center justify-center gap-2">
                  <MapPin size={16} className="text-[#FFB800]" />
                  Uxmal 182, Col. Narvarte, CDMX
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Phone size={16} className="text-[#FFB800]" />
                  <a href={`https://wa.me/${whatsappNumber}`} className="hover:text-[#FFB800] transition-colors">WhatsApp</a>
                </p>
              </div>
              <div className="mt-6">
                <h4 className="font-black text-[#FFB800] uppercase tracking-wider text-xs mb-3">Síguenos</h4>
                <div className="flex items-center justify-center gap-4">
                  <a href="https://www.facebook.com/TacosChepeNarvarte" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-zinc-800 rounded-full text-zinc-400 hover:bg-[#1877F2] hover:text-white transition-colors border border-zinc-700 hover:border-[#1877F2]" title="Facebook">
                    <Facebook size={18} />
                  </a>
                  <a href="https://www.instagram.com/tacoschepe.narvarte?igsh=bTR1MWdvcG84OWQ5" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-zinc-800 rounded-full text-zinc-400 hover:bg-[#E4405F] hover:text-white transition-colors border border-zinc-700 hover:border-[#E4405F]" title="Instagram">
                    <Instagram size={18} />
                  </a>
                  <a href="https://www.tiktok.com/@tacoschepe.oficial?_r=1&_t=ZS-98K2vAPwny9" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-zinc-800 rounded-full text-zinc-400 hover:bg-white hover:text-zinc-900 transition-colors border border-zinc-700 hover:border-white" title="TikTok">
                    <Music2 size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Col 3: Horarios */}
            <div className="text-center md:text-right">
              <h4 className="font-black text-[#FFB800] uppercase tracking-wider text-sm mb-4">Horario</h4>
              <div className="space-y-2 text-zinc-300 text-sm">
                <p className="flex items-center justify-center md:justify-end gap-2">
                  <Clock size={16} className="text-[#FFB800]" />
                  Lunes a Sábado
                </p>
                <p className="text-zinc-500 pl-7 md:pl-0 md:pr-7">5:00 pm — 4:00 am</p>
                <p className="text-[#E63946] font-bold text-xs mt-2">Domingo cerrado</p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t-2 border-zinc-800 text-center">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-center gap-2">
              <span>Diseñado con</span><Flame size={14} className="text-zinc-600" /><span>por Imagine & Stamp</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
