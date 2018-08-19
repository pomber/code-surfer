import React from "react";
import hightlightLines from "./highlighter";
import getTokensPerLine from "./step-parser";
import * as Scroller from "./scroller";

//TODO configure theme
//TODO don't import css
import "prismjs/themes/prism.css";

const LineOfCode = ({ number, tokensPerLine, html }) => {
  const isSelected = number in tokensPerLine;
  return (
    <Scroller.Element
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ opacity: isSelected ? 1 : 0.3 }}
      selected={isSelected}
    />
  );
};

class CodeSurfer extends React.Component {
  render() {
    const { code, step } = this.props;

    const tokensPerLine = getTokensPerLine(step);

    return (
      <Scroller.Container type="pre" height={100}>
        <Scroller.Content type="code">
          {hightlightLines(code).map((line, index) => (
            <LineOfCode
              key={index}
              html={line}
              number={index + 1}
              tokensPerLine={tokensPerLine}
            />
          ))}
        </Scroller.Content>
      </Scroller.Container>
    );
  }
}

export default CodeSurfer;
