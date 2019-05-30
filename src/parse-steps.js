import { getSlides, getCodes } from "./differ";

export function parseSteps(rawSteps, lang) {
  const codes = getCodes(rawSteps);

  const stepsLines = getSlides(codes.reverse(), lang).reverse();
  const steps = rawSteps.map((step, i) => {
    const lines = stepsLines[i];
    return parseStep(step, lines);
  });

  steps.forEach(step => {
    const { lines, focusIndexes } = step;
    lines.forEach((line, index) => {
      line.focus = focusIndexes.includes(index);
    });
  });

  return steps;
}

function parseStep(step, lines) {
  const { focus, ...rest } = step;
  let focusIndexes = parseFocus(focus);

  if (!focusIndexes) {
    // default focus
    focusIndexes = lines.filter(line => line.isNew).map((line, index) => index);
  }

  const focusStart = Math.min(...focusIndexes);
  const focusEnd = Math.max(...focusIndexes);

  return {
    lines,
    focusIndexes,
    focusStart,
    focusEnd,
    focusCenter: (focusStart + focusEnd + 1) / 2,
    focusCount: focusEnd - focusStart + 1,
    ...rest
  };
}

function parseFocus(focus) {
  if (!focus) {
    // we'll replace the null by some default later in the code
    return null;
  }
  const focusStringValue = "" + focus;
  const lineNumbers = [].concat(
    ...focusStringValue.split(",").map(expandString)
  );
  return lineNumbers.map(ln => ln - 1);
}

function expandString(part) {
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
}
