import React, { useEffect } from 'react';
import { HeartHandshake, Calendar, MapPin, Users, CheckCircle2, ShieldAlert, MessageCircle, Mail, Share2, AlertTriangle, ArrowRight } from 'lucide-react';
import { JORNADAS } from '../data/jornadas';
import { CONTACT_EMAIL, SOCIAL_LINKS, WHATSAPP_NUMBER, VOLUNTEER_WHATSAPP_MESSAGE, MEDIA_BASE } from '../config';

interface ActionLine {
  id: string;
  titulo: string;
  fotoId: string;
  resumen: string;
  queHacemos: string[];
  avisoEspecial?: string;
}

const LINEAS_ACCION: ActionLine[] = [
  {
    id: 'limpieza-parajes',
    titulo: 'Limpieza de Parajes y Senderos',
    fotoId: 'jornada-limpieza-1',
    resumen: 'Organizamos brigadas ciudadanas para retirar residuos inorgánicos de las cañadas, parajes de campamento y áreas de alta afluencia.',
    queHacemos: [
      'Retiro sistemático de plásticos, latas y cristales que amenazan a la fauna.',
      'Separación y traslado de residuos reciclables a centros de acopio autorizados.',
      'Instalación y mantenimiento de señalética informativa de concientización.'
    ]
  },
  {
    id: 'reforestacion',
    titulo: 'Reforestación con Especies Nativas',
    fotoId: 'oyamel',
    resumen: 'Plantación estacional de pino de altura (Pinus hartwegii) y oyamel (Abies religiosa) en zonas afectadas por incendios o pastoreo.',
    queHacemos: [
      'Siembra estratégica durante la temporada de lluvias (junio a septiembre).',
      'Monitoreo periódico y cajeteo para asegurar la supervivencia de los renuevos.'
    ]
  },
  {
    id: 'apoyo-incendios',
    titulo: 'Apoyo y Prevención de Incendios Forestales',
    fotoId: 'bosque-quemado-incendio',
    resumen: 'Labores preventivas de retiro de material combustible seco y apoyo logístico a brigadistas oficiales.',
    queHacemos: [
      'Acopio y entrega de víveres y herramientas para brigadas comunitarias, de CONAFOR y PROBOSQUE.',
      'Campañas de difusión sobre el peligro mortal de las fogatas en pastizales.'
    ],
    avisoEspecial: 'PROBOSQUE y la Coordinación General de Protección Civil y Gestión Integral de Riesgo son las únicas autoridades capacitadas para combatir incendios.'
  },
  {
    id: 'cultura-naturaleza',
    titulo: 'Cultura de Naturaleza y Tradición Oral',
    fotoId: 'arbol-ancestral-dosel',
    resumen: 'Talleres comunitarios, pláticas escolares y divulgación audiovisual para rescatar el valor sagrado de las montañas y la memoria biocultural.',
    queHacemos: [
      'Rescate de toponimia náhuatl y relatos tradicionales de las comunidades del volcán.',
      'Talleres de educación ambiental para niñas, niños y jóvenes de la cuenca.',
      'Producción de cápsulas y material educativo para redes sociales y escuelas.'
    ]
  }
];

export const ParticipaPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Participa y Voluntariado · Conocimiento de la Montaña';
    window.scrollTo(0, 0);
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(VOLUNTEER_WHATSAPP_MESSAGE)}`;

  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] pb-28">
      {/* Cabecera con fondo escénico del bosque */}
      <section className="relative pt-24 pb-20 border-b border-white/[0.08] overflow-hidden text-center mb-12">
        <div className="absolute inset-0 z-0">
          <img
            src={`${MEDIA_BASE}/fotos/sendero-rayos-sol-2560.webp`}
            alt="Rayos de sol en el bosque de oyamel"
            className="w-full h-full object-cover filter brightness-[0.32] contrast-110 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E0F0F]/80 via-[#0E0F0F]/90 to-[#0E0F0F]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Voluntariado Ciudadano & Comunitario</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Súmate como voluntario
        </h1>

        <p className="text-base sm:text-lg text-[#9AA3A0] max-w-3xl mx-auto leading-relaxed">
          No somos una agencia turística ni vendemos recorridos. Somos una iniciativa de concientización y conservación activa. La mejor forma de honrar a los volcanes es dedicarles manos, tiempo y cuidado colectivo.
        </p>

        {/* Botón WhatsApp de Acción Directa */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-sm transition-all duration-200 shadow-lg hover:scale-105 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            <span>Quiero participar</span>
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Voluntariado%20Conocimiento%20de%20la%20Monta%C3%B1a`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white/90 font-mono text-xs border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-[#E8A15A]" />
            <span>{CONTACT_EMAIL}</span>
          </a>
        </div>
        </div>
      </section>

      {/* 4 Líneas de Acción */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        <div className="border-b border-white/10 pb-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Nuestras 4 líneas de acción
          </h2>
          <p className="text-sm text-[#9AA3A0] mt-1 font-mono">
            Áreas en las que organizamos trabajo voluntario y comunitario
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {LINEAS_ACCION.map((linea) => (
            <div
              key={linea.id}
              className="rounded-3xl bg-[#141615] border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-56 bg-black">
                <img
                  src={`/izta-popo/media/fotos/${linea.fotoId}-1280.webp`}
                  alt={linea.titulo}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.onerror = null;
                    el.src = '/izta-popo/media/fotos/la-joya-1280.webp';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141615] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                    {linea.titulo}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-[#9AA3A0] leading-relaxed mb-5">
                    {linea.resumen}
                  </p>

                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-mono font-semibold text-[#E8A15A] uppercase tracking-wider">
                      ¿Qué hacemos / Cómo puedes ayudar?
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm text-white/90">
                      {linea.queHacemos.map((que, qIdx) => (
                        <li key={qIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{que}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {linea.avisoEspecial && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5 mt-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-sans">{linea.avisoEspecial}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonio Fotográfico de Brigadas */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="rounded-3xl bg-[#141615] border border-white/10 p-6 sm:p-10 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold uppercase mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Testimonio de Brigadas en Terreno</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Manos ciudadanas cuidando el bosque
              </h2>
              <p className="text-xs sm:text-sm text-[#9AA3A0] mt-1 max-w-2xl">
                Nuestras faenas no son simbólicas: con costales, guantes y esfuerzo colectivo retiramos cientos de kilos de desechos acumulados por décadas en los parajes de montaña.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8A15A] hover:bg-[#d68f47] text-[#0E0F0F] font-bold text-xs transition-all shadow-lg shrink-0"
            >
              <span>Sumarme a la próxima</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group rounded-2xl overflow-hidden bg-black border border-white/10 relative">
              <div className="aspect-[4/3]">
                <img
                  src="/izta-popo/media/fotos/jornada-limpieza-1-1280.webp"
                  alt="Brigada de limpieza en el bosque"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-[#1A1C1B]">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold block mb-1">FAENA COMUNITARIA</span>
                <p className="text-xs text-white/90 font-medium">Recolección intensiva de plásticos y latas en el sotobosque.</p>
              </div>
            </div>

            <div className="group rounded-2xl overflow-hidden bg-black border border-white/10 relative">
              <div className="aspect-[4/3]">
                <img
                  src="/izta-popo/media/fotos/jornada-limpieza-2-1280.webp"
                  alt="Voluntarios cargando costales de residuos"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-[#1A1C1B]">
                <span className="text-[11px] font-mono text-[#E8A15A] font-semibold block mb-1">TRASLADO DE RESIDUOS</span>
                <p className="text-xs text-white/90 font-medium">Evacuación a pie de costales desde barrancas y senderos de difícil acceso.</p>
              </div>
            </div>

            <div className="group rounded-2xl overflow-hidden bg-black border border-white/10 relative">
              <div className="aspect-[4/3]">
                <img
                  src="/izta-popo/media/fotos/jornada-limpieza-3-1280.webp"
                  alt="Pesaje y separación de basura"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-[#1A1C1B]">
                <span className="text-[11px] font-mono text-[#8FC1D4] font-semibold block mb-1">SEPARACIÓN & ACOPIO</span>
                <p className="text-xs text-white/90 font-medium">Clasificación para reciclaje y disposición responsable en centros autorizados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Próximas Jornadas de Ejemplo */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="border-b border-white/10 pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-mono text-[11px] uppercase mb-2">
              <span>Convocatorias Abiertas</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Próximas jornadas de voluntariado
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#E8A15A]/20 text-[#E8A15A] border border-[#E8A15A]/30 text-xs font-mono">
            Fechas de ejemplo
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {JORNADAS.map((jor) => (
            <div
              key={jor.id}
              className="p-6 rounded-3xl bg-[#141615] border border-white/10 shadow-lg flex flex-col justify-between hover:border-white/20 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-medium">
                    {jor.tipo}
                  </span>
                  <span className="text-[11px] font-mono text-[#9AA3A0]">
                    {jor.cupo}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-white mb-3 leading-snug">
                  {jor.titulo}
                </h3>

                <p className="text-xs text-[#9AA3A0] leading-relaxed mb-6">
                  {jor.descripcion}
                </p>

                <div className="space-y-3 pt-4 border-t border-white/5 text-xs text-white/80">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-[#E8A15A] shrink-0 mt-0.5" />
                    <span>{jor.fecha}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#8FC1D4] shrink-0 mt-0.5" />
                    <span>{jor.puntoReunion}</span>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <p className="text-[11px] font-mono text-white/70 font-semibold uppercase">Requisitos sugeridos:</p>
                  <ul className="text-[11px] text-[#9AA3A0] space-y-1">
                    {jor.requisitos.map((req, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, quiero registrarme en la ${jor.titulo}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Anotarme a esta jornada</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Otras Formas de Ayudar */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#141615] border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="w-6 h-6 text-[#E8A15A]" />
            <h3 className="font-serif text-2xl font-bold text-white">
              Otras formas de ayudar todos los días
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#9AA3A0]">
            <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Difunde y comparte en redes
              </h4>
              <p className="text-xs leading-relaxed">
                Ayúdanos a que más personas conozcan la riqueza de los volcanes compartiendo nuestro contenido en Facebook, Instagram y YouTube.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-xs text-[#E8A15A] hover:underline font-mono">Facebook</a>
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-[#E8A15A] hover:underline font-mono">Instagram</a>
                <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-xs text-[#E8A15A] hover:underline font-mono">YouTube</a>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Aplica "No Deje Rastro"
              </h4>
              <p className="text-xs leading-relaxed">
                Si visitas la montaña de manera particular, no dejes absolutamente nada de basura, no utilices fuego abierto y respeta el silencio y los senderos marcados.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                No extraigas musgo ni tierra
              </h4>
              <p className="text-xs leading-relaxed">
                En temporada decembrina, di no a la compra de musgo, heno silvestre y tierra de monte. Protege la esponja natural de agua de la cuenca.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Denuncia la tala clandestina
              </h4>
              <p className="text-xs leading-relaxed">
                Si detectas tala ilegal o transporte sospechoso de troncos en las faldas de la sierra, repórtalo formalmente ante PROFEPA (800-776-3372).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
