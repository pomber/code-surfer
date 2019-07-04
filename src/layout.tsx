import React from "react";
import { useDeck, Notes, useTheme } from "mdx-deck";
import CodeSurfer from "./standalone/code-surfer";
import { ThemeContext } from "./standalone/theming";
import { readStepFromElement } from "./step-reader";
import ErrorBoundary from "./error-boundary";
import { useNotes } from "./notes";
import { useStepSpring } from "./use-step-spring";

function CodeSurferLayout({ children }) {
  const deck = useDeck();
  const steps = React.useMemo(getStepsFromChildren(children), [deck.index]);

  useNotes(steps.map(s => s.notesElement));
  const progress = useStepSpring(steps.length);
  const theme = useTheme();

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
      <ThemeContext.Provider value={theme.codeSurfer}>
        <CodeSurfer steps={steps} progress={progress} />
      </ThemeContext.Provider>
    </div>
  );
}

const getStepsFromChildren = children => () => {
  const kids = React.Children.toArray(children);
  return kids
    .map((child, i) => {
      const step = readStepFromElement(child);
      if (!step) return;
      const nextChild = kids[i + 1];
      if (nextChild && nextChild.type === Notes) {
        step.notesElement = nextChild;
      }
      return step;
    })
    .filter(x => x);
};

export default props => (
  <ErrorBoundary>
    <CodeSurferLayout {...props} />
  </ErrorBoundary>
);