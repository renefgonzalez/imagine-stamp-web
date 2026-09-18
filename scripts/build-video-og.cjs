const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createOgImage() {
  const width = 1200;
  const height = 630;

  // Ensure public/demo-video directory exists
  const publicDir = path.resolve('public');
  const demoVideoDir = path.resolve('public/demo-video');
  if (!fs.existsSync(demoVideoDir)) {
    fs.mkdirSync(demoVideoDir, { recursive: true });
  }

  // Copy video
  fs.copyFileSync(
    path.resolve('../scratch/video_anuncio_3d.mp4'),
    path.join(demoVideoDir, 'video-muestra.mp4')
  );
  console.log('Video copied to public/demo-video/video-muestra.mp4');

  // Resize extracted frame to fit inside 630 height
  const framePath = path.resolve('../scratch/frame_3d.jpg');
  const resizedFrame = await sharp(framePath)
    .resize({ height: 580, fit: 'cover' })
    .toBuffer();

  const svgOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e1b4b" />
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#60a5fa" />
        <stop offset="100%" stop-color="#c084fc" />
      </linearGradient>
      <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#ef4444" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="30" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#bg)" />

    <!-- Glow circles -->
    <circle cx="950" cy="315" r="220" fill="#6366f1" opacity="0.25" filter="url(#glow)" />
    <circle cx="200" cy="150" r="180" fill="#3b82f6" opacity="0.15" filter="url(#glow)" />

    <!-- Left Content -->
    <g transform="translate(80, 80)">
      <!-- Badge -->
      <rect x="0" y="0" width="310" height="42" rx="21" fill="url(#badgeGrad)" opacity="0.95" />
      <text x="155" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#ffffff" text-anchor="middle">
        🔥 DESDE SOLO $249 MXN
      </text>

      <!-- Main Title -->
      <text x="0" y="115" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="900" fill="#ffffff">
        Videos Animados 3D
      </text>
      <text x="0" y="175" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="900" fill="url(#textGrad)">
        con Personajes Pixar
      </text>

      <!-- Subtitle -->
      <text x="0" y="235" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="500" fill="#cbd5e1">
        Locución profesional mexicana para Reels y TikTok
      </text>

      <!-- Pillars / Features -->
      <g transform="translate(0, 275)">
        <rect x="0" y="0" width="560" height="150" rx="16" fill="#1e293b" fill-opacity="0.7" stroke="#334155" stroke-width="1.5" />
        <text x="25" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="600" fill="#f8fafc">
          📸 Hecho de una foto tuya, de tu mascota o desde cero
        </text>
        <text x="25" y="82" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="600" fill="#f8fafc">
          🎙️ Con guion vendedor y voz profesional personalizada
        </text>
        <text x="25" y="122" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="600" fill="#38bdf8">
          ⚡ Entrega rápida en 3 días • Imagine &amp; Stamp
        </text>
      </g>
    </g>
  </svg>
  `;

  // Composite background, svg overlay and character frame
  const bg = await sharp(Buffer.from(svgOverlay)).png().toBuffer();

  const finalImage = await sharp(bg)
    .composite([
      {
        input: resizedFrame,
        top: 25,
        left: 820,
      }
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(publicDir, 'og-video-demo.jpg'));

  console.log('og-video-demo.jpg created successfully in public/');
}

createOgImage().catch(console.error);
