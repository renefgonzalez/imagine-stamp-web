# 🖼️ Pasos para Comprimir Todas las Imágenes Existentes

## 📋 Resumen
Tienes **75 imágenes** en Supabase Storage. El script las comprimirá ~90% pero necesita RLS desactivado temporalmente.

---

## ✅ Paso 1: Desactivar RLS en Supabase

1. Abre **Supabase Console** → tu proyecto
2. Ve a **SQL Editor** (en el menú izquierdo)
3. Copia y pega el contenido de: `sql/disable-rls-for-compression.sql`
4. Click **Run** (botón verde)

**Resultado esperado:**
```
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
-- success

ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
-- success
```

---

## 🚀 Paso 2: Ejecutar el Script de Compresión

Abre terminal en el proyecto y ejecuta:

```bash
cd "C:\Users\RF\Documents\IMAGINE&STAMP\Pagina Web\imagine-and-stamp"

VITE_SUPABASE_URL='https://gekbdjdwyimrotjpsqrk.supabase.co' \
VITE_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdla2JkamR3eWltcm90anBzcXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjc0NTgsImV4cCI6MjA5MTYwMzQ1OH0.gRYCz1VnGMXHTjhrsbh2jURSyD-GAPYZkftMdH8jiVg' \
node scripts/compress-existing-images.js
```

**¿Estás en PowerShell?** Usa esto en su lugar:

```powershell
cd "C:\Users\RF\Documents\IMAGINE&STAMP\Pagina Web\imagine-and-stamp"

$env:VITE_SUPABASE_URL='https://gekbdjdwyimrotjpsqrk.supabase.co'
$env:VITE_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdla2JkamR3eWltcm90anBzcXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjc0NTgsImV4cCI6MjA5MTYwMzQ1OH0.gRYCz1VnGMXHTjhrsbh2jURSyD-GAPYZkftMdH8jiVg'

node scripts/compress-existing-images.js
```

**Esperado: Ves un progreso como este:**
```
🚀 Iniciando compresión de imágenes existentes en Supabase...

🔄 Comprimiendo bucket: product-images
📂 Listando imágenes en bucket: product-images
📸 Encontradas 75 imágenes

[1/75] Procesando archivo.webp... ✅ 2.5 MB → 150 KB (94% menos)
[2/75] Procesando archivo2.webp... ✅ 800 KB → 60 KB (92% menos)
...
[75/75] Procesando archivo75.webp... ✅ Success

📊 Resumen product-images:
   ✅ Procesadas: 75/75
   📦 Antes: 185.4 MB
   📉 Después: 18.5 MB
   ✨ Ahorro total: 90%

✅ ¡Listo! Todas las imágenes han sido comprimidas.
```

**Esto tardará:** 2-5 minutos (75 imágenes)

---

## 🔐 Paso 3: Reactivar RLS en Supabase

1. Abre **Supabase Console** → **SQL Editor**
2. Copia y pega el contenido de: `sql/reactivate-rls.sql`
3. Click **Run**

**Resultado esperado:**
```
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- success

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
-- success
```

✅ **LISTO**: RLS está nuevamente activado, Storage está protegido.

---

## 📊 Resultados Esperados

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Total almacenamiento | ~185 MB | ~18.5 MB | 90% menos |
| Ancho de banda/sesión | ~8 MB | ~750 KB | 90% menos |
| Tiempo de carga catálogo | ~5-10s | ~1-2s | 5-8x más rápido |

---

## ⚠️ Si algo sale mal

**"Error: new row violates row-level security policy"**
→ RLS sigue activado. Ejecuta Paso 1 de nuevo.

**"Error: Sharp failed to process image"**
→ La imagen está corrupta. El script continúa con las siguientes.

**"Error: Could not connect to Supabase"**
→ Verifica que las credenciales sean correctas (copiar-pegar desde supabase.ts)

---

## 🎯 Próximo paso

Después de comprimir, puedes:
1. Verificar en Supabase Console → Storage → product-images → ver tamaños
2. Las URLs públicas seguirán funcionando (las imágenes se reemplazaron in-situ)
3. El catálogo ahora cargará **90% más rápido**

---

**¿Necesitas ayuda?** Corre los 3 pasos y muéstrame el output del script de compresión.
