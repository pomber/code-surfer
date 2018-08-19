import React from "react";
import hightlightLines from "./highlighter";

//TODO configure theme
//TODO don't import css
import "prismjs/themes/prism.css";

class CodeSurfer extends React.Component {
  render() {
    return (
      <pre>
        <code>
          {hightlightLines(this.props.code).map(line => (
            <div
              dangerouslySetInnerHTML={{
                __html: line
              }}
            />
          ))}
        </code>
      </pre>
    );
  }
}

export default CodeSurfer;
