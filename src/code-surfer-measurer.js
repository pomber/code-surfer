import React from "react";
import { useContainerStyle } from "./theming";

// numer of extra lines to show at top and buttom when zooming in
const paddingLines = 2;

function CodeSurferMeasurer({ steps, setDimensions }) {
  const container = React.useRef();

  const longestLine = steps
    .map(step =>
      step.lines.reduce((a, b) => (a.content.length > b.content.length ? a : b))
    )
    .reduce((a, b) => (a.content.length > b.content.length ? a : b));
  longestLine.style = {};
  const longestStep = steps.reduce((a, b) =>
    a.lines.filter(l => l.middle).length > b.lines.filter(l => l.middle).length
      ? a
      : b
  );
  const frame = longestStep.lines
    .filter(l => l.middle)
    .map(l => ({ ...l, style: {} }));
  frame[0] = longestLine;

  React.useLayoutEffect(() => {
    const $container = container.current;
    const currentScale =
      $container.getBoundingClientRect().height / $container.clientHeight;

    const containerWidth = $container.clientWidth;

    const lineHeight = $container.querySelector(".cs-line").clientHeight;
    const maxLineWidth =
      $container.querySelector(".cs-line-tokens").getBoundingClientRect()
        .width / currentScale;

    const $parent = $container.parentElement;
    const heightOverflow = $parent.scrollHeight - $parent.clientHeight;
    const availableHeight = $container.scrollHeight - heightOverflow;

    const contentHeight =
      lineHeight * longestStep.lines.filter(l => l.middle).length;
    const containerHeight = Math.min(
      availableHeight,
      (contentHeight + paddingLines * lineHeight) * 2
    );
    // debugger;
    setDimensions({
      lineHeight,
      maxLineWidth,
      currentScale,
      containerHeight,
      containerWidth,
      availableHeight
    });
  });

  return (
    <div
      ref={container}
      style={{ ...useContainerStyle(), width: "100%", height: "100vh" }}
    >
      <pre
        style={{
          margin: 0,
          color: "inherit",
          height: "100%",
          padding: `0`
        }}
      >
        {frame.map((line, i) => (
          <div
            key={i}
            style={{ overflow: "hidden", ...line.style }}
            className="cs-line"
          >
            <span className="cs-line-tokens">{line.content}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

function getZoom(step, lineHeight, containerHeight) {
  if (!step) return null;
  const contentHeight = (step.focusCount + paddingLines * 2) * lineHeight;
  const zoom = containerHeight / contentHeight;
  console.log("z", containerHeight, lineHeight, contentHeight);
  return Math.min(zoom, 1);
}

export { CodeSurferMeasurer, getZoom };
