import { useEffect } from 'react';

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

export default function MetaPixelInit() {
  useEffect(() => {
    if (!PIXEL_ID || PIXEL_ID === 'undefined') return;

    // Se carga después de que la página ya se ve (fbevents.js pesa ~200 KB y frenaba el celular).
    // El PageView se sigue registrando; solo se retrasa unos segundos.
    const start = () => {
      if (window.fbq) return;
      loadPixel();
    };
    const schedule = () => setTimeout(start, 2500);
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
  }, []);

  return null;
}

function loadPixel() {
  const el = document.createElement('script');
  el.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`;
  document.head.appendChild(el);

  const noscript = document.createElement('noscript');
  const img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style.display = 'none';
  img.src = `https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.body.insertBefore(noscript, document.body.firstChild);
}
