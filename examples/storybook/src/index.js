// @ts-check

import React from "react";
import { storiesOf } from "@storybook/react";
import { CodeSurfer, themes } from "./code-surfer";

const steps = [
  {
    code: `function foo() {
  const x = 2;
  return 1;
}`,
    focus: "1[2:3]",
    lang: "js"
  },
  {
    code: `function foo() {
  return 2;
}`,
    lang: "js"
  },
  {
    code: `function foo() {
  return 2;
}`,
    focus: "1[4:6]",
    lang: "js"
  }
];

storiesOf("Button", module).add("code surfer", () => <Story />);

function Story() {
  const [progress, setProgress] = React.useState(0);
  return (
    <div>
      <Slider
        value={progress}
        setValue={value => setProgress(value)}
        max={steps.length - 1}
      />
      <div
        style={{
          height: 180,
          width: 320,
          border: "1px solid black",
          margin: "5px 0"
        }}
      >
        <CodeSurfer progress={progress} steps={steps} />
      </div>
      <div
        style={{
          height: 180,
          width: 320,
          border: "1px solid black",
          margin: "5px 0"
        }}
      >
        <CodeSurfer progress={progress} steps={steps} theme={themes.nightOwl} />
      </div>
    </div>
  );
}

function Slider({ value, setValue, max }) {
  return (
    <div>
      <input
        type="range"
        value={value}
        onChange={e => setValue(+e.target.value)}
        max={max}
        step={0.01}
      />
      <span>{Math.round(value * 100) / 100}</span>
    </div>
  );
}
