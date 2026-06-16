import { LayoutGrid, UtensilsCrossed, Salad, Fish, Beef, Pizza, IceCream, Baby, Wine, Coffee, Beer } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
}

export const CATEGORIES = [
  { id: 'entradas', name: 'Entradas', icon: <UtensilsCrossed size={20} /> },
  { id: 'ensaladas', name: 'Ensaladas', icon: <Salad size={20} /> },
  { id: 'pastas', name: 'Pastas', icon: <UtensilsCrossed size={20} /> },
  { id: 'mar-y-tierra', name: 'Del Mar y Tierra', icon: <Fish size={20} /> },
  { id: 'tacos', name: 'Tacos', icon: <Pizza size={20} /> },
  { id: 'cortes', name: 'Cortes', icon: <Beef size={20} /> },
  { id: 'snacks', name: 'Snacks', icon: <Pizza size={20} /> },
  { id: 'postres', name: 'Postres', icon: <IceCream size={20} /> },
  { id: 'kids', name: 'Kids', icon: <Baby size={20} /> },
  { id: 'bebidas', name: 'Bebidas', icon: <Coffee size={20} /> },
  { id: 'botellas', name: 'Botellas', icon: <Wine size={20} /> },
];

export const PRODUCTS: Product[] = [
  // --- ENTRADAS ---
  {
    id: 'ent_01',
    category: 'entradas',
    name: 'TABLA LA MARIA RESERVE',
    price: 450.00,
    description: 'Jamón serrano, queso Gouda, queso cheddar, salami italiano, uvas verdes y moradas, fresas frescas, almendras tostadas, aceitunas verdes, mermelada de frutos rojos, miel picante o miel trufada, baguette tostado y pretzels.',
    image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=500&h=400&fit=crop'
  },
  {
    id: 'ent_02',
    category: 'entradas',
    name: 'CHICHARRÓN DE RIB EYE',
    price: 400.00,
    description: 'Crujiente rib eye confitado sobre guacamole artesanal, acompañado de cebolla morada encurtida, chile serrano tatemado, cilantro fresco acompañado tortillas de maíz banco o azul.',
    image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&h=400&fit=crop',
    popular: true
  },
  {
    id: 'ent_03',
    category: 'entradas',
    name: 'TOSTADA DE ATÚN',
    price: 120.00,
    description: 'Atún fresco marinado en cítricos y chile seco, sobre tostada artesanal crujiente, acompañado de aguacate, cebolla crispy, ajonjolí negro y emulsión spicy mayo. Tostada deshidratada y frita con cubos de atún macerado en limón y chile seco,con láminas de aguacate, cebolla frita y ajonjolí negro.',
    image: 'https://images.unsplash.com/photo-1544025162-8315ea07f440?w=500&h=400&fit=crop'
  },
  {
    id: 'ent_04',
    category: 'entradas',
    name: 'QUESO FUNDIDO CON CHISTORRA',
    price: 170.00,
    description: 'Mezcla de quesos gratinados ( queso gouda + queso Oaxaca + queso manchego) con chistorra dorada, acompañado de tortillas de harina artesanales y salsa tatemada.',
    image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=500&h=400&fit=crop'
  },

  // --- ENSALADAS ---
  {
    id: 'ens_01',
    category: 'ensaladas',
    name: 'ENSALADA CÉSAR (POLLO O ARRACHERA)',
    price: 160.00,
    description: 'Mix de lechugas frescas, crotones artesanales, parmesano rallado y aderezo César de la casa, acompañada de pollo a la parrilla o arrachera.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop'
  },
  {
    id: 'ens_02',
    category: 'ensaladas',
    name: 'ENSALADA DE FRUTOS ROJOS Y CÍTRICOS',
    price: 130.00,
    description: 'Mix de lechugas frescas, crotones artesanales, parmesano rallado y aderezo César de la casa, acompañada de pollo a la parrilla o arrachera.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop'
  },
  {
    id: 'ens_03',
    category: 'ensaladas',
    name: 'ENSALADA SUNSET',
    price: 180.00,
    description: 'Mix de lechugas y arúgula, zanahoria, nueces garapiñadas, fresa, arándano, supremas de naranja, con aderezo de miel y mostaza.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop'
  },
  {
    id: 'ens_04',
    category: 'ensaladas',
    name: 'ENSALADA VERDE DEL MAR',
    price: 180.00,
    description: 'Mix de lechugas arúgula, cebolla morada, crotones de pan, pepino, tomate cherry y camarón.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop'
  },

  // --- PASTAS ---
  {
    id: 'pas_01',
    category: 'pastas',
    name: 'BOLOGNESA',
    price: 180.00,
    description: 'Pasta fettuccine al burro y especias italianas con carne al estilo bolognesa, acompañado con queso parmesano, pan ajo artesanal y salsa cremosa.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&h=400&fit=crop'
  },
  {
    id: 'pas_02',
    category: 'pastas',
    name: 'ROYAL STEAK PASTA',
    price: 200.00,
    description: 'Fettuccine al burro con mix de pimientos rostizados, 150 gr de arrachera flameada, zanahoria, cebollín ,jengibre fresco y aceite de ajonjolí tostado.',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&h=400&fit=crop',
    popular: true
  },
  {
    id: 'pas_03',
    category: 'pastas',
    name: '4 QUESOS CON POLLO',
    price: 220.00,
    description: 'Fettuccine con queso gouda, queso manchego, queso crema, espolvoreado con queso parmesano, acompañado de pan de la casa.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&h=400&fit=crop'
  },
  {
    id: 'pas_04',
    category: 'pastas',
    name: 'ARRABIATA CON CAMARÓN',
    price: 220.00,
    description: 'Fettuccine a la mantequilla, chile seco en polvo con camarones.',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&h=400&fit=crop'
  },

  // --- DEL MAR Y TIERRA ---
  {
    id: 'mar_01',
    category: 'mar-y-tierra',
    name: 'MEDALLÓN DE ATÚN',
    price: 260.00,
    description: 'Medallón de atún en base de dúo de puré de papa, camote en salsa de ajo, nuez y chile quebrado, germinado, ajonjolí y espárragos.',
    image: 'https://images.unsplash.com/photo-1544025162-8315ea07f440?w=500&h=400&fit=crop'
  },
  {
    id: 'mar_02',
    category: 'mar-y-tierra',
    name: 'MOLCAJETE LA MARÍA',
    price: 320.00,
    description: 'Arrachera, camarón, chiles asados, chistorra, cebolla cambray en base de salsa roja tatemada.',
    image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&h=400&fit=crop',
    popular: true
  },
  {
    id: 'mar_03',
    category: 'mar-y-tierra',
    name: 'BROCHETA DE ARRACHERA',
    price: 220.00,
    description: 'Arrachera con pimientos, cebolla morada, chistorra. Y chile jalapeño acompañado de ensalada.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=400&fit=crop'
  },
  {
    id: 'mar_04',
    category: 'mar-y-tierra',
    name: 'ALAMBRE MAR Y TIERRA',
    price: 270.00,
    description: 'Arrachera, camarón, chistorra, pimientos, cebolla morada, chile jalapeño y queso gouda.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=400&fit=crop'
  },

  // --- TACOS ---
  {
    id: 'tac_01',
    category: 'tacos',
    name: 'TACO DE RIB EYE / NEW YORK / PICAÑA (1 PIEZA)',
    price: 90.00,
    description: '120 gr de corte premium a elegir, servido sobre tortilla artesanal de maíz blanco o azul, acompañado de guacamole ahumado y cebolla encurtida.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&h=400&fit=crop',
    popular: true
  },
  {
    id: 'tac_02',
    category: 'tacos',
    name: 'TACO DE RIB EYE / NEW YORK / PICAÑA (2 PIEZAS)',
    price: 175.00,
    description: '120 gr de corte premium a elegir, servido sobre tortilla artesanal de maíz blanco o azul, acompañado de guacamole ahumado y cebolla encurtida.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&h=400&fit=crop'
  },
  {
    id: 'tac_03',
    category: 'tacos',
    name: 'TACO ESTILO BAJA',
    price: 90.00,
    description: 'Camarón en tempura acompañado de ensalada de col y zanahoria, con aderezo de chipotle, guacamole con tortilla a elegir.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&h=400&fit=crop'
  },
  {
    id: 'tac_04',
    category: 'tacos',
    name: 'TACO LA MARÍA',
    price: 130.00,
    description: 'Alambre de camarón, arrachera y chistorra a la mexicana, base de chile poblano asado, con queso Oaxaca en costra, con tortilla de maíz y láminas de aguacate.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&h=400&fit=crop'
  },
  {
    id: 'tac_05',
    category: 'tacos',
    name: 'TACOS NENA',
    price: 110.00,
    description: 'Arrachera con cebolla asada y salsa pico de gallo con aguacate.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&h=400&fit=crop'
  },

  // --- CORTES ---
  {
    id: 'cor_01',
    category: 'cortes',
    name: 'NEW YORK (350 GR)',
    price: 370.00,
    description: 'Acompañado con papas cambray, cebolla cambray en salsa negras y chile toreado.',
    image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&h=400&fit=crop'
  },
  {
    id: 'cor_02',
    category: 'cortes',
    name: 'PICAÑA (350 GR)',
    price: 380.00,
    description: 'Acompañado con papas cambray, cebolla cambray en salsa negras y chile toreado.',
    image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&h=400&fit=crop'
  },
  {
    id: 'cor_03',
    category: 'cortes',
    name: 'RIB EYE (350 GR)',
    price: 390.00,
    description: 'Acompañado con papas cambray, cebolla cambray en salsa negras y chile toreado.',
    image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&h=400&fit=crop'
  },
  {
    id: 'cor_04',
    category: 'cortes',
    name: 'FAJITA DE POLLO (200 GR)',
    price: 220.00,
    description: 'Acompañadas de papas cambray en salsas negras, cebollina y chile toreado, porción de guacamole, pico de gallo y 3 piezas de tortillas de harina.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=400&fit=crop'
  },
  {
    id: 'cor_05',
    category: 'cortes',
    name: 'FAJITAS DE ARRACHERA (200 GR)',
    price: 250.00,
    description: 'Acompañadas de papas cambray en salsas negras, cebollina y chile toreado, porción de guacamole, pico de gallo y 3 piezas de tortillas de harina.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=400&fit=crop'
  },
  {
    id: 'cor_06',
    category: 'cortes',
    name: 'PARRILLADA (4 PERSONAS)',
    price: 920.00,
    description: '500 gr de arrachera, 200 gr de chistorra, 240 gr de salchicha para asar, quesadillas, chiles asados, guacamole, cebolla cambray, tortillas de harina.',
    image: 'https://images.unsplash.com/photo-1544025162-8315ea07f440?w=500&h=400&fit=crop',
    popular: true
  },
  {
    id: 'cor_07',
    category: 'cortes',
    name: 'PARRILLADA (6 PERSONAS)',
    price: 1390.00,
    description: '700 gr de arrachera, 300 gr de chistorra, 360 gr de salchicha para asar, quesadillas, chiles asados, guacamole, cebolla cambray y tortillas de harina.',
    image: 'https://images.unsplash.com/photo-1544025162-8315ea07f440?w=500&h=400&fit=crop'
  },
  {
    id: 'cor_08',
    category: 'cortes',
    name: 'KILO DE ARRACHERA',
    price: 990.00,
    description: 'Acompañado de papas cambray en salsas negras, cebollina, chile toreado, una porción de guacamole, pico de gallo y piezas de tortillas de harina.',
    image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&h=400&fit=crop'
  },
  {
    id: 'cor_09',
    category: 'cortes',
    name: 'KILO DE SIRLÓN',
    price: 650.00,
    description: 'Acompañado de papas cambray en salsas negras, cebollina, chile toreado, una porción de guacamole, pico de gallo y 3 piezas de tortillas de harina.',
    image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500&h=400&fit=crop'
  },
  {
    id: 'cor_10',
    category: 'cortes',
    name: 'PARRILLADA LA MARÍA PREMIUM',
    price: 2500.00, // Precio estimado ya que no aparece en PDF
    description: 'La experiencia parrillera más completa. Arrachera 1kg, 2 piezas de Picaña de 1", 500 g de Aguja Flecha, 1 Rib Eye de 1", 1 New York de 1", 1 T-Bone de ½ y 1 Chorizo Argentino. Acompañada de puré de papa, guacamole, cebollinas asadas, chiles toreados, tortillas hechas a mano y salsas de la casa.',
    image: 'https://images.unsplash.com/photo-1544025162-8315ea07f440?w=500&h=400&fit=crop',
    popular: true
  },

  // --- SNACKS ---
  {
    id: 'sna_01',
    category: 'snacks',
    name: 'LA MARÍA SMASH BURGER',
    price: 160.00,
    description: '150 gr de arrachera, lechuga, tomate, cebolla caramelizada, pepinillos y guacamole. Acompañado con papas a la francesa.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
    popular: true
  },
  {
    id: 'sna_02',
    category: 'snacks',
    name: 'HAMBURGUESA DE POLLO',
    price: 150.00,
    description: '150 gr de pollo empanizado, con lechuga, tomate, cebolla caramelizada, pepinillos y guacamole, acompañado de papas a la francesa.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop'
  },
  {
    id: 'sna_03',
    category: 'snacks',
    name: 'ALITAS (BBQ BÚFFALO, MANGO/HABANERO)',
    price: 140.00,
    description: 'Se acompaña con zanahoria y apio.',
    image: 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=500&h=400&fit=crop'
  },
  {
    id: 'sna_04',
    category: 'snacks',
    name: 'ALITAS (BBQ BÚFALO, LEMON PEPPER, PIÑA)',
    price: 130.00,
    description: 'Se acompaña con zanahoria y apio.',
    image: 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=500&h=400&fit=crop'
  },
  {
    id: 'sna_05',
    category: 'snacks',
    name: '1KG ALITAS / 2KG ALITAS / 1KG BONELESS',
    price: 390.00, // Precio base
    description: '1kg alitas $390.00 | 2kg alitas $720.00 | 1kg boneless $450.00. Selecciona en extras o notas.',
    image: 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=500&h=400&fit=crop'
  },
  {
    id: 'sna_06',
    category: 'snacks',
    name: 'PAPAS A LA FRANCESA',
    price: 90.00,
    description: 'Crujientes papas a la francesa.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&h=400&fit=crop'
  },
  {
    id: 'sna_07',
    category: 'snacks',
    name: 'AROS DE CEBOLLA CON ADEREZO RANCH',
    price: 70.00,
    description: 'Aros de cebolla empanizados acompañados de aderezo ranch.',
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=400&fit=crop'
  },
  {
    id: 'sna_08',
    category: 'snacks',
    name: 'PAPAS GAJO',
    price: 90.00,
    description: 'Papas gajo crujientes y sazonadas.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&h=400&fit=crop'
  },
  {
    id: 'sna_09',
    category: 'snacks',
    name: 'NACHOS CON ARRACHERA',
    price: 130.00,
    description: 'Arrachera con pico de gallo y queso derretido.',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&h=400&fit=crop'
  },

  // --- KIDS ---
  {
    id: 'kid_01',
    category: 'kids',
    name: 'MINI BURGER',
    price: 140.00,
    description: 'Acompañado de papas y jugo.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop'
  },
  {
    id: 'kid_02',
    category: 'kids',
    name: 'NUGGETS',
    price: 130.00,
    description: 'Acompañado de papas y jugo.',
    image: 'https://images.unsplash.com/photo-1562967914-01efa7e87832?w=500&h=400&fit=crop'
  },
  {
    id: 'kid_03',
    category: 'kids',
    name: 'MINI PASTA',
    price: 120.00,
    description: 'Acompañado de pan y jugo.',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&h=400&fit=crop'
  },
  {
    id: 'kid_04',
    category: 'kids',
    name: 'DEDOS DE QUESO',
    price: 110.00,
    description: 'Acompañado de papas.',
    image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=500&h=400&fit=crop'
  },

  // --- POSTRES ---
  {
    id: 'pos_01',
    category: 'postres',
    name: 'HELADO DE VAINILLA',
    price: 60.00,
    description: 'Copa de helado de vainilla.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop'
  },
  {
    id: 'pos_02',
    category: 'postres',
    name: 'CHEESCAKE',
    price: 90.00,
    description: 'Bañado en salsa de fresa de la casa.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop'
  },
  {
    id: 'pos_03',
    category: 'postres',
    name: 'VOLCÁN DE CHOCOLATE',
    price: 95.00,
    description: 'Acompañado con helado de vainilla.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop',
    popular: true
  },

  // --- BEBIDAS ---
  {
    id: 'beb_01',
    category: 'bebidas',
    name: 'COCTELERÍA CLÁSICA Y DE AUTOR',
    price: 130.00,
    description: 'Piña Colada ($100), Gin Tonic ($130), Mojito ($90), Margarita ($100), Clericot ($120), Perla Negra ($140), Carajillo ($140), Manhattan ($120), Expreso Martini ($160), Aperol ($180).',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=400&fit=crop',
    popular: true
  },
  {
    id: 'beb_02',
    category: 'bebidas',
    name: 'MEZCALINAS',
    price: 120.00,
    description: 'Frutos Rojos ($120), Maracuyá ($100), Pepino ($130), Piña ($150), Tamarindo ($90).',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=400&fit=crop'
  },
  {
    id: 'beb_03',
    category: 'bebidas',
    name: 'CERVEZAS Y SIDRAS',
    price: 60.00,
    description: 'Corona, XX Lagger, Amstel, Michelob, Modelo, Indio, Tecate, Victoria, Heineken. Sidras Strongbow ($55-$60).',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=400&fit=crop'
  },
  {
    id: 'beb_04',
    category: 'bebidas',
    name: 'BEBIDAS SIN ALCOHOL',
    price: 40.00,
    description: 'Limonada, Naranjada, Horchata, Jamaica, Refrescos de familia Coca-Cola ($35).',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=400&fit=crop'
  },

  // --- BOTELLAS ---
  {
    id: 'bot_01',
    category: 'botellas',
    name: 'DON JULIO 70',
    price: 2200.00,
    description: 'Tequila añejo cristalino. Ideal para compartir.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=400&fit=crop',
    popular: true
  },
  {
    id: 'bot_02',
    category: 'botellas',
    name: 'JOHNNIE WALKER ETIQUETA NEGRA / BUCHANAN\'S 12',
    price: 1900.00,
    description: 'Whisky 12 años botella.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=400&fit=crop'
  },
  {
    id: 'bot_03',
    category: 'botellas',
    name: 'MAESTRO DOBEL DIAMANTE',
    price: 1900.00,
    description: 'Tequila cristalino.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=400&fit=crop'
  },
  {
    id: 'bot_04',
    category: 'botellas',
    name: 'JOSE CUERVO TRADICIONAL CRISTALINO',
    price: 1250.00,
    description: 'Tequila cristalino.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=400&fit=crop'
  },
  {
    id: 'bot_05',
    category: 'botellas',
    name: 'ABSOLUT VODKA / JOSE CUERVO REPOSADO',
    price: 1100.00,
    description: 'Botella a elección.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=400&fit=crop'
  },
  {
    id: 'bot_06',
    category: 'botellas',
    name: 'BLACK & WHITE / BACARDÍ / CAPITAN MORGAN',
    price: 990.00,
    description: 'Botella a elección.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=400&fit=crop'
  }
];

export const COMPANY_INFO = {
  name: 'La María Rooftop',
  whatsapp: '5215512345678', // Reemplazar con el real
  schedule: 'Mar - Dom: 2:00 PM - 2:00 AM',
  address: 'Av. Principal #123, Terraza Alta',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com'
  }
};
