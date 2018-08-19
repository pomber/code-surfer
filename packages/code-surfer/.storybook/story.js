import React from "react";
import { storiesOf } from "@storybook/react";
import CodeSurfer from "../src/code-surfer";

storiesOf("CodeSurfer", module).add("test hi", () => (
  <CodeSurfer>Foo</CodeSurfer>
));
