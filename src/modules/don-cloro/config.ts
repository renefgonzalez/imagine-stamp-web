// ── Configuración del Cliente: DON CLORO - CASA QUÍMICA ────────────────────
// Productos de limpieza química - Landing Page

export const clientConfig = {
  businessName: 'DON CLORO',
  businessFullName: 'DON CLORO - CASA QUÍMICA',
  slogan: 'El toque para tu hogar',
  description: 'Venta de productos de limpieza química al mayoreo y menudeo. Envío a domicilio en Puebla y alrededores.',

  // Contacto
  phone: '5212220000000',          // WhatsApp (formato international sin +)
  phoneNumber: '222 000 0000',     // Teléfono visible
  email: 'contacto@doncloro.com',
  address: 'Calle Turquesa #19, Colonia La Joya, Anexo a Loma de San Miguel, Puebla.',
  hours: 'Lun a Sáb 8:00 - 18:00, Dom Cerrado',

  // Redes sociales
  instagramUrl: 'https://instagram.com/',
  facebookUrl: 'https://facebook.com/',
  tiktokUrl: 'https://tiktok.com/@',

  // Colores de marca
  colors: {
    primary: '#BE185D',       // Rosa Magenta/Fucsia (CLORO)
    secondary: '#06B6D4',     // Cian/Turquesa (DON)
    accent: '#EC4899',        // Rosa claro acento
    dark: '#0F172A',          // Azul Marino Profundo (texto/Footer)
    bg: '#FFFFFF',
    bgAlt: '#F8FAFC',         // gray-50
    cardBg: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
  },

  // Catálogo de productos
  categories: [
    {
      id: 'hogar',
      name: 'Hogar y Multiusos',
      icon: 'Sparkles',
      color: 'pink',
      products: [
        { name: 'Cloro concentrado 1L', price: 28, desc: 'Desinfectante de uso general, fórmula concentrada.' },
        { name: 'Cloro concentrado 5L', price: 110, desc: 'Presentación mayoreo, ideal para negocios.' },
        { name: 'Pino aromático 1L', price: 35, desc: 'Limpiador multiusos con aroma a pino.' },
        { name: 'Limpiador de vidrios 1L', price: 38, desc: 'Brillo sin rayones para cristales y espejos.' },
        { name: 'Desengrasante multiusos 500ml', price: 42, desc: 'Elimina grasa incrustada en cocinas y más.' },
        { name: 'Fregalíquido 1L', price: 32, desc: 'Jabón concentrado para lavado manual de trastes.' },
      ],
    },
    {
      id: 'lavanderia',
      name: 'Lavandería',
      icon: 'Shirt',
      color: 'cyan',
      products: [
        { name: 'Detergente en polvo 1kg', price: 45, desc: 'Fórmula concentrada para ropa blanca y de color.' },
        { name: 'Detergente líquido 1L', price: 52, desc: 'Suave con las fibras, ideal para lavadora.' },
        { name: 'Suavizante de ropa 1L', price: 48, desc: 'Aroma duradero y suavidad extra.' },
        { name: 'Quitamanchas 500ml', price: 55, desc: 'Elimina manchas difíciles antes del lavado.' },
        { name: 'Blanqueador industrial 5L', price: 130, desc: 'Para lavanderías y uso intensivo.' },
        { name: 'Suavizante concentrado 5L', price: 160, desc: 'Rinde hasta 250 lavadas, aroma premium.' },
      ],
    },
    {
      id: 'banos',
      name: 'Baños',
      icon: 'Droplets',
      color: 'blue',
      products: [
        { name: 'Ácido muriático 1L', price: 30, desc: 'Limpieza profunda de azulejos y sanitarios.' },
        { name: 'Sarricida 1L', price: 35, desc: 'Elimina sarro y cal del baño.' },
        { name: 'Limpiador de azulejos 1L', price: 38, desc: 'Fresca limpieza con aroma cielo despejado.' },
        { name: 'Gel para sanitarios 750ml', price: 40, desc: 'Limpieza y desinfección en profundidad.' },
        { name: 'Desinfectante de baños 1L', price: 42, desc: 'Elimina 99.9% de bacterias.' },
        { name: 'Pastillas para inodoro (6 pack)', price: 45, desc: 'Limpieza automática y frescura constante.' },
      ],
    },
    {
      id: 'automotriz',
      name: 'Automotriz',
      icon: 'Car',
      color: 'violet',
      products: [
        { name: 'Abrillantador de llantas 1L', price: 65, desc: 'Acabado brillante y protección UV.' },
        { name: 'Desengrasante para motores 1L', price: 70, desc: 'Remueve grasa y aceite del motor.' },
        { name: 'Shampoo con cera 1L', price: 58, desc: 'Lavado y encerado en un solo paso.' },
        { name: 'Limpiador de tapicería 500ml', price: 75, desc: 'Renueva textiles y elimina olores.' },
        { name: 'Desinfectante de A/C 300ml', price: 85, desc: 'Elimina bacterias del sistema de aire.' },
        { name: 'Cera líquida spray 500ml', price: 90, desc: 'Protección y brillo espejo para la pintura.' },
      ],
    },
    {
      id: 'cuidado-personal',
      name: 'Cuidado Personal y Aromas',
      icon: 'Wind',
      color: 'rose',
      products: [
        { name: 'Aromatizante en gel 200g', price: 35, desc: 'Frescura duradera para cualquier espacio.' },
        { name: 'Gel desinfectante 500ml', price: 40, desc: 'Higiene de manos sin agua, 70% alcohol.' },
        { name: 'Shampoo para manos 1L', price: 50, desc: 'Limpieza suave para lavabos de negocio.' },
        { name: 'Aromatizante spray 250ml', price: 38, desc: 'Ráfaga de frescura instantánea.' },
        { name: 'Jabón antibacterial 1L', price: 45, desc: 'Protección diaria contra gérmenes.' },
        { name: 'Crema para manos 250ml', price: 55, desc: 'Hidratación y suavidad después de limpiar.' },
      ],
    },
  ],
};

export const bankInfo = {
  bankName: 'BBVA',
  accountHolder: 'Don Cloro - Casa Quimica',
  clabe: '012 180 01234567890 1',
  cardNumber: '4152 3134 5678 9012',
};
