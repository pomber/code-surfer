import React from "react";
import { Step } from "code-surfer-types";
import useWindowResize from "./use-window-resize";

function useDimensions<T extends HTMLElement | null>(
  ref: React.MutableRefObject<T>,
  steps: Step[]
) {
  const [result, setResult] = React.useState<any | null>(null);

  useWindowResize(() => setResult(null), [setResult]);

  React.useLayoutEffect(() => {
    if (!ref.current) return;
    if (result) return;

    const containers = ref.current.querySelectorAll(
      ".cs-container"
    ) as NodeListOf<HTMLElement>;

    const stepsDimensions = Array.from(containers).map((container, i) =>
      getStepDimensions(container, steps[i])
    );

    const containerHeight = Math.max(
      ...stepsDimensions.map(d => d.containerHeight)
    );

    const containerWidth = Math.max(
      ...stepsDimensions.map(d => d.containerWidth)
    );

    const contentWidth = Math.max(...stepsDimensions.map(d => d.contentWidth));

    const lineHeight = Math.max(...stepsDimensions.map(d => d.lineHeight));

    setResult({
      dimensions: {
        lineHeight,
        contentWidth,
        containerHeight,
        containerWidth
      },
      steps: steps.map((step, i) => ({
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
    });
  }, [result]);

  return result || {};
}

function getStepDimensions(container: HTMLElement, step: Step) {
  const longestLine = getLongestLine(step);
  const longestLineKey = longestLine && longestLine.key;
  const longestLineSpan = container.querySelector(`.cs-line-${longestLineKey}`);
  const containerParent = container.parentElement as HTMLElement;
  const title = container.querySelector(".cs-title") as HTMLElement;
  const subtitle = container.querySelector(".cs-subtitle") as HTMLElement;

  const lineCount = step.lines.length;
  const heightOverflow =
    containerParent.scrollHeight - containerParent.clientHeight;
  const avaliableHeight = container.scrollHeight - heightOverflow;

  const lineHeight = longestLineSpan ? longestLineSpan.clientHeight : 0;
  const paddingTop = title ? outerHeight(title) : lineHeight;
  const paddingBottom = subtitle ? outerHeight(subtitle) : lineHeight;

  const codeHeight = lineCount * lineHeight * 2;
  // const maxContentHeight = codeHeight + paddingTop + paddingBottom;
  // const containerHeight = Math.min(maxContentHeight, avaliableHeight);
  const containerHeight = avaliableHeight;
  const containerWidth = container.clientWidth;
  const contentHeight = codeHeight + containerHeight;

  const contentWidth = longestLineSpan ? longestLineSpan.clientWidth : 0;

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

function outerHeight(element: HTMLElement) {
  var styles = window.getComputedStyle(element);
  var margin =
    parseFloat(styles["marginTop"] || "0") +
    parseFloat(styles["marginBottom"] || "0");
  return element.offsetHeight + margin;
}

function getLongestLine(step: Step) {
  return step.lines[step.longestLineIndex];
}

export default useDimensions;
