import crypto from 'crypto';
import { CachedGeometry, Plan } from '../../types';
import { buildChunkedMesh } from './pipeline';

export class GeometryCache {
  private cache = new Map<string, CachedGeometry>();

  compute(plan: Plan) {
    const hash = this.hashPlan(plan);
    if (this.cache.has(hash)) return this.cache.get(hash)!;
    const mesh = buildChunkedMesh(plan);
    const cached: CachedGeometry = { hash, mesh };
    this.cache.set(hash, cached);
    return cached;
  }

  private hashPlan(plan: Plan) {
    return crypto.createHash('sha256').update(JSON.stringify(plan)).digest('hex');
  }
}
