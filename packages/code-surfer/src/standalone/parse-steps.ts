import { getSlides, getCodes } from "./differ";
import { parseFocus } from "./focus-parser";
import { InputStep, Step } from "code-surfer-types";

type Token = { type: string; content: string; key?: number; focus?: boolean };

type Line = {
  content: string;
  tokens: Token[];
  isNew: boolean;
  show: boolean;
  key: number;
  focus?: boolean;
  focusPerToken?: boolean;
};

export function parseSteps(rawSteps: InputStep[], lang: string): Step[] {
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
      if (Array.isArray(columnFocus)) {
        // this mutates the tokens array in order to change it to the same line in other steps
        splitTokensToColumns(line.tokens);
        line.tokens = setTokenFocus(line.tokens, columnFocus);
      }
    });
  });

  return steps;
}

function parseStep(step: InputStep, lines: Line[]) {
  const { focus, ...rest } = step;
  let focusMap = focus ? parseFocus(focus) : getDefaultFocus(lines);

  const focusIndexes: number[] = Array.from(focusMap.keys());
  const focusStart = Math.min.apply(Math, focusIndexes);
  const focusEnd = Math.max.apply(Math, focusIndexes);

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

function getDefaultFocus(lines: Line[]) {
  const indexes = lines
    .map((line, index) => (line.isNew ? index : -1))
    .filter(index => index !== -1);
  return new Map<number, boolean | number[]>(indexes.map(i => [i, true]));
}

function splitTokensToColumns(tokenArray: Token[]) {
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

function setTokenFocus(tokens: Token[], focusColumns: number[]) {
  // Assumes that tokens are already splitted in columns
  // Return new token objects to avoid changing other steps tokens
  return tokens.map((token, i) => ({
    ...token,
    focus: focusColumns.includes(i)
  }));
}
