import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export type SizeOption = '3-4 personas' | '6-8 personas' | '10-12 personas' | '20 personas' | '30 personas';

export interface PriceMatrix {
  '3-4 personas': number;
  '6-8 personas': number;
  '10-12 personas': number;
  '20 personas': number;
  '30 personas': number;
}

export interface PricingTier {
  id: string;
  name: string;
  type: 'pan' | 'relleno' | 'extra' | 'decoracion';
  prices: PriceMatrix | number;
}

export interface CartItem {
  type: 'custom' | 'express';
  pan?: string;
  relleno?: string;
  extras?: string[];
  decoraciones?: string[];
  size?: SizeOption;
  id?: string;
  name?: string;
  price: number;
  quantity: number;
}

export interface LazaroOrder {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryType: 'tienda' | 'domicilio';
  deliveryAddress: string;
  paymentMethod: 'spei' | 'efectivo' | 'tarjeta';
  specialNotes: string;
  totalAmount: number;
  items: CartItem[];
  status: 'PENDIENTE' | 'ENTREGADO';
  notasInternas?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  note?: string;
}

export interface ProductoExpress {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenes: string[];
  etiqueta?: string;
  categoria: string;
  video_url?: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'pan-clasico',
    name: 'Categoría A (Pan Clásico)',
    type: 'pan',
    prices: { '3-4 personas': 70, '6-8 personas': 140, '10-12 personas': 160, '20 personas': 180, '30 personas': 270 }
  },
  {
    id: 'pan-premium',
    name: 'Categoría B (Pan Premium)',
    type: 'pan',
    prices: { '3-4 personas': 85, '6-8 personas': 170, '10-12 personas': 210, '20 personas': 240, '30 personas': 360 }
  },
  {
    id: 'relleno-clasico',
    name: 'Categoría C (Relleno Clásico)',
    type: 'relleno',
    prices: { '3-4 personas': 55, '6-8 personas': 110, '10-12 personas': 150, '20 personas': 180, '30 personas': 250 }
  },
  {
    id: 'relleno-premium',
    name: 'Categoría D (Relleno Premium)',
    type: 'relleno',
    prices: { '3-4 personas': 75, '6-8 personas': 140, '10-12 personas': 180, '20 personas': 220, '30 personas': 280 }
  },
  {
    id: 'extras-frutos',
    name: 'Categoría E (Frutos)',
    type: 'extra',
    prices: { '3-4 personas': 50, '6-8 personas': 100, '10-12 personas': 150, '20 personas': 200, '30 personas': 200 }
  },
  {
    id: 'extras-semillas',
    name: 'Categoría F (Semillas)',
    type: 'extra',
    prices: { '3-4 personas': 30, '6-8 personas': 60, '10-12 personas': 100, '20 personas': 150, '30 personas': 150 }
  },
  {
    id: 'extras-especiales',
    name: 'Categoría G (Especiales)',
    type: 'extra',
    prices: { '3-4 personas': 40, '6-8 personas': 80, '10-12 personas': 130, '20 personas': 220, '30 personas': 330 }
  },
  {
    id: 'extras-fijo',
    name: 'Categoría H (Precio Fijo)',
    type: 'extra',
    prices: 80
  },
  {
    id: 'decoracion-fondant',
    name: 'Categoría I (Decoración en fondant)',
    type: 'decoracion',
    prices: 100
  },
  {
    id: 'decoracion-topper',
    name: 'Categoría I (Cake Topper papel)',
    type: 'decoracion',
    prices: 55
  },
  {
    id: 'decoracion-mdf',
    name: 'Categoría I (Cake Topper MDF)',
    type: 'decoracion',
    prices: 60
  },
  {
    id: 'decoracion-frase',
    name: 'Categoría I (Frase personalizada)',
    type: 'decoracion',
    prices: 30
  }
];

export const DEFAULT_PANES: CatalogItem[] = [
  { id: 'chocolate', name: 'Chocolate', category: 'pan-clasico' },
  { id: 'vainilla', name: 'Vainilla', category: 'pan-clasico' },
  { id: 'platano', name: 'Plátano', category: 'pan-clasico' },
  { id: '3-leches', name: '3 Leches', category: 'pan-clasico', note: 'No aplica para más de 12 personas' },
  { id: 'oreo', name: 'Oreo', category: 'pan-premium' },
  { id: 'zanahoria', name: 'Zanahoria', category: 'pan-premium' },
  { id: 'red-velvet', name: 'Red Velvet', category: 'pan-premium' },
  { id: 'chai', name: 'Chai', category: 'pan-premium' },
  { id: 'limon', name: 'Limón', category: 'pan-premium' },
  { id: 'blueberry', name: 'Blueberry', category: 'pan-premium' },
  { id: 'elote', name: 'Elote', category: 'pan-premium' },
  { id: 'cafe', name: 'Café', category: 'pan-premium' }
];

export const DEFAULT_RELLENOS: CatalogItem[] = [
  { id: 'vainilla-relleno', name: 'Vainilla', category: 'relleno-clasico' },
  { id: 'dulce-de-leche', name: 'Dulce de leche', category: 'relleno-clasico' },
  { id: 'oreo-relleno', name: 'Oreo', category: 'relleno-clasico' },
  { id: 'chocolate-relleno', name: 'Chocolate', category: 'relleno-clasico' },
  { id: 'philadelphia', name: 'Philadelphia', category: 'relleno-premium' },
  { id: 'mascarpone', name: 'Mascarpone', category: 'relleno-premium' },
  { id: 'matcha', name: 'Matcha', category: 'relleno-premium' },
  { id: 'maracuya', name: 'Maracuyá', category: 'relleno-premium' },
  { id: 'lotus', name: 'Lotus', category: 'relleno-premium' },
  { id: 'pay-de-limon', name: 'Pay de limón', category: 'relleno-premium' },
  { id: 'ganache-chocolate', name: 'Ganache de chocolate', category: 'relleno-premium' }
];

export const DEFAULT_EXTRAS: CatalogItem[] = [
  { id: 'fresa', name: 'Fresa', category: 'extras-frutos' },
  { id: 'blueberry-extra', name: 'Blueberry', category: 'extras-frutos' },
  { id: 'frambuesa', name: 'Frambuesa', category: 'extras-frutos' },
  { id: 'zarzamora', name: 'Zarzamora', category: 'extras-frutos' },
  { id: 'nuez', name: 'Nuez', category: 'extras-semillas' },
  { id: 'almendra', name: 'Almendra', category: 'extras-semillas' },
  { id: 'avellana-tostada', name: 'Avellana tostada', category: 'extras-semillas' },
  { id: 'coco', name: 'Coco', category: 'extras-semillas' },
  { id: 'galleta-lotus', name: 'Galleta Lotus', category: 'extras-especiales' },
  { id: 'crumble', name: 'Crumble', category: 'extras-especiales' },
  { id: 'guayaba', name: 'Mermelada de Guayaba', category: 'extras-fijo' }
];

export const DEFAULT_DECORACIONES: CatalogItem[] = [
  { id: 'dec-fondant', name: 'Decoración en fondant', category: 'decoracion-fondant' },
  { id: 'dec-topper', name: 'Cake Topper (papel fotográfico)', category: 'decoracion-topper' },
  { id: 'dec-mdf', name: 'Cake topper happy birthday (letrero mdf)', category: 'decoracion-mdf', note: '*MDF: madera sintética de material comprimido*' },
  { id: 'dec-frase', name: 'Frase personalizada', category: 'decoracion-frase' }
];

export const DEFAULT_PRODUCTOS_EXPRESS: ProductoExpress[] = [
  {
    id: 'cupcakes-clasicos-6',
    nombre: 'Cupcakes Clásicos (Media Docena)',
    descripcion: 'Pan de vainilla o chocolate con relleno de dulce de leche.',
    precio: 450,
    imagenes: ['/assets/placeholder-cupcake1.jpg', '/assets/placeholder-cupcake2.jpg'],
    etiqueta: 'Novedad',
    categoria: 'Cupcakes en 3 horas'
  }
];

export const DEFAULT_EXPRESS_CATEGORIES = ['Cupcakes en 3 horas'];

export const SIZES: SizeOption[] = [
  '3-4 personas',
  '6-8 personas',
  '10-12 personas',
  '20 personas',
  '30 personas'
];

export function useCatalog() {
  const [panes, setPanes] = useState<CatalogItem[]>(DEFAULT_PANES);
  const [rellenos, setRellenos] = useState<CatalogItem[]>(DEFAULT_RELLENOS);
  const [extras, setExtras] = useState<CatalogItem[]>(DEFAULT_EXTRAS);
  const [decoraciones, setDecoraciones] = useState<CatalogItem[]>(DEFAULT_DECORACIONES);
  const [tiers, setTiers] = useState<PricingTier[]>(PRICING_TIERS);
  const [expressProducts, setExpressProducts] = useState<ProductoExpress[]>(DEFAULT_PRODUCTOS_EXPRESS);
  const [expressCategories, setExpressCategories] = useState<string[]>(DEFAULT_EXPRESS_CATEGORIES);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('lazaro_productos').select('*');
      if (error) {
        console.error('Error fetching express products from Supabase:', error);
      } else if (data) {
        setExpressProducts(data as ProductoExpress[]);
      }
    } catch (err) {
      console.error('Unexpected error fetching express products:', err);
    }
  };

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase.from('lazaro_configuracion').select('*').eq('id', 1).single();
      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Error fetching config from Supabase:', error);
        }
      } else if (data) {
        if (data.panes && data.panes.length > 0) setPanes(data.panes);
        if (data.rellenos && data.rellenos.length > 0) setRellenos(data.rellenos);
        if (data.extras && data.extras.length > 0) setExtras(data.extras);
        if (data.decoraciones && data.decoraciones.length > 0) setDecoraciones(data.decoraciones);
        if (data.tiers && data.tiers.length > 0) setTiers(data.tiers);
        if (data.express_cats && data.express_cats.length > 0) setExpressCategories(data.express_cats);
      }
    } catch (err) {
      console.error('Unexpected error fetching config:', err);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchProducts();
  }, []);

  const saveCatalog = async (
    newPanes: CatalogItem[], 
    newRellenos: CatalogItem[], 
    newExtras: CatalogItem[], 
    newDecoraciones: CatalogItem[],
    newTiers: PricingTier[], 
    newExpressCats: string[]
  ) => {
    setPanes(newPanes);
    setRellenos(newRellenos);
    setExtras(newExtras);
    setDecoraciones(newDecoraciones);
    setTiers(newTiers);
    setExpressCategories(newExpressCats);
    
    try {
      const { error } = await supabase.from('lazaro_configuracion').upsert({
        id: 1,
        panes: newPanes,
        rellenos: newRellenos,
        extras: newExtras,
        decoraciones: newDecoraciones,
        tiers: newTiers,
        express_cats: newExpressCats
      });
      if (error) throw error;
    } catch (err) {
      console.error('Error saving config to Supabase:', err);
    }
  };

  return { panes, rellenos, extras, decoraciones, tiers, expressProducts, expressCategories, saveCatalog, fetchProducts, SIZES };
}
