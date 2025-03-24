import { FloorPlanObject } from '@/constants/floorPlans';
import { Floor } from './floor';
import { Edge } from './graph';

export class Building {
  private floors: Map<string, Floor> = new Map();
  private edges: Edge[] = [];
  constructor(name: string, floorPlans: FloorPlanObject[]) {}
}
