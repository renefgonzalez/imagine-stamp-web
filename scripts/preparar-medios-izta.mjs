import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const require = createRequire('C:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-and-stamp/package.json');
const sharp = require('sharp');
const exifr = require('exifr');

const CLIENT_DIR = 'C:/Users/RF/Documents/IMAGINE&STAMP/Proyectos Web Clientes/izta-popo-demo';
const FOTOS_SRC = fs.existsSync(path.join(CLIENT_DIR, 'material-cliente/fotos')) && fs.readdirSync(path.join(CLIENT_DIR, 'material-cliente/fotos')).length > 0
  ? path.join(CLIENT_DIR, 'material-cliente/fotos')
  : path.join(CLIENT_DIR, 'material-ejemplo/fotos');

const VIDEOS_SRC = fs.existsSync(path.join(CLIENT_DIR, 'material-cliente/videos')) && fs.readdirSync(path.join(CLIENT_DIR, 'material-cliente/videos')).length > 0
  ? path.join(CLIENT_DIR, 'material-cliente/videos')
  : path.join(CLIENT_DIR, 'material-ejemplo/videos');

const OUT_BASE = 'C:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-and-stamp/public/izta-popo/media';
const OUT_FOTOS = path.join(OUT_BASE, 'fotos');
const OUT_DZI = path.join(OUT_BASE, 'dzi');
const OUT_ORIGINALES = path.join(OUT_BASE, 'originales');
const OUT_VIDEOS = path.join(OUT_BASE, 'video');

for (const dir of [OUT_FOTOS, OUT_DZI, OUT_ORIGINALES, OUT_VIDEOS]) {
  fs.mkdirSync(dir, { recursive: true });
}

console.log('--- PROCESANDO FOTOS ---');
console.log('Fuente:', FOTOS_SRC);
const fotoFiles = fs.readdirSync(FOTOS_SRC).filter(f => /\.(jpe?g|png|webp|tiff?)$/i.test(f));

for (const file of fotoFiles) {
  const filePath = path.join(FOTOS_SRC, file);
  const baseName = path.parse(file).name;
  console.log(`\nProcesando foto: ${file}`);

  const origStats = fs.statSync(filePath);
  const image = sharp(filePath);
  const metadata = await image.metadata();
  const mp = ((metadata.width * metadata.height) / 1000000).toFixed(1);
  console.log(`  Dimensiones: ${metadata.width}x${metadata.height} (~${mp} MP), Peso orig: ${(origStats.size / 1024 / 1024).toFixed(2)} MB`);

  // Copiar original
  fs.copyFileSync(filePath, path.join(OUT_ORIGINALES, file));

  // Generar 480 webp
  await sharp(filePath)
    .resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: 70 })
    .toFile(path.join(OUT_FOTOS, `${baseName}-480.webp`));

  // Generar 1280 webp
  await sharp(filePath)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(OUT_FOTOS, `${baseName}-1280.webp`));

  // Generar 2560 webp
  await sharp(filePath)
    .resize({ width: 2560, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(OUT_FOTOS, `${baseName}-2560.webp`));

  // Generar DZI tiles
  try {
    const dziOut = path.join(OUT_DZI, baseName);
    await sharp(filePath)
      .tile({ size: 512, layout: 'dz' })
      .toFile(dziOut);
    console.log(`  DZI generado en: ${baseName}.dzi`);
  } catch (err) {
    console.warn(`  Aviso al generar DZI para ${file}:`, err.message);
  }

  // EXIF GPS
  try {
    const gps = await exifr.gps(filePath);
    if (gps && gps.latitude && gps.longitude) {
      console.log(`  GPS encontrado: [${gps.longitude.toFixed(5)}, ${gps.latitude.toFixed(5)}]`);
    }
  } catch (err) {
    // ignora
  }
}

console.log('\n--- PROCESANDO VIDEOS CON FFMPEG ---');
console.log('Fuente:', VIDEOS_SRC);
const videoFiles = fs.readdirSync(VIDEOS_SRC).filter(f => /\.(mp4|mov|webm|mkv)$/i.test(f));

for (const file of videoFiles) {
  const filePath = path.join(VIDEOS_SRC, file);
  const baseName = path.parse(file).name;
  console.log(`\nProcesando video: ${file}`);

  const origStats = fs.statSync(filePath);
  console.log(`  Peso original: ${(origStats.size / 1024 / 1024).toFixed(2)} MB`);

  // 1. Poster
  const posterPath = path.join(OUT_VIDEOS, `${baseName}-poster.webp`);
  try {
    execSync(`ffmpeg -y -ss 00:00:02 -i "${filePath}" -vframes 1 -q:v 75 "${posterPath}"`, { stdio: 'ignore' });
    console.log(`  Poster generado: ${baseName}-poster.webp`);
  } catch (e) {
    console.warn('  Error al generar poster:', e.message);
  }

  // 2. Video ligero (720p H264 faststart)
  const ligeroPath = path.join(OUT_VIDEOS, `${baseName}-ligero.mp4`);
  try {
    execSync(`ffmpeg -y -i "${filePath}" -vf "scale=w=1280:h=720:force_original_aspect_ratio=decrease" -c:v libx264 -crf 26 -preset fast -movflags +faststart -c:a aac -b:a 128k -t 30 "${ligeroPath}"`, { stdio: 'ignore' });
    console.log(`  Video ligero generado: ${baseName}-ligero.mp4`);
  } catch (e) {
    console.warn('  Error al generar video ligero:', e.message);
  }

  // 3. Video alta (1080p H264 faststart)
  const altaPath = path.join(OUT_VIDEOS, `${baseName}-alta.mp4`);
  try {
    execSync(`ffmpeg -y -i "${filePath}" -vf "scale=w=1920:h=1080:force_original_aspect_ratio=decrease" -c:v libx264 -crf 20 -preset fast -movflags +faststart -c:a aac -b:a 192k -t 30 "${altaPath}"`, { stdio: 'ignore' });
    console.log(`  Video alta generado: ${baseName}-alta.mp4`);
  } catch (e) {
    console.warn('  Error al generar video alta:', e.message);
  }

  // 4. Video original recortado a 15s para demo (<25MB)
  const ext = path.extname(file);
  const origTrimmedPath = path.join(OUT_VIDEOS, `${baseName}-original${ext}`);
  try {
    execSync(`ffmpeg -y -ss 00:00:00 -i "${filePath}" -t 15 -c copy "${origTrimmedPath}"`, { stdio: 'ignore' });
    console.log(`  Video original (15s demo) generado: ${baseName}-original${ext}`);
  } catch (e) {
    console.warn('  Error al recortar original:', e.message);
  }

  // 5. Si es el video de volcanes en avión, generar hero-ligero.mp4
  if (baseName.includes('avion') || baseName.includes('hero') || baseName.includes('volcanes')) {
    const heroPath = path.join(OUT_VIDEOS, 'hero-ligero.mp4');
    try {
      execSync(`ffmpeg -y -i "${filePath}" -vf "scale=w=1920:h=1080:force_original_aspect_ratio=decrease" -c:v libx264 -crf 28 -an -t 15 -movflags +faststart "${heroPath}"`, { stdio: 'ignore' });
      console.log(`  hero-ligero.mp4 generado con éxito`);
    } catch (e) {
      console.warn('  Error al generar hero-ligero:', e.message);
    }
  }
}

console.log('\n--- PROCESAMIENTO DE MEDIOS COMPLETADO ---');
