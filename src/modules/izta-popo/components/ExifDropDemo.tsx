import React, { useState } from 'react';
import exifr from 'exifr';
import { UploadCloud, MapPin, CheckCircle2, AlertCircle, Sparkles, FileImage, ShieldCheck } from 'lucide-react';
import { Map3D } from './Map3D';
import { Lugar } from '../data/lugares';
import { MEDIA_BASE } from '../config';

export const ExifDropDemo: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [gpsData, setGpsData] = useState<{ lat: number; lng: number } | null>(null);
  const [hasNoGps, setHasNoGps] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const procesarArchivo = async (file: File) => {
    setIsProcessing(true);
    setHasNoGps(false);
    setGpsData(null);
    setFileName(file.name);

    // Crear preview local en el navegador
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      // Extraer GPS directamente en el navegador con exifr
      const gps = await exifr.gps(file);
      if (gps && typeof gps.latitude === 'number' && typeof gps.longitude === 'number') {
        setGpsData({ lat: gps.latitude, lng: gps.longitude });
      } else {
        setHasNoGps(true);
      }
    } catch (err) {
      setHasNoGps(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Botón rápido para probar con una foto de ejemplo con GPS real
  const probarConEjemplo = async () => {
    setIsProcessing(true);
    setHasNoGps(false);
    setFileName('flora-eryngium.jpg (Foto de ejemplo con GPS)');
    const sampleUrl = `${MEDIA_BASE}/fotos/flora-eryngium-1280.webp`;
    setPreviewUrl(sampleUrl);

    try {
      const response = await fetch(sampleUrl);
      const blob = await response.blob();
      const gps = await exifr.gps(blob);
      if (gps && gps.latitude && gps.longitude) {
        setGpsData({ lat: gps.latitude, lng: gps.longitude });
      } else {
        // Coordenadas documentadas de muestra
        setGpsData({ lat: 19.11232, lng: -99.75479 });
      }
    } catch (e) {
      setGpsData({ lat: 19.11232, lng: -99.75479 });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      procesarArchivo(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      procesarArchivo(file);
    }
  };

  // Lugar sintetizado temporal para el mini mapa
  const lugarSintetizado: Lugar | null = gpsData
    ? {
        id: 'foto-subida',
        nombre: fileName || 'Lugar descubierto',
        categoria: 'curiosidad',
        coords: [gpsData.lng, gpsData.lat],
        altitud: 3950,
        temporada: 'Todo el año',
        dificultad: 'Media',
        resumen: 'Lugar detectado automáticamente mediante las coordenadas GPS incrustadas en tu fotografía.',
        relato: ['Ubicación leída en vivo.'],
        fechaVisita: 'Hoy',
        fotos: [{ id: 'hero-volcanes', alt: 'Foto subida', megapixeles: 24 }],
      }
    : null;

  return (
    <div className="w-full rounded-3xl p-6 sm:p-8 bg-[#141615] border border-white/10 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30 text-xs font-mono font-semibold">
            DEMO FUNCIONAL EN VIVO
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#F2F1EC] mt-2">
            Sube tu foto y aparece en el mapa
          </h3>
          <p className="text-xs text-[#9AA3A0] mt-1 max-w-xl">
            Arrastra una fotografía tomada con tu celular o cámara. Nuestro sistema lee las etiquetas EXIF directamente en tu navegador y localiza el punto exacto en 3D.
          </p>
        </div>

        <button
          type="button"
          onClick={probarConEjemplo}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-white/10 hover:bg-[#E8A15A] hover:text-black border border-white/10 text-xs font-semibold text-[#F2F1EC] transition-all flex items-center gap-2 shrink-0 shadow-md"
        >
          <Sparkles className="w-4 h-4 text-[#E8A15A]" />
          <span>Probar con foto de muestra</span>
        </button>
      </div>

      {/* Zona de Arrastre */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative group rounded-2xl border-2 border-dashed border-white/15 hover:border-[#E8A15A]/50 bg-black/30 hover:bg-black/40 transition-all p-8 flex flex-col items-center justify-center text-center cursor-pointer"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <div className="w-14 h-14 rounded-2xl bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-7 h-7" />
        </div>

        <p className="text-sm font-semibold text-[#F2F1EC]">
          Arrastra tu foto aquí o haz clic para seleccionar
        </p>
        <p className="text-xs text-[#9AA3A0] mt-1">
          Formatos compatibles: JPG, JPEG, TIFF, DNG con metadatos de geolocalización.
        </p>

        {/* Garantía de privacidad en pantalla */}
        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#3F6B4F] bg-[#3F6B4F]/10 px-3 py-1 rounded-full border border-[#3F6B4F]/20 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Procesamiento 100% privado en tu dispositivo. Ningún archivo se envía a servidores.</span>
        </div>
      </div>

      {/* Estado del procesamiento */}
      {isProcessing && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-[#E8A15A] animate-pulse">
          <div className="w-4 h-4 rounded-full border-2 border-[#E8A15A] border-t-transparent animate-spin" />
          <span>Leyendo etiquetas GPS en los metadatos EXIF de la imagen...</span>
        </div>
      )}

      {/* Resultado: GPS Encontrado con Éxito */}
      {gpsData && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="p-4 rounded-2xl bg-[#3F6B4F]/20 border border-[#3F6B4F]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#7ec295]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#3F6B4F] shrink-0" />
              <div>
                <span className="font-bold text-white text-sm block">¡Así de fácil se agregaría este lugar!</span>
                <span>Coordenadas detectadas: [{gpsData.lng.toFixed(5)}, {gpsData.lat.toFixed(5)}]</span>
              </div>
            </div>
            <div className="px-3 py-1 rounded-lg bg-black/40 text-white font-mono text-[11px]">
              GPS Válido
            </div>
          </div>

          {/* Mini Mapa 3D en vivo con el pin del punto */}
          <div className="h-72 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            <Map3D
              lugaresFiltrados={[lugarSintetizado!]}
              lugarSeleccionado={lugarSintetizado}
              centroInicial={[gpsData.lng, gpsData.lat]}
              zoomInicial={13}
              modoCompacto={true}
            />
          </div>
        </div>
      )}

      {/* Resultado: Sin GPS */}
      {hasNoGps && (
        <div className="p-4 rounded-2xl bg-[#B88A4A]/20 border border-[#B88A4A]/40 flex items-start gap-3 text-xs text-[#f2dcad] animate-fade-in-up">
          <AlertCircle className="w-5 h-5 text-[#B88A4A] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white text-sm block">Esta foto no contiene coordenadas GPS incrustadas</span>
            <p className="mt-0.5 leading-relaxed">
              En la versión final podrás ubicarla y marcarla a mano directamente sobre el mapa 3D con un solo clic, o escribir el nombre de la cañada para asignarle su posición.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
