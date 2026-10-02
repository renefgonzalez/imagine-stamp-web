import React from 'react';
import { ExternalLink, Award, FileText, ShieldAlert } from 'lucide-react';
import { CREDITOS_MEDIA } from '../data/creditos';

export const CreditosPage: React.FC = () => {
  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] pb-28">
      {/* Cabecera */}
      <section className="pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30 text-xs font-mono font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>LICENCIAS LIBRES & ATRIBUCIÓN</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Créditos y licencias de medios
          </h1>

          <p className="text-sm sm:text-base text-[#9AA3A0] leading-relaxed">
            Todo el material fotográfico y audiovisual presentado en este prototipo demo proviene de <strong>Wikimedia Commons</strong> bajo licencias libres (Creative Commons CC BY, CC BY-SA o Dominio Público). En la versión final del cliente, este material se reemplazará por las fotografías y videos originales del guía.
          </p>
        </div>
      </section>

      {/* Tabla completa de créditos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden bg-[#141615] border border-white/10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 font-mono text-[#9AA3A0] uppercase text-[11px]">
                  <th className="py-4 px-6">Archivo</th>
                  <th className="py-4 px-6">Uso en el Demo</th>
                  <th className="py-4 px-6">Autor</th>
                  <th className="py-4 px-6">Licencia</th>
                  <th className="py-4 px-6">Resolución</th>
                  <th className="py-4 px-6 text-right">Fuente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {CREDITOS_MEDIA.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-mono text-white/90 font-medium">
                      {item.archivo}
                    </td>
                    <td className="py-4 px-6 text-[#9AA3A0]">
                      {item.uso}
                    </td>
                    <td className="py-4 px-6 text-white font-medium">
                      {item.autor}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-[#E8A15A] font-mono text-[11px]">
                        {item.licencia}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[#8FC1D4] text-[11px]">
                      {item.resolucion}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href={item.fuenteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#E8A15A] hover:underline font-mono text-[11px]"
                      >
                        <span>Commons</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nota aclaratoria */}
        <div className="mt-8 p-5 rounded-2xl bg-[#1A1C1B] border border-white/5 flex items-start gap-3 text-xs text-[#9AA3A0]">
          <ShieldAlert className="w-5 h-5 text-[#E8A15A] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Algunas fotografías de referencia alpina (como el pino hartwegii y el cardo azul) fueron tomadas en el Nevado de Toluca y el teporingo en el Zoológico de Chapultepec para fines ilustrativos del prototipo, conforme se documenta en las actas de Creative Commons.
          </p>
        </div>
      </section>
    </div>
  );
};
