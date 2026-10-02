import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import { Settings, Play, Pause, Volume2, VolumeX, Maximize2, AlertCircle } from 'lucide-react';
import { useQuality, QualityMode } from '../context/QualityContext';
import { MEDIA_BASE, STREAM_BASE } from '../config';

interface SmartVideoProps {
  videoId: string; // nombre base, ej. 'video-popo-4k-noaa' o 'video-volcanes-avion'
  titulo?: string;
  resolucionNativa?: '4K' | '1080p';
  pesoOriginalGB?: number;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export const SmartVideo: React.FC<SmartVideoProps> = ({
  videoId,
  titulo = 'Video de expedición',
  resolucionNativa = '1080p',
  pesoOriginalGB = 0.25,
  className = '',
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
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
      activeResolution = '720p HD';
    } else if (localMode === 'alta') {
      videoSrc = `${MEDIA_BASE}/video/${videoId}-alta.mp4`;
      activeResolution = resolucionNativa === '4K' ? '1080p / 4K' : '1080p Full HD';
    } else {
      // Original
      videoSrc = `${MEDIA_BASE}/video/${videoId}-original.webm`;
      activeResolution = resolucionNativa === '4K' ? '4K Ultra HD (Original)' : '1080p (Original)';
    }
  }

  // Manejo de HLS.js o video HTML5 nativo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    const prevTime = currentTime;

    if (videoSrc.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (prevTime > 0) video.currentTime = prevTime;
          if (isPlaying) video.play().catch(() => {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', () => {
          if (prevTime > 0) video.currentTime = prevTime;
          if (isPlaying) video.play().catch(() => {});
        });
      }
    } else {
      video.src = videoSrc;
      video.load();
      video.currentTime = prevTime;
      if (isPlaying) {
        video.play().catch(() => setIsPlaying(false));
      }
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [videoSrc]);

  // Cambiar calidad conservando el segundo actual
  const handleQualityChange = (newMode: QualityMode) => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }

    if (newMode === 'original') {
      const pesoMB = Math.round(pesoOriginalGB * 1024);
      requestOriginalQuality(pesoMB, 'video', titulo, () => {
        setLocalMode('original');
        setShowSettings(false);
      });
    } else {
      setLocalMode(newMode);
      setShowSettings(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative group overflow-hidden rounded-2xl bg-black border border-white/10 ${className}`}
    >
      <video
        ref={videoRef}
        poster={posterUrl}
        playsInline
        muted={muted}
        loop={loop}
        autoPlay={autoPlay}
        onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />

      {/* Fallback amigable */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0E0F0F]/90 backdrop-blur-md z-10">
          <AlertCircle className="w-10 h-10 text-[#E8A15A] mb-3" />
          <h4 className="font-serif text-lg text-[#F2F1EC] font-semibold mb-1">Video en preparación</h4>
          <p className="text-xs text-[#9AA3A0] max-w-sm">
            En la versión de producción aquí se transmitirá el video 4K adaptativo mediante CDN.
          </p>
        </div>
      )}

      {/* Badge de Resolución Superior Izquierda */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold tracking-wider text-[#E8A15A] uppercase shadow-lg">
          {activeResolution}
        </span>
        {localMode === 'original' && (
          <span className="px-2 py-0.5 rounded-md bg-[#E8A15A] text-black text-[10px] font-mono font-bold">
            ORIGINAL
          </span>
        )}
      </div>

      {/* Menú de Calidad Flotante */}
      {showSettings && (
        <div className="absolute bottom-16 right-4 z-30 w-52 p-3 rounded-xl bg-[#1A1C1B]/95 border border-white/15 shadow-2xl backdrop-blur-xl animate-fade-in-up text-xs">
          <p className="text-[#9AA3A0] font-mono uppercase text-[10px] mb-2 px-1">Calidad de este video</p>
          <div className="space-y-1">
            <button
              onClick={() => handleQualityChange('ligero')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                localMode === 'ligero' ? 'bg-[#E8A15A] text-black font-semibold' : 'text-[#F2F1EC] hover:bg-white/10'
              }`}
            >
              <span>⚡ 720p Ligero</span>
              <span className="text-[10px] opacity-70">Ahorro</span>
            </button>
            <button
              onClick={() => handleQualityChange('alta')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                localMode === 'alta' ? 'bg-[#E8A15A] text-black font-semibold' : 'text-[#F2F1EC] hover:bg-white/10'
              }`}
            >
              <span>🎬 1080p Alta</span>
              <span className="text-[10px] opacity-70">Fluido</span>
            </button>
            <button
              onClick={() => handleQualityChange('original')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                localMode === 'original' ? 'bg-[#E8A15A] text-black font-semibold' : 'text-[#F2F1EC] hover:bg-white/10'
              }`}
            >
              <span>💎 4K Original</span>
              <span className="text-[10px] opacity-70">Ultra HD</span>
            </button>
          </div>
        </div>
      )}

      {/* Barra de Controles Inferior */}
      {controls && (
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between gap-3 opacity-90 group-hover:opacity-100 transition-opacity z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-white/10 hover:bg-[#E8A15A] hover:text-black text-white transition-colors"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings ? 'bg-[#E8A15A] text-black' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Ajustar calidad"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Pantalla completa"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
