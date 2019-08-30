import { diffLines, applyPatch } from "diff";
import tokenize from "./tokenizer";
import { InputStep } from "code-surfer-types";
const newlineRe = /\r\n|\r|\n/;

function myDiff(oldCode: string, newCode: string) {
  const changes = diffLines(oldCode || "", newCode);

  let oldIndex = -1;
  return changes.map(({ value, count, removed, added }) => {
    const lines = value.split(newlineRe);
    // check if last line is empty, if it is, remove it
    const lastLine = lines.pop();
    if (lastLine) {
      lines.push(lastLine);
    }
    const result = {
      oldIndex,
      lines,
      count,
      removed,
      added
    };
    if (!added) {
      oldIndex += count || 0;
    }
    return result;
  });
}

function insert<T>(array: T[], index: number, elements: T[]) {
  return array.splice(index, 0, ...elements);
}

type Line = {
  content: string;
  slides: number[];
  tokens: { type: string; content: string }[];
};

function slideDiff(
  lines: Line[],
  codes: string[],
  slideIndex: number,
  language: string
) {
  const prevLines = lines.filter(l => l.slides.includes(slideIndex - 1));
  const prevCode = codes[slideIndex - 1] || "";
  const currCode = codes[slideIndex];

  const changes = myDiff(prevCode, currCode);

  changes.forEach(change => {
    if (change.added) {
      const prevLine = prevLines[change.oldIndex];
      const addAtIndex = lines.indexOf(prevLine) + 1;
      const addLines = change.lines.map(content => ({
        content,
        slides: [slideIndex],
        tokens: []
      }));
      insert(lines, addAtIndex, addLines);
    } else if (!change.removed) {
      for (let j = 1; j <= (change.count || 0); j++) {
        prevLines[change.oldIndex + j].slides.push(slideIndex);
      }
    }
  });

  const tokenLines = tokenize(currCode, language);
  const currLines = lines.filter(l => l.slides.includes(slideIndex));
  currLines.forEach((line, index) => (line.tokens = tokenLines[index]));
}

export function parseLines(codes: string[], language: string) {
  const lines: Line[] = [];
  for (let slideIndex = 0; slideIndex < codes.length; slideIndex++) {
    slideDiff(lines, codes, slideIndex, language);
  }
  return lines;
}

export function getSlides(codes: string[], language: string) {
  // codes are in reverse cronological order
  const lines = parseLines(codes, language);
  // console.log("lines", lines);
  return codes.map((_, slideIndex) => {
    return lines
      .map((line, lineIndex) => ({
        content: line.content,
        tokens: line.tokens,
        isNew: !line.slides.includes(slideIndex + 1),
        show: line.slides.includes(slideIndex),
        key: lineIndex
      }))
      .filter(line => line.show);
  });
}

export function getCodes(rawSteps: InputStep[]) {
  const codes: string[] = [];

  rawSteps.forEach((s, i) => {
    if (s.lang === "diff" && i > 0) {
      codes[i] = applyPatch(codes[i - 1], s.code);
    } else {
      codes[i] = s.code;
    }
  });

  return codes;
}
