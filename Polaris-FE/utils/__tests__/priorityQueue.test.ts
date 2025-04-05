import { PriorityQueue } from '../collections';

describe('PriorityQueue', () => {
  let pq: PriorityQueue<number>;

  beforeEach(() => {
    pq = new PriorityQueue<number>();
  });

  test('enqueue adds elements correctly', () => {
    pq.enqueue(10, 2);
    pq.enqueue(20, 1);
    expect(pq.isEmpty()).toBe(false);
  });

  test('dequeue returns highest-priority element (min-heap)', () => {
    pq.enqueue(10, 2);
    pq.enqueue(20, 1);
    expect(pq.dequeue()).toBe(20);
    expect(pq.dequeue()).toBe(10);
  });

  test('dequeue throws error when empty', () => {
    expect(() => pq.dequeue()).toThrow(
      'Dequeue called but there are no elements left.'
    );
  });

  test('isEmpty returns true when queue is empty', () => {
    expect(pq.isEmpty()).toBe(true);
    pq.enqueue(30, 3);
    expect(pq.isEmpty()).toBe(false);
  });

  test('bubbleUp maintains heap property after enqueue', () => {
    pq.enqueue(10, 3);
    pq.enqueue(20, 2);
    pq.enqueue(30, 1);
    expect(pq.dequeue()).toBe(30);
  });

  test('bubbleDown maintains heap property after dequeue', () => {
    pq.enqueue(10, 1);
    pq.enqueue(20, 2);
    pq.enqueue(30, 3);
    pq.dequeue();
    expect(pq.dequeue()).toBe(20);
  });

  test('equal priorities are dequeued in insertion order (FIFO)', () => {
    pq.enqueue(10, 1);
    pq.enqueue(20, 1);
    expect(pq.dequeue()).toBe(10);
    expect(pq.dequeue()).toBe(20);
  });

  test('handles complex enqueue/dequeue sequences', () => {
    pq.enqueue(10, 5);
    pq.enqueue(20, 3);
    pq.enqueue(30, 1);
    pq.enqueue(40, 2);
    expect(pq.dequeue()).toBe(30);
    expect(pq.dequeue()).toBe(40);
    pq.enqueue(50, 0);
    expect(pq.dequeue()).toBe(50);
  });
});
