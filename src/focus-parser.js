export function parseFocus(focus) {
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
