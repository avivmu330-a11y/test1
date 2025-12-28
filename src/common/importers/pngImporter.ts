import { Buffer } from 'buffer';
import { PNG } from 'pngjs';
import { Plan, Polyline } from '../../types';
import { snapPolyline } from '../utils/grid';

export async function importPng(buffer: Uint8Array, gridSize = 1): Promise<Plan> {
  const png = PNG.sync.read(Buffer.from(buffer));
  const outline = rasterToPolyline(png, gridSize);
  return {
    rooms: outline.length ? [{ outline, elevation: 0, height: 3 }] : [],
    walls: [],
    footprints: outline.length ? [{ outline }] : [],
    roads: [],
    gridSize,
  };
}

function rasterToPolyline(png: PNG, gridSize: number): Polyline {
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
