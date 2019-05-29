export default class Tuple {
  constructor(prev, next) {
    this.prev = prev;
    this.next = next;
  }

  spread() {
    const prev = this.prev;
    const next = this.next;
    return [prev, next];
  }

  select(selector) {
    const [prev, next] = this.spread();
    return new Tuple(
      prev != null ? selector(prev) : prev,
      next != null ? selector(next) : next
    );
  }

  _getChildrenMap() {
    if (!this._dict) {
      const [prevs = [], nexts = []] = this.spread();

      const unsortedMap = new Map(prevs.map(prev => [prev.key, { prev }]));
      nexts.forEach(next => {
        const { prev } = unsortedMap.get(next.key) || {};
        unsortedMap.set(next.key, { prev, next });
      });

      const sortedKeys = [...unsortedMap.keys()];
      sortedKeys.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      this._dict = new Map(
        sortedKeys.map(key => {
          const { prev, next } = unsortedMap.get(key);
          return [key, new Tuple(prev, next)];
        })
      );
    }
    return this._dict;
  }

  get(key) {
    const childrenMap = this._getChildrenMap();
    return childrenMap.get(key);
  }

  map(mapper) {
    const childrenMap = this._getChildrenMap();
    const result = [];
    childrenMap.forEach((tuple, key) => result.push(mapper(tuple, key, this)));
    return result;
  }
}
