import React from "react";
import { useDeck, Notes } from "@mdx-deck/components";
import CodeSurfer from "./code-surfer";
import { readStepFromElement } from "./step-reader";
import ErrorBoundary from "./error-boundary";
import { useNotes } from "./notes";

function CodeSurferLayout({ children, ...props }) {
  const deck = useDeck();
  const steps = React.useMemo(getStepsFromChildren(children), [deck.index]);
  const lang = steps.length && steps[0].lang;

  useNotes(steps.map(s => s.notesElement));

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
      <CodeSurfer steps={steps} lang={lang} />
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
