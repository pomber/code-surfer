import React from "react";
import { InputStep, CodeSurferTheme } from "code-surfer-types";
import { parseSteps } from "./parse-steps";
import Frame from "./frame";
import useDimensions from "./dimensions";
import { StylesProvider } from "./styles";

import "./default-syntaxes";

type CodeSurferProps = {
  steps: InputStep[];
  progress: number; // float between [0, steps.lenght - 1]
  theme?: CodeSurferTheme;
};

function CodeSurfer({ progress, steps: inputSteps }: CodeSurferProps) {
  const steps = React.useMemo(
    () => parseSteps(inputSteps, inputSteps[0].lang || "javascript"),
    [inputSteps]
  );
  const ref = React.useRef<HTMLDivElement>(null);
  const { dimensions, steps: stepsWithDimensions } = useDimensions(ref, steps);
  if (!dimensions) {
    return (
      <div
        ref={ref}
        style={{ overflow: "auto", height: "100%", width: "100%" }}
      >
        {steps.map((_step, i) => (
          <div
            key={i}
            style={{
              overflow: "auto",
              height: "100%",
              width: "100%"
            }}
          >
            <Frame steps={steps} stepPlayhead={i} />
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

function CodeSurferWithTheme({ theme, ...props }: CodeSurferProps) {
  return (
    <StylesProvider theme={theme}>
      <CodeSurfer {...props} />
    </StylesProvider>
  );
}

export default CodeSurferWithTheme;
export * from "./themes";
