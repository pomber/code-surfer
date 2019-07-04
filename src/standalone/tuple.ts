export class Tuple<T> {
  prev: Maybe<T>;
  next: Maybe<T>;

  constructor(prev: Maybe<T>, next: Maybe<T>) {
    this.prev = prev;
    this.next = next;
  }

  spread(): [Maybe<T>, Maybe<T>] {
    const prev = this.prev;
    const next = this.next;
    return [prev, next];
  }

  select<S>(selector: (x: T) => S) {
    const [prev, next] = this.spread();
    const [newPrev, newNext] = [
      prev === null ? null : prev === undefined ? undefined : selector(prev),
      next === null ? null : next === undefined ? undefined : selector(next)
    ];
    return new Tuple(newPrev, newNext);
  }

  selectMany<S extends { key?: any }>(selector: (x: T) => S[]) {
    const [prev, next] = this.spread();
    const [newPrev, newNext] = [
      prev === null ? null : prev === undefined ? undefined : selector(prev),
      next === null ? null : next === undefined ? undefined : selector(next)
    ];
    return new ArrayTuple(newPrev, newNext);
  }

  get(_key: any) {
    throw Error("Get only supported in ArrayTuple");
  }

  map(_mapper: any) {
    throw Error("Map only supported in ArrayTuple");
  }
}

export class ArrayTuple<T extends { key?: any }> extends Tuple<T[]> {
  _dict?: Map<any, Tuple<T>>;

  _getChildrenMap() {
    if (!this._dict) {
      const [maybePrevs, maybeNexts] = this.spread();
      const prevs: T[] = maybePrevs || [];
      const nexts: T[] = maybeNexts || [];

      const unsortedMap = new Map<any, { prev: Maybe<T>; next?: Maybe<T> }>(
        prevs.map(prev => [prev.key, { prev }])
      );
      nexts.forEach(next => {
        const { prev } = unsortedMap.get(next.key) || { prev: undefined };
        unsortedMap.set(next.key, { prev, next });
      });

      const sortedKeys = Array.from(unsortedMap.keys());
      sortedKeys.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      this._dict = new Map<any, Tuple<T>>(
        sortedKeys.map(key => {
          const { prev = undefined, next = undefined } =
            unsortedMap.get(key) || {};
          return [key, new Tuple(prev, next)];
        })
      );
    }
    return this._dict;
  }

  get(key: any) {
    const childrenMap = this._getChildrenMap();
    return childrenMap.get(key);
  }

  map<M>(mapper: (t: Tuple<T>, key?: any, self?: ArrayTuple<T>) => M) {
    const childrenMap = this._getChildrenMap();
    const result: M[] = [];
    childrenMap.forEach((tuple, key) => result.push(mapper(tuple, key, this)));
    return result;
  }
}
