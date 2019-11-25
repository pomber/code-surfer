import React from "react";
import Readme from "./readme.mdx";
import { MDXProvider } from "@mdx-js/react";
import CodeBlock from "./code-block";

const components = { pre: props => <div {...props} />, code: CodeBlock };

export default function Docs() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "800px", width: "90%" }}>
        <MDXProvider components={components}>
          <Readme />
        </MDXProvider>
      </div>
    </div>
  );
}
