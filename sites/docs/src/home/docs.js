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
      <div
        style={{
          maxWidth: "800px",
          width: "90%",
          paddingTop: "1px",
          position: "relative"
        }}
      >
        <iframe
          src="https://ghbtns.com/github-btn.html?user=pomber&repo=code-surfer&type=star&count=true&size=large"
          frameborder="0"
          scrolling="0"
          width="160px"
          height="30px"
          style={{ right: 0, position: "absolute", top: -40, zIndex: 2 }}
        ></iframe>
        <MDXProvider components={components}>
          <Readme />
        </MDXProvider>
      </div>
    </div>
  );
}
