import React, { useState, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Check, Sparkles, Clock, 
  ShieldCheck, MessageCircle, Film, ArrowRight, ChevronDown, ChevronUp, Send
} from 'lucide-react';
import { inviteConfig, PaqueteInvitacion } from '../config';

export const VideoInvitaciones: React.FC = () => {
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const [isPlayingHero, setIsPlayingHero] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<PaqueteInvitacion>(inviteConfig.paquetes[1]);
  const [temaSeleccionado, setTemaSeleccionado] = useState<string>('Guerreras K-Pop / Idols');
  const [temaPersonalizado, setTemaPersonalizado] = useState<string>('');
  const [nombreFestejado, setNombreFestejado] = useState<string>('');
  const [edadFestejado, setEdadFestejado] = useState<string>('');
  const [fechaEvento, setFechaEvento] = useState<string>('');

  const [filtroDemo, setFiltroDemo] = useState<string>('todos');
  const [videoActivoId, setVideoActivoId] = useState<string | null>(null);
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);

  const toggleHeroSound = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !isHeroMuted;
      setIsHeroMuted(!isHeroMuted);
    }
  };

  const toggleHeroPlay = () => {
    if (heroVideoRef.current) {
      if (isPlayingHero) {
        heroVideoRef.current.pause();
      } else {
        heroVideoRef.current.play();
      }
      setIsPlayingHero(!isPlayingHero);
    }
  };

  const scrollToCotizador = (paquete?: PaqueteInvitacion) => {
    if (paquete) {
      setPaqueteSeleccionado(paquete);
    }
    const el = document.getElementById('cotizador-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const enviarWhatsApp = () => {
    const temaFinal = temaSeleccionado === 'Otro tema (personalizado)' ? temaPersonalizado || 'Tema personalizado' : temaSeleccionado;
    const festejadoTexto = nombreFestejado ? `${nombreFestejado}${edadFestejado ? ` (${edadFestejado} años)` : ''}` : 'Por definir';
    const fechaTexto = fechaEvento || 'Por definir';

    const mensaje = 
`¡Hola Imagine & Stamp! 🎉 Quiero cotizar una Invitación Digital:

🌟 *Paquete:* ${paqueteSeleccionado.nombre} ($${paqueteSeleccionado.precio} MXN)
🎨 *Temática:* ${temaFinal}
🎂 *Festejado:* ${festejadoTexto}
📅 *Fecha:* ${fechaTexto}

¿Me podrían orientar para iniciar mi pedido? ¡Muchas gracias!`;

    const url = `https://wa.me/${inviteConfig.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.location.href = url;
  };

  const demosFiltrados = filtroDemo === 'todos' 
    ? inviteConfig.demos 
    : inviteConfig.demos.filter(d => d.categoria.toLowerCase().includes(filtroDemo.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1E293B] font-sans selection:bg-pink-200 selection:text-pink-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF5EA] via-[#FFF9F2] to-[#FFFDF9]">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-pink-200/60 text-pink-600 font-semibold text-xs md:text-sm">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>La Nueva Tendencia en Fiestas 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Tu hijo, el <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600">protagonista</span> de su propia historia 🎉
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Sorprende a tus invitados con invitaciones modernas para celular. Desde <strong>tarjetas interactivas con botones</strong> hasta <strong>videos animados con música</strong> y tecnología 3D donde tu peque habla e invita a su fiesta.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => scrollToCotizador()}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-base shadow-lg shadow-pink-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span>Ver Paquetes y Cotizar</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="#demos-section"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-base border border-slate-200 shadow-sm transition-all text-center"
                >
                  Ver Videos Demo
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/60">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Entrega en 24h</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Film className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Cualquier Tema</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Pago Seguro OXXO</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <MessageCircle className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>Directo a WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-[280px] sm:w-[310px] aspect-[9/16] rounded-[38px] bg-slate-900 p-3 shadow-2xl shadow-purple-500/20 border-4 border-slate-800">
                <div className="w-full h-full rounded-[30px] overflow-hidden relative bg-black">
                  <video
                    ref={heroVideoRef}
                    src="/videoinvitaciones/assets/hero_mateo.mp4"
                    poster="/videoinvitaciones/assets/poster_mateo.jpg"
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted={isHeroMuted}
                    playsInline
                  />

                  <div className="absolute bottom-4 left-3 right-3 flex items-center justify-between z-20">
                    <button
                      onClick={toggleHeroPlay}
                      className="p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-all"
                    >
                      {isPlayingHero ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={toggleHeroSound}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-2 transition-all ${
                        isHeroMuted 
                          ? 'bg-pink-600/90 text-white animate-pulse' 
                          : 'bg-black/60 text-white hover:bg-black/80'
                      }`}
                    >
                      {isHeroMuted ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>🔊 Activar Sonido</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Sonido Activado</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="absolute top-5 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white tracking-wider uppercase border border-white/20">
                    Demo Protagonista 3D
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PAQUETES Y PRECIOS */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Elige el formato ideal para tu fiesta 🎈
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Tenemos 4 formatos adaptados a tu gusto y presupuesto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
          {inviteConfig.paquetes.map((pkg) => {
            const isSelected = paqueteSeleccionado.id === pkg.id;
            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                  pkg.destacado
                    ? 'bg-white border-2 border-pink-500 shadow-xl shadow-pink-500/10 lg:-translate-y-2'
                    : 'bg-white border border-slate-200/80 shadow-md hover:shadow-lg'
                } ${isSelected ? 'ring-2 ring-pink-500 ring-offset-2' : ''}`}
              >
                {pkg.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: pkg.color }}
                  >
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <div className="text-center pb-5 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 mt-2">{pkg.nombre}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{pkg.descripcionCorta}</p>
                    
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-black text-slate-900">${pkg.precio}</span>
                      <span className="text-xs font-bold text-slate-500">MXN</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Entrega: {pkg.tiempoEntrega}</span>
                    </div>
                  </div>

                  <ul className="py-5 space-y-3 text-xs sm:text-sm text-slate-600">
                    {pkg.incluye.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2.5 leading-snug">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white"
                          style={{ backgroundColor: pkg.color }}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => scrollToCotizador(pkg)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-4 ${
                    isSelected ? 'bg-pink-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>{isSelected ? '✓ Paquete Seleccionado' : 'Elegir este Paquete'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. GALERÍA DE DEMOS */}
      <section id="demos-section" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">
              <Film className="w-3.5 h-3.5" />
              <span>Demos Reales</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">
              Mira cómo lucen en el celular 📱
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Haz clic en cualquiera para reproducirlo. ¡Así lo verán tus invitados por WhatsApp!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: 'todos', label: 'Todos los Demos' },
              { id: 'video animado', label: 'Video Animado ($399)' },
              { id: 'cinemática', label: 'Historia ($499)' },
              { id: 'protagonista', label: 'Protagonista 3D ($699)' },
              { id: 'interactiva', label: 'Interactiva ($99)' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFiltroDemo(f.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  filtroDemo === f.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {demosFiltrados.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200/80 flex flex-col group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[9/16] bg-slate-950 overflow-hidden">
                  {item.tipo === 'video' ? (
                    <video
                      src={item.url}
                      poster={item.poster}
                      className="w-full h-full object-cover"
                      controls={videoActivoId === item.id}
                      autoPlay={videoActivoId === item.id}
                      loop
                      playsInline
                      onPlay={() => setVideoActivoId(item.id)}
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {item.tipo === 'video' && videoActivoId !== item.id && (
                    <button
                      onClick={() => setVideoActivoId(item.id)}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </button>
                  )}

                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase">
                    {item.categoria}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">{item.titulo}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.descripcion}</p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-black text-pink-600">{item.paquete}</span>
                    <button
                      onClick={() => scrollToCotizador()}
                      className="text-xs font-bold text-slate-700 hover:text-pink-600 flex items-center gap-1"
                    >
                      <span>Pedir</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. ANTES / DESPUÉS */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-[36px] p-6 sm:p-10 md:p-14 text-white shadow-2xl overflow-hidden relative">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Magia Tecnológica con su Foto Real</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
              Así llegó su foto… ¡y así quedó su héroe! ✨
            </h2>
            <p className="text-purple-200 text-sm sm:text-base leading-relaxed">
              Para el paquete <strong>Protagonista 3D ($699)</strong>, solo nos envías una foto común de celular y la transformamos en un personaje animado idéntico que habla a cámara.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 max-w-3xl mx-auto items-center">
            <div className="bg-white/10 rounded-3xl p-4 backdrop-blur-md border border-white/10 text-center space-y-3">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 shadow-md">
                <img
                  src="/videoinvitaciones/assets/A1_foto_mateo.png"
                  alt="Foto real del niño"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-bold text-sm text-purple-200">
                📷 1. Foto real enviada por WhatsApp
              </div>
            </div>

            <div className="bg-gradient-to-b from-pink-500/20 to-purple-500/20 rounded-3xl p-4 backdrop-blur-md border border-pink-500/40 text-center space-y-3 shadow-lg shadow-pink-500/10">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 shadow-md relative">
                <img
                  src="/videoinvitaciones/assets/B1_mateo_heroe.png"
                  alt="Personaje 3D animado"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-pink-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  Habla y se Mueve
                </div>
              </div>
              <div className="font-bold text-sm text-pink-300">
                🌟 2. Tu hijo convertido en personaje 3D
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => scrollToCotizador(inviteConfig.paquetes[3])}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-pink-500/30"
            >
              Quiero la de mi hijo en 3D ($699)
            </button>
          </div>
        </div>
      </section>

      {/* 5. COTIZADOR INSTANTÁNEO A WHATSAPP */}
      <section id="cotizador-section" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFFDF9] via-pink-50/40 to-[#FFFDF9]">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Send className="w-3.5 h-3.5" />
              <span>Cotizador en Tiempo Real</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">
              Arma tu invitación en 30 segundos ⚡
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Selecciona tu paquete y datos; te llevará directo a WhatsApp con tu cotización lista.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 space-y-8">
            
            {/* Paso 1: Paquete */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                1. Selecciona tu Paquete:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {inviteConfig.paquetes.map((p) => {
                  const active = paqueteSeleccionado.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaqueteSeleccionado(p)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        active
                          ? 'border-pink-500 bg-pink-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900">{p.nombre}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Entrega: {p.tiempoEntrega}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-base text-slate-900">${p.precio}</div>
                        <div className="text-[10px] text-slate-500">MXN</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paso 2: Temática */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                2. Temática o Personaje de la Fiesta:
              </label>
              <select
                value={temaSeleccionado}
                onChange={(e) => setTemaSeleccionado(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              >
                {inviteConfig.temasPopulares.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {temaSeleccionado === 'Otro tema (personalizado)' && (
                <input
                  type="text"
                  placeholder="Escribe el personaje o tema que deseas..."
                  value={temaPersonalizado}
                  onChange={(e) => setTemaPersonalizado(e.target.value)}
                  className="w-full mt-3 p-3.5 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              )}
            </div>

            {/* Paso 3: Datos del Festejado */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                3. Datos del Evento (Opcional por ahora):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Nombre del cumpleañero/a"
                    value={nombreFestejado}
                    onChange={(e) => setNombreFestejado(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="¿Cuántos años cumple? (ej. 5 años)"
                    value={edadFestejado}
                    onChange={(e) => setEdadFestejado(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Fecha estimada de la fiesta (ej. 15 de Noviembre)"
                    value={fechaEvento}
                    onChange={(e) => setFechaEvento(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Resumen Total y Botón */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500 font-semibold">Total a Pagar:</div>
                <div className="text-3xl font-black text-slate-900">
                  ${paqueteSeleccionado.precio} <span className="text-sm text-slate-500 font-bold">MXN</span>
                </div>
                <div className="text-xs text-emerald-600 font-semibold">
                  ✓ 50% de anticipo para iniciar
                </div>
              </div>

              <button
                onClick={enviarWhatsApp}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-base shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Pedir por WhatsApp Ahora</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 6. PREGUNTAS FRECUENTES */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Preguntas Frecuentes 💬
          </h2>
          <p className="text-slate-600 text-sm">
            Resolvemos tus dudas antes de ordenar tu invitación.
          </p>
        </div>

        <div className="space-y-3">
          {inviteConfig.faqs.map((faq, idx) => {
            const isOpen = faqAbierta === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setFaqAbierta(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.pregunta}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-pink-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.respuesta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 px-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500 space-y-4">
        <p className="font-semibold text-slate-700">
          Imagine & Stamp · Video-Invitaciones Digitales Infantiles y Eventos Sociales
        </p>
        <p className="max-w-xl mx-auto text-slate-400 text-[11px] leading-relaxed">
          Videos e invitaciones digitales para uso personal y familiar. Todos los personajes pertenecen a sus respectivos creadores. Imagine & Stamp ofrece servicio de animación, diseño y edición gráfica personalizada.
        </p>
        <p className="text-slate-400">
          © {new Date().getFullYear()} Imagine & Stamp. Hecho con ❤️ para momentos inolvidables.
        </p>
      </footer>

      {/* Botón WhatsApp Flotante */}
      <a
        href={`https://wa.me/${inviteConfig.whatsapp}?text=${encodeURIComponent('¡Hola Imagine & Stamp! Quiero informes sobre las video-invitaciones 🎉')}`}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-emerald-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
        title="Hablar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>

    </div>
  );
};

export default VideoInvitaciones;
