import { FloorPlanObject } from '@/constants/floorPlans';
import { NodeNav } from '../NodeNav';
import { Edge } from './graph';

export class Floor {
  readonly nodes: Map<string, NodeNav> = new Map();
  readonly edges: Edge<NodeNav>[] = [];

  constructor(fp: FloorPlanObject) {
    fp.nodes.forEach(n => this.nodes.set(n.id, n));
    fp.edges.forEach(e => {
      let n1 = this.nodes.get(e[0]);
      let n2 = this.nodes.get(e[1]);
      if (!n1 || !n2)
        throw new Error(
          `Edge defined but missing one of those nodes ${e[0]} ${e[1]}`
        );
      this.edges.push({
        nodes: [n1, n2],
        weight: 1, // DEFAULT BUT TO BE CHANGED IN THE FUTURE
        type: e[2],
      });
    });
  }
  getNode(id: string) {
    return this.nodes.get(id);
  }
  getEdges() {
    return this.edges;
  }
}
