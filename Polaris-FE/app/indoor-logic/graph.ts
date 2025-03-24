import { NodeNav } from '@/app/NodeNav';

// min priority queue
class PriorityQueue<T> {
  private heap: { key: T; priority: number }[] = [];

  enqueue(key: T, priority: number) {
    this.heap.push({ key, priority });
    this.heap.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T {
    const element = this.heap.shift();
    if (!element) {
      throw new Error('Dequeue called but there are no elements left.');
    }
    return element.key;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }
}

class AdjacencyListGraph<T extends Hashable> {
  private adjacencyList: HashMap<T, [T, Weight][]> = new HashMap();

  keys() {
    return this.adjacencyList.keys();
  }

  addEdge(u: T, v: T, weight: Weight) {
    if (!this.adjacencyList.has(u)) this.adjacencyList.set(u, []);
    if (!this.adjacencyList.has(v)) this.adjacencyList.set(v, []);

    this.adjacencyList.get(u)!.push([v, weight]);
    this.adjacencyList.get(v)!.push([u, weight]); // Remove this for a directed graph
  }

  getNeighbours(u: T) {
    return this.adjacencyList.get(u) || [];
  }
}

type Weight = number;
const Unexplored = Infinity;
// interface Hash {

// }

interface Equals {
  equals(other: Equals): boolean;
}
export interface Hashable extends Equals {
  hash(): string;
}

class HashMap<K extends Hashable, V> {
  private storage = new Map<string, [K, V]>();

  set(key: K, value: V): void {
    this.storage.set(key.hash(), [key, value]);
  }

  get(key: K): V | undefined {
    return this.storage.get(key.hash())?.[1];
  }

  has(key: K): boolean {
    return this.storage.has(key.hash());
  }

  values() {
    return Array.from(this.storage.values()).map((v: [K, V]) => v[1]);
  }

  keys() {
    return Array.from(this.storage.values()).map((v: [K, V]) => v[0]);
  }
}

class Dijkstra<T extends Hashable> {
  private distances: HashMap<T, Weight>;
  private previous: HashMap<T, T>;
  private source: T;

  constructor(start: T, graph: AdjacencyListGraph<T>) {
    this.source = start;
    this.distances = new HashMap();
    this.previous = new HashMap();
    const pq = new PriorityQueue<T>();

    // Initialize distances
    for (let node of graph.keys()) {
      this.distances.set(node, Unexplored);
    }
    // start has a weight path of 0 to itself
    this.distances.set(start, 0);
    pq.enqueue(start, 0);

    while (!pq.isEmpty()) {
      let currentNode = pq.dequeue();

      for (let [neighbor, weight] of graph.getNeighbours(currentNode)) {
        let newDist = this.distances.get(currentNode)! + weight;

        if (newDist < this.distances.get(neighbor)!) {
          this.distances.set(neighbor, newDist);
          this.previous.set(neighbor, currentNode);
          pq.enqueue(neighbor, newDist);
        }
      }
    }
  }

  getDistanceFromSource(destination: T) {
    this.distances.get(destination);
  }

  getPathFromSource(destination: T): T[] {
    const path = [destination];
    if (this.previous.get(destination) != undefined) {
      throw new Error('Destination not found.');
    }

    let current: T | undefined = destination;
    while (current.equals(this.source)) {
      current = this.previous.get(current);
      if (current == undefined) {
        throw new Error('Shortest path could not be found.');
      }
      path.push(current);
    }
    return path.reverse();
  }
}

type Edge = [NodeNav, NodeNav, Weight];
const ajGraph = new AdjacencyListGraph<NodeNav>(/**list of edges */);
const source: NodeNav = new NodeNav('H1', 0.5, 0.5, 'hallway');
const dij = new Dijkstra<NodeNav>(source, ajGraph);
const path = dij.getPathFromSource(source);
