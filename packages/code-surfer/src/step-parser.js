const mapRange = (range, obj = {}) =>
  !range || range[0] > range[1]
    ? obj
    : mapRange([range[0] + 1, range[1]], { ...obj, [range[0]]: null });

const mapLines = lines =>
  lines.reduce((obj, line) => ({ ...obj, [line]: null }), {});

export default ({ lines = [], range, ranges = [], tokens }) => ({
  ...mapLines(lines),
  ...mapRange(range),
  ...Object.assign({}, ...ranges.map(mapRange)),
  ...tokens
});
