import React from "react";
import hightlightLines from "./highlighter";
import getTokensPerLine from "./step";

//TODO configure theme
//TODO don't import css
import "prismjs/themes/prism.css";

class CodeSurfer extends React.Component {
  render() {
    const { code, step } = this.props;

    const tokensPerLine = getTokensPerLine(step);

    return (
      <pre>
        <code>
          {hightlightLines(code).map((line, index) => (
            <div
              key={index}
              dangerouslySetInnerHTML={{
                __html: line
              }}
              style={{ opacity: index + 1 in tokensPerLine ? 1 : 0.3 }}
            />
          ))}
        </code>
      </pre>
    );
  }
}

export default CodeSurfer;
