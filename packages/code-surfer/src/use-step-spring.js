import useSteps from "./use-steps";
import useSpring from "./use-spring";

function useStepSpring(stepsCount) {
  // step index according to mdx-deck
  const targetStepIndex = useSteps(stepsCount - 1);

  // real number between 0 and stepsCount - 1
  const currentStepSpring = useSpring({
    target: targetStepIndex,
    round: x => Math.round(x * 1000) / 1000
  });

  return currentStepSpring;
}

export { useStepSpring };
