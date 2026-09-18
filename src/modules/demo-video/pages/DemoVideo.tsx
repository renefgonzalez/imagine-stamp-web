import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageCircle, Play, Pause, Volume2, VolumeX, ShieldCheck, Zap, Camera, Award, Clock } from 'lucide-react';
import videoMuestra from '../assets/video-muestra.mp4';
import posterImg from '../assets/og-video-demo.jpg';

export default function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 font-sans relative overflow-x-hidden pb-28">
      {/* Luces de fondo ambientales */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-b from-indigo-600/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-gradient-to-b from-pink-600/15 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto px-4 py-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-3 border-b border-white/5">
          <div className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            IMAGINE &amp; STAMP
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Entrega en 3 a 5 días
          </div>
        </header>

        {/* Hero */}
        <div className="text-center my-6">
          <span className="inline-block text-xs font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-lg shadow-red-500/20 mb-3">
            🔥 DESDE $249 MXN
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            Tu Negocio en 3D <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Estilo Pixar
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Videos animados con locución profesional mexicana listos para vender en Reels, TikTok y WhatsApp.
          </p>
        </div>

        {/* Video Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-[320px] mx-auto mb-10 p-2 rounded-[32px] bg-gradient-to-b from-white/20 to-white/5 shadow-2xl shadow-indigo-500/20 border border-white/10"
        >
          <div className="relative rounded-[24px] overflow-hidden bg-black aspect-[9/16] group">
            <video
              ref={videoRef}
              src={videoMuestra}
              poster={posterImg}
              playsInline
              loop
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover cursor-pointer"
              onClick={togglePlay}
            />

            {/* Controles flotantes */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="pointer-events-auto p-4 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/50 backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
                >
                  <Play size={28} className="fill-white translate-x-0.5" />
                </button>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
              <button
                onClick={togglePlay}
                className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/15"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/15"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* 3 Formas de crear tu personaje */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-white mb-1 tracking-tight">¿Cómo creamos tu personaje?</h2>
          <p className="text-slate-400 text-sm mb-4">Tú eliges cómo quieres que luzca el vocero de tu marca:</p>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#12182b]/80 border border-white/10 backdrop-blur-xl flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                📸
              </div>
              <div>
                <h3 className="font-bold text-white text-base">1. A partir de una foto tuya</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5 leading-relaxed">
                  Mándanos una foto de tu rostro o cuerpo. Te transformamos en personaje 3D estilo Pixar con tu peinado, playera o uniforme de trabajo.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#12182b]/80 border border-white/10 backdrop-blur-xl flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                🧸
              </div>
              <div>
                <h3 className="font-bold text-white text-base">2. De tu mascota o logotipo</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5 leading-relaxed">
                  ¿Tienes un dibujo, muñeco, botarga o mascota de tu negocio? Le damos vida en 3D hiperrealista para que hable por tu marca.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#12182b]/80 border border-white/10 backdrop-blur-xl flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                🎨
              </div>
              <div>
                <h3 className="font-bold text-white text-base">3. Diseñado desde cero</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5 leading-relaxed">
                  Elige la profesión y el estilo: chef, barbero, mecánico, doctora, vendedora... con los colores y herramientas de tu negocio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Precios de Lanzamiento */}
        <section className="mb-8">
          <h2 className="text-xl font-black text-white mb-1 tracking-tight">Precios de Lanzamiento</h2>
          <p className="text-slate-400 text-sm mb-4">Pago único por video terminado (sin rentas ni cargos extras):</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-4 rounded-2xl bg-[#12182b]/80 border border-white/10 text-center">
              <span className="text-xs text-slate-300 font-semibold">14 segundos</span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">$249 <span className="text-xs text-slate-400 font-bold">MXN</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Ideal para 1 promo rápida</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/60 to-[#12182b]/90 border border-indigo-500/50 text-center relative overflow-hidden">
              <span className="absolute top-2 right-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-black">
                MÁS PEDIDO
              </span>
              <span className="text-xs text-indigo-300 font-semibold">21 segundos</span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">$299 <span className="text-xs text-slate-400 font-bold">MXN</span></div>
              <p className="text-[11px] text-indigo-200 mt-1">Promo + llamado de venta</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#12182b]/80 border border-white/10 text-center">
              <span className="text-xs text-slate-300 font-semibold">28 segundos</span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">$349 <span className="text-xs text-slate-400 font-bold">MXN</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Explicar menú o servicios</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#12182b]/80 border border-white/10 text-center">
              <span className="text-xs text-slate-300 font-semibold">35 segundos</span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">$399 <span className="text-xs text-slate-400 font-bold">MXN</span></div>
              <p className="text-[11px] text-slate-400 mt-1">Presentación completa</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-dashed border-white/15">
            <h4 className="text-sm font-bold text-sky-400 mb-2 flex items-center gap-1.5">
              <Sparkles size={16} /> Todos los paquetes incluyen:
            </h4>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5">
              <li>✅ Creación de personaje 3D personalizado</li>
              <li>✅ Locución profesional mexicana (voz masculina o femenina)</li>
              <li>✅ Redacción de guion publicitario vendedor</li>
              <li>✅ Música de fondo con licencia comercial</li>
              <li>✅ Formato vertical HD (1080x1920) para Reels, TikTok y WhatsApp</li>
              <li>✅ Entrega garantizada en 3 a 5 días hábiles</li>
            </ul>
          </div>
        </section>

        <footer className="text-center text-xs text-slate-500 py-4 border-t border-white/5">
          <p>© Imagine &amp; Stamp • Videos Publicitarios con IA y Diseño Digital</p>
        </footer>
      </div>

      {/* Botón flotante al pie */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-[#070a13]/90 backdrop-blur-xl border-t border-white/10 z-50">
        <a
          href="https://wa.me/5215650469993?text=Hola%20Imagine%20%26%20Stamp,%20vi%20la%20demo%20y%20quiero%20cotizar%20un%20video%20animado%203D%20para%20mi%20negocio"
          target="_blank"
          rel="noopener noreferrer"
          className="max-w-xl mx-auto flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-base shadow-xl shadow-green-600/30 active:scale-98 transition-transform"
        >
          <MessageCircle size={20} />
          <span>Cotizar mi Personaje por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
