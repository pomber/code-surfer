// @ts-check

import React from "react";
import { storiesOf } from "@storybook/react";
import { CodeSurfer } from "@code-surfer/standalone";
import { StoryWithSlider } from "./utils";

storiesOf("Focus", module)
  .add("Lines", () => <Story />)
  .add("Scroll Lines", () => <ScrollStory />)
  .add("Scale Lines", () => <LongStory />)
  .add("Columns", () => <ColumnsStory />)
  .add("Moving Lines", () => <MovingStory />);

function Story() {
  const code = `
console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)
console.log(6)
console.log(7)
console.log(8)
console.log(9)
  `.trim();
  const steps = [
    {
      code,
      lang: "js"
    },
    {
      code,
      focus: "1,9"
    },
    {
      code,
      focus: "1,3:7,9"
    }
  ];
  return (
    <StoryWithSlider max={steps.length - 1}>
      {progress => <CodeSurfer progress={progress} steps={steps} />}
    </StoryWithSlider>
  );
}

function ScrollStory() {
  const code = `
console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)
console.log(6)
console.log(7)
console.log(8)
console.log(9)
  `.trim();
  const steps = [
    {
      code,
      lang: "js"
    },
    {
      code,
      focus: "1"
    },
    {
      code,
      focus: "9"
    }
  ];
  return (
    <StoryWithSlider max={steps.length - 1}>
      {progress => <CodeSurfer progress={progress} steps={steps} />}
    </StoryWithSlider>
  );
}

function LongStory() {
  const code = `
console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)
console.log(6)
console.log(7)
console.log(8)
console.log(9)
console.log(0)
console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)
console.log(6)
console.log(7)
console.log(8)
console.log(9)
  `.trim();
  const steps = [
    {
      code,
      lang: "js"
    },
    {
      code,
      focus: "10"
    },
    {
      code
    },
    {
      code,
      focus: "1"
    }
  ];
  return (
    <StoryWithSlider max={steps.length - 1}>
      {progress => <CodeSurfer progress={progress} steps={steps} />}
    </StoryWithSlider>
  );
}

function ColumnsStory() {
  const code = `
console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)
console.log(6)
console.log(7)
console.log(8)
console.log(9)
  `.trim();
  const steps = [
    {
      code,
      lang: "js"
    },
    {
      code,
      focus: "1,4[1:8],5[9:11],9"
    },
    {
      code,
      focus: "1,5[1:8],6[9:11],9"
    },
    {
      code
    }
  ];
  return (
    <StoryWithSlider max={steps.length - 1}>
      {progress => <CodeSurfer progress={progress} steps={steps} />}
    </StoryWithSlider>
  );
}

function MovingStory() {
  const code = `
console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)
console.log(6)
console.log(7)
console.log(8)
console.log(9)
  `.trim();
  const steps = [
    {
      code,
      focus: "1,5,6[1:8],9",
      lang: "js"
    },
    {
      code: `
console.log(1)
console.log(2)
console.log(3)
console.log(7)
console.log(8)
console.log(9)
        `.trim(),
      focus: "1,6"
    },
    {
      code,
      focus: "1,4,5[1:8],9"
    }
  ];
  return (
    <StoryWithSlider max={steps.length - 1}>
      {progress => <CodeSurfer progress={progress} steps={steps} />}
    </StoryWithSlider>
  );
}
