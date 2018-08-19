import React from "react";
import { storiesOf } from "@storybook/react";
import CodeSurfer from "../src/code-surfer";

const code = `
<div>
  <span>Hi</span>
</div>
`;

storiesOf("CodeSurfer", module).add("test hi", () => (
  <CodeSurfer code={code} />
));
