import React from "react";
import { readStepFromElement } from "./step-reader";
import CodeSurfer from "./standalone/code-surfer";
import { useDeck, Notes, useTheme } from "mdx-deck";
import ErrorBoundary from "./error-boundary";
import {
  useSubtitleStyle,
  useTitleStyle,
  ThemeContext
} from "./standalone/theming";
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
  const theme = useTheme();
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
        <ThemeContext.Provider
          key={i}
          value={themes[i] ? themes[i].codeSurfer : theme.codeSurfer}
        >
          <Column column={column} progress={progress} />
        </ThemeContext.Provider>
      ))}

      <ThemeContext.Provider value={theme.codeSurfer}>
        <Title text={titles[stepIndex]} />
        <Subtitle text={subtitles[stepIndex]} />
      </ThemeContext.Provider>
    </div>
  );
}

function Column({ column, progress }) {
  return (
    <div
      style={{
        flex: column.flex,
        overflow: "hidden",
        height: "100%"
      }}
    >
      {column.isCode ? (
        <CodeSurfer steps={column.steps} progress={progress} />
      ) : (
        column.steps[Math.round(progress)].element
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
    React.Children.toArray(stepElement.props.children)
      .filter(element => element.type !== Notes)
      .forEach((codeElement, columnIndex) => {
        columns[columnIndex] = columns[columnIndex] || {
          steps: [],
          isCode: true
        };
        const step = readStepFromElement(codeElement);
        columns[columnIndex].isCode = columns[columnIndex].isCode && step;
        columns[columnIndex].steps[stepIndex] = step || {
          element: codeElement
        };
      });
  });

  columns.forEach((column, columnIndex) => {
    column.flex = sizes[columnIndex] || 1;
  });

  const titles = stepElements.map(stepElement => stepElement.props.title);
  const subtitles = stepElements.map(stepElement => stepElement.props.subtitle);
  const notesElements = stepElements.map(stepElement => {
    const stepChildren = React.Children.toArray(stepElement.props.children);
    const notesElement = stepChildren.find(element => element.type === Notes);
    return notesElement;
  });

  return [columns, titles, subtitles, notesElements];
}

export default props => (
  <ErrorBoundary>
    <ColumnLayout {...props} />
  </ErrorBoundary>
);
