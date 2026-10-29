// scripts/generar-paginas-seo.mjs
// Genera las 6 páginas de servicio estáticas (SEO) en public/<slug>/index.html con diseño visual premium.
// Uso: node scripts/generar-paginas-seo.mjs  (--avisar para IndexNow)
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://imagineandstamp.site';
const WA = '525650469993';
const HOY = new Date().toISOString().slice(0, 10);
const ZONAS = 'Ciudad de México, Iztapalapa, Estado de México y a distancia en todo México';

const wa = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SERVICIOS = [
  {
    slug: 'paginas-web',
    menu: 'Páginas web',
    title: 'Creación de Páginas Web en CDMX para Negocios | Imagine & Stamp',
    description: 'Diseño y creación de páginas web para negocios en CDMX y Edomex: rápidas, hechas para celular, con botón a WhatsApp y listas para aparecer en Google. Dominio y publicación incluidos.',
    h1: 'Creación de páginas web para negocios en CDMX',
    lead: 'Una página que carga rápido en el celular, explica lo que vendes y manda a tus clientes directo a tu WhatsApp. La diseñamos, la publicamos y te ayudamos a que aparezca en Google.',
    msg: 'Hola René, vi su página y quiero cotizar una página web para mi negocio',
    cta: 'Cotizar mi página web',
    og: 'og-menu-demo.jpg',
    serviceType: 'Diseño y desarrollo de páginas web',
    hero: {
      src: '/img-servicios/vicma-laser-desktop.webp',
      alt: 'Página web comercial de Vicma Laser con cotizador y diseño para computadora y celular',
      tipo: 'foto',
      width: 900,
      height: 526,
    },
    beneficios: [
      ['Hecha para celular', 'Más de 8 de cada 10 visitas llegan desde el teléfono. Diseñamos primero para pantalla chica.'],
      ['Carga en segundos', 'Imágenes comprimidas y código ligero: Google premia las páginas rápidas y tus clientes no se van.'],
      ['Clientes a tu WhatsApp', 'Botones de contacto en cada sección. El cliente te escribe con un toque, sin formularios.'],
      ['Lista para Google', 'Títulos, descripciones, datos estructurados y mapa del sitio configurados desde el día uno.'],
    ],
    secciones: [
      ['Qué incluye tu página web', [
        'Diseño a la medida con los colores y el logo de tu marca (nada de plantillas genéricas).',
        'Secciones de servicios, galería, preguntas frecuentes, ubicación y contacto.',
        'Registro y conexión de tu dominio (.com, .mx o el que prefieras) y candado de seguridad https.',
        'Configuración en Google Search Console y en tu perfil de Google Maps.',
        'Aviso de privacidad y botón flotante de WhatsApp.',
      ]],
      ['Tipos de página que hacemos', [
        'Landing page para anuncios de Facebook, Instagram o Google.',
        'Página informativa para negocio local: consultorio, taller, despacho, gimnasio, escuela.',
        'Catálogo de productos con pedido por WhatsApp.',
        'Página para industria y servicios técnicos con cotizador y galería de trabajos.',
      ]],
    ],
    demos: [
      ['Vicma Laser · corte láser industrial', '/#/vicma-laser', '/img-servicios/vicma-laser.webp'],
      ['Strong Gym · catálogo con pedidos', '/#/strong-gym', '/img-servicios/strong-gym.webp'],
    ],
    faqs: [
      ['¿Cuánto cuesta una página web?', 'Depende de cuántas secciones necesites y si llevará catálogo o pedidos. Cuéntanos por WhatsApp qué vendes y te mandamos una cotización clara, con un solo pago.'],
      ['¿Cuánto tiempo tardan en entregarla?', 'Una landing page suele quedar en pocos días. Un sitio con varias secciones toma más; te damos la fecha antes de empezar.'],
      ['¿Incluye dominio y hosting?', 'Sí, te ayudamos a registrar tu dominio y dejamos la página publicada y funcionando. Revisa también nuestra página de hosting y dominio.'],
      ['¿Necesito tener un local para que la página me sirva?', 'No. Muchos de nuestros clientes trabajan a domicilio o por pedido. La página y tu perfil de Google funcionan igual con zona de servicio.'],
      ['¿Puedo hacer cambios después?', 'Sí. Los cambios de textos, precios o fotos se hacen rápido; pregúntanos por el plan de mantenimiento.'],
    ],
  },
  {
    slug: 'aplicaciones-para-negocios',
    menu: 'Aplicaciones para negocios',
    title: 'Creación de Apps para Negocios en CDMX: Restaurantes, Gyms y Más | Imagine & Stamp',
    description: 'Creamos la app de tu negocio: menú, catálogo o agenda que tus clientes abren con un QR o un link y agregan a su pantalla de inicio. Pedidos y citas directo a tu WhatsApp, sin tiendas de apps y sin comisiones. Desde $1,650 MXN.',
    h1: 'Creación de apps para negocios, sin pasar por tiendas de apps',
    lead: 'Tu negocio en el celular de tus clientes: abren tu app con un QR o un link, la agregan a su pantalla de inicio y te mandan pedidos o citas directo a tu WhatsApp. Sin pagar cuotas a Apple o Google, sin esperar aprobaciones y lista en días.',
    msg: 'Hola René, quiero una app para mi negocio',
    cta: 'Cotizar mi app',
    og: 'og-menu-demo.jpg',
    serviceType: 'Desarrollo de aplicaciones web para negocios',
    price: '1650',
    precioTexto: 'Desde $1,650 MXN, un solo pago',
    hero: {
      src: ['/img-servicios/strong-gym.webp', '/img-servicios/tarjeta-barberia.webp'],
      alt: 'Apps web para negocios: catálogo fitness y agenda de citas abiertas en celulares',
      tipo: 'doble-celular',
      width: 390,
      height: 844,
    },
    beneficios: [
      ['Sin tiendas de apps', 'No dependes de la aprobación de Apple o Google ni pagas sus cuotas anuales. Tu app está lista en días.'],
      ['Sin descargas pesadas', 'Tus clientes la abren al instante desde un QR o un link y la agregan a su pantalla de inicio.'],
      ['Pedidos y citas a tu WhatsApp', 'Carrito o agenda que te manda todo ordenado, sin comisiones por pedido.'],
      ['Con tu marca', 'Tus colores, tu logo y tus fotos. Se ve y se siente como la app de tu negocio.'],
    ],
    planes: [
      {
        nombre: 'Básico',
        precio: 'Desde $1,650 MXN',
        subtitulo: 'Un solo pago',
        items: [
          'App de menú, catálogo o tarjeta',
          'Pedidos o citas directo a tu WhatsApp',
          'Código QR en alta resolución',
          'Soporte y asesoría técnica',
        ],
        destacado: false,
      },
      {
        nombre: 'Profesional',
        precio: 'Desde $3,490 MXN',
        subtitulo: 'Un solo pago',
        items: [
          'Panel para cambiar precios y productos tú mismo',
          'Historial de pedidos de tus clientes',
          'Se agrega a la pantalla de inicio con el ícono de tu negocio',
          'Carrito con opciones, extras y notas',
          'Dominio propio (tunegocio.com) el primer año',
          'Display acrílico QR para tu mostrador',
        ],
        destacado: true,
      },
      {
        nombre: 'A tu medida',
        precio: 'Cotización',
        subtitulo: 'Por WhatsApp',
        items: [
          'Múltiples sucursales y puntos de venta',
          'Cobros con tarjeta y SPEI integrados',
          'Cupones de descuento y fidelización',
          'Pack de displays y stickers físicos',
          'Capacitación y asesoría continua',
        ],
        destacado: false,
      },
    ],
    secciones: [
      ['Para qué negocios', [
        'Restaurantes, taquerías, bares y cafeterías: menú con carrito y pedidos.',
        'Gimnasios: catálogo de suplementos y rutinas.',
        'Barberías, estéticas, clínicas y veterinarias: servicios y agenda de citas.',
        'Tiendas y distribuidores: catálogo de productos con pedido por WhatsApp.',
      ]],
    ],
    demos: [
      ['Candymar · restaurante', '/#/candymar', '/img-servicios/candymar.webp'],
      ['Strong Gym · catálogo', '/#/strong-gym', '/img-servicios/strong-gym.webp'],
      ['Barbería Gentleman\'s Cut', '/#/tarjeta-barberia', '/img-servicios/tarjeta-barberia.webp'],
      ['Veterinaria Vita Vet', '/#/tarjeta-veterinaria', '/img-servicios/tarjeta-veterinaria.webp'],
    ],
    faqs: [
      ['¿Es una app de la Play Store o App Store?', 'No. Es una app web: tus clientes la abren desde un QR o un link y la agregan a su pantalla de inicio. Así te ahorras las cuotas y aprobaciones de las tiendas, y la tienes lista en días.'],
      ['¿Funciona en iPhone y Android?', 'Sí. En Android el celular ofrece agregarla a la pantalla de inicio; en iPhone se agrega desde Safari con Compartir y luego "Agregar a inicio".'],
      ['¿Cuánto cuesta?', 'El plan Básico es desde $1,650 MXN y el Profesional desde $3,490 MXN, en un solo pago. Lo que lleve a la medida se cotiza por WhatsApp.'],
      ['¿Cuánto tardan en entregarla?', 'Una app básica suele quedar en 2 o 3 días después de recibir tu información; la Profesional toma un poco más. Te damos la fecha antes de empezar.'],
      ['¿Puedo cambiar precios y productos yo mismo?', 'Sí, con el plan Profesional tienes un panel para hacerlo desde tu celular. En el Básico nos mandas los cambios por WhatsApp.'],
    ],
  },
  {
    slug: 'hosting-y-dominio',
    menu: 'Hosting y dominio',
    title: 'Hosting y Dominio para tu Página Web en México | Imagine & Stamp',
    description: 'Registramos tu dominio, configuramos tu hosting y publicamos tu página web con candado de seguridad y correo con tu marca. Atención directa por WhatsApp en CDMX.',
    h1: 'Hosting y dominio para tu página web, sin complicarte',
    lead: 'Comprar un dominio y un hosting no debería ser un dolor de cabeza. Nosotros lo registramos, lo configuramos y dejamos tu página publicada. Tú solo nos dices qué nombre quieres.',
    msg: 'Hola René, necesito ayuda con hosting y dominio para mi página web',
    cta: 'Pedir ayuda con mi dominio',
    og: 'og-menu-demo.jpg',
    serviceType: 'Hosting web y registro de dominios',
    hero: {
      src: '/img-servicios/hosting.webp',
      alt: 'Hospedaje web de alta velocidad, dominio propio y correos con tu marca en servidores seguros',
      tipo: 'foto',
      width: 900,
      height: 675,
    },
    beneficios: [
      ['Tu nombre en internet', 'Te ayudamos a elegir y registrar tu dominio .com, .mx, .com.mx o .site.'],
      ['Candado de seguridad', 'Tu página carga con https, que da confianza y Google lo toma en cuenta.'],
      ['Correo con tu marca', 'Configuramos un correo tipo contacto@tunegocio.com para que te vean profesional.'],
      ['Te avisamos antes de vencer', 'Llevamos el control de renovaciones para que tu página nunca se caiga por un pago olvidado.'],
    ],
    secciones: [
      ['Qué incluye el servicio', [
        'Registro y administración del dominio a tu nombre (tú eres el dueño).',
        'Configuración del servidor con certificado SSL (https con candado verde).',
        'Cuentas de correo con el nombre de tu negocio para ti y tu equipo.',
        'Publicación y conexión con tu página web.',
        'Migración si ya tienes tu página en otro lado y te cobran caro o falla seguido.',
      ]],
      ['Por qué hacerlo con nosotros', [
        'Atención por WhatsApp en español, sin lidiar con paneles complicados en inglés ni robots de soporte.',
        'Servidores rápidos y estables.',
        'Un solo contacto para diseño, página, dominio y hosting.',
      ]],
    ],
    demos: [
      ['Vicma Laser · hosting rápido', '/#/vicma-laser', '/img-servicios/vicma-laser.webp'],
      ['Candymar · alta disponibilidad', '/#/candymar', '/img-servicios/candymar.webp'],
    ],
    faqs: [
      ['¿El dominio queda a mi nombre?', 'Sí. Lo registramos a tu nombre para que siempre sea tuyo, aunque algún día cambies de proveedor.'],
      ['¿Qué dominio me conviene, .com o .mx?', 'Si vendes solo en México, un .mx o .com.mx da confianza local. El .com es el más conocido. Te ayudamos a decidir según tu nombre y presupuesto.'],
      ['¿Cada cuánto se paga?', 'El dominio y el hosting se renuevan cada año. Te avisamos con tiempo para que no se venza.'],
      ['¿Pueden pasar mi página de otro hosting?', 'Sí, la migramos sin que pierdas tu dominio ni tus correos.'],
    ],
  },
  {
    slug: 'menu-digital',
    menu: 'Menús digitales',
    title: 'Menú Digital QR con Pedidos por WhatsApp para Restaurantes | Imagine & Stamp',
    description: 'Menú digital con código QR, carrito de compras y pedidos directo a tu WhatsApp, sin comisiones por pedido. Un solo pago de $1,650 MXN. Restaurantes, taquerías y cafeterías en CDMX y todo México.',
    h1: 'Menú digital QR con pedidos directo a tu WhatsApp',
    lead: 'Tus clientes escanean el QR, ven fotos y precios, arman su pedido y te llega completo a tu WhatsApp. Sin apps, sin comisiones por pedido y lo actualizas en un minuto.',
    msg: 'Hola René, quiero un menú digital QR con pedidos a WhatsApp para mi negocio',
    cta: 'Quiero mi menú digital',
    og: 'og-menu-demo.jpg',
    serviceType: 'Menú digital QR para restaurantes',
    price: '1650',
    precioTexto: 'Un solo pago de $1,650 MXN',
    hero: {
      src: '/img-servicios/candymar.webp',
      alt: 'Menú digital QR de Candymar abierto en un celular con carrito de pedidos a WhatsApp',
      tipo: 'celular',
      width: 390,
      height: 844,
    },
    beneficios: [
      ['Cero comisiones', 'A diferencia de las apps de reparto, el pedido es tuyo y el dinero también.'],
      ['Pedido completo', 'Carrito de 2 pasos: productos, datos de entrega y forma de pago. Llega ordenado a tu WhatsApp.'],
      ['Cambias precios al momento', 'Sin volver a imprimir cartas. Agregas platillos o marcas agotados en un minuto.'],
      ['Con tu marca', 'Colores, logo y fotos de tu negocio. Funciona en mesa con QR y para pedidos a domicilio.'],
    ],
    secciones: [
      ['Qué incluye tu menú digital', [
        'Menú con categorías, fotos, descripciones y precios.',
        'Carrito de compras con opciones (tamaños, ingredientes, salsas, extras).',
        'Pedido por WhatsApp con dirección, forma de pago y cálculo de cambio en efectivo.',
        'Código QR listo para imprimir en mesas, mostrador o volantes.',
        'Liga para compartir en Instagram, Facebook y Google Maps.',
      ]],
      ['Para qué negocios funciona', [
        'Restaurantes, taquerías, pizzerías, cafeterías y pastelerías.',
        'Dark kitchens y negocios que solo venden a domicilio.',
        'Gimnasios, tiendas y catálogos de productos con pedido por WhatsApp.',
      ]],
    ],
    demos: [
      ['Candymar · mariscos', '/#/candymar', '/img-servicios/candymar.webp'],
      ['Brothers Pizza · pizzería', '/#/brothers-pizza', '/img-servicios/brothers-pizza.webp'],
      ['La Cueva del Lobo · antojitos', '/#/la-cueva-del-lobo', '/img-servicios/la-cueva-del-lobo.webp'],
      ['AAAH! Carbón · parrilla', '/#/aaah-carbon', '/img-servicios/aaah-carbon.webp'],
      ['Strong Gym · suplementos', '/#/strong-gym', '/img-servicios/strong-gym.webp'],
      ['Takero\'s CDMX · taquería', 'https://takeros-cdmx.imagineandstamp.site'],
    ],
    faqs: [
      ['¿Cuánto cuesta el menú digital?', 'Un solo pago de $1,650 MXN. No cobramos comisión por pedido.'],
      ['¿Mis clientes tienen que descargar una app?', 'No. Escanean el QR o abren la liga y el menú carga en su navegador.'],
      ['¿Puedo cambiar precios yo mismo?', 'Sí, te explicamos cómo hacerlo, o nos mandas el cambio por WhatsApp.'],
      ['¿Sirve si no tengo local y vendo a domicilio?', 'Sí. Muchos clientes lo usan solo para pedidos a domicilio y lo comparten en redes y Google Maps.'],
      ['¿En cuánto tiempo queda listo?', 'Normalmente en pocos días, en cuanto nos mandas tu carta, logo y fotos.'],
    ],
  },
  {
    slug: 'invitaciones-digitales',
    menu: 'Invitaciones digitales',
    title: 'Invitaciones Digitales y Video Invitaciones Personalizadas desde $99 | Imagine & Stamp',
    description: 'Invitaciones digitales para cumpleaños, XV años, bodas y bautizos: interactivas con confirmación por WhatsApp y ubicación en Maps desde $99 MXN, video animado $399 y video 3D con canción $699.',
    h1: 'Invitaciones digitales y video invitaciones personalizadas',
    lead: 'Invitaciones que se mandan por WhatsApp y se abren en el celular: con botón para confirmar asistencia, ubicación en Google Maps y, si quieres, un video donde tu hijo es el protagonista.',
    msg: 'Hola René, quiero una invitación digital para mi evento',
    cta: 'Pedir mi invitación',
    og: 'videoinvitaciones/assets/og_videoinvitaciones.jpg',
    serviceType: 'Invitaciones digitales y video invitaciones',
    price: '99',
    precioTexto: 'Desde $99 MXN',
    hero: {
      src: '/img-servicios/invitaciones.webp',
      alt: 'Video invitaciones digitales interactivas y animadas para fiestas y eventos',
      tipo: 'foto',
      width: 600,
      height: 800,
    },
    beneficios: [
      ['Confirman con un toque', 'Botón que abre WhatsApp con el mensaje de confirmación ya escrito.'],
      ['Llegan sin perderse', 'Botón con la ubicación exacta del salón en Google Maps.'],
      ['Sin imprimir', 'Se manda a todos tus contactos y grupos en segundos.'],
      ['Tu hijo de protagonista', 'En la versión 3D, lo convertimos en personaje animado que invita a su fiesta.'],
    ],
    planes: [
      {
        nombre: 'Interactiva',
        precio: '$99 MXN',
        subtitulo: 'Entrega en 24 horas',
        items: [
          'Diseño temático personalizado en Canva',
          'Botón a WhatsApp para confirmar asistencia',
          'Botón con ubicación en Google Maps',
          'Se comparte ilimitadamente por WhatsApp',
        ],
        destacado: false,
      },
      {
        nombre: 'Video Animado',
        precio: '$399 MXN',
        subtitulo: 'Vertical HD',
        items: [
          'Video corto vertical temático',
          'Música, efectos y animaciones llamativas',
          'Texto personalizado con datos del evento',
          'Listo para reenviar y estados',
        ],
        destacado: false,
      },
      {
        nombre: 'Historia Cinemática',
        precio: '$499 MXN',
        subtitulo: 'Escenas tipo película',
        items: [
          'Narrativa visual con Inteligencia Artificial',
          'Guión personalizado con fotos del festejado',
          'Efectos de cine y música épica',
          'Mucha emotividad para compartir',
        ],
        destacado: false,
      },
      {
        nombre: 'Protagonista 3D + Canción',
        precio: '$699 MXN',
        subtitulo: 'El más viral y emotivo',
        items: [
          'Tu hijo(a) como personaje animado 3D estilo Pixar',
          'Canción original personalizada con su nombre',
          'Recuerdo inolvidable para toda la familia',
          'Máxima calidad de animación',
        ],
        destacado: false,
      },
    ],
    secciones: [
      ['Para qué eventos', [
        'Cumpleaños infantiles y fiestas temáticas.',
        'XV años, bodas, bautizos, primera comunión y baby shower.',
        'Eventos de empresa, inauguraciones y graduaciones.',
      ]],
    ],
    demos: [
      ['Ver ejemplos de video invitaciones', '/#/videoinvitaciones', '/img-servicios/videoinvitaciones.webp'],
    ],
    faqs: [
      ['¿Cuánto cuesta una invitación digital?', 'La invitación interactiva cuesta $99 MXN. Los videos van de $399 a $699 MXN según el tipo.'],
      ['¿Cómo la recibo?', 'Te la mandamos por WhatsApp como liga o video, lista para reenviar a tus invitados.'],
      ['¿Qué necesito mandar?', 'Nombre, edad o motivo, fecha, hora, dirección del evento y la temática. Para la versión 3D, una foto clara del festejado.'],
      ['¿Cuánto tardan?', 'La invitación interactiva suele quedar el mismo día o al siguiente; los videos tardan un poco más. Te confirmamos al pedirla.'],
    ],
  },
  {
    slug: 'tarjetas-digitales',
    menu: 'Tarjetas digitales',
    title: 'Tarjetas Digitales de Presentación para Negocios en CDMX | Imagine & Stamp',
    description: 'Tarjeta digital de presentación con tus servicios, botón de WhatsApp, llamada, ubicación en Google Maps y redes sociales. Una liga que compartes en cualquier lugar. CDMX y todo México.',
    h1: 'Tarjetas digitales de presentación para tu negocio',
    lead: 'Una sola liga con todo tu negocio: servicios y precios, agenda por WhatsApp, llamada directa, ubicación y redes. Se comparte por WhatsApp, Instagram o con un código QR, y nunca se acaba como las de papel.',
    msg: 'Hola René, me interesa una tarjeta digital para mi negocio',
    cta: 'Quiero mi tarjeta digital',
    og: 'og-menu-demo.jpg',
    serviceType: 'Tarjeta digital de presentación',
    hero: {
      src: '/img-servicios/tarjeta-barberia.webp',
      alt: 'Tarjeta digital interactiva de Gentleman\'s Cut con servicios y reserva de citas por WhatsApp',
      tipo: 'celular',
      width: 390,
      height: 844,
    },
    beneficios: [
      ['Nunca se acaba', 'A diferencia de las tarjetas de papel que se pierden o se tiran, esta liga siempre funciona.'],
      ['Todo en un toque', 'Llamada, WhatsApp, Google Maps, Instagram y tus servicios con precio.'],
      ['Fácil de compartir', 'Por WhatsApp, en tu bio de Instagram o con un código QR que muestras desde el celular.'],
      ['Lista para agendar', 'Tus clientes eligen servicio y fecha y te escriben con los datos listos.'],
    ],
    secciones: [
      ['Qué puede llevar tu tarjeta digital', [
        'Foto o logo, nombre, profesión o giro y descripción corta.',
        'Botones de acción rápida: llamar, WhatsApp, cómo llegar en Google Maps, guardar contacto.',
        'Lista de servicios con precio y botón para agendar o pedir información.',
        'Enlaces a tus redes sociales (Instagram, Facebook, TikTok).',
        'Código QR propio para que cualquiera lo escanee desde tu pantalla.',
      ]],
      ['Giros que más la usan', [
        'Barberías, estéticas y salones de uñas.',
        'Clínicas veterinarias y consultorios médicos.',
        'Abogados, contadores, agentes de seguros y asesores.',
        'Técnicos, instaladores y servicios para el hogar.',
      ]],
    ],
    demos: [
      ['Barbería Gentleman\'s Cut', '/#/tarjeta-barberia', '/img-servicios/tarjeta-barberia.webp'],
      ['Veterinaria Vita Vet', '/#/tarjeta-veterinaria', '/img-servicios/tarjeta-veterinaria.webp'],
    ],
    faqs: [
      ['¿Mis clientes necesitan una app?', 'No. Se abre en el navegador de cualquier celular, iPhone o Android.'],
      ['¿Puedo cambiar mi teléfono o dirección después?', 'Sí, la liga sigue siendo la misma y los datos se actualizan sin reimprimir nada.'],
      ['¿Cómo se la doy a alguien en persona?', 'Le muestras el código QR de tu tarjeta en tu celular para que lo escanee con su cámara, o se la mandas por WhatsApp.'],
      ['¿Cuánto tardan en entregarla?', 'Normalmente de 24 a 48 horas una vez que nos mandas tus datos y fotos.'],
    ],
  },
];

const css = `
:root{--navy:#002E5D;--orange:#FF8C00;--cream:#F9F7F2;--ink:#1A1C1C;--muted:#4b5563;--card:#fff;--line:rgba(0,46,93,.09)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,system-ui,sans-serif;background:var(--cream);color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit}
h1,h2,h3,.brand{font-family:Manrope,Inter,sans-serif;color:var(--navy);line-height:1.2;letter-spacing:-.02em}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
header{position:sticky;top:0;z-index:30;background:rgba(249,247,242,.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.bar{display:flex;align-items:center;justify-content:space-between;gap:12px;height:64px}
.brand{font-weight:800;font-size:19px;text-decoration:none}
.brand span{color:var(--orange)}

/* Menú dropdown accesible con details/summary */
.menu-wrap{display:flex;align-items:center;gap:14px;position:relative}
.brand,.menu-sum{white-space:nowrap}
@media(max-width:420px){.brand{font-size:16px}.bar{gap:8px}.menu-sum{padding:7px 12px}.bar>.btn-sm{padding:8px 12px}}
@media(max-width:370px){.brand{font-size:15px}.menu-sum{padding:6px 10px}}
.menu-drop{position:relative;background:none!important;border:0!important;padding:0!important;margin:0!important}
.menu-sum{cursor:pointer;list-style:none;border:1px solid var(--line);border-radius:999px;padding:8px 16px;background:#fff;font-weight:700;font-size:13px;color:var(--navy);display:inline-flex;align-items:center;gap:4px;user-select:none;transition:background .2s}
.menu-sum::-webkit-details-marker{display:none}
.menu-sum:hover{background:rgba(0,46,93,.04)}
.menu-pop{position:absolute;top:calc(100% + 8px);left:0;background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 16px 40px -10px rgba(0,46,93,.25);padding:10px;width:240px;z-index:50;display:flex;flex-direction:column;gap:3px}
.menu-pop a{text-decoration:none;padding:10px 14px;border-radius:12px;font-size:14px;font-weight:600;color:var(--muted);transition:background .15s,color .15s}
.menu-pop a:hover{background:rgba(0,46,93,.05);color:var(--navy)}
.menu-pop a[aria-current="page"]{background:rgba(255,140,0,.12);color:#b45f00;font-weight:700}
.menu-home{color:var(--navy)!important;font-weight:700!important}
.menu-sep{border:none;border-top:1px solid var(--line);margin:4px 0}
.link-home-desk{display:none;font-size:14px;font-weight:600;text-decoration:none;color:var(--muted)}
.link-home-desk:hover{color:var(--navy)}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;padding:14px 28px;font-weight:700;font-size:15px;text-decoration:none;transition:transform .2s,box-shadow .2s;cursor:pointer}
.btn:hover{transform:translateY(-2px)}
.btn-wa{background:#25D366;color:#fff;box-shadow:0 10px 24px -10px rgba(37,211,102,.7)}
.btn-sm{padding:9px 18px;font-size:13px}
.btn-ghost{border:1.5px solid var(--navy);color:var(--navy);background:transparent}
.crumbs{font-size:13px;color:var(--muted);padding:18px 0 0}
.crumbs a{text-decoration:none}

/* Hero con 2 columnas */
.hero{padding:28px 0 48px}
.hero-grid{display:grid;grid-template-columns:1fr;gap:32px;align-items:center}
.hero-content{display:flex;flex-direction:column}
.tag{display:inline-block;background:rgba(255,140,0,.12);color:#b45f00;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;padding:6px 14px;border-radius:999px;margin-bottom:16px;width:fit-content}
h1{font-size:clamp(30px,5vw,48px);font-weight:800;margin-bottom:16px}
.lead{font-size:clamp(16px,2vw,18px);color:var(--muted);line-height:1.6;margin-bottom:20px}
.price{font-family:Manrope,sans-serif;font-weight:800;color:var(--navy);font-size:22px;margin-bottom:24px}
.ctas{display:flex;flex-wrap:wrap;gap:12px}

/* Marco de celular CSS */
.hero-media{display:flex;justify-content:center;align-items:center;padding:10px 0}
.phone{width:260px;aspect-ratio:390/844;border-radius:38px;border:10px solid #0b1220;overflow:hidden;box-shadow:0 30px 60px -25px rgba(0,46,93,.45);background:#fff;position:relative}
.phone img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}

/* Doble celular */
.phone-stack{position:relative;width:320px;height:490px;margin:0 auto}
.phone-stack .phone-1{position:absolute;left:0;top:0;z-index:2;width:225px}
.phone-stack .phone-2{position:absolute;right:0;top:40px;z-index:1;width:215px;transform:rotate(5deg);opacity:.96}

/* Foto hero */
.hero-photo{width:100%;max-width:540px;border-radius:24px;box-shadow:0 24px 50px -20px rgba(0,46,93,.35);border:1px solid var(--line);overflow:hidden}
.hero-photo img{width:100%;height:auto;display:block;object-fit:cover}

section{padding:40px 0}
h2{font-size:clamp(24px,3.8vw,32px);font-weight:800;margin-bottom:20px}
.grid{display:grid;grid-template-columns:1fr;gap:14px}
.card{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:22px;box-shadow:0 12px 30px -22px rgba(0,46,93,.3)}
.card h3{font-size:17px;margin-bottom:6px}
.card p{font-size:15px;color:var(--muted)}
ul.list{list-style:none;display:grid;gap:10px}
ul.list li{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 16px 14px 44px;position:relative;font-size:15px}
ul.list li::before{content:"✓";position:absolute;left:16px;top:13px;color:var(--orange);font-weight:800}

/* Ejemplos con foto */
.grid-demos{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.demo-card{background:var(--card);border:1px solid var(--line);border-radius:20px;overflow:hidden;text-decoration:none;display:flex;flex-direction:column;box-shadow:0 12px 30px -20px rgba(0,46,93,.3);transition:transform .2s,box-shadow .2s}
.demo-card:hover{transform:translateY(-3px);box-shadow:0 18px 40px -18px rgba(0,46,93,.4)}
.demo-thumb{aspect-ratio:4/5;overflow:hidden;background:#e5e7eb}
.demo-thumb img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.demo-thumb-placeholder{aspect-ratio:4/5;background:var(--navy);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px}
.demo-info{padding:14px 16px;display:flex;flex-direction:column;gap:4px}
.demo-info strong{font-size:14px;font-family:Manrope,sans-serif;color:var(--navy);line-height:1.3}
.demo-link{font-size:13px;font-weight:700;color:var(--orange)}

/* Tarjetas de planes */
.grid-planes{display:grid;grid-template-columns:1fr;gap:18px}
.card-plan{background:var(--card);border:1px solid var(--line);border-radius:24px;padding:26px 22px;display:flex;flex-direction:column;justify-content:space-between;position:relative;box-shadow:0 14px 35px -20px rgba(0,46,93,.3)}
.card-plan.destacado{border:2px solid var(--orange);box-shadow:0 20px 45px -18px rgba(255,140,0,.35)}
.badge-rec{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--orange);color:#fff;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:4px 14px;border-radius:999px;box-shadow:0 4px 12px rgba(255,140,0,.4)}
.card-plan h3{font-size:20px;margin-bottom:6px}
.plan-price{font-size:26px;font-weight:800;color:var(--navy);font-family:Manrope,sans-serif}
.plan-sub{font-size:13px;color:var(--muted);margin-bottom:18px}
.plan-items{list-style:none;display:grid;gap:10px;margin-bottom:24px;font-size:14px}
.plan-items li{position:relative;padding-left:24px;color:var(--muted)}
.plan-items li::before{content:"✓";position:absolute;left:0;color:var(--orange);font-weight:800}
.btn-plan{background:var(--navy);color:#fff}

details{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;margin-bottom:10px}
summary{cursor:pointer;font-weight:700;color:var(--navy);font-family:Manrope,sans-serif}
details p{margin-top:10px;color:var(--muted);font-size:15px}

.cta-box{background:var(--navy);color:#fff;border-radius:28px;padding:40px 24px;text-align:center}
.cta-box h2{color:#fff;margin-bottom:8px}
.cta-box p{color:rgba(255,255,255,.8);margin-bottom:24px;font-size:16px}

.others{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.others a{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;text-decoration:none;font-weight:600;color:var(--navy);font-size:14px}

footer{border-top:1px solid var(--line);padding:32px 0 100px;font-size:14px;color:var(--muted)}
footer .cols{display:grid;gap:20px}
footer a{text-decoration:none}

/* Botón flotante WhatsApp */
.btn-float-wa{position:fixed;right:18px;bottom:18px;z-index:40;background:#25D366;color:#fff;text-decoration:none;box-shadow:0 12px 28px rgba(37,211,102,.55);display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s;width:56px;height:56px;border-radius:50%}
.btn-float-wa:hover{transform:scale(1.05);box-shadow:0 16px 34px rgba(37,211,102,.65)}
.float-text{display:none;font-weight:700;font-size:15px}

@media(min-width:768px){
  .link-home-desk{display:inline-block}
  .grid{grid-template-columns:1fr 1fr}
  .grid-demos{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
  .grid-planes{grid-template-columns:repeat(3,1fr)}
  .grid-planes-4{grid-template-columns:repeat(4,1fr)}
  .others{grid-template-columns:repeat(3,1fr)}
  footer .cols{grid-template-columns:2fr 1fr 1fr}
  footer{padding-bottom:44px}
  .btn-float-wa{width:auto;height:auto;border-radius:999px;padding:12px 24px;gap:10px}
  .float-text{display:inline}
}
@media(min-width:900px){
  .hero-grid{grid-template-columns:1.15fr .85fr}
  .others{grid-template-columns:repeat(5,1fr)}
}
`;

function renderHeroMedia(s) {
  if (!s.hero) return '';
  if (s.hero.tipo === 'celular') {
    return `<div class="hero-media">
      <div class="phone">
        <img src="${s.hero.src}" alt="${esc(s.hero.alt)}" width="${s.hero.width || 390}" height="${s.hero.height || 844}" fetchpriority="high" />
      </div>
    </div>`;
  }
  if (s.hero.tipo === 'doble-celular' && Array.isArray(s.hero.src)) {
    return `<div class="hero-media">
      <div class="phone-stack">
        <div class="phone phone-1">
          <img src="${s.hero.src[0]}" alt="${esc(s.hero.alt)}" width="${s.hero.width || 390}" height="${s.hero.height || 844}" fetchpriority="high" />
        </div>
        <div class="phone phone-2">
          <img src="${s.hero.src[1]}" alt="${esc(s.hero.alt)}" width="${s.hero.width || 390}" height="${s.hero.height || 844}" fetchpriority="high" />
        </div>
      </div>
    </div>`;
  }
  return `<div class="hero-media">
    <div class="hero-photo">
      <img src="${s.hero.src}" alt="${esc(s.hero.alt)}" width="${s.hero.width || 900}" height="${s.hero.height || 600}" fetchpriority="high" />
    </div>
  </div>`;
}

function pagina(s) {
  const url = `${SITE}/${s.slug}/`;
  const otros = SERVICIOS.filter((o) => o.slug !== s.slug);
  const heroImg = s.hero ? (Array.isArray(s.hero.src) ? s.hero.src[0] : s.hero.src) : `/${s.og}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#servicio`,
        name: s.h1,
        serviceType: s.serviceType,
        description: s.description,
        url,
        image: `${SITE}${heroImg}`,
        provider: { '@id': `${SITE}/#business` },
        areaServed: [
          { '@type': 'City', name: 'Ciudad de México' },
          { '@type': 'State', name: 'Estado de México' },
          { '@type': 'Country', name: 'México' },
        ],
        ...(s.price && {
          offers: { '@type': 'Offer', price: s.price, priceCurrency: 'MXN', url },
        }),
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE}/#business`,
        name: 'Imagine & Stamp',
        url: `${SITE}/`,
        telephone: '+52-56-5046-9993',
        email: 'imagineandstamp@gmail.com',
        image: `${SITE}/og-menu-demo.jpg`,
        address: { '@type': 'PostalAddress', addressLocality: 'Ciudad de México', addressRegion: 'CDMX', addressCountry: 'MX' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: s.menu, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: s.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };

  const link = (href) => (href.startsWith('http') ? href : `${SITE}${href}`);

  return `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(s.title)}</title>
<meta name="description" content="${esc(s.description)}" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta name="geo.region" content="MX-CMX" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="es_MX" />
<meta property="og:site_name" content="Imagine &amp; Stamp" />
<meta property="og:title" content="${esc(s.h1)} | Imagine &amp; Stamp" />
<meta property="og:description" content="${esc(s.description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}/${s.og}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<style>${css}</style>
</head>
<body>
<header><div class="wrap bar">
  <a class="brand" href="/">Imagine <span>&amp;</span> Stamp</a>
  <div class="menu-wrap">
    <details class="menu-drop">
      <summary class="menu-sum">Servicios ▾</summary>
      <div class="menu-pop">
        <a href="/" class="menu-home">🏠 Ir al Inicio</a>
        <hr class="menu-sep" />
${SERVICIOS.map((o) => `        <a href="/${o.slug}/"${o.slug === s.slug ? ' aria-current="page"' : ''}>${o.menu}</a>`).join('\n')}
      </div>
    </details>
    <a href="/" class="link-home-desk">Inicio</a>
  </div>
  <a class="btn btn-wa btn-sm" href="${wa(s.msg)}" rel="noopener">WhatsApp</a>
</div></header>

<main class="wrap">
  <p class="crumbs"><a href="/">Inicio</a> › ${s.menu}</p>

  <div class="hero">
    <div class="hero-grid">
      <div class="hero-content">
        <span class="tag">${ZONAS}</span>
        <h1>${s.h1}</h1>
        <p class="lead">${s.lead}</p>
${s.precioTexto ? `        <p class="price">${s.precioTexto}</p>\n` : ''}        <div class="ctas">
          <a class="btn btn-wa" href="${wa(s.msg)}" rel="noopener">${s.cta}</a>
          <a class="btn btn-ghost" href="#ejemplos">Ver ejemplos</a>
        </div>
      </div>
      ${renderHeroMedia(s)}
    </div>
  </div>

  <section aria-labelledby="por-que">
    <h2 id="por-que">Por qué funciona</h2>
    <div class="grid">
${s.beneficios.map(([t, d]) => `      <div class="card"><h3>${t}</h3><p>${d}</p></div>`).join('\n')}
    </div>
  </section>

  <section id="ejemplos">
    <h2>Ejemplos reales: pruébalos desde tu celular</h2>
    <div class="grid-demos">
${s.demos.map(([t, h, img]) => `      <a href="${link(h)}" class="demo-card">
        ${img ? `<div class="demo-thumb"><img src="${img}" alt="${esc(t)}" loading="lazy" decoding="async" width="390" height="488" /></div>` : `<div class="demo-thumb-placeholder"><span>🌐 Ver demo</span></div>`}
        <div class="demo-info">
          <strong>${esc(t)}</strong>
          <span class="demo-link">Probar demo →</span>
        </div>
      </a>`).join('\n')}
    </div>
  </section>

${s.planes ? `  <section aria-labelledby="planes">
    <h2 id="planes">Planes y precios</h2>
    <div class="grid-planes ${s.planes.length === 4 ? 'grid-planes-4' : ''}">
${s.planes.map((p) => `      <div class="card-plan ${p.destacado ? 'destacado' : ''}">
        ${p.destacado ? '<span class="badge-rec">Recomendado</span>' : ''}
        <div>
          <h3>${p.nombre}</h3>
          <p class="plan-price">${p.precio}</p>
          ${p.subtitulo ? `<p class="plan-sub">${p.subtitulo}</p>` : ''}
          <ul class="plan-items">
${p.items.map(it => `            <li>${it}</li>`).join('\n')}
          </ul>
        </div>
        <a class="btn ${p.destacado ? 'btn-wa' : 'btn-plan'}" href="${wa(`Hola René, me interesa el plan ${p.nombre} de ${s.menu}`)}" rel="noopener">Pedir ${p.nombre}</a>
      </div>`).join('\n')}
    </div>
  </section>` : ''}

${s.secciones.map(([t, items]) => `  <section>
    <h2>${t}</h2>
    <ul class="list">
${items.map((i) => `      <li>${i}</li>`).join('\n')}
    </ul>
  </section>`).join('\n\n')}

  <section>
    <h2>Cómo trabajamos</h2>
    <ul class="list">
      <li>Nos escribes por WhatsApp y nos cuentas qué necesitas.</li>
      <li>Te mandamos propuesta y precio claro, con un solo pago.</li>
      <li>Diseñamos, revisas y ajustamos hasta que te guste.</li>
      <li>Lo publicamos y te enseñamos a compartirlo.</li>
    </ul>
    <p style="margin-top:16px;color:var(--muted);font-size:15px">Trabajamos a distancia y con atención directa por WhatsApp: no necesitas visitarnos. Atendemos ${ZONAS}.</p>
  </section>

  <section aria-labelledby="faq">
    <h2 id="faq">Preguntas frecuentes</h2>
${s.faqs.map(([q, a]) => `    <details><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
  </section>

  <section>
    <div class="cta-box">
      <h2>¿Platicamos tu proyecto?</h2>
      <p>Escríbenos y te respondemos directo, sin intermediarios.</p>
      <a class="btn btn-wa" href="${wa(s.msg)}" rel="noopener">${s.cta}</a>
    </div>
  </section>

  <section aria-labelledby="otros">
    <h2 id="otros">Otros servicios</h2>
    <div class="others">
${otros.map((o) => `      <a href="/${o.slug}/">${o.menu}</a>`).join('\n')}
    </div>
  </section>
</main>

<footer><div class="wrap cols">
  <div>
    <p class="brand" style="margin-bottom:8px">Imagine <span>&amp;</span> Stamp</p>
    <p>Agencia digital en CDMX. Menús digitales, invitaciones, páginas web y tarjetas digitales para negocios que quieren vender por WhatsApp.</p>
  </div>
  <div>
    <p style="font-weight:700;color:var(--navy);margin-bottom:8px">Servicios</p>
${SERVICIOS.map((o) => `    <p><a href="/${o.slug}/">${o.menu}</a></p>`).join('\n')}
  </div>
  <div>
    <p style="font-weight:700;color:var(--navy);margin-bottom:8px">Contacto</p>
    <p><a href="${wa(s.msg)}">WhatsApp: 56 5046 9993</a></p>
    <p>imagineandstamp@gmail.com</p>
    <p>CDMX · Iztapalapa</p>
  </div>
</div></footer>

<a class="btn-float-wa" href="${wa(s.msg)}" rel="noopener" aria-label="Escribir por WhatsApp">
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.17c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.4c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.01 4.54-3.68 8.25-8.22 8.25zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.88.86-.88 2.09 0 1.23.9 2.42 1.02 2.59.12.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.22-.19-.47-.31z"/></svg>
  <span class="float-text">WhatsApp</span>
</a>
</body>
</html>
`;
}

for (const s of SERVICIOS) {
  const out = join(ROOT, 'public', s.slug, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, pagina(s));
  console.log('✓', `/${s.slug}/`);
}

// Sitemap: portada + páginas de servicio. Los puentes de WhatsApp (strong-gym/, iron-plan/...)
// NO van: redirigen por JS a /#/ruta y Google los marca como "no indexada".
const urls = [
  ['/', '1.0'],
  ...SERVICIOS.map((s) => [`/${s.slug}/`, '0.9']),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([p, pr]) => `  <url><loc>${SITE}${p}</loc><lastmod>${HOY}</lastmod><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(ROOT, 'public', 'sitemap.xml'), sitemap);
console.log('✓ sitemap.xml');
readFileSync(join(ROOT, 'public', 'robots.txt'), 'utf8').includes('sitemap.xml') || console.warn('⚠ robots.txt sin Sitemap');

// llms.txt: resumen en texto plano para asistentes de IA (ChatGPT, Claude, Perplexity, Gemini)
const llms = `# Imagine & Stamp

> Agencia digital en Ciudad de México (Iztapalapa) que crea páginas web, menús digitales QR con pedidos por WhatsApp, invitaciones digitales y tarjetas digitales para negocios y familias. Atiende ${ZONAS}. Trabaja a distancia, con atención directa por WhatsApp (+52 56 5046 9993), un solo pago y sin comisiones por pedido.

- Sitio: ${SITE}/
- WhatsApp: https://wa.me/${WA}
- Correo: imagineandstamp@gmail.com
- Horario: lunes a viernes 9:00-19:00, sábado 10:00-15:00 (hora de CDMX)
- Sin local de atención al público: negocio de zona de servicio.

## Servicios

${SERVICIOS.map((s) => `- [${s.h1}](${SITE}/${s.slug}/): ${s.description}`).join('\n')}

## Precios publicados

- Menú digital QR con carrito y pedidos por WhatsApp: $1,650 MXN, un solo pago.
- Apps para negocios (app web): Básico desde $1,650 MXN; Profesional con panel de administración desde $3,490 MXN; a la medida por cotización.
- Invitación digital interactiva: $99 MXN. Video animado: $399 MXN. Historia cinemática: $499 MXN. Protagonista 3D con canción: $699 MXN.
- Páginas web, tarjetas digitales y hosting: cotización por WhatsApp.

## Ejemplos en vivo

${SERVICIOS.flatMap((s) => s.demos).filter((d, i, a) => a.findIndex((x) => x[1] === d[1]) === i).map(([t, h]) => `- [${t}](${h.startsWith('http') ? h : SITE + h})`).join('\n')}
`;
writeFileSync(join(ROOT, 'public', 'llms.txt'), llms);
console.log('✓ llms.txt');

// IndexNow: avisa a Bing (fuente de ChatGPT y Copilot), Yandex y otros cuando cambian las páginas.
// Correr con --avisar DESPUÉS de que el deploy esté en línea.
const INDEXNOW_KEY = 'b7e4c2a9f1d84e6c9a3b5d7f2e8c1a46';
writeFileSync(join(ROOT, 'public', `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);
if (process.argv.includes('--avisar')) {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'imagineandstamp.site',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
      urlList: [...urls.map(([p]) => `${SITE}${p}`), `${SITE}/llms.txt`],
    }),
  });
  console.log('IndexNow:', res.status, res.status < 300 ? 'aceptado' : await res.text());
}
