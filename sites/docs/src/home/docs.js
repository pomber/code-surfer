import React from "react";
import Readme from "./readme.mdx";
import { MDXProvider } from "@mdx-js/react";
import CodeBlock from "./code-block";

const components = {
  pre: props => <div {...props} />,
  code: CodeBlock,
  blockquote: props => (
    <blockquote
      {...props}
      style={{
        borderLeft: "3px solid #999",
        marginLeft: "20px",
        paddingLeft: "10px"
      }}
    />
  ),
  h1: props => <H as="h1" {...props} />,
  h2: props => <H as="h2" {...props} />,
  h3: props => <H as="h3" {...props} />
};

function H(props) {
  const text = props.children;
  const id =
    text &&
    text
      .split(" ")
      .join("-")
      .toLowerCase();
  return React.createElement(props.as, { ...props, id });
}

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
