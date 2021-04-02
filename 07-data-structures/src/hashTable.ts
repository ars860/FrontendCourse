interface Map<T> {
  [key: string]: [...[string | object, T | undefined][]];
}

export class HashTable<T> {
  private storage: Map<T>;
  private _size: number;

  get size(): number {
    return this._size;
  }

  constructor() {
    this.storage = {};
    this._size = 0;
  }

  get(key: string | object): T | undefined {
    const keyValue = this.storage[HashTable.hash(key)].find(
      ([elementKey, elementValue]) => elementKey === key
    );

    return keyValue !== undefined ? keyValue[1] : undefined;
  }

  put(key: string | object, element: T): void {
    this._size++;
    const hash = HashTable.hash(key);
    if (this.storage[hash] === undefined) {
      this.storage[hash] = [];
    }

    const index = this.storage[hash].indexOf([key, element]);
    if (index !== -1) {
      this.storage[hash][index] = [key, element];

      return;
    }

    this.storage[hash].push([key, element]);
  }

  clear(): void {
    this._size = 0;
    this.storage = {};
  }

  private static stringify(object: object): string {
    const accumulator = [];
    Object.entries(object)
      .sort()
      .forEach(([key, value]) => {
        accumulator.push(
          `${key}:${value instanceof Object ? this.stringify(value) : value.toString()}`
        );
      });
    if (accumulator.length === 0) {
      accumulator.push(object.toString());
    }

    return `{${accumulator.join()}}`;
  }

  private static hash(object: object | string): string {
    return typeof object === 'string' ? object : HashTable.stringify(object);
  }
}
