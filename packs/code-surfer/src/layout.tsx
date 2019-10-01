import React from "react";
import { useDeck } from "mdx-deck";
import { CodeSurfer } from "@code-surfer/standalone";
import { readStepFromElement } from "./step-reader";
import ErrorBoundary from "./error-boundary";
import { useStepSpring } from "./use-step-spring";

function CodeSurferLayout({ children, theme }) {
  const deck = useDeck();
  const steps = React.useMemo(getStepsFromChildren(children), [deck.index]);

  // useNotes(steps.map(s => s.notesElement));
  const progress = useStepSpring(steps.length);

  return (
    <div
      style={{
        width: "100vw",
        maxWidth: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
      className="cs-layout"
    >
      <CodeSurfer steps={steps} progress={progress} theme={theme} />
    </div>
  );
}

const getStepsFromChildren = children => () => {
  const steps = React.Children.map(children || [], child =>
    readStepFromElement(child)
  ).filter(x => x);
  if (steps.length === 0) {
    throw Error("No codeblocks found inside <CodeSurfer/>");
  }
  return steps;
};

export default props => (
  <ErrorBoundary>
    <CodeSurferLayout {...props} />
  </ErrorBoundary>
);
