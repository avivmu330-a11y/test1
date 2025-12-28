import { Feature, FeatureCollection, Geometry, Polygon } from 'geojson';
import { Plan, Polyline, Road } from '../../types';
import { snapPolyline } from '../utils/grid';

export function importGeoJson(content: string, gridSize = 1): Plan {
  const parsed = JSON.parse(content) as FeatureCollection | Feature;
  const features = 'features' in parsed ? parsed.features : [parsed];

  const footprints: Polyline[] = [];
  const roads: Road[] = [];

  features.forEach((feature) => {
    const geometry = feature.geometry as Geometry | null;
    if (!geometry) return;

    if (geometry.type === 'Polygon') {
      const polygon = geometry as Polygon;
      const outline = polygon.coordinates[0].map(([x, y]) => ({ x, y }));
      footprints.push(snapPolyline(outline, gridSize));
    }

    if (geometry.type === 'LineString') {
      const coords = geometry.coordinates.map(([x, y]) => ({ x, y }));
      roads.push({ centerline: snapPolyline(coords, gridSize), width: 3 });
    }
  });

  return {
    rooms: footprints.map((outline) => ({ outline, elevation: 0, height: 4 })),
    walls: [],
    footprints: footprints.map((outline) => ({ outline })),
    roads,
    gridSize,
  };
}
