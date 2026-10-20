// Genera las páginas de servicio estáticas (SEO) en public/<slug>/index.html.
// La app usa HashRouter (/#/ruta) y Google solo indexa la portada; estas páginas
// tienen URL real, texto en el HTML y schema propio para posicionar cada servicio.
// Uso: node scripts/generar-paginas-seo.mjs  (después: commit + push)
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
      ['Vicma Laser · corte láser industrial', '/#/vicma-laser'],
      ['Strong Gym · catálogo con pedidos', '/#/strong-gym'],
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
    beneficios: [
      ['Tu nombre en internet', 'Te ayudamos a elegir y registrar tu dominio .com, .mx, .com.mx o .site.'],
      ['Candado de seguridad', 'Tu página carga con https, que da confianza y Google lo toma en cuenta.'],
      ['Correo con tu marca', 'Configuramos un correo tipo contacto@tunegocio.com para que te vean profesional.'],
      ['Te avisamos antes de vencer', 'Llevamos el control de renovaciones para que tu página nunca se caiga por un pago olvidado.'],
    ],
    secciones: [
      ['Qué hacemos por ti', [
        'Revisamos si el dominio que quieres está libre y te damos opciones.',
        'Lo registramos a tu nombre: el dominio es tuyo, no nuestro.',
        'Conectamos el dominio al hosting y a tu página (DNS, https y redirecciones).',
        'Movemos tu página si ya la tienes en otro proveedor.',
        'Conectamos tu menú digital o tarjeta digital a tu propio dominio.',
      ]],
      ['¿Ya tienes dominio y no sabes qué hacer con él?', [
        'Si compraste un dominio y quedó "estacionado", lo conectamos a una página nueva o a tu menú digital.',
        'Si tu página anterior se cayó o la persona que la hizo ya no contesta, te ayudamos a recuperarla.',
      ]],
    ],
    demos: [
      ['Takero\'s CDMX · menú en subdominio propio', 'https://takeros-cdmx.imagineandstamp.site'],
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
      ['Candymar · mariscos', '/#/candymar'],
      ['La Cueva del Lobo', '/#/la-cueva-del-lobo'],
      ['Brothers Pizza', '/#/brothers-pizza'],
      ['Aaah! Carbón', '/#/aaah-carbon'],
      ['Strong Gym · catálogo', '/#/strong-gym'],
      ['Takero\'s CDMX', 'https://takeros-cdmx.imagineandstamp.site'],
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
    beneficios: [
      ['Confirman con un toque', 'Botón que abre WhatsApp con el mensaje de confirmación ya escrito.'],
      ['Llegan sin perderse', 'Botón con la ubicación exacta del salón en Google Maps.'],
      ['Sin imprimir', 'Se manda a todos tus contactos y grupos en segundos.'],
      ['Tu hijo de protagonista', 'En la versión 3D, lo convertimos en personaje animado que invita a su fiesta.'],
    ],
    secciones: [
      ['Precios de invitaciones digitales', [
        'Invitación interactiva: $99 MXN. Diseño temático, botones de WhatsApp y Google Maps.',
        'Video animado: $399 MXN. Video corto con la temática de la fiesta.',
        'Historia cinemática: $499 MXN. Video con escenas tipo película.',
        'Protagonista 3D con canción original: $699 MXN. Tu hijo como personaje animado, con canción personalizada.',
      ]],
      ['Para qué eventos', [
        'Cumpleaños infantiles y fiestas temáticas.',
        'XV años, bodas, bautizos, primera comunión y baby shower.',
        'Eventos de empresa, inauguraciones y graduaciones.',
      ]],
    ],
    demos: [
      ['Ver ejemplos de video invitaciones', '/#/videoinvitaciones'],
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
    beneficios: [
      ['Todo en una liga', 'Ideal para la bio de Instagram, tu estado de WhatsApp y tu perfil de Google.'],
      ['Agenda citas', 'El cliente elige el servicio y te escribe por WhatsApp con el mensaje listo.'],
      ['Siempre actualizada', 'Cambias precios, horario o teléfono sin reimprimir nada.'],
      ['Con QR', 'Te damos el código QR para tu mostrador, auto, volantes o uniforme.'],
    ],
    secciones: [
      ['Qué lleva tu tarjeta digital', [
        'Logo, foto y descripción de tu negocio.',
        'Lista de servicios con precios.',
        'Botones de WhatsApp, llamada, correo y ubicación en Google Maps.',
        'Redes sociales y galería de trabajos.',
        'Guardar contacto directo en el teléfono del cliente.',
      ]],
      ['Para quién es', [
        'Barberías, estéticas, uñas y spas.',
        'Veterinarias, consultorios y profesionales independientes.',
        'Técnicos, plomeros, electricistas y servicios a domicilio sin local.',
      ]],
    ],
    demos: [
      ['Barbería Gentleman\'s Cut', '/#/tarjeta-barberia'],
      ['Veterinaria Vita Vet', '/#/tarjeta-veterinaria'],
    ],
    faqs: [
      ['¿Qué es una tarjeta digital?', 'Es una mini página para tu celular con tus datos, servicios y botones de contacto. Se comparte con una liga o un código QR.'],
      ['¿Cuánto cuesta?', 'Depende de cuántas secciones lleve. Escríbenos por WhatsApp y te cotizamos con un solo pago.'],
      ['¿Me sirve si trabajo a domicilio?', 'Sí, es de lo más útil para negocios sin local: tus clientes te encuentran y te escriben directo.'],
      ['¿Puedo ponerla en Google Maps?', 'Sí, la liga se agrega como sitio web en tu perfil de Google.'],
    ],
  },
];

const css = `
:root{--navy:#002E5D;--orange:#FF8C00;--cream:#F9F7F2;--ink:#1A1C1C;--muted:#4b5563;--card:#fff;--line:rgba(0,46,93,.1)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,system-ui,sans-serif;background:var(--cream);color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit}
h1,h2,h3,.brand{font-family:Manrope,Inter,sans-serif;color:var(--navy);line-height:1.15;letter-spacing:-.02em}
.wrap{max-width:1040px;margin:0 auto;padding:0 16px}
header{position:sticky;top:0;z-index:10;background:rgba(249,247,242,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.bar{display:flex;align-items:center;justify-content:space-between;gap:12px;height:60px}
.brand{font-weight:800;font-size:18px;text-decoration:none}
.brand span{color:var(--orange)}
nav.top{display:none;gap:18px;font-size:14px;font-weight:500}
nav.top a{text-decoration:none;color:var(--muted)}
nav.top a[aria-current]{color:var(--navy);font-weight:700}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;padding:14px 26px;font-weight:700;font-size:15px;text-decoration:none;transition:transform .2s,box-shadow .2s}
.btn:hover{transform:translateY(-2px)}
.btn-wa{background:#25D366;color:#fff;box-shadow:0 10px 24px -10px rgba(37,211,102,.7)}
.btn-sm{padding:9px 16px;font-size:13px}
.btn-ghost{border:1.5px solid var(--navy);color:var(--navy)}
.crumbs{font-size:13px;color:var(--muted);padding:18px 0 0}
.crumbs a{text-decoration:none}
.hero{padding:28px 0 48px}
.tag{display:inline-block;background:rgba(255,140,0,.12);color:#b45f00;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;padding:6px 12px;border-radius:999px;margin-bottom:16px}
h1{font-size:clamp(30px,6vw,52px);font-weight:800;margin-bottom:16px}
.lead{font-size:clamp(16px,2.2vw,19px);color:var(--muted);max-width:680px;margin-bottom:24px}
.price{font-family:Manrope,sans-serif;font-weight:800;color:var(--navy);font-size:20px;margin-bottom:20px}
.ctas{display:flex;flex-wrap:wrap;gap:12px}
section{padding:40px 0}
h2{font-size:clamp(24px,4vw,34px);font-weight:800;margin-bottom:20px}
.grid{display:grid;grid-template-columns:1fr;gap:14px}
.card{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:22px;box-shadow:0 12px 30px -22px rgba(0,46,93,.4)}
.card h3{font-size:17px;margin-bottom:6px}
.card p{font-size:15px;color:var(--muted)}
ul.list{list-style:none;display:grid;gap:10px}
ul.list li{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 16px 14px 44px;position:relative;font-size:15px}
ul.list li::before{content:"✓";position:absolute;left:16px;top:13px;color:var(--orange);font-weight:800}
.demos{display:flex;flex-wrap:wrap;gap:10px}
.demos a{background:var(--navy);color:#fff;text-decoration:none;border-radius:999px;padding:10px 18px;font-size:14px;font-weight:600}
details{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;margin-bottom:10px}
summary{cursor:pointer;font-weight:700;color:var(--navy);font-family:Manrope,sans-serif}
details p{margin-top:10px;color:var(--muted);font-size:15px}
.cta-box{background:var(--navy);color:#fff;border-radius:28px;padding:36px 22px;text-align:center}
.cta-box h2{color:#fff}
.cta-box p{color:rgba(255,255,255,.8);margin-bottom:22px}
.others{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.others a{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;text-decoration:none;font-weight:600;color:var(--navy);font-size:14px}
footer{border-top:1px solid var(--line);padding:32px 0 96px;font-size:14px;color:var(--muted)}
footer .cols{display:grid;gap:18px}
footer a{text-decoration:none}
.float{position:fixed;right:16px;bottom:16px;z-index:20}
@media(min-width:760px){nav.top{display:flex}.grid{grid-template-columns:1fr 1fr}.others{grid-template-columns:repeat(4,1fr)}footer .cols{grid-template-columns:2fr 1fr 1fr}footer{padding-bottom:40px}}
`;

function pagina(s) {
  const url = `${SITE}/${s.slug}/`;
  const otros = SERVICIOS.filter((o) => o.slug !== s.slug);
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
<link rel="icon" href="/Logo%20imagiene%20and%20stamp.ico" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<style>${css}</style>
</head>
<body>
<header><div class="wrap bar">
  <a class="brand" href="/">Imagine <span>&amp;</span> Stamp</a>
  <nav class="top" aria-label="Servicios">
${SERVICIOS.map((o) => `    <a href="/${o.slug}/"${o.slug === s.slug ? ' aria-current="page"' : ''}>${o.menu}</a>`).join('\n')}
  </nav>
  <a class="btn btn-wa btn-sm" href="${wa(s.msg)}" rel="noopener">WhatsApp</a>
</div></header>

<main class="wrap">
  <p class="crumbs"><a href="/">Inicio</a> › ${s.menu}</p>

  <div class="hero">
    <span class="tag">${ZONAS}</span>
    <h1>${s.h1}</h1>
    <p class="lead">${s.lead}</p>
${s.precioTexto ? `    <p class="price">${s.precioTexto}</p>\n` : ''}    <div class="ctas">
      <a class="btn btn-wa" href="${wa(s.msg)}" rel="noopener">${s.cta}</a>
      <a class="btn btn-ghost" href="#ejemplos">Ver ejemplos</a>
    </div>
  </div>

  <section aria-labelledby="por-que">
    <h2 id="por-que">Por qué funciona</h2>
    <div class="grid">
${s.beneficios.map(([t, d]) => `      <div class="card"><h3>${t}</h3><p>${d}</p></div>`).join('\n')}
    </div>
  </section>

${s.secciones.map(([t, items]) => `  <section>
    <h2>${t}</h2>
    <ul class="list">
${items.map((i) => `      <li>${i}</li>`).join('\n')}
    </ul>
  </section>`).join('\n\n')}

  <section id="ejemplos">
    <h2>Ejemplos reales: pruébalos desde tu celular</h2>
    <div class="demos">
${s.demos.map(([t, h]) => `      <a href="${link(h)}">${t}</a>`).join('\n')}
    </div>
  </section>

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
  <div><p class="brand">Imagine <span style="color:var(--orange)">&amp;</span> Stamp</p>
  <p>Agencia digital en Ciudad de México. Páginas web, menús digitales, tarjetas digitales e invitaciones digitales con atención directa por WhatsApp.</p></div>
  <div><p><strong>Contacto</strong></p>
  <p><a href="https://wa.me/${WA}">WhatsApp 56 5046 9993</a><br><a href="mailto:imagineandstamp@gmail.com">imagineandstamp@gmail.com</a><br>Lun a Vie 9:00–19:00 · Sáb 10:00–15:00</p></div>
  <div><p><strong>Servicios</strong></p>
  <p>${SERVICIOS.map((o) => `<a href="/${o.slug}/">${o.menu}</a>`).join('<br>')}</p></div>
</div></footer>

<a class="btn btn-wa float" href="${wa(s.msg)}" rel="noopener" aria-label="Escribir por WhatsApp">WhatsApp</a>
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

// Sitemap: portada + páginas de servicio + puentes existentes con contenido propio
const urls = [
  ['/', '1.0'],
  ...SERVICIOS.map((s) => [`/${s.slug}/`, '0.9']),
  ['/strong-gym/', '0.5'],
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([p, pr]) => `  <url><loc>${SITE}${p}</loc><lastmod>${HOY}</lastmod><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(ROOT, 'public', 'sitemap.xml'), sitemap);
console.log('✓ sitemap.xml');
readFileSync(join(ROOT, 'public', 'robots.txt'), 'utf8').includes('sitemap.xml') || console.warn('⚠ robots.txt sin Sitemap');
