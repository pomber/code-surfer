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

function CodeSurfer({ steps, lineHeight = 18 }) {
  const { currentStepIndex, stepPlayhead } = useStepSpring(steps.length);
  const step = steps[currentStepIndex];

  const styles = runAnimation({
    lineHeight,
    t: stepPlayhead,
    lines: step.lines
  });

  const frame = styles.map((style, i) => {
    return {
      ...step.lines[i],
      style
    };
  });

  return <CodeSurferFrame frame={frame} />;
}

function CodeSurferFrame({ frame }) {
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
    <div style={{ overflow: "hidden", ...style }} className="cs-line">
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
  const [dimensions, setDimensions] = React.useState(null);

  const steps = React.useMemo(() => parseSteps(props.steps, props.lang), [
    props.steps,
    props.lang
  ]);

  React.useLayoutEffect(
    () => {
      const $container = container.current;
      const currentScale =
        $container.getBoundingClientRect().height / $container.clientHeight;

      const containerRect = {
        height: $container.clientHeight,
        width: $container.clientWidth
      };

      const lineHeight = $container.querySelector(".cs-line").clientHeight;
      console.log(currentScale, containerRect, lineHeight);
      setDimensions({ lineHeight });
    },
    [dimensions != null]
  );

  console.log("dim", dimensions);

  if (!dimensions) {
    return (
      <div
        ref={container}
        style={{ height: "100%", width: "100%", ...theme.plain }}
      >
        <CodeSurferFrame
          frame={[{ key: 1, style: {}, tokens: [{ content: "foo" }] }]}
        />
      </div>
    );
  }

  return (
    <div
      ref={container}
      style={{ height: "100%", width: "100%", ...theme.plain }}
    >
      <CodeSurfer steps={steps} lineHeight={dimensions.lineHeight} />
    </div>
  );
}

export default CodeSurferContainer;
