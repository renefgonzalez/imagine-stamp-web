export interface Crepa {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  hoverImage: string;
  type: 'dulce' | 'salada';
  keyIngredients: string[];
}

export const CREPAS: Crepa[] = [
  // Crepas Dulces
  {
    id: 'dulce-nutella-suprema',
    name: 'Nutella Suprema',
    description: 'Deliciosa crepa rellena de Nutella, acompañada de fresas frescas y plátano.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1615887023516-9b6cbba0bc42?auto=format&fit=crop&w=800&q=80',
    type: 'dulce',
    keyIngredients: ['Nutella', 'Fresa', 'Plátano']
  },
  {
    id: 'dulce-cajeta-nuez',
    name: 'Cajeta con Nuez',
    description: 'Un clásico irresistible. Bañada en cajeta tradicional con trozos crujientes de nuez.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1544431945-8bc67509d3b8?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1520177002598-a5509aeb7dcb?auto=format&fit=crop&w=800&q=80',
    type: 'dulce',
    keyIngredients: ['Cajeta', 'Nuez']
  },
  {
    id: 'dulce-fresas-crema',
    name: 'Fresas con Crema',
    description: 'Suave crepa con una mezcla de queso crema dulce y fresas frescas seleccionadas.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1615887023516-9b6cbba0bc42?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80',
    type: 'dulce',
    keyIngredients: ['Queso Crema', 'Fresa']
  },

  // Crepas Saladas
  {
    id: 'salada-tres-quesos-jamon',
    name: 'Tres Quesos con Jamón',
    description: 'Nuestra combinación perfecta de tres quesos derretidos con exquisito jamón ahumado.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1627522460108-215683bdc9ee?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b0?auto=format&fit=crop&w=800&q=80',
    type: 'salada',
    keyIngredients: ['Gouda', 'Manchego', 'Mozzarella', 'Jamón']
  },
  {
    id: 'salada-poblana',
    name: 'Poblana',
    description: 'Crepa rellena de pechuga de pollo, rajas poblanas cremosas y granos de elote tierno.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1601314167099-232775bbfa88?auto=format&fit=crop&w=800&q=80',
    type: 'salada',
    keyIngredients: ['Pollo', 'Rajas', 'Elote']
  },
  {
    id: 'salada-pizza-crepa',
    name: 'Pizza Crepa',
    description: 'Sabor a pizza en una crepa. Pepperoni crujiente y abundante queso mozzarella fundido.',
    price: 115,
    image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    type: 'salada',
    keyIngredients: ['Pepperoni', 'Mozzarella', 'Salsa de Tomate']
  }
];
