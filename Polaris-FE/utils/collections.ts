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
export class PriorityQueue<T> {
  private heap: { key: T; priority: number }[] = [];

  enqueue(key: T, priority: number): void {
    this.heap.push({ key, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): T {
    let min = this.heap[0];
    const length = this.heap.length - 1;
    this.heap[0] = this.heap[length];
    this.heap[length] = min;

    const node = this.heap.pop();
    if (!node) {
      throw new Error('Dequeue called but there are no elements left.');
    }

    this.bubbleDown();
    return node.key;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  getParentIndex(index: number) {
    return Math.max(0, Math.floor((index - 1) / 2));
  }
  getLeftChild(index: number) {
    return 2 * index + 1;
  }

  getRightChild(index: number) {
    return 2 * index + 2;
  }

  bubbleDown(): void {
    let currRoot = 0;
    let index = currRoot;
    let node = this.heap[currRoot];

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

  bubbleUp(index: number = this.heap.length - 1): void {
    let parentIndex = this.getParentIndex(index);
    let node = this.heap[index];

    while (index > 0 && node.priority < this.heap[parentIndex].priority) {
      this.heap[index] = this.heap[parentIndex];
      index = parentIndex;
      parentIndex = this.getParentIndex(index);
    }
    this.heap[index] = node;
  }
}
