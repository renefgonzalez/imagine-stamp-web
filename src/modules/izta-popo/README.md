# Izta-Popo · Expediciones — Demo Web para Presentación a Cliente

> **Módulo Oficial de Demostración** desarrollado para la plataforma de **Imagine & Stamp** (`src/modules/izta-popo`).
>
> Prototipo cinematográfico de alta montaña con relieve 3D real, visor Deep Zoom para fotos de ultra alta resolución (40–50 MP), reproductor de video adaptativo con soporte HLS/Bunny Stream, y perfil biológico interactivo.

---

## 🚀 Cómo correr el proyecto localmente

1. En la raíz del proyecto principal (`imagine-and-stamp/`):
   ```bash
   npm install
   npm run dev
   ```
2. Abre en tu navegador:
   `http://localhost:3000/#/izta-popo`

---

## 🗺️ Rutas del Módulo

- **Inicio:** `/#/izta-popo` (Hero full screen con video, estadísticas animadas, categorías, lugar destacado de Ayoloco y vista previa 3D).
- **Explorar 3D:** `/#/izta-popo/explorar` (Mapa 3D interactivo con MapLibre GL, relieve DEM Terrarium de AWS, pines pulsantes, zonas protegidas INAH, radio de exclusión Popocatépetl 12 km y vuelos de cámara suaves).
- **Ficha de Lugar:** `/#/izta-popo/lugar/:id` (Ficha técnica de altitud, relato en primera persona del guía, galería Deep Zoom, video 4K y lugares cercanos calculados por distancia Haversine).
- **Flora por Altitud:** `/#/izta-popo/flora` (Perfil altitudinal interactivo en SVG propio de 2,500m a 5,400m con scrollytelling sincronizado y tarjetas 3D con efecto flip).
- **Bitácora:** `/#/izta-popo/bitacora` (Línea de tiempo vertical de expediciones reales con telemetría y galerías).
- **Recorre Conmigo:** `/#/izta-popo/recorre-conmigo` (Perfil del guía, 3 programas de ascenso y botón directo de WhatsApp).
- **Cómo Funciona:** `/#/izta-popo/como-funciona` (Demo interactivo de lectura GPS con `exifr` en el navegador, explicación de los 3 modos de calidad, Deep Zoom y mockup del panel administrativo).
- **Créditos:** `/#/izta-popo/creditos` (Tabla completa de atribución de autoría y licencias libres Wikimedia Commons).

---

## 📸 Cómo incorporar fotos y videos reales del cliente

1. Coloca las fotos en `material-cliente/fotos/` (acepta `.jpg`, `.png`, `.tif`, `.dng`).
2. Coloca los videos en `material-cliente/videos/` (acepta `.mp4`, `.mov`, `.webm`).
3. Ejecuta el procesador de medios:
   ```bash
   node scripts/preparar-medios-izta.mjs
   ```
   *El script generará automáticamente los formatos WebP optimizados (480px, 1280px, 2560px), los mosaicos Deep Zoom (`.dzi` y `_files/`) y las transcodificaciones de video con FFmpeg.*

---

## 📱 Cómo cambiar el número de WhatsApp y datos del guía

Edita el archivo `src/modules/izta-popo/config.ts`:
```typescript
export const GUIDE_NAME = "Nombre del Guía";
export const GUIDE_ROLE = "Guía de Alta Montaña & Explorador";
export const WHATSAPP_PHONE = "525500000000"; // Tu número a 10 dígitos con lada internacional
```

---

## ☁️ Transición a Producción con CDN y Bunny Stream

En `src/modules/izta-popo/config.ts`:
```typescript
// En producción, cambia las rutas locales a tu CDN:
export const MEDIA_BASE = "https://tu-zona.b-cdn.net";
export const STREAM_BASE = "https://video.bunnycdn.com/play/TU_LIBRERIA";
```
El componente `<SmartVideo>` detectará automáticamente las transmisiones HLS `.m3u8` y gestionará la calidad adaptativa sin necesidad de tocar una sola línea de código.
