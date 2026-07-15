-- ============================================================================
-- DESACTIVAR RLS TEMPORALMENTE PARA COMPRESIÓN DE IMÁGENES
-- ============================================================================
-- Ejecuta esto en: Supabase Console → SQL Editor
--
-- ADVERTENCIA: Esto permitirá acceso público de lectura/escritura al bucket.
-- Después de comprimir, reactivarás RLS con el script final.
-- ============================================================================

-- 1. DESACTIVAR RLS EN EL BUCKET (para permitir actualizaciones)
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- 2. DESACTIVAR RLS EN LA TABLA DE OBJETOS
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- ✅ LISTO: Ahora puedes ejecutar el script de compresión sin errores RLS
-- Después de comprimir, ejecuta el script: reactivate-rls.sql
