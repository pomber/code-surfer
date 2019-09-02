import React from "react";
import { InputStep, Step, Token } from "code-surfer-types";
import { parseSteps } from "@code-surfer/step-parser";
import { parseSteps as oldParse } from "./parse-steps";
import { StylesProvider, CodeSurferTheme, Styled } from "./styles";
import { UnknownError } from "./errors";
import { CodeSurfer } from "./code-surfer";
import "./default-syntaxes";

type CodeSurferProps = {
  steps: InputStep[];
  progress: number; // float between [0, steps.lenght - 1]
  theme?: CodeSurferTheme;
};

function InnerCodeSurfer({ progress, steps: inputSteps }: CodeSurferProps) {
  const steps = React.useMemo(() => {
    const steps = transformSteps(inputSteps);
    // const oldSteps = oldParse(inputSteps, inputSteps[0].lang);
    // console.log(steps);
    // console.log(oldSteps);
    return steps;
  }, [inputSteps]);
  return <CodeSurfer progress={progress} steps={steps} />;
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

function transformSteps(inputSteps: InputStep[]): Step[] {
  const parsedSteps = parseSteps(inputSteps);

  const steps = parsedSteps.steps.map((pstep, stepi) => {
    const lines = pstep.lines.map((lineKey, lineIndex) => {
      const focus = pstep.focus[lineIndex];
      const tokens = parsedSteps.tokens[lineKey].map(
        (content, tokeni) =>
          ({
            type: parsedSteps.types[lineKey][tokeni],
            content,
            key: tokeni,
            focus: Array.isArray(focus) && focus[lineIndex][tokeni]
          } as Token)
      );
      return {
        key: lineKey,
        focus: !!focus,
        focusPerToken: Array.isArray(focus),
        tokens
      };
    });
    return {
      title: inputSteps[stepi].title,
      subtitle: inputSteps[stepi].subtitle,
      focusCenter: pstep.focusCenter,
      focusCount: pstep.focusCount,
      longestLineIndex: pstep.longestLineIndex,
      lines
    };
  });

  return steps;
}

export * from "./themes";
export {
  CodeSurferWrapper as CodeSurfer,
  Styled,
  StylesProvider,
  UnknownError
};
