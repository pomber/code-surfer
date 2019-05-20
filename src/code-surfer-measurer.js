import React from "react";
import CodeSurferFrame from "./code-surfer-frame";

function CodeSurferMeasurer({ steps, setDimensions }) {
  const frames = steps.map((step, i) => {
    return {
      title: step.title,
      subtitle: step.subtitle,
      lines: step.lines
        .filter(line => line.middle)
        .map(line => ({
          ...line,
          style: {}
        }))
    };
  });

  const ref = React.useRef();

  React.useLayoutEffect(() => {
    const containers = ref.current.querySelectorAll(".cs-container");
    const stepsDimensions = [...containers].map((container, i) =>
      getStepDimensions(container, steps[i])
    );

    const dimensions = {
      lineHeight: stepsDimensions[0].lineHeight,
      maxLineWidth: Math.max(...stepsDimensions.map(d => d.contentWidth)),
      containerHeight: Math.max(...stepsDimensions.map(d => d.containerHeight)),
      containerWidth: Math.max(...stepsDimensions.map(d => d.containerWidth)),
      steps: stepsDimensions.map(d => ({
        paddingTop: d.paddingTop,
        paddingBottom: d.paddingBottom
      }))
    };
    console.log("dimensions", dimensions);
    setDimensions(dimensions);
  });

  return (
    <div ref={ref} style={{ overflow: "auto", height: "100%", width: "100%" }}>
      {frames.map((frame, i) => (
        <div
          key={i}
          style={{
            overflow: "auto",
            height: "100%",
            width: "100%"
          }}
        >
          <CodeSurferFrame frame={frame} />
        </div>
      ))}
    </div>
  );
}

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
  return lines.indexOf(longestLine);
}

function getZoom(step, lineHeight, containerHeight, stepDimensions) {
  if (!step) return null;
  const { paddingBottom, paddingTop } = stepDimensions;
  const contentHeight = step.focusCount * lineHeight;
  const availableHeight =
    containerHeight - Math.max(paddingBottom, paddingTop) * 2;
  const zoom = availableHeight / contentHeight;
  console.log(containerHeight, stepDimensions);
  console.log(
    `contentheight: ${contentHeight}, available: ${availableHeight} = ${zoom}`
  );
  return Math.min(zoom, 1);
  // return 1;
}

export { CodeSurferMeasurer, getZoom };
