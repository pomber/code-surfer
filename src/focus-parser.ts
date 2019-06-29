import * as errors from "./errors";

export function parseFocus(focus) {
  if (!focus) {
    // we'll replace the null by some default later in the code
    return null;
  }
  const focusStringValue = "" + focus;
  try {
    const parts = focusStringValue.split(/,(?![^\[]*\])/g).map(parsePart);

    return new Map([].concat(...parts));
  } catch (e) {
    if (e.withFocusString) {
      // console.log(e.withFocusString(focus));
      throw e.withFocusString(focus);
    } else {
      throw e;
    }
  }
}

function parsePart(part) {
  // a part could be
  // - a line number: "2"
  // - a line range: "5:9"
  // - a line number with a column selector: "2[1,3:5,9]"
  const columnsMatch = part.match(/(\d+)\[(.+)\]/);
  if (columnsMatch) {
    const [_, line, columns] = columnsMatch;
    const columnsList = columns.split(",").map(expandString);
    const index = line - 1;
    const columnIndexes = [].concat(...columnsList).map(c => c - 1);
    return [[index, columnIndexes]];
  } else {
    return expandString(part).map(lineNumber => [lineNumber - 1, true]);
  }
}

function expandString(part) {
  // Transforms something like
  // - "1:3" to [1,2,3]
  // - "4" to [4]
  const [start, end] = part.split(":");

  // todo check if start is 0, line numbers and column numbers start at 1

  if (!isNaturalNumber(start)) {
    throw errors.invalidFocusNumber(start);
  }

  const startNumber = +start;

  if (startNumber < 1) {
    throw errors.invalidLineOrColumnNumber(start);
  }

  if (!end) {
    return [startNumber];
  } else {
    if (!isNaturalNumber(end)) {
      throw errors.invalidFocusNumber(end);
    }

    const list = [];
    for (let i = startNumber; i <= +end; i++) {
      list.push(i);
    }
    return list;
  }
}

function isNaturalNumber(n) {
  n = n.toString(); // force the value incase it is not
  var n1 = Math.abs(n),
    n2 = parseInt(n, 10);
  return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}
