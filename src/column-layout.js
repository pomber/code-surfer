import React from "react";
import { readStepFromElement } from "./step-reader";
import CodeSurfer from "./code-surfer";
import { useSteps, useDeck } from "mdx-deck";
import { useSubtitleStyle, useTitleStyle } from "./theming";

function ColumnLayout({ children, themes, sizes }) {
  const deck = useDeck();
  const [columns, titles, subtitles] = React.useMemo(
    () => getColumnsFromChildren(children, sizes, themes),
    [deck.index]
  );
  const stepIndex = useSteps(columns[0].length);
  return (
    <React.Fragment>
      <div
        style={{
          width: "100vw",
          maxWidth: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.8em"
        }}
      >
        {columns.map((column, i) => (
          <Column column={column} key={i} stepIndex={stepIndex} />
        ))}
      </div>
      {titles[stepIndex] && (
        <div style={useTitleStyle()}>{titles[stepIndex]}</div>
      )}
      {subtitles[stepIndex] && (
        <div style={useSubtitleStyle()}>{subtitles[stepIndex]}</div>
      )}
    </React.Fragment>
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

export default ColumnLayout;
