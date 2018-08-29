// TODO: refactor this!
const mapRange = range => {
  if (!range) return {};
  const newTokens = {};
  const [start, end] = range;
  for (let i = start; i <= end; i++) {
    newTokens[i] = null;
  }
  return newTokens;
};

const mapLines = lines =>
  lines.reduce((obj, line) => ({ ...obj, [line]: null }), {});

export const getTokensPerLine = ({
  lines = [],
  range,
  ranges = [],
  tokens
}) => ({
  ...mapLines(lines),
  ...mapRange(range),
  ...Object.assign({}, ...ranges.map(mapRange)),
  ...tokens
});

export default getTokensPerLine;
