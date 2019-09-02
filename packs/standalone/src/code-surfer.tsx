import React from "react";
import useDimensions from "./dimensions";
import Frame from "./frame";
import { Step } from "code-surfer-types";

type CodeSurferProps = {
  steps: Step[];
  progress: number; // float between [0, steps.lenght - 1]
};

export function CodeSurfer({ progress, steps }: CodeSurferProps) {
  const fakeSteps = React.useMemo(() => getFakeSteps(steps), [steps]);

  const ref = React.useRef<HTMLDivElement>(null);
  const { dimensions, steps: stepsWithDimensions } = useDimensions(ref, steps);
  if (!dimensions) {
    return (
      <div
        ref={ref}
        style={{ overflow: "auto", height: "100%", width: "100%" }}
      >
        {fakeSteps.map((_step, i) => (
          <div
            key={i}
            style={{
              overflow: "auto",
              height: "100%",
              width: "100%"
            }}
          >
            <Frame steps={fakeSteps} stepPlayhead={i} />
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div
        style={{ height: "100%", width: "100%", overflow: "auto" }}
        ref={ref}
      >
        <Frame
          steps={stepsWithDimensions}
          stepPlayhead={progress}
          dimensions={dimensions}
        />
      </div>
    );
  }
}

function getFakeSteps(parsedSteps: Step[]) {
  const fakeSteps = parsedSteps.map(step => {
    const fakeStep: Step = {
      ...step,
      lines: step.lines.map(line => ({
        ...line,
        tokens: line.tokens && [line.tokens[0]]
      }))
    };

    fakeStep.lines[0] = step.lines.reduce((a, b) =>
      a.content.length > b.content.length ? a : b
    );
    return fakeStep;
  });
  fakeSteps[0] = parsedSteps[0];
  return fakeSteps;
}
