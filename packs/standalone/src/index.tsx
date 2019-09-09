import React from "react";
import { InputStep } from "code-surfer-types";
import { parseSteps } from "@code-surfer/step-parser";
import { StylesProvider, CodeSurferTheme, Styled } from "./styles";
import { UnknownError } from "./errors";
import { CodeSurfer } from "./code-surfer";
import "./default-syntaxes";

type CodeSurferProps = {
  steps: InputStep[];
  progress: number; // float between [0, steps.length - 1]
  theme?: CodeSurferTheme;
};

function InnerCodeSurfer({ progress, steps: inputSteps }: CodeSurferProps) {
  const { steps, tokens, types } = React.useMemo(() => {
    return parseSteps(inputSteps);
  }, [inputSteps]);

  return (
    <CodeSurfer
      progress={progress}
      steps={steps}
      tokens={tokens}
      types={types}
    />
  );
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
      <InnerCodeSurfer steps={steps} {...props} />
    </StylesProvider>
  );
}

export * from "./themes";
export {
  CodeSurferWrapper as CodeSurfer,
  Styled,
  StylesProvider,
  UnknownError
};
