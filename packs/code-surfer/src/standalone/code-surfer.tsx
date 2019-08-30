import React from "react";
import { InputStep, Step } from "code-surfer-types";
import { parseSteps } from "./parse-steps";
import Frame from "./frame";
import useDimensions from "./dimensions";
import { StylesProvider, CodeSurferTheme } from "./styles";

import "./default-syntaxes";

type CodeSurferProps = {
  steps: InputStep[];
  progress: number; // float between [0, steps.lenght - 1]
  theme?: CodeSurferTheme;
};

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

function CodeSurfer({ progress, steps: inputSteps }: CodeSurferProps) {
  const [steps, fakeSteps] = React.useMemo(() => {
    const parsedSteps = parseSteps(
      inputSteps,
      inputSteps[0].lang || "javascript"
    );
    const fakeSteps = getFakeSteps(parsedSteps);
    return [parsedSteps, fakeSteps];
  }, [inputSteps]);

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

function CodeSurferWrapper({ theme, steps, ...props }: CodeSurferProps) {
  const [wait, setWait] = React.useState(steps.length > 3);

  React.useEffect(() => {
    if (!wait) return;
    setWait(false);
  }, []);

  if (wait) return null;

  return (
    <StylesProvider theme={theme}>
      <CodeSurfer steps={steps} {...props} />
    </StylesProvider>
  );
}

export default CodeSurferWrapper;
export * from "./themes";
