import { forwardRef } from 'react';
import {
  PRODUCTS,
  FishSVG,
  ShrimpSVG,
  OysterSVG,
  LemonSliceSVG,
  RosemarySVG,
  CrabSVG,
} from './CandymarData';
import logo from '../assets/logo.png';

const CandymarPrintTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const fishProducts = PRODUCTS.filter(
    p => p.category === "Pa' Que Empieces" && (p.name.toLowerCase().includes('pescado') || p.name.toLowerCase().includes('ceviche')),
  );
  const musselProducts = PRODUCTS.filter(
    p => p.category === 'Tacos' || (p.category === "Pa' Que Empieces" && !fishProducts.some(fp => fp.id === p.id)),
  );
  const shrimpProducts = PRODUCTS.filter(p => p.category === 'Camarones');
  const lobsterCrabProducts = PRODUCTS.filter(
    p => p.category === 'Aguachile' || p.category === 'Bebidas',
  );

  return (
    <div
      ref={ref}
      className="bg-white text-slate-800 font-sans"
      style={{
        width: '297mm', // A4 Landscape
        height: '210mm',
        padding: '12mm 14mm',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#ffffff',
        backgroundImage: `
          radial-gradient(circle at 8% 8%, rgba(186, 230, 253, 0.5) 0%, rgba(224, 242, 254, 0.25) 30%, transparent 60%),
          radial-gradient(circle at 92% 10%, rgba(165, 243, 252, 0.45) 0%, rgba(207, 250, 254, 0.2) 28%, transparent 55%),
          radial-gradient(circle at 10% 90%, rgba(165, 243, 252, 0.5) 0%, rgba(207, 250, 254, 0.25) 30%, transparent 60%),
          radial-gradient(circle at 90% 90%, rgba(186, 230, 253, 0.45) 0%, rgba(224, 242, 254, 0.2) 35%, transparent 65%)
        `,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Montserrat:wght@400;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Oswald:wght@600;700&display=swap');
      `}</style>

      {/* ─── ILUSTRACIONES NÁUTICAS DE ESQUINA EN ALTA DEFINICIÓN ─── */}
      <div className="absolute top-2 left-2 w-16 h-36 opacity-75 pointer-events-none select-none text-slate-800">
        <RosemarySVG className="w-full h-full" />
      </div>
      <div className="absolute top-24 left-1 w-14 h-14 opacity-75 pointer-events-none select-none text-slate-800">
        <LemonSliceSVG className="w-full h-full" />
      </div>
      <div className="absolute top-2 left-72 w-28 h-20 opacity-80 pointer-events-none select-none text-slate-800">
        <CrabSVG className="w-full h-full" />
      </div>
      <div className="absolute top-3 left-[400px] w-12 h-12 opacity-75 pointer-events-none select-none text-slate-800">
        <LemonSliceSVG className="w-full h-full" />
      </div>
      <div className="absolute top-2 right-12 w-20 h-28 opacity-80 pointer-events-none select-none text-slate-800">
        <OysterSVG className="w-full h-full" />
      </div>
      <div className="absolute top-2 right-2 w-20 h-28 opacity-80 pointer-events-none select-none text-slate-800">
        <OysterSVG className="w-full h-full transform rotate-12" />
      </div>
      <div className="absolute top-24 right-3 w-14 h-14 opacity-75 pointer-events-none select-none text-slate-800">
        <LemonSliceSVG className="w-full h-full" />
      </div>
      <div className="absolute top-44 right-2 w-14 h-28 opacity-75 pointer-events-none select-none text-slate-800">
        <RosemarySVG className="w-full h-full transform rotate-45" />
      </div>

      {/* ─── ESTRUCTURA PRINCIPAL DE 4 CUADRANTES FIEL A LA IMAGEN ─── */}
      <div className="h-full flex flex-col justify-between">
        {/* PARTE SUPERIOR (Fila 1) */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Col 1-4: Header "Menu SEAFOOD • Always Fresh •" + Pescado */}
          <div className="col-span-4 pl-4 pt-1">
            <div className="flex items-center gap-3 mb-1">
              <h1
                className="text-6xl font-bold text-[#0284c7] leading-none"
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  transform: 'rotate(-4deg)',
                  display: 'inline-block',
                }}
              >
                Menu
              </h1>
              <div className="h-9 w-9 rounded-full overflow-hidden border border-sky-300 shadow-2xs bg-white ml-2">
                <img src={logo} alt="Candymar Logo" className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="mt-1">
              <span
                className="text-4xl font-black uppercase tracking-tight text-slate-900 block"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                SEAFOOD
              </span>
            </div>

            <div
              className="flex items-center gap-2 mt-1 text-slate-700 text-lg italic"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              <span className="text-[#0284c7] font-bold">•</span>
              <span>Always Fresh & Delicious</span>
              <span className="text-[#0284c7] font-bold">•</span>
            </div>

            {/* Pescado Grabado */}
            <div className="w-60 text-slate-800 mt-2 opacity-95">
              <FishSVG className="w-full h-auto" />
            </div>
          </div>

          {/* Col 5-8: Sección "Fish" */}
          <div className="col-span-4 pr-3">
            <h2
              className="text-4xl font-bold text-[#0284c7] mb-3"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Fish
            </h2>
            <div className="space-y-3">
              {fishProducts.map(p => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                    <span className="font-serif text-sm">{p.name}</span>
                    <span className="flex-1 mx-2 border-b-2 border-dotted border-slate-400" />
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
          <div className="col-span-4 pr-10">
            <h2
              className="text-4xl font-bold text-[#0284c7] mb-3"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Mussels
            </h2>
            <div className="space-y-3">
              {musselProducts.slice(0, 4).map(p => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                    <span className="font-serif text-sm">{p.name}</span>
                    <span className="flex-1 mx-2 border-b-2 border-dotted border-slate-400" />
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

        {/* PARTE INFERIOR (Fila 2: Shrimps bloque turquesa + Lobster•Crab recuadro cian) */}
        <div className="grid grid-cols-12 gap-8 items-end mt-2">
          {/* Shrimps: Bloque turquesa suave rectangular (Col 1-4) */}
          <div className="col-span-4 relative bg-gradient-to-br from-cyan-100 via-sky-200 to-teal-100 p-4 border border-cyan-300 rounded-sm overflow-hidden shadow-xs">
            <div className="absolute -top-3 -right-3 w-20 h-20 opacity-70 pointer-events-none text-slate-800">
              <ShrimpSVG className="w-full h-full" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-18 h-18 opacity-65 pointer-events-none text-slate-800">
              <ShrimpSVG className="w-full h-full transform -scale-x-100 rotate-45" />
            </div>
            <div className="absolute bottom-1 right-2 w-10 h-10 opacity-70 pointer-events-none text-slate-800">
              <LemonSliceSVG className="w-full h-full" />
            </div>

            <div className="relative z-10">
              <h2
                className="text-4xl font-bold text-[#0369a1] mb-2.5"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Shrimps
              </h2>

              <div className="space-y-2.5">
                {shrimpProducts.map(p => (
                  <div key={p.id}>
                    <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                      <span className="font-serif text-[13px]">{p.name}</span>
                      <span className="flex-1 mx-2 border-b-2 border-dotted border-sky-400" />
                      <span style={{ fontFamily: "'Oswald', sans-serif" }}>${p.price.toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] text-slate-700 italic font-serif leading-tight">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lobster • Crab: Gran marco con borde cian de 2px (Col 5-12) */}
          <div className="col-span-8 relative border-2 border-[#0ea5e9] bg-white/80 p-4 rounded-sm">
            <div className="absolute -top-6 -right-6 w-24 h-18 opacity-80 pointer-events-none text-slate-800">
              <CrabSVG className="w-full h-full" />
            </div>
            <div className="absolute -bottom-4 -right-3 w-16 h-22 opacity-80 pointer-events-none text-slate-800">
              <OysterSVG className="w-full h-full" />
            </div>

            <h2
              className="text-4xl font-bold text-[#0284c7] mb-2"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Lobster • Crab
            </h2>

            {/* Platillos Anchos Superiores */}
            <div className="space-y-2 mb-3">
              {lobsterCrabProducts.slice(0, 2).map(p => (
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

            {/* Dos columnas inferiores */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {lobsterCrabProducts.slice(2).map(p => (
                <div key={p.id}>
                  <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                    <span className="font-serif text-[12px]">{p.name}</span>
                    <span className="flex-1 mx-1.5 border-b-2 border-dotted border-slate-300" />
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

        {/* Pie de página con créditos */}
        <div className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-sky-100">
          <span>Candymar Seafood & Grill · Receta tradicional de Colima y Sinaloa</span>
          <span>Pedidos WhatsApp: 52 1 56 5046 9993 · imagineandstamp.site</span>
        </div>
      </div>
    </div>
  );
});

export default CandymarPrintTemplate;
