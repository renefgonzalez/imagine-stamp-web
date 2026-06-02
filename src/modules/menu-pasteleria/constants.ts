import { useState, useEffect } from 'react';

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  note?: string;
}

export interface PanOption extends CatalogItem {}
export interface RellenoOption extends CatalogItem {}
export interface ExtraOption extends CatalogItem {}

export const DEFAULT_PANES: PanOption[] = [
  { id: 'vainilla', name: 'Vainilla', price: 0 },
  { id: 'chocolate', name: 'Chocolate', price: 0 },
  { id: 'oreo', name: 'Oreo', price: 0 },
  { id: 'red-velvet', name: 'Red Velvet', price: 0 },
  { id: 'zanahoria', name: 'Zanahoria', price: 0 },
  { id: 'platano', name: 'Plátano', price: 0 },
  { id: 'chai', name: 'Chai', price: 0 },
  { id: '3-leches', name: '3 Leches', price: 0, note: 'No aplica para más de 12 personas' },
  { id: 'limon-blueberries', name: 'Limón Blueberries', price: 0 },
  { id: 'limon-poppy-seed', name: 'Limón Poppy Seed', price: 0 },
  { id: 'manzana', name: 'Manzana', price: 0 },
  { id: 'cafe', name: 'Café', price: 0 },
];

export const DEFAULT_RELLENOS: RellenoOption[] = [
  { id: 'vainilla', name: 'Vainilla', price: 0 },
  { id: 'chocolate', name: 'Chocolate', price: 0 },
  { id: 'oreo', name: 'Oreo', price: 0 },
  { id: 'mascarpone', name: 'Mascarpone', price: 0 },
  { id: 'philadelphia', name: 'Philadelphia', price: 0 },
  { id: 'matcha', name: 'Matcha', price: 0 },
  { id: 'maracuya', name: 'Maracuyá', price: 0 },
  { id: 'dulce-de-leche', name: 'Dulce de leche', price: 0 },
  { id: 'lotus', name: 'Lotus', price: 0 },
  { id: 'pay-de-limon', name: 'Pay de limón', price: 0 },
  { id: 'ganache-amargo', name: 'Ganache de chocolate amargo', price: 0 },
];

export const DEFAULT_EXTRAS: ExtraOption[] = [
  { id: 'fresa', name: 'Fresa', price: 0 },
  { id: 'blueberries', name: 'Blueberries', price: 0 },
  { id: 'frambuesa', name: 'Frambuesa', price: 0 },
  { id: 'zarzamora', name: 'Zarzamora', price: 0 },
  { id: 'nuez', name: 'Nuez', price: 0 },
  { id: 'almendra', name: 'Almendra', price: 0 },
  { id: 'avellana', name: 'Avellana', price: 0 },
  { id: 'chocolate-pref', name: 'Chocolate de tu preferencia', price: 0 },
  { id: 'curd-limon', name: 'Curd de limón', price: 0 },
  { id: 'coco', name: 'Coco', price: 0 },
  { id: 'mermelada-fresa', name: 'Mermelada de fresa', price: 0 },
  { id: 'mermelada-guayaba', name: 'Mermelada de Guayaba', price: 0 },
  { id: 'galletas', name: 'Galletas', price: 0 },
  { id: 'crumble', name: 'Crumble', price: 0 },
  { id: 'galletas-lotus', name: 'Galletas Lotus', price: 0 },
  { id: 'brownies-bites', name: 'Brownies Bites', price: 0 },
  { id: 'cheesecake-bites', name: 'Cheesecake Bites', price: 0 },
];

export const PANES = DEFAULT_PANES;
export const RELLENOS = DEFAULT_RELLENOS;
export const EXTRAS = DEFAULT_EXTRAS;

export function useCatalog() {
  const [panes, setPanes] = useState<PanOption[]>(DEFAULT_PANES);
  const [rellenos, setRellenos] = useState<RellenoOption[]>(DEFAULT_RELLENOS);
  const [extras, setExtras] = useState<ExtraOption[]>(DEFAULT_EXTRAS);

  useEffect(() => {
    const localPanes = localStorage.getItem('lazaro_catalog_panes');
    const localRellenos = localStorage.getItem('lazaro_catalog_rellenos');
    const localExtras = localStorage.getItem('lazaro_catalog_extras');

    if (localPanes) setPanes(JSON.parse(localPanes));
    if (localRellenos) setRellenos(JSON.parse(localRellenos));
    if (localExtras) setExtras(JSON.parse(localExtras));
  }, []);

  const saveCatalog = (newPanes: PanOption[], newRellenos: RellenoOption[], newExtras: ExtraOption[]) => {
    setPanes(newPanes);
    setRellenos(newRellenos);
    setExtras(newExtras);
    localStorage.setItem('lazaro_catalog_panes', JSON.stringify(newPanes));
    localStorage.setItem('lazaro_catalog_rellenos', JSON.stringify(newRellenos));
    localStorage.setItem('lazaro_catalog_extras', JSON.stringify(newExtras));
  };

  return { panes, rellenos, extras, saveCatalog };
}
