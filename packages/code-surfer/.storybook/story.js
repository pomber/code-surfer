import React from "react";
import { storiesOf } from "@storybook/react";
import CodeSurfer from "../src/code-surfer";

const code = `
<div>
  <span>Hi</span>
</div>
`;

storiesOf("CodeSurfer", module).add("test hi", () => (
  <div>
    <CodeSurfer code={code} step={{ range: [1, 1] }} />
    <CodeSurfer code={code} step={{ range: [2, 3] }} />
  </div>
));
