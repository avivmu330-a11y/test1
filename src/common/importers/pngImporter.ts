import { Plan, Polyline } from '../../types';
import { snapPolyline } from '../utils/grid';

export async function importPng(buffer: Uint8Array, gridSize = 1): Promise<Plan> {
  const outline = await decodeOutline(buffer, gridSize);
  return {
    rooms: outline.length ? [{ outline, elevation: 0, height: 3 }] : [],
    walls: [],
    footprints: outline.length ? [{ outline }] : [],
    roads: [],
    gridSize,
  };
}

async function decodeOutline(buffer: Uint8Array, gridSize: number): Promise<Polyline> {
  if (typeof window !== 'undefined') {
    const blob = new Blob([Uint8Array.from(buffer)], { type: 'image/png' });
    const image = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, image.width, image.height).data;
    return rasterToPolyline({ width: image.width, height: image.height, data: new Uint8Array(data) }, gridSize);
  }

  const { Buffer } = await import('node:buffer');
  const { PNG } = await import(/* @vite-ignore */ 'pngjs');
  const png = PNG.sync.read(Buffer.from(buffer));
  return rasterToPolyline(png, gridSize);
}

type Raster = { width: number; height: number; data: Uint8Array };

function rasterToPolyline(png: Raster, gridSize: number): Polyline {
  const points: { x: number; y: number }[] = [];
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const alpha = png.data[idx + 3];
      if (alpha > 0) {
        points.push({ x, y });
      }
    }
  }

  if (!points.length) return [];

  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));

  const polyline: Polyline = [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
    { x: minX, y: maxY },
    { x: minX, y: minY },
  ];

  return snapPolyline(polyline, gridSize);
}
