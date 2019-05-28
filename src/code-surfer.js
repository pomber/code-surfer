import React from "react";
import { parseSteps } from "./parse-steps";
import { useStepSpring } from "./use-step-spring";
import useWindowResize from "./use-window-resize";
import { CodeSurferMeasurer } from "./code-surfer-measurer";
import CodeSurferFrame from "./code-surfer-frame";

import "./default-syntaxes";

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
  const { steps } = info;
  const stepPlayhead = useStepSpring(steps.length);

  return <CodeSurferFrame stepPlayhead={stepPlayhead} info={info} />;
}

export default CodeSurferContainer;
