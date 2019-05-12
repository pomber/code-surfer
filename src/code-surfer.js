import React from "react";
import theme from "./themes/night-owl";
import { parseSteps } from "./parse-steps";
import { useStepSpring } from "./use-step-spring";
import { runAnimation, scrollAnimation } from "./animation";
import useWindowResize from "./use-window-resize";

const themeStylesByType = Object.create(null);
theme.styles.forEach(({ types, style }) => {
  types.forEach(type => {
    themeStylesByType[type] = Object.assign(
      themeStylesByType[type] || {},
      style
    );
  });
});

function CodeSurfer({ steps, dimensions }) {
  const { currentStepIndex, stepPlayhead } = useStepSpring(steps.length);
  const step = steps[currentStepIndex];

  const styles = runAnimation({
    lineHeight: dimensions.lineHeight,
    t: stepPlayhead,
    lines: step.lines
  });

  const prevStep = steps[currentStepIndex - 1];
  const currStep = steps[currentStepIndex];
  const nextStep = steps[currentStepIndex + 1];
  const currentFocus = steps[currentStepIndex].focusCenter || 0;
  const prevFocus = prevStep ? prevStep.focusCenter || 0 : 0;
  const nextFocus = nextStep ? nextStep.focusCenter || 0 : 0;
  const { focusY, scale } = scrollAnimation({
    lineHeight: dimensions.lineHeight,
    containerHeight: dimensions.containerHeight,
    currentFocus,
    prevFocus,
    nextFocus,
    prevStep,
    currStep,
    nextStep,
    t: stepPlayhead
  });

  const frame = styles.map((style, i) => {
    return {
      ...step.lines[i],
      style
    };
  });

  return (
    <CodeSurferFrame
      frame={frame}
      dimensions={dimensions}
      scrollTop={focusY}
      scale={scale}
    />
  );
}

function CodeSurferFrame({ frame, dimensions, scrollTop, scale }) {
  const ref = React.useRef();

  React.useLayoutEffect(() => {
    // no idea where I'm losing these 7px
    ref.current.scrollTop = scrollTop * scale + 7;
  }, [scrollTop, scale]);

  return (
    <pre
      ref={ref}
      style={{
        margin: 0,
        // border: "1px solid red",
        color: "inherit",
        height: "100%",
        overflowY: "hidden",
        overflowX: "hidden",
        padding: `0 ${(dimensions.containerWidth - dimensions.maxLineWidth) /
          2}px`
      }}
    >
      <div style={{ height: "50%" }} />
      {frame.map(line => (
        <Line {...line} />
      ))}
      <div style={{ height: "50%" }} />
    </pre>
  );
}

function Line({ style, tokens }) {
  return (
    <div style={{ overflow: "hidden", ...style }}>
      {tokens.map((token, i) => (
        <span key={i} style={themeStylesByType[token.type] || {}}>
          {token.content}
        </span>
      ))}
    </div>
  );
}

function CodeSurferMeasurer({ steps, setDimensions }) {
  const container = React.useRef();
  React.useLayoutEffect(() => {
    const $container = container.current;
    const currentScale =
      $container.getBoundingClientRect().height / $container.clientHeight;

    const containerHeight = $container.clientHeight;
    const containerWidth = $container.clientWidth;

    const lineHeight = $container.querySelector(".cs-line").clientHeight;
    const maxLineWidth =
      $container.querySelector(".cs-line-tokens").getBoundingClientRect()
        .width / currentScale;
    setDimensions({
      lineHeight,
      maxLineWidth,
      currentScale,
      containerHeight,
      containerWidth
    });
  });

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

  return (
    <div ref={container} style={{ width: "100%", ...theme.plain }}>
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

function CodeSurferContainer(props) {
  const [dimensions, setDimensions] = React.useState(null);

  const steps = React.useMemo(() => parseSteps(props.steps, props.lang), [
    props.steps,
    props.lang
  ]);

  useWindowResize(() => setDimensions(null), [setDimensions]);

  if (!dimensions) {
    return <CodeSurferMeasurer steps={steps} setDimensions={setDimensions} />;
  }
  console.log(dimensions);
  return (
    <div
      style={{
        width: "100%",
        height: dimensions.containerHeight * 2,
        maxHeight: "100%",
        ...theme.plain
      }}
    >
      <CodeSurfer steps={steps} dimensions={dimensions} />
    </div>
  );
}

export default CodeSurferContainer;
