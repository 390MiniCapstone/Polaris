import { FloorPlanObject } from '@/constants/floorPlans';
import { Floor } from './floor';
import { AdjacencyListGraph, Edge } from './graph';
import { NodeNav } from '../NodeNav';

export class Building {
  private floors: Map<string, Floor> = new Map();
  private layerEdges: Edge<NodeNav>[] = [];
  constructor(name: string, floorPlans: FloorPlanObject[]) {
    floorPlans.forEach(fp => {
      this.floors.set(fp.name, new Floor(fp));
    });
  }

  getAllEdges() {
    return this.floors
      .values()
      .reduce(
        (prev, curr) => (prev.push(...curr.getEdges()), prev),
        this.layerEdges
      );
  }

  getGraph() {
    return new AdjacencyListGraph(this.getAllEdges());
  }
}
