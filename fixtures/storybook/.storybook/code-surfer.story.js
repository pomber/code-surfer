import React from "react";
import { storiesOf } from "@storybook/react";
import CodeSurfer from "code-surfer";

const code = require("!raw-loader!./snippets/jsx.jsxx");

storiesOf("CodeSurfer", module)
  .add("range", () => (
    <div style={{ height: "100vh" }}>
      <CodeSurfer code={code} step={{ range: [5, 7] }} showNumbers />
    </div>
  ))
  .add("lines", () => (
    <div style={{ height: "50vh" }}>
      <CodeSurfer code={code} step={{ lines: [1, 8] }} showNumbers />
    </div>
  ))
  .add("zoom", () => (
    <div>
      <div style={{ height: "10vh" }}>
        <CodeSurfer code={code} step={{ lines: [1, 8] }} showNumbers />
      </div>
      <div style={{ height: "10vh" }}>
        <CodeSurfer code={code} step={{ lines: [1] }} showNumbers />
      </div>
    </div>
  ))
  .add("python", () => (
    <div style={{ height: "100vh" }}>
      <CodeSurfer
        code={require("raw-loader!./snippets/python.py")}
        step={{ range: [1, 19] }}
        lang="python"
      />
    </div>
  ));
