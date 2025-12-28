export type Point2D = { x: number; y: number };
export type Polyline = Point2D[];
export type Room = {
  outline: Polyline;
  elevation: number;
  height: number;
};
export type Wall = {
  start: Point2D;
  end: Point2D;
  height: number;
  thickness: number;
};
export type Footprint = {
  outline: Polyline;
  metadata?: Record<string, unknown>;
};
export type Road = { centerline: Polyline; width: number };
export type Plan = {
  rooms: Room[];
  walls: Wall[];
  footprints: Footprint[];
  roads: Road[];
  gridSize: number;
};
export type Block = {
  name: string;
  weight?: number;
};
export type PaletteRule = {
  selector: 'wall' | 'roof' | 'window' | 'ground' | 'interior';
  pattern: string;
  blocks: Block[];
};
export type RuleSet = {
  name: string;
  style: 'modern' | 'medieval' | 'industrial';
  rules: PaletteRule[];
};
export type ChunkCoordinate = { x: number; z: number };
export type ChunkedMesh = {
  chunk: ChunkCoordinate;
  vertices: Float32Array;
  indices: Uint32Array;
  uvs: Float32Array;
};
export type CachedGeometry = {
  hash: string;
  mesh: ChunkedMesh[];
};
