// Auto-generated image map for Tacos Chepe products
// Uses Vite's import.meta.glob to eagerly import all WebP images

const imageModules = import.meta.glob<{ default: string }>(
  './assets/productos/*.webp',
  { eager: true, import: 'default' }
);

function getImage(filename: string): string {
  const key = `./assets/productos/${filename}`;
  return imageModules[key] || '';
}

// Map product IDs to the closest matching product image
const productImageMap: Record<string, string> = {
  // ── Tacos ──
  't-arrachera': getImage('TACO-ARRACHERA.webp'),
  't-picana': getImage('TACO-PICAÑA.webp'),
  't-bistec': getImage('TACO-BISTEC.webp'),
  't-suadero': getImage('TACO-SUADERO.webp'),
  't-chorizo': getImage('TACO-CHORIZOARGENTINO.webp'),
  't-chistorra': getImage('TACO-CHISTORRA.webp'),
  't-longaniza': getImage('TACO-CHILTEPIN.webp'),
  't-campechano': getImage('TACO-CAMPECHANO-BISTEC.webp'),
  't-pollo': getImage('TACO-PECHUGA.webp'),
  't-vegetariano': getImage('TACO-ALAMBRE.webp'),
  't-chepekan': getImage('TACO-CHEPE-ESPECIAL.webp'),
  't-chepe-esp': getImage('TACO-CHEPE-ESPECIAL.webp'),
  't-aguja': getImage('TACO-ARRACHERA.webp'),
  't-ribeye': getImage('TACO-ARRACHERA.webp'),
  't-alambre': getImage('TACO-ALAMBRE.webp'),

  // ── Especiales (con queso) ──
  'e-quesocarne': getImage('QUESOCARNE.webp'),
  'e-arraqueso': getImage('ARRAQUESO.webp'),
  'e-suaqueso': getImage('QUESOTRIPA.webp'),
  'e-argentiqueso': getImage('CHORIQUESO.webp'),
  'e-chistoqueso': getImage('CHORIQUESO.webp'),
  'e-choriqueso': getImage('CHORIQUESO.webp'),
  'e-campechaqueso': getImage('QUESOCARNE (2).webp'),
  'e-pechuqueso': getImage('PASTORQUESO.webp'),
  'e-pichistorra': getImage('CHORIQUESO.webp'),
  'e-picanaqueso': getImage('ARRAQUESO.webp'),
  'e-pechucarne': getImage('QUESOCARNE.webp'),

  // ── Tortas ──
  'to-suadero': getImage('TORTA-SUADERO.webp'),
  'to-bistec': getImage('TORTA-BISTEC.webp'),
  'to-longaniza': getImage('TORTA-LONGANIZA-CHILPETIN.webp'),
  'to-pechuga': getImage('TORTA-PECHUGA.webp'),
  'to-arrachera': getImage('TORTA-ARRACHERA.webp'),
  'to-picana': getImage('TORTA-ARRACHERA.webp'),
  'to-campechana': getImage('TORTA-CAMPECHANA.webp'),

  // ── Paquetes ──
  'p-1': getImage('TACO-ARRACHERA.webp'),
  'p-2': getImage('TACO-PICAÑA.webp'),
  'p-3': getImage('TACO-CAMPECHANO-BISTEC.webp'),
  'p-4': getImage('TACO-SUADERO.webp'),
  'p-5': getImage('TORTA-CAMPECHANA.webp'),
  'p-6': getImage('TORTA-ARRACHERA.webp'),
  'p-7': getImage('TORTA-SUADERO.webp'),
  'p-8': getImage('GRINGA-ARRACHERA.webp'),
  'p-9': getImage('GRINGA-SUADERO.webp'),
  'p-10': getImage('GRINGA-CAMPECHANO.webp'),
  'p-11': getImage('QUESOTRIPA.webp'),
  'p-12': getImage('QUESOCARNE.webp'),
  'p-13': getImage('ARRAQUESO.webp'),
  'p-14': getImage('TACO-ALAMBRE.webp'),
  'p-15': getImage('TACO-ALAMBRE.webp'),
};

// Fallback image for products without a match
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=600&auto=format&fit=crop';

export function getProductImage(productId: string): string {
  return productImageMap[productId] || FALLBACK_IMAGE;
}
