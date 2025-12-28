import { Plan, Point2D, Road, Room } from '../../types';

export type DetailLayer = {
  roads: Road[];
  sidewalks: Road[];
  furniture: Point2D[];
  vegetation: Point2D[];
  verticals: { stairs: Point2D; elevators: Point2D }[];
};

export function addDetailing(plan: Plan): DetailLayer {
  const sidewalks = plan.roads.map((road) => ({ ...road, width: road.width + 1 }));
  const furniture = plan.rooms.map((room) => center(room.outline));
  const vegetation = plan.footprints.map((fp) => center(fp.outline));
  const verticals = plan.rooms.map((room) => ({ stairs: room.outline[0], elevators: room.outline[1] || room.outline[0] }));
  return { roads: plan.roads, sidewalks, furniture, vegetation, verticals };
}

function center(outline: Room['outline']): Point2D {
  const sum = outline.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 },
  );
  return { x: sum.x / outline.length, y: sum.y / outline.length };
}
