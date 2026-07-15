-- ============================================================================
-- REACTIVAR RLS DESPUÉS DE COMPRESIÓN DE IMÁGENES
-- ============================================================================
-- Ejecuta esto en: Supabase Console → SQL Editor
-- DESPUÉS de que el script compress-existing-images.js termine
-- ============================================================================

-- 1. REACTIVAR RLS EN LA TABLA DE OBJETOS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. REACTIVAR RLS EN EL BUCKET
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- ✅ HECHO: RLS está activo nuevamente, Storage volvió a estar protegido
