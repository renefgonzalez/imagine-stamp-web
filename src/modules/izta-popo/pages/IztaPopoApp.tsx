import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import '../styles.css';
import { QualityProvider } from '../context/QualityContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DemoBadge } from '../components/DemoBadge';
import { WeightWarningModal } from '../components/WeightWarningModal';

import { Home } from './Home';
import { Explorar } from './Explorar';
import { LugarPage } from './Lugar';
import { FloraPage } from './Flora';
import { BitacoraPage } from './Bitacora';
import { RecorreConmigoPage } from './RecorreConmigo';
import { ComoFuncionaPage } from './ComoFunciona';
import { CreditosPage } from './Creditos';

export default function IztaPopoApp() {
  const { pathname } = useLocation();

  // Scroll al tope al navegar internamente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Título del documento
  useEffect(() => {
    document.title = 'Izta-Popo · Expediciones | Alta Montaña & Biodiversidad';
  }, []);

  return (
    <QualityProvider>
      <div className="min-h-screen flex flex-col bg-[#0E0F0F] text-[#F2F1EC] selection:bg-[#E8A15A] selection:text-black font-sans antialiased">
        <Navbar />

        <main className="flex-1 w-full">
          <Routes>
            <Route index element={<Home />} />
            <Route path="explorar" element={<Explorar />} />
            <Route path="lugar/:id" element={<LugarPage />} />
            <Route path="flora" element={<FloraPage />} />
            <Route path="bitacora" element={<BitacoraPage />} />
            <Route path="recorre-conmigo" element={<RecorreConmigoPage />} />
            <Route path="como-funciona" element={<ComoFuncionaPage />} />
            <Route path="creditos" element={<CreditosPage />} />
            {/* Fallback de ruta dentro del módulo */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <Footer />
        <DemoBadge />
        <WeightWarningModal />
      </div>
    </QualityProvider>
  );
}
