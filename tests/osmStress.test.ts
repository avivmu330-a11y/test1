import { describe, expect, it } from 'vitest';
import { importGeoJson } from '../src/common/importers/geoImporter';
import { extractWalls, buildChunkedMesh } from '../src/common/geometry/pipeline';

const makeLarge = (count: number) => {
  return {
    type: 'FeatureCollection',
    features: Array.from({ length: count }, (_, i) => ({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [i * 2, 0],
            [i * 2 + 1, 0],
            [i * 2 + 1, 1],
            [i * 2, 1],
            [i * 2, 0],
          ],
        ],
      },
      properties: {},
    })),
  } as const;
};

describe('OSM scale handling', () => {
  it('processes hundreds of footprints without crashing', () => {
    const data = makeLarge(200);
    const plan = extractWalls(importGeoJson(JSON.stringify(data), 1));
    const mesh = buildChunkedMesh(plan, 16);
    expect(mesh.length).toBeGreaterThan(1);
  });
});
