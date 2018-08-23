import React from "react";
import { storiesOf } from "@storybook/react";
import CodeSurfer from "../src/code-surfer";

const code = `<arthur
  p1="1"
  p2={2}
  p3={Math.sqrt(3) * Math.PI}
  p4={x => x * 5}
  p5={{ a: 5 }}
  p6
/>;`;

storiesOf("CodeSurfer", module)
  .add("range", () => (
    <div style={{ height: "100vh" }}>
      <CodeSurfer code={code} step={{ range: [2, 7] }} showNumbers />
    </div>
  ))
  .add("lines", () => (
    <div style={{ height: "100vh" }}>
      <CodeSurfer code={code} step={{ lines: [1, 8] }} showNumbers />
    </div>
  ));
