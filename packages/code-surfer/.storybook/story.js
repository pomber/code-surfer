import React from "react";
import { storiesOf } from "@storybook/react";
import CodeSurfer from "../src/code-surfer";

const code = `<div>
  <span>Hi</span>
</div>`;

storiesOf("CodeSurfer", module).add("test hi", () => (
  <div>
    <CodeSurfer code={code} step={{ lines: [1] }} />
    <CodeSurfer code={code} step={{ lines: [1, 3] }} />
    <CodeSurfer code={code} step={{ tokens: { 2: [2, 6] } }} />
  </div>
));
