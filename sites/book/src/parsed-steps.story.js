// @ts-check

import React from "react";
import { storiesOf } from "@storybook/react";
import { CodeSurfer } from "@code-surfer/standalone";
import { StoryWithSlider } from "./utils";
import parsedSteps from "./parsed-steps";

storiesOf("Perf", module).add("50 Steps Parsed", () => <Story />);

function Story() {
  const [shouldLoad, setLoad] = React.useState(false);

  if (!shouldLoad) {
    return <button onClick={() => setLoad(true)}>Load</button>;
  }

  return (
    <StoryWithSlider max={parsedSteps.steps.length - 1}>
      {progress => <CodeSurfer progress={progress} parsedSteps={parsedSteps} />}
    </StoryWithSlider>
  );
}
