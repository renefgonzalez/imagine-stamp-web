# 📘 Guía: Pago con Tarjeta (Mercado Pago) + Datos Bancarios

Resumen reproducible de cómo integramos **pago con tarjeta vía Mercado Pago** y
**datos bancarios editables** en Imagine & Stamp. Sirve de plantilla para replicarlo
en el carrito de otro cliente.

---

## 0. Contexto de la arquitectura (importante)

- **Frontend:** React + Vite + Tailwind. **App de una sola página**, sin servidor propio.
- **Base de datos:** Supabase (se usa la `anon key` directamente desde el navegador).
- **Backend para pagos:** **Supabase Edge Functions** (Deno). Es el "servidor" donde
  vive el token secreto de Mercado Pago.
- **Ruteo:** `HashRouter` (las rutas usan `#`, ej. `/#/admin`).
- **Despliegue:** `git push` a `main` → **GitHub Actions** compila (`npm run build`) y
  publica la carpeta `dist/` en la rama `gh-pages` → sitio en vivo.

> 🔑 Regla de oro: el **Access Token** de Mercado Pago **NUNCA** va en el frontend.
> Va como *secret* en Supabase y solo lo lee la Edge Function.

---

## 1. Mercado Pago — cuenta y credenciales

1. Cuenta de vendedor en Mercado Pago (MX).
2. Panel de desarrolladores → **Crear aplicación** → producto **Checkout Pro / Pagos online**.
3. Credenciales (hay de **prueba** `TEST-...` y de **producción** `APP_USR-...`):
   - **Public Key** → pública (no se usa en el flujo de redirección; sí en Bricks).
   - **Access Token** → 🔒 SECRETO. Solo en el backend.

Para pasar a **producción**: activar la cuenta (datos fiscales + CLABE para retiros) y
cambiar el valor del secret de `TEST-...` a `APP_USR-...`. **Nada de código cambia.**

---

## 2. Supabase — configuración

### 2.1 Secret con el token
- Dashboard → **Edge Functions → Secrets** (o Project Settings → Edge Functions).
- Add new secret: **Name** `MP_ACCESS_TOKEN`, **Value** = token de Mercado Pago.

### 2.2 Edge Function `create-preference`
- Dashboard → **Edge Functions → Deploy a new function → Via Editor** (sin CLI ni Docker).
- Nombre exacto: `create-preference`.
- Código: ver `supabase/functions/create-preference/index.ts`.
- Qué hace: recibe `{ items, orderId, siteUrl }`, crea una *preference* en
  `POST https://api.mercadopago.com/checkout/preferences` con el `Bearer MP_ACCESS_TOKEN`,
  y devuelve `init_point` (URL de pago).
- Puntos clave del código:
  - **CORS:** responder a `OPTIONS` y mandar `Access-Control-Allow-*` en toda respuesta.
  - `external_reference = orderId` (para ligar el pago con el pedido).
  - `back_urls` → `https://SITIO/?pago=exito | error | pendiente`.
  - `auto_return: "approved"` **solo si NO es localhost** (MP lo rechaza en local).
  - Devolver `init_point` y `sandbox_init_point`.

### 2.3 Tabla `settings` (datos bancarios) — opcional pero útil
- Ejecutar el SQL de `supabase-settings.sql` en **SQL Editor** (crea tabla `settings`
  con fila `id='bank'` + RLS permisivo para select/insert/update con anon key).

---

## 3. Frontend — cambios en `src/App.tsx`

### Estado
```ts
const [mpLoading, setMpLoading] = useState(false);
const [bankInfo, setBankInfo] = useState<any>(null);      // datos bancarios
const [copiedField, setCopiedField] = useState<string|null>(null);
```

### Cargar datos bancarios (en el useEffect de carga inicial)
```ts
supabase.from('settings').select('*').eq('id','bank').maybeSingle()
// → setBankInfo(data)
```

### Pago con tarjeta — `handleMercadoPagoCheckout`
1. Crear `orderId = 'ORD-' + Date.now()`.
2. `insert` del pedido en `orders` con `status: 'pending'`.
3. `supabase.functions.invoke('create-preference', { body: { orderId, items, siteUrl: window.location.origin }})`.
   - `functions.invoke` ya manda la anon key como Authorization → pasa el verify_jwt.
4. `window.location.href = data.init_point` (redirige a Mercado Pago).

### Regreso del pago (useEffect al cargar la página)
- Leer `new URLSearchParams(window.location.search)`.
- Si `pago=exito` y `status=approved` → actualizar `orders.payment_reference = MP-<payment_id>`
  para el `external_reference`, mostrar toast "✅ Pago aprobado".
- Limpiar la URL con `window.history.replaceState`.

### Botón condicional (paso "Datos de Entrega")
```tsx
customerInfo.paymentMethod === 'Tarjeta'
  ? <button onClick={handleMercadoPagoCheckout}>Pagar con Tarjeta</button>   // azul #009EE3
  : <button onClick={handleFinalCheckout}>Finalizar Pedido vía WhatsApp</button> // verde
```

### Recuadros informativos (AnimatePresence)
- Si `paymentMethod === 'Transferencia'` → recuadro con datos de `bankInfo` + botón copiar.
- Si `paymentMethod === 'Tarjeta'` → aviso "te llevaremos a Mercado Pago".

---

## 4. Panel admin — `src/AdminPanel.tsx` (datos bancarios editables)

- Nueva pestaña **"Ajustes"** (`activeTab === 'settings'`).
- `loadSettings()` → lee fila `id='bank'`; `saveBankSettings()` → `upsert` con `onConflict:'id'`.
- Formulario: Banco, Titular, CLABE, No. Cuenta, No. Tarjeta, Instrucciones.

---

## 5. Pruebas (sandbox)

- Con token `TEST-...`, MP abre el checkout en modo prueba.
- Pagar como invitado con **tarjeta de prueba** (verificar las vigentes en el panel MP):
  - Mastercard `5031 7557 3453 0604`, CVV `123`, vto `11/30`.
  - Visa `4509 9535 6623 3704`, CVV `123`, vto `11/30`.
- El **nombre del titular** decide el resultado: `APRO` = aprobado, `OTHE` = rechazado.

---

## 6. Despliegue

```bash
git add -A
git commit -m "..."
git push origin main      # ← dispara GitHub Actions → publica en gh-pages
```
- Ver progreso en la pestaña **Actions** del repo. Palomita verde = en vivo.
- Recargar el sitio con **Ctrl + Shift + R** (evita caché del navegador).

---

## 7. Pendiente / mejoras

- [ ] **Webhook `mp-webhook`** (Edge Function con `verify_jwt = false`) para que MP confirme
      el pago **aunque el cliente cierre la pestaña**. Necesita:
      - registrar `notification_url` en la preference o en el panel MP,
      - usar la `service_role key` dentro de la función para actualizar `orders`.
- [ ] Pasar token de `TEST-...` a producción `APP_USR-...` (solo cambiar el secret).
- [ ] (Opcional) Checkout Bricks para que el formulario de tarjeta viva dentro del sitio.

---

## Checklist rápido para replicar en otro cliente

1. [ ] Cuenta MP + credenciales del cliente.
2. [ ] Secret `MP_ACCESS_TOKEN` en su Supabase.
3. [ ] Desplegar Edge Function `create-preference` (copiar el archivo).
4. [ ] (Si aplica) SQL de tabla `settings` para datos bancarios.
5. [ ] Copiar la lógica de `handleMercadoPagoCheckout` + useEffect de regreso + botón condicional.
6. [ ] Ajustar `back_urls` al dominio del cliente (o usar `window.location.origin`).
7. [ ] Probar en sandbox con tarjetas de prueba.
8. [ ] Desplegar.
