#!/usr/bin/env node

/**
 * Script para comprimir todas las imágenes existentes en Supabase Storage
 * Uso: node scripts/compress-existing-images.js
 *
 * Requiere: npm install @supabase/supabase-js sharp
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar credenciales desde .env o argumentos
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.argv[2];
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.argv[3];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Uso: VITE_SUPABASE_URL=xxx VITE_SUPABASE_ANON_KEY=yyy node scripts/compress-existing-images.js');
  console.error('O: node scripts/compress-existing-images.js <URL> <KEY>');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Configuración
const BUCKETS = ['product-images']; // Ajusta según tus buckets
const QUALITY = 70; // Calidad JPEG (0-100)
const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
const TEMP_DIR = path.join(__dirname, '..', '.tmp-compress');

async function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

async function listImagesInBucket(bucketName) {
  console.log(`\n📂 Listando imágenes en bucket: ${bucketName}`);
  const { data, error } = await supabase.storage.from(bucketName).list('', {
    limit: 1000,
    offset: 0
  });

  if (error) {
    console.error(`❌ Error listando bucket: ${error.message}`);
    return [];
  }

  // Filtrar solo archivos de imagen
  return (data || []).filter(file => {
    const ext = path.extname(file.name).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && !file.name.startsWith('.');
  });
}

async function downloadFile(bucketName, filePath) {
  const { data, error } = await supabase.storage.from(bucketName).download(filePath);

  if (error) {
    throw new Error(`Error descargando ${filePath}: ${error.message}`);
  }

  return data;
}

async function compressImageBuffer(imageData, originalSize) {
  try {
    // Convertir Blob a Buffer si es necesario
    let imageBuffer = imageData;
    if (imageData instanceof Blob) {
      imageBuffer = Buffer.from(await imageData.arrayBuffer());
    } else if (!Buffer.isBuffer(imageBuffer)) {
      imageBuffer = Buffer.from(imageData);
    }

    const compressed = await sharp(imageBuffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: QUALITY, progressive: true })
      .toBuffer();

    const savings = ((1 - compressed.length / imageBuffer.length) * 100).toFixed(1);

    return {
      buffer: compressed,
      originalSize,
      compressedSize: compressed.length,
      savings
    };
  } catch (err) {
    throw new Error(`Error comprimiendo imagen: ${err.message}`);
  }
}

async function uploadFile(bucketName, filePath, fileBuffer) {
  const { error } = await supabase.storage
    .from(bucketName)
    .update(filePath, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
      cacheControl: '3600'
    });

  if (error) {
    throw new Error(`Error subiendo ${filePath}: ${error.message}`);
  }
}

async function compressBucket(bucketName) {
  console.log(`\n🔄 Comprimiendo bucket: ${bucketName}`);

  const images = await listImagesInBucket(bucketName);

  if (images.length === 0) {
    console.log(`⚠️  No se encontraron imágenes en ${bucketName}`);
    return;
  }

  console.log(`📸 Encontradas ${images.length} imágenes\n`);

  let successCount = 0;
  let totalOriginal = 0;
  let totalCompressed = 0;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const progress = `[${i + 1}/${images.length}]`;

    try {
      process.stdout.write(`${progress} Procesando ${image.name}... `);

      // Descargar
      const imageData = await downloadFile(bucketName, image.name);
      const originalSize = imageData.size;

      // Comprimir
      const { buffer, compressedSize, savings } = await compressImageBuffer(
        imageData,
        originalSize
      );

      // Subir reemplazando
      await uploadFile(bucketName, image.name, buffer);

      console.log(`✅ ${(originalSize / 1024).toFixed(1)} KB → ${(compressedSize / 1024).toFixed(1)} KB (${savings}% menos)`);

      successCount++;
      totalOriginal += originalSize;
      totalCompressed += compressedSize;
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }
  }

  console.log(`\n📊 Resumen ${bucketName}:`);
  console.log(`   ✅ Procesadas: ${successCount}/${images.length}`);
  console.log(`   📦 Antes: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   📉 Después: ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   ✨ Ahorro total: ${((1 - totalCompressed / totalOriginal) * 100).toFixed(1)}%`);
}

async function main() {
  console.log('🚀 Iniciando compresión de imágenes existentes en Supabase...\n');

  await ensureTempDir();

  for (const bucketName of BUCKETS) {
    await compressBucket(bucketName);
  }

  // Limpiar temp
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }

  console.log('\n✅ ¡Listo! Todas las imágenes han sido comprimidas.\n');
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
