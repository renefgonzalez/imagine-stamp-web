export interface Crepa {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  hoverImage: string;
  category: 'dulces' | 'saladas';
  keyIngredients: string[];
}

export const CREPAS: Crepa[] = [
  // Crepas Dulces
  {
    id: 'dulce-nutella-suprema',
    name: 'Nutella Suprema',
    description: 'Crepa rellena de Nutella, acompañada de fresas frescas, plátano y una bola de helado de vainilla encima.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1615887023516-9b6cbba0bc42?auto=format&fit=crop&w=800&q=80',
    category: 'dulces',
    keyIngredients: ['Nutella', 'Fresas', 'Plátano', 'Helado de Vainilla']
  },
  {
    id: 'dulce-cajeta-nuez',
    name: 'Cajeta con Nuez',
    description: 'Cajeta artesanal chorreada, nuez pecana picada y un sutil toque de canela en polvo.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1544431945-8bc67509d3b8?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1520177002598-a5509aeb7dcb?auto=format&fit=crop&w=800&q=80',
    category: 'dulces',
    keyIngredients: ['Cajeta', 'Nuez Pecana', 'Canela']
  },
  {
    id: 'dulce-fresas-crema',
    name: 'Fresas con Crema',
    description: 'Fresa natural fileteada, una capa generosa de queso crema (Philadelphia) y leche condensada.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1615887023516-9b6cbba0bc42?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80',
    category: 'dulces',
    keyIngredients: ['Queso Crema', 'Fresa', 'Leche Condensada']
  },

  // Crepas Saladas
  {
    id: 'salada-tres-quesos-jamon',
    name: 'Tres Quesos con Jamón',
    description: 'Combinación derretida de queso mozzarella, queso crema, queso americano y jamón de pavo premium.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1627522460108-215683bdc9ee?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b0?auto=format&fit=crop&w=800&q=80',
    category: 'saladas',
    keyIngredients: ['Mozzarella', 'Queso Crema', 'Americano', 'Jamón de Pavo']
  },
  {
    id: 'salada-poblana',
    name: 'Poblana',
    description: 'Tiras de pechuga de pollo desmenuzada, rajas poblanas tatemadas, elote tierno y queso gratinado.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1601314167099-232775bbfa88?auto=format&fit=crop&w=800&q=80',
    category: 'saladas',
    keyIngredients: ['Pollo', 'Rajas Poblanas', 'Elote', 'Queso']
  },
  {
    id: 'salada-pizza-crepa',
    name: 'Pizza Crepa',
    description: 'Rebanadas de pepperoni dorado, salsa de tomate sazonada de la casa y abundante queso mozzarella fundido.',
    price: 115,
    image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?auto=format&fit=crop&w=800&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    category: 'saladas',
    keyIngredients: ['Pepperoni', 'Mozzarella', 'Salsa de Tomate']
  }
];
