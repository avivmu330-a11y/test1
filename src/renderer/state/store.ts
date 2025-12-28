import { create } from 'zustand';
import { Plan, RuleSet } from '../../types';
import { importGeoJson } from '../../common/importers/geoImporter';
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
  loadSvg(content: string): Promise<void>;
  loadGeoJson(content: string): void;
  loadPng(buffer: Uint8Array): Promise<void>;
}

export const useAppState = create<AppState>((set) => ({
  plan: defaultPlan,
  ruleSet: listPresets()[0],
  setPlan: (plan) => set({ plan }),
  loadSvg: async (content) => {
    const { importSvg } = await import('../../common/importers/svgImporter');
    const plan = await importSvg(content);
    set({ plan: extractWalls(plan) });
  },
  loadGeoJson: (content) => set({ plan: extractWalls(importGeoJson(content)) }),
  loadPng: async (buffer) => {
    const { importPng } = await import('../../common/importers/pngImporter');
    const plan = await importPng(buffer);
    set({ plan: extractWalls(plan) });
  },
})); 
