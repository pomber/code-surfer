import { getSlides } from "./differ";

export function parseSteps(rawSteps, lang) {
  console.log(rawSteps);
  const codes = rawSteps.map(s => s.code);

  const stepsLines = getSlides(codes.reverse(), lang).reverse();
  const steps = rawSteps.map((step, i) => {
    const lines = stepsLines[i];
    return parseStep(step, lines);
  });

  steps.forEach(step => {
    const { lines, focusIndexes } = step;
    lines
      .filter(l => l.middle)
      .forEach((line, index) => {
        line.focus = focusIndexes.includes(index);
      });
  });

  steps.forEach((step, i) => {
    const prevStep = steps[i - 1];
    const prevLines = prevStep ? prevStep.lines : [];
    const prevFocusKeys = prevLines.filter(l => l.focus).map(l => l.key);

    const nextStep = steps[i + 1];
    const nextLines = nextStep ? nextStep.lines : [];
    const nextFocusKeys = nextLines.filter(l => l.focus).map(l => l.key);

    step.lines.forEach(l => {
      l.prevFocus = prevFocusKeys.includes(l.key);
      l.nextFocus = nextFocusKeys.includes(l.key);
    });
  });

  return steps;
}

function parseStep(step, lines) {
  const { focus, ...rest } = step;
  let focusIndexes = parseFocus(focus);

  if (!focusIndexes) {
    // default focus
    focusIndexes = lines
      .filter(line => line.middle)
      .map((line, index) => (line.left ? null : index))
      .filter(index => index != null);
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
