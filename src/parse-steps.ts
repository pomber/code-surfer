import { getSlides, getCodes } from "./differ";
import { parseFocus } from "./focus-parser";
import { InputStep } from "code-surfer-types";

export function parseSteps(rawSteps: InputStep[], lang: string) {
  const codes = getCodes(rawSteps);

  const stepsLines = getSlides(codes.reverse(), lang).reverse();
  const steps = rawSteps.map((step, i) => {
    const lines = stepsLines[i];
    try {
      return parseStep(step, lines);
    } catch (e) {
      if (e.withStepIndex) {
        throw e.withStepIndex(i);
      } else {
        throw e;
      }
    }
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

function parseStep(
  step: InputStep,
  lines: {
    content: string;
    tokens: { type: string; content: string }[];
    isNew: boolean;
    show: boolean;
    key: number;
    focus?: boolean;
    focusPerToken?: boolean;
  }[]
) {
  const { focus, ...rest } = step;
  let focusMap = focus ? parseFocus(focus) : getDefaultFocus(lines);

  const focusIndexes = Array.from(focusMap.keys());
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

function getDefaultFocus(lines) {
  const indexes = lines
    .map((line, index) => (line.isNew ? index : null))
    .filter(index => index !== null);
  return new Map<number, boolean | number[]>(indexes.map(i => [i, true]));
}

function splitTokensToColumns(tokenArray: any[]) {
  const tokens = Array.from(tokenArray);
  let key = 0;
  tokenArray.splice(0, tokenArray.length);
  tokens.forEach(token => {
    const chars = Array.from(token.content);
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
