import React from 'react';
import Footer from './Footer';
import FloatingCart from './FloatingCart';
import { useCartStore } from './cartStore';
import logoImg from './logo.png';

const MenuPatrona = () => {
  const { addItem } = useCartStore();

  return (
    <div className="min-h-screen bg-[#1A110D] text-[#F9E79F] font-sans relative pb-28 overflow-hidden">
      {/* Textura rústica sutil usando ruido SVG */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      ></div>

      <div className="max-w-md mx-auto p-5 md:p-6 relative z-10">
        
        {/* Cabecera y Logo */}
        <div className="flex flex-col items-center mb-10 text-center pt-8">
          <div className="w-56 md:w-64 mb-6 relative">
            <img src={logoImg} alt="Logo Auténticas Cazuelitas La Patrona" className="w-full h-auto object-contain drop-shadow-2xl" />
          </div>
        </div>

        {/* Precios Base */}
        <div className="mb-12">
          <h2 className="text-xl font-black text-[#D35400] border-b border-[#D35400]/30 pb-3 mb-6 uppercase tracking-[0.2em] text-center flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[#D35400]/50"></span>
            Precios Base
            <span className="w-8 h-px bg-[#D35400]/50"></span>
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-b from-[#2A1D16] to-[#1A110D] border border-[#F9E79F]/10 rounded-2xl p-5 text-center shadow-lg hover:border-[#D35400]/50 transition-colors">
              <p className="text-[#F9E79F]/80 text-sm font-bold uppercase tracking-widest mb-2">Tacos</p>
              <p className="text-4xl font-black text-white drop-shadow-md">$20</p>
            </div>
            <div className="bg-gradient-to-b from-[#2A1D16] to-[#1A110D] border border-[#F9E79F]/10 rounded-2xl p-5 text-center shadow-lg hover:border-[#D35400]/50 transition-colors flex flex-col justify-center">
              <p className="text-[#F9E79F]/80 text-[11px] font-bold uppercase tracking-widest mb-2 leading-tight">Quesadillas /<br/>Picadas</p>
              <p className="text-4xl font-black text-white drop-shadow-md">$30</p>
            </div>
          </div>
        </div>

        {/* Especialidad de la Casa */}
        <div className="mb-12 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#D35400] via-[#F9E79F] to-[#D35400] rounded-3xl blur opacity-30"></div>
          <div className="bg-[#1A110D] border border-[#D35400] rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D35400]/10 to-transparent"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-block bg-[#D35400] text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3 shadow-md">
                Nuestra Especialidad
              </div>
              <h3 className="text-3xl font-black text-[#F9E79F] uppercase tracking-widest mb-6 drop-shadow-md flex items-center justify-center gap-2">
                <span className="text-[#D35400]">🔥</span> Barbacoa <span className="text-[#D35400]">🔥</span>
              </h3>
              
              <div className="flex justify-center items-center gap-6">
                <div className="text-center flex-1">
                  <p className="text-[#F9E79F]/60 text-xs uppercase tracking-widest mb-1 font-bold">Tacos</p>
                  <p className="text-3xl font-black text-white mb-2">$25</p>
                  <button onClick={() => addItem({ type: 'Taco', guiso: 'Barbacoa', price: 25 })} className="border border-[#D35400] text-[#F9E79F] px-4 py-1.5 rounded-[2rem] text-sm font-medium flex items-center justify-center gap-2 mx-auto hover:bg-[#D35400] transition-colors w-full"><span className="text-lg leading-none">🌮</span> Agregar</button>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#D35400]/50 to-transparent"></div>
                <div className="text-center flex-1">
                  <p className="text-[#F9E79F]/60 text-[10px] uppercase tracking-widest mb-1 font-bold leading-tight">Quesadillas /<br/>Picadas</p>
                  <p className="text-3xl font-black text-white mb-2">$35</p>
                  <button onClick={() => addItem({ type: 'Quesadilla', guiso: 'Barbacoa', price: 35 })} className="border border-[#D35400] text-[#F9E79F] px-4 py-1.5 rounded-[2rem] text-sm font-medium flex items-center justify-center gap-2 mx-auto hover:bg-[#D35400] transition-colors w-full"><span className="text-lg leading-none">🧀</span> Agregar</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Guisos */}
        <div className="mb-6">
          <h2 className="text-xl font-black text-[#D35400] border-b border-[#D35400]/30 pb-3 mb-6 uppercase tracking-[0.2em] text-center flex items-center justify-center gap-3">
            <span className="w-6 h-px bg-[#D35400]/50"></span>
            Nuestros Guisos
            <span className="w-6 h-px bg-[#D35400]/50"></span>
          </h2>
          
          <div className="bg-[#2A1D16]/50 border border-[#F9E79F]/10 rounded-2xl overflow-hidden shadow-md">
            {[
              "Chicharrón prensado", "Bistec a la mexicana", "Picadillo", 
              "Pollo con mole", "Rajas con crema", "Chorizo con papas", 
              "Deshebrada", "Cochinita"
            ].map((guiso, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between px-5 py-4 border-b border-[#F9E79F]/10 last:border-0 hover:bg-[#D35400]/5 transition-colors flex-col sm:flex-row gap-3"
              >
                <span className="text-[#F9E79F] font-semibold text-base text-center sm:text-left w-full sm:w-auto">{guiso}</span>
                <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
                  <button onClick={() => addItem({ type: 'Taco', guiso, price: 20 })} className="border border-[#D35400] text-[#F9E79F] px-4 py-1.5 rounded-[2rem] text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#D35400] hover:text-white transition-colors flex-1 sm:flex-none">
                    <span className="text-sm leading-none">🌮</span> Agregar <span className="opacity-60 text-[10px]">($20)</span>
                  </button>
                  <button onClick={() => addItem({ type: 'Quesadilla', guiso, price: 30 })} className="border border-[#D35400] text-[#F9E79F] px-4 py-1.5 rounded-[2rem] text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#D35400] hover:text-white transition-colors flex-1 sm:flex-none">
                    <span className="text-sm leading-none">🧀</span> Agregar <span className="opacity-60 text-[10px]">($30)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[#F9E79F]/50 text-xs mt-4 italic">
            * Sujetos a disponibilidad del día
          </p>
        </div>

      </div>

      {/* Footer al pie de la página */}
      <Footer />

      <FloatingCart />
    </div>
  );
};

export default MenuPatrona;
