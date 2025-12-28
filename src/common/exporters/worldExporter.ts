import { Buffer } from 'buffer';
import { Plan, RuleSet } from '../../types';
import { applyRules, listPresets } from '../rules/palette';
import { addDetailing } from '../detailing/detailing';
import { GeometryCache } from '../geometry/cache';

export function schemExport(plan: Plan, ruleSet: RuleSet = listPresets()[0]) {
  const palette = applyRules(plan, ruleSet);
  const detailing = addDetailing(plan);
  const cache = new GeometryCache();
  const mesh = cache.compute(plan);

  const payload = {
    metadata: { type: 'schem', ruleSet: ruleSet.name },
    palette,
    detailing,
    mesh: mesh.mesh.length,
  };
  return Buffer.from(JSON.stringify(payload, null, 2), 'utf-8');
}

export function worldExport(plan: Plan, options: { bedrock?: boolean }, ruleSet: RuleSet = listPresets()[0]) {
  const cache = new GeometryCache();
  const mesh = cache.compute(plan);
  const world = {
    version: options.bedrock ? 'bedrock' : 'java',
    chunks: mesh.mesh,
    plan,
  };
  return Buffer.from(JSON.stringify(world, null, 2), 'utf-8');
}

export function usageNotes() {
  return `Import the generated .schem file with WorldEdit (//schem load) or open the world zip in Amulet. Enable Bedrock toggle for cross-target builds.`;
}
