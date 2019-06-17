import React from "react";
import { readStepFromElement } from "./step-reader";
import CodeSurfer from "./code-surfer";
import useSteps from "./use-steps";
import { useDeck } from "mdx-deck";
import ErrorBoundary from "./error-boundary";
import { useSubtitleStyle, useTitleStyle, ThemeContext } from "./theming";

function ColumnLayout({ children, themes = [], sizes }) {
  const deck = useDeck();
  const [columns, titles, subtitles] = React.useMemo(
    () => getColumnsFromChildren(children, sizes, themes),
    [deck.index]
  );
  const stepIndex = useSteps(columns[0].length);
  return (
    <div
      style={{
        width: "100vw",
        maxWidth: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "0.8em",
        position: "relative"
      }}
    >
      {columns.map((column, i) => (
        <ThemeContext.Provider
          key={i}
          value={themes[i] ? themes[i] : undefined}
        >
          <Column column={column} stepIndex={stepIndex} />
        </ThemeContext.Provider>
      ))}
      <Title text={titles[stepIndex]} />
      <Subtitle text={subtitles[stepIndex]} />
    </div>
  );
}

function Column({ column, stepIndex }) {
  return (
    <div
      style={{
        flex: column.flex,
        overflow: "hidden",
        height: "100%"
      }}
    >
      {column.isCode ? (
        <CodeSurfer steps={column.steps} lang={column.steps[0].lang} />
      ) : (
        column.steps[stepIndex].element
      )}
    </div>
  );
}
function Title({ text }) {
  if (!text) return null;
  return (
    <h4 className="cs-title" style={useTitleStyle()}>
      <span>{text}</span>
    </h4>
  );
}
function Subtitle({ text }) {
  if (!text) return null;
  return (
    <p
      className="cs-subtitle"
      style={{ ...useSubtitleStyle(), margin: "0.3em 0" }}
    >
      <span>{text}</span>
    </p>
  );
}

function getColumnsFromChildren(children, sizes = []) {
  const columns = [];
  const stepElements = React.Children.toArray(children);
  stepElements.forEach((stepElement, stepIndex) => {
    React.Children.toArray(stepElement.props.children).forEach(
      (codeElement, columnIndex) => {
        columns[columnIndex] = columns[columnIndex] || {
          steps: [],
          isCode: true
        };
        const step = readStepFromElement(codeElement);
        columns[columnIndex].isCode = columns[columnIndex].isCode && step;
        columns[columnIndex].steps[stepIndex] = step || {
          element: codeElement
        };
      }
    );
  });

  columns.forEach((column, columnIndex) => {
    column.flex = sizes[columnIndex] || 1;
  });

  const titles = stepElements.map(stepElement => stepElement.props.title);
  const subtitles = stepElements.map(stepElement => stepElement.props.subtitle);

  return [columns, titles, subtitles];
}

export default props => (
  <ErrorBoundary>
    <ColumnLayout {...props} />
  </ErrorBoundary>
);
