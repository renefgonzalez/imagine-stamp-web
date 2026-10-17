export const CATEGORIES = [
  { name: 'Todos' },
  { name: "Pa' Que Empieces" },
  { name: 'Tacos' },
  { name: 'Camarones' },
  { name: 'Aguachile' },
  { name: 'Bebidas' },
];

export const PRODUCTS = [
  // Pa' Que Empieces
  { id: 1, name: 'Ceviche de Camarón', description: 'Estilo Colima y Sinaloa.', price: 195, category: "Pa' Que Empieces", featured: true },
  { id: 2, name: 'Ceviche de Pescado', description: 'Fresco, con limón y especias.', price: 175, category: "Pa' Que Empieces" },
  { id: 3, name: 'Aguachile de Camarón', description: 'Camarón crudo marinado en limón con chile.', price: 185, category: "Pa' Que Empieces" },
  // Tacos
  { id: 4, name: 'Taco Gobernador', description: 'Con costra de queso dorada.', price: 70, category: 'Tacos', featured: true },
  { id: 5, name: 'Taco de Marlin', description: 'Marlin ahumado con pico de gallo.', price: 65, category: 'Tacos' },
  { id: 6, name: 'Taco de Camarón', description: 'Empanizado con repollo y aderezo.', price: 68, category: 'Tacos' },
  { id: 7, name: 'Quesadilla de Camarón', description: 'Tortilla de harina con queso gratinado.', price: 75, category: 'Tacos' },
  // Camarones
  { id: 8, name: 'Camarones Empanizados', description: 'Acompañados de arroz y ensalada.', price: 200, category: 'Camarones' },
  { id: 9, name: 'Camarones al Mojo de Ajo', description: 'Salteados con ajo, mantequilla y limón.', price: 210, category: 'Camarones' },
  { id: 10, name: 'Camarones a la Diabla', description: 'Con salsa picante de chile y especias.', price: 205, category: 'Camarones' },
  { id: 11, name: 'Brocheta de Camarón', description: 'Al grill con verduras y adobo cítrico.', price: 195, category: 'Camarones' },
  // Aguachile
  { id: 12, name: 'Aguachile Negro', description: 'Con salsa de soya, chile y limón.', price: 200, category: 'Aguachile' },
  { id: 13, name: 'Aguachile Verde', description: 'Hierbas frescas, chile serrano y pepino.', price: 195, category: 'Aguachile', featured: true },
  { id: 14, name: 'Aguachile Rojo', description: 'Chile guajillo, ajo y camarón fresco.', price: 200, category: 'Aguachile' },
  // Bebidas
  { id: 15, name: 'Agua Fresca del Día', description: 'Jarra de 1 Litro.', price: 50, category: 'Bebidas' },
  { id: 16, name: 'Limonada Mineral', description: 'Con agua mineral y hierbabuena.', price: 55, category: 'Bebidas' },
  { id: 17, name: 'Michelada', description: 'Cerveza con limón, sal y especias.', price: 80, category: 'Bebidas' },
  { id: 18, name: 'Refresco', description: 'Coca-Cola, Sprite, Fanta o Sidral.', price: 35, category: 'Bebidas' },
];

export const OctopusSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 240 280" fill="none">
    {/* Cabeza redondeada elegante */}
    <ellipse cx="120" cy="60" rx="45" ry="55" stroke="currentColor" strokeWidth="1.8" opacity="0.42" />
    <path d="M90 70 Q85 85 88 100" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <path d="M150 70 Q155 85 152 100" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />

    {/* Ojos expresivos */}
    <circle cx="100" cy="50" r="6.5" stroke="currentColor" strokeWidth="1.3" opacity="0.5" fill="none" />
    <circle cx="140" cy="50" r="6.5" stroke="currentColor" strokeWidth="1.3" opacity="0.5" fill="none" />
    <circle cx="100" cy="50" r="3" fill="currentColor" opacity="0.7" />
    <circle cx="140" cy="50" r="3" fill="currentColor" opacity="0.7" />

    {/* Tentáculo 1 - izquierda extrema */}
    <path d="M85 110 Q65 155 58 210 Q55 235 62 250 Q70 245 75 220 Q82 180 90 130" stroke="currentColor" strokeWidth="2.2" opacity="0.4" strokeLinecap="round" />
    <circle cx="68" cy="145" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="62" cy="170" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="60" cy="195" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="64" cy="225" r="1.5" fill="currentColor" opacity="0.35" />

    {/* Tentáculo 2 - izquierda centro */}
    <path d="M100 115 Q95 160 100 200 Q105 240 100 260 Q95 275 88 260 Q80 230 85 190 Q90 150 105 115" stroke="currentColor" strokeWidth="2.2" opacity="0.4" strokeLinecap="round" />
    <circle cx="95" cy="145" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="92" cy="170" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="94" cy="195" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="98" cy="220" r="1.5" fill="currentColor" opacity="0.35" />

    {/* Tentáculo 3 - derecha centro */}
    <path d="M140 115 Q145 160 140 200 Q135 240 140 260 Q145 275 152 260 Q160 230 155 190 Q150 150 135 115" stroke="currentColor" strokeWidth="2.2" opacity="0.4" strokeLinecap="round" />
    <circle cx="145" cy="145" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="148" cy="170" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="146" cy="195" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="142" cy="220" r="1.5" fill="currentColor" opacity="0.35" />

    {/* Tentáculo 4 - derecha extrema */}
    <path d="M155 110 Q175 155 182 210 Q185 235 178 250 Q170 245 165 220 Q158 180 150 130" stroke="currentColor" strokeWidth="2.2" opacity="0.4" strokeLinecap="round" />
    <circle cx="172" cy="145" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="178" cy="170" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="180" cy="195" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="176" cy="225" r="1.5" fill="currentColor" opacity="0.35" />
  </svg>
);

export const CrabSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 260 200" fill="none">
    {/* Caparazón principal - más redondo y detallado */}
    <ellipse cx="130" cy="70" rx="55" ry="48" stroke="currentColor" strokeWidth="2" opacity="0.42" />
    <path d="M85 70 Q130 50 175 70 Q130 90 85 70" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
    <path d="M95 55 Q130 40 165 55" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
    
    {/* Detalles del caparazón (textura) */}
    <circle cx="130" cy="60" r="2" fill="currentColor" opacity="0.4" />
    <circle cx="115" cy="65" r="1.5" fill="currentColor" opacity="0.3" />
    <circle cx="145" cy="65" r="1.5" fill="currentColor" opacity="0.3" />
    <circle cx="120" cy="78" r="1.5" fill="currentColor" opacity="0.3" />
    <circle cx="140" cy="78" r="1.5" fill="currentColor" opacity="0.3" />

    {/* Ojos saltones característicos */}
    <path d="M110 22 Q115 10 115 5" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <path d="M150 22 Q145 10 145 5" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <circle cx="115" cy="5" r="4.5" stroke="currentColor" strokeWidth="1.5" opacity="0.6" fill="none" />
    <circle cx="145" cy="5" r="4.5" stroke="currentColor" strokeWidth="1.5" opacity="0.6" fill="none" />
    <circle cx="115" cy="5" r="2" fill="currentColor" opacity="0.8" />
    <circle cx="145" cy="5" r="2" fill="currentColor" opacity="0.8" />

    {/* Tenaza izquierda grande y poderosa */}
    <path d="M75 60 Q40 40 30 70 Q25 90 45 100 Q65 110 80 85" stroke="currentColor" strokeWidth="2.5" opacity="0.45" strokeLinecap="round" fill="none" />
    <path d="M45 100 Q20 110 15 130 Q10 150 30 145 Q50 140 55 110" stroke="currentColor" strokeWidth="2.5" opacity="0.45" strokeLinecap="round" fill="none" />
    {/* Picos de la tenaza izquierda */}
    <path d="M22 135 L12 130" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    <path d="M28 142 L20 138" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />

    {/* Tenaza derecha grande y poderosa */}
    <path d="M185 60 Q220 40 230 70 Q235 90 215 100 Q195 110 180 85" stroke="currentColor" strokeWidth="2.5" opacity="0.45" strokeLinecap="round" fill="none" />
    <path d="M215 100 Q240 110 245 130 Q250 150 230 145 Q210 140 205 110" stroke="currentColor" strokeWidth="2.5" opacity="0.45" strokeLinecap="round" fill="none" />
    {/* Picos de la tenaza derecha */}
    <path d="M238 135 L248 130" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    <path d="M232 142 L240 138" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />

    {/* Patas traseras (3 pares) - izquierda */}
    <path d="M80 95 Q50 120 45 155" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
    <path d="M85 105 Q65 135 70 170" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
    <path d="M95 112 Q90 145 105 180" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeLinecap="round" />

    {/* Patas traseras (3 pares) - derecha */}
    <path d="M180 95 Q210 120 215 155" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
    <path d="M175 105 Q195 135 190 170" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
    <path d="M165 112 Q170 145 155 180" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
  </svg>
);
