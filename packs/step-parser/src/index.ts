import { parseSteps } from "step-parser";

export default parseSteps;

export function flat<T>(nestedArrays: T[][]) {
  return nestedArrays.flat();
}
