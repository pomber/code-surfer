import React from "react";
import CodeSurferFrame from "./code-surfer-frame";

// TODO fix lineHeight when first line is empty
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

      const containerWidth = Math.max(
        ...stepsDimensions.map(d => d.containerWidth)
      );

      const contentWidth = Math.max(
        ...stepsDimensions.map(d => d.contentWidth)
      );

      return {
        ...data,
        dimensions: {
          lineHeight: stepsDimensions[0].lineHeight,
          contentWidth,
          containerHeight,
          containerWidth
        },
        steps: data.steps.map((step, i) => ({
          ...step,
          lines: step.lines.map(l => ({
            ...l,
            dimensions: { lineHeight: stepsDimensions[i].lineHeight }
          })),
          dimensions: {
            paddingTop: stepsDimensions[i].paddingTop,
            paddingBottom: stepsDimensions[i].paddingBottom,
            lineHeight: stepsDimensions[i].lineHeight,
            contentWidth,
            containerHeight,
            containerWidth
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
          <CodeSurferFrame info={info} stepPlayhead={i} />
        </div>
      ))}
    </div>
  );
});

function getStepDimensions(container, step) {
  const longestLine = getLongestLine(step);
  const longestLineKey = longestLine && longestLine.key;
  const lines = container.querySelectorAll(".cs-line");
  const firstLine = lines[0];
  const containerParent = container.parentElement;
  const title = container.querySelector(".cs-title");
  const subtitle = container.querySelector(".cs-subtitle");

  const lineCount = step.lines.length;
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

  const contentWidth = container.querySelector(`.cs-line-${longestLineKey}`)
    .clientWidth;

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

function getLongestLine(step) {
  const longestLine = step.lines.reduce((a, b) =>
    a.content.length > b.content.length ? a : b
  );
  return longestLine;
}

export { CodeSurferMeasurer };
