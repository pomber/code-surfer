import flat from "array.prototype.flat";
import { fromEntries } from "./object-entries";

type LineIndex = number;
type ColumnIndex = number;

export function parseFocus(focus: string) {
  if (!focus) {
    throw new Error("Focus cannot be empty");
  }

  try {
    const parts = focus.split(/,(?![^\[]*\])/g).map(parsePart);
    return fromEntries(flat(parts));
  } catch (error) {
    // TODO enhance error
    throw error;
  }
}

type Part = [LineIndex, true | ColumnIndex[]];

function parsePart(part: string): Part[] {
  // a part could be
  // - a line number: "2"
  // - a line range: "5:9"
  // - a line number with a column selector: "2[1,3:5,9]"
  const columnsMatch = part.match(/(\d+)\[(.+)\]/);
  if (columnsMatch) {
    const [, line, columns] = columnsMatch;
    const columnsList = columns.split(",").map(expandString);
    const lineIndex = Number(line) - 1;
    const columnIndexes = flat(columnsList).map(c => c - 1);
    return [[lineIndex, columnIndexes]];
  } else {
    return expandString(part).map(lineNumber => [lineNumber - 1, true]);
  }
}

function expandString(part: string) {
  // Transforms something like
  // - "1:3" to [1,2,3]
  // - "4" to [4]
  const [start, end] = part.split(":");

  if (!isNaturalNumber(start)) {
    throw new FocusNumberError(start);
  }

  const startNumber = Number(start);

  if (startNumber < 1) {
    throw new LineOrColumnNumberError();
  }

  if (!end) {
    return [startNumber];
  } else {
    if (!isNaturalNumber(end)) {
      throw new FocusNumberError(end);
    }

    const list: number[] = [];
    for (let i = startNumber; i <= +end; i++) {
      list.push(i);
    }
    return list;
  }
}

function isNaturalNumber(n: any) {
  n = n.toString(); // force the value in case it is not
  var n1 = Math.abs(n),
    n2 = parseInt(n, 10);
  return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}

export class LineOrColumnNumberError extends Error {
  constructor() {
    super(`Invalid line or column number in focus string`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class FocusNumberError extends Error {
  number: string;
  constructor(number: string) {
    super(`Invalid number "${number}" in focus string`);
    this.number = number;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
