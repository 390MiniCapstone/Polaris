import { FloorPlanObject } from '@/constants/floorPlans';
import { Floor } from './floor';
import { AdjacencyListGraph, Edge } from './graph';
import { NodeNav } from '../NodeNav';

export class Building {
  private floors: Map<string, Floor> = new Map();
  private layerEdges: Edge<NodeNav>[] = [];
  private name: string;
  private adjGraph: AdjacencyListGraph<NodeNav>;
  constructor(name: string, floorPlans: FloorPlanObject[]) {
    this.name = name;
    floorPlans.forEach(fp => {
      this.floors.set(fp.name, new Floor(fp));
    });

    this.adjGraph = new AdjacencyListGraph(this.getAllEdges());
  }

  getAllEdges() {
    return Array.from(this.floors.values()).reduce(
      (prev, curr) => (prev.push(...curr.getEdges()), prev),
      this.layerEdges
    );
  }

  getGraph() {
    return this.adjGraph;
  }
}
