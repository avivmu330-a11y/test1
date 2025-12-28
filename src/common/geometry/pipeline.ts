import earcut from 'earcut';
import { ChunkCoordinate, ChunkedMesh, Plan, Point2D, Polyline } from '../../types';
import { snapPolyline } from '../utils/grid';

export function extractWalls(plan: Plan, thickness = 0.5, height = 4) {
  const walls = plan.footprints.flatMap((footprint) =>
    footprint.outline.slice(0, -1).map((start, idx) => {
      const end = footprint.outline[idx + 1];
      return { start, end, height, thickness };
    }),
  );
  return { ...plan, walls };
}

export function extrudeFootprint(outline: Polyline, height: number) {
  const vertices: number[] = [];
  const flat = outline.flatMap((p) => [p.x, p.y]);
  const indices = earcut(flat);
  indices.forEach((i: number) => {
    vertices.push(outline[i].x, 0, outline[i].y);
    vertices.push(outline[i].x, height, outline[i].y);
  });
  return new Float32Array(vertices);
}

export function chunkFor(point: Point2D, chunkSize = 16): ChunkCoordinate {
  return { x: Math.floor(point.x / chunkSize), z: Math.floor(point.y / chunkSize) };
}

export function buildChunkedMesh(plan: Plan, chunkSize = 16): ChunkedMesh[] {
  const chunkMap = new Map<string, { chunk: ChunkCoordinate; vertices: number[]; indices: number[]; uvs: number[] }>();

  plan.footprints.forEach((footprint) => {
    const outline = snapPolyline(footprint.outline, plan.gridSize);
    const extrusion = extrudeFootprint(outline, 4);
    const chunk = chunkFor(outline[0], chunkSize);
    const key = `${chunk.x}:${chunk.z}`;
    if (!chunkMap.has(key)) {
      chunkMap.set(key, { chunk, vertices: [], indices: [], uvs: [] });
    }
    const entry = chunkMap.get(key)!;
    const baseIndex = entry.vertices.length / 3;
    entry.vertices.push(...Array.from(extrusion));
    entry.indices.push(...Array.from({ length: extrusion.length / 3 }, (_, i) => baseIndex + i));
    entry.uvs.push(...outline.flatMap((p) => [p.x, p.y]));
  });

  return Array.from(chunkMap.values()).map((entry) => ({
    chunk: entry.chunk,
    vertices: new Float32Array(entry.vertices),
    indices: Uint32Array.from(entry.indices),
    uvs: new Float32Array(entry.uvs),
  }));
}
