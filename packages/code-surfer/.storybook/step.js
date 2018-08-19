const mapRange = range => {
  if (!range) return {};
  const newTokens = {};
  const [start, end] = range;
  for (let i = start; i <= end; i++) {
    newTokens[i] = null;
  }
  return newTokens;
};

export const mapStep = ({ range, ranges = [], tokens, ...rest }) => {
  const newTokens = {};

  Object.assign(newTokens, mapRange(range));
  Object.assign(newTokens, ...ranges.map(mapRange));
  Object.assign(newTokens, tokens);

  return { tokens: newTokens, ...rest };
};

export default mapStep;
