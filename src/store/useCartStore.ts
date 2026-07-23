import { create } from 'zustand';
import { Product } from '../data/products';
import { trackMetaEvent } from '../utils/metaPixel';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  city: string; // Para retrocompatibilidad
  notes: string;
  paymentMethod: string;
  deliveryMethod: 'domicilio' | 'recoger';
  address: string;
  suburb: string;
  crossStreets: string;
  references: string;
}

interface CartState {
  // Estado
  cart: CartItem[];
  isCartOpen: boolean;
  cartStep: 'cart' | 'details';
  cartToast: { name: string } | null;
  customerInfo: CustomerInfo;
  mpLoading: boolean;

  // Acciones (Getters calculados)
  totalItems: () => number;
  totalPrice: () => number;

  // Acciones (Mutadores)
  addToCart: (product: Product) => void;
  updateQuantity: (id: string | number, delta: number) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;

  openCart: () => void;
  closeCart: () => void;
  setCartStep: (step: 'cart' | 'details') => void;
  setCartToast: (toast: { name: string } | null) => void;
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;
  setMpLoading: (loading: boolean) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  isCartOpen: false,
  cartStep: 'cart',
  cartToast: null,
  customerInfo: { name: '', phone: '', city: '', notes: '', paymentMethod: 'Efectivo', deliveryMethod: 'domicilio', address: '', suburb: '', crossStreets: '', references: '' },
  mpLoading: false,

  totalItems: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
  totalPrice: () => get().cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),

  addToCart: (product: Product) => {
    set((state) => {
      const existing = state.cart.find(item => String(item.id) === String(product.id));
      if (existing) {
        return {
          cart: state.cart.map(item => 
            String(item.id) === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return {
        cart: [...state.cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
      };
    });
    
    // Toast automático
    get().setCartToast({ name: product.name });
    setTimeout(() => get().setCartToast(null), 3500);

    // Meta Pixel: AddToCart
    const item = get().cart.find(i => String(i.id) === String(product.id));
    const qty = item ? item.quantity : 1;
    trackMetaEvent('AddToCart', {
      content_name: product.name,
      content_ids: [String(product.id)],
      content_type: 'product',
      value: product.price * qty,
      currency: 'MXN',
      contents: [{ id: String(product.id), quantity: qty }],
    });
  },

  updateQuantity: (id: string | number, delta: number) => {
    set((state) => ({
      cart: state.cart.map(item => 
        String(item.id) === String(id) ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    }));
  },

  removeFromCart: (id: string | number) => {
    set((state) => ({
      cart: state.cart.filter(item => String(item.id) !== String(id))
    }));
  },

  clearCart: () => set({ cart: [] }),

  openCart: () => set({ cartStep: 'cart', isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  setCartStep: (step) => set({ cartStep: step }),
  setCartToast: (toast) => set({ cartToast: toast }),
  
  setCustomerInfo: (info) => set((state) => ({ 
    customerInfo: { ...state.customerInfo, ...info } 
  })),
  
  setMpLoading: (loading) => set({ mpLoading: loading })
}));
