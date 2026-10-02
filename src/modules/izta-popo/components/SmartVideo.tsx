import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import { Settings, Play, Pause, Volume2, VolumeX, Maximize2, AlertCircle } from 'lucide-react';
import { useQuality, QualityMode } from '../context/QualityContext';
import { MEDIA_BASE, STREAM_BASE } from '../config';

interface SmartVideoProps {
  videoId: string; // nombre base, ej. 'presentacion', 'video-popo-4k-noaa' o 'video-volcanes-avion'
  titulo?: string;
  resolucionNativa?: '4K' | '1080p' | 'SD';
  pesoOriginalGB?: number;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  objectFit?: 'contain' | 'cover';
}

export const SmartVideo: React.FC<SmartVideoProps> = ({
  videoId,
  titulo = 'Video documental',
  resolucionNativa = '1080p',
  pesoOriginalGB = 0.25,
  className = '',
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
  objectFit = 'contain',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { mode: globalMode, requestOriginalQuality } = useQuality();

  const [localMode, setLocalMode] = useState<QualityMode>(globalMode);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showSettings, setShowSettings] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Sincronizar con el modo global
  useEffect(() => {
    setLocalMode(globalMode);
  }, [globalMode]);

  // Determinar la URL del video y del poster
  const posterUrl = `${MEDIA_BASE}/video/${videoId}-poster.webp`;

  let videoSrc = '';
  let activeResolution = '1080p';

  const hasStreamBase = typeof STREAM_BASE === 'string' && STREAM_BASE.trim() !== '';

  if (hasStreamBase) {
    // Si hay un endpoint HLS de Bunny Stream configurado
    videoSrc = `${STREAM_BASE}/${videoId}/playlist.m3u8`;
    activeResolution = 'HLS Adaptativo';
  } else {
    // Archivos MP4 / WebM locales
    if (localMode === 'ligero') {
      videoSrc = `${MEDIA_BASE}/video/${videoId}-ligero.mp4`;
      activeResolution = resolucionNativa === 'SD' ? 'SD (480p)' : '720p HD';
    } else if (localMode === 'alta') {
      videoSrc = `${MEDIA_BASE}/video/${videoId}-alta.mp4`;
      activeResolution =
        resolucionNativa === 'SD'
          ? 'SD (576p)'
          : resolucionNativa === '4K'
          ? '1080p / 4K'
          : '1080p Full HD';
    } else {
      // Original
      const ext = videoId === 'presentacion' ? 'mp4' : 'webm';
      videoSrc = `${MEDIA_BASE}/video/${videoId}-original.${ext}`;
      activeResolution =
        resolucionNativa === 'SD'
          ? 'SD (Original 15 MB)'
          : resolucionNativa === '4K'
          ? '4K Ultra HD (Original)'
          : '1080p (Original)';
    }
  }

  // Manejo de HLS.js o video HTML5 nativo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    const prevTime = currentTime;

    if (hasStreamBase && Hls.isSupported() && videoSrc.endsWith('.m3u8')) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (prevTime > 0) video.currentTime = prevTime;
        if (isPlaying) video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, () => {
        setHasError(true);
      });
    } else {
      video.src = videoSrc;
      video.load();
      if (prevTime > 0) video.currentTime = prevTime;
      if (isPlaying) {
        video.play().catch(() => {
          // Si el navegador bloquea autoplay con sonido, continuar
        });
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoSrc]);

  // Actualizar estado de reproducción
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleModeChange = (targetMode: QualityMode) => {
    const video = videoRef.current;
    if (video) setCurrentTime(video.currentTime);

    if (targetMode === 'original' && resolucionNativa !== 'SD') {
      requestOriginalQuality(
        Math.round(pesoOriginalGB * 1024),
        'video',
        titulo,
        () => setLocalMode('original')
      );
    } else {
      setLocalMode(targetMode);
    }
    setShowSettings(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden bg-black/90 group select-none shadow-2xl border border-white/10 ${className}`}
    >
      {/* Elemento de Video */}
      <video
        ref={videoRef}
        poster={posterUrl}
        playsInline
        loop={loop}
        muted={isMuted}
        onTimeUpdate={() => {
          if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
        }}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : 'object-contain'} bg-black`}
      />

      {/* Botón Central de Play si está pausado */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E8A15A] text-black flex items-center justify-center shadow-2xl shadow-[#E8A15A]/40 hover:scale-110 hover:bg-[#f3b578] transition-all z-10"
          aria-label="Reproducir video"
        >
          <Play className="w-8 h-8 fill-black translate-x-0.5" />
        </button>
      )}

      {/* Badge de Resolución y Calidad */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider backdrop-blur-md border ${
            resolucionNativa === 'SD'
              ? 'bg-[#1A1C1B]/80 text-[#E8A15A] border-[#E8A15A]/40'
              : localMode === 'original'
              ? 'bg-[#E8A15A] text-black border-[#E8A15A]'
              : 'bg-black/60 text-white/90 border-white/20'
          }`}
        >
          {activeResolution}
        </span>
      </div>

      {/* Controles de Reproducción Inferiores */}
      {controls && (
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 rounded-xl text-white hover:text-[#E8A15A] hover:bg-white/10 transition-colors"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-xl text-white hover:text-[#E8A15A] hover:bg-white/10 transition-colors"
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Menú de Selector de Calidad del Video */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-xl text-white hover:text-[#E8A15A] hover:bg-white/10 transition-colors flex items-center gap-1 text-xs font-mono"
                aria-label="Ajustes de calidad"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showSettings && (
                <div className="absolute bottom-12 right-0 w-44 rounded-2xl bg-[#1A1C1B] border border-white/15 shadow-2xl p-2 z-30 font-sans text-xs space-y-1">
                  <div className="px-2 py-1 text-[10px] font-mono text-[#9AA3A0] uppercase border-b border-white/10">
                    Calidad de Video
                  </div>

                  <button
                    onClick={() => handleModeChange('ligero')}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between ${
                      localMode === 'ligero'
                        ? 'bg-[#E8A15A] text-black font-semibold'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span>⚡ Ligero</span>
                    <span className="text-[10px] font-mono opacity-70">
                      {resolucionNativa === 'SD' ? '480p' : '720p'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleModeChange('alta')}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between ${
                      localMode === 'alta'
                        ? 'bg-[#E8A15A] text-black font-semibold'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span>🎬 Alta calidad</span>
                    <span className="text-[10px] font-mono opacity-70">
                      {resolucionNativa === 'SD' ? '576p' : '1080p'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleModeChange('original')}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-left flex items-center justify-between ${
                      localMode === 'original'
                        ? 'bg-[#E8A15A] text-black font-semibold'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <span>💎 Original</span>
                    <span className="text-[10px] font-mono opacity-70">
                      {resolucionNativa === 'SD' ? '15 MB' : `${Math.round(pesoOriginalGB * 1024)} MB`}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleFullscreen}
              className="p-2 rounded-xl text-white hover:text-[#E8A15A] hover:bg-white/10 transition-colors"
              aria-label="Pantalla completa"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mensaje de Error en Video */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-6 text-center z-30">
          <AlertCircle className="w-10 h-10 text-[#C2502E] mb-2" />
          <p className="text-sm font-semibold">No se pudo cargar el video</p>
          <p className="text-xs text-[#9AA3A0] mt-1">
            Intenta cambiar a modo Ligero o verifica tu conexión.
          </p>
        </div>
      )}
    </div>
  );
};
