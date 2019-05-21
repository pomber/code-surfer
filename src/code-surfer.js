import React from "react";
import { parseSteps } from "./parse-steps";
import { useStepSpring } from "./use-step-spring";
import { runAnimation, scrollAnimation } from "./animation";
import useWindowResize from "./use-window-resize";
import { CodeSurferMeasurer } from "./code-surfer-measurer";
import CodeSurferFrame from "./code-surfer-frame";

function CodeSurferContainer(props) {
  const [dimensions, setDimensions] = React.useState(null);
  const [info, setInfo] = React.useState(null);

  const steps = React.useMemo(() => parseSteps(props.steps, props.lang), [
    props.steps,
    props.lang
  ]);

  function createInfo(dimensions) {
    const info = {
      lang: props.lang,
      dimensions: {
        containerHeight: dimensions.containerHeight,
        containerWidth: dimensions.containerWidth,
        lineHeight: dimensions.lineHeight,
        contentWidth: dimensions.maxLineWidth
      },
      steps: steps.map((step, i) => ({
        ...step,
        dimensions: {
          paddingTop: dimensions.steps[i].paddingTop,
          paddingBottom: dimensions.steps[i].paddingBottom
        }
      }))
    };
    setInfo(info);
    setDimensions(dimensions);
  }

  useWindowResize(() => setInfo(null), [setDimensions]);

  if (!info) {
    return <CodeSurferMeasurer steps={steps} setDimensions={createInfo} />;
  }
  return <CodeSurfer steps={steps} dimensions={dimensions} info={info} />;
}

function CodeSurfer({ steps, info }) {
  const { currentStepIndex, stepPlayhead } = useStepSpring(steps.length);
  const step = steps[currentStepIndex];
  const { dimensions } = info;

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
    />
  );
}

export default CodeSurferContainer;
