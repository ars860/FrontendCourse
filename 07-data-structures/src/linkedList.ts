class Node<T> {
  next: Node<T> | undefined;
  prev: Node<T> | undefined;
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

export class LinkedList<T> {
  private head: Node<T> | undefined;
  private tail: Node<T> | undefined;
  private _size: number;

  constructor() {
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
    const newNode = new Node(element);

    if (this._size === 0) {
      this.head = newNode;
      this.tail = newNode;
      this._size = 1;

      return;
    }

    newNode.prev = this.tail;
    this.tail!.next = newNode;
    this.tail = newNode;
    this._size++;
  }

  pop(): T | undefined {
    if (this.tail === undefined) {
      return undefined;
    }

    const result = this.tail.value;
    this._size--;

    if (this._size === 0) {
      this.head = undefined;
      this.tail = undefined;

      return result;
    }
    this.tail = this.tail.prev;
    this.tail!.next = undefined;

    return result;
  }

  unshift(element: T): void {
    const newNode = new Node(element);

    if (this._size === 0) {
      this.head = newNode;
      this.tail = newNode;
      this._size = 1;

      return;
    }

    newNode.next = this.head;
    this.head!.prev = newNode;
    this.head = newNode;
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
    this.head!.prev = undefined;

    return result;
  }
}
