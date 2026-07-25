import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';

const SOURCE = 'C:\\Users\\RF\\Downloads\\Productos-1-001\\Productos';
const DEST = 'C:\\Users\\RF\\Documents\\IMAGINE&STAMP\\Pagina Web\\imagine-and-stamp\\src\\modules\\tacos-chepe\\assets\\productos';

const MAX_WIDTH = 800;
const QUALITY = 80;

async function main() {
  await mkdir(DEST, { recursive: true });

  const files = (await readdir(SOURCE)).filter(f => /\.(jpe?g|png)$/i.test(f));
  console.log(`Found ${files.length} images to compress...`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const srcPath = join(SOURCE, file);
    const outName = basename(file, extname(file)) + '.webp';
    const outPath = join(DEST, outName);

    try {
      await sharp(srcPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(outPath);

      const { size: beforeSize } = await sharp(srcPath).metadata();
      const { size: afterSize } = await sharp(outPath).metadata();
      totalBefore += beforeSize || 0;
      totalAfter += afterSize || 0;

      console.log(`  OK: ${file} → ${outName} (${(beforeSize/1024).toFixed(0)} KB → ${(afterSize/1024).toFixed(0)} KB)`);
    } catch (err) {
      console.error(`  FAIL: ${file} — ${err.message}`);
    }
  }

  console.log(`\nDone! ${files.length} images compressed.`);
  console.log(`Total: ${(totalBefore/1024/1024).toFixed(1)} MB → ${(totalAfter/1024/1024).toFixed(1)} MB (${((1 - totalAfter/totalBefore)*100).toFixed(1)}% reduction)`);
}

main();
