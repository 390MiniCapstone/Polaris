import { Hashable } from './interfaces';

export class HashMap<K extends Hashable, V> {
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

// min priority queue
export class PriorityQueueTemp<T> {
  private heap: { key: T; priority: number }[] = [];

  enqueue(key: T, priority: number): void {
    this.heap.push({ key, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): T {
    if (this.heap.length === 0) {
      throw new Error('Dequeue called but there are no elements left.');
    }

    const min = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return min.key;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  getParentIndex(index: number) {
    return Math.floor((index - 1) / 2);
  }
  getLeftChild(index: number) {
    return 2 * index + 1;
  }

  getRightChild(index: number) {
    return 2 * index + 2;
  }

  bubbleDown(currRoot: number): void {
    let index = currRoot;
    let node = this.heap[currRoot];

    // exit once we reach a leaf node
    while (currRoot < Math.floor(this.heap.length / 2)) {
      let rightChild = this.getRightChild(currRoot);
      let leftChild = this.getLeftChild(currRoot);

      if (
        rightChild < this.heap.length &&
        this.heap[rightChild].priority < this.heap[leftChild].priority
      ) {
        index = rightChild;
      } else {
        index = leftChild;
      }

      if (node.priority <= this.heap[index].priority) {
        break;
      }

      this.heap[currRoot] = this.heap[index];
      currRoot = index;
    }

    this.heap[index] = node;
  }

  bubbleUp(index: number): void {
    const node = this.heap[index];

    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (node.priority >= this.heap[parentIndex].priority) {
        break;
      }
      this.heap[index] = this.heap[parentIndex];
      index = parentIndex;
    }

    this.heap[index] = node;
  }
}

// min priority queue
export class PriorityQueue<T> {
  private heap: { key: T; priority: number }[] = [];

  enqueue(key: T, priority: number) {
    this.heap.push({ key, priority });
    this.heap.sort((a, b) => a.priority - b.priority);
  }

  // Warning: dequeue operation is not O(log(n)) but can be improved in the future.
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
