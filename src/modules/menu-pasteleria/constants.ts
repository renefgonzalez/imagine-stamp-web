export interface PanOption {
  id: string;
  name: string;
  note?: string;
}

export interface RellenoOption {
  id: string;
  name: string;
}

export interface ExtraOption {
  id: string;
  name: string;
}

export const PANES: PanOption[] = [
  { id: 'vainilla', name: 'Vainilla' },
  { id: 'chocolate', name: 'Chocolate' },
  { id: 'oreo', name: 'Oreo' },
  { id: 'red-velvet', name: 'Red Velvet' },
  { id: 'zanahoria', name: 'Zanahoria' },
  { id: 'platano', name: 'Plátano' },
  { id: 'chai', name: 'Chai' },
  { id: '3-leches', name: '3 Leches', note: 'No aplica para más de 12 personas' },
  { id: 'limon-blueberries', name: 'Limón Blueberries' },
  { id: 'limon-poppy-seed', name: 'Limón Poppy Seed' },
  { id: 'manzana', name: 'Manzana' },
  { id: 'cafe', name: 'Café' },
];

export const RELLENOS: RellenoOption[] = [
  { id: 'vainilla', name: 'Vainilla' },
  { id: 'chocolate', name: 'Chocolate' },
  { id: 'oreo', name: 'Oreo' },
  { id: 'mascarpone', name: 'Mascarpone' },
  { id: 'philadelphia', name: 'Philadelphia' },
  { id: 'matcha', name: 'Matcha' },
  { id: 'maracuya', name: 'Maracuyá' },
  { id: 'dulce-de-leche', name: 'Dulce de leche' },
  { id: 'lotus', name: 'Lotus' },
  { id: 'pay-de-limon', name: 'Pay de limón' },
  { id: 'ganache-amargo', name: 'Ganache de chocolate amargo' },
];

export const EXTRAS: ExtraOption[] = [
  { id: 'fresa', name: 'Fresa' },
  { id: 'blueberries', name: 'Blueberries' },
  { id: 'frambuesa', name: 'Frambuesa' },
  { id: 'zarzamora', name: 'Zarzamora' },
  { id: 'nuez', name: 'Nuez' },
  { id: 'almendra', name: 'Almendra' },
  { id: 'avellana', name: 'Avellana' },
  { id: 'chocolate-pref', name: 'Chocolate de tu preferencia' },
  { id: 'curd-limon', name: 'Curd de limón' },
  { id: 'coco', name: 'Coco' },
  { id: 'mermelada-fresa', name: 'Mermelada de fresa' },
  { id: 'mermelada-guayaba', name: 'Mermelada de Guayaba' },
  { id: 'galletas', name: 'Galletas' },
  { id: 'crumble', name: 'Crumble' },
  { id: 'galletas-lotus', name: 'Galletas Lotus' },
  { id: 'brownies-bites', name: 'Brownies Bites' },
  { id: 'cheesecake-bites', name: 'Cheesecake Bites' },
];
