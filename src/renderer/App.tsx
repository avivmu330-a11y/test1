import { useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useAppState } from './state/store';
import { PlanPane } from './components/PlanPane';
import { Viewport3D } from './components/Viewport3D';

export function App() {
  const { plan, setPlan } = useAppState();
  useEffect(() => {
    if (!plan.rooms.length) {
      const seed = `{
        "type": "Feature",
        "geometry": {"type": "Polygon", "coordinates": [[[0,0],[16,0],[16,12],[0,12],[0,0]]]}
      }`;
      import('../common/importers/geoImporter').then(({ importGeoJson }) => {
        setPlan(importGeoJson(seed));
      });
    }
  }, [plan.rooms.length, setPlan]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr 1fr', height: '100vh', background: '#0f172a', color: '#e2e8f0' }}>
      <div style={{ padding: '1rem', borderRight: '1px solid #1e293b' }}>
        <h1>Voxel Architect</h1>
        <p>Import SVG/PNG/GeoJSON and preview as chunky voxels.</p>
        <ImportControls />
      </div>
      <PlanPane />
      <Viewport3D />
    </div>
  );
}

function ImportControls() {
  const { loadSvg, loadGeoJson, loadPng } = useAppState();

  const handleFile = async (file: File) => {
    const content = await file.arrayBuffer();
    const bytes = new Uint8Array(content);
    if (file.name.endsWith('.svg')) {
      const text = new TextDecoder().decode(bytes);
      loadSvg(text);
    } else if (file.name.endsWith('.json') || file.name.endsWith('.geojson')) {
      const text = new TextDecoder().decode(bytes);
      loadGeoJson(text);
    } else if (file.type === 'image/png' || file.name.endsWith('.png')) {
      await loadPng(bytes);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <label style={{ padding: '0.5rem 0.75rem', background: '#1e293b', borderRadius: 8, cursor: 'pointer' }}>
        Import plan
        <input
          type="file"
          accept=".svg,.png,.json,.geojson"
          style={{ display: 'none' }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>
      <p style={{ fontSize: 12, color: '#94a3b8' }}>
        Grid snapping, room/wall extraction, and chunk-ready meshes run automatically after import.
      </p>
    </div>
  );
}
