import React from "react";
import CodeSurferFrame from "./code-surfer-frame";

const CodeSurferMeasurer = React.forwardRef(({ info }, ref) => {
  const cref = React.useRef();

  React.useImperativeHandle(ref, () => ({
    measure: data => {
      const containers = cref.current.querySelectorAll(".cs-container");
      const stepsDimensions = [...containers].map((container, i) =>
        getStepDimensions(container, data.steps[i])
      );

      const containerHeight = Math.max(
        ...stepsDimensions.map(d => d.containerHeight)
      );

      return {
        ...data,
        dimensions: {
          lineHeight: stepsDimensions[0].lineHeight,
          contentWidth: Math.max(...stepsDimensions.map(d => d.contentWidth)),
          containerHeight,
          containerWidth: Math.max(
            ...stepsDimensions.map(d => d.containerWidth)
          )
        },
        steps: data.steps.map((step, i) => ({
          ...step,
          dimensions: {
            paddingTop: stepsDimensions[i].paddingTop,
            paddingBottom: stepsDimensions[i].paddingBottom,
            lineHeight: stepsDimensions[i].lineHeight,
            containerHeight
          }
        }))
      };
    }
  }));

  return (
    <div ref={cref} style={{ overflow: "auto", height: "100%", width: "100%" }}>
      {info.steps.map((step, i) => (
        <div
          key={i}
          style={{
            overflow: "auto",
            height: "100%",
            width: "100%"
          }}
        >
          <CodeSurferFrame info={info} stepIndex={i} t={0.5} />
        </div>
      ))}
    </div>
  );
});

function getStepDimensions(container, step) {
  const longestLineIndex = getLongestLineIndex(step);
  const lines = container.querySelectorAll(".cs-line");
  const firstLine = lines[0];
  const longestLine = lines[longestLineIndex];
  const containerParent = container.parentElement;
  const title = container.querySelector(".cs-title");
  const subtitle = container.querySelector(".cs-subtitle");

  const lineCount = step.lines.filter(line => line.middle).length;
  const heightOverflow =
    containerParent.scrollHeight - containerParent.clientHeight;
  const avaliableHeight = container.scrollHeight - heightOverflow;

  const lineHeight = firstLine.clientHeight;
  const paddingTop = title ? outerHeight(title) : lineHeight;
  const paddingBottom = subtitle ? outerHeight(subtitle) : lineHeight;

  const codeHeight = lineCount * lineHeight * 2;
  const maxContentHeight = codeHeight + paddingTop + paddingBottom;
  const containerHeight = Math.min(maxContentHeight, avaliableHeight);
  const containerWidth = container.clientWidth;
  const contentHeight = codeHeight + containerHeight;

  const contentWidth = longestLine.clientWidth;
  return {
    lineHeight,
    contentHeight,
    contentWidth,
    paddingTop,
    paddingBottom,
    containerHeight,
    containerWidth
  };
}

function outerHeight(element) {
  var styles = window.getComputedStyle(element);
  var margin =
    parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);
  return element.offsetHeight + margin;
}

function getLongestLineIndex(step) {
  const lines = step.lines.filter(line => line.middle);
  const longestLine = lines.reduce((a, b) =>
    a.content.length > b.content.length ? a : b
  );
  return step.lines.indexOf(longestLine);
}

export { CodeSurferMeasurer };
