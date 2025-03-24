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
