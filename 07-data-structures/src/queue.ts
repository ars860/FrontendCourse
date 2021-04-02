import { RingBuffer } from './ringBuffer';

export class Queue<T> {
  private ringBuffer: RingBuffer<T>;

  constructor() {
    this.ringBuffer = new RingBuffer<T>(Infinity);
  }

  get(index: number): T | undefined {
    return this.ringBuffer.get(this.size - 1 - index);
  }

  get size(): number {
    return this.ringBuffer.size;
  }

  enqueue(element: T): void {
    this.ringBuffer.push(element);
  }

  dequeue(): T | undefined {
    return this.ringBuffer.shift();
  }
}
