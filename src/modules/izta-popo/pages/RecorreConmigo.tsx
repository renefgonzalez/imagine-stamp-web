import React from 'react';
import {
  MessageCircle,
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  Mountain,
  Users,
  HeartHandshake
} from 'lucide-react';
import { GUIDE_NAME, GUIDE_ROLE, WHATSAPP_URL, MEDIA_BASE } from '../config';

export const RecorreConmigoPage: React.FC = () => {
  const tiposRecorrido = [
    {
      id: 'iniciacion',
      nombre: 'Paseo Botánico y Miradores',
      dificultad: 'Fácil (Iniciación)',
      nivelColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      duracion: '4 a 5 horas',
      altitudMax: '3,800 m',
      idealPara: 'Familias, principiantes y aficionados a la fotografía de naturaleza.',
      incluye: [
        'Guía profesional acreditado SECTUR / CONANP',
        'Caminata por el bosque de oyamel y mirador del Popo',
        'Taller de identificación de flora nativa y rastreo de teporingo',
        'Registro de acceso oficial y seguro de senderismo',
        'Bastones de trekking y botiquín de primeros auxilios',
      ],
      whatsappMsg: 'Hola Martín, me interesa el recorrido de Iniciación: Paseo Botánico y Miradores.',
    },
    {
      id: 'intermedio',
      nombre: 'Ascenso a Los Portillos & Ayoloco',
      dificultad: 'Media (Aclimatación)',
      nivelColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      duracion: '7 a 8 horas',
      altitudMax: '4,850 m',
      idealPara: 'Senderistas con condición física regular que deseen superar los 4,500 m.',
      incluye: [
        'Guía de montaña ratio 1:4',
        'Travesía desde La Joya hasta el Refugio de los Cien',
        'Homenaje y visita al lecho del Glaciar de Ayoloco',
        'Casco de montaña y asesoría de nutrición en altitud',
        'Refrigerio calórico de marcha y té caliente en la montaña',
      ],
      whatsappMsg: 'Hola Martín, me interesa el recorrido Intermedio: Los Portillos y Ayoloco.',
    },
    {
      id: 'alta-montana',
      nombre: 'Cumbre de El Pecho (Iztaccíhuatl)',
      dificultad: 'Alta (Exigencia Técnica)',
      nivelColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      duracion: '12 a 14 horas (Salida nocturna)',
      altitudMax: '5,230 m',
      idealPara: 'Montañistas con experiencia previa sobre los 4,000 m y excelente resistencia aeróbica.',
      incluye: [
        'Guía líder de alta montaña ratio 1:3',
        'Crampones, piolet y arnés de seguridad homologado UIAA',
        'Campamento base en La Joya previo a la cumbre',
        'Monitoreo constante de saturación de oxígeno (oximetría)',
        'Reportaje fotográfico digital en alta resolución de tu cumbre',
      ],
      whatsappMsg: 'Hola Martín, me interesa la expedición de Alta Montaña a la Cumbre de El Pecho.',
    },
  ];

  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] pb-28">
      {/* Cabecera */}
      <section className="pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30 text-xs font-mono font-semibold">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>EXPEDICIONES PERSONALIZADAS</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Recorre conmigo los volcanes sagrados
          </h1>

          <p className="text-sm sm:text-base text-[#9AA3A0] leading-relaxed">
            La montaña no se conquista: se visita con humildad, conocimiento técnico y respeto. Descubre nuestros programas guiados diseñados para todos los niveles de experiencia.
          </p>
        </div>
      </section>

      {/* Tarjeta de Presentación del Guía */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="rounded-3xl p-6 sm:p-10 bg-[#141615] border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Foto del guía */}
          <div className="md:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-xl">
            <img
              src={`${MEDIA_BASE}/fotos/cumbre-izta-1280.webp`}
              alt={GUIDE_NAME}
              className="w-full h-full object-cover filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-xs font-mono text-[#E8A15A] uppercase block">Guía Titular</span>
              <h3 className="font-serif text-xl font-bold text-white">{GUIDE_NAME}</h3>
              <p className="text-xs text-[#9AA3A0]">{GUIDE_ROLE}</p>
            </div>
          </div>

          {/* Biografía y Credenciales */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8A15A]">
                Filosofía de Montaña
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                "Más de doce años abriendo huella y compartiendo los secretos de la cordillera"
              </h2>
              <p className="text-xs sm:text-sm text-[#9AA3A0] leading-relaxed">
                Nací y crecí a las faldas del Iztaccíhuatl. Mi misión va más allá de llevar a una cordada a la cumbre: busco que cada persona entienda la fragilidad de estos ecosistemas, reconozca el vuelo del águila sobre las corrientes térmicas y respire con tranquilidad en altitudes extremas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
                <h4 className="text-xs font-semibold text-white">Certificación WFR</h4>
                <p className="text-[11px] text-[#9AA3A0]">Primeros Auxilios en Áreas Silvestres y Rescate de Altura.</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <Award className="w-5 h-5 text-[#E8A15A] mb-1" />
                <h4 className="text-xs font-semibold text-white">Registro CONANP</h4>
                <p className="text-[11px] text-[#9AA3A0]">Permiso oficial de operación turística en Parque Nacional.</p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs transition-all shadow-xl shadow-[#25D366]/20"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Contactar a {GUIDE_NAME} por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Recorrido */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8FC1D4] block mb-1">
            Planes de Ascenso
          </span>
          <h2 className="font-serif text-3xl font-bold text-white">
            Tres formas de vivir la experiencia
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiposRecorrido.map((rec) => (
            <div
              key={rec.id}
              className="rounded-3xl p-6 sm:p-8 bg-[#141615] border border-white/10 hover:border-[#E8A15A]/40 transition-all flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border ${rec.nivelColor}`}>
                    {rec.dificultad}
                  </span>
                  <span className="text-xs font-mono text-[#9AA3A0] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{rec.duracion}</span>
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-white">
                  {rec.nombre}
                </h3>

                <p className="text-xs text-[#9AA3A0] leading-relaxed">
                  {rec.idealPara}
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-[#8FC1D4]">
                  Altitud máxima: <strong className="text-white">{rec.altitudMax}</strong>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono uppercase text-[#9AA3A0] block">Qué incluye:</span>
                  <ul className="space-y-2 text-xs text-[#F2F1EC]/90">
                    {rec.incluye.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E8A15A] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href={`https://wa.me/525500000000?text=${encodeURIComponent(rec.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#E8A15A] hover:bg-[#f3b578] text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#E8A15A]/20"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>Reservar fecha por WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
