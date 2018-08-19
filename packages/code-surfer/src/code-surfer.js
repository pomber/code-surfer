import React from "react";
import hightlightLines from "./highlighter";

//TODO configure theme
//TODO don't import css
import "prismjs/themes/prism.css";

class CodeSurfer extends React.Component {
  render() {
    const { code, step } = this.props;
    return (
      <pre>
        <code>
          {hightlightLines(code).map((line, index) => (
            <div
              dangerouslySetInnerHTML={{
                __html: line
              }}
              style={{ opacity: index + 1 === step.range[0] ? 1 : 0.3 }}
            />
          ))}
        </code>
      </pre>
    );
  }
}

export default CodeSurfer;
