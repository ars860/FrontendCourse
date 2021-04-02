class Node<T> {
  next: Node<T> | undefined;
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

export class RingBuffer<T> {
  readonly capacity: number;
  private _size: number;
  private head: Node<T> | undefined;
  private tail: Node<T> | undefined;

  constructor(capacity: number) {
    this.capacity = capacity;
    this._size = 0;
  }

  get size(): number {
    return this._size;
  }

  get(index: number): T | undefined {
    if (index >= this._size || index < 0) {
      return undefined;
    }

    let current = this.head;
    let count = 0;

    while (count < index) {
      count++;
      current = current!.next;
    }

    return current!.value;
  }

  push(element: T): void {
    if (this.capacity === 0) {
      return;
    }

    if (this._size === this.capacity) {
      this.tail!.next = this.head;
      this.head!.value = element;
      this.tail = this.head;
      this.head = this.head!.next;

      return;
    }

    const newNode = new Node(element);

    if (this._size === 0) {
      this.head = newNode;
      this.tail = newNode;
      this._size = 1;

      return;
    }

    this.tail!.next = newNode;
    this.tail = newNode;
    this._size++;
  }

  shift(): T | undefined {
    if (this.head === undefined) {
      return undefined;
    }

    const result = this.head.value;
    this._size--;

    if (this._size === 0) {
      this.head = undefined;
      this.tail = undefined;

      return result;
    }

    this.head = this.head.next;

    return result;
  }

  static concat(...buffers: RingBuffer<any>[]): RingBuffer<any> {
    const result = new RingBuffer(
      buffers.reduce((acc: number, buffer: RingBuffer<any>) => acc + buffer.capacity, 0)
    );

    for (const buffer of buffers) {
      for (let i = 0; i < buffer._size; i++) {
        result.push(buffer.get(i));
      }
    }

    return result;
  }
}
