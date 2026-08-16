-- ═══════════════════════════════════════════════════════════════
--  CONFIGURACIÓN PARA EL WEBHOOK DE MERCADO PAGO (mp-webhook)
--  Ejecutar en Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1) GRANT a service_role sobre la tabla de pedidos.
--    service_role bypassa RLS, pero AÚN necesita el GRANT a nivel
--    de tabla. Sin esto, la Edge Function no puede actualizar orders
--    aunque tenga la service_role key.
GRANT ALL ON TABLE public.orders TO service_role;

-- ═══════════════════════════════════════════════════════════════
--  INSTRUCCIONES DE DESPLIEGUE (no SQL, leer y hacer en el Dashboard)
-- ═══════════════════════════════════════════════════════════════

-- A) Desplegar la Edge Function "mp-webhook":
--    Dashboard → Edge Functions → Deploy a new function → Via Editor.
--    Nombre exacto: mp-webhook
--    Contenido: el archivo supabase/functions/mp-webhook/index.ts
--    IMPORTANTE: verificar que quede con "Verify JWT" DESACTIVADO
--    (verify_jwt = false), porque Mercado Pago no envía JWT de Supabase.

-- B) Secrets necesarios (Dashboard → Edge Functions → Secrets):
--    - MP_ACCESS_TOKEN            (ya existente para create-preference)
--    - SUPABASE_URL               (la inyecta Supabase automáticamente)
--    - SUPABASE_SERVICE_ROLE_KEY  (la inyecta Supabase automáticamente)
--    - MP_WEBHOOK_URL             = https://<project-ref>.supabase.co/functions/v1/mp-webhook

-- C) Configurar notification_url:
--    Opción 1 (recomendada): agregar el secret MP_WEBHOOK_URL (paso B);
--      create-preference lo lee y lo manda en cada preference.
--    Opción 2: en el panel de Mercado Pago → tu aplicación → Webhooks,
--      pegar la misma URL de MP_WEBHOOK_URL.

-- D) Verificar (recomendado):
--    Enviar un POST de prueba al webhook:
--      curl -X POST https://<project-ref>.supabase.co/functions/v1/mp-webhook \
--        -H "Content-Type: application/json" \
--        -d '{"type":"payment","data":{"id":"UN_ID_DE_PAGO_REAL"}}'
--    Si responde { "ok": true, ... } está funcionando.

-- Nota: si el webhook responde 500, Mercado Pago reintentará la
-- notificación automáticamente en intervalos crecientes.
