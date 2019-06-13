import React from "react";
import { readStepFromElement } from "./step-reader";
import CodeSurfer from "./code-surfer";

function ColumnLayout({ children, themes, sizes }) {
  const columns = getColumnsFromChildren(children, sizes, themes);
  console.log(columns);
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
        fontSize: "0.8em"
      }}
    >
      {columns.map(column => (
        <div style={{ flex: column.flex }}>
          <CodeSurfer steps={column.steps} />
        </div>
      ))}
    </div>
  );
}

function getColumnsFromChildren(children, sizes = []) {
  const columns = [];
  React.Children.toArray(children).forEach((stepElement, stepIndex) => {
    React.Children.toArray(stepElement.props.children).forEach(
      (codeElement, columnIndex) => {
        columns[columnIndex] = columns[columnIndex] || { steps: [] };
        columns[columnIndex].steps[stepIndex] = readStepFromElement(
          codeElement
        );
      }
    );
  });

  columns.forEach((column, columnIndex) => {
    column.flex = sizes[columnIndex] || 1;
  });
  return columns;
}

export default ColumnLayout;
