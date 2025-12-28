import { Point2D, Polyline } from '../../types';

export function snap(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function snapPoint(point: Point2D, gridSize: number): Point2D {
  return { x: snap(point.x, gridSize), y: snap(point.y, gridSize) };
}

export function snapPolyline(polyline: Polyline, gridSize: number): Polyline {
  return polyline.map((p) => snapPoint(p, gridSize));
}
