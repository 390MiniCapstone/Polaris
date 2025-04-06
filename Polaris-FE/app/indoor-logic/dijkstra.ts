import { HashMap, PriorityQueueTemp } from '@/utils/collections';
import { Hashable } from '@/utils/interfaces';
import { AdjacencyListGraph, Unexplored, Weight } from './graph';

export class Dijkstra<T extends Hashable> {
  private distances: HashMap<T, Weight>;
  private previous: HashMap<T, T>;
  private source: T;

  constructor(start: T, graph: AdjacencyListGraph<T>) {
    this.source = start;
    this.distances = new HashMap();
    this.previous = new HashMap();
    const pq = new PriorityQueueTemp<T>();

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

    let current: T | undefined = destination;
    console.log('path node', current);
    while (!current.equals(this.source)) {
      current = this.previous.get(current);
      console.log('path node', current);
      if (current == undefined) {
        throw new Error('Shortest path could not be found.');
      }
      path.push(current);
    }
    return path.reverse();
  }
}
