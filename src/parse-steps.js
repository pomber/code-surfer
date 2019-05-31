import { getSlides, getCodes } from "./differ";
import { parseFocus as newParseFocus } from "./focus-parser";

export function parseSteps(rawSteps, lang) {
  const codes = getCodes(rawSteps);

  const stepsLines = getSlides(codes.reverse(), lang).reverse();
  const steps = rawSteps.map((step, i) => {
    const lines = stepsLines[i];
    return parseStep(step, lines);
  });

  steps.forEach(step => {
    const { lines, focusMap } = step;
    lines.forEach((line, index) => {
      line.focus = focusMap.has(index);
      const columnFocus = focusMap.get(index);
      line.focusPerToken = Array.isArray(columnFocus);
      if (line.focusPerToken) {
        // this mutates the tokens array in order to change it to the same line in other steps
        splitTokensToColumns(line.tokens);
        line.tokens = setTokenFocus(line.tokens, columnFocus);
      }
    });
  });

  return steps;
}

function parseStep(step, lines) {
  const { focus, ...rest } = step;
  let focusMap = newParseFocus(focus);

  if (!focusMap) {
    // default focus
    const indexes = lines
      .filter(line => line.isNew)
      .map((line, index) => index);
    focusMap = new Map(indexes.map(i => [i, true]));
  }

  const focusIndexes = [...focusMap.keys()];
  const focusStart = Math.min(...focusIndexes);
  const focusEnd = Math.max(...focusIndexes);

  return {
    lines,
    focusMap,
    focusStart,
    focusEnd,
    focusCenter: (focusStart + focusEnd + 1) / 2,
    focusCount: focusEnd - focusStart + 1,
    ...rest
  };
}

function splitTokensToColumns(tokenArray) {
  const tokens = [...tokenArray];
  let key = 0;
  tokenArray.splice(0, tokenArray.length);
  tokens.forEach(token => {
    const chars = [...token.content];
    chars.forEach(char =>
      tokenArray.push({ ...token, content: char, key: key++ })
    );
  });
}

function setTokenFocus(tokens, focusColumns) {
  // Assumes that tokens are already splitted in columns
  // Return new token objects to avoid changing other steps tokens
  return tokens.map((token, i) => ({
    ...token,
    focus: focusColumns.includes(i)
  }));
}
