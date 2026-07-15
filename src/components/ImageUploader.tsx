import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader } from 'lucide-react';
import { compressImage, getSizeComparison } from '../lib/imageCompression';

interface ImageUploaderProps {
  onImageSelect: (compressedBlob: Blob, compressedUrl: string) => void;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  label?: string;
  className?: string;
}

export function ImageUploader({
  onImageSelect,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7,
  label = 'Selecciona una imagen',
  className = ''
}: ImageUploaderProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [sizeInfo, setSizeInfo] = useState<{
    originalSize: string;
    compressedSize: string;
    savings: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      // Mostrar preview original
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Comprimir
      const compressedBlob = await compressImage(file, maxWidth, maxHeight, quality);
      const compressedUrl = URL.createObjectURL(compressedBlob);

      // Mostrar tamaños
      const sizes = getSizeComparison(file, compressedBlob);
      setSizeInfo(sizes);

      // Pasar blob comprimido al componente padre
      onImageSelect(compressedBlob, compressedUrl);
    } catch (error) {
      console.error('Error comprimiendo imagen:', error);
      alert('Error al comprimir la imagen. Intenta con otra.');
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isCompressing}
        className="w-full flex flex-col items-center gap-3 p-6 border-2 border-dashed border-primary/20 hover:border-primary/40 rounded-2xl bg-primary/2 hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCompressing ? (
          <>
            <Loader size={32} className="text-primary animate-spin" />
            <span className="text-sm font-bold text-primary/60">Comprimiendo...</span>
          </>
        ) : (
          <>
            <Upload size={32} className="text-primary/60" />
            <div className="text-left">
              <p className="text-sm font-bold text-primary">{label}</p>
              <p className="text-[10px] text-primary/40">PNG, JPG, WEBP (máx 10 MB)</p>
            </div>
          </>
        )}
      </button>

      {preview && sizeInfo && (
        <div className="mt-4 space-y-3">
          <div className="bg-primary/5 rounded-2xl p-3">
            <img src={preview} alt="Preview" className="w-full h-auto rounded-lg max-h-48 object-contain" />
          </div>
          <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-3 space-y-1">
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Compresión aplicada</p>
            <div className="text-xs text-primary/60 space-y-0.5">
              <p>📦 Original: <span className="font-bold">{sizeInfo.originalSize}</span></p>
              <p>📉 Comprimida: <span className="font-bold text-secondary">{sizeInfo.compressedSize}</span></p>
              <p>✨ Ahorro: <span className="font-bold text-green-600">{sizeInfo.savings}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
