import { describe, expect, it } from 'vitest';
import { importGeoJson } from '../src/common/importers/geoImporter';
import { extractWalls, buildChunkedMesh } from '../src/common/geometry/pipeline';
import { schemExport, worldExport } from '../src/common/exporters/worldExporter';
import { addDetailing } from '../src/common/detailing/detailing';
import { listPresets } from '../src/common/rules/palette';
import fs from 'fs';
import path from 'path';

const fixturePath = path.join(__dirname, 'fixtures', 'sample.geojson');
const geojson = fs.readFileSync(fixturePath, 'utf-8');
const plan = extractWalls(importGeoJson(geojson, 1));

describe('geometry pipeline', () => {
  it('creates walls from footprints', () => {
    expect(plan.walls.length).toBeGreaterThan(0);
  });

  it('builds chunked meshes', () => {
    const chunks = buildChunkedMesh(plan, 16);
    expect(chunks.length).toBe(1);
    expect(chunks[0].vertices.length).toBeGreaterThan(0);
  });
});

describe('detailing', () => {
  it('adds furniture and vegetation placements', () => {
    const detail = addDetailing(plan);
    expect(detail.furniture.length).toBe(plan.rooms.length);
    expect(detail.vegetation.length).toBe(plan.footprints.length);
  });
});

describe('exporters', () => {
  const rules = listPresets()[0];

  it('produces a schem payload that matches fixture expectations', () => {
    const buffer = schemExport(plan, rules);
    const parsed = JSON.parse(buffer.toString('utf-8'));
    expect(parsed.metadata.type).toBe('schem');
    expect(parsed.palette.length).toBe(plan.rooms.length);
    expect(parsed.mesh).toBeGreaterThan(0);
  });

  it('supports java or bedrock toggle world exports', () => {
    const java = worldExport(plan, { bedrock: false }, rules);
    const bedrock = worldExport(plan, { bedrock: true }, rules);
    const javaJson = JSON.parse(java.toString('utf-8'));
    const bedrockJson = JSON.parse(bedrock.toString('utf-8'));
    expect(javaJson.version).toBe('java');
    expect(bedrockJson.version).toBe('bedrock');
  });
});
