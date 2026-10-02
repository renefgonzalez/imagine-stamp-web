# Correcciones para Antigravity: video de presentación del cliente + ajustes

> **Agente:** trabaja SOLO dentro de `src/modules/izta-popo/` y `public/izta-popo/media/`.
> Al cliente **le gustó el diseño actual: NO lo rediseñes.** Aplica solo lo que se pide aquí.
> **La sección E (cambio de enfoque) tiene prioridad sobre cualquier otra instrucción.**
> Si todavía no aplicaste `INSTRUCCION-CONOCIMIENTO-MONTANA.md`, aplícalo primero: este archivo lo complementa.
> Al terminar, verifica en el navegador (escritorio y móvil) cada punto y confirma que el build no tiene errores.

---

## A. Video de presentación del cliente

### Qué es
Es el video **"Conocimiento de la Montaña — por Ricardo Pérez Romero"**, grabado por el propio cliente. Dura **1:27**, tiene música y mide **1024×576** (resolución estándar, no HD).
- 0:00–0:09: el Iztaccíhuatl con el título "Conocimiento de la Montaña".
- 0:09–0:18: créditos ("Por: Ricardo Pérez Romero").
- 0:18–1:24: sección **FAUNA** con tomas propias: lagartijas, víbora, coyote, luna, búhos, lechuza, colibríes, aves y caracol.
- 1:24–1:27: silencio final.

### Archivos ya preparados (no recomprimir)
En `public/izta-popo/media/video/`:
| Archivo | Uso |
|---|---|
| `presentacion-alta.mp4` (14 MB, 576p) | Reproducción normal |
| `presentacion-ligero.mp4` (7 MB, 480p) | Modo Ligero |
| `presentacion-original.mp4` (15 MB) | Modo Original (archivo tal cual lo envió el cliente) |
| `presentacion-poster.webp` | Póster: Iztaccíhuatl con el título |
| `presentacion-teaser.mp4` (10 s, sin audio) | Clip de colibríes y aves para fondos pequeños en loop |

### Dónde va (en este orden de importancia)

**1. Inicio, sección de misión (la que va justo después del hero):**
- A un lado del texto de misión, un **marco de video** de proporción 16:9 y tamaño mediano (máximo unos 640 px de ancho en escritorio, ancho completo en móvil), con el mismo radio y borde que las tarjetas del sitio.
- Dentro del marco, el `presentacion-teaser.mp4` en loop, sin sonido, `playsInline`. Con `prefers-reduced-motion`, mostrar solo el póster.
- Encima, un botón circular grande de ▶ y el texto **"Ver la presentación · 1:27"**.
- Al hacer clic se abre el **reproductor cinematográfico** (punto 3).

**2. Página `/conocimiento`:** entre la apertura a pantalla completa y el texto del manifiesto, una sección **"Mira la presentación"** con el video embebido a ancho de columna amplio (máximo unos 960 px): póster, play al hacer clic y **con sonido**. Debajo, la línea pequeña "Video: Ricardo Pérez Romero · Conocimiento de la Montaña".

**3. Reproductor cinematográfico (componente nuevo `PresentationModal.tsx`):**
- Overlay a pantalla completa con fondo casi negro (`--roca` al 95%). El video centrado a un máximo de 1100 px de ancho y botón de cerrar arriba a la derecha.
- Arranca **con sonido**: lo inicia el usuario con un clic, así que el navegador lo permite.
- Se cierra con Esc, con un clic fuera del video o con el botón. Al cerrar, pausa el video y devuelve el foco al botón que lo abrió.
- Bloquea el scroll del fondo mientras está abierto. Accesible con `role="dialog"`, `aria-modal` y el foco atrapado dentro.
- Abre con un fade y una escala de 0.96 a 1, 250 ms, con una curva ease-out suave.
- Usa `SmartVideo` para respetar el **Modo de vista**: Ligero → `presentacion-ligero.mp4`; Alta calidad → `presentacion-alta.mp4`; Original → `presentacion-original.mp4`.
- **Etiqueta honesta:** este video es de resolución estándar. Muestra la etiqueta **"SD"**, nunca "4K" ni "HD". En modo Original no muestres el aviso de peso (pesa solo 15 MB).

**4. Categoría Fauna:** en el Inicio y en `/explorar?cat=fauna`, usa `presentacion-teaser.mp4` como imagen animada de la tarjeta o el chip de **Fauna**, en tamaño pequeño, para mostrar que el cliente tiene material propio.

### Lo que NO se debe hacer
- **No** usarlo como intro obligatoria que bloquee la entrada al sitio (pantalla de "splash"). Son 87 segundos y la gente se iría.
- **No** usarlo como fondo del hero a pantalla completa: a 576p se vería borroso en pantallas grandes y contradice la promesa de "alta calidad".
- **No** reproducirlo con sonido de forma automática.

---

## B. Datos reales del cliente

En `config.ts`:
```ts
export const CLIENT_NAME: string = "Conocimiento de la Montaña";
export const GUIDE_NAME: string = "Ricardo Pérez Romero";
export const CONTACT_EMAIL: string = "riezroo@yahoo.com.mx"; // confirmado por el cliente
```
- Muestra `GUIDE_NAME` en `/participa` y en el Footer, en lugar del nombre de ejemplo.
- En `/participa`, agrega el correo como segunda forma de contacto (`mailto:`), debajo del botón de WhatsApp.
- Muestra también el correo en el **Footer**, junto a las redes sociales, como enlace `mailto:` con un ícono de sobre de trazo fino.
- **El logo "IZTA·POPO / Expediciones" NO se cambia** hasta que el cliente lo confirme. Solo agrega, debajo del texto del Footer, "Un proyecto de Conocimiento de la Montaña".

---

## C. Correcciones vistas en el demo

1. **Hero con el ala del avión:** en el video de fondo del Inicio se ve el ala roja del avión abajo a la derecha. Regenera `public/izta-popo/media/video/hero-ligero.mp4` recortando la parte superior izquierda del cuadro, donde no aparece el ala:
   ```
   ffmpeg -y -i <video-volcanes-avion original> -t 15 -an -vf "crop=iw*0.72:ih*0.72:0:0,scale=1920:1080" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart public/izta-popo/media/video/hero-ligero.mp4
   ```
   Revisa varios fotogramas del resultado (segundos 0, 5, 10 y 14). Si el ala sigue apareciendo, elige un tramo distinto con `-ss` o recorta más. Si no se logra, usa como hero la foto `hero-volcanes` con un efecto Ken Burns lento.
2. **Foto equivocada en Nahualac:** muestra la iglesia del Sacromonte. Cámbiala por una foto de paisaje de montaña (por ejemplo `vista-noreste` o `la-joya`) con la etiqueta "Foto de referencia". Revisa que **ningún otro lugar** use una foto que no corresponda (la iglesia solo debe estar en `sacromonte`).
3. **Modo de vista inicial:** el demo arrancó en "Ligero". Deja **"Alta calidad"** como predeterminado. Solo cambia a Ligero si `navigator.connection.saveData === true` o si `effectiveType` es `"2g"` o `"slow-2g"` (no `"3g"`). Si el visitante ya eligió un modo antes (guardado en `localStorage`), respeta su elección.
4. **Etiqueta sobre el título del hero** ("EXPEDICIONES DOCUMENTADAS EN ALTA MONTAÑA"): elimínala. El título se sostiene solo y la página queda más limpia.
5. **Vista inicial del mapa 3D:** al abrir `/explorar`, la cámara debe mostrar **los dos volcanes de frente y cerca**, no una llanura desde lejos. Usa centro `[-98.64, 19.10]`, zoom ~11.2, pitch 68 y bearing ~-15. Ajusta hasta que las dos cumbres nevadas se vean claramente en escritorio y en móvil, y el botón "Vista general" regresa a esta misma toma.
6. **Créditos:** agrega a `/creditos` una sección "Material del cliente" con: *"Video de presentación: Ricardo Pérez Romero · Conocimiento de la Montaña. Todos los derechos reservados."*

---

## E. CAMBIO DE ENFOQUE (lo más importante): concientización, no turismo

El cliente aclaró el propósito del sitio con estas palabras:
> "Es una página para concientizar a la población en general. No tendrá visitas, salidas o exploraciones. Lo que sí tendrá será salidas de limpieza de parajes, reforestación, ayuda en incendios, cultura de naturaleza así como exposición de la problemática ambiental y acciones de mitigación."

Por lo tanto, **todo lo que suene a vender recorridos o tours se elimina o se reconvierte en voluntariado y conservación.** El diseño visual se conserva; cambian el contenido, los textos y algunas secciones.

### E1. Identidad
- Logo de texto: **"CONOCIMIENTO DE LA MONTAÑA"**, con el subtítulo pequeño **"Izta-Popo"** en lugar de "IZTA·POPO / Expediciones". Mismo estilo, color y tamaño de la marca actual. Si el nombre no cabe en móvil, usa dos líneas ("CONOCIMIENTO / DE LA MONTAÑA").
- Esto reemplaza lo dicho en la sección B sobre no cambiar el logo. Quita la palabra "Expediciones" de todo el sitio: logo, títulos, metadatos y textos.
- Título de pestaña general: "Conocimiento de la Montaña · Izta-Popo".

### E2. Hero del Inicio
- Titular: *"Las montañas que nos dieron todo hoy nos necesitan"*.
- Subtítulo: *"Ecosistemas, vestigios y la riqueza natural del Iztaccíhuatl y el Popocatépetl. Conocerlos es el primer paso para protegerlos."*
- Botones: **"Explorar el mapa 3D"** (primario) y **"Súmate como voluntario"** → `/participa` (secundario).

### E3. "Recorre conmigo" → "Participa" (`/participa`)
- Renombra la ruta a `/participa`, con una redirección desde `/recorre-conmigo`. En el menú: **"Participa"**.
- Elimina por completo los paquetes de recorrido (Fácil / Intermedio / Alta montaña), los precios, las duraciones y cualquier "reserva".
- Página nueva con 4 **líneas de acción**, cada una con foto, una descripción breve y "Qué hacemos / Cómo puedes ayudar":
  1. **Limpieza de parajes:** jornadas para retirar basura de zonas naturales.
  2. **Reforestación:** plantación de especies nativas (oyamel, pino de altura) en la temporada de lluvias, y cuidado posterior.
  3. **Apoyo en incendios forestales:** prevención, brechas cortafuego y apoyo a las brigadas oficiales. Agrega este aviso visible: *"La participación en incendios es solo bajo coordinación de brigadas oficiales y autoridades. Si ves un incendio, repórtalo al 911."*
  4. **Cultura de naturaleza:** pláticas, talleres, difusión en redes y recuperación de la tradición oral de la montaña.
- **Próximas jornadas:** lista de 3 jornadas de ejemplo (fecha, tipo, punto de reunión general, cupo). Ponles la etiqueta "Ejemplo" y crea `data/jornadas.ts` para que se puedan editar.
- **Botón de WhatsApp:** texto "Quiero participar" con el mensaje `Hola, quiero sumarme como voluntario a Conocimiento de la Montaña`. Debajo, el correo de contacto (sección B).
- Una sección final, **"Otras formas de ayudar"**: compartir en redes (enlaces a Facebook, Instagram y YouTube), no dejar basura, no extraer plantas, musgo ni tierra de monte, y reportar la tala ilegal ante PROFEPA.

### E4. Nueva página "Problemática y acciones" (`/problematica`)
Una página de concientización. En el menú: **"Problemática"**. Para cada problema, una sección con foto, explicación breve y **"Cómo mitigarlo"**:
1. **Incendios forestales** (la mayoría son provocados por actividades humanas) → prevención, no hacer fogatas, brechas cortafuego, reportar.
2. **Basura en parajes y barrancas** → llevarte tu basura, jornadas de limpieza.
3. **Tala clandestina y cambio de uso de suelo** → denuncia ante PROFEPA, consumo de madera legal, reforestación.
4. **Extracción de musgo, heno y tierra de monte** (sobre todo en temporada navideña) → usar alternativas, no comprarlos.
5. **Pérdida de glaciares**: el glaciar de Ayoloco del Iztaccíhuatl fue declarado extinto → enlaza a su ficha en el mapa.
6. **Especies en riesgo**, como el teporingo → protección de su hábitat, el zacatonal.

Al inicio de la página, una línea que diga: *"Contenido de ejemplo: el texto final lo proporcionará Conocimiento de la Montaña."* No inventes cifras ni porcentajes: si una frase necesita un dato, déjalo como `[dato por confirmar]`.

### E5. Ajustar contenido existente
- **Fichas de lugar y lista del mapa:** quita el campo **"Dificultad"** (Fácil / Media / Alta) y "Temporada recomendada para visitar". Cámbialos por **"Mejor época para observar"** (por ejemplo la floración o la fauna) y por el **"Estado de conservación"** del lugar (por ejemplo "Bien conservado", "Presión por basura", "Zona afectada por incendios"), marcado como ejemplo.
- En cada ficha, en lugar de invitar a visitar, agrega al final: *"¿Quieres ayudar a cuidar este lugar? → Participa"*.
- Mantén los avisos de zona arqueológica aproximada y de la zona restringida del Popocatépetl.
- **Bitácora:** pasa de "expediciones" a **"Bitácora de jornadas"**: entradas de limpieza, reforestación, observación de fauna y flora y pláticas. Adapta las 4 entradas de ejemplo (título, tipo de jornada, lugar y lo que se logró, marcado "Ejemplo").
- **Cifras del Inicio** (si existen): cámbialas por indicadores de conservación de ejemplo, por ejemplo "Jornadas de limpieza", "Árboles plantados", "Lugares documentados" y "Especies registradas", con la etiqueta "Cifras de ejemplo".
- Busca en todo el módulo, y reemplaza por lenguaje de conservación, las palabras: *recorrido, recorre, tour, reserva, expedición, guía de montaña, aventura, visita*. Excepción: el manifiesto y el texto del video del cliente.
- `GUIDE_ROLE` en `config.ts`: `"Fundador de Conocimiento de la Montaña"`.
- La página **"Cómo funciona"** se queda (explica el sitio al cliente), pero cambia el bloque "Tu bitácora crece con cada recorrido" por "Tu bitácora crece con cada jornada".

### E6. Menú final (en este orden)
**La Montaña · Explorar 3D · Flora · Problemática · Bitácora · Participa** (y "Cómo funciona" solo en el Footer).

---

## D. Criterios de terminado
- En ninguna parte del sitio se ofrecen recorridos, tours ni reservas, y no aparece la palabra "Expediciones".
- `/participa` y `/problematica` funcionan, y `/recorre-conmigo` redirige a `/participa`.
- El botón "Ver la presentación" abre el reproductor, suena, se cierra con Esc y devuelve el foco.
- El video aparece en Inicio, en `/conocimiento` y como clip en Fauna, y respeta el Modo de vista.
- No hay ala de avión en el hero, ni iglesia en Nahualac, ni etiqueta sobre el título.
- El sitio arranca en "Alta calidad".
- El mapa abre con los dos volcanes a la vista.
- El build sin errores y todas las rutas funcionando en escritorio y móvil.
