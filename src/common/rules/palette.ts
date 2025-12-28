import { PaletteRule, Plan, RuleSet } from '../../types';

const presets: RuleSet[] = [
  {
    name: 'Modern Glass',
    style: 'modern',
    rules: [
      { selector: 'wall', pattern: '.*', blocks: [{ name: 'white_concrete' }] },
      { selector: 'window', pattern: 'floor:even', blocks: [{ name: 'glass_pane' }, { name: 'light_gray_stained_glass' }] },
      { selector: 'roof', pattern: 'flat', blocks: [{ name: 'gray_concrete' }] },
    ],
  },
  {
    name: 'Medieval Timber',
    style: 'medieval',
    rules: [
      { selector: 'wall', pattern: '.*', blocks: [{ name: 'oak_planks' }, { name: 'oak_log' }] },
      { selector: 'roof', pattern: 'pitched', blocks: [{ name: 'spruce_stairs' }] },
      { selector: 'window', pattern: 'floor:odd', blocks: [{ name: 'glass_pane' }] },
    ],
  },
  {
    name: 'Industrial Brick',
    style: 'industrial',
    rules: [
      { selector: 'wall', pattern: '.*', blocks: [{ name: 'bricks' }] },
      { selector: 'roof', pattern: 'flat', blocks: [{ name: 'stone_bricks' }] },
      { selector: 'ground', pattern: 'road', blocks: [{ name: 'cobbled_deepslate' }] },
    ],
  },
];

export function listPresets() {
  return presets;
}

export function applyRules(plan: Plan, ruleSet: RuleSet) {
  return plan.rooms.map((room, index) => {
    const palette = selectRule(ruleSet.rules, index);
    return { room, palette };
  });
}

function selectRule(rules: PaletteRule[], floorIndex: number) {
  const rule =
    rules.find((r) => r.pattern === 'floor:even' && floorIndex % 2 === 0) ||
    rules.find((r) => r.pattern === 'floor:odd' && floorIndex % 2 === 1) ||
    rules.find((r) => r.pattern === 'flat') ||
    rules.find((r) => r.pattern === 'pitched') ||
    rules.find((r) => r.pattern === 'road') ||
    rules.find((r) => r.pattern === '.*');

  return rule?.blocks ?? [];
}
