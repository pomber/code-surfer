import React from "react";
import theme from "./themes/night-owl";
import { parseSteps } from "./parse-steps";
import { useStepSpring } from "./use-step-spring";
import { runAnimation, scrollAnimation } from "./animation";

const themeStylesByType = Object.create(null);
theme.styles.forEach(({ types, style }) => {
  types.forEach(type => {
    themeStylesByType[type] = Object.assign(
      themeStylesByType[type] || {},
      style
    );
  });
});

function CodeSurfer({ steps }) {
  const { currentStepIndex, stepPlayhead } = useStepSpring(steps.length);
  const step = steps[currentStepIndex];

  const styles = runAnimation({
    lineHeight: 18,
    t: stepPlayhead,
    lines: step.lines
  });

  const frame = styles.map((style, i) => {
    return {
      ...step.lines[i],
      style
    };
  });

  return (
    <pre style={{ margin: 0, color: "inherit", height: "100%" }}>
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

function CodeSurferContainer(props) {
  const container = React.useRef();

  const steps = React.useMemo(() => parseSteps(props.steps, props.lang), [
    props.steps,
    props.lang
  ]);

  React.useLayoutEffect(() => {
    const currentScale =
      container.current.getBoundingClientRect().height /
      container.current.clientHeight;

    const containerRect = {
      height: container.current.clientHeight,
      width: container.current.clientWidth
    };

    console.log(currentScale, containerRect);
  });

  return (
    <div
      ref={container}
      style={{ height: "100%", width: "100%", ...theme.plain }}
    >
      <CodeSurfer steps={steps} />
    </div>
  );
}

export default CodeSurferContainer;
