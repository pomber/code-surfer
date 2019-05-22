import React from "react";
import { parseSteps } from "./parse-steps";
import { useStepSpring } from "./use-step-spring";
import { runAnimation, scrollAnimation } from "./animation";
import useWindowResize from "./use-window-resize";
import { CodeSurferMeasurer } from "./code-surfer-measurer";
import CodeSurferFrame from "./code-surfer-frame";

function CodeSurferContainer(props) {
  const ref = React.useRef();

  const steps = React.useMemo(() => parseSteps(props.steps, props.lang), [
    props.steps,
    props.lang
  ]);

  const [info, setInfo] = React.useState({
    measured: false,
    lang: props.lang,
    steps
  });

  React.useLayoutEffect(() => {
    if (info.measured) return;
    setInfo(info => ({ ...ref.current.measure(info), measured: true }));
  }, [info.measured]);

  useWindowResize(() => setInfo(info => ({ ...info, measured: false })), [
    setInfo
  ]);

  console.log("indo", info);

  if (!info.measured) {
    return <CodeSurferMeasurer steps={steps} ref={ref} />;
  }
  return <CodeSurfer info={info} />;
}

function CodeSurfer({ info }) {
  const { steps, dimensions } = info;
  const { currentStepIndex, stepPlayhead } = useStepSpring(steps.length);
  const step = steps[currentStepIndex];

  const styles = runAnimation({
    lineHeight: dimensions.lineHeight,
    t: stepPlayhead,
    lines: step.lines
  });

  const { focusY, scale, opacity } = scrollAnimation({
    currentStepIndex,
    info,
    t: stepPlayhead
  });

  const frame = {
    title: step.title,
    titleOpacity: opacity,
    subtitle: step.subtitle,
    subtitleOpacity: opacity,
    lines: styles.map((style, i) => {
      return {
        ...step.lines[i],
        style
      };
    })
  };
  console.log("frame", frame);

  const verticalOrigin = dimensions.containerHeight / 2 + focusY;
  // debugger;
  return (
    <CodeSurferFrame
      frame={frame}
      dimensions={dimensions}
      scrollTop={focusY}
      scale={scale}
      verticalOrigin={verticalOrigin}
      t={stepPlayhead}
    />
  );
}

export default CodeSurferContainer;
