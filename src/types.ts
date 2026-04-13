import { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon?: any; // Using any because LucideIcon can be tricky with serialization
  iconName?: string; // Store the name to reconstruct the icon
  bgColor: string;
  iconColor: string;
  dotColor: string;
  submenus: string[];
}

export interface Product {
  id: number | string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  sub_category?: string;
}
