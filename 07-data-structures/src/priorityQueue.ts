import { Queue } from './queue';

enum Priority {
  Low = 1,
  Medium,
  High
}

export class PriorityQueue<T> {
  private priorityLow: Queue<T>;
  private priorityMedium: Queue<T>;
  private priorityHigh: Queue<T>;

  constructor() {
    this.priorityLow = new Queue<T>();
    this.priorityMedium = new Queue<T>();
    this.priorityHigh = new Queue<T>();
  }

  get size(): number {
    return this.priorityLow.size + this.priorityMedium.size + this.priorityHigh.size;
  }

  enqueue(element: T, priority: Priority): void {
    switch (priority) {
      case Priority.Low:
        this.priorityLow.enqueue(element);
        break;
      case Priority.Medium:
        this.priorityMedium.enqueue(element);
        break;
      case Priority.High:
        this.priorityHigh.enqueue(element);
        break;
    }
  }

  dequeue(): T | undefined {
    return this.priorityHigh.size !== 0
      ? this.priorityHigh.dequeue()
      : this.priorityMedium.size !== 0
      ? this.priorityMedium.dequeue()
      : this.priorityLow.dequeue();
  }
}
