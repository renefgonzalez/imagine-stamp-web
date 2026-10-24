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

// ─── Pescado Grabado (Fish Sketch) ───
export const FishSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 320 180" fill="none">
    {/* Contorno del cuerpo */}
    <path
      d="M280 90 Q240 60 170 45 Q90 35 30 75 Q15 88 15 95 Q15 102 30 115 Q90 155 170 145 Q240 130 280 100 L305 125 L298 95 L305 65 Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Ojo expresivo */}
    <circle cx="50" cy="85" r="9" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="49" cy="84" r="4.5" fill="currentColor" />
    <circle cx="47" cy="82" r="1.5" fill="#fff" />
    {/* Boca y hocico */}
    <path d="M15 95 Q25 96 34 94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Branquia */}
    <path d="M72 65 Q85 90 75 125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M80 72 Q91 93 83 118" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    {/* Aleta Dorsal */}
    <path d="M100 44 Q140 20 190 30 Q175 44 160 46" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M115 38 L112 45 M130 32 L128 45 M145 30 L144 46 M160 32 L159 47 M175 35 L174 48" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    {/* Aleta Pectoral */}
    <path d="M88 100 Q120 102 135 118 Q115 124 95 112 Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
    <path d="M96 104 Q116 109 126 116 M100 108 Q112 113 120 119" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    {/* Aleta Ventral / Anal */}
    <path d="M190 142 Q215 155 230 148 Q218 136 200 137" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    {/* Aleta Caudal (Cola) radios */}
    <path d="M280 92 L300 75 M282 95 L302 85 M283 97 L304 95 M282 99 L302 105 M280 101 L300 115" stroke="currentColor" strokeWidth="1" opacity="0.7" />
    {/* Textura de escamas punteadas / semicírculos */}
    <path d="M110 75 Q115 80 120 75 M125 75 Q130 80 135 75 M140 75 Q145 80 150 75 M155 75 Q160 80 165 75" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    <path d="M118 85 Q123 90 128 85 M133 85 Q138 90 143 85 M148 85 Q153 90 158 85 M163 85 Q168 90 173 85" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    <path d="M135 95 Q140 100 145 95 M150 95 Q155 100 160 95 M165 95 Q170 100 175 95 M180 95 Q185 100 190 95" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    <path d="M155 105 Q160 110 165 105 M170 105 Q175 110 180 105 M185 105 Q190 110 195 105" stroke="currentColor" strokeWidth="1" opacity="0.4" />
  </svg>
);

// ─── Camarón Grabado (Shrimp Sketch) ───
export const ShrimpSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 180" fill="none">
    {/* Curva del cuerpo de camarón */}
    <path
      d="M30 50 Q75 15 130 35 Q165 55 170 95 Q172 135 135 155 Q105 168 80 150 Q70 140 75 125 Q85 115 100 120 Q120 128 135 115 Q148 102 142 80 Q135 55 95 45 Q55 40 30 50 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Segmentos del exoesqueleto */}
    <path d="M90 42 Q105 55 108 72" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
    <path d="M110 46 Q125 62 126 82" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
    <path d="M130 55 Q142 75 138 95" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
    <path d="M142 70 Q152 92 142 110" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
    <path d="M138 100 Q138 120 122 132" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
    <path d="M120 122 Q112 138 95 142" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
    {/* Cola (Telson & Urópodos) */}
    <path d="M75 145 Q55 155 45 150 Q48 140 68 135" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M72 148 Q50 165 40 162 Q45 150 65 142" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    {/* Ojo de camarón */}
    <circle cx="45" cy="50" r="3.5" fill="currentColor" />
    {/* Antenas largas curvadas */}
    <path d="M30 48 Q10 40 5 20 Q2 5 20 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
    <path d="M32 52 Q15 55 8 70 Q4 85 15 95" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
    {/* Patitas (Pereiópodos) */}
    <path d="M70 65 Q65 85 58 95" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    <path d="M82 68 Q78 90 70 102" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    <path d="M95 72 Q92 95 86 108" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// ─── Ostra / Mejillón Grabado (Mussel / Oyster) ───
export const OysterSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 160 200" fill="none">
    {/* Concha aperlada en gota */}
    <path
      d="M80 185 Q45 170 25 125 Q10 80 35 40 Q60 5 80 5 Q100 5 125 40 Q150 80 135 125 Q115 170 80 185 Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Estrías de crecimiento concéntricas */}
    <path d="M40 50 Q80 20 120 50" stroke="currentColor" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
    <path d="M30 80 Q80 45 130 80" stroke="currentColor" strokeWidth="1.3" opacity="0.5" strokeLinecap="round" />
    <path d="M25 110 Q80 75 135 110" stroke="currentColor" strokeWidth="1.4" opacity="0.55" strokeLinecap="round" />
    <path d="M30 135 Q80 105 130 135" stroke="currentColor" strokeWidth="1.4" opacity="0.55" strokeLinecap="round" />
    <path d="M45 160 Q80 135 115 160" stroke="currentColor" strokeWidth="1.3" opacity="0.5" strokeLinecap="round" />
    {/* Líneas radiales */}
    <path d="M80 10 L80 180" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
    <path d="M60 20 Q55 90 70 175" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
    <path d="M100 20 Q105 90 90 175" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
  </svg>
);

// ─── Rodaja de Limón (Lemon Slice) ───
export const LemonSliceSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 140 140" fill="none">
    {/* Cáscara exterior */}
    <circle cx="70" cy="70" r="62" stroke="currentColor" strokeWidth="2.4" />
    {/* Membrana interior (Albedo) */}
    <circle cx="70" cy="70" r="54" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.5" />
    {/* Centro de la rodaja */}
    <circle cx="70" cy="70" r="6" stroke="currentColor" strokeWidth="1.4" />
    {/* 8 Gajos triangulares */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const angleNext = ((i * 45 + 38) * Math.PI) / 180;
      const rInner = 10;
      const rOuter = 50;
      const x1 = 70 + rInner * Math.cos(angle);
      const y1 = 70 + rInner * Math.sin(angle);
      const x2 = 70 + rOuter * Math.cos(angle);
      const y2 = 70 + rOuter * Math.sin(angle);
      const x3 = 70 + rOuter * Math.cos(angleNext);
      const y3 = 70 + rOuter * Math.sin(angleNext);
      const x4 = 70 + rInner * Math.cos(angleNext);
      const y4 = 70 + rInner * Math.sin(angleNext);

      return (
        <g key={i}>
          <path
            d={`M${x1} ${y1} L${x2} ${y2} A${rOuter} ${rOuter} 0 0 1 ${x3} ${y3} L${x4} ${y4} Z`}
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.65"
          />
          {/* Pequeños granos de pulpa */}
          <circle cx={(x2 + x4) / 2} cy={(y2 + y4) / 2} r="1" fill="currentColor" opacity="0.4" />
        </g>
      );
    })}
  </svg>
);

// ─── Ramita de Romero / Hierbas (Rosemary Herb) ───
export const RosemarySVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 180" fill="none">
    {/* Tallo central ondulado */}
    <path d="M40 175 Q42 120 38 70 Q35 30 40 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    {/* Hojas opuestas alargadas */}
    <path d="M40 160 Q20 150 10 145" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M40 160 Q60 150 70 145" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M39 135 Q18 122 8 115" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M40 135 Q62 122 72 115" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M38 110 Q16 95 10 85" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M39 110 Q64 95 70 85" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M37 80 Q18 65 14 52" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M38 80 Q62 65 66 52" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M38 50 Q22 35 20 22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M39 50 Q58 35 60 22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M40 25 Q32 15 35 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M40 25 Q48 15 45 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

