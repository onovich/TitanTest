import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { PORTRAITS } from '../src/data/portraits.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const selectedOutputDir = path.join(publicDir, 'portraits-selected');

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseObjectPosition(position = 'center') {
  const normalized = `${position}`.trim().toLowerCase();
  const parts = normalized.split(/\s+/);

  const parsePart = (part, fallback) => {
    if (!part) return fallback;
    if (part === 'left' || part === 'top') return 0;
    if (part === 'center') return 50;
    if (part === 'right' || part === 'bottom') return 100;
    if (part.endsWith('%')) return Number(part.replace('%', ''));
    const numeric = Number(part);
    return Number.isFinite(numeric) ? numeric : fallback;
  };

  if (parts.length === 1) {
    return { x: 50, y: parsePart(parts[0], 50) };
  }

  return {
    x: parsePart(parts[0], 50),
    y: parsePart(parts[1], 50),
  };
}

function computeSquareCrop(metadata, objectPosition) {
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const side = Math.min(width, height);
  const { x, y } = parseObjectPosition(objectPosition);
  const centerX = width * (x / 100);
  const centerY = height * (y / 100);

  const left = Math.round(clamp(centerX - side / 2, 0, width - side));
  const top = Math.round(clamp(centerY - side / 2, 0, height - side));

  return { left, top, width: side, height: side };
}

async function main() {
  await mkdir(selectedOutputDir, { recursive: true });

  const selectedPortraits = Object.values(PORTRAITS).filter((portrait) => portrait.selected?.sourceSrc);

  for (const portrait of selectedPortraits) {
    const sourcePath = path.join(publicDir, portrait.selected.sourceSrc.replace(/^\//, ''));
    const outputPath = path.join(selectedOutputDir, `${portrait.assetDir}.png`);
    const image = sharp(sourcePath, { failOn: 'none' });
    const metadata = await image.metadata();
    const crop = computeSquareCrop(metadata, portrait.selected.objectPosition ?? 'center');

    await image
      .extract(crop)
      .resize(640, 640)
      .png()
      .toFile(outputPath);
  }

  console.log(`已生成 ${selectedPortraits.length} 张筛选后的成品头像。`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});