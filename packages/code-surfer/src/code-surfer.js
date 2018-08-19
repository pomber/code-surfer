import React from "react";
import hightlightLines from "./highlighter";
import getTokensPerLine from "./step-parser";
import * as Scroller from "./scroller";
import { css } from "glamor";

//TODO configure theme
//TODO don't import css
import "prismjs/themes/prism.css";

// function getLineNumber(index) {
//   return (
//     '<span class="token comment token-leaf line-number" style="user-select: none">' +
//     padStart(index + 1, 3) +
//     ".</span> "
//   );
// }

const getLineClassName = (tokens, lineNumber) => {
  if (Object.keys(tokens).length === 0) {
    return css({
      [`& .token-leaf`]: {
        opacity: "1 !important"
      }
    });
  } else if (!(lineNumber in tokens)) {
    return "";
  } else if (tokens[lineNumber] == null) {
    return css({
      [`& .token-leaf`]: {
        opacity: "1 !important"
      }
    });
  } else {
    return css(
      {
        [`& .token-leaf.line-number`]: {
          opacity: "1 !important"
        }
      },
      ...tokens[lineNumber].map(n => ({
        [`& .token-leaf.token-${n}`]: {
          opacity: "1 !important"
        }
      }))
    );
  }
};

const LineOfCode = ({ number, tokensPerLine, html }) => {
  const isSelected = number in tokensPerLine;
  const className = getLineClassName(tokensPerLine, number);
  return (
    <Scroller.Element
      dangerouslySetInnerHTML={{ __html: html }}
      // style={{ opacity: isSelected ? 1 : 0.3 }}
      className={className}
      selected={isSelected}
    />
  );
};

const CodeSurfer = ({ code, step }) => {
  const tokensPerLine = getTokensPerLine(step);
  const tokenOpacity = css({
    ["& .token-leaf"]: {
      opacity: "0.35",
      transition: "opacity 300ms"
    }
  });
  return (
    <Scroller.Container type="pre" height={100}>
      <Scroller.Content type="code" className={tokenOpacity}>
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
};

export default CodeSurfer;
