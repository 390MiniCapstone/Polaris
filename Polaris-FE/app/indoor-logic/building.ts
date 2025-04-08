import { FloorPlanObject } from '@/constants/floorPlans';
import { Floor } from './floor';
import { AdjacencyListGraph, Edge } from './graph';
import { NodeNav } from '../NodeNav';

export class Building {
  private floors: Map<string, Floor> = new Map();
  private layerEdges: Edge<NodeNav>[] = [];
  private adjGraph: AdjacencyListGraph<NodeNav>;
  public readonly name: string;
  constructor(name: string, floorPlans: FloorPlanObject[]) {
    this.name = name;

    // get the floors
    floorPlans.forEach(fp => {
      this.floors.set(fp.name, new Floor(fp));
    });

    // get the layered edges
    floorPlans.forEach(fp => {
      (fp.multiLayeredEdges || []).forEach(e => {
        let n1 = this.getNode(e[0]);
        let n2 = this.getNode(e[1]);
        if (!n1 || !n2)
          throw new Error(
            `Edge defined but missing one of those nodes ${e[0]} ${e[1]}`
          );
        this.layerEdges.push({
          nodes: [n1, n2],
          weight: 1, // DEFAULT BUT TO BE CHANGED IN THE FUTURE
          type: e[2],
        });
      });
    });

    this.adjGraph = new AdjacencyListGraph(this.getAllEdges());
  }

  getAllEdges() {
    return Array.from(this.floors.values()).reduce(
      (prev, curr) => (prev.push(...curr.getEdges()), prev),
      this.layerEdges
    );
  }
  getNode(id: string) {
    for (const floor of Array.from(this.floors.values())) {
      const node = floor.getNode(id);
      if (node) {
        return node;
      }
    }
  }
  getGraph() {
    return this.adjGraph;
  }
}
