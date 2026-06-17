export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export interface Badge {
  id: string;
  label: string;
  emoji: string;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
}

export interface Features {
  useMercadoPago: boolean;
}

export interface SiteConfig {
  THEME: Theme;
  BADGES: Badge[];
  CATEGORIES: Category[];
  FEATURES: Features;
}

export const siteConfigTemplate: SiteConfig = {
  THEME: {
    primaryColor: '#FF6A00',
    secondaryColor: '#ffffff',
    bgColor: '#0d0d0d',
  },
  BADGES: [
    { id: 'NUEVO', label: 'Nuevo', emoji: '✨' },
    { id: 'EN OFERTA', label: 'Oferta', emoji: '🔥' },
    { id: 'MÁS VENDIDO', label: 'Más Vendido', emoji: '⭐' },
    { id: 'PRÓXIMAMENTE', label: 'Próximamente', emoji: '⏳' },
  ],
  CATEGORIES: [
    { id: 'cat1', label: 'Ejemplo 1', emoji: '📦' },
    { id: 'cat2', label: 'Ejemplo 2', emoji: '🎁' },
  ],
  FEATURES: {
    useMercadoPago: true,
  },
};
