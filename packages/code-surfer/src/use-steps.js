import { useSteps } from "mdx-deck";

export default function(stepsCount) {
  const step = useSteps(stepsCount);
  return step === Infinity ? 0 : step;
}
