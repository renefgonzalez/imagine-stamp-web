import { forwardRef } from 'react';
import { PRODUCTS } from './CandymarData';
import logo from '../assets/logo.png';
import fondoAcuarela from '../assets/fondo-acuarela.webp';
import pescadoGrabado from '../assets/pescado-grabado.webp';
import camaronGrabado from '../assets/camaron-grabado.webp';
import cangrejoGrabado from '../assets/cangrejo-grabado.webp';
import ostrasGrabado from '../assets/ostras-grabado.webp';
import limonRomeroGrabado from '../assets/limon-romero-grabado.webp';

const CandymarPrintTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const fishProducts = PRODUCTS.filter(
    p =>
      (p.category === 'Entradas & Ceviches' || p.category === 'Pescados & Filetes') &&
      (p.name.toLowerCase().includes('ceviche') || p.name.toLowerCase().includes('pescado') || p.name.toLowerCase().includes('filete')),
  ).slice(0, 5);

  const musselProducts = PRODUCTS.filter(
    p =>
      p.category === 'Tacos & Tostadas' &&
      (p.name.toLowerCase().includes('gobernador') ||
        p.name.toLowerCase().includes('candymar') ||
        p.name.toLowerCase().includes('baja') ||
        p.name.toLowerCase().includes('pulpo') ||
        p.name.toLowerCase().includes('callo')),
  ).slice(0, 5);

  const shrimpProducts = PRODUCTS.filter(p => p.category === 'Camarones').slice(0, 5);

  const lobsterCrabProducts = PRODUCTS.filter(
    p =>
      p.category === 'Botanas Frías' ||
      p.category === 'Cocteles & Caldos' ||
      p.name.toLowerCase().includes('chacales'),
  ).slice(0, 6);

  return (
    <div
      ref={ref}
      className="bg-[#f6fbfe] text-slate-800 font-sans"
      style={{
        width: '297mm', // A4 Landscape
        height: '210mm',
        padding: '10mm 12mm',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f6fbfe',
        backgroundImage: `url(${fondoAcuarela})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Montserrat:wght@400;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Oswald:wght@600;700&display=swap');
        .etching-art-print {
          filter: drop-shadow(0 1px 3px rgba(2, 132, 199, 0.08));
        }
      `}</style>

      {/* ─── ILUSTRACIONES NÁUTICAS DE GRABADO EN ESQUINAS Y BORDES ─── */}
      <div className="absolute top-1 left-2 w-20 pointer-events-none select-none z-10 opacity-85">
        <img src={limonRomeroGrabado} alt="Lemon" className="w-full h-auto etching-art-print" />
      </div>
      <div className="absolute top-1 left-64 w-28 pointer-events-none select-none z-10 opacity-90">
        <img src={cangrejoGrabado} alt="Crab" className="w-full h-auto etching-art-print" />
      </div>
      <div className="absolute -top-3 -right-2 w-44 pointer-events-none select-none z-10 opacity-90">
        <img src={ostrasGrabado} alt="Oysters" className="w-full h-auto etching-art-print" />
      </div>

      {/* ─── ESTRUCTURA PRINCIPAL DE 4 CUADRANTES FIEL A LA IMAGEN ─── */}
      <div className="h-full flex flex-col justify-between relative z-20">
        {/* PARTE SUPERIOR (Fila 1) */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Col 1-4: Header "Menu SEAFOOD • Always Fresh •" + Logo Candymar */}
          <div className="col-span-4 pl-2 pt-1 flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-2 mb-0.5 w-full">
              <h1
                className="text-6xl font-bold text-[#162660] leading-none"
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  transform: 'rotate(-3deg)',
                  display: 'inline-block',
                }}
              >
                Menu
              </h1>
            </div>

            <div className="w-full">
              <span
                className="text-4xl font-black uppercase tracking-tight text-slate-900 block"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                SEAFOOD
              </span>
            </div>

            <div
              className="flex items-center justify-center gap-2 mt-0.5 text-slate-700 text-lg italic w-full"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              <span className="text-[#162660] font-bold">•</span>
              <span>Always Fresh</span>
              <span className="text-[#162660] font-bold">•</span>
            </div>

            {/* Logo Oficial Candymar Centrado */}
            <div className="w-36 mt-2 flex justify-center">
              <img
                src={logo}
                alt="Candymar Logo"
                className="w-full h-auto object-contain drop-shadow-xs"
              />
            </div>
          </div>

          {/* Col 5-8: Sección "Fish" con Pescadito Grabado */}
          <div className="col-span-4 pr-3">
            <div className="flex items-center justify-between mb-2 border-b border-[#162660]/20 pb-1">
              <h2
                className="text-4xl font-bold text-[#162660]"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Fish
              </h2>
              {/* Pescadito grabado más pequeño encuadrando */}
              <div className="w-20 pointer-events-none opacity-90">
                <img
                  src={pescadoGrabado}
                  alt="Fish engraving"
                  className="w-full h-auto etching-art-print transform -scale-x-100"
                />
              </div>
            </div>
            <div className="space-y-2.5">
              {fishProducts.map(p => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                    <span className="font-serif text-[13px]">{p.name}</span>
                    <span className="flex-1 mx-2 border-b-2 border-dotted border-slate-300" />
                    <span style={{ fontFamily: "'Oswald', sans-serif" }}>${p.price.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic font-serif leading-tight">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Col 9-12: Sección "Mussels" */}
          <div className="col-span-4 pr-6">
            <h2
              className="text-4xl font-bold text-[#162660] mb-2"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Mussels
            </h2>
            <div className="space-y-2.5">
              {musselProducts.slice(0, 4).map(p => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                    <span className="font-serif text-[13px]">{p.name}</span>
                    <span className="flex-1 mx-2 border-b-2 border-dotted border-slate-300" />
                    <span style={{ fontFamily: "'Oswald', sans-serif" }}>${p.price.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic font-serif leading-tight">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PARTE INFERIOR (Fila 2: Shrimps bloque powder blue + Lobster•Crab marco azul rey) */}
        <div className="grid grid-cols-12 gap-6 items-end mt-1">
          {/* Shrimps: Bloque Powder Blue suave (Col 1-5) */}
          <div
            className="col-span-5 relative p-3.5 rounded-sm overflow-hidden shadow-xs border border-[#162660]/15"
            style={{
              backgroundColor: '#D0E6FD',
              backgroundImage: `
                radial-gradient(circle at 10% 20%, rgba(255,255,255,0.6) 0%, transparent 60%),
                radial-gradient(circle at 90% 80%, rgba(22,38,96,0.08) 0%, transparent 60%)
              `,
            }}
          >
            <div className="absolute -top-3 -right-2 w-24 pointer-events-none opacity-85">
              <img src={camaronGrabado} alt="Shrimp" className="w-full h-auto etching-art-print" />
            </div>
            <div className="absolute -bottom-3 -left-3 w-20 pointer-events-none opacity-75">
              <img
                src={camaronGrabado}
                alt="Shrimp"
                className="w-full h-auto etching-art-print transform -scale-x-100 rotate-45"
              />
            </div>

            <div className="relative z-10">
              <h2
                className="text-4xl font-bold text-[#162660] mb-2"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Shrimps
              </h2>

              <div className="space-y-2">
                {shrimpProducts.map(p => (
                  <div key={p.id}>
                    <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                      <span className="font-serif text-[12px]">{p.name}</span>
                      <span className="flex-1 mx-2 border-b-2 border-dotted border-[#162660]/30" />
                      <span style={{ fontFamily: "'Oswald', sans-serif" }}>${p.price.toFixed(2)}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-800 italic font-serif leading-tight">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lobster • Crab: Gran marco con borde Azul Rey (#162660) de 2px y fondo crema cálido fino (Col 6-12) */}
          <div className="col-span-7 relative border-2 border-[#162660] bg-[#FBF8F3]/95 p-3.5 rounded-sm shadow-xs">
            <div className="absolute -top-5 -right-5 w-24 pointer-events-none opacity-90">
              <img src={cangrejoGrabado} alt="Crab" className="w-full h-auto etching-art-print" />
            </div>
            <div className="absolute -bottom-5 -right-4 w-20 pointer-events-none opacity-85">
              <img src={ostrasGrabado} alt="Mussels" className="w-full h-auto etching-art-print" />
            </div>

            <h2
              className="text-4xl font-bold text-[#162660] mb-1.5"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Lobster • Crab
            </h2>

            {/* Platillos Anchos Superiores */}
            <div className="space-y-1.5 mb-2.5">
              {lobsterCrabProducts.slice(0, 2).map(p => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                    <span className="font-serif text-[12px]">{p.name}</span>
                    <span className="flex-1 mx-2 border-b-2 border-dotted border-slate-300" />
                    <span style={{ fontFamily: "'Oswald', sans-serif" }}>${p.price.toFixed(2)}</span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 italic font-serif leading-tight">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Dos columnas inferiores */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-1.5">
              {lobsterCrabProducts.slice(2).map(p => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                    <span className="font-serif text-[11px]">{p.name}</span>
                    <span className="flex-1 mx-1.5 border-b-2 border-dotted border-slate-300" />
                    <span style={{ fontFamily: "'Oswald', sans-serif" }}>${p.price.toFixed(2)}</span>
                  </div>
                  <p className="text-[9px] text-slate-500 italic font-serif leading-tight">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pie de página con créditos */}
        <div className="flex items-center justify-between text-[8.5px] text-slate-400 pt-1 border-t border-sky-100">
          <span>Candymar Seafood & Grill · Receta tradicional de Colima y Sinaloa</span>
          <span>Pedidos WhatsApp: 52 1 56 5046 9993 · imagineandstamp.site</span>
        </div>
      </div>
    </div>
  );
});

export default CandymarPrintTemplate;
