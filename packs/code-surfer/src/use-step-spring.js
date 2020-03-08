import useSteps from "./use-steps";
import { useSpring } from "use-spring";

function useStepSpring(stepsCount) {
  // step index according to mdx-deck
  const targetStepIndex = useSteps(stepsCount - 1);

  // real number between 0 and stepsCount - 1
  const [currentStepSpring] = useSpring(targetStepIndex, {
    decimals: 3,
    stiffness: 80,
    damping: 48,
    mass: 8
  });

  return currentStepSpring;
}

export { useStepSpring };
