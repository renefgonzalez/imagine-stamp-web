/**
 * Comprime una imagen en el navegador antes de subirla a Supabase.
 * Usa Canvas API (sin librerías externas).
 *
 * @param file - Archivo de imagen
 * @param maxWidth - Ancho máximo (default: 800px)
 * @param maxHeight - Alto máximo (default: 800px)
 * @param quality - Calidad JPEG (0-1, default: 0.7 = 70%)
 * @returns Promise<Blob> - Imagen comprimida
 */
export async function compressImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.7
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calcular nuevas dimensiones manteniendo aspecto
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto del canvas'));
          return;
        }

        // Dibujar imagen escalada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a Blob con compresión
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Error al comprimir imagen'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Error al cargar imagen'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Error al leer archivo'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Calcula el tamaño de archivo antes/después para mostrar al usuario.
 * @param originalFile - Archivo original
 * @param compressedBlob - Blob comprimido
 * @returns { originalSize: string, compressedSize: string, savings: string }
 */
export function getSizeComparison(
  originalFile: File,
  compressedBlob: Blob
): { originalSize: string; compressedSize: string; savings: string } {
  const originalSizeKB = (originalFile.size / 1024).toFixed(2);
  const compressedSizeKB = (compressedBlob.size / 1024).toFixed(2);
  const savingsPercent = (
    ((originalFile.size - compressedBlob.size) / originalFile.size) *
    100
  ).toFixed(0);

  return {
    originalSize: `${originalSizeKB} KB`,
    compressedSize: `${compressedSizeKB} KB`,
    savings: `${savingsPercent}% menos`
  };
}
