import React from "react";
import theme from "./themes/night-owl";
import { parseSteps } from "./parse-steps";
import { useStepSpring } from "./use-step-spring";
import { runAnimation, scrollAnimation } from "./animation";
import useWindowResize from "./use-window-resize";
import { CodeSurferMeasurer } from "./code-surfer-measurer";

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
  console.log("scale", scale);

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
    ref.current.scrollTop = scrollTop * scale;
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
      <div
        style={{
          height: "100%",
          transform: `scale(${scale})`,
          transformOrigin: `center ${dimensions.containerHeight / 2}px`
        }}
      >
        <div style={{ height: "50%" }} />
        {frame.map(line => (
          <Line {...line} />
        ))}
        <div style={{ height: "50%" }} />
      </div>
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
  console.log("dims", dimensions);
  return (
    <div
      style={{
        width: "100%",
        height: dimensions.containerHeight,
        maxHeight: "100%",
        ...theme.plain
      }}
    >
      <CodeSurfer steps={steps} dimensions={dimensions} />
    </div>
  );
}

export default CodeSurferContainer;
