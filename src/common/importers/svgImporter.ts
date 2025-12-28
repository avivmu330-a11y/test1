import { Plan, Point2D, Polyline } from '../../types';
import { snapPolyline } from '../utils/grid';

export async function importSvg(svgContent: string, gridSize = 1): Promise<Plan> {
  const doc = await parseDocument(svgContent);
  const paths = Array.from(doc.querySelectorAll<SVGPathElement>('path'));
  const polylines: Polyline[] = paths.flatMap((path) => {
    const d = path.getAttribute('d');
    if (!d) return [];
    return [parsePathToPolyline(d, gridSize)];
  });

  return {
    rooms: polylines.map((outline) => ({ outline, elevation: 0, height: 3 })),
    walls: [],
    footprints: polylines.map((outline) => ({ outline })),
    roads: [],
    gridSize,
  };
}

async function parseDocument(svgContent: string) {
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    return new DOMParser().parseFromString(svgContent, 'image/svg+xml');
  }
  const { JSDOM } = await import(/* @vite-ignore */ 'jsdom');
  return new JSDOM(svgContent).window.document;
}

function parsePathToPolyline(d: string, gridSize: number): Polyline {
  const commands = d.match(/[a-df-z][^a-df-z]*/gi) || [];
  const points: Point2D[] = [];
  let current: Point2D = { x: 0, y: 0 };

  commands.forEach((cmd) => {
    const type = cmd[0];
    const coords = cmd
      .slice(1)
      .trim()
      .split(/[ ,]+/)
      .map(Number);

    if (type.toLowerCase() === 'm' || type.toLowerCase() === 'l') {
      for (let i = 0; i < coords.length; i += 2) {
        const x = coords[i] + (type === 'm' ? current.x : 0);
        const y = coords[i + 1] + (type === 'm' ? current.y : 0);
        current = { x, y };
        points.push(current);
      }
    }
  });

  return snapPolyline(points, gridSize);
}
