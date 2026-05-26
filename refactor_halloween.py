import re

with open('c:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-&-stamp/src/MundoHalloween.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Supabase import
content = content.replace("import { ShoppingCart", "import { supabase } from './lib/supabase';\nimport { ShoppingCart")

# 2. Update Types
types_replacement = """interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge?: 'popular' | 'new' | 'veggie' | 'spicy';
  rating: number;
  calories: number;
  soldOut?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}"""

new_types = """interface Costume {
  id: string;
  name: string;
  description: string;
  price: number;
  rentalPrice?: number;
  image: string;
  category: string;
  type: 'Renta' | 'Venta' | 'Renta y Venta';
  sizes: string[];
  badge?: 'popular' | 'new' | 'oferta';
  soldOut?: boolean;
}

interface CartItem extends Costume {
  quantity: number;
  selectedSize?: string;
  selectedType?: 'Renta' | 'Venta';
}"""

# Fallback regex if spacing differs
content = re.sub(r'interface MenuItem \{.*?\n\}', new_types.split('\n\n')[0], content, flags=re.DOTALL)
content = re.sub(r'interface CartItem extends MenuItem \{.*?\n\}', new_types.split('\n\n')[1], content, flags=re.DOTALL)

# 3. Rename MenuItem array references
content = content.replace("MenuItem[]", "Costume[]")
content = content.replace("MenuItem | null", "Costume | null")

# 4. Categories update
cat_replacement = """const CATEGORIES = [
  { id: 'all',       label: 'Todo',        emoji: '🍔' },
  { id: 'burgers',   label: 'Burgers',     emoji: '🥩' },
  { id: 'sides',     label: 'Sides',       emoji: '🍟' },
  { id: 'drinks',    label: 'Bebidas',     emoji: '🥤' },
  { id: 'desserts',  label: 'Postres',     emoji: '🍫' },
];"""

new_cats = """const CATEGORIES = [
  { id: 'all',         label: 'Todo',        emoji: '🎃' },
  { id: 'terror',      label: 'Terror',      emoji: '🧟‍♂️' },
  { id: 'superheroes', label: 'Superhéroes', emoji: '🦸‍♂️' },
  { id: 'infantiles',  label: 'Infantiles',  emoji: '🧸' },
  { id: 'accesorios',  label: 'Accesorios',  emoji: '🎭' },
];"""
content = content.replace(cat_replacement, new_cats)
content = re.sub(r'const CATEGORIES = \[.*?\];', new_cats, content, flags=re.DOTALL)

# 5. Header / UI tweaks
content = content.replace("DEMO BY ELENA ROJAS", "DEMO POR IMAGINE & STAMP")
content = content.replace("Menú Digital", "Mundo de Halloween")

with open('c:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-&-stamp/src/MundoHalloween.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
