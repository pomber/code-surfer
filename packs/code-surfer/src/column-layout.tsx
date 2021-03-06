import React from "react";
import { readStepFromElement, isCode } from "./step-reader";
import { CodeSurfer } from "@code-surfer/standalone";
import { StylesProvider, Styled } from "@code-surfer/themes";
import { useDeck, Notes } from "mdx-deck";
import ErrorBoundary from "./error-boundary";
import { useNotes } from "./notes";
import { useStepSpring } from "./use-step-spring";

function ColumnLayout({ children, themes = [], sizes }) {
  const deck = useDeck();
  const [columns, titles, subtitles, notesElements] = React.useMemo(
    () => getColumnsFromChildren(children, sizes),
    [deck.index]
  );

  useNotes(notesElements);
  const progress = useStepSpring(columns[0].steps.length);
  const stepIndex = Math.round(progress);

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
      className="cs-col-layout"
    >
      {columns.map((column, i) => (
        <Column key={i} column={column} progress={progress} theme={themes[i]} />
      ))}

      <StylesProvider>
        <Title text={titles[stepIndex]} />
        <Subtitle text={subtitles[stepIndex]} />
      </StylesProvider>
    </div>
  );
}

function Column({ column, progress, theme }) {
  return (
    <div
      style={{
        flex: column.flex,
        overflow: "hidden",
        height: "100%"
      }}
    >
      {column.isCode ? (
        <CodeSurfer steps={column.steps} progress={progress} theme={theme} />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%"
          }}
        >
          {column.steps[Math.round(progress)].element}
        </div>
      )}
    </div>
  );
}
function Title({ text }) {
  if (!text) return null;
  return (
    <Styled.Title className="cs-title">
      <span>{text}</span>
    </Styled.Title>
  );
}
function Subtitle({ text }) {
  if (!text) return null;
  return (
    <Styled.Subtitle className="cs-subtitle" style={{ margin: "0.3em 0" }}>
      <span>{text}</span>
    </Styled.Subtitle>
  );
}

function getColumnsFromChildren(children, sizes = []) {
  const columns = [];
  const stepElements = React.Children.toArray(children);

  if (stepElements.length === 0) {
    throw Error("No <Step/> found inside <CodeSurferColumns/>.");
  }
  stepElements.forEach((stepElement, stepIndex) => {
    React.Children.toArray(stepElement.props.children).forEach(
      (cellElement, columnIndex) => {
        if (!cellElement || !cellElement.props) {
          throw Error(
            "Invalid element inside <Step/>. Make sure to add empty lines (no spaces) before and after each element."
          );
        }

        columns[columnIndex] = columns[columnIndex] || {
          steps: [],
          isCode: true
        };

        const step = isCode(cellElement)
          ? readStepFromElement(cellElement)
          : { element: cellElement };

        columns[columnIndex].steps[stepIndex] = step;
        columns[columnIndex].isCode =
          columns[columnIndex].isCode && isCode(cellElement);
      }
    );
  });

  if (columns.length === 0) {
    throw Error("<Step/> shouldn't be empty.");
  }

  columns.forEach((column, columnIndex) => {
    column.flex = sizes[columnIndex] || 1;
  });

  const titles = stepElements.map(stepElement => stepElement.props.title);
  const subtitles = stepElements.map(stepElement => stepElement.props.subtitle);
  const notesElements = stepElements.map(stepElement => {
    const stepChildren = React.Children.toArray(stepElement.props.children);
    const notesElement = stepChildren.find(
      element => element.props && element.props.originalType === Notes
    );
    return notesElement;
  });

  return [columns, titles, subtitles, notesElements];
}

export default props => (
  <ErrorBoundary>
    <ColumnLayout {...props} />
  </ErrorBoundary>
);
