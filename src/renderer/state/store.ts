import { create } from 'zustand';
import { Plan, RuleSet } from '../../types';
import { importSvg } from '../../common/importers/svgImporter';
import { importGeoJson } from '../../common/importers/geoImporter';
import { importPng } from '../../common/importers/pngImporter';
import { listPresets } from '../../common/rules/palette';
import { extractWalls } from '../../common/geometry/pipeline';

const defaultPlan: Plan = {
  rooms: [],
  walls: [],
  footprints: [],
  roads: [],
  gridSize: 1,
};

interface AppState {
  plan: Plan;
  ruleSet: RuleSet;
  setPlan(plan: Plan): void;
  loadSvg(content: string): void;
  loadGeoJson(content: string): void;
  loadPng(buffer: Uint8Array): Promise<void>;
}

export const useAppState = create<AppState>((set) => ({
  plan: defaultPlan,
  ruleSet: listPresets()[0],
  setPlan: (plan) => set({ plan }),
  loadSvg: (content) => set({ plan: extractWalls(importSvg(content)) }),
  loadGeoJson: (content) => set({ plan: extractWalls(importGeoJson(content)) }),
  loadPng: async (buffer) => {
    const plan = await importPng(buffer);
    set({ plan: extractWalls(plan) });
  },
}));
