# Instrucción para Antigravity: página "Conocimiento de la Montaña" (ES / EN)

> **Agente:** trabaja SOLO dentro de `src/modules/izta-popo/`. No cambies otras partes del sitio de Imagine & Stamp.
> Respeta el diseño que ya existe (tokens de `styles.css`, Navbar, Footer, QualityContext, animaciones). No rediseñes las páginas existentes.
> Al terminar, verifica en el navegador (escritorio y móvil) que todas las rutas existentes siguen funcionando.

## Contexto: de qué trata el proyecto

El cliente se llama **"Conocimiento de la Montaña"** (en inglés, *Mountain Knowledge*). No es solo un guía de recorridos: es un **proyecto de divulgación y conservación**.
Su misión es mostrar la riqueza natural que todavía existe en los bosques y montañas del Iztaccíhuatl y el Popocatépetl, recuperar el **valor sagrado que las montañas tenían en el México prehispánico** y la **tradición oral** que se está perdiendo, y crear **conciencia colectiva** para conservar la naturaleza.
Este texto es el **manifiesto** del cliente y le da sentido a todo el sitio: el mapa, la flora y la bitácora son la prueba de esa misión.

---

## 1. Nueva página `/conocimiento` (manifiesto bilingüe)

- Archivo: `pages/Conocimiento.tsx`. Ruta `conocimiento` dentro de `IztaPopoApp.tsx`, siguiendo el mismo patrón que las demás rutas.
- Textos en `data/manifiesto.ts`, con un objeto `{ es, en }`. Cada uno tiene `titulo`, `bajada` y `parrafos[]`. Usa **exactamente** los textos de la sección 4.
- **Selector de idioma `ES | EN`**, visible arriba a la derecha del contenido de la página, con el mismo estilo de pastilla que el selector de calidad. Debe:
  - recordar la elección en `localStorage` (envuelto en try/catch);
  - cambiar el atributo `lang` del contenedor (`es-MX` / `en`);
  - pasar de un idioma al otro con un fundido suave (opacity, 200 ms), sin mover el diseño.
- **Énfasis:** en los textos originales del cliente, los asteriscos (`***palabra***`) marcan palabras importantes. **No muestres asteriscos.** En los textos de la sección 4 esas palabras van entre `[[ ]]`: dibújalas con la fuente de títulos (Fraunces), en color `--amanecer` y un poco más grandes. No uses negrita ni subrayado.

### Diseño de la página (estilo editorial, sereno, respetuoso)
1. **Apertura a pantalla completa:** foto de bosque de fondo (usa la foto de oyamel o la del bosque de pino que ya existen en `media`) con un degradado oscuro abajo. Encima, el título "Conocimiento de la Montaña" en Fraunces muy grande y la bajada debajo. Sin etiqueta o "eyebrow" sobre el título.
2. **Cuerpo del manifiesto:** una sola columna de 65 a 70 caracteres de ancho, centrada, con buen interlineado (1.7) y mucho espacio entre párrafos. Cada párrafo aparece con un fade-up suave al entrar en pantalla, sin repetir la misma animación exagerada en todo.
3. **Cita destacada** a mitad del texto, a ancho completo, en Fraunces itálica grande: *"Las montañas eran veneradas, y en sus parajes se entregaban ofrendas a las deidades de la tierra y del agua."* (en inglés: *"The mountains were worshipped, and offerings were placed in their landscapes for the deities of the earth and water."*). Ponle detrás una foto de paisaje de los volcanes, oscurecida.
4. **Cierre:** tres accesos a lo que el sitio muestra (*Explorar el mapa 3D*, *Flora por altitud*, *Bitácora*), cada uno con su propia foto. Si es posible, en tamaños distintos, no como tres tarjetas iguales.
5. **Redes del proyecto:** Facebook, Instagram y YouTube con íconos de trazo fino. Las URL quedan como `SOCIAL_LINKS` en `config.ts`, con `#` de momento y un comentario `// TODO: URL real del cliente`.
6. En móvil, todo a una columna, con márgenes de 16 px y la cita sin desbordarse.

## 2. Integración con el resto del sitio

- **Navbar:** agrega el enlace **"La Montaña"** como **primer** elemento del menú, antes de "Explorar 3D", con un ícono de montaña de trazo fino. En inglés no hace falta traducir el menú.
- **Inicio (`Home.tsx`):** justo después del hero, agrega una sección corta de **misión**:
  - una frase grande en Fraunces: *"Las montañas fueron sagradas. Queremos que vuelvan a serlo para todos."*;
  - 2 o 3 líneas que resuman el manifiesto;
  - el botón **"Leer el manifiesto"** → `/conocimiento`;
  - un enlace pequeño **"Read in English"** que lleve a `/conocimiento` con el idioma ya en EN (por ejemplo `?lang=en`, que la página debe leer).
- **Footer:** añade "Conocimiento de la Montaña" con una línea de misión (*"Divulgación y conservación de los bosques y montañas del Izta-Popo."*) y las redes sociales.
- **Metadatos:** título de pestaña de la nueva página: "Conocimiento de la Montaña · Izta-Popo".

## 3. Criterios de terminado

- `/conocimiento` funciona en ES y en EN, y recuerda el idioma.
- No aparece ni un asterisco en pantalla.
- Navbar, Inicio y Footer enlazan a la nueva página.
- Contraste AA en todo el texto sobre las fotos.
- El build termina sin errores de TypeScript y las demás rutas siguen funcionando.

---

## 4. Textos finales (usar tal cual)

> Se corrigieron solo la ortografía, la puntuación y la gramática del texto original del cliente, conservando su voz y su mensaje.

### Español

**titulo:** Conocimiento de la Montaña
**bajada:** Divulgación y conservación de los bosques y montañas del Iztaccíhuatl y el Popocatépetl.

1. En diversas épocas de la historia, alrededor del mundo, las diferentes culturas han visto en las selvas, los bosques y las montañas su principal fuente de recursos. El agua, la flora y la fauna son partes esenciales de estos ecosistemas, que hoy están desapareciendo por la explotación irracional y el descuido.
2. En el [[México prehispánico]], el valor de estos elementos era tal que se consideraban [[sagrados]]. Las [[montañas]] eran veneradas, y en sus parajes se entregaban ofrendas a las deidades de la tierra y del agua que en ellas habitaban.
3. Durante mucho tiempo, los montes y los cerros fueron el eje principal de la subsistencia de la [[Cuenca de México]].
4. Las enseñanzas rituales y el respeto a las montañas se transmitieron de generación en generación a través de la [[tradición oral]], y sobrevivieron miles de años hasta nuestros días.
5. Sin embargo, en la actualidad esta tradición oral se está extinguiendo debido a la creciente modernización de ciudades y pueblos.
6. [[Conocimiento de la Montaña]], a través de plataformas actuales de comunicación como Facebook, Instagram y YouTube, desea mostrar la riqueza que aún existe en nuestros bosques y montañas, e ilustrar la gran variedad de sus ecosistemas, que albergan un sinfín de plantas y animales.
7. De esta manera buscamos crear una [[conciencia colectiva]] orientada a la conservación de la [[naturaleza]].
8. Deseamos [[revalorizar]] lo que históricamente nos heredaron nuestros antepasados y fortalecer la identidad de nuestro país como una [[nación rica en tradición y culturas milenarias]] frente a los cambiantes tiempos del mundo globalizado.

### English

**titulo:** Mountain Knowledge
**bajada:** Sharing and protecting the forests and mountains of Iztaccíhuatl and Popocatépetl.

1. Throughout history and around the world, different cultures have looked to jungles, forests and mountains as their main source of resources. Water, flora and fauna are essential parts of these ecosystems, which are now disappearing due to irrational exploitation and neglect.
2. In [[pre-Hispanic Mexico]], these resources were considered [[sacred]]. The [[mountains]] were worshipped, and offerings were placed in their landscapes for the deities of the earth and water who dwelt there.
3. For a long time, the mountains and forests were the backbone of life for those living in the [[Basin of Mexico]].
4. The teachings, rituals and respect for the mountains were passed down from generation to generation through [[oral tradition]], and have survived for thousands of years to the present day.
5. Today, however, these oral traditions are dying out due to the growing modernization of cities and towns.
6. [[Mountain Knowledge]] uses today's communication platforms, such as Facebook, Instagram and YouTube, to show you the natural wealth that still exists in our forests and mountains, illustrating the great variety of their flora and fauna.
7. In this way, we want to [[raise awareness and collective consciousness]] about the preservation of these natural resources.
8. We wish to revalue, conserve and protect what we have inherited from our ancestors, and in this way help strengthen our identity as a [[country rich in history and ancient cultural traditions]] in these times of global change.
