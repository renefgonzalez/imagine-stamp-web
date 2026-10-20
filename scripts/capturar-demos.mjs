// scripts/capturar-demos.mjs
// Captura en celular y desktop los demos para ilustrar las páginas SEO
// Uso: node scripts/capturar-demos.mjs
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'img-servicios');
mkdirSync(OUT_DIR, { recursive: true });

const DEMOS = {
  candymar: '/#/candymar',
  'brothers-pizza': '/#/brothers-pizza',
  'la-cueva-del-lobo': '/#/la-cueva-del-lobo',
  'aaah-carbon': '/#/aaah-carbon',
  'strong-gym': '/#/strong-gym',
  'tarjeta-barberia': '/#/tarjeta-barberia',
  'tarjeta-veterinaria': '/#/tarjeta-veterinaria',
  'vicma-laser': '/#/vicma-laser',
  videoinvitaciones: '/#/videoinvitaciones',
};

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

console.log('Iniciando captura de demos con Puppeteer...');
const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: chromePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();

// 1. Demos en vista móvil (390 x 844)
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

for (const [name, route] of Object.entries(DEMOS)) {
  const url = 'https://imagineandstamp.site' + route;
  console.log(`Capturando ${name} desde ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((ok) => setTimeout(ok, 2500)); // Esperar animaciones
    const png = await page.screenshot();
    const dest = join(OUT_DIR, `${name}.webp`);
    await sharp(png).resize(390).webp({ quality: 72 }).toFile(dest);
    console.log(`✓ ${name}.webp guardado`);
  } catch (err) {
    console.error(`Error capturando ${name}:`, err.message);
  }
}

// 2. Vicma Laser en Desktop (1366 x 800)
console.log('Capturando vicma-laser en desktop...');
await page.setViewport({ width: 1366, height: 800, deviceScaleFactor: 1 });
try {
  await page.goto('https://imagineandstamp.site/#/vicma-laser', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((ok) => setTimeout(ok, 2500));
  const pngDesk = await page.screenshot();
  const destDesk = join(OUT_DIR, 'vicma-laser-desktop.webp');
  await sharp(pngDesk).resize(900).webp({ quality: 72 }).toFile(destDesk);
  console.log('✓ vicma-laser-desktop.webp guardado');
} catch (err) {
  console.error('Error capturando vicma-laser desktop:', err.message);
}

await browser.close();

// 3. Procesar foto de invitaciones
const srcInv = join(ROOT, 'public', 'videoinvitaciones', 'assets', 'carrusel_1.jpg');
const destInv = join(OUT_DIR, 'invitaciones.webp');
if (existsSync(srcInv)) {
  await sharp(srcInv).resize(600).webp({ quality: 75 }).toFile(destInv);
  console.log('✓ invitaciones.webp procesado');
}

// 4. Procesar foto de hosting
const srcHost = join(ROOT, '..', 'Google_Business_Profile', '03_Foto_Servicio_Paginas_Web_Modernas.jpg');
const destHost = join(OUT_DIR, 'hosting.webp');
if (existsSync(srcHost)) {
  await sharp(srcHost).resize(900).webp({ quality: 75 }).toFile(destHost);
  console.log('✓ hosting.webp procesado');
} else {
  // Fallback si no está en la ruta relativa
  const altHost = 'C:/Users/RF/Documents/IMAGINE&STAMP/Google_Business_Profile/03_Foto_Servicio_Paginas_Web_Modernas.jpg';
  if (existsSync(altHost)) {
    await sharp(altHost).resize(900).webp({ quality: 75 }).toFile(destHost);
    console.log('✓ hosting.webp procesado desde fallback');
  }
}

console.log('¡Todas las imágenes de servicios han sido capturadas y optimizadas!');
