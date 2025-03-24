import { Hashable } from '@/utils/interfaces';
import { AdjacencyListGraph, Unexplored, Weight } from './Graph';
import { HashMap, PriorityQueue } from '@/utils/collections';

export class Dijkstra<T extends Hashable> {
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
