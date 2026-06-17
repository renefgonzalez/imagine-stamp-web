import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

const SpeedyCartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M7 6h15l-2 10H9L7 6z" />
  </svg>
);

export const CartButton: React.FC = () => {
  const { totalItems, openCart, cartToast, setCartToast } = useCartStore();

  return (
    <>
      <div 
        className="relative w-11 h-11 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-secondary/20" 
        onClick={openCart}
      >
        <SpeedyCartIcon className="text-white w-6 h-6" />
        {totalItems() > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            {totalItems()}
          </span>
        )}
      </div>

      <AnimatePresence>
        {cartToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[100] bg-white text-primary px-4 py-3 rounded-2xl shadow-2xl border border-primary/10 flex items-center gap-3 cursor-pointer"
          >
            <div 
              className="flex items-center gap-3"
              onClick={() => { setCartToast(null); openCart(); }}
            >
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                <ShoppingBag size={16} />
              </div>
              <div className="pr-4">
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-0.5">Agregado al pedido</p>
                <p className="text-sm font-bold truncate max-w-[200px]">{cartToast.name}</p>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setCartToast(null); }}
              className="text-primary/20 hover:text-primary transition-colors ml-2"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
