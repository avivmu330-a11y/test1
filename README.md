# Voxel Architect

A scaffolded Electron + React + Three.js desktop app for block-based city/structure design. It provides a side-by-side 2D plan pane and 3D viewport, importers for common plan sources, a geometry pipeline that is chunk aware, rule-based palettes, detailing passes, and exports for `.schem` or world saves (Java with an optional Bedrock toggle).

## Features
- **Panes**: 2D SVG map with grid snapping and a Three.js viewport for voxelized preview.
- **Importers**: SVG/PNG (vectorized bounding boxes) and GeoJSON/OSM footprints/roads.
- **Geometry pipeline**: room/wall extraction, height extrusion, chunk-aware mesh builder with caching and LOD-ish wireframe fallback.
- **Rules**: YAML/JSON-friendly palette presets (modern/medieval/industrial) driving facades, windows, roofs, and ground materials.
- **Detailing**: roads, sidewalks/curbs, furniture, vegetation, and interior stairs/elevators per floor.
- **Exporters**: `.schem` payload and world save buffers (Java or Bedrock toggle) with WorldEdit/Amulet usage notes.
- **Performance**: chunked processing, caching derived geometry, worker-ready pure functions, and tests including stress coverage.

## Development
1. Install dependencies: `npm install`.
2. Run renderer+Electron dev server: `npm run dev` (Renderer on port 5173; Electron reads from it in dev).
3. Build: `npm run build` (outputs renderer to `dist/` and Electron entry/preload to `dist-electron/`).
4. Lint types: `npm run lint`.
5. Tests: `npm test` (vitest).

## Export usage
Use the exposed IPC channels or the preload bridge to trigger `export:schem` or `export:world`. Import the generated `.schem` with WorldEdit (`//schem load`) or open the world buffer/zip in Amulet. Toggle `bedrock: true` for cross-target builds.
