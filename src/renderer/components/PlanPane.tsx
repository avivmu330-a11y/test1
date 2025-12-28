import { useMemo, type ReactElement } from 'react';
import { useAppState } from '../state/store';

export function PlanPane() {
  const { plan } = useAppState();
  const bounds = useMemo(() => {
    const points = plan.footprints.flatMap((f) => f.outline);
    const roads = plan.roads.flatMap((r) => r.centerline);
    const all = [...points, ...roads];
    const minX = Math.min(...all.map((p) => p.x), 0);
    const maxX = Math.max(...all.map((p) => p.x), 1);
    const minY = Math.min(...all.map((p) => p.y), 0);
    const maxY = Math.max(...all.map((p) => p.y), 1);
    return { minX, maxX, minY, maxY };
  }, [plan]);

  const viewBox = `${bounds.minX - 4} ${bounds.minY - 4} ${bounds.maxX - bounds.minX + 8} ${bounds.maxY - bounds.minY + 8}`;

  return (
    <div style={{ background: '#0b1224', borderRight: '1px solid #1e293b' }}>
      <h2 style={{ padding: '0.75rem', margin: 0 }}>2D Plan</h2>
      <svg viewBox={viewBox} style={{ width: '100%', height: 'calc(100% - 48px)' }}>
        <Grid viewBox={viewBox} spacing={plan.gridSize} />
        {plan.roads.map((road, idx) => (
          <polyline
            key={`road-${idx}`}
            points={road.centerline.map((p) => `${p.x},${p.y}`).join(' ')}
            stroke="#38bdf8"
            strokeWidth={road.width}
            fill="none"
            opacity={0.6}
          />
        ))}
        {plan.footprints.map((fp, idx) => (
          <polygon key={idx} points={fp.outline.map((p) => `${p.x},${p.y}`).join(' ')} fill="#22c55e22" stroke="#22c55e" />
        ))}
      </svg>
    </div>
  );
}

function Grid({ viewBox, spacing }: { viewBox: string; spacing: number }) {
  const [minX, minY, width, height] = viewBox.split(' ').map(Number);
  const lines: ReactElement[] = [];
  for (let x = minX; x < minX + width; x += spacing) {
    lines.push(<line key={`vx-${x}`} x1={x} y1={minY} x2={x} y2={minY + height} stroke="#1e293b" strokeWidth={0.1} />);
  }
  for (let y = minY; y < minY + height; y += spacing) {
    lines.push(<line key={`vy-${y}`} x1={minX} y1={y} x2={minX + width} y2={y} stroke="#1e293b" strokeWidth={0.1} />);
  }
  return <g>{lines}</g>;
}
