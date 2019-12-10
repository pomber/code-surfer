export function fromEntries<K extends string | number | symbol, V>(
  pairs: [K, V][]
) {
  const result = {} as Record<K, V>;

  let index = -1,
    length = pairs == null ? 0 : pairs.length;

  while (++index < length) {
    var pair = pairs[index];
    result[pair[0]] = pair[1];
  }

  return result;
}

export function toEntries<K extends string | number | symbol, V>(
  o: Record<K, V>
): [K, V][] {
  const keys = Object.keys(o) as K[];
  return keys.map(k => [k, o[k]]);
}
