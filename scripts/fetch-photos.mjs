import fs from 'node:fs/promises';
import sharp from 'sharp';
import { photos } from '../content/photos.js';
await fs.mkdir('public/images', { recursive: true });
for (const photo of photos) {
  const destination = `public/images/${photo.file}`;
  try { await fs.access(destination); continue; } catch {}
  const response = await fetch(photo.download, { headers: { 'User-Agent': 'CyclonicToursWebsite/1.0 (licensed photography download)' } });
  if (!response.ok) throw new Error(`Photo download failed: ${response.status} ${photo.id}`);
  const input = Buffer.from(await response.arrayBuffer());
  await sharp(input).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 84 }).toFile(destination);
  console.log('Saved', destination);
}
