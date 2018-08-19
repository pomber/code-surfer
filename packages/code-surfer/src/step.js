const mapRange = range => {
  if (!range) return {};
  const newTokens = {};
  const [start, end] = range;
  for (let i = start; i <= end; i++) {
    newTokens[i] = null;
  }
  return newTokens;
};
const mapLines = lines => {
  const newTokens = {};
  lines.forEach(line => (newTokens[line] = null));
  return newTokens;
};

export const getTokensPerLine = ({
  lines = [],
  range,
  ranges = [],
  tokens
}) => {
  const newTokens = {};

  Object.assign(newTokens, mapLines(lines));
  Object.assign(newTokens, mapRange(range));
  Object.assign(newTokens, ...ranges.map(mapRange));
  Object.assign(newTokens, tokens);

  return newTokens;
};

export default getTokensPerLine;
