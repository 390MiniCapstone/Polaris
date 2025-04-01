import { NodeNav } from '@/app/NodeNav';
import { EdgeType, FLOOR_PLANS, FloorPlanObject } from '@/constants/floorPlans';
import { HashMap } from '@/utils/collections';
import { Hashable } from '@/utils/interfaces';

export type Weight = number;
export const Unexplored = Infinity;

export class AdjacencyListGraph<T extends Hashable> {
  private adjacencyList: HashMap<T, [T, Weight][]> = new HashMap();

  constructor(edges: Edge<T>[] = []) {
    this.addEdges(edges);
  }
  keys() {
    return this.adjacencyList.keys();
  }

  addEdge(edge: Edge<T>) {
    const { nodes, weight, type } = edge;
    const [u, v] = nodes;
    if (!this.adjacencyList.has(u)) this.adjacencyList.set(u, []);
    if (!this.adjacencyList.has(v)) this.adjacencyList.set(v, []);

    this.adjacencyList.get(u)!.push([v, weight]);
    this.adjacencyList.get(v)!.push([u, weight]); // Remove this for a directed graph
  }
  addEdges(edges: Edge<T>[]) {
    edges.forEach(this.addEdge);
  }

  getNeighbours(u: T) {
    return this.adjacencyList.get(u) || [];
  }
}

export type Edge<T> = {
  readonly nodes: [T, T];
  readonly weight: number;
  readonly type: EdgeType;
};

// example code
// const ajGraph = new AdjacencyListGraph<NodeNav>(/**list of edges */);
// const source: NodeNav = new NodeNav('H1', 0.5, 0.5, 'hallway');
// const dij = new Dijkstra<NodeNav>(source, ajGraph);
// const path = dij.getPathFromSource(source);
