import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const artifactsDir = 'C:/Users/RF/.gemini/antigravity-ide/brain/e0b4b4cc-e2ce-44da-be14-a0c25bb00105';

// Mini static server
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }
  let filePath = path.join(publicDir, reqPath);
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    filePath = path.join(publicDir, reqPath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

await new Promise(resolve => server.listen(4173, resolve));
console.log('Static test server running at http://localhost:4173');

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const pages = [
  'menu-digital',
  'aplicaciones-para-negocios',
  'paginas-web',
  'hosting-y-dominio',
  'invitaciones-digitales',
  'tarjetas-digitales'
];

let allOk = true;

for (const slug of pages) {
  const url = `http://localhost:4173/${slug}/`;
  
  // Mobile test (390 x 844)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobilePage.goto(url, { waitUntil: 'networkidle0' });
  
  const mobileScrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  const mobileHasOverflow = mobileScrollWidth > 390;
  console.log(`[Mobile 390px] /${slug}/ - scrollWidth: ${mobileScrollWidth}px ${mobileHasOverflow ? '❌ OVERFLOW' : '✅ OK'}`);
  if (mobileHasOverflow) allOk = false;

  const mobileShotPath = path.join(artifactsDir, `screenshot_${slug}_mobile.png`);
  await mobilePage.screenshot({ path: mobileShotPath, fullPage: true });
  await mobilePage.close();

  // Desktop test (1366 x 800)
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1366, height: 800 });
  await desktopPage.goto(url, { waitUntil: 'networkidle0' });

  const desktopScrollWidth = await desktopPage.evaluate(() => document.documentElement.scrollWidth);
  const desktopHasOverflow = desktopScrollWidth > 1366;
  console.log(`[Desktop 1366px] /${slug}/ - scrollWidth: ${desktopScrollWidth}px ${desktopHasOverflow ? '❌ OVERFLOW' : '✅ OK'}`);
  if (desktopHasOverflow) allOk = false;

  const desktopShotPath = path.join(artifactsDir, `screenshot_${slug}_desktop.png`);
  await desktopPage.screenshot({ path: desktopShotPath, fullPage: true });
  await desktopPage.close();
}

await browser.close();
server.close();

console.log('\n--- Resultado verificación ---');
if (allOk) {
  console.log('✅ TODAS las páginas pasaron la prueba responsive sin desbordamiento horizontal.');
} else {
  console.error('❌ Hubo desbordamientos horizontales. Revisa el CSS.');
  process.exit(1);
}
