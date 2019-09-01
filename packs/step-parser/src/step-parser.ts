import { linesDiff } from "./differ";
import { tokenize } from "./tokenizer";
import { parseFocus } from "./focus-parser";
import { toEntries } from "./object-entries";
import { applyPatch } from "diff";

export function parseSteps(
  inputSteps: { code: string; focus?: string; lang?: string }[]
) {
  if (inputSteps.length === 0) {
    return {
      tokens: [],
      types: [],
      steps: []
    };
  }

  const lang = inputSteps[0].lang;

  if (!lang) {
    throw new Error("Missing code language");
  }

  const codeList = getCodeList(inputSteps);

  const { lineIds, steps } = linesDiff(codeList);
  const allTokens: string[][] = [];
  const allTypes: string[][] = [];
  const allSteps: {
    lines: number[];
    focus: Record<number, true | number[]>;
  }[] = [];

  steps.forEach((step, i) => {
    const code = codeList[i];
    const { tokens, types } = tokenize(code, lang);
    const lineKeys: number[] = [];
    step.forEach((lineId, lineIndex) => {
      const lineKey = lineIds.indexOf(lineId);
      allTokens[lineKey] = tokens[lineIndex];
      allTypes[lineKey] = types[lineIndex];
      lineKeys.push(lineKey);
    });

    const focusString = inputSteps[i].focus;
    const prevLineKeys = allSteps[i - 1] ? allSteps[i - 1].lines : [];
    const focus = focusString
      ? parseFocus(focusString)
      : getDefaultFocus(prevLineKeys, lineKeys);
    allSteps.push({ lines: lineKeys, focus });
  });

  // split tokens into columns when needed
  allSteps.forEach(({ lines, focus }) => {
    toEntries(focus).forEach(([lineIndex, lineFocus]) => {
      if (Array.isArray(lineFocus)) {
        const lineKey = lines[lineIndex];
        const lineTypes = allTypes[lineKey];
        const lineTokens = allTokens[lineKey];
        const [newTypes, newTokens] = splitIntoColumns(lineTypes, lineTokens);
        allTypes[lineKey] = newTypes;
        allTokens[lineKey] = newTokens;
      }
    });
  });

  return {
    tokens: allTokens,
    types: allTypes,
    steps: allSteps
  };
}

function getCodeList(
  inputSteps: {
    code: string;
    lang?: string | undefined;
  }[]
) {
  const firstLang = inputSteps[0].lang;
  if (firstLang === "diff") {
    return inputSteps.map(s => s.code);
  }

  let prevCode = "";
  return inputSteps.map(({ code, lang }) => {
    let stepCode = lang === "diff" ? applyPatch(prevCode, code) : code;
    prevCode = stepCode;
    return stepCode;
  });
}

function splitIntoColumns(
  types: string[],
  tokens: string[]
): [string[], string[]] {
  const newTypes: string[] = [];
  const newTokens: string[] = [];
  tokens.forEach((token, i) => {
    const tokenType = types[i];
    Array.from(token).forEach(char => {
      newTokens.push(char);
      newTypes.push(tokenType);
    });
  });
  return [newTypes, newTokens];
}

function getDefaultFocus(prevLineKeys: number[], lineKeys: number[]) {
  const focus = {} as Record<number, true>;
  lineKeys.forEach((lineKey, lineIndex) => {
    if (!prevLineKeys.includes(lineKey)) {
      focus[lineIndex] = true;
    }
  });

  if (Object.keys(focus).length === 0) {
    lineKeys.forEach((_, lineIndex) => {
      focus[lineIndex] = true;
    });
  }

  return focus;
}
