import { Hashable } from './Graph';

export class NodeNav implements Hashable {
  id: string;
  xRatio: number;
  yRatio: number;
  type:
    | 'hallway'
    | 'room'
    | 'escalator'
    | 'elevator'
    | 'washroom'
    | 'fountain'
    | 'entrance';

  constructor(
    id: string,
    xRatio: number,
    yRatio: number,
    type:
      | 'hallway'
      | 'room'
      | 'escalator'
      | 'elevator'
      | 'washroom'
      | 'fountain'
      | 'entrance'
  ) {
    this.id = id;
    this.xRatio = xRatio;
    this.yRatio = yRatio;
    this.type = type;
  }
  hash(): string {
    return this.id;
  }
  equals(other: NodeNav): boolean {
    return this.id === other.id;
  }

  getAbsoluteX(svgWidth: number): number {
    return this.xRatio * svgWidth;
  }

  getAbsoluteY(svgHeight: number): number {
    return this.yRatio * svgHeight;
  }

  distanceTo(other: NodeNav, svgWidth: number, svgHeight: number): number {
    const x1 = this.getAbsoluteX(svgWidth);
    const y1 = this.getAbsoluteY(svgHeight);
    const x2 = other.getAbsoluteX(svgWidth);
    const y2 = other.getAbsoluteY(svgHeight);

    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }
}

export type Edge = {
  from: string;
  to: string;
  weight: number;
};

export class Graph {
  nodes: Map<string, NodeNav>;
  edges: Map<string, Edge[]>;

  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  addNode(node: NodeNav) {
    this.nodes.set(node.id, node);
    this.edges.set(node.id, []);
  }

  addEdge(from: string, to: string, weight: number) {
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      throw new Error('Both nodes must exist in the graph');
    }
    this.edges.get(from)?.push({ from, to, weight });
    this.edges.get(to)?.push({ from: to, to: from, weight }); // Undirected Graph
  }

  getNeighbors(nodeId: string): Edge[] {
    return this.edges.get(nodeId) || [];
  }
}
