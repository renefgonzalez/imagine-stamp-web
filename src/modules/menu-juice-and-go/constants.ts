export type ProductType = 'jugo' | 'baguette' | 'sandwich' | 'platillo' | 'ensalada' | 'bebida';

export interface JuiceProduct {
  id: string;
  name: string;
  description?: string;
  type: ProductType;
  price: number;
  prices?: { size: string; price: number }[]; // For products with multiple sizes (e.g. 1/2 L, 1 L)
  options?: {
    name: string;
    choices: string[];
    required: boolean;
  }[];
  image?: string;
}

export const JUICE_CATALOG: JuiceProduct[] = [
  // JUGOS NATURALES
  {
    id: 'j-naranja',
    name: 'Jugo de Naranja',
    type: 'jugo',
    price: 60,
    prices: [{ size: '1/2 L', price: 60 }],
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'j-betabel',
    name: 'Jugo de Betabel',
    type: 'jugo',
    price: 60,
    prices: [{ size: '1/2 L', price: 60 }],
    image: 'https://images.unsplash.com/photo-1595981267035-7b04d84b4f1e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'j-zanahoria',
    name: 'Jugo de Zanahoria',
    type: 'jugo',
    price: 60,
    prices: [{ size: '1/2 L', price: 60 }],
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'j-melon',
    name: 'Jugo de Melón',
    type: 'jugo',
    price: 60,
    prices: [{ size: '1/2 L', price: 60 }],
    image: 'https://images.unsplash.com/photo-1571556012753-41cb7ecce886?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'j-papaya',
    name: 'Jugo de Papaya',
    type: 'jugo',
    price: 60,
    prices: [{ size: '1/2 L', price: 60 }],
    image: 'https://images.unsplash.com/photo-1615486171448-4fd1ab5610bc?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'j-verde',
    name: 'Jugo Verde',
    description: 'Pepino, espinaca, manzana verde, apio, piña, limón',
    type: 'jugo',
    price: 80,
    prices: [
      { size: '1/2 L', price: 80 },
      { size: '1 L', price: 100 }
    ],
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'j-rojo',
    name: 'Jugo Rojo',
    description: 'Betabel, manzana roja, frutos rojos, limón, jugo de naranja',
    type: 'jugo',
    price: 80,
    prices: [
      { size: '1/2 L', price: 80 },
      { size: '1 L', price: 100 }
    ],
    image: 'https://images.unsplash.com/photo-1622597467836-f3ec5220cde0?auto=format&fit=crop&q=80&w=400'
  },

  // BAGUETTES
  {
    id: 'b-jamon-queso',
    name: 'Baguette Jamón y Queso',
    description: 'Acompañado con papas',
    type: 'baguette',
    price: 80,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'b-pollo-buffalo',
    name: 'Baguette Pollo (Buffalo)',
    description: 'Acompañado con papas',
    type: 'baguette',
    price: 120,
    image: 'https://images.unsplash.com/photo-1619860860774-1e2e17343432?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'b-especial-panela',
    name: 'Baguette Especial con Queso Panela',
    description: 'Acompañado con papas',
    type: 'baguette',
    price: 140,
    image: 'https://images.unsplash.com/photo-1550508139-b967014fd1bc?auto=format&fit=crop&q=80&w=400'
  },

  // SANDWICHES
  {
    id: 's-jamon-queso',
    name: 'Sándwich Jamón y Queso',
    description: 'Acompañado con papas',
    type: 'sandwich',
    price: 65,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's-pollo',
    name: 'Sándwich Pollo o Pollo (Buffalo)',
    description: 'Acompañado con papas',
    type: 'sandwich',
    price: 85,
    options: [
      { name: 'Tipo de Pollo', choices: ['Pollo Natural', 'Pollo Buffalo'], required: true }
    ],
    image: 'https://images.unsplash.com/photo-1614531349540-3b03fbfaf455?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's-especial-panela',
    name: 'Sándwich Especial con Queso Panela',
    description: 'Acompañado con papas',
    type: 'sandwich',
    price: 100,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400'
  },

  // PLATILLOS
  {
    id: 'p-quesadillas-pollo',
    name: 'Quesadillas con Pollo a la Plancha',
    type: 'platillo',
    price: 190,
    image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'p-quesadillas-sincronizadas',
    name: 'Quesadillas Sincronizadas',
    description: 'Hechas con tortilla de trigo',
    type: 'platillo',
    price: 140,
    image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'p-pancakes-avena',
    name: 'Minipancakes de Avena',
    type: 'platillo',
    price: 50,
    prices: [
      { size: 'Orden de 10 pzs', price: 50 },
      { size: 'Orden de 20 pzs', price: 75 }
    ],
    image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=400'
  },

  // ENSALADAS
  {
    id: 'e-cesar-pollo',
    name: 'Ensalada César con Pollo',
    type: 'ensalada',
    price: 180,
    options: [
      { name: 'Aderezo Extra', choices: ['Ranch', 'Chipotle', 'Cilantro'], required: true }
    ],
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=400'
  },

  // BEBIDAS
  {
    id: 'beb-cafe',
    name: 'Café',
    type: 'bebida',
    price: 50,
    prices: [{ size: '1/2 L', price: 50 }],
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'beb-capuccino',
    name: 'Capuccino',
    type: 'bebida',
    price: 50,
    options: [
      { name: 'Tipo de Leche', choices: ['Almendra', 'Coco', 'Deslactosada'], required: true }
    ],
    image: 'https://images.unsplash.com/photo-1534687941688-1b2db3c480d1?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'beb-cafe-helado',
    name: 'Café Helado',
    type: 'bebida',
    price: 70,
    image: 'https://images.unsplash.com/photo-1461023058943-0708e52235eb?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'beb-licuados',
    name: 'Licuados de Frutas',
    type: 'bebida',
    price: 65,
    options: [
      { name: 'Sabor', choices: ['Fresa', 'Plátano', 'Papaya', 'Manzana', 'Melón'], required: true }
    ],
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'beb-chocomilk',
    name: 'Chocomilk',
    type: 'bebida',
    price: 50,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=400'
  }
];

export const STORE_INFO = {
  name: 'Juice & Go',
  whatsapp: '525650469993',
  address: 'Camino Real 13 Los Olvera, Qro.',
  slogan: 'Energía que se bebe'
};
