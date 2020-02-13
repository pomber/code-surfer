// @ts-check

import React from "react";
import { storiesOf } from "@storybook/react";
import { CodeSurfer } from "@code-surfer/standalone";
import { StoryWithSlider } from "./utils";

storiesOf("Basic", module)
  .add("Steps", () => <Story />)
  .add("Parsed Steps", () => <ParsedStepsStory />);

const steps = [
  {
    code: `var x1 = 1
debugger`,
    focus: "1",
    lang: "js"
  },
  {
    code: `var x0 = 3
var x1 = 1
var x0 = 3`,
    lang: "js"
  }
];

function Story() {
  return (
    <StoryWithSlider max={steps.length - 1}>
      {progress => <CodeSurfer progress={progress} steps={steps} />}
    </StoryWithSlider>
  );
}

function ParsedStepsStory() {
  return (
    <StoryWithSlider max={parsedSteps.steps.length - 1}>
      {progress => <CodeSurfer progress={progress} parsedSteps={parsedSteps} />}
    </StoryWithSlider>
  );
}

const parsedSteps = {
  steps: [
    {
      lines: [1, 3],
      focus: { "0": true },
      focusCenter: 0.5,
      focusCount: 1,
      longestLineIndex: 0
    },
    {
      lines: [0, 1, 2],
      focus: { "0": true, "2": true },
      focusCenter: 1.5,
      focusCount: 3,
      longestLineIndex: 0
    }
  ],
  tokens: [
    ["var", " x0 ", "=", " ", "3"],
    ["var", " x1 ", "=", " ", "1"],
    ["var", " x0 ", "=", " ", "3"],
    ["debugger"]
  ],
  types: [
    ["keyword", "plain", "operator", "plain", "number"],
    ["keyword", "plain", "operator", "plain", "number"],
    ["keyword", "plain", "operator", "plain", "number"],
    ["keyword"]
  ],
  maxLineCount: 4
};
