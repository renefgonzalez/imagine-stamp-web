import { LucideIcon } from 'lucide-react';

export interface SubMenu {
  name: string;
  children: string[];
}

export interface Category {
  id: string;
  name: string;
  icon?: any; // Using any because LucideIcon can be tricky with serialization
  iconName?: string; // Store the name to reconstruct the icon
  bgColor: string;
  iconColor: string;
  dotColor: string;
  submenus: SubMenu[];
}

export interface Product {
  id: number | string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  sub_category?: string;
  sub_category_2?: string;
  is_digital?: boolean;
  drive_url?: string;
}

export interface DigitalOrder {
  id: number;
  product_id: number;
  download_token: string;
  status: 'pending' | 'paid';
  download_count: number;
  max_downloads: number;
  internal_notes?: string;
  created_at: string;
}
