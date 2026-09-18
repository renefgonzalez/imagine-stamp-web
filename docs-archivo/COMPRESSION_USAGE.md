# 📦 Guía de Compresión de Imágenes — Implementación

## ✅ Archivos Creados

1. **`src/lib/imageCompression.ts`** — Helper de compresión Canvas
2. **`src/components/ImageUploader.tsx`** — Componente UI reutilizable
3. **`src/COMPRESSION_USAGE.md`** — Este archivo

---

## 🚀 Cómo Usar en AdminPanel

### Paso 1: Importar el componente

```tsx
import { ImageUploader } from './components/ImageUploader';
import { compressImage } from './lib/imageCompression';
import { supabase } from './lib/supabase';
```

### Paso 2: Agregar estado para la imagen comprimida

```tsx
const [compressedImageBlob, setCompressedImageBlob] = useState<Blob | null>(null);
const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
```

### Paso 3: Usar el componente ImageUploader en el formulario

```tsx
// En la sección "Nuevo" producto:
<ImageUploader
  label="Sube una foto de producto"
  maxWidth={800}
  maxHeight={800}
  quality={0.7}
  onImageSelect={(blob, url) => {
    setCompressedImageBlob(blob);
    setImagePreviewUrl(url);
  }}
/>
```

### Paso 4: Al guardar producto, subir la imagen comprimida a Supabase

```tsx
const handleAddProduct = async () => {
  if (!compressedImageBlob) {
    alert('Selecciona una imagen');
    return;
  }

  // 1. Subir la imagen comprimida a Storage
  const fileName = `products/${Date.now()}_${newProduct.name}.jpg`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, compressedImageBlob, {
      contentType: 'image/jpeg',
      upsert: false
    });

  if (uploadError) {
    alert('Error al subir imagen: ' + uploadError.message);
    return;
  }

  // 2. Obtener URL pública
  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(uploadData.path);

  // 3. Guardar producto con URL de imagen
  const { error } = await supabase.from('products').insert([
    {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      category: newProduct.category,
      image: urlData.publicUrl // ← URL de la imagen comprimida
    }
  ]);

  if (!error) {
    alert('✅ Producto agregado (imagen comprimida)');
    // Limpiar formulario
    setCompressedImageBlob(null);
    setImagePreviewUrl(null);
  }
};
```

---

## 📊 Resultados Esperados

| Tipo de Imagen | Tamaño Original | Comprimido | Ahorro |
|---|---|---|---|
| Foto DSLR (5MP) | 2.5 MB | 150-200 KB | **92-94%** |
| Captura de pantalla (4K) | 1.8 MB | 120-150 KB | **91-93%** |
| Diseño Canva (1080x1080) | 800 KB | 60-80 KB | **90-92%** |

**Con 300 productos:**
- **Antes:** 300 × 800 KB = **240 MB de almacenamiento**
- **Después:** 300 × 75 KB = **22.5 MB de almacenamiento**
- **Ahorro:** 90%+ menos ancho de banda

---

## ⚙️ Parámetros Ajustables

```tsx
<ImageUploader
  maxWidth={800}      // Ancho máximo (default: 800)
  maxHeight={800}     // Alto máximo (default: 800)
  quality={0.7}       // Calidad JPEG 0-1 (0.7 = 70%, recomendado para web)
  label="Tu texto aquí"
/>
```

### Recomendaciones por caso de uso:

- **Catálogo de productos:** `quality={0.7}` — buen balance entre tamaño y claridad
- **Galerías de alta calidad:** `quality={0.85}` — más detalle, archivo más grande
- **Thumbnails/previews:** `quality={0.6}` — muy comprimido, suficiente para miniaturas

---

## 🔗 Buckets de Supabase Necesarios

Antes de subir imágenes, crear bucket en **Supabase Console → Storage:**

```sql
-- Bucket público para imágenes de productos
CREATE BUCKET product-images;

-- Permisos (RLS):
-- INSERT: usuarios autenticados
-- SELECT: público (todos pueden ver)
-- UPDATE/DELETE: admin only
```

O usar la SQL directamente:

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
```

---

## ✨ Beneficios en Supabase

✅ **Plan Gratuito (5 GB ancho de banda/mes):**
- Sin compresión: ~6-7 productos (240 MB)
- Con compresión: ~65-70 productos (22.5 MB)
- **Mejora:** 10x más catálogo en el mismo plan

✅ **Plan Pro ($25/mes, 200 GB ancho de banda):**
- Puede manejar catálogos de **10,000+ productos** sin problema

---

## 🐛 Troubleshooting

**"Error al comprimir imagen"**
→ Verifica que el archivo sea una imagen válida (PNG, JPG, WEBP)

**"La imagen se ve pixelada"**
→ Aumenta `quality` a `0.8` o `0.85`

**"Subabase dice espacio insuficiente"**
→ Comprueba que el bucket exista y tenga permisos de escritura

---

## 📝 Integración Rápida (Copy-Paste)

Si quieres solo la compresión sin cambiar AdminPanel:

```tsx
// En cualquier lugar donde recibas un File:
const compressedBlob = await compressImage(userFile);
const url = URL.createObjectURL(compressedBlob);
// Ahora `url` es la imagen comprimida lista para subir
```

---

**Last Updated:** Julio 2026
**Estándar:** Guía Completa Imagine & Stamp — Sección 14 ✅
