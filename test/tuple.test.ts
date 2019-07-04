import { Tuple, ArrayTuple } from "../src/standalone/tuple";

describe("Tuple", () => {
  it("spread works", () => {
    expect(new Tuple(1, 2).spread()).toEqual([1, 2]);
  });

  it("select works", () => {
    const tuple = new Tuple({ a: 1 }, { a: 2 });
    expect(tuple.select(x => x.a).spread()).toEqual([1, 2]);
  });

  it("select works with null", () => {
    const tuple = new Tuple({ a: 1 }, { a: null });
    expect(tuple.select(x => x.a).spread()).toEqual([1, null]);
  });

  it("select works with undefined", () => {
    const tuple = new Tuple({ a: 1 }, {});
    expect(tuple.select(x => x.a).spread()).toEqual([1, undefined]);
  });

  it("gets by key when items are lists", () => {
    const tuple = new ArrayTuple(
      [{ key: 1, a: 10 }, { key: 3, a: 30 }],
      [{ key: 1, a: 11 }, { key: 2, a: 21 }]
    );
    expect(tuple.get(1).spread()).toEqual([
      { key: 1, a: 10 },
      { key: 1, a: 11 }
    ]);
    expect(tuple.get(2).spread()).toEqual([undefined, { key: 2, a: 21 }]);
    expect(tuple.get(3).spread()).toEqual([{ key: 3, a: 30 }, undefined]);
  });

  it("maps entries with keys", () => {
    const tuple = new ArrayTuple(
      [{ key: 1, a: 10 }, { key: 3, a: 30 }],
      [{ key: 1, a: 11 }, { key: 2, a: 21 }]
    );
    const result = tuple.map(tuple => tuple.spread());

    expect(result).toEqual([
      [{ key: 1, a: 10 }, { key: 1, a: 11 }],
      [undefined, { key: 2, a: 21 }],
      [{ key: 3, a: 30 }, undefined]
    ]);
  });
});
