// @ts-check

import React from "react";
import { storiesOf } from "@storybook/react";
import { CodeSurfer } from "@code-surfer/standalone";
import { StoryWithSlider } from "./utils";

storiesOf("Perf", module).add("50 Steps", () => <Story />);

const steps = [
  {
    code: require("!!raw-loader!./files/00.jsx").default,
    lang: "jsx"
  },
  { code: require("!!raw-loader!./files/01.jsx").default },
  { code: require("!!raw-loader!./files/02.jsx").default },
  { code: require("!!raw-loader!./files/03.jsx").default },
  { code: require("!!raw-loader!./files/04.jsx").default },
  { code: require("!!raw-loader!./files/05.jsx").default },
  { code: require("!!raw-loader!./files/06.jsx").default },
  { code: require("!!raw-loader!./files/07.jsx").default },
  { code: require("!!raw-loader!./files/08.jsx").default },
  { code: require("!!raw-loader!./files/09.jsx").default },
  { code: require("!!raw-loader!./files/10.jsx").default },
  { code: require("!!raw-loader!./files/11.jsx").default },
  { code: require("!!raw-loader!./files/12.jsx").default },
  { code: require("!!raw-loader!./files/13.jsx").default },
  { code: require("!!raw-loader!./files/14.jsx").default },
  { code: require("!!raw-loader!./files/15.jsx").default },
  { code: require("!!raw-loader!./files/16.jsx").default },
  { code: require("!!raw-loader!./files/17.jsx").default },
  { code: require("!!raw-loader!./files/18.jsx").default },
  { code: require("!!raw-loader!./files/19.jsx").default },
  { code: require("!!raw-loader!./files/20.jsx").default },
  { code: require("!!raw-loader!./files/21.jsx").default },
  { code: require("!!raw-loader!./files/22.jsx").default },
  { code: require("!!raw-loader!./files/23.jsx").default },
  { code: require("!!raw-loader!./files/24.jsx").default },
  { code: require("!!raw-loader!./files/25.jsx").default },
  { code: require("!!raw-loader!./files/26.jsx").default },
  { code: require("!!raw-loader!./files/27.jsx").default },
  { code: require("!!raw-loader!./files/28.jsx").default },
  { code: require("!!raw-loader!./files/29.jsx").default },
  { code: require("!!raw-loader!./files/30.jsx").default },
  { code: require("!!raw-loader!./files/31.jsx").default },
  { code: require("!!raw-loader!./files/32.jsx").default },
  { code: require("!!raw-loader!./files/33.jsx").default },
  { code: require("!!raw-loader!./files/34.jsx").default },
  { code: require("!!raw-loader!./files/35.jsx").default },
  { code: require("!!raw-loader!./files/36.jsx").default },
  { code: require("!!raw-loader!./files/37.jsx").default },
  { code: require("!!raw-loader!./files/38.jsx").default },
  { code: require("!!raw-loader!./files/39.jsx").default },
  { code: require("!!raw-loader!./files/40.jsx").default },
  { code: require("!!raw-loader!./files/41.jsx").default },
  { code: require("!!raw-loader!./files/42.jsx").default },
  { code: require("!!raw-loader!./files/43.jsx").default },
  { code: require("!!raw-loader!./files/44.jsx").default },
  { code: require("!!raw-loader!./files/45.jsx").default },
  { code: require("!!raw-loader!./files/46.jsx").default },
  { code: require("!!raw-loader!./files/47.jsx").default },
  { code: require("!!raw-loader!./files/48.jsx").default },
  { code: require("!!raw-loader!./files/49.jsx").default },
  { code: require("!!raw-loader!./files/50.jsx").default }
];

function Story() {
  const [shouldLoad, setLoad] = React.useState(false);

  if (!shouldLoad) {
    return <button onClick={() => setLoad(true)}>Load</button>;
  }

  return (
    <StoryWithSlider max={steps.length - 1}>
      {progress => <CodeSurfer progress={progress} steps={steps} />}
    </StoryWithSlider>
  );
}
