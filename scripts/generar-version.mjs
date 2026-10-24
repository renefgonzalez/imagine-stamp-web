import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const versionData = {
  version: Date.now(),
  buildDate: new Date().toISOString()
};

const publicDir = path.resolve(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const targetPath = path.join(publicDir, 'version.json');
fs.writeFileSync(targetPath, JSON.stringify(versionData, null, 2), 'utf-8');
console.log(`[Auto-Update] version.json generado con éxito: ${versionData.version} (${versionData.buildDate})`);
