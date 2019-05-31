export function parseFocus(focus) {
  if (!focus) {
    // we'll replace the null by some default later in the code
    return null;
  }
  const focusStringValue = "" + focus;
  const parts = focusStringValue.split(/,(?![^\[]*\])/g).map(part => {
    const columnsMatch = part.match(/(\d+)\[(.+)\]/);
    if (columnsMatch) {
      const [_, line, columns] = columnsMatch;
      const columnsList = columns.split(",").map(expandString);
      const index = line - 1;
      const columnIndexes = [].concat(...columnsList).map(c => c - 1);
      return [[index, columnIndexes]];
    }

    return expandString(part).map(lineNumber => [lineNumber - 1, true]);
  });
  return new Map([].concat(...parts));
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
