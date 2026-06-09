import { create } from 'zustand';

export interface CartItem {
  id: string; // Unique ID for the cart instance (e.g. productId-timestamp)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  options?: Record<string, string>; // e.g. { "Tipo de Leche": "Almendra" }
  notes?: string;
  image?: string;
}

interface JuiceStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

export const useJuiceStore = create<JuiceStore>()((set) => ({
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(i => i.id !== id) })),
  updateQuantity: (id, delta) => set((state) => ({
    cart: state.cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    })
  })),
  clearCart: () => set({ cart: [] }),
}));
