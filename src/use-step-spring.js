import { useSteps } from "mdx-deck";
import useSpring from "./use-spring";

function useStepSpring(stepsCount) {
  // step index according to mdx-deck
  const targetStepIndex = useSteps(stepsCount - 1);

  // real number between 0 and stepsCount - 1
  const currentStepSpring = useSpring({
    target: targetStepIndex,
    round: x => Math.round(x * 1000) / 1000
  });

  // closest step to the step spring
  const currentStepIndex = Math.round(currentStepSpring);

  // number between 0.25 and 0.75
  // 0.25 means we are in the middle of currentStepIndex - 1 and curentStepIndex
  // 0.50 means we are exactly in currentStepIndex
  // 0.75 means we are in the middle of currentStepIndex and currentStepIndex + 1
  const stepPlayhead = (currentStepSpring - currentStepIndex + 1) / 2;

  return { currentStepIndex, stepPlayhead };
}

export { useStepSpring };
