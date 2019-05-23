import React from "react";
import { parseSteps } from "./parse-steps";
import { useStepSpring } from "./use-step-spring";
import useWindowResize from "./use-window-resize";
import { CodeSurferMeasurer } from "./code-surfer-measurer";
import CodeSurferFrame from "./code-surfer-frame";

// TODO lazy
import "prismjs/components/prism-jsx";

function CodeSurferContainer(props) {
  const ref = React.useRef();

  const steps = React.useMemo(() => parseSteps(props.steps, props.lang), [
    props.steps,
    props.lang
  ]);

  const [info, setInfo] = React.useState({
    measured: false,
    lang: props.lang,
    steps,
    dimensions: null
  });

  React.useLayoutEffect(() => {
    if (info.measured) return;
    setInfo(info => ({ ...ref.current.measure(info), measured: true }));
  }, [info.measured]);

  useWindowResize(() => setInfo(info => ({ ...info, measured: false })), [
    setInfo
  ]);

  if (!info.measured) {
    return <CodeSurferMeasurer info={info} ref={ref} />;
  }
  return <CodeSurfer info={info} />;
}

function CodeSurfer({ info }) {
  const { steps, dimensions } = info;
  const { currentStepIndex, stepPlayhead } = useStepSpring(steps.length);

  return (
    <CodeSurferFrame
      dimensions={dimensions}
      t={stepPlayhead}
      info={info}
      stepIndex={currentStepIndex}
    />
  );
}

export default CodeSurferContainer;
