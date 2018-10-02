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

const getTokensPerLineFromObject = ({
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

const expandString = part => {
  // Transforms something like
  // - "1:3" to [1,2,3]
  // - "4" to [4]
  const [start, end] = part.split(":");
  if (!end) {
    return [+start];
  }
  const list = [];
  for (let i = +start; i <= +end; i++) {
    list.push(i);
  }
  return list;
};

const getTokensPerLineFromString = step => {
  const parts = step.split(/,(?![^\[]*\])/g).map(part => {
    const tokensMatch = part.match(/(\d+)\[(.+)\]/);
    if (tokensMatch) {
      const [_, line, tokens] = tokensMatch;
      const tokenList = tokens.split(",").map(expandString);
      return { [line]: [].concat(...tokenList) };
    }

    const [start, end] = part.split(":");
    return mapRange([+start, +end || +start]);
  });

  return Object.assign({}, ...parts);
};

const getTokensPerLine = step => {
  if (typeof step === "string") {
    return getTokensPerLineFromString(step);
  } else {
    return getTokensPerLineFromObject(step);
  }
};

export default getTokensPerLine;
