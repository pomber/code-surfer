import React from "react";
import { InputStep, CodeSurferTheme } from "code-surfer-types";
import { parseSteps } from "./parse-steps";
import Frame from "./frame";
import useDimensions from "./dimensions";
import { ThemeContext } from "./theming";

import "./default-syntaxes";

type CodeSurferProps = {
  steps: InputStep[];
  progress: number; // float between [0, steps.lenght - 1]
  theme?: CodeSurferTheme;
};

function CodeSurfer({ progress, steps: inputSteps, theme }: CodeSurferProps) {
  const steps = parseSteps(inputSteps, inputSteps[0].lang || "javascript");
  // const stepIndex = Math.round(progress);
  const ref = React.useRef<HTMLDivElement>(null);
  const { dimensions, steps: stepsWithDimensions } = useDimensions(ref, steps);
  if (!dimensions) {
    return (
      <ThemeContext.Provider value={theme}>
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
      </ThemeContext.Provider>
    );
  } else {
    return (
      <ThemeContext.Provider value={theme}>
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
      </ThemeContext.Provider>
    );
  }
}

export default CodeSurfer;
export * from "./themes";
