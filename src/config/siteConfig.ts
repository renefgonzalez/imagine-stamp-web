import { SiteConfig } from './siteConfig.template';

export const siteConfig: SiteConfig = {
  THEME: {
    primaryColor: '#E63946',
    secondaryColor: '#ffffff',
    bgColor: '#0d0d0d',
  },
  BADGES: [
    { id: 'NUEVO', label: 'Nuevo', emoji: '✨' },
    { id: 'EN OFERTA', label: 'Oferta', emoji: '🔥' },
    { id: 'MÁS VENDIDO', label: 'Más Vendido', emoji: '⭐' },
  ],
  CATEGORIES: [
    { id: 'postres', label: 'Postres', emoji: '🍰' },
    { id: 'bebidas', label: 'Bebidas', emoji: '🥤' },
    { id: 'salados', label: 'Salados', emoji: '🍕' },
  ],
  FEATURES: {
    useMercadoPago: true,
  },
};

export * from './siteConfig.template';
